"""
Tests for long-term memory (memory/store.py: remember, recall).

Uses an isolated, temporary ChromaDB collection per test rather than the
real persisted one, so tests never pollute (or depend on) actual memory
data and can run in any order.
"""
import chromadb
import pytest

from memory import store as store_module


@pytest.fixture
def isolated_memory(tmp_path, monkeypatch):
    """Swap in a fresh, temporary ChromaDB client/collection for the
    duration of a single test."""
    test_client = chromadb.PersistentClient(path=str(tmp_path))
    test_collection = test_client.get_or_create_collection(name="test_memory")
    monkeypatch.setattr(store_module, "_client", test_client)
    monkeypatch.setattr(store_module, "_collection", test_collection)
    return test_collection


def test_remember_stores_a_fact(isolated_memory):
    store_module.remember("User prefers concise answers")
    assert isolated_memory.count() == 1


def test_recall_finds_semantically_relevant_fact(isolated_memory):
    store_module.remember("User is building an AI agent for their resume")
    store_module.remember("User's favorite color is blue")

    results = store_module.recall("what project is the user working on?")

    assert any("agent" in fact.lower() or "resume" in fact.lower() for fact in results)


def test_recall_on_empty_memory_returns_empty_list(isolated_memory):
    results = store_module.recall("anything at all")
    assert results == []


def test_recall_respects_top_k_limit(isolated_memory):
    for i in range(10):
        store_module.remember(f"Fact number {i}")

    results = store_module.recall("fact", top_k=3)
    assert len(results) <= 3