# `src/data_layer` — veri katmanı okuma API'si

Bütün modüller (M1, M2, M3, backend) veriyi **buradan** okur. `raw/` ve `csv/` klasörlerine doğrudan gitmeyin.
Veri: `data_analysis/Nasa_data/analysis/data/*.parquet` (EDA çıktısı), üstünde bir DuckDB Feature Store.

## Hızlı örnek

```python
from src.data_layer.store import connect
from src.data_layer.features import get_features
from src.data_layer.frame import get_modeling_frame

con = connect()                                    # 11 tablo görünümü + catalog + units
feats = get_features("flex", "burn_time_s", con)   # sızıntısız feature listesi
assert "d_ext_mm" not in feats                     # hedefle birlikte ölçülen sütun girdi olamaz
df = get_modeling_frame("flex", "burn_time_s", con)  # izlenebilir, alt kümesi uygulanmış tablo
X, y, groups = df[feats], df["burn_time_s"], df[df.attrs["groups"]]
assert len(df) == 268 and y.notna().all()
unit = con.execute("SELECT unit FROM units WHERE dataset='flex' AND \"column\"='d0_mm'").fetchone()[0]
print(len(df), unit)                               # 268 mm
```

## Fonksiyonlar

| Fonksiyon | Ne verir |
|---|---|
| `store.connect(db_path=None)` | DuckDB bağlantısı: 11 tablo görünümü, `catalog` (feature kataloğu), `units` (birimler). Çalışma klasöründen bağımsız. |
| `store.build(out_path)` | Aynısını `.duckdb` dosyasına yazar (DBeaver gibi araçlar için). Dosya git'e girmez. CLI: `python -m src.data_layer.store build` |
| `features.get_features(table, target, con)` | `role=feature` sütunları, o hedefin sızıntısı, hedefin kendisi ve tablodaki diğer hedefler çıkarılmış. |
| `frame.get_modeling_frame(table, target, con)` | İz sütunları + hedef + feature'lar + gruplar. Satırlar hedefin alt kümesine indirilmiş. |
| `spec.SPEC`, `spec.unit_of`, `spec.TRACE` | Tablo/hedef/sızıntı tanımları, birim sorgusu, iz sütunları. Tek doğru kaynak. |

## Sözleşmeler

- **Eksik değerler 0 ile doldurulmaz.** Çerçevede eksik olarak kalır. Ağaç modelleri NaN'ı olduğu gibi alabilir; doğrusal modeller için imputasyonu siz yapın (medyan + eksiklik göstergesi).
- **Hedefler dönüştürülmez.** `hot_ignition` float (1.0/0.0), `has_cool_flame` int, `ext_mode` ve `test_end` metin gelir. Kodlama sizin işiniz.
- **Sızıntı `get_features` ile çıkarılır.** Smoke'ta `material` her zaman feature kalmalı (Simpson paradoksu).
- **Doğrulama grup bazlı olmalı.** Gruplar `df.attrs["groups"]` içinde. `attrs` bir kolaylıktır, sözleşme değil: pandas bazı işlemlerde kaybeder; gerekirse `spec.SPEC[table]["groups"]` kullanın.
- **İzlenebilirlik:** her satır `(psi_id, source_file, source_row)` ile kaynak dosyaya bağlanır.
- **Birimler:** `units` tablosu. Bilinmeyen birim `unit_unknown`; kategorik sütunlar için de `unit_unknown` yazar (`is_numeric` ile ayırt edin).

## Tablolar ve hedefler

Alt küme: o hedef için hangi satırların tanımlı olduğu (`get_modeling_frame` bunu otomatik uygular).

<!-- BEGIN targets (generated: python -m src.data_layer.docs_table) -->
| tablo | hedef | görev | alt küme (satır filtresi) |
|---|---|---|---|
| `acme_normal` | `burn_time_s` | regression | `experiment == 'CFI-G' and hot_ignition == 1` |
| `acme_normal` | `hot_ignition` | binary | `experiment == 'CFI-G'` |
| `acme_normal` | `ext_mode` | binary | `experiment == 'CFI-G' and ext_mode.notna()` |
| `acme_inverse` | `burn_time_s` | regression | `experiment == 'CFI-G' and hot_ignition == 1` |
| `acme_inverse` | `hot_ignition` | binary | `experiment == 'CFI-G'` |
| `acme_inverse` | `ext_mode` | binary | `experiment == 'CFI-G' and ext_mode.notna()` |
| `flex` | `burn_time_s` | regression | `burn_time_s.notna()` |
| `flex` | `burn_rate_K_mm2_s` | regression | `burn_rate_K_mm2_s.notna()` |
| `flex` | `d_ext_mm` | regression | `d_ext_mm.notna()` |
| `flex` | `test_end` | multiclass | `test_end.notna()` |
| `bass2` | `d_o2_pct` | regression | `d_o2_pct.notna() and not o2_final_anomaly_flag` |
| `bass2` | `d_co2_pct` | regression | `d_co2_pct.notna()` |
| `bass2` | `co_final_ppm` | regression | `co_final_ppm.notna() and not co_negative_flag` |
| `smoke` | `amd_um` | regression | `amd_um.notna()` |
| `smoke` | `dusttrak_b_mg_m3` | regression | `dusttrak_b_mg_m3.notna()` |
| `cfi` | `k_hot_mm2_s` | regression | `k_hot_mm2_s.notna()` |
| `cfi` | `hf_burn_time_s` | regression | `hf_burn_time_s.notna()` |
| `cfi` | `d_ext_hot_mm` | regression | `d_ext_hot_mm.notna()` |
| `cfi` | `has_cool_flame` | binary | `completed_analysis == 'Yes'` |
<!-- END targets -->

Tier-2 tabloları (`saffire1/2/3`, `spice`, `acme_testdays`) görünümlerde vardır ama hedefleri yoktur; `get_features` ve `get_modeling_frame` onlara `ValueError` verir.

## Yeniden üretim (tek komut)

Repo kökünden çalıştırın (`src` bir isim alanı paketidir; başka klasörden `PYTHONPATH` gerekir):

```bash
python -m src.data_layer.build_all --skip-raw      # raw/ olmadan: commit'li meta/ ve parquet'lerle
python -m src.data_layer.build_all                 # raw/ varsa: metadata'yı yeniden üretip commit'li meta/ ile karşılaştırır
python -m src.data_layer.build_all --update-meta   # yalnızca bilinçli olarak: fark varsa commit'li meta/'nın üzerine yazar
```

Çıktılar `data_analysis/Nasa_data/build/` altına yazılır (git'e girmez; `--out` ile değişir). İlk hatada durur, çıkış kodu 1.
`raw/` varken varsayılan davranış commit'li `meta/`'ya **yazmaz**: fark çıkarsa uyarı verir (çıkış 0), güncellemek için `--update-meta` gerekir.

## Bilinmesi gerekenler

- `connect()` her çağrıda görünümleri yeniden kurar. Döngüde her seferinde çağırmayın; tek bir `con` verin.
- Tablolar küçüktür (en fazla 469 satır); her çağrı tabloyu baştan okur.
- `catalog` yalnızca 6 modelleme tablosunu kapsar; `units` 11 tablonun hepsini.
