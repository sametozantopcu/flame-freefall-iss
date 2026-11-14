"""B1 - parquet schema: 11 tables, trace columns complete, row counts match load_report.md."""
import re

import pytest

from conftest import OUT, TABLES

TRACE = ["psi_id", "source_file", "source_row"]


def _expected_rows():
    rows = {}
    for line in (OUT / "load_report.md").read_text().splitlines():
        if line.startswith("## "):  # only the first table (before the notes sections)
            break
        m = re.match(r"\|\s*(\w+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|", line)
        if m:
            rows[m.group(1)] = int(m.group(3))  # rows_after
    return rows


def test_eleven_tables(tables):
    assert sorted(tables) == sorted(TABLES) and len(tables) == 11


@pytest.mark.parametrize("name", TABLES)
def test_trace_columns_complete(tables, name):
    df = tables[name]
    for c in TRACE:
        assert c in df.columns, f"{name}: missing trace column {c}"
        assert df[c].isna().sum() == 0, f"{name}.{c} has missing values"


def test_row_counts_match_load_report(tables):
    exp = _expected_rows()
    assert set(exp) == set(TABLES), f"load_report tables differ: {set(exp) ^ set(TABLES)}"
    got = {t: len(df) for t, df in tables.items()}
    assert got == exp
