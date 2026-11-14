# 03 — M3: Ekipman İçgörüsü (Objective 3)

Mimari: [Architecture.md §4.1](../../Architecture.md) · Kod: `src/insight/` · Testler: `tests/insight/`
FlameSense cihazı ayrı bir konudur: [04_flamesense](../04_flamesense/PLAN.md).

## Durum

- **İlerleme:** 0 / 14
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1 (A1–A4 hemen başlayabilir; yalnızca EDA çıktılarına ihtiyaç duyar)
- **Açık sorunlar:**
  - Architecture §4.1'deki duman medyanı "0.12–0.28 µm" yazıyor. Flight verisinde değer 0.12–0.30 µm.
    A2 sayıları otomatik çektiği için bu fark kartlarda kendiliğinden düzelecek. Architecture metnini düzeltmek ekibin kararı.

## Hedef

Her bulgu **kanıtıyla birlikte** bir ekipman sınıfına bağlanır (veri seti, n, istatistik, %95 GA, DOI, güven düzeyi A/B/C).
Kartlardaki sayılar elle yazılmaz; analiz çıktılarından otomatik çekilir.

---

## Faz A — Bulgu kartları

- [ ] **A1** Kart şeması
  - Yap: pydantic veya JSON şeması:
    `iddia | sayı | kanıt (veri seti, n, istatistik, %95 GA) | DOI | güven (A/B/C) | ekipman sınıfı | habitat | Dünya uygulaması | sınırlar`
  - Test: `pytest tests/insight/test_cards.py::test_schema`
  - Kabul: Kanıtı veya DOI'si olmayan kart reddediliyor; güven değeri yalnızca A, B veya C olabiliyor.
- [ ] **A2** Sayıların otomatik çekilmesi
  - Yap: Kart sayıları `analysis/outputs/group_effects_numbers.json`, `assoc_*.csv` gibi dosyalardan bir **kaynak yolu** ile alınsın (ör. `group_effects_numbers.json:flex.d2_slope`).
  - Test: `pytest tests/insight/test_cards.py::test_traceability`
  - Kabul: Her karttaki her sayı, kaynak yolundaki değerle birebir aynı. Elle yazılmış sayı içeren kart testi geçemiyor.
- [ ] **A3** Güven düzeyi kuralı
  - Yap: Kurallar:
    - **A**: fiziksel olarak doğrulanmış ve n ≥ 100.
    - **B**: FDR < 0.05 ve etki ≥ 0.3.
    - **C**: diğerleri.
    Güven düzeyi bu kurallarla hesaplanır, elle yazılmaz.
  - Test: `pytest tests/insight/test_cards.py::test_confidence`
  - Kabul: Sınır değerlerde doğru seviye çıkıyor.
- [ ] **A4** Architecture §4.1'deki 5 ekipman satırını kart olarak üret
  - Yap: Satırlar: algılama (duman çapı), söndürme (FLEX CO2/O2), atmosfer kontrolü (ACME O2), malzeme seçimi (BASS-II geometri), havalandırma.
  - Test: `pytest tests/insight/test_cards.py::test_core_cards`
  - Kabul:
    - 5 kart var.
    - Duman kartındaki aralık veriden geliyor (beklenen değer ≈ 0.12–0.30 µm).
    - Smoke kartında Simpson uyarısı "sınırlar" alanında yazıyor.
- [ ] **A5** Veri boşluğu kartları
  - Yap: Boşluklar: su sisi yok, kısmi yerçekimi yok, mikrogravite yayılma hızı tablosu yok.
    Her iddia metadata üzerinde bir sorguyla doğrulanır (ör. dosya adlarında "mist" geçmiyor).
  - Test: `pytest tests/insight/test_cards.py::test_gap_cards`
  - Kabul: Her boşluk kartının doğrulama sorgusu kodda var ve boş sonuç dönüyor.

## Faz B — Ekipman eşleme

- [ ] **B1** Ekipman sınıfı taksonomisi
  - Yap: `src/insight/equipment.yaml`: algılama, söndürme, atmosfer kontrolü, malzeme seçimi, havalandırma. Gerekirse genişletilir.
  - Test: `pytest tests/insight/test_mapping.py::test_taxonomy`
  - Kabul: Her kart en az 1 sınıfa bağlı; hiçbir sınıf boş değil (boşsa veri boşluğu kartıyla işaretlenmiş).
- [ ] **B2** M1 sıralamasıyla bağlantı
  - Yap: Her ekipman sınıfı için en ilgili investigation'lar, M1'in `rank()` fonksiyonuyla bulunur.
  - Test: `pytest tests/insight/test_mapping.py::test_m1_link`. M1 hazır değilse sahte bir sıralayıcıyla test edilir; kutu için gerçek sıralayıcı gerekir.
  - Kabul: Her sınıfın listesi boş değil ve DOI içeriyor.
- [ ] **B3** Dünya uygulaması eşlemesi
  - Yap: Örnekler: duman dedektörleri, gazlı söndürme, hastane/evde oksijen, bina malzemeleri, denizaltı/maden/uçak.
  - Test: `pytest tests/insight/test_mapping.py::test_earth`
  - Kabul: Her kartta en az 1 Dünya uygulaması var.
- [ ] **B4** Habitat filtresi
  - Yap: Kartlar seçilen habitata göre filtrelenip sıralanabilsin (ör. Ay/Mars için kısmi yerçekimi uyarısı öne çıksın).
  - Test: `pytest tests/insight/test_mapping.py::test_habitat_filter`
  - Kabul: Ay/Mars seçilince kısmi yerçekimi boşluk kartı ilk sırada.

## Faz C — M2 sonuçlarının entegrasyonu

- [ ] **C1** Model kaynaklı bulgular
  - Yap: M2 modellerinden yön bilgisi çıkar (ör. kısmi bağımlılık veya monoton etki) ve bunları kart olarak ekle.
  - Test: `pytest tests/insight/test_model_cards.py::test_direction`
  - Kabul: Modelden çıkan yönler EDA'daki yönlerle uyumlu. Uyumsuzluk varsa kart C seviyesine iniyor ve "sınırlar" alanında açıklanıyor.
- [ ] **C2** Belirsizlik bilgisi
  - Yap: Model kaynaklı kartlarda conformal aralık ve AD kapsam bilgisi gösterilsin.
  - Test: `pytest tests/insight/test_model_cards.py::test_uncertainty_fields`
  - Kabul: Aralık alanları dolu.

## Faz D — Dışa aktarım ve servis

- [ ] **D1** JSON ve markdown çıktıları
  - Yap: `insight/cards.json` (dashboard için) ve `insight/CARDS.md` (okunabilir özet) dosyalarını üret.
  - Test: `pytest tests/insight/test_export.py`
  - Kabul: JSON şemaya uyuyor; markdown'daki kart sayısı JSON'daki ile eşit.
- [ ] **D2** `get_cards(habitat=None, equipment=None)` fonksiyonu (backend 05/C3 için)
  - Test: `pytest tests/insight/test_export.py::test_api`
  - Kabul: Filtreler çalışıyor; sonuç deterministik.
- [ ] **D3** Plan ve durum güncellemesi
  - Test: `pytest tests/insight/test_plan_status.py`
  - Kabul: Sayılar tutarlı.
