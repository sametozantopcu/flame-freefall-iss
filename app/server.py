"""Local server for the Flame in Freefall site (S8).

Serves only `app/` statically on 127.0.0.1 and exposes `POST /api/ask`.
Run: `python app/server.py [--port 8000]`  (env PORT also works).

The LLM key is read server-side via `src.discovery.llm.load_settings` (.env / environment) and never leaves
this process: not in responses, logs or static files. Without a key (or on any LLM error) the endpoint
answers HTTP 200 with mode "fallback" (plus a short `reason`) built from the closest static cards.
"""
from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

APP_DIR = Path(__file__).resolve().parent
REPO = APP_DIR.parent
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from src.discovery.llm import load_settings  # noqa: E402  (reuses .env parsing and EVREN settings)

SITE_JSON = APP_DIR / "data" / "site_data.json"
MAX_QUESTION = 500
MAX_BODY = 8192
LLM_TIMEOUT = float(os.environ.get("LLM_TIMEOUT", 45))  # seconds per attempt (one retry follows)
LLM_RETRY_WAIT = 1.5  # seconds before the single retry
LLM_MAX_TOKENS = 350  # short answers (<=150 words)
MAX_CONTEXT_CHARS = 2000
BLOCKED_SUFFIXES = {".py", ".pyc", ".env"}

SYSTEM_PROMPT = (
    "You answer questions about a NASA combustion-in-microgravity prototype. Answer ONLY from the provided "
    "context (investigation summaries and result cards). Cite PSI ids and DOIs for every claim. If the context "
    "does not contain the answer, say 'not in the data'. State that there is NO partial-gravity (Moon/Mars g) "
    "data in the datasets when relevant. Mention briefly that this is a prototype and must not be used for "
    "safety decisions. Be concise (under 150 words). Reply as JSON only: "
    '{"answer": "...", "sources": ["PSI-101", "flex_d2_slope", ...]} using ids from the context.'
)

_STOP = set("the a an of and or to in on for is are was were what which how does do with by at from it this that "
            "be as about can i we you me my".split())


def load_site() -> dict:
    return json.loads(SITE_JSON.read_text(encoding="utf-8"))


def _tokens(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9\-\.]+", (text or "").lower()) if t not in _STOP and len(t) > 1]


def _flat(obj) -> str:
    if isinstance(obj, dict):
        return " ".join(_flat(v) for v in obj.values())
    if isinstance(obj, (list, tuple)):
        return " ".join(_flat(v) for v in obj)
    return "" if obj is None else str(obj)


def select_context(question: str, site: dict, n_inv: int = 4, n_cards: int = 2) -> list[dict]:
    """Keyword-score investigations and cards; return the most relevant items (type, id, doi, text)."""
    q = set(_tokens(question))
    items = []
    for inv in site.get("investigations", []):
        env = inv.get("envelope") or {}
        text = (f"{inv.get('psi_id')} {inv.get('name')} {inv.get('title')} {inv.get('summary')} "
                f"{inv.get('rationale')} {_flat(env)}")
        items.append(("investigation", inv.get("psi_id"), inv.get("doi"), text, inv))
    for c in site.get("cards", []):
        text = f"{c.get('id')} {c.get('title')} {c.get('finding')} {c.get('caveat')} {c.get('equipment_implication')} {c.get('psi_id')}"
        items.append(("card", c.get("id"), c.get("doi"), text, c))
    scored = []
    for kind, ident, doi, text, raw in items:
        words = _tokens(text)
        wset = set(words)
        s = sum(2 for t in q if t in wset) + sum(1 for t in q if any(t in w for w in wset if w != t))
        if ident and str(ident).lower() in question.lower():
            s += 10
        scored.append((s, kind, ident, doi, raw))
    out = []
    for kind, limit in (("investigation", n_inv), ("card", n_cards)):
        pool = sorted((x for x in scored if x[1] == kind), key=lambda x: -x[0])
        out += [x for x in pool[:limit] if x[0] > 0 or kind == "card" or not out]
    return [{"type": k, "id": i, "doi": d, "raw": r, "score": s} for s, k, i, d, r in out]


def _render_item(it: dict) -> str:
    r = it["raw"]
    if it["type"] == "card":
        return (f"[CARD {it['id']}] {r.get('title')} | value {r.get('value')} {r.get('unit')} (n={r.get('n')}) | "
                f"{r.get('finding')} | caveat: {r.get('caveat')} | DOI {it['doi']}")
    env = r.get("envelope") or {}
    return (f"[{it['id']}] {r.get('name')} - {r.get('title')} | DOI {it['doi']} | score {r.get('score')} | "
            f"envelope {json.dumps(env, ensure_ascii=False)} | {r.get('summary')}")


def build_context(items: list[dict], site: dict) -> str:
    """Most relevant items first, within MAX_CONTEXT_CHARS; the LIMITS line is always kept."""
    model = site.get("model") or {}
    notes = (site.get("meta") or {}).get("notes") or model.get("notes") or []
    limits = ("[LIMITS] No partial-gravity (Moon/Mars) data exists. " + " ".join(str(n) for n in notes))[:350]
    left = MAX_CONTEXT_CHARS - len(limits) - 1
    parts = []
    for it in items:  # items are already ordered by relevance within their kind
        line = _render_item(it)
        if len(line) + 1 > left:
            if left < 250:
                continue
            line = line[:left - 1]
        parts.append(line)
        left -= len(line) + 1
    parts.append(limits)
    return "\n".join(parts)[:MAX_CONTEXT_CHARS]


def _source(it: dict) -> dict:
    return {("card_id" if it["type"] == "card" else "psi_id"): it["id"], "doi": it["doi"]}


def fallback_answer(question: str, items: list[dict], reason: str | None = None) -> dict:
    top = [i for i in items if i["score"] > 0][:3] or items[:1]
    lines = []
    for it in top:
        r = it["raw"]
        if it["type"] == "card":
            lines.append(f"{r.get('title')}: {r.get('finding')} (caveat: {r.get('caveat')})")
        else:
            lines.append(f"{it['id']} {r.get('name')}: {(r.get('summary') or r.get('title') or '')[:300]}")
    answer = ("LLM unavailable - showing closest cards. " + " | ".join(lines)) if lines else \
        "LLM unavailable and nothing in the data matches this question."
    return {"answer": answer, "sources": [_source(i) for i in top], "mode": "fallback",
            "reason": reason or "error"}


class LLMCallError(Exception):
    """Carries only a short reason code (never request data or credentials)."""


def classify_error(exc: BaseException) -> str:
    if isinstance(exc, LLMCallError):
        return str(exc)
    if isinstance(exc, TimeoutError):
        return "timeout"
    if isinstance(exc, ConnectionError):
        return "connection"
    if type(exc).__name__ == "LLMError":
        return "no_key"
    return "bad_response" if isinstance(exc, (ValueError, KeyError, TypeError)) else "error"


def _log(reason: str, secs: float, attempt: int) -> None:
    sys.stderr.write(f"LLM fail reason={reason} attempt={attempt} after={secs:.1f}s\n")  # no key/headers/body


def call_llm(system: str, user: str) -> dict:
    """Single OpenAI-compatible chat call (same endpoint/model/body shape as src.discovery.llm.chat_json)."""
    import requests
    from src.discovery.llm import _parse_json
    st = load_settings()
    body = {"model": st.model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "max_tokens": LLM_MAX_TOKENS, "temperature": 0, "thinking": False}
    try:
        r = requests.post(st.base_url.rstrip("/") + "/chat/completions", json=body, timeout=LLM_TIMEOUT,
                          headers={"Authorization": f"Bearer {st.api_key}", "Content-Type": "application/json"})
    except requests.Timeout:
        raise TimeoutError("timeout") from None
    except requests.ConnectionError:
        raise ConnectionError("connection") from None
    if r.status_code != 200:
        raise LLMCallError(f"http_{r.status_code}")
    try:
        return _parse_json(r.json()["choices"][0]["message"]["content"])
    except Exception:
        raise LLMCallError("bad_response") from None


def answer_question(question: str, site: dict | None = None) -> dict:
    site = site or load_site()
    items = select_context(question, site)
    try:
        load_settings()  # raises when no key; fast path to fallback
    except Exception:
        return fallback_answer(question, items, "no_key")
    user = f"Context:\n{build_context(items, site)}\n\nQuestion: {question}"
    reason = "error"
    for attempt in (1, 2):
        t0 = time.monotonic()
        try:
            res = call_llm(SYSTEM_PROMPT, user)
            answer = str(res.get("answer") or "").strip()
            if not answer:
                raise LLMCallError("bad_response")
            wanted = {str(s) for s in (res.get("sources") or res.get("cards") or [])}
            used = [i for i in items if str(i["id"]) in wanted] or [i for i in items if i["id"] and str(i["id"]) in answer]
            return {"answer": answer, "sources": [_source(i) for i in used], "mode": "llm", "reason": None}
        except Exception as e:
            reason = classify_error(e)
            _log(reason, time.monotonic() - t0, attempt)
            if attempt == 2 or reason not in ("timeout", "connection", "http_429", "http_503"):
                break
            time.sleep(LLM_RETRY_WAIT)
    return fallback_answer(question, items, reason)


class Handler(BaseHTTPRequestHandler):
    server_version = "FlameSite/1"

    def log_message(self, fmt, *args):  # no query strings / bodies in logs
        sys.stderr.write("%s %s\n" % (self.command, urlsplit(self.path).path))

    def _send(self, code: int, body: bytes, ctype: str):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _json(self, code: int, obj: dict):
        self._send(code, json.dumps(obj).encode("utf-8"), "application/json; charset=utf-8")

    def _static(self):
        raw = unquote(urlsplit(self.path).path)
        if "\x00" in raw:
            return self._json(400, {"error": "bad path"})
        rel = raw.lstrip("/") or "index.html"
        target = (APP_DIR / rel).resolve()
        try:
            parts = target.relative_to(APP_DIR).parts
        except ValueError:
            return self._json(403, {"error": "forbidden"})
        if any(p.startswith(".") for p in parts) or target.suffix.lower() in BLOCKED_SUFFIXES or "__pycache__" in parts:
            return self._json(404, {"error": "not found"})
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            return self._json(404, {"error": "not found"})
        ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        self._send(200, target.read_bytes(), ctype)

    do_HEAD = do_GET = lambda self: self._static()

    def do_POST(self):
        if urlsplit(self.path).path != "/api/ask":
            return self._json(404, {"error": "not found"})
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            n = -1
        if n < 0 or n > MAX_BODY:
            return self._json(413, {"error": "request too large"})
        try:
            data = json.loads(self.rfile.read(n) or b"{}")
            question = str(data.get("question", "")).strip()
        except Exception:
            return self._json(400, {"error": "invalid JSON"})
        if not question:
            return self._json(400, {"error": "question is empty"})
        if len(question) > MAX_QUESTION:
            return self._json(400, {"error": f"question longer than {MAX_QUESTION} characters"})
        self._json(200, answer_question(question))


def make_server(port: int = 0, host: str = "127.0.0.1") -> ThreadingHTTPServer:
    return ThreadingHTTPServer((host, port), Handler)


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)))
    args = ap.parse_args(argv)
    srv = make_server(args.port)
    print(f"Serving app/ at http://127.0.0.1:{srv.server_address[1]}/  (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()


if __name__ == "__main__":
    main()
