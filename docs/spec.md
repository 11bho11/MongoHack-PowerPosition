# PowerPosition — Technical Spec

## Stack

| Layer | Technology | Version | Docs |
|-------|-----------|---------|------|
| Frontend | React + Vite | Vite 8, React 19 | https://vite.dev/guide/ |
| Frontend styling | Tailwind CSS + shadcn/ui | Tailwind v4 | https://tailwindcss.com/docs |
| Frontend routing | React Router v7 | v7 | https://reactrouter.com/home |
| Frontend data fetching | TanStack Query (React Query) | v5 | https://tanstack.com/query/latest |
| Backend | FastAPI | 0.136.x | https://fastapi.tiangolo.com |
| Agent framework | LangGraph | latest | https://langchain-ai.github.io/langgraph/ |
| LangGraph checkpointing | langgraph-checkpoint-mongodb | 0.3.1 | https://langchain-mongodb.readthedocs.io/en/latest/langgraph_checkpoint_mongodb/api_docs.html |
| LangGraph long-term memory | langgraph-store-mongodb | 0.2.0 | https://langchain-mongodb.readthedocs.io/en/latest/ |
| Database | MongoDB Atlas | — | https://www.mongodb.com/docs/atlas/ |
| Vector Search | MongoDB Atlas Vector Search | — | https://www.mongodb.com/docs/atlas/atlas-vector-search/ |
| LLM | OpenAI GPT-4o | — | https://platform.openai.com/docs |
| Embeddings | OpenAI text-embedding-3-small | — | https://platform.openai.com/docs/guides/embeddings |
| Web browsing tool | langchain-community PlaywrightBrowserToolkit | latest | https://python.langchain.com/docs/integrations/tools/playwright/ |
| Telegram | python-telegram-bot | 22.7 | https://docs.python-telegram-bot.org/en/stable/ |
| Background scheduler | APScheduler | 3.x | https://apscheduler.readthedocs.io/en/3.x/ |
| Reference architecture | MongoDB LangGraph tutorial | — | https://www.mongodb.com/docs/atlas/ai-integrations/langgraph/ |

**Rationale:** Python backend lets LangGraph, MongoDB drivers, and python-telegram-bot all live in the same process. React + Vite gives full aesthetic control for the sci-fi UI that Streamlit cannot deliver. shadcn/ui provides dark-mode components as a base. All MongoDB features (Vector Search, MongoDBSaver, MongoDBStore, document collections) are intentionally visible in the demo — this is the hackathon judging criteria.

---

## Runtime & Deployment

- **Runtime:** Local only (localhost)
- **Frontend:** `http://localhost:5173` (Vite dev server)
- **Backend:** `http://localhost:8000` (uvicorn with `--reload`)
- **Telegram bot:** polling mode (no webhook, no public URL required)
- **MongoDB:** MongoDB Atlas free tier (M0) — connection via `MONGODB_URI` in `.env`

**Python version:** 3.11+
**Node version:** 20+

**Required environment variables (backend/.env):**
```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
TELEGRAM_BOT_TOKEN=...
MONGO_DB_NAME=powerposition
INACTIVITY_THRESHOLD_HOURS=48
SESSIONS_BEFORE_PLAN_UPDATE=3
```

**Startup:**
```bash
# Terminal 1 — backend (runs FastAPI + Telegram bot polling)
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend && npm run dev
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                 React Frontend                       │
│   Landing │ Calendar │ Coaching Plan │ Config        │
│           (Vite + Tailwind + shadcn/ui)              │
└────────────────────┬────────────────────────────────┘
                     │ REST/JSON (React Query, 5s polling)
                     ▼
┌─────────────────────────────────────────────────────┐
│                FastAPI Backend                       │
│  /api/calendar  /api/plan  /api/logs  /api/config   │
│  /api/documents/upload  /api/simulate/*             │
│                                                     │
│  ┌──────────────┐    ┌─────────────────────────┐   │
│  │ Telegram Bot │    │   APScheduler            │   │
│  │ (polling)    │    │ (inactivity check)       │   │
│  └──────┬───────┘    └────────────┬────────────┘   │
└─────────┼───────────────────────┼─────────────────┘
          │ invoke graph           │ invoke graph
          ▼                       ▼
┌─────────────────────────────────────────────────────┐
│              LangGraph Agent                        │
│  State: messages, task_type, question_count,        │
│         athlete_id, plan_needs_update,              │
│         last_tool_sources                           │
│                                                     │
│  Tools: web_search, document_ingest, rag_retrieve,  │
│         session_log_write, session_log_read,        │
│         calendar_write, plan_update,                │
│         agent_log_write, cycle_status_update,       │
│         telegram_send                               │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              MongoDB Atlas                          │
│                                                     │
│  Collections: calendar_entries, sessions,           │
│               coaching_plans, agent_logs,           │
│               workflow_state, training_docs         │
│                                                     │
│  MongoDBSaver  ── checkpoint per thread_id          │
│  MongoDBStore  ── long-term athlete memory          │
│  Vector Search ── index on training_docs.embedding  │
└─────────────────────────────────────────────────────┘
```

**Critical data flows:**

**Flow 1 — Telegram session log → calendar update:**
```
Athlete message → Telegram handler → LangGraph (loads checkpoint from MongoDBSaver)
→ agent calls session_log_write + calendar_write + agent_log_write
→ if sessions_since_update >= threshold: sets plan_needs_update = True
→ conditional edge → plan_update tool → cycle_status_update("Plan updated")
→ telegram_send (plan update notification)
→ MongoDBSaver saves checkpoint
→ frontend polling picks up /api/calendar + /api/plan changes
```

**Flow 2 — Post-game check-in (multi-turn):**
```
/postgame command → LangGraph (task_type = "post_game", question_count = 0)
→ agent asks opening question → MongoDBSaver saves checkpoint
→ athlete replies → LangGraph loads checkpoint → question_count++
→ agent uses rag_retrieve (last_tool_sources captured) + session_log_read for context
→ after question_count >= 3: session_log_write + plan_update + agent_log_write
→ cycle_status_update("Plan updated") → telegram_send(notification)
```

**Flow 3 — Document ingestion:**
```
Agent calls document_ingest(query) OR POST /api/documents/upload
→ web_search / file read → chunker.py (500-token chunks)
→ embedder.py (OpenAI text-embedding-3-small) → upsert to training_docs collection
→ Atlas Vector Search index auto-indexes new embeddings
```

**Flow 4 — Inactivity proactive check-in:**
```
APScheduler fires every hour
→ queries workflow_state.last_activity
→ if hours_since_activity > INACTIVITY_THRESHOLD_HOURS:
  → LangGraph invoked (task_type = "proactive_checkin")
  → agent sends Telegram check-in message
  → cycle_status_update("Awaiting next session")
```

---

## Frontend

Implements `prd.md > Landing & Navigation`, `prd.md > Calendar`, `prd.md > Coaching Plan`, `prd.md > Configuration & Connections`.

### Landing Page

**File:** `frontend/src/pages/Landing.tsx`

- Full-screen dark background with CSS radial gradient (deep space feel: `#0a0a1a` base, indigo/purple atmospheric glow)
- Centered layout: PowerPosition title (large, spaced tracking), subtitle, "Explore" CTA button
- Clicking "Explore" navigates to `/calendar` via React Router — left nav becomes visible
- No data fetching on this page

### Navigation

**File:** `frontend/src/components/nav/Sidebar.tsx`

- Fixed left sidebar, visible on `/calendar`, `/plan`, `/config`
- Three nav items: Calendar, Coaching Plan, Config
- Active item highlighted (bright accent color against dark bg)
- Hidden on Landing page (`/`)

### Calendar Screen

**File:** `frontend/src/pages/CalendarPage.tsx`
**Components:** `CalendarGrid.tsx`, `DatePopup.tsx`

Implements `prd.md > Calendar`.

- `CalendarGrid.tsx`: Custom monthly grid (7-column CSS grid). Does not use an external calendar library — custom build gives full style control for the sci-fi aesthetic.
  - Each date cell: shows day number, visual dot/marker if entry exists for that date
  - Clicking any date opens `DatePopup`
  - Data source: `useCalendar()` hook → `GET /api/calendar`
- `DatePopup.tsx`: Modal overlay
  - Textarea (diary-style, freeform)
  - Pre-populated with existing entry content if one exists for that date
  - Save button → `POST /api/calendar/{date}` → optimistic update via React Query
  - Agent-populated and manually-entered content coexist in the same textarea — no source distinction in UI

### Coaching Plan Screen

**File:** `frontend/src/pages/CoachingPlan.tsx`
**Components:** `PlanSection.tsx`, `CycleStatus.tsx`, `AgentLogsTable.tsx`

Implements `prd.md > Coaching Plan`.

- `PlanSection.tsx`: Reusable component rendered three times (Short-Term, Medium-Term, Long-Term)
  - Displays agent-generated plan text from `coaching_plans` collection
  - Empty state: "Add more session logs to reveal insights"
  - Data source: `usePlan()` hook → `GET /api/plan` (5s polling interval)
- `CycleStatus.tsx`: Badge/pill showing current cycle state
  - Four states: `Awaiting next session` → `Session logged` → `Analyzing` → `Plan updated`
  - Color-coded: grey / blue / amber / green
  - Data source: `useCycleStatus()` hook → `GET /api/cycle-status` (5s polling)
- `AgentLogsTable.tsx`: Reverse-chronological log table
  - Columns: Timestamp, Action, Reasoning, Vector Search Sources
  - Checkpoint events (e.g., "Workflow resumed from checkpoint") displayed inline
  - Empty state when no agent actions yet
  - Data source: `useLogs()` hook → `GET /api/agent-logs` (5s polling)

### Config Screen

**File:** `frontend/src/pages/Config.tsx`
**Components:** `TelegramCard.tsx`, `IntegrationCard.tsx`

Implements `prd.md > Configuration & Connections`.

- `TelegramCard.tsx`:
  - If not connected: input field for bot token + "Connect" button → `POST /api/config/telegram`
  - If connected: shows "Connected" status + bot username
  - Stores token in MongoDB `config` collection + initializes bot
- `IntegrationCard.tsx` (rendered twice — Calendar, Strava):
  - Greyed-out toggle (disabled), greyed-out "Connect" button
  - Visually present but non-functional — clearly inactive state

### Frontend State Management

All server state via **TanStack Query (React Query)**:
- Polling hooks (`useCalendar`, `usePlan`, `useLogs`, `useCycleStatus`) use `refetchInterval: 5000`
- Mutations (`useSaveCalendarEntry`, `useConnectTelegram`, `useUploadDocument`) use optimistic updates where appropriate
- No Redux or Zustand — React Query handles all async state

---

## Backend

### FastAPI Application

**File:** `backend/main.py`

Entry point. On startup:
1. Initializes MongoDB client (`db/client.py`)
2. Creates Atlas Vector Search index if it doesn't exist
3. Starts Telegram bot polling as a background asyncio task (`bot/runner.py`)
4. Starts APScheduler inactivity check (`scheduler.py`)
5. Mounts all API routers

CORS configured to allow `http://localhost:5173`.

### API Routes

**File:** `backend/api/`

| File | Endpoints | Notes |
|------|-----------|-------|
| `calendar.py` | `GET /api/calendar`, `POST /api/calendar/{date}` | Manual web entries |
| `plan.py` | `GET /api/plan` | Returns current coaching_plans document |
| `logs.py` | `GET /api/agent-logs`, `GET /api/cycle-status` | Reverse-chrono logs |
| `documents.py` | `POST /api/documents/upload` | File upload → ingestion pipeline |
| `simulate.py` | `POST /api/simulate/pregame`, `POST /api/simulate/postgame`, `POST /api/simulate/inactivity` | Demo triggers — invoke LangGraph without Telegram |
| `config.py` | `GET /api/config`, `POST /api/config/telegram` | Integration state |

### Scheduler

**File:** `backend/scheduler.py`

APScheduler `BackgroundScheduler`, fires every hour:
```python
def check_inactivity():
    state = db.workflow_state.find_one()
    if not state: return
    hours_since = (now - state["last_activity"]).total_seconds() / 3600
    if hours_since > INACTIVITY_THRESHOLD_HOURS:
        invoke_graph(task_type="proactive_checkin", athlete_id=state["athlete_id"])
```

For demo: `POST /api/simulate/inactivity` calls `check_inactivity()` directly, bypassing the time check.

---

## LangGraph Agent

### Graph Definition

**File:** `backend/agent/graph.py`

```
START → agent_node → [conditional edge] → tools_node → agent_node → ... → END
                          │
                          └── if no tool calls → END
```

Conditional edge logic:
- If last message has tool calls → route to `tools_node`
- If `task_type == "post_game"` and `question_count >= 3` → force `plan_update` tool call before END
- If `plan_needs_update == True` → force `plan_update` tool call before END
- Otherwise → END

### Graph State

**File:** `backend/agent/graph.py` (TypedDict)

```python
class PowerPositionState(TypedDict):
    messages: Annotated[list, add_messages]  # full conversation history
    task_type: str      # "pre_game" | "post_game" | "session_log" | "proactive_checkin"
    question_count: int # post-game follow-up question counter (stops at 3)
    athlete_id: str     # Telegram chat_id — used as thread_id for MongoDBSaver
    plan_needs_update: bool  # True when sessions_since_last_update >= threshold
    last_tool_sources: list  # Vector Search sources from last rag_retrieve call
```

### Memory Setup

**File:** `backend/agent/memory.py`

```python
# Short-term: checkpoints full graph state per thread
checkpointer = MongoDBSaver(mongodb_client, db_name=MONGO_DB_NAME)

# Long-term: athlete profile + key insights (persists across thread resets)
store = MongoDBStore(mongodb_client, db_name=MONGO_DB_NAME)
```

Graph compiled with: `graph.compile(checkpointer=checkpointer, store=store)`

Thread config passed on every invocation: `{"configurable": {"thread_id": athlete_id}}`

### Tools

**File:** `backend/agent/tools.py`

All 10 tools decorated with `@tool`.

| Tool | Inputs | What it does |
|------|--------|-------------|
| `web_search` | `query: str` | Playwright browser search → navigate top results → extract full page content |
| `document_ingest` | `query: str` | web_search → extract page content → chunk → embed → upsert to `training_docs` |
| `rag_retrieve` | `query: str, k: int = 5` | Atlas Vector Search on `training_docs`, returns top-k chunks + sources |
| `session_log_write` | `date: str, content: str, source: str` | Inserts to `sessions` collection + updates `workflow_state.last_activity` |
| `session_log_read` | `limit: int = 10` | Returns most recent N sessions |
| `calendar_write` | `date: str, content: str, source: str` | Upserts `calendar_entries` for date |
| `plan_update` | `short_term: str, medium_term: str, long_term: str` | Upserts `coaching_plans`, resets session counter |
| `agent_log_write` | `action: str, reasoning: str, event_type: str` | Writes to `agent_logs`, includes `last_tool_sources` from state |
| `cycle_status_update` | `status: str` | Updates `workflow_state.cycle_status` |
| `telegram_send` | `chat_id: str, message: str` | Sends Telegram message via bot instance |

### Prompts

**File:** `backend/agent/prompts.py`

System prompt root: positions the agent as an elite ultimate frisbee coach — analytical, direct, focused on improvement. Adapts tone by `task_type`:
- `pre_game`: motivational, mentally focused, brief
- `post_game`: curious, empathetic, data-gathering
- `session_log`: efficient, confirmatory
- `proactive_checkin`: warm, low-pressure check-in

---

## Telegram Bot

Implements `prd.md > Telegram Bot`.

### Handlers

**File:** `backend/bot/handlers.py`

| Handler | Trigger | task_type | Notes |
|---------|---------|-----------|-------|
| `start_handler` | `/start` | `"session_log"` | Welcome message + seeds MongoDBStore athlete profile |
| `pregame_handler` | `/pregame` | `"pre_game"` | Pre-game mental prep flow |
| `postgame_handler` | `/postgame` | `"post_game"` | Post-game check-in, 2–3 follow-up questions |
| `log_handler` | `/log` | `"session_log"` | Explicit session log start |
| `message_handler` | any text | inherits active `task_type` | Routes to active LangGraph thread |

Every handler calls `invoke_graph(task_type, athlete_id=chat_id, message=text)`.

### Bot Runner

**File:** `backend/bot/runner.py`

```python
async def run_bot():
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start_handler))
    app.add_handler(CommandHandler("pregame", pregame_handler))
    app.add_handler(CommandHandler("postgame", postgame_handler))
    app.add_handler(CommandHandler("log", log_handler))
    app.add_handler(MessageHandler(filters.TEXT, message_handler))
    await app.run_polling()
```

Started as `asyncio.create_task(run_bot())` in `main.py` startup.

---

## Ingestion Pipeline

### Chunker

**File:** `backend/ingestion/chunker.py`

Splits text into ~500 token chunks with 50-token overlap using LangChain's `RecursiveCharacterTextSplitter`. Returns list of `{content, chunk_index, source_url}`.

### Embedder

**File:** `backend/ingestion/embedder.py`

For each chunk:
1. Call OpenAI `text-embedding-3-small` → 1536-dimension vector
2. Upsert to `training_docs` collection: `{content, embedding, source_url, chunk_index, ingested_at}`

Atlas Vector Search index name: `training_docs_vector_index`
Index config:
```json
{
  "fields": [{
    "type": "vector",
    "path": "embedding",
    "numDimensions": 1536,
    "similarity": "cosine"
  }]
}
```

---

## Data Model

### `calendar_entries`
```
{
  _id: ObjectId,
  date: str,          // "YYYY-MM-DD"
  content: str,       // freeform diary text
  source: str,        // "manual" | "telegram"
  updated_at: datetime
}
```
Index: `{date: 1}` (unique)

### `sessions`
```
{
  _id: ObjectId,
  date: str,
  content: str,
  source: str,        // "telegram" | "manual"
  created_at: datetime
}
```

### `coaching_plans`
```
{
  _id: ObjectId,
  athlete_id: str,
  short_term: str,
  medium_term: str,
  long_term: str,
  sessions_since_update: int,
  updated_at: datetime
}
```

### `agent_logs`
```
{
  _id: ObjectId,
  timestamp: datetime,
  action: str,
  reasoning: str,
  vector_sources: [str],   // source_urls from rag_retrieve, empty array if none
  event_type: str          // "action" | "checkpoint" | "plan_update" | "inactivity_check"
}
```

### `workflow_state`
```
{
  _id: ObjectId,
  athlete_id: str,
  cycle_status: str,       // "awaiting" | "logged" | "analyzing" | "updated"
  last_activity: datetime,
  updated_at: datetime
}
```

### `training_docs`
```
{
  _id: ObjectId,
  content: str,
  embedding: [float],      // 1536 dimensions
  source_url: str,
  chunk_index: int,
  ingested_at: datetime
}
```
Atlas Vector Search index on `embedding` field (see Ingestion Pipeline).

### `config`
```
{
  _id: ObjectId,
  telegram_bot_token: str,
  telegram_connected: bool,
  updated_at: datetime
}
```

### MongoDBStore (long-term athlete memory)
Namespace: `("athlete_memory", athlete_id)`

Stored keys:
- `profile`: `{position, experience_level, goals, sport}`
- `key_insights`: list of strings — patterns observed across sessions (e.g., "struggles with conditioning in heat")

---

## File Structure

```
powerposition/
├── backend/
│   ├── main.py                     # FastAPI app entry + startup (bot, scheduler, DB init)
│   ├── scheduler.py                # APScheduler inactivity check loop
│   ├── agent/
│   │   ├── graph.py                # LangGraph graph (nodes, edges, conditional routing)
│   │   ├── tools.py                # All 10 agent tools (@tool decorated)
│   │   ├── prompts.py              # System prompt + task_type tone variants
│   │   └── memory.py              # MongoDBSaver + MongoDBStore initialization
│   ├── api/
│   │   ├── calendar.py             # GET /api/calendar, POST /api/calendar/{date}
│   │   ├── plan.py                 # GET /api/plan
│   │   ├── logs.py                 # GET /api/agent-logs, GET /api/cycle-status
│   │   ├── documents.py            # POST /api/documents/upload
│   │   ├── simulate.py             # POST /api/simulate/pregame|postgame|inactivity
│   │   └── config.py               # GET/POST /api/config, POST /api/config/telegram
│   ├── bot/
│   │   ├── handlers.py             # /start, /pregame, /postgame, /log, message handler
│   │   └── runner.py               # Bot application setup + polling coroutine
│   ├── db/
│   │   ├── client.py               # MongoDB client, collection refs, index creation
│   │   └── models.py               # Pydantic models for all 7 collections
│   ├── ingestion/
│   │   ├── chunker.py              # RecursiveCharacterTextSplitter, 500-token chunks
│   │   └── embedder.py             # OpenAI embed → upsert training_docs
│   ├── .env                        # All API keys and config values
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── nav/
│   │   │   │   └── Sidebar.tsx     # Fixed left nav, 3 items, active state
│   │   │   ├── calendar/
│   │   │   │   ├── CalendarGrid.tsx    # Custom monthly grid (CSS grid, no library)
│   │   │   │   └── DatePopup.tsx       # Modal diary textarea + save
│   │   │   ├── plan/
│   │   │   │   ├── PlanSection.tsx     # Reusable plan section with empty state
│   │   │   │   ├── CycleStatus.tsx     # 4-state badge (awaiting/logged/analyzing/updated)
│   │   │   │   └── AgentLogsTable.tsx  # Reverse-chrono log table, 4 columns
│   │   │   └── config/
│   │   │       ├── TelegramCard.tsx    # Token input + connect flow
│   │   │       └── IntegrationCard.tsx # Reusable greyed-out card (Calendar, Strava)
│   │   ├── pages/
│   │   │   ├── Landing.tsx         # Title, subtitle, Explore CTA, deep space bg
│   │   │   ├── CalendarPage.tsx    # Calendar screen with grid + popup
│   │   │   ├── CoachingPlan.tsx    # 3 plan sections + CycleStatus + AgentLogsTable
│   │   │   └── Config.tsx          # TelegramCard + 2× IntegrationCard
│   │   ├── lib/
│   │   │   ├── api.ts              # Typed fetch wrappers for all endpoints
│   │   │   └── hooks.ts            # React Query hooks (useCalendar, usePlan, useLogs, etc.)
│   │   ├── App.tsx                 # React Router: / | /calendar | /plan | /config
│   │   └── main.tsx                # Entry point, QueryClientProvider wrapper
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts          # Dark mode, custom color tokens for sci-fi palette
│   └── package.json
├── docs/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md                     # This file
├── process-notes.md
└── README.md
```

---

## Key Technical Decisions

**1. Single FastAPI process for backend + Telegram bot**
The Telegram bot runs as an asyncio background task inside the FastAPI app rather than a separate process. This simplifies startup (one command), lets the bot and API share the same MongoDB client and LangGraph graph instance, and avoids inter-process communication. Tradeoff: if the bot's polling loop crashes, it takes the API down. Acceptable for a hackathon demo.

**2. Polling instead of webhooks for Telegram**
Polling (`run_polling()`) requires no public URL, no ngrok, no SSL certificate — it just works locally. Webhooks are faster and production-appropriate but add setup complexity. For localhost demo, polling is the right call.

**3. Plan update trigger is event-driven + threshold-based, not time-based**
Plan updates fire on: post-game check-in completion, session log write (if `sessions_since_update >= SESSIONS_BEFORE_PLAN_UPDATE`), and proactive inactivity check-in (APScheduler). This keeps the coaching loop grounded in athlete activity rather than an arbitrary clock, and all three triggers are demonstrable in the demo.

**4. Custom calendar grid (no library)**
`CalendarGrid.tsx` is hand-built as a CSS grid rather than using react-big-calendar or FullCalendar. These libraries bring heavy default styling that fights the sci-fi aesthetic. A custom 7-column grid is ~60 lines of code and gives full control over date cell appearance, markers, and popup trigger behavior.

---

## Dependencies & External Services

| Service | Purpose | Keys needed | Pricing / Limits |
|---------|---------|-------------|-----------------|
| MongoDB Atlas | Database, Vector Search, checkpointing, store | `MONGODB_URI` | Free tier (M0) — 512MB storage, sufficient for demo |
| OpenAI | GPT-4o (LLM) + text-embedding-3-small (embeddings) | `OPENAI_API_KEY` | Pay-per-use; demo usage minimal |
| Playwright | Browser-based web search + page extraction for agent | No API key — install with `playwright install chromium` | Free |
| Telegram Bot API | Bot messaging | `TELEGRAM_BOT_TOKEN` (from @BotFather) | Free |

**Setup checklist before /build:**
- [ ] MongoDB Atlas cluster created (M0 free tier)
- [ ] Atlas Vector Search index created on `training_docs.embedding` (see Ingestion Pipeline section)
- [ ] Telegram bot created via @BotFather → token in `.env`
- [ ] OpenAI API key with credits
- [ ] Playwright Chromium installed: `playwright install chromium`

---

## Open Issues

1. **First coaching plan threshold:** PRD open question — how many sessions before the agent generates a first plan? Defaulting to `SESSIONS_BEFORE_PLAN_UPDATE=3` (configurable in `.env`). Can be changed to 1 if we want immediate plan generation after first session log.

2. **Athlete onboarding in `/start`:** The `/start` handler seeds the MongoDBStore athlete profile, but we haven't specified what questions the agent asks at onboarding (position, experience level, goals). This needs a short onboarding prompt in `prompts.py` before the agent can generate meaningful first-session advice. Recommend: 2-3 quick questions on first `/start`, store answers to MongoDBStore.

3. **Atlas Vector Search index creation timing:** The Vector Search index must be created in Atlas before the first `rag_retrieve` call. `db/client.py` will attempt to create it programmatically on startup, but Atlas Vector Search index creation can take 1-2 minutes. If `rag_retrieve` is called before the index is ready, it will return empty results silently. Mitigation: add a readiness check in `rag_retrieve` that returns a helpful message if no results come back.
