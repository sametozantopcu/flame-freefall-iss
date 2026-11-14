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
    # L2: budget raised 2000 -> 4500 (entity records carry summary + envelope), timeout 45 -> 60 s, max_tokens 350 -> 500;
    # the [LIMITS] line is no longer unconditional: it appears only for gravity questions (see test_limits_only_for_gravity)
    site = fast.load_site()
    assert fast.MAX_CONTEXT_CHARS == 4500 and fast.LLM_TIMEOUT == 60 and fast.LLM_MAX_TOKENS == 500
    for q in ("Which experiments matter most for a high-oxygen Mars habitat?", "What does the FLEX model predict?", "smoke PSI-101"):
        ctx = fast.build_context(fast.select_context(q, site), site)
        assert 0 < len(ctx) <= fast.MAX_CONTEXT_CHARS


# ---- R5: flamesense / ranking / risk context ----
def _ctx(m, q, site=None):
    site = site or m.load_site()
    items = m.select_context(q, site)
    return m.build_context(items, site), items


def test_ctx_flamesense_not_built(fast):
    ctx, items = _ctx(fast, "What is FlameSense?")
    assert "not built" in ctx and "ESP32" in ctx and len(ctx) <= fast.MAX_CONTEXT_CHARS
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
    assert "R2=" in ctx and "uncalibrated" in ctx and len(ctx) <= fast.MAX_CONTEXT_CHARS
    assert fast._source(next(i for i in items if i["id"] == "risk_engine")) == {"card_id": "risk_engine", "doi": None}


def test_ctx_limits_for_gravity_and_no_risk_data(fast):
    site = fast.load_site()
    for q in ("What is FlameSense?", "How risky is PMMA in the exploration atmosphere?",
              "Which experiments matter most for a high-oxygen Mars habitat?"):
        ctx, _ = _ctx(fast, q, site)
        assert len(ctx) <= fast.MAX_CONTEXT_CHARS
    assert "[LIMITS]" in _ctx(fast, "Which experiments matter most for a high-oxygen Mars habitat?", site)[0]  # gravity topic
    bare = {k: v for k, v in site.items() if k not in ("risk", "flamesense")}
    for q in ("How risky is Nomex at 30 % oxygen?", "What is FlameSense?"):
        ctx, items = _ctx(fast, q, bare)
        assert not any(i["type"] == "special" and i["id"] not in ("investigation_ranking", "flex_model") for i in items)
    assert fast.fallback_answer("x", fast.select_context("What is FlameSense?", site))["answer"]


def test_prompt_mentions_relative_index(fast):
    assert "relative" in fast.SYSTEM_PROMPT and "fire probability" in fast.SYSTEM_PROMPT


# ---- L2: entity-aware context, synthesis prompt, answer cache ----
EXAMPLE_Q = ("How can the findings from SAME-R and SAFFIRE-II be combined to develop more accurate fire and smoke "
             "prediction models for spacecraft habitats, particularly under low-flow microgravity conditions and "
             "varying oxygen concentrations?")


def _entity_ids(m, q, site=None):
    return [i["id"] for i in m.select_context(q, site or m.load_site()) if i["type"] == "entity"]


def test_example_question_entities_in_context(fast):
    site = fast.load_site()
    ctx, items = _ctx(fast, EXAMPLE_Q, site)
    inv = {i["psi_id"]: i for i in site["investigations"]}
    assert set(_entity_ids(fast, EXAMPLE_Q, site)) == {"PSI-101", "PSI-99"}
    for psi in ("PSI-101", "PSI-99"):
        rec = inv[psi]
        assert rec["name"] in ctx and rec["doi"] in ctx
        assert rec["qa_text"][:60] in ctx                     # longer Q&A text, not only the 420-char summary
        assert "flow" in ctx and "n_rows" in ctx and "rank #" in ctx
    assert "SPICE" not in ctx and "PSI-107" not in ctx        # irrelevant filler must not enter
    assert "[RISK]" not in ctx and "[RANKING]" not in ctx     # risk/ranking not asked
    assert len(ctx) <= fast.MAX_CONTEXT_CHARS


@pytest.mark.parametrize("q", ["Tell me about SAFFIRE II", "what did saffire-ii find?", "PSI-99 results", "psi 99 ?",
                               "SAFFIRE-II", "Saffire_II fire growth"])
def test_entity_spelling_variants_same_record(fast, q):
    assert _entity_ids(fast, q) == ["PSI-99"]


def test_entity_disambiguation(fast):
    assert _entity_ids(fast, "What does BASS-II show?") == ["PSI-25"]
    assert _entity_ids(fast, "How reliable is the FLEX burning-rate model?") == ["PSI-69"]
    assert _entity_ids(fast, "SAME-R smoke") == ["PSI-101"]
    assert set(_entity_ids(fast, "What did Saffire measure?")) == {"PSI-98", "PSI-99", "PSI-100"}
    assert _entity_ids(fast, "What happens at the same oxygen level in vacuum?") == []   # common word, not an entity


def test_risk_context_only_when_relevant(fast):
    ctx, _ = _ctx(fast, "How risky is Nomex at 30% oxygen compared with PMMA?")
    assert "[RISK]" in ctx
    ctx, _ = _ctx(fast, "What does BASS-II tell us about oxygen limits for solid fuels in low flow?")
    assert "[RISK]" not in ctx and "PSI-25" in ctx and "BASS-II" in ctx


def test_low_score_filler_excluded(fast):
    site = fast.load_site()
    items = fast.select_context("zzz unrelated banana question", site)
    assert not any(i["type"] in ("entity", "investigation") for i in items)


def test_limits_only_for_gravity(fast):
    assert "[LIMITS]" not in _ctx(fast, EXAMPLE_Q)[0]          # "microgravity" alone is not a partial-gravity question
    assert "[LIMITS]" in _ctx(fast, "Is there any data for Moon gravity flames?")[0]
    assert "[LIMITS]" not in _ctx(fast, "What does BASS-II tell us about oxygen limits?")[0]


def test_prompt_synthesis_rules(fast):
    p = fast.SYSTEM_PROMPT
    pl = p.lower()
    assert "prototype" not in pl and "safety decisions" not in pl           # the UI shows the fixed note
    assert "General combustion knowledge, not from this dataset" in p
    assert "combine" in pl and "reason" in pl and "do not refuse" in pl
    assert "Not in the data" in p and "120" in p and "220" in p


def test_fallback_contains_named_records(fast):
    site = fast.load_site()
    items = fast.select_context(EXAMPLE_Q, site)
    ans = fast.fallback_answer(EXAMPLE_Q, items, "timeout")["answer"]
    inv = {i["psi_id"]: i for i in site["investigations"]}
    for psi in ("PSI-101", "PSI-99"):
        assert psi in ans and inv[psi]["name"] in ans and inv[psi]["summary"][:50] in ans
        assert "O2" in ans or "flow" in ans


def test_cache_second_call_skips_llm(fast, monkeypatch):
    calls = []

    def f(s, u):
        calls.append(u)
        return {"answer": "Per PSI-99 fires grow.", "sources": ["PSI-99"]}
    monkeypatch.setattr(fast, "call_llm", f)
    a = fast.answer_question(EXAMPLE_Q)
    b = fast.answer_question("  " + EXAMPLE_Q.lower().rstrip("?") + "  ")      # normalised: case/space/trailing '?'
    assert len(calls) == 1 and a == b and a["mode"] == "llm"
    assert "PSI-99 SAFFIRE-II" in calls[0] or "[PSI-99]" in calls[0]


def test_cache_only_llm_and_bounded(fast, monkeypatch):
    calls = []

    def boom(s, u):
        calls.append(1)
        raise fast.LLMCallError("http_500")
    monkeypatch.setattr(fast, "call_llm", boom)
    assert fast.answer_question("smoke PSI-101")["mode"] == "fallback"
    assert fast.answer_question("smoke PSI-101")["mode"] == "fallback" and len(calls) == 2    # fallback not cached
    monkeypatch.setattr(fast, "call_llm", lambda s, u: {"answer": "ok PSI-101", "sources": []})
    for i in range(fast.CACHE_SIZE + 5):
        fast.answer_question(f"smoke PSI-101 variant {i}")
    assert len(fast._CACHE) <= fast.CACHE_SIZE


def test_refusal_with_entity_is_logged(fast, monkeypatch, capsys):
    monkeypatch.setattr(fast, "call_llm", lambda s, u: {"answer": "Not in the data.", "sources": []})
    j = fast.answer_question("What did SAFFIRE-II show?")
    err = capsys.readouterr().err
    assert "refusal" in err and SECRET not in err and j["reason"] is None and "refusal" not in json.dumps(j)
    capsys.readouterr()
    fast.answer_question("zzz banana unrelated")
    assert "refusal" not in capsys.readouterr().err                       # no matched entity -> a refusal is fine


def test_call_llm_logs_length_and_salvages(fast, monkeypatch, capsys):
    import requests

    class R:
        status_code = 200

        def json(self):
            return {"choices": [{"finish_reason": "length", "message": {"content": '{"answer": "Cut off mid sent'}}]}
    monkeypatch.setattr(requests, "post", lambda *a, **k: R())
    out = fast.call_llm("s", "u")
    assert out["answer"].startswith("Cut off") and "finish_reason=length" in capsys.readouterr().err


def test_risk_context_has_asked_point_and_flamesense_motivation(fast):
    site = fast.load_site()
    ctx, _ = _ctx(fast, "How risky is Nomex at 30% oxygen compared with PMMA?", site)
    grid, ax = site["risk"]["grid"], site["risk"]["axes"]
    f = site["risk"]["fields"].index("risk_index")
    row = lambda k: grid[k][ax["pressure_kpa"].index(101.3)][ax["o2_pct"].index(30.0)]  # noqa: E731
    assert f"PMMA={row('PMMA')[f]:.0f}" in ctx and f"Nomex={row('Nomex')[f]:.0f}" in ctx and "30% O2" in ctx
    ctx, _ = _ctx(fast, "What is FlameSense and which findings motivate it?", site)
    assert "equipment implications" in ctx and "PSI-101 card smoke_simpson_rt_r0" in ctx
