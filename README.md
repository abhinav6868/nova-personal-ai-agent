# Nova Agent

A personal AI agent that lives in Telegram, reasons through multi-step
tasks using [LangGraph](https://langchain-ai.github.io/langgraph/),
remembers things about you long-term via ChromaDB, exposes its tools
over the [Model Context Protocol](https://modelcontextprotocol.io), and
runs proactive background jobs -- so it can text *you*, not just the
other way around.

## Why this exists

Most "AI chatbot" projects are a single LLM call wrapped in a UI. This
project is different in three specific ways:

1. **Agentic, not single-turn.** The core loop (`agent/graph.py`) lets
   the model decide which tools to call, call them, look at the result,
   and decide again -- looping until the task is actually done, not
   just until one response is generated.
2. **Has memory across sessions.** Facts the agent learns about you are
   embedded and stored in ChromaDB (`memory/store.py`), so it can recall
   them in a conversation days later, not just within one chat.
3. **Runs without being asked.** `scheduler/jobs.py` uses APScheduler to
   run the agent on a timer (e.g. a daily morning briefing), and pushes
   the result to you -- proactive, not purely reactive. Confirmed working
   in practice: the agent has sent unprompted reminders based on open notes.

## Architecture
Telegram --> LangGraph agent --> [ MCP tool server | ChromaDB memory | APScheduler ]
|
v
Groq (openai/gpt-oss-120b, free tier, reasoning engine)
- `bot/telegram_bot.py` -- receives/sends messages via Telegram
- `agent/graph.py` -- the LangGraph state machine (the "brain")
- `tools/tools.py` -- tool functions (web search, notes, memory)
- `tools/mcp_server.py` -- the same tools, exposed over real MCP so any
  MCP-compatible client could use them, not just this agent
- `memory/store.py` -- long-term memory backed by ChromaDB
- `scheduler/jobs.py` -- autonomous background jobs (APScheduler)
- `main.py` -- wires everything together and starts the bot

## Setup

1. **Install dependencies**
pip install -r requirements.txt
2. **Get a free Groq API key**
   Go to [console.groq.com](https://console.groq.com) -> API Keys ->
   Create API Key. No credit card required.

3. **Create a Telegram bot**
   Message [@BotFather](https://t.me/BotFather) on Telegram, send
   `/newbot`, follow the prompts, and copy the token it gives you.

4. **Get your Telegram user id**
   Message [@userinfobot](https://t.me/userinfobot) -- it replies with
   your numeric id.

5. **Configure secrets**
python main.py
Message your bot on Telegram. It should reply.

## Trying the MCP server standalone

The tools are also runnable as a standalone MCP server, independent of
the Telegram agent:
## Design decisions and things I learned building this

- **Started on Gemini's free tier, migrated to Groq.** Gemini's free tier
  caps at 20 requests/day per model on a fresh project -- fine for a demo,
  not for active development. Groq's free tier is dramatically more
  generous and noticeably faster, at zero cost.
- **Switched from Llama 3.3 to `openai/gpt-oss-120b`.** Llama occasionally
  emitted malformed tool-call syntax (writing out `<function=...>` as text
  instead of a structured tool call), which Groq's API rejected with a 400.
  OpenAI's open-weight models have more consistent structured tool-calling.
  `agent/graph.py` also retries automatically on this specific failure mode.
- **Telegram messages are capped at 4096 characters.** Long agent replies
  (e.g. detailed search summaries) can exceed this and crash the send call
  if unhandled. `bot/telegram_bot.py` chunks long replies instead.
- **The system prompt injects the current date/time on every call**, since
  the LLM has no built-in clock and would otherwise guess or refuse.

## Notes

- ChromaDB downloads a small embedding model on first run (a few MB) --
  this needs a normal internet connection the first time.
- The scheduler's morning briefing runs at 08:00 server time by default
  -- change the `CronTrigger` in `scheduler/jobs.py` to adjust.
- Only the Telegram user id in `.env` is allowed to talk to the bot;
  everyone else's messages are silently ignored.

## Possible extensions

- Swap Telegram for WhatsApp or add a second channel
- Add more MCP tools (calendar, email triage, GitHub notifications)
- Add evaluation tests for the agent's tool-selection accuracy
- Deploy on Railway/Fly.io for 24/7 uptime instead of running locally