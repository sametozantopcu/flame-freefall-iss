# Repo keşif raporu — flame-freefall-iss (2026-11-14, salt okunur)

Ortam: /home/halil/miniconda3/envs/nasa_hack/bin/python (pandas 3.1.1, duckdb 2.0.0, sklearn 1.9.1, pydantic 2.14.3, pytest 9.2.0, matplotlib, scipy, statsmodels, requests, pyarrow).
ÖNEMLİ: bu ortamda `streamlit`, `plotly` YOK (`pip list`, `ls bin | grep streamlit` boş; `python -c "import streamlit"` -> ModuleNotFoundError).

## 1) Ne var
302 git dosyası (çoğu data_analysis/ figür/parquet/csv). Ham veri: raw/ 5.8 GB, csv/ 2.6 GB (git'te yok).
| Yol | Amaç | ~satır |
|---|---|---|
| app/ (config, i18n 635, streamlit_app 77, core/ 7 dosya ~950, ui/ 4 dosya ~400, views/ 6 sayfa ~850) | Streamlit karar destek arayüzü, BASS-II odaklı | 3005 |
| src/data_layer/ (9 dosya) | DuckDB feature store, metadata, leakage korumalı get_features/get_modeling_frame, build_all | ~800 |
| src/discovery/ (envelope, llm, text_envelope) | M1 koşul zarfları (tablolardan + LLM metinden, alıntı doğrulamalı), EVREN LLM istemcisi | ~470 |
| src/prediction/ (datasets, cards) | 4 modelleme veri seti (+ censoring etiketi), veri kartları, CSV/Parquet çıktı | ~400 |
| tests/ (data_layer, discovery, prediction, delivery + plancheck) | 616 test | - |
| data_analysis/Nasa_data/{ingest,audit,analysis,meta} | PSI indirme/denetim scriptleri, 11 harmonize parquet (analysis/data), 11 EDA script (00-09), REPORT.md, meta/*.parquet (files 27076 satır, investigations, publications, inv_envelope_text) + llm_cache (9 json) | - |
| design/flamesense_box/ | Blender .blend + 4 render PNG + plan MD (temsili donanım v3) | - |
| docs/ (datasets/*.md+json veri kartları, decisions/002, evidence/) | belgeler | - |
| plans/00-06, Architecture.md (381), README.md (97), CLAUDE.md (22) | planlar | - |
| .github/workflows/tests.yml | CI: tek pytest işi, py3.11 | 40 |
| .streamlit/config.toml, requirements.txt | kök requirements = 200 satır pip freeze (jupyter, fastapi, opencv, pymavlink, scapy dahil; plotly/streamlit 1.67 pinli) | - |
Plan ilerlemesi (kutular): 00: 22/22 | 01: 3/21 | 02: 4/26 | 03: 0/14 | 04: 0/9 | 05: 0/12 | 06: 2/14. (plans/README.md tablosu ile `grep -c` sayıları uyuşuyor.)
Yok olanlar: src/insight/, src/flamesense, edge/, models/, tests/app, tests/flamesense, data/processed/, src/cv.py, src/features.py, src/train.py.

## 2) Ne çalışıyor (kanıtlı)
- `pytest tests -x -q -m "not needs_raw and not slow and not live"` (timeout 300) -> `610 passed, 6 deselected in 33.18s`. `pytest tests --collect-only -q` -> 616 tests collected. (skip/xfail görülmedi; CI aynı filtre.)
- Import kontrolü src.* : data_layer.build_all vb. içe aktarılıyor (STEPS, step_feature_store, step_meta_db...). Data layer, discovery envelope, prediction datasets/cards testleri geçiyor (610 passed kapsamında).
- Commit'li veri: meta/files.parquet 27076x12, 4 meta tablosu, 11 analysis parquet, 4 modelleme seti üreticisi; raw/ gerekmeden testler çalışıyor.
- CI yapılandırması testli (tests/delivery/test_ci_config.py), ilk yeşil run kanıtı docs/evidence/ci_first_green.md.

## 3) Ne yarım/kırık (kanıtlı)
- **app/ bu ortamda çalıştırılamıyor:** `AppTest`/`import streamlit` -> `ModuleNotFoundError: No module named 'streamlit'` (nasa_hack env). plotly da yok. Görevdeki "streamlit aynı bin/ altında" varsayımı YANLIŞ; kurulum gerekir (`pip install streamlit plotly`).
- **app/ temiz checkout'ta kırık:** `app/core/models.py:41-42` `import cv as team_cv` ve `import features as team_features` (src/cv.py, src/features.py bekliyor). `ls src/cv*` yok; `git log --all -- src/cv.py src/features.py src/train.py` boş -> bu dosyalar git geçmişinde hiç yok. Kanıt: `python -c "import app.core.models"` -> `ModuleNotFoundError: No module named 'cv'`. Dolayısıyla models.py'ye bağlı tüm sayfalar (state.model() streamlit_app.py:~64 ve views/ai) açılmaz. README "app ✅ Çalışıyor" iddiası doğrulanamadı (streamlit yok; ayrıca bu bağımlılık eksik).
- app veri yolu `data/processed/bass2_clean.csv` (config.py:15) ve `models/` yok (`ls data models` -> No such file). Kod simülasyon/vekil RandomForest'a düşüyor (README ve core/data.py), ama yukarıdaki cv/features importu bunu engelliyor.
- app/ yalnızca BASS-II; src/ modüllerine (data_layer, discovery, prediction) hiç bağlı değil (grep'te app içinde `src.`/duckdb yok; app testi yok -> tests/app yok).
- M1: 3/21 (A1-A3 zarf; skor/sıralama, TF-IDF yok). M2: 4/26 (veri setleri var; model, AD, kNN, senaryo motoru YOK). M3: 0/14 (kod yok). FlameSense: 0/9 yazılım; yalnızca Blender modeli. Dashboard: 0/12.
- Plan çelişkileri: plans/README.md kural 9 "Commit yalnızca istendiğinde" vs CLAUDE.md "otomatik commit". Architecture.md video güncellenmedi (002 kararı uyarınca).
- Plan açık sorunları: 7 investigation dosya listesi eksik; smoke ground eşlemesi doğrulanmadı; PSI-21 fuel_bottle artıkları; 9 şüpheli satır (02/Durum).
- Kök requirements.txt pip freeze (Windows paketleri pywinpty, jupyter vb.) ve BOM'lu (başında U+FEFF); plans/*/requirements.txt CI'da kullanılıyor.
- Untracked: .claude/agents/*, .orchestrator/, test.txt (boş/önemsiz).

## 4) Video/mp4 bağımlılıkları (`grep -rniE "video|mp4|ffmpeg|presign"`, raw/csv/figures/llm_cache hariç)
Kod: **video/ffmpeg/presign kodu yok** (src/data_layer/video_index.py a68717d'de eklenip e3abe29'da silindi; `git show a68717d` ile geri alınır). app/ içinde eşleşme yok.
Dosya:satır
- Architecture.md: 11, 19, 20, 47, 58, 116, 123, 157, 192-225 (§3.5 tüm bölüm), 355, 376, 378, 382 (002 kaydı da aynı listeyi veriyor; güncellenmedi).
- plans/00_data_layer/PLAN.md: 130-155 (Faz E, E1-E5 iptal çizili), 113 (not).
- plans/02_m2_prediction/PLAN.md: 19, 167, 180-187 (G3, G4, G5 iptal), 193.
- plans/01_m1_discovery/PLAN.md:90; plans/05_backend_dashboard/PLAN.md:60, 95; plans/06_delivery/PLAN.md:68 (not), 82-86 (D3/D4 = yarışma sunum videosu; deney videosu değil, KORUNUYOR); plans/04_flamesense/PLAN.md:129 (iptal edilmiş adım).
- plans/02_m2_prediction/requirements.txt:7 (yorum: requests/ffmpeg kaldırıldı).
- docs/decisions/002-video-out-of-scope.md:1-43.
- tests/data_layer/test_metadata.py:46-47, 158-160, 212 (855 .mp4 sayımı; `files` tablosu testi — video indeksi değil, dosya listesi sayımı; MVP'de silinirse test güncellenmeli), tests/fixtures/make_detail_fixture.py:5,18 ve tests/fixtures/detail_PSI-25.json:13-24 (fixture'da .mp4 dosya kaydı).
- data_analysis/.../REPORT.md:121 ve scripts/09_build_report.py:104 ("BASS/BASS-II yalnızca video" notu).
- Veri: meta/files.parquet'te 1403 .mp4 + 959 .ts satırı (yalnız dosya adı/boyut metadatası, video indirilmedi). Kök requirements.txt'de opencv-python==5.0.0.93 (kod import etmiyor; app/core/models.py'deki `cv` OpenCV değil, takım modülü).

## 5) MVP için yeniden kullanılabilir parçalar
- src/data_layer (store/features/frame/metadata): tam, testli, DuckDB view + leakage korumalı okuma; `build_all` tek komut.
- src/prediction/datasets.py + cards.py: 4 hazır, etiketli modelleme veri seti (docs/datasets/*.md|json kartları) -> doğrudan model eğitimine hazır.
- src/discovery/envelope.py + text_envelope.py + meta/inv_envelope_text.parquet (+review.csv, llm_cache): 24 investigation için koşul zarfı; LLM çağrısı gerekmeden önceden üretilmiş.
- meta/*.parquet (investigations, publications DOI'li, files) ve analysis/data/*.parquet (11 tablo), analysis/outputs/*.csv|json (group_effects_numbers.json, assoc_*, target_candidates, model_recommendations): M3 bulgu kartları için sayı kaynağı. EDA bulguları: FLEX d² yasası (n=2.13), BASS-II stokiyometri, smoke Simpson paradoksu.
- app/ UI iskeleti: theme, charts, components, i18n (EN/TR), çok sayfalı navigasyon (mission, procedures, flammability, archive, ai, system); core/physics.py, risk.py, procedures.py, simulator.py. models.py'deki cv/features bağımlılığı çıkarılırsa kullanılabilir.
- design/flamesense_box render PNG'leri (sunum için), docs/datasets kartları.
- tests/ altyapısı + plancheck.py + CI workflow (yeşil).

## 6) Modül durumu ve dış servis ihtiyacı
| Modül | Durum | Dış servis/anahtar |
|---|---|---|
| Veri katmanı (00) | 22/22 tamam | Yok (raw/ yalnız yeniden üretim için; commit'li meta ile testler çalışır) |
| M1 Keşif & Sıralama | 3/21: yalnızca koşul zarfı (tablolardan + incelenmiş LLM metin zarfı). Skor, sıralama, TF-IDF, UI yok | LLM adımları (A2, E1-E4): EVREN API, kök `.env` içinde `API_KEY` (var, 63 byte, gitignore'lu; içeriğe bakılmadı), isteğe bağlı LLM_BASE_URL/LLM_MODEL (varsayılan https://evren-llmapi.ssyz.org.tr/v1, deepseek-v4.1-flash); hesap sahibinin kullanım şartı onayı. Üretilmiş çıktılar commit'li, çalışma zamanında çağrı gerekmez. |
| M2 Tahmin | 4/26: yalnızca veri setleri + kartlar. Model, belirsizlik, AD, kNN, senaryo motoru yok | Yok |
| M3 Ekipman | 0/14, kod yok | Yok (sayılar EDA çıktılarından) |
| FlameSense | 0/9 yazılım; Blender temsili model var | Yok (donanım iptal) |
| LLM/RAG | RAG yok. Yalnızca src/discovery/llm.py istemcisi (offline üretim, app import etmez; app'te anahtar/http kullanımı yok, grep) | EVREN API_KEY (yukarıdaki) |
| app (BASS-II dashboard) | Kod var ama çalışmıyor (bkz. 3) | Yok |

## 7) Mevcut arayüz
Streamlit (app/streamlit_app.py, st.navigation + özel sidebar, EN/TR dil seçici, ?lang=TR). Sayfalar: views/mission.py (Mission, varsayılan), procedures.py (Procedures/yangın söndürme), flammability.py, archive.py, ai.py (AI Insights: model kartı, what-if, toplu tahmin), system.py (Veri & Model Durumu). Bölümler: ops / analysis / system. Header "BASS-II · PSI-25 · ISS MSG".
Import durumu: streamlit_app.py import edilemiyor (`ModuleNotFoundError: No module named 'streamlit'` bu env'de) ve streamlit kurulsa bile app.core.models `cv`/`features` modüllerinde düşer. Sayfalar src/data_layer, discovery, prediction'ı hiç import etmiyor. Beklenen sayfalar (Keşif|Senaryo|Ekipman|Canlı, plan 05) mevcut değil; plan 05 0/12 ve tests/app yok.
