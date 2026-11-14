"""Faz 2 - column profiles for Tier 1-2 tables + missingness heatmaps."""
import numpy as np
import pandas as pd
from scipy import stats

from _common import FIG, OUT, TIER1, TIER2, TRACE, load, md_table, setup_mpl, unit_of, SURFACE, INK2

plt = setup_mpl()


def profile(df):
    rows = []
    for c in df.columns:
        if c in TRACE:
            continue
        s = df[c]
        r = dict(column=c, dtype=str(s.dtype), unit=unit_of(c), n=len(s),
                 missing_pct=round(100 * s.isna().mean(), 1), n_unique=int(s.nunique(dropna=True)))
        if pd.api.types.is_numeric_dtype(s) and not pd.api.types.is_bool_dtype(s):
            x = s.dropna().astype(float)
            if len(x):
                q1, q3 = np.percentile(x, [25, 75])
                iqr = q3 - q1
                med = np.median(x)
                mad = np.median(np.abs(x - med))
                rz = 0.6745 * (x - med) / mad if mad > 0 else pd.Series(0, index=x.index)
                r.update(min=x.min(), median=med, max=x.max(), mean=x.mean(), std=x.std(),
                         skew=stats.skew(x) if len(x) > 2 else np.nan,
                         kurtosis=stats.kurtosis(x) if len(x) > 3 else np.nan,
                         zero_pct=round(100 * (x == 0).mean(), 1),
                         outlier_iqr_pct=round(100 * ((x < q1 - 1.5 * iqr) | (x > q3 + 1.5 * iqr)).mean(), 1),
                         outlier_robustz_pct=round(100 * (np.abs(rz) > 3.5).mean(), 1))
        else:
            vc = s.astype("string").value_counts()
            if len(vc):
                r.update(top=str(vc.index[0])[:40], top_pct=round(100 * vc.iloc[0] / s.notna().sum(), 1))
        rows.append(r)
    return pd.DataFrame(rows)


def missing_heatmap(df, name):
    cols = [c for c in df.columns if c not in TRACE]
    m = df[cols].isna().to_numpy().T
    h = max(3, 0.18 * len(cols) + 1)
    fig, ax = plt.subplots(figsize=(9, h))
    ax.imshow(m, aspect="auto", cmap=plt.matplotlib.colors.ListedColormap([SURFACE, "#2a78d6"]),
              interpolation="nearest")
    ax.set_yticks(range(len(cols)))
    ax.set_yticklabels([f"{c} ({100*df[c].isna().mean():.0f}%)" for c in cols], fontsize=7)
    ax.set_xlabel("satır (kaynak sırası)")
    ax.set_title(f"{name}: eksik değerler (mavi = eksik)")
    ax.grid(False)
    fig.savefig(FIG / f"missing_{name}.png")
    plt.close(fig)


summary = []
for name in TIER1 + TIER2:
    df = load(name)
    p = profile(df)
    p.to_csv(OUT / f"profile_{name}.csv", index=False)
    missing_heatmap(df, name)
    num = p[p.get("median").notna()] if "median" in p else p.iloc[0:0]
    high_miss = p[p.missing_pct > 50].column.tolist()
    skewed = num[num["skew"].abs() > 2].column.tolist() if len(num) else []
    out_ = num[num.outlier_robustz_pct > 5].column.tolist() if len(num) else []
    summary.append(dict(table=name, rows=len(df), cols=len(p), numeric=len(num),
                        cols_missing_gt50=len(high_miss), high_missing=", ".join(high_miss[:8]),
                        highly_skewed=", ".join(skewed[:8]), robustz_outliers_gt5pct=", ".join(out_[:6])))
s = pd.DataFrame(summary)
lines = ["# Profil özeti (Faz 2)", "",
         "Ayrıntılar: `outputs/profile_<tablo>.csv`. Aykırı: IQR (1.5×) ve robust z (MAD tabanlı) > 3.5.", "",
         md_table(s)]
(OUT / "profile_summary.md").write_text("\n".join(lines) + "\n")
print(s[["table", "rows", "cols", "numeric", "cols_missing_gt50"]].to_string(index=False))
for r in summary:
    print(f"{r['table']}: skew>2 -> {r['highly_skewed'][:150]}")
