"""Landing layout check (plans/landing LP2, LP4, LP5): drives headless Chrome through the DevTools protocol.

Method: Chrome is started with --remote-debugging-pipe (JSON messages over two inherited pipes; no websocket
package needed, stdlib only) and runs in REAL time. For every case a fresh tab is opened with the requested
viewport (Emulation.setDeviceMetricsOverride), the page is loaded from a local static server serving app/,
scrolled top to bottom in real time (so IntersectionObserver and CSS transitions behave as in a normal browser)
and measured. Nothing is force-finished or faked: a [data-reveal] element that stays hidden is reported as a failure.
An earlier version used --dump-dom with --virtual-time-budget; virtual time does not deliver IntersectionObserver
callbacks or transitions reliably, which produced false "hidden" results.

Usage:
  python scripts/check_landing_layout.py            # layout at six viewport sizes (+ legacy #senaryo hash)
  python scripts/check_landing_layout.py --motion   # also: reduced motion and JavaScript disabled
  python scripts/check_landing_layout.py --shots DIR  # also save one screenshot per section and size
Needs google-chrome / chromium on PATH (or CHROME=/path/to/chrome).
"""
import argparse
import base64
import fcntl
import functools
import json
import os
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

APP = Path(__file__).resolve().parents[1] / "app"
SIZES = [(1920, 1080), (1440, 900), (1366, 768), (1280, 720), (1024, 700), (390, 844)]
SECTIONS = ["explore", "scenario", "equipment", "live"]
TIMEOUT = 45


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def find_chrome():
    for c in (os.environ.get("CHROME"), "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
        if c and shutil.which(c):
            return shutil.which(c)
    sys.exit("Chrome not found: install google-chrome/chromium or set the CHROME environment variable")


class Browser:
    """Minimal DevTools client over --remote-debugging-pipe (messages are NUL-terminated JSON)."""

    def __init__(self, exe):
        self.profile = tempfile.mkdtemp(prefix="landing-check-")
        # keep our ends above fd 9 so that dup2 onto 3 and 4 in the child never collides
        raw = (*os.pipe(), *os.pipe())
        c_r, c_w, r_r, r_w = (fcntl.fcntl(fd, fcntl.F_DUPFD, 10) for fd in raw)
        for fd in raw:
            os.close(fd)
        # c_r/c_w: we write commands -> chrome fd 3; r_r/r_w: chrome writes responses (fd 4) -> we read

        def child():
            os.dup2(c_r, 3)
            os.dup2(r_w, 4)

        self.proc = subprocess.Popen(
            [exe, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--no-first-run",
             "--disable-extensions", "--mute-audio", f"--user-data-dir={self.profile}", "--remote-debugging-pipe",
             "about:blank"],
            stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            pass_fds=(3, 4), preexec_fn=child, close_fds=True)
        os.close(c_r)
        os.close(r_w)
        self.w = os.fdopen(c_w, "wb", buffering=0)
        self.r = os.fdopen(r_r, "rb", buffering=0)
        self.n = 0
        self.cv = threading.Condition()
        self.replies, self.events = {}, []
        threading.Thread(target=self._read, daemon=True).start()

    def _read(self):
        buf = b""
        while True:
            try:
                chunk = self.r.read(65536)
            except OSError:
                break
            if not chunk:
                break
            buf += chunk
            while b"\0" in buf:
                raw, buf = buf.split(b"\0", 1)
                if not raw:
                    continue
                m = json.loads(raw)
                with self.cv:
                    if "id" in m:
                        self.replies[m["id"]] = m
                    else:
                        self.events.append(m)
                    self.cv.notify_all()

    def send(self, method, params=None, session=None, timeout=TIMEOUT):
        self.n += 1
        i = self.n
        msg = {"id": i, "method": method, "params": params or {}}
        if session:
            msg["sessionId"] = session
        self.w.write(json.dumps(msg).encode() + b"\0")
        end = time.time() + timeout
        with self.cv:
            while i not in self.replies:
                left = end - time.time()
                if left <= 0 or self.proc.poll() is not None:
                    raise RuntimeError(f"no reply to {method}")
                self.cv.wait(min(left, 0.5))
            m = self.replies.pop(i)
        if "error" in m:
            raise RuntimeError(f"{method}: {m['error']}")
        return m.get("result", {})

    def wait_event(self, name, session, timeout=TIMEOUT):
        end = time.time() + timeout
        with self.cv:
            while True:
                for e in self.events:
                    if e.get("method") == name and e.get("sessionId") == session:
                        self.events.remove(e)
                        return e
                left = end - time.time()
                if left <= 0:
                    raise RuntimeError(f"timeout waiting for {name}")
                self.cv.wait(min(left, 0.5))

    def close(self):
        try:
            self.send("Browser.close", timeout=5)
        except Exception:
            pass
        try:
            self.proc.wait(timeout=5)
        except Exception:
            self.proc.kill()
        shutil.rmtree(self.profile, ignore_errors=True)


class Tab:
    def __init__(self, br, url, w, h, reduced=False, nojs=False):
        self.br = br
        tid = br.send("Target.createTarget", {"url": "about:blank"})["targetId"]
        self.tid = tid
        self.s = br.send("Target.attachToTarget", {"targetId": tid, "flatten": True})["sessionId"]
        br.send("Page.enable", session=self.s)
        br.send("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 1, "mobile": False}, self.s)
        br.send("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce" if reduced else "no-preference"}]}, self.s)
        if nojs:
            br.send("Emulation.setScriptExecutionDisabled", {"value": True}, self.s)
        br.send("Page.navigate", {"url": url}, self.s)
        br.wait_event("Page.loadEventFired", self.s)
        if nojs:
            # the page was parsed without scripts; re-enable them only so that we can measure
            br.send("Emulation.setScriptExecutionDisabled", {"value": False}, self.s)

    def ev(self, expr):
        res = self.br.send("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True}, self.s, timeout=TIMEOUT + 30)
        if "exceptionDetails" in res:
            raise RuntimeError(f"page error: {res['exceptionDetails']}")
        return res["result"].get("value")

    def shot(self, path):
        data = self.br.send("Page.captureScreenshot", {"format": "png"}, self.s)["data"]
        Path(path).write_bytes(base64.b64decode(data))

    def close(self):
        try:
            self.br.send("Target.closeTarget", {"targetId": self.tid}, timeout=5)
        except Exception:
            pass


# Scroll through the page in real time, then back to the top, and measure.
MEASURE = r"""(async function () {
  var W = window, d = document, H = W.innerHeight, sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var out = { w: W.innerWidth, h: H, reduced: W.matchMedia('(prefers-reduced-motion: reduce)').matches, jsClass: d.documentElement.classList.contains('js') };
  // wait until the views are drawn (app.js renders asynchronously after loading site data)
  var t0 = Date.now();
  while (Date.now() - t0 < 15000) {
    var v = d.querySelector('#live .view'); if (v && v.textContent.length > 200) break; await sleep(100);
  }
  await sleep(500);
  var step = Math.round(H * 0.4), total = d.documentElement.scrollHeight;
  for (var y = 0; y <= total; y += step) { W.scrollTo({ top: y, behavior: 'instant' }); await sleep(200); total = d.documentElement.scrollHeight; }
  W.scrollTo({ top: d.documentElement.scrollHeight, behavior: 'instant' }); await sleep(500);
  W.scrollTo({ top: 0, behavior: 'instant' }); await sleep(2500);  // let the last transitions end (<= 0.6 s + stagger)
  var de = d.documentElement, cw = de.clientWidth;
  out.scrollWidth = de.scrollWidth; out.clientWidth = cw; out.pageHeight = de.scrollHeight;
  var name = function (el) { return el.tagName.toLowerCase() + (el.className && el.className.baseVal === undefined ? '.' + String(el.className).trim().replace(/\s+/g, '.') : ''); };
  out.wide = Array.prototype.filter.call(d.querySelectorAll('body *'), function (el) {
    // .halo is a decorative blurred glow that is meant to bleed off the edge; everything else must stay inside the viewport
    var cs = W.getComputedStyle(el); if (cs.position === 'fixed' || cs.display === 'none' || el.closest('.halo')) return false;
    var r = el.getBoundingClientRect(); return r.width > 0 && (r.right > cw + 1 || r.left < -1);
  }).slice(0, 8).map(function (el) { var r = el.getBoundingClientRect(); return name(el) + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']'; });
  out.h1 = d.querySelectorAll('h1').length;
  out.nav = d.querySelectorAll('#nav a').length;
  var top = d.querySelector('.top'); out.topH = top ? top.offsetHeight : 0;
  out.sections = {};
  ['explore', 'scenario', 'equipment', 'live'].forEach(function (id) {
    var s = d.getElementById(id), v = s && s.querySelector('.view');
    if (!s || !v) { out.sections[id] = null; return; }
    var cols = s.querySelector('.cols'), svg = s.querySelector('svg.chart');
    out.sections[id] = {
      height: Math.round(s.getBoundingClientRect().height), viewHeight: v.offsetHeight, chars: v.textContent.length,
      colsHeight: cols ? Math.round(cols.getBoundingClientRect().height) : null,
      chartWidth: svg ? Math.round(svg.getBoundingClientRect().width) : null,
      chartHeight: svg ? Math.round(svg.getBoundingClientRect().height) : null,
      innerScroll: Array.prototype.filter.call(v.querySelectorAll('*'), function (el) {
        var o = W.getComputedStyle(el).overflowY; return (o === 'auto' || o === 'scroll') && el.scrollHeight > el.clientHeight + 1;
      }).map(function (el) { return String(el.className); })
    };
  });
  var hidden = [], notIn = [];
  Array.prototype.forEach.call(d.querySelectorAll('[data-reveal], main section, h1, h2, .view'), function (el) {
    var cs = W.getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.99 || cs.visibility === 'hidden') hidden.push(name(el) + ' opacity=' + cs.opacity + ' vis=' + cs.visibility);
    if (el.hasAttribute('data-reveal') && !el.classList.contains('in') && out.jsClass) notIn.push(name(el));
  });
  out.hidden = hidden; out.notIn = notIn;
  out.reveal = d.querySelectorAll('[data-reveal]').length;
  out.hash = location.hash;
  return JSON.stringify(out);
})()"""


def measure(br, base, w, h, hash_="", reduced=False, nojs=False):
    tab = Tab(br, base + "/index.html" + (("#" + hash_) if hash_ else ""), w, h, reduced, nojs)
    try:
        r = json.loads(tab.ev(MEASURE))
    finally:
        tab.close()
    r["nojs"] = nojs
    return r


def check(r, label, fails, hash_expect=None):
    def need(cond, msg):
        print(("ok:   " if cond else "FAIL: ") + f"{label} {msg}")
        if not cond:
            fails.append(f"{label} {msg}")

    # <main> uses overflow-x: clip, so scrollWidth alone hides clipped content; also test every element's box against the viewport.
    need(r["scrollWidth"] <= r["clientWidth"] + 1 and not r["wide"],
         f"no horizontal overflow ({r['scrollWidth']} <= {r['clientWidth']}), no element outside the viewport {r['wide']}")
    need(r["h1"] == 1 or (r["nojs"] and r["h1"] >= 1), f"exactly one h1 ({r['h1']})")
    need(not r["hidden"], f"nothing left hidden after scrolling {r['hidden'][:4]}")
    if r["nojs"]:
        need(not r["jsClass"], "no-js run really had no 'js' class")
        return
    if r["reduced"]:
        need(True, "reduced-motion emulation active")
    need(not r["notIn"], f"every [data-reveal] got 'in' ({len(r['notIn'])} missing) {r['notIn'][:4]}")
    need(r["nav"] == 4, f"four nav links ({r['nav']})")
    need(r["reveal"] > 8, f"reveal targets present ({r['reveal']})")
    for sid in SECTIONS:
        s = r["sections"][sid]
        need(bool(s) and s["chars"] > 200 and s["viewHeight"] > 100, f"#{sid} rendered ({s and s['chars']} chars, {s and s['viewHeight']}px)")
    if hash_expect:
        need(r["hash"] == hash_expect, f"legacy hash rewritten to {hash_expect} (now {r['hash']!r})")
    desktop = r["w"] >= 900
    if desktop:
        ex, sc = r["sections"]["explore"], r["sections"]["scenario"]
        avail = r["h"] - r["topH"]
        need(ex["height"] <= max(avail, 600) + 1, f"#explore panel fits the viewport ({ex['height']} <= {max(avail, 600)})")
        need(sc["colsHeight"] is not None and sc["colsHeight"] <= max(avail, 520) + 1, f"FLEX panel fits the viewport ({sc['colsHeight']} <= {max(avail, 520)})")
        need((ex["chartWidth"] or 0) > 250 and (sc["chartWidth"] or 0) > 250 and (ex["chartHeight"] or 0) > 100 and (sc["chartHeight"] or 0) > 100,
             f"charts are sized (explore {ex['chartWidth']}x{ex['chartHeight']}, scenario {sc['chartWidth']}x{sc['chartHeight']})")
    for sid in ("scenario", "equipment", "live"):
        # The FLEX panel keeps its coefficient list scrolling inside the panel on desktop (plan is silent on it); nothing else scrolls.
        boxes = [c for c in r["sections"][sid]["innerScroll"] if not (desktop and sid == "scenario" and c == "scroll detail")]
        need(not boxes, f"#{sid} has no inner scroll box {boxes[:3]}")
    if not desktop:
        need(not r["sections"]["explore"]["innerScroll"], "#explore has no inner scroll box on mobile")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--motion", action="store_true", help="also check reduced motion and JavaScript disabled")
    ap.add_argument("--shots", help="directory for screenshots")
    args = ap.parse_args()
    exe = find_chrome()
    srv = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(APP)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    fails = []
    br = Browser(exe)
    try:
        for w, h in SIZES:
            check(measure(br, base, w, h), f"{w}x{h}", fails)
        check(measure(br, base, 1440, 900, "senaryo"), "1440x900 #senaryo", fails, hash_expect="#scenario")
        if args.motion:
            for w, h in ((1440, 900), (390, 844)):
                r = measure(br, base, w, h, reduced=True)
                if not r["reduced"]:
                    fails.append("reduced-motion flag not applied")
                    print("FAIL: reduced-motion flag not applied")
                check(r, f"{w}x{h} reduced-motion", fails)
                check(measure(br, base, w, h, nojs=True), f"{w}x{h} no-js", fails)
        if args.shots:
            out = Path(args.shots)
            out.mkdir(parents=True, exist_ok=True)
            for w, h in ((1440, 900), (390, 844)):
                for sid in ["top"] + SECTIONS:
                    tab = Tab(br, base + "/index.html", w, h)
                    try:
                        tab.ev("new Promise(r => setTimeout(r, 1500))")
                        if sid != "top":
                            tab.ev(f"document.getElementById('{sid}').scrollIntoView({{behavior:'instant',block:'start'}})")
                        tab.ev("new Promise(r => setTimeout(r, 2500))")
                        tab.shot(out / f"{w}_{sid}.png")
                    finally:
                        tab.close()
    except Exception as e:  # a crashed measurement is a failure, not a pass
        print(f"FAIL: measurement error: {e}")
        fails.append(str(e))
    finally:
        srv.shutdown()
        br.close()
    if fails:
        print(f"\n{len(fails)} FAILED")
        sys.exit(1)
    print("\nALL PASSED")


if __name__ == "__main__":
    main()
