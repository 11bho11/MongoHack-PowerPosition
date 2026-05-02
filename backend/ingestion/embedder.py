from openai import OpenAI
from datetime import datetime
from db.client import training_docs
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def embed_and_store(chunks: list[dict]) -> int:
    """Embeds chunks and upserts to training_docs. Returns count stored."""
    stored = 0
    for chunk in chunks:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk["content"]
        )
        embedding = response.data[0].embedding  # 1536 floats
        doc = {
            "content": chunk["content"],
            "embedding": embedding,
            "source_url": chunk["source_url"],
            "chunk_index": chunk["chunk_index"],
            "ingested_at": datetime.utcnow(),
        }
        training_docs.update_one(
            {"source_url": chunk["source_url"], "chunk_index": chunk["chunk_index"]},
            {"$set": doc},
            upsert=True
        )
        stored += 1
    return stored
