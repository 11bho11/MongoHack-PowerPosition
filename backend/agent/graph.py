from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

import os
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

from agent.memory import get_checkpointer, get_store
from agent.prompts import get_system_prompt, ONBOARDING_PROMPT

class PowerPositionState(TypedDict):
    messages: Annotated[list, add_messages]
    task_type: str
    question_count: int
    athlete_id: str
    plan_needs_update: bool
    last_tool_sources: list

llm = ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

# Tools will be bound after import in tools.py — we compile after tools are imported
# This avoids circular import: graph.py needs tools, tools.py needs db.client

def agent_node(state: PowerPositionState):
    from langchain_core.messages import ToolMessage

    task_type = state.get("task_type", "session_log")
    plan_needs_update = state.get("plan_needs_update", False)

    # Check recent tool results — if session_log_write flagged a threshold breach, set the flag
    if not plan_needs_update:
        for msg in reversed(state["messages"]):
            if isinstance(msg, ToolMessage) and "Plan update needed: True" in str(msg.content):
                plan_needs_update = True
                break

    system_prompt = get_system_prompt(task_type)

    # Inject a forced instruction when the update is due
    if plan_needs_update:
        system_prompt += (
            "\n\nCRITICAL INSTRUCTION: The session logging threshold has been reached. "
            "You MUST call the plan_update tool RIGHT NOW with updated short_term, medium_term, "
            "and long_term coaching text. Do not reply with text first — call plan_update immediately."
        )

    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    model = getattr(agent_node, "_llm_with_tools", llm)
    response = model.invoke(messages)

    new_count = state.get("question_count", 0)
    if task_type == "post_game" and response.content:
        new_count += 1

    return {
        "messages": [response],
        "question_count": new_count,
        "plan_needs_update": plan_needs_update,
    }

def should_continue(state: PowerPositionState):
    from langchain_core.messages import ToolMessage

    messages = state["messages"]
    last_message = messages[-1]
    task_type = state.get("task_type", "session_log")
    plan_needs_update = state.get("plan_needs_update", False)

    # Route to tools if the agent just made tool calls
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"

    # If plan_needs_update is True but the agent hasn't called plan_update yet,
    # loop back to agent (it will get the CRITICAL INSTRUCTION injected)
    if plan_needs_update:
        already_updated = any(
            isinstance(m, ToolMessage) and "plan_update" in str(getattr(m, "name", ""))
            for m in messages
        )
        if not already_updated:
            return "agent"

    return END

def build_graph(tools: list):
    """Build and compile the LangGraph graph with the given tools."""
    tools_node = ToolNode(tools)

    # Bind tools to agent's LLM
    llm_with_tools = llm.bind_tools(tools)
    agent_node._llm_with_tools = llm_with_tools

    graph = StateGraph(PowerPositionState)
    graph.add_node("agent", agent_node)
    graph.add_node("tools", tools_node)

    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", should_continue, {"tools": "tools", "agent": "agent", END: END})
    graph.add_edge("tools", "agent")

    return graph.compile(checkpointer=get_checkpointer(), store=get_store())

# Compiled graph instance — initialized by calling init_graph() from main.py after tools are imported
_compiled_graph = None

def init_graph():
    global _compiled_graph
    from agent.tools import get_tools  # imported here to avoid circular import
    tools = get_tools()
    _compiled_graph = build_graph(tools)
    return _compiled_graph

def get_graph():
    if _compiled_graph is None:
        return init_graph()
    return _compiled_graph

def invoke_graph(task_type: str, athlete_id: str, message: str) -> str:
    """Helper to invoke the graph and return the assistant's response string."""
    graph = get_graph()
    config = {"configurable": {"thread_id": athlete_id}}
    initial_state = {
        "messages": [HumanMessage(content=message)],
        "task_type": task_type,
        "question_count": 0,
        "athlete_id": athlete_id,
        "plan_needs_update": False,
        "last_tool_sources": [],
    }
    result = graph.invoke(initial_state, config=config)
    # Return the last assistant message content
    messages = result.get("messages", [])
    for msg in reversed(messages):
        if hasattr(msg, "content") and msg.content and not getattr(msg, "tool_calls", None):
            return msg.content
    return "No response generated."
