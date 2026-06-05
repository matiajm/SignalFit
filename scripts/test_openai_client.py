"""Smoke-test the OpenAI client. Run from repo root: uv run python scripts/test_openai_client.py"""

from lib.openai import create_response_text

if __name__ == "__main__":
    text = create_response_text("here is the prompt: Explain quantum computing in simple terms. or what is the weather in Tokyo?")
    print(text)
