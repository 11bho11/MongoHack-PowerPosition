from fastapi import APIRouter
from db.client import coaching_plans

router = APIRouter()

@router.get("/api/plan")
def get_plan():
    plan = coaching_plans.find_one({}, {"_id": 0})
    if not plan:
        return {"short_term": None, "medium_term": None, "long_term": None}
    return plan
