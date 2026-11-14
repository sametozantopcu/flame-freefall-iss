"""Faz 5 - group effects and physical plausibility checks (descriptive only)."""
import numpy as np
import pandas as pd
from scipy import stats

from _common import CAT, FIG, INK2, OTHER, OUT, RANDOM_STATE, cat_colors, load, md_table, setup_mpl

plt = setup_mpl()
rng = np.random.default_rng(RANDOM_STATE)
L = ["# Grup etkileri ve fizik kontrolü (Faz 5)", ""]
R = {}   # key numbers -> json for report


def loglog_slope(x, y, nboot=2000):
    """Descriptive log-log slope (Theil-Sen, robust) + OLS slope with bootstrap 95% CI."""
    m = (x > 0) & (y > 0) & x.notna() & y.notna()
    lx, ly = np.log(x[m].astype(float).values), np.log(y[m].astype(float).values)
    n = len(lx)
    if n < 6:
        return dict(n=n)
    ols = np.polyfit(lx, ly, 1)[0]
    ts = stats.theilslopes(ly, lx)[0]
    boots = []
    for _ in range(nboot):
        i = rng.integers(0, n, n)
        if np.ptp(lx[i]) > 0:
            boots.append(np.polyfit(lx[i], ly[i], 1)[0])
    lo, hi = np.percentile(boots, [2.5, 97.5])
    return dict(n=n, ols_slope=ols, theil_sen_slope=ts, ci_lo=lo, ci_hi=hi,
                spearman=stats.spearmanr(lx, ly)[0])


# ============================================================ ACME
L += ["## ACME (PSI-10 + PSI-159)", ""]
for name in ["acme_normal", "acme_inverse"]:
    d = load(name)
    g = d[d.experiment == "CFI-G"].copy()
    xo2 = "xo2_init" if name == "acme_normal" else "xo2"
    g["outcome"] = np.where(g.hot_ignition == 1, g.ext_mode.fillna("ignited, mode?"), "no hot ignition")
    if name == "acme_inverse":
        g.loc[g.ignition_class == "flash", "outcome"] = "flash"
    g["outcome"] = g["outcome"].astype(str)
    # grid table: fuel x XO2 bin x p bin
    g["xo2_bin"] = pd.cut(g[xo2], bins=[0, .17, .21, .25, .30, .35, .45], right=False).astype(str)
    g["p_bin"] = pd.cut(g.p_atm, bins=[0, .9, 1.0, 1.1, 2]).astype(str)
    grid = (g.groupby(["fuel_base", "xo2_bin", "p_bin"], observed=True)
              .agg(n=("test", "size"), ignition_rate=("hot_ignition", "mean"),
                   burn_time_median=("burn_time_s", lambda s: s[g.loc[s.index, "hot_ignition"] == 1].median()),
                   se_share=("ext_mode", lambda s: (s == "SE").sum() / max(1, s.notna().sum())))
              .reset_index())
    grid.to_csv(OUT / f"grid_{name}.csv", index=False)
    # O2 vs burn time within fuel (ignited only)
    ign = g[g.hot_ignition == 1]
    rows = []
    for f, s in ign.groupby("fuel_base"):
        if len(s) >= 6:
            r, p = stats.spearmanr(s[xo2], s.burn_time_s)
            rows.append(dict(fuel=f, n=len(s), rho_xo2_burn=r, p=p,
                             rho_p_burn=stats.spearmanr(s.p_atm, s.burn_time_s)[0]))
    within = pd.DataFrame(rows)
    within.to_csv(OUT / f"o2_burn_within_fuel_{name}.csv", index=False)
    R[f"{name}_ign_rate"] = float(g.hot_ignition.mean())
    # extinction-boundary figure
    outcomes = ["SE", "FT", "flash", "no hot ignition"]
    colors = {"SE": CAT[0], "FT": CAT[1], "flash": CAT[3], "no hot ignition": INK2, "ignited, mode?": OTHER}
    fuels = sorted(g.fuel_base.dropna().unique())
    fig, axes = plt.subplots(1, len(fuels), figsize=(3.6 * len(fuels), 3.4), squeeze=False, sharey=True)
    for ax, f in zip(axes.flat, fuels):
        s = g[g.fuel_base == f]
        for o in outcomes + ["ignited, mode?"]:
            q = s[s.outcome == o]
            if len(q):
                jitter = rng.uniform(-0.004, 0.004, len(q))
                ax.scatter(q.p_atm + jitter, q[xo2] * 100, s=22, color=colors[o], label=f"{o} ({len(q)})",
                           marker="x" if o == "no hot ignition" else "o", edgecolor="white" if o != "no hot ignition" else None,
                           linewidth=0.5 if o != "no hot ignition" else 1.2)
        ax.set_title(f"{f} (n={len(s)})")
        ax.set_xlabel("p (atm)")
        ax.legend(fontsize=6, loc="best")
    axes.flat[0].set_ylabel("XO2 (%)" + (" [ortam]" if name == "acme_normal" else " [oksitleyici akışı]"))
    fig.suptitle(f"{name} (CFI-G): tutuşma / söndürme modu haritası — SE=kendiliğinden sönme, FT=akış kesildi",
                 fontweight="bold", fontsize=9)
    fig.tight_layout()
    fig.savefig(FIG / f"extinction_map_{name}.png")
    plt.close(fig)
    # burn time vs XO2 by fuel
    fig, ax = plt.subplots(figsize=(5, 3.4))
    cm = cat_colors(fuels)
    for f in fuels:
        s = ign[ign.fuel_base == f]
        ax.scatter(s[xo2] * 100, s.burn_time_s, s=16, color=cm[f], label=f, edgecolor="white", linewidth=0.4)
    ax.set_yscale("log")
    ax.set_xlabel("XO2 (%)")
    ax.set_ylabel("burn time (s, log)")
    ax.legend(fontsize=7)
    ax.set_title(f"{name} (CFI-G, tutuşanlar): yanma süresi ~ XO2")
    fig.savefig(FIG / f"burn_vs_o2_{name}.png")
    plt.close(fig)
    L += [f"### {name}", "",
          f"- CFI-G satırı: {len(g)}, sıcak tutuşma oranı: {g.hot_ignition.mean():.2f}; sonuç dağılımı: "
          + ", ".join(f"{k}={v}" for k, v in g.outcome.value_counts().items()),
          f"- Yakıt içinde XO2–yanma süresi (tutuşanlar) Spearman:", "", md_table(within.round(3)) if len(within) else "_yetersiz_", "",
          f"- Izgara (yakıt × XO2 × p): `outputs/grid_{name}.csv`; harita: `figures/extinction_map_{name}.png`", ""]
    # PSI-10 has no outcome; show its design space for context
    p10 = d[d.experiment == "FlameDesign"]
    L += [f"- PSI-10 FlameDesign satırları ({len(p10)}) sonuç sütunu içermiyor; XO2 aralığı "
          f"{(p10[xo2]*100).min():.1f}–{(p10[xo2]*100).max():.1f}%, p {p10.p_atm.min():.2f}–{p10.p_atm.max():.2f} atm.", ""]

# ============================================================ FLEX: d^2 law
L += ["## FLEX (PSI-69): d² yasası kontrolü", "",
      "d² yasası: d(t)² = d0² − K·t ⇒ tam yanma süresi t_b = d0²/K, yani log t_b – log d0 eğimi ≈ 2 beklenir "
      "(K sabitse). Sönme ile biten testlerde t_b = (d0² − d_ext²)/K olduğundan eğim farklı olabilir.", ""]
fx = load("flex")
rows = []
for label, sub in [("tümü", fx), ("Completion", fx[fx.test_end == "Completion"]),
                   ("Extinction", fx[fx.test_end == "Extinction"]),
                   ("Methanol", fx[fx.fuel == "Methanol"]), ("Heptane", fx[fx.fuel == "Heptane"]),
                   ("Heptane & Completion", fx[(fx.fuel == "Heptane") & (fx.test_end == "Completion")])]:
    r = loglog_slope(sub.d0_mm, sub.burn_time_s)
    r["subset"] = label
    rows.append(r)
# consistency of reported K with (d0^2 - dext^2)/t_b
m = fx.K_from_d2_law.notna() & fx.burn_rate_K_mm2_s.notna()
kr = (fx.K_from_d2_law[m] / fx.burn_rate_K_mm2_s[m])
rho_k = stats.spearmanr(fx.K_from_d2_law[m], fx.burn_rate_K_mm2_s[m])[0]
# effective time scale check: t_b * K vs d0^2 - dext^2
S = pd.DataFrame(rows)[["subset", "n", "ols_slope", "ci_lo", "ci_hi", "theil_sen_slope", "spearman"]]
S.to_csv(OUT / "d2_law_flex.csv", index=False)
R["flex_slope_all"] = float(S.iloc[0].ols_slope)
L += [md_table(S.round(3)), "",
      f"- Raporlanan K ile (d0²−d_ext²)/t_b tutarlılığı: n={int(m.sum())}, oran medyanı={kr.median():.2f} "
      f"(IQR {kr.quantile(.25):.2f}–{kr.quantile(.75):.2f}), Spearman ρ={rho_k:.2f}. "
      "Oran ≈1 ise 'Burning rate' sütununun mm²/s cinsinden K olduğu varsayımı desteklenir.", ""]
R["flex_K_ratio_median"] = float(kr.median())

fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
cm = cat_colors(["Completion", "Disruption", "Extinction"])
for te in ["Completion", "Disruption", "Extinction"]:
    s = fx[fx.test_end == te]
    axes[0].scatter(s.d0_mm, s.burn_time_s, s=16, color=cm[te], label=f"{te} ({len(s)})", edgecolor="white", linewidth=0.4)
xs = np.linspace(fx.d0_mm.min(), fx.d0_mm.max(), 50)
c = fx[(fx.test_end == "Completion") & (fx.d0_mm > 0) & (fx.burn_time_s > 0)]
if len(c) > 5:
    k2 = np.exp(np.mean(np.log(c.burn_time_s) - 2 * np.log(c.d0_mm)))
    axes[0].plot(xs, k2 * xs ** 2, color=INK2, lw=1.2, ls="--", label="t ∝ d0² (Completion'a sabitlenmiş)")
axes[0].set_xscale("log")
axes[0].set_yscale("log")
axes[0].set_xlabel("d0 (mm, log)")
axes[0].set_ylabel("burn time (s, log)")
axes[0].legend(fontsize=7)
axes[0].set_title("FLEX: yanma süresi ~ başlangıç çapı (log-log)")
axes[1].scatter(fx.burn_rate_K_mm2_s, fx.K_from_d2_law, s=14, color=CAT[0], edgecolor="white", linewidth=0.4)
lim = [0, np.nanmax([fx.burn_rate_K_mm2_s.max(), fx.K_from_d2_law.max()])]
axes[1].plot(lim, lim, color=INK2, ls="--", lw=1, label="y = x")
axes[1].set_xlabel("raporlanan 'Burning rate' (mm²/s varsayımı)")
axes[1].set_ylabel("(d0² − d_ext²)/t_b (mm²/s)")
axes[1].legend(fontsize=7)
axes[1].set_title("K tutarlılığı (birim varsayımı kontrolü)")
fig.tight_layout()
fig.savefig(FIG / "d2_law_flex.png")
plt.close(fig)

# CFI d2 check
cf = load("cfi")
rc = loglog_slope(cf.d0_mm, cf.hf_burn_time_s)
mm = cf[["d0_mm", "d_ext_hot_mm", "hf_burn_time_s", "k_hot_mm2_s"]].dropna()
k_est = (mm.d0_mm ** 2 - mm.d_ext_hot_mm ** 2) / mm.hf_burn_time_s
ratio_c = (k_est / mm.k_hot_mm2_s)
L += ["### CFI (PSI-39) d² kontrolü", "",
      f"- log(hf burn time) ~ log(d0) eğimi: OLS {rc.get('ols_slope', np.nan):.2f} "
      f"(95% BS GA {rc.get('ci_lo', np.nan):.2f}–{rc.get('ci_hi', np.nan):.2f}), n={rc.get('n')}",
      f"- (d0² − d_ext,hot²)/t_hf ÷ khot: medyan {ratio_c.median():.2f} (IQR {ratio_c.quantile(.25):.2f}–{ratio_c.quantile(.75):.2f}), n={len(mm)}. "
      "≈1 ise 'hf burn time' saniye ve khot mm²/s ile tutarlıdır.", ""]
R["cfi_slope"] = rc.get("ols_slope")
R["cfi_K_ratio_median"] = float(ratio_c.median())

# ============================================================ SMOKE
L += ["## Duman (SAME / SAME-R)", ""]
sm = load("smoke")
mats = sorted(sm.material.dropna().unique())
for label, sub in [("flight-only", sm[sm.gravity == "flight"]), ("flight+ground", sm)]:
    t = sub.pivot_table(index="material", columns="campaign", values="amd_um", aggfunc="median").round(3)
    nt = sub.pivot_table(index="material", columns="campaign", values="amd_um", aggfunc="count")
    L += [f"### amd_um medyanı (µm) — {label}", "", md_table(t.reset_index()), "",
          "n:", "", md_table(nt.reset_index()), ""]
# within-material rt_r0 effect
rows = []
for mtl, s in sm[sm.gravity == "flight"].groupby("material"):
    s = s.dropna(subset=["rt_r0", "amd_um"])
    if len(s) >= 6 and s.rt_r0.nunique() > 2:
        rows.append(dict(material=mtl, n=len(s), rho_rt_amd=stats.spearmanr(s.rt_r0, s.amd_um)[0],
                         rho_aging_amd=stats.spearmanr(s.aging_s, s.amd_um)[0] if s.aging_s.nunique() > 2 else np.nan,
                         rho_rt_dusttrakB=stats.spearmanr(s.rt_r0, s.dusttrak_b_mg_m3, nan_policy="omit")[0]))
W = pd.DataFrame(rows)
W.to_csv(OUT / "smoke_within_material.csv", index=False)
# flight vs ground (same material) Mann-Whitney on amd (UNVERIFIED mapping)
rows = []
for mtl in mats:
    a = sm[(sm.material == mtl) & (sm.gravity == "flight")].amd_um.dropna()
    b = sm[(sm.material == mtl) & (sm.gravity == "ground")].amd_um.dropna()
    if len(a) >= 3 and len(b) >= 3:
        u, p = stats.mannwhitneyu(a, b)
        rows.append(dict(material=mtl, n_flight=len(a), n_ground=len(b), median_flight=a.median(),
                         median_ground=b.median(), rank_biserial=1 - 2 * u / (len(a) * len(b)), p=p))
FG = pd.DataFrame(rows)
L += ["### Malzeme içinde Rt/R0 (ısıtıcı sıcaklığı) ve yaşlanma etkisi — flight-only (Spearman)", "",
      md_table(W.round(3)), "",
      "### Flight vs ground (amd_um) — ground eşlemesi DOĞRULANMADI, yalnızca betimsel", "",
      md_table(FG.round(3)) if len(FG) else "_yetersiz_", ""]
fig, axes = plt.subplots(1, 2, figsize=(11, 3.8), sharey=True)
cm = cat_colors(mats)
for ax, (label, sub) in zip(axes, [("flight-only", sm[sm.gravity == "flight"]), ("flight+ground", sm)]):
    for mtl in mats:
        for grav, mk in [("flight", "o"), ("ground", "^")]:
            s = sub[(sub.material == mtl) & (sub.gravity == grav)]
            if len(s):
                ax.scatter(s.rt_r0, s.amd_um, s=18, color=cm[mtl], marker=mk, edgecolor="white", linewidth=0.4,
                           label=f"{mtl} ({grav})")
    ax.set_xlabel("Rt/R0 (ısıtıcı direnç oranı ≈ sıcaklık)")
    ax.set_title(label)
    ax.set_yscale("log")
axes[0].set_ylabel("amd_um (µm, log)")
axes[1].legend(fontsize=6, ncol=2)
fig.suptitle("Duman: partikül ortalama çapı ~ Rt/R0, malzemeye göre (●=flight, ▲=ground)", fontweight="bold", fontsize=9)
fig.tight_layout()
fig.savefig(FIG / "smoke_amd_rt_material.png")
plt.close(fig)

# ============================================================ BASS-II
L += ["## BASS-II (PSI-25): O2 tüketimi ve CO/CO2 üretimi", ""]
b = load("bass2")
bb = b[~b.o2_final_anomaly_flag.astype(bool)].copy()
agg = (bb.groupby(["material", "geometry"])
         .agg(n=("test", "size"), d_o2_median=("d_o2_pct", "median"), d_co2_median=("d_co2_pct", "median"),
              co_final_median=("co_final_ppm", "median"), d_co_median=("d_co_ppm", "median"))
         .reset_index().round(3))
agg.to_csv(OUT / "bass2_material_effects.csv", index=False)
pm = bb[(bb.material == "PMMA") & (bb.d_o2_pct < -0.2) & bb.d_co2_pct.notna()]
ratio = (pm.d_co2_pct / pm.d_o2_pct)
lin = stats.theilslopes(pm.d_co2_pct, pm.d_o2_pct) if len(pm) > 5 else (np.nan,)
R["bass_pmma_ratio_median"] = float(ratio.median())
L += [md_table(agg), "",
      f"- PMMA stokiyometri kontrolü (C5H8O2 + 6 O2 → 5 CO2 + 4 H2O ⇒ ΔCO2/ΔO2 = −5/6 ≈ −0.83): "
      f"ölçülen oran medyanı {ratio.median():.2f} (IQR {ratio.quantile(.25):.2f}–{ratio.quantile(.75):.2f}), "
      f"Theil-Sen eğim {lin[0]:.2f}, n={len(pm)} (yalnızca ΔO2 < −0.2 puan olan testler).",
      f"- İşaretli: negatif CO {int(b.co_negative_flag.sum())} test, O2 anomali {int(b.o2_final_anomaly_flag.sum())} test "
      "(analizden çıkarıldı, düzeltilmedi).", ""]
fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
geos = sorted(bb.geometry.dropna().unique())
cm = cat_colors(geos)
for gname in geos:
    s = bb[bb.geometry == gname]
    axes[0].scatter(s.d_o2_pct, s.d_co2_pct, s=18, color=cm[gname], label=f"{gname} ({len(s)})", edgecolor="white", linewidth=0.4)
xx = np.linspace(bb.d_o2_pct.min(), 0, 20)
axes[0].plot(xx, -5 / 6 * xx, color=INK2, ls="--", lw=1, label="PMMA stokiyometri (−5/6)")
axes[0].set_xlabel("ΔO2 (% hacim, final−initial)")
axes[0].set_ylabel("ΔCO2 (% hacim)")
axes[0].legend(fontsize=6)
axes[0].set_title("O2 tüketimi vs CO2 üretimi")
order = bb.groupby("geometry").d_o2_pct.median().sort_values().index.tolist()
axes[1].boxplot([bb[bb.geometry == gname].d_o2_pct.dropna() for gname in order], medianprops=dict(color="#0b0b0b"))
axes[1].set_xticks(range(1, len(order) + 1))
axes[1].set_xticklabels(order, rotation=30, ha="right")
axes[1].set_ylabel("ΔO2 (% hacim)")
axes[1].set_title("Geometriye göre O2 tüketimi")
fig.tight_layout()
fig.savefig(FIG / "bass2_o2_co2.png")
plt.close(fig)

(OUT / "group_effects.md").write_text("\n".join(L) + "\n")
pd.Series(R).to_json(OUT / "group_effects_numbers.json", indent=1)
print(S.round(3).to_string(index=False))
print({k: (round(v, 3) if isinstance(v, float) else v) for k, v in R.items()})
print(W.round(2).to_string(index=False))
print(FG.round(3).to_string(index=False) if len(FG) else "no FG")
