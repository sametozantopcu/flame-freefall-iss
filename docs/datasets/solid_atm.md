# Katı malzeme yanmasında atmosfer değişimi (BASS-II)

BASS-II (PSI-25) testlerinde yanma boyunca O2/CO2 değişimi ve son CO derişimi.

- **Veri seti:** `solid_atm` · **Satır:** 129 · **İçerik hash'i:** `sha256:014e329df5c41ef8f977d48a3522c0bbfc6afd31e889170458102f341625b9a4`
- **Üretme komutu:** `python -m src.prediction.datasets build` (çıktı `data/modeling/solid_atm.parquet` ve `.csv`, aynı içerik)
- **CV grubu:** pi

## Kaynaklar

| Tablo | Satır filtresi | Satır | psi_id |
|---|---|---|---|
| `bass2` | — | 129 | PSI-25 |

## Atıf (investigation DOI'leri)

| psi_id | Kısaltma | DOI | Bağ |
|---|---|---|---|
| PSI-25 | BASS-II | 10.60555/4qc4-de67 | kaynak dosya |

## Hedefler

| Hedef | Görev | Tanımlı satır | Alt küme | Sansür etiketi |
|---|---|---|---|---|
| `d_o2_pct` | regression | 122 | bass2: `d_o2_pct.notna() and not o2_final_anomaly_flag` | — |
| `d_co2_pct` | regression | 121 | bass2: `d_co2_pct.notna()` | — |
| `co_final_ppm` | regression | 108 | bass2: `co_final_ppm.notna() and not co_negative_flag` | — |

### Sızıntı (feature olarak KULLANILMAZ)

- `d_o2_pct`: `co2_final_pct`, `co_final_ppm`, `co_final_ppm_overrange`, `d_co2_pct`, `d_co_ppm`, `frames`, `frames_raw`, `o2_final_anomaly_flag`, `o2_final_pct`
- `d_co2_pct`: `co2_final_pct`, `co_final_ppm`, `co_final_ppm_overrange`, `d_co_ppm`, `d_o2_pct`, `frames`, `frames_raw`, `o2_final_anomaly_flag`, `o2_final_pct`
- `co_final_ppm`: `co2_final_pct`, `co_final_ppm_overrange`, `d_co2_pct`, `d_co_ppm`, `d_o2_pct`, `frames`, `frames_raw`, `o2_final_anomaly_flag`, `o2_final_pct`

## Sütunlar

| Sütun | Rol | dtype | Birim | Eksik |
|---|---|---|---|---|
| `psi_id` | trace | str | unit_unknown | 0 |
| `source_file` | trace | str | unit_unknown | 0 |
| `source_row` | trace | int64 | unit_unknown | 0 |
| `source_table` | meta | str | unit_unknown | 0 |
| `pi` | feature | str | unit_unknown | 0 |
| `flow_restrictor` | feature | int64 | setting index | 0 |
| `o2_init_pct` | feature | float64 | % vol | 0 |
| `co2_init_pct` | feature | float64 | % vol | 2 |
| `co_init_ppm` | feature | float64 | ppm | 3 |
| `material` | feature | str | unit_unknown | 0 |
| `geometry` | feature | str | unit_unknown | 0 |
| `thickness_mm` | feature | float64 | mm | 33 |
| `rod_color` | feature | str | unit_unknown | 75 |
| `air_display_initial` | feature | float64 | unit_unknown (device reading) | 7 |
| `d_o2_pct` | target | float64 | % vol | 2 |
| `d_co2_pct` | target | float64 | % vol | 8 |
| `co_final_ppm` | target | float64 | ppm | 9 |
| `in_subset__d_o2_pct` | mask | bool | unit_unknown | 0 |
| `in_subset__d_co2_pct` | mask | bool | unit_unknown | 0 |
| `in_subset__co_final_ppm` | mask | bool | unit_unknown | 0 |

## Varsayımlar (EDA)

- **bass2_air_display:** Air/Fan display bir hız değil cihaz potansiyometre okuması; çoğu hücre test boyunca ayar dizisi ('5 3 2 ext'). air_display_initial = ilk sayı; birim unit_unknown.
- **bass2_co_censor:** BASS-II CO 'OR'/'over'/'>500' = ölçüm aralığı aşıldı (sağdan sansürlü) -> NaN + *_overrange=True. 'none' -> NaN.
- **bass2_material:** BASS-II 'Fuel Sample Material' serbest metin -> material (PMMA/SIBAL/Nomex/Wax candle), geometry (film/slab/rod/fabric/sphere_section/candle), thickness_mm (micron/mm/inç'ten). Çubuklarda 'thickness' = çap. '4 cm spherical section' PMMA VARSAYILDI. SIBAL'de '2 cm' genişliktir, kalınlık NaN.
- **bass2_negative_co:** Negatif CO değerleri DÜZELTİLMEDİ; co_negative_flag ile işaretlendi (sensör ofseti olası).
- **bass2_o2_anomaly:** o2_final_anomaly_flag: final O2 < %10 ya da O2'nin test boyunca >0.5 puan ARTMASI (fiziksel değil) -> işaretlendi, düzeltilmedi.

## Notlar

- Negatif CO değerleri düzeltilmedi; co_final_ppm hedefinin alt kümesi co_negative_flag satırlarını dışarıda bırakır.
- d_o2_pct alt kümesi O2 anomalisi işaretli satırları dışarıda bırakır (filtre sütunları sette yok).
- PI (araştırmacı) ve malzeme iç içe; CV grubu pi.
