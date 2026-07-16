"""
Central config. Every other module imports settings from here instead
of calling os.getenv() directly, so there's exactly one place that
knows how secrets are loaded.
"""
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_USER_ID = os.getenv("TELEGRAM_USER_ID", "")

# Model is kept here as a single string, not hardcoded elsewhere,
# so it's a one-line change if Groq renames/retires a free model.
# gpt-oss-120b (not Llama) is used specifically because OpenAI's open-weight
# models have noticeably more reliable structured tool-calling than Llama --
# Llama 3.3 occasionally emits malformed function-call syntax that Groq
# rejects with a 400 (tool_use_failed).
LLM_MODEL = "openai/gpt-oss-120b"

# Where ChromaDB persists its data on disk (so memory survives restarts)
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_store")

REQUIRED_VARS = {
    "GROQ_API_KEY": GROQ_API_KEY,
    "TELEGRAM_BOT_TOKEN": TELEGRAM_BOT_TOKEN,
    "TELEGRAM_USER_ID": TELEGRAM_USER_ID,
}


def validate_config() -> None:
    """Fail loudly and early if a required secret is missing, instead of
    letting the bot crash confusingly three layers deep at runtime."""
    missing = [name for name, value in REQUIRED_VARS.items() if not value]
    if missing:
        raise RuntimeError(
            f"Missing required environment variables: {', '.join(missing)}. "
            f"Copy .env.example to .env and fill these in."
        )