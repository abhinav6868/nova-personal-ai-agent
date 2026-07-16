"""
Long-term memory for the agent, backed by ChromaDB.

Why this exists: an LLM call by itself only knows what's in the current
conversation. The moment you close the chat, it forgets everything about
you. This module lets the agent write short facts about the user to disk
("prefers concise answers", "works night shifts", "deadline on the 14th")
and later retrieve the ones *semantically relevant* to a new message --
not just the most recent ones.

We use ChromaDB's default local embedding model so this works fully
offline/free with zero extra API calls just for memory.
"""
import time
import uuid

import chromadb

import config

_client = chromadb.PersistentClient(path=config.CHROMA_PERSIST_DIR)
_collection = _client.get_or_create_collection(name="agent_memory")


def remember(fact: str, source: str = "conversation") -> str:
    """Store a fact permanently. Returns the memory's id."""
    memory_id = str(uuid.uuid4())
    _collection.add(
        ids=[memory_id],
        documents=[fact],
        metadatas=[{"source": source, "timestamp": time.time()}],
    )
    return memory_id


def recall(query: str, top_k: int = 4) -> list[str]:
    """Return up to top_k facts most semantically relevant to the query.
    Returns an empty list if memory is empty -- callers should treat that
    as 'nothing known yet', not an error."""
    count = _collection.count()
    if count == 0:
        return []
    results = _collection.query(
        query_texts=[query],
        n_results=min(top_k, count),
    )
    documents = results.get("documents", [[]])
    return documents[0] if documents else []


def forget_all() -> None:
    """Wipe memory. Useful for testing/reset -- not exposed to the agent
    itself, since an LLM accidentally calling this would be unpleasant."""
    global _collection
    _client.delete_collection(name="agent_memory")
    _collection = _client.get_or_create_collection(name="agent_memory")
