# PowerPosition — Product Requirements

## Problem Statement

Competitive ultimate frisbee players who self-train have no access to structured, personalized coaching — no one to build their plan, prep them before a game, or debrief them after. PowerPosition puts a coaching agent in their pocket via Telegram, with a web dashboard to track their progress and watch their plan evolve over time.

---

## User Stories

### Epic: Landing & Navigation

- As a first-time visitor, I want an engaging intro screen so that I understand what PowerPosition is before I explore it.
  - [ ] Landing page displays the PowerPosition title, a subtitle describing the product, and a prominent "Explore" button
  - [ ] Clicking "Explore" transitions to the Calendar screen with the left nav now visible
  - [ ] Left nav shows three items: Calendar, Coaching Plan, Config
  - [ ] Visual style is deep space / sci-fi: dark background, atmospheric design

- As a returning athlete, I want persistent navigation so that I can move between screens without losing my place.
  - [ ] Left nav is visible on all three main screens
  - [ ] Active screen is visually highlighted in the nav

---

### Epic: Calendar

- As an athlete, I want to see my training history on a calendar so that I can track what I've done over time.
  - [ ] Calendar displays a monthly grid view
  - [ ] Dates with logged sessions or events are visually marked (distinct from empty dates)
  - [ ] When no data exists, the calendar shows an empty grid with no placeholder content

- As an athlete, I want to log a session or note directly on a calendar date so that I can annotate my training from the web.
  - [ ] Tapping any calendar date opens a popup
  - [ ] Popup is a diary-style input — freeform text where the athlete can write session notes, key events, or daily objectives
  - [ ] Saving the popup stores the entry to that date
  - [ ] A date with a saved entry is visually marked on the calendar grid

- As an athlete, I want Telegram conversation summaries to automatically appear on my calendar so that my bot conversations are reflected without re-entry.
  - [ ] When the agent processes a Telegram session log, the summary is written to the calendar popup for the relevant date
  - [ ] Agent-populated content and manually-entered content coexist in the same popup
  - [ ] There is no visible distinction required between sources (both are just diary content)

---

### Epic: Coaching Plan

- As an athlete, I want to see a personalized training plan so that I know what to focus on across different time horizons.
  - [ ] Coaching Plan screen shows three clearly labeled sections: Short-Term, Medium-Term, Long-Term
  - [ ] Each section displays agent-generated plan text
  - [ ] If no sessions have been logged yet, all three sections display the empty state: "Add more session logs to reveal insights"
  - [ ] Plan content updates automatically after each post-game check-in is processed

- As an athlete, I want to see a log of what the agent has done and why so that I understand how my plan is evolving.
  - [ ] An Agent Logs section appears below the three plan sections on the Coaching Plan screen
  - [ ] Each log entry contains four fields: timestamp, action summary, reasoning, and Vector Search sources consulted (if any)
  - [ ] Log entries include checkpoint events — e.g., "Workflow resumed from checkpoint after restart" — making MongoDB's role as the state engine visible
  - [ ] Log entries are displayed in reverse-chronological order (newest first)
  - [ ] When no agent actions have occurred yet, the section shows an appropriate empty state

- As an athlete, I want to see where I am in the coaching cycle so that I know what the agent is working on.
  - [ ] A Cycle Status indicator is visible on the Coaching Plan screen
  - [ ] Status cycles through four states: Awaiting next session → Session logged → Analyzing → Plan updated
  - [ ] Status reflects the actual current state of the improvement loop in real time

- As an athlete, I want to be notified on Telegram when my coaching plan updates so that I know without checking the app.
  - [ ] After each post-game check-in is processed and the plan updates, the agent sends a Telegram message confirming the update

---

### Epic: Telegram Bot

- As an athlete, I want to receive pre-game mental prep advice on Telegram so that I'm ready before a big game.
  - [ ] Bot sends a pre-game message before a scheduled game event
  - [ ] Message contains advice and mental prep notes tailored to the athlete's history
  - [ ] For the demo: this flow is demonstrated via a live simulated conversation with the agent (not an automated trigger)

- As an athlete, I want the bot to check in after a game so that my result gets logged and feeds into my training plan.
  - [ ] Bot initiates a post-game check-in after a game ends
  - [ ] Bot opens with a "how did it go?" style question
  - [ ] Bot follows up with 2–3 contextual questions informed by the athlete's session history and prior logs
  - [ ] After the check-in concludes, the coaching plan updates and the athlete receives a Telegram confirmation message
  - [ ] For the demo: this flow is demonstrated via a live simulated conversation with the agent

- As an athlete, I want to log a training session via Telegram so that I can record my work without opening the web app.
  - [ ] Athlete initiates a session log by messaging the bot
  - [ ] Bot collects session details conversationally
  - [ ] After the conversation, the session appears in the web calendar for the relevant date

---

### Epic: Configuration & Connections

- As an athlete, I want to connect my Telegram account so that the bot knows who I am.
  - [ ] Config screen includes a Telegram section with a setup/connect flow
  - [ ] Once connected, Telegram shows as active

- As an athlete, I want to see what integrations are available so that I know what the app can support in the future.
  - [ ] Config screen shows a Calendar integration entry with a greyed-out toggle and a non-functional "Connect" button
  - [ ] Config screen shows a Strava integration entry with a greyed-out toggle and a non-functional "Connect" button
  - [ ] Greyed-out state is visually clear — present but obviously inactive

---

## What We're Building

Everything below must be complete and demoable at the end of 3–4 hours:

1. **Landing page** — title, subtitle, "Explore" CTA. Deep space / sci-fi aesthetic throughout.
2. **Left nav** — Calendar, Coaching Plan, Config. Active state visible.
3. **Calendar screen** — monthly grid, date popup supporting manual input and agent-populated summaries from Telegram. Dates with entries visually marked.
4. **Coaching Plan screen** — three plan sections (Short/Medium/Long-Term) with agent-generated text + empty state. Cycle Status indicator showing current state of the improvement loop. Agent Logs section with timestamp, action summary, reasoning, Vector Search sources, and checkpoint/resume events.
5. **Telegram bot** — pre-game advice, post-game adaptive check-in (2–3 follow-up questions), and session logging. Plan-update notification sent after check-in.
6. **Config screen** — Telegram setup (live), Calendar and Strava as greyed-out toggles.
7. **MongoDB showcase** — Vector Search sources visible in agent logs, checkpoint events showing MongoDB as the state engine, Cycle Status showing the persistent multi-step workflow.

---

## What We'd Add With More Time

- **Automated pre/post-match triggers** — real calendar-event-driven messages (1hr before/after) instead of simulated demo conversations
- **On-demand Telegram queries** — athlete can ask the bot about their history, request stats, or query past sessions by date
- **Full Google Calendar sync** — live two-way sync with the athlete's calendar
- **Full Strava integration** — pull workout data automatically rather than manual logging
- **Multi-sport configuration** — sport-agnostic settings layer so the agent works for sports beyond ultimate frisbee
- **Athlete onboarding flow** — structured intake (goals, position, experience) to seed the first coaching plan before any sessions are logged

---

## Non-Goals

1. **Automated event triggers** — pre/post-match messages are simulated for the demo; real trigger logic (calendar event detection, time-based scheduling) is post-hackathon
2. **Strava OAuth** — shown in Config UI only; no live data pull
3. **Google Calendar sync** — shown in Config UI only; calendar entries come from Telegram summaries and manual input
4. **Multi-sport support** — all agent prompts and training material are ultimate frisbee only
5. **Video / form analysis** — no real-time or recorded movement feedback of any kind

---

## Open Questions

1. **What ultimate frisbee training material is pre-loaded for Vector Search?** — drills docs, strategy guides, conditioning plans? This needs to be decided before /spec so the RAG setup is scoped correctly. *Answer before /spec.*
2. **How many sessions does the agent need before it generates a first coaching plan?** — is there a minimum threshold, or does it generate something after session 1? *Can wait until build.*
3. **What does the Telegram setup step look like in the Config screen?** — bot token input, QR code, deep link? *Can wait for /spec.*
