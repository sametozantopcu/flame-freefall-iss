# 00 — Ortak Veri Katmanı

Mimari: [Architecture.md §1](../../Architecture.md) · Kod: `src/data_layer/` · Testler: `tests/data_layer/`

## Durum

- **İlerleme:** 18 / 27
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** D4 (investigation ↔ parquet tablosu eşlemesi). Faz B ve C tamam.
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

- [x] **B4** İdempotentlik
  - Yap: `01_load_core.py` iki kez çalıştırılınca parquet dosyalarının içerik hash'i aynı kalmalı.
  - Test: `pytest tests/data_layer/test_idempotent.py -m needs_raw`
  - Kabul: Hash'ler eşit. (`csv/` yoksa test skip olur; kutu ancak `csv/` olan bir makinede geçince işaretlenir.) Not: test script'leri geçici ağaçlarda çalıştırır (`csv/` yalnızca okunan sembolik bağ), repoya ve `csv/`'ye dokunamaz; `csv/` olmayan makinede 4 test nedeniyle birlikte skip olur. Plandan ileri: yeniden üretilen tablolar repodaki commit'lenmiş parquet'lerle de karşılaştırılır (içerik hash'i, bayt değil).
  ✔ 2026-11-14 · `python -m pytest tests/data_layer/test_idempotent.py -q -rs` · 6 passed, 0 skipped (csv/ mevcut); tüm set 215 passed. İki çalıştırmada 11 parquet bayt ve içerik olarak aynı, yeniden üretilen = commit'lenmiş, `csv/` ve repo `analysis/data` anlık görüntüleri değişmedi. Negatif kontrol: rastgele sütunlu script 2, bozulmuş commit'li parquet 1 test düşürdü; csv/ yokken 4 test nedeniyle skip oldu
- [x] **B5** Fizik sağlık testleri: EDA bulgularının regresyonu
  - Yap: Şunları test et:
    - FLEX Completion d² eğiminin %95 GA'sı 2'yi içermeli.
    - BASS-II PMMA ΔCO2/ΔO2 ∈ [−0.95, −0.70] olmalı.
    - FLEX K birim oranının medyanı ∈ [0.8, 1.2] olmalı.
  - Test: `pytest tests/data_layer/test_physics_sanity.py`
  - Kabul: Üç test de geçiyor.
  ✔ 2026-11-14 · `python -m pytest tests/data_layer/test_physics_sanity.py -q` · 3 passed. Değerler parquet'ten yeniden hesaplandı (EDA çıktısından okunmadı); bozulmuş kopyada 3 test de düştü

## Faz C — DuckDB Feature Store

- [x] **C1** `SPEC` sözlüğünü paylaşılan modüle taşı
  - Yap: `analysis/scripts/_common.py` içindeki `SPEC`, `UNITS` ve `target_frame` mantığını `src/data_layer/spec.py` dosyasına kopyala.
    EDA script'leri değişmeden çalışmaya devam etmeli: `_common.py` bunları `spec.py` içinden import etsin.
  - Test: `pytest tests/data_layer/test_spec.py` ve `09_build_report.py` sonrasında `REPORT.md` dosyasının değişmemesi
  - Kabul: `REPORT.md` farkı boş; SPEC tek bir yerde tanımlı.
  ✔ 2026-11-14 · `python -m pytest tests -q` · 95 passed (test_spec.py: 22). `analysis/scripts/00–09` yeniden çalıştırıldı: `REPORT.md` + `outputs/figures/data` altındaki 147 dosyanın md5'i taşıma öncesiyle birebir aynı. Negatif kontrol: bozulmuş SPEC sütunu ve script'te yeniden tanım testi düşürdü
- [x] **C2** `feature_store.duckdb` oluşturucu
  - Yap: `src/data_layer/store.py build` komutu, her parquet tablosu için bir görünüm (view) oluştursun. Parquet yolları göreli olmalı.
  - Test: `pytest tests/data_layer/test_store.py::test_views`
  - Kabul: 11 görünüm var; görünümlerin satır sayıları parquet ile eşit. Not: `connect()` görünümleri her çağrıda mutlak yolla kurar, çünkü DuckDB'de göreli yollu görünüm başka klasörden açılınca bozuluyor (doğrulandı). `.duckdb` dosyası git'e girmez.
  ✔ 2026-11-14 · `python -m pytest tests -q` · 110 passed (test_store.py: 15). `python -m src.data_layer.store build` /tmp'den iki kez çalıştı (11 görünüm, hata yok). Negatif kontrol: eksik parquet → net FileNotFoundError; kısaltılmış flex → tam set 3 testle yakaladı (görünüm testi tek başına yakalamaz, satır sayısını B1 korur)
- [x] **C3** Katalog ve birim görünümleri
  - Yap: `catalog` (feature_catalog.csv) ve `units` (UNITS + `unit_unknown`) görünümlerini ekle.
  - Test: `pytest tests/data_layer/test_store.py::test_catalog_units`
  - Kabul: Her sayısal feature'ın biriminin bir değeri var (bilinmiyorsa `unit_unknown`). Not: `units` bir görünüm değil gerçek tablo (pandas'tan gelen veri dosyaya görünüm olarak yazılamaz); kategorik sütunların birimi `unit_unknown` kalır, `is_numeric` ile ayırt edilir; `units` 11 tabloyu, `catalog` yalnızca 6 Tier-1 tabloyu kapsar.
  ✔ 2026-11-14 · `python -m pytest tests -q` · 113 passed (test_store.py: 18). 39 sayısal feature'ın hepsinin birimi var, 16 kategorik `unit_unknown`; catalog 226 satır, rol sayıları sabitlendi; `build` /tmp'den iki kez çalıştı. Negatif kontrol: birimi silinen sayısal feature ve silinen katalog satırı testi düşürdü
- [x] **C4** `get_features(table, target)` fonksiyonu
  - Yap: Fonksiyon `role=feature` olan sütunları döndürsün ve o hedefin leakage listesini otomatik olarak çıkarsın.
  - Test: `pytest tests/data_layer/test_store.py::test_get_features`
  - Kabul: Dönen listede hiçbir leakage sütunu yok; FLEX `burn_time_s` için `d_ext_mm` yok. Not: bugünkü katalogda sızıntı sütunları zaten `role=leakage` olduğu için çıkarma adımı fiilen bir şeyi değiştirmiyor; fonksiyon bir güvence katmanı ve yapay ihlalle (SPEC'e eklenen sızıntı, katalogda yanlışlıkla `feature` yapılan sızıntı) kanıtlandı. Sızıntı kaynağı `SPEC`.
  ✔ 2026-11-14 · `python -m pytest tests -q` · 141 passed (test_features.py: 28; 19 hedefin hepsi parametreli). Negatif kontrol: çıkarma satırı silinince iki yapay-ihlal testi düştü; hedef/diğer-hedef koruması silinince katalog-ihlal testi düştü
- [x] **C5** `get_modeling_frame(table, target)` fonksiyonu
  - Yap: Hedef alt küme sorgusunu uygula (ör. ACME burn_time için yalnızca CFI-G satırları). Feature'lar, hedef, grup sütunları ve iz sütunları dönsün.
  - Test: `pytest tests/data_layer/test_store.py::test_modeling_frame`
  - Kabul: Satır sayısı `analysis/outputs/target_candidates.csv` dosyasındaki `n` ile birebir aynı (19 hedefin hepsi için). Not: alt küme mantığı yalnızca `spec.target_frame`'de; yalnızca filtre için kullanılan sütunlar (`hot_ignition`, `o2_final_anomaly_flag`…) çıktıya girmez; hedefler kaynak dtype'ında kalır, `df.attrs` (target/task/features/groups) bir kolaylıktır, sözleşme değil.
  ✔ 2026-11-14 · `python -m pytest tests -q` · 204 passed (test_frame.py: 63; 19 hedefin hepsi `target_candidates.csv`'deki n ile birebir). Negatif kontrol: alt küme uygulanmayınca 19, sızıntı sütunu eklenince 20, NaN 0'la doldurulunca 14 test düştü
- [x] **C6** Okuma API'sinin dokümantasyonu
  - Yap: `src/data_layer/README.md` dosyasında diğer modüllerin nasıl veri okuyacağını 10 satırlık bir örnekle anlat.
  - Test: `pytest tests/data_layer/test_docs.py`. Test, README'deki kod bloğunu çalıştırır.
  - Kabul: Örnek hatasız çalışıyor. Not: README'deki tablo ve hedef listesi koddan üretiliyor (`python -m src.data_layer.docs_table`), elle yazılmadı; test üretilen bloğun güncel olduğunu kontrol eder. Örnek 10 satır ve kendi `assert`'lerini içerir.
  ✔ 2026-11-14 · `python -m pytest tests -q` · 209 passed (test_docs.py: 5). Örnek `/tmp`'den elle de çalıştırıldı (`268 mm`). Negatif kontrol: bozuk fonksiyon adı, yanlış assert, tablodan silinen hedef ve var olmayan fonksiyon adı testi düşürdü

## Faz D — Metadata DB

- [x] **D1** `detail.json` ayrıştırıcı
  - Yap: `raw/*/detail.json` dosyalarından üç tablo üret:
    - `investigations`: psi_id, başlık, amaç, yaklaşım, etkiler, tarih.
    - `publications`: psi_id, doi, başlık, yıl.
    - `files`: psi_id, ad, uzantı, boyut, kategori.
  - Test: `pytest tests/data_layer/test_metadata.py`. Testte `tests/fixtures/detail_PSI-25.json` kullanılır (küçük, gerçek bir dosyadan kesilmiş).
  - Kabul: Fixture'dan beklenen satırlar çıkıyor. Gerçek veriyle tam 24 investigation çıkıyor. Not (plandan sapmalar): `publications`'ta yıl sütunu yok (kaynakta yok, uydurulmadı); `contacts` (e-posta/telefon) alınmadı; `files` tablosu `added` + `removed` içerir (`status` sütunu); `removed`'da 3.023 yinelenen yol gerçek veridir, tekilleştirilmedi (`source_row` added+removed sırasındaki konumdur, anahtar benzersiz kalır). Tablolar henüz dosyaya yazılmıyor (D2).
  ✔ 2026-11-14 · `python -m pytest tests -q -rs` · 231 passed, 0 skipped (test_metadata.py: 16; fixture `tests/fixtures/detail_PSI-25.json`, 14 KB, kişisel veri yok). Gerçek veri: 24 investigation (DOI'leri kalıba uygun), 352 yayın (68 DOI'siz), 16.354 added + 10.722 removed dosya, 855 mp4; 24 `detail.json`'un md5'i değişmedi. Negatif kontrol (6): tarih biçimi, boş DOI, contacts sızıntısı, eksik yayın, tekilleştirme, float yuvarlama hepsi yakalandı
- [x] **D2** `meta.duckdb` ve parquet dışa aktarımı
  - Yap: Üç tabloyu `data_analysis/Nasa_data/meta/` klasörüne yaz. Toplam boyut 5 MB'ın altında kalmalı ki commit edilebilsin.
  - Test: `pytest tests/data_layer/test_metadata.py::test_export`
  - Kabul: Dosyalar var ve 5 MB'ın altında; `raw/` olmadan da okunabiliyor. Not: commit edilen asıl artefakt 3 parquet (`meta/`, zstd, ~0,76 MB); `meta.duckdb` `connect_meta()`/`build_meta()` ile üretilir ve `*.duckdb` gitignore'da olduğu için commit edilmez (Architecture'daki ad ve yapı korunur). Metadata görünümleri şimdilik `store.connect()`'ten ayrı; D4'te birleştirme önerilecek. `publications.authors` yayın künyesidir (kamuya açık), kişisel iletişim bilgisi değil.
  ✔ 2026-11-14 · `python -m pytest tests -q -rs` · 239 passed, 0 skipped (test_metadata.py: 24). Gerçek export: 24 / 352 / 27.076 satır, toplam 0,76 MB (< 5 MB); commit'li `meta/` `raw/`'dan yeniden üretilenle içerik olarak aynı; `RAW_DIR` boş klasöre yönlendirilmişken `connect_meta()` çalışıyor; iki export bayt olarak aynı; 24 `detail.json` md5'i değişmedi. Bu adımda D1 kodunda dtype sözleşmesi sabitlendi (`source_row` int64, tarihler datetime64[ms]). Negatif kontrol (5): kısaltılmış parquet, zaman damgalı export, 5 MB aşımı, gizli `raw/` bağımlılığı, eksik `meta/` yakalandı
- [x] **D3** DOI doğrulama
  - Yap: Her DOI `^10\.\d{4,9}/\S+$` kalıbına uymalı. Uymayanlar `doi_flag` ile işaretlensin, silinmesin.
  - Test: `pytest tests/data_layer/test_metadata.py::test_doi`
  - Kabul: Geçersiz DOI'lerin hepsi işaretli; her investigation en az 1 DOI'ye sahip ya da `no_doi` bayrağı taşıyor. Not: `doi_flag` ∈ ok/missing/invalid_format, hem `investigations` hem `publications` tablosunda; `investigations.pub_doi_status` ∈ ok/no_doi/no_publications (+ `n_publication_dois`, yalnızca geçerli DOI'ler sayılır). Değer asla düzeltilmez/silinmez. Gerçek veride geçersiz DOI YOK (284 ok, 68 missing); işaretleme mantığı yapay değerlerle kanıtlandı. Kopya DOI'ler (93 satır, 44 DOI birden çok investigation'da, 1 DOI PSI-21 içinde iki kez) bu adımda dokunulmadı → 06/C1'e not.
  ✔ 2026-11-14 · `python -m pytest tests -q -rs` · 266 passed, 0 skipped (test_metadata.py: 51). Gerçek veri: yayınlar 284 ok / 68 missing / 0 invalid; 24 investigation doi_flag=ok; pub_doi_status 22 ok, 1 no_doi (PSI-100), 1 no_publications (PSI-115). `meta/` yeni sütunlarla yeniden üretildi (0,76 MB). Negatif kontrol (5 + baz çizgisi): gevşetilmiş regex, düşürülen geçersiz yayın, missing→invalid, yanlış durum sayımı, eski şemalı meta/ hepsi yakalandı
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
