import pandas as pd, glob, os
for f in sorted(glob.glob('/home/halil/repos/flame-freefall-iss/data_analysis/Nasa_data/analysis/data/*.parquet')):
    d=pd.read_parquet(f); print('\n##',os.path.basename(f),d.shape)
    print('cols:',list(d.columns))
    print('psi_id:',d['psi_id'].value_counts().to_dict() if 'psi_id' in d else None)
