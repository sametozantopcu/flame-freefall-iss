"""FlameSense OLED görseli (880x440): dashboard'un Canli ekraninin kucuk hali.
Calistirma: python oled_live.py (Pillow ve Windows'taki Segoe UI fontlari gerekir)
Degerler dashboard/config.js icindeki LIVE_SAMPLE'dan.
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "oled_live.png")
W, H, SS = 880, 440, 2  # 2x ust ornekleme, sonda kucultulur
INK = (245, 245, 247)
LIVE = {"o2_pct": 20.9, "co_ppm": 2, "co2_pct": 0.30, "flow_cm_s": 3.2, "ir_max_c": 31}

LIGHT = r"C:\Windows\Fonts\segoeuil.ttf"
REG = r"C:\Windows\Fonts\segoeui.ttf"


def font(path, px):
    return ImageFont.truetype(path, px * SS)


def rgba(a):
    return (*INK, int(round(255 * a)))


img = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 255))
def box_r(cx, cy, r):
    return [(cx - r) * SS, (cy - r) * SS, (cx + r) * SS, (cy + r) * SS]


# --- Halka (sol yari)
cx, cy, R, T = 220, 220, 150, 10
# soluk iz: tum daire
ring =Image.new("RGBA", img.size, (0, 0, 0, 0))
rd = ImageDraw.Draw(ring)
rd.ellipse(box_r(cx, cy, R + T / 2), fill=rgba(0.12))
rd.ellipse(box_r(cx, cy, R - T / 2), fill=(0, 0, 0, 0))
# yay: tepeden (PIL 270 derece) saat yonunde 270 derece
SLICE = 2.5
n = int(270 / SLICE)
arc = Image.new("RGBA", img.size, (0, 0, 0, 0))
ad = ImageDraw.Draw(arc)
for i in range(n):
    a0 = 270 + i * SLICE
    a1 = a0 + SLICE
    op = 0.10 + 0.90 * (i / (n - 1))
    ad.arc(box_r(cx, cy, R), a0, a1, fill=rgba(op), width=T * SS)
# yayin ucu: PIL 180 derece (sol)
tip = (cx + R * math.cos(math.radians(270 + 270)), cy + R * math.sin(math.radians(270 + 270)))
ad.ellipse(box_r(tip[0], tip[1], 11), fill=rgba(1.0))
img = Image.alpha_composite(img, ring)
img = Image.alpha_composite(img, arc)

# --- Metinler
txt = Image.new("RGBA", img.size, (0, 0, 0, 0))
td = ImageDraw.Draw(txt)
td.text((cx * SS, 205 * SS), f"{LIVE['o2_pct']:.1f}", font=font(LIGHT, 96), fill=rgba(1.0), anchor="mm")
td.text((cx * SS, 280 * SS), "O2 %", font=font(REG, 30), fill=rgba(0.55), anchor="mm")

rows = [("CO", f"{LIVE['co_ppm']} ppm"), ("CO2", f"{LIVE['co2_pct']:.2f} %"),
        ("Flow", f"{LIVE['flow_cm_s']:.1f} cm/s"), ("IR max", f"{LIVE['ir_max_c']} \u00b0C")]
X0, X1 = 460, 840
ys = [130, 210, 290, 370]
for (k, v), y in zip(rows, ys):
    td.text((X0 * SS, y * SS), k, font=font(REG, 30), fill=rgba(0.55), anchor="lm")
    td.text((X1 * SS, y * SS), v, font=font(REG, 34), fill=rgba(1.0), anchor="rm")
# satir arasi: uclara dogru solan 1 px cizgiler
for y in (170, 250, 330):
    for x in range(X0 * SS, X1 * SS):
        t = (x - X0 * SS) / ((X1 - X0) * SS)
        a = 0.28 * math.sin(math.pi * t)
        td.point((x, y * SS), fill=rgba(a))
        td.point((x, y * SS + 1), fill=rgba(a))
# CALM
td.text((X1 * SS, 48 * SS), "CALM", font=font(REG, 24), fill=rgba(0.55), anchor="rm")
cw = td.textlength("CALM", font=font(REG, 24))
td.ellipse(box_r(X1 - cw / SS - 20, 48, 5), fill=rgba(0.80))
img = Image.alpha_composite(img, txt)

img = img.convert("RGB").resize((W, H), Image.LANCZOS)
img.save(OUT)
print("yazildi:", OUT)
