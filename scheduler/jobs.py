"""
Background jobs that run on their own, without the user asking first.
This is the "autonomy" half of the project -- everything in agent/graph.py
only runs when a message arrives. This module makes the agent take
initiative on a schedule instead.

send_message is injected from bot/telegram_bot.py at startup so this
module doesn't need to import the bot directly (avoids a circular import
and keeps the scheduler testable on its own).
"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from agent.graph import run_agent
from tools.tools import list_notes

scheduler = AsyncIOScheduler()
_send_message = None  # set via register_sender()


def register_sender(send_fn) -> None:
    """Wire up how the scheduler delivers proactive messages -- e.g. the
    Telegram bot's send function. Keeps this module decoupled from Telegram
    specifically, so a different channel could be swapped in later."""
    global _send_message
    _send_message = send_fn


async def morning_briefing() -> None:
    """Runs every morning: asks the agent to summarize open notes into a
    short briefing, then proactively sends it. This is the concrete
    'agent that texts you on its own' behavior."""
    if _send_message is None:
        return
    notes = list_notes.invoke({})
    summary = run_agent(
        f"Here are my current open notes: {notes}\n"
        f"Write me a short, friendly morning briefing based on these -- "
        f"1-3 sentences, no fluff."
    )
    await _send_message(summary)


def start_scheduler() -> None:
    """Registers all recurring jobs and starts the scheduler. Add new
    autonomous behaviors here as new cron triggers."""
    scheduler.add_job(
        morning_briefing,
        CronTrigger(hour=8, minute=0),
        id="morning_briefing",
        replace_existing=True,
    )
    scheduler.start()