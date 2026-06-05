"""OpenAI Responses API client for SignalFit (server-side / scripts only)."""

from __future__ import annotations

import json
import os
from functools import lru_cache
from typing import Any

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
    text_format: dict[str, Any] | None = None,
):
    """Call the Responses API (same pattern as the OpenAI Python SDK docs)."""
    client = get_openai_client()
    kwargs: dict = {"model": model, "input": input}
    if instructions is not None:
        kwargs["instructions"] = instructions
    if text_format is not None:
        kwargs["text"] = {"format": text_format}
    return client.responses.create(**kwargs)


def create_json_response(
    input: str,
    *,
    schema: dict[str, Any],
    name: str,
    model: str = DEFAULT_MODEL,
    instructions: str | None = None,
    description: str | None = None,
    strict: bool = True,
):
    """Call the Responses API with Structured Outputs JSON Schema formatting."""
    text_format: dict[str, Any] = {
        "type": "json_schema",
        "name": name,
        "schema": schema,
        "strict": strict,
    }
    if description is not None:
        text_format["description"] = description
    return create_response(
        input,
        model=model,
        instructions=instructions,
        text_format=text_format,
    )


def create_response_text(
    input: str,
    *,
    model: str = DEFAULT_MODEL,
    instructions: str | None = None,
) -> str:
    """Return output_text from a Responses API call."""
    response = create_response(input, model=model, instructions=instructions)
    return response.output_text


def create_json_response_text(
    input: str,
    *,
    schema: dict[str, Any],
    name: str,
    model: str = DEFAULT_MODEL,
    instructions: str | None = None,
    description: str | None = None,
    strict: bool = True,
) -> str:
    """Return JSON output_text from a structured Responses API call."""
    response = create_json_response(
        input,
        schema=schema,
        name=name,
        model=model,
        instructions=instructions,
        description=description,
        strict=strict,
    )
    return response.output_text


def create_json_response_object(
    input: str,
    *,
    schema: dict[str, Any],
    name: str,
    model: str = DEFAULT_MODEL,
    instructions: str | None = None,
    description: str | None = None,
    strict: bool = True,
) -> dict[str, Any]:
    """Return parsed JSON from a structured Responses API call."""
    return json.loads(
        create_json_response_text(
            input,
            schema=schema,
            name=name,
            model=model,
            instructions=instructions,
            description=description,
            strict=strict,
        )
    )
