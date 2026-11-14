"""build_all (plans/00_data_layer, step F1): rebuild the whole data layer with one command, from the repo root.

    python -m src.data_layer.build_all [--skip-raw] [--out DIR] [--update-meta]

Steps (the logic lives in store / metadata / table_map; this module only orchestrates and checks invariants):
 1 inputs        parquet tables + feature catalog present
 2 feature_store out/feature_store.duckdb, 11 views whose row counts equal the parquet files
 3 catalog_units catalog rows = csv rows, units rows = total columns of the 11 tables
 4 metadata      raw/ present: fresh export to out/meta and compare with the committed meta/ (NEVER overwritten unless
                 --update-meta); --skip-raw: validate the committed meta/
 5 meta_db       out/meta.duckdb over the committed meta/
 6 table_map     invariants, written to out/table_map.parquet
A difference between fresh and committed meta is a WARNING (exit 0): refreshing shared data is a deliberate act.
Any failed step stops the run with exit code 1. Outputs default to data_analysis/Nasa_data/build/ (git-ignored).
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

import duckdb
import pandas as pd

from . import metadata, store

DEFAULT_OUT = store.REPO / "data_analysis" / "Nasa_data" / "build"


class BuildError(Exception):
    pass


def _has_raw() -> bool:
    return metadata.RAW_DIR.is_dir() and any(metadata.RAW_DIR.glob("PSI-*/detail.json"))


def _parquet_rows(path: Path) -> int:
    return duckdb.execute(f"SELECT count(*) FROM read_parquet('{path.as_posix()}')").fetchone()[0]


def _parquet_cols(path: Path) -> int:
    return len(duckdb.execute(f"DESCRIBE SELECT * FROM read_parquet('{path.as_posix()}')").fetchall())


def step_inputs(ctx) -> str:
    missing = [t for t in store.TABLES if not store.parquet_path(t).exists()]
    if missing:
        raise BuildError(f"eksik girdi: parquet tabloları {missing} ({store.DATA_DIR}); analysis/scripts/01_load_core.py çalıştırın")
    if not store.CATALOG_CSV.exists():
        raise BuildError(f"eksik girdi: feature_catalog.csv ({store.CATALOG_CSV}); analysis/scripts/07_catalog.py çalıştırın")
    return f"{len(store.TABLES)} parquet + feature_catalog.csv"


def step_feature_store(ctx) -> str:
    path = store.build(ctx["out"] / "feature_store.duckdb")
    ctx["fs"] = path
    with duckdb.connect(str(path), read_only=True) as c:
        views = {r[0] for r in c.execute("SELECT view_name FROM duckdb_views() WHERE NOT internal").fetchall()}
        if views != set(store.TABLES) | {"catalog"}:
            raise BuildError(f"görünümler beklenenden farklı: {sorted(views ^ (set(store.TABLES) | {'catalog'}))}")
        total = 0
        for t in store.TABLES:
            n_view, n_file = c.execute(f"SELECT count(*) FROM {t}").fetchone()[0], _parquet_rows(store.parquet_path(t))
            if n_view != n_file:
                raise BuildError(f"{t}: görünüm {n_view} satır, parquet {n_file} satır")
            total += n_file
    return f"{len(store.TABLES)} tablo görünümü, {total} satır"


def step_catalog_units(ctx) -> str:
    with duckdb.connect(str(ctx["fs"]), read_only=True) as c:
        n_cat = c.execute("SELECT count(*) FROM catalog").fetchone()[0]
        n_csv = duckdb.execute(f"SELECT count(*) FROM read_csv('{store.CATALOG_CSV.as_posix()}', header=true)").fetchone()[0]
        n_units = c.execute("SELECT count(*) FROM units").fetchone()[0]
    n_cols = sum(_parquet_cols(store.parquet_path(t)) for t in store.TABLES)
    if n_cat != n_csv:
        raise BuildError(f"catalog {n_cat} satır, csv {n_csv} satır")
    if n_units != n_cols:
        raise BuildError(f"units {n_units} satır, tabloların toplam sütunu {n_cols}")
    return f"catalog {n_cat} satır, units {n_units} satır"


def _same(a: Path, b: Path) -> bool:
    try:
        pd.testing.assert_frame_equal(pd.read_parquet(a), pd.read_parquet(b))
        return True
    except AssertionError:
        return False


def step_metadata(ctx) -> str:
    if ctx["skip_raw"]:
        metadata.register_meta_views(duckdb.connect())                     # raises a clear error if meta/ is missing
        return "raw/ atlandı (--skip-raw); commit'li meta/ kullanıldı"
    if not _has_raw():
        raise BuildError(f"raw/ bulunamadı ({metadata.RAW_DIR}); yalnızca commit'li meta/ ile çalışmak için --skip-raw kullanın")
    fresh_dir = ctx["out"] / "meta"
    fresh = metadata.export(fresh_dir, raw_dir=metadata.RAW_DIR)
    diff = [p.stem for p in fresh if not (metadata.META_DIR / p.name).exists() or not _same(p, metadata.META_DIR / p.name)]
    if not diff:
        return "taze export commit'li meta/ ile AYNI (commit'li dosyalara dokunulmadı)"
    if ctx["update_meta"]:
        metadata.export(metadata.META_DIR, raw_dir=metadata.RAW_DIR)
        return f"FARKLI tablolar {diff}: commit'li meta/ GÜNCELLENDİ (--update-meta)"
    print(f"      UYARI: taze export commit'li meta/ ile FARKLI ({diff}); commit'li dosyalar değişmedi. "
          f"Güncellemek için --update-meta", file=sys.stderr)
    return f"taze export commit'li meta/ ile FARKLI ({diff}), commit'li dosyalar değişmedi"


def step_meta_db(ctx) -> str:
    path = metadata.build_meta(ctx["out"] / "meta.duckdb")
    with duckdb.connect(str(path), read_only=True) as c:
        counts = {t: c.execute(f"SELECT count(*) FROM {t}").fetchone()[0] for t in metadata.META_TABLES}
    for t, n in counts.items():
        if n != _parquet_rows(metadata.META_DIR / f"{t}.parquet"):
            raise BuildError(f"meta.duckdb {t}: {n} satır, parquet ile uyuşmuyor")
    return ", ".join(f"{t} {n}" for t, n in counts.items())


def step_table_map(ctx) -> str:
    con = store.connect_all()
    tm = con.execute("SELECT * FROM table_map").df()
    for t in store.TABLES:
        n = con.execute(f"SELECT count(*) FROM {t}").fetchone()[0]
        got = int(tm[(tm.table == t) & (tm.relation == "source_file")].n_rows.sum())
        if got != n:
            raise BuildError(f"table_map: {t} satırlarının {n - got} tanesi hiçbir investigation'a eşlenmemiş")
    inv = {r[0] for r in con.execute("SELECT psi_id FROM investigations").fetchall()}
    if set(tm.psi_id) != inv:
        raise BuildError(f"table_map investigation kümesi farklı: {sorted(set(tm.psi_id) ^ inv)}")
    tm.to_parquet(ctx["out"] / "table_map.parquet", index=False)
    return f"{len(tm)} satır, eşlemesiz investigation {int((tm.coverage == 'none').sum())}"


STEPS = [("girdiler", step_inputs), ("feature_store", step_feature_store), ("catalog_units", step_catalog_units),
         ("metadata", step_metadata), ("meta_db", step_meta_db), ("table_map", step_table_map)]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="python -m src.data_layer.build_all", description=__doc__.split("\n\n")[0])
    ap.add_argument("--skip-raw", action="store_true", help="raw/ kullanma; commit'li meta/ ile çalış")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help=f"çıktı klasörü (varsayılan {DEFAULT_OUT})")
    ap.add_argument("--update-meta", action="store_true",
                    help="raw/ varsa ve fark çıkarsa commit'li meta/'nın üzerine yaz (varsayılan: yazma)")
    a = ap.parse_args(argv)
    a.out.mkdir(parents=True, exist_ok=True)
    ctx = dict(out=a.out.resolve(), skip_raw=a.skip_raw, update_meta=a.update_meta)
    for i, (name, fn) in enumerate(STEPS, 1):
        t0 = time.time()
        try:
            detail = fn(ctx)
        except (BuildError, FileNotFoundError) as e:
            print(f"[{i}/{len(STEPS)}] {name}: HATA — {e}", file=sys.stderr)
            return 1
        print(f"[{i}/{len(STEPS)}] {name}: OK ({time.time() - t0:.1f}s) — {detail}")
    print(f"build_all tamam; çıktılar: {ctx['out']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
