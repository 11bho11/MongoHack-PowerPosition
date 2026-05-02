# PowerPosition

AI coaching agent for competitive ultimate frisbee players who train without a coach.

## What it does

PowerPosition puts a personal coaching agent in your pocket via Telegram. Log training sessions, get pre-game mental prep, and receive post-game check-ins that adapt to your history. After every few sessions the agent updates your personalized coaching plan across short, medium, and long-term goals. A web dashboard shows your training calendar, evolving plan, and a full log of what the agent did and why.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Backend | FastAPI (Python) |
| Agent | LangGraph |
| Database | MongoDB Atlas |
| Vector Search | MongoDB Atlas Vector Search |
| Memory | MongoDBSaver (short-term) + MongoDBStore (long-term) |
| LLM | OpenAI GPT-4o |
| Embeddings | OpenAI text-embedding-3-small |
| Bot | python-telegram-bot |
| Scheduler | APScheduler |

## MongoDB usage

- **Vector Search** — training knowledge base queried on every coaching recommendation
- **MongoDBSaver** — checkpoints full conversation state per athlete thread
- **MongoDBStore** — long-term athlete profile (position, goals, key insights)
- **Document collections** — calendar entries, sessions, coaching plans, agent logs, workflow state

## Setup

### Prerequisites

- Python 3.11+
- Node 20+
- MongoDB Atlas cluster (M0 free tier is fine)
- OpenAI API key
- Telegram bot token from [@BotFather](https://t.me/BotFather)

### Environment

Create `backend/.env`:

```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
TELEGRAM_BOT_TOKEN=...
MONGO_DB_NAME=powerposition
INACTIVITY_THRESHOLD_HOURS=48
SESSIONS_BEFORE_PLAN_UPDATE=3
```

### Install

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium

# Frontend
cd frontend
npm install
```

### Run

```bash
# Terminal 1 — backend (FastAPI + Telegram bot)
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:8000

## Screens

- **Landing** — deep space intro with Explore CTA
- **Calendar** — monthly grid with prev/next navigation, event type tagging (game / training / rest), diary entries, weekly and monthly objectives
- **Coaching Plan** — three-horizon plan (short / medium / long term), cycle status indicator, agent logs feed with Vector Search sources
- **Config** — Telegram setup, training material upload, MCP integrations panel

## Telegram commands

| Command | What it does |
|---------|-------------|
| `/start` | Onboarding — sets up athlete profile |
| `/log` | Log a training session |
| `/pregame` | Pre-game mental prep |
| `/postgame` | Post-game check-in (2–3 follow-up questions) |

## Demo endpoints

```bash
curl -X POST http://localhost:8000/api/simulate/pregame
curl -X POST http://localhost:8000/api/simulate/postgame
curl -X POST http://localhost:8000/api/simulate/inactivity
```
