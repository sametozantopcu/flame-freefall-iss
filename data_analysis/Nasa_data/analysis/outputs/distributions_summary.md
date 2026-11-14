# Dağılım özeti (Faz 3)

Figürler: `figures/dist_*.png`, `cat_*.png`, `box_*.png`, `target_*.png`.

## Dönüşüm önerileri (|çarpıklık| ≥ 0.75)

| table        | column                              |   n |   skew |   boxcox_lambda |   skew_boxcox |   skew_log1p |   yeojohnson_lambda |   skew_yj | suggest                                          |
|:-------------|:------------------------------------|----:|-------:|----------------:|--------------:|-------------:|--------------------:|----------:|:-------------------------------------------------|
| acme_normal  | x_fuel                              | 326 |  0.756 |         nan     |       nan     |      nan     |              -1.45  |     0.125 | Yeo-Johnson (λ=-1.45) - sıfır/negatif değer var  |
| acme_normal  | m_fuel_mg_s                         | 326 |  0.776 |         nan     |       nan     |      nan     |              -0.293 |     0.013 | Yeo-Johnson (λ=-0.29) - sıfır/negatif değer var  |
| acme_normal  | m_n2_mg_s                           | 147 |  1.31  |         nan     |       nan     |      nan     |              -0.006 |     0.003 | Yeo-Johnson (λ=-0.01) - sıfır/negatif değer var  |
| acme_normal  | m_tot_mg_s                          | 147 |  1.25  |           0.163 |        -0.032 |        0.105 |              -0.088 |     0.016 | log / log1p (Box-Cox λ≈0)                        |
| acme_normal  | p_init_atm                          | 207 |  0.884 |          -5.45  |         0.218 |        0.857 |             -11.2   |     0.251 | Box-Cox (λ=-5.45)                                |
| acme_normal  | p_final_atm                         | 187 |  0.874 |         -10     |         0.68  |        0.867 |             -19     |     0.695 | Box-Cox (λ=-10.01)                               |
| acme_normal  | p_atm                               | 366 |  2.09  |          -0.267 |        -0.059 |        1.29  |              -1.51  |    -0.133 | Box-Cox (λ=-0.27)                                |
| acme_normal  | zst                                 | 324 |  1.09  |          -0.031 |         0.007 |        0.875 |              -3.64  |     0.191 | log / log1p (Box-Cox λ≈0)                        |
| acme_normal  | tad_k_calc                          | 324 | -0.928 |           4.07  |        -0.283 |       -1.17  |               4.07  |    -0.283 | Box-Cox (λ=4.07)                                 |
| acme_normal  | p_bar                               | 179 |  1.23  |          -0.222 |         0.013 |        0.743 |              -1.24  |     0.067 | log / log1p (Box-Cox λ≈0)                        |
| acme_normal  | burn_time_s                         | 175 |  2.18  |         nan     |       nan     |      nan     |               0.087 |    -0.066 | Yeo-Johnson (λ=0.09) - sıfır/negatif değer var   |
| acme_normal  | d_xo2                               | 366 | -2.97  |         nan     |       nan     |      nan     |             330     |    -0.476 | Yeo-Johnson (λ=330.15) - sıfır/negatif değer var |
| acme_normal  | burn_time_s [hedef alt kümesi]      | 132 |  1.87  |           0.188 |        -0.037 |       -0.409 |               0.132 |    -0.028 | log / log1p (Box-Cox λ≈0)                        |
| acme_inverse | x_fuel_amb_init                     | 274 |  2.02  |          -0.233 |         0.031 |        1.58  |              -6.33  |     0.172 | log / log1p (Box-Cox λ≈0)                        |
| acme_inverse | x_fuel_amb_final                    | 274 |  2.05  |          -0.241 |         0.031 |        1.61  |              -6.42  |     0.172 | log / log1p (Box-Cox λ≈0)                        |
| acme_inverse | p_init_atm                          | 120 |  1.46  |          -0.384 |         0.035 |        1.03  |              -1.55  |     0.107 | Box-Cox (λ=-0.38)                                |
| acme_inverse | p_final_atm                         | 120 |  1.46  |          -0.38  |         0.034 |        1.02  |              -1.53  |     0.104 | Box-Cox (λ=-0.38)                                |
| acme_inverse | p_atm                               | 274 |  0.786 |          -0.157 |         0.04  |        0.468 |              -0.884 |     0.14  | log / log1p (Box-Cox λ≈0)                        |
| acme_inverse | burn_time_s                         | 154 |  1.22  |         nan     |       nan     |      nan     |               0.168 |    -0.094 | Yeo-Johnson (λ=0.17) - sıfır/negatif değer var   |
| acme_inverse | peak_burner_T_C                     | 151 |  1.06  |           0.093 |        -0.027 |       -0.142 |               0.085 |    -0.025 | log / log1p (Box-Cox λ≈0)                        |
| acme_inverse | peak_burner_T_K                     | 152 |  1.06  |          -1.29  |         0.155 |        0.653 |              -1.3   |     0.155 | Box-Cox (λ=-1.29)                                |
| acme_inverse | burn_time_s [hedef alt kümesi]      | 131 |  1.08  |           0.227 |        -0.093 |       -0.328 |               0.167 |    -0.068 | log / log1p (Box-Cox λ≈0)                        |
| flex         | p_mmHg                              | 274 |  3.95  |         nan     |       nan     |      nan     |               0.41  |     1.06  | Yeo-Johnson (λ=0.41) - sıfır/negatif değer var   |
| flex         | x_o2                                | 274 |  0.91  |          -0.262 |        -0     |        0.78  |              -6.42  |     0.01  | Box-Cox (λ=-0.26)                                |
| flex         | x_n2                                | 274 | -0.862 |           1.7   |        -0.22  |       -1.28  |               3.68  |    -0.108 | Box-Cox (λ=1.70)                                 |
| flex         | x_co2                               | 274 |  1.59  |         nan     |       nan     |      nan     |              -6.03  |     0.511 | Yeo-Johnson (λ=-6.03) - sıfır/negatif değer var  |
| flex         | x_he                                | 274 |  2.25  |         nan     |       nan     |      nan     |             -22.4   |     1.67  | Yeo-Johnson (λ=-22.42) - sıfır/negatif değer var |
| flex         | burn_time_s                         | 268 |  0.922 |           0.395 |        -0.066 |       -0.501 |               0.31  |    -0.047 | sqrt (λ≈0.5)                                     |
| flex         | p_atm                               | 274 |  3.95  |         nan     |       nan     |      nan     |              -1.35  |    -0.697 | Yeo-Johnson (λ=-1.35) - sıfır/negatif değer var  |
| flex         | x_o2_pct                            | 274 |  0.91  |          -0.262 |        -0     |        0.218 |              -0.327 |    -0     | Box-Cox (λ=-0.26)                                |
| flex         | K_from_d2_law                       | 196 |  1.08  |         nan     |       nan     |      nan     |              -0.201 |    -0.03  | Yeo-Johnson (λ=-0.20) - sıfır/negatif değer var  |
| flex         | burn_time_s [hedef alt kümesi]      | 268 |  0.922 |           0.395 |        -0.066 |       -0.501 |               0.31  |    -0.047 | sqrt (λ≈0.5)                                     |
| bass2        | co2_init_pct                        | 127 |  2.02  |         nan     |       nan     |      nan     |              -2.88  |    -0.042 | Yeo-Johnson (λ=-2.88) - sıfır/negatif değer var  |
| bass2        | co2_final_pct                       | 123 |  1.04  |          -0.123 |         0.026 |        0.585 |              -1.27  |     0.153 | log / log1p (Box-Cox λ≈0)                        |
| bass2        | co_init_ppm                         | 126 |  3.24  |         nan     |       nan     |      nan     |               0.051 |    -0.092 | Yeo-Johnson (λ=0.05) - sıfır/negatif değer var   |
| bass2        | co_final_ppm                        | 120 |  1.36  |           0.167 |        -0.048 |       -0.414 |               0.129 |    -0.045 | log / log1p (Box-Cox λ≈0)                        |
| bass2        | air_display_initial                 | 122 |  4.64  |         nan     |       nan     |      nan     |              -0.101 |    -0.057 | Yeo-Johnson (λ=-0.10) - sıfır/negatif değer var  |
| bass2        | fan_display_initial                 |  98 |  9.75  |          -0.044 |        -0.049 |        0.887 |              -0.082 |    -0.071 | log / log1p (Box-Cox λ≈0)                        |
| bass2        | d_o2_pct                            | 127 | -0.81  |         nan     |       nan     |      nan     |               1.01  |    -0.412 | Yeo-Johnson (λ=1.01) - sıfır/negatif değer var   |
| bass2        | d_co2_pct                           | 121 |  1.85  |         nan     |       nan     |      nan     |              -1.94  |     0.267 | Yeo-Johnson (λ=-1.94) - sıfır/negatif değer var  |
| bass2        | d_co_ppm                            | 118 |  1.36  |         nan     |       nan     |      nan     |               0.572 |     0.124 | Yeo-Johnson (λ=0.57) - sıfır/negatif değer var   |
| bass2        | d_o2_pct [hedef alt kümesi]         | 122 | -1.66  |         nan     |       nan     |      nan     |               3.18  |    -0.147 | Yeo-Johnson (λ=3.18) - sıfır/negatif değer var   |
| bass2        | d_co2_pct [hedef alt kümesi]        | 121 |  1.85  |         nan     |       nan     |      nan     |              -1.94  |     0.267 | Yeo-Johnson (λ=-1.94) - sıfır/negatif değer var  |
| bass2        | co_final_ppm [hedef alt kümesi]     | 108 |  1.34  |           0.205 |        -0.049 |       -0.59  |               0.171 |    -0.049 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | inlet_velocity_cm_s                 | 132 | -1.62  |           3.31  |        -1.47  |       -1.84  |               4.29  |    -1.46  | Box-Cox (λ=3.31)                                 |
| smoke        | aging_s                             | 154 |  1.49  |          -0.091 |         0.075 |        0.194 |              -0.104 |     0.085 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | m0_per_cc                           | 145 |  0.866 |           0.432 |        -0.11  |       -1.17  |               0.432 |    -0.11  | sqrt (λ≈0.5)                                     |
| smoke        | m1_mm_per_cc                        | 149 |  1.13  |           0.248 |        -0.088 |       -0.547 |               0.242 |    -0.086 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | m3_mpass                            |  90 |  1.97  |         nan     |       nan     |      nan     |              -0.521 |     0.26  | Yeo-Johnson (λ=-0.52) - sıfır/negatif değer var  |
| smoke        | dusttrak_a_mg_m3                    | 105 |  3.62  |          -0     |        -0     |        1.9   |              -0.81  |     0.551 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | dusttrak_b_mg_m3                    | 148 |  1.5   |           0.212 |        -0.076 |       -0.357 |               0.133 |    -0.06  | log / log1p (Box-Cox λ≈0)                        |
| smoke        | amd_um                              | 153 |  2.55  |           0.119 |         0.011 |        1.63  |              -3.52  |     0.021 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | dam_um                              | 152 |  1.2   |           0.32  |         0.018 |        0.735 |              -1.75  |     0.028 | sqrt (λ≈0.5)                                     |
| smoke        | dg_um                               | 124 |  3.35  |           0.013 |         0.002 |        2.35  |              -5.11  |     0.089 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | mass_loss_mg                        | 131 |  7.57  |         nan     |       nan     |      nan     |              -0.627 |     0.079 | Yeo-Johnson (λ=-0.63) - sıfır/negatif değer var  |
| smoke        | log_m0                              | 145 | -1.17  |           6.7   |        -0.142 |       -1.37  |               7.7   |    -0.137 | Box-Cox (λ=6.70)                                 |
| smoke        | amd_um [hedef alt kümesi]           | 153 |  2.55  |           0.119 |         0.011 |        1.63  |              -3.52  |     0.021 | log / log1p (Box-Cox λ≈0)                        |
| smoke        | dusttrak_b_mg_m3 [hedef alt kümesi] | 148 |  1.5   |           0.212 |        -0.076 |       -0.357 |               0.133 |    -0.06  | log / log1p (Box-Cox λ≈0)                        |
| cfi          | x_n2                                | 227 | -1.68  |           3.77  |        -1.19  |       -1.78  |              11.6   |    -1.05  | Box-Cox (λ=3.77)                                 |
| cfi          | d0_mm                               | 148 |  1.04  |          -4.25  |         0.209 |        0.898 |              -5.3   |     0.221 | Box-Cox (λ=-4.24)                                |
| cfi          | k_hot_mm2_s                         | 148 |  2.24  |           0.387 |         0.14  |        1.34  |              -1.96  |    -0.019 | sqrt (λ≈0.5)                                     |
| cfi          | d_ext_cool_mm                       | 120 |  1.72  |         nan     |       nan     |      nan     |              -1.17  |     0.383 | Yeo-Johnson (λ=-1.17) - sıfır/negatif değer var  |
| cfi          | p_atm_data                          | 227 |  1.21  |          -0.307 |         0.064 |        0.68  |              -1.08  |     0.178 | Box-Cox (λ=-0.31)                                |
| cfi          | reignitions                         | 151 |  2.85  |         nan     |       nan     |      nan     |              -3.2   |     1.2   | Yeo-Johnson (λ=-3.20) - sıfır/negatif değer var  |
| cfi          | peak_hf_rad                         | 145 |  0.936 |           0.484 |         0.066 |       -0.499 |               0.456 |     0.059 | sqrt (λ≈0.5)                                     |
| cfi          | peak_h2o_rad                        | 145 |  2.34  |          -0.141 |        -0.016 |        0.354 |              -0.278 |    -0.027 | log / log1p (Box-Cox λ≈0)                        |
| cfi          | rad_ratio                           | 145 |  1.42  |          -1.37  |         0.058 |        1.24  |              -6.78  |     0.129 | Box-Cox (λ=-1.37)                                |
| cfi          | rad_2p5mm                           |  88 |  1.7   |          -0.42  |         0.036 |        0.849 |              -0.748 |     0.079 | Box-Cox (λ=-0.42)                                |
| cfi          | rad_2p5mm_narrow                    |  88 |  1.5   |          -0.386 |         0.045 |        0.906 |              -0.88  |     0.13  | Box-Cox (λ=-0.39)                                |
| cfi          | cf_rad_ratio                        |  88 |  1.95  |          -1.85  |        -0.119 |        1.72  |              -6.17  |    -0.019 | Box-Cox (λ=-1.85)                                |
| cfi          | rad_2p5mm_cf                        |  65 |  2.48  |          -0.114 |        -0.072 |        0.573 |              -0.118 |    -0.073 | log / log1p (Box-Cox λ≈0)                        |
| cfi          | actual_d_mm                         |  96 |  1.44  |           0.027 |         0.009 |        0.39  |              -0.469 |    -0.105 | log / log1p (Box-Cox λ≈0)                        |
| cfi          | p_atm                               | 227 |  1.21  |          -0.307 |         0.064 |        0.68  |              -1.08  |     0.178 | Box-Cox (λ=-0.31)                                |
| cfi          | ign_power_w                         | 224 | -2.75  |           3.42  |         0.562 |       -4.25  |               3.64  |     0.553 | Box-Cox (λ=3.42)                                 |
| cfi          | k_hot_mm2_s [hedef alt kümesi]      | 148 |  2.24  |           0.387 |         0.14  |        1.34  |              -1.96  |    -0.019 | sqrt (λ≈0.5)                                     |
| spice        | Fuel Rate (sccm)                    | 457 |  1.77  |         nan     |       nan     |      nan     |               0.149 |     0.008 | Yeo-Johnson (λ=0.15) - sıfır/negatif değer var   |
| spice        | Fuel Rate (mg/s)                    | 457 |  1.25  |         nan     |       nan     |      nan     |              -0.646 |     0.057 | Yeo-Johnson (λ=-0.65) - sıfır/negatif değer var  |
| spice        | HC Fuel Rate (mg/s)                 | 469 |  1.62  |         nan     |       nan     |      nan     |              -0.672 |     0.042 | Yeo-Johnson (λ=-0.67) - sıfır/negatif değer var  |
| spice        | flame_duration_s                    | 384 |  7.21  |          -0.425 |        -0.331 |        4.35  |              -0.435 |    -0.322 | Box-Cox (λ=-0.42)                                |

## Kategorik denge

| table         | column                 |   levels | majority      |   imbalance_ratio |   minority_pct |
|:--------------|:-----------------------|---------:|:--------------|------------------:|---------------:|
| acme_normal   | experiment             |        2 | FlameDesign   |              1.16 |           46.4 |
| acme_normal   | tfp                    |        2 | No            |              8.94 |           10.1 |
| acme_normal   | fuel_base              |        4 | ethylene      |              4.56 |           10.6 |
| acme_normal   | ext_mode               |        2 | SE            |              3.29 |           23.3 |
| acme_normal   | cool_flame             |        2 | yes           |              7    |           12.5 |
| acme_inverse  | experiment             |        2 | CFI-G         |              1.28 |           43.8 |
| acme_inverse  | tfp                    |        2 | No            |             11.8  |            7.8 |
| acme_inverse  | fuel_base              |        4 | ethylene      |              2.79 |           15.7 |
| acme_inverse  | ignition_class         |        3 | yes           |             16.4  |            5.2 |
| acme_inverse  | ext_mode               |        2 | SE            |              1.4  |           41.7 |
| acme_inverse  | flame_color            |        3 | blue          |              5.9  |           11   |
| acme_inverse  | color_hit_limit        |        2 | False         |              3.97 |           20.1 |
| flex          | fuel                   |        2 | Methanol      |              1.34 |           42.7 |
| flex          | test_end               |        3 | Extinction    |              6.89 |            9.9 |
| flex          | burn_time_approx       |        2 | False         |            136    |            0.7 |
| flex          | diluent                |        3 | CO2           |              2.46 |           18.2 |
| bass2         | pi                     |        6 | T'ien         |              7.25 |            3.1 |
| bass2         | co_init_ppm_overrange  |        2 | False         |            128    |            0.8 |
| bass2         | co_final_ppm_overrange |        2 | False         |             31.2  |            3.1 |
| bass2         | material               |        4 | PMMA          |             98    |            0.8 |
| bass2         | geometry               |        6 | rod           |             54    |            0.8 |
| bass2         | rod_color              |        2 | clear         |              1.08 |           48.1 |
| bass2         | one_sided              |        2 | False         |             24.8  |            3.9 |
| bass2         | air_display_multi      |        2 | True          |              3.3  |           23.3 |
| smoke         | flight_code            |        3 | 2             |              4.36 |           15   |
| smoke         | material               |        5 | Kapton        |              2.2  |           12   |
| smoke         | campaign               |        3 | SAME-R        |              4.36 |           15   |
| smoke         | gravity                |        2 | flight        |              4.06 |           19.8 |
| cfi           | fiber                  |        2 | Yes           |              1.87 |           34.8 |
| cfi           | completed_analysis     |        2 | Yes           |              1.8  |           35.7 |
| cfi           | fuel                   |        4 | n-dodecane    |              1.82 |           19.4 |
| cfi           | diluent                |        2 | N2            |              3.37 |           22.9 |
| cfi           | in_experimental_table  |        2 | False         |              1.87 |           34.8 |
| saffire1      | Sample Number          |        4 | S1            |              1    |           25   |
| saffire1      | Material               |        3 | SIBAL Fabric  |              2    |           25   |
| saffire1      | Percent O2             |        2 | 21.5 - 21.7   |              1    |           50   |
| saffire1      | Flow Direction         |        2 | Concurrent    |              1    |           50   |
| saffire1      | Camera 1               |        2 | S1C1          |              1    |           50   |
| saffire1      | Camera 2               |        2 | S1C2          |              1    |           50   |
| saffire2      | Sample Number          |       15 | 2-1           |              1    |            6.7 |
| saffire2      | Material               |        6 | Silicone      |              4    |           11.1 |
| saffire2      | Samle Thickness        |        7 | 037 mm        |              3    |           11.1 |
| saffire2      | Sample Length          |        2 | 29 cm         |              8    |           11.1 |
| saffire2      | Percent O2 (Note 1)    |        4 | ~ 22.1        |              6    |           11.1 |
| saffire2      | Ignition Power (W)     |        2 | 80 W          |              3.5  |           22.2 |
| saffire2      | Ignition Time (s)      |        2 | 9.2 s         |              3.5  |           22.2 |
| saffire2      | Burn Time (s)          |        6 | Insignificant |              4    |           11.1 |
| saffire2      | Flow Direction         |        2 | Concurrent    |              8    |           11.1 |
| saffire2      | ug Burn Length         |        5 | ~ 0           |              4    |           11.1 |
| saffire2      | ug Spread Length       |        4 | Note 4        |              2    |           20   |
| saffire2      | 1-g Burn Length        |        4 | Complete      |              6    |           11.1 |
| saffire2      | 1-g Spread Rate        |        4 | Acceleratory  |              5    |           12.5 |
| saffire2      | Camera 1               |        7 | S1C1          |              1    |           14.3 |
| saffire2      | Camera 2               |        6 | S1C2          |              1    |           16.7 |
| spice         | Fuel                   |        7 | Propylene     |             30.5  |            0.9 |
| spice         | dup_of_previous        |        2 | False         |             12.8  |            7.2 |
| acme_testdays | experiment             |        4 | CLD Flame     |              1.78 |           18   |
