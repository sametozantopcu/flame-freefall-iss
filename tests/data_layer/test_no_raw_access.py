"""F2 - the data-layer usage rule: modules never read raw/ or csv/ directly (Architecture.md §1).

Static check (see rawscan.py for what it can and cannot see). Scanned: app/, backend/ (when it exists) and src/ outside
data_layer. EDA scripts and ingest/ are the ones that legitimately read raw/csv and are NOT scanned.
"""
import re
import textwrap

import pytest

from conftest import REPO
from rawscan import format_violations, scan_dirs, scan_file, scan_source

ALLOWLIST: dict = {}        # {"app/some_file.py": "reason this direct access is legitimate"}; empty on purpose
DATA_LAYER_RAW_OK = {"metadata.py", "build_all.py"}       # the only data_layer files that may touch raw/ (never csv/)


def _scan_targets():
    src = REPO / "src"
    others = [p for p in sorted(src.iterdir()) if p.is_dir() and p.name not in {"data_layer", "__pycache__"}] if src.exists() else []
    return [REPO / "app", REPO / "backend", *others]


POSITIVE = [
    ('p = "data_analysis/Nasa_data/raw/PSI-25/detail.json"', "nasa_data_folder"),
    ('pd.read_csv("csv/PSI-10/x.csv")', "raw_csv_segment"),
    ('open("./raw/PSI-1/detail.json")', "raw_csv_segment"),
    ('p = f"{root}/Nasa_data/raw/{psi}"', "nasa_data_folder"),
    ('p = base / "raw" / "PSI-25"', "path_join"),
    ('p = Path("data", "csv")', "path_call"),
    ('p = os.path.join(root, "raw", "x")', "path_call"),
    ('p = root.joinpath("csv")', "path_call"),
    ('from src.data_layer.metadata import RAW_DIR', "RAW_DIR"),
    ('x = metadata.RAW_DIR', "RAW_DIR"),
    ('import _common', "analysis_helper"),
    ('from _common import SPEC', "analysis_helper"),
    ('p = "PSI-101/Combined_SAMER_Results.csv"', "psi_path"),
]
NEGATIVE = [
    'x = "text/csv"', 'st.file_uploader("x", type="csv")', 'f = "bass2_clean.csv"',
    'DATA = ROOT / "data" / "processed" / "bass2_clean.csv"', 'raw = pd.read_csv(path)', 'raw_df = load()',
    'cols = ["hot_ignition_raw"]', 'd = {"raw": 1, "csv": 2}', 'x = "Nasa_data"', 'x = ", ".join(["raw", "csv"])',
    'label = t("sidebar.csv_hint")', 'x = "https://example.com/rawdata"', 'f("raw")', 'p = Path("data") / "processed"',
    '"""Reads csv/ and raw/ folders (docstring, not code)."""', 'def f():\n    """csv/PSI-10/x.csv is mentioned here."""\n    return 1',
    '# csv/PSI-10/x.csv in a comment\nx = 1', 'x = "raw"', 'x = "csv"',
]


@pytest.mark.parametrize("code,kind", POSITIVE)
def test_detector_flags(code, kind):
    v = scan_source(code)
    assert [(x.line, x.kind) for x in v] == [(1, kind)], v


@pytest.mark.parametrize("code", NEGATIVE)
def test_detector_ignores(code):
    assert scan_source(code) == []


def test_detector_reports_the_right_line_and_snippet():
    code = textwrap.dedent('''\
        import pandas as pd

        def load():
            return pd.read_csv("csv/PSI-10/a.csv")
        ''')
    (v,) = scan_source(code, "app/x.py")
    assert (v.path, v.line, v.kind) == ("app/x.py", 4, "raw_csv_segment") and "read_csv" in v.snippet


def test_unparsable_file_is_a_violation_not_skipped():
    (v,) = scan_source("def (:\n", "app/broken.py")
    assert v.kind == "unparsable"


def test_detector_finds_real_raw_readers():
    """The detector is not blind: the ingest and EDA scripts really do read raw/csv and must be flagged."""
    nasa = REPO / "data_analysis" / "Nasa_data"
    for rel, kind in [("ingest/psi_all.py", "raw_csv_segment"), ("analysis/scripts/01_load_core.py", "psi_path"),
                      ("analysis/scripts/01_load_core.py", "analysis_helper")]:
        kinds = {v.kind for v in scan_file(nasa / rel, REPO)}
        assert kind in kinds, (rel, kinds)


def test_the_rule_holds_in_app_backend_and_src():
    """Acceptance: no direct raw/csv access outside the data layer."""
    targets = _scan_targets()
    violations, scanned, missing = scan_dirs(targets, REPO, ALLOWLIST)
    assert "app" not in missing and len([f for f in scanned if f.startswith("app/")]) >= 20   # it really looked at app/
    assert not violations, format_violations(violations)
    assert set(missing) <= {"backend"}                                    # a missing backend/ is reported, scanned once it exists


def test_injected_violation_is_found(tmp_path):
    (tmp_path / "app").mkdir()
    (tmp_path / "app" / "ok.py").write_text('x = "text/csv"\n')
    (tmp_path / "app" / "bad.py").write_text('import pandas as pd\ndf = pd.read_csv("csv/PSI-10/a.csv")\n')
    v, scanned, missing = scan_dirs([tmp_path / "app", tmp_path / "backend"], tmp_path)
    assert [(x.path, x.line) for x in v] == [("app/bad.py", 2)] and len(scanned) == 2 and missing == ["backend"]
    msg = format_violations(v)
    assert "app/bad.py:2" in msg and "get_modeling_frame" in msg and "ALLOWLIST" in msg     # the message says what to do


def test_allowlist_skips_a_file_and_stale_entries_fail(tmp_path):
    (tmp_path / "app").mkdir()
    (tmp_path / "app" / "bad.py").write_text('p = "csv/PSI-10/a.csv"\n')
    v, _, _ = scan_dirs([tmp_path / "app"], tmp_path, {"app/bad.py": "legacy importer, reviewed"})
    assert v == []
    for rel, reason in ALLOWLIST.items():                                 # real allowlist: reasons required, no dead entries
        assert reason.strip() and (REPO / rel).is_file(), rel


def test_inside_data_layer_only_metadata_and_build_all_touch_raw_and_nobody_touches_csv():
    flagged = {}
    for f in sorted((REPO / "src" / "data_layer").glob("*.py")):
        vs = scan_file(f, REPO)
        if vs:
            flagged[f.name] = vs
    assert set(flagged) <= DATA_LAYER_RAW_OK, {k: [str(v) for v in vs] for k, vs in flagged.items() if k not in DATA_LAYER_RAW_OK}
    assert flagged, "metadata.py reads raw/: the detector should see it"
    for name, vs in flagged.items():
        for v in vs:
            assert not re.search(r"Nasa_data[/\\]csv|(^|[^A-Za-z0-9_])csv[/\\]|[\"']csv[\"']", v.snippet), f"{name}: csv/ access: {v}"
