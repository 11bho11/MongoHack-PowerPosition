from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

import os
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters

_bot_app = None

def get_bot():
    """Returns the telegram Bot instance if initialized, else None."""
    if _bot_app is None:
        return None
    return _bot_app.bot

async def run_bot():
    global _bot_app
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token or token == "YOUR_TOKEN_HERE":
        print("WARNING: TELEGRAM_BOT_TOKEN not set. Bot will not start.")
        return

    from bot.handlers import start_handler, pregame_handler, postgame_handler, log_handler, message_handler

    _bot_app = ApplicationBuilder().token(token).build()
    _bot_app.add_handler(CommandHandler("start", start_handler))
    _bot_app.add_handler(CommandHandler("pregame", pregame_handler))
    _bot_app.add_handler(CommandHandler("postgame", postgame_handler))
    _bot_app.add_handler(CommandHandler("log", log_handler))
    _bot_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))

    await _bot_app.initialize()
    await _bot_app.start()
    await _bot_app.updater.start_polling()
    # Keep running until stopped
    import asyncio
    try:
        while True:
            await asyncio.sleep(1)
    except asyncio.CancelledError:
        pass
    finally:
        await _bot_app.updater.stop()
        await _bot_app.stop()
        await _bot_app.shutdown()
