"""Çoklu dil desteği (EN / TR).

Tüm arayüz metinleri bu dosyadadır; views/ ve core/ yalnızca anahtar kullanır.

* ``t(key, **params)`` — aktif dilde metin. Parametre verilirse ``str.format``
  uygulanır (metindeki gerçek süslü parantezler ``{{ }}`` ile kaçırılır).
  Parametresiz çağrılar biçimlendirilmez; Plotly ``%{x}`` şablonları bu sayede
  güvenle saklanır.
* ``tv(prefix, value)`` — veri değerlerinin (malzeme, geometri, sonuç…) görüntü
  etiketi. Sözlükte yoksa değer olduğu gibi döner; böylece ekibin gerçek
  verisindeki serbest metinler bozulmaz.

Aktif dil ``st.session_state["lang"]`` değeridir (kenar çubuğundaki seçici);
Streamlit dışında (testler, core/) varsayılan İngilizcedir.
"""
from __future__ import annotations

LANGUAGES = {"en": "EN", "tr": "TR"}
DEFAULT_LANG = "en"

# key -> (English, Türkçe)
STRINGS: dict[str, tuple[str, str]] = {
    # ------------------------------------------------------------------ nav --
    "nav.ops": ("Operations", "Operasyon"),
    "nav.analysis": ("Analysis", "Analiz"),
    "nav.system": ("System", "Sistem"),
    "page.mission": ("Mission Control", "Görev Kontrol"),
    "page.procedures": ("Suppression Protocol", "Söndürme Protokolü"),
    "page.flammability": ("Flammability Boundary Map", "Yanabilirlik Sınır Haritası"),
    "page.archive": ("ISS Test Archive", "ISS Deney Arşivi"),
    "page.ai": ("AI Insights", "YZ Çıkarımları"),
    "page.system": ("Data & Model Status", "Veri ve Model Durumu"),
    "eyebrow.ops": ("Operations", "Operasyon"),
    "eyebrow.analysis": ("Analysis", "Analiz"),
    "eyebrow.system": ("System", "Sistem"),
    "sidebar.csv_hint": (
        "Real flight data is used automatically once `data/processed/bass2_clean.csv` is added.",
        "`data/processed/bass2_clean.csv` eklendiğinde gerçek uçuş verisi otomatik kullanılır."),
    "sidebar.refresh": ("Reload data / models", "Veriyi / modelleri yenile"),
    "spinner.data": ("Loading test archive…", "Arşiv yükleniyor…"),
    "spinner.model": ("Preparing model…", "Model hazırlanıyor…"),

    # --------------------------------------------------------------- badges --
    "badge.real": ("ISS FLIGHT DATA · {n} TESTS", "GERÇEK ISS VERİSİ · {n} TEST"),
    "badge.sim": ("SIMULATED · {n} TESTS", "SİMÜLASYON · {n} TEST"),
    "badge.model": ("MODEL · {name}", "MODEL · {name}"),
    "badge.surrogate": ("SURROGATE MODEL", "VEKİL MODEL"),
    "badge.scenario": ("SCENARIO · O₂ {o2:.1f}% · U {u:.1f} cm/s", "SENARYO · O₂ {o2:.1f}% · U {u:.1f} cm/s"),
    "model.surrogate_name": ("Surrogate RandomForest (src/train.py pipeline)",
                             "Vekil RandomForest (src/train.py hattı)"),

    # ---------------------------------------------------- status & levels --
    "st.critical": ("critical threshold exceeded", "kritik eşik aşıldı"),
    "st.approaching": ("approaching threshold", "eşiğe yaklaşıyor"),
    "st.below": ("below threshold", "eşiğin altında"),
    "st.no_data": ("no data", "veri yok"),
    "banner.score": ("RISK SCORE / 100", "RİSK SKORU / 100"),
    "level.nominal": ("NOMINAL", "NOMİNAL"),
    "level.caution": ("CAUTION", "DİKKAT"),
    "level.warning": ("WARNING", "UYARI"),
    "level.critical": ("CRITICAL", "KRİTİK"),
    "level.nominal.msg": ("Flame cannot be sustained under these conditions. Routine monitoring is sufficient.",
                          "Bu koşullarda alev sürdürülemez. Rutin izleme yeterli."),
    "level.caution.msg": ("Flame is near the flammability limit; small changes in conditions could sustain combustion.",
                          "Alev sınıra yakın; koşullardaki küçük değişimler yanmayı başlatabilir."),
    "level.warning.msg": ("Combustion is sustainable and presents hazards that ground testing does not predict.",
                          "Yanma sürdürülebilir ve yer testleriyle öngörülemeyen tehlikeler mevcut."),
    "level.critical.msg": ("Hardware-damage or toxic-gas threshold exceeded. Stand by for the suppression protocol.",
                           "Donanım hasarı veya toksik gaz eşiği aşılıyor. Söndürme prosedürünü hazırlayın."),
    "src.physics": ("Physics", "Fizik"),
    "src.archive": ("Archive", "Arşiv"),
    "src.model": ("Model", "Model"),
    "src.procedure": ("Procedure", "Prosedür"),

    # ---------------------------------------------------------- data values --
    "outcome.burning": ("Sustained burning", "Yanmaya devam"),
    "outcome.extinguished": ("Extinguished", "Söndü"),
    "regime.quiescent": ("quiescent (diffusion-limited)", "durgun (difüzyon sınırlı)"),
    "regime.radiative": ("radiative quenching branch", "radyatif sönme kolu"),
    "regime.blowoff": ("blowoff extinction branch", "üfleme ile sönme kolu"),
    "geo.sphere": ("Sphere", "Küre"),
    "geo.cylinder": ("Cylinder", "Silindir"),
    "geo.flat": ("Flat slab", "Düz levha"),
    "geo.unknown": ("Unknown", "Bilinmiyor"),
    "mat.Cotton/Fiberglass fabric": ("Cotton/Fiberglass fabric", "Kumaş (Pamuk/Cam elyaf)"),
    "mat.unknown": ("Unknown", "Bilinmiyor"),
    "atm.iss": ("ISS nominal (21% / 101.3 kPa)", "ISS nominal (21% / 101.3 kPa)"),
    "atm.exploration": ("Exploration atmosphere (34% / 56.5 kPa · 8.2 psia)",
                        "Keşif atmosferi (34% / 56.5 kPa · 8.2 psia)"),
    "atm.gateway": ("Gateway / Artemis (26.5% / 70.3 kPa · 10.2 psia)",
                    "Gateway / Artemis (26.5% / 70.3 kPa · 10.2 psia)"),
    "atm.bass_low_o2": ("BASS-II low-O₂ test (16% / 101.3 kPa)", "BASS-II düşük O₂ testi (16% / 101.3 kPa)"),
    "atm.bass_limit": ("BASS-II near-limit test (14% / 101.3 kPa)", "BASS-II sınır testi (14% / 101.3 kPa)"),
    "atm.custom": ("Custom", "Özel"),
    "flowmode.velocity": ("Flow velocity", "Akış hızı"),
    "flowmode.pot": ("Fan pot", "Fan Pot"),
    "flowmode.volts": ("Fan voltage", "Fan voltajı"),
    "unit.points": ("pts", "puan"),
    "unit.tests": ("tests", "test"),
    "unit.x_earth": ("× Earth", "× Dünya"),

    # --------------------------------------------------------------- labels --
    "lbl.scenario": ("Cabin scenario", "Senaryo"),
    "lbl.o2": ("O₂ [% vol]", "O₂ [% hacim]"),
    "lbl.pressure": ("Total pressure [kPa]", "Toplam basınç [kPa]"),
    "lbl.flow_input": ("Flow input", "Akış girişi"),
    "lbl.fan_pot": ("Fan potentiometer (Restrictor 2)", "Fan potansiyometre (Restrictor 2)"),
    "lbl.fan_volts": ("Fan voltage [V]", "Fan voltajı [V]"),
    "lbl.velocity": ("Flow velocity U [cm/s]", "Akış hızı U [cm/s]"),
    "lbl.material": ("Material", "Malzeme"),
    "lbl.geometry": ("Geometry", "Geometri"),
    "lbl.radius": ("Characteristic radius r [cm]", "Karakteristik yarıçap r [cm]"),
    "lbl.thickness": ("Thickness [cm]", "Kalınlık [cm]"),
    "lbl.pot": ("Potentiometer", "Potansiyometre"),
    "fan.zero": ("zero-flow threshold", "sıfır akış eşiği"),
    "fan.extrap": ("extrapolated", "ekstrapolasyon"),
    "fan.range": ("measured {range}", "ölçüm {range}"),
    "fan.table": ("calibration table", "kalibrasyon tablosu"),
    "fan.zero_band": ("zero flow", "sıfır akış"),
    "fan.band": ("measured range", "ölçüm aralığı"),
    "fan.nominal": ("nominal", "nominal"),
    "fan.range_hover": ("range", "aralık"),
    "fan.cal_point": ("calibration point", "kalibrasyon noktası"),
    "fan.selection": ("selection", "seçim"),
    "col.test_id": ("Test ID", "Test ID"),
    "col.sample": ("Sample", "Numune"),
    "col.material": ("Material", "Malzeme"),
    "col.geometry": ("Geometry", "Geometri"),
    "col.outcome": ("Outcome", "Sonuç"),
    "col.o2_init": ("Initial O₂ %", "O₂ başl. %"),
    "col.o2_final": ("Final O₂ %", "O₂ son %"),
    "col.margin": ("Margin", "Marj"),
    "col.ign_s": ("Ignition s", "Tutuşma s"),
    "col.dur_s": ("Duration s", "Süre s"),

    # ---------------------------------------------------------- chart text --
    "chart.goldilocks": ("Goldilocks 1–5 cm/s", "Goldilocks 1–5 cm/s"),
    "chart.olson_limit": ("Olson limit", "Olson sınırı"),
    "chart.earth_loi": ("Earth PMMA extinction limit {v}%", "Dünya PMMA sönme eşiği {v}%"),
    "chart.scenario": ("Scenario", "Senaryo"),
    "chart.flammable": ("FLAMMABLE", "YANICI"),
    "chart.extinguishes": ("EXTINGUISHES", "SÖNER"),
    "chart.ucurve_title": ("U-shaped flammability boundary · r = {r:.3f} cm",
                           "U-şekilli yanabilirlik sınırı · r = {r:.3f} cm"),
    "hover.u_limit": ("U = %{x:.2f} cm/s<br>Limit = %{y:.2f}% O₂", "U = %{x:.2f} cm/s<br>Sınır = %{y:.2f}% O₂"),
    "hover.a_limit": ("a = %{x:.2f} s⁻¹<br>Limit = %{y:.2f}%", "a = %{x:.2f} s⁻¹<br>Sınır = %{y:.2f}%"),
    "hover.most_dangerous": ("Most hazardous flow<br>U* = %{x:.2f} cm/s<br>%{y:.2f}% O₂",
                             "En tehlikeli akış<br>U* = %{x:.2f} cm/s<br>%{y:.2f}% O₂"),
    "hover.scenario": ("Scenario<br>U = %{x:.2f} cm/s<br>O₂ = %{y:.2f}%",
                       "Senaryo<br>U = %{x:.2f} cm/s<br>O₂ = %{y:.2f}%"),
    "hover.margin": ("margin", "marj"),
    "axis.velocity": ("Flow velocity U [cm/s]", "Akış hızı U [cm/s]"),
    "axis.o2_vol": ("O₂ [% vol]", "O₂ [% hacim]"),
    "axis.o2_pct": ("O₂ [%]", "O₂ [%]"),
    "axis.o2_initial": ("Initial O₂ [% vol]", "Başlangıç O₂ [% hacim]"),
    "axis.strain_log": ("Stretch rate a [s⁻¹] (log)", "Gerilme hızı a [s⁻¹] (log)"),
    "axis.limit_o2": ("Limiting O₂ [%]", "Sınır O₂ [%]"),
    "axis.test_count": ("Test count", "Test sayısı"),
    "axis.time": ("Time [s]", "Zaman [s]"),
    "axis.ignition_s": ("Ignition delay [s]", "Tutuşma süresi [s]"),
    "axis.fpr": ("False positive rate", "Yanlış pozitif oranı"),
    "axis.tpr": ("True positive rate", "Doğru pozitif oranı"),
    "axis.p_burn": ("P(sustained burning)", "P(yanma sürer)"),
    "axis.flow_speed": ("Flow velocity [cm/s]", "Akış hızı [cm/s]"),

    # ------------------------------------------------------ mission control --
    "mission.eyebrow": ("Mission Control", "Görev Kontrol"),
    "mission.title": ("Cabin fire risk assessment", "Kabin yangın riski analizi"),
    "mission.subtitle": (
        "Set the cabin atmosphere, ventilation and material. The system fuses the Olson flammability "
        "boundary, 129 ISS tests and the ML model into a risk level with traceable insights.",
        "Kabin atmosferini, havalandırmayı ve malzemeyi seçin; sistem Olson sınırı, 129 ISS deneyi "
        "ve ML modelini birleştirerek risk seviyesini ve gerekçeli çıkarımları üretir."),
    "mission.sec_atmosphere": ("Cabin atmosphere", "Kabin atmosferi"),
    "mission.sec_ventilation": ("Ventilation", "Havalandırma"),
    "mission.sec_material": ("Material", "Malzeme"),
    "mission.sec_insights": ("AI-assisted fire safety insights", "Yapay zekâ destekli çıkarımlar"),
    "mission.flow_caption": ("U = **{u:.2f} cm/s** · Pot ≈ {pot:.2f} · {v:.2f} V · _{note}_",
                             "U = **{u:.2f} cm/s** · Pot ≈ {pot:.2f} · {v:.2f} V · _{note}_"),
    "mission.neighbors": ("{n} physically closest ISS tests", "Fiziksel olarak en yakın {n} ISS deneyi"),
    "kpi.olson_limit": ("Olson limit", "Olson sınırı"),
    "kpi.margin": ("Margin to limit", "Sınıra uzaklık"),
    "kpi.margin_sub": ("cabin O₂ − limit", "kabin O₂ − sınır"),
    "kpi.margin_critical": ("flammable region", "yanıcı bölge"),
    "kpi.margin_warning": ("limit band", "sınır bandı"),
    "kpi.margin_good": ("extinguishes", "söner"),
    "kpi.ignition": ("Ignition delay", "Tutuşma gecikmesi"),
    "kpi.ignition_sub": ("heuristic · Earth test 25 s", "sezgisel · Dünya testi 25 s"),
    "kpi.ignition_over": ("exceeds 25 s", "25 s'yi aşıyor"),
    "kpi.ignition_within": ("within 25 s", "25 s içinde"),
    "kpi.ignition_none_sub": ("sustained ignition not expected", "sürekli tutuşma beklenmiyor"),
    "kpi.ignition_none": ("no ignition", "tutuşmaz"),
    "kpi.hrr_est": ("Estimated HRR", "Tahmini HRR"),
    "kpi.hrr_est_sub": ("nearest tests · Huggett", "komşu deneyler · Huggett"),
    "kpi.co_expected": ("Expected CO", "Beklenen CO"),
    "kpi.co_sat_sub": ("sensor saturation {v:.0f} ppm", "sensör doyumu {v:.0f} ppm"),
    "kpi.co_factor": ("CO yield factor", "CO çarpanı"),
    "kpi.co_factor_sub": ("incomplete combustion · heuristic", "eksik yanma · sezgisel"),
    "kpi.p_burn": ("Burning probability", "Yanma olasılığı"),
    "kpi.p_burn_sub": ("physics (Olson margin)", "fizik (Olson marjı)"),
    "kpi.p_ext_model": ("Model: extinction", "Model: sönme"),
    "kpi.model_trained": ("trained model", "eğitilmiş model"),
    "kpi.model_surrogate": ("surrogate model", "vekil model"),

    # ------------------------------------------------------------- insights --
    "ins.flammable.title": ("Flame sustainable: {margin:.2f} pts above the limit",
                            "Alev sürdürülebilir: sınırın {margin:.2f} puan üzerinde"),
    "ins.flammable.body": (
        "For r = {r:.3f} cm and U = {u:.1f} cm/s the Olson limit is {limit:.2f}% O₂. "
        "The cabin at {o2:.1f}% O₂ is above this boundary.",
        "r = {r:.3f} cm ve U = {u:.1f} cm/s için Olson sınırı %{limit:.2f} O₂. "
        "Kabin %{o2:.1f} O₂ ile bu sınırın üzerinde."),
    "ins.not_flammable.title": ("{margin:.2f} pts below the limit — flame cannot be sustained",
                                "Sınırın {margin:.2f} puan altında — alev sürdürülemez"),
    "ins.not_flammable.body": ("At this flow and geometry at least {limit:.2f}% O₂ is required to sustain combustion.",
                               "Bu akış/geometride yanmanın sürmesi için en az %{limit:.2f} O₂ gerekir."),
    "ins.earth_safe_space_burn.title": ("Safe on Earth, flammable in orbit", "Dünya'da güvenli, uzayda yanıcı"),
    "ins.earth_safe_space_burn.body": (
        "{o2:.1f}% O₂ is below PMMA's {earth}% normal-gravity extinction limit, yet in {lo:.0f}–{hi:.0f} cm/s "
        "ventilation microgravity flames persist down to {microg}%. Ground-test results do not cover this scenario.",
        "%{o2:.1f} O₂, PMMA'nın Dünya'daki %{earth} sönme eşiğinin altında; ancak {lo:.0f}–{hi:.0f} cm/s "
        "havalandırmada mikro-yerçekiminde yanma %{microg}'e kadar sürer. Yer testi sonuçları bu senaryo için geçersizdir."),
    "ins.regime_quiescent.title": ("Regime: quiescent (diffusion-limited)", "Rejim: durgun (difüzyon sınırlı)"),
    "ins.regime_quiescent.body": (
        "Near-zero flow: the flame is fed by diffusion only and loses heat by radiation. "
        "Cutting the flow (Step 9.6) drives the flame into this regime to extinguish it.",
        "Akış neredeyse sıfır: alev yalnızca difüzyonla beslenir ve radyasyonla ısı kaybeder. "
        "Akışı kesmek (Step 9.6) bu rejime geçirerek söndürmeyi hedefler."),
    "ins.regime_radiative.title": ("Regime: radiative quenching branch", "Rejim: radyatif sönme kolu"),
    "ins.regime_radiative.body": (
        "Left branch of the U-curve. Increasing the flow will first STRENGTHEN the flame; the most hazardous "
        "velocity is ≈ {u_star:.1f} cm/s (minimum limit {min_lim:.2f}%).",
        "U-eğrisinin sol kolu. Akışı artırmak alevi önce GÜÇLENDİRİR; en tehlikeli hız "
        "≈ {u_star:.1f} cm/s (minimum sınır %{min_lim:.2f})."),
    "ins.regime_blowoff.title": ("Regime: blowoff extinction branch", "Rejim: üfleme ile sönme kolu"),
    "ins.regime_blowoff.body": (
        "Right branch of the U-curve: residence time is shrinking, so increasing the flow helps blow the flame off.",
        "U-eğrisinin sağ kolu: kalış süresi kısalıyor, akışı artırmak alevi üfleyerek söndürmeye yardım eder."),
    "ins.goldilocks.title": ("Goldilocks zone", "Goldilocks bölgesi"),
    "ins.goldilocks.body": (
        "{u:.1f} cm/s is in the range where cabin ventilation feeds the flame best. Incomplete combustion "
        "raises CO yield to ≈{co_factor:.1f}× the Earth value (heuristic model).",
        "{u:.1f} cm/s, kabin havalandırmasının alevi en iyi beslediği aralıkta. Eksik yanma nedeniyle "
        "CO üretimi Dünya'nın ≈{co_factor:.1f} katı (sezgisel model)."),
    "ins.ignition_delay.title": ("Ignition delay ≈ {t:.0f} s", "Tutuşma gecikmesi ≈ {t:.0f} s"),
    "ins.ignition_delay.body": (
        "Exceeds the {std:.0f} s igniter duration of NASA-STD-6001 Test 1. A material that passes as "
        "'non-igniting' on the ground may heat up and ignite in orbit after up to {max:.0f} s.",
        "NASA-STD-6001 Test 1'in {std:.0f} s tutuşturucu süresini aşıyor. Malzeme yer testinde "
        "'tutuşmaz' görünüp uzayda {max:.0f} s'ye kadar ısınarak tutuşabilir."),
    "ins.material_scope.title": ("Model scope", "Model kapsamı"),
    "ins.material_scope.body": ("The Olson correlation is calibrated for PMMA; for {material} the limit is approximate.",
                                "Olson denklemi PMMA için kalibre edilmiştir; {material} için sınır yaklaşık değerdir."),
    "ins.low_pressure.title": ("Reduced pressure / enriched O₂: ppO₂ = {ppo2:.1f} kPa",
                               "Düşük basınç / yüksek O₂: pO₂ = {ppo2:.1f} kPa"),
    "ins.low_pressure.body": (
        "The Olson limit is expressed as mole fraction at 1 atm. The elevated O₂ fraction of exploration "
        "atmospheres markedly increases flammability; HRR was scaled with pressure.",
        "Olson sınırı 1 atm mol kesri cinsindendir. Keşif atmosferlerinde O₂ oranının yüksekliği "
        "yanıcılığı belirgin biçimde artırır; HRR basınçla ölçeklendi."),
    "ins.neighbors.title": ("{n_burn} of the {n} closest ISS tests sustained burning",
                            "En yakın {n} ISS deneyinin {n_burn}'i yanmaya devam etti"),
    "ins.neighbors.body": ("Tests at similar margin and stretch rate: {ids}.",
                           "Benzer marj ve gerilme hızındaki deneyler: {ids}."),
    "ins.hrr_window.title": ("Estimated HRR ≈ {hrr:.0f} W — MSG window hazard",
                             "Tahmini HRR ≈ {hrr:.0f} W — MSG camı riski"),
    "ins.hrr_window.body": ("Exceeds the ~{thr:.0f} W level that damaged the MSG front window in test M5.",
                            "M5 deneyinde ön cama hasar veren ~{thr:.0f} W eşiği aşılıyor."),
    "ins.co_saturation.title": ("CO sensor may saturate", "CO sensörü doyuma ulaşabilir"),
    "ins.co_saturation.body": (
        "Similar tests reached CO ≥ {thr:.0f} ppm; the true concentration cannot be read. "
        "Do not shorten the Step 10.4 purge.",
        "Benzer deneylerde CO ≥ {thr:.0f} ppm. Gerçek değer okunamaz — "
        "Step 10.4 temizlik süresini kısaltmayın."),
    "ins.model_agree.title": ("Model: extinction probability {p:.0f}%", "Model: sönme olasılığı %{p:.0f}"),
    "ins.model_agree.body": ("Model and physics reach the same conclusion.", "Model ve fizik aynı sonuca varıyor."),
    "ins.model_conflict.title": ("Model: extinction probability {p:.0f}% — conflicts with physics",
                                 "Model: sönme olasılığı %{p:.0f} — fizikle çelişiyor"),
    "ins.model_conflict.body": (
        "The ML prediction contradicts the Olson boundary; the scenario may lie outside the training data. "
        "Base the decision on the physical limit and review the neighbouring archive tests.",
        "ML tahmini Olson sınırıyla çelişiyor; senaryo eğitim verisinin dışında olabilir. "
        "Karar için fiziksel sınırı esas alın ve arşivdeki komşu deneyleri inceleyin."),
    "ins.fan_off_ok.title": ("Cutting the flow should suffice", "Akışı kesmek yeterli olmalı"),
    "ins.fan_off_ok.body": (
        "Quiescent limit is {q:.1f}%; the cabin at {o2:.1f}% O₂ is below it. Once forced O₂ transport stops "
        "the flame is expected to extinguish.",
        "Sıfır akışta sınır %{q:.1f}; kabin %{o2:.1f} O₂ bunun altında. "
        "Alevin O₂ taşınımıyla beslenmesi kesildiğinde sönmesi beklenir."),
    "ins.gn2_ready.title": ("Stand by GN2", "GN2'yi hazırlayın"),
    "ins.gn2_ready.body": (
        "Cabin {o2:.1f}% O₂ is above the quiescent limit of {q:.1f}%: cutting the flow alone may not suffice. "
        "≈ {v:.0f} L of N₂ is needed to dilute to {target:.1f}% (250 L MSG, well-mixed dilution).",
        "Kabin %{o2:.1f} O₂, durgun sınır %{q:.1f}'in üzerinde: akışı kesmek tek başına yetmeyebilir. "
        "%{target:.1f}'e indirmek için ≈ {v:.0f} L N₂ (250 L MSG, iyi karışmış seyreltme)."),
    "ins.purge_full.title": ("Do not shorten the purge", "Temizlik süresini kısaltmayın"),
    "ins.purge_full.body": (
        "The CO sensor saturates at 1000 ppm, so the reading is only a lower bound on the true concentration. "
        "Execute Step 10.4 (3 min) and 10.5 (6 min) in full.",
        "CO sensörü 1000 ppm'de doyar; okunan değer gerçek konsantrasyonun alt sınırıdır. "
        "Step 10.4 (3 dk) ve 10.5 (6 dk) tam uygulanmalı."),

    # ------------------------------------------------------ flammability map --
    "flam.title": ("Flammability boundary map", "Yanabilirlik sınır haritası"),
    "flam.subtitle": (
        "In microgravity, flammability is not a single O₂ threshold but a U-shaped boundary that depends on "
        "flow velocity and sample size. Stretch rate a collapses different sizes and flows onto one curve.",
        "Mikro-yerçekiminde yanabilirlik tek bir O₂ eşiği değil, akış hızına ve numune boyutuna bağlı "
        "U-şekilli bir sınırdır. Gerilme hızı a, farklı boyut ve akışları tek bir eğri üzerinde birleştirir."),
    "flam.sec_earth_vs_space": ("Ground test vs. orbital reality", "Dünya testi ile uzay gerçeği"),
    "flam.kpi_loi": ("PMMA extinction O₂ limit", "PMMA sönme O₂ eşiği"),
    "flam.kpi_loi_sub": ("Earth (upward burning) → µg, 1–5 cm/s", "Dünya (yukarı yanma) → mikro-g, 1–5 cm/s"),
    "flam.kpi_loi_st": ("burns at lower O₂ in orbit", "uzayda daha düşük O₂'de yanar"),
    "flam.kpi_ign": ("Ignition time", "Tutuşma süresi"),
    "flam.kpi_ign_sub": ("NASA-STD-6001 Test 1 → BASS-II observation", "NASA-STD-6001 Test 1 → BASS-II gözlemi"),
    "flam.kpi_ign_st": ("ground test may report 'safe'", "yer testi 'güvenli' diyebilir"),
    "flam.kpi_co": ("CO yield", "CO üretimi"),
    "flam.kpi_co_sub": ("incomplete combustion near the limit", "sınır yakınında eksik yanma"),
    "flam.kpi_co_st": ("toxic gas hazard", "toksik gaz riski"),
    "flam.sec_archive": ("ISS tests against the Olson boundary", "ISS deneyleri Olson sınırına karşı"),
    "flam.scatter_title": ("Each point is one ISS test · outcome: extinguished / sustained",
                           "Her nokta bir ISS testi · sonuç: söndü / yanmaya devam"),
    "flam.kpi_agree": ("Boundary prediction accuracy", "Sınırın tahmin başarısı"),
    "flam.kpi_agree_sub": ("physics = observation in {n} tests", "{n} testte fizik = gözlem"),
    "flam.kpi_above_ext": ("Extinguished above the limit", "Sınır üstünde sönenler"),
    "flam.kpi_above_ext_sub": ("material / geometry effect or transient flame", "malzeme / geometri etkisi veya geçici alev"),
    "flam.kpi_blind": ("Safe on Earth, burned in orbit", "Dünya'da güvenli, uzayda yandı"),
    "flam.kpi_blind_sub": ("burned with O₂ < {v}%", "O₂ < {v}% iken yanma sürdü"),
    "flam.kpi_blind_st": ("ground-standard blind spot", "yer standardının kör noktası"),
    "flam.collapse_caption": (
        "The separation of points around the boundary shows that a single parameter a successfully "
        "collapses different flow velocities and sample sizes.",
        "Noktaların sınır çevresinde ayrışması, tek bir a parametresinin farklı akış ve "
        "numune boyutlarını başarıyla birleştirdiğini gösterir."),
    "flam.sec_size": ("Size effect and risk surface", "Boyut etkisi ve risk yüzeyi"),
    "flam.size_title": ("Larger sample → most hazardous flow velocity increases",
                        "Büyük numune → en tehlikeli akış hızı yükselir"),
    "flam.size_caption": ("Arrow labels mark the flow velocity giving the minimum limit (most hazardous) for each size [cm/s].",
                          "Ok etiketleri her boyut için minimum sınırı veren (en tehlikeli) akış hızını gösterir [cm/s]."),
    "flam.heat_radius": ("Radius r for the heat map [cm]", "Isı haritası için yarıçap r [cm]"),
    "flam.heat_title": ("O₂ margin · blue extinguishes, red burns", "O₂ marjı · mavi söner, kırmızı yanar"),
    "flam.equations": ("Equations and assumptions", "Denklemler ve varsayımlar"),
    "flam.equations_body": (
        "- Minimum limit: $a^* = 2\\ln(6\\cdot0.5/0.0167) = {a_star:.2f}\\,s^{{-1}}$, "
        "$X_{{O_2}}^{{min}} = {x_min:.2f}\\%$.\n"
        "- Quiescent limit ($a\\to0$): **{x0:.1f}%** — the source of the extinguishing power of cutting the flow (Step 9.6).\n"
        "- The correlation is calibrated for PMMA at 1 atm; other materials/pressures are approximate.",
        "- Minimum sınır: $a^* = 2\\ln(6\\cdot0.5/0.0167) = {a_star:.2f}\\,s^{{-1}}$, "
        "$X_{{O_2}}^{{min}} = {x_min:.2f}\\%$.\n"
        "- Sıfır akış limiti ($a\\to0$): **%{x0:.1f}** — akışı kesmenin (Step 9.6) söndürme gücü buradan gelir.\n"
        "- Denklem PMMA ve 1 atm için kalibre edilmiştir; diğer malzemeler/basınçlar yaklaşık değerdir."),

    # -------------------------------------------------------------- archive --
    "arch.title": ("ISS test archive", "ISS deney arşivi"),
    "arch.subtitle": (
        "Filter the BASS-II (PSI-25) tests, find those that exceed critical thresholds, and inspect a single "
        "test's oxygen consumption, heat release and CO accumulation.",
        "BASS-II (PSI-25) testlerini filtreleyin, kritik eşikleri aşanları bulun ve tek bir testin "
        "oksijen tüketimini, ısı salınımını ve CO birikimini inceleyin."),
    "arch.all": ("All", "Tümü"),
    "arch.o2_range": ("Initial O₂ [%]", "Başlangıç O₂ [%]"),
    "arch.flag": ("Flag", "Bayrak"),
    "arch.flag.any": ("Any", "Hepsi"),
    "arch.flag.hrr": ("HRR ≥ 100 W", "HRR ≥ 100 W"),
    "arch.flag.co": ("CO sensor saturation", "CO sensör doyumu"),
    "arch.flag.blind": ("Safe on Earth / burned in orbit", "Dünya'da güvenli / uzayda yandı"),
    "arch.flag.ign": ("Ignition > 25 s", "Tutuşma > 25 s"),
    "arch.kpi_tests": ("Tests", "Test"),
    "arch.kpi_tests_sub": ("filter result", "filtre sonucu"),
    "arch.kpi_ext_rate": ("Extinction rate", "Sönme oranı"),
    "arch.kpi_ext_rate_sub": ("self-extinguished", "kendiliğinden söndü"),
    "arch.kpi_hrr": ("HRR ≥ 100 W", "HRR ≥ 100 W"),
    "arch.kpi_hrr_sub": ("MSG window damage threshold", "MSG camı hasar eşiği"),
    "arch.kpi_hrr_st": ("M5 level", "M5 seviyesi"),
    "arch.kpi_hrr_ok": ("threshold not exceeded", "eşik aşılmadı"),
    "arch.kpi_co": ("CO saturation", "CO doyumu"),
    "arch.kpi_co_st": ("true value unknown", "gerçek değer bilinmiyor"),
    "arch.kpi_co_ok": ("within sensor range", "ölçüm aralığında"),
    "arch.kpi_blind": ("Ground-standard blind spot", "Yer standardı kör noktası"),
    "arch.kpi_blind_st": ("would extinguish on Earth", "Dünya'da sönerdi"),
    "arch.kpi_blind_ok": ("none", "yok"),
    "arch.sec_table": ("Tests · select a row to inspect", "Testler · incelemek için bir satır seçin"),
    "arch.download": ("Download filtered table (CSV)", "Filtrelenmiş tabloyu indir (CSV)"),
    "arch.detail": ("Test {id} · {mat} {geo} · r = {r:.3f} cm", "Test {id} · {mat} {geo} · r = {r:.3f} cm"),
    "arch.kpi_outcome": ("Outcome", "Sonuç"),
    "arch.kpi_regime": ("regime: {regime}", "rejim: {regime}"),
    "arch.flame_sustained": ("flame sustained", "alev sürdü"),
    "arch.flame_out": ("extinguished", "söndü"),
    "arch.kpi_margin_sub": ("limit {lim:.2f}% · a = {a:.1f}", "sınır {lim:.2f}% · a = {a:.1f}"),
    "arch.kpi_avg_hrr": ("Mean HRR", "Ortalama HRR"),
    "arch.kpi_avg_hrr_sub": ("{g:.2f} g O₂ · Huggett", "{g:.2f} g O₂ · Huggett"),
    "arch.co_saturated": ("SENSOR SATURATED", "SENSÖR DOYUMU"),
    "arch.olson_line": ("Olson limit {v:.2f}%", "Olson sınırı {v:.2f}%"),
    "arch.ignition_line": ("ignition {v:.0f} s", "tutuşma {v:.0f} s"),
    "arch.o2_title": ("MSG O₂ (reconstructed)", "MSG O₂ (yeniden yapılandırılmış)"),
    "arch.co_title": ("CO accumulation (reconstructed)", "CO birikimi (yeniden yapılandırılmış)"),
    "arch.co_sat_line": ("✕ sensor saturation 1000 ppm", "✕ sensör doyumu 1000 ppm"),
    "arch.reconstruct_caption": (
        "Time series are linearly reconstructed from start/end measurements; actual curves will be shown "
        "once raw telemetry is added.",
        "Zaman serileri, test başı/sonu ölçümlerinden doğrusal olarak yeniden yapılandırılmıştır; "
        "ham telemetri eklendiğinde gerçek eğriler gösterilecektir."),
    "arch.select_hint": ("Select a test in the table for detailed inspection and telemetry.",
                         "Detaylı inceleme ve telemetri için tablodan bir test seçin."),
    "arch.sec_dist": ("Distributions", "Dağılımlar"),
    "arch.std_line": ("NASA-STD-6001 · 25 s", "NASA-STD-6001 · 25 s"),
    "arch.ign_hist_title": ("Ignition delay", "Tutuşma gecikmesi"),
    "arch.m5_line": ("M5 window damage · 100 W", "M5 cam hasarı · 100 W"),
    "arch.hrr_hist_title": ("Mean heat release rate", "Ortalama ısı salınım hızı"),

    # ---------------------------------------------------------- AI insights --
    "ai.title": ("AI-assisted insights", "YZ destekli çıkarımlar"),
    "ai.subtitle": (
        "See what the model relies on, where it agrees with physics and where it diverges. "
        "Scenario values come from Mission Control.",
        "Modelin neye dayandığını, fizikle nerede uyuştuğunu ve nerede ayrıştığını görün. "
        "Senaryo değerleri Görev Kontrol sayfasından gelir."),
    "ai.kpi_model": ("Model", "Model"),
    "ai.trained": ("Trained", "Eğitilmiş"),
    "ai.surrogate": ("Surrogate", "Vekil"),
    "ai.from_models": ("loaded from models/", "models/ klasöründen"),
    "ai.auto_trained": ("models/ empty · auto-trained", "models/ boş · otomatik eğitildi"),
    "ai.auc_sub": ("GroupKFold · {k} folds", "GroupKFold · {k} kat"),
    "ai.no_meta": ("not in metadata", "meta veride yok"),
    "ai.kpi_acc": ("Accuracy @0.5", "Doğruluk @0.5"),
    "ai.kpi_features": ("Features", "Özellik sayısı"),
    "ai.features_sub": ("src/features.py pipeline", "src/features.py hattı"),
    "ai.leakage_title": ("Data leakage note (for the data science team)", "Veri sızıntısı notu (veri bilimi ekibi için)"),
    "ai.leakage_body": (
        "In the current feature set `O2_final`, `CO` and `CO2` are **post-test** measurements and indirectly "
        "encode the extinction outcome. They are fine for archive analysis, but unknown for forward-looking "
        "scenarios — the system fills them with the median of the physically closest tests. For mission "
        "planning, a separate model trained only on pre-test features (O₂, U, r, thickness, pressure) is "
        "recommended; the contract is on the System page.",
        "Mevcut özellik setinde `O2_final`, `CO`, `CO2` test **sonrası** ölçümlerdir; bunlar sönme sonucunu "
        "dolaylı olarak içerir. Arşiv analizi için uygundur, ancak ileriye dönük senaryo tahmininde "
        "bilinmezler — sistem bu değerleri fiziksel olarak en yakın deneylerin medyanıyla doldurur. Görev "
        "planlama için yalnızca test öncesi özelliklerle (O₂, U, r, kalınlık, basınç) eğitilmiş ayrı bir "
        "model önerilir; sözleşme Sistem sayfasındadır."),
    "ai.sec_explain": ("What is the model looking at?", "Model neye bakıyor?"),
    "ai.importance_title": ("Feature importance (normalized)", "Özellik önemi (normalize)"),
    "ai.no_importance": ("This model type does not expose built-in feature importance.",
                         "Bu model türü yerleşik özellik önemi sağlamıyor."),
    "ai.roc_oof": ("OOF ROC curve · AUC {auc:.3f}", "OOF ROC eğrisi · AUC {auc:.3f}"),
    "ai.roc_archive": ("ROC on archive (may include training data — optimistic)",
                       "Arşiv üzerinde ROC (eğitim verisi olabilir — iyimser)"),
    "ai.roc_failed": ("ROC could not be computed: {err}", "ROC hesaplanamadı: {err}"),
    "ai.sec_whatif": ("What-if · r = {r:.3f} cm, U = {u:.1f} cm/s, O₂ = {o2:.1f}%",
                      "Ne olur eğer · r = {r:.3f} cm, U = {u:.1f} cm/s, O₂ = {o2:.1f}%"),
    "ai.physics_series": ("Physics (Olson)", "Fizik (Olson)"),
    "ai.ml_series": ("ML model", "ML modeli"),
    "ai.scenario_marker": ("scenario", "senaryo"),
    "ai.whatif_o2": ("Probability of sustained burning vs. O₂", "Yanmanın sürme olasılığı · O₂'ye göre"),
    "ai.whatif_u": ("Probability of sustained burning vs. flow velocity", "Yanmanın sürme olasılığı · akış hızına göre"),
    "ai.whatif_caption": (
        "Where the two curves diverge, the model is either outside its training data or has learned effects "
        "the physical correlation does not capture — the most informative conditions for new ISS tests.",
        "İki eğrinin ayrıştığı bölgeler, modelin eğitim verisinin dışına çıktığı veya fizik denkleminin "
        "kapsamadığı etkileri öğrendiği yerlerdir — yeni ISS deneyleri için en bilgilendirici koşullar."),
    "ai.sec_batch": ("Batch prediction", "Toplu tahmin"),
    "ai.upload_label": ("Upload a scenario CSV (minimum: O2_initial, O2_final, CO2, CO, Thickness, Flow_Vel)",
                        "Senaryo CSV'si yükleyin (en az: O2_initial, O2_final, CO2, CO, Thickness, Flow_Vel)"),
    "ai.download": ("Download predictions", "Tahminleri indir"),
    "ai.batch_failed": ("Prediction failed: {err}", "Tahmin üretilemedi: {err}"),

    # ------------------------------------------------- suppression protocol --
    "proc.title": ("Suppression and recovery protocol", "Söndürme ve temizlik prosedürü"),
    "proc.subtitle": (
        "Execute the ISS BASS-II fire response steps in sequence. Each step carries a physics-based "
        "recommendation; timed steps show a countdown and every event is logged with mission elapsed time (MET).",
        "ISS BASS-II yangın müdahale adımlarını sırasıyla yürütün. Her adımda fizik tabanlı bir öneri, "
        "zamanlı adımlarda geri sayım ve görev zamanı (MET) damgalı olay kaydı tutulur."),
    "proc.sec_flow": ("Sequence", "Akış"),
    "proc.time_scale": ("Time scale", "Zaman ölçeği"),
    "proc.time_scale_help": ("Accelerates timed steps for demonstrations.", "Sunum için zamanlı adımları hızlandırır."),
    "proc.reset": ("Reset protocol", "Prosedürü sıfırla"),
    "proc.step_label": ("Step {code}", "Adım {code}"),
    "proc.btn_alarm": ("Flame detected — ALARM", "Alev tespit edildi — ALARM"),
    "proc.btn_start_96": ("Initiate Step 9.6: FAN FLOW = 0.00", "Step 9.6'yı başlat: FAN FLOW = 0.00"),
    "proc.btn_out": ("Flame out", "Alev söndü"),
    "proc.btn_not_out_fan": ("Not out → GN2 ENA ON", "Sönmedi → GN2 ENA ON"),
    "proc.btn_not_out_gn2": ("Still burning — continue GN2", "Hâlâ yanıyor — GN2 devam"),
    "proc.btn_manual": ("Complete step manually", "Adımı manuel tamamla"),
    "proc.done": ("Protocol complete. MSG is safe.", "Prosedür tamamlandı. MSG güvenli."),
    "proc.sec_advice": ("Physics-based recommendation", "Fizik tabanlı öneri"),
    "proc.sec_log": ("Event log", "Olay kaydı"),
    "proc.log_empty": ("No events yet.", "Henüz olay yok."),
    "proc.sec_tools": ("Hardware tools", "Donanım araçları"),
    "proc.fan_title": ("MSG fan calibration · Restrictor 2", "MSG fan kalibrasyonu · Restrictor 2"),
    "proc.target_flow": ("Target flow [cm/s]", "Hedef akış [cm/s]"),
    "proc.pot_to_flow": ("Pot → flow", "Pot → akış"),
    "proc.pot_to_flow_sub": ("≈ {v:.2f} V · measured {range}", "≈ {v:.2f} V · ölçüm {range}"),
    "proc.flow_to_set": ("Flow → setpoint", "Akış → ayar"),
    "proc.hrr_title": ("Huggett heat release rate", "Huggett ısı salınım hızı"),
    "proc.o2_drop": ("O₂ drop [pts]", "O₂ düşüşü [puan]"),
    "proc.duration": ("Duration [s]", "Süre [s]"),
    "proc.o2_consumed": ("O₂ consumed", "Tüketilen O₂"),
    "proc.energy": ("≈ {e:.1f} kJ total energy", "≈ {e:.1f} kJ toplam enerji"),
    "note.confirmed_out": ("flame-out confirmed", "söndü onaylandı"),
    "note.still_burning": ("flame persists", "alev devam ediyor"),
    "note.timer_done": ("timer complete", "süre tamamlandı"),
    "note.manual": ("manual", "manuel"),
    "step.standby.title": ("Standby", "Bekleme"),
    "step.standby.why": ("MSG work volume ready, sample installed; setting test conditions.",
                         "MSG çalışma hacmi hazır, numune yerleştirildi; deney koşulları ayarlanıyor."),
    "step.fire.title": ("Flame detected", "Alev tespit edildi"),
    "step.fire.cmd": ("Camera and thermocouple monitoring active", "Kamera ve termokupl izlemesi aktif"),
    "step.fire.why": ("Proceed to Step 9.6 for the suppression decision.", "Söndürme kararı için Step 9.6'ya geçin."),
    "step.fan_off.title": ("Cut the airflow", "Hava akışını kes"),
    "step.fan_off.why": (
        "With zero flow the flame drops into the quiescent regime; O₂ arrives by diffusion only and on the "
        "left branch of the U-curve the limit rises to 19.4%.",
        "Akış sıfırlanınca alev durgun rejime düşer; O₂ yalnızca difüzyonla taşınır ve "
        "U-eğrisinin sol kolunda sınır %19.4'e çıkar."),
    "step.gn2.title": ("Nitrogen inerting", "Azotla boğ"),
    "step.gn2.why": ("If cutting the flow was not enough, nitrogen is injected into the work volume to drive the "
                     "O₂ mole fraction below the limit.",
                     "Akış kesmek yetmediyse çalışma hacmine azot basılarak O₂ mol kesri sınırın altına indirilir."),
    "step.purge.title": ("Air circulation purge", "Hava sirkülasyonu ile temizlik"),
    "step.purge.why": ("Freon-derived HCl and combustion-product CO are routed through the MSG filters.",
                       "Freon kaynaklı HCl ve yanma ürünü CO, MSG filtrelerine yönlendirilerek temizlenir."),
    "step.cool.title": ("Cool-down", "Soğutma"),
    "step.cool.cmd": ("HOLD 6:00", "BEKLE 6:00"),
    "step.cool.why": ("Re-ignition risk is monitored while the sample and holder cool; do not open the door.",
                      "Numune ve tutucu soğurken yeniden tutuşma riski izlenir; kapak açılmaz."),
    "step.safe.title": ("Safe", "Güvenli"),
    "step.safe.cmd": ("MSG SAFE · ready for next test", "MSG GÜVENLİ · sonraki teste hazır"),
    "step.safe.why": ("Protocol complete.", "Prosedür tamamlandı."),

    # --------------------------------------------------------------- system --
    "sys.title": ("Data and model integration", "Veri ve model entegrasyonu"),
    "sys.subtitle": (
        "The app detects the data science team's files automatically. This page shows which source is in use, "
        "schema compatibility, and the file contract for the team.",
        "Uygulama, veri bilimi ekibinin dosyalarını otomatik algılar. Bu sayfa hangi kaynağın kullanıldığını, "
        "şema uyumunu ve ekip için dosya sözleşmesini gösterir."),
    "sys.sec_data": ("Data source", "Veri kaynağı"),
    "sys.source": ("Source", "Kaynak"),
    "sys.real": ("Flight data", "Gerçek veri"),
    "sys.simulation": ("Simulation", "Simülasyon"),
    "sys.loaded": ("{n} tests loaded", "{n} test yüklendi"),
    "sys.not_found": ("{path} not found", "{path} bulunamadı"),
    "sys.sim_st": ("physics-informed synthetic 129 tests", "fizik-bilgili sentetik 129 test"),
    "sys.col": ("Column", "Kolon"),
    "sys.type": ("Type", "Tür"),
    "sys.status": ("Status", "Durum"),
    "sys.src_col": ("Source column", "Kaynak kolon"),
    "sys.required": ("required", "zorunlu"),
    "sys.optional": ("optional", "isteğe bağlı"),
    "sys.present": ("✓ present", "✓ var"),
    "sys.missing": ("✕ missing", "✕ eksik"),
    "sys.default": ("○ default", "○ varsayılan"),
    "sys.sim_src": ("simulation", "simülasyon"),
    "sys.sec_model": ("Model", "Model"),
    "sys.active_model": ("Active model", "Aktif model"),
    "sys.no_model": ("no usable model in models/", "models/ içinde kullanılabilir model yok"),
    "sys.auto_trained": ("auto-trained with the src/train.py pipeline", "src/train.py hattıyla otomatik eğitildi"),
    "sys.file": ("File", "Dosya"),
    "sys.size_kb": ("Size KB", "Boyut KB"),
    "sys.features": ("Features ({n})", "Özellikler ({n})"),
    "sys.sec_contract": ("Team contract", "Ekip sözleşmesi"),
    "sys.contract_data": (
        "**1 · Data** — `data/processed/bass2_clean.csv`\n"
        "- Required: `{required}`, `{target}` (1 = extinguished, 0 = sustained burning).\n"
        "- Recommended: `Sample_No` (GroupKFold), `Radius_cm`, `Burn_Time` [s] (for Huggett HRR), "
        "`Ignition_Time` [s], `Material`, `Geometry`, `Pressure_kPa`, `Fan_Pot`.\n"
        "- Column names are flexible (`o2_initial`, `O2 Initial`, `flow_velocity` … are mapped automatically). "
        "CO may be in ppm or %.\n\n"
        "**2 · Model** — `models/<name>.joblib` (+ optional `models/<name>.json`)",
        "**1 · Veri** — `data/processed/bass2_clean.csv`\n"
        "- Zorunlu: `{required}`, `{target}` (1 = söndü, 0 = yanmaya devam).\n"
        "- Önerilen: `Sample_No` (GroupKFold), `Radius_cm`, `Burn_Time` [s] (Huggett HRR için), "
        "`Ignition_Time` [s], `Material`, `Geometry`, `Pressure_kPa`, `Fan_Pot`.\n"
        "- Kolon adları esnektir (`o2_initial`, `O2 Initial`, `flow_velocity` … otomatik eşlenir). "
        "CO ppm veya % olabilir.\n\n"
        "**2 · Model** — `models/<ad>.joblib` (+ isteğe bağlı `models/<ad>.json`)"),
    "sys.contract_behavior": (
        "**3 · Behavior** — When files are added or changed, the app picks them up on the next interaction "
        "without a restart (the cache key is the file signature). If a model cannot be loaded or the schema "
        "does not match, a warning is shown and the surrogate model is used; the UI never crashes.",
        "**3 · Davranış** — Dosyalar eklendiğinde veya değiştiğinde uygulama yeniden başlatılmadan bir sonraki "
        "etkileşimde algılar (önbellek anahtarı dosya imzasıdır). Model yüklenemez ya da şema uyuşmazsa uyarı "
        "gösterilir ve vekil modele geri dönülür; arayüz hiçbir durumda çökmez."),

    # ------------------------------------------- data / model warnings (core) --
    "warn.no_sample_no": ("No Sample_No column: each test treated as a separate sample (GroupKFold becomes meaningless).",
                          "Sample_No yok: her test ayrı numune kabul edildi (GroupKFold anlamsızlaşır)."),
    "warn.no_radius": ("No Radius_cm column: reference r = {r} cm used for stretch rate.",
                       "Radius_cm yok: gerilme hızı için referans r = {r} cm kullanıldı."),
    "warn.co_percent": ("CO values detected as % vol and converted to ppm.",
                        "CO değerleri % hacim olarak algılandı ve ppm'e çevrildi."),
    "warn.no_burn_time": ("No Burn_Time/HRR column: Huggett HRR could not be computed.",
                          "Burn_Time/HRR yok: Huggett HRR hesaplanamadı."),
    "warn.rows_dropped": ("{n} rows dropped due to missing required values.",
                          "{n} satır eksik zorunlu değer nedeniyle atıldı."),
    "warn.csv_fallback": ("{name} could not be read ({err}); fell back to simulated data.",
                          "{name} okunamadı ({err}); simülasyon verisine geri dönüldü."),
    "warn.model_unusable": ("{name} could not be used ({err})", "{name} kullanılamadı ({err})"),
}


def lang() -> str:
    """Aktif dil kodu. Streamlit oturumu yoksa varsayılan dil."""
    try:
        import streamlit as st

        code = st.session_state.get("lang")
    except Exception:  # noqa: BLE001 — Streamlit dışı kullanım
        code = None
    return code if code in LANGUAGES else DEFAULT_LANG


def t(key: str, _lang: str | None = None, **params) -> str:
    entry = STRINGS.get(key)
    if entry is None:
        return key
    text = entry[0] if (_lang or lang()) == "en" else entry[1]
    return text.format(**params) if params else text


def tv(prefix: str, value, _lang: str | None = None) -> str:
    """Veri değeri etiketi: sözlükte varsa çeviri, yoksa değerin kendisi."""
    key = f"{prefix}.{value}"
    return t(key, _lang) if key in STRINGS else str(value)


def labeler(prefix: str, extra: dict[str, str] | None = None):
    """Widget `format_func`'ı için, oluşturulduğu andaki dile sabitlenmiş etiketleyici.

    Streamlit format_func'ı script dışından da çağırabilir (ör. AppTest); dili
    o anda okumak yerine kapanışta saklamak etiketleri her bağlamda tutarlı kılar.
    `extra`, sözlük dışı özel seçenekler için anahtar eşlemesidir ({"all": "arch.all"}).
    """
    code, extra = lang(), extra or {}
    return lambda v: t(extra[v], code) if v in extra else tv(prefix, v, code)
