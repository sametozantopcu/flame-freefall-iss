# Landing planı: tek sayfa, kaydırma tabanlı arayüz

Kapsam: `app/` altındaki statik site. Dört ayrı ekran (hash ile değişen) tek sayfada, yukarıdan aşağıya akan bölümlere dönüşür; başa bir hero eklenir. Halo görsel dili (renk, yazı, çizgiler) değişmez. Backend ve veri katmanına dokunulmaz. Dal: `dev`; sonunda `main`'e PR.

## Durum

- İlerleme: 7/7
- Son güncelleme: 2026-11-15 (LP0–LP6 tamam, commit b802199)
- Sıradaki adım: yok — `dev` → `main` PR (insan incelemesi)
- Açık sorunlar (bilinen sınırlar):
  - İlerleme çizgisi ve parallax Firefox'ta varsayılan olarak görünmez (süs, işlev etkilenmez).
  - JS kapalıyken hero sayıları ve veri bölümleri çizilmez (başlık, mesaj ve CTA görünür).
  - FLEX panelindeki katsayı listesi masaüstünde kendi içinde kayar (bilinçli istisna).
  - Düzen denetim script'i ilk ekranın hero olduğunu, h2/h3 hiyerarşisini ve odak davranışını ölçmüyor; bunlar bağımsız doğrulayıcı tarafından elle doğrulandı.

## Sözleşme (testlerin dayandığı arayüz)

**`app/index.html`**
- `<head>` içinde `document.documentElement.classList.add('js')` yapan satır içi script.
- `<a class="skip" href="#main">` (ilk odaklanabilir öğe), `<header class="top">`, `<main id="main">`.
- `<main>` içinde sırayla: `<section id="top" class="hero">` (içinde tek `<h1>`), sonra `id` değerleri `explore`, `scenario`, `equipment`, `live` olan dört `<section class="sec">`. Her birinde `data-view` (`kesif`, `senaryo`, `ekipman`, `canli`), `aria-labelledby` ile bağlı bir `<h2>` ve görünümün çizildiği `<div class="view">`.
- `ui/motion.js`, `app.js`'ten önce yüklenir.

**`app/app.js` → `FF.app`** (DOM yokken de yüklenir; `document.getElementById('main')` boş dönerse yalnızca API tanımlanır)
- `SECTIONS`: `[{ id, view }]`, sıra: explore/kesif, scenario/senaryo, equipment/ekipman, live/canli.
- `resolveHash(hash)`: `'#scenario'` ve eski `'#senaryo'` → `'scenario'`; `'#top'` → `'top'`; bilinmeyen ya da boş → `null`.
- `navHtml(activeId)`: dört `<a href="#id">`; yalnız etkin olanda `aria-current="true"`; etkin yoksa hiçbirinde.
- `heroStats(site)`: `[{ value, label }]` üç öğe — araştırma sayısı (`site.investigations.length`), FLEX test sayısı (`site.model.cv.fuel_diluent.n`), bulgu sayısı (`site.cards.length`). Bir alan eksikse o öğe çıkar; `site` yoksa `[]`. Eksik değer 0 olarak gösterilmez.

**`app/ui/motion.js` → `FF.motion`**
- `countText(finalText, p)`: `p` 0–1 arası ilerleme. `p >= 1` → `finalText` aynen. Metin sayı ile başlamıyorsa her zaman `finalText`. Ara değerlerde ondalık basamak sayısı ve sonek (`%`, birim) korunur; işaret korunur.
- `init(root)`: `IntersectionObserver` yoksa `root` içindeki tüm `[data-reveal]` öğelerine hemen `in` sınıfını ekler.

**`app/ui/theme.css`**
- Gizli başlangıç durumu (`opacity: 0`) taşıyan reveal kuralları yalnız `.js` öneki altında ve `@media (prefers-reduced-motion: no-preference)` içinde.
- `animation-timeline` yalnız `@supports (animation-timeline: scroll())` bloğu içinde geçer.
- `scroll-behavior: smooth` yalnız `prefers-reduced-motion: no-preference` içinde.

**Değişmeyen:** `FF.views.<ad>.render(root)` sözleşmesi; `scripts/smoke_explore_scenario.mjs`, `smoke_equipment.mjs`, `smoke_risk.mjs` değişmeden geçer.

## Adımlar

`$PY` = `/home/halil/miniconda3/envs/nasa_hack/bin/python`; komutlar repo kökünden, `PATH` başında bu ortam olacak şekilde çalışır.

- [x] **LP0 · Plan ve sözleşme**
  - ✔ 2026-11-15 · test -f plans/landing/PLAN.md && grep -q "landing" plans/README.md · çıkış 0
  - Dosyalar: `plans/landing/PLAN.md`, `plans/README.md`.
  - Kabul testi: `test -f plans/landing/PLAN.md && grep -q "landing" plans/README.md`.

- [x] **LP1 · İskelet: tek sayfa, bölümler, gezinme**
  - ✔ 2026-11-15 · node scripts/smoke_landing.mjs + 3 mevcut duman testi + pytest tests -m "not needs_raw and not slow and not live" · ALL PASSED (83 ok); 741 passed, 6 deselected
  - Amaç: dört görünüm açılışta kendi bölümüne çizilir; hash ile içerik değiştirme kalkar; üst bar yapışkan, bağlantılar çapa, etkin bölüm kaydırmaya göre işaretlenir; eski hash'ler çalışır.
  - Dosyalar: `app/index.html`, `app/app.js`, `app/ui/theme.css`, `scripts/smoke_landing.mjs` (yeni).
  - Kabul testi: `node scripts/smoke_landing.mjs` içindeki iskelet ve `FF.app` (SECTIONS, resolveHash, navHtml) denetimleri + mevcut üç duman testi + `$PY -m pytest tests -q -m "not needs_raw and not slow and not live"`.
  - Bağımlılıklar: LP0.

- [x] **LP2 · Masaüstü düzeni**
  - ✔ 2026-11-15 · python scripts/check_landing_layout.py + 3 mevcut duman testi · ALL PASSED (altı boyut; Explore 824/824, FLEX 674/824 @1440×900)
  - Amaç: Explore ve FLEX ekran yüksekliğinde panel olarak kalır (grafik kalan alanı doldurur); risk paneli, Equipment ve FlameSense doğal yükseklikte akar, iç kaydırmaları kalkar; satır içi stil seçicileri bölüme daraltılır. Bilinçli istisna: FLEX panelindeki katsayı listesi (`.scroll.detail`) masaüstünde kendi içinde kaymaya devam eder.
  - Dosyalar: `app/ui/theme.css`, `app/views/senaryo.js`, `app/views/ekipman.js`, `app/views/canli.js`, `scripts/check_landing_layout.py` (yeni; headless Chrome).
  - Kabul testi: `$PY scripts/check_landing_layout.py` — 1920×1080, 1440×900, 1366×768, 1280×720, 1024×700 ve 390×844 boyutlarında yatay taşma yok; masaüstünde Explore ve FLEX panelleri ekran yüksekliğini aşmıyor; her bölümün içeriği boş değil. Üç mevcut duman testi geçer.
  - Bağımlılıklar: LP1.

- [x] **LP3 · Hero**
  - ✔ 2026-11-15 · node scripts/smoke_landing.mjs (heroStats, hero.* anahtarları) · ALL PASSED; sayılar 24 / 258 / 4
  - Amaç: açılışta karşılama: üst etiket, `h1`, ana mesaj, veriden okunan üç sayı, iki CTA, kaydırma ipucu; başlık hiyerarşisi (`h1` → `h2` → `h3`) ve "skip" bağlantısı.
  - Dosyalar: `app/index.html`, `app/app.js`, `app/i18n.js`, `app/ui/theme.css`, `app/views/canli.js` (iç başlık `h3`).
  - Kabul testi: `node scripts/smoke_landing.mjs` içindeki `heroStats` denetimleri (değerler `site_data.json` ile eşleşir; veri yokken `[]`; eksik alan 0 olmaz) ve `hero.*` metin anahtarlarının varlığı.
  - Bağımlılıklar: LP1.

- [x] **LP4 · Hareket sistemi**
  - ✔ 2026-11-15 · node scripts/smoke_landing.mjs + python scripts/check_landing_layout.py --motion · ALL PASSED (hareket azaltma ve JS kapalı: gizli öğe 0)
  - Amaç: bölümler ve kartlar görünür alana girince bir kez belirir (fade + translateY, stagger); Explore/Scenario'da mevcut `.enter` animasyonları bölüm ilk görününce oynar; sayılar sayarak gelir; `prefers-reduced-motion` ve JS'siz durumda içerik anında görünür.
  - Dosyalar: `app/ui/motion.js` (yeni), `app/ui/theme.css`, `app/index.html`, `app/app.js`.
  - Kabul testi: `node scripts/smoke_landing.mjs` içindeki `FF.motion` (countText, IO yokken init) ve CSS denetimleri (reveal kuralları `.js` + `no-preference` içinde) + `$PY scripts/check_landing_layout.py --motion` (hareket azaltma açıkken ve JS kapalıyken hiçbir bölüm gizli değil).
  - Bağımlılıklar: LP2, LP3.

- [x] **LP5 · Süsler ve erişilebilirlik**
  - ✔ 2026-11-15 · node scripts/smoke_landing.mjs + python scripts/check_landing_layout.py · ALL PASSED (animation-timeline yalnız @supports içinde)
  - Amaç: hero'da hafif parallax ve üst barda ilerleme çizgisi (yalnız CSS, `@supports` içinde); hover/focus mikro etkileşimleri; çapa gezinmesinde odak hedef bölüme geçer.
  - Dosyalar: `app/ui/theme.css`, `app/app.js`.
  - Kabul testi: `node scripts/smoke_landing.mjs` içindeki `@supports` denetimi (animation-timeline blok dışında geçmez) + `$PY scripts/check_landing_layout.py` yeniden geçer.
  - Bağımlılıklar: LP4.

- [x] **LP6 · Uçtan uca denetim ve belgeler**
  - ✔ 2026-11-15 · pytest tests -m "not needs_raw and not slow and not live" + 4 duman testi + python scripts/check_landing_layout.py --motion · 741 passed, 6 deselected; ALL PASSED; dev CI yeşil (b802199, koşu 43703946003)
  - Amaç: `app/README.md` (kaydırmasız düzen bölümü yerine tek sayfa akışı), `MVP_SPEC.md` ve `Architecture.md` arayüz satırları güncel; yeni duman testi CI'da.
  - Dosyalar: `app/README.md`, `MVP_SPEC.md`, `Architecture.md`, `.github/workflows/tests.yml`, `plans/landing/PLAN.md`, `plans/README.md`.
  - Kabul testi: `$PY -m pytest tests -q -m "not needs_raw and not slow and not live"` + dört duman testi + `$PY scripts/check_landing_layout.py --motion`; `dev` dalında CI yeşil.
  - Bağımlılıklar: LP5.
