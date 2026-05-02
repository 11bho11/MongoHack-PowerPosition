from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.client import create_indexes, create_vector_search_index
from api.documents import router as documents_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB indexes are in place
    create_vector_search_index()
    create_indexes()
    # On startup with real .env values, call embed_and_store here with a seed URL
    yield
    # Shutdown: nothing to clean up


app = FastAPI(title="PowerPosition", lifespan=lifespan)

app.include_router(documents_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "PowerPosition backend running"}
