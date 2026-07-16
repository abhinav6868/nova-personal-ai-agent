"""
Runs before any test module is collected. Sets dummy credentials so
importing agent/graph.py (which constructs a ChatGroq client at import
time) doesn't fail just because a real API key isn't present in this
environment. No test here makes a real network call to Groq.
"""
import os

os.environ.setdefault("GROQ_API_KEY", "test-key-not-real")
os.environ.setdefault("TELEGRAM_BOT_TOKEN", "test-token-not-real")
os.environ.setdefault("TELEGRAM_USER_ID", "0")