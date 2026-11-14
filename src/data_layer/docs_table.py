"""Generates the targets table embedded in src/data_layer/README.md from spec.SPEC (so it cannot go stale).

    python -m src.data_layer.docs_table          # rewrite the block in README.md
"""
from __future__ import annotations

import re
from pathlib import Path

from .spec import SPEC

README = Path(__file__).with_name("README.md")
BEGIN, END = "<!-- BEGIN targets (generated: python -m src.data_layer.docs_table) -->", "<!-- END targets -->"


def targets_table() -> str:
    rows = ["| tablo | hedef | görev | alt küme (satır filtresi) |", "|---|---|---|---|"]
    for name, s in SPEC.items():
        for t, ts in s["targets"].items():
            rows.append(f"| `{name}` | `{t}` | {ts['task']} | `{ts['subset'] or '-'}` |")
    return "\n".join(rows)


def render_block() -> str:
    return f"{BEGIN}\n{targets_table()}\n{END}"


def update_readme(path: Path = README) -> None:
    text = path.read_text()
    new, n = re.subn(re.escape(BEGIN) + r".*?" + re.escape(END), lambda _: render_block(), text, flags=re.S)
    if n != 1:
        raise ValueError(f"expected exactly one generated block in {path}, found {n}")
    path.write_text(new)


if __name__ == "__main__":
    update_readme()
    print(f"updated {README}")
