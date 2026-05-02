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
    event_type = body.get("event_type", None)
    fields = {"date": date, "content": content, "source": "manual", "updated_at": datetime.utcnow()}
    if event_type is not None:
        fields["event_type"] = event_type
    calendar_entries.update_one({"date": date}, {"$set": fields}, upsert=True)
    return {"status": "ok", "date": date}
