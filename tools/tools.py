"""
Tools the agent can call. Each one is a plain Python function wrapped
with LangChain's @tool decorator, which auto-generates the JSON schema
the LLM needs to know *when* and *how* to call it -- this is the same
mechanism that underlies MCP tool definitions, just without the extra
process boundary. (See tools/mcp_server.py for the MCP-wrapped version
of these same tools, exposed over the actual MCP protocol.)

Keeping the tool logic here, separate from the MCP transport layer,
means the same functions are usable directly (fast, in-process) or via
MCP (standardised, swappable) without duplicating logic.
"""
import json
import os
from datetime import datetime

from duckduckgo_search import DDGS
from langchain_core.tools import tool

from memory.store import recall, remember

NOTES_FILE = os.path.join(os.path.dirname(__file__), "notes.json")


def _load_notes() -> list[dict]:
    if not os.path.exists(NOTES_FILE):
        return []
    with open(NOTES_FILE, "r") as f:
        return json.load(f)


def _save_notes(notes: list[dict]) -> None:
    with open(NOTES_FILE, "w") as f:
        json.dump(notes, f, indent=2)


@tool
def web_search(query: str) -> str:
    """Search the web for current information (news, facts, prices, anything
    not already known). Use this when the user asks about something recent
    or specific that you can't answer from memory alone."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=4))
        if not results:
            return "No results found."
        formatted = "\n".join(
            f"- {r['title']}: {r['body'][:200]}" for r in results
        )
        return formatted
    except Exception as e:
        return f"Search failed: {e}"


@tool
def add_note(content: str) -> str:
    """Add a to-do item or note for the user to remember later. Use this
    when the user asks you to remind them of something or track a task."""
    notes = _load_notes()
    notes.append({
        "content": content,
        "created_at": datetime.now().isoformat(),
        "done": False,
    })
    _save_notes(notes)
    return f"Added note: {content}"


@tool
def list_notes() -> str:
    """List the user's current open notes/to-dos."""
    notes = [n for n in _load_notes() if not n["done"]]
    if not notes:
        return "No open notes."
    return "\n".join(f"- {n['content']}" for n in notes)


@tool
def remember_fact(fact: str) -> str:
    """Save a fact about the user permanently to long-term memory, so it can
    be recalled in future conversations. Use this when the user shares a
    preference, a recurring detail, or something worth remembering long-term
    (e.g. 'I work night shifts', 'my deadline is the 14th')."""
    remember(fact, source="agent_noted")
    return "Got it, I'll remember that."


@tool
def recall_facts(query: str) -> str:
    """Search long-term memory for facts relevant to the current
    conversation. Use this at the start of a task if the user references
    something you might already know about them."""
    facts = recall(query)
    if not facts:
        return "Nothing relevant found in memory."
    return "\n".join(f"- {f}" for f in facts)


ALL_TOOLS = [web_search, add_note, list_notes, remember_fact, recall_facts]
