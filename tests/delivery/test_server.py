"""S8 acceptance: local server, /api/ask with mocked LLM, fallback, path safety, no key leakage."""
import http.client
import importlib.util
import json
import socket
import threading
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
SECRET = "sk-TEST-SECRET-VALUE-123"


def _load():
    spec = importlib.util.spec_from_file_location("ff_server", REPO / "app" / "server.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


@pytest.fixture()
def srv(monkeypatch):
    m = _load()
    monkeypatch.setenv("API_KEY", SECRET)

    def no_net(*a, **k):
        raise AssertionError("real network call attempted")
    monkeypatch.setattr(m, "call_llm", no_net)
    s = m.make_server(0)
    t = threading.Thread(target=s.serve_forever, daemon=True)
    t.start()
    yield m, s.server_address[1]
    s.shutdown()
    s.server_close()


def _req(port, method, path, body=None):
    c = http.client.HTTPConnection("127.0.0.1", port, timeout=10)
    c.request(method, path, body=body, headers={"Content-Type": "application/json"} if body else {})
    r = c.getresponse()
    data = r.read()
    c.close()
    return r.status, data


def _raw(port, path):
    s = socket.create_connection(("127.0.0.1", port), timeout=10)
    s.sendall(f"GET {path} HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n".encode())
    buf = b""
    while chunk := s.recv(4096):
        buf += chunk
    s.close()
    return int(buf.split(b" ", 2)[1]), buf


def test_static_and_path_escape(srv):
    m, port = srv
    assert _req(port, "GET", "/")[0] == 200
    assert _req(port, "GET", "/data/site_data.json")[0] == 200
    for p in ("/../.env", "/..%2f.env", "/%2e%2e/.env", "/../../.env", "/server.py"):
        code, raw = _raw(port, p)
        assert code in (403, 404), p
        assert b"API_KEY" not in raw and SECRET.encode() not in raw


def test_ask_llm_mocked(srv, monkeypatch):
    m, port = srv
    monkeypatch.setattr(m, "call_llm", lambda s, u: {"answer": "Per PSI-101 smoke data exist.", "sources": ["PSI-101"]})
    code, data = _req(port, "POST", "/api/ask", json.dumps({"question": "smoke in PSI-101?"}))
    j = json.loads(data)
    assert code == 200 and j["mode"] == "llm" and j["answer"]
    assert j["sources"][0]["psi_id"] == "PSI-101" and "doi" in j["sources"][0]
    assert SECRET.encode() not in data


def test_ask_fallback_without_key(srv, monkeypatch):
    m, port = srv
    def boom(*a, **k):
        raise m.__dict__["load_settings"].__globals__["LLMError"]("no key")
    monkeypatch.setattr(m, "load_settings", boom)
    code, data = _req(port, "POST", "/api/ask", json.dumps({"question": "flex droplet burn time slope"}))
    j = json.loads(data)
    assert code == 200 and j["mode"] == "fallback" and j["answer"].strip() and j["sources"]


def test_ask_fallback_on_llm_error(srv, monkeypatch):
    m, port = srv
    def fail(s, u):
        raise TimeoutError("slow")
    monkeypatch.setattr(m, "call_llm", fail)
    code, data = _req(port, "POST", "/api/ask", json.dumps({"question": "Kapton"}))
    j = json.loads(data)
    assert code == 200 and j["mode"] == "fallback" and j["answer"]
    assert SECRET.encode() not in data


def test_empty_and_long_question(srv):
    m, port = srv
    assert _req(port, "POST", "/api/ask", json.dumps({"question": "  "}))[0] == 400
    assert _req(port, "POST", "/api/ask", json.dumps({"question": "x" * 501}))[0] == 400
    assert _req(port, "POST", "/api/ask", "not json")[0] == 400


def test_key_not_in_static_files():
    for p in (REPO / "app").rglob("*"):
        if p.is_file() and p.suffix in {".js", ".json", ".html", ".css", ".py"}:
            assert SECRET not in p.read_text(encoding="utf-8", errors="ignore")


def test_binds_loopback(srv):
    m, port = srv
    assert m.make_server(0).server_address[0] == "127.0.0.1"


# ---- L1: robustness (no live API) ----
def _ask(m, q="smoke in PSI-101?"):
    return m.answer_question(q)


@pytest.fixture()
def fast(monkeypatch):
    m = _load()
    monkeypatch.setenv("API_KEY", SECRET)
    monkeypatch.setattr(m, "LLM_RETRY_WAIT", 0)
    return m


def test_retry_after_timeout_then_ok(fast, monkeypatch):
    calls = []
    def f(s, u):
        calls.append(1)
        if len(calls) == 1:
            raise TimeoutError("x")
        return {"answer": "ok PSI-101", "sources": ["PSI-101"]}
    monkeypatch.setattr(fast, "call_llm", f)
    j = _ask(fast)
    assert j["mode"] == "llm" and j.get("reason") is None and len(calls) == 2


def test_two_timeouts_fallback_reason(fast, monkeypatch, capsys):
    calls = []
    def f(s, u):
        calls.append(1)
        raise TimeoutError("x")
    monkeypatch.setattr(fast, "call_llm", f)
    j = _ask(fast)
    assert j["mode"] == "fallback" and j["reason"] == "timeout" and len(calls) == 2
    err = capsys.readouterr().err
    assert "timeout" in err and SECRET not in err and "Authorization" not in err
    assert SECRET not in json.dumps(j)


def test_http_429_retries_then_reason(fast, monkeypatch):
    calls = []
    def f(s, u):
        calls.append(1)
        raise fast.LLMCallError("http_429")
    monkeypatch.setattr(fast, "call_llm", f)
    j = _ask(fast)
    assert j["reason"] == "http_429" and len(calls) == 2


def test_bad_response_no_retry(fast, monkeypatch):
    calls = []
    def f(s, u):
        calls.append(1)
        return {"answer": ""}
    monkeypatch.setattr(fast, "call_llm", f)
    j = _ask(fast)
    assert j["mode"] == "fallback" and j["reason"] == "bad_response" and len(calls) == 1


def test_no_key_reason(fast, monkeypatch):
    def boom(*a, **k):
        raise fast.load_settings.__globals__["LLMError"]("no key")
    monkeypatch.setattr(fast, "load_settings", boom)
    assert _ask(fast)["reason"] == "no_key"


def test_context_limit_and_defaults(fast):
    site = fast.load_site()
    assert fast.MAX_CONTEXT_CHARS <= 2000 and fast.LLM_TIMEOUT == 45
    for q in ("Which experiments matter most for a high-oxygen Mars habitat?", "What does the FLEX model predict?", "smoke PSI-101"):
        ctx = fast.build_context(fast.select_context(q, site), site)
        assert len(ctx) <= 2000 and "[LIMITS]" in ctx


# ---- R5: flamesense / ranking / risk context ----
def _ctx(m, q, site=None):
    site = site or m.load_site()
    items = m.select_context(q, site)
    return m.build_context(items, site), items


def test_ctx_flamesense_not_built(fast):
    ctx, items = _ctx(fast, "What is FlameSense?")
    assert "not built" in ctx and "ESP32" in ctx and len(ctx) <= 2000
    assert any(i["id"] == "flamesense_concept" for i in items)


def test_ctx_mars_habitat_has_top_psi(fast):
    site = fast.load_site()
    top = min((i for i in site["investigations"] if i.get("score_status") == "scored"), key=lambda i: i["rank"])
    ctx, _ = _ctx(fast, "Which experiments matter most for a high-oxygen Mars habitat?", site)
    assert f"#{top['rank']} {top['psi_id']}" in ctx and "hypothetical" in ctx and "low-confidence" in ctx


def test_ctx_nomex_risk(fast):
    site = fast.load_site()
    nomex = next(m for m in site["risk"]["materials"] if m["key"] == "Nomex")
    ctx, items = _ctx(fast, "How risky is Nomex at 30 % oxygen?", site)
    assert "[RISK]" in ctx and f"limit O2 {nomex['threshold_o2_pct_ref']}%" in ctx and "exploration" in ctx
    assert "R2=" in ctx and "uncalibrated" in ctx and len(ctx) <= 2000
    assert fast._source(next(i for i in items if i["id"] == "risk_engine")) == {"card_id": "risk_engine", "doi": None}


def test_ctx_limits_always_and_no_risk_data(fast):
    site = fast.load_site()
    for q in ("What is FlameSense?", "How risky is PMMA in the exploration atmosphere?",
              "Which experiments matter most for a high-oxygen Mars habitat?"):
        ctx, _ = _ctx(fast, q, site)
        assert "[LIMITS]" in ctx and len(ctx) <= 2000
    bare = {k: v for k, v in site.items() if k not in ("risk", "flamesense")}
    for q in ("How risky is Nomex at 30 % oxygen?", "What is FlameSense?"):
        ctx, items = _ctx(fast, q, bare)
        assert "[LIMITS]" in ctx and not any(i["type"] == "special" and i["id"] != "investigation_ranking" for i in items)
    assert fast.fallback_answer("x", fast.select_context("What is FlameSense?", site))["answer"]


def test_prompt_mentions_relative_index(fast):
    assert "relative" in fast.SYSTEM_PROMPT and "fire probability" in fast.SYSTEM_PROMPT
