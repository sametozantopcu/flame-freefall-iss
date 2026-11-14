# STATE

- **Mevcut faz:** FAZ 6 — Demo hazırlığı; son rapor kullanıcıya verildi (2026-11-14).
- **Tamamlananlar:** FAZ 0–5. Plan `plans/mvp/PLAN.md` 9/9 (S1–S9), hepsi kanıtlı. FAZ 4 temizliği S9 içinde yapıldı (eski `plans/00..06` ve video karar dokümanı silindi; `Architecture.md` yeniden yazıldı).
- **Commit'ler (yerel, `data_analysis` dalı; `main`'e yazılmadı):** `1856728` (S1–S4), `bf36abc` (S5–S8), `e5105d5` (S9), `9c9f03b` (low_confidence düzeltmesi).
- **Son doğrulama:** `bash scripts/e2e_check.sh` → `E2E OK`; `pytest tests -m "not needs_raw and not slow and not live"` → 623 passed. Bağımsız e2e raporu `reports/e2e.md` GEÇTİ (headless Chrome, 4 ekran, konsol hatası 0; ekran görüntüleri `reports/screens/`). Not: low_confidence düzeltmesinden sonra tarayıcı düzeyi kontrol tekrarlanmadı (yalnız smoke + e2e betiği).
- **Demo başlatma:** `$PY scripts/build_site_data.py` (isteğe bağlı, veri commit'li) → `$PY app/server.py --port 8000` → `http://127.0.0.1:8000/`.

## Açık sorunlar
1. **PUSH BEKLİYOR:** subagent ortamında git GitHub kimlik bilgisi yok. Kullanıcı: `! git push -u origin data_analysis`. Push sonrası CI sonucunu hafızadaki commit günlüğüne yaz.
2. **EVREN LLM ucu yanıt vermiyor** (90 sn ve 170 sn `ReadTimeout`). Soru kutusu statik kartlara düşüyor (`mode: fallback`). Uç dönerse kod değişmeden canlı çalışır (`LLM_TIMEOUT`, varsayılan 90 sn).
3. **Teslim kuralları** (resmi sayfa okunamadı): kullanıcı "işler bitince sor" dedi → son raporda soruldu.
4. Kökte takipsiz, bize ait olmayan `test.txt`; `.orchestrator/` takipsiz (commit edilmedi, gitignore'a eklenmedi).
5. Skor ağırlıkları ve habitat aralıkları (O2 %17–35, 56–101 kPa) varsayım; kodda ve ekranda öyle etiketli.
6. `.claude/agents/test-verifier.md` hâlâ Streamlit örneği içeriyor (anayasa "birebir" dediği için değiştirilmedi).

## Kullanıcı kararları
Tam metin `decisions.md`. Özet: video/mp4 iptal; `nasa_hack` ortamı; MVP = M1+M2+M3+FlameSense (konsept); arayüz = arkadaşın statik sitesi (`app/`), tema korunur; canlı LLM soru-cevap; yerel demo, videoyu ekip çeker; yalnız İngilizce; Ay/Mars vurgusu; hafif test; eski dokümanlar silinir; otomatik commit+push; kullanıcıya süre tahmini verme; kapsamdan bir şey çıkarmadan önce sor.

## Ölçülen değerler
- FLEX `burn_rate_K_mm2_s`, Ridge, GroupKFold: R² 0.373 (fuel×diluent), 0.567 (year), n=258; basıncı 0 mmHg kayıtlı tek satır (C11M201) eksik sayılıyor.
- Sıralama: 16 scored, 6 low_confidence, 2 not_scorable (PSI-47, PSI-60).
- ACME: %20.5–21.5 O2'de sıcak tutuşma oranı 0.59 (20/34), PSI-159 — eski "tutuşma yok" iddiası doğrulanmadı.
