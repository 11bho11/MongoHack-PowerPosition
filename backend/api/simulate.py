from fastapi import APIRouter
from agent.graph import invoke_graph
from scheduler import check_inactivity

router = APIRouter()

TEST_ATHLETE_ID = "demo_athlete"

@router.post("/api/simulate/pregame")
def simulate_pregame():
    response = invoke_graph("pre_game", TEST_ATHLETE_ID, "I have a game today. Give me a pre-game mental prep.")
    return {"status": "ok", "response": response}

@router.post("/api/simulate/postgame")
def simulate_postgame():
    # Pass question_count=3 equivalent by sending a detailed post-game message
    response = invoke_graph(
        "post_game",
        TEST_ATHLETE_ID,
        "The game just ended. We won 15-12. I had a great game cutting but struggled with my backhand in the wind. Please log this session, update my coaching plan, and send me a Telegram notification."
    )
    return {"status": "ok", "response": response}

@router.post("/api/simulate/inactivity")
def simulate_inactivity():
    check_inactivity(bypass_time_check=True)
    return {"status": "ok", "message": "Inactivity check triggered"}
