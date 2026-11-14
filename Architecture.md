# Mimari — Flame in Freefall (MVP)

Kısa mimari özeti. Ürün kapsamı ve kabul ölçütleri için tek doğruluk kaynağı [MVP_SPEC.md](MVP_SPEC.md), uygulama adımları için [plans/mvp/PLAN.md](plans/mvp/PLAN.md).

## Ürün

NASA PSI yanma deneylerini (24 investigation) Ay/Mars habitat yangın güvenliği çerçevesinde keşfeden, sıralayan, FLEX damla yanma hızını tahmin eden ve ekipman içgörülerine çeviren, yerelde tek komutla çalışan koyu temalı statik web demosu. Ziyaretçi, sitedeki kartlara dayanarak LLM'e soru da sorabilir (anahtar yoksa statik kartlara düşer). Prototiptir.

## Katmanlar ve veri akışı

```
ham veri (raw/, csv/; git'te yok)
  -> analysis/data/*.parquet (temizlenmiş tablolar)
  -> src/data_layer      Feature Store (DuckDB görünümleri) + Metadata (investigation, DOI)
       -> src/discovery  zarflar ve açıklanabilir habitat-ilgi sıralaması (ranking.py)
       -> src/prediction FLEX Ridge modeli, GroupKFold doğrulama (flex_model.py)
       -> src/insight    sayı kaynaklı bulgu kartları (cards.py)
  -> scripts/build_site_data.py -> app/data/site_data.json + site_data.js
  -> app/                statik site (tarayıcıda tahmin ve sıralama gösterimi)
  -> app/server.py       statik dosyalar + POST /api/ask (LLM; anahtar yoksa fallback)
```

Modüller veriyi yalnızca Feature Store veya Metadata katmanından okur; veri okuyan tek ek yer build betiğidir. LLM anahtarı (`.env` içinde `API_KEY`) yalnızca sunucu tarafında okunur.

## Dizin düzeni

| Yol | İçerik |
|---|---|
| `src/data_layer/` | Feature Store, metadata, tablo şeması ve sızıntı listesi |
| `src/discovery/` | zarf çıkarımı, sıralama, LLM istemcisi |
| `src/prediction/` | modelleme veri setleri, kartlar, FLEX modeli |
| `src/insight/` | ekipman bulgu kartları |
| `scripts/` | `build_site_data.py`, JS smoke testleri (`smoke_*.mjs`) |
| `app/` | `index.html`, `app.js`, `i18n.js`, `core/`, `views/`, `ui/`, `data/`, `assets/`, `server.py` |
| `tests/` | pytest (data_layer, discovery, prediction, insight, delivery) |
| `docs/` | veri seti kartları, kanıt dosyaları |
| `data_analysis/Nasa_data/` | ham veri (git dışı), indirme betikleri, EDA |

## Modül – ekran eşlemesi

| Modül | Ekran | Kaynak |
|---|---|---|
| M1 Explore | `app/views/kesif.js` | `src/discovery` sıralaması |
| M2 Scenario | `app/views/senaryo.js` | `src/prediction` FLEX modeli (`app/core/physics.js` ile) |
| M3 Equipment | `app/views/ekipman.js` | `src/insight` kartları |
| FlameSense | `app/views/canli.js` | yalnızca konsept; cihaz yapılmadı |

## Değişmez kurallar

- `data_analysis/Nasa_data/raw/` ve `csv/` değiştirilmez.
- Eksik değerler 0 ile doldurulmaz; ara tablolarda `psi_id`, `source_file`, `source_row` korunur.
- Doğrulama grup bazlıdır (GroupKFold); leakage listesi uygulanır.
- `core/` katmanı kullanıcıya gösterilen metin üretmez; metinler `app/i18n.js` üzerinden gelir.

## Dürüstlük ve sınırlar

- Kısmi yerçekimi (Ay/Mars g) verisi yoktur; yalnızca flight (mikro-g) ve ground (1 g). Kısmi-g tahmini iddia edilmez; habitat skoru yalnızca atmosfer örtüşmesine dayanır.
- Tahmin yalnızca FLEX'te bilinen yakıt/seyreltici kombinasyonları için geçerlidir. Grup-dışı (GroupKFold) skorlar: fuel×diluent R²≈0.37 (6 grup, n=258), year R²≈0.57 (3 grup); n küçük, varyans yüksek.
- Habitat skoru önceliklendirme yardımcısıdır, güvenlik sertifikasyonu değildir.
- LLM cevapları yalnızca verilen kartlara dayanır.

## Atıf

Her veri kaynağı kendi DOI'siyle atıflanır; tam liste `app/data/site_data.json` içindeki `meta.source_dois` alanında (24 DOI) ve [README.md](README.md) içindedir. Örnek: FLEX (PSI-69) 10.60555/mbq8-0451; BASS-II (PSI-25) 10.60555/4qc4-de67; SAME-R (PSI-101) 10.60555/2np7-jv14.
