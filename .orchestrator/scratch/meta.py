import pandas as pd
d=pd.read_parquet('/home/halil/repos/flame-freefall-iss/data_analysis/Nasa_data/meta/investigations.parquet'); print(list(d.columns))
print(d[d.iloc[:,0].astype(str).isin(['PSI-10','PSI-159','PSI-20','PSI-25','PSI-39','PSI-69','PSI-98','PSI-99','PSI-100','PSI-101','PSI-107'])].filter(regex='(?i)id|title|doi|name').to_string()[:3500])
