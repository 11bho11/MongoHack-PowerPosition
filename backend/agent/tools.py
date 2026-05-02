from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

import os
from datetime import datetime
from langchain_core.tools import tool
from db.client import (
    calendar_entries, sessions, coaching_plans,
    agent_logs, workflow_state, training_docs, config as config_col
)

SESSIONS_BEFORE_PLAN_UPDATE = int(os.getenv("SESSIONS_BEFORE_PLAN_UPDATE") or "3")


@tool
def web_search(query: str) -> str:
    """Search the web for ultimate frisbee training information and return extracted text content."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            # Search Google
            search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
            page.goto(search_url, timeout=15000)
            page.wait_for_timeout(2000)

            # Extract search result links (first 3)
            links = page.eval_on_selector_all(
                "a[href]",
                "els => els.map(e => e.href).filter(h => h.startsWith('http') && !h.includes('google')).slice(0, 3)"
            )

            all_text = []
            for link in links[:2]:  # Visit top 2 results
                try:
                    page.goto(link, timeout=10000)
                    page.wait_for_timeout(1000)
                    text = page.inner_text("body")
                    all_text.append(f"Source: {link}\n{text[:2000]}")
                except Exception:
                    continue

            browser.close()
            return "\n\n---\n\n".join(all_text) if all_text else "No results found."
    except Exception as e:
        return f"Web search failed: {str(e)}"


@tool
def document_ingest(query: str) -> str:
    """Search for ultimate frisbee training content online and ingest it into the knowledge base."""
    try:
        content = web_search.invoke({"query": query})
        if not content or "failed" in content.lower():
            return f"Could not retrieve content for: {query}"

        from ingestion.chunker import chunk_text
        from ingestion.embedder import embed_and_store

        chunks = chunk_text(content, source_url=f"web_search:{query}")
        count = embed_and_store(chunks)
        return f"Ingested {count} chunks for query: {query}"
    except Exception as e:
        return f"Ingestion failed: {str(e)}"


@tool
def rag_retrieve(query: str, k: int = 5) -> str:
    """Retrieve relevant ultimate frisbee training knowledge using vector search."""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        # Generate query embedding
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=query
        )
        query_embedding = response.data[0].embedding

        # Atlas Vector Search
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "training_docs_vector_index",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": k * 10,
                    "limit": k,
                }
            },
            {
                "$project": {
                    "content": 1,
                    "source_url": 1,
                    "score": {"$meta": "vectorSearchScore"},
                    "_id": 0,
                }
            }
        ]

        results = list(training_docs.aggregate(pipeline))

        if not results:
            return "No relevant training documents found. The vector search index may still be initializing (takes 1-2 minutes after first creation). Try again shortly or use web_search to find content."

        # Format results and collect sources
        formatted = []
        sources = []
        for r in results:
            formatted.append(f"[Source: {r.get('source_url', 'unknown')}]\n{r.get('content', '')}")
            sources.append(r.get("source_url", "unknown"))

        # Store sources for agent_log_write to pick up
        # (passed back in tool result — graph state update handled by calling node)
        result_text = "\n\n---\n\n".join(formatted)
        result_text += f"\n\n[SOURCES: {', '.join(sources)}]"
        return result_text

    except Exception as e:
        return f"RAG retrieval failed: {str(e)}. The vector search index may not be ready yet."


@tool
def session_log_write(date: str, content: str, source: str = "telegram") -> str:
    """Log a training session to MongoDB. Updates workflow state and checks if plan update is needed."""
    try:
        sessions.insert_one({
            "date": date,
            "content": content,
            "source": source,
            "created_at": datetime.utcnow(),
        })

        # Update workflow_state
        state = workflow_state.find_one()
        sessions_count = 0
        if state:
            sessions_count = state.get("sessions_since_update", 0) + 1
            workflow_state.update_one(
                {"_id": state["_id"]},
                {"$set": {
                    "last_activity": datetime.utcnow(),
                    "cycle_status": "logged",
                    "sessions_since_update": sessions_count,
                    "updated_at": datetime.utcnow(),
                }}
            )
        else:
            sessions_count = 1
            workflow_state.insert_one({
                "athlete_id": "default",
                "cycle_status": "logged",
                "last_activity": datetime.utcnow(),
                "sessions_since_update": sessions_count,
                "updated_at": datetime.utcnow(),
            })

        needs_update = sessions_count >= SESSIONS_BEFORE_PLAN_UPDATE
        return f"Session logged for {date}. Sessions since last plan update: {sessions_count}. Plan update needed: {needs_update}"
    except Exception as e:
        return f"Failed to log session: {str(e)}"


@tool
def session_log_read(limit: int = 10) -> str:
    """Read the most recent training sessions."""
    try:
        recent = list(sessions.find({}, {"_id": 0}).sort("created_at", -1).limit(limit))
        if not recent:
            return "No sessions logged yet."
        return "\n\n".join([f"[{s.get('date', 'unknown')}] {s.get('content', '')}" for s in recent])
    except Exception as e:
        return f"Failed to read sessions: {str(e)}"


@tool
def calendar_write(date: str, content: str, source: str = "telegram") -> str:
    """Write or update a calendar entry for a specific date."""
    try:
        calendar_entries.update_one(
            {"date": date},
            {"$set": {
                "date": date,
                "content": content,
                "source": source,
                "updated_at": datetime.utcnow(),
            }},
            upsert=True
        )
        return f"Calendar entry updated for {date}."
    except Exception as e:
        return f"Failed to write calendar entry: {str(e)}"


@tool
def plan_update(short_term: str, medium_term: str, long_term: str) -> str:
    """Update the athlete's coaching plan with new short, medium, and long-term goals."""
    try:
        coaching_plans.update_one(
            {},
            {"$set": {
                "short_term": short_term,
                "medium_term": medium_term,
                "long_term": long_term,
                "sessions_since_update": 0,
                "updated_at": datetime.utcnow(),
            }},
            upsert=True
        )
        # Reset session counter in workflow_state
        workflow_state.update_one(
            {},
            {"$set": {
                "sessions_since_update": 0,
                "cycle_status": "updated",
                "updated_at": datetime.utcnow(),
            }},
            upsert=True
        )
        return "Coaching plan updated successfully."
    except Exception as e:
        return f"Failed to update plan: {str(e)}"


@tool
def agent_log_write(action: str, reasoning: str, event_type: str = "action") -> str:
    """Write an entry to the agent logs. Include what the agent did and why."""
    try:
        agent_logs.insert_one({
            "timestamp": datetime.utcnow(),
            "action": action,
            "reasoning": reasoning,
            "vector_sources": [],  # populated by graph state if available
            "event_type": event_type,
        })
        return f"Agent log written: {action}"
    except Exception as e:
        return f"Failed to write agent log: {str(e)}"


@tool
def cycle_status_update(status: str) -> str:
    """Update the current coaching cycle status. Valid values: awaiting, logged, analyzing, updated."""
    valid = {"awaiting", "logged", "analyzing", "updated"}
    if status not in valid:
        return f"Invalid status '{status}'. Must be one of: {', '.join(valid)}"
    try:
        workflow_state.update_one(
            {},
            {"$set": {"cycle_status": status, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        return f"Cycle status updated to: {status}"
    except Exception as e:
        return f"Failed to update cycle status: {str(e)}"


@tool
def telegram_send(chat_id: str, message: str) -> str:
    """Send a Telegram message to the athlete."""
    try:
        # Import bot instance from runner — may not be initialized yet
        from bot.runner import get_bot
        import asyncio
        bot = get_bot()
        if bot is None:
            return "Telegram bot not initialized. Message not sent."
        asyncio.get_event_loop().run_until_complete(
            bot.send_message(chat_id=chat_id, text=message)
        )
        return f"Message sent to {chat_id}."
    except Exception as e:
        return f"Failed to send Telegram message: {str(e)}"


def get_tools():
    return [
        web_search,
        document_ingest,
        rag_retrieve,
        session_log_write,
        session_log_read,
        calendar_write,
        plan_update,
        agent_log_write,
        cycle_status_update,
        telegram_send,
    ]
