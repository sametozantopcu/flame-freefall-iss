"""C6 - src/data_layer/README.md must stay true: example runs (with its own asserts), generated table is current."""
import re
from pathlib import Path

import pytest

from conftest import REPO
from src.data_layer import docs_table
from src.data_layer.spec import SPEC

README = REPO / "src" / "data_layer" / "README.md"
TEXT = README.read_text()


def _example() -> str:
    blocks = re.findall(r"```python\n(.*?)```", TEXT, flags=re.S)
    assert len(blocks) == 1, "README must contain exactly one python example"
    return blocks[0]


def test_example_is_about_ten_lines():
    lines = [l for l in _example().splitlines() if l.strip()]
    assert 8 <= len(lines) <= 14


def test_example_runs_from_any_cwd(tmp_path, monkeypatch, capsys):
    monkeypatch.chdir(tmp_path)                       # a user is not necessarily in the repo
    ns: dict = {}
    exec(compile(_example(), "README.md", "exec"), ns)    # its own asserts must pass
    assert capsys.readouterr().out.split() == ["268", "mm"]


def test_generated_table_is_current():
    m = re.search(re.escape(docs_table.BEGIN) + r".*?" + re.escape(docs_table.END), TEXT, flags=re.S)
    assert m, "generated block missing"
    assert m.group(0) == docs_table.render_block(), "run: python -m src.data_layer.docs_table"
    rows = [r for r in m.group(0).splitlines() if r.startswith("| `")]
    assert len(rows) == 19 == sum(len(s["targets"]) for s in SPEC.values())


def test_update_readme_is_idempotent(tmp_path):
    p = tmp_path / "R.md"
    p.write_text(TEXT)
    docs_table.update_readme(p)
    assert p.read_text() == TEXT                      # already current -> no change
    p.write_text(TEXT.replace(docs_table.END, "").replace("<!-- END", "<!-- X"))
    with pytest.raises(ValueError, match="exactly one generated block"):
        docs_table.update_readme(p)


def test_named_api_exists():
    import importlib
    for mod_fn in set(re.findall(r"`((?:store|features|frame|spec)\.\w+)", TEXT)):
        mod, fn = mod_fn.split(".")
        assert hasattr(importlib.import_module(f"src.data_layer.{mod}"), fn), f"README names missing {mod_fn}"
    for tier2 in ["saffire1", "spice", "acme_testdays"]:
        assert tier2 not in SPEC                      # README claims Tier-2 tables have no targets
