"""02/A1 - modeling datasets: no leakage, traceable, faithful to the data layer, row counts as expected."""
import subprocess

import pandas as pd
import pytest

from conftest import OUT, REPO
from src.data_layer import store
from src.data_layer.frame import get_modeling_frame
from src.data_layer.spec import SPEC, TRACE
from src.prediction import datasets as D
from src.prediction.datasets import MASK, build_all, build_dataset, targets_of

ROWS = {"droplet": 501, "gas_flame": 333, "smoke": 134, "solid_atm": 129}
GROUP_GAPS = {("flex", "year"): 50}          # FLEX: 50 of 274 tests have no year in the source; never filled
KEY = TRACE


@pytest.fixture(scope="module")
def con():
    return store.connect()


@pytest.fixture(scope="module")
def sets(con):
    return {n: build_dataset(n, con) for n in D.DATASETS}


def _expected_n(con):
    """Expected per-target rows, computed independently: target_candidates.csv, minus smoke ground rows."""
    tc = pd.read_csv(OUT / "target_candidates.csv").set_index(["dataset", "target"]).n
    exp = {}
    for name, cfg in D.DATASETS.items():
        for table in cfg["sources"]:
            for t in SPEC[table]["targets"]:
                n = int(tc[(table, t)])
                if table == "smoke":
                    n -= con.execute(f"SELECT count(*) FROM smoke WHERE campaign = 'ground' AND {t} IS NOT NULL").fetchone()[0]
                exp[(name, t)] = exp.get((name, t), 0) + n
    return exp


def test_build(sets, con):
    """Acceptance: no leakage columns, trace and group columns filled, per-target row counts as expected."""
    exp = _expected_n(con)
    for name, df in sets.items():
        cfg = D.DATASETS[name]
        assert len(df) == ROWS[name], name
        targets = set(targets_of(name))
        allowed = (set(TRACE) | {"source_table"} | set(cfg.get("extra", [])) | targets | {MASK + t for t in targets}
                   | set(D.LABELS.get(name, [])))
        leak = set()
        for table in cfg["sources"]:
            s = SPEC[table]
            allowed |= set(s["num"] + s["cat"] + s["groups"])
            for lst in s["leakage"].values():
                leak |= set(lst)
        assert set(df.columns) <= allowed, f"{name}: unexpected columns {sorted(set(df.columns) - allowed)}"
        assert not (set(df.columns) & (leak - targets)), f"{name}: leakage {sorted(set(df.columns) & (leak - targets))}"
        for c in TRACE + ["source_table"]:
            assert df[c].notna().all(), f"{name}.{c}"
        for g in cfg["cv_group"]:                                   # the grouped-CV key must be complete
            assert df[g].notna().all(), f"{name}: cv_group {g} has gaps"
        for table in cfg["sources"]:                                # other group columns: gaps are real, pinned
            part = df[df.source_table == table]
            for g in SPEC[table]["groups"]:
                gaps = int(part[g].isna().sum())
                assert gaps == GROUP_GAPS.get((table, g), 0), f"{name}/{table}: group {g} has {gaps} gaps"
        for t in targets:
            got = int((df[MASK + t] & df[t].notna()).sum())
            assert got == exp[(name, t)], f"{name}.{t}: {got} != {exp[(name, t)]}"
    assert exp[("smoke", "amd_um")] == 131 and exp[("smoke", "dusttrak_b_mg_m3")] == 133


def test_scope(sets):
    assert set(sets["droplet"].source_table) == {"flex", "cfi"}
    assert (sets["gas_flame"].experiment == "CFI-G").all()
    assert sets["gas_flame"].flame_type.value_counts().to_dict() == {"Normal": 179, "Inverse": 154}   # source values
    assert "ground" not in set(sets["smoke"].campaign)
    assert set(sets["solid_atm"].source_table) == {"bass2"}


def test_droplet_targets_not_merged_and_source_specific(sets):
    d = sets["droplet"]
    flex, cfi = d[d.source_table == "flex"], d[d.source_table == "cfi"]
    for t in SPEC["flex"]["targets"]:
        assert cfi[t].isna().all() and not cfi[MASK + t].any()
    for t in SPEC["cfi"]["targets"]:
        assert flex[t].isna().all() and not flex[MASK + t].any()
    assert "K_mm2_s" not in d.columns
    assert cfi.x_co2.isna().all() and (cfi.x_co2 != 0).all()          # CFI has no x_co2: empty, never 0


def test_gas_flame_keeps_different_o2_quantities_apart(sets):
    g = sets["gas_flame"]
    assert g[g.flame_type == "Normal"].xo2.isna().all() and g[g.flame_type == "Inverse"].xo2_init.isna().all()


def test_faithful_values(sets, con):
    """Every value equals the source table row with the same trace key (missingness included): nothing filled."""
    norm = lambda x: x.astype(object).where(x.notna(), None)
    for name, df in sets.items():
        for table in D.DATASETS[name]["sources"]:
            part = df[df.source_table == table].set_index(KEY)
            src = con.execute(f"SELECT * FROM {table}").df().set_index(KEY).loc[part.index]
            cols = [c for c in part.columns if c in src.columns]
            pd.testing.assert_frame_equal(norm(part[cols]), norm(src[cols]), check_dtype=False)
            assert not part.index.duplicated().any()


def test_masks_match_the_data_layer(sets, con):
    """Rows selected by in_subset__<t> are exactly get_modeling_frame(table, t), with the same target values."""
    for name, df in sets.items():
        for table, rows_query in D.DATASETS[name]["sources"].items():
            family = con.execute(f"SELECT * FROM {table}").df()
            family = family.query(rows_query, engine="python") if rows_query else family
            keep = set(map(tuple, family[KEY].itertuples(index=False)))          # rows of this family only
            for t in SPEC[table]["targets"]:
                mine = df[(df.source_table == table) & df[MASK + t]].set_index(KEY)[t]
                ref = get_modeling_frame(table, t, con)
                ref = ref[[k in keep for k in map(tuple, ref[KEY].itertuples(index=False))]].set_index(KEY)[t]
                assert sorted(mine.index) == sorted(ref.index), f"{name}/{table}/{t}"
                pd.testing.assert_series_equal(mine.loc[ref.index].astype(object), ref.astype(object), check_names=False)


def test_undeclared_shared_column_raises(monkeypatch):
    monkeypatch.setitem(D.DATASETS["droplet"], "shared", ["d0_mm"])        # x_o2, fuel... no longer declared
    with pytest.raises(ValueError, match="not declared as the same quantity"):
        build_dataset("droplet")


def test_errors():
    with pytest.raises(ValueError, match="valid:"):
        build_dataset("nope")


def test_build_all_roundtrip_deterministic_and_ignored(tmp_path, monkeypatch, sets):
    monkeypatch.chdir(tmp_path)
    a, b = build_all(tmp_path / "a"), build_all(tmp_path / "b")
    assert [p.name for p in a] == [f"{n}.parquet" for n in D.DATASETS]
    for p, q in zip(a, b):
        assert p.read_bytes() == q.read_bytes()
        pd.testing.assert_frame_equal(pd.read_parquet(p), sets[p.stem])
    r = subprocess.run(["git", "check-ignore", "-q", str(D.DEFAULT_OUT / "droplet.parquet")], cwd=REPO)
    assert r.returncode == 0, "data/modeling/ must stay git-ignored (datasets are derived, not committed)"
