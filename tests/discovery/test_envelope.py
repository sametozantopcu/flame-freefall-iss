"""Acceptance tests for plans/01_m1_discovery step A1: envelope from parquet tables.

Expected values were computed independently from the Feature Store views
(src.data_layer.store), not from src/discovery/envelope.py.
"""
import builtins
import inspect
import math
import re

import pandas as pd
import pytest

from src.data_layer.store import connect, connect_all

NAN = float("nan")

COLUMNS = [
    "psi_id", "table", "relation", "source", "n_rows",
    "o2_basis", "o2_min_pct", "o2_max_pct",
    "p_min_atm", "p_max_atm", "p_invalid_n",
    "flow_min_cm_s", "flow_max_cm_s", "flow_invalid_n",
    "diluents", "fuels", "materials", "material_class",
    "gravity", "phenomena",
]

# (psi_id, table, relation, n_rows) in the required order
ROWS = [
    ("PSI-10", "acme_inverse", "source_file", 120),
    ("PSI-10", "acme_normal", "source_file", 207),
    ("PSI-20", "acme_testdays", "source_file", 18),
    ("PSI-21", "acme_testdays", "source_file", 32),
    ("PSI-22", "acme_testdays", "source_file", 32),
    ("PSI-23", "acme_testdays", "source_file", 18),
    ("PSI-25", "bass2", "source_file", 129),
    ("PSI-39", "cfi", "source_file", 227),
    ("PSI-69", "flex", "source_file", 274),
    ("PSI-98", "saffire1", "source_file", 4),
    ("PSI-99", "saffire2", "source_file", 15),
    ("PSI-100", "saffire3", "source_file", 2),
    ("PSI-101", "smoke", "source_file", 167),
    ("PSI-102", "smoke", "inferred", 25),
    ("PSI-107", "spice", "source_file", 469),
    ("PSI-159", "acme_inverse", "source_file", 154),
    ("PSI-159", "acme_normal", "source_file", 179),
]

O2_COL = {
    "acme_normal": ("xo2_init", 100.0, "ambient"),
    "acme_inverse": ("xo2", 100.0, "oxidizer_stream"),
    "flex": ("x_o2", 100.0, "ambient"),
    "cfi": ("x_o2", 100.0, "ambient"),
    "bass2": ("o2_init_pct", 1.0, "ambient_initial"),
    "saffire1": ("o2_pct_approx", 1.0, "ambient"),
    "saffire2": ("o2_pct_approx", 1.0, "ambient"),
}
P_TABLES = {"acme_normal", "acme_inverse", "flex", "cfi"}

MATERIAL_CLASS = {
    "acme_normal": "gas", "acme_inverse": "gas", "acme_testdays": "gas", "spice": "gas",
    "flex": "liquid_droplet", "cfi": "liquid_droplet",
    "bass2": "solid", "smoke": "solid", "saffire1": "solid", "saffire2": "solid", "saffire3": "solid",
}

# Pinned expected values (independent analysis, 2026-11-14).
# keys: o2 (min, max), p (min, max, invalid), flow (min, max, invalid)
PINNED = {
    ("PSI-10", "acme_inverse"): dict(o2=(21.2017175, 84.9977932), p=(0.42596796, 3.01818033, 0),
                                    fuels="ethylene", phen=None),
    ("PSI-10", "acme_normal"): dict(o2=(19.8048193, 40.0), p=(0.99211068, 1.31056596, 0),
                                   fuels="ethylene; propane", phen=None),
    ("PSI-20", "acme_testdays"): dict(fuels="100% C2H4; 100% CH4; 100%C2H4; 50% C2H4", phen="ignition"),
    ("PSI-22", "acme_testdays"): dict(fuels="100% C2H4; 100% CH4; 30% C2H4; 40% CH4", phen="ignition"),
    ("PSI-25", "bass2"): dict(o2=(13.6, 22.2), materials="Nomex; PMMA; SIBAL; Wax candle",
                             phen="combustion_products"),
    ("PSI-39", "cfi"): dict(o2=(17.0, 21.0), p=(0.5, 5.0, 0), diluents="He; N2",
                           fuels="Farnesane; dodecane60/isododecane40; dodecane75/isododecane25; n-dodecane",
                           phen="burn_time; burning_rate; cool_flame; extinction"),
    ("PSI-69", "flex"): dict(o2=(12.0, 34.0), p=(0.6925, 3.0525, 1), diluents="CO2; He; N2",
                            fuels="Heptane; Methanol", phen="burn_time; burning_rate; extinction"),
    ("PSI-98", "saffire1"): dict(o2=(21.5, 21.5), flow=(20.0, 20.0, 0), materials="SIBAL Fabric",
                                phen="burn_time"),
    ("PSI-99", "saffire2"): dict(o2=(21.5, 22.1), flow=(20.0, 20.0, 0),
                                materials="Cotton-Fiberglass (SIBAL); PMMA; PMMA & Nomex; Silicone",
                                phen="burn_time; flame_spread"),
    ("PSI-100", "saffire3"): dict(flow=(30.0, 30.0, 0), materials="SIBAL Fabric", phen=None),
    ("PSI-101", "smoke"): dict(flow=(1.0, 8.1, 0), materials="Kapton; Lampwick; Pyrell; Silicone; Teflon",
                              gravity="1g; µg", phen="smoke"),
    ("PSI-102", "smoke"): dict(flow=(2.0, 8.0, 0), materials="Kapton; Lampwick; Silicone; Teflon",
                              gravity="µg", phen="smoke"),
    ("PSI-107", "spice"): dict(flow=(0.66, 85.28, 8),
                              fuels="50 % Propylene; 75 % Propylene; 75% Propylene; Ethylene; Methane; "
                                    "Propane; Propylene",
                              phen="burn_time"),
    ("PSI-159", "acme_inverse"): dict(o2=(12.0, 85.0), p=(0.48890372563533185, 3.2666173205033306, 0),
                                     fuels="butane; ethane; propane",
                                     phen="burn_time; extinction; ignition"),
    ("PSI-159", "acme_normal"): dict(o2=(17.9685675, 39.97), p=(0.500024673081668, 3.0001480384900074, 0),
                                    fuels="butane; ethane; propane",
                                    phen="burn_time; extinction; ignition"),
}

NUM_PAIRS = [("o2_min_pct", "o2_max_pct"), ("p_min_atm", "p_max_atm"), ("flow_min_cm_s", "flow_max_cm_s")]


def _missing(v):
    return v is None or (isinstance(v, float) and math.isnan(v))


@pytest.fixture(scope="module")
def env():
    from src.discovery.envelope import envelope_from_tables
    return envelope_from_tables()


def _row(env, psi, table):
    sub = env[(env["psi_id"] == psi) & (env["table"] == table)]
    assert len(sub) == 1, (psi, table, len(sub))
    return sub.iloc[0]


def _rows_used(con, psi, table, relation):
    df = con.execute(f'SELECT * FROM "{table}"').df()
    if relation == "inferred":
        return df[df["campaign"] == "SAME"]
    return df[df["psi_id"] == psi]


# ---------------------------------------------------------------- acceptance

def test_from_tables(env):
    """A1 acceptance: ACME O2 exact, no min > max, units % / atm."""
    con = connect()
    # ACME O2 range equals parquet min/max exactly, per (psi_id, table)
    for psi in ("PSI-10", "PSI-159"):
        for table, (col, factor, _) in (("acme_normal", O2_COL["acme_normal"]),
                                        ("acme_inverse", O2_COL["acme_inverse"])):
            lo, hi = con.execute(
                f"SELECT min({col}), max({col}) FROM {table} WHERE psi_id = ?", [psi]).fetchone()
            r = _row(env, psi, table)
            assert r["o2_min_pct"] == lo * factor, (psi, table, r["o2_min_pct"], lo * factor)
            assert r["o2_max_pct"] == hi * factor, (psi, table, r["o2_max_pct"], hi * factor)
            # ACME pressure also exact (p_atm, no non-positive values in ACME)
            plo, phi = con.execute(
                f"SELECT min(p_atm), max(p_atm) FROM {table} WHERE psi_id = ? AND p_atm > 0", [psi]).fetchone()
            assert r["p_min_atm"] == plo and r["p_max_atm"] == phi
    # no row has min > max
    for lo, hi in NUM_PAIRS:
        both = env[[lo, hi]].dropna()
        assert (both[lo] <= both[hi]).all(), (lo, hi)
        # min and max are missing together
        assert (env[lo].isna() == env[hi].isna()).all(), (lo, hi)
    # units: % for O2, atm for pressure (names + plausible ranges)
    assert "o2_min_pct" in env.columns and "o2_max_pct" in env.columns
    assert "p_min_atm" in env.columns and "p_max_atm" in env.columns
    o2 = env[["o2_min_pct", "o2_max_pct"]].stack().dropna()
    assert ((o2 > 1.0) & (o2 <= 100.0)).all(), "O2 must be percent, not mole fraction"
    p = env[["p_min_atm", "p_max_atm"]].stack().dropna()
    assert ((p > 0) & (p < 10)).all(), "pressure must be atm (not mmHg/kPa) and > 0"
    assert (env["source"] == "table").all()


# ---------------------------------------------------------------- structure

def test_columns(env):
    assert isinstance(env, pd.DataFrame)
    assert list(env.columns) == COLUMNS


def test_row_set_and_order(env):
    got = list(zip(env["psi_id"], env["table"], env["relation"], env["n_rows"].astype(int)))
    assert got == ROWS


def test_rows_match_table_map(env):
    con = connect_all()
    tm = con.execute(
        "SELECT psi_id, \"table\", relation, n_rows FROM table_map "
        "WHERE coverage IN ('table', 'inferred')").df()
    exp = {(r.psi_id, r.table, r.relation, int(r.n_rows)) for r in tm.itertuples()}
    got = set(zip(env["psi_id"], env["table"], env["relation"], env["n_rows"].astype(int)))
    assert got == exp
    assert not env.duplicated(["psi_id", "table"]).any()


def test_dtypes(env):
    for c in ["o2_min_pct", "o2_max_pct", "p_min_atm", "p_max_atm", "flow_min_cm_s", "flow_max_cm_s"]:
        assert pd.api.types.is_float_dtype(env[c]), c
    for c in ["n_rows", "p_invalid_n", "flow_invalid_n"]:
        assert pd.api.types.is_integer_dtype(env[c]), c
        assert env[c].notna().all() and (env[c] >= 0).all(), c


# ---------------------------------------------------------------- values

def test_o2_basis_and_missing(env):
    """O2 only from the declared column; never assume 21 % and never 0."""
    con = connect()
    for psi, table, rel, _ in ROWS:
        r = _row(env, psi, table)
        if table in O2_COL:
            col, factor, basis = O2_COL[table]
            assert r["o2_basis"] == basis, (psi, table)
            v = _rows_used(con, psi, table, rel)[col].dropna() * factor
            assert r["o2_min_pct"] == pytest.approx(v.min(), rel=1e-12, abs=1e-12)
            assert r["o2_max_pct"] == pytest.approx(v.max(), rel=1e-12, abs=1e-12)
        else:
            assert _missing(r["o2_basis"]), (psi, table)
            assert math.isnan(r["o2_min_pct"]) and math.isnan(r["o2_max_pct"]), (psi, table)
    assert not (env[["o2_min_pct", "o2_max_pct"]] == 0).any().any()


def test_pressure(env):
    for psi, table, _, _ in ROWS:
        r = _row(env, psi, table)
        if table in P_TABLES:
            assert r["p_min_atm"] > 0
        else:
            assert math.isnan(r["p_min_atm"]) and math.isnan(r["p_max_atm"]), (psi, table)
            assert r["p_invalid_n"] == 0
    flex = _row(env, "PSI-69", "flex")
    assert flex["p_invalid_n"] == 1  # source_row 113, p_mmHg 0
    assert flex["p_min_atm"] == pytest.approx(526.3 / 760.0)
    assert env["p_invalid_n"].sum() == 1
    # the excluded row is really the p_mmHg 0 row
    con = connect()
    bad = con.execute("SELECT source_row, p_mmHg FROM flex WHERE p_atm <= 0").fetchall()
    assert bad == [(113, 0.0)]


def test_flow(env):
    flow_tables = {"smoke", "saffire1", "saffire2", "saffire3", "spice"}
    for psi, table, _, _ in ROWS:
        r = _row(env, psi, table)
        if table not in flow_tables:
            assert math.isnan(r["flow_min_cm_s"]) and math.isnan(r["flow_max_cm_s"]), (psi, table)
            assert r["flow_invalid_n"] == 0
        else:
            assert r["flow_min_cm_s"] >= 0
    assert env["flow_invalid_n"].sum() == 8
    assert _row(env, "PSI-107", "spice")["flow_invalid_n"] == 8


@pytest.mark.parametrize("key", list(PINNED))
def test_pinned_values(env, key):
    r = _row(env, *key)
    exp = PINNED[key]
    if "o2" in exp:
        assert r["o2_min_pct"] == pytest.approx(exp["o2"][0], rel=1e-9)
        assert r["o2_max_pct"] == pytest.approx(exp["o2"][1], rel=1e-9)
    if "p" in exp:
        assert r["p_min_atm"] == pytest.approx(exp["p"][0], rel=1e-9)
        assert r["p_max_atm"] == pytest.approx(exp["p"][1], rel=1e-9)
        assert r["p_invalid_n"] == exp["p"][2]
    if "flow" in exp:
        assert r["flow_min_cm_s"] == pytest.approx(exp["flow"][0], rel=1e-9)
        assert r["flow_max_cm_s"] == pytest.approx(exp["flow"][1], rel=1e-9)
        assert r["flow_invalid_n"] == exp["flow"][2]
    for col, k in (("diluents", "diluents"), ("fuels", "fuels"), ("materials", "materials")):
        if k in exp:
            assert r[col] == exp[k], col
        else:
            assert _missing(r[col]), (key, col, r[col])
    if exp.get("phen") is None:
        assert _missing(r["phenomena"]), (key, r["phenomena"])
    else:
        assert r["phenomena"] == exp["phen"]
    assert r["gravity"] == exp.get("gravity", "µg")
    assert r["material_class"] == MATERIAL_CLASS[key[1]]


def test_text_lists_cover_all_rows(env):
    # PSI-21 / PSI-23 fuel_bottle values are kept verbatim (spreadsheet autofill artefacts included)
    r21 = _row(env, "PSI-21", "acme_testdays")
    assert len(r21["fuels"].split("; ")) == 30
    assert "40% CH14" in r21["fuels"].split("; ")
    r23 = _row(env, "PSI-23", "acme_testdays")
    assert len(r23["fuels"].split("; ")) == 16
    for psi, table, _, _ in ROWS:
        r = _row(env, psi, table)
        for c in ("diluents", "fuels", "materials", "phenomena"):
            v = r[c]
            if not _missing(v):
                parts = v.split("; ")
                assert parts == sorted(set(parts)), (psi, table, c)
                assert all(p != "" for p in parts)
        if not _missing(r["materials"]):
            assert "Pre-test" not in r["materials"]


def test_material_class_and_gravity(env):
    assert list(env["material_class"]) == [MATERIAL_CLASS[t] for _, t, _, _ in ROWS]
    assert set(env["gravity"]) == {"µg", "1g; µg"}
    assert (env.loc[env["table"] != "smoke", "gravity"] == "µg").all()
    # Cygnus-flown SAFFIRE-II is microgravity
    assert _row(env, "PSI-99", "saffire2")["gravity"] == "µg"


def test_phenomena_vocabulary(env):
    vocab = {"ignition", "extinction", "burn_time", "smoke", "combustion_products",
             "cool_flame", "burning_rate", "flame_spread"}
    for v in env["phenomena"]:
        if not _missing(v):
            assert set(v.split("; ")) <= vocab


# ---------------------------------------------------------------- hygiene

def test_deterministic_and_explicit_con(env):
    from src.discovery.envelope import envelope_from_tables
    again = envelope_from_tables(con=connect_all())
    pd.testing.assert_frame_equal(env.reset_index(drop=True), again.reset_index(drop=True))


def test_no_raw_access(monkeypatch):
    """The envelope must come from the Feature Store, never from raw/ or csv/ files."""
    import src.discovery.envelope as mod
    src_text = inspect.getsource(mod)
    assert not re.search(r"""["'/\\](raw|csv)["'/\\]""", src_text)
    assert "read_csv" not in src_text and "read_excel" not in src_text

    real_open = builtins.open

    def guarded_open(file, *a, **k):
        s = str(file).replace("\\", "/")
        assert "/Nasa_data/raw/" not in s and "/Nasa_data/csv/" not in s, s
        return real_open(file, *a, **k)

    def forbidden(*a, **k):
        raise AssertionError("raw file reader called")

    monkeypatch.setattr(builtins, "open", guarded_open)
    monkeypatch.setattr(pd, "read_csv", forbidden)
    monkeypatch.setattr(pd, "read_excel", forbidden)
    out = mod.envelope_from_tables()
    assert len(out) == len(ROWS)
