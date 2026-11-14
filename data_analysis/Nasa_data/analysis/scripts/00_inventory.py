"""Faz 0 - inventory of canonical files, categorized by name pattern and shape."""
import re

import pandas as pd

from _common import AUDIT, OUT, ROOT, md_table

CAL = re.compile(r"cal(ib)?|wire_test|mfc|meter|fan_calibration", re.I)
TS = re.compile(r"_data\.csv$|hkp|telemetry|raw_data|calibrated_data|cut_and_paste|sheet_used_to_graph|"
                r"log__|_log|ops_timeline|camera_data|forgraphing|for_average|all_data", re.I)
PARTICLE = re.compile(r"binned|sizedist|spv|_qtr|particle|big_only|statistics", re.I)
SUMMARY = re.compile(r"test_matrix|test_point_log|datasummary|results|reduced_data|paper_data_table|"
                     r"material_sort|weight_loss|comparisons|detection|_plots", re.I)


def categorize(r):
    f = r.file
    if "Experimental_table" in f:
        return "experimental_table"
    if CAL.search(f) and "mfcSetpoints" not in f:
        return "calibration_engineering"
    if "mfcSetpoints" in f:
        return "calibration_engineering"
    if PARTICLE.search(f):
        return "particle_level"
    if SUMMARY.search(f):
        return "test_summary"
    if TS.search(f) or (r.rows_clean or 0) > 300:
        return "time_series"
    if "MergeResult" in f:
        return "other"
    return "other"


c = pd.read_csv(AUDIT / "canonical_files.csv")
u = c[c.use == True].copy()  # noqa: E712
u["category"] = u.apply(categorize, axis=1)
inv = u[["psi_id", "file", "path", "size_mb", "rows_clean", "cols_clean", "schema", "category"]]
inv = inv.sort_values(["psi_id", "category", "file"])
inv.to_csv(OUT / "inventory.csv", index=False)

pivot = pd.crosstab(inv.psi_id, inv.category, margins=True, margins_name="TOPLAM")
size = inv.groupby("psi_id").size_mb.sum().round(1)
smoke_exists = (ROOT / "smoke_dataset.csv").exists()

lines = ["# Envanter özeti (Faz 0)", "",
         f"- Kanonik dosya (use==True): **{len(u)}** / {len(c)} (kopya/'wrong' hariç {len(c)-len(u)})",
         f"- `smoke_dataset.csv` kökte mevcut mu: **{smoke_exists}**",
         "- Kategori, dosya adı desenleri + satır sayısı ile sezgisel atanmıştır (bkz. `00_inventory.py`).", "",
         "## PSI-ID × kategori", "", md_table(pivot.reset_index()), "",
         "## PSI-ID başına toplam boyut (MB)", "", md_table(size.reset_index()), "",
         "## Deneysel tablolar", "",
         md_table(inv[inv.category == "experimental_table"][["psi_id", "file", "rows_clean", "cols_clean"]])]
(OUT / "inventory_summary.md").write_text("\n".join(lines) + "\n")

print(f"canonical files: {len(u)}  smoke_dataset.csv exists: {smoke_exists}")
print(pivot.to_string())
