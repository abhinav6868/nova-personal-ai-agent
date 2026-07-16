"""
Tests for the agent graph structure (agent/graph.py).

These check the graph is wired correctly (nodes exist, tool-calling loop
is connected) without making a real call to the LLM -- fast structural
tests, not integration tests.
"""
from agent.graph import build_agent
from tools.tools import ALL_TOOLS


def test_graph_compiles_without_error():
    graph = build_agent()
    assert graph is not None


def test_graph_has_expected_nodes():
    graph = build_agent()
    node_names = set(graph.nodes.keys())

    assert "agent" in node_names
    assert "tools" in node_names


def test_all_tools_are_registered():
    tool_names = {tool.name for tool in ALL_TOOLS}

    expected = {"web_search", "add_note", "list_notes", "remember_fact", "recall_facts"}
    assert expected.issubset(tool_names)


def test_every_tool_has_a_description():
    """Tool descriptions are what the LLM reads to decide when to call a
    tool -- a missing docstring silently breaks tool selection, so this
    is worth guarding against."""
    for tool in ALL_TOOLS:
        assert tool.description, f"{tool.name} is missing a description"