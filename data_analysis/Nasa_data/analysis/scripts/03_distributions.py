"""Faz 3 - distributions, category frequencies, target figures and transformation suggestions."""
import numpy as np
import pandas as pd
from scipy import stats

from _common import (CAT, FIG, INK2, OTHER, OUT, SPEC, TIER1, TIER2, cat_colors, categorical_cols, load, md_table,
                     numeric_cols, setup_mpl, slug, target_frame, unit_of)

plt = setup_mpl()


def kde_line(ax, x, color, logx=False):
    x = np.asarray(x, float)
    if len(x) < 5 or np.std(x) == 0:
        return
    xx = np.log10(x) if logx else x
    k = stats.gaussian_kde(xx)
    g = np.linspace(xx.min(), xx.max(), 200)
    # scale density to histogram counts
    return g, k(g)


def hist_panel(ax, x, title, color=CAT[0], logx=False):
    x = pd.Series(x).dropna().astype(float)
    if logx:
        x = x[x > 0]
        v = np.log10(x)
        ax.set_xlabel("log10")
    else:
        v = x
    bins = min(30, max(5, int(np.sqrt(len(v)))))
    cnt, edges, _ = ax.hist(v, bins=bins, color=color, alpha=0.85, edgecolor="white", linewidth=0.8)
    if len(v) >= 5 and v.std() > 0:
        k = stats.gaussian_kde(v)
        g = np.linspace(v.min(), v.max(), 200)
        ax.plot(g, k(g) * len(v) * (edges[1] - edges[0]), color="#0b0b0b", lw=1.2)
    ax.set_title(title, fontsize=8)
    ax.tick_params(labelsize=7)


def transform_suggestion(x):
    x = pd.Series(x).dropna().astype(float)
    r = dict(n=len(x), skew=stats.skew(x) if len(x) > 2 else np.nan)
    if len(x) < 8 or x.nunique() < 4:
        r["suggest"] = "yok (az veri / ayrık)"
        return r
    r["yeojohnson_lambda"] = stats.yeojohnson(x)[1]
    r["skew_yj"] = stats.skew(stats.yeojohnson(x)[0])
    if (x > 0).all():
        bc, lam = stats.boxcox(x)
        r["boxcox_lambda"] = lam
        r["skew_boxcox"] = stats.skew(bc)
        r["skew_log1p"] = stats.skew(np.log1p(x))
    if abs(r["skew"]) < 0.75:
        r["suggest"] = "dönüşüm gerekmez"
    elif (x > 0).all():
        lam = r["boxcox_lambda"]
        r["suggest"] = ("log / log1p (Box-Cox λ≈0)" if abs(lam) < 0.25 else
                        "sqrt (λ≈0.5)" if abs(lam - 0.5) < 0.25 else f"Box-Cox (λ={lam:.2f})")
    else:
        r["suggest"] = f"Yeo-Johnson (λ={r['yeojohnson_lambda']:.2f}) - sıfır/negatif değer var"
    return r


trans_rows, cat_rows, notes = [], [], []
for name in TIER1 + TIER2:
    df = load(name)
    nums = [c for c in numeric_cols(df) if not c.endswith("_flag")]
    if not nums:
        continue
    # ---- numeric grid (linear + log where skewed & positive)
    panels = []
    for c in nums:
        x = df[c].dropna()
        panels.append((c, False))
        if len(x) > 5 and (x > 0).all() and abs(stats.skew(x)) > 1.5:
            panels.append((c, True))
    ncol = 4
    nrow = int(np.ceil(len(panels) / ncol))
    fig, axes = plt.subplots(nrow, ncol, figsize=(12, 2.3 * nrow), squeeze=False)
    for ax, (c, lg) in zip(axes.flat, panels):
        hist_panel(ax, df[c], f"{c}{' [log10]' if lg else ''}\n({unit_of(c)}, n={df[c].notna().sum()})",
                   color=CAT[6] if lg else CAT[0], logx=lg)
    for ax in axes.flat[len(panels):]:
        ax.axis("off")
    fig.suptitle(f"{name}: sayısal dağılımlar (histogram + KDE; mor = log10 ölçek)", fontweight="bold")
    fig.tight_layout()
    fig.savefig(FIG / f"dist_{name}.png")
    plt.close(fig)
    for c in nums:
        r = transform_suggestion(df[c])
        r.update(table=name, column=c)
        trans_rows.append(r)
    # ---- categorical frequencies
    cats = [c for c in categorical_cols(df, max_levels=15) if not c.endswith("_raw") and c not in ("comments",)]
    if cats:
        fig, axes = plt.subplots(1, len(cats), figsize=(3.2 * len(cats), 3), squeeze=False)
        for ax, c in zip(axes.flat, cats):
            vc = df[c].astype("string").fillna("NaN").value_counts()
            ax.barh(vc.index[::-1], vc.values[::-1], color=CAT[0], height=0.7)
            ax.set_title(c, fontsize=8)
            ax.tick_params(labelsize=7)
            nn = vc.drop("NaN", errors="ignore")
            cat_rows.append(dict(table=name, column=c, levels=len(nn), majority=nn.index[0] if len(nn) else "",
                                 imbalance_ratio=round(nn.iloc[0] / nn.iloc[-1], 2) if len(nn) > 1 else np.nan,
                                 minority_pct=round(100 * nn.iloc[-1] / nn.sum(), 1) if len(nn) > 1 else np.nan))
        fig.suptitle(f"{name}: kategorik frekanslar", fontweight="bold")
        fig.tight_layout()
        fig.savefig(FIG / f"cat_{name}.png")
        plt.close(fig)
    # ---- boxplots by group categories (Tier 1 only)
    if name in SPEC:
        gcat = [g for g in SPEC[name]["cat"] if g in df.columns and df[g].nunique() > 1][:2]
        targets = [t for t, s in SPEC[name]["targets"].items() if s["task"] == "regression"]
        show = (targets + [c for c in SPEC[name]["num"] if c in df.columns])[:6]
        if gcat and show:
            fig, axes = plt.subplots(len(gcat), len(show), figsize=(2.6 * len(show), 2.8 * len(gcat)), squeeze=False)
            for i, g in enumerate(gcat):
                levels = df[g].dropna().astype(str).value_counts().index.tolist()[:8]
                cmap = cat_colors(sorted(levels))
                for j, c in enumerate(show):
                    ax = axes[i, j]
                    data = [df.loc[df[g].astype(str) == lv, c].dropna().astype(float) for lv in levels]
                    bp = ax.boxplot(data, patch_artist=True, widths=0.6, showfliers=True,
                                    medianprops=dict(color="#0b0b0b"), flierprops=dict(markersize=3))
                    for patch, lv in zip(bp["boxes"], levels):
                        patch.set_facecolor(cmap[lv])
                        patch.set_alpha(0.8)
                    ax.set_xticks(range(1, len(levels) + 1))
                    ax.set_xticklabels([lv[:12] for lv in levels], rotation=40, ha="right", fontsize=7)
                    ax.set_title(f"{c} ~ {g}", fontsize=8)
            fig.suptitle(f"{name}: kategori bazında boxplot", fontweight="bold")
            fig.tight_layout()
            fig.savefig(FIG / f"box_{name}.png")
            plt.close(fig)
        # ---- target figures
        for t, s in SPEC[name]["targets"].items():
            d = target_frame(name, t)
            g = SPEC[name]["cat"][0]
            if s["task"] == "regression":
                r = transform_suggestion(d[t])
                r.update(table=name, column=f"{t} [hedef alt kümesi]")
                trans_rows.append(r)
                fig, axes = plt.subplots(1, 3, figsize=(11, 3))
                hist_panel(axes[0], d[t], f"{t} (n={d[t].notna().sum()})")
                x = d[t].dropna()
                if (x > 0).all():
                    hist_panel(axes[1], x, f"log10 {t}", color=CAT[6], logx=True)
                else:
                    stats.probplot(x, plot=axes[1])
                    axes[1].set_title("Q-Q (normal)", fontsize=8)
                levels = d[g].dropna().astype(str).value_counts().index.tolist()[:8]
                cmap = cat_colors(sorted(levels))
                for k, lv in enumerate(levels):
                    v = d.loc[d[g].astype(str) == lv, t].dropna()
                    axes[2].scatter(np.full(len(v), k) + np.random.default_rng(42).uniform(-.2, .2, len(v)), v,
                                    s=14, color=cmap[lv], edgecolor="white", linewidth=0.5)
                axes[2].set_xticks(range(len(levels)))
                axes[2].set_xticklabels([lv[:12] for lv in levels], rotation=30, ha="right", fontsize=7)
                axes[2].set_title(f"{t} ~ {g}", fontsize=8)
                fig.suptitle(f"Hedef: {name}.{t}  [{s['subset']}]", fontweight="bold", fontsize=9)
            else:
                vc = d[t].astype("string").value_counts()
                fig, axes = plt.subplots(1, 2, figsize=(9, 3))
                axes[0].bar(vc.index, vc.values, color=CAT[:len(vc)], width=0.6)
                for k, v in enumerate(vc.values):
                    axes[0].text(k, v, f"{v} ({100*v/vc.sum():.0f}%)", ha="center", va="bottom", fontsize=8)
                axes[0].set_title(f"{t} sınıf dağılımı (n={vc.sum()})", fontsize=8)
                ct = pd.crosstab(d[g].astype(str), d[t].astype(str), normalize="index")
                bottom = np.zeros(len(ct))
                for k, col in enumerate(ct.columns):
                    axes[1].barh(ct.index, ct[col], left=bottom, color=CAT[k % 8], label=col, height=0.6,
                                 edgecolor="white", linewidth=2)
                    bottom += ct[col].values
                axes[1].legend(fontsize=7, loc="lower right")
                axes[1].set_title(f"{t} oranı ~ {g}", fontsize=8)
                fig.suptitle(f"Hedef: {name}.{t}  [{s['subset']}]", fontweight="bold", fontsize=9)
            fig.tight_layout()
            fig.savefig(FIG / f"target_{name}_{slug(t)}.png")
            plt.close(fig)

tr = pd.DataFrame(trans_rows)
cols = ["table", "column", "n", "skew", "boxcox_lambda", "skew_boxcox", "skew_log1p", "yeojohnson_lambda", "skew_yj", "suggest"]
tr = tr.reindex(columns=cols)
tr.to_csv(OUT / "transform_suggestions.csv", index=False)
cr = pd.DataFrame(cat_rows)
cr.to_csv(OUT / "categorical_balance.csv", index=False)
need = tr[~tr.suggest.str.startswith(("dönüşüm gerekmez", "yok"))]
lines = ["# Dağılım özeti (Faz 3)", "", "Figürler: `figures/dist_*.png`, `cat_*.png`, `box_*.png`, `target_*.png`.", "",
         "## Dönüşüm önerileri (|çarpıklık| ≥ 0.75)", "", md_table(need.round(3)), "",
         "## Kategorik denge", "", md_table(cr)]
(OUT / "distributions_summary.md").write_text("\n".join(lines) + "\n")
print(f"transform suggestions: {len(need)} / {len(tr)} columns need a transform")
tgt = [(n, t) for n in SPEC for t in SPEC[n]["targets"]]
print(tr[tr.column.str.contains("hedef alt")][["table", "column", "skew", "boxcox_lambda", "suggest"]].round(2).to_string(index=False))
print(cr[cr.imbalance_ratio > 3][["table", "column", "levels", "imbalance_ratio"]].head(15).to_string(index=False))
