from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

from langgraph.checkpoint.mongodb import MongoDBSaver
from langgraph.store.mongodb import MongoDBStore
from db.client import mongodb_client
import logging
import os

logger = logging.getLogger(__name__)

MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "powerposition")

# Instantiate lazily to avoid connection errors at import time when MongoDB is
# not yet reachable (e.g., during unit-test imports or cold starts).
_checkpointer = None
_store = None


def get_checkpointer() -> MongoDBSaver:
    global _checkpointer
    if _checkpointer is None:
        try:
            _checkpointer = MongoDBSaver(mongodb_client, db_name=MONGO_DB_NAME)
        except Exception as exc:
            logger.warning("Could not initialize MongoDBSaver: %s", exc)
            raise
    return _checkpointer


def get_store() -> MongoDBStore:
    global _store
    if _store is None:
        try:
            _store = MongoDBStore(mongodb_client, db_name=MONGO_DB_NAME)
        except Exception as exc:
            logger.warning("Could not initialize MongoDBStore: %s", exc)
            raise
    return _store


# Convenience aliases — these are None until first access via get_* functions.
# graph.py uses get_checkpointer() / get_store() at compile time (inside build_graph).
checkpointer = property(get_checkpointer)
store = property(get_store)
