"""Önbellekli veri/model erişimi ve sayfalar arası paylaşılan senaryo durumu.

Önbellek anahtarları dosya imzalarıdır (mtime + boyut): ekip
data/processed/bass2_clean.csv veya models/*.joblib eklediğinde/güncellediğinde
uygulama yeniden başlatılmadan bir sonraki etkileşimde yeni dosyaları kullanır.
"""
from __future__ import annotations

import streamlit as st

from app import config as C
from app.core import data as D
from app.core import models as M
from app.core.risk import Scenario
from app.i18n import t


@st.cache_data(show_spinner=False)
def _data(signature: str) -> D.DataBundle:
    return D.load(C.DATA_PATH)


@st.cache_resource(show_spinner=False)
def _model(data_sig: str, models_sig: str, _df) -> tuple[M.ModelBundle, list[tuple[str, dict]]]:
    return M.resolve(_df)


def data() -> D.DataBundle:
    # Önbellek içeriği dilden bağımsızdır; yalnızca bekleme mesajı aktif dilde gösterilir.
    with st.spinner(t("spinner.data")):
        return _data(D.file_signature(C.DATA_PATH))


def model() -> tuple[M.ModelBundle, list[tuple[str, dict]]]:
    b = data()
    with st.spinner(t("spinner.model")):
        return _model(b.signature, M.dir_signature(), b.df)


def refresh() -> None:
    _data.clear()
    _model.clear()


def scenario() -> Scenario:
    if "scenario" not in st.session_state:
        st.session_state.scenario = Scenario()
    return st.session_state.scenario


# --------------------------------------------------------------------------- #
# Sayfa değişiminde kaybolmayan widget değerleri
# Streamlit, görüntülenmeyen widget'ların anahtarlarını siler; bu yardımcılar
# değerleri kalıcı bir sözlükte tutar ve sayfaya dönüldüğünde geri yükler.
# --------------------------------------------------------------------------- #
def bind(key: str, default):
    store = st.session_state.setdefault("_persist", {})
    if key not in st.session_state:
        st.session_state[key] = store.get(key, default)
    return key


def save(*keys: str) -> None:
    store = st.session_state.setdefault("_persist", {})
    for k in keys:
        if k in st.session_state:
            store[k] = st.session_state[k]
