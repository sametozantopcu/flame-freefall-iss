# Planlar — Çalışma Kuralları ve Genel Durum

Her konu (subject) kendi klasöründe: `PLAN.md` (adımlar + checkbox) ve `requirements.txt` (o konunun minimum paketleri).
Mimari kaynağı: [`../Architecture.md`](../Architecture.md).

## Genel durum

| # | Konu | Plan | Bağlı olduğu | İlerleme |
|---|---|---|---|---|
| 00 | Ortak Veri Katmanı (Feature Store, Metadata) | [00_data_layer](00_data_layer/PLAN.md) | — | 22 / 22 |
| 01 | M1 — Keşif & Sıralama | [01_m1_discovery](01_m1_discovery/PLAN.md) | 00 | 0 / 21 |
| 02 | M2 — Tahmin & Senaryo Motoru | [02_m2_prediction](02_m2_prediction/PLAN.md) | 00 | 3 / 26 |
| 03 | M3 — Ekipman İçgörüsü | [03_m3_equipment](03_m3_equipment/PLAN.md) | 00, 01, 02 | 0 / 14 |
| 04 | FlameSense (donanımsız yazılım demosu) | [04_flamesense](04_flamesense/PLAN.md) | 02 (F3 predict) | 0 / 9 |
| 05 | Uygulama (Streamlit dashboard) | [05_backend_dashboard](05_backend_dashboard/PLAN.md) | 01, 02, 03, 04 | 0 / 12 |
| 06 | Teslim: tekrarlanabilirlik, CI, sunum | [06_delivery](06_delivery/PLAN.md) | hepsi | 2 / 14 |

> Bu tabloyu, bir konunun `PLAN.md` dosyasındaki **Durum** bölümünü güncellediğinde aynı anda güncelle.

## Kurallar (insanlar ve Claude için aynı)

1. **Başlamadan önce oku.** Bir konuda çalışacaksan önce bu dosyayı, sonra o konunun `PLAN.md` dosyasındaki **Durum** bölümünü oku.
   Bağımlılıkları tamamlanmış **ilk işaretsiz adımı** al. Adımları sırayla yap. Sıra dışı bir adım yapacaksan nedenini Durum bölümüne not et.
2. **Kutu yalnızca test geçince işaretlenir.** Her adımın bir **Test** satırı var. Test yazılmadan, çalıştırılmadan ya da geçmeden `[x]` yapılmaz.
   `skip` veya `xfail` olan testler "geçti" sayılmaz.
3. **Kanıt satırı zorunlu.** Kutuyu işaretlerken adımın altına şunu ekle:
   `✔ YYYY-MM-DD · <çalıştırılan komut> · <kısa sonuç, ör. "5 passed">`
4. **Elle yapılan adımlar** (donanım, gözle kontrol, sunum): Bunların da testi vardır. Test, bir kanıt dosyasının varlığını ve içeriğini kontrol eder
   (ör. `docs/evidence/...md`, ölçüm logu, ekran görüntüsü). Kanıt dosyası yoksa kutu işaretlenmez.
5. **Durum bölümünü güncelle.** Her oturumun sonunda ilgili `PLAN.md` dosyasında şunları güncelle: ilerleme sayısı, "Son güncelleme" tarihi, "Sıradaki adım", açık sorunlar.
   Sonra yukarıdaki genel tabloyu güncelle.
6. **Yeni adım gerekirse** ilgili fazın sonuna yeni bir ID ile ekle (ör. `C7`). Mevcut ID'leri **yeniden numaralandırma**; başka planlar bu ID'lere referans veriyor.
   Gereksiz hale gelen adımı silme, üstünü çiz (`- ~~[ ] **ID** ...~~ — **İPTAL (tarih):** neden`) ve nedenini yaz. İptal edilen adımlar toplamdan düşer (sayım `- [ ]`/`- [x]` kutularıdır).
7. **Requirements:** Bir paketi konunun `requirements.txt` dosyasına yalnızca kod onu gerçekten import ettiğinde ekle. Sürümler alt sınır (`>=`) olarak yazılır.
8. **Veri kuralları:** `data_analysis/Nasa_data/raw/` ve `csv/` asla değiştirilmez. Eksik değerler asla 0 ile doldurulmaz.
   Ara tablolarda kaynak izi (`psi_id`, `source_file`, `source_row`) korunur.
9. **Git:** Commit ve push yalnızca ekip üyesi açıkça istediğinde yapılır.

## Önerilen kod yerleşimi

Planlar bu yerleşimi varsayar. Değişirse burada güncelle.

```
src/
  data_layer/      00 — DuckDB store, metadata
  discovery/       01 — zarf, skor, TF-IDF
  prediction/      02 — modelleme setleri, preprocess, modeller, AD, kNN
  insight/         03 — bulgu kartları, ekipman eşleme
app/               05 — mevcut Streamlit dashboard (MVP)
edge/              04 — FlameSense yazılımı: özellik çıkarımı, tespit, replay
models/            02 — model + model kartı
tests/<konu>/      her konunun testleri (pytest)
docs/evidence/     elle yapılan adımların kanıtları
```

Testleri çalıştırmak için: `pip install -r plans/<konu>/requirements.txt` ve ardından `pytest tests/<konu> -q`.
