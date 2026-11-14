# drilldown.py — audit sonuçlarını derinleştirir, hiçbir dosyayı silmez
import re, pandas as pd

F = pd.read_csv("audit/files.csv")
I = pd.read_csv("audit/issues.csv")
E = pd.read_csv("audit/exact_duplicates.csv")

# --- 1) kanonik dosya listesi ---
drop_dup = set(E.loc[~E["tutulması_önerilen"], "path"])
F["exclude_reason"] = ""
F.loc[F["path"].isin(drop_dup), "exclude_reason"] = "birebir kopya"
F.loc[F["file"].str.contains(r"wrong", case=False) & (F["exclude_reason"] == ""),
      "exclude_reason"] = "adında 'wrong'"
F["use"] = F["exclude_reason"] == ""
F.to_csv("audit/canonical_files.csv", index=False)
canon = set(F.loc[F["use"], "file"])
Ic = I[I["file"].isin(canon)]

n_kopya = (F.exclude_reason == "birebir kopya").sum()
n_wrong = (F.exclude_reason == "adında 'wrong'").sum()

out = []
out.append(f"# Drilldown\n\nKanonik dosya: {F['use'].sum()} / {len(F)} "
           f"(kopya: {n_kopya}, wrong: {n_wrong})\n")

# --- 2) PSI-ID x uyarı tablosu ---
w = Ic[Ic.severity == "WARN"]
out.append("## Uyarılar (kanonik dosyalar)\n")
out.append(w.pivot_table(index="psi_id", columns="issue", values="file",
                         aggfunc="count", fill_value=0).to_markdown())

# --- 3) tekrarlanan satır oranları ---
d = w[w.issue == "birebir tekrarlanan satır"].copy()
d["pct"] = d["detail"].str.extract(r"\(([\d.]+)%\)").astype(float)
out.append("\n\n## Tekrarlanan satır oranı (%)\n")
out.append(d.groupby("psi_id")["pct"].describe()[["count", "50%", "max"]].round(1).to_markdown())
out.append("\n\nEn yüksek 10:\n")
out.append(d.nlargest(10, "pct")[["psi_id", "file", "detail"]].to_markdown(index=False))

# --- 4) monoton olmayan zaman sütunları ---
t = w[w.issue == "zaman sütunu monoton değil"].copy()
t["col"] = t["detail"].str.split(":").str[0]
out.append("\n\n## Monoton olmayan zaman sütunları (sütun adı → dosya sayısı)\n")
out.append(t.groupby(["psi_id", "col"]).size().rename("n").reset_index()
             .sort_values("n", ascending=False).head(25).to_markdown(index=False))

# --- 5) sentinel geçen sütunlar ---
s = w[w.issue.str.startswith("sentinel")]
cols = s["detail"].str.findall(r"'([^']+)':").explode()
out.append("\n\n## Sentinel içeren sütunlar (ilk 25)\n")
out.append(cols.value_counts().head(25).to_markdown())

# --- 6) sayısal sütunda metin token'ları ---
m = w[w.issue == "sayısal sütunda metin token'ı"]
if len(m):
    out.append("\n\n## Sayısal sütunlarda metin token'ları (örnek 15)\n")
    out.append(m[["psi_id", "file", "detail"]].head(15).to_markdown(index=False))

# --- 7) şema aileleri (kanonik) ---
fam = (F[F.use & F.status.eq("ok")].groupby(["psi_id", "schema"])
       .agg(n=("file", "count"), rows=("rows_clean", "sum"), cols=("cols_clean", "first"),
            example=("file", "first")).reset_index().sort_values("n", ascending=False))
out.append("\n\n## En büyük 20 şema ailesi (kanonik)\n")
out.append(fam.head(20).to_markdown(index=False))

open("audit/drilldown.md", "w").write("\n".join(out))
print("audit/drilldown.md ve audit/canonical_files.csv yazıldı")