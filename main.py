"""
Entry point. Run with: python main.py

Starts the Telegram bot and the background scheduler in the same event
loop, and wires the scheduler's proactive messages to go out through
the bot. Also sends a one-time greeting on startup, so the bot
announces itself every time the process starts or restarts.
"""
import asyncio
import logging

import config
from bot.telegram_bot import build_bot, send_proactive_message, STARTUP_MESSAGE
from scheduler.jobs import register_sender, start_scheduler

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger("nova-agent")


async def run() -> None:
    config.validate_config()

    app = build_bot()
    register_sender(send_proactive_message)
    start_scheduler()

    logger.info("Nova agent starting up. Listening for messages...")

    async with app:
        await app.start()
        await app.updater.start_polling()
        await send_proactive_message(STARTUP_MESSAGE)
        await asyncio.Event().wait()  # run forever until interrupted


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        logger.info("Shutting down.")