# 01 — M1: Keşif & Sıralama (Objective 1)

Mimari: [Architecture.md §2](../../Architecture.md) · Kod: `src/discovery/` · Testler: `tests/discovery/`

## Durum

- **İlerleme:** 0 / 21
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1 (genel sıra 3: 03 ve 05/E1, E3 ile birlikte; 00/C5 ve 00/D2 hazır)
- **Açık sorunlar:**
  - LLM adımları (A2, E1–E4) EVREN API anahtarını kök `.env`'den okur; EVREN kullanım şartları hesap sahibince onaylanmış olmalı.

## Hedef

Kullanıcı bir habitat seçer (ISS, keşif aracı, Ay/Mars üssü, gezgin araç). Sistem 24 investigation'ı **şeffaf bileşenli** bir skorla sıralar.
Her sıranın gerekçesi gösterilir ve kaynaklara atıf yapılır.


**LLM kuralları (A2, E1–E4):**
- Sağlayıcı: EVREN LLM API (OpenAI uyumlu). Varsayılan adres `https://evren-llmapi.ssyz.org.tr/v1`, varsayılan model `deepseek-v4.1-flash`; `.env`'de `LLM_BASE_URL` / `LLM_MODEL` ile değiştirilebilir.
- Anahtar: kök `.env` dosyasındaki `API_KEY` (gitignore'da; asla yazdırılmaz, commit edilmez). Ek paket yok (`requests`).
- **Bir kez üret → doğrula → kaydet.** Uygulama çalışırken LLM çağrılmaz; yayında anahtar gerekmez.
- Testler LLM'i mock'lar; yalnızca E4 gerçek API'yi çağırır.
- Düşünen model: `max_tokens` ≥ 4096 ya da `thinking: false`. 429/503'te `Retry-After` kadar beklenip tekrar denenir.
- Giden veri yalnızca kamuya açık PSI metinleridir. Kullanım şartlarının onayı hesap sahibine aittir (onaysız çağrı 403 döner).
---

## Faz A — Koşul zarfı (`inv_envelope`)

- [ ] **A1** Tablolardan zarf çıkarımı
  - Yap: Parquet tablosu olan investigation'lar için şu alanları çıkar:
    O2 min/max, basınç min/max, seyrelticiler, yakıt/malzeme sınıfı, akış, yerçekimi, olgu etiketleri. `source=table` olarak işaretle.
  - Test: `pytest tests/discovery/test_envelope.py::test_from_tables`
  - Kabul:
    - ACME O2 aralığı parquet tablosundaki min/max ile birebir aynı.
    - Hiçbir satırda min > max yok.
    - Birimler O2 için %, basınç için atm.
- [ ] **A2** Metinden zarf çıkarımı (tablosu olmayanlar için, LLM)
  - Yap: Parquet tablosu olmayan investigation'lar için (00/D4 `table_map`'te `coverage='none'`, bugün 9 investigation) amaç, yaklaşım ve etkiler metninden O2, basınç, seyreltici, yakıt/malzeme sınıfı, yerçekimi ve olgu etiketlerini LLM ile çıkar (`src/discovery/llm.py`, aşağıdaki LLM kuralları).
    Her değer için `source=text` olsun ve kaynak metinden **birebir alıntı** (`source_span`) saklansın.
  - Test: `pytest tests/discovery/test_envelope.py::test_text_spans`. LLM mock'lanır. Test, her `source_span` değerinin kaynak metinde birebir geçtiğini kontrol eder.
  - Kabul: Alıntısı kaynakta bulunmayan satır reddediliyor; çıktı bir kez üretilip kaydediliyor (A4 ile dışa aktarılır), uygulama LLM çağırmıyor.
- [ ] **A3** Metinden gelen zarfların kontrolü
  - Yap: Text kaynaklı bütün satırları kaynak metinle tek tek karşılaştır (geliştirici yapar; ekip üyesi rastgele birkaçını kontrol edebilir) ve sonucu `docs/evidence/envelope_review.md` dosyasına yaz.
  - Test: `pytest tests/discovery/test_envelope.py::test_review_evidence`
  - Kabul: Her text satırı için "doğru / düzeltildi / silindi" kararı yazılmış.
- [ ] **A4** Zarf tablosunun dışa aktarımı
  - Yap: `inv_envelope` tablosunu `meta.duckdb` içine yaz.
  - Test: `pytest tests/discovery/test_envelope.py::test_export`
  - Kabul: 24 investigation'ın hepsinde en az bir satır var (veri yoksa `unknown` bayrağı).

## Faz B — Habitat profilleri

- [ ] **B1** Preset dosyası
  - Yap: `src/discovery/habitats.yaml` dosyasını oluştur: ISS, keşif aracı atmosferi, Ay üssü, Mars üssü, basınçlı gezgin araç.
    Her değer için `source` alanında bir kaynak (URL veya DOI) olsun.
  - Test: `pytest tests/discovery/test_habitat.py::test_presets`
  - Kabul: Her değerin bir kaynağı var; Ay ve Mars için `partial_gravity: true`.
- [ ] **B2** `Habitat` veri modeli
  - Yap: pydantic modeli yaz: yerçekimi, basınç, O2, havalandırma, malzeme envanteri, senaryo metni.
    Fiziksel olmayan değerleri reddet (O2 aralığı 0–100, basınç > 0).
  - Test: `pytest tests/discovery/test_habitat.py::test_validation`
  - Kabul: Geçersiz girdilerde `ValidationError`; preset'lerin hepsi geçerli.

## Faz C — İlgililik skoru (her bileşen 0–1)

- [ ] **C1** c₁ Atmosfer örtüşmesi
  - Yap: Habitat (O2, p) noktasının zarfa normalize uzaklığını hesapla. Nokta zarfın içindeyse sonuç 1.
  - Test: `pytest tests/discovery/test_score.py::test_c1`
  - Kabul: İçerideki nokta → 1; uzaklaştıkça değer artmıyor (monoton); sonuç [0, 1] içinde.
- [ ] **C2** c₂ Malzeme eşleşmesi (Jaccard)
  - Test: `pytest tests/discovery/test_score.py::test_c2`
  - Kabul: Bilinen kümelerde beklenen değerler çıkıyor; boş envanterde sonuç 0 ve hata yok.
- [ ] **C3** c₃ Olgu eşleşmesi (TF-IDF kosinüs benzerliği)
  - Yap: Arayüzü yaz ve testte sahte bir benzerlik fonksiyonu kullan. Gerçek TF-IDF indeksi D3'te bağlanır (scikit-learn; model indirme ve ağ yok).
  - Test: `pytest tests/discovery/test_score.py::test_c3`
  - Kabul: Aynı metin → 1; sonuç [0, 1] içinde.
- [ ] **C4** c₄ Yerçekimi uygunluğu
  - Test: `pytest tests/discovery/test_score.py::test_c4`
  - Kabul:
    - µg habitat ile µg veri → 1.0.
    - Ay/Mars → 0.5 ve `warning="partial_gravity"`.
- [ ] **C5** c₅ Veri kullanılabilirliği
  - Yap: Şunlardan belgelenmiş bir formül kur: experimental table var mı, n, audit kalitesi. Video bilgisi kullanılmaz (her deneyin videosu yok; iptal 2026-11-14).
  - Test: `pytest tests/discovery/test_score.py::test_c5`
  - Kabul: Diğer her şey sabitken n arttıkça skor azalmıyor; sonuç [0, 1] içinde.
- [ ] **C6** Toplam skor ve ağırlıklar
  - Yap: Skor = Σ wᵢ·cᵢ; ağırlıklar normalize edilir. Çıktıda her bileşen ayrı döner.
  - Test: `pytest tests/discovery/test_score.py::test_total`
  - Kabul:
    - Ağırlıklar ayrı ayrı 0'a çekilince ilgili bileşenin etkisi kayboluyor.
    - Sıralama deterministik.
    - ISS preset'inde ilk 5 investigation içinde ACME veya FLEX var (sağlık kontrolü).
- [ ] **C7** Varsayılan ağırlıkların dokümantasyonu
  - Yap: Varsayılan ağırlıkları ve gerekçelerini `src/discovery/README.md` dosyasına yaz.
  - Test: `pytest tests/discovery/test_docs.py`. Test, README'deki ağırlıkların koddakilerle eşleştiğini kontrol eder.
  - Kabul: Değerler eşleşiyor.

## Faz D — Metin benzerliği (TF-IDF)

- [ ] **D1** Investigation metin belgeleri
  - Yap: Her investigation için tek bir metin belgesi: amaç, yaklaşım, etkiler, yayın başlıkları (metadata katmanından, `connect_meta()`).
    Her belgede `psi_id`, `doi` ve kaynak alanlar (`section`) tutulsun. Parçalama gerekmez (TF-IDF belge düzeyinde çalışır).
  - Test: `pytest tests/discovery/test_index.py::test_documents`
  - Kabul: 24 investigation'ın hepsi için belge var; boş belge yok; meta alanları dolu.
- ~~[ ] **D2** Lokal embedding ve FAISS indeksi~~ — **İPTAL (2026-11-14):** ağır embedding + FAISS yerine TF-IDF yeterli (C3, D1, D3); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: sentence-transformers ile embedding üret ve indeksi diske kaydet (`data_analysis/Nasa_data/meta/index/`).~~
  - ~~Test: `pytest tests/discovery/test_index.py::test_retrieval`~~
  - ~~Kabul: Bir parçanın kendi cümlesiyle sorgu yapılınca o parça ilk sırada dönüyor (rastgele 20 parçanın en az 19'unda).~~
- [ ] **D3** c₃'ü TF-IDF indeksine bağla (D1 belgeleri üzerinde)
  - Test: `pytest tests/discovery/test_score.py::test_c3_real`
  - Kabul: "duman algılama" senaryosu için PSI-101 (SAME) ilk 3 içinde.

## Faz E — RAG yorumu (alıntı zorunlu)

- [ ] **E1** Prompt ve çıktı şeması
  - Yap: LLM (`src/discovery/llm.py`) şu JSON'u döndürsün: `{"sentences":[{"text":..., "source_ids":[...]}], "sections":["neden ilgili","ana bulgular","sınırlar"]}`.
    `source_id` = D1 belgesindeki kaynak alan (`psi_id` + `section`, ör. `PSI-25:objective`).
  - Test: `pytest tests/discovery/test_rag.py::test_schema`. LLM mock'lanır.
  - Kabul: Şema doğrulanıyor; eksik bölüm varsa hata veriliyor.
- [ ] **E2** Alıntı doğrulayıcı
  - Yap:
    - Geçerli bir `source_id` taşımayan cümleyi sil.
    - Cümledeki bir sayı alıntılanan kaynakta geçmiyorsa cümleyi sil.
  - Test: `pytest tests/discovery/test_rag.py::test_validator`. Testte elle hazırlanmış 10 iyi ve 10 kötü örnek kullanılır.
  - Kabul: Kötü örneklerin 10'u da siliniyor; iyi örneklerin 10'u da kalıyor.
- [ ] **E3** Uçtan uca test (mock LLM)
  - Yap: Habitat → skor → ilk k investigation → RAG kartları akışını test et.
  - Test: `pytest tests/discovery/test_pipeline.py`
  - Kabul: Her kartta en az 1 alıntılı cümle ve DOI var.
- [ ] **E4** Gerçek LLM ile üretim ve duman testi
  - Yap: Gerçek API (EVREN, varsayılan `deepseek-v4.1-flash`) ile kartlar bir kez üretilir, E2 ile doğrulanır ve kaydedilir; uygulama kayıtlı kartları okur.
    Örnek bir habitatın çıktısı, kullanılan model ve token kullanımı `docs/evidence/m1_live_sample.md` dosyasına yazılır.
  - Test: `pytest tests/discovery/test_pipeline.py::test_live_evidence`
  - Kabul: Kanıt dosyası var; doğrulayıcının sildiği cümle oranı raporlanmış; kayıtlı kartlar E1 şemasına uyuyor.

## Faz F — Servis arayüzü

- [ ] **F1** `rank(habitat) -> list[RankedInvestigation]` fonksiyonu
  - Yap: Uygulamanın Keşif sayfasının (05/E1) çağıracağı saf Python fonksiyonu; içinde Streamlit bağımlılığı olmamalı.
  - Test: `pytest tests/discovery/test_api.py`
  - Kabul: Dönen nesnede bileşen dökümü, uyarılar ve zarf verisi (grafik için) var.
- [ ] **F2** Plan ve durum güncellemesi
  - Test: `pytest tests/discovery/test_plan_status.py`
  - Kabul: İşaretli kutu sayısı ile Durum satırındaki sayı tutarlı.
