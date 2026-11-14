# Mikrogravite dumanı (SAME / SAME-R uçuş)

Isıtılan malzemelerden çıkan duman parçacıkları (yalnızca uçuş testleri): ortalama çap ve DustTrak kütle derişimi.

- **Veri seti:** `smoke` · **Satır:** 134 · **İçerik hash'i:** `sha256:457ce9e4bb0bc65a0ffa29d1db156914b84fb2047bac831654f1b701b40d555c`
- **Üretme komutu:** `python -m src.prediction.datasets build` (çıktı `data/modeling/smoke.parquet` ve `.csv`, aynı içerik)
- **CV grubu:** material

## Kaynaklar

| Tablo | Satır filtresi | Satır | psi_id |
|---|---|---|---|
| `smoke` | `campaign != 'ground'` | 134 | PSI-101 |

## Atıf (investigation DOI'leri)

| psi_id | Kısaltma | DOI | Bağ |
|---|---|---|---|
| PSI-101 | SAME-R | 10.60555/2np7-jv14 | kaynak dosya |
| PSI-102 | SAME | 10.60555/gd4k-8h62 | çıkarım |

## Hedefler

| Hedef | Görev | Tanımlı satır | Alt küme | Sansür etiketi |
|---|---|---|---|---|
| `amd_um` | regression | 131 | smoke: `amd_um.notna()` | — |
| `dusttrak_b_mg_m3` | regression | 133 | smoke: `dusttrak_b_mg_m3.notna()` | — |

### Sızıntı (feature olarak KULLANILMAZ)

- `amd_um`: `dam_um`, `dg_um`, `dusttrak_a_mg_m3`, `dusttrak_b_mg_m3`, `log_m0`, `m0_per_cc`, `m1_mm_per_cc`, `m3_mpass`, `mass_loss_mg`, `mpass_3_2`, `sigma_g`
- `dusttrak_b_mg_m3`: `amd_um`, `dam_um`, `dg_um`, `dusttrak_a_mg_m3`, `log_m0`, `m0_per_cc`, `m1_mm_per_cc`, `m3_mpass`, `mass_loss_mg`, `mpass_3_2`, `sigma_g`

## Sütunlar

| Sütun | Rol | dtype | Birim | Eksik |
|---|---|---|---|---|
| `psi_id` | trace | str | unit_unknown | 0 |
| `source_file` | trace | str | unit_unknown | 0 |
| `source_row` | trace | int64 | unit_unknown | 0 |
| `source_table` | meta | str | unit_unknown | 0 |
| `material` | feature | str | unit_unknown | 0 |
| `inlet_velocity_cm_s` | feature | float64 | cm/s | 22 |
| `rt_r0` | feature | float64 | - (resistance ratio, heater temp proxy) | 0 |
| `aging_s` | feature | float64 | s | 4 |
| `sample_temp_c` | feature | float64 | °C | 3 |
| `campaign` | feature | str | unit_unknown | 0 |
| `gravity` | feature | str | unit_unknown | 0 |
| `amd_um` | target | float64 | µm | 3 |
| `dusttrak_b_mg_m3` | target | float64 | mg/m³ | 1 |
| `in_subset__amd_um` | mask | bool | unit_unknown | 0 |
| `in_subset__dusttrak_b_mg_m3` | mask | bool | unit_unknown | 0 |

## Varsayımlar (EDA)

- **smoke_ground_map:** Ground eşlemesi DOĞRULANMADI: amd_um <- 'Best Diameter Ion B/Ptrak Count Mean Diameter', dam_um <- 'DTRak B Diameter of average mass', m0 <- 'Mo Best Diameter', m1 <- 'Ion B M1'. Analizlerde flight-only ve flight+ground AYRI raporlanır.
- **smoke_leak:** amd_um = M1/M0 olduğundan m0_per_cc, m1_mm_per_cc, log_m0 ve ionb_moment amd_um hedefi için SIZINTIDIR; dam_um, dg_um, sigma_g, dusttrak, mpass da aynı anda ölçülen çıktılardır.
- **smoke_source:** `smoke_dataset.csv` repoda YOK. Yerine PSI-101 'Combined_SAMER_Results_06_02_14' çalışma kitabından yeniden kuruldu: flight = 'Reduced_data_sheet' (SAME=1, SAME-R=2), ground = 'SAME_Ground_Test_Results'.
- **smoke_zero:** Duman tablosunda çap/konsantrasyon/hız = 0 değerleri fiziksel değil (ölçülmedi) -> NaN. Sayılar load_report'ta. BELİRSİZ: inlet_velocity_cm_s=0 olan 22 satırın tamamı SAME-R'da; düşük akışlı run'lar olduğu için gerçek 0 olma ihtimali var — feature olarak kullanmadan önce teyit edilmeli.

## Notlar

- Yalnızca uçuş (SAME + SAME-R): zemin testlerinin eşlemesi doğrulanmadığı için çıkarıldı.
- SAME uçuş satırları PSI-101 çalışma kitabında; PSI-102 (SAME) ile bağı kampanya adından çıkarımdır.
- Malzeme her modelde feature olarak kalmalı (Simpson paradoksu: ısıtıcı sıcaklığı ile çap ilişkisi malzeme içinde ters döner).
