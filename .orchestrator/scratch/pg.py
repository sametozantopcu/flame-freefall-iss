import pandas as pd,re
d=pd.read_parquet('/home/halil/repos/flame-freefall-iss/data_analysis/Nasa_data/meta/investigations.parquet')
for _,r in d.iterrows():
    t=' '.join(str(r[c]) for c in ['title','objective','approach','hypothesis','research_impacts'])
    m=re.findall(r'.{60}(?:partial[- ]g|lunar|martian|mars\b|reduced gravity|0\.\d+ ?g\b).{60}',t,flags=re.I)
    if m: print(r.psi_id,r.title[:50],'|',m[:2])
