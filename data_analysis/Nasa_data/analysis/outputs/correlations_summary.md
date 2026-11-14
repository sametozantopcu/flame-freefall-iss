# İlişki ve korelasyon özeti (Faz 4)

Ölçüler: sayısal–sayısal Pearson+Spearman; kategorik–sayısal η ve Kruskal-Wallis ε²; kategorik–kategorik bias-düzeltilmiş Cramér's V; hedef–feature için ayrıca karşılıklı bilgi (MI, k=3, random_state=42). p-değerleri tablo içinde Benjamini-Hochberg FDR ile düzeltildi (`p_fdr`). Etki büyüklüğü önceliklidir.

## Hedef başına en güçlü 5 feature

| table        | target            | task       |   n | top5                                                                                                                                                                                                    |
|:-------------|:------------------|:-----------|----:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| acme_normal  | burn_time_s       | regression | 132 | tad_k_calc (spearman_rho=0.58, MI=0.72); xo2_init (spearman_rho=0.58, MI=0.63); p_atm (spearman_rho=-0.32, MI=0.28); fuel_base (eta=0.24, MI=0.20); day (spearman_rho=0.22, MI=0.46)                    |
| acme_normal  | hot_ignition      | binary     | 179 | tad_k_calc (eta=0.43, MI=0.23); zst (eta=0.33, MI=0.28); fuel_base (cramers_v_bc=0.29, MI=0.06); day (eta=0.27, MI=0.18); m_fuel_mg_s (eta=0.22, MI=0.13)                                               |
| acme_normal  | ext_mode          | binary     | 133 | xo2_init (eta=0.33, MI=0.10); tad_k_calc (eta=0.29, MI=0.06); m_fuel_mg_s (eta=0.24, MI=0.09); fuel_bottle_frac (eta=0.14, MI=0.00); x_fuel (eta=0.12, MI=0.00)                                         |
| acme_inverse | burn_time_s       | regression | 131 | x_fuel_amb_init (spearman_rho=0.67, MI=0.74); p_atm (spearman_rho=-0.54, MI=0.23); zst (spearman_rho=-0.44, MI=0.36); fuel_base (eta=0.22, MI=0.14); tad_k_calc (spearman_rho=0.22, MI=0.33)            |
| acme_inverse | hot_ignition      | binary     | 154 | zst (eta=0.47, MI=0.14); x_fuel_amb_init (eta=0.46, MI=0.12); xo2 (eta=0.44, MI=0.12); tad_k_calc (eta=0.40, MI=0.11); p_atm (eta=0.19, MI=0.06)                                                        |
| acme_inverse | ext_mode          | binary     | 139 | p_atm (eta=0.56, MI=0.19); x_fuel_amb_init (eta=0.56, MI=0.30); zst (eta=0.55, MI=0.30); xo2 (eta=0.24, MI=0.10); hc_burnrate_mg_s (eta=0.13, MI=0.03)                                                  |
| flex         | burn_time_s       | regression | 268 | x_o2 (spearman_rho=0.44, MI=0.12); d0_mm (spearman_rho=0.43, MI=0.50); fuel (eta=0.36, MI=0.05); x_he (spearman_rho=-0.27, MI=0.05); diluent (eta=0.26, MI=0.05)                                        |
| flex         | burn_rate_K_mm2_s | regression | 258 | x_o2 (spearman_rho=0.59, MI=0.38); diluent (eta=0.45, MI=0.13); x_co2 (spearman_rho=-0.42, MI=0.20); x_he (spearman_rho=0.42, MI=0.09); fuel (eta=0.26, MI=0.11)                                        |
| flex         | d_ext_mm          | regression | 197 | d0_mm (spearman_rho=0.67, MI=0.50); x_o2 (spearman_rho=-0.33, MI=0.00); x_co2 (spearman_rho=0.23, MI=0.08); x_n2 (spearman_rho=-0.17, MI=0.04); p_atm (spearman_rho=-0.15, MI=0.05)                     |
| flex         | test_end          | multiclass | 274 | x_o2 (eta=0.58, MI=0.20); fuel (cramers_v_bc=0.30, MI=0.05); d0_mm (eta=0.18, MI=0.00); x_he (eta=0.17, MI=0.03); x_co2 (eta=0.15, MI=0.06)                                                             |
| bass2        | d_o2_pct          | regression | 122 | pi (eta=0.71, MI=0.46); geometry (eta=0.70, MI=0.54); material (eta=0.46, MI=0.35); thickness_mm (spearman_rho=-0.27, MI=0.28); rod_color (eta=0.21, MI=0.00)                                           |
| bass2        | d_co2_pct         | regression | 121 | pi (eta=0.72, MI=0.52); geometry (eta=0.71, MI=0.65); material (eta=0.44, MI=0.30); thickness_mm (spearman_rho=0.33, MI=0.28); rod_color (eta=0.22, MI=0.00)                                            |
| bass2        | co_final_ppm      | regression | 108 | pi (eta=0.70, MI=0.43); geometry (eta=0.56, MI=0.39); co_init_ppm (spearman_rho=0.51, MI=0.54); co2_init_pct (spearman_rho=0.48, MI=0.19); rod_color (eta=0.44, MI=0.13)                                |
| smoke        | amd_um            | regression | 153 | material (eta=0.53, MI=0.24); aging_s (spearman_rho=0.42, MI=0.13); sample_temp_c (spearman_rho=-0.30, MI=0.36); rt_r0 (spearman_rho=-0.27, MI=0.35); inlet_velocity_cm_s (spearman_rho=-0.19, MI=0.01) |
| smoke        | dusttrak_b_mg_m3  | regression | 148 | material (eta=0.78, MI=0.66); sample_temp_c (spearman_rho=-0.40, MI=0.83); rt_r0 (spearman_rho=-0.40, MI=0.74); aging_s (spearman_rho=0.17, MI=0.09); campaign (eta=0.12, MI=0.10)                      |
| cfi          | k_hot_mm2_s       | regression | 148 | x_n2 (spearman_rho=-0.60, MI=0.45); x_o2 (spearman_rho=0.55, MI=0.25); diluent (eta=0.51, MI=0.17); fuel (eta=0.43, MI=0.21); x_he (spearman_rho=0.40, MI=0.22)                                         |
| cfi          | hf_burn_time_s    | regression | 147 | x_o2 (spearman_rho=0.52, MI=0.23); x_he (spearman_rho=-0.42, MI=0.17); diluent (eta=0.40, MI=0.13); fuel (eta=0.38, MI=0.22); d0_mm (spearman_rho=-0.35, MI=0.10)                                       |
| cfi          | d_ext_hot_mm      | regression | 144 | d0_mm (spearman_rho=0.87, MI=1.04); fuel (eta=0.49, MI=0.10); ign_time_ms (spearman_rho=0.39, MI=0.24); x_o2 (spearman_rho=-0.31, MI=0.08); fiber (eta=0.28, MI=0.03)                                   |
| cfi          | has_cool_flame    | binary     | 146 | x_o2 (eta=0.38, MI=0.04); fiber (cramers_v_bc=0.37, MI=0.07); p_atm (eta=0.26, MI=0.04); x_n2 (eta=0.19, MI=0.06); ign_power_w (eta=0.17, MI=0.00)                                                      |

## |r| > 0.9 feature çiftleri

| table        | var1      | var2             |   pearson |   spearman |
|:-------------|:----------|:-----------------|----------:|-----------:|
| acme_normal  | x_fuel    | zst              |    -0.772 |     -0.935 |
| acme_inverse | m_o2_mg_s | hc_burnrate_mg_s |     0.999 |      0.964 |
| smoke        | rt_r0     | sample_temp_c    |     0.994 |      0.992 |
| cfi          | x_n2      | x_he             |    -0.997 |     -0.823 |

## VIF (sayısal feature adayları, tam gözlemli satırlar)

| feature             |        vif |   n | table        |
|:--------------------|-----------:|----:|:-------------|
| x_fuel              |   6.99     | 304 | acme_normal  |
| m_fuel_mg_s         |   1.08     | 304 | acme_normal  |
| xo2_init            |  28        | 304 | acme_normal  |
| p_atm               |   1.23     | 304 | acme_normal  |
| zst                 |  50        | 304 | acme_normal  |
| tad_k_calc          |  43.4      | 304 | acme_normal  |
| fuel_bottle_frac    |   3.68     | 304 | acme_normal  |
| day                 |   1.41     | 304 | acme_normal  |
| xo2                 |  17.1      | 154 | acme_inverse |
| m_o2_mg_s           |   2.66e+03 | 154 | acme_inverse |
| x_fuel_amb_init     |   7.05     | 154 | acme_inverse |
| p_atm               |   3.32     | 154 | acme_inverse |
| zst                 |  23.9      | 154 | acme_inverse |
| tad_k_calc          |   7.16     | 154 | acme_inverse |
| hc_burnrate_mg_s    |   2.69e+03 | 154 | acme_inverse |
| day                 |   4.62     | 154 | acme_inverse |
| d0_mm               |   1.11     | 262 | flex         |
| p_atm               |   1.25     | 262 | flex         |
| x_o2                | 189        | 262 | flex         |
| x_n2                |   2.75e+03 | 262 | flex         |
| x_co2               |   2.72e+03 | 262 | flex         |
| x_he                |   1.11e+03 | 262 | flex         |
| thickness_mm        |   1.5      |  88 | bass2        |
| flow_restrictor     |   1.08     |  88 | bass2        |
| air_display_initial |   1.2      |  88 | bass2        |
| o2_init_pct         |   1.58     |  88 | bass2        |
| co2_init_pct        |   2.87     |  88 | bass2        |
| co_init_ppm         |   3.5      |  88 | bass2        |
| rt_r0               | 114        | 107 | smoke        |
| inlet_velocity_cm_s |   1.06     | 107 | smoke        |
| aging_s             |   1.03     | 107 | smoke        |
| sample_temp_c       | 114        | 107 | smoke        |
| d0_mm               |   1.51     | 147 | cfi          |
| p_atm               |   1.4      | 147 | cfi          |
| x_o2                |  17.3      | 147 | cfi          |
| x_n2                |   2.02e+03 | 147 | cfi          |
| x_he                |   1.93e+03 | 147 | cfi          |
| ign_power_w         |   2.12     | 147 | cfi          |
| ign_time_ms         |   3.3      | 147 | cfi          |

## Karıştırıcı kontrolü: kısmi Spearman (grup sabit) — işaretlenenler

| table        | target            | feature         | control   |   marginal_rho |   partial_rho |   n | finding                           |
|:-------------|:------------------|:----------------|:----------|---------------:|--------------:|----:|:----------------------------------|
| acme_normal  | hot_ignition      | m_fuel_mg_s     | day       |          0.3   |         0.085 | 179 | ilişki büyük ölçüde grup kaynaklı |
| acme_normal  | hot_ignition      | tad_k_calc      | day       |          0.342 |         0.171 | 177 | ilişki büyük ölçüde grup kaynaklı |
| acme_inverse | burn_time_s       | x_fuel_amb_init | day       |          0.666 |         0.228 | 131 | ilişki büyük ölçüde grup kaynaklı |
| acme_inverse | burn_time_s       | p_atm           | day       |         -0.537 |        -0.043 | 131 | ilişki büyük ölçüde grup kaynaklı |
| acme_inverse | burn_time_s       | zst             | day       |         -0.436 |        -0.169 | 131 | ilişki büyük ölçüde grup kaynaklı |
| acme_inverse | hot_ignition      | x_fuel_amb_init | day       |         -0.342 |        -0.035 | 154 | ilişki büyük ölçüde grup kaynaklı |
| acme_inverse | ext_mode          | x_fuel_amb_init | day       |         -0.573 |        -0.019 | 139 | ilişki büyük ölçüde grup kaynaklı |
| acme_inverse | ext_mode          | p_atm           | day       |          0.577 |         0.006 | 139 | ilişki büyük ölçüde grup kaynaklı |
| flex         | burn_rate_K_mm2_s | x_he            | diluent   |          0.417 |         0.134 | 258 | ilişki büyük ölçüde grup kaynaklı |
| smoke        | amd_um            | rt_r0           | material  |         -0.271 |         0.491 | 141 | işaret dönüşü (Simpson belirtisi) |
| smoke        | amd_um            | sample_temp_c   | material  |         -0.296 |         0.492 | 128 | işaret dönüşü (Simpson belirtisi) |
| smoke        | dusttrak_b_mg_m3  | rt_r0           | material  |         -0.397 |         0.366 | 143 | işaret dönüşü (Simpson belirtisi) |
| smoke        | dusttrak_b_mg_m3  | sample_temp_c   | material  |         -0.404 |         0.388 | 131 | işaret dönüşü (Simpson belirtisi) |
| cfi          | k_hot_mm2_s       | x_he            | diluent   |          0.398 |         0.044 | 148 | ilişki büyük ölçüde grup kaynaklı |
| cfi          | hf_burn_time_s    | x_he            | diluent   |         -0.422 |        -0.156 | 147 | ilişki büyük ölçüde grup kaynaklı |

