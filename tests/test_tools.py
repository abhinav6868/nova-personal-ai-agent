"""
Tests for the notes tool (tools/tools.py: add_note, list_notes).

These test the actual file I/O logic, not the LLM -- no API key needed,
runs fast, and is exactly the kind of test that's cheap to run before
every commit.
"""
import json

import pytest

from tools import tools as tools_module


@pytest.fixture
def isolated_notes_file(tmp_path, monkeypatch):
    """Point the tool at a throwaway file for this test only, so tests
    never touch (or depend on) the user's real notes.json."""
    fake_path = tmp_path / "notes.json"
    monkeypatch.setattr(tools_module, "NOTES_FILE", str(fake_path))
    return fake_path


def test_add_note_creates_file_with_entry(isolated_notes_file):
    result = tools_module.add_note.invoke({"content": "buy groceries"})

    assert "buy groceries" in result
    assert isolated_notes_file.exists()

    saved = json.loads(isolated_notes_file.read_text())
    assert len(saved) == 1
    assert saved[0]["content"] == "buy groceries"
    assert saved[0]["done"] is False


def test_list_notes_returns_only_open_notes(isolated_notes_file):
    tools_module.add_note.invoke({"content": "first task"})
    tools_module.add_note.invoke({"content": "second task"})

    result = tools_module.list_notes.invoke({})

    assert "first task" in result
    assert "second task" in result


def test_list_notes_empty_state_is_handled_gracefully(isolated_notes_file):
    result = tools_module.list_notes.invoke({})
    assert "no open notes" in result.lower()


def test_add_note_appends_without_overwriting_existing(isolated_notes_file):
    tools_module.add_note.invoke({"content": "task one"})
    tools_module.add_note.invoke({"content": "task two"})

    saved = json.loads(isolated_notes_file.read_text())
    assert len(saved) == 2