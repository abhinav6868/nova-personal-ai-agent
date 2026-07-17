"""
Telegram integration -- the "front door" from the architecture diagram.
Receives messages, forwards them to the agent, sends back the reply.
Also exposes send_proactive_message(), which the scheduler calls to
deliver messages the user didn't ask for (e.g. the morning briefing).

Restricted to a single user (TELEGRAM_USER_ID) since this is a personal
agent, not a public bot -- anyone else messaging it is ignored.
"""
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

import config
from agent.graph import run_agent
from tools.tools import list_notes, remember_fact

_app: Application | None = None

# Short-term memory: the last few turns of *this* conversation, so the
# agent can resolve "them"/"that"/"it" referring to something said a
# message ago. This is separate from the long-term ChromaDB memory --
# that's for durable facts across days; this is just recent context.
# Keyed by chat id, trimmed to the last few turns to keep token usage
# and latency bounded rather than growing forever.
_conversation_history: dict[str, list] = {}
MAX_HISTORY_TURNS = 6  # 6 messages = ~3 back-and-forth exchanges


def _get_history(chat_id: str) -> list:
    return _conversation_history.get(chat_id, [])


def _update_history(chat_id: str, user_text: str, reply: str) -> None:
    history = _conversation_history.setdefault(chat_id, [])
    history.append({"role": "user", "content": user_text})
    history.append({"role": "assistant", "content": reply})
    # Trim from the front so it never grows unbounded
    del history[:-MAX_HISTORY_TURNS * 2]


WELCOME_MESSAGE = (
    "Hey! This is Nova. How can I help you today?\n\n"
    "You can just talk to me normally, or use these shortcuts:\n"
    "/notes -- see your open notes\n"
    "/remember <something> -- save a fact to long-term memory\n"
    "/search <query> -- search the web"
)

# Sent once, automatically, whenever the bot process starts or restarts --
# separate from WELCOME_MESSAGE (which only fires when the user explicitly
# sends /start). Kept short since it's unprompted.
STARTUP_MESSAGE = "Hey, it's Nova! How can I help you today?"


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if str(update.effective_user.id) != config.TELEGRAM_USER_ID:
        return
    await _send_reply(update, WELCOME_MESSAGE)


async def notes_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Quick shortcut that calls the tool directly, skipping the LLM --
    faster and deterministic for a simple lookup like this."""
    if str(update.effective_user.id) != config.TELEGRAM_USER_ID:
        return
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    result = list_notes.invoke({})
    await _send_reply(update, result)


async def remember_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if str(update.effective_user.id) != config.TELEGRAM_USER_ID:
        return
    fact = " ".join(context.args)
    if not fact:
        await update.message.reply_text("Usage: /remember <something to remember>")
        return
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    result = remember_fact.invoke({"fact": fact})
    await _send_reply(update, result)


async def search_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if str(update.effective_user.id) != config.TELEGRAM_USER_ID:
        return
    query = " ".join(context.args)
    if not query:
        await update.message.reply_text("Usage: /search <query>")
        return
    chat_id = str(update.effective_chat.id)
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    # Routed through the full agent (not a raw tool call) so the result is
    # synthesized into a readable answer, same as natural-language search.
    user_text = f"Search the web for: {query}"
    try:
        result = run_agent(user_text, chat_history=_get_history(chat_id))
        _update_history(chat_id, user_text, result)
    except Exception as e:
        result = _friendly_error(e)
    await _send_reply(update, result)


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
    if "recursion limit" in text.lower():
        return (
            "I got stuck trying to work that out and couldn't land on an "
            "answer. Could you rephrase, or be a bit more specific about "
            "what you mean?"
        )
    return f"Something went wrong on my end: {text}"


TELEGRAM_MAX_LEN = 4000  # Telegram's real cap is 4096; leave a safety margin


async def _send_reply(update: Update, text: str) -> None:
    """Telegram rejects any single message over 4096 characters, so long
    replies are chunked. Also renders lightweight Markdown (the system
    prompt asks the model for *bold* emphasis) but falls back to plain
    text per-chunk if the model produces malformed Markdown that Telegram
    can't parse -- better a plain reply than a silent failure."""
    for i in range(0, len(text), TELEGRAM_MAX_LEN):
        chunk = text[i:i + TELEGRAM_MAX_LEN]
        try:
            await update.message.reply_text(chunk, parse_mode="Markdown")
        except Exception:
            await update.message.reply_text(chunk)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if str(update.effective_user.id) != config.TELEGRAM_USER_ID:
        return  # ignore anyone who isn't the configured owner

    chat_id = str(update.effective_chat.id)
    user_text = update.message.text
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")

    try:
        reply = run_agent(user_text, chat_history=_get_history(chat_id))
        _update_history(chat_id, user_text, reply)
    except Exception as e:
        reply = _friendly_error(e)

    await _send_reply(update, reply)


async def send_proactive_message(text: str) -> None:
    """Called by the scheduler to push a message the user didn't request,
    and also by main.py once at startup to send the greeting."""
    if _app is None:
        return
    await _app.bot.send_message(chat_id=config.TELEGRAM_USER_ID, text=text)


def build_bot() -> Application:
    global _app
    _app = Application.builder().token(config.TELEGRAM_BOT_TOKEN).build()
    _app.add_handler(CommandHandler("start", start_command))
    _app.add_handler(CommandHandler("notes", notes_command))
    _app.add_handler(CommandHandler("remember", remember_command))
    _app.add_handler(CommandHandler("search", search_command))
    _app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    return _app