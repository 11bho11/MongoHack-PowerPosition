from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.client import create_indexes, create_vector_search_index
from agent.graph import init_graph
from scheduler import start_scheduler
from bot.runner import run_bot

from api.calendar import router as calendar_router
from api.plan import router as plan_router
from api.logs import router as logs_router
from api.documents import router as documents_router
from api.simulate import router as simulate_router
from api.config import router as config_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # DB setup
    create_indexes()
    create_vector_search_index()
    # Init agent graph
    init_graph()
    # Start scheduler
    scheduler = start_scheduler()
    # Start Telegram bot
    bot_task = asyncio.create_task(run_bot())

    yield

    # Cleanup
    scheduler.shutdown(wait=False)
    bot_task.cancel()

app = FastAPI(title="PowerPosition", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calendar_router)
app.include_router(plan_router)
app.include_router(logs_router)
app.include_router(documents_router)
app.include_router(simulate_router)
app.include_router(config_router)

@app.get("/")
async def root():
    return {"status": "PowerPosition backend running"}
