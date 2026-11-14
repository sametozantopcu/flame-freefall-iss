# PLAN — MVP (tek iş paketi)

Kapsam ve gerekçe: `MVP_SPEC.md`. Karar kaynağı: `.orchestrator/decisions.md`.
Python: yalnızca `/home/halil/miniconda3/envs/nasa_hack/bin/python` (aşağıda `$PY`). Yeni paket kurulumu YOK.

## Durum

- İlerleme: 8/9 (S1–S8 tamam)
- Son güncelleme: 2026-11-14 (S5–S8 doğrulandı; FLEX p_atm=0 satırı eksik sayıldı)
- Sıradaki adım: S9
- Açık sorunlar: bkz. "Açık noktalar"; EVREN ucu canlı denemede 90/170 sn ReadTimeout verdi (fallback çalışıyor).

## Kritik yol ve paralellik

- Grup A (paralel, farklı dosyalar): S1, S2, S3, S4.
- S5: S2, S3, S4 bittikten sonra (yalnız `scripts/build_site_data.py` ve `app/data/*`).
- Grup B (paralel): S6 (`app/views/explore.js`, `scenario.js`, `app/core/data.js`), S7 (`app/views/equipment.js`, `live.js`, `app/assets/flamesense/`), S8 (`app/server.py`, `app/ui/ask.js`). Her biri S1 ve S5'e bağlı.
- S9: hepsinden sonra.
- Kritik yol: S1/S2 → S5 → S6 → S9. Seri toplam ≈ 4,4 saat; paralel ≈ 2,5 saat.
- Kesme sırası: S9 cila, S8 LLM, S7 görseller, S3 UI'da bileşen gösterimi, S6 ızgara (tek tahmin yeter). S1, S2, S5, S6 kesilmez.
- Aynı dosyaya dokunan adımlar paralel değildir: `app/index.html`, `app/app.js`, `app/i18n.js` yalnız S1 tarafından değiştirilir (S1 diğer adımların ihtiyaç duyacağı `<script>` etiketlerini ve bağlantı noktalarını önceden ekler).

## Adımlar

- [x] **S1 · Siteyi app/ içine taşı, eski Streamlit'i temizle, yalnız EN**
  ✔ 2026-11-14 · pytest tests/delivery/test_app_layout.py + node --check app/**/*.js + pytest tests -m "not needs_raw and not slow and not live" · 4 passed; JS temiz; 628 passed, 6 deselected
  - Amaç: `design/dashboard/` içeriği `app/` kök dizinine gelir; eski Streamlit dosyaları gider; tek dil (EN); sonraki adımlar için bağlantı noktaları hazır.
  - Dokunulacak dosyalar: `app/**` (eski `*.py` silinir, dashboard dosyaları `git mv` ile gelir), `app/index.html`, `app/app.js`, `app/i18n.js`, `.streamlit/` (silinir), `tests/data_layer/test_no_raw_access.py` (`app/` varlığı ve "≥20 dosya" varsayımı), `.github/workflows/tests.yml` ve kök `requirements.txt` (yalnız streamlit/plotly referansı varsa), `design/dashboard/` (taşındıktan sonra silinir; `design/flamesense_box/` kalır).
  - Girdi: `design/dashboard/**`; `.orchestrator/reports/design.md` §2, §7.
  - Çıktı: `app/index.html` açılır, dört ekran (Explore, Scenario, Equipment, Live) mock veriyle çalışır; `?lang=tr` yok; `index.html` içinde `data/site_data.js` ve `ui/ask.js` için etiketler (dosya yoksa 404 zararsız; `app.js` yokluğa dayanıklı) ve `window.FF.mountAsk` bağlantı noktası. Hardcode Türkçe kalmaz (dosya adları kesif/senaryo/ekipman/canli kalabilir; S6/S7 yeniden adlandırabilir ama yalnız kendi dosyalarını).
  - Kabul testi: `for f in $(find /home/halil/repos/flame-freefall-iss/app -name '*.js'); do node --check $f || exit 1; done && test ! -e /home/halil/repos/flame-freefall-iss/app/streamlit_app.py && ! grep -rniE 'streamlit|plotly' /home/halil/repos/flame-freefall-iss/app && cd /home/halil/repos/flame-freefall-iss && $PY -m pytest tests -x -q -m "not needs_raw and not slow and not live"` (hepsi geçmeli; test sayısı 610 civarı, `app/` ile ilgili testler JS dizinine göre güncellenmiş olmalı).
  - Bağımlılıklar: yok.
  - Tahmini süre: 30 dk.

- [x] **S2 · M2 FLEX modeli: GroupKFold + dışa aktarım**
  ✔ 2026-11-14 · $PY -m pytest tests/prediction/test_flex_model.py -q · 5 passed; CV R² fuel×diluent 0.365, year 0.564, n=258
  - Amaç: `flex` / `burn_rate_K_mm2_s` için Ridge modeli; GroupKFold skorları; tarayıcıda hesaplanabilir katsayılar ve küçük ızgara.
  - Dokunulacak dosyalar: `src/prediction/flex_model.py` (yeni), `tests/prediction/test_flex_model.py` (yeni).
  - Girdi: `src.data_layer.frame.get_modeling_frame("flex", "burn_rate_K_mm2_s")`, `src.data_layer.features.get_features` (leakage otomatik dışarıda; ham parquet/CSV okunmaz). Özellikler: `d0_mm, p_atm, x_o2, x_he, x_co2, fuel, diluent`.
  - Çıktı: `fit_flex() -> dict` ile: `coef` (standardize ve one-hot sütun adları, ortalama/ölçek, intercept), `cv` (grup=fuel×diluent R²/MAE ve grup=year R²/MAE, GroupKFold), `features`, `leakage_excluded` (liste), `known_combos` (fuel×diluent çiftleri ve eğitim aralıkları: d0, p, x_o2), `grid` (isteğe bağlı küçük ızgara; katsayılar yetiyorsa yok), `n`, `doi`. Eksik hedef satırları atılır (0 yapılmaz); özellik eksikleri yalnız Pipeline içinde median imputer ile CV içinde doldurulur ve ihraç edilen modelde aynı imputer değerleri `impute` alanında yer alır. Birincil skor fuel×diluent; year ikincil.
  - Kabul testi: `$PY -m pytest /home/halil/repos/flame-freefall-iss/tests/prediction/test_flex_model.py -q` (testler: GroupKFold gruplarının ayrık olması; özellik listesinde leakage sütunu olmaması; `cv.fuel_diluent.r2` sonlu ve < `cv.year.r2` ya da en azından rapor değerinden ±0.1 içinde; JS'de yeniden hesaplanabilecek tahmin = katsayılardan numpy ile hesaplanan tahmin `predict` ile ±1e-6 aynı).
  - Bağımlılıklar: yok (S1 ile paralel).
  - Tahmini süre: 35 dk.

- [x] **S3 · M1 sıralama skoru**
  ✔ 2026-11-14 · $PY -m pytest tests/discovery/test_ranking.py -q · 9 passed (tests/discovery toplam 151 passed)
  - Amaç: 24 investigation için basit, açıklanabilir "habitat relevance" skoru (bileşenleriyle).
  - Dokunulacak dosyalar: `src/discovery/ranking.py` (yeni), `tests/discovery/test_ranking.py` (yeni).
  - Girdi: `src/discovery/envelope.py` çıktısı (`envelope_from_tables`) ve `meta/inv_envelope_text.parquet` (önce sütun adlarını `$PY` ile doğrula; `investigations.parquet` DOI için).
  - Çıktı: `rank_investigations() -> DataFrame` sütunlar: `psi_id`, `score` (0–100), bileşenler, `rationale` (tek cümle İngilizce, bileşenlerden şablonla üretilir). Bileşenler (ağırlıklar dosya başında sabit): O2 aralığının habitat kabin aralığıyla örtüşmesi (örn. 17–35 %), basınç örtüşmesi (56–101 kPa), düşük akış (≤20 cm/s) örtüşmesi, flight (mikro-g) verisi var mı, katı malzeme var mı, veri hacmi (log satır sayısı). Zarf değeri eksikse bileşen `null` olur ve skor mevcut bileşenlerin ağırlıklarıyla yeniden normalize edilir; `n_components_known` raporlanır (eksik 0 sayılmaz). Yerçekimi bileşeni yoktur.
  - Kabul testi: `$PY -m pytest /home/halil/repos/flame-freefall-iss/tests/discovery/test_ranking.py -q` (24 satır; skorlar [0,100]; eksik bileşen `null`; aynı girdi aynı çıktı; tüm bileşenler eksik olan satır skor `null`, 0 değil; DOI sütunu dolu veya `null`).
  - Bağımlılıklar: yok (paralel).
  - Tahmini süre: 30 dk.

- [x] **S4 · M3 içgörü kartları**
  ✔ 2026-11-14 · $PY -m pytest tests/insight/test_cards.py -q · 5 passed
  - Amaç: 4 sayı kaynaklı bulgu için DOI atıflı kart verisi.
  - Dokunulacak dosyalar: `src/insight/__init__.py`, `src/insight/cards.py` (yeni), `tests/insight/test_cards.py` (yeni).
  - Girdi: `data_analysis/Nasa_data/analysis/outputs/group_effects_numbers.json` ve ilgili `outputs/*.csv|json` (yalnız okuma; sayıları yeniden hesaplamak gerekmez), `data_analysis/Nasa_data/analysis/REPORT.md` bölüm 6.2/6.1/1/6.4, DOI için `meta/investigations.parquet`.
  - Çıktı: `build_cards() -> list[dict]` alanlar: `id`, `title`, `finding` (İngilizce), `value` (sayı kaynağından okunur; sabit kodlanmaz), `unit`, `n`, `psi_id`, `doi`, `source_file`, `caveat`, `equipment_implication`. Kartlar: FLEX d² eğimi (2.12, GA 1.76–2.52, n=27); ACME %20.5–21.5 O2'de bütan/propan sıcak tutuşma oranı 0.59 (20/34), PSI-159; smoke Simpson paradoksu (ρ −0.27 → kısmi +0.49); BASS-II ΔCO2/ΔO2 (−0.80, teorik −0.83). Değer dosyada bulunamazsa o kart `value: null` ve `caveat`'te belirtilir, 0 yazılmaz.
  - Kabul testi: `$PY -m pytest /home/halil/repos/flame-freefall-iss/tests/insight/test_cards.py -q` (4 kart; her birinde `doi` `10.60555/` ile başlar; değerler beklenen aralıkta: 2.12±0.05, −0.80±0.05; kısmi-g ifadesi yok).
  - Bağımlılıklar: yok (paralel).
  - Tahmini süre: 25 dk.

- [x] **S5 · Veri köprüsü: build_site_data**
  - ✔ 2026-11-14 · `$PY scripts/build_site_data.py && node --check app/data/site_data.js && $PY -m pytest tests -m "not needs_raw and not slow and not live" -q` · build OK (24 investigations, 4 cards), 622 passed
  - Amaç: S2–S4 çıktılarını ve metadata'yı siteye gömülecek tek dosyaya yazmak; mock veriyi değiştirmek için veri sözleşmesi.
  - Dokunulacak dosyalar: `scripts/build_site_data.py` (yeni), `app/data/site_data.js`, `app/data/site_data.json` (üretilir), `tests/delivery/test_build_site_data.py` (yeni).
  - Girdi: `rank_investigations()`, `fit_flex()`, `build_cards()`, `src/discovery` zarf metni, `meta/investigations.parquet` (ad, PSI, DOI). Yalnızca Feature Store/Metadata ve `src/` üzerinden okur.
  - Çıktı: `window.FF.site = {generated, investigations:[{psi_id,name,title,doi,score,components,rationale,envelope:{o2,pressure,flow,material,...},summary}], model:{...fit_flex...}, cards:[...], flamesense:{...}}`; `null` değerler `null` olarak yazılır (NaN → `null`, JSON'da `NaN` yok). JSON ve JS aynı içerik. Sözleşmenin alan listesi dosya başındaki docstring'tedir (S6, S7, S8 buna uyar).
  - Kabul testi: `cd /home/halil/repos/flame-freefall-iss && $PY scripts/build_site_data.py && node --check app/data/site_data.js && $PY -m pytest tests/delivery/test_build_site_data.py -q` (testler: 24 investigation; `NaN` kelimesi yok; her investigation `doi` alanı var (değer veya `null`); `model.cv` var; 4 kart; `0` ile doldurulmuş zarf değeri yok: zarfı eksik bir investigation için alan `null`).
  - Bağımlılıklar: S2, S3, S4.
  - Tahmini süre: 30 dk.

- [x] **S6 · Explore ve Scenario ekranları gerçek veriyle**
  - ✔ 2026-11-14 · `node scripts/smoke_explore_scenario.mjs` · ALL PASSED (24 rows, JS==Python predict, negative -> "outside the model's valid range", p_atm min 0.692); `node --check` on all app/*.js OK
  - Amaç: Explore sıralı 24 investigation + zarf + özet + DOI; Scenario FLEX what-if (tarayıcıda tahmin) + skor + uyarı. Halo teması korunur.
  - Dokunulacak dosyalar: `app/views/kesif.js` ve `app/views/senaryo.js` (S1'den sonraki ad neyse), `app/core/data.js`, `app/core/model.js` (yeni; tahmin fonksiyonu; `index.html` S1'de etiketlenmişse, değilse adım S1'e geri not düşer ve `core/data.js` içine konur), `tests/delivery/test_site_js.js` yerine `scripts/smoke_site.mjs` (yeni).
  - Girdi: `window.FF.site` sözleşmesi (S5).
  - Çıktı: Explore listesi skora göre sıralı, satırda `rationale`, detayda zarf + özet + DOI bağlantısı (`https://doi.org/<doi>`); Scenario: yakıt/seyreltici seçici yalnız `known_combos` içinde; O2/basınç/çap kaydırıcıları eğitim aralığıyla sınırlı; çıkış K (mm²/s) ve grup-dışı R² ile "Valid only for fuel/diluent combinations present in FLEX data" uyarısı sürekli görünür. Eksik değerler "n/a" (0 değil). Eski mock BASS-II Olson grafiği ya yeni verilere göre kalır ya kaldırılır; Olson/kısmi-g iddiası yok.
  - Kabul testi: `cd /home/halil/repos/flame-freefall-iss && node scripts/smoke_site.mjs` (betik: `app/` JS dosyalarını sahte `window`/`document` ile yükler, `site_data.json`'dan `FF.model.predict` çağırır ve Python `fit_flex` tahminiyle ±1e-6 karşılaştırır; Explore view'ın 24 satır ürettiğini ve uyarı metnini içerdiğini doğrular) ve `for f in $(find app -name '*.js'); do node --check $f || exit 1; done`.
  - Bağımlılıklar: S1, S5.
  - Tahmini süre: 40 dk.

- [x] **S7 · Equipment ve Live (FlameSense konsept) ekranları**
  - ✔ 2026-11-14 · `node scripts/smoke_equipment.mjs` · S7 smoke OK
  - Amaç: Equipment ekranı DOI atıflı kartlarla; Live ekranı "concept / not built" konsept sayfası.
  - Dokunulacak dosyalar: `app/views/ekipman.js`, `app/views/canli.js` (ad S1'den sonrakine göre), `app/assets/flamesense/*.jpg` (yeni; `design/flamesense_box/render_assembled.png`, `render_internal.png`, `render_exploded.png`, `render_detail.png` kaynak; orijinaller dokunulmaz), `app/ui/theme.css` (yalnız görsel/etiket stilleri eklenir; S6 ve S8 bu dosyaya dokunmaz).
  - Girdi: `window.FF.site.cards`, `window.FF.site.flamesense` (S5). Görsel küçültme `$PY` + Pillow varsa (`import PIL` ile kontrol; yoksa orijinal PNG'ler kopyalanır ve "kurulum gerekmez" olarak not düşülür; her halde `matplotlib.image` yeterli değilse PNG olarak ≤800 px bırak, kurulum yapma).
  - Çıktı: Equipment: 4 kart (başlık, sayı, birim, n, DOI bağlantısı, caveat, ekipman çıkarımı). Live: "CONCEPT — NOT BUILT" etiketi; render görselleri; kısa metin (ne yaptığı: yangın öncesi/anında O2, CO, CO2, akış, partikül ölçümü; ne planlandı: 140×90×45 mm kutu, ESP32-S3, sensör listesi; iyonizasyon yalnız konsept); sahte canlı değer ve "device connected" yok. Çıktıdaki hiçbir görsel/metin kısmi yerçekimi veya ölçüm iddiası içermez.
  - Kabul testi: `cd /home/halil/repos/flame-freefall-iss && node scripts/smoke_site.mjs --views equipment,live && ls app/assets/flamesense | grep -c -E '\.(jpg|png)$' | grep -qE '^[2-4]$' && du -sk app/assets/flamesense | awk '{exit ($1>1500)}'` (smoke betiği S6'da oluşur; S7, S6 ile paralel çalışacaksa betik iskeletini S1 ekler. Aksi halde S7 yalnız `node --check` + `ls` + `grep -c "not built" app/views/canli.js` ile doğrulanır).
  - Bağımlılıklar: S1, S5.
  - Tahmini süre: 25 dk.

- [x] **S8 · Yerel sunucu ve LLM soru-cevap**
  - ✔ 2026-11-14 · `$PY -m pytest tests -m "not needs_raw and not slow and not live" -q` · 622 passed (server/fallback tests included); live EVREN call: ReadTimeout at 90 s and 170 s -> fallback (endpoint unresponsive)
  - Amaç: Tek komutla başlayan stdlib sunucusu (statik + `POST /api/ask`), arayüzde Ask paneli, anahtarsız/başarısız çağrıda statik kartlara düşüş.
  - Dokunulacak dosyalar: `app/server.py` (yeni), `app/ui/ask.js` (yeni), `tests/delivery/test_server.py` (yeni).
  - Girdi: `app/data/site_data.json`; `src/discovery/llm.py` içindeki `load_settings`, `chat_json` (mevcut; `.env` okuma ve EVREN istemcisi yeniden kullanılır; yeniden yazılmaz). Not: `chat_json` JSON döndürür; bu yüzden istem JSON `{"answer": "...", "cards": ["id", ...]}` ister.
  - Çıktı: `$PY app/server.py [--port 8000]`: `/` statik `app/` dosyalarını sunar (dizin dışına çıkma engelli); `POST /api/ask {question}` → `{answer, cards_used, source: "llm"|"fallback"}`. Sistem istemi: "Answer only from the provided cards; if absent say 'not in the cards'; no partial-gravity claims." Bağlam: investigation özetleri + zarflar + 4 kart + model sınırları, uzunluk sınırlı (örn. 12 000 karakter). Anahtar yok / ağ hatası / zaman aşımı (≤20 s) → HTTP 200 `source:"fallback"` ve `ask.js` anahtar kelime eşleşmesiyle en uygun kartı gösterir ("LLM unavailable — showing closest card"). Anahtar hiçbir yanıtta, günlükte veya statik dosyada bulunmaz. `FF.mountAsk(container)` Ask kutusunu ekler.
  - Kabul testi: `cd /home/halil/repos/flame-freefall-iss && $PY -m pytest tests/delivery/test_server.py -q` (testler: sunucu rastgele portta başlar; `GET /` 200; `GET /../.env` 404/403; `POST /api/ask` LLM monkeypatch ile `source:"llm"`; `load_settings` hata verince `source:"fallback"`; yanıt gövdesinde `API_KEY` değeri yok; sınama sırasında gerçek ağ çağrısı yapılmaz) ve `node --check app/ui/ask.js`.
  - Bağımlılıklar: S1, S5.
  - Tahmini süre: 30 dk.

- [ ] **S9 · Doküman temizliği, CI temizliği ve uçtan uca doğrulama**
  - Amaç: Eski çelişen dokümanlar silinir, `Architecture.md` MVP mimarisiyle üstüne yazılır, README/CLAUDE.md MVP_SPEC'e işaret eder; hızlı test seti ve uçtan uca demo bağımsız olarak doğrulanır.
  - Dokunulacak dosyalar: `plans/00_data_layer/` … `plans/06_delivery/` (silinir), `plans/README.md` (kısa MVP indeksi olarak yeniden yazılır; commit kuralı otomatik commit ile uyumlu), `Architecture.md` (üstüne yazılır), `README.md`, `CLAUDE.md` (MVP_SPEC ve `plans/mvp/PLAN.md` işaret edilir; `plans/00..06` ve eski modül referansları çıkarılır; kalıcı kurallar korunur), `docs/decisions/002-video-out-of-scope.md` ve diğer çelişen `docs/` belgeleri (yalnız çelişenler; `docs/datasets/*` ve `docs/evidence/` kalır), `tests/plancheck*` ve `tests/delivery/test_ci_config.py` (silinen planlara veya `plans/*/requirements.txt`'e bağlı testler güncellenir/silinir; CI buna göre), `.github/workflows/tests.yml` (plans/*/requirements.txt yerine kök `requirements.txt` veya `plans/mvp/requirements.txt`), `scripts/e2e_check.sh` (yeni).
  - Girdi: `MVP_SPEC.md`, `plans/mvp/PLAN.md`, `.orchestrator/reports/repo.md` §4 (video referansları listesi).
  - Çıktı: Depo MVP ile tutarlı; `scripts/e2e_check.sh`: build betiğini çalıştırır, sunucuyu rastgele portta başlatır, `curl` ile `/`, `/data/site_data.json`, `POST /api/ask` (anahtar yokken `fallback`) kontrol eder, sunucuyu kapatır. Bağımsız doğrulama bu adımın sonunda tek kez yapılır (test-verifier).
  - Kabul testi: `cd /home/halil/repos/flame-freefall-iss && bash scripts/e2e_check.sh && $PY -m pytest tests -x -q -m "not needs_raw and not slow and not live" && ! grep -rliE 'mp4|ffmpeg|presign' Architecture.md README.md CLAUDE.md MVP_SPEC.md plans/mvp/PLAN.md app && test ! -d plans/00_data_layer && git diff --stat HEAD -- data_analysis/Nasa_data/raw data_analysis/Nasa_data/csv | wc -l | grep -qx 0` (not: `MVP_SPEC.md`/`PLAN.md` "video/mp4" kelimelerini "Video/mp4 yok" cümlesi olarak içerir; grep bu iki dosyayı kapsamamalıysa komuttan çıkarılır; test sayısı hedefi: eski testlerin silinenleri hariç tümü yeşil).
  - Bağımlılıklar: S6, S7, S8.
  - Tahmini süre: 35 dk.

## Açık noktalar (kullanıcıya sorulacak)

1. Bu plan seri 4,4 saattir (paralel ≈ 2,5 saat). Kullanıcının 2 saatlik uç senaryosunda S7 görselleri ve S8 LLM ilk kesilenlerdir; bu sıra kabul mü?
2. `design/dashboard/` taşındıktan sonra silinsin mi, yoksa `design/` altında kopya kalsın mı? (Plan: siler; `design/flamesense_box/` kalır.)
3. `.env` içindeki EVREN anahtarının kullanım şartı onayı: demoda canlı çağrı yapılsın mı? (Karar: evet; yine de anahtar yoksa fallback.)
4. Habitat skoru ağırlıkları (S3) ve aralıklar (O2 17–35 %, 56–101 kPa) planlayıcı varsayımıdır; kullanıcı bunları onaylamalı mı?
5. Eski `plans/README.md` kural 9 ile CLAUDE.md çelişkisi S9'da otomatik commit lehine çözülür (karar 11).
6. Resmi 2026 teslim kuralları doğrulanmadı; karar 12 uyarınca sonra sorulacak.
