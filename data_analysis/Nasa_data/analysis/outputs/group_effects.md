# Grup etkileri ve fizik kontrolü (Faz 5)

## ACME (PSI-10 + PSI-159)

### acme_normal

- CFI-G satırı: 179, sıcak tutuşma oranı: 0.74; sonuç dağılımı: SE=102, no hot ignition=47, FT=30
- Yakıt içinde XO2–yanma süresi (tutuşanlar) Spearman:

| fuel    |   n |   rho_xo2_burn |     p |   rho_p_burn |
|:--------|----:|---------------:|------:|-------------:|
| butane  |  52 |          0.294 | 0.034 |        0.08  |
| ethane  |  40 |          0.515 | 0.001 |       -0.13  |
| propane |  40 |          0.67  | 0     |       -0.835 |

- Izgara (yakıt × XO2 × p): `outputs/grid_acme_normal.csv`; harita: `figures/extinction_map_acme_normal.png`

- PSI-10 FlameDesign satırları (207) sonuç sütunu içermiyor; XO2 aralığı 19.8–40.0%, p 0.99–1.31 atm.

### acme_inverse

- CFI-G satırı: 154, sıcak tutuşma oranı: 0.85; sonuç dağılımı: SE=73, FT=58, no hot ignition=15, flash=8
- Yakıt içinde XO2–yanma süresi (tutuşanlar) Spearman:

| fuel    |   n |   rho_xo2_burn |     p |   rho_p_burn |
|:--------|----:|---------------:|------:|-------------:|
| butane  |  53 |          0.067 | 0.632 |       -0.599 |
| ethane  |  41 |         -0.403 | 0.009 |       -0.49  |
| propane |  37 |          0.183 | 0.279 |       -0.43  |

- Izgara (yakıt × XO2 × p): `outputs/grid_acme_inverse.csv`; harita: `figures/extinction_map_acme_inverse.png`

- PSI-10 FlameDesign satırları (120) sonuç sütunu içermiyor; XO2 aralığı 21.2–85.0%, p 0.43–3.02 atm.

## FLEX (PSI-69): d² yasası kontrolü

d² yasası: d(t)² = d0² − K·t ⇒ tam yanma süresi t_b = d0²/K, yani log t_b – log d0 eğimi ≈ 2 beklenir (K sabitse). Sönme ile biten testlerde t_b = (d0² − d_ext²)/K olduğundan eğim farklı olabilir.

| subset               |   n |   ols_slope |   ci_lo |   ci_hi |   theil_sen_slope |   spearman |
|:---------------------|----:|------------:|--------:|--------:|------------------:|-----------:|
| tümü                 | 260 |       1.31  |   0.936 |    1.63 |             1.7   |      0.432 |
| Completion           |  27 |       2.12  |   1.76  |    2.52 |             2.01  |      0.894 |
| Extinction           | 179 |       0.996 |   0.456 |    1.5  |             1.32  |      0.277 |
| Methanol             | 153 |       1.82  |   1.36  |    2.29 |             2     |      0.617 |
| Heptane              | 107 |       0.642 |   0.084 |    1.1  |             0.766 |      0.177 |
| Heptane & Completion |  19 |       2.03  |   1.55  |    2.56 |             1.9   |      0.81  |

- Raporlanan K ile (d0²−d_ext²)/t_b tutarlılığı: n=196, oran medyanı=0.95 (IQR 0.92–0.97), Spearman ρ=0.96. Oran ≈1 ise 'Burning rate' sütununun mm²/s cinsinden K olduğu varsayımı desteklenir.

### CFI (PSI-39) d² kontrolü

- log(hf burn time) ~ log(d0) eğimi: OLS -1.42 (95% BS GA -2.03–-0.75), n=146
- (d0² − d_ext,hot²)/t_hf ÷ khot: medyan 0.82 (IQR 0.64–0.93), n=144. ≈1 ise 'hf burn time' saniye ve khot mm²/s ile tutarlıdır.

## Duman (SAME / SAME-R)

### amd_um medyanı (µm) — flight-only

| material   | SAME   |   SAME-R |
|:-----------|:-------|---------:|
| Kapton     | 0.159  |    0.112 |
| Lampwick   | 0.236  |    0.177 |
| Pyrell     | <NA>   |    0.302 |
| Silicone   | 0.227  |    0.362 |
| Teflon     | 0.18   |    0.172 |

n:

| material   | SAME   |   SAME-R |
|:-----------|:-------|---------:|
| Kapton     | 6      |       27 |
| Lampwick   | 6      |       20 |
| Pyrell     | <NA>   |       20 |
| Silicone   | 7      |       22 |
| Teflon     | 6      |       17 |

### amd_um medyanı (µm) — flight+ground

| material   | SAME   |   SAME-R | ground   |
|:-----------|:-------|---------:|:---------|
| Kapton     | 0.159  |    0.112 | 0.235    |
| Lampwick   | 0.236  |    0.177 | 0.198    |
| Pyrell     | <NA>   |    0.302 | <NA>     |
| Silicone   | 0.227  |    0.362 | 0.279    |
| Teflon     | 0.18   |    0.172 | 0.145    |

n:

| material   | SAME   |   SAME-R | ground   |
|:-----------|:-------|---------:|:---------|
| Kapton     | 6      |       27 | 4        |
| Lampwick   | 6      |       20 | 6        |
| Pyrell     | <NA>   |       20 | <NA>     |
| Silicone   | 7      |       22 | 7        |
| Teflon     | 6      |       17 | 5        |

### Malzeme içinde Rt/R0 (ısıtıcı sıcaklığı) ve yaşlanma etkisi — flight-only (Spearman)

| material   |   n |   rho_rt_amd |   rho_aging_amd |   rho_rt_dusttrakB |
|:-----------|----:|-------------:|----------------:|-------------------:|
| Kapton     |  33 |        0.68  |           0.15  |              0.593 |
| Lampwick   |  26 |        0.49  |         nan     |              0.244 |
| Pyrell     |  20 |        0.395 |         nan     |              0.25  |
| Silicone   |  29 |        0.433 |           0.625 |              0.132 |
| Teflon     |  23 |        0.363 |           0.37  |              0.154 |

### Flight vs ground (amd_um) — ground eşlemesi DOĞRULANMADI, yalnızca betimsel

| material   |   n_flight |   n_ground |   median_flight |   median_ground |   rank_biserial |     p |
|:-----------|-----------:|-----------:|----------------:|----------------:|----------------:|------:|
| Kapton     |         33 |          4 |           0.118 |           0.235 |           0.697 | 0.026 |
| Lampwick   |         26 |          6 |           0.185 |           0.198 |           0.192 | 0.494 |
| Silicone   |         29 |          7 |           0.276 |           0.279 |          -0.044 | 0.876 |
| Teflon     |         23 |          5 |           0.178 |           0.145 |          -0.2   | 0.509 |

## BASS-II (PSI-25): O2 tüketimi ve CO/CO2 üretimi

| material   | geometry       |   n |   d_o2_median |   d_co2_median |   co_final_median |   d_co_median |
|:-----------|:---------------|----:|--------------:|---------------:|------------------:|--------------:|
| Nomex      | fabric         |   3 |           0   |          0.005 |              42   |         -10.5 |
| PMMA       | film           |  21 |          -0.1 |          0.065 |              22.5 |          16   |
| PMMA       | rod            |  52 |          -0.5 |          0.42  |             159   |          87   |
| PMMA       | slab           |  20 |          -1.1 |          0.88  |             357   |         335   |
| PMMA       | sphere_section |   2 |          -0.3 |          0.275 |             126   |          79.5 |
| SIBAL      | fabric         |  25 |           0   |          0.02  |              41   |          20   |
| Wax candle | candle         |   1 |           0   |          0.1   |              56   |          34   |

- PMMA stokiyometri kontrolü (C5H8O2 + 6 O2 → 5 CO2 + 4 H2O ⇒ ΔCO2/ΔO2 = −5/6 ≈ −0.83): ölçülen oran medyanı -0.80 (IQR -0.87–-0.70), Theil-Sen eğim -0.85, n=66 (yalnızca ΔO2 < −0.2 puan olan testler).
- İşaretli: negatif CO 13 test, O2 anomali 5 test (analizden çıkarıldı, düzeltilmedi).

