# Metinden gelen koşul zarfı: inceleme (01/A3)

Kaynak: `data_analysis/Nasa_data/meta/inv_envelope_text.parquet` (01/A2, LLM önerisi + birebir alıntı doğrulaması). Kararlar: `data_analysis/Nasa_data/meta/inv_envelope_text_review.csv`. Bu dosya ondan üretilir (`python -m src.discovery.text_envelope review-md`).

İnceleyen: Claude (geliştirici), 2026-11-14

Özet: doğru 22, düzeltildi 4, silindi 7 (toplam 33)

| row | psi_id | alan | değer | karar | bağlam | not |
|---|---|---|---|---|---|---|
| 0 | PSI-26 | flow | 40 cm/s | düzeltildi | experiment | 'reaching as high as 40 cm/s': 40 bir üst sınır; alt sınır metinde yok |
| 1 | PSI-26 | fuel_or_material | 75% cotton and 25% fiberglass | doğru | experiment |  |
| 2 | PSI-26 | fuel_or_material | Nomex fabric | doğru | experiment |  |
| 3 | PSI-26 | fuel_or_material | Ultem | doğru | experiment |  |
| 4 | PSI-26 | diluent | nitrogen | düzeltildi | experiment | Azot burada ortam seyrelticisi değil, söndürücü ajan ('flame suppressant'); söndürme olgusu olarak tutuldu |
| 5 | PSI-47 | fuel_or_material | Arizona Red Dust (ARD) | silindi | experiment | Arizona Red Dust aerosol standardı; yakıt veya yanan malzeme değil (DAFT bir yanma deneyi değil) |
| 6 | PSI-47 | diluent | GN2 | silindi | experiment | GN2 tozu aerosol hâline getiren taşıyıcı gaz; yanma ortamının seyrelticisi değil |
| 7 | PSI-47 | flow | ?–? nan | silindi | experiment | A2'de reddedildi (alıntıda akış değeri yok: '15-liter Mylar bags') |
| 8 | PSI-62 | fuel_or_material | polymethyl methacrylate (PMMA) | doğru | modeling |  |
| 9 | PSI-62 | fuel_or_material | wax | doğru | modeling |  |
| 10 | PSI-62 | gravity | microgravity | doğru | modeling |  |
| 11 | PSI-62 | gravity | normal-gravity | doğru | modeling |  |
| 12 | PSI-68 | pressure | 0.5–3 atm | doğru | experiment |  |
| 13 | PSI-68 | o2 | 10–40 % | doğru | experiment |  |
| 14 | PSI-68 | diluent | diluent gas | silindi | experiment | Seyreltici gazın adı metinde yok ('the diluent gas'); bilgi taşımıyor |
| 15 | PSI-68 | gravity | microgravity | doğru | experiment |  |
| 16 | PSI-106 | fuel_or_material | methane | doğru | experiment |  |
| 17 | PSI-106 | fuel_or_material | ethylene | doğru | experiment |  |
| 18 | PSI-106 | diluent | nitrogen | düzeltildi | experiment | Azot yakıtı seyreltiyor (yakıt karışımı), ortam seyrelticisi değil |
| 19 | PSI-106 | gravity | microgravity | doğru | experiment |  |
| 20 | PSI-115 | fuel_or_material | dibutyl-phthalate (DBP) | doğru | modeling |  |
| 21 | PSI-115 | gravity | microgravity | doğru | modeling |  |
| 22 | PSI-115 | gravity | Earth gravity | doğru | modeling |  |
| 23 | PSI-115 | flow | ?–? nan | silindi | modeling | A2'de reddedildi (akış hızı sayı olarak verilmemiş) |
| 24 | PSI-117 | fuel_or_material | n-alkane | doğru | modeling |  |
| 25 | PSI-117 | gravity | microgravity | doğru | modeling |  |
| 26 | PSI-117 | diluent | ozone | silindi | modeling | Ozon bir katkı maddesi ('ozone-assisted'); ortam seyrelticisi değil |
| 27 | PSI-142 | pressure | 20 atm | düzeltildi | modeling | 'up to 20 atm': 20 üst sınır, alt sınır metinde yok; değer sayısal modelleme koşulu (ISS deneyi değil) |
| 28 | PSI-142 | fuel_or_material | n-heptane | doğru | modeling |  |
| 29 | PSI-142 | fuel_or_material | dimethyl ether (DME) | doğru | modeling |  |
| 30 | PSI-142 | fuel_or_material | DME | silindi | modeling | Satır 29'un ('dimethyl ether (DME)') tekrarı |
| 31 | PSI-142 | phenomenon | cool flame transitions | doğru | modeling |  |
| 32 | PSI-142 | phenomenon | radiation / stretch extinction | doğru | modeling |  |

Bağlam: `experiment` = değer investigation'ın kendi uçuş/zemin deneyini tanımlar; `modeling` = sayısal/analiz çalışması (zarfta ayrı işaretlenir, ISS deney koşulu sayılmaz).
