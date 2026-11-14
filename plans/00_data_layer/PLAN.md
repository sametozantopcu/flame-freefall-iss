# 00 — Ortak Veri Katmanı

Mimari: [Architecture.md §1](../../Architecture.md) · Kod: `src/data_layer/` · Testler: `tests/data_layer/`

## Durum

- **İlerleme:** 7 / 27
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** B4
- **Açık sorunlar:**
  - `raw/` ve `csv/` git'te yok. B4 ve D1 adımları yalnızca bu klasörlerin bulunduğu makinede çalışır.
    D2 adımında üretilen dosya commit edilince ekibin geri kalanının bu klasörlere ihtiyacı kalmaz.

## Hedef

Bütün modüller (M1, M2, M3, FlameSense) veriyi **tek bir yerden** okur: Feature Store (DuckDB + parquet) ve Metadata DB.
Hiçbir modül `raw/` veya `csv/` klasörünü doğrudan okumaz.

---

## Faz A — EDA'da tamamlananlar

- [x] **A1** Ingest: 24 combustion investigation indirildi (`data_analysis/Nasa_data/ingest/psi_all.py` → `raw/`, `csv/`).
  ✔ 2026-11-14 · EDA çalıştırması · 2487 kanonik dosya. Regresyon testi B1'de.
- [x] **A2** Audit: kopya, sentinel ve şema denetimi yapıldı (`ingest/audit_csv.py`, `ingest/drilldown.py` → `audit/canonical_files.csv`).
  ✔ 2026-11-14 · EDA çalıştırması
- [x] **A3** Harmonize: 11 parquet tablosu üretildi (`analysis/scripts/01_load_core.py` → `analysis/data/*.parquet`).
  ✔ 2026-11-14 · EDA çalıştırması · art arda iki çalıştırmada 50 çıktı birebir aynı
- [x] **A4** Feature kataloğu oluşturuldu (`analysis/outputs/feature_catalog.csv`; roller: target / feature / leakage / meta / exclude).
  ✔ 2026-11-14 · EDA çalıştırması

## Faz B — Mevcut çıktılar için regresyon testleri

- [x] **B1** Parquet şema testi
  - Yap: 11 tablonun var olduğunu, her tabloda `psi_id`, `source_file` ve `source_row` sütunlarının bulunduğunu ve boş olmadığını kontrol et.
  - Test: `pytest tests/data_layer/test_parquet_schema.py`
  - Kabul: 11 tablo; iz sütunlarında %0 eksik; satır sayıları `analysis/outputs/load_report.md` ile aynı.
  ✔ 2026-11-14 · `python -m pytest tests/data_layer/test_parquet_schema.py -q` · 13 passed (11 tablo, iz sütunları %0 eksik, satır sayıları load_report ile eşit)

- [x] **B2** "Asla 0 ile doldurma" değişmez kuralı
  - Yap: Ölçüm sütunlarında yapay 0 olmadığını test et.
    smoke (`amd_um`, `sample_temp_c`, çap sütunları) ve CFI çapları, 0 yerine NaN içermeli.
    `_flag` sütunları bool olmalı.
  - Test: `pytest tests/data_layer/test_no_zero_fill.py`
  - Kabul: Listelenen sütunlarda `== 0` sayısı 0; `_flag` sütunlarının dtype'ı bool.
  ✔ 2026-11-14 · `python -m pytest tests/data_layer/test_no_zero_fill.py -q` · 18 passed. Not: `flex.d_ext_mm`=0 kaynakta var (8 satır: 4 Completion, 4 Disruption), doldurma değil; ayrı kuralla test edildi (yalnızca Completion/Disruption'da olabilir). Bayrak kuralı iki türlü: bool göstergeler (`any_ramp_flag`, `co_negative_flag`, `o2_final_anomaly_flag`) ve string token bayrakları (değer varken token olamaz)

- [x] **B3** Katalog tutarlılığı
  - Yap: `_common.SPEC` içindeki her hedef katalogda `role=target` olmalı. Hiçbir leakage sütunu `role=feature` olmamalı.
  - Test: `pytest tests/data_layer/test_catalog.py`
  - Kabul: 19 hedef bulunuyor; feature ∩ leakage = ∅.
  ✔ 2026-11-14 · `python -m pytest tests/data_layer/test_catalog.py -q` · 39 passed (19 hedef role=target; hiçbir leakage sütunu feature değil)

- [ ] **B4** İdempotentlik
  - Yap: `01_load_core.py` iki kez çalıştırılınca parquet dosyalarının içerik hash'i aynı kalmalı.
  - Test: `pytest tests/data_layer/test_idempotent.py -m needs_raw`
  - Kabul: Hash'ler eşit. (`csv/` yoksa test skip olur; kutu ancak `csv/` olan bir makinede geçince işaretlenir.)
- [ ] **B5** Fizik sağlık testleri: EDA bulgularının regresyonu
  - Yap: Şunları test et:
    - FLEX Completion d² eğiminin %95 GA'sı 2'yi içermeli.
    - BASS-II PMMA ΔCO2/ΔO2 ∈ [−0.95, −0.70] olmalı.
    - FLEX K birim oranının medyanı ∈ [0.8, 1.2] olmalı.
  - Test: `pytest tests/data_layer/test_physics_sanity.py`
  - Kabul: Üç test de geçiyor.

## Faz C — DuckDB Feature Store

- [ ] **C1** `SPEC` sözlüğünü paylaşılan modüle taşı
  - Yap: `analysis/scripts/_common.py` içindeki `SPEC`, `UNITS` ve `target_frame` mantığını `src/data_layer/spec.py` dosyasına kopyala.
    EDA script'leri değişmeden çalışmaya devam etmeli: `_common.py` bunları `spec.py` içinden import etsin.
  - Test: `pytest tests/data_layer/test_spec.py` ve `09_build_report.py` sonrasında `REPORT.md` dosyasının değişmemesi
  - Kabul: `REPORT.md` farkı boş; SPEC tek bir yerde tanımlı.
- [ ] **C2** `feature_store.duckdb` oluşturucu
  - Yap: `src/data_layer/store.py build` komutu, her parquet tablosu için bir görünüm (view) oluştursun. Parquet yolları göreli olmalı.
  - Test: `pytest tests/data_layer/test_store.py::test_views`
  - Kabul: 11 görünüm var; görünümlerin satır sayıları parquet ile eşit.
- [ ] **C3** Katalog ve birim görünümleri
  - Yap: `catalog` (feature_catalog.csv) ve `units` (UNITS + `unit_unknown`) görünümlerini ekle.
  - Test: `pytest tests/data_layer/test_store.py::test_catalog_units`
  - Kabul: Her sayısal feature'ın biriminin bir değeri var (bilinmiyorsa `unit_unknown`).
- [ ] **C4** `get_features(table, target)` fonksiyonu
  - Yap: Fonksiyon `role=feature` olan sütunları döndürsün ve o hedefin leakage listesini otomatik olarak çıkarsın.
  - Test: `pytest tests/data_layer/test_store.py::test_get_features`
  - Kabul: Dönen listede hiçbir leakage sütunu yok; FLEX `burn_time_s` için `d_ext_mm` yok.
- [ ] **C5** `get_modeling_frame(table, target)` fonksiyonu
  - Yap: Hedef alt küme sorgusunu uygula (ör. ACME burn_time için yalnızca CFI-G satırları). Feature'lar, hedef, grup sütunları ve iz sütunları dönsün.
  - Test: `pytest tests/data_layer/test_store.py::test_modeling_frame`
  - Kabul: Satır sayısı `analysis/outputs/target_candidates.csv` dosyasındaki `n` ile birebir aynı (19 hedefin hepsi için).
- [ ] **C6** Okuma API'sinin dokümantasyonu
  - Yap: `src/data_layer/README.md` dosyasında diğer modüllerin nasıl veri okuyacağını 10 satırlık bir örnekle anlat.
  - Test: `pytest tests/data_layer/test_docs.py`. Test, README'deki kod bloğunu çalıştırır.
  - Kabul: Örnek hatasız çalışıyor.

## Faz D — Metadata DB

- [ ] **D1** `detail.json` ayrıştırıcı
  - Yap: `raw/*/detail.json` dosyalarından üç tablo üret:
    - `investigations`: psi_id, başlık, amaç, yaklaşım, etkiler, tarih.
    - `publications`: psi_id, doi, başlık, yıl.
    - `files`: psi_id, ad, uzantı, boyut, kategori.
  - Test: `pytest tests/data_layer/test_metadata.py`. Testte `tests/fixtures/detail_PSI-25.json` kullanılır (küçük, gerçek bir dosyadan kesilmiş).
  - Kabul: Fixture'dan beklenen satırlar çıkıyor. Gerçek veriyle tam 24 investigation çıkıyor.
- [ ] **D2** `meta.duckdb` ve parquet dışa aktarımı
  - Yap: Üç tabloyu `data_analysis/Nasa_data/meta/` klasörüne yaz. Toplam boyut 5 MB'ın altında kalmalı ki commit edilebilsin.
  - Test: `pytest tests/data_layer/test_metadata.py::test_export`
  - Kabul: Dosyalar var ve 5 MB'ın altında; `raw/` olmadan da okunabiliyor.
- [ ] **D3** DOI doğrulama
  - Yap: Her DOI `^10\.\d{4,9}/\S+$` kalıbına uymalı. Uymayanlar `doi_flag` ile işaretlensin, silinmesin.
  - Test: `pytest tests/data_layer/test_metadata.py::test_doi`
  - Kabul: Geçersiz DOI'lerin hepsi işaretli; her investigation en az 1 DOI'ye sahip ya da `no_doi` bayrağı taşıyor.
- [ ] **D4** Investigation ↔ parquet tablosu eşlemesi
  - Yap: `table_map` tablosu oluştur: psi_id → hangi parquet tablosu (ör. PSI-10/159 → acme_*, PSI-101 → smoke).
  - Test: `pytest tests/data_layer/test_metadata.py::test_table_map`
  - Kabul: Her parquet tablosundaki her psi_id değerinin bir eşlemesi var.

## Faz E — Video indeksi (`test_video_map`)

- [ ] **E1** Video listesi
  - Yap: `files` tablosundan `.mp4/.avi/.mov/.zip` dosyalarını al. Ad ve boyut yeterli; **hiçbir video indirilmez**.
  - Test: `pytest tests/data_layer/test_video_index.py::test_list`
  - Kabul: Fixture'daki videolar listeleniyor; test sırasında ağ çağrısı yapılmıyor (mock ile doğrulanır).
- [ ] **E2** Aileye özel test-ID regex'leri
  - Yap: Kalıplar:
    - ACME: `\d{5}[A-Z]\d` (ör. 19115B1)
    - FLEX: test numarası
    - BASS/BASS-II: test/sample numarası veya GMT gün kodu
    - SAFFIRE: sample 1/2
  - Test: `pytest tests/data_layer/test_video_index.py::test_regex`. Her aile için en az 5 pozitif ve 5 negatif örnek dosya adı kullanılır.
  - Kabul: Bütün örnekler doğru sınıflanıyor.
- [ ] **E3** Eşleşme düzeyi ve güven
  - Yap: Eşleşmeleri `exact` (test ID) > `date` (aynı GMT günü) > `investigation` önceliğiyle kur. Her satırda `match_level` ve `confidence` olsun.
  - Test: `pytest tests/data_layer/test_video_index.py::test_match_levels`
  - Kabul: `exact` eşleşmelerin test_id değeri parquet tablolarında gerçekten var; hiçbir satırda düzey boş değil.
- [ ] **E4** Elle doğrulama (20 rastgele eşleşme, `random_state=42`)
  - Yap: Eşleşmeleri gözle kontrol et ve sonucu `docs/evidence/video_audit.md` dosyasına yaz (tablo + doğruluk oranı).
  - Test: `pytest tests/data_layer/test_video_index.py::test_audit_evidence`
  - Kabul: Dosyada 20 satır ve hesaplanmış bir doğruluk oranı var. Oran %80'in altındaysa E2'ye dönülür.
- [ ] **E5** `test_video_map` dışa aktarımı
  - Yap: Tabloyu `meta/` klasörüne yaz ve `meta.duckdb` içinde görünüm olarak ekle.
  - Test: `pytest tests/data_layer/test_video_index.py::test_export`
  - Kabul: Tablo okunabiliyor; sütunlar: test_id, psi_id, file_name, size, match_level, confidence.

## Faz F — Kapanış

- [ ] **F1** Tek komutla yeniden üretim
  - Yap: `python -m src.data_layer.build_all` komutu sırasıyla C2, C3, D1–D4 ve E1–E5 adımlarını çalıştırsın.
  - Test: `pytest tests/data_layer/test_build_all.py`
  - Kabul: Komut temiz bir çalışma kopyasında hatasız bitiyor (raw gerektiren adımlar `--skip-raw` ile atlanabiliyor).
- [ ] **F2** Veri katmanı kullanım kuralının testi
  - Yap: `src/` (data_layer hariç), `backend/` ve `app/` klasörlerinde `raw/` veya `csv/` yoluna geçen her referansı bulan bir test yaz.
  - Test: `pytest tests/data_layer/test_no_raw_access.py`
  - Kabul: Hiç referans yok.
- [ ] **F3** Plan ve durum güncellemesi
  - Yap: Bu dosyanın Durum bölümünü ve `plans/README.md` tablosunu güncelle.
  - Test: `pytest tests/data_layer/test_plan_status.py`. Test, işaretli kutu sayısının Durum satırındaki sayıyla eşleştiğini kontrol eder.
  - Kabul: Sayılar tutarlı.
