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
   the result to you -- proactive, not purely reactive.

## Architecture

```
Telegram --> LangGraph agent --> [ MCP tool server | ChromaDB memory | APScheduler ]
                  |
                  v
             Gemini API (free tier, reasoning engine)
```

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
   ```
   pip install -r requirements.txt
   ```

2. **Get a free Gemini API key**
   Go to [aistudio.google.com](https://aistudio.google.com) -> "Get API
   key". No credit card required.

3. **Create a Telegram bot**
   Message [@BotFather](https://t.me/BotFather) on Telegram, send
   `/newbot`, follow the prompts, and copy the token it gives you.

4. **Get your Telegram user id**
   Message [@userinfobot](https://t.me/userinfobot) -- it replies with
   your numeric id.

5. **Configure secrets**
   ```
   cp .env.example .env
   ```
   Fill in `GOOGLE_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_USER_ID`.

6. **Run it**
   ```
   python main.py
   ```
   Message your bot on Telegram. It should reply.

## Trying the MCP server standalone

The tools are also runnable as a standalone MCP server, independent of
the Telegram agent:
```
python tools/mcp_server.py
```

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
