# E2E raporu: GEÇTİ (1 gözlem)
1 GEÇTİ: build_site_data.py + node --check ok; git status --short app boş (deterministik).
2 GEÇTİ: pytest 622 passed/6 deselected; smoke_explore_scenario ALL PASSED; smoke_equipment S7 OK; tüm app/*.js node --check ok.
3 GEÇTİ: / 200 HTML; tüm script/css/görsel (png + web/*.jpg) 200; /server.py 404, /../.env 403, /.env 404, /%2e%2e/.env 403; POST /api/ask 200 mode=fallback (LLM kapalı, beklenen); boş soru 400; 5000 karakter 400; bozuk JSON 400; sunucu ayakta kaldı; API anahtarı log/app/yanıtta 0 eşleşme; sunucu kapatıldı.
4 GEÇTİ: Chrome headless, 4 ekran, konsol hatası 0. Explore 24 satır + skor; Scenario tahmin 0.508 + CV R2 0.373 + "No partial-gravity data"; Equipment 4 kart + 4 DOI; FlameSense "Concept" + 4 img. Ekran görüntüleri: .orchestrator/reports/screens/*.png
5 GEÇTİ: site_data.js geçici yeniden adlandırma: Explore/Scenario "Data not built: run scripts/build_site_data.py", Equipment "No insight data loaded"; geri konuldu, git status temiz. file:// ile 4 ekran yükleniyor.
6 GEÇTİ: görünür metinde Türkçe yok (yalnız JS/HTML yorumları); streamlit/mp4/video eşleşmesi yok; score null 2 araştırma (DAFT, SPICE) "not scorable".
Gözlem: Explore'da 4 araştırma 100.0 (PSI-106,115,117,62; yalnız has_flight bilinen görünüyor), 2 araştırma 0.0 (PSI-142, PSI-26). En az 3 bilinen bileşen kuralıyla tutarlılığı kontrol edilmeli.
