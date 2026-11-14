# Damlacık yanması (FLEX + CFI)

ISS'te serbest damlacık yanma deneyleri: FLEX (PSI-69, metanol/heptan) ve CFI (PSI-39, dodekan/farnesan karışımları). Girdiler başlangıç çapı, basınç ve ortam bileşimi; hedefler yanma süresi, yanma hızı sabiti K, sönme çapı ve test sonu.

- **Veri seti:** `droplet` · **Satır:** 501 · **İçerik hash'i:** `sha256:551172e91164521ea30258f6c1773e344cc21e54454dde3530dbe3fcdaa240d5`
- **Üretme komutu:** `python -m src.prediction.datasets build` (çıktı `data/modeling/droplet.parquet` ve `.csv`, aynı içerik)
- **CV grubu:** fuel × diluent

## Kaynaklar

| Tablo | Satır filtresi | Satır | psi_id |
|---|---|---|---|
| `flex` | — | 274 | PSI-69 |
| `cfi` | — | 227 | PSI-39 |

## Atıf (investigation DOI'leri)

| psi_id | Kısaltma | DOI | Bağ |
|---|---|---|---|
| PSI-39 | CFI | 10.60555/m6pj-a914 | kaynak dosya |
| PSI-69 | FLEX | 10.60555/mbq8-0451 | kaynak dosya |

## Hedefler

| Hedef | Görev | Tanımlı satır | Alt küme | Sansür etiketi |
|---|---|---|---|---|
| `burn_time_s` | regression | 268 | flex: `burn_time_s.notna()` | `burn_time_truncated` |
| `burn_rate_K_mm2_s` | regression | 258 | flex: `burn_rate_K_mm2_s.notna()` | — |
| `d_ext_mm` | regression | 197 | flex: `d_ext_mm.notna()` | — |
| `test_end` | multiclass | 274 | flex: `test_end.notna()` | — |
| `k_hot_mm2_s` | regression | 148 | cfi: `k_hot_mm2_s.notna()` | — |
| `hf_burn_time_s` | regression | 147 | cfi: `hf_burn_time_s.notna()` | — |
| `d_ext_hot_mm` | regression | 144 | cfi: `d_ext_hot_mm.notna()` | — |
| `has_cool_flame` | binary | 146 | cfi: `completed_analysis == 'Yes'` | — |

### Sızıntı (feature olarak KULLANILMAZ)

- `burn_time_s`: `K_from_d2_law`, `burn_rate_K_mm2_s`, `burn_time_approx`, `d_ext_hot_mm`, `d_ext_mm`, `d_ext_over_d0`, `has_cool_flame`, `hf_burn_time_s`, `k_hot_mm2_s`, `test_end`
- `burn_rate_K_mm2_s`: `K_from_d2_law`, `burn_time_s`, `d_ext_hot_mm`, `d_ext_mm`, `d_ext_over_d0`, `has_cool_flame`, `hf_burn_time_s`, `k_hot_mm2_s`, `test_end`
- `d_ext_mm`: `K_from_d2_law`, `burn_rate_K_mm2_s`, `burn_time_s`, `d_ext_hot_mm`, `d_ext_over_d0`, `has_cool_flame`, `hf_burn_time_s`, `k_hot_mm2_s`, `test_end`
- `test_end`: `K_from_d2_law`, `burn_rate_K_mm2_s`, `burn_time_s`, `d_ext_hot_mm`, `d_ext_mm`, `d_ext_over_d0`, `has_cool_flame`, `hf_burn_time_s`, `k_hot_mm2_s`
- `k_hot_mm2_s`: `actual_d_mm`, `burn_rate_K_mm2_s`, `burn_time_s`, `cf_rad_ratio`, `d_ext_cool_mm`, `d_ext_hot_mm`, `d_ext_mm`, `extrap_cf`, `has_cool_flame`, `hf_burn_time_s`, `k_cool_mm2_s`, `peak_h2o_rad`, `peak_hf_rad`, `rad_2p5mm`, `rad_2p5mm_cf`, `rad_2p5mm_narrow`, `rad_ratio`, `reignitions`, `test_end`, `time_2p5mm`
- `hf_burn_time_s`: `actual_d_mm`, `burn_rate_K_mm2_s`, `burn_time_s`, `cf_rad_ratio`, `d_ext_cool_mm`, `d_ext_hot_mm`, `d_ext_mm`, `extrap_cf`, `has_cool_flame`, `k_cool_mm2_s`, `k_hot_mm2_s`, `peak_h2o_rad`, `peak_hf_rad`, `rad_2p5mm`, `rad_2p5mm_cf`, `rad_2p5mm_narrow`, `rad_ratio`, `reignitions`, `test_end`, `time_2p5mm`
- `d_ext_hot_mm`: `actual_d_mm`, `burn_rate_K_mm2_s`, `burn_time_s`, `cf_rad_ratio`, `d_ext_cool_mm`, `d_ext_mm`, `extrap_cf`, `has_cool_flame`, `hf_burn_time_s`, `k_cool_mm2_s`, `k_hot_mm2_s`, `peak_h2o_rad`, `peak_hf_rad`, `rad_2p5mm`, `rad_2p5mm_cf`, `rad_2p5mm_narrow`, `rad_ratio`, `reignitions`, `test_end`, `time_2p5mm`
- `has_cool_flame`: `actual_d_mm`, `burn_rate_K_mm2_s`, `burn_time_s`, `cf_rad_ratio`, `d_ext_cool_mm`, `d_ext_hot_mm`, `d_ext_mm`, `extrap_cf`, `hf_burn_time_s`, `k_cool_mm2_s`, `k_hot_mm2_s`, `peak_h2o_rad`, `peak_hf_rad`, `rad_2p5mm`, `rad_2p5mm_cf`, `rad_2p5mm_narrow`, `rad_ratio`, `reignitions`, `test_end`, `time_2p5mm`

## Sansür etiketleri

| Etiket | Anlam | True | False | NA |
|---|---|---|---|---|
| `burn_time_truncated` | test_end != 'Completion' (sönme/bozulma): yanma süresi kesilmiş. Yalnızca FLEX burn_time satırlarında; CFI'de test_end yok → NA. | 241 | 27 | 233 |

## Sütunlar

| Sütun | Rol | dtype | Birim | Eksik |
|---|---|---|---|---|
| `psi_id` | trace | str | unit_unknown | 0 |
| `source_file` | trace | str | unit_unknown | 0 |
| `source_row` | trace | int64 | unit_unknown | 0 |
| `source_table` | meta | str | unit_unknown | 0 |
| `fuel` | feature | str | unit_unknown | 0 |
| `x_o2` | feature | float64 | mol fraction | 0 |
| `x_n2` | feature | float64 | mol fraction | 0 |
| `x_co2` | feature | float64 | mol fraction | 227 |
| `x_he` | feature | float64 | mol fraction | 0 |
| `d0_mm` | feature | float64 | mm | 91 |
| `p_atm` | feature | float64 | atm | 0 |
| `diluent` | feature | str | unit_unknown | 0 |
| `year` | group | float64 | year | 277 |
| `burn_time_s` | target | float64 | s | 233 |
| `burn_rate_K_mm2_s` | target | float64 | mm²/s (assumed) | 243 |
| `d_ext_mm` | target | float64 | mm | 304 |
| `test_end` | target | str | unit_unknown | 227 |
| `fiber` | feature | str | unit_unknown | 343 |
| `ign_power_w` | feature | float64 | W | 277 |
| `ign_time_ms` | feature | float64 | ms | 277 |
| `k_hot_mm2_s` | target | float64 | mm²/s | 353 |
| `hf_burn_time_s` | target | float64 | s (assumed) | 354 |
| `d_ext_hot_mm` | target | float64 | mm | 357 |
| `has_cool_flame` | target | float64 | 0/1 | 274 |
| `burn_time_truncated` | label | boolean | unit_unknown | 233 |
| `in_subset__burn_time_s` | mask | bool | unit_unknown | 0 |
| `in_subset__burn_rate_K_mm2_s` | mask | bool | unit_unknown | 0 |
| `in_subset__d_ext_mm` | mask | bool | unit_unknown | 0 |
| `in_subset__test_end` | mask | bool | unit_unknown | 0 |
| `in_subset__k_hot_mm2_s` | mask | bool | unit_unknown | 0 |
| `in_subset__hf_burn_time_s` | mask | bool | unit_unknown | 0 |
| `in_subset__d_ext_hot_mm` | mask | bool | unit_unknown | 0 |
| `in_subset__has_cool_flame` | mask | bool | unit_unknown | 0 |

**Grup sütunu boşlukları (doldurulmadı):** `flex.year` 50

## Varsayımlar (EDA)

- **cfi_has_cool:** has_cool_flame = kcool ölçülmüş mü (1/0) - türetilmiş ikili hedef adayı; kcool analizi yapılmamış testlerde de 0 olabileceği için 'completed_analysis' ile birlikte yorumlanmalı.
- **cfi_hf_burn:** 'hf burn time' sütununun birimi belirtilmemiş; değer aralığına göre saniye VARSAYILDI (hf = hot flame).
- **cfi_merge:** PSI-39 cfi = Master_Sheet ⋈ DATA ⋈ Igniter (flex number, 1:1). Experimental_table (87) Master'ın alt kümesi; in_experimental_table ile işaretlendi.
- **flex_K_d2:** K_from_d2_law = (d0² - d_ext²)/t_b yalnızca bilgi amaçlı türetildi; hedef K ile sızıntı ilişkisi var (hedef olarak kullanılamaz).
- **flex_approx:** FLEX 'Burn time' içindeki '~6', '~9' -> 6, 9 sayısal + burn_time_approx=True. '–' -> NaN.
- **flex_burn_rate_unit:** PSI-69 'Burning rate; mm' başlığındaki birim eksik; değer aralığı (~0.4-1 ) damlacık yanma sabiti K ile uyumlu -> burn_rate_K_mm2_s (mm²/s) VARSAYILDI.

## Notlar

- FLEX ve CFI hedefleri birleştirilmedi: FLEX burn_rate_K_mm2_s ile CFI k_hot_mm2_s ayrı sütunlar (yakıtlar kesişmiyor, tanımlar farklı); birleştirmek bir modelleme kararıdır.
- CFI'de x_co2 ölçülmemiş/raporlanmamış: boş bırakıldı, 0 değildir.
- FLEX year 50 testte kaynakta boş; doldurulmadı (CV anahtarı fuel × diluent).
