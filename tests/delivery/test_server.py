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
