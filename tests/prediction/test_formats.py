"""02/A4 - CSV and Parquet download files: same content in both formats, missing stays missing.

Contract (src/prediction/datasets.py):
  build_all(out_dir) writes, per dataset in DATASETS order, "<name>.parquet" then "<name>.csv"
  (to_csv(index=False, encoding="utf-8", lineterminator="\n")) and returns the written paths in that order.
  CLI: python -m src.prediction.datasets build [out_dir].

Normalisation used to compare CSV against Parquet (see _cell_matches):
  - every kind of NA (NaN, None, pd.NA) -> None; in the CSV text a missing value must be an empty cell;
  - bool and nullable boolean compared by value (CSV text "True"/"False");
  - floats compared EXACTLY (pandas writes repr-precision floats; checked on the real data, no tolerance needed);
  - ints exact; strings exact (no strip, no numeric coercion: psi_id/source_file stay text).
"""
import csv
import hashlib
import io
import subprocess
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from conftest import REPO
from src.prediction import datasets as D
from src.prediction.datasets import build_all, build_dataset

NAMES = ["droplet", "gas_flame", "smoke", "solid_atm"]
ROWS = {"droplet": 501, "gas_flame": 333, "smoke": 134, "solid_atm": 129}
# Default pandas NA tokens: a string cell equal to one of these would silently become NA on a default read_csv.
PANDAS_NA_TOKENS = {"", "#N/A", "#N/A N/A", "#NA", "-1.#IND", "-1.#QNAN", "-NaN", "-nan", "1.#IND", "1.#QNAN",
                    "<NA>", "N/A", "NA", "NULL", "NaN", "None", "n/a", "nan", "null"}


def _expected_paths(out_dir):
    return [out_dir / f"{n}.{ext}" for n in NAMES for ext in ("parquet", "csv")]


@pytest.fixture(scope="module")
def frames():
    return {n: build_dataset(n).reset_index(drop=True) for n in NAMES}


@pytest.fixture(scope="module")
def written(tmp_path_factory):
    out = tmp_path_factory.mktemp("modeling")
    paths = build_all(out)
    return out, paths


def _read_csv_text(path):
    raw = path.read_bytes()
    text = raw.decode("utf-8", errors="strict")
    rows = list(csv.reader(io.StringIO(text, newline="")))
    return raw, text, rows[0], rows[1:]


def _is_na(v):
    return v is None or v is pd.NA or (isinstance(v, float) and np.isnan(v))


def _cell_matches(kind, pq_value, csv_text):
    """Compare one Parquet value with its raw CSV cell text under the normalisation in the module docstring."""
    if _is_na(pq_value):
        return csv_text == ""
    if csv_text == "":
        return False
    if kind == "b":
        return csv_text == ("True" if bool(pq_value) else "False")
    if kind == "f":
        return float(csv_text) == float(pq_value)
    if kind in "iu":
        return int(csv_text) == int(pq_value)
    return csv_text == str(pq_value)


def _kind(series):
    if pd.api.types.is_bool_dtype(series.dtype):
        return "b"
    if pd.api.types.is_float_dtype(series.dtype):
        return "f"
    if pd.api.types.is_integer_dtype(series.dtype):
        return "i"
    return "s"


def _mismatches(df, header, body):
    """Return a list of (row, column) cells where the CSV body differs from df; also structural problems."""
    problems = []
    if header != list(df.columns):
        problems.append(("header", header))
    if len(body) != len(df):
        problems.append(("rows", len(body)))
        return problems
    for j, c in enumerate(df.columns):
        k = _kind(df[c])
        for i, v in enumerate(df[c].tolist()):
            if len(body[i]) != len(header) or not _cell_matches(k, v, body[i][j]):
                problems.append((i, c))
    return problems


def _normalise(df):
    """Value-level normal form for a pandas-read frame: object columns, every NA -> None, numpy scalars -> Python."""
    out = {}
    for c in df.columns:
        vals = []
        for v in df[c].tolist():
            if _is_na(v):
                vals.append(None)
            elif isinstance(v, (bool, np.bool_)):
                vals.append(bool(v))
            elif isinstance(v, (int, np.integer)):
                vals.append(float(v))      # int vs float dtype differences are tolerated; value must be equal
            elif isinstance(v, (float, np.floating)):
                vals.append(float(v))
            else:
                vals.append(str(v))
        out[c] = vals
    return out


# --- files and contract -------------------------------------------------------------------------------------------

def test_dataset_names_and_order():
    assert list(D.DATASETS) == NAMES


def test_default_out_dir():
    assert D.DEFAULT_OUT == REPO / "data" / "modeling"


def test_build_all_returns_eight_paths_in_order(written):
    out, paths = written
    assert len(paths) == 8
    assert [Path(p) for p in paths] == _expected_paths(out)
    for p in _expected_paths(out):
        assert p.is_file() and p.stat().st_size > 0, p
    assert sorted(x.name for x in out.iterdir()) == sorted(p.name for p in _expected_paths(out))


# --- parquet ------------------------------------------------------------------------------------------------------

@pytest.mark.parametrize("name", NAMES)
def test_parquet_equals_build_dataset_exactly(written, frames, name):
    out, _ = written
    pq = pd.read_parquet(out / f"{name}.parquet")
    assert len(pq) == ROWS[name]
    pd.testing.assert_frame_equal(pq, frames[name], check_exact=True, check_dtype=True)


# --- csv text level -----------------------------------------------------------------------------------------------

@pytest.mark.parametrize("name", NAMES)
def test_csv_is_strict_utf8_lf_no_bom(written, name):
    out, _ = written
    raw = (out / f"{name}.csv").read_bytes()
    raw.decode("utf-8", errors="strict")
    assert not raw.startswith(b"\xef\xbb\xbf"), "no BOM"
    assert b"\r" not in raw, "line terminator must be \\n"
    assert raw.endswith(b"\n")


@pytest.mark.parametrize("name", NAMES)
def test_csv_header_has_no_index_column(written, frames, name):
    out, _ = written
    _, _, header, body = _read_csv_text(out / f"{name}.csv")
    assert header == list(frames[name].columns)
    assert header[0] == "psi_id" and "" not in header and "Unnamed: 0" not in header
    assert all(len(r) == len(header) for r in body)
    assert len(body) == ROWS[name]


@pytest.mark.parametrize("name", NAMES)
def test_csv_missing_cells_are_empty_and_counted(written, name):
    """Per column: number of empty CSV cells == number of NA values in the parquet. Missing is never 0/NaN/'<NA>'."""
    out, _ = written
    pq = pd.read_parquet(out / f"{name}.parquet")
    _, text, header, body = _read_csv_text(out / f"{name}.csv")
    for j, c in enumerate(header):
        empty = sum(1 for r in body if r[j] == "")
        assert empty == int(pq[c].isna().sum()), c
    for token in ("NaN", "nan", "<NA>", "None", "NA"):
        assert not any(cell == token for r in body for cell in r), token
    assert '""' not in text, "missing cells must be bare empty fields, not quoted empty strings"


@pytest.mark.parametrize("name", NAMES)
def test_csv_cells_equal_parquet_values(written, name):
    """Cell-by-cell: same columns, same row order, values equal under the normalisation (floats exact)."""
    out, _ = written
    pq = pd.read_parquet(out / f"{name}.parquet")
    _, _, header, body = _read_csv_text(out / f"{name}.csv")
    bad = _mismatches(pq, header, body)
    assert not bad, bad[:10]


@pytest.mark.parametrize("name", NAMES)
def test_bool_columns_written_as_true_false(written, frames, name):
    out, _ = written
    _, _, header, body = _read_csv_text(out / f"{name}.csv")
    df = frames[name]
    bool_cols = [c for c in df.columns if pd.api.types.is_bool_dtype(df[c].dtype)]
    assert any(c.startswith("in_subset__") for c in bool_cols)
    for c in bool_cols:
        j = header.index(c)
        allowed = {"True", "False"} | ({""} if df[c].isna().any() else set())
        assert {r[j] for r in body} <= allowed, c


# --- csv read back with pandas ------------------------------------------------------------------------------------

@pytest.mark.parametrize("name", NAMES)
def test_pandas_read_csv_equals_parquet_after_normalisation(written, name):
    """A user doing a plain pd.read_csv gets the same values (dtype differences tolerated)."""
    out, _ = written
    pq = pd.read_parquet(out / f"{name}.parquet")
    back = pd.read_csv(out / f"{name}.csv", encoding="utf-8")
    assert list(back.columns) == list(pq.columns)
    assert len(back) == len(pq)
    a, b = _normalise(pq), _normalise(back)
    for c in pq.columns:
        diff = [i for i, (x, y) in enumerate(zip(a[c], b[c])) if x != y]
        assert not diff, (c, diff[:5], [a[c][i] for i in diff[:5]], [b[c][i] for i in diff[:5]])


@pytest.mark.parametrize("name", NAMES)
def test_text_columns_stay_text(written, frames, name):
    """psi_id/source_file etc. must survive: no empty strings (indistinguishable from missing), no NA tokens,
    no surrounding whitespace that a reader might strip."""
    df = frames[name]
    for c in df.columns:
        if _kind(df[c]) != "s":
            continue
        vals = df[c].dropna().astype(str)
        assert not vals.isin(PANDAS_NA_TOKENS).any(), c
        assert (vals == vals.str.strip()).all(), c
    back = pd.read_csv(written[0] / f"{name}.csv", dtype=str, keep_default_na=False)
    assert back["psi_id"].str.match(r"^PSI-\d+$").all()
    assert back["source_file"].tolist() == df["source_file"].tolist()


# --- negative controls for the comparator -------------------------------------------------------------------------

def test_comparator_detects_corruption(frames):
    """The cell comparator must catch: a NA filled with 0, a float off by 1 ulp, a swapped row, a flipped bool."""
    df = frames["droplet"]
    good = df.to_csv(index=False, lineterminator="\n")
    rows = list(csv.reader(io.StringIO(good)))
    header, body = rows[0], rows[1:]
    assert _mismatches(df, header, body) == []

    j = header.index("x_co2")
    i = next(k for k, r in enumerate(body) if r[j] == "")
    bad = [r[:] for r in body]; bad[i][j] = "0"
    assert (i, "x_co2") in _mismatches(df, header, bad)

    j = header.index("x_o2")
    bad = [r[:] for r in body]; bad[0][j] = repr(float(np.nextafter(float(body[0][j]), np.inf)))
    assert (0, "x_o2") in _mismatches(df, header, bad)

    bad = [r[:] for r in body]; bad[0], bad[-1] = bad[-1], bad[0]
    assert _mismatches(df, header, bad)

    j = header.index("burn_time_truncated")
    i = next(k for k, r in enumerate(body) if r[j] == "True")
    bad = [r[:] for r in body]; bad[i][j] = "False"
    assert (i, "burn_time_truncated") in _mismatches(df, header, bad)


# --- determinism, CLI, git ----------------------------------------------------------------------------------------

def _digests(paths):
    return [hashlib.sha256(p.read_bytes()).hexdigest() for p in paths]


def test_two_runs_are_byte_identical(written, tmp_path):
    out1, paths1 = written
    paths2 = build_all(tmp_path)
    assert [p.name for p in paths2] == [p.name for p in paths1]
    assert _digests(paths1) == _digests(paths2)


def test_cli_writes_same_eight_files(written, tmp_path):
    out1, paths1 = written
    r = subprocess.run([sys.executable, "-m", "src.prediction.datasets", "build", str(tmp_path)],
                       cwd=REPO, capture_output=True, text=True, timeout=600)
    assert r.returncode == 0, r.stderr
    exp = _expected_paths(tmp_path)
    assert sorted(x.name for x in tmp_path.iterdir()) == sorted(p.name for p in exp)
    assert _digests(exp) == _digests(paths1)


def test_default_output_dir_is_git_ignored():
    for f in ("data/modeling/droplet.csv", "data/modeling/droplet.parquet"):
        r = subprocess.run(["git", "check-ignore", "-q", f], cwd=REPO)
        assert r.returncode == 0, f"{f} is not git-ignored"
