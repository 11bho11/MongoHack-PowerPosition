"""Seed calendar entries and agent logs for May–August 2026."""
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

import os
from datetime import datetime, timezone
from pymongo import MongoClient

client = MongoClient(os.environ["MONGODB_URI"])
db = client[os.environ.get("MONGO_DB_NAME", "powerposition")]

cal = db["calendar_entries"]
logs = db["agent_logs"]

# ---------------------------------------------------------------------------
# Calendar entries
# ---------------------------------------------------------------------------

entries = [
    # ── MAY 2026 ──
    {"date": "2026-05-02", "event_type": "training", "content": "First session of the block. Focus: huck mechanics. 30 mins throwing with Jamie — deep cuts landing consistently. Left shoulder still a bit tight. Noted to stretch more."},
    {"date": "2026-05-04", "event_type": "training", "content": "Track work. 6×400m at 5k pace. HR peaked at 178. Recovery decent between reps. Legs felt heavy in rep 5–6, probably from disc work yesterday."},
    {"date": "2026-05-06", "event_type": "rest",     "content": "Full rest. Foam rolled quads and IT band for 20 mins. Sleep was 8hrs — felt genuinely recovered by evening."},
    {"date": "2026-05-08", "event_type": "training", "content": "Small group scrimmage (5v5). Worked on force-side cuts and stack discipline. Two layout Ds — timing getting sharper. Need to communicate dump resets earlier."},
    {"date": "2026-05-10", "event_type": "game",     "content": "League game vs Spiral Dynamics. W 13–10. Strong first half, went up 8–4. Second half got sloppy on resets — gave up 4 in a row. Finished strong. 3 assists, 1 goal, 1 D."},
    {"date": "2026-05-12", "event_type": "training", "content": "Recovery run 5k easy + mobility. Focused on hip flexors and ankle stability after Sunday's game. Felt good — no soreness lingering."},
    {"date": "2026-05-14", "event_type": "training", "content": "Handler work: under cuts and pivots. 45 mins with coach feedback. Main note: release point on backhand too low under pressure — arms extending before hip pivot completes."},
    {"date": "2026-05-16", "event_type": "training", "content": "Conditioning circuit: 3 rounds of disc sprints, box jumps, lateral shuffle. Felt strong. New PR on 40yd sprint — 4.8s."},
    {"date": "2026-05-17", "event_type": "game",     "content": "Friendly vs Clutch City. L 11–12. One point game all the way. Miscommunication on last O-point — handler went to look-off instead of reset. Discussed post-game. Energy was great though."},
    {"date": "2026-05-19", "event_type": "training", "content": "Zone O breakdown. Worked the 3-man pod attacking the cup. Movement was sharp. Getting better at recognizing when the wing is open vs crashing."},
    {"date": "2026-05-21", "event_type": "training", "content": "Distance and accuracy drill: 30m, 45m, 60m backhand and flick. Hit 11/15 at 60m — personal best. Wind ~10mph from the right."},
    {"date": "2026-05-23", "event_type": "rest",     "content": "Active rest. 30min walk, stretched. Body needed it after a heavy week. Mentally reset — listened to Ultimate podcast on stack timing concepts."},
    {"date": "2026-05-24", "event_type": "game",     "content": "Club tournament Day 1. 3 games: W 15–9, W 13–11, L 10–13. Stamina held through game 2 but game 3 I was gassed by halftime. Quads cramped late — need more electrolytes."},
    {"date": "2026-05-25", "event_type": "game",     "content": "Club tournament Day 2. Quarters: W 13–10. Semis: L 9–13. Best layout D of the season in the semis — full extension, clean. Finished top 4 overall."},
    {"date": "2026-05-27", "event_type": "training", "content": "Light session post-tournament. Throwing only, no cutting. Arms and legs still heavy. 20 mins focused on release angle and follow-through."},
    {"date": "2026-05-29", "event_type": "training", "content": "Speed ladder + footwork drills. Added 3-step explosive plant-and-go drill. Feeling quicker off the line. Coach noted improvement in first two steps."},
    {"date": "2026-05-31", "event_type": "training", "content": "End of month scrimmage. Full 7v7. Playing D-line — 4 blocks, forced 3 turnovers. Communication on D was the best it's been. Team energy is building."},

    # ── JUNE 2026 ──
    {"date": "2026-06-01", "event_type": "rest",     "content": "Rest. Monthly objectives review — feeling ahead of pace on conditioning. Handler work still needs sharpening. Set June goal: 3 assists per game average."},
    {"date": "2026-06-02", "event_type": "training", "content": "Film session + light throwing. Reviewed last weekend's tournament footage. Clear pattern: I'm releasing backhand too early when the mark is aggressive. Drilling counter-pivot."},
    {"date": "2026-06-04", "event_type": "training", "content": "Team practice. Zone O and D. Best practice of the season for team cohesion — everyone talking, adjusting together. Executed the bracket D flawlessly twice."},
    {"date": "2026-06-06", "event_type": "training", "content": "Solo conditioning: 5×200m sprint, 10 min break, 3×400m. HR: 183 peak. Recovery time improving — down to 90s between sets now."},
    {"date": "2026-06-07", "event_type": "game",     "content": "League game vs Open Sky. W 15–8. Dominant. Zone D held them to 4 goals in the first half. 4 assists total — hit the June goal in game 1. Huck to corner working well."},
    {"date": "2026-06-09", "event_type": "training", "content": "Recovery + core work. Planks, side planks, pallof press. Core stability is directly improving disc speed — noticed it in the 60m throws this week."},
    {"date": "2026-06-11", "event_type": "training", "content": "Cutter drills: in-cut timing vs under-throws. Worked on adjusting speed mid-route. 3 dropped in-cuts — footwork on the catch is the weak link right now."},
    {"date": "2026-06-13", "event_type": "rest",     "content": "Rest. Went for a swim — cross-training. Shoulders feel great. Sleep quality has been good all week."},
    {"date": "2026-06-14", "event_type": "game",     "content": "League game vs Windmill. W 13–9. Slower game, lots of turnovers on both sides from wind (gusting 20mph). Adapted with short-field disc — 3 swing passes to reset flow. 2 goals."},
    {"date": "2026-06-16", "event_type": "training", "content": "High-volume throwing day. 200+ throws. Focused entirely on release consistency under fatigue. By rep 150 the mechanics were holding — improvement from 3 weeks ago."},
    {"date": "2026-06-18", "event_type": "training", "content": "Footwork + agility: cone drills, 5-10-5 shuttle. New best: 4.41s on shuttle. First-step explosion measurably better. Attributed to June's ladder work."},
    {"date": "2026-06-20", "event_type": "rest",     "content": "Full rest. Body signaled it — legs sore, sleep-deprived. 9hrs of sleep tonight. Planning for weekend tournament — resting is the prep."},
    {"date": "2026-06-21", "event_type": "game",     "content": "Regional qualifier Day 1. 4 games. W W L W. The L was a 12–13 heartbreaker — got scored on on universe point, D-line was in the right position but miscommunication on switch. Still advanced."},
    {"date": "2026-06-22", "event_type": "game",     "content": "Regional qualifier Day 2. Quarters: W 15–12. Semis: W 13–11. Finals: L 11–15 — opponent was faster and more disciplined. Runner-up. Good tournament overall, team played with heart."},
    {"date": "2026-06-24", "event_type": "training", "content": "Post-tournament debrief practice. Light volume. Focused on what broke down in the final — primary issue was transition D when we turned it over on O."},
    {"date": "2026-06-26", "event_type": "training", "content": "Strength session: squats, lunges, hip thrusts. Prioritising posterior chain for Q3 tournament block. Added Nordic curls — hamstring health is a priority."},
    {"date": "2026-06-28", "event_type": "game",     "content": "Friendly vs local pickup crew. Mixed game. 14–12 W. Tried new O set — split-stack with motion cutter. Promising but we only executed it cleanly twice. More reps needed."},
    {"date": "2026-06-30", "event_type": "training", "content": "June wrap-up. Hit 3-assist average for the month. Conditioning PRs on sprint and agility. July focus: tournament mentality, pressure situations, closing games."},

    # ── JULY 2026 ──
    {"date": "2026-07-01", "event_type": "training", "content": "First July session. Heat is a new variable — 32°C. Conditioning felt harder. Starting to train in the heat deliberately. Hydration plan updated: 750ml/hr."},
    {"date": "2026-07-03", "event_type": "training", "content": "Team tactical session. Worked the side-stack with handler motion. New concepts clicking after 3rd rep. Everyone staying patient on disc — huge improvement."},
    {"date": "2026-07-04", "event_type": "game",     "content": "Independence Day tournament — morning pool play. W 13–7, W 15–10. Feeling sharp. Heat is manageable with proper hydration. Movement felt smooth."},
    {"date": "2026-07-05", "event_type": "game",     "content": "Independence Day tournament — bracket. W 13–11 quarters. L 10–15 semis. Opponent exploited our zone — the cup wasn't stepping up on short-field discs. Major adjustment to work on."},
    {"date": "2026-07-07", "event_type": "rest",     "content": "Rest. Light stretch. Processing the tournament. The zone gap is fixable — agreed with team to dedicate two full practices to it before nationals prep begins."},
    {"date": "2026-07-09", "event_type": "training", "content": "Zone cup adjustments. 2hr focused practice. Cup sliding as a unit, wings staying disciplined. Ran through scenarios 10+ times. By the end it was clicking."},
    {"date": "2026-07-11", "event_type": "training", "content": "Endurance block: 8k tempo run at 4:45/km pace. New distance PR. Aerobic base is solid — the heat training from July is paying off early."},
    {"date": "2026-07-12", "event_type": "game",     "content": "Midseason league game. W 15–6. Statement game — executed zone O and zone D in the same match. 5 assists. Best individual game of the season so far."},
    {"date": "2026-07-14", "event_type": "training", "content": "Recovery day training: yoga + light throws. Prioritising flexibility. Hip opener routine from physio — noticeably more range on the backhand pivot already."},
    {"date": "2026-07-16", "event_type": "training", "content": "High-pressure drill scenarios: down by 1, final O-point, 2 mins left. Repeated 8 times. Focus on poise and execution under stress. Made mistakes in rep 3–4, cleaned up by rep 7."},
    {"date": "2026-07-18", "event_type": "rest",     "content": "Rest. Physio appointment — IT band tension building. Got release massage + dry needling. Two weeks of band exercises prescribed before nationals prep."},
    {"date": "2026-07-19", "event_type": "game",     "content": "Club game vs Gravity. W 13–12. Closest game of the season. Scored universe point on a reset → strike → end-zone look. The pressure work from earlier this week paid off directly."},
    {"date": "2026-07-21", "event_type": "training", "content": "Morning session: band exercises for IT band rehab + throwing. Afternoon: cutter footwork. Keeping volume moderate until IT band resolves."},
    {"date": "2026-07-23", "event_type": "training", "content": "Film + strategy: reviewing opponents for August invitational. Three teams to study — all run different variations of vert stack. Notes prepared."},
    {"date": "2026-07-25", "event_type": "rest",     "content": "Rest. Deliberate. One week out from the invitational block — tapering starts now. Light stretching only."},
    {"date": "2026-07-26", "event_type": "game",     "content": "Pre-invitational tune-up. W 15–9. Clean game — no unforced errors in the first half. New split-stack set working beautifully. Team confidence is high going into August."},
    {"date": "2026-07-28", "event_type": "training", "content": "Taper week session 1. 30 min throwing — accuracy only. No conditioning. Legs feel fresh. Mentally focusing on execution details."},
    {"date": "2026-07-30", "event_type": "training", "content": "Taper session 2. Walk-through of set plays. Team sharp and focused. Energy for the invitational is exactly where it needs to be."},

    # ── AUGUST 2026 ──
    {"date": "2026-08-01", "event_type": "game",     "content": "Summer Invitational Day 1. Pool play: W 15–8, W 13–10, W 15–7. Three wins — clean execution across the board. Zone D shut down all three opponents in second halves. Team is peaking."},
    {"date": "2026-08-02", "event_type": "game",     "content": "Summer Invitational Day 2. Quarters: W 15–11. Semis: W 13–12 in sudden death. Incredible game — everything on the line. Scored the winning goal on a deep backhand huck. Finals tomorrow."},
    {"date": "2026-08-03", "event_type": "game",     "content": "Summer Invitational Finals. W 15–13. Champions. Best team performance of the season — disciplined, composed, executed under pressure. Tournament MVP awarded to the team as a whole. Unreal feeling."},
    {"date": "2026-08-05", "event_type": "rest",     "content": "Rest. Celebrating. Body is tired in the best way. Reviewing the weekend — lots of positives. Main area to keep improving: transition D after turnovers."},
    {"date": "2026-08-07", "event_type": "training", "content": "Return to training post-invitational. Light session. Throwing + walking through nationals prep concepts. Three weeks out from nationals — building the game plan now."},
    {"date": "2026-08-09", "event_type": "game",     "content": "League final — regular season closer. W 15–10. League champions. Consistent all season — went 11–1 in league play. Great foundation heading into nationals."},
    {"date": "2026-08-11", "event_type": "training", "content": "Nationals prep block begins. Focus: O-line discipline. Handler reset timing, stack spacing, recognising when to push vs reset. Two-hour full team session."},
    {"date": "2026-08-13", "event_type": "training", "content": "D-line: pressure and recovery. Force flick, bracket, and clam coverages. Drilled transition from D to O. Turnovers into transition scores — this is where games are won."},
    {"date": "2026-08-15", "event_type": "game",     "content": "Nationals warm-up tournament Day 1. Two games: W 15–9, W 13–11. Shaking off the rest-week rust. Second game was tighter — good test. Communication patterns are tight."},
    {"date": "2026-08-16", "event_type": "game",     "content": "Nationals warm-up tournament Day 2. Finals: W 15–12. Back-to-back tournament wins this month. Nationals confidence is real — this team is built for it."},
    {"date": "2026-08-18", "event_type": "training", "content": "Recovery + strategy review. Film of top nationals competitors. Identified two teams with unusual O-sets — prepping specific D responses. Notes distributed to team."},
    {"date": "2026-08-20", "event_type": "training", "content": "Full-intensity scrimmage. Simulating nationals game conditions: fatigue management, sub rotations, pressure moments. Best team scrimmage of the year."},
    {"date": "2026-08-22", "event_type": "rest",     "content": "Mandatory rest day. Physio confirmed IT band is resolved. Cleared for full nationals load. 8hrs sleep. Visualisation session — mental prep as important as physical."},
    {"date": "2026-08-24", "event_type": "training", "content": "Final tune-up before nationals. Crisp, clean, confident. Set plays ran perfectly. One week out — team is ready."},
    {"date": "2026-08-26", "event_type": "training", "content": "Light session. Throwing only. Nationals travel prep. Gear checked. Mental state: focused, calm, ready."},
    {"date": "2026-08-28", "event_type": "game",     "content": "Nationals Day 1. Pool play: W 15–10, W 13–8, L 12–15. Tough loss in game 3 — played a top-ranked team. Learned from it. Still qualified for bracket in strong position."},
    {"date": "2026-08-29", "event_type": "game",     "content": "Nationals Day 2. Quarters: W 15–13. Semis: L 11–15. Lost to eventual champions — they were on another level. Finished top 4 at nationals. Best result in team history."},
    {"date": "2026-08-30", "event_type": "game",     "content": "Nationals 3rd place game. W 15–11. Bronze medal. Proud performance — executed our game plan and showed what this team is capable of. Season complete. What a run."},

    # ── Monthly and weekly objectives ──
    {"date": "_obj:month:2026-05", "event_type": None, "content": "May: Build conditioning base, establish consistent throwing mechanics. Target: 3 sessions/week minimum. Fix backhand release under pressure. Finish top 4 in club tournament."},
    {"date": "_obj:month:2026-06", "event_type": None, "content": "June: 3 assists per game average. Qualify for regionals. Zone O execution — hit the pod timing consistently. Strength work 2x/week for posterior chain."},
    {"date": "_obj:month:2026-07", "event_type": None, "content": "July: Pressure situation training. Heat adaptation. IT band management — don't push through it. Win the invitational. Zone D cup adjustments locked in."},
    {"date": "_obj:month:2026-08", "event_type": None, "content": "August: Nationals. Top 4 finish. Peak physically and mentally. Trust the preparation. Transition D into O is the championship differentiator — execute it."},
    {"date": "_obj:week:2026-W19", "event_type": None, "content": "W19: Fix backhand release under mark pressure. 200+ throws. Club tournament this weekend — rest Thursday, be sharp Saturday."},
]

# ---------------------------------------------------------------------------
# Agent logs
# ---------------------------------------------------------------------------

agent_log_entries = [
    {
        "timestamp": datetime(2026, 5, 10, 20, 30, 0, tzinfo=timezone.utc),
        "action": "Post-game check-in processed",
        "reasoning": "Athlete completed post-game log after league game vs Spiral Dynamics. Identified reset discipline as key gap. Queried training_docs for reset positioning drills — retrieved 3 relevant chunks.",
        "vector_sources": ["https://usaultimate.org/coaching/handler-movement", "training_doc_chunk_12", "training_doc_chunk_34"],
        "event_type": "plan_update",
    },
    {
        "timestamp": datetime(2026, 5, 10, 20, 31, 15, tzinfo=timezone.utc),
        "action": "Coaching plan updated",
        "reasoning": "Short-term: Focus on dump-reset timing and communication. Medium-term: Develop handler under-cut release mechanics. Long-term: Build elite O-line composure. Based on 2 sessions and 1 game.",
        "vector_sources": [],
        "event_type": "plan_update",
    },
    {
        "timestamp": datetime(2026, 5, 25, 21, 0, 0, tzinfo=timezone.utc),
        "action": "Tournament summary ingested",
        "reasoning": "Two-day tournament complete. Athlete finished top 4. Electrolyte cramping noted in game 3 of Day 1 — flagged for conditioning plan. Stamina holding through 2 games but dropping in game 3.",
        "vector_sources": ["training_doc_chunk_7", "training_doc_chunk_19"],
        "event_type": "action",
    },
    {
        "timestamp": datetime(2026, 5, 25, 21, 1, 40, tzinfo=timezone.utc),
        "action": "Coaching plan updated — post tournament block",
        "reasoning": "Added endurance load management to medium-term plan. Electrolyte protocol added to pre-game checklist. Vector Search surfaced research on cramping in intermittent sport — integrated into advice.",
        "vector_sources": ["training_doc_chunk_41", "training_doc_chunk_42"],
        "event_type": "plan_update",
    },
    {
        "timestamp": datetime(2026, 6, 7, 21, 15, 0, tzinfo=timezone.utc),
        "action": "Monthly milestone reached — assists target hit",
        "reasoning": "Athlete logged 4 assists in June 7 game, achieving 3-assist-per-game target in game 1 of June. Positive reinforcement message sent via Telegram.",
        "vector_sources": [],
        "event_type": "action",
    },
    {
        "timestamp": datetime(2026, 6, 22, 22, 0, 0, tzinfo=timezone.utc),
        "action": "Regional qualifier debrief — runner-up result",
        "reasoning": "Transition D identified as primary failure mode in the final. Queried Vector Search for transition defence patterns — returned 4 high-relevance chunks on force-side recovery.",
        "vector_sources": ["training_doc_chunk_8", "training_doc_chunk_9", "training_doc_chunk_21", "training_doc_chunk_55"],
        "event_type": "action",
    },
    {
        "timestamp": datetime(2026, 6, 22, 22, 2, 10, tzinfo=timezone.utc),
        "action": "Coaching plan updated — post-regionals",
        "reasoning": "Short-term: Transition D from O turnover. Medium-term: Closing game composure, universe point scenarios. Long-term: Elite defender positioning in transition. Plan aligned with nationals timeline.",
        "vector_sources": [],
        "event_type": "plan_update",
    },
    {
        "timestamp": datetime(2026, 7, 5, 20, 45, 0, tzinfo=timezone.utc),
        "action": "Zone defence gap identified via session log",
        "reasoning": "Two consecutive tournament logs referenced the same gap: zone cup not stepping on short-field discs. RAG retrieved zone cup positioning guides — 3 chunks on cup footwork. Flagged in plan.",
        "vector_sources": ["training_doc_chunk_14", "training_doc_chunk_15", "training_doc_chunk_33"],
        "event_type": "action",
    },
    {
        "timestamp": datetime(2026, 7, 18, 10, 0, 0, tzinfo=timezone.utc),
        "action": "Proactive check-in — inactivity threshold reached",
        "reasoning": "No session logged in 48hrs. Scheduler triggered proactive message. Athlete responded with physio update — IT band tension. Plan updated to include band exercise protocol and reduced load.",
        "vector_sources": ["training_doc_chunk_28"],
        "event_type": "inactivity_check",
    },
    {
        "timestamp": datetime(2026, 7, 19, 22, 30, 0, tzinfo=timezone.utc),
        "action": "Pressure scenario session processed",
        "reasoning": "Athlete logged universe point win vs Gravity — directly attributed to pressure drill work from July 16. Positive feedback loop confirmed. Noted in long-term athlete profile.",
        "vector_sources": [],
        "event_type": "action",
    },
    {
        "timestamp": datetime(2026, 8, 3, 22, 0, 0, tzinfo=timezone.utc),
        "action": "Invitational championship — coaching plan updated",
        "reasoning": "Tournament win confirmed peak form. Athlete reached 3-tournament-win milestone. Updated long-term plan: nationals preparation block. Short-term: recovery and de-load. Medium-term: nationals scouting.",
        "vector_sources": ["training_doc_chunk_1", "training_doc_chunk_61"],
        "event_type": "plan_update",
    },
    {
        "timestamp": datetime(2026, 8, 3, 22, 1, 30, tzinfo=timezone.utc),
        "action": "Telegram notification sent — nationals qualification confirmed",
        "reasoning": "Invitational win locked nationals seeding. Sent congratulatory message and nationals prep overview to athlete via Telegram.",
        "vector_sources": [],
        "event_type": "action",
    },
    {
        "timestamp": datetime(2026, 8, 29, 22, 45, 0, tzinfo=timezone.utc),
        "action": "Season-end debrief — nationals top 4 result",
        "reasoning": "Athlete finished 3rd at nationals. Full season review: 11–1 league, back-to-back tournament wins, nationals bronze. Key growth areas logged: transition D, zone cup, pressure execution. All improved materially.",
        "vector_sources": ["training_doc_chunk_2", "training_doc_chunk_9", "training_doc_chunk_14"],
        "event_type": "plan_update",
    },
    {
        "timestamp": datetime(2026, 8, 29, 22, 47, 0, tzinfo=timezone.utc),
        "action": "Long-term coaching plan updated — off-season roadmap",
        "reasoning": "Generated off-season plan: 4-week de-load, strength base build Oct–Nov, technical skills camp in Dec. Grounded in full season data and athlete profile insights.",
        "vector_sources": [],
        "event_type": "plan_update",
    },
]

# ---------------------------------------------------------------------------
# Insert / upsert
# ---------------------------------------------------------------------------

now = datetime.now(timezone.utc)

print("Inserting calendar entries...")
for e in entries:
    cal.update_one(
        {"date": e["date"]},
        {"$set": {
            "date": e["date"],
            "content": e["content"],
            "event_type": e.get("event_type"),
            "source": "manual",
            "updated_at": now,
        }},
        upsert=True,
    )
print(f"  {len(entries)} calendar entries upserted.")

print("Inserting agent logs...")
logs.delete_many({})  # clear existing logs for clean seed
logs.insert_many([{**l} for l in agent_log_entries])
print(f"  {len(agent_log_entries)} agent logs inserted.")

# Also seed a coaching plan
print("Seeding coaching plan...")
db["coaching_plans"].update_one(
    {},
    {"$set": {
        "athlete_id": "demo",
        "short_term": "Continue transition D drills 2x/week. Maintain throwing volume through off-season base. Work handler resets under mark pressure — release point discipline is the priority.\n\nOff-season checkpoint: 3 sessions/week minimum through September.",
        "medium_term": "Build posterior chain strength (squats, Nordic curls, hip thrusts) for injury resilience. Develop zone O pod execution — timing on wing breaks. Introduce split-stack motion set as primary O-system.\n\nTarget: tournament-ready by March 2027.",
        "long_term": "Develop into a two-way player — elite handler and lockdown defender. Compete at nationals and medal. Build elite-level poise in universe point situations.\n\nSeason goal: nationals top 2 finish in 2027.",
        "sessions_since_update": 0,
        "updated_at": now,
    }},
    upsert=True,
)
print("  Coaching plan seeded.")

# Seed workflow state
db["workflow_state"].update_one(
    {},
    {"$set": {
        "athlete_id": "demo",
        "cycle_status": "updated",
        "last_activity": now,
        "updated_at": now,
    }},
    upsert=True,
)
print("  Workflow state seeded.")

print("\nDone. Seed complete.")
