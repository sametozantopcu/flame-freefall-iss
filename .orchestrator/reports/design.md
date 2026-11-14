# design/ raporu (salt okunur tarama, 2026-11-14)

## 0. Ne var
design/ = 27 dosya, 7.1 MB, iki alt klasör. Geliş: `e404c91` (2026-11-14 19:15, FlameSense Blender v3) ve `caff4b5` (2026-11-14 21:12, "Add Halo-style static dashboard"), ikisi de ruzgaritto, PR #4/#5 ile main'de. Başka dalda (origin/data_analysis, origin/flamesense-blender-model) ek site kodu yok; flamesense-blender-model dalında yalnızca aynı design/ dosyaları var. Repoda başka html/tsx/jsx yok.
- design/dashboard/ (~1200 satır JS/CSS/HTML): app.js 43, config.js 53, i18n.js 258, index.html 41, core/physics.js 60, core/data.js 185, ui/components.js 87, ui/charts.js 190, ui/theme.css 333, views/{kesif 63, senaryo 60, ekipman 47, canli 46}.js, README.md 121, assets/{logo.png, logo_orijinal.png, favicon.png, logo_uyarla.py}.
- design/flamesense_box/: flamesense.blend (194 KB), 4 PNG render, README, CHANGELOG, MODEL_PLAN, MODEL_PLAN_v3.

## 1. Teknoloji
- Statik HTML/CSS/vanilla JS. React/Vite/Next/Streamlit DEĞİL. Build adımı, package.json yok.
- Giriş: design/dashboard/index.html. Düz script'ler `window.FF` altında toplanıyor (ES modülü değil, file:// çalışsın diye); yükleme sırası index.html:25-34 (config, i18n, physics, data, components, charts, 4 view, app.js).
- Bağımlılık: yok, yalnızca Inter fontu Google Fonts'tan (index.html:11-12; çevrimdışıysa sistem fontuna düşer).
- Sistemde node v24.22.3, npm 11.19.1 var (`which node npm`). Gerekmiyor.
- nasa_hack ortamı: `import streamlit/plotly/fastapi/uvicorn` -> HEPSİ YOK; pandas 3.1.1 var. (Kökteki requirements.txt streamlit==1.67.0 ve plotly==7.1.0 listeliyor ama ortamda kurulu değil -> mevcut app/ bu ortamda şu an çalışmaz.) Dashboard için bunlar gerekmez.

## 2. Ekranlar (hash yönlendirme: #explore, #scenario, #equipment, #live; eski #kesif vb. çalışır; app.js:7-17)
1. Explore/Keşif (views/kesif.js): 24 deney listesi (ad, PSI, tablo satır sayısı + log ölçekli çizgi), seçili deney ayrıntısı; yalnızca PSI-25 BASS-II için Olson U-eğrisi grafiği + 129 testin O2 noktaları (O2 x akış).
2. Scenario/Senaryo (senaryo.js): O2 (15,17,19,21,22 %) ve akış (0.5-20 cm/s) seçilir; Olson sınırı, pay (margin), rejim, en yakın 4 BASS-II testi, grafikte nabız atan nokta.
3. Equipment/Ekipman (ekipman.js): numaralı bulgular (Dünya PMMA LOI 15.4 %, mikro-g sınırı 13.5 %, NASA-STD-6001 25 s tutuşma vs 230 s, Goldilocks 1-5 cm/s, CO ~10x), FlameSense satırları. FlameSense render görseli kullanmıyor.
4. Live/Canlı (canli.js): O2, CO, CO2, akış, basınç, IR sensör değerleri, limit/pay, halka göstergesi, "cihaz bağlı değil" durumu.
Her ekranın altında "Dürüstlük ve Sınırlar" bandı. Dil: varsayılan EN, `?lang=tr` TR (i18n.js, 2 dil aynı anahtarlar).

## 3. Veri
- Tamamen sabit kodlu/mock, hiç fetch/XHR/endpoint yok (`grep fetch|XMLHttp|http` yalnızca font linki). 
- core/data.js: EXPERIMENTS (24 deney: psi, name, title, rows) ve BASS2_TESTS (129 satır [test, araştırmacı, başlangıç O2]) — veriseti/ klasöründen (README'de anılan; repoda yok, repodaki karşılığı data_analysis/Nasa_data/raw|csv) üretilip JS'e gömülmüş, "elle düzenleme" notlu. 
- config.js: Olson katsayıları (A=6.0, B=0.5, C=0.0167, D=13.4, r_ref=0.318; config.js:7-11), bulgu sabitleri, LIVE_SAMPLE (connected:false, o2 20.9, co 2, co2 0.30, flow 3.2, p 101.3, IR 31; config.js:34-42). README: cihaz bağlanınca MQTT'den okunacak denmiş (kod yok).
- Model/tahmin aralığı/FastAPI bağlantısı yok (README:114-115 de söylüyor). Yalnızca PSI-25 için grafik var.

## 4. Renk paleti ve tema ("Halo", yalnız koyu, marka rengi yok; ui/theme.css:19-48)
--ground #000000; --ground-lift #0a0a0b; --ink #ffffff; --ink-soft rgba(255,255,255,.7); --ink-muted .55; --ink-faint .4; --ink-ghost .22; --rule .4; --light #f5f5f7 (tek "ışık" rengi); --light-dim .1; --light-trace .025; --hairline .13; --hairline-soft .08; --halo .07; --halo-edge .02; --highlight .1; --glow `0 0 6px 1px rgba(255,255,255,.55), 0 0 18px 5px rgba(255,255,255,.14)`.
Font: theme.css:35 `--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif`; gövde `font: 450 var(--fs)/var(--lh)` (theme.css:97); tabular-nums sayı sütunlarında (:102).
Ölçüler: --fs clamp(14px,2vh,20px), --fs-label clamp(12px,1.7vh,17px), --radius-row 8px, --size-hero min(320px,44vh), --ease cubic-bezier(.2,.7,.2,1). Body arka plan: iki radial-gradient + yıldız dokusu (:60-80). Mevcut app/ temasından (Streamlit, turuncu/kırmızı?) farklı olup olmadığı bu raporda doğrulanmadı. Renk yok: durum opaklıkla gösteriliyor -> MVP'de risk renkleri istenirse tasarım diline aykırı.
Logo: NASA Space Apps logosu #f5f5f7'ye çevrilmiş (assets/logo.png 580x227), favicon 64x64.

## 5. Çalıştırma ve durum
- Komut: tarayıcıda `design/dashboard/index.html` aç (file://) veya `cd design/dashboard && python -m http.server`. Sunucu/kurulum gerekmez (README:8-10).
- Kontrol: `node --check` ile 12 JS dosyasının tamamı sözdizimi hatasız (çıktı: yalnızca "syntax done", FAIL yok). Tarayıcıda render ETMEDİM (headless tarayıcı denenmedi); dolayısıyla "görsel olarak çalışıyor" doğrulanmadı, yalnızca sözdizimi ve README iddiaları (6 çözünürlükte taşma testi yaptığını söylüyor).
- Not: 900px altında tek sütun, üstünde kaydırmasız vh-ölçekli düzen.

## 6. src/ çıktılarını bağlama seçenekleri (uygulanmadı)
src/ içinde data_layer (store/features/metadata), discovery (envelope, text_envelope, llm), prediction (cards, datasets) var; hepsi pandas/duckdb benzeri Python, JSON üretmiyor (cards.py DatasetCard pydantic, write_cards md/json olabilir — doğrulanmadı).
- A) Ön hesaplanmış JSON (öneri, ~1-2 s): küçük bir Python betiği src çıktılarını (envelope tablosu, deney listesi, model tahminleri) `design/dashboard/data/*.json` veya `app/data.js`'ye yazar; core/data.js'deki gömülü diziler `<script>` ile değiştirilir (file:// uyumu için fetch yerine `window.FF.data = ...` biçimi). En düşük risk, ek bağımlılık yok.
- B) Küçük FastAPI (~3-5 s): fastapi+uvicorn nasa_hack'te yok, kurulum gerekir (kısıt dışı şimdilik); CORS/fetch ve file:// sorunu; canlı hesap için gerekli değilse fazla.
- C) Streamlit içine gömme (components.html) (~2 s): dashboard'u iframe ile gösterip veriyi JSON enjekte; ama streamlit de kurulu değil ve Halo'nun kaydırmasız düzeniyle çakışır. Önerilmez.
Olson fizik mantığı JS'te zaten var (core/physics.js); sadece model tahmini/gerçek veri JSON olmalı.

## 7. app/ ile çakışma ve taşıma notları
Mevcut app/ (Streamlit, Python; giriş app/streamlit_app.py): config.py, i18n.py, __init__.py, core/{data,hardware,models,physics,procedures,risk,simulator}.py, ui/{charts,components,state,theme}.py, views/{ai,archive,flammability,mission,procedures,system}.py.
- Aynı dosya adı, farklı uzantı: config, i18n, core/physics, core/data, ui/theme (.py vs .js/.css), ui/charts, ui/components, views/*. Uzantı farklı olduğu için fiziksel çakışma yok; ama klasörler karışırsa .py'ler kalır. Eski app/ silinecekse önce: app/core/physics.py ile design/dashboard/core/physics.js aynı Olson katsayılarını mı kullanıyor (README öyle diyor, config.js:7-11 doğrulandı, py tarafı karşılaştırılmadı).
- Başka yerler app/'a bağlı olabilir: testler (tests/ ?), CLAUDE.md/plans, CI; silmeden önce `grep -rn "from app\|app/" ` yapılmalı (yapmadım). app/__pycache__ git'te mi bilinmiyor.
- Dosya adlarında Türkçe (kesif/senaryo/ekipman/canli) ve EN sekme adları karışık (app.js PAGES eşlemesi); MVP için sayfa adları değişirse app.js:7 ve i18n 'nav.*' anahtarları birlikte güncellenmeli.
- README ve JS yorumları Türkçe; CLAUDE.md ile uyumlu. data.js'in kaynağı "veriseti/" repoda yok -> README yolları düzeltilmeli.
- logo_uyarla.py Pillow ister, çalışma zamanı gerektirmez. assets/ yolları göreli; taşırken index.html göreli kalmalı.
- design/ silinecek mi kopyalanacak mı kullanıcıya bağlı; flamesense_box/ (7 MB) app/ içine taşınmamalı, yalnızca seçilen PNG'ler.

## 8. FlameSense render görselleri (hepsi 1600x1000 RGBA PNG, ~1.6-1.8 MB; web için sıkıştırma önerilir)
- design/flamesense_box/render_assembled.png (1.59 MB): kapalı cihaz — konsept sayfası hero görseli.
- design/flamesense_box/render_internal.png (1.78 MB): kapak kalkık, etiketli iç görünüm (sensör yerleşimi, hava yolu) — sensör açıklaması için en uygunu.
- design/flamesense_box/render_detail.png (1.77 MB): anakart, kablo, sensör yakın çekim.
- design/flamesense_box/render_exploded.png (1.73 MB): patlatılmış görünüm — bileşen listesi bölümü.
Cihaz: 140x90x45 mm, ESP32-S3, LuminOx O2, CO, SCD41 CO2, hot-wire akış, SPS30 partikül, MLX90640 termal, OLED/LED/buzzer; iyonizasyon yalnızca konsept (flamesense_box/README.md). Görsellerin gerçek içeriğini bu taramada GÖRMEDİM (Read ile açmadım); amaç READMEden alındı. .blend, MODEL_PLAN*.md web için gerekmez.
