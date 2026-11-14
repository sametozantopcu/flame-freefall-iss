"""Minimal client for the EVREN LLM API (OpenAI compatible) — plans/01_m1_discovery "LLM kuralları".

The key is read from the repo-root `.env` (`API_KEY = ...`, git-ignored) or the environment; it is never printed,
logged or put into an error message. Only used by one-off generation commands; the app never imports this module.
"""
from __future__ import annotations

import json
import os
import re
import time
from dataclasses import dataclass, field
from pathlib import Path

import requests

REPO = Path(__file__).resolve().parents[2]
DEFAULT_BASE_URL = "https://evren-llmapi.ssyz.org.tr/v1"
DEFAULT_MODEL = "deepseek-v4.1-flash"
RETRY_STATUS = {429, 503}
MAX_ATTEMPTS = 5


class LLMError(Exception):
    pass


@dataclass(frozen=True)
class Settings:
    base_url: str
    model: str
    api_key: str = field(repr=False)

    def __str__(self):
        return f"Settings(base_url={self.base_url!r}, model={self.model!r}, api_key=***)"

    __repr__ = __str__


def _parse_env(path: Path) -> dict:
    out = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip().removeprefix("export ").strip()
        v = v.strip().strip('"').strip("'")
        out[k] = v
    return out


def load_settings(env_path: str | Path = REPO / ".env") -> Settings:
    vals = _parse_env(Path(env_path))
    for k in ("API_KEY", "LLM_BASE_URL", "LLM_MODEL"):
        if os.environ.get(k):
            vals[k] = os.environ[k]
    if not vals.get("API_KEY"):
        raise LLMError("API_KEY not found in .env or environment")
    return Settings(base_url=vals.get("LLM_BASE_URL") or DEFAULT_BASE_URL, model=vals.get("LLM_MODEL") or DEFAULT_MODEL,
                    api_key=vals["API_KEY"])


def _sleep(seconds: float) -> None:          # separate so tests can patch it
    time.sleep(seconds)


def _parse_json(content: str) -> dict:
    text = content.strip()
    m = re.search(r"```(?:json)?\s*(.*?)```", text, re.S)
    if m:
        text = m.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start >= 0 and end > start:
            return json.loads(text[start:end + 1])
        raise LLMError("LLM answer is not JSON")


def chat_json(system: str, user: str, settings: Settings | None = None, max_tokens: int = 4096, session=None) -> dict:
    settings = settings or load_settings()
    session = session or requests.Session()
    url = settings.base_url.rstrip("/") + "/chat/completions"
    body = {"model": settings.model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "max_tokens": max_tokens, "temperature": 0, "thinking": False}
    headers = {"Authorization": f"Bearer {settings.api_key}", "Content-Type": "application/json"}
    for attempt in range(1, MAX_ATTEMPTS + 1):
        r = session.post(url, headers=headers, json=body, timeout=180)
        if r.status_code == 200:
            return _parse_json(r.json()["choices"][0]["message"]["content"])
        if r.status_code in RETRY_STATUS and attempt < MAX_ATTEMPTS:
            try:
                wait = float(r.headers.get("Retry-After", 2))
            except (TypeError, ValueError):
                wait = 2.0
            _sleep(wait)
            continue
        raise LLMError(f"LLM request failed with HTTP {r.status_code} (attempt {attempt}/{MAX_ATTEMPTS})")
    raise LLMError("LLM request failed")
