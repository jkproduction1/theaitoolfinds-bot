"""One small wrapper around whichever LLM is available.

Priority: ANTHROPIC_API_KEY -> GEMINI_API_KEY -> GITHUB_TOKEN (GitHub Models, free).
Switching provider = just add the secret in GitHub, no code change.
"""
import json
import os
import re
import time

import requests


def _provider():
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    if os.getenv("GEMINI_API_KEY"):
        return "gemini"
    if os.getenv("GITHUB_TOKEN"):
        return "github"
    raise RuntimeError(
        "No LLM available: set GITHUB_TOKEN (free), GEMINI_API_KEY or ANTHROPIC_API_KEY"
    )


def _openai_compatible(url, key, model, system, user, temperature):
    r = requests.post(
        url,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": model,
            "temperature": temperature,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        },
        timeout=120,
    )
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"]


def _anthropic(system, user, temperature):
    r = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5"),
            "max_tokens": 2000,
            "temperature": temperature,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        },
        timeout=120,
    )
    r.raise_for_status()
    return "".join(b.get("text", "") for b in r.json()["content"])


def chat(system: str, user: str, temperature: float = 0.7) -> str:
    p = _provider()
    last = None
    for attempt in range(3):
        try:
            if p == "anthropic":
                return _anthropic(system, user, temperature)
            if p == "gemini":
                return _openai_compatible(
                    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
                    os.environ["GEMINI_API_KEY"],
                    os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
                    system, user, temperature,
                )
            return _openai_compatible(
                "https://models.github.ai/inference/chat/completions",
                os.environ["GITHUB_TOKEN"],
                os.getenv("GITHUB_MODEL", "openai/gpt-4.1-mini"),
                system, user, temperature,
            )
        except Exception as e:  # rate limits / transient errors
            last = e
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"LLM call failed ({p}): {last}")


def chat_json(system: str, user: str, temperature: float = 0.7) -> dict:
    """Ask for JSON and parse it robustly (models sometimes wrap it in ``` fences)."""
    raw = chat(system + "\nReply with ONE valid JSON object only. No markdown.", user, temperature)
    m = re.search(r"\{.*\}", raw, re.S)
    if not m:
        raise ValueError(f"LLM did not return JSON: {raw[:300]}")
    return json.loads(m.group(0))
