from fastapi import APIRouter
from db.client import calendar_entries
from datetime import datetime

router = APIRouter()

@router.get("/api/calendar")
def get_calendar():
    entries = list(calendar_entries.find({}, {"_id": 0}).sort("date", 1))
    return entries

@router.post("/api/calendar/{date}")
def save_calendar_entry(date: str, body: dict):
    content = body.get("content", "")
    calendar_entries.update_one(
        {"date": date},
        {"$set": {"date": date, "content": content, "source": "manual", "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"status": "ok", "date": date}
