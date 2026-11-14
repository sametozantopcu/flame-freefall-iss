"""One-off: cut a small, personal-data-free fixture out of raw/PSI-25/detail.json (raw/ is only READ).

    python tests/fixtures/make_detail_fixture.py
Picks entries by criteria so the fixture exercises the parser: a publication with and without DOI, files with int and
float sizes, a video, a spreadsheet, a pdf and an image, plus removed files. `contacts` (e-mails/phones) is emptied.
"""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "data_analysis" / "Nasa_data" / "raw" / "PSI-25" / "detail.json"
DST = Path(__file__).with_name("detail_PSI-25.json")

d = json.loads(SRC.read_text())
pubs = [p for p in d["publications"] if p.get("doi")][:2] + [p for p in d["publications"] if not p.get("doi")][:1]
ext = lambda f: f["file_name"].lower().rsplit(".", 1)[-1]
first = lambda pred, xs: next(x for x in xs if pred(x))
added = [first(lambda f: ext(f) == "mp4", d["added"]),
         first(lambda f: ext(f) == "xlsx", d["added"]),
         first(lambda f: ext(f) == "pdf", d["added"]),
         first(lambda f: isinstance(f["file_size"], int) and ext(f) == "zip", d["added"]),
         first(lambda f: isinstance(f["file_size"], int) and ext(f) == "jpg", d["added"])]
added = list({f["remote_path"]: f for f in added}.values())
out = {k: v for k, v in d.items()}
out["publications"], out["added"], out["removed"], out["contacts"] = pubs, added, d["removed"][:2], []
DST.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
print(f"wrote {DST}: {len(pubs)} pubs, {len(added)} added, 2 removed, {DST.stat().st_size} bytes")
