"""NASA Space Apps logosunu Halo'ya uyarlar: siyah ve kırmızı -> açık ışık rengi (#f5f5f7), alfa korunur.
Çıktılar: assets/logo.png (üst bar), assets/favicon.png (siyah zemin üzerinde halka işareti).
"""
import sys
from pathlib import Path
from PIL import Image

src, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)
LIGHT = (245, 245, 247)

im = Image.open(src).convert("RGBA")
w, h = im.size
px = im.load()
for y in range(h):
    for x in range(w):
        a = px[x, y][3]
        px[x, y] = LIGHT + (a,) if a else (0, 0, 0, 0)
im.save(out_dir / "logo.png", optimize=True)

# Halka işaretinin sınırı: soldan ilk tamamen boş sütun aralığı (yazının başladığı yer).
cols = [any(px[x, y][3] > 20 for y in range(h)) for x in range(w)]
x = 0
while x < w and not cols[x]:
    x += 1
start = x
while x < w and cols[x]:
    x += 1
mark = im.crop((start, 0, x, h))
bbox = mark.getbbox()
mark = mark.crop(bbox)
print("logo", im.size, "mark", mark.size)

S = 64
fav = Image.new("RGBA", (S, S), (0, 0, 0, 0))
bg = Image.new("RGBA", (S, S), (0, 0, 0, 255))
r = Image.new("L", (S, S), 0)
from PIL import ImageDraw
ImageDraw.Draw(r).rounded_rectangle((0, 0, S - 1, S - 1), radius=14, fill=255)
fav.paste(bg, (0, 0), r)
m = mark.copy()
m.thumbnail((S - 14, S - 14), Image.LANCZOS)
fav.alpha_composite(m, ((S - m.width) // 2, (S - m.height) // 2))
fav.save(out_dir / "favicon.png", optimize=True)
print("favicon", fav.size)
