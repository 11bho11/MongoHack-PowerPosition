from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

import os
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

INACTIVITY_THRESHOLD_HOURS = float(os.getenv("INACTIVITY_THRESHOLD_HOURS") or "48")

def check_inactivity(bypass_time_check: bool = False):
    from db.client import workflow_state
    from agent.graph import invoke_graph

    state = workflow_state.find_one()
    if not state:
        return

    last_activity = state.get("last_activity")
    if last_activity is None:
        return

    hours_since = (datetime.utcnow() - last_activity).total_seconds() / 3600
    athlete_id = state.get("athlete_id", "default")

    if bypass_time_check or hours_since > INACTIVITY_THRESHOLD_HOURS:
        invoke_graph("proactive_checkin", athlete_id, "Checking in — it's been a while since your last session.")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_inactivity, "interval", hours=1, id="inactivity_check")
    scheduler.start()
    return scheduler
