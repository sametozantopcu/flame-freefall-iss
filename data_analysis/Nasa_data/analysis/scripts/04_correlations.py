"""Faz 4 - associations by variable type, BH-FDR, MI vs targets, VIF, partial correlations / Simpson check.
Only descriptive estimators are fitted (MI estimator, OLS auxiliary regressions for VIF, rank residualization)."""
import numpy as np
import pandas as pd
from scipy import stats
from scipy.cluster import hierarchy
from scipy.spatial.distance import squareform
from sklearn.feature_selection import mutual_info_classif, mutual_info_regression
from statsmodels.stats.multitest import multipletests
from statsmodels.stats.outliers_influence import variance_inflation_factor

from _common import (CAT, FIG, OUT, RANDOM_STATE, SPEC, TIER1, cat_colors, load, md_table, setup_mpl, slug,
                     target_frame)

plt = setup_mpl()
from matplotlib.colors import LinearSegmentedColormap  # noqa: E402

DIV = LinearSegmentedColormap.from_list("div", ["#2a78d6", "#f1f0ed", "#e34948"])
MIN_N = 8


def is_num(s):
    return pd.api.types.is_numeric_dtype(s) and not pd.api.types.is_bool_dtype(s)


def num_num(x, y):
    m = x.notna() & y.notna()
    n = int(m.sum())
    if n < MIN_N or x[m].nunique() < 2 or y[m].nunique() < 2:
        return []
    pr, pp = stats.pearsonr(x[m].astype(float), y[m].astype(float))
    sr, sp = stats.spearmanr(x[m], y[m])
    return [("pearson_r", pr, pp, n), ("spearman_rho", sr, sp, n)]


def cat_num(c, y):
    m = c.notna() & y.notna()
    n = int(m.sum())
    c, y = c[m].astype(str), y[m].astype(float)
    groups = [y[c == lv].values for lv in c.unique() if (c == lv).sum() >= 2]
    if n < MIN_N or len(groups) < 2:
        return []
    grand = y.mean()
    ss_b = sum(len(g) * (g.mean() - grand) ** 2 for g in groups)
    ss_t = ((y - grand) ** 2).sum()
    eta = np.sqrt(ss_b / ss_t) if ss_t > 0 else np.nan
    try:
        H, p = stats.kruskal(*groups)
    except ValueError:
        H, p = np.nan, np.nan
    eps2 = H / (n - 1) if n > 1 else np.nan
    return [("eta", eta, np.nan, n), ("kruskal_eps2", eps2, p, n)]


def cramers_v(a, b):
    m = a.notna() & b.notna()
    n = int(m.sum())
    if n < MIN_N:
        return []
    ct = pd.crosstab(a[m].astype(str), b[m].astype(str))
    if ct.shape[0] < 2 or ct.shape[1] < 2:
        return []
    chi2, p, _, _ = stats.chi2_contingency(ct, correction=False)
    phi2 = chi2 / n
    r, k = ct.shape
    phi2c = max(0, phi2 - (k - 1) * (r - 1) / (n - 1))
    rc, kc = r - (r - 1) ** 2 / (n - 1), k - (k - 1) ** 2 / (n - 1)
    v = np.sqrt(phi2c / max(1e-12, min(kc - 1, rc - 1))) if min(kc, rc) > 1 else np.nan
    return [("cramers_v_bc", v, p, n)]


def pair(df, a, b):
    xa, xb = df[a], df[b]
    if is_num(xa) and is_num(xb):
        return num_num(xa, xb)
    if is_num(xa):
        return cat_num(xb, xa)
    if is_num(xb):
        return cat_num(xa, xb)
    return cramers_v(xa, xb)


def mi_scores(d, target, task, feats):
    out = []
    y = d[target]
    for f in feats:
        m = y.notna() & d[f].notna()
        if m.sum() < MIN_N or d.loc[m, f].nunique() < 2:
            continue
        x = d.loc[m, f]
        disc = not is_num(x)
        X = (x.astype("category").cat.codes if disc else x.astype(float)).to_numpy().reshape(-1, 1)
        yy = y[m]
        if task == "regression":
            mi = mutual_info_regression(X, yy.astype(float), discrete_features=disc, random_state=RANDOM_STATE,
                                        n_neighbors=3)[0]
        else:
            mi = mutual_info_classif(X, yy.astype(str), discrete_features=disc, random_state=RANDOM_STATE,
                                     n_neighbors=3)[0]
        out.append(("mutual_info", mi, np.nan, int(m.sum()), f))
    return out


def rank_resid(v, G):
    r = stats.rankdata(v)
    beta, *_ = np.linalg.lstsq(G, r, rcond=None)
    return r - G @ beta


def partial_spearman(d, x, y, g):
    """Spearman correlation of x and y after removing group means of ranks (group one-hot)."""
    m = d[x].notna() & d[y].notna() & d[g].notna()
    if m.sum() < MIN_N + 3:
        return np.nan, np.nan, int(m.sum()), np.nan
    sub = d[m]
    G = pd.get_dummies(sub[g].astype(str), drop_first=False).to_numpy(float)
    if G.shape[1] < 2:
        return np.nan, np.nan, int(m.sum()), np.nan
    rx, ry = rank_resid(sub[x].astype(float), G), rank_resid(sub[y].astype(float), G)
    if rx.std() == 0 or ry.std() == 0:
        return np.nan, np.nan, int(m.sum()), np.nan
    r, p = stats.pearsonr(rx, ry)
    # within-group signs
    signs = []
    for lv, gg in sub.groupby(g):
        if len(gg) >= 5 and gg[x].nunique() > 1 and gg[y].nunique() > 1:
            signs.append(np.sign(stats.spearmanr(gg[x], gg[y])[0]))
    frac_neg = np.mean(np.array(signs) < 0) if signs else np.nan
    return r, p, int(m.sum()), frac_neg


def vif_table(df, cols):
    X = df[cols].dropna()
    X = X.loc[:, X.nunique() > 1]
    if len(X) < len(X.columns) + 5 or X.shape[1] < 2:
        return pd.DataFrame(columns=["feature", "vif", "n"])
    Xc = np.column_stack([np.ones(len(X)), X.to_numpy(float)])
    return pd.DataFrame([dict(feature=c, vif=variance_inflation_factor(Xc, i + 1), n=len(X))
                         for i, c in enumerate(X.columns)])


def heatmap(df, cols, name):
    cols = [c for c in cols if is_num(df[c]) and df[c].nunique() > 1]
    if len(cols) < 3:
        return
    rho = df[cols].corr(method="spearman", min_periods=MIN_N)
    keep = rho.notna().sum() > 1
    rho = rho.loc[keep, keep].fillna(0)
    dist = np.clip(1 - rho.abs().to_numpy(), 0, None)
    np.fill_diagonal(dist, 0)
    order = hierarchy.leaves_list(hierarchy.linkage(squareform(dist, checks=False), "average"))
    rho = rho.iloc[order, order]
    n = len(rho)
    fig, ax = plt.subplots(figsize=(0.5 * n + 3, 0.45 * n + 2))
    show = rho.to_numpy().copy()
    np.fill_diagonal(show, np.nan)
    im = ax.imshow(show, cmap=DIV, vmin=-1, vmax=1)
    ax.set_xticks(range(n))
    ax.set_xticklabels(rho.columns, rotation=60, ha="right", fontsize=7)
    ax.set_yticks(range(n))
    ax.set_yticklabels(rho.index, fontsize=7)
    for i in range(n):
        for j in range(n):
            v = rho.iat[i, j]
            if abs(v) >= 0.3 and i != j:
                ax.text(j, i, f"{v:.2f}", ha="center", va="center", fontsize=6,
                        color="white" if abs(v) > 0.7 else "#0b0b0b")
    ax.grid(False)
    fig.colorbar(im, ax=ax, shrink=0.7, label="Spearman ρ")
    ax.set_title(f"{name}: Spearman korelasyonu (hiyerarşik kümelenmiş; |ρ|≥0.3 yazılı)")
    fig.savefig(FIG / f"corr_{name}.png")
    plt.close(fig)


def scatter_top(d, target, feats_rank, gcol, name):
    top = feats_rank[:6]
    if not top:
        return
    fig, axes = plt.subplots(1, len(top), figsize=(2.7 * len(top), 2.8), squeeze=False)
    levels = sorted(d[gcol].dropna().astype(str).unique()) if gcol else []
    cmap = cat_colors(levels)
    for ax, f in zip(axes.flat, top):
        if is_num(d[f]):
            for lv in levels or [None]:
                s = d if lv is None else d[d[gcol].astype(str) == lv]
                ax.scatter(s[f], s[target], s=12, color=cmap.get(lv, CAT[0]), edgecolor="white", linewidth=0.4,
                           label=lv)
        else:
            lv_f = d[f].dropna().astype(str).value_counts().index[:8].tolist()
            ax.boxplot([d.loc[d[f].astype(str) == v, target].dropna().astype(float) for v in lv_f],
                       medianprops=dict(color="#0b0b0b"))
            ax.set_xticks(range(1, len(lv_f) + 1))
            ax.set_xticklabels([v[:10] for v in lv_f], rotation=40, ha="right", fontsize=6)
        ax.set_xlabel(f, fontsize=7)
        ax.tick_params(labelsize=7)
    axes.flat[0].set_ylabel(target)
    num_axes = [ax for ax, f in zip(axes.flat, top) if is_num(d[f])]
    if levels and len(levels) <= 8 and num_axes:
        num_axes[0].legend(fontsize=6, title=gcol, title_fontsize=6, markerscale=1.5)
    fig.suptitle(f"{name}: {target} ~ en güçlü {len(top)} feature (|Spearman|/η sıralı)", fontweight="bold",
                 fontsize=9)
    fig.tight_layout()
    fig.savefig(FIG / f"scatter_{name}_{slug(target)}.png")
    plt.close(fig)


all_summary, simpson_rows, highcorr_rows, vif_rows, partial_rows = [], [], [], [], []
for name in TIER1:
    spec = SPEC[name]
    df = load(name)
    feats = [c for c in spec["num"] + spec["cat"] if c in df.columns and df[c].nunique() > 1]
    rows = []
    # A) feature-feature on full table
    for i, a in enumerate(feats):
        for b in feats[i + 1:]:
            for meas, v, p, n in pair(df, a, b):
                rows.append(dict(scope="feature-feature", var1=a, var2=b, measure=meas, value=v, p=p, n=n))
    # B) target-feature on target subset (+ MI)
    for t, ts in spec["targets"].items():
        d = target_frame(name, t)
        d = d.copy()
        if ts["task"] != "regression":
            d[t] = d[t].astype("string")
        fts = [f for f in feats if d[f].nunique() > 1]
        for f in fts:
            for meas, v, p, n in pair(d, t, f):
                rows.append(dict(scope=f"target:{t}", var1=t, var2=f, measure=meas, value=v, p=p, n=n))
        for meas, v, p, n, f in mi_scores(d, t, ts["task"], fts):
            rows.append(dict(scope=f"target:{t}", var1=t, var2=f, measure=meas, value=v, p=p, n=n))
    A = pd.DataFrame(rows)
    pm = A.p.notna()
    A["p_fdr"] = np.nan
    A.loc[pm, "p_fdr"] = multipletests(A.loc[pm, "p"], method="fdr_bh")[1]
    A["abs_value"] = A.value.abs()
    A[["scope", "var1", "var2", "measure", "value", "p", "p_fdr", "n"]].to_csv(OUT / f"assoc_{name}.csv", index=False)

    # linear vs monotone interpretation
    pv = A[A.measure.isin(["pearson_r", "spearman_rho"])].pivot_table(index=["scope", "var1", "var2"],
                                                                     columns="measure", values="value").reset_index()
    if len(pv):
        pv["diff"] = pv.spearman_rho.abs() - pv.pearson_r.abs()
        pv["shape"] = np.select([(pv.spearman_rho.abs() < 0.2) & (pv.pearson_r.abs() < 0.2),
                                 pv["diff"] > 0.15, pv["diff"] < -0.15],
                                ["zayıf/yok", "monoton ama doğrusal değil", "aykırı değer etkili (Pearson>Spearman)"],
                                "yaklaşık doğrusal")
        pv["table"] = name
    # high correlation pairs among features
    ff = pv[(pv.scope == "feature-feature")] if len(pv) else pv
    for _, r in ff[(ff.pearson_r.abs() > 0.9) | (ff.spearman_rho.abs() > 0.9)].iterrows():
        highcorr_rows.append(dict(table=name, var1=r.var1, var2=r.var2, pearson=r.pearson_r, spearman=r.spearman_rho))
    # VIF
    v = vif_table(df, [c for c in spec["num"] if c in df.columns])
    v["table"] = name
    vif_rows.append(v)
    heatmap(df, spec["num"] + [t for t, s in spec["targets"].items() if s["task"] != "multiclass"
                               and is_num(df[t])], name)

    # C) per target: strongest features, partial correlation, Simpson
    for t, ts in spec["targets"].items():
        d = target_frame(name, t).copy()
        sub = A[(A.scope == f"target:{t}")]
        eff = sub[sub.measure.isin(["spearman_rho", "eta", "cramers_v_bc"])].copy()
        eff = eff.sort_values("abs_value", ascending=False)
        mi = sub[sub.measure == "mutual_info"].set_index("var2").value
        top5 = eff.drop_duplicates("var2").head(5)
        all_summary.append(dict(table=name, target=t, task=ts["task"], n=int(d[t].notna().sum()),
                                top5="; ".join(f"{r.var2} ({r.measure}={r.value:.2f}, MI={mi.get(r.var2, np.nan):.2f})"
                                               for _, r in top5.iterrows())))
        rank = eff.drop_duplicates("var2").var2.tolist()
        if ts["task"] == "regression":
            g = spec["cat"][0] if d[spec["cat"][0]].nunique() > 1 else None
            scatter_top(d, t, rank, g, name)
        # partial correlations: numeric features vs target controlling each group var
        yname = t
        if ts["task"] == "binary":
            lv = sorted(d[t].dropna().astype(str).unique())
            d["_y"] = (d[t].astype(str) == lv[-1]).astype(float).where(d[t].notna())
            yname = "_y"
        elif ts["task"] == "multiclass":
            continue
        for f in [c for c in spec["num"] if c in d.columns and d[c].nunique() > 1]:
            m = d[f].notna() & d[yname].notna()
            if m.sum() < MIN_N:
                continue
            marg = stats.spearmanr(d.loc[m, f], d.loc[m, yname])[0]
            for g in spec["groups"]:
                if g not in d.columns or g == f or d[g].nunique() < 2:
                    continue
                pr, pp, n, fneg = partial_spearman(d, f, yname, g)
                partial_rows.append(dict(table=name, target=t, feature=f, control=g, marginal_rho=marg,
                                         partial_rho=pr, p=pp, n=n, frac_groups_negative=fneg))
                if (abs(marg) >= 0.2 and not np.isnan(pr) and np.sign(pr) != np.sign(marg) and abs(pr) >= 0.1) or \
                   (abs(marg) >= 0.3 and not np.isnan(pr) and abs(pr) < 0.5 * abs(marg)):
                    kind = "işaret dönüşü (Simpson belirtisi)" if np.sign(pr) != np.sign(marg) else "ilişki büyük ölçüde grup kaynaklı"
                    simpson_rows.append(dict(table=name, target=t, feature=f, control=g, marginal_rho=round(marg, 3),
                                             partial_rho=round(pr, 3), n=n, finding=kind))

S = pd.DataFrame(all_summary)
P = pd.DataFrame(partial_rows)
SM = pd.DataFrame(simpson_rows)
HC = pd.DataFrame(highcorr_rows)
V = pd.concat(vif_rows, ignore_index=True)
P.to_csv(OUT / "partial_correlations.csv", index=False)
SM.to_csv(OUT / "simpson_flags.csv", index=False)
V.to_csv(OUT / "vif.csv", index=False)
HC.to_csv(OUT / "high_corr_pairs.csv", index=False)
S.to_csv(OUT / "target_top_features.csv", index=False)
lines = ["# İlişki ve korelasyon özeti (Faz 4)", "",
         "Ölçüler: sayısal–sayısal Pearson+Spearman; kategorik–sayısal η ve Kruskal-Wallis ε²; kategorik–kategorik "
         "bias-düzeltilmiş Cramér's V; hedef–feature için ayrıca karşılıklı bilgi (MI, k=3, random_state=42). "
         "p-değerleri tablo içinde Benjamini-Hochberg FDR ile düzeltildi (`p_fdr`). Etki büyüklüğü önceliklidir.", "",
         "## Hedef başına en güçlü 5 feature", "", md_table(S), "",
         "## |r| > 0.9 feature çiftleri", "", md_table(HC.round(3)) if len(HC) else "_yok_", "",
         "## VIF (sayısal feature adayları, tam gözlemli satırlar)", "", md_table(V.round(2)), "",
         "## Karıştırıcı kontrolü: kısmi Spearman (grup sabit) — işaretlenenler", "",
         md_table(SM) if len(SM) else "_işaretlenen yok_", ""]
(OUT / "correlations_summary.md").write_text("\n".join(lines) + "\n")
pd.set_option("display.width", 200)
print(S[["table", "target", "n", "top5"]].assign(top5=S.top5.str[:110]).to_string(index=False))
print("high corr pairs:", len(HC), "| VIF>10:", V[V.vif > 10][["table", "feature"]].values.tolist())
print("simpson/confounding flags:", len(SM))
print(SM.head(12).to_string(index=False) if len(SM) else "")
