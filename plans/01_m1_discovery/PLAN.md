# 01 — M1: Keşif & Sıralama (Objective 1)

Mimari: [Architecture.md §2](../../Architecture.md) · Kod: `src/discovery/` · Testler: `tests/discovery/`

## Durum

- **İlerleme:** 0 / 22
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1 (önce 00/C5 ve 00/D2 tamamlanmalı)
- **Açık sorunlar:** —

## Hedef

Kullanıcı bir habitat seçer (ISS, keşif aracı, Ay/Mars üssü, gezgin araç). Sistem 24 investigation'ı **şeffaf bileşenli** bir skorla sıralar.
Her sıranın gerekçesi gösterilir ve kaynaklara atıf yapılır.

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
- [ ] **A2** Metinden zarf çıkarımı (tablosu olmayanlar için)
  - Yap: LLM ile çıkarım yap. Her değer için `source=text` olsun ve kaynak metinden **birebir alıntı** (`source_span`) saklansın.
  - Test: `pytest tests/discovery/test_envelope.py::test_text_spans`. LLM mock'lanır. Test, her `source_span` değerinin kaynak metinde birebir geçtiğini kontrol eder.
  - Kabul: Alıntısı kaynakta bulunmayan satır reddediliyor.
- [ ] **A3** Metinden gelen zarfların elle kontrolü
  - Yap: Text kaynaklı bütün satırları gözle kontrol et ve sonucu `docs/evidence/envelope_review.md` dosyasına yaz.
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
- [ ] **C3** c₃ Olgu eşleşmesi (embedding kosinüs benzerliği)
  - Yap: Arayüzü yaz ve testte sahte bir embedder kullan. Gerçek embedder D2'de bağlanır.
  - Test: `pytest tests/discovery/test_score.py::test_c3`
  - Kabul: Aynı metin → 1; sonuç [0, 1] içinde.
- [ ] **C4** c₄ Yerçekimi uygunluğu
  - Test: `pytest tests/discovery/test_score.py::test_c4`
  - Kabul:
    - µg habitat ile µg veri → 1.0.
    - Ay/Mars → 0.5 ve `warning="partial_gravity"`.
- [ ] **C5** c₅ Veri kullanılabilirliği
  - Yap: Şunlardan belgelenmiş bir formül kur: experimental table var mı, n, audit kalitesi, video var mı.
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

## Faz D — Embedding + vektör indeksi

- [ ] **D1** Parçalayıcı (chunker)
  - Yap: Kaynaklar: amaç, yaklaşım, etkiler, yayın başlıkları, REPORT.md bulguları. Metni ~300 token'lık parçalara böl.
    Her parçada `chunk_id`, `psi_id`, `doi` ve `section` tutulsun.
  - Test: `pytest tests/discovery/test_index.py::test_chunker`
  - Kabul: Parçaların hiçbiri 400 token'dan uzun değil; meta alanları boş değil; `chunk_id` benzersiz.
- [ ] **D2** Lokal embedding ve FAISS indeksi
  - Yap: sentence-transformers ile embedding üret ve indeksi diske kaydet (`data_analysis/Nasa_data/meta/index/`).
  - Test: `pytest tests/discovery/test_index.py::test_retrieval`
  - Kabul: Bir parçanın kendi cümlesiyle sorgu yapılınca o parça ilk sırada dönüyor (rastgele 20 parçanın en az 19'unda).
- [ ] **D3** c₃'ü gerçek embedder'a bağla
  - Test: `pytest tests/discovery/test_score.py::test_c3_real`
  - Kabul: "duman algılama" senaryosu için PSI-101 (SAME) ilk 3 içinde.

## Faz E — RAG yorumu (alıntı zorunlu)

- [ ] **E1** Prompt ve çıktı şeması
  - Yap: LLM şu JSON'u döndürsün: `{"sentences":[{"text":..., "chunk_ids":[...]}], "sections":["neden ilgili","ana bulgular","sınırlar"]}`.
  - Test: `pytest tests/discovery/test_rag.py::test_schema`. LLM mock'lanır.
  - Kabul: Şema doğrulanıyor; eksik bölüm varsa hata veriliyor.
- [ ] **E2** Alıntı doğrulayıcı
  - Yap:
    - Geçerli bir `chunk_id` taşımayan cümleyi sil.
    - Cümledeki bir sayı alıntılanan parçada geçmiyorsa cümleyi sil.
  - Test: `pytest tests/discovery/test_rag.py::test_validator`. Testte elle hazırlanmış 10 iyi ve 10 kötü örnek kullanılır.
  - Kabul: Kötü örneklerin 10'u da siliniyor; iyi örneklerin 10'u da kalıyor.
- [ ] **E3** Uçtan uca test (mock LLM)
  - Yap: Habitat → skor → ilk k investigation → RAG kartları akışını test et.
  - Test: `pytest tests/discovery/test_pipeline.py`
  - Kabul: Her kartta en az 1 alıntılı cümle ve DOI var.
- [ ] **E4** Canlı LLM duman testi
  - Yap: Gerçek API ile tek bir habitat çalıştır ve çıktıyı `docs/evidence/m1_live_sample.md` dosyasına kaydet.
  - Test: `pytest tests/discovery/test_pipeline.py::test_live_evidence`
  - Kabul: Kanıt dosyası var; doğrulayıcının sildiği cümle oranı raporlanmış.

## Faz F — Servis arayüzü

- [ ] **F1** `rank(habitat) -> list[RankedInvestigation]` fonksiyonu
  - Yap: Backend'in (05/C1) çağıracağı saf Python fonksiyonu; içinde Streamlit veya FastAPI bağımlılığı olmamalı.
  - Test: `pytest tests/discovery/test_api.py`
  - Kabul: Dönen nesnede bileşen dökümü, uyarılar ve zarf verisi (grafik için) var.
- [ ] **F2** Plan ve durum güncellemesi
  - Test: `pytest tests/discovery/test_plan_status.py`
  - Kabul: İşaretli kutu sayısı ile Durum satırındaki sayı tutarlı.
