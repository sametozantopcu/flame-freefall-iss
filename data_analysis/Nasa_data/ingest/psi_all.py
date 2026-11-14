# psi_all.py
import os, re, json, sys, time, threading, urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import pandas as pd
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE = "https://psi.nasa.gov/geode-py/ws"
EXT = (".csv", ".xlsx", ".xls")
EXTRA_IDS = []          # Listede çıkmayan ama istediğiniz ID'leri buraya ekleyin, örn ["PSI-60"]
ID_WORKERS = 6          # Aynı anda işlenen investigation sayısı
FILE_WORKERS = 6        # Her investigation içinde aynı anda inen dosya sayısı
MAX_MB = 500            # Bundan büyük dosyaları atla (0 = sınırsız)

lock = threading.Lock()
def log(*a):
    with lock:
        print(*a, flush=True)

def session():
    s = requests.Session()
    retry = Retry(total=4, backoff_factor=2, status_forcelist=[429, 500, 502, 503, 504],
                  allowed_methods=["GET", "HEAD"])
    s.mount("https://", HTTPAdapter(max_retries=retry, pool_maxsize=50))
    return s
S = session()

# ---------- yardımcılar ----------
def find_files(obj, out):
    if isinstance(obj, dict):
        for v in obj.values(): find_files(v, out)
    elif isinstance(obj, list):
        for v in obj: find_files(v, out)
    elif isinstance(obj, str) and obj.lower().endswith(EXT):
        out.add(os.path.basename(obj))

def safe(s): return re.sub(r"[^\w\-\.]+", "_", s).strip("_")

def read_csv_any(p):
    for enc in ("utf-8", "cp1252", "latin-1"):
        try: return pd.read_csv(p, encoding=enc, low_memory=False), enc
        except UnicodeDecodeError: continue
        except Exception as e: return None, str(e)[:60]
    return None, "encoding"

def clean(df):
    df = df.dropna(how="all").dropna(axis=1, how="all")
    df.columns = [re.sub(r"\s+", " ", str(c)).strip().lower() for c in df.columns]
    return df.reset_index(drop=True)

def norm(v):
    if pd.isna(v): return ""
    try: return f"{round(float(v), 6):g}"
    except (ValueError, TypeError): return str(v).strip()

def elementwise(df, f):
    return df.map(f) if hasattr(df, "map") else df.applymap(f)

def covered_by(sheet, csvs):
    sc = [c for c in sheet.columns if not c.startswith("unnamed")]
    for name, cdf in csvs.items():
        if len(cdf) != len(sheet) or not sc: continue
        common = [c for c in sc if c in cdf.columns]
        if len(common) / len(sc) < 0.9: continue
        if (elementwise(sheet[common], norm).values ==
            elementwise(cdf[common], norm).values).mean() > 0.98:
            return name
    return None

# ---------- indirme ----------
def download(pid, name):
    path = f"raw/{pid}/{name}"
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return name, "VAR", os.path.getsize(path)
    url = f"{BASE}/studies/{pid}/download?file={urllib.parse.quote(name)}"
    try:
        with S.get(url, stream=True, timeout=(30, 600)) as r:
            if not r.ok:
                return name, f"HTTP {r.status_code}", 0
            size = int(r.headers.get("Content-Length", 0) or 0)
            if MAX_MB and size > MAX_MB * 1e6:
                return name, f"ATLANDI >{MAX_MB}MB", size
            tmp = path + ".part"
            with open(tmp, "wb") as f:
                for chunk in r.iter_content(1 << 20):
                    f.write(chunk)
            os.replace(tmp, path)
            return name, "OK", os.path.getsize(path)
    except Exception as e:
        return name, f"HATA {type(e).__name__}", 0

# ---------- investigation işleme ----------
def process(pid):
    t0 = time.time()
    rows = []
    os.makedirs(f"raw/{pid}", exist_ok=True)
    os.makedirs(f"csv/{pid}", exist_ok=True)
    try:
        r = S.get(f"{BASE}/repo/investigations/{pid}", timeout=60)
        r.raise_for_status()
        d = r.json()
    except Exception as e:
        log(f"[{pid}] !! DETAY ALINAMADI: {e}")
        return pid, [[pid, "", "", "detay alınamadı", str(e)[:80]]]
    json.dump(d, open(f"raw/{pid}/detail.json", "w"), indent=1)

    names = set(); find_files(d, names); names = sorted(names)
    log(f"[{pid}] {len(names)} tablo dosyası bulundu")
    if not names:
        rows.append([pid, "", "", "tablo dosyası yok", ""])

    with ThreadPoolExecutor(FILE_WORKERS) as ex:
        for fut in as_completed([ex.submit(download, pid, n) for n in names]):
            n, st, sz = fut.result()
            mark = "  " if st in ("OK", "VAR") else "!!"
            log(f"[{pid}] {mark} {st:<14} {sz/1e6:8.2f} MB  {n}")
            if st not in ("OK", "VAR"):
                rows.append([pid, n, "", "indirilemedi", st])

    csvs = {}
    for n in names:
        p = f"raw/{pid}/{n}"
        if n.lower().endswith(".csv") and os.path.exists(p):
            df, enc = read_csv_any(p)
            if df is None:
                rows.append([pid, n, "", "csv okunamadı", enc]); log(f"[{pid}] !! CSV OKUNAMADI {n}"); continue
            df.to_csv(f"csv/{pid}/{safe(n)}", index=False, encoding="utf-8")
            csvs[n] = clean(df.copy())
            rows.append([pid, n, "", "csv", f"{len(df)} satır, {df.shape[1]} sütun, {enc}"])

    for n in names:
        p = f"raw/{pid}/{n}"
        if not n.lower().endswith((".xlsx", ".xls")) or not os.path.exists(p): continue
        try:
            sheets = pd.read_excel(p, sheet_name=None)
        except Exception as e:
            rows.append([pid, n, "", "excel okunamadı", str(e)[:80]]); log(f"[{pid}] !! EXCEL OKUNAMADI {n}"); continue
        for sh, df in sheets.items():
            df = clean(df)
            if df.empty:
                rows.append([pid, n, sh, "boş sayfa", ""]); continue
            dup = covered_by(df, csvs)
            if dup:
                rows.append([pid, n, sh, "atlandı (tekrar)", dup])
                log(f"[{pid}]    excel '{sh}' tekrar → {dup}")
            else:
                out = f"csv/{pid}/{safe(os.path.splitext(n)[0])}__{safe(sh)}.csv"
                df.to_csv(out, index=False, encoding="utf-8")
                csvs[os.path.basename(out)] = df
                rows.append([pid, n, sh, "ekstra → csv", f"{len(df)} satır, {df.shape[1]} sütun"])
                log(f"[{pid}]    excel '{sh}' ekstra bilgi → {os.path.basename(out)}")

    log(f"[{pid}] bitti ({time.time()-t0:.0f} sn)")
    return pid, rows

# ---------- ana akış ----------
def main():
    s = S.get(f"{BASE}/repo/search",
              params={"source": "psi", "type": "investigation", "size": 500, "from": 0},
              timeout=60).json()
    allhits = s["hits"]["hits"]
    ids = sorted({h["_source"]["Accession"] for h in allhits
                  if "combustion" in (h["_source"].get("Research Area", "") +
                                      h["_source"].get("SubResearch Area", "")).lower()}
                 | set(EXTRA_IDS), key=lambda x: int(x.split("-")[1]))
    print(f"Toplam investigation: {s['hits']['total']}  |  combustion: {len(ids)}")
    print(", ".join(ids), "\n", flush=True)

    allrows = []
    with ThreadPoolExecutor(ID_WORKERS) as ex:
        for fut in as_completed([ex.submit(process, pid) for pid in ids]):
            _, rows = fut.result()
            allrows += rows

    m = pd.DataFrame(allrows, columns=["psi_id", "dosya", "sayfa", "durum", "not"])
    m.to_csv("csv/manifest.csv", index=False, encoding="utf-8")

    print("\n" + "=" * 70 + "\nÖZET (investigation bazında)\n" + "=" * 70)
    summ = m.pivot_table(index="psi_id", columns="durum", values="dosya",
                         aggfunc="count", fill_value=0)
    with pd.option_context("display.max_rows", None, "display.width", 200):
        print(summ)

    bad = m[m["durum"].isin(["indirilemedi", "detay alınamadı", "csv okunamadı",
                             "excel okunamadı", "tablo dosyası yok"])]
    print("\n" + "=" * 70 + f"\nALINAMAYANLAR ({len(bad)})\n" + "=" * 70)
    with pd.option_context("display.max_rows", None, "display.max_colwidth", 80, "display.width", 200):
        print(bad[["psi_id", "durum", "dosya", "not"]].to_string(index=False) if len(bad) else "Yok 🎉")
    bad.to_csv("csv/failures.csv", index=False, encoding="utf-8")
    print("\nDetay: csv/manifest.csv  |  Hatalar: csv/failures.csv")

if __name__ == "__main__":
    os.makedirs("csv", exist_ok=True)
    main()
