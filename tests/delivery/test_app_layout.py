"""S1 acceptance: static site lives in app/, old Streamlit is gone, English only, nothing lost from design/."""
import shutil
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
APP = REPO / "app"


def test_layout():
    assert (APP / "index.html").is_file() and not (REPO / "design").exists() and not (REPO / ".streamlit").exists()
    assert not list(APP.rglob("*.py")) or all(p.name == "logo_uyarla.py" for p in APP.rglob("*.py"))
    box = APP / "assets" / "flamesense_box"
    assert (box / "flamesense.blend").is_file() and len(list(box.glob("render_*.png"))) == 4


def test_no_streamlit_plotly_no_lang_switch():
    for p in APP.rglob("*"):
        if p.is_file() and p.suffix in {".js", ".html", ".css", ".md", ".py"}:
            t = p.read_text(encoding="utf8").lower()
            assert "streamlit" not in t and "plotly" not in t, p
    assert "lang=tr" not in (APP / "i18n.js").read_text(encoding="utf8")
    assert "tr:" not in (APP / "i18n.js").read_text(encoding="utf8").replace("str:", "")


def test_connection_points():
    html = (APP / "index.html").read_text(encoding="utf8")
    assert "data/site_data.js" in html and "ui/ask.js" in html and "mountAsk" in (APP / "app.js").read_text(encoding="utf8")


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_js_syntax():
    for f in APP.rglob("*.js"):
        assert subprocess.run(["node", "--check", str(f)], capture_output=True).returncode == 0, f
