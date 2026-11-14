# NASA PSI Veri Analizi (EDA)

Mimari için: [`../../Architecture.md`](../../Architecture.md) · Analiz raporu: [`analysis/REPORT.md`](analysis/REPORT.md)

```
Nasa_data/
├── ingest/          PSI API'den indirme ve denetim
│   ├── psi_all.py     24 combustion investigation → raw/ + csv/
│   ├── audit_csv.py   kopya / sentinel / şema denetimi → audit/
│   ├── drilldown.py   kanonik dosya listesi → audit/canonical_files.csv
│   └── dedup.py       birebir kopya CSV'leri listeler (--sil ile siler)
├── audit/           denetim çıktıları (küçük, repoda)
├── analysis/
│   ├── scripts/       00_inventory … 09_build_report (+ _common.py)
│   ├── data/          temizlenmiş tablolar (.parquet, 11 tablo)
│   ├── outputs/       CSV/MD çıktılar, assumptions.md, feature_catalog.csv
│   ├── figures/       grafikler
│   └── REPORT.md      Türkçe EDA raporu
├── raw/  csv/       ⚠ git'te YOK (~8 GB) — ingest/ ile yeniden üretilir
```

## Yeniden üretme

Tüm komutlar `data_analysis/Nasa_data/` içinden çalıştırılır:

```bash
python ingest/psi_all.py        # raw/ + csv/ indir (uzun sürer)
python ingest/audit_csv.py      # audit/
python ingest/drilldown.py      # audit/canonical_files.csv
mkdir -p analysis/logs
for s in analysis/scripts/0*.py; do python "$s" > "analysis/logs/$(basename "$s" .py | cut -c1-2).log" 2>&1; done
```

Veri katmanını doğrulamak/yeniden kurmak için (repo kökünden): `python -m src.data_layer.build_all --skip-raw` (ayrıntı: `src/data_layer/README.md`).

`analysis/data/*.parquet` repoda olduğundan, sadece modelleme yapacaksanız indirme adımına gerek yok.
Kurallar: model eğitimi bu klasörde yapılmaz; `raw/` ve `csv/` asla değiştirilmez.
