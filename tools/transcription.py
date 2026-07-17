"""
Voice note transcription via Groq's Whisper endpoint (whisper-large-v3).

Kept as its own module (not bolted into telegram_bot.py) so the
transcription step is swappable/testable independent of Telegram --
same reasoning as keeping tools.py separate from the MCP transport layer.
"""
import io

from groq import Groq

import config

_client = Groq(api_key=config.GROQ_API_KEY)


def transcribe_audio(audio_bytes: bytes, filename: str = "voice.ogg") -> str:
    """Sends raw audio bytes to Groq's Whisper model and returns the
    transcribed text. Telegram voice notes are OGG/Opus by default, which
    Whisper handles natively -- no conversion needed."""
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = filename  # the Groq SDK reads this for the upload

    transcription = _client.audio.transcriptions.create(
        file=audio_file,
        model="whisper-large-v3",
    )
    return transcription.text