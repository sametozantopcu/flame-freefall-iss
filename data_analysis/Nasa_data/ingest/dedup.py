# dedup.py — birebir aynı CSV'leri bulur; her gruptan PSI- önekli olanı tutar
# Kullanım:  python dedup.py            → sadece listeler (csv/)
#            python dedup.py --sil      → siler
#            python dedup.py raw --sil  → raw/ klasöründe çalışır
import hashlib, glob, os, sys

args = [a for a in sys.argv[1:] if not a.startswith("--")]
ROOT = args[0] if args else "csv"
DELETE = "--sil" in sys.argv

def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

groups = {}
files = glob.glob(os.path.join(ROOT, "*", "*.csv"))
print(f"{len(files)} dosya taranıyor ({ROOT}/) ...")
for p in files:
    groups.setdefault(md5(p), []).append(p)

freed, n = 0, 0
for paths in groups.values():
    if len(paths) < 2:
        continue
    # önce PSI- önekli, sonra en kısa yol tutulur
    paths.sort(key=lambda p: (not os.path.basename(p).startswith("PSI-"), len(p)))
    print(f"\nTUTULDU  {paths[0]}")
    for p in paths[1:]:
        freed += os.path.getsize(p); n += 1
        print(("  SİLİNDİ   " if DELETE else "  silinecek ") + p)
        if DELETE:
            os.remove(p)

durum = "silindi" if DELETE else "silinebilir (silmek için --sil ekleyin)"
print(f"\n{n} dosya, {freed/1e6:.0f} MB {durum}")