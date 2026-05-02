from fastapi import APIRouter
from db.client import config as config_col
from datetime import datetime

router = APIRouter()

@router.get("/api/config")
def get_config():
    cfg = config_col.find_one({}, {"_id": 0, "telegram_bot_token": 0})
    if not cfg:
        return {"telegram_connected": False}
    return cfg

@router.post("/api/config/telegram")
def connect_telegram(body: dict):
    token = body.get("token", "")
    config_col.update_one(
        {},
        {"$set": {"telegram_bot_token": token, "telegram_connected": True, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"status": "ok", "telegram_connected": True}
