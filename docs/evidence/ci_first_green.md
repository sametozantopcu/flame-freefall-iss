# İlk yeşil CI çalıştırması (06/A1)

- **Sonuç:** success
- **Tarih:** 2026-11-14 (15:55:04Z – 15:56:10Z, ~66 sn)
- **Commit:** `870d1a9e6010ab881a472b5f4cab87ba90b462c7` (dal: `data_analysis`, tetikleyici: push)
- **Çalıştırma:** https://github.com/sametozantopcu/flame-freefall-iss/actions/runs/43612731836
- **Test özeti (CI logu):** `350 passed, 10 skipped, 6 deselected in 16.10s`
  - 10 atlanan: `raw/` gerektiren testler (CI'da ham veri yok), nedenleriyle.
  - 6 seçilmeyen: `needs_raw` işaretli `test_idempotent.py` (`-m "not needs_raw and not slow and not live"`).
- **Push öncesi prova:** temiz Python 3.11 sanal ortamında, `raw/`/`csv/`/`.env` olmayan temiz kopyada aynı komut aynı sonucu verdi.

## Uyarılar (iş başarılı, takip edilecek)
- GitHub: `actions/checkout@v4` ve `actions/setup-python@v5` Node.js 20 hedefliyor, Node.js 24'te çalıştırıldı (Node 20 kullanımdan kalkıyor).
- GitHub: `ubuntu-latest` etiketi 19 Ekim 2026'dan itibaren Ubuntu 26'ya geçiyor.
