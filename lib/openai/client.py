"""OpenAI Responses API client for SignalFit (server-side / scripts only)."""

from __future__ import annotations

import os
from functools import lru_cache

from openai import OpenAI

DEFAULT_MODEL = "gpt-4.1-mini"


@lru_cache(maxsize=1)
def get_openai_client() -> OpenAI:
    """Return a cached OpenAI client. Requires OPENAI_API_KEY in the environment."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        msg = "OPENAI_API_KEY is not set"
        raise RuntimeError(msg)
    return OpenAI(api_key=api_key)


def create_response(
    input: str,
    *,
    model: str = DEFAULT_MODEL,
    instructions: str | None = None,
):
    """Call the Responses API (same pattern as the OpenAI Python SDK docs)."""
    client = get_openai_client()
    kwargs: dict = {"model": model, "input": input}
    if instructions is not None:
        kwargs["instructions"] = instructions
    return client.responses.create(**kwargs)


def create_response_text(
    input: str,
    *,
    model: str = DEFAULT_MODEL,
    instructions: str | None = None,
) -> str:
    """Return output_text from a Responses API call."""
    response = create_response(input, model=model, instructions=instructions)
    return response.output_text
