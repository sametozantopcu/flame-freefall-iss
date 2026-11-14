#!/usr/bin/env bash
# End-to-end check: build, JS syntax, smoke scripts, live server probes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PY="${PY:-/home/halil/miniconda3/envs/nasa_hack/bin/python}"
cd "$ROOT"

$PY scripts/build_site_data.py
find app -name '*.js' -print0 | xargs -0 -n1 node --check
node scripts/smoke_explore_scenario.mjs
node scripts/smoke_equipment.mjs
node scripts/smoke_risk.mjs

PORT=$($PY -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1])')
LLM_TIMEOUT=3 $PY app/server.py --port "$PORT" >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true; wait $SRV 2>/dev/null || true' EXIT
BASE="http://127.0.0.1:$PORT"
for _ in $(seq 50); do curl -s -o /dev/null "$BASE/" && break; sleep 0.2; done

code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
[ "$(code "$BASE/")" = 200 ] || { echo "FAIL /"; exit 1; }
for ref in $(grep -oE '(src|href)="[^":]+\.(js|css)"' app/index.html | sed -E 's/.*="([^"]+)"/\1/'); do
  [ "$(code "$BASE/$ref")" = 200 ] || { echo "FAIL $ref"; exit 1; }
done
for p in /.env /server.py; do
  c=$(code "$BASE$p"); case "$c" in 403|404) ;; *) echo "FAIL $p -> $c"; exit 1;; esac
done
[ "$(code "$BASE/data/site_data.json")" = 200 ] || { echo "FAIL site_data.json"; exit 1; }
RES=$(curl -s -m 20 -w '\n%{http_code}' -H 'Content-Type: application/json' \
  -d '{"question":"Which investigation has the highest habitat score?"}' "$BASE/api/ask")
[ "$(echo "$RES" | tail -1)" = 200 ] || { echo "FAIL /api/ask status"; exit 1; }
echo "$RES" | head -n -1 | $PY -c 'import sys,json;a=json.load(sys.stdin).get("answer","");sys.exit(0 if a.strip() else 1)' \
  || { echo "FAIL empty answer"; exit 1; }
echo "E2E OK"
