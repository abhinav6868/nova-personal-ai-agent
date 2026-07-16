"""
Exposes the agent's tools over the Model Context Protocol (MCP), instead
of only as in-process Python functions.

Why this matters for the project (and for interviews): MCP is the
standard that lets an agent discover and call tools from a SEPARATE
process/service over a well-defined protocol -- the same pattern used
by production agent platforms to plug in tools without hardcoding them.
Running this as its own server means, in principle, any MCP-compatible
client (not just this specific agent) could connect to it and use these
tools. That's the point: tools become swappable infrastructure, not
code baked into one script.

Run standalone with:
    python tools/mcp_server.py
"""
from datetime import datetime

from mcp.server.fastmcp import FastMCP

from tools.tools import _load_notes, _save_notes
from memory.store import recall, remember
from duckduckgo_search import DDGS

mcp = FastMCP("nova-agent-tools")


@mcp.tool()
def web_search(query: str) -> str:
    """Search the web for current information."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=4))
        if not results:
            return "No results found."
        return "\n".join(f"- {r['title']}: {r['body'][:200]}" for r in results)
    except Exception as e:
        return f"Search failed: {e}"


@mcp.tool()
def add_note(content: str) -> str:
    """Add a to-do item or note for the user."""
    notes = _load_notes()
    notes.append({"content": content, "created_at": datetime.now().isoformat(), "done": False})
    _save_notes(notes)
    return f"Added note: {content}"


@mcp.tool()
def list_notes() -> str:
    """List the user's current open notes/to-dos."""
    notes = [n for n in _load_notes() if not n["done"]]
    if not notes:
        return "No open notes."
    return "\n".join(f"- {n['content']}" for n in notes)


@mcp.tool()
def remember_fact(fact: str) -> str:
    """Save a fact about the user permanently to long-term memory."""
    remember(fact, source="mcp_client")
    return "Got it, I'll remember that."


@mcp.tool()
def recall_facts(query: str) -> str:
    """Search long-term memory for facts relevant to a query."""
    facts = recall(query)
    if not facts:
        return "Nothing relevant found in memory."
    return "\n".join(f"- {f}" for f in facts)


if __name__ == "__main__":
    mcp.run(transport="stdio")
