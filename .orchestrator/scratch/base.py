import pandas as pd, numpy as np, warnings; warnings.filterwarnings('ignore')
from sklearn.model_selection import GroupKFold
from sklearn.ensemble import HistGradientBoostingRegressor as HGR, HistGradientBoostingClassifier as HGC
from sklearn.linear_model import RidgeCV, LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.metrics import r2_score, mean_absolute_error, roc_auc_score
D='/home/halil/repos/flame-freefall-iss/data_analysis/Nasa_data/analysis/data/'
cat=pd.read_csv('/home/halil/repos/flame-freefall-iss/data_analysis/Nasa_data/analysis/outputs/feature_catalog.csv')
def feats(ds): return cat[(cat.dataset==ds)&(cat.role=='feature')].column.tolist()
print('catalog roles per dataset');print(cat.groupby(['dataset','role']).size().unstack(fill_value=0))
def run(name, df, target, fcols, grp, task='reg', tf=None, nspl=5, drop=()):
    fcols=[c for c in fcols if c in df and c!=target and c not in drop and c!=grp]
    d=df[df[target].notna()].copy(); 
    d=d[d[grp].notna()]
    y=d[target].astype(float); g=d[grp].astype(str)
    nums=[c for c in fcols if pd.api.types.is_numeric_dtype(d[c]) or d[c].dtype==bool]
    cats=[c for c in fcols if c not in nums]
    # drop all-nan numeric
    nums=[c for c in nums if d[c].notna().any()]
    for c in nums: d[c]=d[c].astype(float)
    ng=g.nunique(); k=min(nspl,ng)
    print(f'\n[{name}] target={target} n={len(d)} groups({grp})={ng} target_missing_in_table={df[target].isna().mean():.3f} features={nums+cats}')
    pre=ColumnTransformer([('n',make_pipeline(SimpleImputer(strategy='median'),StandardScaler()),nums),('c',make_pipeline(SimpleImputer(strategy='constant',fill_value='NA'),OneHotEncoder(handle_unknown='ignore')),cats)])
    pre2=ColumnTransformer([('n','passthrough',nums),('c',make_pipeline(SimpleImputer(strategy='constant',fill_value='NA'),OneHotEncoder(handle_unknown='ignore',sparse_output=False)),cats)])
    res={}
    for mn,mdl in (('ridge',make_pipeline(pre,RidgeCV(alphas=np.logspace(-2,3,12)))),('hgb',make_pipeline(pre2,HGR(max_depth=3,learning_rate=.05,max_iter=200,min_samples_leaf=8))),('mean',None)):
        pr=np.full(len(d),np.nan)
        for tr,te in GroupKFold(k).split(d,y,g):
            ytr=y.iloc[tr]; 
            if mn=='mean': pr[te]=ytr.mean() if tf!='log' else np.expm1(np.log1p(ytr).mean()); continue
            if tf=='sqrt': m=mdl.fit(d.iloc[tr][nums+cats],np.sqrt(ytr)); pr[te]=np.clip(m.predict(d.iloc[te][nums+cats]),0,None)**2
            elif tf=='log': m=mdl.fit(d.iloc[tr][nums+cats],np.log(ytr)); pr[te]=np.exp(m.predict(d.iloc[te][nums+cats]))
            else: m=mdl.fit(d.iloc[tr][nums+cats],ytr); pr[te]=m.predict(d.iloc[te][nums+cats])
        res[mn]=(r2_score(y,pr),mean_absolute_error(y,pr))
    print(f'  GroupKFold({k}) by {grp}:',{k_:f'R2={v[0]:.3f} MAE={v[1]:.3f}' for k_,v in res.items()})
def runc(name, df, target, fcols, grp, nspl=5):
    fcols=[c for c in fcols if c in df and c!=target and c!=grp]
    d=df[df[target].notna()&df[grp].notna()].copy(); y=d[target].astype(int); g=d[grp].astype(str)
    nums=[c for c in fcols if pd.api.types.is_numeric_dtype(d[c])and d[c].notna().any()]; cats=[c for c in fcols if c not in nums and not pd.api.types.is_numeric_dtype(d[c])]
    k=min(nspl,g.nunique())
    print(f'\n[{name}] target={target} n={len(d)} pos={y.mean():.3f} groups({grp})={g.nunique()} target_missing={df[target].isna().mean():.3f} features={nums+cats}')
    pre=ColumnTransformer([('n',make_pipeline(SimpleImputer(strategy='median'),StandardScaler()),nums),('c',make_pipeline(SimpleImputer(strategy='constant',fill_value='NA'),OneHotEncoder(handle_unknown='ignore')),cats)])
    for mn,mdl in (('logit',make_pipeline(pre,LogisticRegression(C=1,max_iter=2000,class_weight='balanced'))),):
        pr=np.full(len(d),np.nan); ok=True
        for tr,te in GroupKFold(k).split(d,y,g):
            if y.iloc[tr].nunique()<2: ok=False;continue
            pr[te]=mdl.fit(d.iloc[tr][nums+cats],y.iloc[tr]).predict_proba(d.iloc[te][nums+cats])[:,1]
        m=~np.isnan(pr); print(f'  GroupKFold({k}) by {grp}: {mn} AUC={roc_auc_score(y[m],pr[m]):.3f}')
fx=pd.read_parquet(D+'flex.parquet'); cf=pd.read_parquet(D+'cfi.parquet'); sm=pd.read_parquet(D+'smoke.parquet'); an=pd.read_parquet(D+'acme_normal.parquet'); b2=pd.read_parquet(D+'bass2.parquet')
fx['fd']=fx.fuel.astype(str)+'|'+fx.diluent.astype(str); cf['fd']=cf.fuel.astype(str)+'|'+cf.diluent.astype(str)
print(fx.groupby('fd').size().to_dict()); print(cf.groupby('fd').size().to_dict())
print('FLEX features:',feats('flex'));print('CFI',feats('cfi'));print('smoke',feats('smoke'));print('acme_normal',feats('acme_normal'))
fxf=['d0_mm','p_atm','x_o2','x_he','x_co2','fuel','diluent']
for g in ('fd','year'):
    run('flex',fx,'burn_time_s',fxf,g,tf='sqrt')
    run('flex',fx,'burn_rate_K_mm2_s',[c for c in fxf if c!='x_n2'],g)
# test_end excluded-only variants: burn_time restricted to Completion? (note leak: test_end)
run('flex+',fx,'burn_time_s',fxf+['test_end'],'fd',tf='sqrt')  # test_end is an outcome - shown only to quantify
cff=['d0_mm','p_atm','x_o2','x_he','x_n2','fuel','diluent','fiber']
cff=[c for c in cff if c in cf]
run('cfi',cf,'k_hot_mm2_s',cff,'fd',tf='sqrt'); run('cfi',cf,'hf_burn_time_s',cff,'fd')
# smoke flight only
smf=sm[sm.campaign!='ground']
print(sm.campaign.value_counts().to_dict(), sm.gravity.value_counts(dropna=False).to_dict())
run('smoke flight',smf,'amd_um',['material','rt_r0','aging_s','inlet_velocity_cm_s','campaign'],'material',tf='log')
run('smoke flight no material',smf,'amd_um',['rt_r0','aging_s','inlet_velocity_cm_s','campaign'],'material',tf='log')
anc=an[an.experiment=='CFI-G']
runc('acme_normal CFI-G',anc,'hot_ignition',['xo2_init','p_atm','zst','tad_k_calc','fuel_base','x_fuel'],'day')
runc('acme_normal CFI-G',anc,'hot_ignition',['xo2_init','p_atm','zst','fuel_base'],'fuel_base')
anc=anc.assign(burn_time_s=anc.burn_time_s.where(anc.burn_time_s>0)); run('acme_normal CFI-G',anc,'burn_time_s',['xo2_init','p_atm','zst','tad_k_calc','fuel_base'],'day',tf='log')
run('bass2',b2[b2.o2_final_anomaly_flag!=True],'d_o2_pct',['material','geometry','thickness_mm','flow_restrictor','air_display_initial'],'pi')
