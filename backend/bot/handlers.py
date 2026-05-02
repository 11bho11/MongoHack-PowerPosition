from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

from telegram import Update
from telegram.ext import ContextTypes
from agent.graph import invoke_graph


async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    athlete_id = str(update.effective_chat.id)
    response = invoke_graph(
        task_type="session_log",
        athlete_id=athlete_id,
        message="/start — new athlete onboarding. Please ask the 3 onboarding questions."
    )
    await update.message.reply_text(response)


async def pregame_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    athlete_id = str(update.effective_chat.id)
    response = invoke_graph(
        task_type="pre_game",
        athlete_id=athlete_id,
        message="I have a game coming up. Give me pre-game mental prep."
    )
    await update.message.reply_text(response)


async def postgame_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    athlete_id = str(update.effective_chat.id)
    response = invoke_graph(
        task_type="post_game",
        athlete_id=athlete_id,
        message="The game just ended. Check in with me about how it went."
    )
    await update.message.reply_text(response)


async def log_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    athlete_id = str(update.effective_chat.id)
    # Get any text after /log command
    text = update.message.text
    log_text = text[4:].strip() if text.startswith("/log") else "Log a new training session."
    if not log_text:
        log_text = "I want to log a training session."
    response = invoke_graph(
        task_type="session_log",
        athlete_id=athlete_id,
        message=log_text
    )
    await update.message.reply_text(response)


async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    athlete_id = str(update.effective_chat.id)
    message = update.message.text
    # Default to session_log for unrecognized messages
    response = invoke_graph(
        task_type="session_log",
        athlete_id=athlete_id,
        message=message
    )
    await update.message.reply_text(response)
