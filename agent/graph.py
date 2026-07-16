"""
The agent's reasoning loop, built with LangGraph.

This is the piece that makes this a genuine *agent* rather than a
request/response wrapper around an LLM. A plain LLM call takes a prompt
and returns text -- it can't act. This graph gives the model a loop:

    1. Look at the conversation so far.
    2. Decide: can I answer directly, or do I need a tool?
    3. If a tool is needed, call it, feed the result back in, and go to 1.
    4. Once no more tools are needed, return the final answer.

That loop -- "keep calling tools until the task is actually done" -- is
what "agentic" means in practice. LangGraph represents this as a small
graph of nodes ("agent" and "tools") with an edge that keeps routing
back to the agent node until it decides to stop.
"""
from datetime import datetime

from langchain_core.messages import SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode, tools_condition

import config
from tools.tools import ALL_TOOLS


def _build_system_prompt() -> SystemMessage:
    """Rebuilt fresh each run (not module-load time) so the date/time is
    always accurate, even if the process stays alive for days."""
    now = datetime.now().strftime("%A, %B %d, %Y at %H:%M")
    return SystemMessage(content=(
        f"You are Nova, the user's personal AI agent. The current date and "
        f"time is {now} -- use this directly, never say you don't know the "
        f"date. You have tools for web search, notes/to-dos, and long-term "
        f"memory. Use web_search for anything current (news, prices, recent "
        f"events) rather than answering from what you already know -- your "
        f"training data can be outdated. Use recall_facts when the user "
        f"references something you might already know about them. Use "
        f"remember_fact when they share a lasting preference or detail. "
        f"When you use a tool, call it directly through the tool-calling "
        f"mechanism -- never write out a function call as plain text. Be "
        f"concise -- you're replying inside a chat app, not writing an essay."
    ))

llm = ChatGroq(
    model=config.LLM_MODEL,
    api_key=config.GROQ_API_KEY,
    temperature=0.4,
)
llm_with_tools = llm.bind_tools(ALL_TOOLS)


def agent_node(state: MessagesState) -> dict:
    """The 'thinking' step: given the conversation so far, decide whether
    to respond directly or call a tool."""
    messages = [_build_system_prompt()] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def build_agent():
    """Assembles the graph: agent -> (tools -> agent)* -> end.
    tools_condition inspects the last AI message -- if it requested a tool
    call, route to the tools node; otherwise route straight to END."""
    graph = StateGraph(MessagesState)
    graph.add_node("agent", agent_node)
    graph.add_node("tools", ToolNode(ALL_TOOLS))

    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", tools_condition)
    graph.add_edge("tools", "agent")

    return graph.compile()


# Compiled once at import time and reused across every message --
# building the graph is cheap but there's no reason to redo it per call.
agent_executor = build_agent()


def run_agent(user_message: str, chat_history: list | None = None) -> str:
    """Runs one full turn of the agent loop for a single user message and
    returns the final text reply. chat_history lets the caller pass in
    prior turns for short-term conversational context.

    Retries on 'tool_use_failed' errors -- Llama occasionally emits a
    malformed function-call format instead of a proper structured tool
    call, which Groq rejects with a 400. This is usually a one-off glitch
    that a clean retry resolves, rather than a real bug."""
    messages = (chat_history or []) + [{"role": "user", "content": user_message}]

    last_error = None
    for attempt in range(3):
        try:
            result = agent_executor.invoke({"messages": messages})
            return result["messages"][-1].content
        except Exception as e:
            last_error = e
            if "tool_use_failed" not in str(e):
                raise  # not the glitch we're handling -- surface it immediately

    raise last_error