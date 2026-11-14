"""table_map (plans/00_data_layer, step D4): which investigation's data lives in which parquet table.

Built from the data itself, never from a hand-written list:
- relation 'source_file': rows whose trace column psi_id names the investigation (exact).
- relation 'inferred': smoke rows whose `campaign` equals the ACRONYM of a different investigation (SAME flight data
  sits inside PSI-101's Combined_SAMER_Results workbook). Marked as an inference, with the basis spelled out.
  `ground` rows match no acronym and are therefore linked to no investigation.
- coverage 'none': investigations without any table; the reason is derived from n_experimental_tables.
"""
from __future__ import annotations

import duckdb
import pandas as pd

from .store import TABLES

COLUMNS = ["psi_id", "acronym", "table", "relation", "coverage", "n_rows", "n_source_files", "reason", "basis"]


def build_table_map(con: duckdb.DuckDBPyConnection) -> pd.DataFrame:
    """`con` must hold the feature-store views and the metadata views (see store.connect_all)."""
    inv = con.execute("SELECT psi_id, acronym, n_experimental_tables FROM investigations").df().set_index("psi_id")
    rows = []
    for t in TABLES:
        for psi, n, nf in con.execute(f"SELECT psi_id, count(*), count(DISTINCT source_file) FROM {t} GROUP BY 1 ORDER BY 1").fetchall():
            rows.append(dict(psi_id=psi, table=t, relation="source_file", coverage="table", n_rows=n, n_source_files=nf,
                             basis="trace column psi_id of the table rows"))
    acr = {a: p for p, a in inv.acronym.dropna().items()}
    for camp, n, nf, psi in con.execute("SELECT campaign, count(*), count(DISTINCT source_file), any_value(psi_id) "
                                        "FROM smoke GROUP BY 1 ORDER BY 1").fetchall():
        if camp in acr and acr[camp] != psi:
            rows.append(dict(psi_id=acr[camp], table="smoke", relation="inferred", coverage="inferred", n_rows=n,
                             n_source_files=nf, basis=f"smoke rows with campaign='{camp}' sit in {psi}'s workbook; "
                                                      f"linked to {acr[camp]} because its acronym is '{camp}' (inference)"))
    mapped = {r["psi_id"] for r in rows}
    for psi in inv.index.difference(mapped):
        reason = "no_experimental_table" if inv.loc[psi, "n_experimental_tables"] == 0 else "experimental_table_not_loaded"
        rows.append(dict(psi_id=psi, table=None, relation="none", coverage="none", reason=reason,
                         basis="no parquet table carries this psi_id and no campaign name matches its acronym"))
    df = pd.DataFrame(rows).reindex(columns=COLUMNS)
    df["acronym"] = df.psi_id.map(inv.acronym)
    df = df.astype({"n_rows": "Int64", "n_source_files": "Int64", **{c: "string" for c in
                    ("psi_id", "acronym", "table", "relation", "coverage", "reason", "basis")}})
    order = df.psi_id.str.extract(r"(\d+)")[0].astype(int)       # PSI-9 before PSI-10: numeric, not alphabetic
    return df.assign(_n=order).sort_values(["_n", "table"]).drop(columns="_n").reset_index(drop=True)
