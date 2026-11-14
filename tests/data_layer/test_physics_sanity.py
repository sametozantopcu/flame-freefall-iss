"""B5 - physics regression: EDA findings recomputed from the parquet tables (not read from EDA outputs)."""
import numpy as np
import pandas as pd
from scipy import stats

from conftest import OUT


def test_flex_d2_law_completion(tables):
    """Completion burns: t_b ~ d0^2 -> log-log slope CI must contain 2 (EDA: 2.13, CI 1.76-2.52)."""
    fx = tables["flex"]
    s = fx[(fx.test_end == "Completion") & (fx.d0_mm > 0) & (fx.burn_time_s > 0)]
    lx, ly = np.log(s.d0_mm.astype(float)), np.log(s.burn_time_s.astype(float))
    assert len(s) == 27
    r = stats.linregress(lx, ly)
    t = stats.t.ppf(0.975, len(s) - 2)
    lo, hi = r.slope - t * r.stderr, r.slope + t * r.stderr
    assert lo <= 2.0 <= hi, f"slope {r.slope:.2f}, 95% CI [{lo:.2f}, {hi:.2f}] excludes 2"
    # agrees with the EDA table (OLS slope; its bootstrap CI differs slightly from the analytic one)
    eda = pd.read_csv(OUT / "d2_law_flex.csv").set_index("subset").loc["Completion"]
    assert abs(r.slope - eda.ols_slope) < 0.05


def test_bass2_pmma_stoichiometry(tables):
    """PMMA: C5H8O2 + 6 O2 -> 5 CO2 + 4 H2O, so dCO2/dO2 = -5/6 = -0.83 (EDA median -0.80)."""
    b = tables["bass2"]
    b = b[~b.o2_final_anomaly_flag]
    pm = b[(b.material == "PMMA") & (b.d_o2_pct < -0.2) & b.d_co2_pct.notna()]
    assert len(pm) >= 10, f"only {len(pm)} PMMA tests"
    med = (pm.d_co2_pct / pm.d_o2_pct).median()
    assert -0.95 <= med <= -0.70, f"median dCO2/dO2 = {med:.2f}"


def test_flex_k_unit_consistency(tables):
    """'Burning rate' column is K in mm2/s: (d0^2 - d_ext^2)/t_b divided by K should be ~1 (EDA 0.95)."""
    fx = tables["flex"]
    m = fx.K_from_d2_law.notna() & fx.burn_rate_K_mm2_s.notna() & (fx.burn_rate_K_mm2_s > 0)
    assert m.sum() >= 150
    med = (fx.K_from_d2_law[m] / fx.burn_rate_K_mm2_s[m]).median()
    assert 0.8 <= med <= 1.2, f"median ratio {med:.2f}"
