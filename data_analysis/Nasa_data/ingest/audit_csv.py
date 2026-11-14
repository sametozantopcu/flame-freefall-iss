# audit_csv.py — CSV denetimi (hiçbir dosyayı silmez/değiştirmez)
import os, re, sys, glob, hashlib, warnings
from concurrent.futures import ProcessPoolExecutor, as_completed
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")
ROOT = sys.argv[1] if len(sys.argv) > 1 else "csv"
OUT = "audit"
SENTINELS = [-999, -9999, -99999, 9999, 99999, -99]
TIME_PAT = re.compile(r"time|sec|gmt|date|elapsed|relative|clock|utc", re.I)
SUSPECT_NAME = re.compile(r"wrong|copy|test|old|backup|\(\d\)", re.I)
PREFIX = re.compile(r"^PSI-\d+_(Raw_Data|Analyzed_Data|Experimental_table|Science_Documents|"
                    r"Reference_Data|Engineering_Documents|Reports)_", re.I)

# ---------------- yardımcılar ----------------
def md5_file(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def read_any(p):
    """(df, encoding, bozuk_satır_sayısı, hata)"""
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            return pd.read_csv(p, encoding=enc, low_memory=False), enc, 0, None
        except UnicodeDecodeError:
            continue
        except pd.errors.EmptyDataError:
            return pd.DataFrame(), enc, 0, "boş dosya"
        except pd.errors.ParserError:
            bad = []
            try:
                df = pd.read_csv(p, encoding=enc, engine="python",
                                 on_bad_lines=lambda line: bad.append(1) or None)
                return df, enc, len(bad), None
            except Exception as e:
                return None, enc, 0, str(e)[:150]
        except Exception as e:
            return None, enc, 0, str(e)[:150]
    return None, None, 0, "encoding çözülemedi"

def norm_cols(cols):
    return [re.sub(r"\s+", " ", str(c)).strip().lower() for c in cols]

def content_hash(d):
    """Sütun adları + normalize değerler üzerinden içerik parmak izi."""
    norm = {}
    for c in d.columns:
        s = d[c]
        num = pd.to_numeric(s, errors="coerce")
        if num.notna().sum() == s.notna().sum():
            norm[c] = num.round(6).map(lambda v: "" if pd.isna(v) else f"{v:g}")
        else:
            norm[c] = s.astype(str).str.strip().where(s.notna(), "")
    nd = pd.DataFrame(norm)
    h = hashlib.md5("|".join(norm_cols(d.columns)).encode())
    h.update(pd.util.hash_pandas_object(nd, index=False).values.tobytes())
    return h.hexdigest()

# ---------------- dosya analizi ----------------
def analyze(p):
    pid = os.path.basename(os.path.dirname(p))
    name = os.path.basename(p)
    info = dict(psi_id=pid, file=name, path=p,
                size_mb=round(os.path.getsize(p) / 1e6, 3), md5=md5_file(p),
                base_name=PREFIX.sub("", name))
    issues = []
    def add(sev, issue, detail=""):
        issues.append(dict(psi_id=pid, file=name, severity=sev, issue=issue,
                           detail=str(detail)[:300]))

    if SUSPECT_NAME.search(name):
        add("WARN", "şüpheli dosya adı", name)

    df, enc, nbad, err = read_any(p)
    info["encoding"] = enc
    if df is None:
        add("ERROR", "okunamadı", err); info["status"] = "okunamadı"
        return info, issues
    if df.empty or df.shape[1] == 0:
        add("ERROR", "boş dosya"); info["status"] = "boş"
        return info, issues

    info["status"] = "ok"
    info["bad_lines"] = nbad
    if nbad:
        add("WARN", "bozuk satır atlandı", f"{nbad} satır")
    info["rows"], info["cols"] = df.shape

    # başlık kontrolü
    unnamed = sum(str(c).startswith("Unnamed") for c in df.columns)
    info["unnamed_cols"] = unnamed
    if unnamed / df.shape[1] > 0.5:
        nn = df.head(15).notna().sum(axis=1)
        guess = int(nn.idxmax()) + 1 if len(nn) else -1
        add("WARN", "başlık ilk satırda değil gibi",
            f"{unnamed}/{df.shape[1]} sütun isimsiz; olası başlık satırı ≈ {guess}")

    # tekrarlanan sütun adları (pandas '.1' ekler)
    cols = list(map(str, df.columns))
    dupnames = [c for c in cols if re.search(r"\.\d+$", c) and re.sub(r"\.\d+$", "", c) in cols]
    if dupnames:
        add("WARN", "tekrarlanan sütun adı", dupnames[:10])

    # boş satır/sütun
    er = int(df.isna().all(axis=1).sum())
    ec = [c for c in df.columns if df[c].isna().all()]
    info["empty_rows"], info["empty_cols"] = er, len(ec)
    if er:
        add("INFO", "tamamen boş satır", er)
    if ec:
        add("INFO", "tamamen boş sütun", f"{len(ec)}: {ec[:8]}")

    d = df.dropna(how="all").dropna(axis=1, how="all")
    info["rows_clean"], info["cols_clean"] = d.shape
    if d.empty:
        add("ERROR", "temizlik sonrası veri kalmadı")
        return info, issues

    # tekrarlanan satırlar
    dr = int(d.duplicated().sum())
    info["dup_rows"] = dr
    if dr:
        add("WARN", "birebir tekrarlanan satır", f"{dr} satır ({dr/len(d):.1%})")

    # içeriği aynı sütunlar
    if d.shape[1] <= 400:
        hs = {}
        for c in d.columns:
            k = int(pd.util.hash_pandas_object(d[c].astype(str), index=False).sum())
            hs.setdefault(k, []).append(str(c))
        same = [v for v in hs.values() if len(v) > 1]
        if same:
            add("INFO", "içeriği aynı sütunlar", same[:5])

    # sabit sütunlar ve yüksek eksiklik
    const = [str(c) for c in d.columns if d[c].nunique(dropna=True) == 1]
    if const:
        add("INFO", "sabit (tek değerli) sütun", f"{len(const)}: {const[:8]}")
    miss = d.isna().mean()
    hi = miss[miss > 0.5]
    if len(hi):
        add("INFO", ">%50 eksik sütun", {str(k): f"{v:.0%}" for k, v in hi.head(8).items()})

    # karışık tip, sentinel, zaman sütunu
    mixed, sent = {}, {}
    for c in d.columns:
        s = d[c]
        nn = int(s.notna().sum())
        if s.dtype == object:
            num = pd.to_numeric(s, errors="coerce")
            ok = int(num.notna().sum())
            if nn and ok / nn >= 0.8 and ok < nn:
                toks = s[num.isna() & s.notna()].astype(str).str.strip().value_counts().head(5)
                mixed[str(c)] = toks.to_dict()
        elif pd.api.types.is_numeric_dtype(s) and not pd.api.types.is_bool_dtype(s):
            num = s
        else:
            continue
        if s.dtype == object and not (nn and num.notna().sum() / max(nn, 1) >= 0.8):
            continue
        hit = int(num.isin(SENTINELS).sum())
        if hit:
            sent[str(c)] = hit
        if np.isinf(num.astype(float)).any():
            add("WARN", "sonsuz (inf) değer", str(c))
        if TIME_PAT.search(str(c)) and num.notna().sum() > 10:
            v = num.dropna().reset_index(drop=True)
            back = int((v.diff() < 0).sum())
            if back:
                add("WARN", "zaman sütunu monoton değil", f"{c}: {back} geri sıçrama")
            dts = int(v.duplicated().sum())
            if dts:
                add("INFO", "tekrarlanan zaman damgası", f"{c}: {dts}")
    if mixed:
        add("WARN", "sayısal sütunda metin token'ı", mixed)
    if sent:
        add("WARN", "sentinel değer (-999, 9999…)", sent)

    info["schema"] = hashlib.md5("|".join(norm_cols(d.columns)).encode()).hexdigest()[:12]
    info["content_hash"] = content_hash(d)
    return info, issues

# ---------------- ana akış ----------------
def main():
    os.makedirs(OUT, exist_ok=True)
    files = sorted(glob.glob(os.path.join(ROOT, "*", "*.csv")))
    print(f"{len(files)} CSV denetleniyor ({ROOT}/) ...", flush=True)

    rows, issues = [], []
    with ProcessPoolExecutor(max(1, (os.cpu_count() or 2) - 1)) as ex:
        futs = {ex.submit(analyze, p): p for p in files}
        for i, fut in enumerate(as_completed(futs), 1):
            try:
                info, iss = fut.result()
            except Exception as e:
                p = futs[fut]
                info = dict(psi_id=os.path.basename(os.path.dirname(p)),
                            file=os.path.basename(p), path=p, status="analiz hatası")
                iss = [dict(psi_id=info["psi_id"], file=info["file"], severity="ERROR",
                            issue="analiz hatası", detail=str(e)[:200])]
            rows.append(info); issues += iss
            if i % 200 == 0 or i == len(files):
                print(f"  {i}/{len(files)}", flush=True)

    F = pd.DataFrame(rows)
    I = pd.DataFrame(issues, columns=["psi_id", "file", "severity", "issue", "detail"])

    # 1) birebir aynı dosyalar (md5)
    g = F.groupby("md5")
    exact = F[F["md5"].isin([k for k, v in g if len(v) > 1])].copy()
    exact["group"] = exact.groupby("md5").ngroup()
    exact["tutulması_önerilen"] = False
    for _, grp in exact.groupby("group"):
        best = grp.assign(_p=~grp["file"].str.startswith("PSI-")).sort_values(["_p", "file"]).index[0]
        exact.loc[best, "tutulması_önerilen"] = True
    exact.sort_values(["group", "file"])[
        ["group", "psi_id", "file", "size_mb", "tutulması_önerilen", "path"]
    ].to_csv(f"{OUT}/exact_duplicates.csv", index=False)

    # 2) içerik aynı ama dosya farklı (md5 farklı)
    ok = F[F.get("content_hash").notna()] if "content_hash" in F else F.iloc[0:0]
    cg = ok.groupby("content_hash")
    content = ok[ok["content_hash"].isin([k for k, v in cg if v["md5"].nunique() > 1])].copy()
    content["group"] = content.groupby("content_hash").ngroup()
    content.sort_values(["group", "file"])[
        ["group", "psi_id", "file", "rows_clean", "cols_clean", "size_mb", "path"]
    ].to_csv(f"{OUT}/content_duplicates.csv", index=False)

    # 3) aynı ad (önek atılmış), farklı içerik
    ng = F.groupby(["psi_id", "base_name"])
    name_conf = F[F.set_index(["psi_id", "base_name"]).index.isin(
        [k for k, v in ng if v["md5"].nunique() > 1])]
    name_conf.sort_values(["psi_id", "base_name"])[
        ["psi_id", "base_name", "file", "rows", "cols", "size_mb", "md5"]
    ].to_csv(f"{OUT}/same_name_different_content.csv", index=False)

    # 4) şema aileleri
    fam = (ok.groupby(["psi_id", "schema"])
             .agg(n_files=("file", "count"), total_rows=("rows_clean", "sum"),
                  n_cols=("cols_clean", "first"), example=("file", "first"))
             .reset_index().sort_values(["n_files"], ascending=False))
    fam.to_csv(f"{OUT}/schema_families.csv", index=False)

    F.drop(columns=["content_hash"], errors="ignore").to_csv(f"{OUT}/files.csv", index=False)
    I.to_csv(f"{OUT}/issues.csv", index=False)

    # ---------- özet ----------
    wasted = exact[~exact["tutulması_önerilen"]]["size_mb"].sum()
    print("\n" + "=" * 70 + "\nÖZET\n" + "=" * 70)
    print(f"Toplam dosya              : {len(F)}")
    print(f"Okunamayan / boş          : {(F['status'] != 'ok').sum()}")
    print(f"Birebir aynı dosya grubu  : {exact['group'].nunique() if len(exact) else 0} "
          f"({len(exact)} dosya, gereksiz ≈ {wasted:.0f} MB)")
    print(f"İçerik aynı (byte farklı) : {content['group'].nunique() if len(content) else 0} grup "
          f"({len(content)} dosya)")
    print(f"Aynı ad, farklı içerik    : {name_conf['base_name'].nunique() if len(name_conf) else 0} ad")
    print(f"Şema ailesi               : {len(fam)} (≥2 dosyalı: {(fam['n_files'] > 1).sum()})")

    print("\nSorun türleri:")
    if len(I):
        with pd.option_context("display.width", 200, "display.max_rows", None):
            print(I.groupby(["severity", "issue"]).size().sort_index().to_string())

        print("\nEn çok uyarı alan 15 dosya:")
        top = (I[I.severity != "INFO"].groupby(["psi_id", "file"]).size()
                 .sort_values(ascending=False).head(15))
        print(top.to_string())

    print(f"\nRaporlar: {OUT}/ → files.csv, issues.csv, exact_duplicates.csv, "
          f"content_duplicates.csv, same_name_different_content.csv, schema_families.csv")

if __name__ == "__main__":
    main()