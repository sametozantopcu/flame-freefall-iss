"""Visual language: dark "mission control" theme, validated palette, Plotly template.

Colours are assigned by role (identity / magnitude / status). The first three
slots of the categorical palette passed CVD validation on the dark surface for
every pair.
"""
from __future__ import annotations

import plotly.graph_objects as go
import plotly.io as pio
import streamlit as st

# Surfaces and ink
PAGE = "#0d0d0d"
SURFACE = "#1a1a19"
SURFACE_2 = "#232321"
INK = "#f0efec"
INK_2 = "#c3c2b7"
MUTED = "#898781"
GRID = "#2c2c2a"
AXIS = "#383835"
BORDER = "rgba(255,255,255,0.10)"

# Categorical (identity) — fixed order
BLUE = "#3987e5"     # slot 1
ORANGE = "#d95926"   # slot 2
AQUA = "#199e70"     # slot 3
SERIES = [BLUE, ORANGE, AQUA]

# Outcome encoding: colour + symbol (colour alone carries no meaning)
OUTCOME_COLOR = {"burning": ORANGE, "extinguished": BLUE}
OUTCOME_SYMBOL = {"burning": "circle", "extinguished": "x-thin-open"}

# Status (reserved — never used as a series colour), always with icon + label
STATUS = {"good": "#0ca30c", "warning": "#fab219", "serious": "#ec835a", "critical": "#d03b3b", "info": "#898781"}
STATUS_ICON = {"good": "✓", "warning": "!", "serious": "▲", "critical": "✕", "info": "i"}

# Diverging (Olson margin: negative = safe/blue, positive = flammable/red, 0 = neutral grey)
DIVERGING = [
    [0.0, "#104281"], [0.25, "#3987e5"], [0.5, "#383835"], [0.75, "#e66767"], [1.0, "#a32b2b"],
]

FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
MONO = 'ui-monospace, "Cascadia Mono", "SF Mono", Consolas, monospace'


def _register_plotly_template() -> None:
    t = go.layout.Template()
    t.layout = go.Layout(
        paper_bgcolor=SURFACE, plot_bgcolor=SURFACE,
        font=dict(family=FONT, color=INK_2, size=12),
        title=dict(font=dict(color=INK, size=14), x=0, xanchor="left", xref="paper", y=1, yref="container", yanchor="top", pad=dict(t=12)),
        colorway=SERIES,
        margin=dict(l=56, r=20, t=52, b=56),
        xaxis=dict(gridcolor=GRID, linecolor=AXIS, zerolinecolor=AXIS, tickcolor=AXIS,
                   title=dict(font=dict(color=MUTED, size=12)), tickfont=dict(color=MUTED)),
        yaxis=dict(gridcolor=GRID, linecolor=AXIS, zerolinecolor=AXIS, tickcolor=AXIS,
                   title=dict(font=dict(color=MUTED, size=12)), tickfont=dict(color=MUTED)),
        legend=dict(orientation="h", yanchor="top", y=-0.2, xanchor="left", x=0,
                    font=dict(color=INK_2), bgcolor="rgba(0,0,0,0)"),
        hoverlabel=dict(bgcolor=SURFACE_2, bordercolor=AXIS, font=dict(color=INK, family=FONT)),
        hovermode="closest",
    )
    t.data.scatter = [go.Scatter(line=dict(width=2), marker=dict(size=9, line=dict(width=1.5, color=SURFACE)))]
    t.data.bar = [go.Bar(marker=dict(line=dict(width=2, color=SURFACE)))]
    pio.templates["flame"] = t
    pio.templates.default = "flame"


_CSS = f"""
<style>
:root {{
  --page:{PAGE}; --surface:{SURFACE}; --surface-2:{SURFACE_2};
  --ink:{INK}; --ink-2:{INK_2}; --muted:{MUTED}; --border:{BORDER};
  --flame:{ORANGE}; --good:{STATUS['good']}; --warning:{STATUS['warning']};
  --serious:{STATUS['serious']}; --critical:{STATUS['critical']};
}}
.stApp {{ background: var(--page); }}
.block-container {{ padding-top: 2.2rem; max-width: 1480px; }}
section[data-testid="stSidebar"] {{ background: #121211; border-right: 1px solid var(--border); }}
h1, h2, h3, h4 {{ color: var(--ink); letter-spacing: -0.01em; }}

.ff-head {{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px;
            border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:18px; flex-wrap:wrap; }}
.ff-head .eyebrow {{ font: 600 11px/1 {MONO}; letter-spacing:.14em; text-transform:uppercase; color:var(--flame); }}
.ff-head h1 {{ font-size: 1.75rem; margin: 6px 0 2px; padding:0; }}
.ff-head p {{ color: var(--ink-2); margin:0; font-size:.95rem; max-width: 760px; }}

.ff-badge {{ display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px;
             font: 600 11px/1.4 {MONO}; letter-spacing:.06em; border:1px solid var(--border);
             background: var(--surface-2); color: var(--ink-2); white-space:nowrap; }}
.ff-badge .dot {{ width:7px; height:7px; border-radius:50%; display:inline-block; }}

.ff-card {{ background: var(--surface); border:1px solid var(--border); border-radius:10px; padding:14px 16px; }}
.ff-kpi {{ background: var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 14px;
           min-height: 122px; position:relative; overflow:hidden; }}
.ff-kpi .lbl {{ color: var(--muted); font-size: 12px; font-weight:500; }}
.ff-kpi .val {{ color: var(--ink); font-size: 1.65rem; font-weight: 600; margin-top:4px; line-height:1.15; }}
.ff-kpi .val small {{ font-size: .85rem; color: var(--ink-2); font-weight:500; margin-left:3px; }}
.ff-kpi .sub {{ color: var(--ink-2); font-size: 12px; margin-top:4px; }}
.ff-kpi .bar {{ position:absolute; left:0; top:0; bottom:0; width:3px; }}
.ff-kpi .st {{ font-size: 11px; font-weight:600; margin-top:6px; display:flex; gap:6px; align-items:center; color: var(--ink-2); }}

.ff-banner {{ display:flex; align-items:center; gap:18px; border-radius:12px; padding:16px 20px;
              border:1px solid var(--border); background: var(--surface); margin-bottom: 14px; }}
.ff-banner .lvl {{ font: 700 1.35rem/1 {FONT}; color: var(--ink); letter-spacing:.04em; }}
.ff-banner .msg {{ color: var(--ink-2); font-size:.95rem; }}
.ff-banner .score {{ margin-left:auto; text-align:right; }}
.ff-banner .score b {{ font-size:1.9rem; color:var(--ink); font-weight:600; }}
.ff-banner .score span {{ display:block; color:var(--muted); font-size:11px; }}
.ff-icon {{ width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center;
            font-weight:800; font-size:18px; color:#0b0b0b; flex: 0 0 auto; }}
.ff-icon.sm {{ width:20px; height:20px; font-size:11px; }}

.ff-insight {{ display:flex; gap:12px; padding:12px 14px; border:1px solid var(--border); border-radius:10px;
               background: var(--surface); margin-bottom:8px; }}
.ff-insight .t {{ color: var(--ink); font-weight:600; font-size:.93rem; }}
.ff-insight .b {{ color: var(--ink-2); font-size:.87rem; margin-top:2px; line-height:1.45; }}
.ff-insight .src {{ margin-left:auto; font: 600 10px/1 {MONO}; color: var(--muted); letter-spacing:.08em;
                    text-transform:uppercase; padding-top:3px; white-space:nowrap; }}

.ff-cmd {{ font: 700 1.6rem/1.2 {MONO}; color: var(--ink); background:#0b0b0a; border:1px solid var(--border);
           border-radius:8px; padding:14px 16px; margin: 8px 0 10px; letter-spacing:.03em; }}
.ff-step {{ display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:8px; color:var(--muted);
            font-size:.88rem; }}
.ff-step.on {{ background: var(--surface-2); color: var(--ink); border:1px solid var(--border); }}
.ff-step.done {{ color: var(--ink-2); }}
.ff-step code {{ font-family:{MONO}; font-size:11px; color: var(--muted); background:none; min-width:40px; }}
.ff-timer {{ font: 600 3rem/1 {MONO}; color: var(--ink); }}
.ff-log {{ font: 12px/1.6 {MONO}; color: var(--ink-2); max-height: 240px; overflow:auto; }}
.ff-section {{ font: 600 11px/1 {MONO}; letter-spacing:.14em; text-transform:uppercase; color: var(--muted);
               margin: 18px 0 10px; }}
@media (max-width: 700px) {{
  .ff-banner {{ flex-wrap: wrap; }} .ff-banner .score {{ margin-left:0; text-align:left; }}
}}
</style>
"""


def inject() -> None:
    _register_plotly_template()
    st.markdown(_CSS, unsafe_allow_html=True)
