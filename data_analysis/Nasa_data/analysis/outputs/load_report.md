# Yükleme raporu (Faz 1)

| table         |   rows_before |   rows_after |   dropped | drop_reason                                                                            |   flagged_cells | flag_detail                                                                                                                                                                                                                                                                                                                                  |
|:--------------|--------------:|-------------:|----------:|:---------------------------------------------------------------------------------------|----------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| acme_normal   |           386 |          386 |         0 | tamamen boş satırlar                                                                   |             410 | x_fuel:60; m_fuel_mg_s:60; m_n2_mg_s:60; m_tot_mg_s:60; zst:60; tad_k_calc:60; 159:tad_k_calc:2; 159:zst:2; 159:peak_burner_T_C:46                                                                                                                                                                                                           |
| acme_inverse  |          1135 |          274 |       861 | tamamen boş satırlar (PSI-159 inverse: 861 boş satır)                                  |              67 | xo2:11; m_o2_mg_s:8; m_n2_mg_s:11; m_tot_mg_s:11; zst:11; tad_k_calc:11; 159:peak_burner_T_C:2; 159:peak_burner_T_K:2                                                                                                                                                                                                                        |
| flex          |           274 |          274 |         0 | tamamen boş satırlar                                                                   |              36 | d0_mm:6; d_ext_mm:28; burn_time_approx(~):2                                                                                                                                                                                                                                                                                                  |
| bass2         |           129 |          129 |         0 | tamamen boş satırlar                                                                   |              43 | o2_final_pct:2; co2_init_pct:2; co2_final_pct:5; co_init_ppm:3; co_final_ppm:8; co_negative_rows:13; o2_final_anomaly_rows:5; co_overrange_cells:5                                                                                                                                                                                           |
| smoke         |           214 |          167 |        47 | malzemesiz 10 satır (ground sayfası alt notları) + DBP 37 satır (kalibrasyon aerosolü) |             143 | sample_temp_c:4; mass_loss_mg:3; zero->NaN:m0_per_cc:12; zero->NaN:m1_mm_per_cc:10; zero->NaN:m3_mpass:19; zero->NaN:dusttrak_a_mg_m3:29; zero->NaN:dusttrak_b_mg_m3:10; zero->NaN:amd_um:3; zero->NaN:dam_um:3; zero->NaN:mpass_3_2:21; zero->NaN:sigma_g:3; zero->NaN:dg_um:3; zero->NaN:inlet_velocity_cm_s:22; zero->NaN:sample_temp_c:1 |
| cfi           |           227 |          227 |         0 | -                                                                                      |               0 |                                                                                                                                                                                                                                                                                                                                              |
| saffire1      |             4 |            4 |         0 | -                                                                                      |               0 |                                                                                                                                                                                                                                                                                                                                              |
| saffire2      |            15 |           15 |         0 | -                                                                                      |               0 |                                                                                                                                                                                                                                                                                                                                              |
| saffire3      |             2 |            2 |         0 | -                                                                                      |               0 |                                                                                                                                                                                                                                                                                                                                              |
| spice         |           469 |          469 |         0 | -                                                                                      |               0 |                                                                                                                                                                                                                                                                                                                                              |
| acme_testdays |           100 |          100 |         0 | -                                                                                      |               0 |                                                                                                                                                                                                                                                                                                                                              |

## Notlar

### bass2_pi_control

| pi              |   pi_sheet_rows |   exp_table_rows |
|:----------------|----------------:|-----------------:|
| Bhattacharjee   |              22 |               22 |
| Ferkul          |               4 |                4 |
| Fernandez-Pello |              27 |               27 |
| Miller          |              20 |               20 |
| Olson           |              27 |               27 |
| T_ien           |              29 |               29 |

### smoke_amd_check

flight: amd_um vs 1000*M1/M0 medyan göreli fark = 0.0000 (n=131); ground: 0.9000 (n=14)

### cfi_merge

Master 227 satır, DATA eşleşen 148 d0, Experimental table 87 satır (master içinde: 79).

