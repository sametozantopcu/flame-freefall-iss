# Planlar

Planlar: [mvp/PLAN.md](mvp/PLAN.md) (tamamlandı) ve [landing/PLAN.md](landing/PLAN.md) (tamamlandı, PR bekliyor). Kapsam ve kabul ölçütleri: [../MVP_SPEC.md](../MVP_SPEC.md). Kısa mimari: [../Architecture.md](../Architecture.md). Eski derin planlar (00–06) kaldırıldı; git geçmişinde durur.

## Genel durum

| Plan | Dosya | İlerleme |
|---|---|---|
| MVP | [mvp](mvp/PLAN.md) | PLAN.md **Durum** bölümüne bakın (17/17 tamam; Faz 2: L1, L2, R1–R6 tamam, PR hazır) |
| Landing (tek sayfa arayüz) | [landing](landing/PLAN.md) | 7/7 tamam (LP0–LP6); dev → main PR bekliyor |

## Kurallar

1. Başlamadan önce `MVP_SPEC.md` ve `mvp/PLAN.md` içindeki Durum bölümünü oku; bağımlılıkları tamamlanmış ilk işaretsiz adımı al.
2. Kutu yalnızca adımın kabul testi yazılıp çalıştırılıp geçtikten sonra işaretlenir; `skip`/`xfail` geçti sayılmaz.
3. Kutunun altına kanıt satırı: `✔ YYYY-MM-DD · <komut> · <sonuç>`.
4. Adım ID'leri yeniden numaralandırılmaz; gereksiz adımın üstü çizilir (`İPTAL (tarih): neden`).
5. Veri kuralları: `raw/` ve `csv/` değişmez; eksik değer 0 yapılmaz; `psi_id`, `source_file`, `source_row` korunur; doğrulama GroupKFold.
6. Git: doğrulanmış her adımdan sonra otomatik commit ve push (CLAUDE.md ile aynı); doğrulanmamış iş commit edilmez.
7. Bağımlılıklar kök `requirements.txt` içinde, `>=` alt sınırıyla; yalnızca kod gerçekten import ederse eklenir.
