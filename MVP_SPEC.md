# MVP_SPEC — Flame in Freefall

Son güncelleme: 2026-11-15. Bu belge `.orchestrator/decisions.md` kararlarına dayanır; çelişirse decisions.md geçerlidir. Uygulama adımları: `plans/mvp/PLAN.md`.

## 1. Ürün tanımı

Flame in Freefall, NASA Physical Sciences Informatics (PSI) yanma deneylerini (24 investigation) Ay/Mars habitat yangın güvenliği çerçevesinde keşfetmeyi, sıralamayı, bilinen yakıt/seyreltici koşulları için damla yanma hızını tahmin etmeyi ve ekipman içgörülerine çevirmeyi sağlayan, yerelde tek komutla çalışan koyu temalı bir web demosudur; ziyaretçi sitedeki kartlara dayanarak canlı soru da sorabilir.

## 2. 3 dakikalık demo senaryosu

| Süre | Ekran | Gösterilen |
|---|---|---|
| 0:00–0:20 | Açılış (Explore) | Tek komutla sunucu açılır. 24 investigation, "habitat relevance" skoruna göre sıralı; skorun nedeni (bileşenleri) satırda görünür. |
| 0:20–1:00 | Explore detay | Bir investigation seçilir: koşul zarfı (O2, basınç, akış, malzeme), DOI atfı, ön üretilmiş özet metin. |
| 1:00–1:45 | Scenario | FLEX (PSI-69) için yakıt, seyreltici, O2, basınç, damla çapı seçilir; tarayıcıda tahmini yanma hızı K (mm²/s) anında değişir. Ekranda grup-dışı (GroupKFold) skor ve "yalnızca bilinen yakıt/seyreltici için" uyarısı görünür. |
| 1:45–2:15 | Equipment | DOI atıflı içgörü kartları: FLEX d² eğimi 2.12, ACME %20.5–21.5 O2'de bütan/propan sıcak tutuşma oranı 0.59 (20/34), smoke Simpson paradoksu, BASS-II ΔCO2/ΔO2 = −0.80. |
| 2:15–2:40 | Ask (LLM) | Ziyaretçi "Which fuel should a Mars habitat worry about?" gibi soru sorar; cevap kartlardan beslenir. (Anahtar yoksa arayüz kartlara düşer.) |
| 2:40–3:00 | Live (FlameSense) | "Concept / not built" etiketli konsept sayfası: render görselleri ve ne planlandığı. |

## 3. MVP kapsamı

| Modül | İçinde | Dışında |
|---|---|---|
| Arayüz | Ekip arkadaşının `design/dashboard/` sitesi `app/` içine taşınır; Halo teması korunur; yalnız İngilizce | Sıfırdan arayüz, TR dil, yeni tema |
| M1 Keşif & Sıralama | 24 investigation, koşul zarfı + ön üretilmiş metin, açıklanabilir ağırlıklı skor | TF-IDF/semantik arama, kullanıcı ağırlık ayarı |
| M2 Tahmin | FLEX `burn_rate_K_mm2_s`, Ridge, GroupKFold, leakage dışarıda, tarayıcıda what-if (katsayı veya ızgara) | cfi, acme, smoke, bass2 modelleri; belirsizlik aralığı; kNN; sunucu tarafı model |
| M3 Ekipman | 4 sayı kaynaklı bulgu için DOI atıflı kartlar | Yeni EDA, ek bulgu |
| Malzeme risk indeksi (Faz 2) | Kapatılmış PR #7'deki risk motoru (yazar: sametozantopcu) `src/risk/` altında; Scenario ekranında bağıl indeks, 6 bileşen, her bileşen için dayanak etiketi (data/literature/assumption/mixed), ön hesaplanmış ızgara (O2 15–40 %, 51 değer × 14 basınç × 11 malzeme) | Mutlak yangın olasılığı, kalibrasyon, kullanıcı ayarlı ağırlıklar, yerçekimi/akış girdisi |
| FlameSense | Render görselleri (küçültülmüş) + konsept metni, "concept / not built" | Simülasyon, donanım, canlı sensör, MQTT |
| LLM soru-cevap | Yerel Python sunucusu `/api/ask`, EVREN API, statik kart bağlamı (en fazla ~2000 karakter; sıralama, risk ve FlameSense parçaları soruya göre eklenir), bir yeniden deneme, kartlara zarif düşüş | Sohbet geçmişi, akış (streaming), kaynak alıntı doğrulama |
| Teslim | Yerel demo, tek komut | Deploy, video/mp4 (ekip çeker), teslim kuralları adımı (sonra sorulacak) |

## 4. Kritik yol

Ayrıntı ve kabul testleri `plans/mvp/PLAN.md` içindedir.

```
S1 (taşıma) ─┐
S2 (model)  ─┤
S3 (sıralama)┼─> S5 (build_site_data) ─> S6 (Explore+Scenario UI) ─┐
S4 (içgörü) ─┘                         ├> S7 (Equipment+Live UI)  ├─> S9 (doküman temizliği + uçtan uca)
                                       └> S8 (sunucu + LLM)       ┘
```

- Paralel grup A: S1, S2, S3, S4 (farklı dosyalar). Paralel grup B: S6, S7, S8 (S5 ve S1 bittikten sonra).
- Seri toplam yaklaşık 4,4 saat; paralel çalışmada duvar saati yaklaşık 2,5 saat.
- Kritik yol: S1/S2 → S5 → S6 → S9.
- Süre biterse kesme sırası: (1) S9'daki doküman cilası (yalnız Architecture.md + CLAUDE.md kalsın), (2) S8 LLM (statik kartlarla demo), (3) S7 Live görselleri (metin yeter), (4) S3 skor bileşenlerinin UI'da gösterilmesi, (5) S6'da Scenario ızgarası yerine tek tahmin. S1, S2, S5, S6 kesilmez.

## 5. Mimari

```
app/                      # statik site (eski Streamlit dosyaları silinir)
  index.html, app.js, config.js, i18n.js (yalnız EN), core/, ui/, views/, assets/
  assets/flamesense/*.jpg # küçültülmüş render görselleri
  data/site_data.js       # window.FF.site = {...}  (build çıktısı; sunucusuz file:// için)
  data/site_data.json     # aynı içerik (sunucu LLM bağlamı için)
  server.py               # stdlib http.server: statik dosyalar + POST /api/ask
scripts/build_site_data.py  # tek veri köprüsü
src/data_layer/           # (var) Feature Store / Metadata
src/discovery/            # (var) envelope, llm istemcisi; + ranking.py
src/prediction/           # (var) datasets; + flex_model.py
src/insight/cards.py      # M3 kartları
tests/                    # mevcut set + yeni hafif testler
```

Başlatma: `/home/halil/miniconda3/envs/nasa_hack/bin/python app/server.py` (varsayılan http://127.0.0.1:8000). `.env` içindeki `API_KEY` yalnızca sunucu tarafında okunur; tarayıcıya ve commit'e girmez. Modüller veriyi yalnızca Feature Store/Metadata katmanından okur; build betiği dışında veri okuyan kod yoktur. Yeni paket gerekmez (stdlib + mevcut pandas/sklearn/duckdb).

## 6. Veri

| Kaynak | Tablo | Hedef | Grup sütunu | DOI |
|---|---|---|---|---|
| Metadata + envelope | `meta/investigations`, `inv_envelope_text` | 24 investigation zarfı | n/a | investigation başına (meta/investigations) |
| M2 | `flex` (PSI-69, n=274) | `burn_rate_K_mm2_s` | fuel×diluent (6); ikincil year (3) | 10.60555/mbq8-0451 |
| M3 | `flex`, `acme_normal`, `smoke`, `bass2` + `group_effects_numbers.json` | sayı kaynaklı bulgular | n/a | PSI-69 10.60555/mbq8-0451; PSI-159 10.60555/cyt1-kh64; PSI-101 10.60555/2np7-jv14; PSI-25 10.60555/4qc4-de67 |

M2 özellikleri: `d0_mm, p_atm, x_o2, x_he, x_co2, fuel, diluent` (yalnızca `role=feature`; `test_end`, `d_ext` gibi sızıntı sütunları dışarıda). Referans skorlar (güncel ölçüm, `fit_flex()`): fuel×diluent GroupKFold Ridge R²≈0.373 (fold'lar arası varyans yüksek); year GroupKFold Ridge R²≈0.567; n=258. Ekranda ikisi de gösterilir; birincil ve kısıtlayıcı olan fuel×diluent'tir.

## 7. Dürüstlük ve sınırlar

- Tahmin yalnızca FLEX'te bilinen yakıt/seyreltici kombinasyonları (heptane/methanol × N2/CO2/He) için geçerlidir; yeni kombinasyona genelleme zayıftır (grup-dışı R²≈0.373, fold'lar arası varyans yüksek). Ekranda görünür.
- Kısmi yerçekimi (Ay/Mars g) verisi yoktur; yalnızca flight (mikro-g) ve ground (1 g). Hiçbir yerde kısmi-g tahmini iddia edilmez. "Habitat relevance" yalnızca atmosfer (O2, basınç, akış) örtüşmesine dayanır, yerçekimine değil.
- n küçük (274 satır, 3–6 grup); skorlar yüksek varyanslıdır.
- Eksik değerler `null` kalır, asla 0 yapılmaz; ara tablolarda `psi_id`, `source_file`, `source_row` korunur.
- Her veri kaynağı DOI ile atıflanır.
- Habitat skoru bir önceliklendirme yardımcısıdır, güvenlik sertifikasyonu değildir.
- FlameSense yalnızca konsepttir; cihaz yapılmadı, ölçüm yok.
- LLM cevapları yalnızca verilen kartlara dayanmalıdır; bağlam dışı soruda "not in the cards" denir.
- `data_analysis/Nasa_data/raw/` ve `csv/` değiştirilmez.
- Malzeme risk indeksi bağıl bir ölçektir: 0 = %21 O2 / 1 atm, 100 = %40 O2. Mutlak yangın olasılığı değildir.
- Bileşen ağırlıkları (0.15/0.25/0.15/0.10/0.25/0.10) ve 35/65 seviye eşikleri kalibre edilmemiş varsayımdır.
- Yalnızca PMMA'nın sınır O2 değeri (%13.5) ISS/BASS-II (PSI-25) verisindendir; diğer malzemeler literatür LOI değerlerinden türetilmiştir.
- Yerçekimi ve akış hızı indeksin girdisi değildir; Ay/Mars yerçekimi modellenmez. İndeks FLEX modelinden bağımsızdır.
- Yayılma bileşeni (PSI-39) çok zayıf bir uyumdur: R² 0.044 (n=74). Feature Store üzerinde yeniden uyumda üs 0.319 (n=66, R² 0.030); gömülü üs 0.454 (n=74). Motor gömülü değeri kullanır; ikisi de dayanak tablosunda gösterilir.
- İndeks 0, "yanmaz" demek değildir (0 = "Dünya havası kadar riskli"). Bu yüzden ekranda ayrı bir "Flammable at this condition?" okuması vardır (O2 − malzemenin sınır O2'si).
- spice `flame_duration` aykırıları (max 86394 s) ve ground eşlemesi doğrulanmadığı için kullanılmaz.

## 8. Sonra (MVP dışı)

- cfi (`k_hot_mm2_s`) modeli ve CFI ek hedefleri.
- acme `hot_ignition` sınıflandırıcısı.
- Tahmin belirsizlik aralığı ve uygulanabilirlik alanı (AD/kNN).
- Kullanıcı ayarlı sıralama ağırlıkları.
- TF-IDF/semantik arama.
- Türkçe dil desteği.
- Gerçek FlameSense donanımı, sensör akışı, MQTT.
- Deploy (public demo linki).
- Teslim kuralları ve proje sayfası adımı (kullanıcıya sonra sorulacak).
- Tanıtım videosu (ekip çekecek).
- LLM cevaplarında alıntı doğrulama ve sohbet geçmişi.
- Kısmi yerçekimi verisi bulunursa g-bağımlı analiz.
