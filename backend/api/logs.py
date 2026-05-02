from fastapi import APIRouter
from db.client import agent_logs, workflow_state
from bson import json_util
import json

router = APIRouter()

@router.get("/api/agent-logs")
def get_agent_logs():
    logs = list(agent_logs.find({}).sort("timestamp", -1).limit(50))
    return json.loads(json_util.dumps(logs))

@router.get("/api/cycle-status")
def get_cycle_status():
    state = workflow_state.find_one({}, {"_id": 0})
    if not state:
        return {"cycle_status": "awaiting"}
    return {"cycle_status": state.get("cycle_status", "awaiting")}
