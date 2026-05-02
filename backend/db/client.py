"""MongoDB client module for PowerPosition."""

import logging
from pathlib import Path

from dotenv import load_dotenv
import os
from pymongo import MongoClient, ASCENDING
from pymongo.errors import OperationFailure, ConfigurationError, PyMongoError

# Load environment variables from backend/.env
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

logger = logging.getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "powerposition")

# MongoClient instance — constructed with serverSelectionTimeoutMS so connection
# errors surface lazily (at first actual operation) rather than at import time.
# ConfigurationError (e.g., bad SRV placeholder) is caught so the module still
# loads during development with placeholder .env values.
try:
    mongodb_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
except ConfigurationError as exc:
    logger.warning("MongoDB client could not be configured (placeholder URI?): %s", exc)
    mongodb_client = None  # type: ignore[assignment]

# Database object
db = mongodb_client[MONGO_DB_NAME] if mongodb_client is not None else None

# Named collection references
calendar_entries = db["calendar_entries"] if db is not None else None
sessions = db["sessions"] if db is not None else None
coaching_plans = db["coaching_plans"] if db is not None else None
agent_logs = db["agent_logs"] if db is not None else None
workflow_state = db["workflow_state"] if db is not None else None
training_docs = db["training_docs"] if db is not None else None
config = db["config"] if db is not None else None


def create_vector_search_index() -> None:
    """Create the Atlas Vector Search index on training_docs.

    Atlas Vector Search index creation can take 1-2 minutes after first creation.
    """
    if training_docs is None:
        logger.warning("Skipping vector search index creation: no MongoDB connection.")
        return

    index_definition = {
        "name": "training_docs_vector_index",
        "type": "vectorSearch",
        "definition": {
            "fields": [
                {
                    "type": "vector",
                    "path": "embedding",
                    "numDimensions": 1536,
                    "similarity": "cosine",
                }
            ]
        },
    }
    try:
        training_docs.create_search_index(index_definition)
        logger.info("Atlas Vector Search index 'training_docs_vector_index' creation requested.")
    except Exception as exc:
        logger.warning(
            "Could not create vector search index (may already exist or Atlas tier "
            "does not allow programmatic creation on M0): %s",
            exc,
        )


def create_indexes() -> None:
    """Create required indexes on collections."""
    if calendar_entries is None:
        logger.warning("Skipping index creation: no MongoDB connection.")
        return

    try:
        calendar_entries.create_index([("date", ASCENDING)], unique=True)
        logger.info("Unique index on calendar_entries.date ensured.")
    except PyMongoError as exc:
        logger.warning("Could not create index on calendar_entries.date: %s", exc)


# Run index creation at module load time (executes on backend startup)
create_vector_search_index()
create_indexes()
