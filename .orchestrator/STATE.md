# STATE

- **Mevcut durum (2026-11-15):** `plans/mvp/PLAN.md` 16/16 (S1–S9 + Faz 2: L1, R1–R6), hepsi kanıtlı. Çalışma dalı `risk-engine` (main'den, 7 commit, yerelde). Onaylı plan: `/home/halil/.claude/plans/reactive-riding-book.md`.
- **main:** `0e54d9c` — önceki MVP commit'leri PR #6/#8, glass sohbet kutusu PR #9 ile girdi. PR #7 (risk motoru, eski Streamlit üzerine) kapalı; yerine `risk-engine` dalı geçiyor.
- **Bekleyen (kullanıcı):** `git push -u origin risk-engine` → sonra `gh pr create --base main --head risk-engine` (başlık ve gövde son raporda / R6 agent raporunda). Push sonrası CI sonucunu hafızadaki commit günlüğüne yaz.

## Faz 2 commit'leri (`git log --oneline main..risk-engine`)
`70e6a1c` R1 · `fb87108` L1 · `f8e06b8` R2 · `a6a981c` R3 · `a9b4846` R4 · `ebaac08` R5 · `09cff51` R6

## Son doğrulama
- pytest hızlı set: 721 passed, 0 skipped. `smoke_explore_scenario`, `smoke_equipment`, `smoke_risk`: ALL PASSED. `bash scripts/e2e_check.sh`: E2E OK. Build deterministik.
- Headless Chrome: 4 ekran, konsol hatası 0; ekran görüntüleri `reports/screens/v4/`.
- Canlı LLM: çalışıyor (`deepseek-v4.1-flash`, EVREN); cevap süresi 5–26 sn; zaman aşımı 45 sn + 1 yeniden deneme; hata olursa `reason` ile fallback.

## Risk motoru — kararlar ve sınırlar
- Formüller/katsayılar/ağırlıklar PR #7'deki hâliyle; `csv/` doğrudan okuma kaldırıldı → `Anchors.from_feature_store`.
- Yayılma katsayısı: indekste gömülü 0.454 (n=74, R² 0.044) kullanılıyor; Feature Store yeniden uyumu 0.319 (n=66); ikisi de dayanak tablosunda (orkestratör kararı, kullanıcıya bildirildi).
- İndeks bağıl (0 = %21 O2 / 1 atm); 0 "yanmaz" demek değil → panelde ayrı "Flammable at this condition?" okuması.
- Ağırlıklar, 35/65 eşikleri, basınç üssü varsayım; yalnız PMMA limiti BASS-II verisinden.
- PR #7'den alınmayanlar: `.gitignore` değişikliği, 19 dosyadaki docstring çevirileri.
- Formüldeki tutarsızlıkları düzeltmek motorun yazarıyla (sametozantopcu) konuşulacak ayrı karar.

## Açık sorunlar
1. Push/PR kullanıcıda (subagent ortamında git kimlik bilgisi yok).
2. Teslim kuralları (resmi sayfa okunamadı) hâlâ teyit edilmedi; kullanıcı "işler bitince sor" demişti.
3. `design/` klasörü repoda takipli duruyor; kaldırılsın mı sorusu cevapsız.
4. Küçük: PMMA limit çizgisi risk grafiğinin ekseni dışında; düğmeye basınca klavye odağı kayboluyor.

## Kullanıcı kararları
Tam metin `decisions.md`. Ek (2026-11-15): kullanıcıya süre tahmini verme; kapsamdan bir şey çıkarmadan önce sor; mevcut dashboard'u bozmadan ekle; önce plan, sonra uygulama.
