"""Merkezi yapılandırma: yollar, fiziksel sabitler, operasyonel eşikler, donanım kalibrasyonu.

Bilimsel sabitlerin tamamı tek bir yerde tutulur; böylece rapordan gelen bir
düzeltme yalnızca bu dosyada yapılır ve tüm arayüze yansır.
"""
from __future__ import annotations

from pathlib import Path

# --------------------------------------------------------------------------- #
# Yollar
# --------------------------------------------------------------------------- #
ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
DATA_PATH = ROOT / "data" / "processed" / "bass2_clean.csv"
MODELS_DIR = ROOT / "models"
MODEL_EXTENSIONS = (".joblib", ".pkl", ".pickle")

# --------------------------------------------------------------------------- #
# Veri şeması (src/features.py ile uyumlu)
# --------------------------------------------------------------------------- #
TARGET_COL = "Extinction"   # 1 = alev kendiliğinden söndü, 0 = yanma sürdü
GROUP_COL = "Sample_No"     # aynı numune birden fazla teste girer -> GroupKFold
REQUIRED_COLS = ["O2_initial", "O2_final", "CO2", "CO", "Thickness", "Flow_Vel"]
N_ISS_TESTS = 129

# --------------------------------------------------------------------------- #
# Fizik: Olson U-şekilli yanabilirlik sınırı (BASS-II Summary Report)
#   X_O2 = 6 exp(-0.5 a) + 0.0167 a + 13.4        [% hacim O2]
#   a    = 1.5 (U / r) (r / 0.318)^0.5            [1/s], U [cm/s], r [cm]
# --------------------------------------------------------------------------- #
OLSON_A = 6.0
OLSON_B = 0.5
OLSON_C = 0.0167
OLSON_D = 13.4
R_REF_CM = 0.318            # 1/8 inç referans yarıçap

# Huggett oksijen tüketim kalorimetrisi
HUGGETT_KJ_PER_G_O2 = 13.1
MSG_VOLUME_L = 250.0        # Microgravity Science Glovebox iç hacmi
M_O2_G_MOL = 32.0
R_GAS = 8.314462618         # J/(mol K)
STD_P_KPA = 101.325
STD_T_K = 298.15

# --------------------------------------------------------------------------- #
# Operasyonel eşikler
# --------------------------------------------------------------------------- #
HRR_WINDOW_DAMAGE_W = 100.0     # M5 deneyinde MSG ön camına hasar veren seviye
HRR_CAUTION_W = 60.0
CO_SENSOR_SAT_PPM = 1000.0      # CO sensörü doyumu
CO_CAUTION_PPM = 500.0
EARTH_PMMA_LOI_PCT = 15.4       # Dünya'da PMMA söndüğü O2 seviyesi
MICROG_PMMA_LIMIT_PCT = 13.5    # BASS-II: düşük akışta yanmanın sürdüğü en düşük O2
STD6001_IGNITION_S = 25.0       # NASA-STD-6001 Test 1 tutuşturucu süresi
BASS2_MAX_IGNITION_S = 230.0    # BASS-II'de gözlenen en uzun tutuşma gecikmesi
GOLDILOCKS_CM_S = (1.0, 5.0)    # kabin havalandırma "Goldilocks" bölgesi
CO_MAX_ENHANCEMENT = 10.0       # sınır yakınında Dünya'ya göre ~10x CO

# --------------------------------------------------------------------------- #
# MSG fan kalibrasyonu — Restrictor 2
# Kaynak: NASA "Fan calibration data.xlsx" (ekip NOTLAR.pdf'ine aktarılmış tam tablo).
# Nominal akış = ölçülen aralığın orta noktası; aralık arayüzde belirsizlik bandı
# olarak gösterilir. Çapalar arası doğrusal interpolasyon; tablonun dışı
# "ekstrapolasyon" olarak işaretlenir.
# --------------------------------------------------------------------------- #
FAN_CAL_RESTRICTOR_2 = [
    # (pot, voltaj [V], nominal [cm/s], alt [cm/s], üst [cm/s])
    (0.35, 3.80, 0.00, 0.0, 0.0),     # sıfır akış eşiği: Pot <= 0.35 veya V <= 3.8
    (0.50, 4.20, 0.50, 0.5, 0.5),
    (1.00, 4.65, 1.75, 1.0, 2.5),
    (2.00, 5.50, 4.50, 4.0, 5.0),
    (4.00, 7.20, 8.00, 7.0, 9.0),
    (6.00, 8.85, 11.75, 10.5, 13.0),
    (8.00, 10.50, 15.75, 14.5, 17.0),
    (10.00, 12.20, 20.00, 18.0, 22.0),
]
FAN_POT_MAX = 10.0
FAN_V_MAX = 12.5

# --------------------------------------------------------------------------- #
# Kabin atmosferi senaryoları (O2 %, toplam basınç kPa)
# --------------------------------------------------------------------------- #
# Anahtarlar dilden bağımsız kodlardır; etiketler app/i18n.py içindedir (atm.<kod>).
ATMOSPHERES = {
    "iss": (21.0, 101.3),
    "exploration": (34.0, 56.5),       # 8.2 psia
    "gateway": (26.5, 70.3),           # 10.2 psia
    "bass_low_o2": (16.0, 101.3),
    "bass_limit": (14.0, 101.3),
    "custom": None,
}

# Simülasyon kodları; görüntü etiketleri app/i18n.py (mat.<kod>, geo.<kod>).
# Gerçek veride gelen serbest metin değerleri olduğu gibi gösterilir.
MATERIALS = ["PMMA", "Delrin (POM)", "Ultem 1000", "Cotton/Fiberglass fabric"]
GEOMETRIES = ["sphere", "cylinder", "flat"]
