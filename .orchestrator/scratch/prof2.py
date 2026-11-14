import pandas as pd
D='/home/halil/repos/flame-freefall-iss/data_analysis/Nasa_data/analysis/data/'
for n,cols,g in [('flex',['burn_time_s','burn_rate_K_mm2_s','d_ext_mm','test_end','d0_mm'],['year','fuel']),('cfi',['k_hot_mm2_s','hf_burn_time_s','d_ext_hot_mm','has_cool_flame','d0_mm'],['fuel','diluent']),
 ('acme_normal',['hot_ignition','burn_time_s','ext_mode'],['day','fuel_base']),('acme_inverse',['hot_ignition','burn_time_s','ext_mode'],['day','fuel_base']),
 ('smoke',['amd_um','dusttrak_b_mg_m3','dam_um'],['material','campaign','gravity']),('bass2',['d_o2_pct','d_co2_pct','co_final_ppm'],['pi','material']),
 ('spice',['flame_duration_s'],['Fuel']),('saffire1',['Burn Time (s)'],['Material']),('saffire2',['Burn Time (s)','ug Spread Length'],['Material']),('saffire3',['Material'],['Material'])]:
    d=pd.read_parquet(D+n+'.parquet'); print(n,d.shape)
    for c in cols: print('  miss',c,f'{d[c].isna().mean():.3f}')
    for c in g: print('  groups',c,d[c].nunique())
x=pd.read_parquet(D+'acme_normal.parquet'); print((x.experiment).value_counts().to_dict()); print(x[x.experiment=='CFI-G'].burn_time_s.describe().to_dict())
a=pd.read_parquet(D+'acme_inverse.parquet');print(a.experiment.value_counts().to_dict())
s=pd.read_parquet(D+'spice.parquet');print(s.flame_duration_s.describe().to_dict(), s.dup_of_previous.sum()); print(s.Fuel.value_counts().to_dict())
print(pd.read_parquet(D+'smoke.parquet').groupby(['gravity','material']).size().to_dict())
