"""
Telegram integration -- the "front door" from the architecture diagram.
Receives messages, forwards them to the agent, sends back the reply.
Also exposes send_proactive_message(), which the scheduler calls to
deliver messages the user didn't ask for (e.g. the morning briefing).

Restricted to a single user (TELEGRAM_USER_ID) since this is a personal
agent, not a public bot -- anyone else messaging it is ignored.
"""
from telegram import Update
from telegram.ext import Application, MessageHandler, ContextTypes, filters

import config
from agent.graph import run_agent

_app: Application | None = None


def _friendly_error(e: Exception) -> str:
    """Translate common failure modes into a message a user can actually
    act on, instead of raw API/JSON dumps. Falls back to the raw error
    for anything unrecognized, so nothing is silently swallowed."""
    text = str(e)
    if "429" in text or "quota" in text.lower() or "rate limit" in text.lower():
        return (
            "I've hit Groq's free-tier rate limit, so I can't think right "
            "now. This resets on its own -- try again in a bit."
        )
    return f"Something went wrong on my end: {text}"


TELEGRAM_MAX_LEN = 4000  # Telegram's real cap is 4096; leave a safety margin


async def _send_reply(update: Update, text: str) -> None:
    """Telegram rejects any single message over 4096 characters. Split
    long replies into chunks instead of crashing mid-send."""
    for i in range(0, len(text), TELEGRAM_MAX_LEN):
        await update.message.reply_text(text[i:i + TELEGRAM_MAX_LEN])


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if str(update.effective_user.id) != config.TELEGRAM_USER_ID:
        return  # ignore anyone who isn't the configured owner

    user_text = update.message.text
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")

    try:
        reply = run_agent(user_text)
    except Exception as e:
        reply = _friendly_error(e)

    await _send_reply(update, reply)


async def send_proactive_message(text: str) -> None:
    """Called by the scheduler to push a message the user didn't request."""
    if _app is None:
        return
    await _app.bot.send_message(chat_id=config.TELEGRAM_USER_ID, text=text)


def build_bot() -> Application:
    global _app
    _app = Application.builder().token(config.TELEGRAM_BOT_TOKEN).build()
    _app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    return _app