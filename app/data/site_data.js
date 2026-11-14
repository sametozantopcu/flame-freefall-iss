window.FF = window.FF || {};
window.FF.site = {
 "cards": [
  {
   "caveat": "Only the completion subset (a small share of tests) supports d-squared scaling; burn time of extinguished droplets is cut short and must not be read without the end-of-test flag. In the CFI data (PSI-39, DOI 10.60555/m6pj-a914) the hot-flame burn time vs d0 slope is reversed (-1.42, from group_effects_numbers.json): large droplets reach radiative extinction earlier.",
   "doi": "10.60555/mbq8-0451",
   "equipment_implication": "Droplet-combustion sizing or burn-time planning must condition on completion vs extinction; do not extrapolate a single d-squared law across both outcomes.",
   "finding": "For FLEX droplets that burned to completion, log burn time rises with log initial diameter with slope 2.13 (95% CI 1.76 to 2.52, n=27), close to the d-squared value of 2. Over all tests the slope drops to 1.31 (n=260) and for tests ending in extinction to 1.00 (n=179).",
   "id": "flex_d2_slope",
   "n": 27,
   "psi_id": "PSI-69",
   "source_file": "data_analysis/Nasa_data/analysis/outputs/d2_law_flex.csv",
   "title": "FLEX droplets: burn time follows the d-squared law only when the burn completes",
   "unit": "log-log slope",
   "value": 2.125010356056976,
   "values": {
    "cfi_doi": "10.60555/m6pj-a914",
    "cfi_hf_slope": -1.4247235803,
    "cfi_psi_id": "PSI-39",
    "ci_hi": 2.5223619911275392,
    "ci_lo": 1.759391298014787,
    "n_all": 260,
    "n_extinction": 179,
    "slope_all": 1.3095343814009959,
    "slope_extinction": 0.9959579662558418
   }
  },
  {
   "caveat": "The EDA report (section 6.1) states there is no hot ignition at ~21% O2 for butane/propane; this is not reproduced by the Feature Store rows (hot_ignition_raw), so the card reports the measured rate. Small n, mixed fuel fractions and pressures, test-day effects are strong; flames that ignite mostly self-extinguish (SE). PSI-10 (Flame Design) rows carry no outcome column and are not used.",
   "doi": "10.60555/cyt1-kh64",
   "equipment_implication": "Do not assume a cabin-air (~21% O2) flame will fail to ignite: treat ignition as possible but uncertain and keep ignition sources controlled in the habitat.",
   "finding": "At 20.5-21.5% initial O2 (butane and propane, ACME CFI-G normal flames) 20 of 34 tests hot-ignited (rate 0.59; butane 5/11, propane 15/23). At 35% O2 and above the rate is 0.72 (n=86).",
   "id": "acme_ignition_21pct_o2",
   "n": 34,
   "psi_id": "PSI-159",
   "source_file": "data_analysis/Nasa_data/analysis/data/acme_normal.parquet",
   "title": "ACME normal flames: hot ignition at about 21% O2 is partial, not absent",
   "unit": "hot-ignition fraction",
   "value": 0.5882352941176471,
   "values": {
    "hot": 20,
    "n": 34,
    "n_o2_ge_35": 86,
    "per_fuel": {
     "butane": {
      "hot": 5,
      "n": 11
     },
     "propane": {
      "hot": 15,
      "n": 23
     }
    },
    "rate_o2_ge_35": 0.7209302325581395
   }
  },
  {
   "caveat": "Smoke rows (SAME and SAME-R flight data) sit in the PSI-101 workbook; the pooled n includes 10 ground rows whose column mapping is unverified (the within-material check is flight only). Correlation, not a causal model; materials are not balanced across campaigns.",
   "doi": "10.60555/2np7-jv14",
   "equipment_implication": "Smoke-detector or particle-size models must include material as a feature; without it the learned heater-temperature trend points the wrong way.",
   "finding": "Across all smoke tests, heater temperature ratio Rt/R0 correlates negatively with particle mean diameter (Spearman rho -0.27, n=141); with material held fixed the partial rho is 0.49, and within each material it is positive in 5 of 5 materials.",
   "id": "smoke_simpson_rt_r0",
   "n": 141,
   "psi_id": "PSI-101",
   "source_file": "data_analysis/Nasa_data/analysis/outputs/partial_correlations.csv",
   "title": "Smoke particle size: Simpson's paradox hides the heater-temperature effect",
   "unit": "partial Spearman rho (material fixed)",
   "value": 0.4913896972239928,
   "values": {
    "marginal_rho": -0.27148050004320295,
    "materials_positive": 5,
    "materials_total": 5,
    "partial_rho": 0.4913896972239928
   }
  },
  {
   "caveat": "PMMA only, burns with an O2 drop larger than 0.2 points; O2 and CO2 changes carry nearly the same information, so they are not independent targets. Median ratio, not a fit uncertainty.",
   "doi": "10.60555/4qc4-de67",
   "equipment_implication": "O2 and CO2 sensors in the enclosure cross-check each other; a ratio far from about -0.8 for a PMMA-like fuel signals a sensor fault.",
   "finding": "Median change in CO2 over change in O2 for PMMA burns is -0.80 (n=66), against the theoretical -0.83 (-5/6).",
   "id": "bass2_co2_o2_ratio",
   "n": 66,
   "psi_id": "PSI-25",
   "source_file": "data_analysis/Nasa_data/analysis/outputs/group_effects_numbers.json",
   "title": "BASS-II PMMA: CO2 gain per O2 lost matches stoichiometry",
   "unit": "dCO2/dO2 (median)",
   "value": -0.8,
   "values": {
    "theoretical": -0.8333333333333334
   }
  }
 ],
 "flamesense": {
  "built": false,
  "concept": true,
  "dimensions_mm": [
   140,
   90,
   45
  ],
  "images": [
   "assets/flamesense_box/render_assembled.png",
   "assets/flamesense_box/render_internal.png",
   "assets/flamesense_box/render_exploded.png",
   "assets/flamesense_box/render_detail.png"
  ],
  "ionization": "concept only",
  "mcu": "ESP32-S3",
  "sensors": [
   "O2 (LuminOx)",
   "CO",
   "CO2 (SCD41)",
   "hot-wire flow",
   "particulate (SPS30)",
   "thermal array (MLX90640)"
  ]
 },
 "generated": "2026-06-09",
 "investigations": [
  {
   "components": {
    "data_volume": 0.8327948301433042,
    "has_flight": 1.0,
    "has_solid": 1.0,
    "low_flow_overlap": 1.0,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/2np7-jv14",
   "envelope": {
    "diluents": [],
    "flow_cm_s": {
     "max": 8.1,
     "min": 1.0
    },
    "fuels": [
     "Kapton",
     "Lampwick",
     "Pyrell",
     "Silicone",
     "Teflon"
    ],
    "gravity": [
     "1g",
     "µg"
    ],
    "materials": [
     "Kapton",
     "Lampwick",
     "Pyrell",
     "Silicone",
     "Teflon"
    ],
    "n_rows": 167,
    "o2_pct": null,
    "phenomena": [
     "smoke"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap"
   ],
   "n_components_known": 4,
   "name": "SAME-R",
   "psi_id": "PSI-101",
   "qa_text": "Objective: Similar to the original SAME investigation, the primary objective of the SAME-R investigation was to quantify the sizes that the liquid smoke particulate achieves in low gravity and to relate the droplet size distribution to the smoke generation and smoke transport conditions in the experiment. One of the problems encountered during the SAME investigation was that after the thermal precipitators were returned to the ground, it was found that all the TEM grids were severely contaminated with some unidentified foreign particles, making these grids unusable although some of them showed shapes of certain types of smoke particles. Based on that experience the SAME-R investigation employed several modification covering new materials, extended operating conditions, and diagnostic equipments. Approach: SAME-R utilized the SAME hardware used on-orbit. Based on the experience gained from SAME, SAME-R included the following modifications: 1) a new test material, Pyrell®, an intumescent fire-retardant foam by Foamex, was introduced to replace DBP samples, 2) test conditions were broadened including higher heating temperatures and no-flow during sample heating time, and 3) a new...",
   "rank": 1,
   "rationale": "Score 95/100 from 4 known components (low-flow overlap 100%, micro-g flight data); 2 component(s) unknown.",
   "score": 95.4398590039083,
   "score_status": "scored",
   "summary": "Similar to the original SAME investigation, the primary objective of the SAME-R investigation was to quantify the sizes that the liquid smoke particulate achieves in low gravity and to relate the droplet size distribution to the smoke generation and smoke transport conditions in the experiment. One of the problems encountered during the SAME investigation was that after the thermal precipitators were returned to the...",
   "title": "Smoke Aerosol Measurement Experiment-Reflight"
  },
  {
   "components": {
    "data_volume": 0.4506272025479436,
    "has_flight": 1.0,
    "has_solid": 1.0,
    "low_flow_overlap": 1.0,
    "o2_overlap": 1.0,
    "pressure_overlap": null
   },
   "doi": "10.60555/2chp-m469",
   "envelope": {
    "diluents": [],
    "flow_cm_s": {
     "max": 20.0,
     "min": 20.0
    },
    "fuels": [
     "Cotton-Fiberglass (SIBAL)",
     "PMMA",
     "PMMA & Nomex",
     "Silicone"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [
     "Cotton-Fiberglass (SIBAL)",
     "PMMA",
     "PMMA & Nomex",
     "Silicone"
    ],
    "n_rows": 15,
    "o2_pct": {
     "max": 22.1,
     "min": 21.5
    },
    "phenomena": [
     "burn_time",
     "flame_spread"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "pressure_overlap"
   ],
   "n_components_known": 5,
   "name": "SAFFIRE-II",
   "psi_id": "PSI-99",
   "qa_text": "Objective: The objectives of SAFFIRE-II are to determine how rapidly a large scale fire grows in low-gravity and to investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test. Approach: The Saffire-II experiment was performed on the Orbital Science’s Cygnus resupply vehicle after it deberthed from the ISS. As a follow on to the Saffire-I investigation, the Saffire-II investigation added more samples including SIBAL, silicone, structure PMMA, flat PMMA, and PMMA with Nomex. The Saffire-1I flight unit had a sample card installed in the middle of a large flow duct. Air is drawn through the flow duct by fans located at the top of the duct with flow straighteners at the bottom of the experiment module. Saffire-II has a sample card that contains 9 samples, each 5 cm x 29 cm. Depending on the sample material, the Saffire-II was conducted at an air flow velocity of either 20 or 30 cm/s, the flow being either concurrent or opposed. Once the sample was ignited flame images were captured using two cameras. In addition, thermocouples provided flow, flame, and plume temperatures, two radiometers recorded flame...",
   "rank": 2,
   "rationale": "Score 90/100 from 5 known components (O2 overlap 100%, low-flow overlap 100%, micro-g flight data); 1 component(s) unknown.",
   "score": 89.69926004777393,
   "score_status": "scored",
   "summary": "The objectives of SAFFIRE-II are to determine how rapidly a large scale fire grows in low-gravity and to investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.",
   "title": "Spacecraft Fire Experiment-II"
  },
  {
   "components": {
    "data_volume": 0.5295365002327912,
    "has_flight": 1.0,
    "has_solid": 1.0,
    "low_flow_overlap": 1.0,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/gd4k-8h62",
   "envelope": {
    "diluents": [],
    "flow_cm_s": {
     "max": 8.0,
     "min": 2.0
    },
    "fuels": [
     "Kapton",
     "Lampwick",
     "Silicone",
     "Teflon"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [
     "Kapton",
     "Lampwick",
     "Silicone",
     "Teflon"
    ],
    "n_rows": 25,
    "o2_pct": null,
    "phenomena": [
     "smoke"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap"
   ],
   "n_components_known": 4,
   "name": "SAME",
   "psi_id": "PSI-102",
   "qa_text": "Objective: One of the major goals of this investigation was to quantify the sizes that the liquid smoke particulate achieves in low gravity and to relate the droplet size distribution to the smoke generation and smoke transport conditions in the experiment. A numerical code was to be developed to predict the smoke droplet growth as a function of the fuel pyrolysis rate, the thermodynamic properties of the pyrolysis vapor, and the flow environment. Approach: The crew installed the near field hardware in the Glovebox, attached the Far Field Box to the Glovebox, and positioned the video cameras. The operator then ran the self diagnostic procedures on the two smoke detectors and activated the video cameras, turned on the igniter for a predefined period of time (15 to 60 seconds), and initiated the thermophoretic soot samplers to sample the smoke. The actual duration of each combustion event was typically 2 minutes. After flight, the particulate collected on the thermophoretic probes were analyzed using a Transmission Electron microscope (TEM) to determine primary and aggregate particle dimensions. The remains of the samples were weighed to determine their mass loss. The digital...",
   "rank": 3,
   "rationale": "Score 87/100 from 4 known components (low-flow overlap 100%, micro-g flight data); 2 component(s) unknown.",
   "score": 87.16917727907612,
   "score_status": "scored",
   "summary": "One of the major goals of this investigation was to quantify the sizes that the liquid smoke particulate achieves in low gravity and to relate the droplet size distribution to the smoke generation and smoke transport conditions in the experiment. A numerical code was to be developed to predict the smoke droplet growth as a function of the fuel pyrolysis rate, the thermodynamic properties of the pyrolysis vapor, and...",
   "title": "Smoke and Aerosol Measurement Experiment"
  },
  {
   "components": {
    "data_volume": 0.2615809904791421,
    "has_flight": 1.0,
    "has_solid": 1.0,
    "low_flow_overlap": 1.0,
    "o2_overlap": 1.0,
    "pressure_overlap": null
   },
   "doi": "10.60555/0t15-1z43",
   "envelope": {
    "diluents": [],
    "flow_cm_s": {
     "max": 20.0,
     "min": 20.0
    },
    "fuels": [
     "SIBAL Fabric"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [
     "SIBAL Fabric"
    ],
    "n_rows": 4,
    "o2_pct": {
     "max": 21.5,
     "min": 21.5
    },
    "phenomena": [
     "burn_time"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "pressure_overlap"
   ],
   "n_components_known": 5,
   "name": "SAFFIRE-I",
   "psi_id": "PSI-98",
   "qa_text": "Objective: The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test. Approach: The Saffire-1 experiments was performed on the Orbital Science’s Cygnus resupply vehicle after it deberthed from the ISS. The sample material for Saffire-I is a composite fabric called Sibal consisting of cotton on a fiberglass substrate (75% cotton, 25% fiberglass by weight). It has been used in many space experiments because it burns like cotton but maintains structural integrity after the cotton is consumed. The sample was approximately 0.94 meters long and 0.4 meters wide, simulating a large piece of flammable fabric. The Saffire-1 flight unit had a sample card installed in the middle of a large flow duct. Air is drawn through the flow duct by fans located at the top of the duct with flow straighteners at the bottom of the experiment module. Saffire-I was conducted at an air flow velocity of 20 cm/s. Once the sample was ignited flame images were captured using two cameras. In addition, thermocouples...",
   "rank": 4,
   "rationale": "Score 86/100 from 5 known components (O2 overlap 100%, low-flow overlap 100%, micro-g flight data); 1 component(s) unknown.",
   "score": 86.15464357148392,
   "score_status": "scored",
   "summary": "The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.",
   "title": "Spacecraft Fire Safety Experiment-I"
  },
  {
   "components": {
    "data_volume": 0.7911174907119334,
    "has_flight": 1.0,
    "has_solid": 1.0,
    "low_flow_overlap": null,
    "o2_overlap": 0.6046511627906976,
    "pressure_overlap": null
   },
   "doi": "10.60555/4qc4-de67",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "Nomex",
     "PMMA",
     "SIBAL",
     "Wax candle"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [
     "Nomex",
     "PMMA",
     "SIBAL",
     "Wax candle"
    ],
    "n_rows": 129,
    "o2_pct": {
     "max": 22.2,
     "min": 13.6
    },
    "phenomena": [
     "combustion_products"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "pressure_overlap",
    "low_flow_overlap"
   ],
   "n_components_known": 4,
   "name": "BASS-II",
   "psi_id": "PSI-25",
   "qa_text": "Objective: BASS-II results contribute to the combustion computational models used in the design of fire detection and suppression systems in microgravity and on Earth. Objectives Include: 1) Study the ignition, flame growth, flame spread, and extinction limits for solid fuels burning in low-velocity forced flows in microgravity. 2) Begin to bridge the gap between the normal gravity NASA-STD-6001 Test #1 method, ground-based microgravity tests, and actual material flammability in microgravity. 3) Provide SoFIE PIs with preliminary data to refine Science Requirements. 4) Practical, realistic (thicker) fuels in typical geometries will be examined, including slabs, cylinders, and spherical sections. The primary variables include: • Forced flow velocity (speed and direction) • Ambient oxygen concentration (via working volume nitrogen vitiation) • Sample geometry (rods, spherical section, slabs, films, and fabric sheets Approach: To summarize, BASS-II's approach, microgravity combustion tests were performed aboard the International Space Station. Active crew support for real-time “lab partner” operations. The wind tunnel was installed in the Microgravity Science Glovebox which...",
   "rank": 5,
   "rationale": "Score 80/100 from 4 known components (O2 overlap 60%, micro-g flight data); 2 component(s) unknown.",
   "score": 79.97390989299451,
   "score_status": "scored",
   "summary": "BASS-II results contribute to the combustion computational models used in the design of fire detection and suppression systems in microgravity and on Earth. Objectives Include: 1) Study the ignition, flame growth, flame spread, and extinction limits for solid fuels burning in low-velocity forced flows in microgravity. 2) Begin to bridge the gap between the normal gravity NASA-STD-6001 Test #1 method, ground-based...",
   "title": "Burning and Suppression of Solids - II"
  },
  {
   "components": {
    "data_volume": 0.882428328737195,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": 1.0,
    "pressure_overlap": 0.09869232667160129
   },
   "doi": "10.60555/m6pj-a914",
   "envelope": {
    "diluents": [
     "He",
     "N2"
    ],
    "flow_cm_s": null,
    "fuels": [
     "Farnesane",
     "dodecane60/isododecane40",
     "dodecane75/isododecane25",
     "n-dodecane"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 227,
    "o2_pct": {
     "max": 21.0,
     "min": 17.0
    },
    "phenomena": [
     "burn_time",
     "burning_rate",
     "cool_flame",
     "extinction"
    ],
    "pressure_atm": {
     "max": 5.0,
     "min": 0.5
    }
   },
   "missing_components": [
    "low_flow_overlap"
   ],
   "n_components_known": 5,
   "name": "CFI",
   "psi_id": "PSI-39",
   "qa_text": "Objective: The objectives of this investigation are to: 1) Examine the combustion behavior of n-dodecane and mixtures of n-dodecane/iso-dodecane at pressures ranging from 0.25 atm to 5 atm. 2) Analyze the effects of helium dilution on cool flame behavior. 3) Examine the behavior of combustion characteristics. 4) Investigate the relationship between droplet size, pressure, and flame extinction, and (5) understand the consequence of soot formation during cool flame combustion. Approach: The Combustion Integrated Rack (CIR) contains the Multi-User Droplet Combustion Apparatus (MDCA) which facilitates the controlled combustion of fuel droplets. A system of gas bottles and fuel syringes delivers the desired gas mixture to the combustion chamber ranging from 0.25 to 0.5 atm. Droplets of fuel are dispensed and suspended between hypodermic needles or tethered using silicon-carbide fibers. A hot-wire igniter is positioned near the droplet for ignition. After ignition the wire is retracted. Fuels observed include n-dodecane, farnesane, and mixtures of n-dodecane/iso-dodecane. Fuels diluted with molecular oxygen, atomic nitrogen, and helium to study the influence on flame extinction and...",
   "rank": 6,
   "rationale": "Score 65/100 from 5 known components (O2 overlap 100%, pressure overlap 10%, micro-g flight data); 1 component(s) unknown.",
   "score": 64.95326054645876,
   "score_status": "scored",
   "summary": "The objectives of this investigation are to: 1) Examine the combustion behavior of n-dodecane and mixtures of n-dodecane/iso-dodecane at pressures ranging from 0.25 atm to 5 atm. 2) Analyze the effects of helium dilution on cool flame behavior. 3) Examine the behavior of combustion characteristics. 4) Investigate the relationship between droplet size, pressure, and flame extinction, and (5) understand the...",
   "title": "Cool Flames Investigation"
  },
  {
   "components": {
    "data_volume": 1.0,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": 0.2285511699361853,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/9kbh-e962",
   "envelope": {
    "diluents": [],
    "flow_cm_s": {
     "max": 85.28,
     "min": 0.66
    },
    "fuels": [
     "50 % Propylene",
     "75 % Propylene",
     "75% Propylene",
     "Ethylene",
     "Methane",
     "Propane",
     "Propylene"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 469,
    "o2_pct": null,
    "phenomena": [
     "burn_time"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap"
   ],
   "n_components_known": 4,
   "name": "SPICE",
   "psi_id": "PSI-107",
   "qa_text": "Objective: The objective of SPICE is to better understand the complex process of combustion by observing flames in a microgravity environment aboard the International Space Station (ISS) and analogous ground experiments. Specific objectives were: (1) Identify the laminar smoke-point properties of non-buoyant jet diffusion flames under various co-flow conditions in microgravity. (2) Determine the effects of burner diameter and co-flow velocity on the luminous flame lengths and smoke points. (3) Quantify the sooting propensity of different fuels, such as ethylene, propane, and propylene mixtures. (4) Validate the correlation between luminous flame shape and residence time under microgravity conditions. (5) Investigate the impact of air and fuel flow rate variations on smoke point phenomena in space. Approach: The experimental setup in the microgravity science glovebox consisted of an apparatus with a flow duct with integrated nozzles, cameras, and fuel delivery systems. Fuels tested included methane, ethylene, propane, propylene, and propylene mixtures. Each flame was ignited in a controlled co-flow air environment, with burner diameters of 0.41 mm, 0.76 mm, and 1.6 mm and...",
   "rank": 7,
   "rationale": "Score 61/100 from 4 known components (low-flow overlap 23%, micro-g flight data); 2 component(s) unknown.",
   "score": 60.77866827098686,
   "score_status": "scored",
   "summary": "The objective of SPICE is to better understand the complex process of combustion by observing flames in a microgravity environment aboard the International Space Station (ISS) and analogous ground experiments. Specific objectives were: (1) Identify the laminar smoke-point properties of non-buoyant jet diffusion flames under various co-flow conditions in microgravity. (2) Determine the effects of burner diameter and...",
   "title": "Smoke Point In Co-flow Experiment"
  },
  {
   "components": {
    "data_volume": 0.9128904791363917,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": 0.7727272727272727,
    "pressure_overlap": 0.1289374997386326
   },
   "doi": "10.60555/mbq8-0451",
   "envelope": {
    "diluents": [
     "CO2",
     "He",
     "N2"
    ],
    "flow_cm_s": null,
    "fuels": [
     "Heptane",
     "Methanol"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 274,
    "o2_pct": {
     "max": 34.0,
     "min": 12.0
    },
    "phenomena": [
     "burn_time",
     "burning_rate",
     "extinction"
    ],
    "pressure_atm": {
     "max": 3.0525,
     "min": 0.6924999999999999
    }
   },
   "missing_components": [
    "low_flow_overlap"
   ],
   "n_components_known": 5,
   "name": "FLEX",
   "psi_id": "PSI-69",
   "qa_text": "Objective: The FLEX (Flame Extinguishment Experiment) investigation aims to map the flammability limits of liquid fuels in microgravity environments, measure the effectiveness of various gaseous fire suppressants such as CO2, He, and SF6, and develop reliable predictive models for combustion limits under reduced gravity conditions. The mission seeks to validate and improve simplified models by incorporating detailed chemical reactions, heat transfer, and material movement, using both space-based data and extensive ground-based tests. Key flight experiment goals include obtaining high-resolution measurements of droplet burning rates, flame extinction behavior, heat radiation, soot levels, and temperature profiles, while systematically analyzing the effects of different ambient conditions and suppressant concentrations. These investigations are essential for advancing the fundamental understanding of combustion processes in microgravity and enhancing fire safety protocols for future space missions. Approach: The FLEX experiments involve igniting and observing the burning behavior of relatively large droplets. A primary objective of the experiments is to determine the Limiting...",
   "rank": 8,
   "rationale": "Score 60/100 from 5 known components (O2 overlap 77%, pressure overlap 13%, micro-g flight data); 1 component(s) unknown.",
   "score": 59.51798705882394,
   "score_status": "scored",
   "summary": "The FLEX (Flame Extinguishment Experiment) investigation aims to map the flammability limits of liquid fuels in microgravity environments, measure the effectiveness of various gaseous fire suppressants such as CO2, He, and SF6, and develop reliable predictive models for combustion limits under reduced gravity conditions. The mission seeks to validate and improve simplified models by incorporating detailed chemical...",
   "title": "Flame Extinguishment Experiment"
  },
  {
   "components": {
    "data_volume": 0.5682853026389494,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/23e1-9950",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "100% C2H10",
     "100% C2H11",
     "100% C2H4",
     "100% C2H5",
     "100% C2H6",
     "100% C2H7",
     "100% C2H8",
     "100% C2H9",
     "100% CH4",
     "100% CH5",
     "100% CH6",
     "30% C2H4",
     "30% C2H5",
     "40% CH10",
     "40% CH11",
     "40% CH12",
     "40% CH13",
     "40% CH14",
     "40% CH4",
     "40% CH5",
     "40% CH6",
     "40% CH7",
     "40% CH8",
     "40% CH9",
     "50% C2H4",
     "50% C2H5",
     "50% C2H6",
     "50% C2H7",
     "50% C2H8",
     "50% C2H9"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 32,
    "o2_pct": null,
    "phenomena": [
     "ignition"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap"
   ],
   "n_components_known": 3,
   "name": "ACME CLD Flame",
   "psi_id": "PSI-21",
   "qa_text": "Objective: In order to provide the experimental data needed to allow rigorous testing of computational models at the extremes of the fuel dilution spectrum, we have the following objectives: A) Characterize the behavior of weak coflow diffusion flames of methane and ethylene, as a function of velocity and fuel dilution, through measurement of flame shape, lift-off heights, temperatures and extinction limits. B) Characterize the sooting tendencies of diffusion flames with long residence times, as a function of velocity and fuel dilution, through measurement of flame shape, gas temperatures in the soot-free portion of the flame, soot luminosity, soot temperatures, and soot volume fractions. Approach: ACME CLD Flame project goals include the generation of improved computational models with improved soot sub-models that are effective for both dilute flames and sooting flames that vary from low to high soot loading levels. The enhanced time and spatial scales in a microgravity environment will be important for achieving both goals. Experimentally, we plan to study methane and ethylene diffusion flames over a wide range of test conditions. For the more dilute flames, measurements...",
   "rank": 9,
   "rationale": "Score 59/100 from 3 known components (micro-g flight data); 3 component(s) unknown.",
   "score": 58.810698848960605,
   "score_status": "scored",
   "summary": "In order to provide the experimental data needed to allow rigorous testing of computational models at the extremes of the fuel dilution spectrum, we have the following objectives: A) Characterize the behavior of weak coflow diffusion flames of methane and ethylene, as a function of velocity and fuel dilution, through measurement of flame shape, lift-off heights, temperatures and extinction limits. B) Characterize...",
   "title": "Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame"
  },
  {
   "components": {
    "data_volume": 0.5682853026389494,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/se5a-8c73",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "100% C2H4",
     "100% CH4",
     "30% C2H4",
     "40% CH4"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 32,
    "o2_pct": null,
    "phenomena": [
     "ignition"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap"
   ],
   "n_components_known": 3,
   "name": "ACME E-FIELD Flames",
   "psi_id": "PSI-22",
   "qa_text": "Objective: The objective of this investigation is to better understand the relationship between electric field voltage and chemi-ion current, analyze the dynamic response of flames to electric field changes, evaluate soot formation, and characterize stabilized near-limit lifted flames. Approach: The E-FIELD flames experiment investigates how electric fields influence the behavior of laminar diffusion flames in microgravity. This unique environment is ideal for isolating electric field effects from buoyancy forces. The experiment is conducted with gas-fueled flames, both with and without a coflow of air. In the former case, the tests are conducted using the same coflow burner used by the Coflow Laminar Diffusion (CLD) Flame experiment. An electric field is generated by creating a high voltage (up to 10 kV) differential between the burner and a flat circular mesh suspended above (i.e., downstream of) the burner. Measurements, as a function of the field strength and fuel, are taken of the ion current through the flame and the flame’s response time to electric forcing. The gas-jet burner is used to create a small, focused flame for detailed ion-driven convection studies while the...",
   "rank": 10,
   "rationale": "Score 59/100 from 3 known components (micro-g flight data); 3 component(s) unknown.",
   "score": 58.810698848960605,
   "score_status": "scored",
   "summary": "The objective of this investigation is to better understand the relationship between electric field voltage and chemi-ion current, analyze the dynamic response of flames to electric field changes, evaluate soot formation, and characterize stabilized near-limit lifted flames.",
   "title": "Advanced Combustion via Microgravity Experiments Electric-Field Effects on Laminar Diffusion Flames"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": 1.0,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": 0.6,
    "pressure_overlap": 0.1776461880088823
   },
   "doi": "10.60555/byp8-h018",
   "envelope": {
    "diluents": [
     "diluent gas"
    ],
    "flow_cm_s": null,
    "fuels": [],
    "gravity": [
     "microgravity"
    ],
    "materials": [],
    "n_rows": null,
    "o2_pct": {
     "max": 40.0,
     "min": 10.0
    },
    "phenomena": [],
    "pressure_atm": {
     "max": 3.0,
     "min": 0.5
    }
   },
   "missing_components": [
    "low_flow_overlap",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 3,
   "name": "FLEX-2",
   "psi_id": "PSI-68",
   "qa_text": "Objective: The primary goal of the FLEX-2 flight experiments is to extend the results of FLEX-1 to fuels and environmental conditions that mimic real combustor conditions, as well as, provide benchmark experimental data on bi-component droplet combustion over a wide range of initial conditions in order to validate numerical simulations and to develop new theoretical models. Detailed experimental objectives can be further itemized as: 1. Investigate the role of liquid-phase mixing on the burning characteristics of bi-component fuel droplets. 2. Examine the steady and unsteady liquid and gas-phase phenomena in pure fuel combustion. 3. Study flame extinction mechanisms and their boundaries. 4. Analyze the soot formation process, including soot volume fraction soot-shell dynamics. 5. Determine the influence of droplet interactions on the flammability limits and extinction behavior of droplet arrays. 6. Validate theoretical models of droplet combustion through comprehensive experimental data collection in microgravity environments. Approach: The chamber was filled with the appropriate atmosphere, which was varied in pressure between 0.5 atm to 3.0 atm and O2 concentration between...",
   "rank": 11,
   "rationale": "Score 56/100 from 3 known components (O2 overlap 60%, pressure overlap 18%, micro-g flight data); 3 component(s) unknown.",
   "score": 55.92153960029607,
   "score_status": "scored",
   "summary": "The primary goal of the FLEX-2 flight experiments is to extend the results of FLEX-1 to fuels and environmental conditions that mimic real combustor conditions, as well as, provide benchmark experimental data on bi-component droplet combustion over a wide range of initial conditions in order to validate numerical simulations and to develop new theoretical models. Detailed experimental objectives can be further...",
   "title": "Flame Extinguishment Experiment - 2"
  },
  {
   "components": {
    "data_volume": 0.4785579230023812,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/vb93-3y72",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "100% C2H4",
     "100% CH4",
     "100%C2H4",
     "50% C2H4"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 18,
    "o2_pct": null,
    "phenomena": [
     "ignition"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap"
   ],
   "n_components_known": 3,
   "name": "ACME BRE",
   "psi_id": "PSI-20",
   "qa_text": "Objective: The BRE flight program seeks to establish the burning conditions in a quiescent microgravity ambient in terms of material properties. The specific flight objectives are as follows. 1. Observe burning behavior in long-duration microgravity for CH4/N2 and C2H4/N2mixtures on porous circular burners of 25 and 50 mm diameter. Consider O2/N2 ambients with various pressures and ambient O2 concentrations and pressures. NASA - considered atmosphere for human space missions will be examined: 14.7 psia, 21 % oxygen: 10.2 psia, 26.5 %; and 8.2 psia, 34 % oxygen. Emphasize fuel conditions that can be related to a diverse range of condensed fuels. 2. Consider the conditions of Objective 1 for ambients of O2/CO2 (desired). 3. Consider the conditions of Objectives 1 – 2 for extinction limits. Approach: To accomplish the above objectives, flight experiments are proposed. Additionally, preliminary flight tests will be performed to verify the experiment operations and for comparison with ground-based tests. For each test, conditions will be established for the chamber contents, namely choice of diluent, oxygen concentration, and pressure. Fuel flow will commence followed by ignition....",
   "rank": 12,
   "rationale": "Score 55/100 from 3 known components (micro-g flight data); 3 component(s) unknown.",
   "score": 55.44592211258929,
   "score_status": "scored",
   "summary": "The BRE flight program seeks to establish the burning conditions in a quiescent microgravity ambient in terms of material properties. The specific flight objectives are as follows. 1. Observe burning behavior in long-duration microgravity for CH4/N2 and C2H4/N2mixtures on porous circular burners of 25 and 50 mm diameter. Consider O2/N2 ambients with various pressures and ambient O2 concentrations and pressures. NASA...",
   "title": "Advanced Combustion via Microgravity Experiments - Burning Rate Emulator"
  },
  {
   "components": {
    "data_volume": 0.4785579230023812,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/k57n-p030",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "100% H2",
     "20% C2H4 with He",
     "20% H2, 25% CH4, with He",
     "25% C2H4 with He",
     "25% H2, 20% CH4, with He",
     "30% C2H4 with He",
     "30% H2, 15% CH4, with He",
     "35% H2 with He",
     "44.4% H2 with CH4",
     "45% CH4 with He",
     "45% CH4 with N2",
     "45% CH4 with N3",
     "45% H2 with He",
     "50% C2H4 with N2",
     "50% C2H4 with N3",
     "66.7% H2 with CH4"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 18,
    "o2_pct": null,
    "phenomena": [
     "ignition"
    ],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap"
   ],
   "n_components_known": 3,
   "name": "ACME s-Flame",
   "psi_id": "PSI-23",
   "qa_text": "Objective: A series of experiments is proposed with the following specific objectives, in both soot-free and sooty flames, to compare with detailed computational simulation to assess transport properties and detailed chemical kinetics (including chemiluminescence): Objective A. Measure and characterize the transient structure (such as temperature and species distribution) of diffusion flames established at initially non-steady, spherical flame structures for mixtures of different H2/CH4/diluent ratios (soot-free) and different C2H4/diluent ratios (sooty), for different flow rates. Objective B. Determine the quasi-steady convective/chemical-kinetic extinction limits (low system Damköhler numbers) and radiative/chemical-kinetic extinction limits (high system Damköhler numbers) for mixtures of different H2/CH4/diluent ratios (soot-free) and different C2H4/diluent ratios (sooty). Objective C. Determine the existence (for different Zeldovich number, Ze), onset (as a function Da), and nature (i.e. mode, frequency, amplitude) of pulsating instabilities theoretically predicted to occur in transient spherical diffusion flames using fuel/diluent mixtures that are above a critical Lewis...",
   "rank": 13,
   "rationale": "Score 55/100 from 3 known components (micro-g flight data); 3 component(s) unknown.",
   "score": 55.44592211258929,
   "score_status": "scored",
   "summary": "A series of experiments is proposed with the following specific objectives, in both soot-free and sooty flames, to compare with detailed computational simulation to assess transport properties and detailed chemical kinetics (including chemiluminescence): Objective A. Measure and characterize the transient structure (such as temperature and species distribution) of diffusion flames established at initially...",
   "title": "Advanced Combustion via Microgravity Experiments-Structure and Response of Spherical Diffusion Flames"
  },
  {
   "components": {
    "data_volume": 0.1785568044608419,
    "has_flight": 1.0,
    "has_solid": 1.0,
    "low_flow_overlap": 0.0,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/040q-4h36",
   "envelope": {
    "diluents": [],
    "flow_cm_s": {
     "max": 30.0,
     "min": 30.0
    },
    "fuels": [
     "SIBAL Fabric"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [
     "SIBAL Fabric"
    ],
    "n_rows": 2,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap"
   ],
   "n_components_known": 4,
   "name": "SAFFIRE-III",
   "psi_id": "PSI-100",
   "qa_text": "Objective: The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test. Approach: The Saffire-III experiments were performed on the Orbital Science’s Cygnus resupply vehicle after it deberthed from the ISS. As a follow on to the Saffire 1 investigation, the Saffire III investigation also used SIBAL as the sample material. However, the experiments were conducted at a flow velocity of 30 cm/s compared to 20 cm/s during Saffire I. The flow was either concurrent or opposed. Once the sample was ignited flame images were captured using two cameras. In addition, thermocouples provided flow, flame, and plume temperatures, two radiometers recorded flame radiation, solid state sensors were used to measure pressure, CO2 and O2 mole faction, and two anemometer tracked flow velocity. All data was compressed, and subsequently downlinked. Details related to samples and experimental parameters are provided in the Experimental Details file in the Science document folder.",
   "rank": 14,
   "rationale": "Score 50/100 from 4 known components (low-flow overlap 0%, micro-g flight data); 2 component(s) unknown.",
   "score": 50.324276485295684,
   "score_status": "scored",
   "summary": "The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.",
   "title": "Spacecraft Fire Experiment-III"
  },
  {
   "components": {
    "data_volume": 0.9444813030766922,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": 0.2465753424657534,
    "pressure_overlap": 0.15988526349251306
   },
   "doi": "10.60555/cyt1-kh64",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "butane",
     "ethane",
     "propane"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 333,
    "o2_pct": {
     "max": 85.0,
     "min": 12.0
    },
    "phenomena": [
     "burn_time",
     "extinction",
     "ignition"
    ],
    "pressure_atm": {
     "max": 3.2666173205033306,
     "min": 0.48890372563533185
    }
   },
   "missing_components": [
    "low_flow_overlap"
   ],
   "n_components_known": 5,
   "name": "ACME CFI-G",
   "psi_id": "PSI-159",
   "qa_text": "Objective: 1. Plan and support flight testing on the International Space Station (ISS). 2. Determine the conditions for which cool diffusion flames occur for propane, n-butane, and n-pentane; normal and inverse flames; and a broad range of Zst, Tad, and fluent flow rate. 3. Support the flight tests with advanced CFD simulations. 4. Identify or develop a chemical kinetics mechanism that yields good agreement between the CFD predictions and the ISS measurements. 5. Disseminate the results as widely as possible. Approach: Perform spherical diffusion flame tests aboard the International Space Station. Consider multiple fuels, a range of reactant dilutions, flow rates, and pressures for normal and inverse convection directions. Observe the flames with a broad suite of cameras, radiometers, photomultiplier tubes, and thermocouples.",
   "rank": 15,
   "rationale": "Score 45/100 from 5 known components (O2 overlap 25%, pressure overlap 16%, micro-g flight data); 1 component(s) unknown.",
   "score": 45.32859809134644,
   "score_status": "scored",
   "summary": "1. Plan and support flight testing on the International Space Station (ISS). 2. Determine the conditions for which cool diffusion flames occur for propane, n-butane, and n-pentane; normal and inverse flames; and a broad range of Zst, Tad, and fluent flow rate. 3. Support the flight tests with advanced CFD simulations. 4. Identify or develop a chemical kinetics mechanism that yields good agreement between the CFD...",
   "title": "Advanced Combustion via Microgravity Experiments / Cool Flames Investigation with Gases"
  },
  {
   "components": {
    "data_volume": 0.9415350699975014,
    "has_flight": 1.0,
    "has_solid": 0.0,
    "low_flow_overlap": null,
    "o2_overlap": 0.23308003594540727,
    "pressure_overlap": 0.17132680761885483
   },
   "doi": "10.60555/w4zy-bt45",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "ethylene",
     "propane"
    ],
    "gravity": [
     "µg"
    ],
    "materials": [],
    "n_rows": 327,
    "o2_pct": {
     "max": 84.9977932,
     "min": 19.804819300000002
    },
    "phenomena": [],
    "pressure_atm": {
     "max": 3.01818033,
     "min": 0.42596796
    }
   },
   "missing_components": [
    "low_flow_overlap"
   ],
   "n_components_known": 5,
   "name": "ACME/Flame Design",
   "psi_id": "PSI-10",
   "qa_text": "Objective: The primary objectives of this flight experiment are: A. Obtain soot-inception limits of quasi-steady normal and inverse spherical diffusion flames as functions of flow rate, Zst, amount of inert (N2 or CO2), and pressure for C2H4 and CH4 flames. Identify the corresponding temperatures in hot regions. Obtain similar limits and temperatures for inverse and normal coflow flames. B. Obtain detailed measurements in quasi-steady normal and inverse spherical diffusion flames for C2H4 and CH4. Determine the effects of flow rate, Zst, amount of N2, and pressure on flame temperature, size, color, and soot volume fraction. Evaluate the possible existence of steady flames. C. Obtain extinction limits as functions of Zst, amount of N2, and pressure for normal and inverse spherical C2H4 and CH4 flames. Identify the corresponding temperatures in hot regions. Identify the presence of radiative or kinetic extinction. Evaluate whether pseudo-flammability limits can be obtained for these flames. Approach: Perform spherical diffusion flame tests in drop towers and aboard the International Space Station. Consider a broad range of reactant dilutions, flow rates and pressures for normal...",
   "rank": 16,
   "rationale": "Score 45/100 from 5 known components (O2 overlap 23%, pressure overlap 17%, micro-g flight data); 1 component(s) unknown.",
   "score": 45.14889776585271,
   "score_status": "scored",
   "summary": "The primary objectives of this flight experiment are: A. Obtain soot-inception limits of quasi-steady normal and inverse spherical diffusion flames as functions of flow rate, Zst, amount of inert (N2 or CO2), and pressure for C2H4 and CH4 flames. Identify the corresponding temperatures in hot regions. Obtain similar limits and temperatures for inverse and normal coflow flames. B. Obtain detailed measurements in...",
   "title": "Advanced Combustion via Microgravity Experiments / Flame Design"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": 1.0,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/pm12-rg61",
   "envelope": {
    "diluents": [
     "nitrogen"
    ],
    "flow_cm_s": null,
    "fuels": [
     "ethylene",
     "methane"
    ],
    "gravity": [
     "microgravity"
    ],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 1,
   "name": "SLICE",
   "psi_id": "PSI-106",
   "qa_text": "Objective: Objective: The objective of this investigation is to better understand the structure and stability of laminar diffusion flames in microgravity. Specific objectives of this investigation were: 1. To investigate the structure of laminar diffusion flames in microgravity to understand the stabilizing mechanisms at the flames base. 2. Determine the liftoff velocity limits for different fuels and burner diameters. 3. Evaluate the impact of fuel dilution with nitrogen on soot formation and flame stability. 4. Quantify the effects of microgravity on flame length and radiative heat loss compared to normal gravity conditions. 5. Validate numerical models for flame dynamics, soot production, and thermal radiation in non-premixed flames. Approach: The SLICE apparatus consisted of a fan-driven flow duct, exchangeable burner tubes, and integrated sensors to measure flow rates and temperature. This setup used several fuels such as methane, ethylene, and nitrogen-diluted mixtures. Flames were then manually ignited and observed under controlled coflow air conditions. A high resolution camera captured still images while sensor data was overlaid on these images. Calibration tests for...",
   "rank": 17,
   "rationale": "Low confidence: only 1 of 6 components known (micro-g flight flag); no headline score.",
   "score": null,
   "score_status": "low_confidence",
   "summary": "Objective: The objective of this investigation is to better understand the structure and stability of laminar diffusion flames in microgravity. Specific objectives of this investigation were: 1. To investigate the structure of laminar diffusion flames in microgravity to understand the stabilizing mechanisms at the flames base. 2. Determine the liftoff velocity limits for different fuels and burner diameters. 3....",
   "title": "Structure and Liftoff In Combustion Experiment"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": 1.0,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/q0v5-1v28",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "dibutyl-phthalate (DBP)"
    ],
    "gravity": [
     "Earth gravity",
     "microgravity"
    ],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 1,
   "name": "Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity",
   "psi_id": "PSI-115",
   "qa_text": "Objective: The objective of this investigation was to use numerical simulation to explore the influence of gravity on pyrolysis smoke growth from a fundamental perspective. The intention of this effort is to quantify the differences between microgravity and Earth gravity smoke, and to identify the fluid dynamic mechanisms that cause the differences. Approach: The formation and growth of dibutyl-phthalate (DBP) particles in Earth gravity and microgravity environments was simulated. Direct numerical simulation via a Navier-Stokes nodal approach was utlilized. The smoke originates from pyrolysis vapor expelled from a heated sample in a geometry similar to that considered in the SAME experiments. This study considered two cross-flow velocities of sufficiently low speed that buoyancy cannot be neglected in the presence of gravity. Simulations are presented to assess the dependence of particle size distributions on thermophoresis, particle settling, and flow geometry. The final report for this investigation introduces the simulation and modeling methodology, followed by a description of the flow geometry and the parameter space under consideration.The differences in the wake geometry...",
   "rank": 18,
   "rationale": "Low confidence: only 1 of 6 components known (micro-g flight flag); no headline score.",
   "score": null,
   "score_status": "low_confidence",
   "summary": "The objective of this investigation was to use numerical simulation to explore the influence of gravity on pyrolysis smoke growth from a fundamental perspective. The intention of this effort is to quantify the differences between microgravity and Earth gravity smoke, and to identify the fluid dynamic mechanisms that cause the differences.",
   "title": "Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": 1.0,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/gz0q-b577",
   "envelope": {
    "diluents": [
     "ozone"
    ],
    "flow_cm_s": null,
    "fuels": [
     "n-alkane"
    ],
    "gravity": [
     "microgravity"
    ],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 1,
   "name": "Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis",
   "psi_id": "PSI-117",
   "qa_text": "Objective: The objective of this ground investigation was to use flight data obtained from PSI through NASA’s Flame Extinguishment Experiment (FLEX) to quantify how externally imposed thermal and convective perturbations regulated the dynamics and ultimate fate of already established droplet cool flames, and to explain run-to-run variability by isolating the roles of deliberate heating and unintentional drift-induced convection. Focusing on both small and large droplets, the work mapped stability windows for ignition, sustained oscillation, transitions to hot ignition and warm-flame behavior, and extinction under microgravity. By leveraging and extending the FLEX data in the PSI, this study produced reusable models and sensitivity analyses that coupled low-temperature chemistry with transport and radiative effects. Approach: OpenFOAM was used to develop a 3-D CFD model of n-alkane droplet cool flames in microgravity, coupling variable-density Navier–Stokes flow with low-temperature combustion chemistry, coupled heat and mass transfer, and radiation. Model fidelity was established against ISS FLEX measurements, after which controlled simulations examined three forcing modes (i)...",
   "rank": 19,
   "rationale": "Low confidence: only 1 of 6 components known (micro-g flight flag); no headline score.",
   "score": null,
   "score_status": "low_confidence",
   "summary": "The objective of this ground investigation was to use flight data obtained from PSI through NASA’s Flame Extinguishment Experiment (FLEX) to quantify how externally imposed thermal and convective perturbations regulated the dynamics and ultimate fate of already established droplet cool flames, and to explain run-to-run variability by isolating the roles of deliberate heating and unintentional drift-induced...",
   "title": "Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": null,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": 0.0
   },
   "doi": "10.60555/80qf-vj95",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "DME",
     "dimethyl ether (DME)",
     "n-heptane"
    ],
    "gravity": [],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [
     "cool flame transitions",
     "radiation / stretch extinction"
    ],
    "pressure_atm": {
     "max": 20.0,
     "min": 20.0
    }
   },
   "missing_components": [
    "o2_overlap",
    "low_flow_overlap",
    "has_flight",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 1,
   "name": "Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames",
   "psi_id": "PSI-142",
   "qa_text": "Objective: By using the Flame Extinguishment (FLEX) experimental data from the Physical Sciences Informatics (PSI) system of combustion science, the purpose of this grant was to conduct new simulations and ground-based experiments using ozone-sensitized counterflow flames to: 1) Develop a new diagram of the flammability limits of diffusional cool flames affected by radiation, diffusion, and convection. 2) Bridge the knowledge gap between the flammability limits and extinction limits of hot flames and cool flames. 3) Verify the phenomena observed on the ISS flame extinguishment experiments. 4) Obtain new, quantitative data of extinction limit, flame temperature, and species distribution for the validation of kinetic and radiation models involving cool flames. 5) Extend the cool flame experiments from the original ISS droplet experiments to a more general ground-based combustion system involving radiation, diffusion, convection, and low-temperature chemistry while maintaining a one-dimensional geometry. Approach: Using the experimental conditions of FLEX flight, a comparative studies of the oxygen concentration effects on the extinction limits of cool flames was conducted using...",
   "rank": 20,
   "rationale": "Low confidence: only 1 of 6 components known (pressure overlap); no headline score.",
   "score": null,
   "score_status": "low_confidence",
   "summary": "By using the Flame Extinguishment (FLEX) experimental data from the Physical Sciences Informatics (PSI) system of combustion science, the purpose of this grant was to conduct new simulations and ground-based experiments using ozone-sensitized counterflow flames to: 1) Develop a new diagram of the flammability limits of diffusional cool flames affected by radiation, diffusion, and convection. 2) Bridge the knowledge...",
   "title": "Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": null,
    "has_solid": null,
    "low_flow_overlap": 0.0,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/58h4-dy80",
   "envelope": {
    "diluents": [
     "nitrogen"
    ],
    "flow_cm_s": {
     "max": 40.0,
     "min": 40.0
    },
    "fuels": [
     "75% cotton and 25% fiberglass",
     "Nomex fabric",
     "Ultem"
    ],
    "gravity": [],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "has_flight",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 1,
   "name": "BASS",
   "psi_id": "PSI-26",
   "qa_text": "Objective: The two main objectives for BASS are to: 1.) Begin to bridge the gap between the normal gravity NASA-STD-6001 Test#1 method, ground-based microgravity tests, and actual material flammability in microgravity. The relation between these can be investigated by observing flames burning for the longer times available in flight. Practical, realistic (thicker) fuels in typical geometries will be examined, including wake flames which have characteristics of a fire burning behind another object (for example, a fire burning in tight area which may not be easily accessible). 2.) Assess the effectiveness of an inert, gaseous extinguishing agent (similar to that used on ISS) in putting out flames over different materials, geometries, preheating, and flow. Approach: The experiment was conducted aboard the International Space Station (ISS) inside the Microgravity Glove Box (MSG). Custom-made fabric samples consisting of 75% cotton and 25% fiberglass (by mass) measuring were used as a fuel source as well as Nomex fabric and Ultem. A Kanthal wire (29-gage)igniter was used to initiate combustion at one end of the fabric. Airflow was controlled using a variable speed fan, with airflow...",
   "rank": 21,
   "rationale": "Low confidence: only 1 of 6 components known (low-flow overlap); no headline score.",
   "score": null,
   "score_status": "low_confidence",
   "summary": "The two main objectives for BASS are to: 1.) Begin to bridge the gap between the normal gravity NASA-STD-6001 Test#1 method, ground-based microgravity tests, and actual material flammability in microgravity. The relation between these can be investigated by observing flames burning for the longer times available in flight. Practical, realistic (thicker) fuels in typical geometries will be examined, including wake...",
   "title": "Burning and Suppression of Solids"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": 1.0,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/e9xp-ex83",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [
     "polymethyl methacrylate (PMMA)",
     "wax"
    ],
    "gravity": [
     "microgravity",
     "normal-gravity"
    ],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 1,
   "name": "Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography",
   "psi_id": "PSI-62",
   "qa_text": "Objective: The objective of this research was to develop and validate new flamelet generated manifold (FGM) modeling techniques for concurrent flame spread in microgravity. Concurrent flame spread presented one of the greatest modeling challenges in combustion science due to the intricate coupling between heat transfer, mass transport, and chemical kinetics near the solid-vapor interface. Traditional modeling strategies often relied on hybridized turbulence and chemistry models that were not fully consistent and failed to capture important intermediate reaction pathways. To overcome these shortcomings, this PSI grant advanced the use of an unsteady flamelet generated manifold (UFGM) framework that reduced the complexity of reacting systems by mapping them into lower-dimensional manifolds. The research aimed to leverage this methodology to simulate solid fuel combustion processes with high fidelity, using the NASA Burning and Suppression of Solids (BASS and BASS-II) experiments as benchmarks. Ultimately, the long-term goal was to enable accurate prediction of flammability limits for spacecraft materials and to provide a tool that could also serve as a subgrid-scale model in...",
   "rank": 22,
   "rationale": "Low confidence: only 1 of 6 components known (micro-g flight flag); no headline score.",
   "score": null,
   "score_status": "low_confidence",
   "summary": "The objective of this research was to develop and validate new flamelet generated manifold (FGM) modeling techniques for concurrent flame spread in microgravity. Concurrent flame spread presented one of the greatest modeling challenges in combustion science due to the intricate coupling between heat transfer, mass transport, and chemical kinetics near the solid-vapor interface. Traditional modeling strategies often...",
   "title": "Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": null,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/ztgj-d202",
   "envelope": {
    "diluents": [
     "GN2"
    ],
    "flow_cm_s": null,
    "fuels": [
     "Arizona Red Dust (ARD)"
    ],
    "gravity": [],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap",
    "has_flight",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 0,
   "name": "DAFT / DAFT-2",
   "psi_id": "PSI-47",
   "qa_text": "Objective: The focus of DAFT / DAFT-2 was to mitigate the risk for the Smoke Aerosol Measurement Experiment (SAME). SAME relied on a commercially available condensate nuclei counter, the TSI P-Trak, to quantify smoke aerosols in a microgravity environment, however there were concerns that th P-Trak would not be reliable in microgravity as it relies on gravity to recycle isopropyl alcohol used in the measurement process. DAFT / DAFT-2 tests that a modified P-Trak particulate counter would be accurate in microgravity. Summarized objectives include: 1) Demonstrate the Functionality of the Modified TSI P-Trak in Microgravity 2) Compare the TSI P-Trak Performance against the DustTrak control 3) Create and Analyze Aerosol Standards in Microgravity 4) Ensure the reliability of future aerosol experiments Approach: The experimental approach consists of the following components: 1) Modification of Instrumentation: TSI P-Trak was modified for use in microgravity by redesigning the condenser tube to use capillary forces for recycling isopropyl alcohol and removing the mercury switch responsible for detecting instrument orientation. 2) Aerosol Generation: Arizona Red Dust (ARD) was chosen...",
   "rank": 23,
   "rationale": "Not scorable: no habitat-relevant condition is known for this investigation.",
   "score": null,
   "score_status": "not_scorable",
   "summary": "The focus of DAFT / DAFT-2 was to mitigate the risk for the Smoke Aerosol Measurement Experiment (SAME). SAME relied on a commercially available condensate nuclei counter, the TSI P-Trak, to quantify smoke aerosols in a microgravity environment, however there were concerns that th P-Trak would not be reliable in microgravity as it relies on gravity to recycle isopropyl alcohol used in the measurement process. DAFT /...",
   "title": "Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2"
  },
  {
   "components": {
    "data_volume": null,
    "has_flight": null,
    "has_solid": null,
    "low_flow_overlap": null,
    "o2_overlap": null,
    "pressure_overlap": null
   },
   "doi": "10.60555/mzjm-yv57",
   "envelope": {
    "diluents": [],
    "flow_cm_s": null,
    "fuels": [],
    "gravity": [],
    "materials": [],
    "n_rows": null,
    "o2_pct": null,
    "phenomena": [],
    "pressure_atm": null
   },
   "missing_components": [
    "o2_overlap",
    "pressure_overlap",
    "low_flow_overlap",
    "has_flight",
    "has_solid",
    "data_volume"
   ],
   "n_components_known": 0,
   "name": "Computational and Experimental Analysis of SPICE Data Sets",
   "psi_id": "PSI-60",
   "qa_text": "Objective: This ground investigation sought to increase understanding of the issues that control the large discrepancy between soot formation in 1g and in 0g flames. The objective of this investigation was to integrate computational and experimental methods to derive temperature distributions and soot volume fractions from the Smoke Point in Coflow Experiment (SPICE) data available in PSI. By analyzing over 1600 raw DSLR images and incorporating advanced soot models, the study sought to improve understanding of soot formation, oxidation, radiative re-absorption, and aggregate growth in heavily sooting flames. The work further aimed to reconcile microgravity and normal gravity flame behavior, identify key physical and chemical processes influencing smoke point development, and provide a framework for evaluating model parameter sensitivity. Approach: The approach was to combine image processing, experimental diagnostics, and detailed soot modeling. Raw Nikon NEF images were decoded into three color channels and analyzed using color-ratio pyrometry to extract soot temperature fields. Absolute light calibration from SPICE was then used to calculate soot volume fractions. For...",
   "rank": 24,
   "rationale": "Not scorable: no habitat-relevant condition is known for this investigation.",
   "score": null,
   "score_status": "not_scorable",
   "summary": "This ground investigation sought to increase understanding of the issues that control the large discrepancy between soot formation in 1g and in 0g flames. The objective of this investigation was to integrate computational and experimental methods to derive temperature distributions and soot volume fractions from the Smoke Point in Coflow Experiment (SPICE) data available in PSI. By analyzing over 1600 raw DSLR...",
   "title": "Computational and Experimental Analysis of SPICE Data Sets"
  }
 ],
 "meta": {
  "model_cv": {
   "fuel_diluent": {
    "groups": [
     "Heptane|CO2",
     "Heptane|He",
     "Heptane|N2",
     "Methanol|CO2",
     "Methanol|He",
     "Methanol|N2"
    ],
    "mae": 0.08698952543740891,
    "n": 258,
    "n_groups": 6,
    "r2": 0.3728400677249778
   },
   "method": "GroupKFold (pooled out-of-fold), Ridge alpha=1",
   "n_splits": {
    "fuel_diluent": 6,
    "year": 3
   },
   "primary": "fuel_diluent",
   "year": {
    "groups": [
     "2009",
     "2010",
     "2011"
    ],
    "mae": 0.05399363538068745,
    "n": 209,
    "n_groups": 3,
    "r2": 0.5670865718865574
   }
  },
  "no_partial_gravity_data": true,
  "notes": [
   "No partial-gravity (Moon/Mars) data exists in the datasets; scores are habitat-condition overlap only.",
   "Valid only for fuel/diluent combinations present in FLEX data."
  ],
  "score_assumptions": {
   "habitat": {
    "low_flow_cm_s": [
     0.0,
     20.0
    ],
    "o2_pct": [
     17.0,
     35.0
    ],
    "pressure_kpa": [
     56.0,
     101.0
    ]
   },
   "kpa_per_atm": 101.325,
   "min_known": 3,
   "weights": {
    "data_volume": 0.15,
    "has_flight": 0.15,
    "has_solid": 0.1,
    "low_flow_overlap": 0.15,
    "o2_overlap": 0.25,
    "pressure_overlap": 0.2
   }
  },
  "source_dois": [
   "10.60555/040q-4h36",
   "10.60555/0t15-1z43",
   "10.60555/23e1-9950",
   "10.60555/2chp-m469",
   "10.60555/2np7-jv14",
   "10.60555/4qc4-de67",
   "10.60555/58h4-dy80",
   "10.60555/80qf-vj95",
   "10.60555/9kbh-e962",
   "10.60555/byp8-h018",
   "10.60555/cyt1-kh64",
   "10.60555/e9xp-ex83",
   "10.60555/gd4k-8h62",
   "10.60555/gz0q-b577",
   "10.60555/k57n-p030",
   "10.60555/m6pj-a914",
   "10.60555/mbq8-0451",
   "10.60555/mzjm-yv57",
   "10.60555/pm12-rg61",
   "10.60555/q0v5-1v28",
   "10.60555/se5a-8c73",
   "10.60555/vb93-3y72",
   "10.60555/w4zy-bt45",
   "10.60555/ztgj-d202"
  ]
 },
 "model": {
  "coef": {
   "alpha": 1.0,
   "coef": [
    -0.044336850993854926,
    0.00840635904294275,
    0.0906699724509919,
    0.0667186436421331,
    -0.02236759154760704,
    0.016426093607146898,
    -0.016426093607144258,
    0.004184874526253744,
    -0.017597371761407632,
    0.013412497235141164
   ],
   "columns": [
    "d0_mm",
    "p_atm",
    "x_o2",
    "x_he",
    "x_co2",
    "fuel=Heptane",
    "fuel=Methanol",
    "diluent=CO2",
    "diluent=He",
    "diluent=N2"
   ],
   "intercept": 0.5011217811311058,
   "kind": [
    "num",
    "num",
    "num",
    "num",
    "num",
    "cat",
    "cat",
    "cat",
    "cat",
    "cat"
   ],
   "mean": [
    2.995775193798449,
    0.9201402488780089,
    0.20089147286821704,
    0.04883720930232559,
    0.11531007751937986,
    null,
    null,
    null,
    null,
    null
   ],
   "scale": [
    0.6918991249268746,
    0.2966355060301979,
    0.04762966639696812,
    0.11368818983052147,
    0.1622972819485926,
    null,
    null,
    null,
    null,
    null
   ]
  },
  "cv": {
   "fuel_diluent": {
    "groups": [
     "Heptane|CO2",
     "Heptane|He",
     "Heptane|N2",
     "Methanol|CO2",
     "Methanol|He",
     "Methanol|N2"
    ],
    "mae": 0.08698952543740891,
    "n": 258,
    "n_groups": 6,
    "r2": 0.3728400677249778
   },
   "method": "GroupKFold (pooled out-of-fold), Ridge alpha=1",
   "n_splits": {
    "fuel_diluent": 6,
    "year": 3
   },
   "primary": "fuel_diluent",
   "year": {
    "groups": [
     "2009",
     "2010",
     "2011"
    ],
    "mae": 0.05399363538068745,
    "n": 209,
    "n_groups": 3,
    "r2": 0.5670865718865574
   }
  },
  "diluents": [
   "CO2",
   "He",
   "N2"
  ],
  "doi": "10.60555/mbq8-0451",
  "features": [
   "d0_mm",
   "p_atm",
   "x_o2",
   "x_he",
   "x_co2",
   "fuel",
   "diluent"
  ],
  "fuels": [
   "Heptane",
   "Methanol"
  ],
  "impute": {
   "d0_mm": 3.0149999999999997,
   "p_atm": 0.9989473684210527,
   "x_co2": 0.0,
   "x_he": 0.0,
   "x_o2": 0.2
  },
  "known_combos": [
   {
    "diluent": "CO2",
    "fuel": "Heptane",
    "n": 45
   },
   {
    "diluent": "He",
    "fuel": "Heptane",
    "n": 21
   },
   {
    "diluent": "N2",
    "fuel": "Heptane",
    "n": 41
   },
   {
    "diluent": "CO2",
    "fuel": "Methanol",
    "n": 72
   },
   {
    "diluent": "He",
    "fuel": "Methanol",
    "n": 26
   },
   {
    "diluent": "N2",
    "fuel": "Methanol",
    "n": 53
   }
  ],
  "leakage_excluded": [
   "burn_time_s",
   "d_ext_mm",
   "d_ext_over_d0",
   "K_from_d2_law",
   "test_end"
  ],
  "n": 258,
  "ranges": {
   "d0_mm": {
    "max": 4.67,
    "min": 1.1
   },
   "p_atm": {
    "max": 3.052236842105263,
    "min": 0.6924999999999999
   },
   "x_co2": {
    "max": 0.7,
    "min": 0.0
   },
   "x_he": {
    "max": 0.45,
    "min": 0.0
   },
   "x_o2": {
    "max": 0.34,
    "min": 0.12
   }
  },
  "target": "burn_rate_K_mm2_s"
 },
 "risk": {
  "axes": {
   "o2_pct": [
    15.0,
    15.5,
    16.0,
    16.5,
    17.0,
    17.5,
    18.0,
    18.5,
    19.0,
    19.5,
    20.0,
    20.5,
    21.0,
    21.5,
    22.0,
    22.5,
    23.0,
    23.5,
    24.0,
    24.5,
    25.0,
    25.5,
    26.0,
    26.5,
    27.0,
    27.5,
    28.0,
    28.5,
    29.0,
    29.5,
    30.0,
    30.5,
    31.0,
    31.5,
    32.0,
    32.5,
    33.0,
    33.5,
    34.0,
    34.5,
    35.0,
    35.5,
    36.0,
    36.5,
    37.0,
    37.5,
    38.0,
    38.5,
    39.0,
    39.5,
    40.0
   ],
   "pressure_kpa": [
    50.0,
    55.0,
    56.5,
    60.0,
    65.0,
    70.0,
    70.3,
    75.0,
    80.0,
    85.0,
    90.0,
    95.0,
    100.0,
    101.3
   ]
  },
  "component_keys": [
   "oxygen",
   "ignition",
   "duration",
   "spread",
   "margin",
   "material"
  ],
  "fields": [
   "risk_index",
   "risk_level",
   "components.oxygen",
   "components.ignition",
   "components.duration",
   "components.spread",
   "components.margin",
   "components.material",
   "ignition_probability",
   "burn_time_s",
   "ignition_delay_s",
   "spread_coefficient_mm2_s",
   "pO2_atm",
   "threshold_o2_pct",
   "margin_pct",
   "warnings"
  ],
  "grid": {"Cotton":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,26.38,70.93,0.1041,0.074,18.69,-3.69,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,27.28,68.64,0.1057,0.0765,18.69,-3.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,28.17,66.49,0.1072,0.079,18.69,-2.69,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,29.07,64.48,0.1088,0.0814,18.69,-2.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,29.97,62.58,0.1102,0.0839,18.69,-1.69,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,30.86,60.8,0.1117,0.0864,18.69,-1.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,31.76,59.11,0.1131,0.0888,18.69,-0.69,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,32.66,57.51,0.1145,0.0913,18.69,-0.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,33.55,56.0,0.1159,0.0938,18.69,0.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,34.45,54.56,0.1173,0.0962,18.69,0.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,35.35,53.2,0.1187,0.0987,18.69,1.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,36.25,51.9,0.12,0.1012,18.69,1.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,37.15,50.66,0.1213,0.1036,18.69,2.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,38.05,49.48,0.1226,0.1061,18.69,2.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,38.95,48.36,0.1239,0.1086,18.69,3.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,39.85,47.29,0.1252,0.111,18.69,3.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,40.75,46.26,0.1265,0.1135,18.69,4.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,41.65,45.27,0.1277,0.116,18.69,4.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,42.55,44.33,0.1289,0.1184,18.69,5.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,43.45,43.43,0.1301,0.1209,18.69,5.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,44.36,42.56,0.1313,0.1234,18.69,6.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,45.26,41.72,0.1325,0.1258,18.69,6.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,46.16,40.92,0.1337,0.1283,18.69,7.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,47.06,40.15,0.1349,0.1308,18.69,7.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,47.97,39.4,0.136,0.1332,18.69,8.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,48.87,38.69,0.1371,0.1357,18.69,8.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,49.78,38.0,0.1383,0.1382,18.69,9.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,50.68,37.33,0.1394,0.1406,18.69,9.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,51.58,36.69,0.1405,0.1431,18.69,10.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,52.49,36.06,0.1416,0.1456,18.69,10.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,53.39,35.46,0.1427,0.148,18.69,11.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,54.3,34.88,0.1437,0.1505,18.69,11.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,55.2,34.32,0.1448,0.153,18.69,12.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,56.11,33.77,0.1459,0.1554,18.69,12.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,57.02,33.25,0.1469,0.1579,18.69,13.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,57.92,32.74,0.1479,0.1604,18.69,13.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,58.83,32.24,0.149,0.1628,18.69,14.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.609,59.73,31.76,0.15,0.1653,18.69,14.81,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0028,0.0,0.6127,60.64,31.29,0.151,0.1678,18.69,15.31,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0158,0.0,0.6163,61.55,30.84,0.152,0.1702,18.69,15.81,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0287,0.0,0.6198,62.46,30.4,0.153,0.1727,18.69,16.31,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0417,0.0,0.6233,63.36,29.97,0.154,0.1752,18.69,16.81,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.0547,0.0,0.6267,64.27,29.55,0.155,0.1776,18.69,17.31,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0677,0.0,0.6301,65.18,29.15,0.1559,0.1801,18.69,17.81,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0807,0.0,0.6334,66.09,28.75,0.1569,0.1826,18.69,18.31,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0937,0.0,0.6367,67.0,28.37,0.1579,0.185,18.69,18.81,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1067,0.0,0.6399,67.9,28.0,0.1588,0.1875,18.69,19.31,[6,7]],[3.0,"low",0.0,0.0,0.0,0.0,0.1196,0.0,0.643,68.81,27.63,0.1598,0.19,18.69,19.81,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1326,0.0,0.6461,69.72,27.28,0.1607,0.1925,18.69,20.31,[6,7]],[3.6,"low",0.0,0.0,0.0,0.0,0.1456,0.0,0.6491,70.63,26.93,0.1616,0.1949,18.69,20.81,[6,7]],[4.0,"low",0.0,0.0,0.0,0.0,0.1586,0.0,0.6521,71.54,26.6,0.1626,0.1974,18.69,21.31,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,22.71,64.48,0.1088,0.0814,18.08,-3.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,23.48,62.4,0.1104,0.0841,18.08,-2.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,24.25,60.45,0.112,0.0868,18.08,-2.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,25.02,58.62,0.1136,0.0896,18.08,-1.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,25.79,56.89,0.1151,0.0923,18.08,-1.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,26.57,55.27,0.1166,0.095,18.08,-0.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,27.34,53.73,0.1181,0.0977,18.08,-0.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,28.11,52.28,0.1196,0.1004,18.08,0.42,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,28.88,50.9,0.1211,0.1031,18.08,0.92,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,29.66,49.6,0.1225,0.1058,18.08,1.42,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,30.43,48.36,0.1239,0.1086,18.08,1.92,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,31.2,47.18,0.1253,0.1113,18.08,2.42,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,31.98,46.06,0.1267,0.114,18.08,2.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,32.75,44.99,0.1281,0.1167,18.08,3.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,33.53,43.96,0.1294,0.1194,18.08,3.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,34.3,42.99,0.1307,0.1221,18.08,4.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,35.08,42.05,0.132,0.1248,18.08,4.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,35.85,41.16,0.1333,0.1276,18.08,5.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,36.63,40.3,0.1346,0.1303,18.08,5.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,37.4,39.48,0.1359,0.133,18.08,6.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,38.18,38.69,0.1371,0.1357,18.08,6.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,38.96,37.93,0.1384,0.1384,18.08,7.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,39.73,37.2,0.1396,0.1411,18.08,7.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,40.51,36.5,0.1408,0.1438,18.08,8.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,41.29,35.82,0.142,0.1466,18.08,8.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,42.07,35.17,0.1432,0.1493,18.08,9.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,42.85,34.54,0.1444,0.152,18.08,9.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,43.62,33.94,0.1455,0.1547,18.08,10.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,44.4,33.35,0.1467,0.1574,18.08,10.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,45.18,32.79,0.1478,0.1601,18.08,11.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,45.96,32.24,0.149,0.1628,18.08,11.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,46.74,31.71,0.1501,0.1656,18.08,12.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6134,47.52,31.2,0.1512,0.1683,18.08,12.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6174,48.3,30.7,0.1523,0.171,18.08,13.42,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0029,0.0,0.6212,49.08,30.22,0.1534,0.1737,18.08,13.92,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0172,0.0,0.625,49.86,29.76,0.1545,0.1764,18.08,14.42,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0315,0.0,0.6288,50.64,29.31,0.1556,0.1791,18.08,14.92,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0458,0.0,0.6324,51.42,28.87,0.1566,0.1818,18.08,15.42,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.06,0.0,0.636,52.2,28.45,0.1577,0.1846,18.08,15.92,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0743,0.0,0.6395,52.98,28.03,0.1587,0.1873,18.08,16.42,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0886,0.0,0.643,53.76,27.63,0.1598,0.19,18.08,16.92,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.1029,0.0,0.6464,54.54,27.24,0.1608,0.1927,18.08,17.42,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1172,0.0,0.6497,55.32,26.87,0.1618,0.1954,18.08,17.92,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1315,0.0,0.653,56.1,26.5,0.1628,0.1981,18.08,18.42,[6,7]],[3.6,"low",0.0,0.0,0.0,0.0,0.1458,0.0,0.6562,56.89,26.14,0.1639,0.2008,18.08,18.92,[6,7]],[4.0,"low",0.0,0.0,0.0,0.0,0.16,0.0,0.6594,57.67,25.79,0.1649,0.2036,18.08,19.42,[6,7]],[4.4,"low",0.0,0.0,0.0,0.0,0.1743,0.0,0.6625,58.45,25.45,0.1658,0.2063,18.08,19.92,[6,7]],[4.7,"low",0.0,0.0,0.0,0.0,0.1886,0.0,0.6655,59.23,25.12,0.1668,0.209,18.08,20.42,[6,7]],[5.8,"low",0.0125,0.0143,0.0,0.0125,0.2029,0.0045,0.6685,60.01,24.8,0.1678,0.2117,18.08,20.92,[6]],[7.3,"low",0.0322,0.0369,0.0,0.0322,0.2172,0.0113,0.6715,60.8,24.49,0.1688,0.2144,18.08,21.42,[6]],[8.7,"low",0.0518,0.0592,0.0,0.0518,0.2315,0.0176,0.6744,61.58,24.18,0.1698,0.2171,18.08,21.92,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,21.77,62.77,0.1101,0.0836,17.91,-2.91,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,22.51,60.74,0.1117,0.0864,17.91,-2.41,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,23.25,58.84,0.1134,0.0892,17.91,-1.91,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,23.99,57.06,0.115,0.092,17.91,-1.41,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,24.72,55.38,0.1165,0.0948,17.91,-0.91,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,25.46,53.8,0.1181,0.0976,17.91,-0.41,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,26.2,52.31,0.1196,0.1004,17.91,0.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,26.94,50.89,0.1211,0.1032,17.91,0.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,27.69,49.55,0.1226,0.1059,17.91,1.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,28.43,48.28,0.124,0.1087,17.91,1.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,29.17,47.08,0.1254,0.1115,17.91,2.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,29.91,45.93,0.1269,0.1143,17.91,2.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,30.65,44.83,0.1283,0.1171,17.91,3.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,31.39,43.79,0.1296,0.1199,17.91,3.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,32.14,42.8,0.131,0.1227,17.91,4.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,32.88,41.85,0.1323,0.1255,17.91,4.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,33.62,40.94,0.1337,0.1283,17.91,5.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,34.37,40.06,0.135,0.131,17.91,5.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,35.11,39.23,0.1363,0.1338,17.91,6.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,35.85,38.43,0.1376,0.1366,17.91,6.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,36.6,37.66,0.1388,0.1394,17.91,7.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,37.34,36.92,0.1401,0.1422,17.91,7.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,38.09,36.21,0.1413,0.145,17.91,8.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,38.83,35.53,0.1425,0.1478,17.91,8.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,39.58,34.87,0.1438,0.1506,17.91,9.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,40.32,34.24,0.145,0.1533,17.91,9.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,41.07,33.63,0.1462,0.1561,17.91,10.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,41.82,33.04,0.1473,0.1589,17.91,10.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,42.56,32.47,0.1485,0.1617,17.91,11.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,43.31,31.92,0.1497,0.1645,17.91,11.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,44.05,31.38,0.1508,0.1673,17.91,12.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.616,44.8,30.87,0.1519,0.1701,17.91,12.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.62,45.55,30.37,0.1531,0.1729,17.91,13.09,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0041,0.0,0.624,46.3,29.89,0.1542,0.1756,17.91,13.59,[6,7]],[0.5,"low",0.0,0.0,0.0,0.0,0.0187,0.0,0.6278,47.04,29.42,0.1553,0.1784,17.91,14.09,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0334,0.0,0.6316,47.79,28.97,0.1564,0.1812,17.91,14.59,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0481,0.0,0.6353,48.54,28.53,0.1575,0.184,17.91,15.09,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0627,0.0,0.6389,49.29,28.1,0.1586,0.1868,17.91,15.59,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0774,0.0,0.6425,50.04,27.69,0.1596,0.1896,17.91,16.09,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0921,0.0,0.646,50.78,27.29,0.1607,0.1924,17.91,16.59,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1068,0.0,0.6494,51.53,26.9,0.1617,0.1952,17.91,17.09,[6,7]],[3.0,"low",0.0,0.0,0.0,0.0,0.1214,0.0,0.6528,52.28,26.52,0.1628,0.198,17.91,17.59,[6,7]],[3.4,"low",0.0,0.0,0.0,0.0,0.1361,0.0,0.6561,53.03,26.15,0.1638,0.2007,17.91,18.09,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1508,0.0,0.6594,53.78,25.79,0.1648,0.2035,17.91,18.59,[6,7]],[4.1,"low",0.0,0.0,0.0,0.0,0.1655,0.0,0.6625,54.53,25.45,0.1659,0.2063,17.91,19.09,[6,7]],[4.5,"low",0.0,0.0,0.0,0.0,0.1801,0.0,0.6657,55.28,25.11,0.1669,0.2091,17.91,19.59,[6,7]],[5.7,"low",0.0139,0.016,0.0,0.0139,0.1948,0.0053,0.6687,56.03,24.78,0.1679,0.2119,17.91,20.09,[6]],[7.2,"low",0.0342,0.0392,0.0,0.0342,0.2095,0.0126,0.6718,56.78,24.45,0.1689,0.2147,17.91,20.59,[6]],[8.7,"low",0.0542,0.062,0.0,0.0542,0.2242,0.0195,0.6747,57.53,24.14,0.1699,0.2175,17.91,21.09,[6]],[10.2,"low",0.074,0.0844,0.0,0.074,0.2388,0.0259,0.6776,58.28,23.84,0.1709,0.2203,17.91,21.59,[6]],[11.7,"low",0.0935,0.1064,0.0,0.0935,0.2535,0.0318,0.6805,59.03,23.54,0.1718,0.223,17.91,22.09,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,19.81,59.11,0.1131,0.0888,17.54,-2.54,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,20.48,57.2,0.1148,0.0918,17.54,-2.04,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,21.15,55.41,0.1165,0.0947,17.54,-1.54,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,21.82,53.73,0.1181,0.0977,17.54,-1.04,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,22.49,52.15,0.1197,0.1007,17.54,-0.54,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,23.17,50.66,0.1213,0.1036,17.54,-0.04,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,23.84,49.26,0.1229,0.1066,17.54,0.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,24.51,47.92,0.1244,0.1095,17.54,0.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,25.19,46.66,0.126,0.1125,17.54,1.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,25.86,45.47,0.1274,0.1155,17.54,1.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,26.54,44.33,0.1289,0.1184,17.54,2.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,27.21,43.25,0.1304,0.1214,17.54,2.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,27.89,42.22,0.1318,0.1244,17.54,3.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,28.56,41.24,0.1332,0.1273,17.54,3.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,29.24,40.3,0.1346,0.1303,17.54,4.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,29.91,39.4,0.136,0.1332,17.54,4.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,30.59,38.55,0.1374,0.1362,17.54,5.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,31.27,37.73,0.1387,0.1392,17.54,5.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,31.94,36.94,0.14,0.1421,17.54,6.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,32.62,36.19,0.1414,0.1451,17.54,6.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,33.3,35.46,0.1427,0.148,17.54,7.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,33.97,34.77,0.144,0.151,17.54,7.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,34.65,34.1,0.1452,0.154,17.54,8.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,35.33,33.46,0.1465,0.1569,17.54,8.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,36.01,32.84,0.1477,0.1599,17.54,9.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,36.69,32.24,0.149,0.1628,17.54,9.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,37.36,31.66,0.1502,0.1658,17.54,10.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,38.04,31.11,0.1514,0.1688,17.54,10.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,38.72,30.57,0.1526,0.1717,17.54,11.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6226,39.4,30.05,0.1538,0.1747,17.54,11.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,40.08,29.55,0.155,0.1776,17.54,12.46,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0092,0.0,0.6308,40.76,29.07,0.1561,0.1806,17.54,12.96,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0248,0.0,0.6347,41.44,28.6,0.1573,0.1836,17.54,13.46,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0404,0.0,0.6386,42.12,28.15,0.1584,0.1865,17.54,13.96,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.056,0.0,0.6424,42.8,27.71,0.1596,0.1895,17.54,14.46,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.0715,0.0,0.6461,43.48,27.28,0.1607,0.1925,17.54,14.96,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0871,0.0,0.6497,44.16,26.87,0.1618,0.1954,17.54,15.46,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.1027,0.0,0.6533,44.84,26.47,0.1629,0.1984,17.54,15.96,[6,7]],[3.0,"low",0.0,0.0,0.0,0.0,0.1183,0.0,0.6568,45.52,26.08,0.164,0.2013,17.54,16.46,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1339,0.0,0.6602,46.2,25.7,0.1651,0.2043,17.54,16.96,[6,7]],[3.7,"low",0.0,0.0,0.0,0.0,0.1495,0.0,0.6636,46.88,25.33,0.1662,0.2073,17.54,17.46,[6,7]],[4.2,"low",0.0016,0.0018,0.0,0.0016,0.165,0.0007,0.6669,47.56,24.97,0.1673,0.2102,17.54,17.96,[6]],[5.9,"low",0.0233,0.0267,0.0,0.0233,0.1806,0.0098,0.6701,48.25,24.63,0.1683,0.2132,17.54,18.46,[6]],[7.5,"low",0.0447,0.0511,0.0,0.0447,0.1962,0.0183,0.6733,48.93,24.29,0.1694,0.2161,17.54,18.96,[6]],[9.1,"low",0.0658,0.0751,0.0,0.0658,0.2118,0.0263,0.6764,49.61,23.96,0.1705,0.2191,17.54,19.46,[6]],[10.7,"low",0.0866,0.0986,0.0,0.0866,0.2274,0.0338,0.6795,50.29,23.64,0.1715,0.2221,17.54,19.96,[6]],[12.2,"low",0.1072,0.1217,0.0,0.1072,0.243,0.0407,0.6825,50.97,23.33,0.1725,0.225,17.54,20.46,[6]],[13.7,"low",0.1275,0.1444,0.0,0.1275,0.2585,0.0471,0.6855,51.66,23.03,0.1736,0.228,17.54,20.96,[6]],[15.2,"low",0.1475,0.1667,0.0,0.1475,0.2741,0.053,0.6884,52.34,22.73,0.1746,0.2309,17.54,21.46,[6]],[16.8,"low",0.1673,0.1886,0.0077,0.1673,0.2897,0.0585,0.6912,53.02,22.45,0.1756,0.2339,17.54,21.96,[6]],[18.7,"low",0.1868,0.2101,0.031,0.1868,0.3053,0.0635,0.694,53.7,22.16,0.1766,0.2369,17.54,22.46,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,17.46,54.56,0.1173,0.0962,17.05,-2.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,18.05,52.8,0.1191,0.0994,17.05,-1.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,18.65,51.15,0.1208,0.1026,17.05,-1.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,19.24,49.6,0.1225,0.1058,17.05,-0.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,19.83,48.14,0.1242,0.1091,17.05,-0.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,20.43,46.77,0.1258,0.1123,17.05,0.45,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,21.02,45.47,0.1274,0.1155,17.05,0.95,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,21.61,44.24,0.129,0.1187,17.05,1.45,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,22.21,43.07,0.1306,0.1219,17.05,1.95,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,22.8,41.97,0.1322,0.1251,17.05,2.45,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,23.4,40.92,0.1337,0.1283,17.05,2.95,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,23.99,39.92,0.1352,0.1315,17.05,3.45,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,24.59,38.97,0.1367,0.1347,17.05,3.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,25.18,38.06,0.1382,0.1379,17.05,4.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,25.78,37.2,0.1396,0.1411,17.05,4.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,26.37,36.37,0.141,0.1443,17.05,5.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,26.97,35.58,0.1424,0.1475,17.05,5.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,27.57,34.83,0.1438,0.1508,17.05,6.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,28.16,34.1,0.1452,0.154,17.05,6.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,28.76,33.4,0.1466,0.1572,17.05,7.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,29.36,32.74,0.1479,0.1604,17.05,7.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,29.96,32.09,0.1493,0.1636,17.05,8.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,30.55,31.48,0.1506,0.1668,17.05,8.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,31.15,30.88,0.1519,0.17,17.05,9.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,31.75,30.31,0.1532,0.1732,17.05,9.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,32.35,29.76,0.1545,0.1764,17.05,10.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,32.94,29.23,0.1558,0.1796,17.05,10.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,33.54,28.72,0.157,0.1828,17.05,11.45,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0086,0.0,0.638,34.14,28.22,0.1583,0.186,17.05,11.95,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0255,0.0,0.6421,34.74,27.74,0.1595,0.1892,17.05,12.45,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0424,0.0,0.6461,35.34,27.28,0.1607,0.1925,17.05,12.95,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0592,0.0,0.65,35.94,26.83,0.1619,0.1957,17.05,13.45,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0761,0.0,0.6539,36.54,26.4,0.1631,0.1989,17.05,13.95,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.093,0.0,0.6577,37.14,25.98,0.1643,0.2021,17.05,14.45,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1099,0.0,0.6614,37.74,25.57,0.1655,0.2053,17.05,14.95,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1268,0.0,0.665,38.34,25.18,0.1667,0.2085,17.05,15.45,[6,7]],[4.3,"low",0.0125,0.0143,0.0,0.0125,0.1436,0.006,0.6685,38.94,24.8,0.1678,0.2117,17.05,15.95,[6]],[6.1,"low",0.0358,0.041,0.0,0.0358,0.1605,0.017,0.672,39.54,24.43,0.169,0.2149,17.05,16.45,[6]],[7.9,"low",0.0588,0.0672,0.0,0.0588,0.1774,0.0272,0.6754,40.14,24.07,0.1701,0.2181,17.05,16.95,[6]],[9.6,"low",0.0815,0.0928,0.0,0.0815,0.1943,0.0369,0.6787,40.74,23.72,0.1712,0.2213,17.05,17.45,[6]],[11.3,"low",0.1038,0.1179,0.0,0.1038,0.2112,0.0459,0.682,41.34,23.38,0.1724,0.2245,17.05,17.95,[6]],[13.0,"low",0.1258,0.1425,0.0,0.1258,0.228,0.0543,0.6852,41.94,23.05,0.1735,0.2277,17.05,18.45,[6]],[14.6,"low",0.1475,0.1667,0.0,0.1475,0.2449,0.0621,0.6884,42.54,22.73,0.1746,0.2309,17.05,18.95,[6]],[16.4,"low",0.1689,0.1904,0.0097,0.1689,0.2618,0.0693,0.6914,43.14,22.42,0.1757,0.2341,17.05,19.45,[6]],[18.3,"low",0.19,0.2136,0.0349,0.19,0.2787,0.076,0.6945,43.74,22.12,0.1768,0.2374,17.05,19.95,[6]],[20.3,"low",0.2109,0.2364,0.0597,0.2109,0.2956,0.0822,0.6974,44.34,21.82,0.1778,0.2406,17.05,20.45,[6]],[22.2,"low",0.2314,0.2588,0.0842,0.2314,0.3125,0.0879,0.7003,44.94,21.54,0.1789,0.2438,17.05,20.95,[6]],[24.1,"low",0.2517,0.2808,0.1083,0.2517,0.3293,0.093,0.7032,45.54,21.26,0.18,0.247,17.05,21.45,[6]],[26.0,"low",0.2717,0.3024,0.1322,0.2717,0.3462,0.0977,0.706,46.15,20.98,0.181,0.2502,17.05,21.95,[6]],[27.8,"low",0.2915,0.3235,0.1558,0.2915,0.3631,0.102,0.7088,46.75,20.72,0.1821,0.2534,17.05,22.45,[6]],[29.6,"low",0.311,0.3443,0.179,0.311,0.38,0.1058,0.7115,47.35,20.46,0.1831,0.2566,17.05,22.95,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,15.54,50.66,0.1213,0.1036,16.62,-1.62,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,16.07,49.03,0.1232,0.1071,16.62,-1.12,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,16.6,47.5,0.1249,0.1105,16.62,-0.62,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,17.12,46.06,0.1267,0.114,16.62,-0.12,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,17.65,44.7,0.1284,0.1174,16.62,0.38,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,18.18,43.43,0.1301,0.1209,16.62,0.88,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,18.71,42.22,0.1318,0.1244,16.62,1.38,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,19.24,41.08,0.1335,0.1278,16.62,1.88,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,19.76,40.0,0.1351,0.1313,16.62,2.38,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,20.29,38.97,0.1367,0.1347,16.62,2.88,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,20.82,38.0,0.1383,0.1382,16.62,3.38,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,21.35,37.07,0.1398,0.1416,16.62,3.88,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,21.88,36.19,0.1414,0.1451,16.62,4.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,22.41,35.35,0.1429,0.1485,16.62,4.88,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,22.94,34.54,0.1444,0.152,16.62,5.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,23.47,33.77,0.1459,0.1554,16.62,5.88,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,24.0,33.04,0.1473,0.1589,16.62,6.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,24.53,32.34,0.1488,0.1623,16.62,6.88,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,25.07,31.66,0.1502,0.1658,16.62,7.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,25.6,31.02,0.1516,0.1693,16.62,7.88,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,26.13,30.4,0.153,0.1727,16.62,8.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,26.66,29.8,0.1544,0.1762,16.62,8.88,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,27.19,29.23,0.1558,0.1796,16.62,9.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6341,27.72,28.68,0.1571,0.1831,16.62,9.88,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,28.25,28.15,0.1584,0.1865,16.62,10.38,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0009,0.0,0.643,28.79,27.63,0.1598,0.19,16.62,10.88,[6,7]],[0.5,"low",0.0,0.0,0.0,0.0,0.0191,0.0,0.6473,29.32,27.14,0.1611,0.1934,16.62,11.38,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0373,0.0,0.6515,29.85,26.66,0.1624,0.1969,16.62,11.88,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.0555,0.0,0.6556,30.38,26.2,0.1637,0.2003,16.62,12.38,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.0737,0.0,0.6597,30.92,25.76,0.1649,0.2038,16.62,12.88,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0919,0.0,0.6636,31.45,25.33,0.1662,0.2073,16.62,13.38,[6,7]],[3.1,"low",0.0052,0.006,0.0,0.0052,0.11,0.0028,0.6674,31.98,24.92,0.1675,0.2107,16.62,13.88,[6]],[5.0,"low",0.0305,0.0349,0.0,0.0305,0.1282,0.0161,0.6712,32.52,24.51,0.1687,0.2142,16.62,14.38,[6]],[6.9,"low",0.0553,0.0632,0.0,0.0553,0.1464,0.0286,0.6749,33.05,24.12,0.1699,0.2176,16.62,14.88,[6]],[8.8,"low",0.0797,0.0908,0.0,0.0797,0.1646,0.0404,0.6785,33.58,23.75,0.1712,0.2211,16.62,15.38,[6]],[10.6,"low",0.1038,0.1179,0.0,0.1038,0.1828,0.0514,0.682,34.12,23.38,0.1724,0.2245,16.62,15.88,[6]],[12.4,"low",0.1275,0.1444,0.0,0.1275,0.2009,0.0618,0.6855,34.65,23.03,0.1736,0.228,16.62,16.38,[6]],[14.2,"low",0.1508,0.1704,0.0,0.1508,0.2191,0.0715,0.6888,35.19,22.68,0.1747,0.2314,16.62,16.88,[6]],[16.2,"low",0.1738,0.1958,0.0155,0.1738,0.2373,0.0805,0.6921,35.72,22.35,0.1759,0.2349,16.62,17.38,[6]],[18.3,"low",0.1965,0.2207,0.0425,0.1965,0.2555,0.0889,0.6954,36.25,22.03,0.1771,0.2383,16.62,17.88,[6]],[20.4,"low",0.2188,0.2451,0.0691,0.2188,0.2737,0.0967,0.6986,36.79,21.71,0.1783,0.2418,16.62,18.38,[6]],[22.5,"low",0.2408,0.269,0.0954,0.2408,0.2918,0.1039,0.7017,37.32,21.41,0.1794,0.2453,16.62,18.88,[6]],[24.5,"low",0.2625,0.2925,0.1212,0.2625,0.31,0.1105,0.7047,37.86,21.11,0.1806,0.2487,16.62,19.38,[6]],[26.6,"low",0.2839,0.3154,0.1467,0.2839,0.3282,0.1165,0.7077,38.39,20.82,0.1817,0.2522,16.62,19.88,[6]],[28.5,"low",0.305,0.338,0.1719,0.305,0.3464,0.1221,0.7106,38.93,20.54,0.1828,0.2556,16.62,20.38,[6]],[30.5,"low",0.3259,0.3601,0.1967,0.3259,0.3646,0.127,0.7135,39.46,20.27,0.1839,0.2591,16.62,20.88,[6]],[32.4,"low",0.3464,0.3817,0.2212,0.3464,0.3827,0.1315,0.7163,40.0,20.0,0.185,0.2625,16.62,21.38,[6]],[34.3,"low",0.3667,0.403,0.2454,0.3667,0.4009,0.1355,0.7191,40.53,19.74,0.1861,0.266,16.62,21.88,[6]],[36.2,"medium",0.3867,0.4239,0.2693,0.3867,0.4191,0.1391,0.7218,41.07,19.49,0.1872,0.2694,16.62,22.38,[]],[38.0,"medium",0.4065,0.4443,0.2928,0.4065,0.4373,0.1422,0.7245,41.6,19.24,0.1883,0.2729,16.62,22.88,[]],[39.8,"medium",0.426,0.4644,0.3161,0.426,0.4555,0.1449,0.7271,42.14,19.0,0.1894,0.2763,16.62,23.38,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,15.44,50.45,0.1216,0.1041,16.59,-1.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,15.96,48.82,0.1234,0.1075,16.59,-1.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,16.48,47.29,0.1252,0.111,16.59,-0.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,17.01,45.86,0.1269,0.1145,16.59,-0.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,17.53,44.51,0.1287,0.1179,16.59,0.41,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,18.06,43.24,0.1304,0.1214,16.59,0.91,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,18.58,42.04,0.1321,0.1249,16.59,1.41,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,19.11,40.9,0.1337,0.1284,16.59,1.91,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,19.63,39.83,0.1353,0.1318,16.59,2.41,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,20.16,38.8,0.1369,0.1353,16.59,2.91,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,20.68,37.83,0.1385,0.1388,16.59,3.41,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,21.21,36.91,0.1401,0.1422,16.59,3.91,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,21.74,36.03,0.1416,0.1457,16.59,4.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,22.26,35.2,0.1432,0.1492,16.59,4.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,22.79,34.4,0.1447,0.1526,16.59,5.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,23.32,33.63,0.1461,0.1561,16.59,5.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,23.84,32.9,0.1476,0.1596,16.59,6.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,24.37,32.2,0.1491,0.163,16.59,6.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,24.9,31.53,0.1505,0.1665,16.59,7.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,25.42,30.89,0.1519,0.17,16.59,7.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,25.95,30.27,0.1533,0.1735,16.59,8.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,26.48,29.67,0.1547,0.1769,16.59,8.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,27.01,29.1,0.1561,0.1804,16.59,9.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6351,27.54,28.55,0.1574,0.1839,16.59,9.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6396,28.07,28.03,0.1588,0.1873,16.59,10.41,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0036,0.0,0.644,28.59,27.52,0.1601,0.1908,16.59,10.91,[6,7]],[0.5,"low",0.0,0.0,0.0,0.0,0.0218,0.0,0.6483,29.12,27.02,0.1614,0.1943,16.59,11.41,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0401,0.0,0.6525,29.65,26.55,0.1627,0.1977,16.59,11.91,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0583,0.0,0.6567,30.18,26.09,0.164,0.2012,16.59,12.41,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0766,0.0,0.6607,30.71,25.65,0.1653,0.2047,16.59,12.91,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0948,0.0,0.6646,31.24,25.22,0.1665,0.2081,16.59,13.41,[6,7]],[3.5,"low",0.0119,0.0136,0.0,0.0119,0.1131,0.0064,0.6684,31.77,24.81,0.1678,0.2116,16.59,13.91,[6]],[5.5,"low",0.0371,0.0425,0.0,0.0371,0.1314,0.0196,0.6722,32.3,24.41,0.169,0.2151,16.59,14.41,[6]],[7.4,"low",0.0619,0.0707,0.0,0.0619,0.1496,0.032,0.6759,32.83,24.02,0.1703,0.2185,16.59,14.91,[6]],[9.3,"low",0.0864,0.0983,0.0,0.0864,0.1679,0.0437,0.6795,33.36,23.65,0.1715,0.222,16.59,15.41,[6]],[11.1,"low",0.1104,0.1254,0.0,0.1104,0.1861,0.0547,0.683,33.89,23.28,0.1727,0.2255,16.59,15.91,[6]],[12.9,"low",0.1341,0.1518,0.0,0.1341,0.2044,0.065,0.6864,34.42,22.93,0.1739,0.229,16.59,16.41,[6]],[14.7,"low",0.1575,0.1777,0.0,0.1575,0.2226,0.0746,0.6898,34.95,22.59,0.1751,0.2324,16.59,16.91,[6]],[16.8,"low",0.1805,0.2031,0.0234,0.1805,0.2409,0.0836,0.6931,35.48,22.26,0.1763,0.2359,16.59,17.41,[6]],[18.9,"low",0.2031,0.228,0.0504,0.2031,0.2592,0.0919,0.6963,36.01,21.93,0.1774,0.2394,16.59,17.91,[6]],[21.0,"low",0.2254,0.2523,0.077,0.2254,0.2774,0.0996,0.6995,36.54,21.62,0.1786,0.2428,16.59,18.41,[6]],[23.1,"low",0.2475,0.2762,0.1033,0.2475,0.2957,0.1068,0.7026,37.07,21.32,0.1798,0.2463,16.59,18.91,[6]],[25.1,"low",0.2692,0.2996,0.1291,0.2692,0.3139,0.1133,0.7057,37.6,21.02,0.1809,0.2498,16.59,19.41,[6]],[27.1,"low",0.2906,0.3225,0.1547,0.2906,0.3322,0.1193,0.7086,38.14,20.73,0.182,0.2532,16.59,19.91,[6]],[29.1,"low",0.3117,0.345,0.1798,0.3117,0.3505,0.1247,0.7116,38.67,20.45,0.1832,0.2567,16.59,20.41,[6]],[31.1,"low",0.3325,0.3671,0.2046,0.3325,0.3687,0.1296,0.7144,39.2,20.18,0.1843,0.2602,16.59,20.91,[6]],[33.0,"low",0.3531,0.3887,0.2291,0.3531,0.387,0.134,0.7173,39.73,19.91,0.1854,0.2636,16.59,21.41,[6]],[34.9,"low",0.3734,0.4099,0.2533,0.3734,0.4052,0.138,0.72,40.26,19.65,0.1865,0.2671,16.59,21.91,[6]],[36.8,"medium",0.3934,0.4307,0.2772,0.3934,0.4235,0.1415,0.7227,40.79,19.4,0.1876,0.2706,16.59,22.41,[]],[38.6,"medium",0.4132,0.4512,0.3007,0.4132,0.4417,0.1445,0.7254,41.32,19.16,0.1887,0.2741,16.59,22.91,[]],[40.4,"medium",0.4327,0.4712,0.324,0.4327,0.46,0.1471,0.728,41.86,18.92,0.1898,0.2775,16.59,23.41,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,13.94,47.29,0.1252,0.111,16.22,-1.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,14.42,45.76,0.1271,0.1147,16.22,-0.72,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,14.89,44.33,0.1289,0.1184,16.22,-0.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,15.36,42.99,0.1307,0.1221,16.22,0.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,15.84,41.72,0.1325,0.1258,16.22,0.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,16.31,40.53,0.1343,0.1295,16.22,1.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,16.78,39.4,0.136,0.1332,16.22,1.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,17.26,38.34,0.1377,0.1369,16.22,2.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,17.73,37.33,0.1394,0.1406,16.22,2.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,18.21,36.37,0.141,0.1443,16.22,3.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,18.68,35.46,0.1427,0.148,16.22,3.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,19.16,34.6,0.1443,0.1517,16.22,4.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,19.63,33.77,0.1459,0.1554,16.22,4.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,20.11,32.99,0.1474,0.1591,16.22,5.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,20.58,32.24,0.149,0.1628,16.22,5.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,21.06,31.52,0.1505,0.1665,16.22,6.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,21.53,30.84,0.152,0.1702,16.22,6.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,22.01,30.18,0.1535,0.1739,16.22,7.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,22.49,29.55,0.155,0.1776,16.22,7.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,22.96,28.95,0.1564,0.1813,16.22,8.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,23.44,28.37,0.1579,0.185,16.22,8.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,23.92,27.81,0.1593,0.1887,16.22,9.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,24.39,27.28,0.1607,0.1925,16.22,9.78,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0057,0.0,0.6506,24.87,26.77,0.1621,0.1962,16.22,10.28,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0252,0.0,0.6551,25.35,26.27,0.1635,0.1999,16.22,10.78,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0447,0.0,0.6594,25.83,25.79,0.1649,0.2036,16.22,11.28,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0641,0.0,0.6636,26.3,25.33,0.1662,0.2073,16.22,11.78,[6,7]],[2.5,"low",0.007,0.0081,0.0,0.007,0.0836,0.0041,0.6677,26.78,24.89,0.1675,0.211,16.22,12.28,[6]],[4.6,"low",0.034,0.039,0.0,0.034,0.1031,0.0194,0.6717,27.26,24.46,0.1689,0.2147,16.22,12.78,[6]],[6.6,"low",0.0606,0.0691,0.0,0.0606,0.1226,0.0339,0.6757,27.74,24.04,0.1702,0.2184,16.22,13.28,[6]],[8.7,"low",0.0866,0.0986,0.0,0.0866,0.1421,0.0476,0.6795,28.22,23.64,0.1715,0.2221,16.22,13.78,[6]],[10.6,"low",0.1123,0.1274,0.0,0.1123,0.1615,0.0605,0.6832,28.69,23.25,0.1728,0.2258,16.22,14.28,[6]],[12.6,"low",0.1375,0.1556,0.0,0.1375,0.181,0.0726,0.6869,29.17,22.88,0.1741,0.2295,16.22,14.78,[6]],[14.5,"low",0.1624,0.1832,0.0019,0.1624,0.2005,0.0839,0.6905,29.65,22.52,0.1753,0.2332,16.22,15.28,[6]],[16.8,"low",0.1868,0.2101,0.031,0.1868,0.22,0.0946,0.694,30.13,22.16,0.1766,0.2369,16.22,15.78,[6]],[19.1,"low",0.2109,0.2364,0.0597,0.2109,0.2394,0.1045,0.6974,30.61,21.82,0.1778,0.2406,16.22,16.28,[6]],[21.3,"low",0.2346,0.2622,0.0879,0.2346,0.2589,0.1137,0.7008,31.09,21.49,0.1791,0.2443,16.22,16.78,[6]],[23.6,"low",0.2579,0.2875,0.1157,0.2579,0.2784,0.1222,0.7041,31.57,21.17,0.1803,0.248,16.22,17.28,[6]],[25.7,"low",0.2809,0.3122,0.1431,0.2809,0.2979,0.1301,0.7073,32.05,20.86,0.1815,0.2517,16.22,17.78,[6]],[27.9,"low",0.3035,0.3364,0.1701,0.3035,0.3174,0.1374,0.7104,32.53,20.56,0.1827,0.2554,16.22,18.28,[6]],[30.0,"low",0.3259,0.3601,0.1967,0.3259,0.3368,0.144,0.7135,33.0,20.27,0.1839,0.2591,16.22,18.78,[6]],[32.0,"low",0.3479,0.3833,0.223,0.3479,0.3563,0.1501,0.7165,33.48,19.98,0.1851,0.2628,16.22,19.28,[6]],[34.1,"low",0.3696,0.406,0.2488,0.3696,0.3758,0.1556,0.7195,33.96,19.7,0.1863,0.2665,16.22,19.78,[6]],[36.1,"medium",0.391,0.4283,0.2743,0.391,0.3953,0.1605,0.7224,34.44,19.43,0.1875,0.2702,16.22,20.28,[]],[38.1,"medium",0.4121,0.4501,0.2995,0.4121,0.4148,0.1649,0.7252,34.92,19.17,0.1886,0.2739,16.22,20.78,[]],[40.0,"medium",0.4329,0.4715,0.3243,0.4329,0.4342,0.1688,0.728,35.4,18.91,0.1898,0.2776,16.22,21.28,[]],[41.9,"medium",0.4535,0.4925,0.3488,0.4535,0.4537,0.1722,0.7308,35.88,18.67,0.1909,0.2813,16.22,21.78,[]],[43.8,"medium",0.4738,0.5131,0.373,0.4738,0.4732,0.1751,0.7334,36.36,18.42,0.1921,0.285,16.22,22.28,[]],[45.7,"medium",0.4938,0.5333,0.3968,0.4938,0.4927,0.1776,0.7361,36.84,18.19,0.1932,0.2887,16.22,22.78,[]],[47.6,"medium",0.5136,0.5531,0.4204,0.5136,0.5121,0.1796,0.7386,37.33,17.96,0.1943,0.2924,16.22,23.28,[]],[49.4,"medium",0.5331,0.5725,0.4437,0.5331,0.5316,0.1813,0.7412,37.81,17.73,0.1954,0.2961,16.22,23.78,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,12.6,44.33,0.1289,0.1184,15.86,-0.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,13.02,42.9,0.1309,0.1224,15.86,-0.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,13.45,41.56,0.1328,0.1263,15.86,0.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,13.88,40.3,0.1346,0.1303,15.86,0.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,14.31,39.11,0.1365,0.1342,15.86,1.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,14.73,38.0,0.1383,0.1382,15.86,1.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,15.16,36.94,0.14,0.1421,15.86,2.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,15.59,35.94,0.1418,0.1461,15.86,2.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,16.02,35.0,0.1435,0.15,15.86,3.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,16.45,34.1,0.1452,0.154,15.86,3.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,16.88,33.25,0.1469,0.1579,15.86,4.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,17.31,32.44,0.1486,0.1619,15.86,4.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,17.74,31.66,0.1502,0.1658,15.86,5.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,18.17,30.93,0.1518,0.1698,15.86,5.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,18.6,30.22,0.1534,0.1737,15.86,6.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,19.03,29.55,0.155,0.1776,15.86,6.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,19.46,28.91,0.1565,0.1816,15.86,7.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,19.89,28.3,0.1581,0.1855,15.86,7.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,20.32,27.71,0.1596,0.1895,15.86,8.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,20.75,27.14,0.1611,0.1934,15.86,8.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,21.18,26.6,0.1626,0.1974,15.86,9.14,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0059,0.0,0.6568,21.61,26.08,0.164,0.2013,15.86,9.64,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0267,0.0,0.6614,22.04,25.57,0.1655,0.2053,15.86,10.14,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0475,0.0,0.6658,22.47,25.09,0.1669,0.2092,15.86,10.64,[6,7]],[3.1,"low",0.0233,0.0267,0.0,0.0233,0.0682,0.0143,0.6701,22.9,24.63,0.1683,0.2132,15.86,11.14,[6]],[5.3,"low",0.0518,0.0592,0.0,0.0518,0.089,0.0311,0.6744,23.33,24.18,0.1698,0.2171,15.86,11.64,[6]],[7.5,"low",0.0797,0.0908,0.0,0.0797,0.1098,0.0471,0.6785,23.76,23.75,0.1712,0.2211,15.86,12.14,[6]],[9.6,"low",0.1072,0.1217,0.0,0.1072,0.1306,0.0623,0.6825,24.2,23.33,0.1725,0.225,15.86,12.64,[6]],[11.7,"low",0.1342,0.1519,0.0,0.1342,0.1513,0.0765,0.6864,24.63,22.93,0.1739,0.229,15.86,13.14,[6]],[13.8,"low",0.1607,0.1813,0.0,0.1607,0.1721,0.09,0.6903,25.06,22.54,0.1753,0.2329,15.86,13.64,[6]],[16.2,"low",0.1868,0.2101,0.031,0.1868,0.1929,0.1026,0.694,25.49,22.16,0.1766,0.2369,15.86,14.14,[6]],[18.7,"low",0.2125,0.2382,0.0616,0.2125,0.2137,0.1144,0.6977,25.92,21.8,0.1779,0.2408,15.86,14.64,[6]],[21.1,"low",0.2377,0.2656,0.0916,0.2377,0.2344,0.1254,0.7012,26.36,21.45,0.1792,0.2448,15.86,15.14,[6]],[23.4,"low",0.2625,0.2925,0.1212,0.2625,0.2552,0.1357,0.7047,26.79,21.11,0.1806,0.2487,15.86,15.64,[6]],[25.8,"low",0.287,0.3187,0.1504,0.287,0.276,0.1453,0.7081,27.22,20.78,0.1818,0.2527,15.86,16.14,[6]],[28.0,"low",0.311,0.3443,0.179,0.311,0.2968,0.1541,0.7115,27.65,20.46,0.1831,0.2566,15.86,16.64,[6]],[30.3,"low",0.3347,0.3694,0.2073,0.3347,0.3176,0.1623,0.7147,28.09,20.15,0.1844,0.2605,15.86,17.14,[6]],[32.5,"low",0.3581,0.3939,0.2351,0.3581,0.3383,0.1697,0.7179,28.52,19.85,0.1857,0.2645,15.86,17.64,[6]],[34.7,"low",0.381,0.4179,0.2625,0.381,0.3591,0.1765,0.7211,28.95,19.56,0.1869,0.2684,15.86,18.14,[6]],[36.8,"medium",0.4037,0.4414,0.2895,0.4037,0.3799,0.1827,0.7241,29.39,19.27,0.1882,0.2724,15.86,18.64,[]],[38.9,"medium",0.426,0.4644,0.3161,0.426,0.4007,0.1883,0.7271,29.82,19.0,0.1894,0.2763,15.86,19.14,[]],[41.0,"medium",0.448,0.487,0.3423,0.448,0.4214,0.1933,0.73,30.25,18.73,0.1906,0.2803,15.86,19.64,[]],[43.0,"medium",0.4698,0.509,0.3682,0.4698,0.4422,0.1977,0.7329,30.69,18.47,0.1918,0.2842,15.86,20.14,[]],[45.0,"medium",0.4912,0.5306,0.3937,0.4912,0.463,0.2016,0.7357,31.12,18.22,0.193,0.2882,15.86,20.64,[]],[47.0,"medium",0.5123,0.5518,0.4188,0.5123,0.4838,0.205,0.7385,31.55,17.97,0.1942,0.2921,15.86,21.14,[]],[49.0,"medium",0.5331,0.5725,0.4437,0.5331,0.5046,0.2078,0.7412,31.99,17.73,0.1954,0.2961,15.86,21.64,[]],[50.9,"medium",0.5537,0.5929,0.4682,0.5537,0.5253,0.2102,0.7438,32.42,17.5,0.1966,0.3,15.86,22.14,[]],[52.8,"medium",0.574,0.6128,0.4923,0.574,0.5461,0.2121,0.7464,32.85,17.27,0.1978,0.304,15.86,22.64,[]],[54.7,"medium",0.594,0.6324,0.5162,0.594,0.5669,0.2136,0.749,33.29,17.05,0.1989,0.3079,15.86,23.14,[]],[56.6,"medium",0.6137,0.6515,0.5397,0.6137,0.5877,0.2147,0.7515,33.72,16.83,0.2001,0.3119,15.86,23.64,[]],[58.4,"medium",0.6333,0.6703,0.563,0.6333,0.6084,0.2154,0.7539,34.16,16.62,0.2012,0.3158,15.86,24.14,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,11.45,41.72,0.1325,0.1258,15.53,-0.53,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,11.84,40.38,0.1345,0.13,15.53,-0.03,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,12.23,39.11,0.1365,0.1342,15.53,0.47,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,12.62,37.93,0.1384,0.1384,15.53,0.97,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,13.01,36.81,0.1403,0.1426,15.53,1.47,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,13.39,35.76,0.1421,0.1468,15.53,1.97,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,13.78,34.77,0.144,0.151,15.53,2.47,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,14.17,33.83,0.1458,0.1552,15.53,2.97,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,14.56,32.94,0.1475,0.1594,15.53,3.47,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,14.95,32.09,0.1493,0.1636,15.53,3.97,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,15.34,31.29,0.151,0.1678,15.53,4.47,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,15.73,30.53,0.1527,0.172,15.53,4.97,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,16.12,29.8,0.1544,0.1762,15.53,5.47,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,16.51,29.11,0.156,0.1804,15.53,5.97,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,16.9,28.45,0.1577,0.1846,15.53,6.47,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,17.3,27.81,0.1593,0.1887,15.53,6.97,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,17.69,27.21,0.1609,0.1929,15.53,7.47,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6518,18.08,26.63,0.1625,0.1971,15.53,7.97,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,18.47,26.08,0.164,0.2013,15.53,8.47,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0015,0.0,0.6616,18.86,25.54,0.1656,0.2055,15.53,8.97,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0236,0.0,0.6664,19.25,25.03,0.1671,0.2097,15.53,9.47,[6,7]],[2.9,"low",0.0287,0.0329,0.0,0.0287,0.0456,0.0184,0.6709,19.64,24.54,0.1686,0.2139,15.53,9.97,[6]],[5.2,"low",0.0588,0.0672,0.0,0.0588,0.0677,0.0372,0.6754,20.03,24.07,0.1701,0.2181,15.53,10.47,[6]],[7.5,"low",0.0884,0.1006,0.0,0.0884,0.0898,0.055,0.6798,20.43,23.62,0.1716,0.2223,15.53,10.97,[6]],[9.8,"low",0.1174,0.1331,0.0,0.1174,0.1119,0.0718,0.684,20.82,23.18,0.173,0.2265,15.53,11.47,[6]],[12.0,"low",0.1459,0.1649,0.0,0.1459,0.1339,0.0877,0.6881,21.21,22.76,0.1745,0.2307,15.53,11.97,[6]],[14.4,"low",0.1738,0.1958,0.0155,0.1738,0.156,0.1028,0.6921,21.6,22.35,0.1759,0.2349,15.53,12.47,[6]],[17.0,"low",0.2013,0.226,0.0483,0.2013,0.1781,0.1169,0.6961,22.0,21.96,0.1773,0.2391,15.53,12.97,[6]],[19.6,"low",0.2283,0.2554,0.0804,0.2283,0.2002,0.1302,0.6999,22.39,21.58,0.1788,0.2433,15.53,13.47,[6]],[22.1,"low",0.2548,0.2841,0.112,0.2548,0.2222,0.1426,0.7036,22.78,21.21,0.1801,0.2475,15.53,13.97,[6]],[24.6,"low",0.2809,0.3122,0.1431,0.2809,0.2443,0.1542,0.7073,23.17,20.86,0.1815,0.2517,15.53,14.47,[6]],[27.1,"low",0.3065,0.3396,0.1737,0.3065,0.2664,0.165,0.7109,23.57,20.52,0.1829,0.2559,15.53,14.97,[6]],[29.5,"low",0.3318,0.3663,0.2038,0.3318,0.2885,0.1751,0.7143,23.96,20.19,0.1842,0.2601,15.53,15.47,[6]],[31.8,"low",0.3566,0.3924,0.2333,0.3566,0.3105,0.1844,0.7177,24.35,19.87,0.1856,0.2642,15.53,15.97,[6]],[34.2,"low",0.381,0.4179,0.2625,0.381,0.3326,0.1929,0.7211,24.75,19.56,0.1869,0.2684,15.53,16.47,[6]],[36.4,"medium",0.4051,0.4429,0.2911,0.4051,0.3547,0.2007,0.7243,25.14,19.26,0.1882,0.2726,15.53,16.97,[]],[38.7,"medium",0.4288,0.4673,0.3194,0.4288,0.3768,0.2079,0.7275,25.53,18.96,0.1896,0.2768,15.53,17.47,[]],[40.9,"medium",0.4521,0.4911,0.3472,0.4521,0.3989,0.2143,0.7306,25.93,18.68,0.1909,0.281,15.53,17.97,[]],[43.1,"medium",0.4751,0.5145,0.3746,0.4751,0.4209,0.2201,0.7336,26.32,18.41,0.1921,0.2852,15.53,18.47,[]],[45.2,"medium",0.4978,0.5373,0.4016,0.4978,0.443,0.2253,0.7366,26.71,18.14,0.1934,0.2894,15.53,18.97,[]],[47.3,"medium",0.5201,0.5596,0.4282,0.5201,0.4651,0.2299,0.7395,27.11,17.88,0.1947,0.2936,15.53,19.47,[]],[49.4,"medium",0.5421,0.5815,0.4544,0.5421,0.4872,0.2339,0.7423,27.5,17.63,0.1959,0.2978,15.53,19.97,[]],[51.5,"medium",0.5638,0.6029,0.4803,0.5638,0.5092,0.2373,0.7451,27.89,17.38,0.1972,0.302,15.53,20.47,[]],[53.5,"medium",0.5852,0.6238,0.5058,0.5852,0.5313,0.2402,0.7479,28.29,17.15,0.1984,0.3062,15.53,20.97,[]],[55.5,"medium",0.6064,0.6444,0.5309,0.6064,0.5534,0.2426,0.7505,28.68,16.91,0.1997,0.3104,15.53,21.47,[]],[57.5,"medium",0.6272,0.6645,0.5558,0.6272,0.5755,0.2445,0.7531,29.08,16.69,0.2009,0.3146,15.53,21.97,[]],[59.4,"medium",0.6477,0.6842,0.5803,0.6477,0.5975,0.2459,0.7557,29.47,16.47,0.2021,0.3188,15.53,22.47,[]],[61.3,"medium",0.668,0.7035,0.6044,0.668,0.6196,0.2469,0.7582,29.87,16.26,0.2033,0.323,15.53,22.97,[]],[63.2,"medium",0.6881,0.7224,0.6283,0.6881,0.6417,0.2474,0.7607,30.26,16.05,0.2045,0.3272,15.53,23.47,[]],[65.1,"critical",0.7078,0.741,0.6519,0.7078,0.6638,0.2476,0.7631,30.65,15.84,0.2057,0.3314,15.53,23.97,[]],[66.9,"critical",0.7274,0.7592,0.6751,0.7274,0.6858,0.2473,0.7655,31.05,15.65,0.2069,0.3356,15.53,24.47,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,10.47,39.4,0.136,0.1332,15.22,-0.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,10.82,38.13,0.138,0.1377,15.22,0.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,11.18,36.94,0.14,0.1421,15.22,0.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,11.53,35.82,0.142,0.1466,15.22,1.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,11.89,34.77,0.144,0.151,15.22,1.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,12.24,33.78,0.1459,0.1554,15.22,2.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,12.6,32.84,0.1477,0.1599,15.22,2.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,12.95,31.95,0.1496,0.1643,15.22,3.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,13.31,31.11,0.1514,0.1688,15.22,3.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,13.67,30.31,0.1532,0.1732,15.22,4.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,14.02,29.55,0.155,0.1776,15.22,4.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,14.38,28.83,0.1567,0.1821,15.22,5.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,14.74,28.15,0.1584,0.1865,15.22,5.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,15.09,27.49,0.1601,0.191,15.22,6.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,15.45,26.87,0.1618,0.1954,15.22,6.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,15.81,26.27,0.1635,0.1999,15.22,7.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,16.17,25.7,0.1651,0.2043,15.22,7.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6653,16.52,25.15,0.1667,0.2087,15.22,8.28,[6,7]],[1.8,"low",0.0233,0.0267,0.0,0.0233,0.0158,0.0156,0.6701,16.88,24.63,0.1683,0.2132,15.22,8.78,[6]],[4.3,"low",0.0553,0.0632,0.0,0.0553,0.0392,0.0366,0.6749,17.24,24.12,0.1699,0.2176,15.22,9.28,[6]],[6.8,"low",0.0866,0.0986,0.0,0.0866,0.0625,0.0565,0.6795,17.6,23.64,0.1715,0.2221,15.22,9.78,[6]],[9.2,"low",0.1174,0.1331,0.0,0.1174,0.0859,0.0754,0.684,17.95,23.18,0.173,0.2265,15.22,10.28,[6]],[11.5,"low",0.1475,0.1667,0.0,0.1475,0.1093,0.0932,0.6884,18.31,22.73,0.1746,0.2309,15.22,10.78,[6]],[14.1,"low",0.1771,0.1994,0.0194,0.1771,0.1327,0.1101,0.6926,18.67,22.3,0.1761,0.2354,15.22,11.28,[6]],[16.9,"low",0.2061,0.2312,0.054,0.2061,0.156,0.1261,0.6968,19.03,21.89,0.1776,0.2398,15.22,11.78,[6]],[19.6,"low",0.2346,0.2622,0.0879,0.2346,0.1794,0.1411,0.7008,19.39,21.49,0.1791,0.2443,15.22,12.28,[6]],[22.3,"low",0.2625,0.2925,0.1212,0.2625,0.2028,0.1552,0.7047,19.75,21.11,0.1806,0.2487,15.22,12.78,[6]],[24.9,"low",0.29,0.3219,0.154,0.29,0.2262,0.1684,0.7086,20.1,20.74,0.182,0.2531,15.22,13.28,[6]],[27.5,"low",0.317,0.3506,0.1861,0.317,0.2495,0.1808,0.7123,20.46,20.38,0.1835,0.2576,15.22,13.78,[6]],[30.1,"low",0.3435,0.3787,0.2177,0.3435,0.2729,0.1923,0.7159,20.82,20.04,0.1849,0.262,15.22,14.28,[6]],[32.6,"low",0.3696,0.406,0.2488,0.3696,0.2963,0.2029,0.7195,21.18,19.7,0.1863,0.2665,15.22,14.78,[6]],[35.0,"medium",0.3952,0.4327,0.2794,0.3952,0.3197,0.2128,0.723,21.54,19.38,0.1877,0.2709,15.22,15.28,[]],[37.4,"medium",0.4205,0.4587,0.3095,0.4205,0.343,0.2219,0.7264,21.9,19.07,0.1891,0.2754,15.22,15.78,[]],[39.8,"medium",0.4453,0.4842,0.339,0.4453,0.3664,0.2302,0.7297,22.26,18.76,0.1905,0.2798,15.22,16.28,[]],[42.1,"medium",0.4698,0.509,0.3682,0.4698,0.3898,0.2378,0.7329,22.62,18.47,0.1918,0.2842,15.22,16.78,[]],[44.4,"medium",0.4938,0.5333,0.3968,0.4938,0.4132,0.2447,0.7361,22.98,18.19,0.1932,0.2887,15.22,17.28,[]],[46.7,"medium",0.5175,0.557,0.4251,0.5175,0.4365,0.2509,0.7392,23.34,17.91,0.1945,0.2931,15.22,17.78,[]],[48.9,"medium",0.5408,0.5802,0.4529,0.5408,0.4599,0.2564,0.7422,23.7,17.64,0.1959,0.2976,15.22,18.28,[]],[51.1,"medium",0.5638,0.6029,0.4803,0.5638,0.4833,0.2612,0.7451,24.06,17.38,0.1972,0.302,15.22,18.78,[]],[53.2,"medium",0.5865,0.6251,0.5073,0.5865,0.5067,0.2655,0.748,24.42,17.13,0.1985,0.3064,15.22,19.28,[]],[55.3,"medium",0.6088,0.6468,0.5339,0.6088,0.53,0.2691,0.7508,24.78,16.89,0.1998,0.3109,15.22,19.78,[]],[57.4,"medium",0.6308,0.668,0.5601,0.6308,0.5534,0.2722,0.7536,25.14,16.65,0.2011,0.3153,15.22,20.28,[]],[59.5,"medium",0.6525,0.6888,0.586,0.6525,0.5768,0.2747,0.7563,25.5,16.42,0.2024,0.3198,15.22,20.78,[]],[61.5,"medium",0.674,0.7091,0.6115,0.674,0.6002,0.2766,0.7589,25.86,16.19,0.2036,0.3242,15.22,21.28,[]],[63.5,"medium",0.6951,0.729,0.6366,0.6951,0.6235,0.2781,0.7615,26.22,15.97,0.2049,0.3286,15.22,21.78,[]],[65.5,"critical",0.7159,0.7485,0.6615,0.7159,0.6469,0.2791,0.7641,26.58,15.76,0.2062,0.3331,15.22,22.28,[]],[67.4,"critical",0.7365,0.7676,0.686,0.7365,0.6703,0.2796,0.7666,26.94,15.55,0.2074,0.3375,15.22,22.78,[]],[69.4,"critical",0.7567,0.7863,0.7101,0.7567,0.6937,0.2797,0.769,27.3,15.35,0.2086,0.342,15.22,23.28,[]],[71.3,"critical",0.7768,0.8047,0.734,0.7768,0.717,0.2793,0.7714,27.66,15.16,0.2099,0.3464,15.22,23.78,[]],[73.1,"critical",0.7965,0.8226,0.7576,0.7965,0.7404,0.2786,0.7737,28.02,14.96,0.2111,0.3509,15.22,24.28,[]],[75.0,"critical",0.8161,0.8403,0.7808,0.8161,0.7638,0.2775,0.776,28.38,14.78,0.2123,0.3553,15.22,24.78,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,9.61,37.33,0.1394,0.1406,14.93,0.07,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,9.94,36.13,0.1415,0.1453,14.93,0.57,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,10.27,35.0,0.1435,0.15,14.93,1.07,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,10.59,33.94,0.1455,0.1547,14.93,1.57,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,10.92,32.94,0.1475,0.1594,14.93,2.07,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,11.24,32.0,0.1495,0.1641,14.93,2.57,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,11.57,31.11,0.1514,0.1688,14.93,3.07,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,11.9,30.27,0.1533,0.1735,14.93,3.57,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,12.23,29.47,0.1552,0.1781,14.93,4.07,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,12.55,28.72,0.157,0.1828,14.93,4.57,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,12.88,28.0,0.1588,0.1875,14.93,5.07,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,13.21,27.31,0.1606,0.1922,14.93,5.57,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,13.54,26.66,0.1624,0.1969,14.93,6.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,13.86,26.04,0.1641,0.2016,14.93,6.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,14.19,25.45,0.1658,0.2063,14.93,7.07,[6,7]],[0.4,"low",0.007,0.0081,0.0,0.007,0.0,0.0049,0.6677,14.52,24.89,0.1675,0.211,14.93,7.57,[6]],[2.6,"low",0.0412,0.0471,0.0,0.0412,0.0033,0.0284,0.6728,14.85,24.35,0.1692,0.2156,14.93,8.07,[6]],[5.2,"low",0.0745,0.085,0.0,0.0745,0.028,0.0507,0.6777,15.18,23.83,0.1709,0.2203,14.93,8.57,[6]],[7.8,"low",0.1072,0.1217,0.0,0.1072,0.0527,0.0719,0.6825,15.5,23.33,0.1725,0.225,14.93,9.07,[6]],[10.3,"low",0.1392,0.1575,0.0,0.1392,0.0774,0.0921,0.6872,15.83,22.86,0.1742,0.2297,14.93,9.57,[6]],[12.9,"low",0.1706,0.1922,0.0116,0.1706,0.102,0.1112,0.6917,16.16,22.4,0.1758,0.2344,14.93,10.07,[6]],[15.9,"low",0.2013,0.226,0.0483,0.2013,0.1267,0.1292,0.6961,16.49,21.96,0.1773,0.2391,14.93,10.57,[6]],[18.8,"low",0.2314,0.2588,0.0842,0.2314,0.1514,0.1463,0.7003,16.82,21.54,0.1789,0.2438,14.93,11.07,[6]],[21.6,"low",0.261,0.2908,0.1194,0.261,0.176,0.1623,0.7045,17.15,21.13,0.1805,0.2485,14.93,11.57,[6]],[24.4,"low",0.29,0.3219,0.154,0.29,0.2007,0.1774,0.7086,17.48,20.74,0.182,0.2531,14.93,12.07,[6]],[27.1,"low",0.3185,0.3522,0.1879,0.3185,0.2254,0.1916,0.7125,17.81,20.36,0.1835,0.2578,14.93,12.57,[6]],[29.8,"low",0.3464,0.3817,0.2212,0.3464,0.2501,0.2048,0.7163,18.14,20.0,0.185,0.2625,14.93,13.07,[6]],[32.5,"low",0.3739,0.4105,0.254,0.3739,0.2747,0.2172,0.7201,18.47,19.65,0.1865,0.2672,14.93,13.57,[6]],[35.0,"medium",0.4009,0.4385,0.2861,0.4009,0.2994,0.2286,0.7237,18.79,19.31,0.188,0.2719,14.93,14.07,[]],[37.6,"medium",0.4274,0.4659,0.3177,0.4274,0.3241,0.2392,0.7273,19.12,18.98,0.1895,0.2766,14.93,14.57,[]],[40.1,"medium",0.4535,0.4925,0.3488,0.4535,0.3488,0.249,0.7308,19.45,18.67,0.1909,0.2813,14.93,15.07,[]],[42.5,"medium",0.4792,0.5185,0.3794,0.4792,0.3734,0.258,0.7341,19.78,18.36,0.1924,0.286,14.93,15.57,[]],[45.0,"medium",0.5044,0.5439,0.4094,0.5044,0.3981,0.2662,0.7375,20.11,18.06,0.1938,0.2906,14.93,16.07,[]],[47.3,"medium",0.5292,0.5687,0.439,0.5292,0.4228,0.2736,0.7407,20.44,17.78,0.1952,0.2953,14.93,16.57,[]],[49.7,"medium",0.5537,0.5929,0.4682,0.5537,0.4474,0.2803,0.7438,20.77,17.5,0.1966,0.3,14.93,17.07,[]],[52.0,"medium",0.5777,0.6165,0.4968,0.5777,0.4721,0.2863,0.7469,21.1,17.23,0.198,0.3047,14.93,17.57,[]],[54.2,"medium",0.6014,0.6396,0.5251,0.6014,0.4968,0.2915,0.7499,21.43,16.97,0.1994,0.3094,14.93,18.07,[]],[56.5,"medium",0.6248,0.6621,0.5529,0.6248,0.5215,0.2961,0.7528,21.76,16.72,0.2007,0.3141,14.93,18.57,[]],[58.7,"medium",0.6477,0.6842,0.5803,0.6477,0.5461,0.3001,0.7557,22.09,16.47,0.2021,0.3188,14.93,19.07,[]],[60.8,"medium",0.6704,0.7057,0.6073,0.6704,0.5708,0.3035,0.7585,22.43,16.23,0.2034,0.3235,14.93,19.57,[]],[62.9,"medium",0.6927,0.7268,0.6339,0.6927,0.5955,0.3062,0.7613,22.76,16.0,0.2048,0.3282,14.93,20.07,[]],[65.0,"critical",0.7147,0.7474,0.6601,0.7147,0.6202,0.3084,0.7639,23.09,15.77,0.2061,0.3328,14.93,20.57,[]],[67.1,"critical",0.7365,0.7676,0.686,0.7365,0.6448,0.31,0.7666,23.42,15.55,0.2074,0.3375,14.93,21.07,[]],[69.2,"critical",0.7579,0.7874,0.7115,0.7579,0.6695,0.3111,0.7691,23.75,15.34,0.2087,0.3422,14.93,21.57,[]],[71.2,"critical",0.779,0.8067,0.7366,0.779,0.6942,0.3117,0.7716,24.08,15.13,0.21,0.3469,14.93,22.07,[]],[73.1,"critical",0.7998,0.8256,0.7615,0.7998,0.7189,0.3118,0.7741,24.41,14.93,0.2113,0.3516,14.93,22.57,[]],[75.1,"critical",0.8204,0.8441,0.7859,0.8204,0.7435,0.3115,0.7765,24.74,14.74,0.2126,0.3563,14.93,23.07,[]],[77.0,"critical",0.8407,0.8623,0.8101,0.8407,0.7682,0.3107,0.7789,25.07,14.54,0.2138,0.361,14.93,23.57,[]],[78.9,"critical",0.8607,0.88,0.834,0.8607,0.7929,0.3095,0.7812,25.4,14.36,0.2151,0.3657,14.93,24.07,[]],[80.8,"critical",0.8804,0.8975,0.8575,0.8804,0.8175,0.308,0.7835,25.73,14.18,0.2163,0.3703,14.93,24.57,[]],[82.7,"critical",0.9,0.9145,0.8808,0.9,0.8422,0.306,0.7857,26.07,14.0,0.2176,0.375,14.93,25.07,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,8.87,35.46,0.1427,0.148,14.67,0.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,9.17,34.32,0.1448,0.153,14.67,0.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,9.47,33.25,0.1469,0.1579,14.67,1.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,9.77,32.24,0.149,0.1628,14.67,1.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,10.07,31.29,0.151,0.1678,14.67,2.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,10.37,30.4,0.153,0.1727,14.67,2.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,10.67,29.55,0.155,0.1776,14.67,3.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,10.98,28.75,0.1569,0.1826,14.67,3.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,11.28,28.0,0.1588,0.1875,14.67,4.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,11.58,27.28,0.1607,0.1925,14.67,4.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,11.88,26.6,0.1626,0.1974,14.67,5.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,12.18,25.95,0.1644,0.2023,14.67,5.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,12.49,25.33,0.1662,0.2073,14.67,6.33,[6,7]],[1.0,"low",0.0161,0.0185,0.0,0.0161,0.0,0.0115,0.6691,12.79,24.74,0.168,0.2122,14.67,6.83,[6]],[3.1,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0366,0.6744,13.09,24.18,0.1698,0.2171,14.67,7.33,[6]],[5.5,"low",0.0866,0.0986,0.0,0.0866,0.0121,0.0606,0.6795,13.39,23.64,0.1715,0.2221,14.67,7.83,[6]],[8.2,"low",0.1208,0.1369,0.0,0.1208,0.0381,0.0833,0.6845,13.7,23.13,0.1732,0.227,14.67,8.33,[6]],[10.9,"low",0.1541,0.174,0.0,0.1541,0.0641,0.1049,0.6893,14.0,22.64,0.1749,0.2319,14.67,8.83,[6]],[13.9,"low",0.1868,0.2101,0.031,0.1868,0.09,0.1254,0.694,14.3,22.16,0.1766,0.2369,14.67,9.33,[6]],[17.0,"low",0.2188,0.2451,0.0691,0.2188,0.116,0.1447,0.6986,14.61,21.71,0.1783,0.2418,14.67,9.83,[6]],[20.0,"low",0.2502,0.2791,0.1065,0.2502,0.142,0.1631,0.703,14.91,21.28,0.1799,0.2467,14.67,10.33,[6]],[23.0,"low",0.2809,0.3122,0.1431,0.2809,0.1679,0.1803,0.7073,15.21,20.86,0.1815,0.2517,14.67,10.83,[6]],[25.9,"low",0.311,0.3443,0.179,0.311,0.1939,0.1966,0.7115,15.52,20.46,0.1831,0.2566,14.67,11.33,[6]],[28.7,"low",0.3406,0.3756,0.2143,0.3406,0.2199,0.2118,0.7155,15.82,20.07,0.1847,0.2615,14.67,11.83,[6]],[31.5,"low",0.3696,0.406,0.2488,0.3696,0.2459,0.2261,0.7195,16.12,19.7,0.1863,0.2665,14.67,12.33,[6]],[34.3,"low",0.3981,0.4356,0.2828,0.3981,0.2718,0.2395,0.7234,16.43,19.34,0.1879,0.2714,14.67,12.83,[6]],[37.0,"medium",0.426,0.4644,0.3161,0.426,0.2978,0.2519,0.7271,16.73,19.0,0.1894,0.2763,14.67,13.33,[]],[39.6,"medium",0.4535,0.4925,0.3488,0.4535,0.3238,0.2634,0.7308,17.03,18.67,0.1909,0.2813,14.67,13.83,[]],[42.2,"medium",0.4805,0.5199,0.381,0.4805,0.3497,0.274,0.7343,17.34,18.34,0.1924,0.2862,14.67,14.33,[]],[44.8,"medium",0.507,0.5465,0.4126,0.507,0.3757,0.2838,0.7378,17.64,18.03,0.1939,0.2911,14.67,14.83,[]],[47.3,"medium",0.5331,0.5725,0.4437,0.5331,0.4017,0.2927,0.7412,17.95,17.73,0.1954,0.2961,14.67,15.33,[]],[49.7,"medium",0.5588,0.5979,0.4742,0.5588,0.4277,0.3009,0.7445,18.25,17.44,0.1969,0.301,14.67,15.83,[]],[52.2,"medium",0.584,0.6226,0.5043,0.584,0.4536,0.3082,0.7477,18.55,17.16,0.1984,0.3059,14.67,16.33,[]],[54.5,"medium",0.6088,0.6468,0.5339,0.6088,0.4796,0.3148,0.7508,18.86,16.89,0.1998,0.3109,14.67,16.83,[]],[56.9,"medium",0.6333,0.6703,0.563,0.6333,0.5056,0.3206,0.7539,19.16,16.62,0.2012,0.3158,14.67,17.33,[]],[59.2,"medium",0.6573,0.6933,0.5917,0.6573,0.5315,0.3257,0.7569,19.47,16.37,0.2027,0.3208,14.67,17.83,[]],[61.5,"medium",0.681,0.7158,0.6199,0.681,0.5575,0.3301,0.7598,19.77,16.12,0.2041,0.3257,14.67,18.33,[]],[63.7,"medium",0.7044,0.7377,0.6477,0.7044,0.5835,0.3339,0.7627,20.08,15.88,0.2055,0.3306,14.67,18.83,[]],[65.9,"critical",0.7274,0.7592,0.6751,0.7274,0.6095,0.337,0.7655,20.38,15.65,0.2069,0.3356,14.67,19.33,[]],[68.1,"critical",0.75,0.7801,0.7021,0.75,0.6354,0.3395,0.7682,20.69,15.42,0.2082,0.3405,14.67,19.83,[]],[70.2,"critical",0.7723,0.8006,0.7287,0.7723,0.6614,0.3414,0.7709,20.99,15.2,0.2096,0.3454,14.67,20.33,[]],[72.3,"critical",0.7944,0.8207,0.755,0.7944,0.6874,0.3427,0.7735,21.3,14.98,0.2109,0.3504,14.67,20.83,[]],[74.4,"critical",0.8161,0.8403,0.7808,0.8161,0.7133,0.3435,0.776,21.6,14.78,0.2123,0.3553,14.67,21.33,[]],[76.4,"critical",0.8375,0.8594,0.8063,0.8375,0.7393,0.3438,0.7785,21.91,14.57,0.2136,0.3602,14.67,21.83,[]],[78.5,"critical",0.8586,0.8782,0.8315,0.8586,0.7653,0.3435,0.781,22.21,14.38,0.2149,0.3652,14.67,22.33,[]],[80.5,"critical",0.8794,0.8966,0.8563,0.8794,0.7913,0.3428,0.7833,22.52,14.19,0.2163,0.3701,14.67,22.83,[]],[82.4,"critical",0.9,0.9145,0.8808,0.9,0.8172,0.3417,0.7857,22.82,14.0,0.2176,0.375,14.67,23.33,[]],[84.4,"critical",0.9203,0.9321,0.905,0.9203,0.8432,0.3401,0.788,23.13,13.82,0.2189,0.38,14.67,23.83,[]],[86.3,"critical",0.9403,0.9494,0.9288,0.9403,0.8692,0.3381,0.7902,23.43,13.64,0.2201,0.3849,14.67,24.33,[]],[88.2,"critical",0.9601,0.9663,0.9524,0.9601,0.8952,0.3358,0.7924,23.74,13.47,0.2214,0.3898,14.67,24.83,[]],[90.1,"critical",0.9796,0.9828,0.9757,0.9796,0.9211,0.3331,0.7946,24.05,13.3,0.2227,0.3948,14.67,25.33,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,8.69,35.01,0.1435,0.15,14.6,0.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,8.98,33.88,0.1457,0.155,14.6,0.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,9.28,32.82,0.1478,0.16,14.6,1.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,9.57,31.83,0.1498,0.165,14.6,1.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,9.87,30.89,0.1519,0.17,14.6,2.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,10.16,30.01,0.1539,0.175,14.6,2.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,10.46,29.17,0.1559,0.18,14.6,3.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,10.76,28.39,0.1578,0.185,14.6,3.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,11.05,27.64,0.1598,0.19,14.6,4.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,11.35,26.93,0.1617,0.195,14.6,4.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,11.64,26.26,0.1635,0.2,14.6,5.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,11.94,25.62,0.1654,0.2049,14.6,5.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,12.24,25.01,0.1672,0.2099,14.6,6.4,[6,7]],[2.2,"low",0.0361,0.0414,0.0,0.0361,0.0,0.0259,0.672,12.53,24.42,0.169,0.2149,14.6,6.9,[6]],[4.4,"low",0.0718,0.0819,0.0,0.0718,0.0,0.0508,0.6773,12.83,23.87,0.1708,0.2199,14.6,7.4,[6]],[7.0,"low",0.1067,0.1212,0.0,0.1067,0.0209,0.0746,0.6824,13.12,23.34,0.1725,0.2249,14.6,7.9,[6]],[9.7,"low",0.1408,0.1592,0.0,0.1408,0.0472,0.0971,0.6874,13.42,22.83,0.1742,0.2299,14.6,8.4,[6]],[12.5,"low",0.1742,0.1962,0.016,0.1742,0.0735,0.1185,0.6922,13.72,22.35,0.1759,0.2349,14.6,8.9,[6]],[15.7,"low",0.2068,0.2321,0.0549,0.2068,0.0998,0.1388,0.6969,14.01,21.88,0.1776,0.2399,14.6,9.4,[6]],[18.8,"low",0.2388,0.2669,0.093,0.2388,0.1261,0.158,0.7014,14.31,21.43,0.1793,0.2449,14.6,9.9,[6]],[21.8,"low",0.2702,0.3007,0.1304,0.2702,0.1524,0.1761,0.7058,14.61,21.01,0.181,0.2499,14.6,10.4,[6]],[24.8,"low",0.3009,0.3336,0.167,0.3009,0.1787,0.1932,0.7101,14.91,20.59,0.1826,0.2549,14.6,10.9,[6]],[27.7,"low",0.3311,0.3655,0.2029,0.3311,0.205,0.2093,0.7142,15.2,20.2,0.1842,0.2599,14.6,11.4,[6]],[30.5,"low",0.3606,0.3966,0.2381,0.3606,0.2314,0.2243,0.7183,15.5,19.82,0.1858,0.2649,14.6,11.9,[6]],[33.3,"low",0.3896,0.4269,0.2727,0.3896,0.2577,0.2384,0.7222,15.8,19.45,0.1874,0.2699,14.6,12.4,[6]],[36.1,"medium",0.4181,0.4563,0.3066,0.4181,0.284,0.2515,0.726,16.1,19.1,0.189,0.2749,14.6,12.9,[]],[38.8,"medium",0.4461,0.485,0.34,0.4461,0.3103,0.2637,0.7298,16.39,18.75,0.1905,0.2799,14.6,13.4,[]],[41.4,"medium",0.4735,0.5129,0.3727,0.4735,0.3366,0.275,0.7334,16.69,18.43,0.192,0.2849,14.6,13.9,[]],[44.0,"medium",0.5005,0.54,0.4049,0.5005,0.3629,0.2854,0.7369,16.99,18.11,0.1936,0.2899,14.6,14.4,[]],[46.6,"medium",0.5271,0.5665,0.4365,0.5271,0.3892,0.295,0.7404,17.29,17.8,0.1951,0.2949,14.6,14.9,[]],[49.1,"medium",0.5532,0.5924,0.4675,0.5532,0.4155,0.3037,0.7438,17.58,17.5,0.1966,0.2999,14.6,15.4,[]],[51.5,"medium",0.5788,0.6176,0.4981,0.5788,0.4418,0.3116,0.747,17.88,17.22,0.1981,0.3049,14.6,15.9,[]],[54.0,"medium",0.604,0.6421,0.5282,0.604,0.4681,0.3188,0.7502,18.18,16.94,0.1995,0.3099,14.6,16.4,[]],[56.4,"medium",0.6289,0.6661,0.5578,0.6289,0.4945,0.3251,0.7534,18.48,16.67,0.201,0.3149,14.6,16.9,[]],[58.7,"medium",0.6533,0.6895,0.5869,0.6533,0.5208,0.3307,0.7564,18.78,16.41,0.2024,0.3199,14.6,17.4,[]],[61.0,"medium",0.6774,0.7123,0.6156,0.6774,0.5471,0.3356,0.7594,19.08,16.16,0.2038,0.3249,14.6,17.9,[]],[63.3,"medium",0.7011,0.7346,0.6438,0.7011,0.5734,0.3398,0.7623,19.37,15.91,0.2053,0.3299,14.6,18.4,[]],[65.5,"critical",0.7244,0.7564,0.6716,0.7244,0.5997,0.3434,0.7651,19.67,15.68,0.2067,0.3349,14.6,18.9,[]],[67.7,"critical",0.7474,0.7777,0.699,0.7474,0.626,0.3463,0.7679,19.97,15.44,0.2081,0.3399,14.6,19.4,[]],[69.9,"critical",0.7701,0.7985,0.726,0.7701,0.6523,0.3486,0.7706,20.27,15.22,0.2095,0.3449,14.6,19.9,[]],[72.0,"critical",0.7924,0.8189,0.7526,0.7924,0.6786,0.3502,0.7732,20.57,15.0,0.2108,0.3499,14.6,20.4,[]],[74.1,"critical",0.8144,0.8388,0.7788,0.8144,0.7049,0.3514,0.7758,20.87,14.79,0.2122,0.3549,14.6,20.9,[]],[76.2,"critical",0.8361,0.8582,0.8047,0.8361,0.7312,0.3519,0.7784,21.17,14.59,0.2135,0.3599,14.6,21.4,[]],[78.3,"critical",0.8575,0.8772,0.8302,0.8575,0.7575,0.352,0.7808,21.47,14.39,0.2149,0.3649,14.6,21.9,[]],[80.3,"critical",0.8786,0.8959,0.8554,0.8786,0.7839,0.3515,0.7833,21.77,14.19,0.2162,0.3699,14.6,22.4,[]],[82.3,"critical",0.8995,0.9141,0.8802,0.8995,0.8102,0.3506,0.7856,22.06,14.0,0.2175,0.3749,14.6,22.9,[]],[84.3,"critical",0.92,0.9319,0.9047,0.92,0.8365,0.3493,0.788,22.36,13.82,0.2188,0.3799,14.6,23.4,[]],[86.2,"critical",0.9403,0.9494,0.9289,0.9403,0.8628,0.3475,0.7902,22.66,13.64,0.2201,0.3849,14.6,23.9,[]],[88.1,"critical",0.9603,0.9665,0.9527,0.9603,0.8891,0.3454,0.7925,22.96,13.46,0.2214,0.3899,14.6,24.4,[]],[90.0,"critical",0.9801,0.9833,0.9763,0.9801,0.9154,0.3428,0.7946,23.26,13.29,0.2227,0.3949,14.6,24.9,[]],[91.9,"critical",0.9996,0.9997,0.9995,0.9996,0.9417,0.3399,0.7968,23.56,13.13,0.224,0.3999,14.6,25.4,[]]]],"Inert":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,0.0,70.93,0.1041,0.074,128.04,-113.04,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,0.0,68.64,0.1057,0.0765,128.04,-112.54,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,0.0,66.49,0.1072,0.079,128.04,-112.04,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,0.0,64.48,0.1088,0.0814,128.04,-111.54,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,0.0,62.58,0.1102,0.0839,128.04,-111.04,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,0.0,60.8,0.1117,0.0864,128.04,-110.54,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,0.0,59.11,0.1131,0.0888,128.04,-110.04,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,0.0,57.51,0.1145,0.0913,128.04,-109.54,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,0.0,56.0,0.1159,0.0938,128.04,-109.04,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,0.0,54.56,0.1173,0.0962,128.04,-108.54,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,0.0,53.2,0.1187,0.0987,128.04,-108.04,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,0.0,51.9,0.12,0.1012,128.04,-107.54,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,0.0,50.66,0.1213,0.1036,128.04,-107.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,0.0,49.48,0.1226,0.1061,128.04,-106.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,0.0,48.36,0.1239,0.1086,128.04,-106.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,0.0,47.29,0.1252,0.111,128.04,-105.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,0.0,46.26,0.1265,0.1135,128.04,-105.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,0.0,45.27,0.1277,0.116,128.04,-104.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,0.0,44.33,0.1289,0.1184,128.04,-104.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,0.0,43.43,0.1301,0.1209,128.04,-103.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,0.0,42.56,0.1313,0.1234,128.04,-103.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,0.0,41.72,0.1325,0.1258,128.04,-102.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,0.0,40.92,0.1337,0.1283,128.04,-102.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,0.0,40.15,0.1349,0.1308,128.04,-101.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,0.0,39.4,0.136,0.1332,128.04,-101.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,0.0,38.69,0.1371,0.1357,128.04,-100.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,0.0,38.0,0.1383,0.1382,128.04,-100.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,0.0,37.33,0.1394,0.1406,128.04,-99.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,0.0,36.69,0.1405,0.1431,128.04,-99.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,0.0,36.06,0.1416,0.1456,128.04,-98.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,0.0,35.46,0.1427,0.148,128.04,-98.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,0.0,34.88,0.1437,0.1505,128.04,-97.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,0.0,34.32,0.1448,0.153,128.04,-97.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,0.0,33.77,0.1459,0.1554,128.04,-96.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,0.0,33.25,0.1469,0.1579,128.04,-96.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,0.0,32.74,0.1479,0.1604,128.04,-95.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,0.0,32.24,0.149,0.1628,128.04,-95.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.609,0.0,31.76,0.15,0.1653,128.04,-94.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,0.0,31.29,0.151,0.1678,128.04,-94.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,0.0,30.84,0.152,0.1702,128.04,-93.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,0.0,30.4,0.153,0.1727,128.04,-93.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6233,0.0,29.97,0.154,0.1752,128.04,-92.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,0.0,29.55,0.155,0.1776,128.04,-92.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6301,0.0,29.15,0.1559,0.1801,128.04,-91.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,0.0,28.75,0.1569,0.1826,128.04,-91.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,0.0,28.37,0.1579,0.185,128.04,-90.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,0.0,28.0,0.1588,0.1875,128.04,-90.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,0.0,27.63,0.1598,0.19,128.04,-89.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,0.0,27.28,0.1607,0.1925,128.04,-89.04,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6491,0.0,26.93,0.1616,0.1949,128.04,-88.54,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,0.0,26.6,0.1626,0.1974,128.04,-88.04,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,0.0,64.48,0.1088,0.0814,123.84,-108.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,0.0,62.4,0.1104,0.0841,123.84,-108.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,0.0,60.45,0.112,0.0868,123.84,-107.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,0.0,58.62,0.1136,0.0896,123.84,-107.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,0.0,56.89,0.1151,0.0923,123.84,-106.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,0.0,55.27,0.1166,0.095,123.84,-106.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,0.0,53.73,0.1181,0.0977,123.84,-105.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,0.0,52.28,0.1196,0.1004,123.84,-105.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,0.0,50.9,0.1211,0.1031,123.84,-104.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,0.0,49.6,0.1225,0.1058,123.84,-104.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,0.0,48.36,0.1239,0.1086,123.84,-103.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,0.0,47.18,0.1253,0.1113,123.84,-103.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,0.0,46.06,0.1267,0.114,123.84,-102.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,0.0,44.99,0.1281,0.1167,123.84,-102.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,0.0,43.96,0.1294,0.1194,123.84,-101.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,0.0,42.99,0.1307,0.1221,123.84,-101.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,0.0,42.05,0.132,0.1248,123.84,-100.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,0.0,41.16,0.1333,0.1276,123.84,-100.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,0.0,40.3,0.1346,0.1303,123.84,-99.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,0.0,39.48,0.1359,0.133,123.84,-99.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,0.0,38.69,0.1371,0.1357,123.84,-98.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,0.0,37.93,0.1384,0.1384,123.84,-98.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,0.0,37.2,0.1396,0.1411,123.84,-97.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,0.0,36.5,0.1408,0.1438,123.84,-97.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,0.0,35.82,0.142,0.1466,123.84,-96.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,0.0,35.17,0.1432,0.1493,123.84,-96.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,0.0,34.54,0.1444,0.152,123.84,-95.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,0.0,33.94,0.1455,0.1547,123.84,-95.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,0.0,33.35,0.1467,0.1574,123.84,-94.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,0.0,32.79,0.1478,0.1601,123.84,-94.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,0.0,32.24,0.149,0.1628,123.84,-93.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,0.0,31.71,0.1501,0.1656,123.84,-93.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6134,0.0,31.2,0.1512,0.1683,123.84,-92.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6174,0.0,30.7,0.1523,0.171,123.84,-92.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,0.0,30.22,0.1534,0.1737,123.84,-91.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,0.0,29.76,0.1545,0.1764,123.84,-91.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6288,0.0,29.31,0.1556,0.1791,123.84,-90.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6324,0.0,28.87,0.1566,0.1818,123.84,-90.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,0.0,28.45,0.1577,0.1846,123.84,-89.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6395,0.0,28.03,0.1587,0.1873,123.84,-89.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,0.0,27.63,0.1598,0.19,123.84,-88.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6464,0.0,27.24,0.1608,0.1927,123.84,-88.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,0.0,26.87,0.1618,0.1954,123.84,-87.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.653,0.0,26.5,0.1628,0.1981,123.84,-87.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6562,0.0,26.14,0.1639,0.2008,123.84,-86.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,0.0,25.79,0.1649,0.2036,123.84,-86.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,0.0,25.45,0.1658,0.2063,123.84,-85.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6655,0.0,25.12,0.1668,0.209,123.84,-85.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6685,0.0,24.8,0.1678,0.2117,123.84,-84.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6715,0.0,24.49,0.1688,0.2144,123.84,-84.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6744,0.0,24.18,0.1698,0.2171,123.84,-83.84,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,0.0,62.77,0.1101,0.0836,122.68,-107.68,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,0.0,60.74,0.1117,0.0864,122.68,-107.18,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,0.0,58.84,0.1134,0.0892,122.68,-106.68,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,0.0,57.06,0.115,0.092,122.68,-106.18,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,0.0,55.38,0.1165,0.0948,122.68,-105.68,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,0.0,53.8,0.1181,0.0976,122.68,-105.18,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,0.0,52.31,0.1196,0.1004,122.68,-104.68,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,0.0,50.89,0.1211,0.1032,122.68,-104.18,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,0.0,49.55,0.1226,0.1059,122.68,-103.68,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,0.0,48.28,0.124,0.1087,122.68,-103.18,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,0.0,47.08,0.1254,0.1115,122.68,-102.68,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,0.0,45.93,0.1269,0.1143,122.68,-102.18,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,0.0,44.83,0.1283,0.1171,122.68,-101.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,0.0,43.79,0.1296,0.1199,122.68,-101.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,0.0,42.8,0.131,0.1227,122.68,-100.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,0.0,41.85,0.1323,0.1255,122.68,-100.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,0.0,40.94,0.1337,0.1283,122.68,-99.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,0.0,40.06,0.135,0.131,122.68,-99.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,0.0,39.23,0.1363,0.1338,122.68,-98.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,0.0,38.43,0.1376,0.1366,122.68,-98.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,0.0,37.66,0.1388,0.1394,122.68,-97.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,0.0,36.92,0.1401,0.1422,122.68,-97.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,0.0,36.21,0.1413,0.145,122.68,-96.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,0.0,35.53,0.1425,0.1478,122.68,-96.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,0.0,34.87,0.1438,0.1506,122.68,-95.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,0.0,34.24,0.145,0.1533,122.68,-95.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,0.0,33.63,0.1462,0.1561,122.68,-94.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,0.0,33.04,0.1473,0.1589,122.68,-94.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,0.0,32.47,0.1485,0.1617,122.68,-93.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,0.0,31.92,0.1497,0.1645,122.68,-93.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,0.0,31.38,0.1508,0.1673,122.68,-92.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.616,0.0,30.87,0.1519,0.1701,122.68,-92.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.62,0.0,30.37,0.1531,0.1729,122.68,-91.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.624,0.0,29.89,0.1542,0.1756,122.68,-91.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6278,0.0,29.42,0.1553,0.1784,122.68,-90.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6316,0.0,28.97,0.1564,0.1812,122.68,-90.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6353,0.0,28.53,0.1575,0.184,122.68,-89.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6389,0.0,28.1,0.1586,0.1868,122.68,-89.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6425,0.0,27.69,0.1596,0.1896,122.68,-88.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.646,0.0,27.29,0.1607,0.1924,122.68,-88.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6494,0.0,26.9,0.1617,0.1952,122.68,-87.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6528,0.0,26.52,0.1628,0.198,122.68,-87.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6561,0.0,26.15,0.1638,0.2007,122.68,-86.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,0.0,25.79,0.1648,0.2035,122.68,-86.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,0.0,25.45,0.1659,0.2063,122.68,-85.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6657,0.0,25.11,0.1669,0.2091,122.68,-85.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6687,0.0,24.78,0.1679,0.2119,122.68,-84.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6718,0.0,24.45,0.1689,0.2147,122.68,-84.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6747,0.0,24.14,0.1699,0.2175,122.68,-83.68,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6776,0.0,23.84,0.1709,0.2203,122.68,-83.18,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6805,0.0,23.54,0.1718,0.223,122.68,-82.68,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,0.0,59.11,0.1131,0.0888,120.13,-105.13,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,0.0,57.2,0.1148,0.0918,120.13,-104.63,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,0.0,55.41,0.1165,0.0947,120.13,-104.13,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,0.0,53.73,0.1181,0.0977,120.13,-103.63,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,0.0,52.15,0.1197,0.1007,120.13,-103.13,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,0.0,50.66,0.1213,0.1036,120.13,-102.63,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,0.0,49.26,0.1229,0.1066,120.13,-102.13,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,0.0,47.92,0.1244,0.1095,120.13,-101.63,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,0.0,46.66,0.126,0.1125,120.13,-101.13,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,0.0,45.47,0.1274,0.1155,120.13,-100.63,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,0.0,44.33,0.1289,0.1184,120.13,-100.13,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,0.0,43.25,0.1304,0.1214,120.13,-99.63,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,0.0,42.22,0.1318,0.1244,120.13,-99.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,0.0,41.24,0.1332,0.1273,120.13,-98.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,0.0,40.3,0.1346,0.1303,120.13,-98.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,0.0,39.4,0.136,0.1332,120.13,-97.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,0.0,38.55,0.1374,0.1362,120.13,-97.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,0.0,37.73,0.1387,0.1392,120.13,-96.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,0.0,36.94,0.14,0.1421,120.13,-96.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,0.0,36.19,0.1414,0.1451,120.13,-95.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,0.0,35.46,0.1427,0.148,120.13,-95.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,0.0,34.77,0.144,0.151,120.13,-94.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,0.0,34.1,0.1452,0.154,120.13,-94.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,0.0,33.46,0.1465,0.1569,120.13,-93.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,0.0,32.84,0.1477,0.1599,120.13,-93.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,0.0,32.24,0.149,0.1628,120.13,-92.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,0.0,31.66,0.1502,0.1658,120.13,-92.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,0.0,31.11,0.1514,0.1688,120.13,-91.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,0.0,30.57,0.1526,0.1717,120.13,-91.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6226,0.0,30.05,0.1538,0.1747,120.13,-90.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,0.0,29.55,0.155,0.1776,120.13,-90.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6308,0.0,29.07,0.1561,0.1806,120.13,-89.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6347,0.0,28.6,0.1573,0.1836,120.13,-89.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,0.0,28.15,0.1584,0.1865,120.13,-88.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,0.0,27.71,0.1596,0.1895,120.13,-88.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,0.0,27.28,0.1607,0.1925,120.13,-87.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,0.0,26.87,0.1618,0.1954,120.13,-87.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6533,0.0,26.47,0.1629,0.1984,120.13,-86.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,0.0,26.08,0.164,0.2013,120.13,-86.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,0.0,25.7,0.1651,0.2043,120.13,-85.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,0.0,25.33,0.1662,0.2073,120.13,-85.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6669,0.0,24.97,0.1673,0.2102,120.13,-84.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6701,0.0,24.63,0.1683,0.2132,120.13,-84.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6733,0.0,24.29,0.1694,0.2161,120.13,-83.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6764,0.0,23.96,0.1705,0.2191,120.13,-83.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,0.0,23.64,0.1715,0.2221,120.13,-82.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6825,0.0,23.33,0.1725,0.225,120.13,-82.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6855,0.0,23.03,0.1736,0.228,120.13,-81.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6884,0.0,22.73,0.1746,0.2309,120.13,-81.13,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6912,0.0,22.45,0.1756,0.2339,120.13,-80.63,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,0.0,22.16,0.1766,0.2369,120.13,-80.13,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,0.0,54.56,0.1173,0.0962,116.81,-101.81,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,0.0,52.8,0.1191,0.0994,116.81,-101.31,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,0.0,51.15,0.1208,0.1026,116.81,-100.81,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,0.0,49.6,0.1225,0.1058,116.81,-100.31,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,0.0,48.14,0.1242,0.1091,116.81,-99.81,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,0.0,46.77,0.1258,0.1123,116.81,-99.31,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,0.0,45.47,0.1274,0.1155,116.81,-98.81,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,0.0,44.24,0.129,0.1187,116.81,-98.31,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,0.0,43.07,0.1306,0.1219,116.81,-97.81,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,0.0,41.97,0.1322,0.1251,116.81,-97.31,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,0.0,40.92,0.1337,0.1283,116.81,-96.81,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,0.0,39.92,0.1352,0.1315,116.81,-96.31,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,0.0,38.97,0.1367,0.1347,116.81,-95.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,0.0,38.06,0.1382,0.1379,116.81,-95.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,0.0,37.2,0.1396,0.1411,116.81,-94.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,0.0,36.37,0.141,0.1443,116.81,-94.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,0.0,35.58,0.1424,0.1475,116.81,-93.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,0.0,34.83,0.1438,0.1508,116.81,-93.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,0.0,34.1,0.1452,0.154,116.81,-92.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,0.0,33.4,0.1466,0.1572,116.81,-92.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,0.0,32.74,0.1479,0.1604,116.81,-91.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,0.0,32.09,0.1493,0.1636,116.81,-91.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,0.0,31.48,0.1506,0.1668,116.81,-90.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,0.0,30.88,0.1519,0.17,116.81,-90.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,0.0,30.31,0.1532,0.1732,116.81,-89.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,0.0,29.76,0.1545,0.1764,116.81,-89.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,0.0,29.23,0.1558,0.1796,116.81,-88.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,0.0,28.72,0.157,0.1828,116.81,-88.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.638,0.0,28.22,0.1583,0.186,116.81,-87.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6421,0.0,27.74,0.1595,0.1892,116.81,-87.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,0.0,27.28,0.1607,0.1925,116.81,-86.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.65,0.0,26.83,0.1619,0.1957,116.81,-86.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6539,0.0,26.4,0.1631,0.1989,116.81,-85.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6577,0.0,25.98,0.1643,0.2021,116.81,-85.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,0.0,25.57,0.1655,0.2053,116.81,-84.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.665,0.0,25.18,0.1667,0.2085,116.81,-84.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6685,0.0,24.8,0.1678,0.2117,116.81,-83.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.672,0.0,24.43,0.169,0.2149,116.81,-83.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6754,0.0,24.07,0.1701,0.2181,116.81,-82.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6787,0.0,23.72,0.1712,0.2213,116.81,-82.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.682,0.0,23.38,0.1724,0.2245,116.81,-81.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6852,0.0,23.05,0.1735,0.2277,116.81,-81.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6884,0.0,22.73,0.1746,0.2309,116.81,-80.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6914,0.0,22.42,0.1757,0.2341,116.81,-80.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6945,0.0,22.12,0.1768,0.2374,116.81,-79.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6974,0.0,21.82,0.1778,0.2406,116.81,-79.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7003,0.0,21.54,0.1789,0.2438,116.81,-78.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7032,0.0,21.26,0.18,0.247,116.81,-78.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.706,0.0,20.98,0.181,0.2502,116.81,-77.81,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7088,0.0,20.72,0.1821,0.2534,116.81,-77.31,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7115,0.0,20.46,0.1831,0.2566,116.81,-76.81,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,0.0,50.66,0.1213,0.1036,113.82,-98.82,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,0.0,49.03,0.1232,0.1071,113.82,-98.32,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,0.0,47.5,0.1249,0.1105,113.82,-97.82,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,0.0,46.06,0.1267,0.114,113.82,-97.32,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,0.0,44.7,0.1284,0.1174,113.82,-96.82,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,0.0,43.43,0.1301,0.1209,113.82,-96.32,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,0.0,42.22,0.1318,0.1244,113.82,-95.82,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,0.0,41.08,0.1335,0.1278,113.82,-95.32,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,0.0,40.0,0.1351,0.1313,113.82,-94.82,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,0.0,38.97,0.1367,0.1347,113.82,-94.32,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,0.0,38.0,0.1383,0.1382,113.82,-93.82,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,0.0,37.07,0.1398,0.1416,113.82,-93.32,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,0.0,36.19,0.1414,0.1451,113.82,-92.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,0.0,35.35,0.1429,0.1485,113.82,-92.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,0.0,34.54,0.1444,0.152,113.82,-91.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,0.0,33.77,0.1459,0.1554,113.82,-91.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,0.0,33.04,0.1473,0.1589,113.82,-90.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,0.0,32.34,0.1488,0.1623,113.82,-90.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,0.0,31.66,0.1502,0.1658,113.82,-89.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,0.0,31.02,0.1516,0.1693,113.82,-89.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,0.0,30.4,0.153,0.1727,113.82,-88.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,0.0,29.8,0.1544,0.1762,113.82,-88.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,0.0,29.23,0.1558,0.1796,113.82,-87.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6341,0.0,28.68,0.1571,0.1831,113.82,-87.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,0.0,28.15,0.1584,0.1865,113.82,-86.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,0.0,27.63,0.1598,0.19,113.82,-86.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,0.0,27.14,0.1611,0.1934,113.82,-85.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,0.0,26.66,0.1624,0.1969,113.82,-85.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6556,0.0,26.2,0.1637,0.2003,113.82,-84.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6597,0.0,25.76,0.1649,0.2038,113.82,-84.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,0.0,25.33,0.1662,0.2073,113.82,-83.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6674,0.0,24.92,0.1675,0.2107,113.82,-83.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6712,0.0,24.51,0.1687,0.2142,113.82,-82.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6749,0.0,24.12,0.1699,0.2176,113.82,-82.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6785,0.0,23.75,0.1712,0.2211,113.82,-81.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.682,0.0,23.38,0.1724,0.2245,113.82,-81.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6855,0.0,23.03,0.1736,0.228,113.82,-80.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6888,0.0,22.68,0.1747,0.2314,113.82,-80.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6921,0.0,22.35,0.1759,0.2349,113.82,-79.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6954,0.0,22.03,0.1771,0.2383,113.82,-79.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6986,0.0,21.71,0.1783,0.2418,113.82,-78.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7017,0.0,21.41,0.1794,0.2453,113.82,-78.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7047,0.0,21.11,0.1806,0.2487,113.82,-77.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7077,0.0,20.82,0.1817,0.2522,113.82,-77.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7106,0.0,20.54,0.1828,0.2556,113.82,-76.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7135,0.0,20.27,0.1839,0.2591,113.82,-76.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7163,0.0,20.0,0.185,0.2625,113.82,-75.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7191,0.0,19.74,0.1861,0.266,113.82,-75.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7218,0.0,19.49,0.1872,0.2694,113.82,-74.82,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7245,0.0,19.24,0.1883,0.2729,113.82,-74.32,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7271,0.0,19.0,0.1894,0.2763,113.82,-73.82,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,0.0,50.45,0.1216,0.1041,113.65,-98.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,0.0,48.82,0.1234,0.1075,113.65,-98.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,0.0,47.29,0.1252,0.111,113.65,-97.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,0.0,45.86,0.1269,0.1145,113.65,-97.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,0.0,44.51,0.1287,0.1179,113.65,-96.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,0.0,43.24,0.1304,0.1214,113.65,-96.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,0.0,42.04,0.1321,0.1249,113.65,-95.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,0.0,40.9,0.1337,0.1284,113.65,-95.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,0.0,39.83,0.1353,0.1318,113.65,-94.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,0.0,38.8,0.1369,0.1353,113.65,-94.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,0.0,37.83,0.1385,0.1388,113.65,-93.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,0.0,36.91,0.1401,0.1422,113.65,-93.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,0.0,36.03,0.1416,0.1457,113.65,-92.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,0.0,35.2,0.1432,0.1492,113.65,-92.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,0.0,34.4,0.1447,0.1526,113.65,-91.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,0.0,33.63,0.1461,0.1561,113.65,-91.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,0.0,32.9,0.1476,0.1596,113.65,-90.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,0.0,32.2,0.1491,0.163,113.65,-90.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,0.0,31.53,0.1505,0.1665,113.65,-89.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,0.0,30.89,0.1519,0.17,113.65,-89.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,0.0,30.27,0.1533,0.1735,113.65,-88.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,0.0,29.67,0.1547,0.1769,113.65,-88.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,0.0,29.1,0.1561,0.1804,113.65,-87.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6351,0.0,28.55,0.1574,0.1839,113.65,-87.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6396,0.0,28.03,0.1588,0.1873,113.65,-86.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.644,0.0,27.52,0.1601,0.1908,113.65,-86.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6483,0.0,27.02,0.1614,0.1943,113.65,-85.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6525,0.0,26.55,0.1627,0.1977,113.65,-85.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6567,0.0,26.09,0.164,0.2012,113.65,-84.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6607,0.0,25.65,0.1653,0.2047,113.65,-84.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6646,0.0,25.22,0.1665,0.2081,113.65,-83.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6684,0.0,24.81,0.1678,0.2116,113.65,-83.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6722,0.0,24.41,0.169,0.2151,113.65,-82.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6759,0.0,24.02,0.1703,0.2185,113.65,-82.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,0.0,23.65,0.1715,0.222,113.65,-81.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.683,0.0,23.28,0.1727,0.2255,113.65,-81.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6864,0.0,22.93,0.1739,0.229,113.65,-80.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6898,0.0,22.59,0.1751,0.2324,113.65,-80.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6931,0.0,22.26,0.1763,0.2359,113.65,-79.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6963,0.0,21.93,0.1774,0.2394,113.65,-79.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6995,0.0,21.62,0.1786,0.2428,113.65,-78.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7026,0.0,21.32,0.1798,0.2463,113.65,-78.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7057,0.0,21.02,0.1809,0.2498,113.65,-77.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7086,0.0,20.73,0.182,0.2532,113.65,-77.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7116,0.0,20.45,0.1832,0.2567,113.65,-76.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7144,0.0,20.18,0.1843,0.2602,113.65,-76.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7173,0.0,19.91,0.1854,0.2636,113.65,-75.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.72,0.0,19.65,0.1865,0.2671,113.65,-75.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7227,0.0,19.4,0.1876,0.2706,113.65,-74.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7254,0.0,19.16,0.1887,0.2741,113.65,-74.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.728,0.0,18.92,0.1898,0.2775,113.65,-73.65,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,0.0,47.29,0.1252,0.111,111.1,-96.1,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,0.0,45.76,0.1271,0.1147,111.1,-95.6,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,0.0,44.33,0.1289,0.1184,111.1,-95.1,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,0.0,42.99,0.1307,0.1221,111.1,-94.6,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,0.0,41.72,0.1325,0.1258,111.1,-94.1,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,0.0,40.53,0.1343,0.1295,111.1,-93.6,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,0.0,39.4,0.136,0.1332,111.1,-93.1,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,0.0,38.34,0.1377,0.1369,111.1,-92.6,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,0.0,37.33,0.1394,0.1406,111.1,-92.1,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,0.0,36.37,0.141,0.1443,111.1,-91.6,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,0.0,35.46,0.1427,0.148,111.1,-91.1,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,0.0,34.6,0.1443,0.1517,111.1,-90.6,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,0.0,33.77,0.1459,0.1554,111.1,-90.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,0.0,32.99,0.1474,0.1591,111.1,-89.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,0.0,32.24,0.149,0.1628,111.1,-89.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,0.0,31.52,0.1505,0.1665,111.1,-88.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,0.0,30.84,0.152,0.1702,111.1,-88.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,0.0,30.18,0.1535,0.1739,111.1,-87.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,0.0,29.55,0.155,0.1776,111.1,-87.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,0.0,28.95,0.1564,0.1813,111.1,-86.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,0.0,28.37,0.1579,0.185,111.1,-86.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,0.0,27.81,0.1593,0.1887,111.1,-85.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,0.0,27.28,0.1607,0.1925,111.1,-85.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6506,0.0,26.77,0.1621,0.1962,111.1,-84.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,0.0,26.27,0.1635,0.1999,111.1,-84.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,0.0,25.79,0.1649,0.2036,111.1,-83.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,0.0,25.33,0.1662,0.2073,111.1,-83.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6677,0.0,24.89,0.1675,0.211,111.1,-82.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6717,0.0,24.46,0.1689,0.2147,111.1,-82.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6757,0.0,24.04,0.1702,0.2184,111.1,-81.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,0.0,23.64,0.1715,0.2221,111.1,-81.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6832,0.0,23.25,0.1728,0.2258,111.1,-80.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6869,0.0,22.88,0.1741,0.2295,111.1,-80.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6905,0.0,22.52,0.1753,0.2332,111.1,-79.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,0.0,22.16,0.1766,0.2369,111.1,-79.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6974,0.0,21.82,0.1778,0.2406,111.1,-78.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7008,0.0,21.49,0.1791,0.2443,111.1,-78.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7041,0.0,21.17,0.1803,0.248,111.1,-77.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7073,0.0,20.86,0.1815,0.2517,111.1,-77.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7104,0.0,20.56,0.1827,0.2554,111.1,-76.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7135,0.0,20.27,0.1839,0.2591,111.1,-76.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7165,0.0,19.98,0.1851,0.2628,111.1,-75.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7195,0.0,19.7,0.1863,0.2665,111.1,-75.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7224,0.0,19.43,0.1875,0.2702,111.1,-74.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7252,0.0,19.17,0.1886,0.2739,111.1,-74.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.728,0.0,18.91,0.1898,0.2776,111.1,-73.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7308,0.0,18.67,0.1909,0.2813,111.1,-73.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7334,0.0,18.42,0.1921,0.285,111.1,-72.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7361,0.0,18.19,0.1932,0.2887,111.1,-72.1,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7386,0.0,17.96,0.1943,0.2924,111.1,-71.6,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7412,0.0,17.73,0.1954,0.2961,111.1,-71.1,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,0.0,44.33,0.1289,0.1184,108.62,-93.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,0.0,42.9,0.1309,0.1224,108.62,-93.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,0.0,41.56,0.1328,0.1263,108.62,-92.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,0.0,40.3,0.1346,0.1303,108.62,-92.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,0.0,39.11,0.1365,0.1342,108.62,-91.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,0.0,38.0,0.1383,0.1382,108.62,-91.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,0.0,36.94,0.14,0.1421,108.62,-90.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,0.0,35.94,0.1418,0.1461,108.62,-90.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,0.0,35.0,0.1435,0.15,108.62,-89.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,0.0,34.1,0.1452,0.154,108.62,-89.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,0.0,33.25,0.1469,0.1579,108.62,-88.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,0.0,32.44,0.1486,0.1619,108.62,-88.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,0.0,31.66,0.1502,0.1658,108.62,-87.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,0.0,30.93,0.1518,0.1698,108.62,-87.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,0.0,30.22,0.1534,0.1737,108.62,-86.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,0.0,29.55,0.155,0.1776,108.62,-86.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,0.0,28.91,0.1565,0.1816,108.62,-85.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,0.0,28.3,0.1581,0.1855,108.62,-85.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,0.0,27.71,0.1596,0.1895,108.62,-84.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,0.0,27.14,0.1611,0.1934,108.62,-84.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,0.0,26.6,0.1626,0.1974,108.62,-83.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,0.0,26.08,0.164,0.2013,108.62,-83.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,0.0,25.57,0.1655,0.2053,108.62,-82.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6658,0.0,25.09,0.1669,0.2092,108.62,-82.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6701,0.0,24.63,0.1683,0.2132,108.62,-81.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6744,0.0,24.18,0.1698,0.2171,108.62,-81.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6785,0.0,23.75,0.1712,0.2211,108.62,-80.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6825,0.0,23.33,0.1725,0.225,108.62,-80.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6864,0.0,22.93,0.1739,0.229,108.62,-79.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6903,0.0,22.54,0.1753,0.2329,108.62,-79.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,0.0,22.16,0.1766,0.2369,108.62,-78.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6977,0.0,21.8,0.1779,0.2408,108.62,-78.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7012,0.0,21.45,0.1792,0.2448,108.62,-77.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7047,0.0,21.11,0.1806,0.2487,108.62,-77.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7081,0.0,20.78,0.1818,0.2527,108.62,-76.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7115,0.0,20.46,0.1831,0.2566,108.62,-76.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7147,0.0,20.15,0.1844,0.2605,108.62,-75.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7179,0.0,19.85,0.1857,0.2645,108.62,-75.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7211,0.0,19.56,0.1869,0.2684,108.62,-74.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7241,0.0,19.27,0.1882,0.2724,108.62,-74.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7271,0.0,19.0,0.1894,0.2763,108.62,-73.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.73,0.0,18.73,0.1906,0.2803,108.62,-73.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7329,0.0,18.47,0.1918,0.2842,108.62,-72.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7357,0.0,18.22,0.193,0.2882,108.62,-72.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7385,0.0,17.97,0.1942,0.2921,108.62,-71.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7412,0.0,17.73,0.1954,0.2961,108.62,-71.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7438,0.0,17.5,0.1966,0.3,108.62,-70.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7464,0.0,17.27,0.1978,0.304,108.62,-70.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.749,0.0,17.05,0.1989,0.3079,108.62,-69.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7515,0.0,16.83,0.2001,0.3119,108.62,-69.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7539,0.0,16.62,0.2012,0.3158,108.62,-68.62,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,0.0,41.72,0.1325,0.1258,106.34,-91.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,0.0,40.38,0.1345,0.13,106.34,-90.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,0.0,39.11,0.1365,0.1342,106.34,-90.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,0.0,37.93,0.1384,0.1384,106.34,-89.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,0.0,36.81,0.1403,0.1426,106.34,-89.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,0.0,35.76,0.1421,0.1468,106.34,-88.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,0.0,34.77,0.144,0.151,106.34,-88.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,0.0,33.83,0.1458,0.1552,106.34,-87.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,0.0,32.94,0.1475,0.1594,106.34,-87.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,0.0,32.09,0.1493,0.1636,106.34,-86.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,0.0,31.29,0.151,0.1678,106.34,-86.34,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,0.0,30.53,0.1527,0.172,106.34,-85.84,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,0.0,29.8,0.1544,0.1762,106.34,-85.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,0.0,29.11,0.156,0.1804,106.34,-84.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,0.0,28.45,0.1577,0.1846,106.34,-84.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,0.0,27.81,0.1593,0.1887,106.34,-83.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,0.0,27.21,0.1609,0.1929,106.34,-83.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6518,0.0,26.63,0.1625,0.1971,106.34,-82.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,0.0,26.08,0.164,0.2013,106.34,-82.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6616,0.0,25.54,0.1656,0.2055,106.34,-81.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6664,0.0,25.03,0.1671,0.2097,106.34,-81.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6709,0.0,24.54,0.1686,0.2139,106.34,-80.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6754,0.0,24.07,0.1701,0.2181,106.34,-80.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6798,0.0,23.62,0.1716,0.2223,106.34,-79.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.684,0.0,23.18,0.173,0.2265,106.34,-79.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6881,0.0,22.76,0.1745,0.2307,106.34,-78.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6921,0.0,22.35,0.1759,0.2349,106.34,-78.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6961,0.0,21.96,0.1773,0.2391,106.34,-77.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6999,0.0,21.58,0.1788,0.2433,106.34,-77.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7036,0.0,21.21,0.1801,0.2475,106.34,-76.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7073,0.0,20.86,0.1815,0.2517,106.34,-76.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7109,0.0,20.52,0.1829,0.2559,106.34,-75.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7143,0.0,20.19,0.1842,0.2601,106.34,-75.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7177,0.0,19.87,0.1856,0.2642,106.34,-74.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7211,0.0,19.56,0.1869,0.2684,106.34,-74.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7243,0.0,19.26,0.1882,0.2726,106.34,-73.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7275,0.0,18.96,0.1896,0.2768,106.34,-73.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7306,0.0,18.68,0.1909,0.281,106.34,-72.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7336,0.0,18.41,0.1921,0.2852,106.34,-72.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7366,0.0,18.14,0.1934,0.2894,106.34,-71.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7395,0.0,17.88,0.1947,0.2936,106.34,-71.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7423,0.0,17.63,0.1959,0.2978,106.34,-70.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7451,0.0,17.38,0.1972,0.302,106.34,-70.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7479,0.0,17.15,0.1984,0.3062,106.34,-69.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7505,0.0,16.91,0.1997,0.3104,106.34,-69.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7531,0.0,16.69,0.2009,0.3146,106.34,-68.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7557,0.0,16.47,0.2021,0.3188,106.34,-68.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7582,0.0,16.26,0.2033,0.323,106.34,-67.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7607,0.0,16.05,0.2045,0.3272,106.34,-67.34,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7631,0.0,15.84,0.2057,0.3314,106.34,-66.84,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7655,0.0,15.65,0.2069,0.3356,106.34,-66.34,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,0.0,39.4,0.136,0.1332,104.24,-89.24,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,0.0,38.13,0.138,0.1377,104.24,-88.74,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,0.0,36.94,0.14,0.1421,104.24,-88.24,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,0.0,35.82,0.142,0.1466,104.24,-87.74,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,0.0,34.77,0.144,0.151,104.24,-87.24,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,0.0,33.78,0.1459,0.1554,104.24,-86.74,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,0.0,32.84,0.1477,0.1599,104.24,-86.24,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,0.0,31.95,0.1496,0.1643,104.24,-85.74,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,0.0,31.11,0.1514,0.1688,104.24,-85.24,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,0.0,30.31,0.1532,0.1732,104.24,-84.74,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,0.0,29.55,0.155,0.1776,104.24,-84.24,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,0.0,28.83,0.1567,0.1821,104.24,-83.74,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,0.0,28.15,0.1584,0.1865,104.24,-83.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,0.0,27.49,0.1601,0.191,104.24,-82.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,0.0,26.87,0.1618,0.1954,104.24,-82.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,0.0,26.27,0.1635,0.1999,104.24,-81.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,0.0,25.7,0.1651,0.2043,104.24,-81.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6653,0.0,25.15,0.1667,0.2087,104.24,-80.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6701,0.0,24.63,0.1683,0.2132,104.24,-80.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6749,0.0,24.12,0.1699,0.2176,104.24,-79.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,0.0,23.64,0.1715,0.2221,104.24,-79.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.684,0.0,23.18,0.173,0.2265,104.24,-78.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6884,0.0,22.73,0.1746,0.2309,104.24,-78.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6926,0.0,22.3,0.1761,0.2354,104.24,-77.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6968,0.0,21.89,0.1776,0.2398,104.24,-77.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7008,0.0,21.49,0.1791,0.2443,104.24,-76.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7047,0.0,21.11,0.1806,0.2487,104.24,-76.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7086,0.0,20.74,0.182,0.2531,104.24,-75.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7123,0.0,20.38,0.1835,0.2576,104.24,-75.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7159,0.0,20.04,0.1849,0.262,104.24,-74.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7195,0.0,19.7,0.1863,0.2665,104.24,-74.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.723,0.0,19.38,0.1877,0.2709,104.24,-73.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7264,0.0,19.07,0.1891,0.2754,104.24,-73.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7297,0.0,18.76,0.1905,0.2798,104.24,-72.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7329,0.0,18.47,0.1918,0.2842,104.24,-72.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7361,0.0,18.19,0.1932,0.2887,104.24,-71.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7392,0.0,17.91,0.1945,0.2931,104.24,-71.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7422,0.0,17.64,0.1959,0.2976,104.24,-70.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7451,0.0,17.38,0.1972,0.302,104.24,-70.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.748,0.0,17.13,0.1985,0.3064,104.24,-69.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7508,0.0,16.89,0.1998,0.3109,104.24,-69.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7536,0.0,16.65,0.2011,0.3153,104.24,-68.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7563,0.0,16.42,0.2024,0.3198,104.24,-68.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7589,0.0,16.19,0.2036,0.3242,104.24,-67.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7615,0.0,15.97,0.2049,0.3286,104.24,-67.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7641,0.0,15.76,0.2062,0.3331,104.24,-66.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7666,0.0,15.55,0.2074,0.3375,104.24,-66.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.769,0.0,15.35,0.2086,0.342,104.24,-65.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7714,0.0,15.16,0.2099,0.3464,104.24,-65.24,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7737,0.0,14.96,0.2111,0.3509,104.24,-64.74,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.776,0.0,14.78,0.2123,0.3553,104.24,-64.24,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,0.0,37.33,0.1394,0.1406,102.28,-87.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,0.0,36.13,0.1415,0.1453,102.28,-86.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,0.0,35.0,0.1435,0.15,102.28,-86.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,0.0,33.94,0.1455,0.1547,102.28,-85.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,0.0,32.94,0.1475,0.1594,102.28,-85.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,0.0,32.0,0.1495,0.1641,102.28,-84.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,0.0,31.11,0.1514,0.1688,102.28,-84.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,0.0,30.27,0.1533,0.1735,102.28,-83.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,0.0,29.47,0.1552,0.1781,102.28,-83.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,0.0,28.72,0.157,0.1828,102.28,-82.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,0.0,28.0,0.1588,0.1875,102.28,-82.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,0.0,27.31,0.1606,0.1922,102.28,-81.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,0.0,26.66,0.1624,0.1969,102.28,-81.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,0.0,26.04,0.1641,0.2016,102.28,-80.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,0.0,25.45,0.1658,0.2063,102.28,-80.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6677,0.0,24.89,0.1675,0.211,102.28,-79.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6728,0.0,24.35,0.1692,0.2156,102.28,-79.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6777,0.0,23.83,0.1709,0.2203,102.28,-78.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6825,0.0,23.33,0.1725,0.225,102.28,-78.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6872,0.0,22.86,0.1742,0.2297,102.28,-77.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6917,0.0,22.4,0.1758,0.2344,102.28,-77.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6961,0.0,21.96,0.1773,0.2391,102.28,-76.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7003,0.0,21.54,0.1789,0.2438,102.28,-76.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7045,0.0,21.13,0.1805,0.2485,102.28,-75.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7086,0.0,20.74,0.182,0.2531,102.28,-75.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7125,0.0,20.36,0.1835,0.2578,102.28,-74.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7163,0.0,20.0,0.185,0.2625,102.28,-74.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7201,0.0,19.65,0.1865,0.2672,102.28,-73.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7237,0.0,19.31,0.188,0.2719,102.28,-73.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7273,0.0,18.98,0.1895,0.2766,102.28,-72.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7308,0.0,18.67,0.1909,0.2813,102.28,-72.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7341,0.0,18.36,0.1924,0.286,102.28,-71.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7375,0.0,18.06,0.1938,0.2906,102.28,-71.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7407,0.0,17.78,0.1952,0.2953,102.28,-70.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7438,0.0,17.5,0.1966,0.3,102.28,-70.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7469,0.0,17.23,0.198,0.3047,102.28,-69.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7499,0.0,16.97,0.1994,0.3094,102.28,-69.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7528,0.0,16.72,0.2007,0.3141,102.28,-68.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7557,0.0,16.47,0.2021,0.3188,102.28,-68.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7585,0.0,16.23,0.2034,0.3235,102.28,-67.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7613,0.0,16.0,0.2048,0.3282,102.28,-67.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7639,0.0,15.77,0.2061,0.3328,102.28,-66.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7666,0.0,15.55,0.2074,0.3375,102.28,-66.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7691,0.0,15.34,0.2087,0.3422,102.28,-65.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7716,0.0,15.13,0.21,0.3469,102.28,-65.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7741,0.0,14.93,0.2113,0.3516,102.28,-64.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7765,0.0,14.74,0.2126,0.3563,102.28,-64.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7789,0.0,14.54,0.2138,0.361,102.28,-63.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7812,0.0,14.36,0.2151,0.3657,102.28,-63.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7835,0.0,14.18,0.2163,0.3703,102.28,-62.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7857,0.0,14.0,0.2176,0.375,102.28,-62.28,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,0.0,35.46,0.1427,0.148,100.46,-85.46,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,0.0,34.32,0.1448,0.153,100.46,-84.96,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,0.0,33.25,0.1469,0.1579,100.46,-84.46,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,0.0,32.24,0.149,0.1628,100.46,-83.96,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,0.0,31.29,0.151,0.1678,100.46,-83.46,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,0.0,30.4,0.153,0.1727,100.46,-82.96,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,0.0,29.55,0.155,0.1776,100.46,-82.46,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,0.0,28.75,0.1569,0.1826,100.46,-81.96,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,0.0,28.0,0.1588,0.1875,100.46,-81.46,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,0.0,27.28,0.1607,0.1925,100.46,-80.96,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,0.0,26.6,0.1626,0.1974,100.46,-80.46,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,0.0,25.95,0.1644,0.2023,100.46,-79.96,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,0.0,25.33,0.1662,0.2073,100.46,-79.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6691,0.0,24.74,0.168,0.2122,100.46,-78.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6744,0.0,24.18,0.1698,0.2171,100.46,-78.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,0.0,23.64,0.1715,0.2221,100.46,-77.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6845,0.0,23.13,0.1732,0.227,100.46,-77.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6893,0.0,22.64,0.1749,0.2319,100.46,-76.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,0.0,22.16,0.1766,0.2369,100.46,-76.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6986,0.0,21.71,0.1783,0.2418,100.46,-75.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.703,0.0,21.28,0.1799,0.2467,100.46,-75.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7073,0.0,20.86,0.1815,0.2517,100.46,-74.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7115,0.0,20.46,0.1831,0.2566,100.46,-74.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7155,0.0,20.07,0.1847,0.2615,100.46,-73.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7195,0.0,19.7,0.1863,0.2665,100.46,-73.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7234,0.0,19.34,0.1879,0.2714,100.46,-72.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7271,0.0,19.0,0.1894,0.2763,100.46,-72.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7308,0.0,18.67,0.1909,0.2813,100.46,-71.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7343,0.0,18.34,0.1924,0.2862,100.46,-71.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7378,0.0,18.03,0.1939,0.2911,100.46,-70.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7412,0.0,17.73,0.1954,0.2961,100.46,-70.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7445,0.0,17.44,0.1969,0.301,100.46,-69.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7477,0.0,17.16,0.1984,0.3059,100.46,-69.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7508,0.0,16.89,0.1998,0.3109,100.46,-68.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7539,0.0,16.62,0.2012,0.3158,100.46,-68.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7569,0.0,16.37,0.2027,0.3208,100.46,-67.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7598,0.0,16.12,0.2041,0.3257,100.46,-67.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7627,0.0,15.88,0.2055,0.3306,100.46,-66.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7655,0.0,15.65,0.2069,0.3356,100.46,-66.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7682,0.0,15.42,0.2082,0.3405,100.46,-65.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7709,0.0,15.2,0.2096,0.3454,100.46,-65.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7735,0.0,14.98,0.2109,0.3504,100.46,-64.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.776,0.0,14.78,0.2123,0.3553,100.46,-64.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7785,0.0,14.57,0.2136,0.3602,100.46,-63.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.781,0.0,14.38,0.2149,0.3652,100.46,-63.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7833,0.0,14.19,0.2163,0.3701,100.46,-62.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7857,0.0,14.0,0.2176,0.375,100.46,-62.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.788,0.0,13.82,0.2189,0.38,100.46,-61.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7902,0.0,13.64,0.2201,0.3849,100.46,-61.46,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7924,0.0,13.47,0.2214,0.3898,100.46,-60.96,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7946,0.0,13.3,0.2227,0.3948,100.46,-60.46,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,0.0,35.01,0.1435,0.15,100.01,-85.01,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,0.0,33.88,0.1457,0.155,100.01,-84.51,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,0.0,32.82,0.1478,0.16,100.01,-84.01,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,0.0,31.83,0.1498,0.165,100.01,-83.51,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,0.0,30.89,0.1519,0.17,100.01,-83.01,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,0.0,30.01,0.1539,0.175,100.01,-82.51,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,0.0,29.17,0.1559,0.18,100.01,-82.01,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,0.0,28.39,0.1578,0.185,100.01,-81.51,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,0.0,27.64,0.1598,0.19,100.01,-81.01,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,0.0,26.93,0.1617,0.195,100.01,-80.51,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,0.0,26.26,0.1635,0.2,100.01,-80.01,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,0.0,25.62,0.1654,0.2049,100.01,-79.51,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,0.0,25.01,0.1672,0.2099,100.01,-79.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.672,0.0,24.42,0.169,0.2149,100.01,-78.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6773,0.0,23.87,0.1708,0.2199,100.01,-78.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6824,0.0,23.34,0.1725,0.2249,100.01,-77.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6874,0.0,22.83,0.1742,0.2299,100.01,-77.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6922,0.0,22.35,0.1759,0.2349,100.01,-76.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6969,0.0,21.88,0.1776,0.2399,100.01,-76.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7014,0.0,21.43,0.1793,0.2449,100.01,-75.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7058,0.0,21.01,0.181,0.2499,100.01,-75.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7101,0.0,20.59,0.1826,0.2549,100.01,-74.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7142,0.0,20.2,0.1842,0.2599,100.01,-74.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7183,0.0,19.82,0.1858,0.2649,100.01,-73.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7222,0.0,19.45,0.1874,0.2699,100.01,-73.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.726,0.0,19.1,0.189,0.2749,100.01,-72.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7298,0.0,18.75,0.1905,0.2799,100.01,-72.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7334,0.0,18.43,0.192,0.2849,100.01,-71.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7369,0.0,18.11,0.1936,0.2899,100.01,-71.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7404,0.0,17.8,0.1951,0.2949,100.01,-70.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7438,0.0,17.5,0.1966,0.2999,100.01,-70.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.747,0.0,17.22,0.1981,0.3049,100.01,-69.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7502,0.0,16.94,0.1995,0.3099,100.01,-69.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7534,0.0,16.67,0.201,0.3149,100.01,-68.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7564,0.0,16.41,0.2024,0.3199,100.01,-68.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7594,0.0,16.16,0.2038,0.3249,100.01,-67.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7623,0.0,15.91,0.2053,0.3299,100.01,-67.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7651,0.0,15.68,0.2067,0.3349,100.01,-66.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7679,0.0,15.44,0.2081,0.3399,100.01,-66.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7706,0.0,15.22,0.2095,0.3449,100.01,-65.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7732,0.0,15.0,0.2108,0.3499,100.01,-65.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7758,0.0,14.79,0.2122,0.3549,100.01,-64.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7784,0.0,14.59,0.2135,0.3599,100.01,-64.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7808,0.0,14.39,0.2149,0.3649,100.01,-63.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7833,0.0,14.19,0.2162,0.3699,100.01,-63.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7856,0.0,14.0,0.2175,0.3749,100.01,-62.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.788,0.0,13.82,0.2188,0.3799,100.01,-62.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7902,0.0,13.64,0.2201,0.3849,100.01,-61.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7925,0.0,13.46,0.2214,0.3899,100.01,-61.01,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7946,0.0,13.29,0.2227,0.3949,100.01,-60.51,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7968,0.0,13.13,0.224,0.3999,100.01,-60.01,[3,4]]]],"Kapton":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,35.18,70.93,0.1041,0.074,24.58,-9.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,36.37,68.64,0.1057,0.0765,24.58,-9.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,37.56,66.49,0.1072,0.079,24.58,-8.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,38.76,64.48,0.1088,0.0814,24.58,-8.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,39.95,62.58,0.1102,0.0839,24.58,-7.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,41.15,60.8,0.1117,0.0864,24.58,-7.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,42.35,59.11,0.1131,0.0888,24.58,-6.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,43.54,57.51,0.1145,0.0913,24.58,-6.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,44.74,56.0,0.1159,0.0938,24.58,-5.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,45.94,54.56,0.1173,0.0962,24.58,-5.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,47.13,53.2,0.1187,0.0987,24.58,-4.58,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,48.33,51.9,0.12,0.1012,24.58,-4.08,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,49.53,50.66,0.1213,0.1036,24.58,-3.58,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,50.73,49.48,0.1226,0.1061,24.58,-3.08,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,51.93,48.36,0.1239,0.1086,24.58,-2.58,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,53.13,47.29,0.1252,0.111,24.58,-2.08,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,54.33,46.26,0.1265,0.1135,24.58,-1.58,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,55.54,45.27,0.1277,0.116,24.58,-1.08,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,56.74,44.33,0.1289,0.1184,24.58,-0.58,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,57.94,43.43,0.1301,0.1209,24.58,-0.08,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,59.14,42.56,0.1313,0.1234,24.58,0.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,60.35,41.72,0.1325,0.1258,24.58,0.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,61.55,40.92,0.1337,0.1283,24.58,1.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,62.75,40.15,0.1349,0.1308,24.58,1.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,63.96,39.4,0.136,0.1332,24.58,2.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,65.16,38.69,0.1371,0.1357,24.58,2.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,66.37,38.0,0.1383,0.1382,24.58,3.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,67.57,37.33,0.1394,0.1406,24.58,3.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,68.78,36.69,0.1405,0.1431,24.58,4.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,69.98,36.06,0.1416,0.1456,24.58,4.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,71.19,35.46,0.1427,0.148,24.58,5.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,72.4,34.88,0.1437,0.1505,24.58,5.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,73.6,34.32,0.1448,0.153,24.58,6.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,74.81,33.77,0.1459,0.1554,24.58,6.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,76.02,33.25,0.1469,0.1579,24.58,7.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,77.23,32.74,0.1479,0.1604,24.58,7.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,78.44,32.24,0.149,0.1628,24.58,8.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.609,79.65,31.76,0.15,0.1653,24.58,8.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,80.85,31.29,0.151,0.1678,24.58,9.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,82.06,30.84,0.152,0.1702,24.58,9.92,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,83.27,30.4,0.153,0.1727,24.58,10.42,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6233,84.48,29.97,0.154,0.1752,24.58,10.92,[6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,85.69,29.55,0.155,0.1776,24.58,11.42,[6,7]],[0.5,"low",0.0,0.0,0.0313,0.0,0.0,0.0,0.6301,86.9,29.15,0.1559,0.1801,24.58,11.92,[6,7]],[0.7,"low",0.0,0.0,0.0478,0.0,0.0,0.0,0.6334,88.12,28.75,0.1569,0.1826,24.58,12.42,[6,7]],[1.0,"low",0.0,0.0,0.0641,0.0,0.0,0.0,0.6367,89.33,28.37,0.1579,0.185,24.58,12.92,[6,7]],[1.2,"low",0.0,0.0,0.0802,0.0,0.0,0.0,0.6399,90.54,28.0,0.1588,0.1875,24.58,13.42,[6,7]],[1.4,"low",0.0,0.0,0.096,0.0,0.0,0.0,0.643,91.75,27.63,0.1598,0.19,24.58,13.92,[6,7]],[1.7,"low",0.0,0.0,0.1117,0.0,0.0,0.0,0.6461,92.96,27.28,0.1607,0.1925,24.58,14.42,[6,7]],[1.9,"low",0.0,0.0,0.1272,0.0,0.0,0.0,0.6491,94.17,26.93,0.1616,0.1949,24.58,14.92,[6,7]],[2.3,"low",0.0,0.0,0.1424,0.0,0.0056,0.0,0.6521,95.39,26.6,0.1626,0.1974,24.58,15.42,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,30.28,64.48,0.1088,0.0814,23.78,-8.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,31.31,62.4,0.1104,0.0841,23.78,-8.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,32.33,60.45,0.112,0.0868,23.78,-7.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,33.36,58.62,0.1136,0.0896,23.78,-7.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,34.39,56.89,0.1151,0.0923,23.78,-6.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,35.42,55.27,0.1166,0.095,23.78,-6.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,36.45,53.73,0.1181,0.0977,23.78,-5.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,37.48,52.28,0.1196,0.1004,23.78,-5.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,38.51,50.9,0.1211,0.1031,23.78,-4.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,39.54,49.6,0.1225,0.1058,23.78,-4.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,40.57,48.36,0.1239,0.1086,23.78,-3.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,41.6,47.18,0.1253,0.1113,23.78,-3.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,42.64,46.06,0.1267,0.114,23.78,-2.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,43.67,44.99,0.1281,0.1167,23.78,-2.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,44.7,43.96,0.1294,0.1194,23.78,-1.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,45.74,42.99,0.1307,0.1221,23.78,-1.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,46.77,42.05,0.132,0.1248,23.78,-0.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,47.8,41.16,0.1333,0.1276,23.78,-0.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,48.84,40.3,0.1346,0.1303,23.78,0.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,49.87,39.48,0.1359,0.133,23.78,0.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,50.91,38.69,0.1371,0.1357,23.78,1.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,51.94,37.93,0.1384,0.1384,23.78,1.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,52.98,37.2,0.1396,0.1411,23.78,2.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,54.02,36.5,0.1408,0.1438,23.78,2.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,55.05,35.82,0.142,0.1466,23.78,3.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,56.09,35.17,0.1432,0.1493,23.78,3.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,57.13,34.54,0.1444,0.152,23.78,4.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,58.16,33.94,0.1455,0.1547,23.78,4.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,59.2,33.35,0.1467,0.1574,23.78,5.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,60.24,32.79,0.1478,0.1601,23.78,5.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,61.28,32.24,0.149,0.1628,23.78,6.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,62.32,31.71,0.1501,0.1656,23.78,6.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6134,63.36,31.2,0.1512,0.1683,23.78,7.22,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6174,64.4,30.7,0.1523,0.171,23.78,7.72,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,65.44,30.22,0.1534,0.1737,23.78,8.22,[6,7]],[0.1,"low",0.0,0.0,0.0061,0.0,0.0,0.0,0.625,66.48,29.76,0.1545,0.1764,23.78,8.72,[6,7]],[0.4,"low",0.0,0.0,0.0246,0.0,0.0,0.0,0.6288,67.52,29.31,0.1556,0.1791,23.78,9.22,[6,7]],[0.6,"low",0.0,0.0,0.0429,0.0,0.0,0.0,0.6324,68.56,28.87,0.1566,0.1818,23.78,9.72,[6,7]],[0.9,"low",0.0,0.0,0.0608,0.0,0.0,0.0,0.636,69.6,28.45,0.1577,0.1846,23.78,10.22,[6,7]],[1.2,"low",0.0,0.0,0.0786,0.0,0.0,0.0,0.6395,70.64,28.03,0.1587,0.1873,23.78,10.72,[6,7]],[1.4,"low",0.0,0.0,0.096,0.0,0.0,0.0,0.643,71.68,27.63,0.1598,0.19,23.78,11.22,[6,7]],[1.7,"low",0.0,0.0,0.1133,0.0,0.0,0.0,0.6464,72.72,27.24,0.1608,0.1927,23.78,11.72,[6,7]],[2.0,"low",0.0,0.0,0.1302,0.0,0.0,0.0,0.6497,73.76,26.87,0.1618,0.1954,23.78,12.22,[6,7]],[2.2,"low",0.0,0.0,0.147,0.0,0.0,0.0,0.653,74.81,26.5,0.1628,0.1981,23.78,12.72,[6,7]],[2.5,"low",0.0,0.0,0.1635,0.0,0.0,0.0,0.6562,75.85,26.14,0.1639,0.2008,23.78,13.22,[6,7]],[2.7,"low",0.0,0.0,0.1798,0.0,0.0,0.0,0.6594,76.89,25.79,0.1649,0.2036,23.78,13.72,[6,7]],[3.2,"low",0.0,0.0,0.1959,0.0,0.0116,0.0,0.6625,77.93,25.45,0.1658,0.2063,23.78,14.22,[6,7]],[3.8,"low",0.0,0.0,0.2118,0.0,0.0259,0.0,0.6655,78.98,25.12,0.1668,0.209,23.78,14.72,[6,7]],[5.1,"low",0.0125,0.0143,0.2274,0.0125,0.0401,0.0045,0.6685,80.02,24.8,0.1678,0.2117,23.78,15.22,[6]],[6.8,"low",0.0322,0.0369,0.2429,0.0322,0.0544,0.0113,0.6715,81.06,24.49,0.1688,0.2144,23.78,15.72,[6]],[8.5,"low",0.0518,0.0592,0.2582,0.0518,0.0687,0.0176,0.6744,82.11,24.18,0.1698,0.2171,23.78,16.22,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,29.03,62.77,0.1101,0.0836,23.56,-8.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,30.01,60.74,0.1117,0.0864,23.56,-8.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,30.99,58.84,0.1134,0.0892,23.56,-7.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,31.98,57.06,0.115,0.092,23.56,-7.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,32.97,55.38,0.1165,0.0948,23.56,-6.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,33.95,53.8,0.1181,0.0976,23.56,-6.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,34.94,52.31,0.1196,0.1004,23.56,-5.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,35.93,50.89,0.1211,0.1032,23.56,-5.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,36.91,49.55,0.1226,0.1059,23.56,-4.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,37.9,48.28,0.124,0.1087,23.56,-4.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,38.89,47.08,0.1254,0.1115,23.56,-3.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,39.88,45.93,0.1269,0.1143,23.56,-3.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,40.87,44.83,0.1283,0.1171,23.56,-2.56,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,41.86,43.79,0.1296,0.1199,23.56,-2.06,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,42.85,42.8,0.131,0.1227,23.56,-1.56,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,43.84,41.85,0.1323,0.1255,23.56,-1.06,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,44.83,40.94,0.1337,0.1283,23.56,-0.56,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,45.82,40.06,0.135,0.131,23.56,-0.06,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,46.81,39.23,0.1363,0.1338,23.56,0.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,47.81,38.43,0.1376,0.1366,23.56,0.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,48.8,37.66,0.1388,0.1394,23.56,1.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,49.79,36.92,0.1401,0.1422,23.56,1.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,50.78,36.21,0.1413,0.145,23.56,2.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,51.78,35.53,0.1425,0.1478,23.56,2.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,52.77,34.87,0.1438,0.1506,23.56,3.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,53.77,34.24,0.145,0.1533,23.56,3.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,54.76,33.63,0.1462,0.1561,23.56,4.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,55.75,33.04,0.1473,0.1589,23.56,4.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,56.75,32.47,0.1485,0.1617,23.56,5.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,57.74,31.92,0.1497,0.1645,23.56,5.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,58.74,31.38,0.1508,0.1673,23.56,6.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.616,59.74,30.87,0.1519,0.1701,23.56,6.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.62,60.73,30.37,0.1531,0.1729,23.56,7.44,[6,7]],[0.0,"low",0.0,0.0,0.0008,0.0,0.0,0.0,0.624,61.73,29.89,0.1542,0.1756,23.56,7.94,[6,7]],[0.3,"low",0.0,0.0,0.0199,0.0,0.0,0.0,0.6278,62.72,29.42,0.1553,0.1784,23.56,8.44,[6,7]],[0.6,"low",0.0,0.0,0.0387,0.0,0.0,0.0,0.6316,63.72,28.97,0.1564,0.1812,23.56,8.94,[6,7]],[0.9,"low",0.0,0.0,0.0573,0.0,0.0,0.0,0.6353,64.72,28.53,0.1575,0.184,23.56,9.44,[6,7]],[1.1,"low",0.0,0.0,0.0755,0.0,0.0,0.0,0.6389,65.72,28.1,0.1586,0.1868,23.56,9.94,[6,7]],[1.4,"low",0.0,0.0,0.0935,0.0,0.0,0.0,0.6425,66.71,27.69,0.1596,0.1896,23.56,10.44,[6,7]],[1.7,"low",0.0,0.0,0.1112,0.0,0.0,0.0,0.646,67.71,27.29,0.1607,0.1924,23.56,10.94,[6,7]],[1.9,"low",0.0,0.0,0.1287,0.0,0.0,0.0,0.6494,68.71,26.9,0.1617,0.1952,23.56,11.44,[6,7]],[2.2,"low",0.0,0.0,0.1459,0.0,0.0,0.0,0.6528,69.71,26.52,0.1628,0.198,23.56,11.94,[6,7]],[2.4,"low",0.0,0.0,0.1629,0.0,0.0,0.0,0.6561,70.71,26.15,0.1638,0.2007,23.56,12.44,[6,7]],[2.7,"low",0.0,0.0,0.1797,0.0,0.0,0.0,0.6594,71.71,25.79,0.1648,0.2035,23.56,12.94,[6,7]],[2.9,"low",0.0,0.0,0.1962,0.0,0.0,0.0,0.6625,72.7,25.45,0.1659,0.2063,23.56,13.44,[6,7]],[3.6,"low",0.0,0.0,0.2125,0.0,0.0145,0.0,0.6657,73.7,25.11,0.1669,0.2091,23.56,13.94,[6,7]],[5.0,"low",0.0139,0.016,0.2286,0.0139,0.0292,0.0053,0.6687,74.7,24.78,0.1679,0.2119,23.56,14.44,[6]],[6.7,"low",0.0342,0.0392,0.2444,0.0342,0.0439,0.0126,0.6718,75.7,24.45,0.1689,0.2147,23.56,14.94,[6]],[8.5,"low",0.0542,0.062,0.2601,0.0542,0.0585,0.0195,0.6747,76.7,24.14,0.1699,0.2175,23.56,15.44,[6]],[10.2,"low",0.074,0.0844,0.2756,0.074,0.0732,0.0259,0.6776,77.7,23.84,0.1709,0.2203,23.56,15.94,[6]],[11.9,"low",0.0935,0.1064,0.2908,0.0935,0.0879,0.0318,0.6805,78.7,23.54,0.1718,0.223,23.56,16.44,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,26.41,59.11,0.1131,0.0888,23.06,-8.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,27.3,57.2,0.1148,0.0918,23.06,-7.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,28.2,55.41,0.1165,0.0947,23.06,-7.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,29.1,53.73,0.1181,0.0977,23.06,-6.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,29.99,52.15,0.1197,0.1007,23.06,-6.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,30.89,50.66,0.1213,0.1036,23.06,-5.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,31.79,49.26,0.1229,0.1066,23.06,-5.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,32.69,47.92,0.1244,0.1095,23.06,-4.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,33.58,46.66,0.126,0.1125,23.06,-4.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,34.48,45.47,0.1274,0.1155,23.06,-3.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,35.38,44.33,0.1289,0.1184,23.06,-3.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,36.28,43.25,0.1304,0.1214,23.06,-2.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,37.18,42.22,0.1318,0.1244,23.06,-2.06,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,38.08,41.24,0.1332,0.1273,23.06,-1.56,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,38.98,40.3,0.1346,0.1303,23.06,-1.06,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,39.89,39.4,0.136,0.1332,23.06,-0.56,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,40.79,38.55,0.1374,0.1362,23.06,-0.06,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,41.69,37.73,0.1387,0.1392,23.06,0.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,42.59,36.94,0.14,0.1421,23.06,0.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,43.49,36.19,0.1414,0.1451,23.06,1.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,44.4,35.46,0.1427,0.148,23.06,1.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,45.3,34.77,0.144,0.151,23.06,2.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,46.2,34.1,0.1452,0.154,23.06,2.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,47.11,33.46,0.1465,0.1569,23.06,3.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,48.01,32.84,0.1477,0.1599,23.06,3.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,48.91,32.24,0.149,0.1628,23.06,4.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,49.82,31.66,0.1502,0.1658,23.06,4.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,50.72,31.11,0.1514,0.1688,23.06,5.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,51.63,30.57,0.1526,0.1717,23.06,5.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6226,52.54,30.05,0.1538,0.1747,23.06,6.44,[6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,53.44,29.55,0.155,0.1776,23.06,6.94,[6,7]],[0.5,"low",0.0,0.0,0.0346,0.0,0.0,0.0,0.6308,54.35,29.07,0.1561,0.1806,23.06,7.44,[6,7]],[0.8,"low",0.0,0.0,0.0543,0.0,0.0,0.0,0.6347,55.25,28.6,0.1573,0.1836,23.06,7.94,[6,7]],[1.1,"low",0.0,0.0,0.0738,0.0,0.0,0.0,0.6386,56.16,28.15,0.1584,0.1865,23.06,8.44,[6,7]],[1.4,"low",0.0,0.0,0.0929,0.0,0.0,0.0,0.6424,57.07,27.71,0.1596,0.1895,23.06,8.94,[6,7]],[1.7,"low",0.0,0.0,0.1117,0.0,0.0,0.0,0.6461,57.97,27.28,0.1607,0.1925,23.06,9.44,[6,7]],[2.0,"low",0.0,0.0,0.1302,0.0,0.0,0.0,0.6497,58.88,26.87,0.1618,0.1954,23.06,9.94,[6,7]],[2.2,"low",0.0,0.0,0.1485,0.0,0.0,0.0,0.6533,59.79,26.47,0.1629,0.1984,23.06,10.44,[6,7]],[2.5,"low",0.0,0.0,0.1665,0.0,0.0,0.0,0.6568,60.7,26.08,0.164,0.2013,23.06,10.94,[6,7]],[2.8,"low",0.0,0.0,0.1842,0.0,0.0,0.0,0.6602,61.6,25.7,0.1651,0.2043,23.06,11.44,[6,7]],[3.0,"low",0.0,0.0,0.2017,0.0,0.0,0.0,0.6636,62.51,25.33,0.1662,0.2073,23.06,11.94,[6,7]],[3.4,"low",0.0016,0.0018,0.2189,0.0016,0.0,0.0007,0.6669,63.42,24.97,0.1673,0.2102,23.06,12.44,[6]],[5.1,"low",0.0233,0.0267,0.2359,0.0233,0.0084,0.0098,0.6701,64.33,24.63,0.1683,0.2132,23.06,12.94,[6]],[7.0,"low",0.0447,0.0511,0.2526,0.0447,0.024,0.0183,0.6733,65.24,24.29,0.1694,0.2161,23.06,13.44,[6]],[8.8,"low",0.0658,0.0751,0.2692,0.0658,0.0396,0.0263,0.6764,66.15,23.96,0.1705,0.2191,23.06,13.94,[6]],[10.6,"low",0.0866,0.0986,0.2854,0.0866,0.0552,0.0338,0.6795,67.05,23.64,0.1715,0.2221,23.06,14.44,[6]],[12.4,"low",0.1072,0.1217,0.3015,0.1072,0.0707,0.0407,0.6825,67.96,23.33,0.1725,0.225,23.06,14.94,[6]],[14.2,"low",0.1275,0.1444,0.3174,0.1275,0.0863,0.0471,0.6855,68.87,23.03,0.1736,0.228,23.06,15.44,[6]],[15.9,"low",0.1475,0.1667,0.3331,0.1475,0.1019,0.053,0.6884,69.78,22.73,0.1746,0.2309,23.06,15.94,[6]],[17.6,"low",0.1673,0.1886,0.3485,0.1673,0.1175,0.0585,0.6912,70.69,22.45,0.1756,0.2339,23.06,16.44,[6]],[19.3,"low",0.1868,0.2101,0.3638,0.1868,0.1331,0.0635,0.694,71.6,22.16,0.1766,0.2369,23.06,16.94,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,23.28,54.56,0.1173,0.0962,22.43,-7.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,24.07,52.8,0.1191,0.0994,22.43,-6.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,24.86,51.15,0.1208,0.1026,22.43,-6.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,25.65,49.6,0.1225,0.1058,22.43,-5.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,26.44,48.14,0.1242,0.1091,22.43,-5.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,27.24,46.77,0.1258,0.1123,22.43,-4.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,28.03,45.47,0.1274,0.1155,22.43,-4.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,28.82,44.24,0.129,0.1187,22.43,-3.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,29.61,43.07,0.1306,0.1219,22.43,-3.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,30.4,41.97,0.1322,0.1251,22.43,-2.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,31.2,40.92,0.1337,0.1283,22.43,-2.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,31.99,39.92,0.1352,0.1315,22.43,-1.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,32.78,38.97,0.1367,0.1347,22.43,-1.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,33.58,38.06,0.1382,0.1379,22.43,-0.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,34.37,37.2,0.1396,0.1411,22.43,-0.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,35.17,36.37,0.141,0.1443,22.43,0.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,35.96,35.58,0.1424,0.1475,22.43,0.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,36.76,34.83,0.1438,0.1508,22.43,1.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,37.55,34.1,0.1452,0.154,22.43,1.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,38.35,33.4,0.1466,0.1572,22.43,2.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,39.14,32.74,0.1479,0.1604,22.43,2.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,39.94,32.09,0.1493,0.1636,22.43,3.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,40.74,31.48,0.1506,0.1668,22.43,3.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,41.53,30.88,0.1519,0.17,22.43,4.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,42.33,30.31,0.1532,0.1732,22.43,4.57,[6,7]],[0.1,"low",0.0,0.0,0.0061,0.0,0.0,0.0,0.625,43.13,29.76,0.1545,0.1764,22.43,5.07,[6,7]],[0.4,"low",0.0,0.0,0.0279,0.0,0.0,0.0,0.6294,43.93,29.23,0.1558,0.1796,22.43,5.57,[6,7]],[0.7,"low",0.0,0.0,0.0494,0.0,0.0,0.0,0.6337,44.72,28.72,0.157,0.1828,22.43,6.07,[6,7]],[1.1,"low",0.0,0.0,0.0705,0.0,0.0,0.0,0.638,45.52,28.22,0.1583,0.186,22.43,6.57,[6,7]],[1.4,"low",0.0,0.0,0.0913,0.0,0.0,0.0,0.6421,46.32,27.74,0.1595,0.1892,22.43,7.07,[6,7]],[1.7,"low",0.0,0.0,0.1117,0.0,0.0,0.0,0.6461,47.12,27.28,0.1607,0.1925,22.43,7.57,[6,7]],[2.0,"low",0.0,0.0,0.1318,0.0,0.0,0.0,0.65,47.92,26.83,0.1619,0.1957,22.43,8.07,[6,7]],[2.3,"low",0.0,0.0,0.1515,0.0,0.0,0.0,0.6539,48.72,26.4,0.1631,0.1989,22.43,8.57,[6,7]],[2.6,"low",0.0,0.0,0.1709,0.0,0.0,0.0,0.6577,49.52,25.98,0.1643,0.2021,22.43,9.07,[6,7]],[2.9,"low",0.0,0.0,0.1901,0.0,0.0,0.0,0.6614,50.31,25.57,0.1655,0.2053,22.43,9.57,[6,7]],[3.1,"low",0.0,0.0,0.2089,0.0,0.0,0.0,0.665,51.11,25.18,0.1667,0.2085,22.43,10.07,[6,7]],[4.1,"low",0.0125,0.0143,0.2274,0.0125,0.0,0.006,0.6685,51.91,24.8,0.1678,0.2117,22.43,10.57,[6]],[5.8,"low",0.0358,0.041,0.2457,0.0358,0.0,0.017,0.672,52.71,24.43,0.169,0.2149,22.43,11.07,[6]],[7.4,"low",0.0588,0.0672,0.2637,0.0588,0.0,0.0272,0.6754,53.51,24.07,0.1701,0.2181,22.43,11.57,[6]],[9.3,"low",0.0815,0.0928,0.2814,0.0815,0.0129,0.0369,0.6787,54.32,23.72,0.1712,0.2213,22.43,12.07,[6]],[11.2,"low",0.1038,0.1179,0.2989,0.1038,0.0297,0.0459,0.682,55.12,23.38,0.1724,0.2245,22.43,12.57,[6]],[13.2,"low",0.1258,0.1425,0.3161,0.1258,0.0466,0.0543,0.6852,55.92,23.05,0.1735,0.2277,22.43,13.07,[6]],[15.1,"low",0.1475,0.1667,0.3331,0.1475,0.0635,0.0621,0.6884,56.72,22.73,0.1746,0.2309,22.43,13.57,[6]],[16.9,"low",0.1689,0.1904,0.3498,0.1689,0.0804,0.0693,0.6914,57.52,22.42,0.1757,0.2341,22.43,14.07,[6]],[18.8,"low",0.19,0.2136,0.3663,0.19,0.0973,0.076,0.6945,58.32,22.12,0.1768,0.2374,22.43,14.57,[6]],[20.6,"low",0.2109,0.2364,0.3826,0.2109,0.1142,0.0822,0.6974,59.12,21.82,0.1778,0.2406,22.43,15.07,[6]],[22.4,"low",0.2314,0.2588,0.3987,0.2314,0.131,0.0879,0.7003,59.92,21.54,0.1789,0.2438,22.43,15.57,[6]],[24.2,"low",0.2517,0.2808,0.4146,0.2517,0.1479,0.093,0.7032,60.73,21.26,0.18,0.247,22.43,16.07,[6]],[25.9,"low",0.2717,0.3024,0.4303,0.2717,0.1648,0.0977,0.706,61.53,20.98,0.181,0.2502,22.43,16.57,[6]],[27.6,"low",0.2915,0.3235,0.4457,0.2915,0.1817,0.102,0.7088,62.33,20.72,0.1821,0.2534,22.43,17.07,[6]],[29.3,"low",0.311,0.3443,0.461,0.311,0.1986,0.1058,0.7115,63.13,20.46,0.1831,0.2566,22.43,17.57,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,20.72,50.66,0.1213,0.1036,21.85,-6.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,21.42,49.03,0.1232,0.1071,21.85,-6.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,22.13,47.5,0.1249,0.1105,21.85,-5.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,22.83,46.06,0.1267,0.114,21.85,-5.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,23.53,44.7,0.1284,0.1174,21.85,-4.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,24.24,43.43,0.1301,0.1209,21.85,-4.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,24.94,42.22,0.1318,0.1244,21.85,-3.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,25.65,41.08,0.1335,0.1278,21.85,-3.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,26.35,40.0,0.1351,0.1313,21.85,-2.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,27.06,38.97,0.1367,0.1347,21.85,-2.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,27.76,38.0,0.1383,0.1382,21.85,-1.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,28.47,37.07,0.1398,0.1416,21.85,-1.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,29.18,36.19,0.1414,0.1451,21.85,-0.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,29.88,35.35,0.1429,0.1485,21.85,-0.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,30.59,34.54,0.1444,0.152,21.85,0.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,31.3,33.77,0.1459,0.1554,21.85,0.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,32.0,33.04,0.1473,0.1589,21.85,1.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,32.71,32.34,0.1488,0.1623,21.85,1.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,33.42,31.66,0.1502,0.1658,21.85,2.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,34.13,31.02,0.1516,0.1693,21.85,2.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,34.84,30.4,0.153,0.1727,21.85,3.15,[6,7]],[0.1,"low",0.0,0.0,0.0044,0.0,0.0,0.0,0.6247,35.55,29.8,0.1544,0.1762,21.85,3.65,[6,7]],[0.4,"low",0.0,0.0,0.0279,0.0,0.0,0.0,0.6294,36.25,29.23,0.1558,0.1796,21.85,4.15,[6,7]],[0.8,"low",0.0,0.0,0.0511,0.0,0.0,0.0,0.6341,36.96,28.68,0.1571,0.1831,21.85,4.65,[6,7]],[1.1,"low",0.0,0.0,0.0738,0.0,0.0,0.0,0.6386,37.67,28.15,0.1584,0.1865,21.85,5.15,[6,7]],[1.4,"low",0.0,0.0,0.096,0.0,0.0,0.0,0.643,38.38,27.63,0.1598,0.19,21.85,5.65,[6,7]],[1.8,"low",0.0,0.0,0.1179,0.0,0.0,0.0,0.6473,39.09,27.14,0.1611,0.1934,21.85,6.15,[6,7]],[2.1,"low",0.0,0.0,0.1394,0.0,0.0,0.0,0.6515,39.8,26.66,0.1624,0.1969,21.85,6.65,[6,7]],[2.4,"low",0.0,0.0,0.1605,0.0,0.0,0.0,0.6556,40.51,26.2,0.1637,0.2003,21.85,7.15,[6,7]],[2.7,"low",0.0,0.0,0.1813,0.0,0.0,0.0,0.6597,41.22,25.76,0.1649,0.2038,21.85,7.65,[6,7]],[3.0,"low",0.0,0.0,0.2017,0.0,0.0,0.0,0.6636,41.93,25.33,0.1662,0.2073,21.85,8.15,[6,7]],[3.6,"low",0.0052,0.006,0.2218,0.0052,0.0,0.0028,0.6674,42.64,24.92,0.1675,0.2107,21.85,8.65,[6]],[5.4,"low",0.0305,0.0349,0.2415,0.0305,0.0,0.0161,0.6712,43.36,24.51,0.1687,0.2142,21.85,9.15,[6]],[7.2,"low",0.0553,0.0632,0.2609,0.0553,0.0,0.0286,0.6749,44.07,24.12,0.1699,0.2176,21.85,9.65,[6]],[8.9,"low",0.0797,0.0908,0.28,0.0797,0.0,0.0404,0.6785,44.78,23.75,0.1712,0.2211,21.85,10.15,[6]],[10.5,"low",0.1038,0.1179,0.2989,0.1038,0.0,0.0514,0.682,45.49,23.38,0.1724,0.2245,21.85,10.65,[6]],[12.4,"low",0.1275,0.1444,0.3174,0.1275,0.0106,0.0618,0.6855,46.2,23.03,0.1736,0.228,21.85,11.15,[6]],[14.5,"low",0.1508,0.1704,0.3357,0.1508,0.0287,0.0715,0.6888,46.91,22.68,0.1747,0.2314,21.85,11.65,[6]],[16.5,"low",0.1738,0.1958,0.3536,0.1738,0.0469,0.0805,0.6921,47.63,22.35,0.1759,0.2349,21.85,12.15,[6]],[18.5,"low",0.1965,0.2207,0.3714,0.1965,0.0651,0.0889,0.6954,48.34,22.03,0.1771,0.2383,21.85,12.65,[6]],[20.5,"low",0.2188,0.2451,0.3888,0.2188,0.0833,0.0967,0.6986,49.05,21.71,0.1783,0.2418,21.85,13.15,[6]],[22.4,"low",0.2408,0.269,0.4061,0.2408,0.1015,0.1039,0.7017,49.76,21.41,0.1794,0.2453,21.85,13.65,[6]],[24.3,"low",0.2625,0.2925,0.423,0.2625,0.1196,0.1105,0.7047,50.48,21.11,0.1806,0.2487,21.85,14.15,[6]],[26.2,"low",0.2839,0.3154,0.4398,0.2839,0.1378,0.1165,0.7077,51.19,20.82,0.1817,0.2522,21.85,14.65,[6]],[28.0,"low",0.305,0.338,0.4563,0.305,0.156,0.1221,0.7106,51.9,20.54,0.1828,0.2556,21.85,15.15,[6]],[29.9,"low",0.3259,0.3601,0.4726,0.3259,0.1742,0.127,0.7135,52.62,20.27,0.1839,0.2591,21.85,15.65,[6]],[31.7,"low",0.3464,0.3817,0.4887,0.3464,0.1924,0.1315,0.7163,53.33,20.0,0.185,0.2625,21.85,16.15,[6]],[33.4,"low",0.3667,0.403,0.5046,0.3667,0.2105,0.1355,0.7191,54.04,19.74,0.1861,0.266,21.85,16.65,[6]],[35.2,"medium",0.3867,0.4239,0.5202,0.3867,0.2287,0.1391,0.7218,54.76,19.49,0.1872,0.2694,21.85,17.15,[]],[36.9,"medium",0.4065,0.4443,0.5357,0.4065,0.2469,0.1422,0.7245,55.47,19.24,0.1883,0.2729,21.85,17.65,[]],[38.6,"medium",0.426,0.4644,0.551,0.426,0.2651,0.1449,0.7271,56.19,19.0,0.1894,0.2763,21.85,18.15,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,20.58,50.45,0.1216,0.1041,21.82,-6.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,21.28,48.82,0.1234,0.1075,21.82,-6.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,21.98,47.29,0.1252,0.111,21.82,-5.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,22.68,45.86,0.1269,0.1145,21.82,-5.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,23.38,44.51,0.1287,0.1179,21.82,-4.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,24.08,43.24,0.1304,0.1214,21.82,-4.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,24.78,42.04,0.1321,0.1249,21.82,-3.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,25.48,40.9,0.1337,0.1284,21.82,-3.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,26.18,39.83,0.1353,0.1318,21.82,-2.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,26.88,38.8,0.1369,0.1353,21.82,-2.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,27.58,37.83,0.1385,0.1388,21.82,-1.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,28.28,36.91,0.1401,0.1422,21.82,-1.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,28.98,36.03,0.1416,0.1457,21.82,-0.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,29.68,35.2,0.1432,0.1492,21.82,-0.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,30.38,34.4,0.1447,0.1526,21.82,0.18,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,31.09,33.63,0.1461,0.1561,21.82,0.68,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,31.79,32.9,0.1476,0.1596,21.82,1.18,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,32.49,32.2,0.1491,0.163,21.82,1.68,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,33.2,31.53,0.1505,0.1665,21.82,2.18,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,33.9,30.89,0.1519,0.17,21.82,2.68,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,34.6,30.27,0.1533,0.1735,21.82,3.18,[6,7]],[0.1,"low",0.0,0.0,0.0096,0.0,0.0,0.0,0.6257,35.31,29.67,0.1547,0.1769,21.82,3.68,[6,7]],[0.5,"low",0.0,0.0,0.0331,0.0,0.0,0.0,0.6305,36.01,29.1,0.1561,0.1804,21.82,4.18,[6,7]],[0.8,"low",0.0,0.0,0.0563,0.0,0.0,0.0,0.6351,36.72,28.55,0.1574,0.1839,21.82,4.68,[6,7]],[1.2,"low",0.0,0.0,0.079,0.0,0.0,0.0,0.6396,37.42,28.03,0.1588,0.1873,21.82,5.18,[6,7]],[1.5,"low",0.0,0.0,0.1012,0.0,0.0,0.0,0.644,38.13,27.52,0.1601,0.1908,21.82,5.68,[6,7]],[1.8,"low",0.0,0.0,0.1231,0.0,0.0,0.0,0.6483,38.83,27.02,0.1614,0.1943,21.82,6.18,[6,7]],[2.2,"low",0.0,0.0,0.1446,0.0,0.0,0.0,0.6525,39.54,26.55,0.1627,0.1977,21.82,6.68,[6,7]],[2.5,"low",0.0,0.0,0.1657,0.0,0.0,0.0,0.6567,40.24,26.09,0.164,0.2012,21.82,7.18,[6,7]],[2.8,"low",0.0,0.0,0.1865,0.0,0.0,0.0,0.6607,40.95,25.65,0.1653,0.2047,21.82,7.68,[6,7]],[3.1,"low",0.0,0.0,0.2069,0.0,0.0,0.0,0.6646,41.65,25.22,0.1665,0.2081,21.82,8.18,[6,7]],[4.1,"low",0.0119,0.0136,0.2269,0.0119,0.0,0.0064,0.6684,42.36,24.81,0.1678,0.2116,21.82,8.68,[6]],[5.9,"low",0.0371,0.0425,0.2467,0.0371,0.0,0.0196,0.6722,43.07,24.41,0.169,0.2151,21.82,9.18,[6]],[7.6,"low",0.0619,0.0707,0.2661,0.0619,0.0,0.032,0.6759,43.77,24.02,0.1703,0.2185,21.82,9.68,[6]],[9.3,"low",0.0864,0.0983,0.2852,0.0864,0.0,0.0437,0.6795,44.48,23.65,0.1715,0.222,21.82,10.18,[6]],[11.0,"low",0.1104,0.1254,0.3041,0.1104,0.0,0.0547,0.683,45.19,23.28,0.1727,0.2255,21.82,10.68,[6]],[13.0,"low",0.1341,0.1518,0.3226,0.1341,0.0135,0.065,0.6864,45.89,22.93,0.1739,0.229,21.82,11.18,[6]],[15.0,"low",0.1575,0.1777,0.3409,0.1575,0.0317,0.0746,0.6898,46.6,22.59,0.1751,0.2324,21.82,11.68,[6]],[17.1,"low",0.1805,0.2031,0.3588,0.1805,0.05,0.0836,0.6931,47.31,22.26,0.1763,0.2359,21.82,12.18,[6]],[19.1,"low",0.2031,0.228,0.3766,0.2031,0.0683,0.0919,0.6963,48.01,21.93,0.1774,0.2394,21.82,12.68,[6]],[21.0,"low",0.2254,0.2523,0.394,0.2254,0.0865,0.0996,0.6995,48.72,21.62,0.1786,0.2428,21.82,13.18,[6]],[22.9,"low",0.2475,0.2762,0.4113,0.2475,0.1048,0.1068,0.7026,49.43,21.32,0.1798,0.2463,21.82,13.68,[6]],[24.9,"low",0.2692,0.2996,0.4282,0.2692,0.123,0.1133,0.7057,50.14,21.02,0.1809,0.2498,21.82,14.18,[6]],[26.7,"low",0.2906,0.3225,0.445,0.2906,0.1413,0.1193,0.7086,50.85,20.73,0.182,0.2532,21.82,14.68,[6]],[28.6,"low",0.3117,0.345,0.4615,0.3117,0.1596,0.1247,0.7116,51.56,20.45,0.1832,0.2567,21.82,15.18,[6]],[30.4,"low",0.3325,0.3671,0.4778,0.3325,0.1778,0.1296,0.7144,52.26,20.18,0.1843,0.2602,21.82,15.68,[6]],[32.2,"low",0.3531,0.3887,0.4939,0.3531,0.1961,0.134,0.7173,52.97,19.91,0.1854,0.2636,21.82,16.18,[6]],[34.0,"low",0.3734,0.4099,0.5098,0.3734,0.2143,0.138,0.72,53.68,19.65,0.1865,0.2671,21.82,16.68,[6]],[35.7,"medium",0.3934,0.4307,0.5254,0.3934,0.2326,0.1415,0.7227,54.39,19.4,0.1876,0.2706,21.82,17.18,[]],[37.4,"medium",0.4132,0.4512,0.5409,0.4132,0.2508,0.1445,0.7254,55.1,19.16,0.1887,0.2741,21.82,17.68,[]],[39.1,"medium",0.4327,0.4712,0.5562,0.4327,0.2691,0.1471,0.728,55.81,18.92,0.1898,0.2775,21.82,18.18,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,18.59,47.29,0.1252,0.111,21.33,-6.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,19.22,45.76,0.1271,0.1147,21.33,-5.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,19.85,44.33,0.1289,0.1184,21.33,-5.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,20.48,42.99,0.1307,0.1221,21.33,-4.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,21.11,41.72,0.1325,0.1258,21.33,-4.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,21.75,40.53,0.1343,0.1295,21.33,-3.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,22.38,39.4,0.136,0.1332,21.33,-3.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,23.01,38.34,0.1377,0.1369,21.33,-2.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,23.64,37.33,0.1394,0.1406,21.33,-2.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,24.28,36.37,0.141,0.1443,21.33,-1.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,24.91,35.46,0.1427,0.148,21.33,-1.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,25.54,34.6,0.1443,0.1517,21.33,-0.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,26.18,33.77,0.1459,0.1554,21.33,-0.33,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,26.81,32.99,0.1474,0.1591,21.33,0.17,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,27.44,32.24,0.149,0.1628,21.33,0.67,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,28.08,31.52,0.1505,0.1665,21.33,1.17,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,28.71,30.84,0.152,0.1702,21.33,1.67,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,29.35,30.18,0.1535,0.1739,21.33,2.17,[6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,29.98,29.55,0.155,0.1776,21.33,2.67,[6,7]],[0.6,"low",0.0,0.0,0.0396,0.0,0.0,0.0,0.6318,30.62,28.95,0.1564,0.1813,21.33,3.17,[6,7]],[1.0,"low",0.0,0.0,0.0641,0.0,0.0,0.0,0.6367,31.25,28.37,0.1579,0.185,21.33,3.67,[6,7]],[1.3,"low",0.0,0.0,0.0881,0.0,0.0,0.0,0.6414,31.89,27.81,0.1593,0.1887,21.33,4.17,[6,7]],[1.7,"low",0.0,0.0,0.1117,0.0,0.0,0.0,0.6461,32.53,27.28,0.1607,0.1925,21.33,4.67,[6,7]],[2.0,"low",0.0,0.0,0.1348,0.0,0.0,0.0,0.6506,33.16,26.77,0.1621,0.1962,21.33,5.17,[6,7]],[2.4,"low",0.0,0.0,0.1575,0.0,0.0,0.0,0.6551,33.8,26.27,0.1635,0.1999,21.33,5.67,[6,7]],[2.7,"low",0.0,0.0,0.1798,0.0,0.0,0.0,0.6594,34.44,25.79,0.1649,0.2036,21.33,6.17,[6,7]],[3.0,"low",0.0,0.0,0.2017,0.0,0.0,0.0,0.6636,35.07,25.33,0.1662,0.2073,21.33,6.67,[6,7]],[3.8,"low",0.007,0.0081,0.2232,0.007,0.0,0.0041,0.6677,35.71,24.89,0.1675,0.211,21.33,7.17,[6]],[5.7,"low",0.034,0.039,0.2443,0.034,0.0,0.0194,0.6717,36.35,24.46,0.1689,0.2147,21.33,7.67,[6]],[7.6,"low",0.0606,0.0691,0.265,0.0606,0.0,0.0339,0.6757,36.98,24.04,0.1702,0.2184,21.33,8.17,[6]],[9.4,"low",0.0866,0.0986,0.2854,0.0866,0.0,0.0476,0.6795,37.62,23.64,0.1715,0.2221,21.33,8.67,[6]],[11.2,"low",0.1123,0.1274,0.3055,0.1123,0.0,0.0605,0.6832,38.26,23.25,0.1728,0.2258,21.33,9.17,[6]],[12.9,"low",0.1375,0.1556,0.3253,0.1375,0.0,0.0726,0.6869,38.9,22.88,0.1741,0.2295,21.33,9.67,[6]],[14.7,"low",0.1624,0.1832,0.3447,0.1624,0.0014,0.0839,0.6905,39.54,22.52,0.1753,0.2332,21.33,10.17,[6]],[16.8,"low",0.1868,0.2101,0.3638,0.1868,0.0209,0.0946,0.694,40.17,22.16,0.1766,0.2369,21.33,10.67,[6]],[19.0,"low",0.2109,0.2364,0.3826,0.2109,0.0403,0.1045,0.6974,40.81,21.82,0.1778,0.2406,21.33,11.17,[6]],[21.1,"low",0.2346,0.2622,0.4012,0.2346,0.0598,0.1137,0.7008,41.45,21.49,0.1791,0.2443,21.33,11.67,[6]],[23.1,"low",0.2579,0.2875,0.4194,0.2579,0.0793,0.1222,0.7041,42.09,21.17,0.1803,0.248,21.33,12.17,[6]],[25.2,"low",0.2809,0.3122,0.4374,0.2809,0.0988,0.1301,0.7073,42.73,20.86,0.1815,0.2517,21.33,12.67,[6]],[27.2,"low",0.3035,0.3364,0.4551,0.3035,0.1183,0.1374,0.7104,43.37,20.56,0.1827,0.2554,21.33,13.17,[6]],[29.1,"low",0.3259,0.3601,0.4726,0.3259,0.1377,0.144,0.7135,44.01,20.27,0.1839,0.2591,21.33,13.67,[6]],[31.1,"low",0.3479,0.3833,0.4898,0.3479,0.1572,0.1501,0.7165,44.65,19.98,0.1851,0.2628,21.33,14.17,[6]],[33.0,"low",0.3696,0.406,0.5068,0.3696,0.1767,0.1556,0.7195,45.29,19.7,0.1863,0.2665,21.33,14.67,[6]],[34.8,"low",0.391,0.4283,0.5236,0.391,0.1962,0.1605,0.7224,45.93,19.43,0.1875,0.2702,21.33,15.17,[6]],[36.7,"medium",0.4121,0.4501,0.5401,0.4121,0.2157,0.1649,0.7252,46.57,19.17,0.1886,0.2739,21.33,15.67,[]],[38.5,"medium",0.4329,0.4715,0.5564,0.4329,0.2351,0.1688,0.728,47.21,18.91,0.1898,0.2776,21.33,16.17,[]],[40.3,"medium",0.4535,0.4925,0.5725,0.4535,0.2546,0.1722,0.7308,47.85,18.67,0.1909,0.2813,21.33,16.67,[]],[42.1,"medium",0.4738,0.5131,0.5883,0.4738,0.2741,0.1751,0.7334,48.49,18.42,0.1921,0.285,21.33,17.17,[]],[43.9,"medium",0.4938,0.5333,0.604,0.4938,0.2936,0.1776,0.7361,49.13,18.19,0.1932,0.2887,21.33,17.67,[]],[45.6,"medium",0.5136,0.5531,0.6195,0.5136,0.313,0.1796,0.7386,49.77,17.96,0.1943,0.2924,21.33,18.17,[]],[47.3,"medium",0.5331,0.5725,0.6347,0.5331,0.3325,0.1813,0.7412,50.41,17.73,0.1954,0.2961,21.33,18.67,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,16.8,44.33,0.1289,0.1184,20.86,-5.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,17.37,42.9,0.1309,0.1224,20.86,-5.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,17.94,41.56,0.1328,0.1263,20.86,-4.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,18.51,40.3,0.1346,0.1303,20.86,-4.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,19.08,39.11,0.1365,0.1342,20.86,-3.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,19.65,38.0,0.1383,0.1382,20.86,-3.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,20.22,36.94,0.14,0.1421,20.86,-2.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,20.79,35.94,0.1418,0.1461,20.86,-2.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,21.36,35.0,0.1435,0.15,20.86,-1.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,21.93,34.1,0.1452,0.154,20.86,-1.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,22.5,33.25,0.1469,0.1579,20.86,-0.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,23.08,32.44,0.1486,0.1619,20.86,-0.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,23.65,31.66,0.1502,0.1658,20.86,0.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,24.22,30.93,0.1518,0.1698,20.86,0.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,24.79,30.22,0.1534,0.1737,20.86,1.14,[6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,25.37,29.55,0.155,0.1776,20.86,1.64,[6,7]],[0.6,"low",0.0,0.0,0.0412,0.0,0.0,0.0,0.6321,25.94,28.91,0.1565,0.1816,20.86,2.14,[6,7]],[1.0,"low",0.0,0.0,0.0673,0.0,0.0,0.0,0.6373,26.51,28.3,0.1581,0.1855,20.86,2.64,[6,7]],[1.4,"low",0.0,0.0,0.0929,0.0,0.0,0.0,0.6424,27.09,27.71,0.1596,0.1895,20.86,3.14,[6,7]],[1.8,"low",0.0,0.0,0.1179,0.0,0.0,0.0,0.6473,27.66,27.14,0.1611,0.1934,20.86,3.64,[6,7]],[2.1,"low",0.0,0.0,0.1424,0.0,0.0,0.0,0.6521,28.24,26.6,0.1626,0.1974,20.86,4.14,[6,7]],[2.5,"low",0.0,0.0,0.1665,0.0,0.0,0.0,0.6568,28.81,26.08,0.164,0.2013,20.86,4.64,[6,7]],[2.9,"low",0.0,0.0,0.1901,0.0,0.0,0.0,0.6614,29.39,25.57,0.1655,0.2053,20.86,5.14,[6,7]],[3.2,"low",0.0,0.0,0.2132,0.0,0.0,0.0,0.6658,29.96,25.09,0.1669,0.2092,20.86,5.64,[6,7]],[4.9,"low",0.0233,0.0267,0.2359,0.0233,0.0,0.0143,0.6701,30.54,24.63,0.1683,0.2132,20.86,6.14,[6]],[7.0,"low",0.0518,0.0592,0.2582,0.0518,0.0,0.0311,0.6744,31.11,24.18,0.1698,0.2171,20.86,6.64,[6]],[8.9,"low",0.0797,0.0908,0.28,0.0797,0.0,0.0471,0.6785,31.69,23.75,0.1712,0.2211,20.86,7.14,[6]],[10.9,"low",0.1072,0.1217,0.3015,0.1072,0.0,0.0623,0.6825,32.26,23.33,0.1725,0.225,20.86,7.64,[6]],[12.8,"low",0.1342,0.1519,0.3226,0.1342,0.0,0.0765,0.6864,32.84,22.93,0.1739,0.229,20.86,8.14,[6]],[14.6,"low",0.1607,0.1813,0.3434,0.1607,0.0,0.09,0.6903,33.41,22.54,0.1753,0.2329,20.86,8.64,[6]],[16.4,"low",0.1868,0.2101,0.3638,0.1868,0.0,0.1026,0.694,33.99,22.16,0.1766,0.2369,20.86,9.14,[6]],[18.3,"low",0.2125,0.2382,0.3839,0.2125,0.006,0.1144,0.6977,34.57,21.8,0.1779,0.2408,20.86,9.64,[6]],[20.6,"low",0.2377,0.2656,0.4036,0.2377,0.0268,0.1254,0.7012,35.14,21.45,0.1792,0.2448,20.86,10.14,[6]],[22.8,"low",0.2625,0.2925,0.423,0.2625,0.0476,0.1357,0.7047,35.72,21.11,0.1806,0.2487,20.86,10.64,[6]],[24.9,"low",0.287,0.3187,0.4422,0.287,0.0684,0.1453,0.7081,36.3,20.78,0.1818,0.2527,20.86,11.14,[6]],[27.1,"low",0.311,0.3443,0.461,0.311,0.0891,0.1541,0.7115,36.87,20.46,0.1831,0.2566,20.86,11.64,[6]],[29.2,"low",0.3347,0.3694,0.4795,0.3347,0.1099,0.1623,0.7147,37.45,20.15,0.1844,0.2605,20.86,12.14,[6]],[31.2,"low",0.3581,0.3939,0.4978,0.3581,0.1307,0.1697,0.7179,38.03,19.85,0.1857,0.2645,20.86,12.64,[6]],[33.3,"low",0.381,0.4179,0.5158,0.381,0.1515,0.1765,0.7211,38.6,19.56,0.1869,0.2684,20.86,13.14,[6]],[35.3,"medium",0.4037,0.4414,0.5335,0.4037,0.1723,0.1827,0.7241,39.18,19.27,0.1882,0.2724,20.86,13.64,[]],[37.2,"medium",0.426,0.4644,0.551,0.426,0.193,0.1883,0.7271,39.76,19.0,0.1894,0.2763,20.86,14.14,[]],[39.2,"medium",0.448,0.487,0.5682,0.448,0.2138,0.1933,0.73,40.34,18.73,0.1906,0.2803,20.86,14.64,[]],[41.1,"medium",0.4698,0.509,0.5852,0.4698,0.2346,0.1977,0.7329,40.91,18.47,0.1918,0.2842,20.86,15.14,[]],[43.0,"medium",0.4912,0.5306,0.6019,0.4912,0.2554,0.2016,0.7357,41.49,18.22,0.193,0.2882,20.86,15.64,[]],[44.8,"medium",0.5123,0.5518,0.6184,0.5123,0.2761,0.205,0.7385,42.07,17.97,0.1942,0.2921,20.86,16.14,[]],[46.7,"medium",0.5331,0.5725,0.6347,0.5331,0.2969,0.2078,0.7412,42.65,17.73,0.1954,0.2961,20.86,16.64,[]],[48.5,"medium",0.5537,0.5929,0.6508,0.5537,0.3177,0.2102,0.7438,43.23,17.5,0.1966,0.3,20.86,17.14,[]],[50.3,"medium",0.574,0.6128,0.6667,0.574,0.3385,0.2121,0.7464,43.81,17.27,0.1978,0.304,20.86,17.64,[]],[52.0,"medium",0.594,0.6324,0.6824,0.594,0.3593,0.2136,0.749,44.38,17.05,0.1989,0.3079,20.86,18.14,[]],[53.7,"medium",0.6137,0.6515,0.6978,0.6137,0.38,0.2147,0.7515,44.96,16.83,0.2001,0.3119,20.86,18.64,[]],[55.5,"medium",0.6333,0.6703,0.7131,0.6333,0.4008,0.2154,0.7539,45.54,16.62,0.2012,0.3158,20.86,19.14,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,15.27,41.72,0.1325,0.1258,20.42,-5.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,15.79,40.38,0.1345,0.13,20.42,-4.92,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,16.3,39.11,0.1365,0.1342,20.42,-4.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,16.82,37.93,0.1384,0.1384,20.42,-3.92,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,17.34,36.81,0.1403,0.1426,20.42,-3.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,17.86,35.76,0.1421,0.1468,20.42,-2.92,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,18.38,34.77,0.144,0.151,20.42,-2.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,18.9,33.83,0.1458,0.1552,20.42,-1.92,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,19.42,32.94,0.1475,0.1594,20.42,-1.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,19.94,32.09,0.1493,0.1636,20.42,-0.92,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,20.46,31.29,0.151,0.1678,20.42,-0.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,20.98,30.53,0.1527,0.172,20.42,0.08,[1,6,7]],[0.1,"low",0.0,0.0,0.0044,0.0,0.0,0.0,0.6247,21.5,29.8,0.1544,0.1762,20.42,0.58,[6,7]],[0.5,"low",0.0,0.0,0.0329,0.0,0.0,0.0,0.6304,22.02,29.11,0.156,0.1804,20.42,1.08,[6,7]],[0.9,"low",0.0,0.0,0.0608,0.0,0.0,0.0,0.636,22.54,28.45,0.1577,0.1846,20.42,1.58,[6,7]],[1.3,"low",0.0,0.0,0.0881,0.0,0.0,0.0,0.6414,23.06,27.81,0.1593,0.1887,20.42,2.08,[6,7]],[1.7,"low",0.0,0.0,0.1148,0.0,0.0,0.0,0.6467,23.58,27.21,0.1609,0.1929,20.42,2.58,[6,7]],[2.1,"low",0.0,0.0,0.1409,0.0,0.0,0.0,0.6518,24.1,26.63,0.1625,0.1971,20.42,3.08,[6,7]],[2.5,"low",0.0,0.0,0.1665,0.0,0.0,0.0,0.6568,24.62,26.08,0.164,0.2013,20.42,3.58,[6,7]],[2.9,"low",0.0,0.0,0.1915,0.0,0.0,0.0,0.6616,25.15,25.54,0.1656,0.2055,20.42,4.08,[6,7]],[3.2,"low",0.0,0.0,0.216,0.0,0.0,0.0,0.6664,25.67,25.03,0.1671,0.2097,20.42,4.58,[6,7]],[5.3,"low",0.0287,0.0329,0.2401,0.0287,0.0,0.0184,0.6709,26.19,24.54,0.1686,0.2139,20.42,5.08,[6]],[7.5,"low",0.0588,0.0672,0.2637,0.0588,0.0,0.0372,0.6754,26.71,24.07,0.1701,0.2181,20.42,5.58,[6]],[9.6,"low",0.0884,0.1006,0.2868,0.0884,0.0,0.055,0.6798,27.24,23.62,0.1716,0.2223,20.42,6.08,[6]],[11.6,"low",0.1174,0.1331,0.3095,0.1174,0.0,0.0718,0.684,27.76,23.18,0.173,0.2265,20.42,6.58,[6]],[13.6,"low",0.1459,0.1649,0.3318,0.1459,0.0,0.0877,0.6881,28.28,22.76,0.1745,0.2307,20.42,7.08,[6]],[15.6,"low",0.1738,0.1958,0.3536,0.1738,0.0,0.1028,0.6921,28.8,22.35,0.1759,0.2349,20.42,7.58,[6]],[17.5,"low",0.2013,0.226,0.3751,0.2013,0.0,0.1169,0.6961,29.33,21.96,0.1773,0.2391,20.42,8.08,[6]],[19.3,"low",0.2283,0.2554,0.3963,0.2283,0.0,0.1302,0.6999,29.85,21.58,0.1788,0.2433,20.42,8.58,[6]],[21.3,"low",0.2548,0.2841,0.417,0.2548,0.0063,0.1426,0.7036,30.37,21.21,0.1801,0.2475,20.42,9.08,[6]],[23.6,"low",0.2809,0.3122,0.4374,0.2809,0.0283,0.1542,0.7073,30.9,20.86,0.1815,0.2517,20.42,9.58,[6]],[25.9,"low",0.3065,0.3396,0.4575,0.3065,0.0504,0.165,0.7109,31.42,20.52,0.1829,0.2559,20.42,10.08,[6]],[28.2,"low",0.3318,0.3663,0.4772,0.3318,0.0725,0.1751,0.7143,31.95,20.19,0.1842,0.2601,20.42,10.58,[6]],[30.4,"low",0.3566,0.3924,0.4967,0.3566,0.0946,0.1844,0.7177,32.47,19.87,0.1856,0.2642,20.42,11.08,[6]],[32.6,"low",0.381,0.4179,0.5158,0.381,0.1166,0.1929,0.7211,32.99,19.56,0.1869,0.2684,20.42,11.58,[6]],[34.7,"low",0.4051,0.4429,0.5346,0.4051,0.1387,0.2007,0.7243,33.52,19.26,0.1882,0.2726,20.42,12.08,[6]],[36.8,"medium",0.4288,0.4673,0.5531,0.4288,0.1608,0.2079,0.7275,34.04,18.96,0.1896,0.2768,20.42,12.58,[]],[38.9,"medium",0.4521,0.4911,0.5714,0.4521,0.1829,0.2143,0.7306,34.57,18.68,0.1909,0.281,20.42,13.08,[]],[40.9,"medium",0.4751,0.5145,0.5894,0.4751,0.2049,0.2201,0.7336,35.09,18.41,0.1921,0.2852,20.42,13.58,[]],[42.9,"medium",0.4978,0.5373,0.6071,0.4978,0.227,0.2253,0.7366,35.62,18.14,0.1934,0.2894,20.42,14.08,[]],[44.9,"medium",0.5201,0.5596,0.6246,0.5201,0.2491,0.2299,0.7395,36.14,17.88,0.1947,0.2936,20.42,14.58,[]],[46.8,"medium",0.5421,0.5815,0.6418,0.5421,0.2712,0.2339,0.7423,36.67,17.63,0.1959,0.2978,20.42,15.08,[]],[48.8,"medium",0.5638,0.6029,0.6588,0.5638,0.2933,0.2373,0.7451,37.19,17.38,0.1972,0.302,20.42,15.58,[]],[50.6,"medium",0.5852,0.6238,0.6755,0.5852,0.3153,0.2402,0.7479,37.72,17.15,0.1984,0.3062,20.42,16.08,[]],[52.5,"medium",0.6064,0.6444,0.692,0.6064,0.3374,0.2426,0.7505,38.24,16.91,0.1997,0.3104,20.42,16.58,[]],[54.3,"medium",0.6272,0.6645,0.7083,0.6272,0.3595,0.2445,0.7531,38.77,16.69,0.2009,0.3146,20.42,17.08,[]],[56.2,"medium",0.6477,0.6842,0.7244,0.6477,0.3816,0.2459,0.7557,39.29,16.47,0.2021,0.3188,20.42,17.58,[]],[58.0,"medium",0.668,0.7035,0.7403,0.668,0.4036,0.2469,0.7582,39.82,16.26,0.2033,0.323,20.42,18.08,[]],[59.7,"medium",0.6881,0.7224,0.756,0.6881,0.4257,0.2474,0.7607,40.35,16.05,0.2045,0.3272,20.42,18.58,[]],[61.5,"medium",0.7078,0.741,0.7714,0.7078,0.4478,0.2476,0.7631,40.87,15.84,0.2057,0.3314,20.42,19.08,[]],[63.2,"medium",0.7274,0.7592,0.7867,0.7274,0.4699,0.2473,0.7655,41.4,15.65,0.2069,0.3356,20.42,19.58,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,13.96,39.4,0.136,0.1332,20.01,-5.01,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,14.43,38.13,0.138,0.1377,20.01,-4.51,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,14.9,36.94,0.14,0.1421,20.01,-4.01,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,15.38,35.82,0.142,0.1466,20.01,-3.51,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,15.85,34.77,0.144,0.151,20.01,-3.01,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,16.32,33.78,0.1459,0.1554,20.01,-2.51,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,16.8,32.84,0.1477,0.1599,20.01,-2.01,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,17.27,31.95,0.1496,0.1643,20.01,-1.51,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,17.75,31.11,0.1514,0.1688,20.01,-1.01,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,18.22,30.31,0.1532,0.1732,20.01,-0.51,[1,3]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,18.7,29.55,0.155,0.1776,20.01,-0.01,[1,3]],[0.7,"low",0.0,0.0,0.0445,0.0,0.0,0.0,0.6328,19.17,28.83,0.1567,0.1821,20.01,0.49,[1,6,7]],[1.1,"low",0.0,0.0,0.0738,0.0,0.0,0.0,0.6386,19.65,28.15,0.1584,0.1865,20.01,0.99,[6,7]],[1.5,"low",0.0,0.0,0.1023,0.0,0.0,0.0,0.6442,20.13,27.49,0.1601,0.191,20.01,1.49,[6,7]],[2.0,"low",0.0,0.0,0.1302,0.0,0.0,0.0,0.6497,20.6,26.87,0.1618,0.1954,20.01,1.99,[6,7]],[2.4,"low",0.0,0.0,0.1575,0.0,0.0,0.0,0.6551,21.08,26.27,0.1635,0.1999,20.01,2.49,[6,7]],[2.8,"low",0.0,0.0,0.1842,0.0,0.0,0.0,0.6602,21.55,25.7,0.1651,0.2043,20.01,2.99,[6,7]],[3.2,"low",0.0,0.0,0.2103,0.0,0.0,0.0,0.6653,22.03,25.15,0.1667,0.2087,20.01,3.49,[6,7]],[4.9,"low",0.0233,0.0267,0.2359,0.0233,0.0,0.0156,0.6701,22.51,24.63,0.1683,0.2132,20.01,3.99,[6]],[7.2,"low",0.0553,0.0632,0.2609,0.0553,0.0,0.0366,0.6749,22.98,24.12,0.1699,0.2176,20.01,4.49,[6]],[9.5,"low",0.0866,0.0986,0.2854,0.0866,0.0,0.0565,0.6795,23.46,23.64,0.1715,0.2221,20.01,4.99,[6]],[11.7,"low",0.1174,0.1331,0.3095,0.1174,0.0,0.0754,0.684,23.94,23.18,0.173,0.2265,20.01,5.49,[6]],[13.8,"low",0.1475,0.1667,0.3331,0.1475,0.0,0.0932,0.6884,24.42,22.73,0.1746,0.2309,20.01,5.99,[6]],[15.9,"low",0.1771,0.1994,0.3562,0.1771,0.0,0.1101,0.6926,24.89,22.3,0.1761,0.2354,20.01,6.49,[6]],[17.9,"low",0.2061,0.2312,0.3789,0.2061,0.0,0.1261,0.6968,25.37,21.89,0.1776,0.2398,20.01,6.99,[6]],[19.8,"low",0.2346,0.2622,0.4012,0.2346,0.0,0.1411,0.7008,25.85,21.49,0.1791,0.2443,20.01,7.49,[6]],[21.8,"low",0.2625,0.2925,0.423,0.2625,0.0,0.1552,0.7047,26.33,21.11,0.1806,0.2487,20.01,7.99,[6]],[23.7,"low",0.29,0.3219,0.4445,0.29,0.002,0.1684,0.7086,26.81,20.74,0.182,0.2531,20.01,8.49,[6]],[26.1,"low",0.317,0.3506,0.4657,0.317,0.0254,0.1808,0.7123,27.28,20.38,0.1835,0.2576,20.01,8.99,[6]],[28.5,"low",0.3435,0.3787,0.4864,0.3435,0.0488,0.1923,0.7159,27.76,20.04,0.1849,0.262,20.01,9.49,[6]],[30.8,"low",0.3696,0.406,0.5068,0.3696,0.0721,0.2029,0.7195,28.24,19.7,0.1863,0.2665,20.01,9.99,[6]],[33.1,"low",0.3952,0.4327,0.5269,0.3952,0.0955,0.2128,0.723,28.72,19.38,0.1877,0.2709,20.01,10.49,[6]],[35.4,"medium",0.4205,0.4587,0.5466,0.4205,0.1189,0.2219,0.7264,29.2,19.07,0.1891,0.2754,20.01,10.99,[]],[37.6,"medium",0.4453,0.4842,0.566,0.4453,0.1423,0.2302,0.7297,29.68,18.76,0.1905,0.2798,20.01,11.49,[]],[39.8,"medium",0.4698,0.509,0.5852,0.4698,0.1656,0.2378,0.7329,30.16,18.47,0.1918,0.2842,20.01,11.99,[]],[41.9,"medium",0.4938,0.5333,0.604,0.4938,0.189,0.2447,0.7361,30.64,18.19,0.1932,0.2887,20.01,12.49,[]],[44.0,"medium",0.5175,0.557,0.6225,0.5175,0.2124,0.2509,0.7392,31.12,17.91,0.1945,0.2931,20.01,12.99,[]],[46.1,"medium",0.5408,0.5802,0.6408,0.5408,0.2358,0.2564,0.7422,31.6,17.64,0.1959,0.2976,20.01,13.49,[]],[48.1,"medium",0.5638,0.6029,0.6588,0.5638,0.2591,0.2612,0.7451,32.07,17.38,0.1972,0.302,20.01,13.99,[]],[50.2,"medium",0.5865,0.6251,0.6765,0.5865,0.2825,0.2655,0.748,32.55,17.13,0.1985,0.3064,20.01,14.49,[]],[52.1,"medium",0.6088,0.6468,0.694,0.6088,0.3059,0.2691,0.7508,33.03,16.89,0.1998,0.3109,20.01,14.99,[]],[54.1,"medium",0.6308,0.668,0.7112,0.6308,0.3293,0.2722,0.7536,33.51,16.65,0.2011,0.3153,20.01,15.49,[]],[56.0,"medium",0.6525,0.6888,0.7282,0.6525,0.3526,0.2747,0.7563,33.99,16.42,0.2024,0.3198,20.01,15.99,[]],[57.9,"medium",0.674,0.7091,0.7449,0.674,0.376,0.2766,0.7589,34.47,16.19,0.2036,0.3242,20.01,16.49,[]],[59.8,"medium",0.6951,0.729,0.7614,0.6951,0.3994,0.2781,0.7615,34.96,15.97,0.2049,0.3286,20.01,16.99,[]],[61.6,"medium",0.7159,0.7485,0.7777,0.7159,0.4228,0.2791,0.7641,35.44,15.76,0.2062,0.3331,20.01,17.49,[]],[63.5,"medium",0.7365,0.7676,0.7938,0.7365,0.4461,0.2796,0.7666,35.92,15.55,0.2074,0.3375,20.01,17.99,[]],[65.3,"critical",0.7567,0.7863,0.8097,0.7567,0.4695,0.2797,0.769,36.4,15.35,0.2086,0.342,20.01,18.49,[]],[67.0,"critical",0.7768,0.8047,0.8254,0.7768,0.4929,0.2793,0.7714,36.88,15.16,0.2099,0.3464,20.01,18.99,[]],[68.8,"critical",0.7965,0.8226,0.8408,0.7965,0.5163,0.2786,0.7737,37.36,14.96,0.2111,0.3509,20.01,19.49,[]],[70.5,"critical",0.8161,0.8403,0.8561,0.8161,0.5396,0.2775,0.776,37.84,14.78,0.2123,0.3553,20.01,19.99,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,12.82,37.33,0.1394,0.1406,19.64,-4.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,13.25,36.13,0.1415,0.1453,19.64,-4.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,13.69,35.0,0.1435,0.15,19.64,-3.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,14.12,33.94,0.1455,0.1547,19.64,-3.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,14.56,32.94,0.1475,0.1594,19.64,-2.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,14.99,32.0,0.1495,0.1641,19.64,-2.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,15.43,31.11,0.1514,0.1688,19.64,-1.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,15.86,30.27,0.1533,0.1735,19.64,-1.14,[1,3]],[0.3,"low",0.0,0.0,0.0179,0.0,0.0,0.0,0.6274,16.3,29.47,0.1552,0.1781,19.64,-0.64,[1,3]],[0.7,"low",0.0,0.0,0.0494,0.0,0.0,0.0,0.6337,16.74,28.72,0.157,0.1828,19.64,-0.14,[1,3]],[1.2,"low",0.0,0.0,0.0802,0.0,0.0,0.0,0.6399,17.17,28.0,0.1588,0.1875,19.64,0.36,[1,6,7]],[1.7,"low",0.0,0.0,0.1101,0.0,0.0,0.0,0.6458,17.61,27.31,0.1606,0.1922,19.64,0.86,[1,6,7]],[2.1,"low",0.0,0.0,0.1394,0.0,0.0,0.0,0.6515,18.05,26.66,0.1624,0.1969,19.64,1.36,[6,7]],[2.5,"low",0.0,0.0,0.168,0.0,0.0,0.0,0.6571,18.48,26.04,0.1641,0.2016,19.64,1.86,[6,7]],[2.9,"low",0.0,0.0,0.1959,0.0,0.0,0.0,0.6625,18.92,25.45,0.1658,0.2063,19.64,2.36,[6,7]],[3.8,"low",0.007,0.0081,0.2232,0.007,0.0,0.0049,0.6677,19.36,24.89,0.1675,0.211,19.64,2.86,[6]],[6.2,"low",0.0412,0.0471,0.2499,0.0412,0.0,0.0284,0.6728,19.8,24.35,0.1692,0.2156,19.64,3.36,[6]],[8.6,"low",0.0745,0.085,0.276,0.0745,0.0,0.0507,0.6777,20.23,23.83,0.1709,0.2203,19.64,3.86,[6]],[11.0,"low",0.1072,0.1217,0.3015,0.1072,0.0,0.0719,0.6825,20.67,23.33,0.1725,0.225,19.64,4.36,[6]],[13.2,"low",0.1392,0.1575,0.3266,0.1392,0.0,0.0921,0.6872,21.11,22.86,0.1742,0.2297,19.64,4.86,[6]],[15.4,"low",0.1706,0.1922,0.3511,0.1706,0.0,0.1112,0.6917,21.55,22.4,0.1758,0.2344,19.64,5.36,[6]],[17.6,"low",0.2013,0.226,0.3751,0.2013,0.0,0.1292,0.6961,21.99,21.96,0.1773,0.2391,19.64,5.86,[6]],[19.7,"low",0.2314,0.2588,0.3987,0.2314,0.0,0.1463,0.7003,22.43,21.54,0.1789,0.2438,19.64,6.36,[6]],[21.7,"low",0.261,0.2908,0.4218,0.261,0.0,0.1623,0.7045,22.86,21.13,0.1805,0.2485,19.64,6.86,[6]],[23.7,"low",0.29,0.3219,0.4445,0.29,0.0,0.1774,0.7086,23.3,20.74,0.182,0.2531,19.64,7.36,[6]],[25.7,"low",0.3185,0.3522,0.4668,0.3185,0.0,0.1916,0.7125,23.74,20.36,0.1835,0.2578,19.64,7.86,[6]],[28.0,"low",0.3464,0.3817,0.4887,0.3464,0.0179,0.2048,0.7163,24.18,20.0,0.185,0.2625,19.64,8.36,[6]],[30.5,"low",0.3739,0.4105,0.5102,0.3739,0.0426,0.2172,0.7201,24.62,19.65,0.1865,0.2672,19.64,8.86,[6]],[32.9,"low",0.4009,0.4385,0.5313,0.4009,0.0672,0.2286,0.7237,25.06,19.31,0.188,0.2719,19.64,9.36,[6]],[35.3,"medium",0.4274,0.4659,0.552,0.4274,0.0919,0.2392,0.7273,25.5,18.98,0.1895,0.2766,19.64,9.86,[]],[37.6,"medium",0.4535,0.4925,0.5725,0.4535,0.1166,0.249,0.7308,25.94,18.67,0.1909,0.2813,19.64,10.36,[]],[39.9,"medium",0.4792,0.5185,0.5925,0.4792,0.1413,0.258,0.7341,26.38,18.36,0.1924,0.286,19.64,10.86,[]],[42.2,"medium",0.5044,0.5439,0.6123,0.5044,0.1659,0.2662,0.7375,26.82,18.06,0.1938,0.2906,19.64,11.36,[]],[44.4,"medium",0.5292,0.5687,0.6317,0.5292,0.1906,0.2736,0.7407,27.26,17.78,0.1952,0.2953,19.64,11.86,[]],[46.6,"medium",0.5537,0.5929,0.6508,0.5537,0.2153,0.2803,0.7438,27.7,17.5,0.1966,0.3,19.64,12.36,[]],[48.8,"medium",0.5777,0.6165,0.6696,0.5777,0.24,0.2863,0.7469,28.14,17.23,0.198,0.3047,19.64,12.86,[]],[50.9,"medium",0.6014,0.6396,0.6882,0.6014,0.2646,0.2915,0.7499,28.58,16.97,0.1994,0.3094,19.64,13.36,[]],[53.0,"medium",0.6248,0.6621,0.7064,0.6248,0.2893,0.2961,0.7528,29.02,16.72,0.2007,0.3141,19.64,13.86,[]],[55.0,"medium",0.6477,0.6842,0.7244,0.6477,0.314,0.3001,0.7557,29.46,16.47,0.2021,0.3188,19.64,14.36,[]],[57.0,"medium",0.6704,0.7057,0.7421,0.6704,0.3386,0.3035,0.7585,29.9,16.23,0.2034,0.3235,19.64,14.86,[]],[59.0,"medium",0.6927,0.7268,0.7596,0.6927,0.3633,0.3062,0.7613,30.34,16.0,0.2048,0.3282,19.64,15.36,[]],[61.0,"medium",0.7147,0.7474,0.7768,0.7147,0.388,0.3084,0.7639,30.78,15.77,0.2061,0.3328,19.64,15.86,[]],[62.9,"medium",0.7365,0.7676,0.7938,0.7365,0.4127,0.31,0.7666,31.22,15.55,0.2074,0.3375,19.64,16.36,[]],[64.8,"medium",0.7579,0.7874,0.8106,0.7579,0.4373,0.3111,0.7691,31.66,15.34,0.2087,0.3422,19.64,16.86,[]],[66.7,"critical",0.779,0.8067,0.8271,0.779,0.462,0.3117,0.7716,32.11,15.13,0.21,0.3469,19.64,17.36,[]],[68.6,"critical",0.7998,0.8256,0.8434,0.7998,0.4867,0.3118,0.7741,32.55,14.93,0.2113,0.3516,19.64,17.86,[]],[70.4,"critical",0.8204,0.8441,0.8595,0.8204,0.5114,0.3115,0.7765,32.99,14.74,0.2126,0.3563,19.64,18.36,[]],[72.2,"critical",0.8407,0.8623,0.8753,0.8407,0.536,0.3107,0.7789,33.43,14.54,0.2138,0.361,19.64,18.86,[]],[74.0,"critical",0.8607,0.88,0.891,0.8607,0.5607,0.3095,0.7812,33.87,14.36,0.2151,0.3657,19.64,19.36,[]],[75.8,"critical",0.8804,0.8975,0.9065,0.8804,0.5854,0.308,0.7835,34.31,14.18,0.2163,0.3703,19.64,19.86,[]],[77.5,"critical",0.9,0.9145,0.9217,0.9,0.61,0.306,0.7857,34.75,14.0,0.2176,0.375,19.64,20.36,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,11.82,35.46,0.1427,0.148,19.29,-4.29,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,12.22,34.32,0.1448,0.153,19.29,-3.79,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,12.63,33.25,0.1469,0.1579,19.29,-3.29,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,13.03,32.24,0.149,0.1628,19.29,-2.79,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,13.43,31.29,0.151,0.1678,19.29,-2.29,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,13.83,30.4,0.153,0.1727,19.29,-1.79,[1,3]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,14.23,29.55,0.155,0.1776,19.29,-1.29,[1,3]],[0.7,"low",0.0,0.0,0.0478,0.0,0.0,0.0,0.6334,14.63,28.75,0.1569,0.1826,19.29,-0.79,[1,3]],[1.2,"low",0.0,0.0,0.0802,0.0,0.0,0.0,0.6399,15.04,28.0,0.1588,0.1875,19.29,-0.29,[1,3]],[1.7,"low",0.0,0.0,0.1117,0.0,0.0,0.0,0.6461,15.44,27.28,0.1607,0.1925,19.29,0.21,[1,6,7]],[2.1,"low",0.0,0.0,0.1424,0.0,0.0,0.0,0.6521,15.84,26.6,0.1626,0.1974,19.29,0.71,[1,6,7]],[2.6,"low",0.0,0.0,0.1724,0.0,0.0,0.0,0.658,16.25,25.95,0.1644,0.2023,19.29,1.21,[1,6,7]],[3.0,"low",0.0,0.0,0.2017,0.0,0.0,0.0,0.6636,16.65,25.33,0.1662,0.2073,19.29,1.71,[6,7]],[4.4,"low",0.0161,0.0185,0.2303,0.0161,0.0,0.0115,0.6691,17.05,24.74,0.168,0.2122,19.29,2.21,[6]],[7.0,"low",0.0518,0.0592,0.2582,0.0518,0.0,0.0366,0.6744,17.45,24.18,0.1698,0.2171,19.29,2.71,[6]],[9.5,"low",0.0866,0.0986,0.2854,0.0866,0.0,0.0606,0.6795,17.86,23.64,0.1715,0.2221,19.29,3.21,[6]],[12.0,"low",0.1208,0.1369,0.3121,0.1208,0.0,0.0833,0.6845,18.26,23.13,0.1732,0.227,19.29,3.71,[6]],[14.3,"low",0.1541,0.174,0.3382,0.1541,0.0,0.1049,0.6893,18.67,22.64,0.1749,0.2319,19.29,4.21,[6]],[16.6,"low",0.1868,0.2101,0.3638,0.1868,0.0,0.1254,0.694,19.07,22.16,0.1766,0.2369,19.29,4.71,[6]],[18.9,"low",0.2188,0.2451,0.3888,0.2188,0.0,0.1447,0.6986,19.47,21.71,0.1783,0.2418,19.29,5.21,[6]],[21.1,"low",0.2502,0.2791,0.4134,0.2502,0.0,0.1631,0.703,19.88,21.28,0.1799,0.2467,19.29,5.71,[6]],[23.2,"low",0.2809,0.3122,0.4374,0.2809,0.0,0.1803,0.7073,20.28,20.86,0.1815,0.2517,19.29,6.21,[6]],[25.3,"low",0.311,0.3443,0.461,0.311,0.0,0.1966,0.7115,20.69,20.46,0.1831,0.2566,19.29,6.71,[6]],[27.3,"low",0.3406,0.3756,0.4841,0.3406,0.0,0.2118,0.7155,21.09,20.07,0.1847,0.2615,19.29,7.21,[6]],[29.4,"low",0.3696,0.406,0.5068,0.3696,0.0058,0.2261,0.7195,21.5,19.7,0.1863,0.2665,19.29,7.71,[6]],[32.0,"low",0.3981,0.4356,0.5291,0.3981,0.0318,0.2395,0.7234,21.9,19.34,0.1879,0.2714,19.29,8.21,[6]],[34.5,"low",0.426,0.4644,0.551,0.426,0.0578,0.2519,0.7271,22.31,19.0,0.1894,0.2763,19.29,8.71,[6]],[37.0,"medium",0.4535,0.4925,0.5725,0.4535,0.0837,0.2634,0.7308,22.71,18.67,0.1909,0.2813,19.29,9.21,[]],[39.4,"medium",0.4805,0.5199,0.5936,0.4805,0.1097,0.274,0.7343,23.12,18.34,0.1924,0.2862,19.29,9.71,[]],[41.8,"medium",0.507,0.5465,0.6143,0.507,0.1357,0.2838,0.7378,23.52,18.03,0.1939,0.2911,19.29,10.21,[]],[44.1,"medium",0.5331,0.5725,0.6347,0.5331,0.1616,0.2927,0.7412,23.93,17.73,0.1954,0.2961,19.29,10.71,[]],[46.4,"medium",0.5588,0.5979,0.6548,0.5588,0.1876,0.3009,0.7445,24.33,17.44,0.1969,0.301,19.29,11.21,[]],[48.7,"medium",0.584,0.6226,0.6745,0.584,0.2136,0.3082,0.7477,24.74,17.16,0.1984,0.3059,19.29,11.71,[]],[50.9,"medium",0.6088,0.6468,0.694,0.6088,0.2396,0.3148,0.7508,25.15,16.89,0.1998,0.3109,19.29,12.21,[]],[53.1,"medium",0.6333,0.6703,0.7131,0.6333,0.2655,0.3206,0.7539,25.55,16.62,0.2012,0.3158,19.29,12.71,[]],[55.3,"medium",0.6573,0.6933,0.7319,0.6573,0.2915,0.3257,0.7569,25.96,16.37,0.2027,0.3208,19.29,13.21,[]],[57.4,"medium",0.681,0.7158,0.7505,0.681,0.3175,0.3301,0.7598,26.36,16.12,0.2041,0.3257,19.29,13.71,[]],[59.5,"medium",0.7044,0.7377,0.7687,0.7044,0.3434,0.3339,0.7627,26.77,15.88,0.2055,0.3306,19.29,14.21,[]],[61.6,"medium",0.7274,0.7592,0.7867,0.7274,0.3694,0.337,0.7655,27.18,15.65,0.2069,0.3356,19.29,14.71,[]],[63.6,"medium",0.75,0.7801,0.8044,0.75,0.3954,0.3395,0.7682,27.58,15.42,0.2082,0.3405,19.29,15.21,[]],[65.6,"critical",0.7723,0.8006,0.8219,0.7723,0.4214,0.3414,0.7709,27.99,15.2,0.2096,0.3454,19.29,15.71,[]],[67.6,"critical",0.7944,0.8207,0.8391,0.7944,0.4473,0.3427,0.7735,28.4,14.98,0.2109,0.3504,19.29,16.21,[]],[69.5,"critical",0.8161,0.8403,0.8561,0.8161,0.4733,0.3435,0.776,28.8,14.78,0.2123,0.3553,19.29,16.71,[]],[71.4,"critical",0.8375,0.8594,0.8728,0.8375,0.4993,0.3438,0.7785,29.21,14.57,0.2136,0.3602,19.29,17.21,[]],[73.3,"critical",0.8586,0.8782,0.8894,0.8586,0.5252,0.3435,0.781,29.62,14.38,0.2149,0.3652,19.29,17.71,[]],[75.2,"critical",0.8794,0.8966,0.9057,0.8794,0.5512,0.3428,0.7833,30.02,14.19,0.2163,0.3701,19.29,18.21,[]],[77.0,"critical",0.9,0.9145,0.9217,0.9,0.5772,0.3417,0.7857,30.43,14.0,0.2176,0.375,19.29,18.71,[]],[78.9,"critical",0.9203,0.9321,0.9376,0.9203,0.6032,0.3401,0.788,30.84,13.82,0.2189,0.38,19.29,19.21,[]],[80.7,"critical",0.9403,0.9494,0.9533,0.9403,0.6291,0.3381,0.7902,31.25,13.64,0.2201,0.3849,19.29,19.71,[]],[82.4,"critical",0.9601,0.9663,0.9687,0.9601,0.6551,0.3358,0.7924,31.65,13.47,0.2214,0.3898,19.29,20.21,[]],[84.2,"critical",0.9796,0.9828,0.984,0.9796,0.6811,0.3331,0.7946,32.06,13.3,0.2227,0.3948,19.29,20.71,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,11.59,35.01,0.1435,0.15,19.2,-4.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,11.98,33.88,0.1457,0.155,19.2,-3.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,12.37,32.82,0.1478,0.16,19.2,-3.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,12.77,31.83,0.1498,0.165,19.2,-2.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,13.16,30.89,0.1519,0.17,19.2,-2.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,13.55,30.01,0.1539,0.175,19.2,-1.7,[1,3]],[0.5,"low",0.0,0.0,0.0302,0.0,0.0,0.0,0.6299,13.95,29.17,0.1559,0.18,19.2,-1.2,[1,3]],[1.0,"low",0.0,0.0,0.0635,0.0,0.0,0.0,0.6365,14.34,28.39,0.1578,0.185,19.2,-0.7,[1,3]],[1.4,"low",0.0,0.0,0.0958,0.0,0.0,0.0,0.643,14.73,27.64,0.1598,0.19,19.2,-0.2,[1,3]],[1.9,"low",0.0,0.0,0.1274,0.0,0.0,0.0,0.6492,15.13,26.93,0.1617,0.195,19.2,0.3,[1,6,7]],[2.4,"low",0.0,0.0,0.1581,0.0,0.0,0.0,0.6552,15.52,26.26,0.1635,0.2,19.2,0.8,[1,6,7]],[2.8,"low",0.0,0.0,0.1881,0.0,0.0,0.0,0.661,15.92,25.62,0.1654,0.2049,19.2,1.3,[1,6,7]],[3.3,"low",0.0,0.0,0.2174,0.0,0.0,0.0,0.6666,16.31,25.01,0.1672,0.2099,19.2,1.8,[6,7]],[5.9,"low",0.0361,0.0414,0.2459,0.0361,0.0,0.0259,0.672,16.71,24.42,0.169,0.2149,19.2,2.3,[6]],[8.5,"low",0.0718,0.0819,0.2738,0.0718,0.0,0.0508,0.6773,17.1,23.87,0.1708,0.2199,19.2,2.8,[6]],[11.0,"low",0.1067,0.1212,0.3011,0.1067,0.0,0.0746,0.6824,17.5,23.34,0.1725,0.2249,19.2,3.3,[6]],[13.4,"low",0.1408,0.1592,0.3278,0.1408,0.0,0.0971,0.6874,17.89,22.83,0.1742,0.2299,19.2,3.8,[6]],[15.8,"low",0.1742,0.1962,0.3539,0.1742,0.0,0.1185,0.6922,18.29,22.35,0.1759,0.2349,19.2,4.3,[6]],[18.1,"low",0.2068,0.2321,0.3795,0.2068,0.0,0.1388,0.6969,18.69,21.88,0.1776,0.2399,19.2,4.8,[6]],[20.3,"low",0.2388,0.2669,0.4045,0.2388,0.0,0.158,0.7014,19.08,21.43,0.1793,0.2449,19.2,5.3,[6]],[22.5,"low",0.2702,0.3007,0.4291,0.2702,0.0,0.1761,0.7058,19.48,21.01,0.181,0.2499,19.2,5.8,[6]],[24.6,"low",0.3009,0.3336,0.4531,0.3009,0.0,0.1932,0.7101,19.87,20.59,0.1826,0.2549,19.2,6.3,[6]],[26.7,"low",0.3311,0.3655,0.4767,0.3311,0.0,0.2093,0.7142,20.27,20.2,0.1842,0.2599,19.2,6.8,[6]],[28.7,"low",0.3606,0.3966,0.4998,0.3606,0.0,0.2243,0.7183,20.67,19.82,0.1858,0.2649,19.2,7.3,[6]],[31.0,"low",0.3896,0.4269,0.5225,0.3896,0.0156,0.2384,0.7222,21.06,19.45,0.1874,0.2699,19.2,7.8,[6]],[33.6,"low",0.4181,0.4563,0.5448,0.4181,0.0419,0.2515,0.726,21.46,19.1,0.189,0.2749,19.2,8.3,[6]],[36.1,"medium",0.4461,0.485,0.5666,0.4461,0.0682,0.2637,0.7298,21.86,18.75,0.1905,0.2799,19.2,8.8,[]],[38.6,"medium",0.4735,0.5129,0.5881,0.4735,0.0945,0.275,0.7334,22.25,18.43,0.192,0.2849,19.2,9.3,[]],[41.0,"medium",0.5005,0.54,0.6093,0.5005,0.1208,0.2854,0.7369,22.65,18.11,0.1936,0.2899,19.2,9.8,[]],[43.4,"medium",0.5271,0.5665,0.63,0.5271,0.1471,0.295,0.7404,23.05,17.8,0.1951,0.2949,19.2,10.3,[]],[45.8,"medium",0.5532,0.5924,0.6504,0.5532,0.1735,0.3037,0.7438,23.45,17.5,0.1966,0.2999,19.2,10.8,[]],[48.1,"medium",0.5788,0.6176,0.6705,0.5788,0.1998,0.3116,0.747,23.84,17.22,0.1981,0.3049,19.2,11.3,[]],[50.3,"medium",0.604,0.6421,0.6902,0.604,0.2261,0.3188,0.7502,24.24,16.94,0.1995,0.3099,19.2,11.8,[]],[52.6,"medium",0.6289,0.6661,0.7097,0.6289,0.2524,0.3251,0.7534,24.64,16.67,0.201,0.3149,19.2,12.3,[]],[54.8,"medium",0.6533,0.6895,0.7288,0.6533,0.2787,0.3307,0.7564,25.04,16.41,0.2024,0.3199,19.2,12.8,[]],[56.9,"medium",0.6774,0.7123,0.7476,0.6774,0.305,0.3356,0.7594,25.44,16.16,0.2038,0.3249,19.2,13.3,[]],[59.1,"medium",0.7011,0.7346,0.7661,0.7011,0.3313,0.3398,0.7623,25.83,15.91,0.2053,0.3299,19.2,13.8,[]],[61.2,"medium",0.7244,0.7564,0.7844,0.7244,0.3576,0.3434,0.7651,26.23,15.68,0.2067,0.3349,19.2,14.3,[]],[63.2,"medium",0.7474,0.7777,0.8024,0.7474,0.3839,0.3463,0.7679,26.63,15.44,0.2081,0.3399,19.2,14.8,[]],[65.3,"critical",0.7701,0.7985,0.8201,0.7701,0.4102,0.3486,0.7706,27.03,15.22,0.2095,0.3449,19.2,15.3,[]],[67.3,"critical",0.7924,0.8189,0.8376,0.7924,0.4365,0.3502,0.7732,27.43,15.0,0.2108,0.3499,19.2,15.8,[]],[69.2,"critical",0.8144,0.8388,0.8548,0.8144,0.4629,0.3514,0.7758,27.82,14.79,0.2122,0.3549,19.2,16.3,[]],[71.2,"critical",0.8361,0.8582,0.8718,0.8361,0.4892,0.3519,0.7784,28.22,14.59,0.2135,0.3599,19.2,16.8,[]],[73.1,"critical",0.8575,0.8772,0.8885,0.8575,0.5155,0.352,0.7808,28.62,14.39,0.2149,0.3649,19.2,17.3,[]],[75.0,"critical",0.8786,0.8959,0.905,0.8786,0.5418,0.3515,0.7833,29.02,14.19,0.2162,0.3699,19.2,17.8,[]],[76.9,"critical",0.8995,0.9141,0.9213,0.8995,0.5681,0.3506,0.7856,29.42,14.0,0.2175,0.3749,19.2,18.3,[]],[78.7,"critical",0.92,0.9319,0.9374,0.92,0.5944,0.3493,0.788,29.82,13.82,0.2188,0.3799,19.2,18.8,[]],[80.5,"critical",0.9403,0.9494,0.9533,0.9403,0.6207,0.3475,0.7902,30.22,13.64,0.2201,0.3849,19.2,19.3,[]],[82.3,"critical",0.9603,0.9665,0.969,0.9603,0.647,0.3454,0.7925,30.62,13.46,0.2214,0.3899,19.2,19.8,[]],[84.1,"critical",0.9801,0.9833,0.9844,0.9801,0.6733,0.3428,0.7946,31.02,13.29,0.2227,0.3949,19.2,20.3,[]],[85.9,"critical",0.9996,0.9997,0.9997,0.9996,0.6996,0.3399,0.7968,31.42,13.13,0.224,0.3999,19.2,20.8,[]]]],"Nomex":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,14.66,70.93,0.1041,0.074,31.63,-16.63,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,15.15,68.64,0.1057,0.0765,31.63,-16.13,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,15.65,66.49,0.1072,0.079,31.63,-15.63,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,16.15,64.48,0.1088,0.0814,31.63,-15.13,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,16.65,62.58,0.1102,0.0839,31.63,-14.63,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,17.15,60.8,0.1117,0.0864,31.63,-14.13,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,17.64,59.11,0.1131,0.0888,31.63,-13.63,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,18.14,57.51,0.1145,0.0913,31.63,-13.13,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,18.64,56.0,0.1159,0.0938,31.63,-12.63,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,19.14,54.56,0.1173,0.0962,31.63,-12.13,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,19.64,53.2,0.1187,0.0987,31.63,-11.63,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,20.14,51.9,0.12,0.1012,31.63,-11.13,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,20.64,50.66,0.1213,0.1036,31.63,-10.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,21.14,49.48,0.1226,0.1061,31.63,-10.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,21.64,48.36,0.1239,0.1086,31.63,-9.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,22.14,47.29,0.1252,0.111,31.63,-9.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,22.64,46.26,0.1265,0.1135,31.63,-8.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,23.14,45.27,0.1277,0.116,31.63,-8.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,23.64,44.33,0.1289,0.1184,31.63,-7.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,24.14,43.43,0.1301,0.1209,31.63,-7.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,24.64,42.56,0.1313,0.1234,31.63,-6.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,25.14,41.72,0.1325,0.1258,31.63,-6.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,25.65,40.92,0.1337,0.1283,31.63,-5.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,26.15,40.15,0.1349,0.1308,31.63,-5.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,26.65,39.4,0.136,0.1332,31.63,-4.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,27.15,38.69,0.1371,0.1357,31.63,-4.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,27.65,38.0,0.1383,0.1382,31.63,-3.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,28.16,37.33,0.1394,0.1406,31.63,-3.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,28.66,36.69,0.1405,0.1431,31.63,-2.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,29.16,36.06,0.1416,0.1456,31.63,-2.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,29.66,35.46,0.1427,0.148,31.63,-1.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,30.17,34.88,0.1437,0.1505,31.63,-1.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,30.67,34.32,0.1448,0.153,31.63,-0.63,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,31.17,33.77,0.1459,0.1554,31.63,-0.13,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,31.68,33.25,0.1469,0.1579,31.63,0.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,32.18,32.74,0.1479,0.1604,31.63,0.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,32.68,32.24,0.149,0.1628,31.63,1.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.609,33.19,31.76,0.15,0.1653,31.63,1.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,33.69,31.29,0.151,0.1678,31.63,2.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,34.19,30.84,0.152,0.1702,31.63,2.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,34.7,30.4,0.153,0.1727,31.63,3.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6233,35.2,29.97,0.154,0.1752,31.63,3.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,35.71,29.55,0.155,0.1776,31.63,4.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6301,36.21,29.15,0.1559,0.1801,31.63,4.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,36.71,28.75,0.1569,0.1826,31.63,5.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,37.22,28.37,0.1579,0.185,31.63,5.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,37.72,28.0,0.1588,0.1875,31.63,6.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,38.23,27.63,0.1598,0.19,31.63,6.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,38.73,27.28,0.1607,0.1925,31.63,7.37,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6491,39.24,26.93,0.1616,0.1949,31.63,7.87,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,39.74,26.6,0.1626,0.1974,31.63,8.37,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,12.62,64.48,0.1088,0.0814,30.59,-15.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,13.04,62.4,0.1104,0.0841,30.59,-15.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,13.47,60.45,0.112,0.0868,30.59,-14.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,13.9,58.62,0.1136,0.0896,30.59,-14.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,14.33,56.89,0.1151,0.0923,30.59,-13.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,14.76,55.27,0.1166,0.095,30.59,-13.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,15.19,53.73,0.1181,0.0977,30.59,-12.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,15.62,52.28,0.1196,0.1004,30.59,-12.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,16.05,50.9,0.1211,0.1031,30.59,-11.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,16.48,49.6,0.1225,0.1058,30.59,-11.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,16.91,48.36,0.1239,0.1086,30.59,-10.59,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,17.34,47.18,0.1253,0.1113,30.59,-10.09,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,17.77,46.06,0.1267,0.114,30.59,-9.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,18.2,44.99,0.1281,0.1167,30.59,-9.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,18.63,43.96,0.1294,0.1194,30.59,-8.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,19.06,42.99,0.1307,0.1221,30.59,-8.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,19.49,42.05,0.132,0.1248,30.59,-7.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,19.92,41.16,0.1333,0.1276,30.59,-7.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,20.35,40.3,0.1346,0.1303,30.59,-6.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,20.78,39.48,0.1359,0.133,30.59,-6.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,21.21,38.69,0.1371,0.1357,30.59,-5.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,21.64,37.93,0.1384,0.1384,30.59,-5.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,22.07,37.2,0.1396,0.1411,30.59,-4.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,22.51,36.5,0.1408,0.1438,30.59,-4.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,22.94,35.82,0.142,0.1466,30.59,-3.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,23.37,35.17,0.1432,0.1493,30.59,-3.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,23.8,34.54,0.1444,0.152,30.59,-2.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,24.24,33.94,0.1455,0.1547,30.59,-2.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,24.67,33.35,0.1467,0.1574,30.59,-1.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,25.1,32.79,0.1478,0.1601,30.59,-1.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,25.53,32.24,0.149,0.1628,30.59,-0.59,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,25.97,31.71,0.1501,0.1656,30.59,-0.09,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6134,26.4,31.2,0.1512,0.1683,30.59,0.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6174,26.83,30.7,0.1523,0.171,30.59,0.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,27.27,30.22,0.1534,0.1737,30.59,1.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,27.7,29.76,0.1545,0.1764,30.59,1.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6288,28.13,29.31,0.1556,0.1791,30.59,2.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6324,28.57,28.87,0.1566,0.1818,30.59,2.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,29.0,28.45,0.1577,0.1846,30.59,3.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6395,29.43,28.03,0.1587,0.1873,30.59,3.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,29.87,27.63,0.1598,0.19,30.59,4.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6464,30.3,27.24,0.1608,0.1927,30.59,4.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,30.73,26.87,0.1618,0.1954,30.59,5.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.653,31.17,26.5,0.1628,0.1981,30.59,5.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6562,31.6,26.14,0.1639,0.2008,30.59,6.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,32.04,25.79,0.1649,0.2036,30.59,6.91,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,32.47,25.45,0.1658,0.2063,30.59,7.41,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6655,32.91,25.12,0.1668,0.209,30.59,7.91,[6,7]],[0.7,"low",0.0125,0.0143,0.0,0.0125,0.0,0.0,0.6685,33.34,24.8,0.1678,0.2117,30.59,8.41,[6]],[1.7,"low",0.0322,0.0369,0.0,0.0322,0.0,0.0,0.6715,33.78,24.49,0.1688,0.2144,30.59,8.91,[6]],[2.8,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0,0.6744,34.21,24.18,0.1698,0.2171,30.59,9.41,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,12.09,62.77,0.1101,0.0836,30.3,-15.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,12.5,60.74,0.1117,0.0864,30.3,-14.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,12.91,58.84,0.1134,0.0892,30.3,-14.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,13.33,57.06,0.115,0.092,30.3,-13.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,13.74,55.38,0.1165,0.0948,30.3,-13.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,14.15,53.8,0.1181,0.0976,30.3,-12.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,14.56,52.31,0.1196,0.1004,30.3,-12.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,14.97,50.89,0.1211,0.1032,30.3,-11.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,15.38,49.55,0.1226,0.1059,30.3,-11.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,15.79,48.28,0.124,0.1087,30.3,-10.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,16.2,47.08,0.1254,0.1115,30.3,-10.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,16.62,45.93,0.1269,0.1143,30.3,-9.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,17.03,44.83,0.1283,0.1171,30.3,-9.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,17.44,43.79,0.1296,0.1199,30.3,-8.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,17.85,42.8,0.131,0.1227,30.3,-8.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,18.27,41.85,0.1323,0.1255,30.3,-7.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,18.68,40.94,0.1337,0.1283,30.3,-7.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,19.09,40.06,0.135,0.131,30.3,-6.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,19.51,39.23,0.1363,0.1338,30.3,-6.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,19.92,38.43,0.1376,0.1366,30.3,-5.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,20.33,37.66,0.1388,0.1394,30.3,-5.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,20.75,36.92,0.1401,0.1422,30.3,-4.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,21.16,36.21,0.1413,0.145,30.3,-4.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,21.57,35.53,0.1425,0.1478,30.3,-3.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,21.99,34.87,0.1438,0.1506,30.3,-3.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,22.4,34.24,0.145,0.1533,30.3,-2.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,22.82,33.63,0.1462,0.1561,30.3,-2.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,23.23,33.04,0.1473,0.1589,30.3,-1.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,23.65,32.47,0.1485,0.1617,30.3,-1.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,24.06,31.92,0.1497,0.1645,30.3,-0.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,24.47,31.38,0.1508,0.1673,30.3,-0.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.616,24.89,30.87,0.1519,0.1701,30.3,0.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.62,25.3,30.37,0.1531,0.1729,30.3,0.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.624,25.72,29.89,0.1542,0.1756,30.3,1.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6278,26.14,29.42,0.1553,0.1784,30.3,1.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6316,26.55,28.97,0.1564,0.1812,30.3,2.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6353,26.97,28.53,0.1575,0.184,30.3,2.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6389,27.38,28.1,0.1586,0.1868,30.3,3.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6425,27.8,27.69,0.1596,0.1896,30.3,3.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.646,28.21,27.29,0.1607,0.1924,30.3,4.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6494,28.63,26.9,0.1617,0.1952,30.3,4.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6528,29.04,26.52,0.1628,0.198,30.3,5.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6561,29.46,26.15,0.1638,0.2007,30.3,5.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,29.88,25.79,0.1648,0.2035,30.3,6.2,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,30.29,25.45,0.1659,0.2063,30.3,6.7,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6657,30.71,25.11,0.1669,0.2091,30.3,7.2,[6,7]],[0.7,"low",0.0139,0.016,0.0,0.0139,0.0,0.0,0.6687,31.13,24.78,0.1679,0.2119,30.3,7.7,[6]],[1.8,"low",0.0342,0.0392,0.0,0.0342,0.0,0.0,0.6718,31.54,24.45,0.1689,0.2147,30.3,8.2,[6]],[2.9,"low",0.0542,0.062,0.0,0.0542,0.0,0.0,0.6747,31.96,24.14,0.1699,0.2175,30.3,8.7,[6]],[4.0,"low",0.074,0.0844,0.0,0.074,0.0,0.0,0.6776,32.38,23.84,0.1709,0.2203,30.3,9.2,[6]],[5.0,"low",0.0935,0.1064,0.0,0.0935,0.0,0.0,0.6805,32.79,23.54,0.1718,0.223,30.3,9.7,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,11.0,59.11,0.1131,0.0888,29.67,-14.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,11.38,57.2,0.1148,0.0918,29.67,-14.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,11.75,55.41,0.1165,0.0947,29.67,-13.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,12.12,53.73,0.1181,0.0977,29.67,-13.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,12.5,52.15,0.1197,0.1007,29.67,-12.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,12.87,50.66,0.1213,0.1036,29.67,-12.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,13.24,49.26,0.1229,0.1066,29.67,-11.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,13.62,47.92,0.1244,0.1095,29.67,-11.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,13.99,46.66,0.126,0.1125,29.67,-10.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,14.37,45.47,0.1274,0.1155,29.67,-10.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,14.74,44.33,0.1289,0.1184,29.67,-9.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,15.12,43.25,0.1304,0.1214,29.67,-9.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,15.49,42.22,0.1318,0.1244,29.67,-8.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,15.87,41.24,0.1332,0.1273,29.67,-8.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,16.24,40.3,0.1346,0.1303,29.67,-7.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,16.62,39.4,0.136,0.1332,29.67,-7.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,16.99,38.55,0.1374,0.1362,29.67,-6.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,17.37,37.73,0.1387,0.1392,29.67,-6.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,17.75,36.94,0.14,0.1421,29.67,-5.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,18.12,36.19,0.1414,0.1451,29.67,-5.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,18.5,35.46,0.1427,0.148,29.67,-4.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,18.87,34.77,0.144,0.151,29.67,-4.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,19.25,34.1,0.1452,0.154,29.67,-3.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,19.63,33.46,0.1465,0.1569,29.67,-3.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,20.0,32.84,0.1477,0.1599,29.67,-2.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,20.38,32.24,0.149,0.1628,29.67,-2.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,20.76,31.66,0.1502,0.1658,29.67,-1.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,21.14,31.11,0.1514,0.1688,29.67,-1.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,21.51,30.57,0.1526,0.1717,29.67,-0.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6226,21.89,30.05,0.1538,0.1747,29.67,-0.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,22.27,29.55,0.155,0.1776,29.67,0.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6308,22.64,29.07,0.1561,0.1806,29.67,0.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6347,23.02,28.6,0.1573,0.1836,29.67,1.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,23.4,28.15,0.1584,0.1865,29.67,1.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,23.78,27.71,0.1596,0.1895,29.67,2.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,24.16,27.28,0.1607,0.1925,29.67,2.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,24.53,26.87,0.1618,0.1954,29.67,3.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6533,24.91,26.47,0.1629,0.1984,29.67,3.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,25.29,26.08,0.164,0.2013,29.67,4.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,25.67,25.7,0.1651,0.2043,29.67,4.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,26.05,25.33,0.1662,0.2073,29.67,5.33,[6,7]],[0.1,"low",0.0016,0.0018,0.0,0.0016,0.0,0.0,0.6669,26.42,24.97,0.1673,0.2102,29.67,5.83,[6]],[1.2,"low",0.0233,0.0267,0.0,0.0233,0.0,0.0,0.6701,26.8,24.63,0.1683,0.2132,29.67,6.33,[6]],[2.4,"low",0.0447,0.0511,0.0,0.0447,0.0,0.0,0.6733,27.18,24.29,0.1694,0.2161,29.67,6.83,[6]],[3.5,"low",0.0658,0.0751,0.0,0.0658,0.0,0.0,0.6764,27.56,23.96,0.1705,0.2191,29.67,7.33,[6]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,27.94,23.64,0.1715,0.2221,29.67,7.83,[6]],[5.7,"low",0.1072,0.1217,0.0,0.1072,0.0,0.0,0.6825,28.32,23.33,0.1725,0.225,29.67,8.33,[6]],[6.8,"low",0.1275,0.1444,0.0,0.1275,0.0,0.0,0.6855,28.7,23.03,0.1736,0.228,29.67,8.83,[6]],[7.9,"low",0.1475,0.1667,0.0,0.1475,0.0,0.0,0.6884,29.08,22.73,0.1746,0.2309,29.67,9.33,[6]],[8.9,"low",0.1673,0.1886,0.0,0.1673,0.0,0.0,0.6912,29.46,22.45,0.1756,0.2339,29.67,9.83,[6]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,29.83,22.16,0.1766,0.2369,29.67,10.33,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,9.7,54.56,0.1173,0.0962,28.85,-13.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,10.03,52.8,0.1191,0.0994,28.85,-13.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,10.36,51.15,0.1208,0.1026,28.85,-12.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,10.69,49.6,0.1225,0.1058,28.85,-12.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,11.02,48.14,0.1242,0.1091,28.85,-11.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,11.35,46.77,0.1258,0.1123,28.85,-11.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,11.68,45.47,0.1274,0.1155,28.85,-10.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,12.01,44.24,0.129,0.1187,28.85,-10.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,12.34,43.07,0.1306,0.1219,28.85,-9.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,12.67,41.97,0.1322,0.1251,28.85,-9.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,13.0,40.92,0.1337,0.1283,28.85,-8.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,13.33,39.92,0.1352,0.1315,28.85,-8.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,13.66,38.97,0.1367,0.1347,28.85,-7.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,13.99,38.06,0.1382,0.1379,28.85,-7.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,14.32,37.2,0.1396,0.1411,28.85,-6.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,14.65,36.37,0.141,0.1443,28.85,-6.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,14.98,35.58,0.1424,0.1475,28.85,-5.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,15.32,34.83,0.1438,0.1508,28.85,-5.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,15.65,34.1,0.1452,0.154,28.85,-4.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,15.98,33.4,0.1466,0.1572,28.85,-4.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,16.31,32.74,0.1479,0.1604,28.85,-3.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,16.64,32.09,0.1493,0.1636,28.85,-3.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,16.97,31.48,0.1506,0.1668,28.85,-2.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,17.31,30.88,0.1519,0.17,28.85,-2.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,17.64,30.31,0.1532,0.1732,28.85,-1.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,17.97,29.76,0.1545,0.1764,28.85,-1.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,18.3,29.23,0.1558,0.1796,28.85,-0.85,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,18.63,28.72,0.157,0.1828,28.85,-0.35,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.638,18.97,28.22,0.1583,0.186,28.85,0.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6421,19.3,27.74,0.1595,0.1892,28.85,0.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,19.63,27.28,0.1607,0.1925,28.85,1.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.65,19.97,26.83,0.1619,0.1957,28.85,1.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6539,20.3,26.4,0.1631,0.1989,28.85,2.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6577,20.63,25.98,0.1643,0.2021,28.85,2.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,20.96,25.57,0.1655,0.2053,28.85,3.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.665,21.3,25.18,0.1667,0.2085,28.85,3.65,[6,7]],[0.7,"low",0.0125,0.0143,0.0,0.0125,0.0,0.0,0.6685,21.63,24.8,0.1678,0.2117,28.85,4.15,[6]],[1.9,"low",0.0358,0.041,0.0,0.0358,0.0,0.0,0.672,21.96,24.43,0.169,0.2149,28.85,4.65,[6]],[3.1,"low",0.0588,0.0672,0.0,0.0588,0.0,0.0,0.6754,22.3,24.07,0.1701,0.2181,28.85,5.15,[6]],[4.4,"low",0.0815,0.0928,0.0,0.0815,0.0,0.0,0.6787,22.63,23.72,0.1712,0.2213,28.85,5.65,[6]],[5.5,"low",0.1038,0.1179,0.0,0.1038,0.0,0.0,0.682,22.96,23.38,0.1724,0.2245,28.85,6.15,[6]],[6.7,"low",0.1258,0.1425,0.0,0.1258,0.0,0.0,0.6852,23.3,23.05,0.1735,0.2277,28.85,6.65,[6]],[7.9,"low",0.1475,0.1667,0.0,0.1475,0.0,0.0,0.6884,23.63,22.73,0.1746,0.2309,28.85,7.15,[6]],[9.0,"low",0.1689,0.1904,0.0,0.1689,0.0,0.0,0.6914,23.97,22.42,0.1757,0.2341,28.85,7.65,[6]],[10.1,"low",0.19,0.2136,0.0,0.19,0.0,0.0,0.6945,24.3,22.12,0.1768,0.2374,28.85,8.15,[6]],[11.2,"low",0.2109,0.2364,0.0,0.2109,0.0,0.0,0.6974,24.63,21.82,0.1778,0.2406,28.85,8.65,[6]],[12.3,"low",0.2314,0.2588,0.0,0.2314,0.0,0.0,0.7003,24.97,21.54,0.1789,0.2438,28.85,9.15,[6]],[13.3,"low",0.2517,0.2808,0.0,0.2517,0.0,0.0,0.7032,25.3,21.26,0.18,0.247,28.85,9.65,[6]],[14.4,"low",0.2717,0.3024,0.0,0.2717,0.0,0.0,0.706,25.64,20.98,0.181,0.2502,28.85,10.15,[6]],[15.4,"low",0.2915,0.3235,0.0,0.2915,0.0,0.0,0.7088,25.97,20.72,0.1821,0.2534,28.85,10.65,[6]],[16.4,"low",0.311,0.3443,0.0,0.311,0.0,0.0,0.7115,26.31,20.46,0.1831,0.2566,28.85,11.15,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,8.63,50.66,0.1213,0.1036,28.11,-13.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,8.93,49.03,0.1232,0.1071,28.11,-12.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,9.22,47.5,0.1249,0.1105,28.11,-12.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,9.51,46.06,0.1267,0.114,28.11,-11.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,9.81,44.7,0.1284,0.1174,28.11,-11.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,10.1,43.43,0.1301,0.1209,28.11,-10.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,10.39,42.22,0.1318,0.1244,28.11,-10.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,10.69,41.08,0.1335,0.1278,28.11,-9.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,10.98,40.0,0.1351,0.1313,28.11,-9.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,11.27,38.97,0.1367,0.1347,28.11,-8.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,11.57,38.0,0.1383,0.1382,28.11,-8.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,11.86,37.07,0.1398,0.1416,28.11,-7.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,12.16,36.19,0.1414,0.1451,28.11,-7.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,12.45,35.35,0.1429,0.1485,28.11,-6.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,12.75,34.54,0.1444,0.152,28.11,-6.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,13.04,33.77,0.1459,0.1554,28.11,-5.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,13.34,33.04,0.1473,0.1589,28.11,-5.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,13.63,32.34,0.1488,0.1623,28.11,-4.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,13.93,31.66,0.1502,0.1658,28.11,-4.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,14.22,31.02,0.1516,0.1693,28.11,-3.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,14.52,30.4,0.153,0.1727,28.11,-3.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,14.81,29.8,0.1544,0.1762,28.11,-2.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,15.11,29.23,0.1558,0.1796,28.11,-2.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6341,15.4,28.68,0.1571,0.1831,28.11,-1.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,15.7,28.15,0.1584,0.1865,28.11,-1.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,15.99,27.63,0.1598,0.19,28.11,-0.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,16.29,27.14,0.1611,0.1934,28.11,-0.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,16.58,26.66,0.1624,0.1969,28.11,0.39,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6556,16.88,26.2,0.1637,0.2003,28.11,0.89,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6597,17.18,25.76,0.1649,0.2038,28.11,1.39,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,17.47,25.33,0.1662,0.2073,28.11,1.89,[6,7]],[0.3,"low",0.0052,0.006,0.0,0.0052,0.0,0.0,0.6674,17.77,24.92,0.1675,0.2107,28.11,2.39,[6]],[1.6,"low",0.0305,0.0349,0.0,0.0305,0.0,0.0,0.6712,18.06,24.51,0.1687,0.2142,28.11,2.89,[6]],[3.0,"low",0.0553,0.0632,0.0,0.0553,0.0,0.0,0.6749,18.36,24.12,0.1699,0.2176,28.11,3.39,[6]],[4.3,"low",0.0797,0.0908,0.0,0.0797,0.0,0.0,0.6785,18.66,23.75,0.1712,0.2211,28.11,3.89,[6]],[5.5,"low",0.1038,0.1179,0.0,0.1038,0.0,0.0,0.682,18.95,23.38,0.1724,0.2245,28.11,4.39,[6]],[6.8,"low",0.1275,0.1444,0.0,0.1275,0.0,0.0,0.6855,19.25,23.03,0.1736,0.228,28.11,4.89,[6]],[8.0,"low",0.1508,0.1704,0.0,0.1508,0.0,0.0,0.6888,19.55,22.68,0.1747,0.2314,28.11,5.39,[6]],[9.2,"low",0.1738,0.1958,0.0,0.1738,0.0,0.0,0.6921,19.84,22.35,0.1759,0.2349,28.11,5.89,[6]],[10.4,"low",0.1965,0.2207,0.0,0.1965,0.0,0.0,0.6954,20.14,22.03,0.1771,0.2383,28.11,6.39,[6]],[11.6,"low",0.2188,0.2451,0.0,0.2188,0.0,0.0,0.6986,20.44,21.71,0.1783,0.2418,28.11,6.89,[6]],[12.7,"low",0.2408,0.269,0.0,0.2408,0.0,0.0,0.7017,20.73,21.41,0.1794,0.2453,28.11,7.39,[6]],[13.9,"low",0.2625,0.2925,0.0,0.2625,0.0,0.0,0.7047,21.03,21.11,0.1806,0.2487,28.11,7.89,[6]],[15.0,"low",0.2839,0.3154,0.0,0.2839,0.0,0.0,0.7077,21.33,20.82,0.1817,0.2522,28.11,8.39,[6]],[16.1,"low",0.305,0.338,0.0,0.305,0.0,0.0,0.7106,21.63,20.54,0.1828,0.2556,28.11,8.89,[6]],[17.2,"low",0.3259,0.3601,0.0,0.3259,0.0,0.0,0.7135,21.92,20.27,0.1839,0.2591,28.11,9.39,[6]],[18.2,"low",0.3464,0.3817,0.0,0.3464,0.0,0.0,0.7163,22.22,20.0,0.185,0.2625,28.11,9.89,[6]],[19.2,"low",0.3667,0.403,0.0,0.3667,0.0,0.0,0.7191,22.52,19.74,0.1861,0.266,28.11,10.39,[6]],[20.3,"low",0.3867,0.4239,0.0,0.3867,0.0011,0.0,0.7218,22.82,19.49,0.1872,0.2694,28.11,10.89,[6]],[21.8,"low",0.4065,0.4443,0.0,0.4065,0.0193,0.0,0.7245,23.11,19.24,0.1883,0.2729,28.11,11.39,[6]],[23.2,"low",0.426,0.4644,0.0,0.426,0.0375,0.0,0.7271,23.41,19.0,0.1894,0.2763,28.11,11.89,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,8.58,50.45,0.1216,0.1041,28.07,-13.07,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,8.87,48.82,0.1234,0.1075,28.07,-12.57,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,9.16,47.29,0.1252,0.111,28.07,-12.07,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,9.45,45.86,0.1269,0.1145,28.07,-11.57,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,9.74,44.51,0.1287,0.1179,28.07,-11.07,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,10.03,43.24,0.1304,0.1214,28.07,-10.57,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,10.32,42.04,0.1321,0.1249,28.07,-10.07,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,10.61,40.9,0.1337,0.1284,28.07,-9.57,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,10.91,39.83,0.1353,0.1318,28.07,-9.07,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,11.2,38.8,0.1369,0.1353,28.07,-8.57,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,11.49,37.83,0.1385,0.1388,28.07,-8.07,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,11.78,36.91,0.1401,0.1422,28.07,-7.57,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,12.08,36.03,0.1416,0.1457,28.07,-7.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,12.37,35.2,0.1432,0.1492,28.07,-6.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,12.66,34.4,0.1447,0.1526,28.07,-6.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,12.95,33.63,0.1461,0.1561,28.07,-5.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,13.25,32.9,0.1476,0.1596,28.07,-5.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,13.54,32.2,0.1491,0.163,28.07,-4.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,13.83,31.53,0.1505,0.1665,28.07,-4.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,14.12,30.89,0.1519,0.17,28.07,-3.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,14.42,30.27,0.1533,0.1735,28.07,-3.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,14.71,29.67,0.1547,0.1769,28.07,-2.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,15.0,29.1,0.1561,0.1804,28.07,-2.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6351,15.3,28.55,0.1574,0.1839,28.07,-1.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6396,15.59,28.03,0.1588,0.1873,28.07,-1.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.644,15.89,27.52,0.1601,0.1908,28.07,-0.57,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6483,16.18,27.02,0.1614,0.1943,28.07,-0.07,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6525,16.47,26.55,0.1627,0.1977,28.07,0.43,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6567,16.77,26.09,0.164,0.2012,28.07,0.93,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6607,17.06,25.65,0.1653,0.2047,28.07,1.43,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6646,17.36,25.22,0.1665,0.2081,28.07,1.93,[6,7]],[0.6,"low",0.0119,0.0136,0.0,0.0119,0.0,0.0,0.6684,17.65,24.81,0.1678,0.2116,28.07,2.43,[6]],[2.0,"low",0.0371,0.0425,0.0,0.0371,0.0,0.0,0.6722,17.94,24.41,0.169,0.2151,28.07,2.93,[6]],[3.3,"low",0.0619,0.0707,0.0,0.0619,0.0,0.0,0.6759,18.24,24.02,0.1703,0.2185,28.07,3.43,[6]],[4.6,"low",0.0864,0.0983,0.0,0.0864,0.0,0.0,0.6795,18.53,23.65,0.1715,0.222,28.07,3.93,[6]],[5.9,"low",0.1104,0.1254,0.0,0.1104,0.0,0.0,0.683,18.83,23.28,0.1727,0.2255,28.07,4.43,[6]],[7.1,"low",0.1341,0.1518,0.0,0.1341,0.0,0.0,0.6864,19.12,22.93,0.1739,0.229,28.07,4.93,[6]],[8.4,"low",0.1575,0.1777,0.0,0.1575,0.0,0.0,0.6898,19.42,22.59,0.1751,0.2324,28.07,5.43,[6]],[9.6,"low",0.1805,0.2031,0.0,0.1805,0.0,0.0,0.6931,19.71,22.26,0.1763,0.2359,28.07,5.93,[6]],[10.8,"low",0.2031,0.228,0.0,0.2031,0.0,0.0,0.6963,20.01,21.93,0.1774,0.2394,28.07,6.43,[6]],[11.9,"low",0.2254,0.2523,0.0,0.2254,0.0,0.0,0.6995,20.3,21.62,0.1786,0.2428,28.07,6.93,[6]],[13.1,"low",0.2475,0.2762,0.0,0.2475,0.0,0.0,0.7026,20.6,21.32,0.1798,0.2463,28.07,7.43,[6]],[14.2,"low",0.2692,0.2996,0.0,0.2692,0.0,0.0,0.7057,20.89,21.02,0.1809,0.2498,28.07,7.93,[6]],[15.3,"low",0.2906,0.3225,0.0,0.2906,0.0,0.0,0.7086,21.19,20.73,0.182,0.2532,28.07,8.43,[6]],[16.4,"low",0.3117,0.345,0.0,0.3117,0.0,0.0,0.7116,21.48,20.45,0.1832,0.2567,28.07,8.93,[6]],[17.5,"low",0.3325,0.3671,0.0,0.3325,0.0,0.0,0.7144,21.78,20.18,0.1843,0.2602,28.07,9.43,[6]],[18.5,"low",0.3531,0.3887,0.0,0.3531,0.0,0.0,0.7173,22.07,19.91,0.1854,0.2636,28.07,9.93,[6]],[19.6,"low",0.3734,0.4099,0.0,0.3734,0.0,0.0,0.72,22.37,19.65,0.1865,0.2671,28.07,10.43,[6]],[20.7,"low",0.3934,0.4307,0.0,0.3934,0.0043,0.0,0.7227,22.66,19.4,0.1876,0.2706,28.07,10.93,[6]],[22.2,"low",0.4132,0.4512,0.0,0.4132,0.0226,0.0,0.7254,22.96,19.16,0.1887,0.2741,28.07,11.43,[6]],[23.6,"low",0.4327,0.4712,0.0,0.4327,0.0409,0.0,0.728,23.25,18.92,0.1898,0.2775,28.07,11.93,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,7.75,47.29,0.1252,0.111,27.44,-12.44,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,8.01,45.76,0.1271,0.1147,27.44,-11.94,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,8.27,44.33,0.1289,0.1184,27.44,-11.44,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,8.53,42.99,0.1307,0.1221,27.44,-10.94,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,8.8,41.72,0.1325,0.1258,27.44,-10.44,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,9.06,40.53,0.1343,0.1295,27.44,-9.94,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,9.32,39.4,0.136,0.1332,27.44,-9.44,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,9.59,38.34,0.1377,0.1369,27.44,-8.94,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,9.85,37.33,0.1394,0.1406,27.44,-8.44,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,10.11,36.37,0.141,0.1443,27.44,-7.94,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,10.38,35.46,0.1427,0.148,27.44,-7.44,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,10.64,34.6,0.1443,0.1517,27.44,-6.94,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,10.91,33.77,0.1459,0.1554,27.44,-6.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,11.17,32.99,0.1474,0.1591,27.44,-5.94,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,11.43,32.24,0.149,0.1628,27.44,-5.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,11.7,31.52,0.1505,0.1665,27.44,-4.94,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,11.96,30.84,0.152,0.1702,27.44,-4.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,12.23,30.18,0.1535,0.1739,27.44,-3.94,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,12.49,29.55,0.155,0.1776,27.44,-3.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,12.76,28.95,0.1564,0.1813,27.44,-2.94,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,13.02,28.37,0.1579,0.185,27.44,-2.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,13.29,27.81,0.1593,0.1887,27.44,-1.94,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,13.55,27.28,0.1607,0.1925,27.44,-1.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6506,13.82,26.77,0.1621,0.1962,27.44,-0.94,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,14.08,26.27,0.1635,0.1999,27.44,-0.44,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,14.35,25.79,0.1649,0.2036,27.44,0.06,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,14.61,25.33,0.1662,0.2073,27.44,0.56,[6,7]],[0.4,"low",0.007,0.0081,0.0,0.007,0.0,0.0,0.6677,14.88,24.89,0.1675,0.211,27.44,1.06,[6]],[1.8,"low",0.034,0.039,0.0,0.034,0.0,0.0,0.6717,15.14,24.46,0.1689,0.2147,27.44,1.56,[6]],[3.2,"low",0.0606,0.0691,0.0,0.0606,0.0,0.0,0.6757,15.41,24.04,0.1702,0.2184,27.44,2.06,[6]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,15.68,23.64,0.1715,0.2221,27.44,2.56,[6]],[6.0,"low",0.1123,0.1274,0.0,0.1123,0.0,0.0,0.6832,15.94,23.25,0.1728,0.2258,27.44,3.06,[6]],[7.3,"low",0.1375,0.1556,0.0,0.1375,0.0,0.0,0.6869,16.21,22.88,0.1741,0.2295,27.44,3.56,[6]],[8.6,"low",0.1624,0.1832,0.0,0.1624,0.0,0.0,0.6905,16.47,22.52,0.1753,0.2332,27.44,4.06,[6]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,16.74,22.16,0.1766,0.2369,27.44,4.56,[6]],[11.2,"low",0.2109,0.2364,0.0,0.2109,0.0,0.0,0.6974,17.0,21.82,0.1778,0.2406,27.44,5.06,[6]],[12.4,"low",0.2346,0.2622,0.0,0.2346,0.0,0.0,0.7008,17.27,21.49,0.1791,0.2443,27.44,5.56,[6]],[13.6,"low",0.2579,0.2875,0.0,0.2579,0.0,0.0,0.7041,17.54,21.17,0.1803,0.248,27.44,6.06,[6]],[14.8,"low",0.2809,0.3122,0.0,0.2809,0.0,0.0,0.7073,17.8,20.86,0.1815,0.2517,27.44,6.56,[6]],[16.0,"low",0.3035,0.3364,0.0,0.3035,0.0,0.0,0.7104,18.07,20.56,0.1827,0.2554,27.44,7.06,[6]],[17.2,"low",0.3259,0.3601,0.0,0.3259,0.0,0.0,0.7135,18.34,20.27,0.1839,0.2591,27.44,7.56,[6]],[18.3,"low",0.3479,0.3833,0.0,0.3479,0.0,0.0,0.7165,18.6,19.98,0.1851,0.2628,27.44,8.06,[6]],[19.4,"low",0.3696,0.406,0.0,0.3696,0.0,0.0,0.7195,18.87,19.7,0.1863,0.2665,27.44,8.56,[6]],[20.5,"low",0.391,0.4283,0.0,0.391,0.0,0.0,0.7224,19.14,19.43,0.1875,0.2702,27.44,9.06,[6]],[21.6,"low",0.4121,0.4501,0.0,0.4121,0.0,0.0,0.7252,19.4,19.17,0.1886,0.2739,27.44,9.56,[6]],[22.6,"low",0.4329,0.4715,0.0,0.4329,0.0,0.0,0.728,19.67,18.91,0.1898,0.2776,27.44,10.06,[6]],[24.1,"low",0.4535,0.4925,0.0,0.4535,0.0166,0.0,0.7308,19.94,18.67,0.1909,0.2813,27.44,10.56,[6]],[25.6,"low",0.4738,0.5131,0.0,0.4738,0.036,0.0,0.7334,20.2,18.42,0.1921,0.285,27.44,11.06,[6]],[27.1,"low",0.4938,0.5333,0.0,0.4938,0.0555,0.0,0.7361,20.47,18.19,0.1932,0.2887,27.44,11.56,[6]],[28.5,"low",0.5136,0.5531,0.0,0.5136,0.075,0.0,0.7386,20.74,17.96,0.1943,0.2924,27.44,12.06,[6]],[30.0,"low",0.5331,0.5725,0.0,0.5331,0.0945,0.0,0.7412,21.0,17.73,0.1954,0.2961,27.44,12.56,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,7.0,44.33,0.1289,0.1184,26.83,-11.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,7.24,42.9,0.1309,0.1224,26.83,-11.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,7.47,41.56,0.1328,0.1263,26.83,-10.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,7.71,40.3,0.1346,0.1303,26.83,-10.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,7.95,39.11,0.1365,0.1342,26.83,-9.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,8.19,38.0,0.1383,0.1382,26.83,-9.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,8.42,36.94,0.14,0.1421,26.83,-8.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,8.66,35.94,0.1418,0.1461,26.83,-8.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,8.9,35.0,0.1435,0.15,26.83,-7.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,9.14,34.1,0.1452,0.154,26.83,-7.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,9.38,33.25,0.1469,0.1579,26.83,-6.83,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,9.62,32.44,0.1486,0.1619,26.83,-6.33,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,9.85,31.66,0.1502,0.1658,26.83,-5.83,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,10.09,30.93,0.1518,0.1698,26.83,-5.33,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,10.33,30.22,0.1534,0.1737,26.83,-4.83,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,10.57,29.55,0.155,0.1776,26.83,-4.33,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,10.81,28.91,0.1565,0.1816,26.83,-3.83,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,11.05,28.3,0.1581,0.1855,26.83,-3.33,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,11.29,27.71,0.1596,0.1895,26.83,-2.83,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,11.53,27.14,0.1611,0.1934,26.83,-2.33,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,11.77,26.6,0.1626,0.1974,26.83,-1.83,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,12.0,26.08,0.164,0.2013,26.83,-1.33,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,12.24,25.57,0.1655,0.2053,26.83,-0.83,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6658,12.48,25.09,0.1669,0.2092,26.83,-0.33,[3]],[1.2,"low",0.0233,0.0267,0.0,0.0233,0.0,0.0,0.6701,12.72,24.63,0.1683,0.2132,26.83,0.17,[6]],[2.8,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0,0.6744,12.96,24.18,0.1698,0.2171,26.83,0.67,[6]],[4.3,"low",0.0797,0.0908,0.0,0.0797,0.0,0.0,0.6785,13.2,23.75,0.1712,0.2211,26.83,1.17,[6]],[5.7,"low",0.1072,0.1217,0.0,0.1072,0.0,0.0,0.6825,13.44,23.33,0.1725,0.225,26.83,1.67,[6]],[7.2,"low",0.1342,0.1519,0.0,0.1342,0.0,0.0,0.6864,13.68,22.93,0.1739,0.229,26.83,2.17,[6]],[8.5,"low",0.1607,0.1813,0.0,0.1607,0.0,0.0,0.6903,13.92,22.54,0.1753,0.2329,26.83,2.67,[6]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,14.16,22.16,0.1766,0.2369,26.83,3.17,[6]],[11.3,"low",0.2125,0.2382,0.0,0.2125,0.0,0.0,0.6977,14.4,21.8,0.1779,0.2408,26.83,3.67,[6]],[12.6,"low",0.2377,0.2656,0.0,0.2377,0.0,0.0,0.7012,14.64,21.45,0.1792,0.2448,26.83,4.17,[6]],[13.9,"low",0.2625,0.2925,0.0,0.2625,0.0,0.0,0.7047,14.88,21.11,0.1806,0.2487,26.83,4.67,[6]],[15.1,"low",0.287,0.3187,0.0,0.287,0.0,0.0,0.7081,15.12,20.78,0.1818,0.2527,26.83,5.17,[6]],[16.4,"low",0.311,0.3443,0.0,0.311,0.0,0.0,0.7115,15.36,20.46,0.1831,0.2566,26.83,5.67,[6]],[17.6,"low",0.3347,0.3694,0.0,0.3347,0.0,0.0,0.7147,15.6,20.15,0.1844,0.2605,26.83,6.17,[6]],[18.8,"low",0.3581,0.3939,0.0,0.3581,0.0,0.0,0.7179,15.84,19.85,0.1857,0.2645,26.83,6.67,[6]],[20.0,"low",0.381,0.4179,0.0,0.381,0.0,0.0,0.7211,16.08,19.56,0.1869,0.2684,26.83,7.17,[6]],[21.1,"low",0.4037,0.4414,0.0,0.4037,0.0,0.0,0.7241,16.33,19.27,0.1882,0.2724,26.83,7.67,[6]],[22.3,"low",0.426,0.4644,0.0,0.426,0.0,0.0,0.7271,16.57,19.0,0.1894,0.2763,26.83,8.17,[6]],[23.4,"low",0.448,0.487,0.0,0.448,0.0,0.0,0.73,16.81,18.73,0.1906,0.2803,26.83,8.67,[6]],[24.5,"low",0.4698,0.509,0.0,0.4698,0.0,0.0,0.7329,17.05,18.47,0.1918,0.2842,26.83,9.17,[6]],[25.7,"low",0.4912,0.5306,0.0,0.4912,0.0071,0.0,0.7357,17.29,18.22,0.193,0.2882,26.83,9.67,[6]],[27.3,"low",0.5123,0.5518,0.0,0.5123,0.0279,0.0,0.7385,17.53,17.97,0.1942,0.2921,26.83,10.17,[6]],[28.9,"low",0.5331,0.5725,0.0,0.5331,0.0487,0.0,0.7412,17.77,17.73,0.1954,0.2961,26.83,10.67,[6]],[30.4,"low",0.5537,0.5929,0.0,0.5537,0.0694,0.0,0.7438,18.01,17.5,0.1966,0.3,26.83,11.17,[6]],[31.9,"low",0.574,0.6128,0.0,0.574,0.0902,0.0,0.7464,18.25,17.27,0.1978,0.304,26.83,11.67,[6]],[33.4,"low",0.594,0.6324,0.0,0.594,0.111,0.0,0.749,18.49,17.05,0.1989,0.3079,26.83,12.17,[6]],[34.9,"low",0.6137,0.6515,0.0,0.6137,0.1318,0.0,0.7515,18.73,16.83,0.2001,0.3119,26.83,12.67,[6]],[36.4,"medium",0.6333,0.6703,0.0,0.6333,0.1525,0.0,0.7539,18.98,16.62,0.2012,0.3158,26.83,13.17,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,6.36,41.72,0.1325,0.1258,26.27,-11.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,6.58,40.38,0.1345,0.13,26.27,-10.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,6.79,39.11,0.1365,0.1342,26.27,-10.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,7.01,37.93,0.1384,0.1384,26.27,-9.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,7.23,36.81,0.1403,0.1426,26.27,-9.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,7.44,35.76,0.1421,0.1468,26.27,-8.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,7.66,34.77,0.144,0.151,26.27,-8.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,7.87,33.83,0.1458,0.1552,26.27,-7.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,8.09,32.94,0.1475,0.1594,26.27,-7.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,8.31,32.09,0.1493,0.1636,26.27,-6.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,8.52,31.29,0.151,0.1678,26.27,-6.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,8.74,30.53,0.1527,0.172,26.27,-5.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,8.96,29.8,0.1544,0.1762,26.27,-5.27,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,9.17,29.11,0.156,0.1804,26.27,-4.77,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,9.39,28.45,0.1577,0.1846,26.27,-4.27,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,9.61,27.81,0.1593,0.1887,26.27,-3.77,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,9.83,27.21,0.1609,0.1929,26.27,-3.27,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6518,10.04,26.63,0.1625,0.1971,26.27,-2.77,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,10.26,26.08,0.164,0.2013,26.27,-2.27,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6616,10.48,25.54,0.1656,0.2055,26.27,-1.77,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6664,10.7,25.03,0.1671,0.2097,26.27,-1.27,[3]],[1.5,"low",0.0287,0.0329,0.0,0.0287,0.0,0.0,0.6709,10.91,24.54,0.1686,0.2139,26.27,-0.77,[3]],[3.1,"low",0.0588,0.0672,0.0,0.0588,0.0,0.0,0.6754,11.13,24.07,0.1701,0.2181,26.27,-0.27,[3]],[4.7,"low",0.0884,0.1006,0.0,0.0884,0.0,0.0,0.6798,11.35,23.62,0.1716,0.2223,26.27,0.23,[6]],[6.3,"low",0.1174,0.1331,0.0,0.1174,0.0,0.0,0.684,11.57,23.18,0.173,0.2265,26.27,0.73,[6]],[7.8,"low",0.1459,0.1649,0.0,0.1459,0.0,0.0,0.6881,11.78,22.76,0.1745,0.2307,26.27,1.23,[6]],[9.2,"low",0.1738,0.1958,0.0,0.1738,0.0,0.0,0.6921,12.0,22.35,0.1759,0.2349,26.27,1.73,[6]],[10.7,"low",0.2013,0.226,0.0,0.2013,0.0,0.0,0.6961,12.22,21.96,0.1773,0.2391,26.27,2.23,[6]],[12.1,"low",0.2283,0.2554,0.0,0.2283,0.0,0.0,0.6999,12.44,21.58,0.1788,0.2433,26.27,2.73,[6]],[13.5,"low",0.2548,0.2841,0.0,0.2548,0.0,0.0,0.7036,12.66,21.21,0.1801,0.2475,26.27,3.23,[6]],[14.8,"low",0.2809,0.3122,0.0,0.2809,0.0,0.0,0.7073,12.87,20.86,0.1815,0.2517,26.27,3.73,[6]],[16.2,"low",0.3065,0.3396,0.0,0.3065,0.0,0.0,0.7109,13.09,20.52,0.1829,0.2559,26.27,4.23,[6]],[17.5,"low",0.3318,0.3663,0.0,0.3318,0.0,0.0,0.7143,13.31,20.19,0.1842,0.2601,26.27,4.73,[6]],[18.7,"low",0.3566,0.3924,0.0,0.3566,0.0,0.0,0.7177,13.53,19.87,0.1856,0.2642,26.27,5.23,[6]],[20.0,"low",0.381,0.4179,0.0,0.381,0.0,0.0,0.7211,13.75,19.56,0.1869,0.2684,26.27,5.73,[6]],[21.2,"low",0.4051,0.4429,0.0,0.4051,0.0,0.0,0.7243,13.97,19.26,0.1882,0.2726,26.27,6.23,[6]],[22.4,"low",0.4288,0.4673,0.0,0.4288,0.0,0.0,0.7275,14.18,18.96,0.1896,0.2768,26.27,6.73,[6]],[23.6,"low",0.4521,0.4911,0.0,0.4521,0.0,0.0,0.7306,14.4,18.68,0.1909,0.281,26.27,7.23,[6]],[24.7,"low",0.4751,0.5145,0.0,0.4751,0.0,0.0,0.7336,14.62,18.41,0.1921,0.2852,26.27,7.73,[6]],[25.9,"low",0.4978,0.5373,0.0,0.4978,0.0,0.0,0.7366,14.84,18.14,0.1934,0.2894,26.27,8.23,[6]],[27.0,"low",0.5201,0.5596,0.0,0.5201,0.0,0.0,0.7395,15.06,17.88,0.1947,0.2936,26.27,8.73,[6]],[28.4,"low",0.5421,0.5815,0.0,0.5421,0.0129,0.0,0.7423,15.28,17.63,0.1959,0.2978,26.27,9.23,[6]],[30.0,"low",0.5638,0.6029,0.0,0.5638,0.035,0.0,0.7451,15.5,17.38,0.1972,0.302,26.27,9.73,[6]],[31.7,"low",0.5852,0.6238,0.0,0.5852,0.0571,0.0,0.7479,15.72,17.15,0.1984,0.3062,26.27,10.23,[6]],[33.2,"low",0.6064,0.6444,0.0,0.6064,0.0792,0.0,0.7505,15.93,16.91,0.1997,0.3104,26.27,10.73,[6]],[34.8,"low",0.6272,0.6645,0.0,0.6272,0.1012,0.0,0.7531,16.15,16.69,0.2009,0.3146,26.27,11.23,[6]],[36.4,"medium",0.6477,0.6842,0.0,0.6477,0.1233,0.0,0.7557,16.37,16.47,0.2021,0.3188,26.27,11.73,[]],[37.9,"medium",0.668,0.7035,0.0,0.668,0.1454,0.0,0.7582,16.59,16.26,0.2033,0.323,26.27,12.23,[]],[39.5,"medium",0.6881,0.7224,0.0,0.6881,0.1675,0.0,0.7607,16.81,16.05,0.2045,0.3272,26.27,12.73,[]],[41.0,"medium",0.7078,0.741,0.0,0.7078,0.1895,0.0,0.7631,17.03,15.84,0.2057,0.3314,26.27,13.23,[]],[42.5,"medium",0.7274,0.7592,0.0,0.7274,0.2116,0.0,0.7655,17.25,15.65,0.2069,0.3356,26.27,13.73,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,5.81,39.4,0.136,0.1332,25.75,-10.75,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,6.01,38.13,0.138,0.1377,25.75,-10.25,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,6.21,36.94,0.14,0.1421,25.75,-9.75,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,6.41,35.82,0.142,0.1466,25.75,-9.25,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,6.6,34.77,0.144,0.151,25.75,-8.75,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,6.8,33.78,0.1459,0.1554,25.75,-8.25,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,7.0,32.84,0.1477,0.1599,25.75,-7.75,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,7.2,31.95,0.1496,0.1643,25.75,-7.25,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,7.39,31.11,0.1514,0.1688,25.75,-6.75,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,7.59,30.31,0.1532,0.1732,25.75,-6.25,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,7.79,29.55,0.155,0.1776,25.75,-5.75,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,7.99,28.83,0.1567,0.1821,25.75,-5.25,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,8.19,28.15,0.1584,0.1865,25.75,-4.75,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,8.39,27.49,0.1601,0.191,25.75,-4.25,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,8.58,26.87,0.1618,0.1954,25.75,-3.75,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,8.78,26.27,0.1635,0.1999,25.75,-3.25,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,8.98,25.7,0.1651,0.2043,25.75,-2.75,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6653,9.18,25.15,0.1667,0.2087,25.75,-2.25,[3]],[1.2,"low",0.0233,0.0267,0.0,0.0233,0.0,0.0,0.6701,9.38,24.63,0.1683,0.2132,25.75,-1.75,[3]],[3.0,"low",0.0553,0.0632,0.0,0.0553,0.0,0.0,0.6749,9.58,24.12,0.1699,0.2176,25.75,-1.25,[3]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,9.78,23.64,0.1715,0.2221,25.75,-0.75,[3]],[6.3,"low",0.1174,0.1331,0.0,0.1174,0.0,0.0,0.684,9.97,23.18,0.173,0.2265,25.75,-0.25,[3]],[7.9,"low",0.1475,0.1667,0.0,0.1475,0.0,0.0,0.6884,10.17,22.73,0.1746,0.2309,25.75,0.25,[6]],[9.4,"low",0.1771,0.1994,0.0,0.1771,0.0,0.0,0.6926,10.37,22.3,0.1761,0.2354,25.75,0.75,[6]],[10.9,"low",0.2061,0.2312,0.0,0.2061,0.0,0.0,0.6968,10.57,21.89,0.1776,0.2398,25.75,1.25,[6]],[12.4,"low",0.2346,0.2622,0.0,0.2346,0.0,0.0,0.7008,10.77,21.49,0.1791,0.2443,25.75,1.75,[6]],[13.9,"low",0.2625,0.2925,0.0,0.2625,0.0,0.0,0.7047,10.97,21.11,0.1806,0.2487,25.75,2.25,[6]],[15.3,"low",0.29,0.3219,0.0,0.29,0.0,0.0,0.7086,11.17,20.74,0.182,0.2531,25.75,2.75,[6]],[16.7,"low",0.317,0.3506,0.0,0.317,0.0,0.0,0.7123,11.37,20.38,0.1835,0.2576,25.75,3.25,[6]],[18.1,"low",0.3435,0.3787,0.0,0.3435,0.0,0.0,0.7159,11.57,20.04,0.1849,0.262,25.75,3.75,[6]],[19.4,"low",0.3696,0.406,0.0,0.3696,0.0,0.0,0.7195,11.77,19.7,0.1863,0.2665,25.75,4.25,[6]],[20.7,"low",0.3952,0.4327,0.0,0.3952,0.0,0.0,0.723,11.97,19.38,0.1877,0.2709,25.75,4.75,[6]],[22.0,"low",0.4205,0.4587,0.0,0.4205,0.0,0.0,0.7264,12.17,19.07,0.1891,0.2754,25.75,5.25,[6]],[23.2,"low",0.4453,0.4842,0.0,0.4453,0.0,0.0,0.7297,12.37,18.76,0.1905,0.2798,25.75,5.75,[6]],[24.5,"low",0.4698,0.509,0.0,0.4698,0.0,0.0,0.7329,12.57,18.47,0.1918,0.2842,25.75,6.25,[6]],[25.7,"low",0.4938,0.5333,0.0,0.4938,0.0,0.0,0.7361,12.77,18.19,0.1932,0.2887,25.75,6.75,[6]],[26.9,"low",0.5175,0.557,0.0,0.5175,0.0,0.0,0.7392,12.96,17.91,0.1945,0.2931,25.75,7.25,[6]],[28.0,"low",0.5408,0.5802,0.0,0.5408,0.0,0.0,0.7422,13.16,17.64,0.1959,0.2976,25.75,7.75,[6]],[29.2,"low",0.5638,0.6029,0.0,0.5638,0.0,0.0,0.7451,13.36,17.38,0.1972,0.302,25.75,8.25,[6]],[30.7,"low",0.5865,0.6251,0.0,0.5865,0.0145,0.0,0.748,13.56,17.13,0.1985,0.3064,25.75,8.75,[6]],[32.3,"low",0.6088,0.6468,0.0,0.6088,0.0379,0.0,0.7508,13.76,16.89,0.1998,0.3109,25.75,9.25,[6]],[34.0,"low",0.6308,0.668,0.0,0.6308,0.0612,0.0,0.7536,13.96,16.65,0.2011,0.3153,25.75,9.75,[6]],[35.6,"medium",0.6525,0.6888,0.0,0.6525,0.0846,0.0,0.7563,14.16,16.42,0.2024,0.3198,25.75,10.25,[]],[37.3,"medium",0.674,0.7091,0.0,0.674,0.108,0.0,0.7589,14.36,16.19,0.2036,0.3242,25.75,10.75,[]],[38.9,"medium",0.6951,0.729,0.0,0.6951,0.1314,0.0,0.7615,14.56,15.97,0.2049,0.3286,25.75,11.25,[]],[40.5,"medium",0.7159,0.7485,0.0,0.7159,0.1547,0.0,0.7641,14.76,15.76,0.2062,0.3331,25.75,11.75,[]],[42.1,"medium",0.7365,0.7676,0.0,0.7365,0.1781,0.0,0.7666,14.97,15.55,0.2074,0.3375,25.75,12.25,[]],[43.6,"medium",0.7567,0.7863,0.0,0.7567,0.2015,0.0,0.769,15.17,15.35,0.2086,0.342,25.75,12.75,[]],[45.2,"medium",0.7768,0.8047,0.0,0.7768,0.2249,0.0,0.7714,15.37,15.16,0.2099,0.3464,25.75,13.25,[]],[46.7,"medium",0.7965,0.8226,0.0,0.7965,0.2482,0.0,0.7737,15.57,14.96,0.2111,0.3509,25.75,13.75,[]],[48.2,"medium",0.8161,0.8403,0.0,0.8161,0.2716,0.0,0.776,15.77,14.78,0.2123,0.3553,25.75,14.25,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,5.34,37.33,0.1394,0.1406,25.26,-10.26,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,5.52,36.13,0.1415,0.1453,25.26,-9.76,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,5.7,35.0,0.1435,0.15,25.26,-9.26,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,5.88,33.94,0.1455,0.1547,25.26,-8.76,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,6.07,32.94,0.1475,0.1594,25.26,-8.26,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,6.25,32.0,0.1495,0.1641,25.26,-7.76,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,6.43,31.11,0.1514,0.1688,25.26,-7.26,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,6.61,30.27,0.1533,0.1735,25.26,-6.76,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,6.79,29.47,0.1552,0.1781,25.26,-6.26,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,6.97,28.72,0.157,0.1828,25.26,-5.76,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,7.16,28.0,0.1588,0.1875,25.26,-5.26,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,7.34,27.31,0.1606,0.1922,25.26,-4.76,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,7.52,26.66,0.1624,0.1969,25.26,-4.26,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,7.7,26.04,0.1641,0.2016,25.26,-3.76,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,7.88,25.45,0.1658,0.2063,25.26,-3.26,[3]],[0.4,"low",0.007,0.0081,0.0,0.007,0.0,0.0,0.6677,8.07,24.89,0.1675,0.211,25.26,-2.76,[3]],[2.2,"low",0.0412,0.0471,0.0,0.0412,0.0,0.0,0.6728,8.25,24.35,0.1692,0.2156,25.26,-2.26,[3]],[4.0,"low",0.0745,0.085,0.0,0.0745,0.0,0.0,0.6777,8.43,23.83,0.1709,0.2203,25.26,-1.76,[3]],[5.7,"low",0.1072,0.1217,0.0,0.1072,0.0,0.0,0.6825,8.61,23.33,0.1725,0.225,25.26,-1.26,[3]],[7.4,"low",0.1392,0.1575,0.0,0.1392,0.0,0.0,0.6872,8.8,22.86,0.1742,0.2297,25.26,-0.76,[3]],[9.1,"low",0.1706,0.1922,0.0,0.1706,0.0,0.0,0.6917,8.98,22.4,0.1758,0.2344,25.26,-0.26,[3]],[10.7,"low",0.2013,0.226,0.0,0.2013,0.0,0.0,0.6961,9.16,21.96,0.1773,0.2391,25.26,0.24,[6]],[12.3,"low",0.2314,0.2588,0.0,0.2314,0.0,0.0,0.7003,9.34,21.54,0.1789,0.2438,25.26,0.74,[6]],[13.8,"low",0.261,0.2908,0.0,0.261,0.0,0.0,0.7045,9.53,21.13,0.1805,0.2485,25.26,1.24,[6]],[15.3,"low",0.29,0.3219,0.0,0.29,0.0,0.0,0.7086,9.71,20.74,0.182,0.2531,25.26,1.74,[6]],[16.8,"low",0.3185,0.3522,0.0,0.3185,0.0,0.0,0.7125,9.89,20.36,0.1835,0.2578,25.26,2.24,[6]],[18.2,"low",0.3464,0.3817,0.0,0.3464,0.0,0.0,0.7163,10.08,20.0,0.185,0.2625,25.26,2.74,[6]],[19.6,"low",0.3739,0.4105,0.0,0.3739,0.0,0.0,0.7201,10.26,19.65,0.1865,0.2672,25.26,3.24,[6]],[21.0,"low",0.4009,0.4385,0.0,0.4009,0.0,0.0,0.7237,10.44,19.31,0.188,0.2719,25.26,3.74,[6]],[22.3,"low",0.4274,0.4659,0.0,0.4274,0.0,0.0,0.7273,10.62,18.98,0.1895,0.2766,25.26,4.24,[6]],[23.6,"low",0.4535,0.4925,0.0,0.4535,0.0,0.0,0.7308,10.81,18.67,0.1909,0.2813,25.26,4.74,[6]],[24.9,"low",0.4792,0.5185,0.0,0.4792,0.0,0.0,0.7341,10.99,18.36,0.1924,0.286,25.26,5.24,[6]],[26.2,"low",0.5044,0.5439,0.0,0.5044,0.0,0.0,0.7375,11.17,18.06,0.1938,0.2906,25.26,5.74,[6]],[27.4,"low",0.5292,0.5687,0.0,0.5292,0.0,0.0,0.7407,11.36,17.78,0.1952,0.2953,25.26,6.24,[6]],[28.7,"low",0.5537,0.5929,0.0,0.5537,0.0,0.0,0.7438,11.54,17.5,0.1966,0.3,25.26,6.74,[6]],[29.9,"low",0.5777,0.6165,0.0,0.5777,0.0,0.0,0.7469,11.72,17.23,0.198,0.3047,25.26,7.24,[6]],[31.0,"low",0.6014,0.6396,0.0,0.6014,0.0,0.0,0.7499,11.91,16.97,0.1994,0.3094,25.26,7.74,[6]],[32.5,"low",0.6248,0.6621,0.0,0.6248,0.0117,0.0,0.7528,12.09,16.72,0.2007,0.3141,25.26,8.24,[6]],[34.2,"low",0.6477,0.6842,0.0,0.6477,0.0364,0.0,0.7557,12.27,16.47,0.2021,0.3188,25.26,8.74,[6]],[35.9,"medium",0.6704,0.7057,0.0,0.6704,0.061,0.0,0.7585,12.46,16.23,0.2034,0.3235,25.26,9.24,[]],[37.6,"medium",0.6927,0.7268,0.0,0.6927,0.0857,0.0,0.7613,12.64,16.0,0.2048,0.3282,25.26,9.74,[]],[39.3,"medium",0.7147,0.7474,0.0,0.7147,0.1104,0.0,0.7639,12.83,15.77,0.2061,0.3328,25.26,10.24,[]],[41.0,"medium",0.7365,0.7676,0.0,0.7365,0.1351,0.0,0.7666,13.01,15.55,0.2074,0.3375,25.26,10.74,[]],[42.6,"medium",0.7579,0.7874,0.0,0.7579,0.1597,0.0,0.7691,13.19,15.34,0.2087,0.3422,25.26,11.24,[]],[44.3,"medium",0.779,0.8067,0.0,0.779,0.1844,0.0,0.7716,13.38,15.13,0.21,0.3469,25.26,11.74,[]],[45.9,"medium",0.7998,0.8256,0.0,0.7998,0.2091,0.0,0.7741,13.56,14.93,0.2113,0.3516,25.26,12.24,[]],[47.5,"medium",0.8204,0.8441,0.0,0.8204,0.2338,0.0,0.7765,13.74,14.74,0.2126,0.3563,25.26,12.74,[]],[49.0,"medium",0.8407,0.8623,0.0,0.8407,0.2584,0.0,0.7789,13.93,14.54,0.2138,0.361,25.26,13.24,[]],[50.6,"medium",0.8607,0.88,0.0,0.8607,0.2831,0.0,0.7812,14.11,14.36,0.2151,0.3657,25.26,13.74,[]],[52.1,"medium",0.8804,0.8975,0.0,0.8804,0.3078,0.0,0.7835,14.3,14.18,0.2163,0.3703,25.26,14.24,[]],[53.7,"medium",0.9,0.9145,0.0,0.9,0.3325,0.0,0.7857,14.48,14.0,0.2176,0.375,25.26,14.74,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,4.93,35.46,0.1427,0.148,24.81,-9.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,5.09,34.32,0.1448,0.153,24.81,-9.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,5.26,33.25,0.1469,0.1579,24.81,-8.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,5.43,32.24,0.149,0.1628,24.81,-8.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,5.6,31.29,0.151,0.1678,24.81,-7.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,5.76,30.4,0.153,0.1727,24.81,-7.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,5.93,29.55,0.155,0.1776,24.81,-6.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,6.1,28.75,0.1569,0.1826,24.81,-6.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,6.27,28.0,0.1588,0.1875,24.81,-5.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,6.43,27.28,0.1607,0.1925,24.81,-5.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,6.6,26.6,0.1626,0.1974,24.81,-4.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,6.77,25.95,0.1644,0.2023,24.81,-4.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,6.94,25.33,0.1662,0.2073,24.81,-3.81,[3]],[0.9,"low",0.0161,0.0185,0.0,0.0161,0.0,0.0,0.6691,7.1,24.74,0.168,0.2122,24.81,-3.31,[3]],[2.8,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0,0.6744,7.27,24.18,0.1698,0.2171,24.81,-2.81,[3]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,7.44,23.64,0.1715,0.2221,24.81,-2.31,[3]],[6.4,"low",0.1208,0.1369,0.0,0.1208,0.0,0.0,0.6845,7.61,23.13,0.1732,0.227,24.81,-1.81,[3]],[8.2,"low",0.1541,0.174,0.0,0.1541,0.0,0.0,0.6893,7.78,22.64,0.1749,0.2319,24.81,-1.31,[3]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,7.95,22.16,0.1766,0.2369,24.81,-0.81,[3]],[11.6,"low",0.2188,0.2451,0.0,0.2188,0.0,0.0,0.6986,8.11,21.71,0.1783,0.2418,24.81,-0.31,[3]],[13.2,"low",0.2502,0.2791,0.0,0.2502,0.0,0.0,0.703,8.28,21.28,0.1799,0.2467,24.81,0.19,[6]],[14.8,"low",0.2809,0.3122,0.0,0.2809,0.0,0.0,0.7073,8.45,20.86,0.1815,0.2517,24.81,0.69,[6]],[16.4,"low",0.311,0.3443,0.0,0.311,0.0,0.0,0.7115,8.62,20.46,0.1831,0.2566,24.81,1.19,[6]],[17.9,"low",0.3406,0.3756,0.0,0.3406,0.0,0.0,0.7155,8.79,20.07,0.1847,0.2615,24.81,1.69,[6]],[19.4,"low",0.3696,0.406,0.0,0.3696,0.0,0.0,0.7195,8.96,19.7,0.1863,0.2665,24.81,2.19,[6]],[20.8,"low",0.3981,0.4356,0.0,0.3981,0.0,0.0,0.7234,9.13,19.34,0.1879,0.2714,24.81,2.69,[6]],[22.3,"low",0.426,0.4644,0.0,0.426,0.0,0.0,0.7271,9.29,19.0,0.1894,0.2763,24.81,3.19,[6]],[23.6,"low",0.4535,0.4925,0.0,0.4535,0.0,0.0,0.7308,9.46,18.67,0.1909,0.2813,24.81,3.69,[6]],[25.0,"low",0.4805,0.5199,0.0,0.4805,0.0,0.0,0.7343,9.63,18.34,0.1924,0.2862,24.81,4.19,[6]],[26.3,"low",0.507,0.5465,0.0,0.507,0.0,0.0,0.7378,9.8,18.03,0.1939,0.2911,24.81,4.69,[6]],[27.6,"low",0.5331,0.5725,0.0,0.5331,0.0,0.0,0.7412,9.97,17.73,0.1954,0.2961,24.81,5.19,[6]],[28.9,"low",0.5588,0.5979,0.0,0.5588,0.0,0.0,0.7445,10.14,17.44,0.1969,0.301,24.81,5.69,[6]],[30.2,"low",0.584,0.6226,0.0,0.584,0.0,0.0,0.7477,10.31,17.16,0.1984,0.3059,24.81,6.19,[6]],[31.4,"low",0.6088,0.6468,0.0,0.6088,0.0,0.0,0.7508,10.48,16.89,0.1998,0.3109,24.81,6.69,[6]],[32.6,"low",0.6333,0.6703,0.0,0.6333,0.0,0.0,0.7539,10.65,16.62,0.2012,0.3158,24.81,7.19,[6]],[33.9,"low",0.6573,0.6933,0.0,0.6573,0.0045,0.0,0.7569,10.82,16.37,0.2027,0.3208,24.81,7.69,[6]],[35.7,"medium",0.681,0.7158,0.0,0.681,0.0305,0.0,0.7598,10.98,16.12,0.2041,0.3257,24.81,8.19,[]],[37.5,"medium",0.7044,0.7377,0.0,0.7044,0.0564,0.0,0.7627,11.15,15.88,0.2055,0.3306,24.81,8.69,[]],[39.2,"medium",0.7274,0.7592,0.0,0.7274,0.0824,0.0,0.7655,11.32,15.65,0.2069,0.3356,24.81,9.19,[]],[41.0,"medium",0.75,0.7801,0.0,0.75,0.1084,0.0,0.7682,11.49,15.42,0.2082,0.3405,24.81,9.69,[]],[42.7,"medium",0.7723,0.8006,0.0,0.7723,0.1344,0.0,0.7709,11.66,15.2,0.2096,0.3454,24.81,10.19,[]],[44.4,"medium",0.7944,0.8207,0.0,0.7944,0.1603,0.0,0.7735,11.83,14.98,0.2109,0.3504,24.81,10.69,[]],[46.1,"medium",0.8161,0.8403,0.0,0.8161,0.1863,0.0,0.776,12.0,14.78,0.2123,0.3553,24.81,11.19,[]],[47.7,"medium",0.8375,0.8594,0.0,0.8375,0.2123,0.0,0.7785,12.17,14.57,0.2136,0.3602,24.81,11.69,[]],[49.4,"medium",0.8586,0.8782,0.0,0.8586,0.2382,0.0,0.781,12.34,14.38,0.2149,0.3652,24.81,12.19,[]],[51.0,"medium",0.8794,0.8966,0.0,0.8794,0.2642,0.0,0.7833,12.51,14.19,0.2163,0.3701,24.81,12.69,[]],[52.6,"medium",0.9,0.9145,0.0,0.9,0.2902,0.0,0.7857,12.68,14.0,0.2176,0.375,24.81,13.19,[]],[54.2,"medium",0.9203,0.9321,0.0,0.9203,0.3162,0.0,0.788,12.85,13.82,0.2189,0.38,24.81,13.69,[]],[55.8,"medium",0.9403,0.9494,0.0,0.9403,0.3421,0.0,0.7902,13.02,13.64,0.2201,0.3849,24.81,14.19,[]],[57.4,"medium",0.9601,0.9663,0.0,0.9601,0.3681,0.0,0.7924,13.19,13.47,0.2214,0.3898,24.81,14.69,[]],[58.9,"medium",0.9796,0.9828,0.0,0.9796,0.3941,0.0,0.7946,13.36,13.3,0.2227,0.3948,24.81,15.19,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,4.83,35.01,0.1435,0.15,24.7,-9.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,4.99,33.88,0.1457,0.155,24.7,-9.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,5.15,32.82,0.1478,0.16,24.7,-8.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,5.32,31.83,0.1498,0.165,24.7,-8.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,5.48,30.89,0.1519,0.17,24.7,-7.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,5.65,30.01,0.1539,0.175,24.7,-7.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,5.81,29.17,0.1559,0.18,24.7,-6.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,5.98,28.39,0.1578,0.185,24.7,-6.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,6.14,27.64,0.1598,0.19,24.7,-5.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,6.3,26.93,0.1617,0.195,24.7,-5.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,6.47,26.26,0.1635,0.2,24.7,-4.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,6.63,25.62,0.1654,0.2049,24.7,-4.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,6.8,25.01,0.1672,0.2099,24.7,-3.7,[3]],[1.9,"low",0.0361,0.0414,0.0,0.0361,0.0,0.0,0.672,6.96,24.42,0.169,0.2149,24.7,-3.2,[3]],[3.8,"low",0.0718,0.0819,0.0,0.0718,0.0,0.0,0.6773,7.13,23.87,0.1708,0.2199,24.7,-2.7,[3]],[5.7,"low",0.1067,0.1212,0.0,0.1067,0.0,0.0,0.6824,7.29,23.34,0.1725,0.2249,24.7,-2.2,[3]],[7.5,"low",0.1408,0.1592,0.0,0.1408,0.0,0.0,0.6874,7.46,22.83,0.1742,0.2299,24.7,-1.7,[3]],[9.3,"low",0.1742,0.1962,0.0,0.1742,0.0,0.0,0.6922,7.62,22.35,0.1759,0.2349,24.7,-1.2,[3]],[11.0,"low",0.2068,0.2321,0.0,0.2068,0.0,0.0,0.6969,7.79,21.88,0.1776,0.2399,24.7,-0.7,[3]],[12.6,"low",0.2388,0.2669,0.0,0.2388,0.0,0.0,0.7014,7.95,21.43,0.1793,0.2449,24.7,-0.2,[3]],[14.3,"low",0.2702,0.3007,0.0,0.2702,0.0,0.0,0.7058,8.12,21.01,0.181,0.2499,24.7,0.3,[6]],[15.9,"low",0.3009,0.3336,0.0,0.3009,0.0,0.0,0.7101,8.28,20.59,0.1826,0.2549,24.7,0.8,[6]],[17.4,"low",0.3311,0.3655,0.0,0.3311,0.0,0.0,0.7142,8.45,20.2,0.1842,0.2599,24.7,1.3,[6]],[18.9,"low",0.3606,0.3966,0.0,0.3606,0.0,0.0,0.7183,8.61,19.82,0.1858,0.2649,24.7,1.8,[6]],[20.4,"low",0.3896,0.4269,0.0,0.3896,0.0,0.0,0.7222,8.78,19.45,0.1874,0.2699,24.7,2.3,[6]],[21.9,"low",0.4181,0.4563,0.0,0.4181,0.0,0.0,0.726,8.94,19.1,0.189,0.2749,24.7,2.8,[6]],[23.3,"low",0.4461,0.485,0.0,0.4461,0.0,0.0,0.7298,9.11,18.75,0.1905,0.2799,24.7,3.3,[6]],[24.7,"low",0.4735,0.5129,0.0,0.4735,0.0,0.0,0.7334,9.27,18.43,0.192,0.2849,24.7,3.8,[6]],[26.0,"low",0.5005,0.54,0.0,0.5005,0.0,0.0,0.7369,9.44,18.11,0.1936,0.2899,24.7,4.3,[6]],[27.3,"low",0.5271,0.5665,0.0,0.5271,0.0,0.0,0.7404,9.6,17.8,0.1951,0.2949,24.7,4.8,[6]],[28.6,"low",0.5532,0.5924,0.0,0.5532,0.0,0.0,0.7438,9.77,17.5,0.1966,0.2999,24.7,5.3,[6]],[29.9,"low",0.5788,0.6176,0.0,0.5788,0.0,0.0,0.747,9.94,17.22,0.1981,0.3049,24.7,5.8,[6]],[31.2,"low",0.604,0.6421,0.0,0.604,0.0,0.0,0.7502,10.1,16.94,0.1995,0.3099,24.7,6.3,[6]],[32.4,"low",0.6289,0.6661,0.0,0.6289,0.0,0.0,0.7534,10.27,16.67,0.201,0.3149,24.7,6.8,[6]],[33.6,"low",0.6533,0.6895,0.0,0.6533,0.0,0.0,0.7564,10.43,16.41,0.2024,0.3199,24.7,7.3,[6]],[35.1,"medium",0.6774,0.7123,0.0,0.6774,0.0156,0.0,0.7594,10.6,16.16,0.2038,0.3249,24.7,7.8,[]],[36.9,"medium",0.7011,0.7346,0.0,0.7011,0.0419,0.0,0.7623,10.76,15.91,0.2053,0.3299,24.7,8.3,[]],[38.7,"medium",0.7244,0.7564,0.0,0.7244,0.0682,0.0,0.7651,10.93,15.68,0.2067,0.3349,24.7,8.8,[]],[40.5,"medium",0.7474,0.7777,0.0,0.7474,0.0945,0.0,0.7679,11.1,15.44,0.2081,0.3399,24.7,9.3,[]],[42.2,"medium",0.7701,0.7985,0.0,0.7701,0.1208,0.0,0.7706,11.26,15.22,0.2095,0.3449,24.7,9.8,[]],[44.0,"medium",0.7924,0.8189,0.0,0.7924,0.1471,0.0,0.7732,11.43,15.0,0.2108,0.3499,24.7,10.3,[]],[45.7,"medium",0.8144,0.8388,0.0,0.8144,0.1734,0.0,0.7758,11.59,14.79,0.2122,0.3549,24.7,10.8,[]],[47.3,"medium",0.8361,0.8582,0.0,0.8361,0.1997,0.0,0.7784,11.76,14.59,0.2135,0.3599,24.7,11.3,[]],[49.0,"medium",0.8575,0.8772,0.0,0.8575,0.2261,0.0,0.7808,11.93,14.39,0.2149,0.3649,24.7,11.8,[]],[50.7,"medium",0.8786,0.8959,0.0,0.8786,0.2524,0.0,0.7833,12.09,14.19,0.2162,0.3699,24.7,12.3,[]],[52.3,"medium",0.8995,0.9141,0.0,0.8995,0.2787,0.0,0.7856,12.26,14.0,0.2175,0.3749,24.7,12.8,[]],[53.9,"medium",0.92,0.9319,0.0,0.92,0.305,0.0,0.788,12.42,13.82,0.2188,0.3799,24.7,13.3,[]],[55.5,"medium",0.9403,0.9494,0.0,0.9403,0.3313,0.0,0.7902,12.59,13.64,0.2201,0.3849,24.7,13.8,[]],[57.1,"medium",0.9603,0.9665,0.0,0.9603,0.3576,0.0,0.7925,12.76,13.46,0.2214,0.3899,24.7,14.3,[]],[58.7,"medium",0.9801,0.9833,0.0,0.9801,0.3839,0.0,0.7946,12.92,13.29,0.2227,0.3949,24.7,14.8,[]],[60.2,"medium",0.9996,0.9997,0.0,0.9996,0.4102,0.0,0.7968,13.09,13.13,0.224,0.3999,24.7,15.3,[]]]],"PMMA":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,29.32,70.93,0.1041,0.074,17.29,-2.29,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,30.31,68.64,0.1057,0.0765,17.29,-1.79,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,31.3,66.49,0.1072,0.079,17.29,-1.29,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,32.3,64.48,0.1088,0.0814,17.29,-0.79,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,33.29,62.58,0.1102,0.0839,17.29,-0.29,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,34.29,60.8,0.1117,0.0864,17.29,0.21,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,35.29,59.11,0.1131,0.0888,17.29,0.71,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,36.28,57.51,0.1145,0.0913,17.29,1.21,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,37.28,56.0,0.1159,0.0938,17.29,1.71,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,38.28,54.56,0.1173,0.0962,17.29,2.21,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,39.28,53.2,0.1187,0.0987,17.29,2.71,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,40.28,51.9,0.12,0.1012,17.29,3.21,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,41.28,50.66,0.1213,0.1036,17.29,3.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,42.28,49.48,0.1226,0.1061,17.29,4.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,43.28,48.36,0.1239,0.1086,17.29,4.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,44.28,47.29,0.1252,0.111,17.29,5.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,45.28,46.26,0.1265,0.1135,17.29,5.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,46.28,45.27,0.1277,0.116,17.29,6.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,47.28,44.33,0.1289,0.1184,17.29,6.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,48.28,43.43,0.1301,0.1209,17.29,7.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,49.29,42.56,0.1313,0.1234,17.29,7.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,50.29,41.72,0.1325,0.1258,17.29,8.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,51.29,40.92,0.1337,0.1283,17.29,8.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,52.29,40.15,0.1349,0.1308,17.29,9.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,53.3,39.4,0.136,0.1332,17.29,9.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,54.3,38.69,0.1371,0.1357,17.29,10.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,55.31,38.0,0.1383,0.1382,17.29,10.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,56.31,37.33,0.1394,0.1406,17.29,11.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,57.32,36.69,0.1405,0.1431,17.29,11.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,58.32,36.06,0.1416,0.1456,17.29,12.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,59.33,35.46,0.1427,0.148,17.29,12.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,60.33,34.88,0.1437,0.1505,17.29,13.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,61.34,34.32,0.1448,0.153,17.29,13.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,62.34,33.77,0.1459,0.1554,17.29,14.21,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,63.35,33.25,0.1469,0.1579,17.29,14.71,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0004,0.0,0.6014,64.36,32.74,0.1479,0.1604,17.29,15.21,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0134,0.0,0.6052,65.36,32.24,0.149,0.1628,17.29,15.71,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0264,0.0,0.609,66.37,31.76,0.15,0.1653,17.29,16.21,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0394,0.0,0.6127,67.38,31.29,0.151,0.1678,17.29,16.71,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0523,0.0,0.6163,68.39,30.84,0.152,0.1702,17.29,17.21,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0653,0.0,0.6198,69.4,30.4,0.153,0.1727,17.29,17.71,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0783,0.0,0.6233,70.4,29.97,0.154,0.1752,17.29,18.21,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0913,0.0,0.6267,71.41,29.55,0.155,0.1776,17.29,18.71,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.1043,0.0,0.6301,72.42,29.15,0.1559,0.1801,17.29,19.21,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1173,0.0,0.6334,73.43,28.75,0.1569,0.1826,17.29,19.71,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1303,0.0,0.6367,74.44,28.37,0.1579,0.185,17.29,20.21,[6,7]],[3.6,"low",0.0,0.0,0.0,0.0,0.1432,0.0,0.6399,75.45,28.0,0.1588,0.1875,17.29,20.71,[6,7]],[3.9,"low",0.0,0.0,0.0,0.0,0.1562,0.0,0.643,76.46,27.63,0.1598,0.19,17.29,21.21,[6,7]],[4.2,"low",0.0,0.0,0.0,0.0,0.1692,0.0,0.6461,77.47,27.28,0.1607,0.1925,17.29,21.71,[6,7]],[4.6,"low",0.0,0.0,0.0,0.0,0.1822,0.0,0.6491,78.48,26.93,0.1616,0.1949,17.29,22.21,[6,7]],[4.9,"low",0.0,0.0,0.0,0.0,0.1952,0.0,0.6521,79.49,26.6,0.1626,0.1974,17.29,22.71,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,25.23,64.48,0.1088,0.0814,16.72,-1.72,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,26.09,62.4,0.1104,0.0841,16.72,-1.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,26.95,60.45,0.112,0.0868,16.72,-0.72,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,27.8,58.62,0.1136,0.0896,16.72,-0.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,28.66,56.89,0.1151,0.0923,16.72,0.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,29.52,55.27,0.1166,0.095,16.72,0.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,30.37,53.73,0.1181,0.0977,16.72,1.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,31.23,52.28,0.1196,0.1004,16.72,1.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,32.09,50.9,0.1211,0.1031,16.72,2.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,32.95,49.6,0.1225,0.1058,16.72,2.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,33.81,48.36,0.1239,0.1086,16.72,3.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,34.67,47.18,0.1253,0.1113,16.72,3.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,35.53,46.06,0.1267,0.114,16.72,4.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,36.39,44.99,0.1281,0.1167,16.72,4.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,37.25,43.96,0.1294,0.1194,16.72,5.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,38.11,42.99,0.1307,0.1221,16.72,5.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,38.97,42.05,0.132,0.1248,16.72,6.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,39.84,41.16,0.1333,0.1276,16.72,6.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,40.7,40.3,0.1346,0.1303,16.72,7.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,41.56,39.48,0.1359,0.133,16.72,7.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,42.42,38.69,0.1371,0.1357,16.72,8.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,43.29,37.93,0.1384,0.1384,16.72,8.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,44.15,37.2,0.1396,0.1411,16.72,9.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,45.01,36.5,0.1408,0.1438,16.72,9.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,45.88,35.82,0.142,0.1466,16.72,10.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,46.74,35.17,0.1432,0.1493,16.72,10.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,47.61,34.54,0.1444,0.152,16.72,11.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,48.47,33.94,0.1455,0.1547,16.72,11.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,49.34,33.35,0.1467,0.1574,16.72,12.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,50.2,32.79,0.1478,0.1601,16.72,12.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,51.07,32.24,0.149,0.1628,16.72,13.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,51.93,31.71,0.1501,0.1656,16.72,13.78,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0133,0.0,0.6134,52.8,31.2,0.1512,0.1683,16.72,14.28,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0275,0.0,0.6174,53.66,30.7,0.1523,0.171,16.72,14.78,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0418,0.0,0.6212,54.53,30.22,0.1534,0.1737,16.72,15.28,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.0561,0.0,0.625,55.4,29.76,0.1545,0.1764,16.72,15.78,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.0704,0.0,0.6288,56.26,29.31,0.1556,0.1791,16.72,16.28,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0847,0.0,0.6324,57.13,28.87,0.1566,0.1818,16.72,16.78,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.099,0.0,0.636,58.0,28.45,0.1577,0.1846,16.72,17.28,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1132,0.0,0.6395,58.87,28.03,0.1587,0.1873,16.72,17.78,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1275,0.0,0.643,59.73,27.63,0.1598,0.19,16.72,18.28,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1418,0.0,0.6464,60.6,27.24,0.1608,0.1927,16.72,18.78,[6,7]],[3.9,"low",0.0,0.0,0.0,0.0,0.1561,0.0,0.6497,61.47,26.87,0.1618,0.1954,16.72,19.28,[6,7]],[4.3,"low",0.0,0.0,0.0,0.0,0.1704,0.0,0.653,62.34,26.5,0.1628,0.1981,16.72,19.78,[6,7]],[4.6,"low",0.0,0.0,0.0,0.0,0.1847,0.0,0.6562,63.21,26.14,0.1639,0.2008,16.72,20.28,[6,7]],[5.0,"low",0.0,0.0,0.0,0.0,0.199,0.0,0.6594,64.08,25.79,0.1649,0.2036,16.72,20.78,[6,7]],[5.3,"low",0.0,0.0,0.0,0.0,0.2132,0.0,0.6625,64.94,25.45,0.1658,0.2063,16.72,21.28,[6,7]],[5.7,"low",0.0,0.0,0.0,0.0,0.2275,0.0,0.6655,65.81,25.12,0.1668,0.209,16.72,21.78,[6,7]],[7.0,"low",0.0125,0.0143,0.0125,0.0125,0.2418,0.0095,0.6685,66.68,24.8,0.1678,0.2117,16.72,22.28,[6]],[8.9,"low",0.0322,0.0369,0.0322,0.0322,0.2561,0.0246,0.6715,67.55,24.49,0.1688,0.2144,16.72,22.78,[6]],[10.7,"low",0.0518,0.0592,0.0518,0.0518,0.2704,0.0395,0.6744,68.42,24.18,0.1698,0.2171,16.72,23.28,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,24.19,62.77,0.1101,0.0836,16.56,-1.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,25.01,60.74,0.1117,0.0864,16.56,-1.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,25.83,58.84,0.1134,0.0892,16.56,-0.56,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,26.65,57.06,0.115,0.092,16.56,-0.06,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,27.47,55.38,0.1165,0.0948,16.56,0.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,28.29,53.8,0.1181,0.0976,16.56,0.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,29.12,52.31,0.1196,0.1004,16.56,1.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,29.94,50.89,0.1211,0.1032,16.56,1.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,30.76,49.55,0.1226,0.1059,16.56,2.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,31.59,48.28,0.124,0.1087,16.56,2.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,32.41,47.08,0.1254,0.1115,16.56,3.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,33.23,45.93,0.1269,0.1143,16.56,3.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,34.06,44.83,0.1283,0.1171,16.56,4.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,34.88,43.79,0.1296,0.1199,16.56,4.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,35.71,42.8,0.131,0.1227,16.56,5.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,36.53,41.85,0.1323,0.1255,16.56,5.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,37.36,40.94,0.1337,0.1283,16.56,6.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,38.19,40.06,0.135,0.131,16.56,6.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,39.01,39.23,0.1363,0.1338,16.56,7.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,39.84,38.43,0.1376,0.1366,16.56,7.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,40.67,37.66,0.1388,0.1394,16.56,8.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,41.49,36.92,0.1401,0.1422,16.56,8.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,42.32,36.21,0.1413,0.145,16.56,9.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,43.15,35.53,0.1425,0.1478,16.56,9.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,43.98,34.87,0.1438,0.1506,16.56,10.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,44.8,34.24,0.145,0.1533,16.56,10.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,45.63,33.63,0.1462,0.1561,16.56,11.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,46.46,33.04,0.1473,0.1589,16.56,11.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,47.29,32.47,0.1485,0.1617,16.56,12.44,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,48.12,31.92,0.1497,0.1645,16.56,12.94,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,48.95,31.38,0.1508,0.1673,16.56,13.44,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0143,0.0,0.616,49.78,30.87,0.1519,0.1701,16.56,13.94,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.029,0.0,0.62,50.61,30.37,0.1531,0.1729,16.56,14.44,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0437,0.0,0.624,51.44,29.89,0.1542,0.1756,16.56,14.94,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0583,0.0,0.6278,52.27,29.42,0.1553,0.1784,16.56,15.44,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.073,0.0,0.6316,53.1,28.97,0.1564,0.1812,16.56,15.94,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0877,0.0,0.6353,53.93,28.53,0.1575,0.184,16.56,16.44,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.1024,0.0,0.6389,54.76,28.1,0.1586,0.1868,16.56,16.94,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.117,0.0,0.6425,55.59,27.69,0.1596,0.1896,16.56,17.44,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1317,0.0,0.646,56.43,27.29,0.1607,0.1924,16.56,17.94,[6,7]],[3.7,"low",0.0,0.0,0.0,0.0,0.1464,0.0,0.6494,57.26,26.9,0.1617,0.1952,16.56,18.44,[6,7]],[4.0,"low",0.0,0.0,0.0,0.0,0.161,0.0,0.6528,58.09,26.52,0.1628,0.198,16.56,18.94,[6,7]],[4.4,"low",0.0,0.0,0.0,0.0,0.1757,0.0,0.6561,58.92,26.15,0.1638,0.2007,16.56,19.44,[6,7]],[4.8,"low",0.0,0.0,0.0,0.0,0.1904,0.0,0.6594,59.75,25.79,0.1648,0.2035,16.56,19.94,[6,7]],[5.1,"low",0.0,0.0,0.0,0.0,0.2051,0.0,0.6625,60.59,25.45,0.1659,0.2063,16.56,20.44,[6,7]],[5.5,"low",0.0,0.0,0.0,0.0,0.2197,0.0,0.6657,61.42,25.11,0.1669,0.2091,16.56,20.94,[6,7]],[6.9,"low",0.0139,0.016,0.0139,0.0139,0.2344,0.0106,0.6687,62.25,24.78,0.1679,0.2119,16.56,21.44,[6]],[8.8,"low",0.0342,0.0392,0.0342,0.0342,0.2491,0.0261,0.6718,63.09,24.45,0.1689,0.2147,16.56,21.94,[6]],[10.7,"low",0.0542,0.062,0.0542,0.0542,0.2638,0.0414,0.6747,63.92,24.14,0.1699,0.2175,16.56,22.44,[6]],[12.6,"low",0.074,0.0844,0.074,0.074,0.2784,0.0565,0.6776,64.75,23.84,0.1709,0.2203,16.56,22.94,[6]],[14.4,"low",0.0935,0.1064,0.0935,0.0935,0.2931,0.0714,0.6805,65.59,23.54,0.1718,0.223,16.56,23.44,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,22.01,59.11,0.1131,0.0888,16.22,-1.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,22.75,57.2,0.1148,0.0918,16.22,-0.72,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,23.5,55.41,0.1165,0.0947,16.22,-0.22,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,24.25,53.73,0.1181,0.0977,16.22,0.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,24.99,52.15,0.1197,0.1007,16.22,0.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,25.74,50.66,0.1213,0.1036,16.22,1.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,26.49,49.26,0.1229,0.1066,16.22,1.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,27.24,47.92,0.1244,0.1095,16.22,2.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,27.99,46.66,0.126,0.1125,16.22,2.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,28.74,45.47,0.1274,0.1155,16.22,3.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,29.49,44.33,0.1289,0.1184,16.22,3.78,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,30.24,43.25,0.1304,0.1214,16.22,4.28,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,30.99,42.22,0.1318,0.1244,16.22,4.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,31.74,41.24,0.1332,0.1273,16.22,5.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,32.49,40.3,0.1346,0.1303,16.22,5.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,33.24,39.4,0.136,0.1332,16.22,6.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,33.99,38.55,0.1374,0.1362,16.22,6.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,34.74,37.73,0.1387,0.1392,16.22,7.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,35.49,36.94,0.14,0.1421,16.22,7.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,36.24,36.19,0.1414,0.1451,16.22,8.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,37.0,35.46,0.1427,0.148,16.22,8.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,37.75,34.77,0.144,0.151,16.22,9.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,38.5,34.1,0.1452,0.154,16.22,9.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,39.26,33.46,0.1465,0.1569,16.22,10.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,40.01,32.84,0.1477,0.1599,16.22,10.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,40.76,32.24,0.149,0.1628,16.22,11.28,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,41.52,31.66,0.1502,0.1658,16.22,11.78,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,42.27,31.11,0.1514,0.1688,16.22,12.28,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0036,0.0,0.6184,43.02,30.57,0.1526,0.1717,16.22,12.78,[6,7]],[0.5,"low",0.0,0.0,0.0,0.0,0.0192,0.0,0.6226,43.78,30.05,0.1538,0.1747,16.22,13.28,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0348,0.0,0.6267,44.53,29.55,0.155,0.1776,16.22,13.78,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0504,0.0,0.6308,45.29,29.07,0.1561,0.1806,16.22,14.28,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.066,0.0,0.6347,46.04,28.6,0.1573,0.1836,16.22,14.78,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0816,0.0,0.6386,46.8,28.15,0.1584,0.1865,16.22,15.28,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0971,0.0,0.6424,47.56,27.71,0.1596,0.1895,16.22,15.78,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1127,0.0,0.6461,48.31,27.28,0.1607,0.1925,16.22,16.28,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1283,0.0,0.6497,49.07,26.87,0.1618,0.1954,16.22,16.78,[6,7]],[3.6,"low",0.0,0.0,0.0,0.0,0.1439,0.0,0.6533,49.82,26.47,0.1629,0.1984,16.22,17.28,[6,7]],[4.0,"low",0.0,0.0,0.0,0.0,0.1595,0.0,0.6568,50.58,26.08,0.164,0.2013,16.22,17.78,[6,7]],[4.4,"low",0.0,0.0,0.0,0.0,0.1751,0.0,0.6602,51.34,25.7,0.1651,0.2043,16.22,18.28,[6,7]],[4.8,"low",0.0,0.0,0.0,0.0,0.1906,0.0,0.6636,52.09,25.33,0.1662,0.2073,16.22,18.78,[6,7]],[5.3,"low",0.0016,0.0018,0.0016,0.0016,0.2062,0.0012,0.6669,52.85,24.97,0.1673,0.2102,16.22,19.28,[6]],[7.3,"low",0.0233,0.0267,0.0233,0.0233,0.2218,0.0178,0.6701,53.61,24.63,0.1683,0.2132,16.22,19.78,[6]],[9.3,"low",0.0447,0.0511,0.0447,0.0447,0.2374,0.0341,0.6733,54.36,24.29,0.1694,0.2161,16.22,20.28,[6]],[11.3,"low",0.0658,0.0751,0.0658,0.0658,0.253,0.0502,0.6764,55.12,23.96,0.1705,0.2191,16.22,20.78,[6]],[13.3,"low",0.0866,0.0986,0.0866,0.0866,0.2686,0.0661,0.6795,55.88,23.64,0.1715,0.2221,16.22,21.28,[6]],[15.3,"low",0.1072,0.1217,0.1072,0.1072,0.2841,0.0818,0.6825,56.64,23.33,0.1725,0.225,16.22,21.78,[6]],[17.2,"low",0.1275,0.1444,0.1275,0.1275,0.2997,0.0973,0.6855,57.39,23.03,0.1736,0.228,16.22,22.28,[6]],[19.1,"low",0.1475,0.1667,0.1475,0.1475,0.3153,0.1126,0.6884,58.15,22.73,0.1746,0.2309,16.22,22.78,[6]],[21.0,"low",0.1673,0.1886,0.1673,0.1673,0.3309,0.1276,0.6912,58.91,22.45,0.1756,0.2339,16.22,23.28,[6]],[22.8,"low",0.1868,0.2101,0.1868,0.1868,0.3465,0.1425,0.694,59.67,22.16,0.1766,0.2369,16.22,23.78,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,19.4,54.56,0.1173,0.0962,15.77,-0.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,20.06,52.8,0.1191,0.0994,15.77,-0.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,20.72,51.15,0.1208,0.1026,15.77,0.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,21.38,49.6,0.1225,0.1058,15.77,0.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,22.04,48.14,0.1242,0.1091,15.77,1.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,22.7,46.77,0.1258,0.1123,15.77,1.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,23.36,45.47,0.1274,0.1155,15.77,2.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,24.02,44.24,0.129,0.1187,15.77,2.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,24.68,43.07,0.1306,0.1219,15.77,3.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,25.34,41.97,0.1322,0.1251,15.77,3.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,26.0,40.92,0.1337,0.1283,15.77,4.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,26.66,39.92,0.1352,0.1315,15.77,4.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,27.32,38.97,0.1367,0.1347,15.77,5.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,27.98,38.06,0.1382,0.1379,15.77,5.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,28.64,37.2,0.1396,0.1411,15.77,6.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,29.31,36.37,0.141,0.1443,15.77,6.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,29.97,35.58,0.1424,0.1475,15.77,7.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,30.63,34.83,0.1438,0.1508,15.77,7.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,31.29,34.1,0.1452,0.154,15.77,8.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,31.96,33.4,0.1466,0.1572,15.77,8.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,32.62,32.74,0.1479,0.1604,15.77,9.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,33.28,32.09,0.1493,0.1636,15.77,9.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,33.95,31.48,0.1506,0.1668,15.77,10.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,34.61,30.88,0.1519,0.17,15.77,10.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,35.28,30.31,0.1532,0.1732,15.77,11.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0013,0.0,0.625,35.94,29.76,0.1545,0.1764,15.77,11.73,[6,7]],[0.5,"low",0.0,0.0,0.0,0.0,0.0182,0.0,0.6294,36.6,29.23,0.1558,0.1796,15.77,12.23,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0351,0.0,0.6337,37.27,28.72,0.157,0.1828,15.77,12.73,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.052,0.0,0.638,37.93,28.22,0.1583,0.186,15.77,13.23,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0689,0.0,0.6421,38.6,27.74,0.1595,0.1892,15.77,13.73,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0857,0.0,0.6461,39.27,27.28,0.1607,0.1925,15.77,14.23,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.1026,0.0,0.65,39.93,26.83,0.1619,0.1957,15.77,14.73,[6,7]],[3.0,"low",0.0,0.0,0.0,0.0,0.1195,0.0,0.6539,40.6,26.4,0.1631,0.1989,15.77,15.23,[6,7]],[3.4,"low",0.0,0.0,0.0,0.0,0.1364,0.0,0.6577,41.26,25.98,0.1643,0.2021,15.77,15.73,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1533,0.0,0.6614,41.93,25.57,0.1655,0.2053,15.77,16.23,[6,7]],[4.3,"low",0.0,0.0,0.0,0.0,0.1701,0.0,0.665,42.6,25.18,0.1667,0.2085,15.77,16.73,[6,7]],[5.6,"low",0.0125,0.0143,0.0125,0.0125,0.187,0.0095,0.6685,43.26,24.8,0.1678,0.2117,15.77,17.23,[6]],[7.8,"low",0.0358,0.041,0.0358,0.0358,0.2039,0.0273,0.672,43.93,24.43,0.169,0.2149,15.77,17.73,[6]],[10.0,"low",0.0588,0.0672,0.0588,0.0588,0.2208,0.0449,0.6754,44.6,24.07,0.1701,0.2181,15.77,18.23,[6]],[12.1,"low",0.0815,0.0928,0.0815,0.0815,0.2377,0.0622,0.6787,45.26,23.72,0.1712,0.2213,15.77,18.73,[6]],[14.3,"low",0.1038,0.1179,0.1038,0.1038,0.2545,0.0792,0.682,45.93,23.38,0.1724,0.2245,15.77,19.23,[6]],[16.3,"low",0.1258,0.1425,0.1258,0.1258,0.2714,0.096,0.6852,46.6,23.05,0.1735,0.2277,15.77,19.73,[6]],[18.4,"low",0.1475,0.1667,0.1475,0.1475,0.2883,0.1126,0.6884,47.26,22.73,0.1746,0.2309,15.77,20.23,[6]],[20.4,"low",0.1689,0.1904,0.1689,0.1689,0.3052,0.1289,0.6914,47.93,22.42,0.1757,0.2341,15.77,20.73,[6]],[22.4,"low",0.19,0.2136,0.19,0.19,0.3221,0.145,0.6945,48.6,22.12,0.1768,0.2374,15.77,21.23,[6]],[24.4,"low",0.2109,0.2364,0.2109,0.2109,0.339,0.1609,0.6974,49.27,21.82,0.1778,0.2406,15.77,21.73,[6]],[26.4,"low",0.2314,0.2588,0.2314,0.2314,0.3558,0.1766,0.7003,49.94,21.54,0.1789,0.2438,15.77,22.23,[6]],[28.3,"low",0.2517,0.2808,0.2517,0.2517,0.3727,0.1921,0.7032,50.6,21.26,0.18,0.247,15.77,22.73,[6]],[30.2,"low",0.2717,0.3024,0.2717,0.2717,0.3896,0.2073,0.706,51.27,20.98,0.181,0.2502,15.77,23.23,[6]],[32.1,"low",0.2915,0.3235,0.2915,0.2915,0.4065,0.2224,0.7088,51.94,20.72,0.1821,0.2534,15.77,23.73,[6]],[34.0,"low",0.311,0.3443,0.311,0.311,0.4234,0.2373,0.7115,52.61,20.46,0.1831,0.2566,15.77,24.23,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,17.27,50.66,0.1213,0.1036,15.37,-0.37,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,17.85,49.03,0.1232,0.1071,15.37,0.13,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,18.44,47.5,0.1249,0.1105,15.37,0.63,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,19.03,46.06,0.1267,0.114,15.37,1.13,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,19.61,44.7,0.1284,0.1174,15.37,1.63,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,20.2,43.43,0.1301,0.1209,15.37,2.13,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,20.79,42.22,0.1318,0.1244,15.37,2.63,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,21.37,41.08,0.1335,0.1278,15.37,3.13,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,21.96,40.0,0.1351,0.1313,15.37,3.63,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,22.55,38.97,0.1367,0.1347,15.37,4.13,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,23.14,38.0,0.1383,0.1382,15.37,4.63,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,23.72,37.07,0.1398,0.1416,15.37,5.13,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,24.31,36.19,0.1414,0.1451,15.37,5.63,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,24.9,35.35,0.1429,0.1485,15.37,6.13,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,25.49,34.54,0.1444,0.152,15.37,6.63,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,26.08,33.77,0.1459,0.1554,15.37,7.13,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,26.67,33.04,0.1473,0.1589,15.37,7.63,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,27.26,32.34,0.1488,0.1623,15.37,8.13,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,27.85,31.66,0.1502,0.1658,15.37,8.63,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,28.44,31.02,0.1516,0.1693,15.37,9.13,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,29.03,30.4,0.153,0.1727,15.37,9.63,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,29.62,29.8,0.1544,0.1762,15.37,10.13,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,30.21,29.23,0.1558,0.1796,15.37,10.63,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0101,0.0,0.6341,30.8,28.68,0.1571,0.1831,15.37,11.13,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0283,0.0,0.6386,31.39,28.15,0.1584,0.1865,15.37,11.63,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0465,0.0,0.643,31.99,27.63,0.1598,0.19,15.37,12.13,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0647,0.0,0.6473,32.58,27.14,0.1611,0.1934,15.37,12.63,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0828,0.0,0.6515,33.17,26.66,0.1624,0.1969,15.37,13.13,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.101,0.0,0.6556,33.76,26.2,0.1637,0.2003,15.37,13.63,[6,7]],[3.0,"low",0.0,0.0,0.0,0.0,0.1192,0.0,0.6597,34.35,25.76,0.1649,0.2038,15.37,14.13,[6,7]],[3.4,"low",0.0,0.0,0.0,0.0,0.1374,0.0,0.6636,34.94,25.33,0.1662,0.2073,15.37,14.63,[6,7]],[4.3,"low",0.0052,0.006,0.0052,0.0052,0.1556,0.004,0.6674,35.54,24.92,0.1675,0.2107,15.37,15.13,[6]],[6.7,"low",0.0305,0.0349,0.0305,0.0305,0.1737,0.0232,0.6712,36.13,24.51,0.1687,0.2142,15.37,15.63,[6]],[9.0,"low",0.0553,0.0632,0.0553,0.0553,0.1919,0.0422,0.6749,36.72,24.12,0.1699,0.2176,15.37,16.13,[6]],[11.3,"low",0.0797,0.0908,0.0797,0.0797,0.2101,0.0608,0.6785,37.32,23.75,0.1712,0.2211,15.37,16.63,[6]],[13.6,"low",0.1038,0.1179,0.1038,0.1038,0.2283,0.0792,0.682,37.91,23.38,0.1724,0.2245,15.37,17.13,[6]],[15.8,"low",0.1275,0.1444,0.1275,0.1275,0.2465,0.0973,0.6855,38.5,23.03,0.1736,0.228,15.37,17.63,[6]],[18.1,"low",0.1508,0.1704,0.1508,0.1508,0.2646,0.1151,0.6888,39.1,22.68,0.1747,0.2314,15.37,18.13,[6]],[20.2,"low",0.1738,0.1958,0.1738,0.1738,0.2828,0.1326,0.6921,39.69,22.35,0.1759,0.2349,15.37,18.63,[6]],[22.4,"low",0.1965,0.2207,0.1965,0.1965,0.301,0.1499,0.6954,40.28,22.03,0.1771,0.2383,15.37,19.13,[6]],[24.5,"low",0.2188,0.2451,0.2188,0.2188,0.3192,0.1669,0.6986,40.88,21.71,0.1783,0.2418,15.37,19.63,[6]],[26.6,"low",0.2408,0.269,0.2408,0.2408,0.3374,0.1837,0.7017,41.47,21.41,0.1794,0.2453,15.37,20.13,[6]],[28.7,"low",0.2625,0.2925,0.2625,0.2625,0.3555,0.2003,0.7047,42.06,21.11,0.1806,0.2487,15.37,20.63,[6]],[30.7,"low",0.2839,0.3154,0.2839,0.2839,0.3737,0.2166,0.7077,42.66,20.82,0.1817,0.2522,15.37,21.13,[6]],[32.8,"low",0.305,0.338,0.305,0.305,0.3919,0.2327,0.7106,43.25,20.54,0.1828,0.2556,15.37,21.63,[6]],[34.8,"low",0.3259,0.3601,0.3259,0.3259,0.4101,0.2486,0.7135,43.85,20.27,0.1839,0.2591,15.37,22.13,[6]],[36.7,"medium",0.3464,0.3817,0.3464,0.3464,0.4283,0.2643,0.7163,44.44,20.0,0.185,0.2625,15.37,22.63,[]],[38.7,"medium",0.3667,0.403,0.3667,0.3667,0.4464,0.2798,0.7191,45.04,19.74,0.1861,0.266,15.37,23.13,[]],[40.6,"medium",0.3867,0.4239,0.3867,0.3867,0.4646,0.2951,0.7218,45.63,19.49,0.1872,0.2694,15.37,23.63,[]],[42.5,"medium",0.4065,0.4443,0.4065,0.4065,0.4828,0.3102,0.7245,46.23,19.24,0.1883,0.2729,15.37,24.13,[]],[44.4,"medium",0.426,0.4644,0.426,0.426,0.501,0.3251,0.7271,46.82,19.0,0.1894,0.2763,15.37,24.63,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,17.15,50.45,0.1216,0.1041,15.34,-0.34,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,17.73,48.82,0.1234,0.1075,15.34,0.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,18.32,47.29,0.1252,0.111,15.34,0.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,18.9,45.86,0.1269,0.1145,15.34,1.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,19.48,44.51,0.1287,0.1179,15.34,1.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,20.06,43.24,0.1304,0.1214,15.34,2.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,20.65,42.04,0.1321,0.1249,15.34,2.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,21.23,40.9,0.1337,0.1284,15.34,3.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,21.81,39.83,0.1353,0.1318,15.34,3.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,22.4,38.8,0.1369,0.1353,15.34,4.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,22.98,37.83,0.1385,0.1388,15.34,4.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,23.57,36.91,0.1401,0.1422,15.34,5.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,24.15,36.03,0.1416,0.1457,15.34,5.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,24.74,35.2,0.1432,0.1492,15.34,6.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,25.32,34.4,0.1447,0.1526,15.34,6.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,25.91,33.63,0.1461,0.1561,15.34,7.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,26.49,32.9,0.1476,0.1596,15.34,7.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,27.08,32.2,0.1491,0.163,15.34,8.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,27.66,31.53,0.1505,0.1665,15.34,8.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,28.25,30.89,0.1519,0.17,15.34,9.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,28.84,30.27,0.1533,0.1735,15.34,9.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,29.42,29.67,0.1547,0.1769,15.34,10.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,30.01,29.1,0.1561,0.1804,15.34,10.66,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0127,0.0,0.6351,30.6,28.55,0.1574,0.1839,15.34,11.16,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0309,0.0,0.6396,31.18,28.03,0.1588,0.1873,15.34,11.66,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0492,0.0,0.644,31.77,27.52,0.1601,0.1908,15.34,12.16,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0675,0.0,0.6483,32.36,27.02,0.1614,0.1943,15.34,12.66,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0857,0.0,0.6525,32.95,26.55,0.1627,0.1977,15.34,13.16,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.104,0.0,0.6567,33.53,26.09,0.164,0.2012,15.34,13.66,[6,7]],[3.1,"low",0.0,0.0,0.0,0.0,0.1222,0.0,0.6607,34.12,25.65,0.1653,0.2047,15.34,14.16,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1405,0.0,0.6646,34.71,25.22,0.1665,0.2081,15.34,14.66,[6,7]],[4.9,"low",0.0119,0.0136,0.0119,0.0119,0.1588,0.0091,0.6684,35.3,24.81,0.1678,0.2116,15.34,15.16,[6]],[7.3,"low",0.0371,0.0425,0.0371,0.0371,0.177,0.0283,0.6722,35.89,24.41,0.169,0.2151,15.34,15.66,[6]],[9.6,"low",0.0619,0.0707,0.0619,0.0619,0.1953,0.0473,0.6759,36.48,24.02,0.1703,0.2185,15.34,16.16,[6]],[11.9,"low",0.0864,0.0983,0.0864,0.0864,0.2135,0.0659,0.6795,37.07,23.65,0.1715,0.222,15.34,16.66,[6]],[14.2,"low",0.1104,0.1254,0.1104,0.1104,0.2318,0.0843,0.683,37.65,23.28,0.1727,0.2255,15.34,17.16,[6]],[16.4,"low",0.1341,0.1518,0.1341,0.1341,0.25,0.1023,0.6864,38.24,22.93,0.1739,0.229,15.34,17.66,[6]],[18.7,"low",0.1575,0.1777,0.1575,0.1575,0.2683,0.1201,0.6898,38.83,22.59,0.1751,0.2324,15.34,18.16,[6]],[20.8,"low",0.1805,0.2031,0.1805,0.1805,0.2866,0.1377,0.6931,39.42,22.26,0.1763,0.2359,15.34,18.66,[6]],[23.0,"low",0.2031,0.228,0.2031,0.2031,0.3048,0.155,0.6963,40.01,21.93,0.1774,0.2394,15.34,19.16,[6]],[25.1,"low",0.2254,0.2523,0.2254,0.2254,0.3231,0.172,0.6995,40.6,21.62,0.1786,0.2428,15.34,19.66,[6]],[27.2,"low",0.2475,0.2762,0.2475,0.2475,0.3413,0.1888,0.7026,41.19,21.32,0.1798,0.2463,15.34,20.16,[6]],[29.3,"low",0.2692,0.2996,0.2692,0.2692,0.3596,0.2054,0.7057,41.78,21.02,0.1809,0.2498,15.34,20.66,[6]],[31.3,"low",0.2906,0.3225,0.2906,0.2906,0.3778,0.2217,0.7086,42.37,20.73,0.182,0.2532,15.34,21.16,[6]],[33.4,"low",0.3117,0.345,0.3117,0.3117,0.3961,0.2378,0.7116,42.96,20.45,0.1832,0.2567,15.34,21.66,[6]],[35.4,"medium",0.3325,0.3671,0.3325,0.3325,0.4144,0.2537,0.7144,43.55,20.18,0.1843,0.2602,15.34,22.16,[]],[37.4,"medium",0.3531,0.3887,0.3531,0.3531,0.4326,0.2694,0.7173,44.14,19.91,0.1854,0.2636,15.34,22.66,[]],[39.3,"medium",0.3734,0.4099,0.3734,0.3734,0.4509,0.2849,0.72,44.73,19.65,0.1865,0.2671,15.34,23.16,[]],[41.2,"medium",0.3934,0.4307,0.3934,0.3934,0.4691,0.3001,0.7227,45.33,19.4,0.1876,0.2706,15.34,23.66,[]],[43.1,"medium",0.4132,0.4512,0.4132,0.4132,0.4874,0.3152,0.7254,45.92,19.16,0.1887,0.2741,15.34,24.16,[]],[45.0,"medium",0.4327,0.4712,0.4327,0.4327,0.5057,0.3301,0.728,46.51,18.92,0.1898,0.2775,15.34,24.66,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,15.49,47.29,0.1252,0.111,15.0,0.0,[1]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,16.02,45.76,0.1271,0.1147,15.0,0.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,16.54,44.33,0.1289,0.1184,15.0,1.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,17.07,42.99,0.1307,0.1221,15.0,1.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,17.59,41.72,0.1325,0.1258,15.0,2.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,18.12,40.53,0.1343,0.1295,15.0,2.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,18.65,39.4,0.136,0.1332,15.0,3.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,19.17,38.34,0.1377,0.1369,15.0,3.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,19.7,37.33,0.1394,0.1406,15.0,4.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,20.23,36.37,0.141,0.1443,15.0,4.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,20.76,35.46,0.1427,0.148,15.0,5.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,21.28,34.6,0.1443,0.1517,15.0,5.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,21.81,33.77,0.1459,0.1554,15.0,6.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,22.34,32.99,0.1474,0.1591,15.0,6.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,22.87,32.24,0.149,0.1628,15.0,7.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,23.4,31.52,0.1505,0.1665,15.0,7.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,23.93,30.84,0.152,0.1702,15.0,8.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,24.46,30.18,0.1535,0.1739,15.0,8.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,24.99,29.55,0.155,0.1776,15.0,9.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,25.52,28.95,0.1564,0.1813,15.0,9.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,26.05,28.37,0.1579,0.185,15.0,10.0,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0144,0.0,0.6414,26.57,27.81,0.1593,0.1887,15.0,10.5,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0338,0.0,0.6461,27.1,27.28,0.1607,0.1925,15.0,11.0,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0533,0.0,0.6506,27.64,26.77,0.1621,0.1962,15.0,11.5,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.0728,0.0,0.6551,28.17,26.27,0.1635,0.1999,15.0,12.0,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0923,0.0,0.6594,28.7,25.79,0.1649,0.2036,15.0,12.5,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1117,0.0,0.6636,29.23,25.33,0.1662,0.2073,15.0,13.0,[6,7]],[3.8,"low",0.007,0.0081,0.007,0.007,0.1312,0.0054,0.6677,29.76,24.89,0.1675,0.211,15.0,13.5,[6]],[6.4,"low",0.034,0.039,0.034,0.034,0.1507,0.026,0.6717,30.29,24.46,0.1689,0.2147,15.0,14.0,[6]],[8.9,"low",0.0606,0.0691,0.0606,0.0606,0.1702,0.0462,0.6757,30.82,24.04,0.1702,0.2184,15.0,14.5,[6]],[11.3,"low",0.0866,0.0986,0.0866,0.0866,0.1897,0.0661,0.6795,31.35,23.64,0.1715,0.2221,15.0,15.0,[6]],[13.8,"low",0.1123,0.1274,0.1123,0.1123,0.2091,0.0857,0.6832,31.88,23.25,0.1728,0.2258,15.0,15.5,[6]],[16.2,"low",0.1375,0.1556,0.1375,0.1375,0.2286,0.1049,0.6869,32.41,22.88,0.1741,0.2295,15.0,16.0,[6]],[18.5,"low",0.1624,0.1832,0.1624,0.1624,0.2481,0.1239,0.6905,32.95,22.52,0.1753,0.2332,15.0,16.5,[6]],[20.8,"low",0.1868,0.2101,0.1868,0.1868,0.2676,0.1425,0.694,33.48,22.16,0.1766,0.2369,15.0,17.0,[6]],[23.1,"low",0.2109,0.2364,0.2109,0.2109,0.2871,0.1609,0.6974,34.01,21.82,0.1778,0.2406,15.0,17.5,[6]],[25.4,"low",0.2346,0.2622,0.2346,0.2346,0.3065,0.179,0.7008,34.54,21.49,0.1791,0.2443,15.0,18.0,[6]],[27.6,"low",0.2579,0.2875,0.2579,0.2579,0.326,0.1968,0.7041,35.07,21.17,0.1803,0.248,15.0,18.5,[6]],[29.8,"low",0.2809,0.3122,0.2809,0.2809,0.3455,0.2143,0.7073,35.61,20.86,0.1815,0.2517,15.0,19.0,[6]],[32.0,"low",0.3035,0.3364,0.3035,0.3035,0.365,0.2316,0.7104,36.14,20.56,0.1827,0.2554,15.0,19.5,[6]],[34.1,"low",0.3259,0.3601,0.3259,0.3259,0.3845,0.2486,0.7135,36.67,20.27,0.1839,0.2591,15.0,20.0,[6]],[36.2,"medium",0.3479,0.3833,0.3479,0.3479,0.4039,0.2654,0.7165,37.21,19.98,0.1851,0.2628,15.0,20.5,[]],[38.3,"medium",0.3696,0.406,0.3696,0.3696,0.4234,0.282,0.7195,37.74,19.7,0.1863,0.2665,15.0,21.0,[]],[40.4,"medium",0.391,0.4283,0.391,0.391,0.4429,0.2983,0.7224,38.27,19.43,0.1875,0.2702,15.0,21.5,[]],[42.4,"medium",0.4121,0.4501,0.4121,0.4121,0.4624,0.3144,0.7252,38.8,19.17,0.1886,0.2739,15.0,22.0,[]],[44.5,"medium",0.4329,0.4715,0.4329,0.4329,0.4818,0.3303,0.728,39.34,18.91,0.1898,0.2776,15.0,22.5,[]],[46.4,"medium",0.4535,0.4925,0.4535,0.4535,0.5013,0.346,0.7308,39.87,18.67,0.1909,0.2813,15.0,23.0,[]],[48.4,"medium",0.4738,0.5131,0.4738,0.4738,0.5208,0.3615,0.7334,40.4,18.42,0.1921,0.285,15.0,23.5,[]],[50.4,"medium",0.4938,0.5333,0.4938,0.4938,0.5403,0.3768,0.7361,40.94,18.19,0.1932,0.2887,15.0,24.0,[]],[52.3,"medium",0.5136,0.5531,0.5136,0.5136,0.5598,0.3919,0.7386,41.47,17.96,0.1943,0.2924,15.0,24.5,[]],[54.2,"medium",0.5331,0.5725,0.5331,0.5331,0.5792,0.4068,0.7412,42.01,17.73,0.1954,0.2961,15.0,25.0,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,14.0,44.33,0.1289,0.1184,14.66,0.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,14.47,42.9,0.1309,0.1224,14.66,0.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,14.95,41.56,0.1328,0.1263,14.66,1.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,15.42,40.3,0.1346,0.1303,14.66,1.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,15.9,39.11,0.1365,0.1342,14.66,2.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,16.37,38.0,0.1383,0.1382,14.66,2.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,16.85,36.94,0.14,0.1421,14.66,3.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,17.32,35.94,0.1418,0.1461,14.66,3.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,17.8,35.0,0.1435,0.15,14.66,4.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,18.28,34.1,0.1452,0.154,14.66,4.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,18.75,33.25,0.1469,0.1579,14.66,5.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,19.23,32.44,0.1486,0.1619,14.66,5.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,19.71,31.66,0.1502,0.1658,14.66,6.34,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,20.18,30.93,0.1518,0.1698,14.66,6.84,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,20.66,30.22,0.1534,0.1737,14.66,7.34,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,21.14,29.55,0.155,0.1776,14.66,7.84,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,21.62,28.91,0.1565,0.1816,14.66,8.34,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,22.1,28.3,0.1581,0.1855,14.66,8.84,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,22.57,27.71,0.1596,0.1895,14.66,9.34,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.014,0.0,0.6473,23.05,27.14,0.1611,0.1934,14.66,9.84,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0348,0.0,0.6521,23.53,26.6,0.1626,0.1974,14.66,10.34,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.0555,0.0,0.6568,24.01,26.08,0.164,0.2013,14.66,10.84,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0763,0.0,0.6614,24.49,25.57,0.1655,0.2053,14.66,11.34,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0971,0.0,0.6658,24.97,25.09,0.1669,0.2092,14.66,11.84,[6,7]],[4.7,"low",0.0233,0.0267,0.0233,0.0233,0.1179,0.0178,0.6701,25.45,24.63,0.1683,0.2132,14.66,12.34,[6]],[7.4,"low",0.0518,0.0592,0.0518,0.0518,0.1387,0.0395,0.6744,25.93,24.18,0.1698,0.2171,14.66,12.84,[6]],[10.1,"low",0.0797,0.0908,0.0797,0.0797,0.1594,0.0608,0.6785,26.41,23.75,0.1712,0.2211,14.66,13.34,[6]],[12.7,"low",0.1072,0.1217,0.1072,0.1072,0.1802,0.0818,0.6825,26.88,23.33,0.1725,0.225,14.66,13.84,[6]],[15.2,"low",0.1342,0.1519,0.1342,0.1342,0.201,0.1024,0.6864,27.36,22.93,0.1739,0.229,14.66,14.34,[6]],[17.7,"low",0.1607,0.1813,0.1607,0.1607,0.2218,0.1226,0.6903,27.84,22.54,0.1753,0.2329,14.66,14.84,[6]],[20.2,"low",0.1868,0.2101,0.1868,0.1868,0.2425,0.1425,0.694,28.32,22.16,0.1766,0.2369,14.66,15.34,[6]],[22.7,"low",0.2125,0.2382,0.2125,0.2125,0.2633,0.1621,0.6977,28.8,21.8,0.1779,0.2408,14.66,15.84,[6]],[25.1,"low",0.2377,0.2656,0.2377,0.2377,0.2841,0.1814,0.7012,29.28,21.45,0.1792,0.2448,14.66,16.34,[6]],[27.4,"low",0.2625,0.2925,0.2625,0.2625,0.3049,0.2003,0.7047,29.77,21.11,0.1806,0.2487,14.66,16.84,[6]],[29.8,"low",0.287,0.3187,0.287,0.287,0.3257,0.219,0.7081,30.25,20.78,0.1818,0.2527,14.66,17.34,[6]],[32.1,"low",0.311,0.3443,0.311,0.311,0.3464,0.2373,0.7115,30.73,20.46,0.1831,0.2566,14.66,17.84,[6]],[34.4,"low",0.3347,0.3694,0.3347,0.3347,0.3672,0.2554,0.7147,31.21,20.15,0.1844,0.2605,14.66,18.34,[6]],[36.6,"medium",0.3581,0.3939,0.3581,0.3581,0.388,0.2732,0.7179,31.69,19.85,0.1857,0.2645,14.66,18.84,[]],[38.8,"medium",0.381,0.4179,0.381,0.381,0.4088,0.2907,0.7211,32.17,19.56,0.1869,0.2684,14.66,19.34,[]],[41.0,"medium",0.4037,0.4414,0.4037,0.4037,0.4295,0.308,0.7241,32.65,19.27,0.1882,0.2724,14.66,19.84,[]],[43.2,"medium",0.426,0.4644,0.426,0.426,0.4503,0.3251,0.7271,33.13,19.0,0.1894,0.2763,14.66,20.34,[]],[45.3,"medium",0.448,0.487,0.448,0.448,0.4711,0.3419,0.73,33.61,18.73,0.1906,0.2803,14.66,20.84,[]],[47.4,"medium",0.4698,0.509,0.4698,0.4698,0.4919,0.3584,0.7329,34.09,18.47,0.1918,0.2842,14.66,21.34,[]],[49.5,"medium",0.4912,0.5306,0.4912,0.4912,0.5126,0.3748,0.7357,34.58,18.22,0.193,0.2882,14.66,21.84,[]],[51.5,"medium",0.5123,0.5518,0.5123,0.5123,0.5334,0.3909,0.7385,35.06,17.97,0.1942,0.2921,14.66,22.34,[]],[53.6,"medium",0.5331,0.5725,0.5331,0.5331,0.5542,0.4068,0.7412,35.54,17.73,0.1954,0.2961,14.66,22.84,[]],[55.6,"medium",0.5537,0.5929,0.5537,0.5537,0.575,0.4224,0.7438,36.02,17.5,0.1966,0.3,14.66,23.34,[]],[57.6,"medium",0.574,0.6128,0.574,0.574,0.5958,0.4379,0.7464,36.5,17.27,0.1978,0.304,14.66,23.84,[]],[59.5,"medium",0.594,0.6324,0.594,0.594,0.6165,0.4532,0.749,36.99,17.05,0.1989,0.3079,14.66,24.34,[]],[61.5,"medium",0.6137,0.6515,0.6137,0.6137,0.6373,0.4683,0.7515,37.47,16.83,0.2001,0.3119,14.66,24.84,[]],[63.4,"medium",0.6333,0.6703,0.6333,0.6333,0.6581,0.4832,0.7539,37.95,16.62,0.2012,0.3158,14.66,25.34,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,12.72,41.72,0.1325,0.1258,14.36,0.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,13.15,40.38,0.1345,0.13,14.36,1.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,13.59,39.11,0.1365,0.1342,14.36,1.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,14.02,37.93,0.1384,0.1384,14.36,2.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,14.45,36.81,0.1403,0.1426,14.36,2.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,14.88,35.76,0.1421,0.1468,14.36,3.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,15.32,34.77,0.144,0.151,14.36,3.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,15.75,33.83,0.1458,0.1552,14.36,4.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,16.18,32.94,0.1475,0.1594,14.36,4.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,16.61,32.09,0.1493,0.1636,14.36,5.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,17.05,31.29,0.151,0.1678,14.36,5.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,17.48,30.53,0.1527,0.172,14.36,6.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,17.91,29.8,0.1544,0.1762,14.36,6.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,18.35,29.11,0.156,0.1804,14.36,7.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,18.78,28.45,0.1577,0.1846,14.36,7.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,19.22,27.81,0.1593,0.1887,14.36,8.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,19.65,27.21,0.1609,0.1929,14.36,8.64,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.009,0.0,0.6518,20.09,26.63,0.1625,0.1971,14.36,9.14,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0311,0.0,0.6568,20.52,26.08,0.164,0.2013,14.36,9.64,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0531,0.0,0.6616,20.96,25.54,0.1656,0.2055,14.36,10.14,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0752,0.0,0.6664,21.39,25.03,0.1671,0.2097,14.36,10.64,[6,7]],[4.6,"low",0.0287,0.0329,0.0287,0.0287,0.0973,0.0219,0.6709,21.83,24.54,0.1686,0.2139,14.36,11.14,[6]],[7.5,"low",0.0588,0.0672,0.0588,0.0588,0.1194,0.0449,0.6754,22.26,24.07,0.1701,0.2181,14.36,11.64,[6]],[10.3,"low",0.0884,0.1006,0.0884,0.0884,0.1414,0.0674,0.6798,22.7,23.62,0.1716,0.2223,14.36,12.14,[6]],[13.0,"low",0.1174,0.1331,0.1174,0.1174,0.1635,0.0896,0.684,23.13,23.18,0.173,0.2265,14.36,12.64,[6]],[15.7,"low",0.1459,0.1649,0.1459,0.1459,0.1856,0.1113,0.6881,23.57,22.76,0.1745,0.2307,14.36,13.14,[6]],[18.4,"low",0.1738,0.1958,0.1738,0.1738,0.2077,0.1326,0.6921,24.0,22.35,0.1759,0.2349,14.36,13.64,[6]],[21.0,"low",0.2013,0.226,0.2013,0.2013,0.2297,0.1536,0.6961,24.44,21.96,0.1773,0.2391,14.36,14.14,[6]],[23.6,"low",0.2283,0.2554,0.2283,0.2283,0.2518,0.1742,0.6999,24.88,21.58,0.1788,0.2433,14.36,14.64,[6]],[26.1,"low",0.2548,0.2841,0.2548,0.2548,0.2739,0.1944,0.7036,25.31,21.21,0.1801,0.2475,14.36,15.14,[6]],[28.6,"low",0.2809,0.3122,0.2809,0.2809,0.296,0.2143,0.7073,25.75,20.86,0.1815,0.2517,14.36,15.64,[6]],[31.0,"low",0.3065,0.3396,0.3065,0.3065,0.318,0.2339,0.7109,26.18,20.52,0.1829,0.2559,14.36,16.14,[6]],[33.5,"low",0.3318,0.3663,0.3318,0.3318,0.3401,0.2531,0.7143,26.62,20.19,0.1842,0.2601,14.36,16.64,[6]],[35.9,"medium",0.3566,0.3924,0.3566,0.3566,0.3622,0.2721,0.7177,27.06,19.87,0.1856,0.2642,14.36,17.14,[]],[38.2,"medium",0.381,0.4179,0.381,0.381,0.3843,0.2907,0.7211,27.49,19.56,0.1869,0.2684,14.36,17.64,[]],[40.5,"medium",0.4051,0.4429,0.4051,0.4051,0.4063,0.3091,0.7243,27.93,19.26,0.1882,0.2726,14.36,18.14,[]],[42.8,"medium",0.4288,0.4673,0.4288,0.4288,0.4284,0.3272,0.7275,28.37,18.96,0.1896,0.2768,14.36,18.64,[]],[45.1,"medium",0.4521,0.4911,0.4521,0.4521,0.4505,0.345,0.7306,28.81,18.68,0.1909,0.281,14.36,19.14,[]],[47.3,"medium",0.4751,0.5145,0.4751,0.4751,0.4726,0.3625,0.7336,29.24,18.41,0.1921,0.2852,14.36,19.64,[]],[49.5,"medium",0.4978,0.5373,0.4978,0.4978,0.4947,0.3798,0.7366,29.68,18.14,0.1934,0.2894,14.36,20.14,[]],[51.7,"medium",0.5201,0.5596,0.5201,0.5201,0.5167,0.3969,0.7395,30.12,17.88,0.1947,0.2936,14.36,20.64,[]],[53.8,"medium",0.5421,0.5815,0.5421,0.5421,0.5388,0.4136,0.7423,30.56,17.63,0.1959,0.2978,14.36,21.14,[]],[55.9,"medium",0.5638,0.6029,0.5638,0.5638,0.5609,0.4302,0.7451,30.99,17.38,0.1972,0.302,14.36,21.64,[]],[58.0,"medium",0.5852,0.6238,0.5852,0.5852,0.583,0.4465,0.7479,31.43,17.15,0.1984,0.3062,14.36,22.14,[]],[60.1,"medium",0.6064,0.6444,0.6064,0.6064,0.605,0.4627,0.7505,31.87,16.91,0.1997,0.3104,14.36,22.64,[]],[62.2,"medium",0.6272,0.6645,0.6272,0.6272,0.6271,0.4785,0.7531,32.31,16.69,0.2009,0.3146,14.36,23.14,[]],[64.2,"medium",0.6477,0.6842,0.6477,0.6477,0.6492,0.4942,0.7557,32.75,16.47,0.2021,0.3188,14.36,23.64,[]],[66.2,"critical",0.668,0.7035,0.668,0.668,0.6713,0.5097,0.7582,33.18,16.26,0.2033,0.323,14.36,24.14,[]],[68.2,"critical",0.6881,0.7224,0.6881,0.6881,0.6933,0.525,0.7607,33.62,16.05,0.2045,0.3272,14.36,24.64,[]],[70.1,"critical",0.7078,0.741,0.7078,0.7078,0.7154,0.5401,0.7631,34.06,15.84,0.2057,0.3314,14.36,25.14,[]],[72.1,"critical",0.7274,0.7592,0.7274,0.7274,0.7375,0.555,0.7655,34.5,15.65,0.2069,0.3356,14.36,25.64,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,11.63,39.4,0.136,0.1332,14.07,0.93,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,12.02,38.13,0.138,0.1377,14.07,1.43,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,12.42,36.94,0.14,0.1421,14.07,1.93,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,12.81,35.82,0.142,0.1466,14.07,2.43,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,13.21,34.77,0.144,0.151,14.07,2.93,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,13.6,33.78,0.1459,0.1554,14.07,3.43,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,14.0,32.84,0.1477,0.1599,14.07,3.93,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,14.39,31.95,0.1496,0.1643,14.07,4.43,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,14.79,31.11,0.1514,0.1688,14.07,4.93,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,15.19,30.31,0.1532,0.1732,14.07,5.43,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,15.58,29.55,0.155,0.1776,14.07,5.93,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,15.98,28.83,0.1567,0.1821,14.07,6.43,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,16.37,28.15,0.1584,0.1865,14.07,6.93,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,16.77,27.49,0.1601,0.191,14.07,7.43,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,17.17,26.87,0.1618,0.1954,14.07,7.93,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,17.56,26.27,0.1635,0.1999,14.07,8.43,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0226,0.0,0.6602,17.96,25.7,0.1651,0.2043,14.07,8.93,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.046,0.0,0.6653,18.36,25.15,0.1667,0.2087,14.07,9.43,[6,7]],[3.5,"low",0.0233,0.0267,0.0233,0.0233,0.0694,0.0178,0.6701,18.76,24.63,0.1683,0.2132,14.07,9.93,[6]],[6.5,"low",0.0553,0.0632,0.0553,0.0553,0.0928,0.0422,0.6749,19.15,24.12,0.1699,0.2176,14.07,10.43,[6]],[9.5,"low",0.0866,0.0986,0.0866,0.0866,0.1161,0.0661,0.6795,19.55,23.64,0.1715,0.2221,14.07,10.93,[6]],[12.4,"low",0.1174,0.1331,0.1174,0.1174,0.1395,0.0896,0.684,19.95,23.18,0.173,0.2265,14.07,11.43,[6]],[15.3,"low",0.1475,0.1667,0.1475,0.1475,0.1629,0.1126,0.6884,20.35,22.73,0.1746,0.2309,14.07,11.93,[6]],[18.1,"low",0.1771,0.1994,0.1771,0.1771,0.1863,0.1351,0.6926,20.74,22.3,0.1761,0.2354,14.07,12.43,[6]],[20.8,"low",0.2061,0.2312,0.2061,0.2061,0.2096,0.1572,0.6968,21.14,21.89,0.1776,0.2398,14.07,12.93,[6]],[23.6,"low",0.2346,0.2622,0.2346,0.2346,0.233,0.179,0.7008,21.54,21.49,0.1791,0.2443,14.07,13.43,[6]],[26.2,"low",0.2625,0.2925,0.2625,0.2625,0.2564,0.2003,0.7047,21.94,21.11,0.1806,0.2487,14.07,13.93,[6]],[28.9,"low",0.29,0.3219,0.29,0.29,0.2798,0.2213,0.7086,22.34,20.74,0.182,0.2531,14.07,14.43,[6]],[31.4,"low",0.317,0.3506,0.317,0.317,0.3031,0.2419,0.7123,22.74,20.38,0.1835,0.2576,14.07,14.93,[6]],[34.0,"low",0.3435,0.3787,0.3435,0.3435,0.3265,0.2621,0.7159,23.14,20.04,0.1849,0.262,14.07,15.43,[6]],[36.5,"medium",0.3696,0.406,0.3696,0.3696,0.3499,0.282,0.7195,23.53,19.7,0.1863,0.2665,14.07,15.93,[]],[39.0,"medium",0.3952,0.4327,0.3952,0.3952,0.3733,0.3016,0.723,23.93,19.38,0.1877,0.2709,14.07,16.43,[]],[41.4,"medium",0.4205,0.4587,0.4205,0.4205,0.3966,0.3208,0.7264,24.33,19.07,0.1891,0.2754,14.07,16.93,[]],[43.8,"medium",0.4453,0.4842,0.4453,0.4453,0.42,0.3398,0.7297,24.73,18.76,0.1905,0.2798,14.07,17.43,[]],[46.2,"medium",0.4698,0.509,0.4698,0.4698,0.4434,0.3584,0.7329,25.13,18.47,0.1918,0.2842,14.07,17.93,[]],[48.5,"medium",0.4938,0.5333,0.4938,0.4938,0.4668,0.3768,0.7361,25.53,18.19,0.1932,0.2887,14.07,18.43,[]],[50.8,"medium",0.5175,0.557,0.5175,0.5175,0.4901,0.3949,0.7392,25.93,17.91,0.1945,0.2931,14.07,18.93,[]],[53.1,"medium",0.5408,0.5802,0.5408,0.5408,0.5135,0.4127,0.7422,26.33,17.64,0.1959,0.2976,14.07,19.43,[]],[55.3,"medium",0.5638,0.6029,0.5638,0.5638,0.5369,0.4302,0.7451,26.73,17.38,0.1972,0.302,14.07,19.93,[]],[57.6,"medium",0.5865,0.6251,0.5865,0.5865,0.5603,0.4475,0.748,27.13,17.13,0.1985,0.3064,14.07,20.43,[]],[59.8,"medium",0.6088,0.6468,0.6088,0.6088,0.5836,0.4645,0.7508,27.53,16.89,0.1998,0.3109,14.07,20.93,[]],[61.9,"medium",0.6308,0.668,0.6308,0.6308,0.607,0.4813,0.7536,27.93,16.65,0.2011,0.3153,14.07,21.43,[]],[64.1,"medium",0.6525,0.6888,0.6525,0.6525,0.6304,0.4979,0.7563,28.33,16.42,0.2024,0.3198,14.07,21.93,[]],[66.2,"critical",0.674,0.7091,0.674,0.674,0.6538,0.5142,0.7589,28.73,16.19,0.2036,0.3242,14.07,22.43,[]],[68.3,"critical",0.6951,0.729,0.6951,0.6951,0.6771,0.5303,0.7615,29.13,15.97,0.2049,0.3286,14.07,22.93,[]],[70.3,"critical",0.7159,0.7485,0.7159,0.7159,0.7005,0.5462,0.7641,29.53,15.76,0.2062,0.3331,14.07,23.43,[]],[72.4,"critical",0.7365,0.7676,0.7365,0.7365,0.7239,0.5619,0.7666,29.93,15.55,0.2074,0.3375,14.07,23.93,[]],[74.4,"critical",0.7567,0.7863,0.7567,0.7567,0.7473,0.5774,0.769,30.33,15.35,0.2086,0.342,14.07,24.43,[]],[76.4,"critical",0.7768,0.8047,0.7768,0.7768,0.7706,0.5927,0.7714,30.73,15.16,0.2099,0.3464,14.07,24.93,[]],[78.4,"critical",0.7965,0.8226,0.7965,0.7965,0.794,0.6078,0.7737,31.13,14.96,0.2111,0.3509,14.07,25.43,[]],[80.3,"critical",0.8161,0.8403,0.8161,0.8161,0.8174,0.6227,0.776,31.53,14.78,0.2123,0.3553,14.07,25.93,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,10.68,37.33,0.1394,0.1406,13.81,1.19,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,11.04,36.13,0.1415,0.1453,13.81,1.69,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,11.41,35.0,0.1435,0.15,13.81,2.19,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,11.77,33.94,0.1455,0.1547,13.81,2.69,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,12.13,32.94,0.1475,0.1594,13.81,3.19,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,12.49,32.0,0.1495,0.1641,13.81,3.69,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,12.86,31.11,0.1514,0.1688,13.81,4.19,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,13.22,30.27,0.1533,0.1735,13.81,4.69,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,13.58,29.47,0.1552,0.1781,13.81,5.19,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,13.95,28.72,0.157,0.1828,13.81,5.69,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,14.31,28.0,0.1588,0.1875,13.81,6.19,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,14.68,27.31,0.1606,0.1922,13.81,6.69,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,15.04,26.66,0.1624,0.1969,13.81,7.19,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,15.4,26.04,0.1641,0.2016,13.81,7.69,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0095,0.0,0.6625,15.77,25.45,0.1658,0.2063,13.81,8.19,[6,7]],[1.4,"low",0.007,0.0081,0.007,0.007,0.0342,0.0054,0.6677,16.13,24.89,0.1675,0.211,13.81,8.69,[6]],[4.6,"low",0.0412,0.0471,0.0412,0.0412,0.0589,0.0314,0.6728,16.5,24.35,0.1692,0.2156,13.81,9.19,[6]],[7.8,"low",0.0745,0.085,0.0745,0.0745,0.0835,0.0569,0.6777,16.86,23.83,0.1709,0.2203,13.81,9.69,[6]],[10.9,"low",0.1072,0.1217,0.1072,0.1072,0.1082,0.0818,0.6825,17.23,23.33,0.1725,0.225,13.81,10.19,[6]],[13.9,"low",0.1392,0.1575,0.1392,0.1392,0.1329,0.1062,0.6872,17.59,22.86,0.1742,0.2297,13.81,10.69,[6]],[16.9,"low",0.1706,0.1922,0.1706,0.1706,0.1575,0.1301,0.6917,17.96,22.4,0.1758,0.2344,13.81,11.19,[6]],[19.8,"low",0.2013,0.226,0.2013,0.2013,0.1822,0.1536,0.6961,18.32,21.96,0.1773,0.2391,13.81,11.69,[6]],[22.7,"low",0.2314,0.2588,0.2314,0.2314,0.2069,0.1766,0.7003,18.69,21.54,0.1789,0.2438,13.81,12.19,[6]],[25.5,"low",0.261,0.2908,0.261,0.261,0.2316,0.1991,0.7045,19.05,21.13,0.1805,0.2485,13.81,12.69,[6]],[28.3,"low",0.29,0.3219,0.29,0.29,0.2562,0.2213,0.7086,19.42,20.74,0.182,0.2531,13.81,13.19,[6]],[31.0,"low",0.3185,0.3522,0.3185,0.3185,0.2809,0.243,0.7125,19.78,20.36,0.1835,0.2578,13.81,13.69,[6]],[33.7,"low",0.3464,0.3817,0.3464,0.3464,0.3056,0.2643,0.7163,20.15,20.0,0.185,0.2625,13.81,14.19,[6]],[36.3,"medium",0.3739,0.4105,0.3739,0.3739,0.3303,0.2853,0.7201,20.52,19.65,0.1865,0.2672,13.81,14.69,[]],[38.9,"medium",0.4009,0.4385,0.4009,0.4009,0.3549,0.3059,0.7237,20.88,19.31,0.188,0.2719,13.81,15.19,[]],[41.5,"medium",0.4274,0.4659,0.4274,0.4274,0.3796,0.3261,0.7273,21.25,18.98,0.1895,0.2766,13.81,15.69,[]],[44.0,"medium",0.4535,0.4925,0.4535,0.4535,0.4043,0.346,0.7308,21.62,18.67,0.1909,0.2813,13.81,16.19,[]],[46.5,"medium",0.4792,0.5185,0.4792,0.4792,0.4289,0.3656,0.7341,21.98,18.36,0.1924,0.286,13.81,16.69,[]],[49.0,"medium",0.5044,0.5439,0.5044,0.5044,0.4536,0.3849,0.7375,22.35,18.06,0.1938,0.2906,13.81,17.19,[]],[51.4,"medium",0.5292,0.5687,0.5292,0.5292,0.4783,0.4038,0.7407,22.72,17.78,0.1952,0.2953,13.81,17.69,[]],[53.8,"medium",0.5537,0.5929,0.5537,0.5537,0.503,0.4224,0.7438,23.08,17.5,0.1966,0.3,13.81,18.19,[]],[56.1,"medium",0.5777,0.6165,0.5777,0.5777,0.5276,0.4408,0.7469,23.45,17.23,0.198,0.3047,13.81,18.69,[]],[58.4,"medium",0.6014,0.6396,0.6014,0.6014,0.5523,0.4589,0.7499,23.82,16.97,0.1994,0.3094,13.81,19.19,[]],[60.7,"medium",0.6248,0.6621,0.6248,0.6248,0.577,0.4767,0.7528,24.18,16.72,0.2007,0.3141,13.81,19.69,[]],[63.0,"medium",0.6477,0.6842,0.6477,0.6477,0.6017,0.4942,0.7557,24.55,16.47,0.2021,0.3188,13.81,20.19,[]],[65.2,"critical",0.6704,0.7057,0.6704,0.6704,0.6263,0.5115,0.7585,24.92,16.23,0.2034,0.3235,13.81,20.69,[]],[67.4,"critical",0.6927,0.7268,0.6927,0.6927,0.651,0.5286,0.7613,25.28,16.0,0.2048,0.3282,13.81,21.19,[]],[69.6,"critical",0.7147,0.7474,0.7147,0.7147,0.6757,0.5454,0.7639,25.65,15.77,0.2061,0.3328,13.81,21.69,[]],[71.8,"critical",0.7365,0.7676,0.7365,0.7365,0.7004,0.5619,0.7666,26.02,15.55,0.2074,0.3375,13.81,22.19,[]],[73.9,"critical",0.7579,0.7874,0.7579,0.7579,0.725,0.5782,0.7691,26.39,15.34,0.2087,0.3422,13.81,22.69,[]],[76.0,"critical",0.779,0.8067,0.779,0.779,0.7497,0.5944,0.7716,26.75,15.13,0.21,0.3469,13.81,23.19,[]],[78.1,"critical",0.7998,0.8256,0.7998,0.7998,0.7744,0.6103,0.7741,27.12,14.93,0.2113,0.3516,13.81,23.69,[]],[80.2,"critical",0.8204,0.8441,0.8204,0.8204,0.799,0.6259,0.7765,27.49,14.74,0.2126,0.3563,13.81,24.19,[]],[82.2,"critical",0.8407,0.8623,0.8407,0.8407,0.8237,0.6414,0.7789,27.86,14.54,0.2138,0.361,13.81,24.69,[]],[84.2,"critical",0.8607,0.88,0.8607,0.8607,0.8484,0.6567,0.7812,28.23,14.36,0.2151,0.3657,13.81,25.19,[]],[86.2,"critical",0.8804,0.8975,0.8804,0.8804,0.8731,0.6718,0.7835,28.59,14.18,0.2163,0.3703,13.81,25.69,[]],[88.2,"critical",0.9,0.9145,0.9,0.9,0.8977,0.6867,0.7857,28.96,14.0,0.2176,0.375,13.81,26.19,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,9.85,35.46,0.1427,0.148,13.56,1.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,10.19,34.32,0.1448,0.153,13.56,1.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,10.52,33.25,0.1469,0.1579,13.56,2.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,10.86,32.24,0.149,0.1628,13.56,2.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,11.19,31.29,0.151,0.1678,13.56,3.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,11.53,30.4,0.153,0.1727,13.56,3.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,11.86,29.55,0.155,0.1776,13.56,4.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,12.2,28.75,0.1569,0.1826,13.56,4.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,12.53,28.0,0.1588,0.1875,13.56,5.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,12.87,27.28,0.1607,0.1925,13.56,5.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,13.2,26.6,0.1626,0.1974,13.56,6.44,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,13.54,25.95,0.1644,0.2023,13.56,6.94,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,13.87,25.33,0.1662,0.2073,13.56,7.44,[6,7]],[1.7,"low",0.0161,0.0185,0.0161,0.0161,0.0176,0.0123,0.6691,14.21,24.74,0.168,0.2122,13.56,7.94,[6]],[5.0,"low",0.0518,0.0592,0.0518,0.0518,0.0435,0.0395,0.6744,14.55,24.18,0.1698,0.2171,13.56,8.44,[6]],[8.3,"low",0.0866,0.0986,0.0866,0.0866,0.0695,0.0661,0.6795,14.88,23.64,0.1715,0.2221,13.56,8.94,[6]],[11.6,"low",0.1208,0.1369,0.1208,0.1208,0.0955,0.0921,0.6845,15.22,23.13,0.1732,0.227,13.56,9.44,[6]],[14.7,"low",0.1541,0.174,0.1541,0.1541,0.1215,0.1176,0.6893,15.55,22.64,0.1749,0.2319,13.56,9.94,[6]],[17.8,"low",0.1868,0.2101,0.1868,0.1868,0.1474,0.1425,0.694,15.89,22.16,0.1766,0.2369,13.56,10.44,[6]],[20.9,"low",0.2188,0.2451,0.2188,0.2188,0.1734,0.1669,0.6986,16.23,21.71,0.1783,0.2418,13.56,10.94,[6]],[23.9,"low",0.2502,0.2791,0.2502,0.2502,0.1994,0.1909,0.703,16.57,21.28,0.1799,0.2467,13.56,11.44,[6]],[26.8,"low",0.2809,0.3122,0.2809,0.2809,0.2253,0.2143,0.7073,16.9,20.86,0.1815,0.2517,13.56,11.94,[6]],[29.7,"low",0.311,0.3443,0.311,0.311,0.2513,0.2373,0.7115,17.24,20.46,0.1831,0.2566,13.56,12.44,[6]],[32.5,"low",0.3406,0.3756,0.3406,0.3406,0.2773,0.2599,0.7155,17.58,20.07,0.1847,0.2615,13.56,12.94,[6]],[35.3,"medium",0.3696,0.406,0.3696,0.3696,0.3033,0.282,0.7195,17.91,19.7,0.1863,0.2665,13.56,13.44,[]],[38.1,"medium",0.3981,0.4356,0.3981,0.3981,0.3292,0.3037,0.7234,18.25,19.34,0.1879,0.2714,13.56,13.94,[]],[40.8,"medium",0.426,0.4644,0.426,0.426,0.3552,0.3251,0.7271,18.59,19.0,0.1894,0.2763,13.56,14.44,[]],[43.4,"medium",0.4535,0.4925,0.4535,0.4535,0.3812,0.346,0.7308,18.93,18.67,0.1909,0.2813,13.56,14.94,[]],[46.1,"medium",0.4805,0.5199,0.4805,0.4805,0.4071,0.3666,0.7343,19.26,18.34,0.1924,0.2862,13.56,15.44,[]],[48.6,"medium",0.507,0.5465,0.507,0.507,0.4331,0.3869,0.7378,19.6,18.03,0.1939,0.2911,13.56,15.94,[]],[51.2,"medium",0.5331,0.5725,0.5331,0.5331,0.4591,0.4068,0.7412,19.94,17.73,0.1954,0.2961,13.56,16.44,[]],[53.7,"medium",0.5588,0.5979,0.5588,0.5588,0.4851,0.4263,0.7445,20.28,17.44,0.1969,0.301,13.56,16.94,[]],[56.2,"medium",0.584,0.6226,0.584,0.584,0.511,0.4456,0.7477,20.62,17.16,0.1984,0.3059,13.56,17.44,[]],[58.6,"medium",0.6088,0.6468,0.6088,0.6088,0.537,0.4645,0.7508,20.95,16.89,0.1998,0.3109,13.56,17.94,[]],[61.0,"medium",0.6333,0.6703,0.6333,0.6333,0.563,0.4832,0.7539,21.29,16.62,0.2012,0.3158,13.56,18.44,[]],[63.4,"medium",0.6573,0.6933,0.6573,0.6573,0.5889,0.5015,0.7569,21.63,16.37,0.2027,0.3208,13.56,18.94,[]],[65.7,"critical",0.681,0.7158,0.681,0.681,0.6149,0.5196,0.7598,21.97,16.12,0.2041,0.3257,13.56,19.44,[]],[68.0,"critical",0.7044,0.7377,0.7044,0.7044,0.6409,0.5374,0.7627,22.31,15.88,0.2055,0.3306,13.56,19.94,[]],[70.3,"critical",0.7274,0.7592,0.7274,0.7274,0.6669,0.555,0.7655,22.65,15.65,0.2069,0.3356,13.56,20.44,[]],[72.5,"critical",0.75,0.7801,0.75,0.75,0.6928,0.5723,0.7682,22.99,15.42,0.2082,0.3405,13.56,20.94,[]],[74.8,"critical",0.7723,0.8006,0.7723,0.7723,0.7188,0.5893,0.7709,23.32,15.2,0.2096,0.3454,13.56,21.44,[]],[77.0,"critical",0.7944,0.8207,0.7944,0.7944,0.7448,0.6061,0.7735,23.66,14.98,0.2109,0.3504,13.56,21.94,[]],[79.1,"critical",0.8161,0.8403,0.8161,0.8161,0.7708,0.6227,0.776,24.0,14.78,0.2123,0.3553,13.56,22.44,[]],[81.3,"critical",0.8375,0.8594,0.8375,0.8375,0.7967,0.639,0.7785,24.34,14.57,0.2136,0.3602,13.56,22.94,[]],[83.4,"critical",0.8586,0.8782,0.8586,0.8586,0.8227,0.6551,0.781,24.68,14.38,0.2149,0.3652,13.56,23.44,[]],[85.5,"critical",0.8794,0.8966,0.8794,0.8794,0.8487,0.671,0.7833,25.02,14.19,0.2163,0.3701,13.56,23.94,[]],[87.6,"critical",0.9,0.9145,0.9,0.9,0.8746,0.6867,0.7857,25.36,14.0,0.2176,0.375,13.56,24.44,[]],[89.7,"critical",0.9203,0.9321,0.9203,0.9203,0.9006,0.7022,0.788,25.7,13.82,0.2189,0.38,13.56,24.94,[]],[91.7,"critical",0.9403,0.9494,0.9403,0.9403,0.9266,0.7174,0.7902,26.04,13.64,0.2201,0.3849,13.56,25.44,[]],[93.7,"critical",0.9601,0.9663,0.9601,0.9601,0.9526,0.7325,0.7924,26.38,13.47,0.2214,0.3898,13.56,25.94,[]],[95.7,"critical",0.9796,0.9828,0.9796,0.9796,0.9785,0.7474,0.7946,26.72,13.3,0.2227,0.3948,13.56,26.44,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,9.65,35.01,0.1435,0.15,13.5,1.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,9.98,33.88,0.1457,0.155,13.5,2.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,10.31,32.82,0.1478,0.16,13.5,2.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,10.64,31.83,0.1498,0.165,13.5,3.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,10.97,30.89,0.1519,0.17,13.5,3.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,11.29,30.01,0.1539,0.175,13.5,4.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,11.62,29.17,0.1559,0.18,13.5,4.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,11.95,28.39,0.1578,0.185,13.5,5.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,12.28,27.64,0.1598,0.19,13.5,5.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,12.61,26.93,0.1617,0.195,13.5,6.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,12.94,26.26,0.1635,0.2,13.5,6.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,13.27,25.62,0.1654,0.2049,13.5,7.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,13.59,25.01,0.1672,0.2099,13.5,7.5,[6,7]],[3.4,"low",0.0361,0.0414,0.0361,0.0361,0.0262,0.0276,0.672,13.92,24.42,0.169,0.2149,13.5,8.0,[6]],[6.8,"low",0.0718,0.0819,0.0718,0.0718,0.0525,0.0548,0.6773,14.25,23.87,0.1708,0.2199,13.5,8.5,[6]],[10.1,"low",0.1067,0.1212,0.1067,0.1067,0.0788,0.0814,0.6824,14.58,23.34,0.1725,0.2249,13.5,9.0,[6]],[13.3,"low",0.1408,0.1592,0.1408,0.1408,0.1051,0.1074,0.6874,14.91,22.83,0.1742,0.2299,13.5,9.5,[6]],[16.5,"low",0.1742,0.1962,0.1742,0.1742,0.1314,0.1329,0.6922,15.24,22.35,0.1759,0.2349,13.5,10.0,[6]],[19.6,"low",0.2068,0.2321,0.2068,0.2068,0.1577,0.1578,0.6969,15.57,21.88,0.1776,0.2399,13.5,10.5,[6]],[22.6,"low",0.2388,0.2669,0.2388,0.2388,0.184,0.1822,0.7014,15.9,21.43,0.1793,0.2449,13.5,11.0,[6]],[25.6,"low",0.2702,0.3007,0.2702,0.2702,0.2103,0.2062,0.7058,16.23,21.01,0.181,0.2499,13.5,11.5,[6]],[28.6,"low",0.3009,0.3336,0.3009,0.3009,0.2366,0.2296,0.7101,16.56,20.59,0.1826,0.2549,13.5,12.0,[6]],[31.5,"low",0.3311,0.3655,0.3311,0.3311,0.2629,0.2526,0.7142,16.89,20.2,0.1842,0.2599,13.5,12.5,[6]],[34.3,"low",0.3606,0.3966,0.3606,0.3606,0.2892,0.2752,0.7183,17.22,19.82,0.1858,0.2649,13.5,13.0,[6]],[37.1,"medium",0.3896,0.4269,0.3896,0.3896,0.3156,0.2973,0.7222,17.55,19.45,0.1874,0.2699,13.5,13.5,[]],[39.9,"medium",0.4181,0.4563,0.4181,0.4181,0.3419,0.319,0.726,17.88,19.1,0.189,0.2749,13.5,14.0,[]],[42.6,"medium",0.4461,0.485,0.4461,0.4461,0.3682,0.3404,0.7298,18.21,18.75,0.1905,0.2799,13.5,14.5,[]],[45.2,"medium",0.4735,0.5129,0.4735,0.4735,0.3945,0.3613,0.7334,18.55,18.43,0.192,0.2849,13.5,15.0,[]],[47.9,"medium",0.5005,0.54,0.5005,0.5005,0.4208,0.3819,0.7369,18.88,18.11,0.1936,0.2899,13.5,15.5,[]],[50.4,"medium",0.5271,0.5665,0.5271,0.5271,0.4471,0.4022,0.7404,19.21,17.8,0.1951,0.2949,13.5,16.0,[]],[53.0,"medium",0.5532,0.5924,0.5532,0.5532,0.4734,0.4221,0.7438,19.54,17.5,0.1966,0.2999,13.5,16.5,[]],[55.5,"medium",0.5788,0.6176,0.5788,0.5788,0.4997,0.4416,0.747,19.87,17.22,0.1981,0.3049,13.5,17.0,[]],[58.0,"medium",0.604,0.6421,0.604,0.604,0.526,0.4609,0.7502,20.2,16.94,0.1995,0.3099,13.5,17.5,[]],[60.4,"medium",0.6289,0.6661,0.6289,0.6289,0.5523,0.4798,0.7534,20.53,16.67,0.201,0.3149,13.5,18.0,[]],[62.8,"medium",0.6533,0.6895,0.6533,0.6533,0.5786,0.4985,0.7564,20.86,16.41,0.2024,0.3199,13.5,18.5,[]],[65.2,"critical",0.6774,0.7123,0.6774,0.6774,0.605,0.5168,0.7594,21.2,16.16,0.2038,0.3249,13.5,19.0,[]],[67.5,"critical",0.7011,0.7346,0.7011,0.7011,0.6313,0.5349,0.7623,21.53,15.91,0.2053,0.3299,13.5,19.5,[]],[69.9,"critical",0.7244,0.7564,0.7244,0.7244,0.6576,0.5527,0.7651,21.86,15.68,0.2067,0.3349,13.5,20.0,[]],[72.1,"critical",0.7474,0.7777,0.7474,0.7474,0.6839,0.5703,0.7679,22.19,15.44,0.2081,0.3399,13.5,20.5,[]],[74.4,"critical",0.7701,0.7985,0.7701,0.7701,0.7102,0.5876,0.7706,22.52,15.22,0.2095,0.3449,13.5,21.0,[]],[76.6,"critical",0.7924,0.8189,0.7924,0.7924,0.7365,0.6046,0.7732,22.86,15.0,0.2108,0.3499,13.5,21.5,[]],[78.8,"critical",0.8144,0.8388,0.8144,0.8144,0.7628,0.6214,0.7758,23.19,14.79,0.2122,0.3549,13.5,22.0,[]],[81.0,"critical",0.8361,0.8582,0.8361,0.8361,0.7891,0.6379,0.7784,23.52,14.59,0.2135,0.3599,13.5,22.5,[]],[83.2,"critical",0.8575,0.8772,0.8575,0.8575,0.8154,0.6543,0.7808,23.85,14.39,0.2149,0.3649,13.5,23.0,[]],[85.3,"critical",0.8786,0.8959,0.8786,0.8786,0.8417,0.6704,0.7833,24.18,14.19,0.2162,0.3699,13.5,23.5,[]],[87.4,"critical",0.8995,0.9141,0.8995,0.8995,0.868,0.6863,0.7856,24.52,14.0,0.2175,0.3749,13.5,24.0,[]],[89.5,"critical",0.92,0.9319,0.92,0.92,0.8944,0.702,0.788,24.85,13.82,0.2188,0.3799,13.5,24.5,[]],[91.5,"critical",0.9403,0.9494,0.9403,0.9403,0.9207,0.7174,0.7902,25.18,13.64,0.2201,0.3849,13.5,25.0,[]],[93.6,"critical",0.9603,0.9665,0.9603,0.9603,0.947,0.7327,0.7925,25.51,13.46,0.2214,0.3899,13.5,25.5,[]],[95.6,"critical",0.9801,0.9833,0.9801,0.9801,0.9733,0.7478,0.7946,25.85,13.29,0.2227,0.3949,13.5,26.0,[]],[97.6,"critical",0.9996,0.9997,0.9996,0.9996,0.9996,0.7627,0.7968,26.18,13.13,0.224,0.3999,13.5,26.5,[]]]],"PTFE":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,8.79,70.93,0.1041,0.074,116.78,-101.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,9.09,68.64,0.1057,0.0765,116.78,-101.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,9.39,66.49,0.1072,0.079,116.78,-100.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,9.69,64.48,0.1088,0.0814,116.78,-100.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,9.99,62.58,0.1102,0.0839,116.78,-99.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,10.29,60.8,0.1117,0.0864,116.78,-99.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,10.59,59.11,0.1131,0.0888,116.78,-98.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,10.89,57.51,0.1145,0.0913,116.78,-98.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,11.18,56.0,0.1159,0.0938,116.78,-97.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,11.48,54.56,0.1173,0.0962,116.78,-97.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,11.78,53.2,0.1187,0.0987,116.78,-96.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,12.08,51.9,0.12,0.1012,116.78,-96.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,12.38,50.66,0.1213,0.1036,116.78,-95.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,12.68,49.48,0.1226,0.1061,116.78,-95.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,12.98,48.36,0.1239,0.1086,116.78,-94.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,13.28,47.29,0.1252,0.111,116.78,-94.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,13.58,46.26,0.1265,0.1135,116.78,-93.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,13.88,45.27,0.1277,0.116,116.78,-93.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,14.18,44.33,0.1289,0.1184,116.78,-92.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,14.48,43.43,0.1301,0.1209,116.78,-92.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,14.79,42.56,0.1313,0.1234,116.78,-91.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,15.09,41.72,0.1325,0.1258,116.78,-91.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,15.39,40.92,0.1337,0.1283,116.78,-90.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,15.69,40.15,0.1349,0.1308,116.78,-90.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,15.99,39.4,0.136,0.1332,116.78,-89.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,16.29,38.69,0.1371,0.1357,116.78,-89.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,16.59,38.0,0.1383,0.1382,116.78,-88.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,16.89,37.33,0.1394,0.1406,116.78,-88.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,17.19,36.69,0.1405,0.1431,116.78,-87.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,17.5,36.06,0.1416,0.1456,116.78,-87.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,17.8,35.46,0.1427,0.148,116.78,-86.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,18.1,34.88,0.1437,0.1505,116.78,-86.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,18.4,34.32,0.1448,0.153,116.78,-85.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,18.7,33.77,0.1459,0.1554,116.78,-85.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,19.01,33.25,0.1469,0.1579,116.78,-84.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,19.31,32.74,0.1479,0.1604,116.78,-84.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,19.61,32.24,0.149,0.1628,116.78,-83.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.609,19.91,31.76,0.15,0.1653,116.78,-83.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,20.21,31.29,0.151,0.1678,116.78,-82.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,20.52,30.84,0.152,0.1702,116.78,-82.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,20.82,30.4,0.153,0.1727,116.78,-81.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6233,21.12,29.97,0.154,0.1752,116.78,-81.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,21.42,29.55,0.155,0.1776,116.78,-80.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6301,21.73,29.15,0.1559,0.1801,116.78,-80.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,22.03,28.75,0.1569,0.1826,116.78,-79.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,22.33,28.37,0.1579,0.185,116.78,-79.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,22.63,28.0,0.1588,0.1875,116.78,-78.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,22.94,27.63,0.1598,0.19,116.78,-78.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,23.24,27.28,0.1607,0.1925,116.78,-77.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6491,23.54,26.93,0.1616,0.1949,116.78,-77.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,23.85,26.6,0.1626,0.1974,116.78,-76.78,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,7.57,64.48,0.1088,0.0814,112.95,-97.95,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,7.83,62.4,0.1104,0.0841,112.95,-97.45,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,8.08,60.45,0.112,0.0868,112.95,-96.95,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,8.34,58.62,0.1136,0.0896,112.95,-96.45,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,8.6,56.89,0.1151,0.0923,112.95,-95.95,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,8.86,55.27,0.1166,0.095,112.95,-95.45,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,9.11,53.73,0.1181,0.0977,112.95,-94.95,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,9.37,52.28,0.1196,0.1004,112.95,-94.45,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,9.63,50.9,0.1211,0.1031,112.95,-93.95,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,9.89,49.6,0.1225,0.1058,112.95,-93.45,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,10.14,48.36,0.1239,0.1086,112.95,-92.95,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,10.4,47.18,0.1253,0.1113,112.95,-92.45,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,10.66,46.06,0.1267,0.114,112.95,-91.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,10.92,44.99,0.1281,0.1167,112.95,-91.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,11.18,43.96,0.1294,0.1194,112.95,-90.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,11.43,42.99,0.1307,0.1221,112.95,-90.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,11.69,42.05,0.132,0.1248,112.95,-89.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,11.95,41.16,0.1333,0.1276,112.95,-89.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,12.21,40.3,0.1346,0.1303,112.95,-88.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,12.47,39.48,0.1359,0.133,112.95,-88.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,12.73,38.69,0.1371,0.1357,112.95,-87.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,12.99,37.93,0.1384,0.1384,112.95,-87.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,13.24,37.2,0.1396,0.1411,112.95,-86.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,13.5,36.5,0.1408,0.1438,112.95,-86.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,13.76,35.82,0.142,0.1466,112.95,-85.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,14.02,35.17,0.1432,0.1493,112.95,-85.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,14.28,34.54,0.1444,0.152,112.95,-84.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,14.54,33.94,0.1455,0.1547,112.95,-84.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,14.8,33.35,0.1467,0.1574,112.95,-83.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,15.06,32.79,0.1478,0.1601,112.95,-83.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,15.32,32.24,0.149,0.1628,112.95,-82.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,15.58,31.71,0.1501,0.1656,112.95,-82.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6134,15.84,31.2,0.1512,0.1683,112.95,-81.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6174,16.1,30.7,0.1523,0.171,112.95,-81.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,16.36,30.22,0.1534,0.1737,112.95,-80.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,16.62,29.76,0.1545,0.1764,112.95,-80.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6288,16.88,29.31,0.1556,0.1791,112.95,-79.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6324,17.14,28.87,0.1566,0.1818,112.95,-79.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,17.4,28.45,0.1577,0.1846,112.95,-78.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6395,17.66,28.03,0.1587,0.1873,112.95,-78.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,17.92,27.63,0.1598,0.19,112.95,-77.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6464,18.18,27.24,0.1608,0.1927,112.95,-77.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,18.44,26.87,0.1618,0.1954,112.95,-76.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.653,18.7,26.5,0.1628,0.1981,112.95,-76.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6562,18.96,26.14,0.1639,0.2008,112.95,-75.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,19.22,25.79,0.1649,0.2036,112.95,-75.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,19.48,25.45,0.1658,0.2063,112.95,-74.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6655,19.74,25.12,0.1668,0.209,112.95,-74.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6685,20.0,24.8,0.1678,0.2117,112.95,-73.95,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6715,20.27,24.49,0.1688,0.2144,112.95,-73.45,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6744,20.53,24.18,0.1698,0.2171,112.95,-72.95,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,7.26,62.77,0.1101,0.0836,111.89,-96.89,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,7.5,60.74,0.1117,0.0864,111.89,-96.39,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,7.75,58.84,0.1134,0.0892,111.89,-95.89,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,8.0,57.06,0.115,0.092,111.89,-95.39,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,8.24,55.38,0.1165,0.0948,111.89,-94.89,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,8.49,53.8,0.1181,0.0976,111.89,-94.39,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,8.73,52.31,0.1196,0.1004,111.89,-93.89,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,8.98,50.89,0.1211,0.1032,111.89,-93.39,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,9.23,49.55,0.1226,0.1059,111.89,-92.89,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,9.48,48.28,0.124,0.1087,111.89,-92.39,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,9.72,47.08,0.1254,0.1115,111.89,-91.89,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,9.97,45.93,0.1269,0.1143,111.89,-91.39,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,10.22,44.83,0.1283,0.1171,111.89,-90.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,10.46,43.79,0.1296,0.1199,111.89,-90.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,10.71,42.8,0.131,0.1227,111.89,-89.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,10.96,41.85,0.1323,0.1255,111.89,-89.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,11.21,40.94,0.1337,0.1283,111.89,-88.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,11.46,40.06,0.135,0.131,111.89,-88.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,11.7,39.23,0.1363,0.1338,111.89,-87.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,11.95,38.43,0.1376,0.1366,111.89,-87.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,12.2,37.66,0.1388,0.1394,111.89,-86.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,12.45,36.92,0.1401,0.1422,111.89,-86.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,12.7,36.21,0.1413,0.145,111.89,-85.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,12.94,35.53,0.1425,0.1478,111.89,-85.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,13.19,34.87,0.1438,0.1506,111.89,-84.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,13.44,34.24,0.145,0.1533,111.89,-84.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,13.69,33.63,0.1462,0.1561,111.89,-83.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,13.94,33.04,0.1473,0.1589,111.89,-83.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,14.19,32.47,0.1485,0.1617,111.89,-82.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,14.44,31.92,0.1497,0.1645,111.89,-82.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,14.68,31.38,0.1508,0.1673,111.89,-81.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.616,14.93,30.87,0.1519,0.1701,111.89,-81.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.62,15.18,30.37,0.1531,0.1729,111.89,-80.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.624,15.43,29.89,0.1542,0.1756,111.89,-80.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6278,15.68,29.42,0.1553,0.1784,111.89,-79.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6316,15.93,28.97,0.1564,0.1812,111.89,-79.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6353,16.18,28.53,0.1575,0.184,111.89,-78.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6389,16.43,28.1,0.1586,0.1868,111.89,-78.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6425,16.68,27.69,0.1596,0.1896,111.89,-77.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.646,16.93,27.29,0.1607,0.1924,111.89,-77.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6494,17.18,26.9,0.1617,0.1952,111.89,-76.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6528,17.43,26.52,0.1628,0.198,111.89,-76.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6561,17.68,26.15,0.1638,0.2007,111.89,-75.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,17.93,25.79,0.1648,0.2035,111.89,-75.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,18.18,25.45,0.1659,0.2063,111.89,-74.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6657,18.43,25.11,0.1669,0.2091,111.89,-74.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6687,18.68,24.78,0.1679,0.2119,111.89,-73.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6718,18.93,24.45,0.1689,0.2147,111.89,-73.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6747,19.18,24.14,0.1699,0.2175,111.89,-72.89,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6776,19.43,23.84,0.1709,0.2203,111.89,-72.39,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6805,19.68,23.54,0.1718,0.223,111.89,-71.89,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,6.6,59.11,0.1131,0.0888,109.56,-94.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,6.83,57.2,0.1148,0.0918,109.56,-94.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,7.05,55.41,0.1165,0.0947,109.56,-93.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,7.27,53.73,0.1181,0.0977,109.56,-93.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,7.5,52.15,0.1197,0.1007,109.56,-92.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,7.72,50.66,0.1213,0.1036,109.56,-92.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,7.95,49.26,0.1229,0.1066,109.56,-91.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,8.17,47.92,0.1244,0.1095,109.56,-91.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,8.4,46.66,0.126,0.1125,109.56,-90.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,8.62,45.47,0.1274,0.1155,109.56,-90.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,8.85,44.33,0.1289,0.1184,109.56,-89.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,9.07,43.25,0.1304,0.1214,109.56,-89.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,9.3,42.22,0.1318,0.1244,109.56,-88.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,9.52,41.24,0.1332,0.1273,109.56,-88.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,9.75,40.3,0.1346,0.1303,109.56,-87.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,9.97,39.4,0.136,0.1332,109.56,-87.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,10.2,38.55,0.1374,0.1362,109.56,-86.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,10.42,37.73,0.1387,0.1392,109.56,-86.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,10.65,36.94,0.14,0.1421,109.56,-85.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,10.87,36.19,0.1414,0.1451,109.56,-85.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,11.1,35.46,0.1427,0.148,109.56,-84.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,11.32,34.77,0.144,0.151,109.56,-84.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,11.55,34.1,0.1452,0.154,109.56,-83.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,11.78,33.46,0.1465,0.1569,109.56,-83.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,12.0,32.84,0.1477,0.1599,109.56,-82.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,12.23,32.24,0.149,0.1628,109.56,-82.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,12.45,31.66,0.1502,0.1658,109.56,-81.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,12.68,31.11,0.1514,0.1688,109.56,-81.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,12.91,30.57,0.1526,0.1717,109.56,-80.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6226,13.13,30.05,0.1538,0.1747,109.56,-80.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,13.36,29.55,0.155,0.1776,109.56,-79.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6308,13.59,29.07,0.1561,0.1806,109.56,-79.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6347,13.81,28.6,0.1573,0.1836,109.56,-78.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,14.04,28.15,0.1584,0.1865,109.56,-78.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,14.27,27.71,0.1596,0.1895,109.56,-77.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,14.49,27.28,0.1607,0.1925,109.56,-77.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,14.72,26.87,0.1618,0.1954,109.56,-76.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6533,14.95,26.47,0.1629,0.1984,109.56,-76.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,15.17,26.08,0.164,0.2013,109.56,-75.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,15.4,25.7,0.1651,0.2043,109.56,-75.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,15.63,25.33,0.1662,0.2073,109.56,-74.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6669,15.85,24.97,0.1673,0.2102,109.56,-74.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6701,16.08,24.63,0.1683,0.2132,109.56,-73.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6733,16.31,24.29,0.1694,0.2161,109.56,-73.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6764,16.54,23.96,0.1705,0.2191,109.56,-72.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,16.76,23.64,0.1715,0.2221,109.56,-72.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6825,16.99,23.33,0.1725,0.225,109.56,-71.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6855,17.22,23.03,0.1736,0.228,109.56,-71.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6884,17.45,22.73,0.1746,0.2309,109.56,-70.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6912,17.67,22.45,0.1756,0.2339,109.56,-70.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,17.9,22.16,0.1766,0.2369,109.56,-69.56,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,5.82,54.56,0.1173,0.0962,106.53,-91.53,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,6.02,52.8,0.1191,0.0994,106.53,-91.03,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,6.22,51.15,0.1208,0.1026,106.53,-90.53,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,6.41,49.6,0.1225,0.1058,106.53,-90.03,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,6.61,48.14,0.1242,0.1091,106.53,-89.53,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,6.81,46.77,0.1258,0.1123,106.53,-89.03,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,7.01,45.47,0.1274,0.1155,106.53,-88.53,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,7.2,44.24,0.129,0.1187,106.53,-88.03,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,7.4,43.07,0.1306,0.1219,106.53,-87.53,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,7.6,41.97,0.1322,0.1251,106.53,-87.03,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,7.8,40.92,0.1337,0.1283,106.53,-86.53,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,8.0,39.92,0.1352,0.1315,106.53,-86.03,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,8.2,38.97,0.1367,0.1347,106.53,-85.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,8.39,38.06,0.1382,0.1379,106.53,-85.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,8.59,37.2,0.1396,0.1411,106.53,-84.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,8.79,36.37,0.141,0.1443,106.53,-84.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,8.99,35.58,0.1424,0.1475,106.53,-83.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,9.19,34.83,0.1438,0.1508,106.53,-83.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,9.39,34.1,0.1452,0.154,106.53,-82.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,9.59,33.4,0.1466,0.1572,106.53,-82.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,9.79,32.74,0.1479,0.1604,106.53,-81.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,9.99,32.09,0.1493,0.1636,106.53,-81.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,10.18,31.48,0.1506,0.1668,106.53,-80.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,10.38,30.88,0.1519,0.17,106.53,-80.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,10.58,30.31,0.1532,0.1732,106.53,-79.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,10.78,29.76,0.1545,0.1764,106.53,-79.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,10.98,29.23,0.1558,0.1796,106.53,-78.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,11.18,28.72,0.157,0.1828,106.53,-78.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.638,11.38,28.22,0.1583,0.186,106.53,-77.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6421,11.58,27.74,0.1595,0.1892,106.53,-77.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,11.78,27.28,0.1607,0.1925,106.53,-76.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.65,11.98,26.83,0.1619,0.1957,106.53,-76.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6539,12.18,26.4,0.1631,0.1989,106.53,-75.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6577,12.38,25.98,0.1643,0.2021,106.53,-75.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,12.58,25.57,0.1655,0.2053,106.53,-74.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.665,12.78,25.18,0.1667,0.2085,106.53,-74.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6685,12.98,24.8,0.1678,0.2117,106.53,-73.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.672,13.18,24.43,0.169,0.2149,106.53,-73.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6754,13.38,24.07,0.1701,0.2181,106.53,-72.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6787,13.58,23.72,0.1712,0.2213,106.53,-72.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.682,13.78,23.38,0.1724,0.2245,106.53,-71.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6852,13.98,23.05,0.1735,0.2277,106.53,-71.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6884,14.18,22.73,0.1746,0.2309,106.53,-70.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6914,14.38,22.42,0.1757,0.2341,106.53,-70.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6945,14.58,22.12,0.1768,0.2374,106.53,-69.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6974,14.78,21.82,0.1778,0.2406,106.53,-69.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7003,14.98,21.54,0.1789,0.2438,106.53,-68.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7032,15.18,21.26,0.18,0.247,106.53,-68.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.706,15.38,20.98,0.181,0.2502,106.53,-67.53,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7088,15.58,20.72,0.1821,0.2534,106.53,-67.03,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7115,15.78,20.46,0.1831,0.2566,106.53,-66.53,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,5.18,50.66,0.1213,0.1036,103.8,-88.8,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,5.36,49.03,0.1232,0.1071,103.8,-88.3,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,5.53,47.5,0.1249,0.1105,103.8,-87.8,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,5.71,46.06,0.1267,0.114,103.8,-87.3,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,5.88,44.7,0.1284,0.1174,103.8,-86.8,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,6.06,43.43,0.1301,0.1209,103.8,-86.3,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,6.24,42.22,0.1318,0.1244,103.8,-85.8,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,6.41,41.08,0.1335,0.1278,103.8,-85.3,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,6.59,40.0,0.1351,0.1313,103.8,-84.8,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,6.76,38.97,0.1367,0.1347,103.8,-84.3,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,6.94,38.0,0.1383,0.1382,103.8,-83.8,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,7.12,37.07,0.1398,0.1416,103.8,-83.3,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,7.29,36.19,0.1414,0.1451,103.8,-82.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,7.47,35.35,0.1429,0.1485,103.8,-82.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,7.65,34.54,0.1444,0.152,103.8,-81.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,7.82,33.77,0.1459,0.1554,103.8,-81.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,8.0,33.04,0.1473,0.1589,103.8,-80.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,8.18,32.34,0.1488,0.1623,103.8,-80.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,8.36,31.66,0.1502,0.1658,103.8,-79.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,8.53,31.02,0.1516,0.1693,103.8,-79.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,8.71,30.4,0.153,0.1727,103.8,-78.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,8.89,29.8,0.1544,0.1762,103.8,-78.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,9.06,29.23,0.1558,0.1796,103.8,-77.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6341,9.24,28.68,0.1571,0.1831,103.8,-77.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,9.42,28.15,0.1584,0.1865,103.8,-76.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,9.6,27.63,0.1598,0.19,103.8,-76.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,9.77,27.14,0.1611,0.1934,103.8,-75.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,9.95,26.66,0.1624,0.1969,103.8,-75.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6556,10.13,26.2,0.1637,0.2003,103.8,-74.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6597,10.31,25.76,0.1649,0.2038,103.8,-74.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,10.48,25.33,0.1662,0.2073,103.8,-73.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6674,10.66,24.92,0.1675,0.2107,103.8,-73.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6712,10.84,24.51,0.1687,0.2142,103.8,-72.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6749,11.02,24.12,0.1699,0.2176,103.8,-72.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6785,11.19,23.75,0.1712,0.2211,103.8,-71.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.682,11.37,23.38,0.1724,0.2245,103.8,-71.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6855,11.55,23.03,0.1736,0.228,103.8,-70.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6888,11.73,22.68,0.1747,0.2314,103.8,-70.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6921,11.91,22.35,0.1759,0.2349,103.8,-69.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6954,12.08,22.03,0.1771,0.2383,103.8,-69.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6986,12.26,21.71,0.1783,0.2418,103.8,-68.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7017,12.44,21.41,0.1794,0.2453,103.8,-68.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7047,12.62,21.11,0.1806,0.2487,103.8,-67.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7077,12.8,20.82,0.1817,0.2522,103.8,-67.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7106,12.98,20.54,0.1828,0.2556,103.8,-66.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7135,13.15,20.27,0.1839,0.2591,103.8,-66.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7163,13.33,20.0,0.185,0.2625,103.8,-65.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7191,13.51,19.74,0.1861,0.266,103.8,-65.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7218,13.69,19.49,0.1872,0.2694,103.8,-64.8,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7245,13.87,19.24,0.1883,0.2729,103.8,-64.3,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7271,14.05,19.0,0.1894,0.2763,103.8,-63.8,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,5.15,50.45,0.1216,0.1041,103.65,-88.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,5.32,48.82,0.1234,0.1075,103.65,-88.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,5.49,47.29,0.1252,0.111,103.65,-87.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,5.67,45.86,0.1269,0.1145,103.65,-87.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,5.84,44.51,0.1287,0.1179,103.65,-86.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,6.02,43.24,0.1304,0.1214,103.65,-86.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,6.19,42.04,0.1321,0.1249,103.65,-85.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,6.37,40.9,0.1337,0.1284,103.65,-85.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,6.54,39.83,0.1353,0.1318,103.65,-84.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,6.72,38.8,0.1369,0.1353,103.65,-84.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,6.89,37.83,0.1385,0.1388,103.65,-83.65,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,7.07,36.91,0.1401,0.1422,103.65,-83.15,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,7.25,36.03,0.1416,0.1457,103.65,-82.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,7.42,35.2,0.1432,0.1492,103.65,-82.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,7.6,34.4,0.1447,0.1526,103.65,-81.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,7.77,33.63,0.1461,0.1561,103.65,-81.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,7.95,32.9,0.1476,0.1596,103.65,-80.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,8.12,32.2,0.1491,0.163,103.65,-80.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,8.3,31.53,0.1505,0.1665,103.65,-79.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,8.47,30.89,0.1519,0.17,103.65,-79.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,8.65,30.27,0.1533,0.1735,103.65,-78.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,8.83,29.67,0.1547,0.1769,103.65,-78.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,9.0,29.1,0.1561,0.1804,103.65,-77.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6351,9.18,28.55,0.1574,0.1839,103.65,-77.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6396,9.36,28.03,0.1588,0.1873,103.65,-76.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.644,9.53,27.52,0.1601,0.1908,103.65,-76.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6483,9.71,27.02,0.1614,0.1943,103.65,-75.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6525,9.88,26.55,0.1627,0.1977,103.65,-75.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6567,10.06,26.09,0.164,0.2012,103.65,-74.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6607,10.24,25.65,0.1653,0.2047,103.65,-74.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6646,10.41,25.22,0.1665,0.2081,103.65,-73.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6684,10.59,24.81,0.1678,0.2116,103.65,-73.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6722,10.77,24.41,0.169,0.2151,103.65,-72.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6759,10.94,24.02,0.1703,0.2185,103.65,-72.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,11.12,23.65,0.1715,0.222,103.65,-71.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.683,11.3,23.28,0.1727,0.2255,103.65,-71.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6864,11.47,22.93,0.1739,0.229,103.65,-70.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6898,11.65,22.59,0.1751,0.2324,103.65,-70.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6931,11.83,22.26,0.1763,0.2359,103.65,-69.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6963,12.0,21.93,0.1774,0.2394,103.65,-69.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6995,12.18,21.62,0.1786,0.2428,103.65,-68.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7026,12.36,21.32,0.1798,0.2463,103.65,-68.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7057,12.53,21.02,0.1809,0.2498,103.65,-67.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7086,12.71,20.73,0.182,0.2532,103.65,-67.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7116,12.89,20.45,0.1832,0.2567,103.65,-66.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7144,13.07,20.18,0.1843,0.2602,103.65,-66.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7173,13.24,19.91,0.1854,0.2636,103.65,-65.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.72,13.42,19.65,0.1865,0.2671,103.65,-65.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7227,13.6,19.4,0.1876,0.2706,103.65,-64.65,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7254,13.77,19.16,0.1887,0.2741,103.65,-64.15,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.728,13.95,18.92,0.1898,0.2775,103.65,-63.65,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,4.65,47.29,0.1252,0.111,101.33,-86.33,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,4.81,45.76,0.1271,0.1147,101.33,-85.83,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,4.96,44.33,0.1289,0.1184,101.33,-85.33,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,5.12,42.99,0.1307,0.1221,101.33,-84.83,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,5.28,41.72,0.1325,0.1258,101.33,-84.33,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,5.44,40.53,0.1343,0.1295,101.33,-83.83,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,5.59,39.4,0.136,0.1332,101.33,-83.33,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,5.75,38.34,0.1377,0.1369,101.33,-82.83,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,5.91,37.33,0.1394,0.1406,101.33,-82.33,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,6.07,36.37,0.141,0.1443,101.33,-81.83,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,6.23,35.46,0.1427,0.148,101.33,-81.33,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,6.39,34.6,0.1443,0.1517,101.33,-80.83,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,6.54,33.77,0.1459,0.1554,101.33,-80.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,6.7,32.99,0.1474,0.1591,101.33,-79.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,6.86,32.24,0.149,0.1628,101.33,-79.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,7.02,31.52,0.1505,0.1665,101.33,-78.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,7.18,30.84,0.152,0.1702,101.33,-78.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,7.34,30.18,0.1535,0.1739,101.33,-77.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,7.5,29.55,0.155,0.1776,101.33,-77.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,7.65,28.95,0.1564,0.1813,101.33,-76.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,7.81,28.37,0.1579,0.185,101.33,-76.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,7.97,27.81,0.1593,0.1887,101.33,-75.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,8.13,27.28,0.1607,0.1925,101.33,-75.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6506,8.29,26.77,0.1621,0.1962,101.33,-74.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,8.45,26.27,0.1635,0.1999,101.33,-74.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,8.61,25.79,0.1649,0.2036,101.33,-73.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,8.77,25.33,0.1662,0.2073,101.33,-73.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6677,8.93,24.89,0.1675,0.211,101.33,-72.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6717,9.09,24.46,0.1689,0.2147,101.33,-72.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6757,9.25,24.04,0.1702,0.2184,101.33,-71.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,9.41,23.64,0.1715,0.2221,101.33,-71.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6832,9.56,23.25,0.1728,0.2258,101.33,-70.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6869,9.72,22.88,0.1741,0.2295,101.33,-70.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6905,9.88,22.52,0.1753,0.2332,101.33,-69.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,10.04,22.16,0.1766,0.2369,101.33,-69.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6974,10.2,21.82,0.1778,0.2406,101.33,-68.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7008,10.36,21.49,0.1791,0.2443,101.33,-68.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7041,10.52,21.17,0.1803,0.248,101.33,-67.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7073,10.68,20.86,0.1815,0.2517,101.33,-67.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7104,10.84,20.56,0.1827,0.2554,101.33,-66.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7135,11.0,20.27,0.1839,0.2591,101.33,-66.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7165,11.16,19.98,0.1851,0.2628,101.33,-65.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7195,11.32,19.7,0.1863,0.2665,101.33,-65.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7224,11.48,19.43,0.1875,0.2702,101.33,-64.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7252,11.64,19.17,0.1886,0.2739,101.33,-64.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.728,11.8,18.91,0.1898,0.2776,101.33,-63.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7308,11.96,18.67,0.1909,0.2813,101.33,-63.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7334,12.12,18.42,0.1921,0.285,101.33,-62.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7361,12.28,18.19,0.1932,0.2887,101.33,-62.33,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7386,12.44,17.96,0.1943,0.2924,101.33,-61.83,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7412,12.6,17.73,0.1954,0.2961,101.33,-61.33,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,4.2,44.33,0.1289,0.1184,99.06,-84.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,4.34,42.9,0.1309,0.1224,99.06,-83.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,4.48,41.56,0.1328,0.1263,99.06,-83.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,4.63,40.3,0.1346,0.1303,99.06,-82.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,4.77,39.11,0.1365,0.1342,99.06,-82.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,4.91,38.0,0.1383,0.1382,99.06,-81.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,5.05,36.94,0.14,0.1421,99.06,-81.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,5.2,35.94,0.1418,0.1461,99.06,-80.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,5.34,35.0,0.1435,0.15,99.06,-80.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,5.48,34.1,0.1452,0.154,99.06,-79.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,5.63,33.25,0.1469,0.1579,99.06,-79.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,5.77,32.44,0.1486,0.1619,99.06,-78.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,5.91,31.66,0.1502,0.1658,99.06,-78.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,6.06,30.93,0.1518,0.1698,99.06,-77.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,6.2,30.22,0.1534,0.1737,99.06,-77.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,6.34,29.55,0.155,0.1776,99.06,-76.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,6.49,28.91,0.1565,0.1816,99.06,-76.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,6.63,28.3,0.1581,0.1855,99.06,-75.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,6.77,27.71,0.1596,0.1895,99.06,-75.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,6.92,27.14,0.1611,0.1934,99.06,-74.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,7.06,26.6,0.1626,0.1974,99.06,-74.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,7.2,26.08,0.164,0.2013,99.06,-73.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,7.35,25.57,0.1655,0.2053,99.06,-73.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6658,7.49,25.09,0.1669,0.2092,99.06,-72.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6701,7.63,24.63,0.1683,0.2132,99.06,-72.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6744,7.78,24.18,0.1698,0.2171,99.06,-71.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6785,7.92,23.75,0.1712,0.2211,99.06,-71.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6825,8.07,23.33,0.1725,0.225,99.06,-70.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6864,8.21,22.93,0.1739,0.229,99.06,-70.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6903,8.35,22.54,0.1753,0.2329,99.06,-69.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,8.5,22.16,0.1766,0.2369,99.06,-69.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6977,8.64,21.8,0.1779,0.2408,99.06,-68.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7012,8.79,21.45,0.1792,0.2448,99.06,-68.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7047,8.93,21.11,0.1806,0.2487,99.06,-67.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7081,9.07,20.78,0.1818,0.2527,99.06,-67.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7115,9.22,20.46,0.1831,0.2566,99.06,-66.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7147,9.36,20.15,0.1844,0.2605,99.06,-66.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7179,9.51,19.85,0.1857,0.2645,99.06,-65.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7211,9.65,19.56,0.1869,0.2684,99.06,-65.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7241,9.8,19.27,0.1882,0.2724,99.06,-64.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7271,9.94,19.0,0.1894,0.2763,99.06,-64.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.73,10.08,18.73,0.1906,0.2803,99.06,-63.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7329,10.23,18.47,0.1918,0.2842,99.06,-63.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7357,10.37,18.22,0.193,0.2882,99.06,-62.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7385,10.52,17.97,0.1942,0.2921,99.06,-62.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7412,10.66,17.73,0.1954,0.2961,99.06,-61.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7438,10.81,17.5,0.1966,0.3,99.06,-61.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7464,10.95,17.27,0.1978,0.304,99.06,-60.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.749,11.1,17.05,0.1989,0.3079,99.06,-60.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7515,11.24,16.83,0.2001,0.3119,99.06,-59.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7539,11.39,16.62,0.2012,0.3158,99.06,-59.06,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,3.82,41.72,0.1325,0.1258,96.98,-81.98,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,3.95,40.38,0.1345,0.13,96.98,-81.48,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,4.08,39.11,0.1365,0.1342,96.98,-80.98,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,4.21,37.93,0.1384,0.1384,96.98,-80.48,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,4.34,36.81,0.1403,0.1426,96.98,-79.98,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,4.46,35.76,0.1421,0.1468,96.98,-79.48,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,4.59,34.77,0.144,0.151,96.98,-78.98,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,4.72,33.83,0.1458,0.1552,96.98,-78.48,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,4.85,32.94,0.1475,0.1594,96.98,-77.98,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,4.98,32.09,0.1493,0.1636,96.98,-77.48,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,5.11,31.29,0.151,0.1678,96.98,-76.98,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,5.24,30.53,0.1527,0.172,96.98,-76.48,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,5.37,29.8,0.1544,0.1762,96.98,-75.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,5.5,29.11,0.156,0.1804,96.98,-75.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,5.63,28.45,0.1577,0.1846,96.98,-74.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,5.77,27.81,0.1593,0.1887,96.98,-74.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,5.9,27.21,0.1609,0.1929,96.98,-73.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6518,6.03,26.63,0.1625,0.1971,96.98,-73.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,6.16,26.08,0.164,0.2013,96.98,-72.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6616,6.29,25.54,0.1656,0.2055,96.98,-72.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6664,6.42,25.03,0.1671,0.2097,96.98,-71.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6709,6.55,24.54,0.1686,0.2139,96.98,-71.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6754,6.68,24.07,0.1701,0.2181,96.98,-70.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6798,6.81,23.62,0.1716,0.2223,96.98,-70.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.684,6.94,23.18,0.173,0.2265,96.98,-69.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6881,7.07,22.76,0.1745,0.2307,96.98,-69.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6921,7.2,22.35,0.1759,0.2349,96.98,-68.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6961,7.33,21.96,0.1773,0.2391,96.98,-68.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6999,7.46,21.58,0.1788,0.2433,96.98,-67.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7036,7.59,21.21,0.1801,0.2475,96.98,-67.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7073,7.72,20.86,0.1815,0.2517,96.98,-66.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7109,7.86,20.52,0.1829,0.2559,96.98,-66.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7143,7.99,20.19,0.1842,0.2601,96.98,-65.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7177,8.12,19.87,0.1856,0.2642,96.98,-65.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7211,8.25,19.56,0.1869,0.2684,96.98,-64.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7243,8.38,19.26,0.1882,0.2726,96.98,-64.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7275,8.51,18.96,0.1896,0.2768,96.98,-63.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7306,8.64,18.68,0.1909,0.281,96.98,-63.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7336,8.77,18.41,0.1921,0.2852,96.98,-62.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7366,8.9,18.14,0.1934,0.2894,96.98,-62.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7395,9.04,17.88,0.1947,0.2936,96.98,-61.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7423,9.17,17.63,0.1959,0.2978,96.98,-61.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7451,9.3,17.38,0.1972,0.302,96.98,-60.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7479,9.43,17.15,0.1984,0.3062,96.98,-60.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7505,9.56,16.91,0.1997,0.3104,96.98,-59.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7531,9.69,16.69,0.2009,0.3146,96.98,-59.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7557,9.82,16.47,0.2021,0.3188,96.98,-58.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7582,9.96,16.26,0.2033,0.323,96.98,-58.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7607,10.09,16.05,0.2045,0.3272,96.98,-57.98,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7631,10.22,15.84,0.2057,0.3314,96.98,-57.48,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7655,10.35,15.65,0.2069,0.3356,96.98,-56.98,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,3.49,39.4,0.136,0.1332,95.06,-80.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,3.61,38.13,0.138,0.1377,95.06,-79.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,3.73,36.94,0.14,0.1421,95.06,-79.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,3.84,35.82,0.142,0.1466,95.06,-78.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,3.96,34.77,0.144,0.151,95.06,-78.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,4.08,33.78,0.1459,0.1554,95.06,-77.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,4.2,32.84,0.1477,0.1599,95.06,-77.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,4.32,31.95,0.1496,0.1643,95.06,-76.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,4.44,31.11,0.1514,0.1688,95.06,-76.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,4.56,30.31,0.1532,0.1732,95.06,-75.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,4.67,29.55,0.155,0.1776,95.06,-75.06,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,4.79,28.83,0.1567,0.1821,95.06,-74.56,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,4.91,28.15,0.1584,0.1865,95.06,-74.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,5.03,27.49,0.1601,0.191,95.06,-73.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,5.15,26.87,0.1618,0.1954,95.06,-73.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,5.27,26.27,0.1635,0.1999,95.06,-72.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,5.39,25.7,0.1651,0.2043,95.06,-72.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6653,5.51,25.15,0.1667,0.2087,95.06,-71.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6701,5.63,24.63,0.1683,0.2132,95.06,-71.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6749,5.75,24.12,0.1699,0.2176,95.06,-70.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,5.87,23.64,0.1715,0.2221,95.06,-70.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.684,5.98,23.18,0.173,0.2265,95.06,-69.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6884,6.1,22.73,0.1746,0.2309,95.06,-69.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6926,6.22,22.3,0.1761,0.2354,95.06,-68.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6968,6.34,21.89,0.1776,0.2398,95.06,-68.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7008,6.46,21.49,0.1791,0.2443,95.06,-67.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7047,6.58,21.11,0.1806,0.2487,95.06,-67.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7086,6.7,20.74,0.182,0.2531,95.06,-66.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7123,6.82,20.38,0.1835,0.2576,95.06,-66.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7159,6.94,20.04,0.1849,0.262,95.06,-65.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7195,7.06,19.7,0.1863,0.2665,95.06,-65.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.723,7.18,19.38,0.1877,0.2709,95.06,-64.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7264,7.3,19.07,0.1891,0.2754,95.06,-64.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7297,7.42,18.76,0.1905,0.2798,95.06,-63.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7329,7.54,18.47,0.1918,0.2842,95.06,-63.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7361,7.66,18.19,0.1932,0.2887,95.06,-62.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7392,7.78,17.91,0.1945,0.2931,95.06,-62.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7422,7.9,17.64,0.1959,0.2976,95.06,-61.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7451,8.02,17.38,0.1972,0.302,95.06,-61.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.748,8.14,17.13,0.1985,0.3064,95.06,-60.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7508,8.26,16.89,0.1998,0.3109,95.06,-60.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7536,8.38,16.65,0.2011,0.3153,95.06,-59.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7563,8.5,16.42,0.2024,0.3198,95.06,-59.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7589,8.62,16.19,0.2036,0.3242,95.06,-58.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7615,8.74,15.97,0.2049,0.3286,95.06,-58.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7641,8.86,15.76,0.2062,0.3331,95.06,-57.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7666,8.98,15.55,0.2074,0.3375,95.06,-57.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.769,9.1,15.35,0.2086,0.342,95.06,-56.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7714,9.22,15.16,0.2099,0.3464,95.06,-56.06,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7737,9.34,14.96,0.2111,0.3509,95.06,-55.56,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.776,9.46,14.78,0.2123,0.3553,95.06,-55.06,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,3.2,37.33,0.1394,0.1406,93.28,-78.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,3.31,36.13,0.1415,0.1453,93.28,-77.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,3.42,35.0,0.1435,0.15,93.28,-77.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,3.53,33.94,0.1455,0.1547,93.28,-76.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,3.64,32.94,0.1475,0.1594,93.28,-76.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,3.75,32.0,0.1495,0.1641,93.28,-75.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,3.86,31.11,0.1514,0.1688,93.28,-75.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,3.97,30.27,0.1533,0.1735,93.28,-74.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,4.08,29.47,0.1552,0.1781,93.28,-74.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,4.18,28.72,0.157,0.1828,93.28,-73.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,4.29,28.0,0.1588,0.1875,93.28,-73.28,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,4.4,27.31,0.1606,0.1922,93.28,-72.78,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,4.51,26.66,0.1624,0.1969,93.28,-72.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,4.62,26.04,0.1641,0.2016,93.28,-71.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,4.73,25.45,0.1658,0.2063,93.28,-71.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6677,4.84,24.89,0.1675,0.211,93.28,-70.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6728,4.95,24.35,0.1692,0.2156,93.28,-70.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6777,5.06,23.83,0.1709,0.2203,93.28,-69.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6825,5.17,23.33,0.1725,0.225,93.28,-69.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6872,5.28,22.86,0.1742,0.2297,93.28,-68.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6917,5.39,22.4,0.1758,0.2344,93.28,-68.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6961,5.5,21.96,0.1773,0.2391,93.28,-67.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7003,5.61,21.54,0.1789,0.2438,93.28,-67.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7045,5.72,21.13,0.1805,0.2485,93.28,-66.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7086,5.83,20.74,0.182,0.2531,93.28,-66.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7125,5.94,20.36,0.1835,0.2578,93.28,-65.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7163,6.05,20.0,0.185,0.2625,93.28,-65.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7201,6.16,19.65,0.1865,0.2672,93.28,-64.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7237,6.26,19.31,0.188,0.2719,93.28,-64.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7273,6.37,18.98,0.1895,0.2766,93.28,-63.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7308,6.48,18.67,0.1909,0.2813,93.28,-63.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7341,6.59,18.36,0.1924,0.286,93.28,-62.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7375,6.7,18.06,0.1938,0.2906,93.28,-62.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7407,6.81,17.78,0.1952,0.2953,93.28,-61.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7438,6.92,17.5,0.1966,0.3,93.28,-61.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7469,7.03,17.23,0.198,0.3047,93.28,-60.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7499,7.14,16.97,0.1994,0.3094,93.28,-60.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7528,7.25,16.72,0.2007,0.3141,93.28,-59.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7557,7.36,16.47,0.2021,0.3188,93.28,-59.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7585,7.48,16.23,0.2034,0.3235,93.28,-58.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7613,7.59,16.0,0.2048,0.3282,93.28,-58.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7639,7.7,15.77,0.2061,0.3328,93.28,-57.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7666,7.81,15.55,0.2074,0.3375,93.28,-57.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7691,7.92,15.34,0.2087,0.3422,93.28,-56.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7716,8.03,15.13,0.21,0.3469,93.28,-56.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7741,8.14,14.93,0.2113,0.3516,93.28,-55.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7765,8.25,14.74,0.2126,0.3563,93.28,-55.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7789,8.36,14.54,0.2138,0.361,93.28,-54.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7812,8.47,14.36,0.2151,0.3657,93.28,-54.28,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7835,8.58,14.18,0.2163,0.3703,93.28,-53.78,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7857,8.69,14.0,0.2176,0.375,93.28,-53.28,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,2.96,35.46,0.1427,0.148,91.62,-76.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,3.06,34.32,0.1448,0.153,91.62,-76.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,3.16,33.25,0.1469,0.1579,91.62,-75.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,3.26,32.24,0.149,0.1628,91.62,-75.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,3.36,31.29,0.151,0.1678,91.62,-74.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,3.46,30.4,0.153,0.1727,91.62,-74.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,3.56,29.55,0.155,0.1776,91.62,-73.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,3.66,28.75,0.1569,0.1826,91.62,-73.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,3.76,28.0,0.1588,0.1875,91.62,-72.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,3.86,27.28,0.1607,0.1925,91.62,-72.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,3.96,26.6,0.1626,0.1974,91.62,-71.62,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,4.06,25.95,0.1644,0.2023,91.62,-71.12,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,4.16,25.33,0.1662,0.2073,91.62,-70.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6691,4.26,24.74,0.168,0.2122,91.62,-70.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6744,4.36,24.18,0.1698,0.2171,91.62,-69.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6795,4.46,23.64,0.1715,0.2221,91.62,-69.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6845,4.57,23.13,0.1732,0.227,91.62,-68.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6893,4.67,22.64,0.1749,0.2319,91.62,-68.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.694,4.77,22.16,0.1766,0.2369,91.62,-67.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6986,4.87,21.71,0.1783,0.2418,91.62,-67.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.703,4.97,21.28,0.1799,0.2467,91.62,-66.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7073,5.07,20.86,0.1815,0.2517,91.62,-66.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7115,5.17,20.46,0.1831,0.2566,91.62,-65.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7155,5.27,20.07,0.1847,0.2615,91.62,-65.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7195,5.37,19.7,0.1863,0.2665,91.62,-64.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7234,5.48,19.34,0.1879,0.2714,91.62,-64.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7271,5.58,19.0,0.1894,0.2763,91.62,-63.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7308,5.68,18.67,0.1909,0.2813,91.62,-63.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7343,5.78,18.34,0.1924,0.2862,91.62,-62.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7378,5.88,18.03,0.1939,0.2911,91.62,-62.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7412,5.98,17.73,0.1954,0.2961,91.62,-61.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7445,6.08,17.44,0.1969,0.301,91.62,-61.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7477,6.18,17.16,0.1984,0.3059,91.62,-60.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7508,6.29,16.89,0.1998,0.3109,91.62,-60.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7539,6.39,16.62,0.2012,0.3158,91.62,-59.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7569,6.49,16.37,0.2027,0.3208,91.62,-59.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7598,6.59,16.12,0.2041,0.3257,91.62,-58.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7627,6.69,15.88,0.2055,0.3306,91.62,-58.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7655,6.79,15.65,0.2069,0.3356,91.62,-57.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7682,6.9,15.42,0.2082,0.3405,91.62,-57.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7709,7.0,15.2,0.2096,0.3454,91.62,-56.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7735,7.1,14.98,0.2109,0.3504,91.62,-56.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.776,7.2,14.78,0.2123,0.3553,91.62,-55.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7785,7.3,14.57,0.2136,0.3602,91.62,-55.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.781,7.4,14.38,0.2149,0.3652,91.62,-54.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7833,7.51,14.19,0.2163,0.3701,91.62,-54.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7857,7.61,14.0,0.2176,0.375,91.62,-53.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.788,7.71,13.82,0.2189,0.38,91.62,-53.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7902,7.81,13.64,0.2201,0.3849,91.62,-52.62,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7924,7.91,13.47,0.2214,0.3898,91.62,-52.12,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7946,8.02,13.3,0.2227,0.3948,91.62,-51.62,[3,4]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,2.9,35.01,0.1435,0.15,91.21,-76.21,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,2.99,33.88,0.1457,0.155,91.21,-75.71,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,3.09,32.82,0.1478,0.16,91.21,-75.21,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,3.19,31.83,0.1498,0.165,91.21,-74.71,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,3.29,30.89,0.1519,0.17,91.21,-74.21,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,3.39,30.01,0.1539,0.175,91.21,-73.71,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,3.49,29.17,0.1559,0.18,91.21,-73.21,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,3.59,28.39,0.1578,0.185,91.21,-72.71,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,3.68,27.64,0.1598,0.19,91.21,-72.21,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,3.78,26.93,0.1617,0.195,91.21,-71.71,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,3.88,26.26,0.1635,0.2,91.21,-71.21,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,3.98,25.62,0.1654,0.2049,91.21,-70.71,[1,3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,4.08,25.01,0.1672,0.2099,91.21,-70.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.672,4.18,24.42,0.169,0.2149,91.21,-69.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6773,4.28,23.87,0.1708,0.2199,91.21,-69.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6824,4.37,23.34,0.1725,0.2249,91.21,-68.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6874,4.47,22.83,0.1742,0.2299,91.21,-68.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6922,4.57,22.35,0.1759,0.2349,91.21,-67.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6969,4.67,21.88,0.1776,0.2399,91.21,-67.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7014,4.77,21.43,0.1793,0.2449,91.21,-66.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7058,4.87,21.01,0.181,0.2499,91.21,-66.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7101,4.97,20.59,0.1826,0.2549,91.21,-65.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7142,5.07,20.2,0.1842,0.2599,91.21,-65.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7183,5.17,19.82,0.1858,0.2649,91.21,-64.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7222,5.27,19.45,0.1874,0.2699,91.21,-64.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.726,5.37,19.1,0.189,0.2749,91.21,-63.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7298,5.46,18.75,0.1905,0.2799,91.21,-63.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7334,5.56,18.43,0.192,0.2849,91.21,-62.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7369,5.66,18.11,0.1936,0.2899,91.21,-62.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7404,5.76,17.8,0.1951,0.2949,91.21,-61.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7438,5.86,17.5,0.1966,0.2999,91.21,-61.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.747,5.96,17.22,0.1981,0.3049,91.21,-60.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7502,6.06,16.94,0.1995,0.3099,91.21,-60.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7534,6.16,16.67,0.201,0.3149,91.21,-59.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7564,6.26,16.41,0.2024,0.3199,91.21,-59.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7594,6.36,16.16,0.2038,0.3249,91.21,-58.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7623,6.46,15.91,0.2053,0.3299,91.21,-58.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7651,6.56,15.68,0.2067,0.3349,91.21,-57.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7679,6.66,15.44,0.2081,0.3399,91.21,-57.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7706,6.76,15.22,0.2095,0.3449,91.21,-56.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7732,6.86,15.0,0.2108,0.3499,91.21,-56.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7758,6.96,14.79,0.2122,0.3549,91.21,-55.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7784,7.06,14.59,0.2135,0.3599,91.21,-55.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7808,7.16,14.39,0.2149,0.3649,91.21,-54.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7833,7.26,14.19,0.2162,0.3699,91.21,-54.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7856,7.35,14.0,0.2175,0.3749,91.21,-53.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.788,7.45,13.82,0.2188,0.3799,91.21,-53.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7902,7.55,13.64,0.2201,0.3849,91.21,-52.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7925,7.65,13.46,0.2214,0.3899,91.21,-52.21,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7946,7.75,13.29,0.2227,0.3949,91.21,-51.71,[3,4]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.7968,7.85,13.13,0.224,0.3999,91.21,-51.21,[3,4]]]],"PU foam":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,20.52,70.93,0.1041,0.074,16.9,-1.9,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,21.22,68.64,0.1057,0.0765,16.9,-1.4,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,21.91,66.49,0.1072,0.079,16.9,-0.9,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,22.61,64.48,0.1088,0.0814,16.9,-0.4,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,23.31,62.58,0.1102,0.0839,16.9,0.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,24.0,60.8,0.1117,0.0864,16.9,0.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,24.7,59.11,0.1131,0.0888,16.9,1.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,25.4,57.51,0.1145,0.0913,16.9,1.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,26.1,56.0,0.1159,0.0938,16.9,2.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,26.8,54.56,0.1173,0.0962,16.9,2.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,27.5,53.2,0.1187,0.0987,16.9,3.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,28.19,51.9,0.12,0.1012,16.9,3.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,28.89,50.66,0.1213,0.1036,16.9,4.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,29.59,49.48,0.1226,0.1061,16.9,4.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,30.29,48.36,0.1239,0.1086,16.9,5.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,30.99,47.29,0.1252,0.111,16.9,5.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,31.69,46.26,0.1265,0.1135,16.9,6.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,32.4,45.27,0.1277,0.116,16.9,6.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,33.1,44.33,0.1289,0.1184,16.9,7.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,33.8,43.43,0.1301,0.1209,16.9,7.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,34.5,42.56,0.1313,0.1234,16.9,8.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,35.2,41.72,0.1325,0.1258,16.9,8.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,35.9,40.92,0.1337,0.1283,16.9,9.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,36.61,40.15,0.1349,0.1308,16.9,9.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,37.31,39.4,0.136,0.1332,16.9,10.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,38.01,38.69,0.1371,0.1357,16.9,10.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,38.71,38.0,0.1383,0.1382,16.9,11.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,39.42,37.33,0.1394,0.1406,16.9,11.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,40.12,36.69,0.1405,0.1431,16.9,12.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,40.82,36.06,0.1416,0.1456,16.9,12.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,41.53,35.46,0.1427,0.148,16.9,13.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,42.23,34.88,0.1437,0.1505,16.9,13.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,42.94,34.32,0.1448,0.153,16.9,14.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,43.64,33.77,0.1459,0.1554,16.9,14.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,44.35,33.25,0.1469,0.1579,16.9,15.1,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0104,0.0,0.6014,45.05,32.74,0.1479,0.1604,16.9,15.6,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0234,0.0,0.6052,45.75,32.24,0.149,0.1628,16.9,16.1,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0363,0.0,0.609,46.46,31.76,0.15,0.1653,16.9,16.6,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0493,0.0,0.6127,47.17,31.29,0.151,0.1678,16.9,17.1,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0623,0.0,0.6163,47.87,30.84,0.152,0.1702,16.9,17.6,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0753,0.0,0.6198,48.58,30.4,0.153,0.1727,16.9,18.1,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0883,0.0,0.6233,49.28,29.97,0.154,0.1752,16.9,18.6,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.1013,0.0,0.6267,49.99,29.55,0.155,0.1776,16.9,19.1,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1143,0.0,0.6301,50.69,29.15,0.1559,0.1801,16.9,19.6,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1272,0.0,0.6334,51.4,28.75,0.1569,0.1826,16.9,20.1,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1402,0.0,0.6367,52.11,28.37,0.1579,0.185,16.9,20.6,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1532,0.0,0.6399,52.81,28.0,0.1588,0.1875,16.9,21.1,[6,7]],[4.2,"low",0.0,0.0,0.0,0.0,0.1662,0.0,0.643,53.52,27.63,0.1598,0.19,16.9,21.6,[6,7]],[4.5,"low",0.0,0.0,0.0,0.0,0.1792,0.0,0.6461,54.23,27.28,0.1607,0.1925,16.9,22.1,[6,7]],[4.8,"low",0.0,0.0,0.0,0.0,0.1922,0.0,0.6491,54.93,26.93,0.1616,0.1949,16.9,22.6,[6,7]],[5.1,"low",0.0,0.0,0.0,0.0,0.2052,0.0,0.6521,55.64,26.6,0.1626,0.1974,16.9,23.1,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,17.66,64.48,0.1088,0.0814,16.35,-1.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,18.26,62.4,0.1104,0.0841,16.35,-0.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,18.86,60.45,0.112,0.0868,16.35,-0.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,19.46,58.62,0.1136,0.0896,16.35,0.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,20.06,56.89,0.1151,0.0923,16.35,0.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,20.66,55.27,0.1166,0.095,16.35,1.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,21.26,53.73,0.1181,0.0977,16.35,1.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,21.86,52.28,0.1196,0.1004,16.35,2.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,22.46,50.9,0.1211,0.1031,16.35,2.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,23.07,49.6,0.1225,0.1058,16.35,3.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,23.67,48.36,0.1239,0.1086,16.35,3.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,24.27,47.18,0.1253,0.1113,16.35,4.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,24.87,46.06,0.1267,0.114,16.35,4.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,25.47,44.99,0.1281,0.1167,16.35,5.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,26.08,43.96,0.1294,0.1194,16.35,5.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,26.68,42.99,0.1307,0.1221,16.35,6.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,27.28,42.05,0.132,0.1248,16.35,6.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,27.89,41.16,0.1333,0.1276,16.35,7.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,28.49,40.3,0.1346,0.1303,16.35,7.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,29.09,39.48,0.1359,0.133,16.35,8.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,29.7,38.69,0.1371,0.1357,16.35,8.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,30.3,37.93,0.1384,0.1384,16.35,9.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,30.9,37.2,0.1396,0.1411,16.35,9.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,31.51,36.5,0.1408,0.1438,16.35,10.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,32.11,35.82,0.142,0.1466,16.35,10.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,32.72,35.17,0.1432,0.1493,16.35,11.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,33.32,34.54,0.1444,0.152,16.35,11.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,33.93,33.94,0.1455,0.1547,16.35,12.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,34.53,33.35,0.1467,0.1574,16.35,12.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,35.14,32.79,0.1478,0.1601,16.35,13.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,35.75,32.24,0.149,0.1628,16.35,13.65,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0096,0.0,0.6094,36.35,31.71,0.1501,0.1656,16.35,14.15,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0239,0.0,0.6134,36.96,31.2,0.1512,0.1683,16.35,14.65,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0382,0.0,0.6174,37.56,30.7,0.1523,0.171,16.35,15.15,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0524,0.0,0.6212,38.17,30.22,0.1534,0.1737,16.35,15.65,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0667,0.0,0.625,38.78,29.76,0.1545,0.1764,16.35,16.15,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.081,0.0,0.6288,39.38,29.31,0.1556,0.1791,16.35,16.65,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0953,0.0,0.6324,39.99,28.87,0.1566,0.1818,16.35,17.15,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1096,0.0,0.636,40.6,28.45,0.1577,0.1846,16.35,17.65,[6,7]],[3.1,"low",0.0,0.0,0.0,0.0,0.1239,0.0,0.6395,41.21,28.03,0.1587,0.1873,16.35,18.15,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1381,0.0,0.643,41.81,27.63,0.1598,0.19,16.35,18.65,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1524,0.0,0.6464,42.42,27.24,0.1608,0.1927,16.35,19.15,[6,7]],[4.2,"low",0.0,0.0,0.0,0.0,0.1667,0.0,0.6497,43.03,26.87,0.1618,0.1954,16.35,19.65,[6,7]],[4.5,"low",0.0,0.0,0.0,0.0,0.181,0.0,0.653,43.64,26.5,0.1628,0.1981,16.35,20.15,[6,7]],[4.9,"low",0.0,0.0,0.0,0.0,0.1953,0.0,0.6562,44.24,26.14,0.1639,0.2008,16.35,20.65,[6,7]],[5.2,"low",0.0,0.0,0.0,0.0,0.2096,0.0,0.6594,44.85,25.79,0.1649,0.2036,16.35,21.15,[6,7]],[5.6,"low",0.0,0.0,0.0,0.0,0.2239,0.0,0.6625,45.46,25.45,0.1658,0.2063,16.35,21.65,[6,7]],[6.0,"low",0.0,0.0,0.0,0.0,0.2381,0.0,0.6655,46.07,25.12,0.1668,0.209,16.35,22.15,[6,7]],[7.0,"low",0.0125,0.0143,0.0,0.0125,0.2524,0.0045,0.6685,46.68,24.8,0.1678,0.2117,16.35,22.65,[6]],[8.5,"low",0.0322,0.0369,0.0,0.0322,0.2667,0.0113,0.6715,47.29,24.49,0.1688,0.2144,16.35,23.15,[6]],[10.0,"low",0.0518,0.0592,0.0,0.0518,0.281,0.0176,0.6744,47.9,24.18,0.1698,0.2171,16.35,23.65,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,16.93,62.77,0.1101,0.0836,16.19,-1.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,17.51,60.74,0.1117,0.0864,16.19,-0.69,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,18.08,58.84,0.1134,0.0892,16.19,-0.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,18.66,57.06,0.115,0.092,16.19,0.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,19.23,55.38,0.1165,0.0948,16.19,0.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,19.81,53.8,0.1181,0.0976,16.19,1.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,20.38,52.31,0.1196,0.1004,16.19,1.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,20.96,50.89,0.1211,0.1032,16.19,2.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,21.53,49.55,0.1226,0.1059,16.19,2.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,22.11,48.28,0.124,0.1087,16.19,3.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,22.69,47.08,0.1254,0.1115,16.19,3.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,23.26,45.93,0.1269,0.1143,16.19,4.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,23.84,44.83,0.1283,0.1171,16.19,4.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,24.42,43.79,0.1296,0.1199,16.19,5.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,25.0,42.8,0.131,0.1227,16.19,5.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,25.57,41.85,0.1323,0.1255,16.19,6.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,26.15,40.94,0.1337,0.1283,16.19,6.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,26.73,40.06,0.135,0.131,16.19,7.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,27.31,39.23,0.1363,0.1338,16.19,7.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,27.89,38.43,0.1376,0.1366,16.19,8.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,28.47,37.66,0.1388,0.1394,16.19,8.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,29.04,36.92,0.1401,0.1422,16.19,9.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,29.62,36.21,0.1413,0.145,16.19,9.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,30.2,35.53,0.1425,0.1478,16.19,10.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,30.78,34.87,0.1438,0.1506,16.19,10.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,31.36,34.24,0.145,0.1533,16.19,11.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,31.94,33.63,0.1462,0.1561,16.19,11.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,32.52,33.04,0.1473,0.1589,16.19,12.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,33.1,32.47,0.1485,0.1617,16.19,12.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,33.68,31.92,0.1497,0.1645,16.19,13.31,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0104,0.0,0.6119,34.26,31.38,0.1508,0.1673,16.19,13.81,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0251,0.0,0.616,34.85,30.87,0.1519,0.1701,16.19,14.31,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0398,0.0,0.62,35.43,30.37,0.1531,0.1729,16.19,14.81,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.0545,0.0,0.624,36.01,29.89,0.1542,0.1756,16.19,15.31,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0691,0.0,0.6278,36.59,29.42,0.1553,0.1784,16.19,15.81,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0838,0.0,0.6316,37.17,28.97,0.1564,0.1812,16.19,16.31,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.0985,0.0,0.6353,37.75,28.53,0.1575,0.184,16.19,16.81,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1132,0.0,0.6389,38.33,28.1,0.1586,0.1868,16.19,17.31,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1278,0.0,0.6425,38.92,27.69,0.1596,0.1896,16.19,17.81,[6,7]],[3.6,"low",0.0,0.0,0.0,0.0,0.1425,0.0,0.646,39.5,27.29,0.1607,0.1924,16.19,18.31,[6,7]],[3.9,"low",0.0,0.0,0.0,0.0,0.1572,0.0,0.6494,40.08,26.9,0.1617,0.1952,16.19,18.81,[6,7]],[4.3,"low",0.0,0.0,0.0,0.0,0.1719,0.0,0.6528,40.66,26.52,0.1628,0.198,16.19,19.31,[6,7]],[4.7,"low",0.0,0.0,0.0,0.0,0.1865,0.0,0.6561,41.25,26.15,0.1638,0.2007,16.19,19.81,[6,7]],[5.0,"low",0.0,0.0,0.0,0.0,0.2012,0.0,0.6594,41.83,25.79,0.1648,0.2035,16.19,20.31,[6,7]],[5.4,"low",0.0,0.0,0.0,0.0,0.2159,0.0,0.6625,42.41,25.45,0.1659,0.2063,16.19,20.81,[6,7]],[5.8,"low",0.0,0.0,0.0,0.0,0.2305,0.0,0.6657,42.99,25.11,0.1669,0.2091,16.19,21.31,[6,7]],[6.9,"low",0.0139,0.016,0.0,0.0139,0.2452,0.0053,0.6687,43.58,24.78,0.1679,0.2119,16.19,21.81,[6]],[8.5,"low",0.0342,0.0392,0.0,0.0342,0.2599,0.0126,0.6718,44.16,24.45,0.1689,0.2147,16.19,22.31,[6]],[10.0,"low",0.0542,0.062,0.0,0.0542,0.2746,0.0195,0.6747,44.74,24.14,0.1699,0.2175,16.19,22.81,[6]],[11.4,"low",0.074,0.0844,0.0,0.074,0.2892,0.0259,0.6776,45.33,23.84,0.1709,0.2203,16.19,23.31,[6]],[12.9,"low",0.0935,0.1064,0.0,0.0935,0.3039,0.0318,0.6805,45.91,23.54,0.1718,0.223,16.19,23.81,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,15.4,59.11,0.1131,0.0888,15.86,-0.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,15.93,57.2,0.1148,0.0918,15.86,-0.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,16.45,55.41,0.1165,0.0947,15.86,0.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,16.97,53.73,0.1181,0.0977,15.86,0.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,17.5,52.15,0.1197,0.1007,15.86,1.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,18.02,50.66,0.1213,0.1036,15.86,1.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,18.54,49.26,0.1229,0.1066,15.86,2.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,19.07,47.92,0.1244,0.1095,15.86,2.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,19.59,46.66,0.126,0.1125,15.86,3.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,20.12,45.47,0.1274,0.1155,15.86,3.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,20.64,44.33,0.1289,0.1184,15.86,4.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,21.16,43.25,0.1304,0.1214,15.86,4.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,21.69,42.22,0.1318,0.1244,15.86,5.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,22.22,41.24,0.1332,0.1273,15.86,5.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,22.74,40.3,0.1346,0.1303,15.86,6.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,23.27,39.4,0.136,0.1332,15.86,6.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,23.79,38.55,0.1374,0.1362,15.86,7.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,24.32,37.73,0.1387,0.1392,15.86,7.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,24.84,36.94,0.14,0.1421,15.86,8.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,25.37,36.19,0.1414,0.1451,15.86,8.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,25.9,35.46,0.1427,0.148,15.86,9.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,26.42,34.77,0.144,0.151,15.86,9.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,26.95,34.1,0.1452,0.154,15.86,10.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,27.48,33.46,0.1465,0.1569,15.86,10.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,28.01,32.84,0.1477,0.1599,15.86,11.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,28.53,32.24,0.149,0.1628,15.86,11.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,29.06,31.66,0.1502,0.1658,15.86,12.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,29.59,31.11,0.1514,0.1688,15.86,12.64,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0149,0.0,0.6184,30.12,30.57,0.1526,0.1717,15.86,13.14,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0305,0.0,0.6226,30.65,30.05,0.1538,0.1747,15.86,13.64,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.046,0.0,0.6267,31.17,29.55,0.155,0.1776,15.86,14.14,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0616,0.0,0.6308,31.7,29.07,0.1561,0.1806,15.86,14.64,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0772,0.0,0.6347,32.23,28.6,0.1573,0.1836,15.86,15.14,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0928,0.0,0.6386,32.76,28.15,0.1584,0.1865,15.86,15.64,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1084,0.0,0.6424,33.29,27.71,0.1596,0.1895,15.86,16.14,[6,7]],[3.1,"low",0.0,0.0,0.0,0.0,0.124,0.0,0.6461,33.82,27.28,0.1607,0.1925,15.86,16.64,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1395,0.0,0.6497,34.35,26.87,0.1618,0.1954,15.86,17.14,[6,7]],[3.9,"low",0.0,0.0,0.0,0.0,0.1551,0.0,0.6533,34.88,26.47,0.1629,0.1984,15.86,17.64,[6,7]],[4.3,"low",0.0,0.0,0.0,0.0,0.1707,0.0,0.6568,35.41,26.08,0.164,0.2013,15.86,18.14,[6,7]],[4.7,"low",0.0,0.0,0.0,0.0,0.1863,0.0,0.6602,35.94,25.7,0.1651,0.2043,15.86,18.64,[6,7]],[5.0,"low",0.0,0.0,0.0,0.0,0.2019,0.0,0.6636,36.46,25.33,0.1662,0.2073,15.86,19.14,[6,7]],[5.5,"low",0.0016,0.0018,0.0,0.0016,0.2175,0.0007,0.6669,36.99,24.97,0.1673,0.2102,15.86,19.64,[6]],[7.2,"low",0.0233,0.0267,0.0,0.0233,0.233,0.0098,0.6701,37.52,24.63,0.1683,0.2132,15.86,20.14,[6]],[8.8,"low",0.0447,0.0511,0.0,0.0447,0.2486,0.0183,0.6733,38.05,24.29,0.1694,0.2161,15.86,20.64,[6]],[10.4,"low",0.0658,0.0751,0.0,0.0658,0.2642,0.0263,0.6764,38.58,23.96,0.1705,0.2191,15.86,21.14,[6]],[12.0,"low",0.0866,0.0986,0.0,0.0866,0.2798,0.0338,0.6795,39.12,23.64,0.1715,0.2221,15.86,21.64,[6]],[13.5,"low",0.1072,0.1217,0.0,0.1072,0.2954,0.0407,0.6825,39.65,23.33,0.1725,0.225,15.86,22.14,[6]],[15.0,"low",0.1275,0.1444,0.0,0.1275,0.311,0.0471,0.6855,40.18,23.03,0.1736,0.228,15.86,22.64,[6]],[16.5,"low",0.1475,0.1667,0.0,0.1475,0.3265,0.053,0.6884,40.71,22.73,0.1746,0.2309,15.86,23.14,[6]],[18.0,"low",0.1673,0.1886,0.0,0.1673,0.3421,0.0585,0.6912,41.24,22.45,0.1756,0.2339,15.86,23.64,[6]],[19.5,"low",0.1868,0.2101,0.0,0.1868,0.3577,0.0635,0.694,41.77,22.16,0.1766,0.2369,15.86,24.14,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,13.58,54.56,0.1173,0.0962,15.42,-0.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,14.04,52.8,0.1191,0.0994,15.42,0.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,14.5,51.15,0.1208,0.1026,15.42,0.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,14.96,49.6,0.1225,0.1058,15.42,1.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,15.43,48.14,0.1242,0.1091,15.42,1.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,15.89,46.77,0.1258,0.1123,15.42,2.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,16.35,45.47,0.1274,0.1155,15.42,2.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,16.81,44.24,0.129,0.1187,15.42,3.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,17.27,43.07,0.1306,0.1219,15.42,3.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,17.74,41.97,0.1322,0.1251,15.42,4.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,18.2,40.92,0.1337,0.1283,15.42,4.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,18.66,39.92,0.1352,0.1315,15.42,5.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,19.12,38.97,0.1367,0.1347,15.42,5.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,19.59,38.06,0.1382,0.1379,15.42,6.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,20.05,37.2,0.1396,0.1411,15.42,6.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,20.51,36.37,0.141,0.1443,15.42,7.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,20.98,35.58,0.1424,0.1475,15.42,7.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,21.44,34.83,0.1438,0.1508,15.42,8.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,21.91,34.1,0.1452,0.154,15.42,8.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,22.37,33.4,0.1466,0.1572,15.42,9.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,22.83,32.74,0.1479,0.1604,15.42,9.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,23.3,32.09,0.1493,0.1636,15.42,10.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,23.76,31.48,0.1506,0.1668,15.42,10.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,24.23,30.88,0.1519,0.17,15.42,11.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,24.69,30.31,0.1532,0.1732,15.42,11.58,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0132,0.0,0.625,25.16,29.76,0.1545,0.1764,15.42,12.08,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.03,0.0,0.6294,25.62,29.23,0.1558,0.1796,15.42,12.58,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0469,0.0,0.6337,26.09,28.72,0.157,0.1828,15.42,13.08,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0638,0.0,0.638,26.55,28.22,0.1583,0.186,15.42,13.58,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0807,0.0,0.6421,27.02,27.74,0.1595,0.1892,15.42,14.08,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0976,0.0,0.6461,27.49,27.28,0.1607,0.1925,15.42,14.58,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1144,0.0,0.65,27.95,26.83,0.1619,0.1957,15.42,15.08,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1313,0.0,0.6539,28.42,26.4,0.1631,0.1989,15.42,15.58,[6,7]],[3.7,"low",0.0,0.0,0.0,0.0,0.1482,0.0,0.6577,28.88,25.98,0.1643,0.2021,15.42,16.08,[6,7]],[4.1,"low",0.0,0.0,0.0,0.0,0.1651,0.0,0.6614,29.35,25.57,0.1655,0.2053,15.42,16.58,[6,7]],[4.5,"low",0.0,0.0,0.0,0.0,0.182,0.0,0.665,29.82,25.18,0.1667,0.2085,15.42,17.08,[6,7]],[5.7,"low",0.0125,0.0143,0.0,0.0125,0.1989,0.006,0.6685,30.28,24.8,0.1678,0.2117,15.42,17.58,[6]],[7.5,"low",0.0358,0.041,0.0,0.0358,0.2157,0.017,0.672,30.75,24.43,0.169,0.2149,15.42,18.08,[6]],[9.2,"low",0.0588,0.0672,0.0,0.0588,0.2326,0.0272,0.6754,31.22,24.07,0.1701,0.2181,15.42,18.58,[6]],[11.0,"low",0.0815,0.0928,0.0,0.0815,0.2495,0.0369,0.6787,31.68,23.72,0.1712,0.2213,15.42,19.08,[6]],[12.7,"low",0.1038,0.1179,0.0,0.1038,0.2664,0.0459,0.682,32.15,23.38,0.1724,0.2245,15.42,19.58,[6]],[14.3,"low",0.1258,0.1425,0.0,0.1258,0.2833,0.0543,0.6852,32.62,23.05,0.1735,0.2277,15.42,20.08,[6]],[16.0,"low",0.1475,0.1667,0.0,0.1475,0.3001,0.0621,0.6884,33.09,22.73,0.1746,0.2309,15.42,20.58,[6]],[17.6,"low",0.1689,0.1904,0.0,0.1689,0.317,0.0693,0.6914,33.55,22.42,0.1757,0.2341,15.42,21.08,[6]],[19.2,"low",0.19,0.2136,0.0,0.19,0.3339,0.076,0.6945,34.02,22.12,0.1768,0.2374,15.42,21.58,[6]],[20.8,"low",0.2109,0.2364,0.0,0.2109,0.3508,0.0822,0.6974,34.49,21.82,0.1778,0.2406,15.42,22.08,[6]],[22.3,"low",0.2314,0.2588,0.0,0.2314,0.3677,0.0879,0.7003,34.96,21.54,0.1789,0.2438,15.42,22.58,[6]],[23.9,"low",0.2517,0.2808,0.0,0.2517,0.3846,0.093,0.7032,35.42,21.26,0.18,0.247,15.42,23.08,[6]],[25.4,"low",0.2717,0.3024,0.0,0.2717,0.4014,0.0977,0.706,35.89,20.98,0.181,0.2502,15.42,23.58,[6]],[26.9,"low",0.2915,0.3235,0.0,0.2915,0.4183,0.102,0.7088,36.36,20.72,0.1821,0.2534,15.42,24.08,[6]],[28.3,"low",0.311,0.3443,0.0,0.311,0.4352,0.1058,0.7115,36.83,20.46,0.1831,0.2566,15.42,24.58,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,12.09,50.66,0.1213,0.1036,15.02,-0.02,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,12.5,49.03,0.1232,0.1071,15.02,0.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,12.91,47.5,0.1249,0.1105,15.02,0.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,13.32,46.06,0.1267,0.114,15.02,1.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,13.73,44.7,0.1284,0.1174,15.02,1.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,14.14,43.43,0.1301,0.1209,15.02,2.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,14.55,42.22,0.1318,0.1244,15.02,2.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,14.96,41.08,0.1335,0.1278,15.02,3.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,15.37,40.0,0.1351,0.1313,15.02,3.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,15.78,38.97,0.1367,0.1347,15.02,4.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,16.2,38.0,0.1383,0.1382,15.02,4.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,16.61,37.07,0.1398,0.1416,15.02,5.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,17.02,36.19,0.1414,0.1451,15.02,5.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,17.43,35.35,0.1429,0.1485,15.02,6.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,17.84,34.54,0.1444,0.152,15.02,6.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,18.26,33.77,0.1459,0.1554,15.02,7.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,18.67,33.04,0.1473,0.1589,15.02,7.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,19.08,32.34,0.1488,0.1623,15.02,8.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,19.5,31.66,0.1502,0.1658,15.02,8.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,19.91,31.02,0.1516,0.1693,15.02,9.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,20.32,30.4,0.153,0.1727,15.02,9.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,20.73,29.8,0.1544,0.1762,15.02,10.48,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0043,0.0,0.6294,21.15,29.23,0.1558,0.1796,15.02,10.98,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0225,0.0,0.6341,21.56,28.68,0.1571,0.1831,15.02,11.48,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0407,0.0,0.6386,21.98,28.15,0.1584,0.1865,15.02,11.98,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0589,0.0,0.643,22.39,27.63,0.1598,0.19,15.02,12.48,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0771,0.0,0.6473,22.8,27.14,0.1611,0.1934,15.02,12.98,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0952,0.0,0.6515,23.22,26.66,0.1624,0.1969,15.02,13.48,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1134,0.0,0.6556,23.63,26.2,0.1637,0.2003,15.02,13.98,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1316,0.0,0.6597,24.05,25.76,0.1649,0.2038,15.02,14.48,[6,7]],[3.7,"low",0.0,0.0,0.0,0.0,0.1498,0.0,0.6636,24.46,25.33,0.1662,0.2073,15.02,14.98,[6,7]],[4.5,"low",0.0052,0.006,0.0,0.0052,0.168,0.0028,0.6674,24.88,24.92,0.1675,0.2107,15.02,15.48,[6]],[6.4,"low",0.0305,0.0349,0.0,0.0305,0.1861,0.0161,0.6712,25.29,24.51,0.1687,0.2142,15.02,15.98,[6]],[8.4,"low",0.0553,0.0632,0.0,0.0553,0.2043,0.0286,0.6749,25.71,24.12,0.1699,0.2176,15.02,16.48,[6]],[10.2,"low",0.0797,0.0908,0.0,0.0797,0.2225,0.0404,0.6785,26.12,23.75,0.1712,0.2211,15.02,16.98,[6]],[12.1,"low",0.1038,0.1179,0.0,0.1038,0.2407,0.0514,0.682,26.54,23.38,0.1724,0.2245,15.02,17.48,[6]],[13.9,"low",0.1275,0.1444,0.0,0.1275,0.2589,0.0618,0.6855,26.95,23.03,0.1736,0.228,15.02,17.98,[6]],[15.7,"low",0.1508,0.1704,0.0,0.1508,0.2771,0.0715,0.6888,27.37,22.68,0.1747,0.2314,15.02,18.48,[6]],[17.4,"low",0.1738,0.1958,0.0,0.1738,0.2952,0.0805,0.6921,27.78,22.35,0.1759,0.2349,15.02,18.98,[6]],[19.2,"low",0.1965,0.2207,0.0,0.1965,0.3134,0.0889,0.6954,28.2,22.03,0.1771,0.2383,15.02,19.48,[6]],[20.9,"low",0.2188,0.2451,0.0,0.2188,0.3316,0.0967,0.6986,28.61,21.71,0.1783,0.2418,15.02,19.98,[6]],[22.5,"low",0.2408,0.269,0.0,0.2408,0.3498,0.1039,0.7017,29.03,21.41,0.1794,0.2453,15.02,20.48,[6]],[24.2,"low",0.2625,0.2925,0.0,0.2625,0.368,0.1105,0.7047,29.44,21.11,0.1806,0.2487,15.02,20.98,[6]],[25.8,"low",0.2839,0.3154,0.0,0.2839,0.3861,0.1165,0.7077,29.86,20.82,0.1817,0.2522,15.02,21.48,[6]],[27.4,"low",0.305,0.338,0.0,0.305,0.4043,0.1221,0.7106,30.28,20.54,0.1828,0.2556,15.02,21.98,[6]],[29.0,"low",0.3259,0.3601,0.0,0.3259,0.4225,0.127,0.7135,30.69,20.27,0.1839,0.2591,15.02,22.48,[6]],[30.5,"low",0.3464,0.3817,0.0,0.3464,0.4407,0.1315,0.7163,31.11,20.0,0.185,0.2625,15.02,22.98,[6]],[32.1,"low",0.3667,0.403,0.0,0.3667,0.4589,0.1355,0.7191,31.53,19.74,0.1861,0.266,15.02,23.48,[6]],[33.6,"low",0.3867,0.4239,0.0,0.3867,0.477,0.1391,0.7218,31.94,19.49,0.1872,0.2694,15.02,23.98,[6]],[35.1,"medium",0.4065,0.4443,0.0,0.4065,0.4952,0.1422,0.7245,32.36,19.24,0.1883,0.2729,15.02,24.48,[]],[36.5,"medium",0.426,0.4644,0.0,0.426,0.5134,0.1449,0.7271,32.78,19.0,0.1894,0.2763,15.02,24.98,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,12.01,50.45,0.1216,0.1041,15.0,-0.0,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,12.41,48.82,0.1234,0.1075,15.0,0.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,12.82,47.29,0.1252,0.111,15.0,1.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,13.23,45.86,0.1269,0.1145,15.0,1.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,13.64,44.51,0.1287,0.1179,15.0,2.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,14.04,43.24,0.1304,0.1214,15.0,2.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,14.45,42.04,0.1321,0.1249,15.0,3.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,14.86,40.9,0.1337,0.1284,15.0,3.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,15.27,39.83,0.1353,0.1318,15.0,4.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,15.68,38.8,0.1369,0.1353,15.0,4.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,16.09,37.83,0.1385,0.1388,15.0,5.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,16.5,36.91,0.1401,0.1422,15.0,5.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,16.91,36.03,0.1416,0.1457,15.0,6.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,17.31,35.2,0.1432,0.1492,15.0,6.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,17.72,34.4,0.1447,0.1526,15.0,7.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,18.13,33.63,0.1461,0.1561,15.0,7.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,18.54,32.9,0.1476,0.1596,15.0,8.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,18.95,32.2,0.1491,0.163,15.0,8.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,19.36,31.53,0.1505,0.1665,15.0,9.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,19.77,30.89,0.1519,0.17,15.0,9.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,20.19,30.27,0.1533,0.1735,15.0,10.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,20.6,29.67,0.1547,0.1769,15.0,10.5,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0069,0.0,0.6305,21.01,29.1,0.1561,0.1804,15.0,11.0,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0251,0.0,0.6351,21.42,28.55,0.1574,0.1839,15.0,11.5,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0434,0.0,0.6396,21.83,28.03,0.1588,0.1873,15.0,12.0,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0617,0.0,0.644,22.24,27.52,0.1601,0.1908,15.0,12.5,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0799,0.0,0.6483,22.65,27.02,0.1614,0.1943,15.0,13.0,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.0982,0.0,0.6525,23.06,26.55,0.1627,0.1977,15.0,13.5,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1164,0.0,0.6567,23.47,26.09,0.164,0.2012,15.0,14.0,[6,7]],[3.4,"low",0.0,0.0,0.0,0.0,0.1347,0.0,0.6607,23.89,25.65,0.1653,0.2047,15.0,14.5,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1529,0.0,0.6646,24.3,25.22,0.1665,0.2081,15.0,15.0,[6,7]],[5.0,"low",0.0119,0.0136,0.0,0.0119,0.1712,0.0064,0.6684,24.71,24.81,0.1678,0.2116,15.0,15.5,[6]],[6.9,"low",0.0371,0.0425,0.0,0.0371,0.1895,0.0196,0.6722,25.12,24.41,0.169,0.2151,15.0,16.0,[6]],[8.8,"low",0.0619,0.0707,0.0,0.0619,0.2077,0.032,0.6759,25.53,24.02,0.1703,0.2185,15.0,16.5,[6]],[10.7,"low",0.0864,0.0983,0.0,0.0864,0.226,0.0437,0.6795,25.95,23.65,0.1715,0.222,15.0,17.0,[6]],[12.5,"low",0.1104,0.1254,0.0,0.1104,0.2442,0.0547,0.683,26.36,23.28,0.1727,0.2255,15.0,17.5,[6]],[14.4,"low",0.1341,0.1518,0.0,0.1341,0.2625,0.065,0.6864,26.77,22.93,0.1739,0.229,15.0,18.0,[6]],[16.1,"low",0.1575,0.1777,0.0,0.1575,0.2808,0.0746,0.6898,27.18,22.59,0.1751,0.2324,15.0,18.5,[6]],[17.9,"low",0.1805,0.2031,0.0,0.1805,0.299,0.0836,0.6931,27.6,22.26,0.1763,0.2359,15.0,19.0,[6]],[19.6,"low",0.2031,0.228,0.0,0.2031,0.3173,0.0919,0.6963,28.01,21.93,0.1774,0.2394,15.0,19.5,[6]],[21.3,"low",0.2254,0.2523,0.0,0.2254,0.3355,0.0996,0.6995,28.42,21.62,0.1786,0.2428,15.0,20.0,[6]],[23.0,"low",0.2475,0.2762,0.0,0.2475,0.3538,0.1068,0.7026,28.83,21.32,0.1798,0.2463,15.0,20.5,[6]],[24.7,"low",0.2692,0.2996,0.0,0.2692,0.372,0.1133,0.7057,29.25,21.02,0.1809,0.2498,15.0,21.0,[6]],[26.3,"low",0.2906,0.3225,0.0,0.2906,0.3903,0.1193,0.7086,29.66,20.73,0.182,0.2532,15.0,21.5,[6]],[27.9,"low",0.3117,0.345,0.0,0.3117,0.4086,0.1247,0.7116,30.07,20.45,0.1832,0.2567,15.0,22.0,[6]],[29.5,"low",0.3325,0.3671,0.0,0.3325,0.4268,0.1296,0.7144,30.49,20.18,0.1843,0.2602,15.0,22.5,[6]],[31.0,"low",0.3531,0.3887,0.0,0.3531,0.4451,0.134,0.7173,30.9,19.91,0.1854,0.2636,15.0,23.0,[6]],[32.5,"low",0.3734,0.4099,0.0,0.3734,0.4633,0.138,0.72,31.31,19.65,0.1865,0.2671,15.0,23.5,[6]],[34.1,"low",0.3934,0.4307,0.0,0.3934,0.4816,0.1415,0.7227,31.73,19.4,0.1876,0.2706,15.0,24.0,[6]],[35.5,"medium",0.4132,0.4512,0.0,0.4132,0.4998,0.1445,0.7254,32.14,19.16,0.1887,0.2741,15.0,24.5,[]],[37.0,"medium",0.4327,0.4712,0.0,0.4327,0.5181,0.1471,0.728,32.56,18.92,0.1898,0.2775,15.0,25.0,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,10.84,47.29,0.1252,0.111,14.67,0.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,11.21,45.76,0.1271,0.1147,14.67,0.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,11.58,44.33,0.1289,0.1184,14.67,1.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,11.95,42.99,0.1307,0.1221,14.67,1.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,12.32,41.72,0.1325,0.1258,14.67,2.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,12.68,40.53,0.1343,0.1295,14.67,2.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,13.05,39.4,0.136,0.1332,14.67,3.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,13.42,38.34,0.1377,0.1369,14.67,3.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,13.79,37.33,0.1394,0.1406,14.67,4.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,14.16,36.37,0.141,0.1443,14.67,4.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,14.53,35.46,0.1427,0.148,14.67,5.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,14.9,34.6,0.1443,0.1517,14.67,5.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,15.27,33.77,0.1459,0.1554,14.67,6.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,15.64,32.99,0.1474,0.1591,14.67,6.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,16.01,32.24,0.149,0.1628,14.67,7.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,16.38,31.52,0.1505,0.1665,14.67,7.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,16.75,30.84,0.152,0.1702,14.67,8.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,17.12,30.18,0.1535,0.1739,14.67,8.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,17.49,29.55,0.155,0.1776,14.67,9.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,17.86,28.95,0.1564,0.1813,14.67,9.83,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0079,0.0,0.6367,18.23,28.37,0.1579,0.185,14.67,10.33,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0273,0.0,0.6414,18.6,27.81,0.1593,0.1887,14.67,10.83,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0468,0.0,0.6461,18.97,27.28,0.1607,0.1925,14.67,11.33,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0663,0.0,0.6506,19.34,26.77,0.1621,0.1962,14.67,11.83,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0858,0.0,0.6551,19.72,26.27,0.1635,0.1999,14.67,12.33,[6,7]],[2.6,"low",0.0,0.0,0.0,0.0,0.1053,0.0,0.6594,20.09,25.79,0.1649,0.2036,14.67,12.83,[6,7]],[3.1,"low",0.0,0.0,0.0,0.0,0.1247,0.0,0.6636,20.46,25.33,0.1662,0.2073,14.67,13.33,[6,7]],[4.0,"low",0.007,0.0081,0.0,0.007,0.1442,0.0041,0.6677,20.83,24.89,0.1675,0.211,14.67,13.83,[6]],[6.1,"low",0.034,0.039,0.0,0.034,0.1637,0.0194,0.6717,21.2,24.46,0.1689,0.2147,14.67,14.33,[6]],[8.2,"low",0.0606,0.0691,0.0,0.0606,0.1832,0.0339,0.6757,21.57,24.04,0.1702,0.2184,14.67,14.83,[6]],[10.2,"low",0.0866,0.0986,0.0,0.0866,0.2026,0.0476,0.6795,21.95,23.64,0.1715,0.2221,14.67,15.33,[6]],[12.2,"low",0.1123,0.1274,0.0,0.1123,0.2221,0.0605,0.6832,22.32,23.25,0.1728,0.2258,14.67,15.83,[6]],[14.1,"low",0.1375,0.1556,0.0,0.1375,0.2416,0.0726,0.6869,22.69,22.88,0.1741,0.2295,14.67,16.33,[6]],[16.0,"low",0.1624,0.1832,0.0,0.1624,0.2611,0.0839,0.6905,23.06,22.52,0.1753,0.2332,14.67,16.83,[6]],[17.9,"low",0.1868,0.2101,0.0,0.1868,0.2806,0.0946,0.694,23.43,22.16,0.1766,0.2369,14.67,17.33,[6]],[19.7,"low",0.2109,0.2364,0.0,0.2109,0.3,0.1045,0.6974,23.81,21.82,0.1778,0.2406,14.67,17.83,[6]],[21.5,"low",0.2346,0.2622,0.0,0.2346,0.3195,0.1137,0.7008,24.18,21.49,0.1791,0.2443,14.67,18.33,[6]],[23.3,"low",0.2579,0.2875,0.0,0.2579,0.339,0.1222,0.7041,24.55,21.17,0.1803,0.248,14.67,18.83,[6]],[25.1,"low",0.2809,0.3122,0.0,0.2809,0.3585,0.1301,0.7073,24.92,20.86,0.1815,0.2517,14.67,19.33,[6]],[26.8,"low",0.3035,0.3364,0.0,0.3035,0.378,0.1374,0.7104,25.3,20.56,0.1827,0.2554,14.67,19.83,[6]],[28.5,"low",0.3259,0.3601,0.0,0.3259,0.3974,0.144,0.7135,25.67,20.27,0.1839,0.2591,14.67,20.33,[6]],[30.2,"low",0.3479,0.3833,0.0,0.3479,0.4169,0.1501,0.7165,26.04,19.98,0.1851,0.2628,14.67,20.83,[6]],[31.9,"low",0.3696,0.406,0.0,0.3696,0.4364,0.1556,0.7195,26.42,19.7,0.1863,0.2665,14.67,21.33,[6]],[33.5,"low",0.391,0.4283,0.0,0.391,0.4559,0.1605,0.7224,26.79,19.43,0.1875,0.2702,14.67,21.83,[6]],[35.1,"medium",0.4121,0.4501,0.0,0.4121,0.4754,0.1649,0.7252,27.16,19.17,0.1886,0.2739,14.67,22.33,[]],[36.7,"medium",0.4329,0.4715,0.0,0.4329,0.4948,0.1688,0.728,27.54,18.91,0.1898,0.2776,14.67,22.83,[]],[38.2,"medium",0.4535,0.4925,0.0,0.4535,0.5143,0.1722,0.7308,27.91,18.67,0.1909,0.2813,14.67,23.33,[]],[39.8,"medium",0.4738,0.5131,0.0,0.4738,0.5338,0.1751,0.7334,28.28,18.42,0.1921,0.285,14.67,23.83,[]],[41.3,"medium",0.4938,0.5333,0.0,0.4938,0.5533,0.1776,0.7361,28.66,18.19,0.1932,0.2887,14.67,24.33,[]],[42.8,"medium",0.5136,0.5531,0.0,0.5136,0.5727,0.1796,0.7386,29.03,17.96,0.1943,0.2924,14.67,24.83,[]],[44.3,"medium",0.5331,0.5725,0.0,0.5331,0.5922,0.1813,0.7412,29.4,17.73,0.1954,0.2961,14.67,25.33,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,9.8,44.33,0.1289,0.1184,14.34,0.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,10.13,42.9,0.1309,0.1224,14.34,1.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,10.46,41.56,0.1328,0.1263,14.34,1.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,10.79,40.3,0.1346,0.1303,14.34,2.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,11.13,39.11,0.1365,0.1342,14.34,2.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,11.46,38.0,0.1383,0.1382,14.34,3.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,11.79,36.94,0.14,0.1421,14.34,3.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,12.13,35.94,0.1418,0.1461,14.34,4.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,12.46,35.0,0.1435,0.15,14.34,4.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,12.79,34.1,0.1452,0.154,14.34,5.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,13.13,33.25,0.1469,0.1579,14.34,5.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,13.46,32.44,0.1486,0.1619,14.34,6.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,13.8,31.66,0.1502,0.1658,14.34,6.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,14.13,30.93,0.1518,0.1698,14.34,7.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,14.46,30.22,0.1534,0.1737,14.34,7.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,14.8,29.55,0.155,0.1776,14.34,8.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,15.13,28.91,0.1565,0.1816,14.34,8.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,15.47,28.3,0.1581,0.1855,14.34,9.16,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0068,0.0,0.6424,15.8,27.71,0.1596,0.1895,14.34,9.66,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0275,0.0,0.6473,16.14,27.14,0.1611,0.1934,14.34,10.16,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0483,0.0,0.6521,16.47,26.6,0.1626,0.1974,14.34,10.66,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0691,0.0,0.6568,16.81,26.08,0.164,0.2013,14.34,11.16,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0899,0.0,0.6614,17.14,25.57,0.1655,0.2053,14.34,11.66,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1106,0.0,0.6658,17.48,25.09,0.1669,0.2092,14.34,12.16,[6,7]],[4.7,"low",0.0233,0.0267,0.0,0.0233,0.1314,0.0143,0.6701,17.81,24.63,0.1683,0.2132,14.34,12.66,[6]],[6.9,"low",0.0518,0.0592,0.0,0.0518,0.1522,0.0311,0.6744,18.15,24.18,0.1698,0.2171,14.34,13.16,[6]],[9.1,"low",0.0797,0.0908,0.0,0.0797,0.173,0.0471,0.6785,18.48,23.75,0.1712,0.2211,14.34,13.66,[6]],[11.2,"low",0.1072,0.1217,0.0,0.1072,0.1938,0.0623,0.6825,18.82,23.33,0.1725,0.225,14.34,14.16,[6]],[13.3,"low",0.1342,0.1519,0.0,0.1342,0.2145,0.0765,0.6864,19.16,22.93,0.1739,0.229,14.34,14.66,[6]],[15.3,"low",0.1607,0.1813,0.0,0.1607,0.2353,0.09,0.6903,19.49,22.54,0.1753,0.2329,14.34,15.16,[6]],[17.4,"low",0.1868,0.2101,0.0,0.1868,0.2561,0.1026,0.694,19.83,22.16,0.1766,0.2369,14.34,15.66,[6]],[19.3,"low",0.2125,0.2382,0.0,0.2125,0.2769,0.1144,0.6977,20.16,21.8,0.1779,0.2408,14.34,16.16,[6]],[21.3,"low",0.2377,0.2656,0.0,0.2377,0.2976,0.1254,0.7012,20.5,21.45,0.1792,0.2448,14.34,16.66,[6]],[23.2,"low",0.2625,0.2925,0.0,0.2625,0.3184,0.1357,0.7047,20.84,21.11,0.1806,0.2487,14.34,17.16,[6]],[25.1,"low",0.287,0.3187,0.0,0.287,0.3392,0.1453,0.7081,21.17,20.78,0.1818,0.2527,14.34,17.66,[6]],[26.9,"low",0.311,0.3443,0.0,0.311,0.36,0.1541,0.7115,21.51,20.46,0.1831,0.2566,14.34,18.16,[6]],[28.7,"low",0.3347,0.3694,0.0,0.3347,0.3807,0.1623,0.7147,21.85,20.15,0.1844,0.2605,14.34,18.66,[6]],[30.5,"low",0.3581,0.3939,0.0,0.3581,0.4015,0.1697,0.7179,22.18,19.85,0.1857,0.2645,14.34,19.16,[6]],[32.3,"low",0.381,0.4179,0.0,0.381,0.4223,0.1765,0.7211,22.52,19.56,0.1869,0.2684,14.34,19.66,[6]],[34.0,"low",0.4037,0.4414,0.0,0.4037,0.4431,0.1827,0.7241,22.86,19.27,0.1882,0.2724,14.34,20.16,[6]],[35.7,"medium",0.426,0.4644,0.0,0.426,0.4639,0.1883,0.7271,23.19,19.0,0.1894,0.2763,14.34,20.66,[]],[37.4,"medium",0.448,0.487,0.0,0.448,0.4846,0.1933,0.73,23.53,18.73,0.1906,0.2803,14.34,21.16,[]],[39.1,"medium",0.4698,0.509,0.0,0.4698,0.5054,0.1977,0.7329,23.87,18.47,0.1918,0.2842,14.34,21.66,[]],[40.7,"medium",0.4912,0.5306,0.0,0.4912,0.5262,0.2016,0.7357,24.2,18.22,0.193,0.2882,14.34,22.16,[]],[42.3,"medium",0.5123,0.5518,0.0,0.5123,0.547,0.205,0.7385,24.54,17.97,0.1942,0.2921,14.34,22.66,[]],[43.9,"medium",0.5331,0.5725,0.0,0.5331,0.5677,0.2078,0.7412,24.88,17.73,0.1954,0.2961,14.34,23.16,[]],[45.8,"medium",0.5537,0.5929,0.0206,0.5537,0.5885,0.2102,0.7438,25.22,17.5,0.1966,0.3,14.34,23.66,[]],[48.0,"medium",0.574,0.6128,0.0651,0.574,0.6093,0.2121,0.7464,25.55,17.27,0.1978,0.304,14.34,24.16,[]],[50.2,"medium",0.594,0.6324,0.109,0.594,0.6301,0.2136,0.749,25.89,17.05,0.1989,0.3079,14.34,24.66,[]],[52.3,"medium",0.6137,0.6515,0.1524,0.6137,0.6509,0.2147,0.7515,26.23,16.83,0.2001,0.3119,14.34,25.16,[]],[54.5,"medium",0.6333,0.6703,0.1953,0.6333,0.6716,0.2154,0.7539,26.57,16.62,0.2012,0.3158,14.34,25.66,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,8.91,41.72,0.1325,0.1258,14.04,0.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,9.21,40.38,0.1345,0.13,14.04,1.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,9.51,39.11,0.1365,0.1342,14.04,1.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,9.81,37.93,0.1384,0.1384,14.04,2.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,10.12,36.81,0.1403,0.1426,14.04,2.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,10.42,35.76,0.1421,0.1468,14.04,3.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,10.72,34.77,0.144,0.151,14.04,3.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,11.02,33.83,0.1458,0.1552,14.04,4.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,11.33,32.94,0.1475,0.1594,14.04,4.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,11.63,32.09,0.1493,0.1636,14.04,5.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,11.93,31.29,0.151,0.1678,14.04,5.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,12.24,30.53,0.1527,0.172,14.04,6.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,12.54,29.8,0.1544,0.1762,14.04,6.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,12.84,29.11,0.156,0.1804,14.04,7.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,13.15,28.45,0.1577,0.1846,14.04,7.96,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,13.45,27.81,0.1593,0.1887,14.04,8.46,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.001,0.0,0.6467,13.76,27.21,0.1609,0.1929,14.04,8.96,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0231,0.0,0.6518,14.06,26.63,0.1625,0.1971,14.04,9.46,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0451,0.0,0.6568,14.36,26.08,0.164,0.2013,14.04,9.96,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0672,0.0,0.6616,14.67,25.54,0.1656,0.2055,14.04,10.46,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0893,0.0,0.6664,14.97,25.03,0.1671,0.2097,14.04,10.96,[6,7]],[4.5,"low",0.0287,0.0329,0.0,0.0287,0.1114,0.0184,0.6709,15.28,24.54,0.1686,0.2139,14.04,11.46,[6]],[6.9,"low",0.0588,0.0672,0.0,0.0588,0.1334,0.0372,0.6754,15.58,24.07,0.1701,0.2181,14.04,11.96,[6]],[9.2,"low",0.0884,0.1006,0.0,0.0884,0.1555,0.055,0.6798,15.89,23.62,0.1716,0.2223,14.04,12.46,[6]],[11.4,"low",0.1174,0.1331,0.0,0.1174,0.1776,0.0718,0.684,16.19,23.18,0.173,0.2265,14.04,12.96,[6]],[13.6,"low",0.1459,0.1649,0.0,0.1459,0.1997,0.0877,0.6881,16.5,22.76,0.1745,0.2307,14.04,13.46,[6]],[15.8,"low",0.1738,0.1958,0.0,0.1738,0.2217,0.1028,0.6921,16.8,22.35,0.1759,0.2349,14.04,13.96,[6]],[17.9,"low",0.2013,0.226,0.0,0.2013,0.2438,0.1169,0.6961,17.11,21.96,0.1773,0.2391,14.04,14.46,[6]],[20.0,"low",0.2283,0.2554,0.0,0.2283,0.2659,0.1302,0.6999,17.41,21.58,0.1788,0.2433,14.04,14.96,[6]],[22.1,"low",0.2548,0.2841,0.0,0.2548,0.288,0.1426,0.7036,17.72,21.21,0.1801,0.2475,14.04,15.46,[6]],[24.1,"low",0.2809,0.3122,0.0,0.2809,0.3101,0.1542,0.7073,18.02,20.86,0.1815,0.2517,14.04,15.96,[6]],[26.1,"low",0.3065,0.3396,0.0,0.3065,0.3321,0.165,0.7109,18.33,20.52,0.1829,0.2559,14.04,16.46,[6]],[28.1,"low",0.3318,0.3663,0.0,0.3318,0.3542,0.1751,0.7143,18.63,20.19,0.1842,0.2601,14.04,16.96,[6]],[30.0,"low",0.3566,0.3924,0.0,0.3566,0.3763,0.1844,0.7177,18.94,19.87,0.1856,0.2642,14.04,17.46,[6]],[31.9,"low",0.381,0.4179,0.0,0.381,0.3984,0.1929,0.7211,19.25,19.56,0.1869,0.2684,14.04,17.96,[6]],[33.7,"low",0.4051,0.4429,0.0,0.4051,0.4204,0.2007,0.7243,19.55,19.26,0.1882,0.2726,14.04,18.46,[6]],[35.5,"medium",0.4288,0.4673,0.0,0.4288,0.4425,0.2079,0.7275,19.86,18.96,0.1896,0.2768,14.04,18.96,[]],[37.3,"medium",0.4521,0.4911,0.0,0.4521,0.4646,0.2143,0.7306,20.16,18.68,0.1909,0.281,14.04,19.46,[]],[39.1,"medium",0.4751,0.5145,0.0,0.4751,0.4867,0.2201,0.7336,20.47,18.41,0.1921,0.2852,14.04,19.96,[]],[40.8,"medium",0.4978,0.5373,0.0,0.4978,0.5087,0.2253,0.7366,20.78,18.14,0.1934,0.2894,14.04,20.46,[]],[42.6,"medium",0.5201,0.5596,0.0,0.5201,0.5308,0.2299,0.7395,21.08,17.88,0.1947,0.2936,14.04,20.96,[]],[44.3,"medium",0.5421,0.5815,0.0,0.5421,0.5529,0.2339,0.7423,21.39,17.63,0.1959,0.2978,14.04,21.46,[]],[46.6,"medium",0.5638,0.6029,0.0429,0.5638,0.575,0.2373,0.7451,21.7,17.38,0.1972,0.302,14.04,21.96,[]],[48.9,"medium",0.5852,0.6238,0.0899,0.5852,0.597,0.2402,0.7479,22.0,17.15,0.1984,0.3062,14.04,22.46,[]],[51.2,"medium",0.6064,0.6444,0.1362,0.6064,0.6191,0.2426,0.7505,22.31,16.91,0.1997,0.3104,14.04,22.96,[]],[53.5,"medium",0.6272,0.6645,0.1819,0.6272,0.6412,0.2445,0.7531,22.62,16.69,0.2009,0.3146,14.04,23.46,[]],[55.7,"medium",0.6477,0.6842,0.227,0.6477,0.6633,0.2459,0.7557,22.92,16.47,0.2021,0.3188,14.04,23.96,[]],[58.0,"medium",0.668,0.7035,0.2716,0.668,0.6853,0.2469,0.7582,23.23,16.26,0.2033,0.323,14.04,24.46,[]],[60.2,"medium",0.6881,0.7224,0.3155,0.6881,0.7074,0.2474,0.7607,23.54,16.05,0.2045,0.3272,14.04,24.96,[]],[62.3,"medium",0.7078,0.741,0.3589,0.7078,0.7295,0.2476,0.7631,23.84,15.84,0.2057,0.3314,14.04,25.46,[]],[64.5,"medium",0.7274,0.7592,0.4017,0.7274,0.7516,0.2473,0.7655,24.15,15.65,0.2069,0.3356,14.04,25.96,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,8.14,39.4,0.136,0.1332,13.76,1.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,8.42,38.13,0.138,0.1377,13.76,1.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,8.69,36.94,0.14,0.1421,13.76,2.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,8.97,35.82,0.142,0.1466,13.76,2.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,9.25,34.77,0.144,0.151,13.76,3.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,9.52,33.78,0.1459,0.1554,13.76,3.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,9.8,32.84,0.1477,0.1599,13.76,4.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,10.08,31.95,0.1496,0.1643,13.76,4.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,10.35,31.11,0.1514,0.1688,13.76,5.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,10.63,30.31,0.1532,0.1732,13.76,5.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,10.91,29.55,0.155,0.1776,13.76,6.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,11.18,28.83,0.1567,0.1821,13.76,6.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,11.46,28.15,0.1584,0.1865,13.76,7.24,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,11.74,27.49,0.1601,0.191,13.76,7.74,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,12.02,26.87,0.1618,0.1954,13.76,8.24,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0139,0.0,0.6551,12.3,26.27,0.1635,0.1999,13.76,8.74,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0373,0.0,0.6602,12.57,25.7,0.1651,0.2043,13.76,9.24,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0606,0.0,0.6653,12.85,25.15,0.1667,0.2087,13.76,9.74,[6,7]],[3.5,"low",0.0233,0.0267,0.0,0.0233,0.084,0.0156,0.6701,13.13,24.63,0.1683,0.2132,13.76,10.24,[6]],[6.0,"low",0.0553,0.0632,0.0,0.0553,0.1074,0.0366,0.6749,13.41,24.12,0.1699,0.2176,13.76,10.74,[6]],[8.5,"low",0.0866,0.0986,0.0,0.0866,0.1308,0.0565,0.6795,13.69,23.64,0.1715,0.2221,13.76,11.24,[6]],[10.9,"low",0.1174,0.1331,0.0,0.1174,0.1541,0.0754,0.684,13.96,23.18,0.173,0.2265,13.76,11.74,[6]],[13.2,"low",0.1475,0.1667,0.0,0.1475,0.1775,0.0932,0.6884,14.24,22.73,0.1746,0.2309,13.76,12.24,[6]],[15.5,"low",0.1771,0.1994,0.0,0.1771,0.2009,0.1101,0.6926,14.52,22.3,0.1761,0.2354,13.76,12.74,[6]],[17.8,"low",0.2061,0.2312,0.0,0.2061,0.2243,0.1261,0.6968,14.8,21.89,0.1776,0.2398,13.76,13.24,[6]],[20.0,"low",0.2346,0.2622,0.0,0.2346,0.2476,0.1411,0.7008,15.08,21.49,0.1791,0.2443,13.76,13.74,[6]],[22.2,"low",0.2625,0.2925,0.0,0.2625,0.271,0.1552,0.7047,15.36,21.11,0.1806,0.2487,13.76,14.24,[6]],[24.3,"low",0.29,0.3219,0.0,0.29,0.2944,0.1684,0.7086,15.64,20.74,0.182,0.2531,13.76,14.74,[6]],[26.4,"low",0.317,0.3506,0.0,0.317,0.3178,0.1808,0.7123,15.92,20.38,0.1835,0.2576,13.76,15.24,[6]],[28.5,"low",0.3435,0.3787,0.0,0.3435,0.3411,0.1923,0.7159,16.19,20.04,0.1849,0.262,13.76,15.74,[6]],[30.5,"low",0.3696,0.406,0.0,0.3696,0.3645,0.2029,0.7195,16.47,19.7,0.1863,0.2665,13.76,16.24,[6]],[32.5,"low",0.3952,0.4327,0.0,0.3952,0.3879,0.2128,0.723,16.75,19.38,0.1877,0.2709,13.76,16.74,[6]],[34.5,"low",0.4205,0.4587,0.0,0.4205,0.4113,0.2219,0.7264,17.03,19.07,0.1891,0.2754,13.76,17.24,[6]],[36.4,"medium",0.4453,0.4842,0.0,0.4453,0.4346,0.2302,0.7297,17.31,18.76,0.1905,0.2798,13.76,17.74,[]],[38.3,"medium",0.4698,0.509,0.0,0.4698,0.458,0.2378,0.7329,17.59,18.47,0.1918,0.2842,13.76,18.24,[]],[40.2,"medium",0.4938,0.5333,0.0,0.4938,0.4814,0.2447,0.7361,17.87,18.19,0.1932,0.2887,13.76,18.74,[]],[42.0,"medium",0.5175,0.557,0.0,0.5175,0.5048,0.2509,0.7392,18.15,17.91,0.1945,0.2931,13.76,19.24,[]],[43.8,"medium",0.5408,0.5802,0.0,0.5408,0.5281,0.2564,0.7422,18.43,17.64,0.1959,0.2976,13.76,19.74,[]],[46.2,"medium",0.5638,0.6029,0.0429,0.5638,0.5515,0.2612,0.7451,18.71,17.38,0.1972,0.302,13.76,20.24,[]],[48.7,"medium",0.5865,0.6251,0.0926,0.5865,0.5749,0.2655,0.748,18.99,17.13,0.1985,0.3064,13.76,20.74,[]],[51.2,"medium",0.6088,0.6468,0.1416,0.6088,0.5983,0.2691,0.7508,19.27,16.89,0.1998,0.3109,13.76,21.24,[]],[53.6,"medium",0.6308,0.668,0.1899,0.6308,0.6216,0.2722,0.7536,19.55,16.65,0.2011,0.3153,13.76,21.74,[]],[56.0,"medium",0.6525,0.6888,0.2376,0.6525,0.645,0.2747,0.7563,19.83,16.42,0.2024,0.3198,13.76,22.24,[]],[58.3,"medium",0.674,0.7091,0.2845,0.674,0.6684,0.2766,0.7589,20.11,16.19,0.2036,0.3242,13.76,22.74,[]],[60.6,"medium",0.6951,0.729,0.3309,0.6951,0.6918,0.2781,0.7615,20.39,15.97,0.2049,0.3286,13.76,23.24,[]],[62.9,"medium",0.7159,0.7485,0.3766,0.7159,0.7151,0.2791,0.7641,20.67,15.76,0.2062,0.3331,13.76,23.74,[]],[65.2,"critical",0.7365,0.7676,0.4217,0.7365,0.7385,0.2796,0.7666,20.95,15.55,0.2074,0.3375,13.76,24.24,[]],[67.4,"critical",0.7567,0.7863,0.4662,0.7567,0.7619,0.2797,0.769,21.23,15.35,0.2086,0.342,13.76,24.74,[]],[69.6,"critical",0.7768,0.8047,0.5102,0.7768,0.7853,0.2793,0.7714,21.51,15.16,0.2099,0.3464,13.76,25.24,[]],[71.8,"critical",0.7965,0.8226,0.5535,0.7965,0.8086,0.2786,0.7737,21.79,14.96,0.2111,0.3509,13.76,25.74,[]],[73.9,"critical",0.8161,0.8403,0.5964,0.8161,0.832,0.2775,0.776,22.07,14.78,0.2123,0.3553,13.76,26.24,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,7.48,37.33,0.1394,0.1406,13.5,1.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,7.73,36.13,0.1415,0.1453,13.5,2.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,7.98,35.0,0.1435,0.15,13.5,2.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,8.24,33.94,0.1455,0.1547,13.5,3.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,8.49,32.94,0.1475,0.1594,13.5,3.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,8.75,32.0,0.1495,0.1641,13.5,4.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,9.0,31.11,0.1514,0.1688,13.5,4.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,9.25,30.27,0.1533,0.1735,13.5,5.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,9.51,29.47,0.1552,0.1781,13.5,5.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,9.76,28.72,0.157,0.1828,13.5,6.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,10.02,28.0,0.1588,0.1875,13.5,6.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,10.27,27.31,0.1606,0.1922,13.5,7.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,10.53,26.66,0.1624,0.1969,13.5,7.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,10.78,26.04,0.1641,0.2016,13.5,8.0,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0246,0.0,0.6625,11.04,25.45,0.1658,0.2063,13.5,8.5,[6,7]],[1.7,"low",0.007,0.0081,0.0,0.007,0.0493,0.0049,0.6677,11.29,24.89,0.1675,0.211,13.5,9.0,[6]],[4.3,"low",0.0412,0.0471,0.0,0.0412,0.074,0.0284,0.6728,11.55,24.35,0.1692,0.2156,13.5,9.5,[6]],[7.0,"low",0.0745,0.085,0.0,0.0745,0.0987,0.0507,0.6777,11.8,23.83,0.1709,0.2203,13.5,10.0,[6]],[9.5,"low",0.1072,0.1217,0.0,0.1072,0.1233,0.0719,0.6825,12.06,23.33,0.1725,0.225,13.5,10.5,[6]],[12.0,"low",0.1392,0.1575,0.0,0.1392,0.148,0.0921,0.6872,12.31,22.86,0.1742,0.2297,13.5,11.0,[6]],[14.5,"low",0.1706,0.1922,0.0,0.1706,0.1727,0.1112,0.6917,12.57,22.4,0.1758,0.2344,13.5,11.5,[6]],[16.9,"low",0.2013,0.226,0.0,0.2013,0.1974,0.1292,0.6961,12.83,21.96,0.1773,0.2391,13.5,12.0,[6]],[19.3,"low",0.2314,0.2588,0.0,0.2314,0.222,0.1463,0.7003,13.08,21.54,0.1789,0.2438,13.5,12.5,[6]],[21.6,"low",0.261,0.2908,0.0,0.261,0.2467,0.1623,0.7045,13.34,21.13,0.1805,0.2485,13.5,13.0,[6]],[23.9,"low",0.29,0.3219,0.0,0.29,0.2714,0.1774,0.7086,13.59,20.74,0.182,0.2531,13.5,13.5,[6]],[26.1,"low",0.3185,0.3522,0.0,0.3185,0.2961,0.1916,0.7125,13.85,20.36,0.1835,0.2578,13.5,14.0,[6]],[28.3,"low",0.3464,0.3817,0.0,0.3464,0.3207,0.2048,0.7163,14.11,20.0,0.185,0.2625,13.5,14.5,[6]],[30.4,"low",0.3739,0.4105,0.0,0.3739,0.3454,0.2172,0.7201,14.36,19.65,0.1865,0.2672,13.5,15.0,[6]],[32.5,"low",0.4009,0.4385,0.0,0.4009,0.3701,0.2286,0.7237,14.62,19.31,0.188,0.2719,13.5,15.5,[6]],[34.6,"low",0.4274,0.4659,0.0,0.4274,0.3947,0.2392,0.7273,14.87,18.98,0.1895,0.2766,13.5,16.0,[6]],[36.6,"medium",0.4535,0.4925,0.0,0.4535,0.4194,0.249,0.7308,15.13,18.67,0.1909,0.2813,13.5,16.5,[]],[38.6,"medium",0.4792,0.5185,0.0,0.4792,0.4441,0.258,0.7341,15.39,18.36,0.1924,0.286,13.5,17.0,[]],[40.6,"medium",0.5044,0.5439,0.0,0.5044,0.4688,0.2662,0.7375,15.64,18.06,0.1938,0.2906,13.5,17.5,[]],[42.5,"medium",0.5292,0.5687,0.0,0.5292,0.4934,0.2736,0.7407,15.9,17.78,0.1952,0.2953,13.5,18.0,[]],[44.7,"medium",0.5537,0.5929,0.0206,0.5537,0.5181,0.2803,0.7438,16.16,17.5,0.1966,0.3,13.5,18.5,[]],[47.4,"medium",0.5777,0.6165,0.0734,0.5777,0.5428,0.2863,0.7469,16.41,17.23,0.198,0.3047,13.5,19.0,[]],[50.0,"medium",0.6014,0.6396,0.1254,0.6014,0.5675,0.2915,0.7499,16.67,16.97,0.1994,0.3094,13.5,19.5,[]],[52.6,"medium",0.6248,0.6621,0.1766,0.6248,0.5921,0.2961,0.7528,16.93,16.72,0.2007,0.3141,13.5,20.0,[]],[55.1,"medium",0.6477,0.6842,0.227,0.6477,0.6168,0.3001,0.7557,17.18,16.47,0.2021,0.3188,13.5,20.5,[]],[57.6,"medium",0.6704,0.7057,0.2768,0.6704,0.6415,0.3035,0.7585,17.44,16.23,0.2034,0.3235,13.5,21.0,[]],[60.1,"medium",0.6927,0.7268,0.3258,0.6927,0.6661,0.3062,0.7613,17.7,16.0,0.2048,0.3282,13.5,21.5,[]],[62.5,"medium",0.7147,0.7474,0.3741,0.7147,0.6908,0.3084,0.7639,17.96,15.77,0.2061,0.3328,13.5,22.0,[]],[64.9,"medium",0.7365,0.7676,0.4217,0.7365,0.7155,0.31,0.7666,18.21,15.55,0.2074,0.3375,13.5,22.5,[]],[67.3,"critical",0.7579,0.7874,0.4687,0.7579,0.7402,0.3111,0.7691,18.47,15.34,0.2087,0.3422,13.5,23.0,[]],[69.6,"critical",0.779,0.8067,0.515,0.779,0.7648,0.3117,0.7716,18.73,15.13,0.21,0.3469,13.5,23.5,[]],[71.9,"critical",0.7998,0.8256,0.5607,0.7998,0.7895,0.3118,0.7741,18.99,14.93,0.2113,0.3516,13.5,24.0,[]],[74.2,"critical",0.8204,0.8441,0.6058,0.8204,0.8142,0.3115,0.7765,19.24,14.74,0.2126,0.3563,13.5,24.5,[]],[76.4,"critical",0.8407,0.8623,0.6503,0.8407,0.8389,0.3107,0.7789,19.5,14.54,0.2138,0.361,13.5,25.0,[]],[78.6,"critical",0.8607,0.88,0.6943,0.8607,0.8635,0.3095,0.7812,19.76,14.36,0.2151,0.3657,13.5,25.5,[]],[80.8,"critical",0.8804,0.8975,0.7377,0.8804,0.8882,0.308,0.7835,20.02,14.18,0.2163,0.3703,13.5,26.0,[]],[83.0,"critical",0.9,0.9145,0.7805,0.9,0.9129,0.306,0.7857,20.27,14.0,0.2176,0.375,13.5,26.5,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,6.9,35.46,0.1427,0.148,13.26,1.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,7.13,34.32,0.1448,0.153,13.26,2.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,7.37,33.25,0.1469,0.1579,13.26,2.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,7.6,32.24,0.149,0.1628,13.26,3.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,7.83,31.29,0.151,0.1678,13.26,3.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,8.07,30.4,0.153,0.1727,13.26,4.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,8.3,29.55,0.155,0.1776,13.26,4.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,8.54,28.75,0.1569,0.1826,13.26,5.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,8.77,28.0,0.1588,0.1875,13.26,5.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,9.01,27.28,0.1607,0.1925,13.26,6.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,9.24,26.6,0.1626,0.1974,13.26,6.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,9.48,25.95,0.1644,0.2023,13.26,7.24,[1,6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0073,0.0,0.6636,9.71,25.33,0.1662,0.2073,13.26,7.74,[6,7]],[1.8,"low",0.0161,0.0185,0.0,0.0161,0.0332,0.0115,0.6691,9.95,24.74,0.168,0.2122,13.26,8.24,[6]],[4.6,"low",0.0518,0.0592,0.0,0.0518,0.0592,0.0366,0.6744,10.18,24.18,0.1698,0.2171,13.26,8.74,[6]],[7.4,"low",0.0866,0.0986,0.0,0.0866,0.0852,0.0606,0.6795,10.42,23.64,0.1715,0.2221,13.26,9.24,[6]],[10.1,"low",0.1208,0.1369,0.0,0.1208,0.1111,0.0833,0.6845,10.65,23.13,0.1732,0.227,13.26,9.74,[6]],[12.7,"low",0.1541,0.174,0.0,0.1541,0.1371,0.1049,0.6893,10.89,22.64,0.1749,0.2319,13.26,10.24,[6]],[15.3,"low",0.1868,0.2101,0.0,0.1868,0.1631,0.1254,0.694,11.12,22.16,0.1766,0.2369,13.26,10.74,[6]],[17.8,"low",0.2188,0.2451,0.0,0.2188,0.1891,0.1447,0.6986,11.36,21.71,0.1783,0.2418,13.26,11.24,[6]],[20.2,"low",0.2502,0.2791,0.0,0.2502,0.215,0.1631,0.703,11.6,21.28,0.1799,0.2467,13.26,11.74,[6]],[22.7,"low",0.2809,0.3122,0.0,0.2809,0.241,0.1803,0.7073,11.83,20.86,0.1815,0.2517,13.26,12.24,[6]],[25.0,"low",0.311,0.3443,0.0,0.311,0.267,0.1966,0.7115,12.07,20.46,0.1831,0.2566,13.26,12.74,[6]],[27.3,"low",0.3406,0.3756,0.0,0.3406,0.2929,0.2118,0.7155,12.3,20.07,0.1847,0.2615,13.26,13.24,[6]],[29.6,"low",0.3696,0.406,0.0,0.3696,0.3189,0.2261,0.7195,12.54,19.7,0.1863,0.2665,13.26,13.74,[6]],[31.9,"low",0.3981,0.4356,0.0,0.3981,0.3449,0.2395,0.7234,12.78,19.34,0.1879,0.2714,13.26,14.24,[6]],[34.1,"low",0.426,0.4644,0.0,0.426,0.3709,0.2519,0.7271,13.01,19.0,0.1894,0.2763,13.26,14.74,[6]],[36.2,"medium",0.4535,0.4925,0.0,0.4535,0.3968,0.2634,0.7308,13.25,18.67,0.1909,0.2813,13.26,15.24,[]],[38.3,"medium",0.4805,0.5199,0.0,0.4805,0.4228,0.274,0.7343,13.48,18.34,0.1924,0.2862,13.26,15.74,[]],[40.4,"medium",0.507,0.5465,0.0,0.507,0.4488,0.2838,0.7378,13.72,18.03,0.1939,0.2911,13.26,16.24,[]],[42.4,"medium",0.5331,0.5725,0.0,0.5331,0.4747,0.2927,0.7412,13.96,17.73,0.1954,0.2961,13.26,16.74,[]],[44.9,"medium",0.5588,0.5979,0.0318,0.5588,0.5007,0.3009,0.7445,14.19,17.44,0.1969,0.301,13.26,17.24,[]],[47.7,"medium",0.584,0.6226,0.0871,0.584,0.5267,0.3082,0.7477,14.43,17.16,0.1984,0.3059,13.26,17.74,[]],[50.5,"medium",0.6088,0.6468,0.1416,0.6088,0.5527,0.3148,0.7508,14.67,16.89,0.1998,0.3109,13.26,18.24,[]],[53.2,"medium",0.6333,0.6703,0.1953,0.6333,0.5786,0.3206,0.7539,14.9,16.62,0.2012,0.3158,13.26,18.74,[]],[55.9,"medium",0.6573,0.6933,0.2481,0.6573,0.6046,0.3257,0.7569,15.14,16.37,0.2027,0.3208,13.26,19.24,[]],[58.5,"medium",0.681,0.7158,0.3001,0.681,0.6306,0.3301,0.7598,15.38,16.12,0.2041,0.3257,13.26,19.74,[]],[61.1,"medium",0.7044,0.7377,0.3513,0.7044,0.6565,0.3339,0.7627,15.62,15.88,0.2055,0.3306,13.26,20.24,[]],[63.6,"medium",0.7274,0.7592,0.4017,0.7274,0.6825,0.337,0.7655,15.85,15.65,0.2069,0.3356,13.26,20.74,[]],[66.1,"critical",0.75,0.7801,0.4514,0.75,0.7085,0.3395,0.7682,16.09,15.42,0.2082,0.3405,13.26,21.24,[]],[68.6,"critical",0.7723,0.8006,0.5004,0.7723,0.7345,0.3414,0.7709,16.33,15.2,0.2096,0.3454,13.26,21.74,[]],[71.0,"critical",0.7944,0.8207,0.5487,0.7944,0.7604,0.3427,0.7735,16.56,14.98,0.2109,0.3504,13.26,22.24,[]],[73.5,"critical",0.8161,0.8403,0.5964,0.8161,0.7864,0.3435,0.776,16.8,14.78,0.2123,0.3553,13.26,22.74,[]],[75.8,"critical",0.8375,0.8594,0.6433,0.8375,0.8124,0.3438,0.7785,17.04,14.57,0.2136,0.3602,13.26,23.24,[]],[78.2,"critical",0.8586,0.8782,0.6897,0.8586,0.8383,0.3435,0.781,17.28,14.38,0.2149,0.3652,13.26,23.74,[]],[80.5,"critical",0.8794,0.8966,0.7354,0.8794,0.8643,0.3428,0.7833,17.51,14.19,0.2163,0.3701,13.26,24.24,[]],[82.7,"critical",0.9,0.9145,0.7805,0.9,0.8903,0.3417,0.7857,17.75,14.0,0.2176,0.375,13.26,24.74,[]],[85.0,"critical",0.9203,0.9321,0.825,0.9203,0.9163,0.3401,0.788,17.99,13.82,0.2189,0.38,13.26,25.24,[]],[87.2,"critical",0.9403,0.9494,0.869,0.9403,0.9422,0.3381,0.7902,18.23,13.64,0.2201,0.3849,13.26,25.74,[]],[89.4,"critical",0.9601,0.9663,0.9123,0.9601,0.9682,0.3358,0.7924,18.46,13.47,0.2214,0.3898,13.26,26.24,[]],[91.6,"critical",0.9796,0.9828,0.9552,0.9796,0.9942,0.3331,0.7946,18.7,13.3,0.2227,0.3948,13.26,26.74,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,6.76,35.01,0.1435,0.15,13.2,1.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,6.99,33.88,0.1457,0.155,13.2,2.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,7.22,32.82,0.1478,0.16,13.2,2.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,7.45,31.83,0.1498,0.165,13.2,3.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,7.68,30.89,0.1519,0.17,13.2,3.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,7.91,30.01,0.1539,0.175,13.2,4.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,8.14,29.17,0.1559,0.18,13.2,4.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,8.37,28.39,0.1578,0.185,13.2,5.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,8.6,27.64,0.1598,0.19,13.2,5.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,8.83,26.93,0.1617,0.195,13.2,6.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,9.06,26.26,0.1635,0.2,13.2,6.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,9.29,25.62,0.1654,0.2049,13.2,7.3,[1,6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0156,0.0,0.6666,9.52,25.01,0.1672,0.2099,13.2,7.8,[6,7]],[3.2,"low",0.0361,0.0414,0.0,0.0361,0.0419,0.0259,0.672,9.75,24.42,0.169,0.2149,13.2,8.3,[6]],[6.1,"low",0.0718,0.0819,0.0,0.0718,0.0682,0.0508,0.6773,9.98,23.87,0.1708,0.2199,13.2,8.8,[6]],[8.8,"low",0.1067,0.1212,0.0,0.1067,0.0946,0.0746,0.6824,10.21,23.34,0.1725,0.2249,13.2,9.3,[6]],[11.5,"low",0.1408,0.1592,0.0,0.1408,0.1209,0.0971,0.6874,10.44,22.83,0.1742,0.2299,13.2,9.8,[6]],[14.1,"low",0.1742,0.1962,0.0,0.1742,0.1472,0.1185,0.6922,10.67,22.35,0.1759,0.2349,13.2,10.3,[6]],[16.7,"low",0.2068,0.2321,0.0,0.2068,0.1735,0.1388,0.6969,10.9,21.88,0.1776,0.2399,13.2,10.8,[6]],[19.2,"low",0.2388,0.2669,0.0,0.2388,0.1998,0.158,0.7014,11.13,21.43,0.1793,0.2449,13.2,11.3,[6]],[21.7,"low",0.2702,0.3007,0.0,0.2702,0.2261,0.1761,0.7058,11.36,21.01,0.181,0.2499,13.2,11.8,[6]],[24.1,"low",0.3009,0.3336,0.0,0.3009,0.2524,0.1932,0.7101,11.59,20.59,0.1826,0.2549,13.2,12.3,[6]],[26.5,"low",0.3311,0.3655,0.0,0.3311,0.2787,0.2093,0.7142,11.82,20.2,0.1842,0.2599,13.2,12.8,[6]],[28.8,"low",0.3606,0.3966,0.0,0.3606,0.305,0.2243,0.7183,12.06,19.82,0.1858,0.2649,13.2,13.3,[6]],[31.1,"low",0.3896,0.4269,0.0,0.3896,0.3313,0.2384,0.7222,12.29,19.45,0.1874,0.2699,13.2,13.8,[6]],[33.3,"low",0.4181,0.4563,0.0,0.4181,0.3576,0.2515,0.726,12.52,19.1,0.189,0.2749,13.2,14.3,[6]],[35.5,"medium",0.4461,0.485,0.0,0.4461,0.384,0.2637,0.7298,12.75,18.75,0.1905,0.2799,13.2,14.8,[]],[37.7,"medium",0.4735,0.5129,0.0,0.4735,0.4103,0.275,0.7334,12.98,18.43,0.192,0.2849,13.2,15.3,[]],[39.8,"medium",0.5005,0.54,0.0,0.5005,0.4366,0.2854,0.7369,13.21,18.11,0.1936,0.2899,13.2,15.8,[]],[41.9,"medium",0.5271,0.5665,0.0,0.5271,0.4629,0.295,0.7404,13.45,17.8,0.1951,0.2949,13.2,16.3,[]],[44.2,"medium",0.5532,0.5924,0.0195,0.5532,0.4892,0.3037,0.7438,13.68,17.5,0.1966,0.2999,13.2,16.8,[]],[47.1,"medium",0.5788,0.6176,0.0758,0.5788,0.5155,0.3116,0.747,13.91,17.22,0.1981,0.3049,13.2,17.3,[]],[49.9,"medium",0.604,0.6421,0.1311,0.604,0.5418,0.3188,0.7502,14.14,16.94,0.1995,0.3099,13.2,17.8,[]],[52.6,"medium",0.6289,0.6661,0.1856,0.6289,0.5681,0.3251,0.7534,14.37,16.67,0.201,0.3149,13.2,18.3,[]],[55.3,"medium",0.6533,0.6895,0.2392,0.6533,0.5944,0.3307,0.7564,14.61,16.41,0.2024,0.3199,13.2,18.8,[]],[58.0,"medium",0.6774,0.7123,0.292,0.6774,0.6207,0.3356,0.7594,14.84,16.16,0.2038,0.3249,13.2,19.3,[]],[60.6,"medium",0.7011,0.7346,0.344,0.7011,0.6471,0.3398,0.7623,15.07,15.91,0.2053,0.3299,13.2,19.8,[]],[63.2,"medium",0.7244,0.7564,0.3953,0.7244,0.6734,0.3434,0.7651,15.3,15.68,0.2067,0.3349,13.2,20.3,[]],[65.8,"critical",0.7474,0.7777,0.4457,0.7474,0.6997,0.3463,0.7679,15.53,15.44,0.2081,0.3399,13.2,20.8,[]],[68.3,"critical",0.7701,0.7985,0.4954,0.7701,0.726,0.3486,0.7706,15.77,15.22,0.2095,0.3449,13.2,21.3,[]],[70.8,"critical",0.7924,0.8189,0.5444,0.7924,0.7523,0.3502,0.7732,16.0,15.0,0.2108,0.3499,13.2,21.8,[]],[73.2,"critical",0.8144,0.8388,0.5927,0.8144,0.7786,0.3514,0.7758,16.23,14.79,0.2122,0.3549,13.2,22.3,[]],[75.6,"critical",0.8361,0.8582,0.6404,0.8361,0.8049,0.3519,0.7784,16.46,14.59,0.2135,0.3599,13.2,22.8,[]],[78.0,"critical",0.8575,0.8772,0.6873,0.8575,0.8312,0.352,0.7808,16.7,14.39,0.2149,0.3649,13.2,23.3,[]],[80.3,"critical",0.8786,0.8959,0.7337,0.8786,0.8575,0.3515,0.7833,16.93,14.19,0.2162,0.3699,13.2,23.8,[]],[82.6,"critical",0.8995,0.9141,0.7794,0.8995,0.8838,0.3506,0.7856,17.16,14.0,0.2175,0.3749,13.2,24.3,[]],[84.9,"critical",0.92,0.9319,0.8245,0.92,0.9101,0.3493,0.788,17.39,13.82,0.2188,0.3799,13.2,24.8,[]],[87.2,"critical",0.9403,0.9494,0.869,0.9403,0.9365,0.3475,0.7902,17.63,13.64,0.2201,0.3849,13.2,25.3,[]],[89.4,"critical",0.9603,0.9665,0.9129,0.9603,0.9628,0.3454,0.7925,17.86,13.46,0.2214,0.3899,13.2,25.8,[]],[91.6,"critical",0.9801,0.9833,0.9563,0.9801,0.9891,0.3428,0.7946,18.09,13.29,0.2227,0.3949,13.2,26.3,[]],[93.4,"critical",0.9996,0.9997,0.9992,0.9996,1.0,0.3399,0.7968,18.33,13.13,0.224,0.3999,13.2,26.8,[]]]],"Polyethylene":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,29.32,70.93,0.1041,0.074,17.41,-2.41,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,30.31,68.64,0.1057,0.0765,17.41,-1.91,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,31.3,66.49,0.1072,0.079,17.41,-1.41,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,32.3,64.48,0.1088,0.0814,17.41,-0.91,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,33.29,62.58,0.1102,0.0839,17.41,-0.41,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,34.29,60.8,0.1117,0.0864,17.41,0.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,35.29,59.11,0.1131,0.0888,17.41,0.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,36.28,57.51,0.1145,0.0913,17.41,1.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,37.28,56.0,0.1159,0.0938,17.41,1.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,38.28,54.56,0.1173,0.0962,17.41,2.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,39.28,53.2,0.1187,0.0987,17.41,2.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,40.28,51.9,0.12,0.1012,17.41,3.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,41.28,50.66,0.1213,0.1036,17.41,3.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,42.28,49.48,0.1226,0.1061,17.41,4.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,43.28,48.36,0.1239,0.1086,17.41,4.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,44.28,47.29,0.1252,0.111,17.41,5.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,45.28,46.26,0.1265,0.1135,17.41,5.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,46.28,45.27,0.1277,0.116,17.41,6.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,47.28,44.33,0.1289,0.1184,17.41,6.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,48.28,43.43,0.1301,0.1209,17.41,7.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,49.29,42.56,0.1313,0.1234,17.41,7.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,50.29,41.72,0.1325,0.1258,17.41,8.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,51.29,40.92,0.1337,0.1283,17.41,8.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,52.29,40.15,0.1349,0.1308,17.41,9.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,53.3,39.4,0.136,0.1332,17.41,9.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,54.3,38.69,0.1371,0.1357,17.41,10.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,55.31,38.0,0.1383,0.1382,17.41,10.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,56.31,37.33,0.1394,0.1406,17.41,11.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,57.32,36.69,0.1405,0.1431,17.41,11.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,58.32,36.06,0.1416,0.1456,17.41,12.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,59.33,35.46,0.1427,0.148,17.41,12.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,60.33,34.88,0.1437,0.1505,17.41,13.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,61.34,34.32,0.1448,0.153,17.41,13.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,62.34,33.77,0.1459,0.1554,17.41,14.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,63.35,33.25,0.1469,0.1579,17.41,14.59,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,64.36,32.74,0.1479,0.1604,17.41,15.09,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0101,0.0,0.6052,65.36,32.24,0.149,0.1628,17.41,15.59,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.023,0.0,0.609,66.37,31.76,0.15,0.1653,17.41,16.09,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.036,0.0,0.6127,67.38,31.29,0.151,0.1678,17.41,16.59,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.049,0.0,0.6163,68.39,30.84,0.152,0.1702,17.41,17.09,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.062,0.0,0.6198,69.4,30.4,0.153,0.1727,17.41,17.59,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.075,0.0,0.6233,70.4,29.97,0.154,0.1752,17.41,18.09,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.088,0.0,0.6267,71.41,29.55,0.155,0.1776,17.41,18.59,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.101,0.0,0.6301,72.42,29.15,0.1559,0.1801,17.41,19.09,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1139,0.0,0.6334,73.43,28.75,0.1569,0.1826,17.41,19.59,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1269,0.0,0.6367,74.44,28.37,0.1579,0.185,17.41,20.09,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1399,0.0,0.6399,75.45,28.0,0.1588,0.1875,17.41,20.59,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1529,0.0,0.643,76.46,27.63,0.1598,0.19,17.41,21.09,[6,7]],[4.1,"low",0.0,0.0,0.0,0.0,0.1659,0.0,0.6461,77.47,27.28,0.1607,0.1925,17.41,21.59,[6,7]],[4.5,"low",0.0,0.0,0.0,0.0,0.1789,0.0,0.6491,78.48,26.93,0.1616,0.1949,17.41,22.09,[6,7]],[4.8,"low",0.0,0.0,0.0,0.0,0.1919,0.0,0.6521,79.49,26.6,0.1626,0.1974,17.41,22.59,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,25.23,64.48,0.1088,0.0814,16.84,-1.84,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,26.09,62.4,0.1104,0.0841,16.84,-1.34,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,26.95,60.45,0.112,0.0868,16.84,-0.84,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,27.8,58.62,0.1136,0.0896,16.84,-0.34,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,28.66,56.89,0.1151,0.0923,16.84,0.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,29.52,55.27,0.1166,0.095,16.84,0.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,30.37,53.73,0.1181,0.0977,16.84,1.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,31.23,52.28,0.1196,0.1004,16.84,1.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,32.09,50.9,0.1211,0.1031,16.84,2.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,32.95,49.6,0.1225,0.1058,16.84,2.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,33.81,48.36,0.1239,0.1086,16.84,3.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,34.67,47.18,0.1253,0.1113,16.84,3.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,35.53,46.06,0.1267,0.114,16.84,4.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,36.39,44.99,0.1281,0.1167,16.84,4.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,37.25,43.96,0.1294,0.1194,16.84,5.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,38.11,42.99,0.1307,0.1221,16.84,5.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,38.97,42.05,0.132,0.1248,16.84,6.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,39.84,41.16,0.1333,0.1276,16.84,6.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,40.7,40.3,0.1346,0.1303,16.84,7.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,41.56,39.48,0.1359,0.133,16.84,7.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,42.42,38.69,0.1371,0.1357,16.84,8.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,43.29,37.93,0.1384,0.1384,16.84,8.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,44.15,37.2,0.1396,0.1411,16.84,9.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,45.01,36.5,0.1408,0.1438,16.84,9.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,45.88,35.82,0.142,0.1466,16.84,10.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,46.74,35.17,0.1432,0.1493,16.84,10.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,47.61,34.54,0.1444,0.152,16.84,11.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,48.47,33.94,0.1455,0.1547,16.84,11.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,49.34,33.35,0.1467,0.1574,16.84,12.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,50.2,32.79,0.1478,0.1601,16.84,12.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,51.07,32.24,0.149,0.1628,16.84,13.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,51.93,31.71,0.1501,0.1656,16.84,13.66,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0097,0.0,0.6134,52.8,31.2,0.1512,0.1683,16.84,14.16,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.024,0.0,0.6174,53.66,30.7,0.1523,0.171,16.84,14.66,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0383,0.0,0.6212,54.53,30.22,0.1534,0.1737,16.84,15.16,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0526,0.0,0.625,55.4,29.76,0.1545,0.1764,16.84,15.66,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0669,0.0,0.6288,56.26,29.31,0.1556,0.1791,16.84,16.16,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0811,0.0,0.6324,57.13,28.87,0.1566,0.1818,16.84,16.66,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0954,0.0,0.636,58.0,28.45,0.1577,0.1846,16.84,17.16,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1097,0.0,0.6395,58.87,28.03,0.1587,0.1873,16.84,17.66,[6,7]],[3.1,"low",0.0,0.0,0.0,0.0,0.124,0.0,0.643,59.73,27.63,0.1598,0.19,16.84,18.16,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1383,0.0,0.6464,60.6,27.24,0.1608,0.1927,16.84,18.66,[6,7]],[3.8,"low",0.0,0.0,0.0,0.0,0.1526,0.0,0.6497,61.47,26.87,0.1618,0.1954,16.84,19.16,[6,7]],[4.2,"low",0.0,0.0,0.0,0.0,0.1668,0.0,0.653,62.34,26.5,0.1628,0.1981,16.84,19.66,[6,7]],[4.5,"low",0.0,0.0,0.0,0.0,0.1811,0.0,0.6562,63.21,26.14,0.1639,0.2008,16.84,20.16,[6,7]],[4.9,"low",0.0,0.0,0.0,0.0,0.1954,0.0,0.6594,64.08,25.79,0.1649,0.2036,16.84,20.66,[6,7]],[5.2,"low",0.0,0.0,0.0,0.0,0.2097,0.0,0.6625,64.94,25.45,0.1658,0.2063,16.84,21.16,[6,7]],[5.6,"low",0.0,0.0,0.0,0.0,0.224,0.0,0.6655,65.81,25.12,0.1668,0.209,16.84,21.66,[6,7]],[6.9,"low",0.0125,0.0143,0.0125,0.0125,0.2383,0.0045,0.6685,66.68,24.8,0.1678,0.2117,16.84,22.16,[6]],[8.6,"low",0.0322,0.0369,0.0322,0.0322,0.2526,0.0113,0.6715,67.55,24.49,0.1688,0.2144,16.84,22.66,[6]],[10.4,"low",0.0518,0.0592,0.0518,0.0518,0.2668,0.0176,0.6744,68.42,24.18,0.1698,0.2171,16.84,23.16,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,24.19,62.77,0.1101,0.0836,16.68,-1.68,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,25.01,60.74,0.1117,0.0864,16.68,-1.18,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,25.83,58.84,0.1134,0.0892,16.68,-0.68,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,26.65,57.06,0.115,0.092,16.68,-0.18,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,27.47,55.38,0.1165,0.0948,16.68,0.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,28.29,53.8,0.1181,0.0976,16.68,0.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,29.12,52.31,0.1196,0.1004,16.68,1.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,29.94,50.89,0.1211,0.1032,16.68,1.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,30.76,49.55,0.1226,0.1059,16.68,2.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,31.59,48.28,0.124,0.1087,16.68,2.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,32.41,47.08,0.1254,0.1115,16.68,3.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,33.23,45.93,0.1269,0.1143,16.68,3.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,34.06,44.83,0.1283,0.1171,16.68,4.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,34.88,43.79,0.1296,0.1199,16.68,4.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,35.71,42.8,0.131,0.1227,16.68,5.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,36.53,41.85,0.1323,0.1255,16.68,5.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,37.36,40.94,0.1337,0.1283,16.68,6.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,38.19,40.06,0.135,0.131,16.68,6.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,39.01,39.23,0.1363,0.1338,16.68,7.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,39.84,38.43,0.1376,0.1366,16.68,7.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,40.67,37.66,0.1388,0.1394,16.68,8.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,41.49,36.92,0.1401,0.1422,16.68,8.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,42.32,36.21,0.1413,0.145,16.68,9.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,43.15,35.53,0.1425,0.1478,16.68,9.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,43.98,34.87,0.1438,0.1506,16.68,10.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,44.8,34.24,0.145,0.1533,16.68,10.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,45.63,33.63,0.1462,0.1561,16.68,11.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,46.46,33.04,0.1473,0.1589,16.68,11.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,47.29,32.47,0.1485,0.1617,16.68,12.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,48.12,31.92,0.1497,0.1645,16.68,12.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,48.95,31.38,0.1508,0.1673,16.68,13.32,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0107,0.0,0.616,49.78,30.87,0.1519,0.1701,16.68,13.82,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0254,0.0,0.62,50.61,30.37,0.1531,0.1729,16.68,14.32,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0401,0.0,0.624,51.44,29.89,0.1542,0.1756,16.68,14.82,[6,7]],[1.4,"low",0.0,0.0,0.0,0.0,0.0547,0.0,0.6278,52.27,29.42,0.1553,0.1784,16.68,15.32,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0694,0.0,0.6316,53.1,28.97,0.1564,0.1812,16.68,15.82,[6,7]],[2.1,"low",0.0,0.0,0.0,0.0,0.0841,0.0,0.6353,53.93,28.53,0.1575,0.184,16.68,16.32,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.0988,0.0,0.6389,54.76,28.1,0.1586,0.1868,16.68,16.82,[6,7]],[2.8,"low",0.0,0.0,0.0,0.0,0.1134,0.0,0.6425,55.59,27.69,0.1596,0.1896,16.68,17.32,[6,7]],[3.2,"low",0.0,0.0,0.0,0.0,0.1281,0.0,0.646,56.43,27.29,0.1607,0.1924,16.68,17.82,[6,7]],[3.6,"low",0.0,0.0,0.0,0.0,0.1428,0.0,0.6494,57.26,26.9,0.1617,0.1952,16.68,18.32,[6,7]],[3.9,"low",0.0,0.0,0.0,0.0,0.1574,0.0,0.6528,58.09,26.52,0.1628,0.198,16.68,18.82,[6,7]],[4.3,"low",0.0,0.0,0.0,0.0,0.1721,0.0,0.6561,58.92,26.15,0.1638,0.2007,16.68,19.32,[6,7]],[4.7,"low",0.0,0.0,0.0,0.0,0.1868,0.0,0.6594,59.75,25.79,0.1648,0.2035,16.68,19.82,[6,7]],[5.0,"low",0.0,0.0,0.0,0.0,0.2015,0.0,0.6625,60.59,25.45,0.1659,0.2063,16.68,20.32,[6,7]],[5.4,"low",0.0,0.0,0.0,0.0,0.2161,0.0,0.6657,61.42,25.11,0.1669,0.2091,16.68,20.82,[6,7]],[6.8,"low",0.0139,0.016,0.0139,0.0139,0.2308,0.0053,0.6687,62.25,24.78,0.1679,0.2119,16.68,21.32,[6]],[8.6,"low",0.0342,0.0392,0.0342,0.0342,0.2455,0.0126,0.6718,63.09,24.45,0.1689,0.2147,16.68,21.82,[6]],[10.4,"low",0.0542,0.062,0.0542,0.0542,0.2602,0.0195,0.6747,63.92,24.14,0.1699,0.2175,16.68,22.32,[6]],[12.2,"low",0.074,0.0844,0.074,0.074,0.2748,0.0259,0.6776,64.75,23.84,0.1709,0.2203,16.68,22.82,[6]],[14.0,"low",0.0935,0.1064,0.0935,0.0935,0.2895,0.0318,0.6805,65.59,23.54,0.1718,0.223,16.68,23.32,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,22.01,59.11,0.1131,0.0888,16.34,-1.34,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,22.75,57.2,0.1148,0.0918,16.34,-0.84,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,23.5,55.41,0.1165,0.0947,16.34,-0.34,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,24.25,53.73,0.1181,0.0977,16.34,0.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,24.99,52.15,0.1197,0.1007,16.34,0.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,25.74,50.66,0.1213,0.1036,16.34,1.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,26.49,49.26,0.1229,0.1066,16.34,1.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,27.24,47.92,0.1244,0.1095,16.34,2.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,27.99,46.66,0.126,0.1125,16.34,2.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,28.74,45.47,0.1274,0.1155,16.34,3.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,29.49,44.33,0.1289,0.1184,16.34,3.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,30.24,43.25,0.1304,0.1214,16.34,4.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,30.99,42.22,0.1318,0.1244,16.34,4.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,31.74,41.24,0.1332,0.1273,16.34,5.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,32.49,40.3,0.1346,0.1303,16.34,5.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,33.24,39.4,0.136,0.1332,16.34,6.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,33.99,38.55,0.1374,0.1362,16.34,6.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,34.74,37.73,0.1387,0.1392,16.34,7.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,35.49,36.94,0.14,0.1421,16.34,7.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,36.24,36.19,0.1414,0.1451,16.34,8.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,37.0,35.46,0.1427,0.148,16.34,8.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,37.75,34.77,0.144,0.151,16.34,9.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,38.5,34.1,0.1452,0.154,16.34,9.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,39.26,33.46,0.1465,0.1569,16.34,10.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,40.01,32.84,0.1477,0.1599,16.34,10.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,40.76,32.24,0.149,0.1628,16.34,11.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,41.52,31.66,0.1502,0.1658,16.34,11.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,42.27,31.11,0.1514,0.1688,16.34,12.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,43.02,30.57,0.1526,0.1717,16.34,12.66,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0155,0.0,0.6226,43.78,30.05,0.1538,0.1747,16.34,13.16,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0311,0.0,0.6267,44.53,29.55,0.155,0.1776,16.34,13.66,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0467,0.0,0.6308,45.29,29.07,0.1561,0.1806,16.34,14.16,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0622,0.0,0.6347,46.04,28.6,0.1573,0.1836,16.34,14.66,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0778,0.0,0.6386,46.8,28.15,0.1584,0.1865,16.34,15.16,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0934,0.0,0.6424,47.56,27.71,0.1596,0.1895,16.34,15.66,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.109,0.0,0.6461,48.31,27.28,0.1607,0.1925,16.34,16.16,[6,7]],[3.1,"low",0.0,0.0,0.0,0.0,0.1246,0.0,0.6497,49.07,26.87,0.1618,0.1954,16.34,16.66,[6,7]],[3.5,"low",0.0,0.0,0.0,0.0,0.1401,0.0,0.6533,49.82,26.47,0.1629,0.1984,16.34,17.16,[6,7]],[3.9,"low",0.0,0.0,0.0,0.0,0.1557,0.0,0.6568,50.58,26.08,0.164,0.2013,16.34,17.66,[6,7]],[4.3,"low",0.0,0.0,0.0,0.0,0.1713,0.0,0.6602,51.34,25.7,0.1651,0.2043,16.34,18.16,[6,7]],[4.7,"low",0.0,0.0,0.0,0.0,0.1869,0.0,0.6636,52.09,25.33,0.1662,0.2073,16.34,18.66,[6,7]],[5.2,"low",0.0016,0.0018,0.0016,0.0016,0.2025,0.0007,0.6669,52.85,24.97,0.1673,0.2102,16.34,19.16,[6]],[7.1,"low",0.0233,0.0267,0.0233,0.0233,0.2181,0.0098,0.6701,53.61,24.63,0.1683,0.2132,16.34,19.66,[6]],[9.1,"low",0.0447,0.0511,0.0447,0.0447,0.2336,0.0183,0.6733,54.36,24.29,0.1694,0.2161,16.34,20.16,[6]],[11.0,"low",0.0658,0.0751,0.0658,0.0658,0.2492,0.0263,0.6764,55.12,23.96,0.1705,0.2191,16.34,20.66,[6]],[12.9,"low",0.0866,0.0986,0.0866,0.0866,0.2648,0.0338,0.6795,55.88,23.64,0.1715,0.2221,16.34,21.16,[6]],[14.7,"low",0.1072,0.1217,0.1072,0.1072,0.2804,0.0407,0.6825,56.64,23.33,0.1725,0.225,16.34,21.66,[6]],[16.6,"low",0.1275,0.1444,0.1275,0.1275,0.296,0.0471,0.6855,57.39,23.03,0.1736,0.228,16.34,22.16,[6]],[18.4,"low",0.1475,0.1667,0.1475,0.1475,0.3116,0.053,0.6884,58.15,22.73,0.1746,0.2309,16.34,22.66,[6]],[20.2,"low",0.1673,0.1886,0.1673,0.1673,0.3271,0.0585,0.6912,58.91,22.45,0.1756,0.2339,16.34,23.16,[6]],[21.9,"low",0.1868,0.2101,0.1868,0.1868,0.3427,0.0635,0.694,59.67,22.16,0.1766,0.2369,16.34,23.66,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,19.4,54.56,0.1173,0.0962,15.89,-0.89,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,20.06,52.8,0.1191,0.0994,15.89,-0.39,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,20.72,51.15,0.1208,0.1026,15.89,0.11,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,21.38,49.6,0.1225,0.1058,15.89,0.61,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,22.04,48.14,0.1242,0.1091,15.89,1.11,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,22.7,46.77,0.1258,0.1123,15.89,1.61,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,23.36,45.47,0.1274,0.1155,15.89,2.11,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,24.02,44.24,0.129,0.1187,15.89,2.61,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,24.68,43.07,0.1306,0.1219,15.89,3.11,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,25.34,41.97,0.1322,0.1251,15.89,3.61,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,26.0,40.92,0.1337,0.1283,15.89,4.11,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,26.66,39.92,0.1352,0.1315,15.89,4.61,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,27.32,38.97,0.1367,0.1347,15.89,5.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,27.98,38.06,0.1382,0.1379,15.89,5.61,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,28.64,37.2,0.1396,0.1411,15.89,6.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,29.31,36.37,0.141,0.1443,15.89,6.61,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,29.97,35.58,0.1424,0.1475,15.89,7.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,30.63,34.83,0.1438,0.1508,15.89,7.61,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,31.29,34.1,0.1452,0.154,15.89,8.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,31.96,33.4,0.1466,0.1572,15.89,8.61,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,32.62,32.74,0.1479,0.1604,15.89,9.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,33.28,32.09,0.1493,0.1636,15.89,9.61,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,33.95,31.48,0.1506,0.1668,15.89,10.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,34.61,30.88,0.1519,0.17,15.89,10.61,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,35.28,30.31,0.1532,0.1732,15.89,11.11,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,35.94,29.76,0.1545,0.1764,15.89,11.61,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0143,0.0,0.6294,36.6,29.23,0.1558,0.1796,15.89,12.11,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0311,0.0,0.6337,37.27,28.72,0.157,0.1828,15.89,12.61,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.048,0.0,0.638,37.93,28.22,0.1583,0.186,15.89,13.11,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0649,0.0,0.6421,38.6,27.74,0.1595,0.1892,15.89,13.61,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0818,0.0,0.6461,39.27,27.28,0.1607,0.1925,15.89,14.11,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.0987,0.0,0.65,39.93,26.83,0.1619,0.1957,15.89,14.61,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1156,0.0,0.6539,40.6,26.4,0.1631,0.1989,15.89,15.11,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1324,0.0,0.6577,41.26,25.98,0.1643,0.2021,15.89,15.61,[6,7]],[3.7,"low",0.0,0.0,0.0,0.0,0.1493,0.0,0.6614,41.93,25.57,0.1655,0.2053,15.89,16.11,[6,7]],[4.2,"low",0.0,0.0,0.0,0.0,0.1662,0.0,0.665,42.6,25.18,0.1667,0.2085,15.89,16.61,[6,7]],[5.5,"low",0.0125,0.0143,0.0125,0.0125,0.1831,0.006,0.6685,43.26,24.8,0.1678,0.2117,15.89,17.11,[6]],[7.6,"low",0.0358,0.041,0.0358,0.0358,0.2,0.017,0.672,43.93,24.43,0.169,0.2149,15.89,17.61,[6]],[9.7,"low",0.0588,0.0672,0.0588,0.0588,0.2168,0.0272,0.6754,44.6,24.07,0.1701,0.2181,15.89,18.11,[6]],[11.8,"low",0.0815,0.0928,0.0815,0.0815,0.2337,0.0369,0.6787,45.26,23.72,0.1712,0.2213,15.89,18.61,[6]],[13.8,"low",0.1038,0.1179,0.1038,0.1038,0.2506,0.0459,0.682,45.93,23.38,0.1724,0.2245,15.89,19.11,[6]],[15.8,"low",0.1258,0.1425,0.1258,0.1258,0.2675,0.0543,0.6852,46.6,23.05,0.1735,0.2277,15.89,19.61,[6]],[17.8,"low",0.1475,0.1667,0.1475,0.1475,0.2844,0.0621,0.6884,47.26,22.73,0.1746,0.2309,15.89,20.11,[6]],[19.7,"low",0.1689,0.1904,0.1689,0.1689,0.3013,0.0693,0.6914,47.93,22.42,0.1757,0.2341,15.89,20.61,[6]],[21.7,"low",0.19,0.2136,0.19,0.19,0.3181,0.076,0.6945,48.6,22.12,0.1768,0.2374,15.89,21.11,[6]],[23.5,"low",0.2109,0.2364,0.2109,0.2109,0.335,0.0822,0.6974,49.27,21.82,0.1778,0.2406,15.89,21.61,[6]],[25.4,"low",0.2314,0.2588,0.2314,0.2314,0.3519,0.0879,0.7003,49.94,21.54,0.1789,0.2438,15.89,22.11,[6]],[27.2,"low",0.2517,0.2808,0.2517,0.2517,0.3688,0.093,0.7032,50.6,21.26,0.18,0.247,15.89,22.61,[6]],[29.0,"low",0.2717,0.3024,0.2717,0.2717,0.3857,0.0977,0.706,51.27,20.98,0.181,0.2502,15.89,23.11,[6]],[30.8,"low",0.2915,0.3235,0.2915,0.2915,0.4025,0.102,0.7088,51.94,20.72,0.1821,0.2534,15.89,23.61,[6]],[32.6,"low",0.311,0.3443,0.311,0.311,0.4194,0.1058,0.7115,52.61,20.46,0.1831,0.2566,15.89,24.11,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,17.27,50.66,0.1213,0.1036,15.48,-0.48,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,17.85,49.03,0.1232,0.1071,15.48,0.02,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,18.44,47.5,0.1249,0.1105,15.48,0.52,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,19.03,46.06,0.1267,0.114,15.48,1.02,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,19.61,44.7,0.1284,0.1174,15.48,1.52,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,20.2,43.43,0.1301,0.1209,15.48,2.02,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,20.79,42.22,0.1318,0.1244,15.48,2.52,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,21.37,41.08,0.1335,0.1278,15.48,3.02,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,21.96,40.0,0.1351,0.1313,15.48,3.52,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,22.55,38.97,0.1367,0.1347,15.48,4.02,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,23.14,38.0,0.1383,0.1382,15.48,4.52,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,23.72,37.07,0.1398,0.1416,15.48,5.02,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,24.31,36.19,0.1414,0.1451,15.48,5.52,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,24.9,35.35,0.1429,0.1485,15.48,6.02,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,25.49,34.54,0.1444,0.152,15.48,6.52,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,26.08,33.77,0.1459,0.1554,15.48,7.02,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,26.67,33.04,0.1473,0.1589,15.48,7.52,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,27.26,32.34,0.1488,0.1623,15.48,8.02,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,27.85,31.66,0.1502,0.1658,15.48,8.52,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,28.44,31.02,0.1516,0.1693,15.48,9.02,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,29.03,30.4,0.153,0.1727,15.48,9.52,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,29.62,29.8,0.1544,0.1762,15.48,10.02,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,30.21,29.23,0.1558,0.1796,15.48,10.52,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.006,0.0,0.6341,30.8,28.68,0.1571,0.1831,15.48,11.02,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0242,0.0,0.6386,31.39,28.15,0.1584,0.1865,15.48,11.52,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0423,0.0,0.643,31.99,27.63,0.1598,0.19,15.48,12.02,[6,7]],[1.5,"low",0.0,0.0,0.0,0.0,0.0605,0.0,0.6473,32.58,27.14,0.1611,0.1934,15.48,12.52,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0787,0.0,0.6515,33.17,26.66,0.1624,0.1969,15.48,13.02,[6,7]],[2.4,"low",0.0,0.0,0.0,0.0,0.0969,0.0,0.6556,33.76,26.2,0.1637,0.2003,15.48,13.52,[6,7]],[2.9,"low",0.0,0.0,0.0,0.0,0.1151,0.0,0.6597,34.35,25.76,0.1649,0.2038,15.48,14.02,[6,7]],[3.3,"low",0.0,0.0,0.0,0.0,0.1332,0.0,0.6636,34.94,25.33,0.1662,0.2073,15.48,14.52,[6,7]],[4.2,"low",0.0052,0.006,0.0052,0.0052,0.1514,0.0028,0.6674,35.54,24.92,0.1675,0.2107,15.48,15.02,[6]],[6.5,"low",0.0305,0.0349,0.0305,0.0305,0.1696,0.0161,0.6712,36.13,24.51,0.1687,0.2142,15.48,15.52,[6]],[8.8,"low",0.0553,0.0632,0.0553,0.0553,0.1878,0.0286,0.6749,36.72,24.12,0.1699,0.2176,15.48,16.02,[6]],[11.0,"low",0.0797,0.0908,0.0797,0.0797,0.206,0.0404,0.6785,37.32,23.75,0.1712,0.2211,15.48,16.52,[6]],[13.2,"low",0.1038,0.1179,0.1038,0.1038,0.2241,0.0514,0.682,37.91,23.38,0.1724,0.2245,15.48,17.02,[6]],[15.4,"low",0.1275,0.1444,0.1275,0.1275,0.2423,0.0618,0.6855,38.5,23.03,0.1736,0.228,15.48,17.52,[6]],[17.5,"low",0.1508,0.1704,0.1508,0.1508,0.2605,0.0715,0.6888,39.1,22.68,0.1747,0.2314,15.48,18.02,[6]],[19.6,"low",0.1738,0.1958,0.1738,0.1738,0.2787,0.0805,0.6921,39.69,22.35,0.1759,0.2349,15.48,18.52,[6]],[21.7,"low",0.1965,0.2207,0.1965,0.1965,0.2969,0.0889,0.6954,40.28,22.03,0.1771,0.2383,15.48,19.02,[6]],[23.7,"low",0.2188,0.2451,0.2188,0.2188,0.315,0.0967,0.6986,40.88,21.71,0.1783,0.2418,15.48,19.52,[6]],[25.7,"low",0.2408,0.269,0.2408,0.2408,0.3332,0.1039,0.7017,41.47,21.41,0.1794,0.2453,15.48,20.02,[6]],[27.7,"low",0.2625,0.2925,0.2625,0.2625,0.3514,0.1105,0.7047,42.06,21.11,0.1806,0.2487,15.48,20.52,[6]],[29.6,"low",0.2839,0.3154,0.2839,0.2839,0.3696,0.1165,0.7077,42.66,20.82,0.1817,0.2522,15.48,21.02,[6]],[31.6,"low",0.305,0.338,0.305,0.305,0.3878,0.1221,0.7106,43.25,20.54,0.1828,0.2556,15.48,21.52,[6]],[33.5,"low",0.3259,0.3601,0.3259,0.3259,0.4059,0.127,0.7135,43.85,20.27,0.1839,0.2591,15.48,22.02,[6]],[35.3,"medium",0.3464,0.3817,0.3464,0.3464,0.4241,0.1315,0.7163,44.44,20.0,0.185,0.2625,15.48,22.52,[]],[37.2,"medium",0.3667,0.403,0.3667,0.3667,0.4423,0.1355,0.7191,45.04,19.74,0.1861,0.266,15.48,23.02,[]],[39.0,"medium",0.3867,0.4239,0.3867,0.3867,0.4605,0.1391,0.7218,45.63,19.49,0.1872,0.2694,15.48,23.52,[]],[40.8,"medium",0.4065,0.4443,0.4065,0.4065,0.4787,0.1422,0.7245,46.23,19.24,0.1883,0.2729,15.48,24.02,[]],[42.5,"medium",0.426,0.4644,0.426,0.426,0.4968,0.1449,0.7271,46.82,19.0,0.1894,0.2763,15.48,24.52,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,17.15,50.45,0.1216,0.1041,15.46,-0.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,17.73,48.82,0.1234,0.1075,15.46,0.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,18.32,47.29,0.1252,0.111,15.46,0.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,18.9,45.86,0.1269,0.1145,15.46,1.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,19.48,44.51,0.1287,0.1179,15.46,1.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,20.06,43.24,0.1304,0.1214,15.46,2.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,20.65,42.04,0.1321,0.1249,15.46,2.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,21.23,40.9,0.1337,0.1284,15.46,3.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,21.81,39.83,0.1353,0.1318,15.46,3.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,22.4,38.8,0.1369,0.1353,15.46,4.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,22.98,37.83,0.1385,0.1388,15.46,4.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,23.57,36.91,0.1401,0.1422,15.46,5.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,24.15,36.03,0.1416,0.1457,15.46,5.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,24.74,35.2,0.1432,0.1492,15.46,6.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,25.32,34.4,0.1447,0.1526,15.46,6.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,25.91,33.63,0.1461,0.1561,15.46,7.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,26.49,32.9,0.1476,0.1596,15.46,7.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,27.08,32.2,0.1491,0.163,15.46,8.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,27.66,31.53,0.1505,0.1665,15.46,8.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,28.25,30.89,0.1519,0.17,15.46,9.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,28.84,30.27,0.1533,0.1735,15.46,9.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,29.42,29.67,0.1547,0.1769,15.46,10.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,30.01,29.1,0.1561,0.1804,15.46,10.54,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0085,0.0,0.6351,30.6,28.55,0.1574,0.1839,15.46,11.04,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0268,0.0,0.6396,31.18,28.03,0.1588,0.1873,15.46,11.54,[6,7]],[1.1,"low",0.0,0.0,0.0,0.0,0.0451,0.0,0.644,31.77,27.52,0.1601,0.1908,15.46,12.04,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0633,0.0,0.6483,32.36,27.02,0.1614,0.1943,15.46,12.54,[6,7]],[2.0,"low",0.0,0.0,0.0,0.0,0.0816,0.0,0.6525,32.95,26.55,0.1627,0.1977,15.46,13.04,[6,7]],[2.5,"low",0.0,0.0,0.0,0.0,0.0998,0.0,0.6567,33.53,26.09,0.164,0.2012,15.46,13.54,[6,7]],[3.0,"low",0.0,0.0,0.0,0.0,0.1181,0.0,0.6607,34.12,25.65,0.1653,0.2047,15.46,14.04,[6,7]],[3.4,"low",0.0,0.0,0.0,0.0,0.1363,0.0,0.6646,34.71,25.22,0.1665,0.2081,15.46,14.54,[6,7]],[4.7,"low",0.0119,0.0136,0.0119,0.0119,0.1546,0.0064,0.6684,35.3,24.81,0.1678,0.2116,15.46,15.04,[6]],[7.1,"low",0.0371,0.0425,0.0371,0.0371,0.1729,0.0196,0.6722,35.89,24.41,0.169,0.2151,15.46,15.54,[6]],[9.3,"low",0.0619,0.0707,0.0619,0.0619,0.1911,0.032,0.6759,36.48,24.02,0.1703,0.2185,15.46,16.04,[6]],[11.6,"low",0.0864,0.0983,0.0864,0.0864,0.2094,0.0437,0.6795,37.07,23.65,0.1715,0.222,15.46,16.54,[6]],[13.8,"low",0.1104,0.1254,0.1104,0.1104,0.2276,0.0547,0.683,37.65,23.28,0.1727,0.2255,15.46,17.04,[6]],[16.0,"low",0.1341,0.1518,0.1341,0.1341,0.2459,0.065,0.6864,38.24,22.93,0.1739,0.229,15.46,17.54,[6]],[18.1,"low",0.1575,0.1777,0.1575,0.1575,0.2642,0.0746,0.6898,38.83,22.59,0.1751,0.2324,15.46,18.04,[6]],[20.2,"low",0.1805,0.2031,0.1805,0.1805,0.2824,0.0836,0.6931,39.42,22.26,0.1763,0.2359,15.46,18.54,[6]],[22.3,"low",0.2031,0.228,0.2031,0.2031,0.3007,0.0919,0.6963,40.01,21.93,0.1774,0.2394,15.46,19.04,[6]],[24.3,"low",0.2254,0.2523,0.2254,0.2254,0.3189,0.0996,0.6995,40.6,21.62,0.1786,0.2428,15.46,19.54,[6]],[26.3,"low",0.2475,0.2762,0.2475,0.2475,0.3372,0.1068,0.7026,41.19,21.32,0.1798,0.2463,15.46,20.04,[6]],[28.3,"low",0.2692,0.2996,0.2692,0.2692,0.3554,0.1133,0.7057,41.78,21.02,0.1809,0.2498,15.46,20.54,[6]],[30.2,"low",0.2906,0.3225,0.2906,0.2906,0.3737,0.1193,0.7086,42.37,20.73,0.182,0.2532,15.46,21.04,[6]],[32.1,"low",0.3117,0.345,0.3117,0.3117,0.392,0.1247,0.7116,42.96,20.45,0.1832,0.2567,15.46,21.54,[6]],[34.0,"low",0.3325,0.3671,0.3325,0.3325,0.4102,0.1296,0.7144,43.55,20.18,0.1843,0.2602,15.46,22.04,[6]],[35.9,"medium",0.3531,0.3887,0.3531,0.3531,0.4285,0.134,0.7173,44.14,19.91,0.1854,0.2636,15.46,22.54,[]],[37.7,"medium",0.3734,0.4099,0.3734,0.3734,0.4467,0.138,0.72,44.73,19.65,0.1865,0.2671,15.46,23.04,[]],[39.5,"medium",0.3934,0.4307,0.3934,0.3934,0.465,0.1415,0.7227,45.33,19.4,0.1876,0.2706,15.46,23.54,[]],[41.3,"medium",0.4132,0.4512,0.4132,0.4132,0.4832,0.1445,0.7254,45.92,19.16,0.1887,0.2741,15.46,24.04,[]],[43.1,"medium",0.4327,0.4712,0.4327,0.4327,0.5015,0.1471,0.728,46.51,18.92,0.1898,0.2775,15.46,24.54,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,15.49,47.29,0.1252,0.111,15.11,-0.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,16.02,45.76,0.1271,0.1147,15.11,0.39,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,16.54,44.33,0.1289,0.1184,15.11,0.89,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,17.07,42.99,0.1307,0.1221,15.11,1.39,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,17.59,41.72,0.1325,0.1258,15.11,1.89,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,18.12,40.53,0.1343,0.1295,15.11,2.39,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,18.65,39.4,0.136,0.1332,15.11,2.89,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,19.17,38.34,0.1377,0.1369,15.11,3.39,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,19.7,37.33,0.1394,0.1406,15.11,3.89,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,20.23,36.37,0.141,0.1443,15.11,4.39,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,20.76,35.46,0.1427,0.148,15.11,4.89,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,21.28,34.6,0.1443,0.1517,15.11,5.39,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,21.81,33.77,0.1459,0.1554,15.11,5.89,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,22.34,32.99,0.1474,0.1591,15.11,6.39,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,22.87,32.24,0.149,0.1628,15.11,6.89,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,23.4,31.52,0.1505,0.1665,15.11,7.39,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,23.93,30.84,0.152,0.1702,15.11,7.89,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,24.46,30.18,0.1535,0.1739,15.11,8.39,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,24.99,29.55,0.155,0.1776,15.11,8.89,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,25.52,28.95,0.1564,0.1813,15.11,9.39,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,26.05,28.37,0.1579,0.185,15.11,9.89,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.01,0.0,0.6414,26.57,27.81,0.1593,0.1887,15.11,10.39,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0295,0.0,0.6461,27.1,27.28,0.1607,0.1925,15.11,10.89,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.049,0.0,0.6506,27.64,26.77,0.1621,0.1962,15.11,11.39,[6,7]],[1.7,"low",0.0,0.0,0.0,0.0,0.0685,0.0,0.6551,28.17,26.27,0.1635,0.1999,15.11,11.89,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0879,0.0,0.6594,28.7,25.79,0.1649,0.2036,15.11,12.39,[6,7]],[2.7,"low",0.0,0.0,0.0,0.0,0.1074,0.0,0.6636,29.23,25.33,0.1662,0.2073,15.11,12.89,[6,7]],[3.7,"low",0.007,0.0081,0.007,0.007,0.1269,0.0041,0.6677,29.76,24.89,0.1675,0.211,15.11,13.39,[6]],[6.2,"low",0.034,0.039,0.034,0.034,0.1464,0.0194,0.6717,30.29,24.46,0.1689,0.2147,15.11,13.89,[6]],[8.6,"low",0.0606,0.0691,0.0606,0.0606,0.1659,0.0339,0.6757,30.82,24.04,0.1702,0.2184,15.11,14.39,[6]],[11.0,"low",0.0866,0.0986,0.0866,0.0866,0.1853,0.0476,0.6795,31.35,23.64,0.1715,0.2221,15.11,14.89,[6]],[13.4,"low",0.1123,0.1274,0.1123,0.1123,0.2048,0.0605,0.6832,31.88,23.25,0.1728,0.2258,15.11,15.39,[6]],[15.7,"low",0.1375,0.1556,0.1375,0.1375,0.2243,0.0726,0.6869,32.41,22.88,0.1741,0.2295,15.11,15.89,[6]],[18.0,"low",0.1624,0.1832,0.1624,0.1624,0.2438,0.0839,0.6905,32.95,22.52,0.1753,0.2332,15.11,16.39,[6]],[20.3,"low",0.1868,0.2101,0.1868,0.1868,0.2633,0.0946,0.694,33.48,22.16,0.1766,0.2369,15.11,16.89,[6]],[22.5,"low",0.2109,0.2364,0.2109,0.2109,0.2827,0.1045,0.6974,34.01,21.82,0.1778,0.2406,15.11,17.39,[6]],[24.6,"low",0.2346,0.2622,0.2346,0.2346,0.3022,0.1137,0.7008,34.54,21.49,0.1791,0.2443,15.11,17.89,[6]],[26.8,"low",0.2579,0.2875,0.2579,0.2579,0.3217,0.1222,0.7041,35.07,21.17,0.1803,0.248,15.11,18.39,[6]],[28.9,"low",0.2809,0.3122,0.2809,0.2809,0.3412,0.1301,0.7073,35.61,20.86,0.1815,0.2517,15.11,18.89,[6]],[30.9,"low",0.3035,0.3364,0.3035,0.3035,0.3606,0.1374,0.7104,36.14,20.56,0.1827,0.2554,15.11,19.39,[6]],[33.0,"low",0.3259,0.3601,0.3259,0.3259,0.3801,0.144,0.7135,36.67,20.27,0.1839,0.2591,15.11,19.89,[6]],[35.0,"medium",0.3479,0.3833,0.3479,0.3479,0.3996,0.1501,0.7165,37.21,19.98,0.1851,0.2628,15.11,20.39,[]],[37.0,"medium",0.3696,0.406,0.3696,0.3696,0.4191,0.1556,0.7195,37.74,19.7,0.1863,0.2665,15.11,20.89,[]],[38.9,"medium",0.391,0.4283,0.391,0.391,0.4386,0.1605,0.7224,38.27,19.43,0.1875,0.2702,15.11,21.39,[]],[40.8,"medium",0.4121,0.4501,0.4121,0.4121,0.458,0.1649,0.7252,38.8,19.17,0.1886,0.2739,15.11,21.89,[]],[42.7,"medium",0.4329,0.4715,0.4329,0.4329,0.4775,0.1688,0.728,39.34,18.91,0.1898,0.2776,15.11,22.39,[]],[44.6,"medium",0.4535,0.4925,0.4535,0.4535,0.497,0.1722,0.7308,39.87,18.67,0.1909,0.2813,15.11,22.89,[]],[46.4,"medium",0.4738,0.5131,0.4738,0.4738,0.5165,0.1751,0.7334,40.4,18.42,0.1921,0.285,15.11,23.39,[]],[48.3,"medium",0.4938,0.5333,0.4938,0.4938,0.536,0.1776,0.7361,40.94,18.19,0.1932,0.2887,15.11,23.89,[]],[50.1,"medium",0.5136,0.5531,0.5136,0.5136,0.5554,0.1796,0.7386,41.47,17.96,0.1943,0.2924,15.11,24.39,[]],[51.8,"medium",0.5331,0.5725,0.5331,0.5331,0.5749,0.1813,0.7412,42.01,17.73,0.1954,0.2961,15.11,24.89,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,14.0,44.33,0.1289,0.1184,14.77,0.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,14.47,42.9,0.1309,0.1224,14.77,0.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,14.95,41.56,0.1328,0.1263,14.77,1.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,15.42,40.3,0.1346,0.1303,14.77,1.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,15.9,39.11,0.1365,0.1342,14.77,2.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,16.37,38.0,0.1383,0.1382,14.77,2.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,16.85,36.94,0.14,0.1421,14.77,3.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,17.32,35.94,0.1418,0.1461,14.77,3.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,17.8,35.0,0.1435,0.15,14.77,4.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,18.28,34.1,0.1452,0.154,14.77,4.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,18.75,33.25,0.1469,0.1579,14.77,5.23,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,19.23,32.44,0.1486,0.1619,14.77,5.73,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,19.71,31.66,0.1502,0.1658,14.77,6.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,20.18,30.93,0.1518,0.1698,14.77,6.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,20.66,30.22,0.1534,0.1737,14.77,7.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,21.14,29.55,0.155,0.1776,14.77,7.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,21.62,28.91,0.1565,0.1816,14.77,8.23,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,22.1,28.3,0.1581,0.1855,14.77,8.73,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,22.57,27.71,0.1596,0.1895,14.77,9.23,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0095,0.0,0.6473,23.05,27.14,0.1611,0.1934,14.77,9.73,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0303,0.0,0.6521,23.53,26.6,0.1626,0.1974,14.77,10.23,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.051,0.0,0.6568,24.01,26.08,0.164,0.2013,14.77,10.73,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.0718,0.0,0.6614,24.49,25.57,0.1655,0.2053,14.77,11.23,[6,7]],[2.3,"low",0.0,0.0,0.0,0.0,0.0926,0.0,0.6658,24.97,25.09,0.1669,0.2092,14.77,11.73,[6,7]],[4.6,"low",0.0233,0.0267,0.0233,0.0233,0.1134,0.0143,0.6701,25.45,24.63,0.1683,0.2132,14.77,12.23,[6]],[7.2,"low",0.0518,0.0592,0.0518,0.0518,0.1341,0.0311,0.6744,25.93,24.18,0.1698,0.2171,14.77,12.73,[6]],[9.8,"low",0.0797,0.0908,0.0797,0.0797,0.1549,0.0471,0.6785,26.41,23.75,0.1712,0.2211,14.77,13.23,[6]],[12.3,"low",0.1072,0.1217,0.1072,0.1072,0.1757,0.0623,0.6825,26.88,23.33,0.1725,0.225,14.77,13.73,[6]],[14.8,"low",0.1342,0.1519,0.1342,0.1342,0.1965,0.0765,0.6864,27.36,22.93,0.1739,0.229,14.77,14.23,[6]],[17.3,"low",0.1607,0.1813,0.1607,0.1607,0.2173,0.09,0.6903,27.84,22.54,0.1753,0.2329,14.77,14.73,[6]],[19.7,"low",0.1868,0.2101,0.1868,0.1868,0.238,0.1026,0.694,28.32,22.16,0.1766,0.2369,14.77,15.23,[6]],[22.1,"low",0.2125,0.2382,0.2125,0.2125,0.2588,0.1144,0.6977,28.8,21.8,0.1779,0.2408,14.77,15.73,[6]],[24.4,"low",0.2377,0.2656,0.2377,0.2377,0.2796,0.1254,0.7012,29.28,21.45,0.1792,0.2448,14.77,16.23,[6]],[26.7,"low",0.2625,0.2925,0.2625,0.2625,0.3004,0.1357,0.7047,29.77,21.11,0.1806,0.2487,14.77,16.73,[6]],[28.9,"low",0.287,0.3187,0.287,0.287,0.3211,0.1453,0.7081,30.25,20.78,0.1818,0.2527,14.77,17.23,[6]],[31.1,"low",0.311,0.3443,0.311,0.311,0.3419,0.1541,0.7115,30.73,20.46,0.1831,0.2566,14.77,17.73,[6]],[33.3,"low",0.3347,0.3694,0.3347,0.3347,0.3627,0.1623,0.7147,31.21,20.15,0.1844,0.2605,14.77,18.23,[6]],[35.5,"medium",0.3581,0.3939,0.3581,0.3581,0.3835,0.1697,0.7179,31.69,19.85,0.1857,0.2645,14.77,18.73,[]],[37.6,"medium",0.381,0.4179,0.381,0.381,0.4042,0.1765,0.7211,32.17,19.56,0.1869,0.2684,14.77,19.23,[]],[39.6,"medium",0.4037,0.4414,0.4037,0.4037,0.425,0.1827,0.7241,32.65,19.27,0.1882,0.2724,14.77,19.73,[]],[41.7,"medium",0.426,0.4644,0.426,0.426,0.4458,0.1883,0.7271,33.13,19.0,0.1894,0.2763,14.77,20.23,[]],[43.7,"medium",0.448,0.487,0.448,0.448,0.4666,0.1933,0.73,33.61,18.73,0.1906,0.2803,14.77,20.73,[]],[45.7,"medium",0.4698,0.509,0.4698,0.4698,0.4874,0.1977,0.7329,34.09,18.47,0.1918,0.2842,14.77,21.23,[]],[47.6,"medium",0.4912,0.5306,0.4912,0.4912,0.5081,0.2016,0.7357,34.58,18.22,0.193,0.2882,14.77,21.73,[]],[49.6,"medium",0.5123,0.5518,0.5123,0.5123,0.5289,0.205,0.7385,35.06,17.97,0.1942,0.2921,14.77,22.23,[]],[51.5,"medium",0.5331,0.5725,0.5331,0.5331,0.5497,0.2078,0.7412,35.54,17.73,0.1954,0.2961,14.77,22.73,[]],[53.3,"medium",0.5537,0.5929,0.5537,0.5537,0.5705,0.2102,0.7438,36.02,17.5,0.1966,0.3,14.77,23.23,[]],[55.2,"medium",0.574,0.6128,0.574,0.574,0.5912,0.2121,0.7464,36.5,17.27,0.1978,0.304,14.77,23.73,[]],[57.0,"medium",0.594,0.6324,0.594,0.594,0.612,0.2136,0.749,36.99,17.05,0.1989,0.3079,14.77,24.23,[]],[58.8,"medium",0.6137,0.6515,0.6137,0.6137,0.6328,0.2147,0.7515,37.47,16.83,0.2001,0.3119,14.77,24.73,[]],[60.6,"medium",0.6333,0.6703,0.6333,0.6333,0.6536,0.2154,0.7539,37.95,16.62,0.2012,0.3158,14.77,25.23,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,12.72,41.72,0.1325,0.1258,14.46,0.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,13.15,40.38,0.1345,0.13,14.46,1.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,13.59,39.11,0.1365,0.1342,14.46,1.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,14.02,37.93,0.1384,0.1384,14.46,2.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,14.45,36.81,0.1403,0.1426,14.46,2.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,14.88,35.76,0.1421,0.1468,14.46,3.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,15.32,34.77,0.144,0.151,14.46,3.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,15.75,33.83,0.1458,0.1552,14.46,4.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,16.18,32.94,0.1475,0.1594,14.46,4.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,16.61,32.09,0.1493,0.1636,14.46,5.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,17.05,31.29,0.151,0.1678,14.46,5.54,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,17.48,30.53,0.1527,0.172,14.46,6.04,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,17.91,29.8,0.1544,0.1762,14.46,6.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,18.35,29.11,0.156,0.1804,14.46,7.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,18.78,28.45,0.1577,0.1846,14.46,7.54,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,19.22,27.81,0.1593,0.1887,14.46,8.04,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,19.65,27.21,0.1609,0.1929,14.46,8.54,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0043,0.0,0.6518,20.09,26.63,0.1625,0.1971,14.46,9.04,[6,7]],[0.7,"low",0.0,0.0,0.0,0.0,0.0264,0.0,0.6568,20.52,26.08,0.164,0.2013,14.46,9.54,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0484,0.0,0.6616,20.96,25.54,0.1656,0.2055,14.46,10.04,[6,7]],[1.8,"low",0.0,0.0,0.0,0.0,0.0705,0.0,0.6664,21.39,25.03,0.1671,0.2097,14.46,10.54,[6,7]],[4.5,"low",0.0287,0.0329,0.0287,0.0287,0.0926,0.0184,0.6709,21.83,24.54,0.1686,0.2139,14.46,11.04,[6]],[7.3,"low",0.0588,0.0672,0.0588,0.0588,0.1147,0.0372,0.6754,22.26,24.07,0.1701,0.2181,14.46,11.54,[6]],[10.0,"low",0.0884,0.1006,0.0884,0.0884,0.1367,0.055,0.6798,22.7,23.62,0.1716,0.2223,14.46,12.04,[6]],[12.7,"low",0.1174,0.1331,0.1174,0.1174,0.1588,0.0718,0.684,23.13,23.18,0.173,0.2265,14.46,12.54,[6]],[15.4,"low",0.1459,0.1649,0.1459,0.1459,0.1809,0.0877,0.6881,23.57,22.76,0.1745,0.2307,14.46,13.04,[6]],[18.0,"low",0.1738,0.1958,0.1738,0.1738,0.203,0.1028,0.6921,24.0,22.35,0.1759,0.2349,14.46,13.54,[6]],[20.5,"low",0.2013,0.226,0.2013,0.2013,0.225,0.1169,0.6961,24.44,21.96,0.1773,0.2391,14.46,14.04,[6]],[23.0,"low",0.2283,0.2554,0.2283,0.2283,0.2471,0.1302,0.6999,24.88,21.58,0.1788,0.2433,14.46,14.54,[6]],[25.5,"low",0.2548,0.2841,0.2548,0.2548,0.2692,0.1426,0.7036,25.31,21.21,0.1801,0.2475,14.46,15.04,[6]],[27.9,"low",0.2809,0.3122,0.2809,0.2809,0.2913,0.1542,0.7073,25.75,20.86,0.1815,0.2517,14.46,15.54,[6]],[30.2,"low",0.3065,0.3396,0.3065,0.3065,0.3133,0.165,0.7109,26.18,20.52,0.1829,0.2559,14.46,16.04,[6]],[32.6,"low",0.3318,0.3663,0.3318,0.3318,0.3354,0.1751,0.7143,26.62,20.19,0.1842,0.2601,14.46,16.54,[6]],[34.9,"low",0.3566,0.3924,0.3566,0.3566,0.3575,0.1844,0.7177,27.06,19.87,0.1856,0.2642,14.46,17.04,[6]],[37.1,"medium",0.381,0.4179,0.381,0.381,0.3796,0.1929,0.7211,27.49,19.56,0.1869,0.2684,14.46,17.54,[]],[39.3,"medium",0.4051,0.4429,0.4051,0.4051,0.4017,0.2007,0.7243,27.93,19.26,0.1882,0.2726,14.46,18.04,[]],[41.5,"medium",0.4288,0.4673,0.4288,0.4288,0.4237,0.2079,0.7275,28.37,18.96,0.1896,0.2768,14.46,18.54,[]],[43.6,"medium",0.4521,0.4911,0.4521,0.4521,0.4458,0.2143,0.7306,28.81,18.68,0.1909,0.281,14.46,19.04,[]],[45.8,"medium",0.4751,0.5145,0.4751,0.4751,0.4679,0.2201,0.7336,29.24,18.41,0.1921,0.2852,14.46,19.54,[]],[47.8,"medium",0.4978,0.5373,0.4978,0.4978,0.49,0.2253,0.7366,29.68,18.14,0.1934,0.2894,14.46,20.04,[]],[49.9,"medium",0.5201,0.5596,0.5201,0.5201,0.512,0.2299,0.7395,30.12,17.88,0.1947,0.2936,14.46,20.54,[]],[51.9,"medium",0.5421,0.5815,0.5421,0.5421,0.5341,0.2339,0.7423,30.56,17.63,0.1959,0.2978,14.46,21.04,[]],[53.9,"medium",0.5638,0.6029,0.5638,0.5638,0.5562,0.2373,0.7451,30.99,17.38,0.1972,0.302,14.46,21.54,[]],[55.9,"medium",0.5852,0.6238,0.5852,0.5852,0.5783,0.2402,0.7479,31.43,17.15,0.1984,0.3062,14.46,22.04,[]],[57.8,"medium",0.6064,0.6444,0.6064,0.6064,0.6003,0.2426,0.7505,31.87,16.91,0.1997,0.3104,14.46,22.54,[]],[59.7,"medium",0.6272,0.6645,0.6272,0.6272,0.6224,0.2445,0.7531,32.31,16.69,0.2009,0.3146,14.46,23.04,[]],[61.6,"medium",0.6477,0.6842,0.6477,0.6477,0.6445,0.2459,0.7557,32.75,16.47,0.2021,0.3188,14.46,23.54,[]],[63.4,"medium",0.668,0.7035,0.668,0.668,0.6666,0.2469,0.7582,33.18,16.26,0.2033,0.323,14.46,24.04,[]],[65.3,"critical",0.6881,0.7224,0.6881,0.6881,0.6886,0.2474,0.7607,33.62,16.05,0.2045,0.3272,14.46,24.54,[]],[67.1,"critical",0.7078,0.741,0.7078,0.7078,0.7107,0.2476,0.7631,34.06,15.84,0.2057,0.3314,14.46,25.04,[]],[68.9,"critical",0.7274,0.7592,0.7274,0.7274,0.7328,0.2473,0.7655,34.5,15.65,0.2069,0.3356,14.46,25.54,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,11.63,39.4,0.136,0.1332,14.18,0.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,12.02,38.13,0.138,0.1377,14.18,1.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,12.42,36.94,0.14,0.1421,14.18,1.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,12.81,35.82,0.142,0.1466,14.18,2.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,13.21,34.77,0.144,0.151,14.18,2.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,13.6,33.78,0.1459,0.1554,14.18,3.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,14.0,32.84,0.1477,0.1599,14.18,3.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,14.39,31.95,0.1496,0.1643,14.18,4.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,14.79,31.11,0.1514,0.1688,14.18,4.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,15.19,30.31,0.1532,0.1732,14.18,5.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,15.58,29.55,0.155,0.1776,14.18,5.82,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,15.98,28.83,0.1567,0.1821,14.18,6.32,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,16.37,28.15,0.1584,0.1865,14.18,6.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,16.77,27.49,0.1601,0.191,14.18,7.32,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,17.17,26.87,0.1618,0.1954,14.18,7.82,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,17.56,26.27,0.1635,0.1999,14.18,8.32,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0178,0.0,0.6602,17.96,25.7,0.1651,0.2043,14.18,8.82,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0411,0.0,0.6653,18.36,25.15,0.1667,0.2087,14.18,9.32,[6,7]],[3.4,"low",0.0233,0.0267,0.0233,0.0233,0.0645,0.0156,0.6701,18.76,24.63,0.1683,0.2132,14.18,9.82,[6]],[6.4,"low",0.0553,0.0632,0.0553,0.0553,0.0879,0.0366,0.6749,19.15,24.12,0.1699,0.2176,14.18,10.32,[6]],[9.3,"low",0.0866,0.0986,0.0866,0.0866,0.1113,0.0565,0.6795,19.55,23.64,0.1715,0.2221,14.18,10.82,[6]],[12.1,"low",0.1174,0.1331,0.1174,0.1174,0.1346,0.0754,0.684,19.95,23.18,0.173,0.2265,14.18,11.32,[6]],[14.9,"low",0.1475,0.1667,0.1475,0.1475,0.158,0.0932,0.6884,20.35,22.73,0.1746,0.2309,14.18,11.82,[6]],[17.7,"low",0.1771,0.1994,0.1771,0.1771,0.1814,0.1101,0.6926,20.74,22.3,0.1761,0.2354,14.18,12.32,[6]],[20.4,"low",0.2061,0.2312,0.2061,0.2061,0.2048,0.1261,0.6968,21.14,21.89,0.1776,0.2398,14.18,12.82,[6]],[23.1,"low",0.2346,0.2622,0.2346,0.2346,0.2281,0.1411,0.7008,21.54,21.49,0.1791,0.2443,14.18,13.32,[6]],[25.7,"low",0.2625,0.2925,0.2625,0.2625,0.2515,0.1552,0.7047,21.94,21.11,0.1806,0.2487,14.18,13.82,[6]],[28.2,"low",0.29,0.3219,0.29,0.29,0.2749,0.1684,0.7086,22.34,20.74,0.182,0.2531,14.18,14.32,[6]],[30.7,"low",0.317,0.3506,0.317,0.317,0.2983,0.1808,0.7123,22.74,20.38,0.1835,0.2576,14.18,14.82,[6]],[33.2,"low",0.3435,0.3787,0.3435,0.3435,0.3216,0.1923,0.7159,23.14,20.04,0.1849,0.262,14.18,15.32,[6]],[35.6,"medium",0.3696,0.406,0.3696,0.3696,0.345,0.2029,0.7195,23.53,19.7,0.1863,0.2665,14.18,15.82,[]],[38.0,"medium",0.3952,0.4327,0.3952,0.3952,0.3684,0.2128,0.723,23.93,19.38,0.1877,0.2709,14.18,16.32,[]],[40.3,"medium",0.4205,0.4587,0.4205,0.4205,0.3918,0.2219,0.7264,24.33,19.07,0.1891,0.2754,14.18,16.82,[]],[42.6,"medium",0.4453,0.4842,0.4453,0.4453,0.4151,0.2302,0.7297,24.73,18.76,0.1905,0.2798,14.18,17.32,[]],[44.9,"medium",0.4698,0.509,0.4698,0.4698,0.4385,0.2378,0.7329,25.13,18.47,0.1918,0.2842,14.18,17.82,[]],[47.1,"medium",0.4938,0.5333,0.4938,0.4938,0.4619,0.2447,0.7361,25.53,18.19,0.1932,0.2887,14.18,18.32,[]],[49.3,"medium",0.5175,0.557,0.5175,0.5175,0.4853,0.2509,0.7392,25.93,17.91,0.1945,0.2931,14.18,18.82,[]],[51.4,"medium",0.5408,0.5802,0.5408,0.5408,0.5086,0.2564,0.7422,26.33,17.64,0.1959,0.2976,14.18,19.32,[]],[53.5,"medium",0.5638,0.6029,0.5638,0.5638,0.532,0.2612,0.7451,26.73,17.38,0.1972,0.302,14.18,19.82,[]],[55.6,"medium",0.5865,0.6251,0.5865,0.5865,0.5554,0.2655,0.748,27.13,17.13,0.1985,0.3064,14.18,20.32,[]],[57.7,"medium",0.6088,0.6468,0.6088,0.6088,0.5788,0.2691,0.7508,27.53,16.89,0.1998,0.3109,14.18,20.82,[]],[59.7,"medium",0.6308,0.668,0.6308,0.6308,0.6021,0.2722,0.7536,27.93,16.65,0.2011,0.3153,14.18,21.32,[]],[61.7,"medium",0.6525,0.6888,0.6525,0.6525,0.6255,0.2747,0.7563,28.33,16.42,0.2024,0.3198,14.18,21.82,[]],[63.7,"medium",0.674,0.7091,0.674,0.674,0.6489,0.2766,0.7589,28.73,16.19,0.2036,0.3242,14.18,22.32,[]],[65.6,"critical",0.6951,0.729,0.6951,0.6951,0.6723,0.2781,0.7615,29.13,15.97,0.2049,0.3286,14.18,22.82,[]],[67.5,"critical",0.7159,0.7485,0.7159,0.7159,0.6956,0.2791,0.7641,29.53,15.76,0.2062,0.3331,14.18,23.32,[]],[69.4,"critical",0.7365,0.7676,0.7365,0.7365,0.719,0.2796,0.7666,29.93,15.55,0.2074,0.3375,14.18,23.82,[]],[71.3,"critical",0.7567,0.7863,0.7567,0.7567,0.7424,0.2797,0.769,30.33,15.35,0.2086,0.342,14.18,24.32,[]],[73.1,"critical",0.7768,0.8047,0.7768,0.7768,0.7658,0.2793,0.7714,30.73,15.16,0.2099,0.3464,14.18,24.82,[]],[74.9,"critical",0.7965,0.8226,0.7965,0.7965,0.7891,0.2786,0.7737,31.13,14.96,0.2111,0.3509,14.18,25.32,[]],[76.7,"critical",0.8161,0.8403,0.8161,0.8161,0.8125,0.2775,0.776,31.53,14.78,0.2123,0.3553,14.18,25.82,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,10.68,37.33,0.1394,0.1406,13.91,1.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,11.04,36.13,0.1415,0.1453,13.91,1.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,11.41,35.0,0.1435,0.15,13.91,2.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,11.77,33.94,0.1455,0.1547,13.91,2.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,12.13,32.94,0.1475,0.1594,13.91,3.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,12.49,32.0,0.1495,0.1641,13.91,3.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,12.86,31.11,0.1514,0.1688,13.91,4.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,13.22,30.27,0.1533,0.1735,13.91,4.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,13.58,29.47,0.1552,0.1781,13.91,5.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,13.95,28.72,0.157,0.1828,13.91,5.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,14.31,28.0,0.1588,0.1875,13.91,6.09,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,14.68,27.31,0.1606,0.1922,13.91,6.59,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,15.04,26.66,0.1624,0.1969,13.91,7.09,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,15.4,26.04,0.1641,0.2016,13.91,7.59,[6,7]],[0.1,"low",0.0,0.0,0.0,0.0,0.0045,0.0,0.6625,15.77,25.45,0.1658,0.2063,13.91,8.09,[6,7]],[1.3,"low",0.007,0.0081,0.007,0.007,0.0291,0.0049,0.6677,16.13,24.89,0.1675,0.211,13.91,8.59,[6]],[4.5,"low",0.0412,0.0471,0.0412,0.0412,0.0538,0.0284,0.6728,16.5,24.35,0.1692,0.2156,13.91,9.09,[6]],[7.6,"low",0.0745,0.085,0.0745,0.0745,0.0785,0.0507,0.6777,16.86,23.83,0.1709,0.2203,13.91,9.59,[6]],[10.6,"low",0.1072,0.1217,0.1072,0.1072,0.1032,0.0719,0.6825,17.23,23.33,0.1725,0.225,13.91,10.09,[6]],[13.6,"low",0.1392,0.1575,0.1392,0.1392,0.1278,0.0921,0.6872,17.59,22.86,0.1742,0.2297,13.91,10.59,[6]],[16.6,"low",0.1706,0.1922,0.1706,0.1706,0.1525,0.1112,0.6917,17.96,22.4,0.1758,0.2344,13.91,11.09,[6]],[19.4,"low",0.2013,0.226,0.2013,0.2013,0.1772,0.1292,0.6961,18.32,21.96,0.1773,0.2391,13.91,11.59,[6]],[22.2,"low",0.2314,0.2588,0.2314,0.2314,0.2018,0.1463,0.7003,18.69,21.54,0.1789,0.2438,13.91,12.09,[6]],[25.0,"low",0.261,0.2908,0.261,0.261,0.2265,0.1623,0.7045,19.05,21.13,0.1805,0.2485,13.91,12.59,[6]],[27.7,"low",0.29,0.3219,0.29,0.29,0.2512,0.1774,0.7086,19.42,20.74,0.182,0.2531,13.91,13.09,[6]],[30.4,"low",0.3185,0.3522,0.3185,0.3185,0.2759,0.1916,0.7125,19.78,20.36,0.1835,0.2578,13.91,13.59,[6]],[33.0,"low",0.3464,0.3817,0.3464,0.3464,0.3005,0.2048,0.7163,20.15,20.0,0.185,0.2625,13.91,14.09,[6]],[35.5,"medium",0.3739,0.4105,0.3739,0.3739,0.3252,0.2172,0.7201,20.52,19.65,0.1865,0.2672,13.91,14.59,[]],[38.0,"medium",0.4009,0.4385,0.4009,0.4009,0.3499,0.2286,0.7237,20.88,19.31,0.188,0.2719,13.91,15.09,[]],[40.5,"medium",0.4274,0.4659,0.4274,0.4274,0.3746,0.2392,0.7273,21.25,18.98,0.1895,0.2766,13.91,15.59,[]],[42.9,"medium",0.4535,0.4925,0.4535,0.4535,0.3992,0.249,0.7308,21.62,18.67,0.1909,0.2813,13.91,16.09,[]],[45.3,"medium",0.4792,0.5185,0.4792,0.4792,0.4239,0.258,0.7341,21.98,18.36,0.1924,0.286,13.91,16.59,[]],[47.7,"medium",0.5044,0.5439,0.5044,0.5044,0.4486,0.2662,0.7375,22.35,18.06,0.1938,0.2906,13.91,17.09,[]],[50.0,"medium",0.5292,0.5687,0.5292,0.5292,0.4732,0.2736,0.7407,22.72,17.78,0.1952,0.2953,13.91,17.59,[]],[52.2,"medium",0.5537,0.5929,0.5537,0.5537,0.4979,0.2803,0.7438,23.08,17.5,0.1966,0.3,13.91,18.09,[]],[54.4,"medium",0.5777,0.6165,0.5777,0.5777,0.5226,0.2863,0.7469,23.45,17.23,0.198,0.3047,13.91,18.59,[]],[56.6,"medium",0.6014,0.6396,0.6014,0.6014,0.5473,0.2915,0.7499,23.82,16.97,0.1994,0.3094,13.91,19.09,[]],[58.8,"medium",0.6248,0.6621,0.6248,0.6248,0.5719,0.2961,0.7528,24.18,16.72,0.2007,0.3141,13.91,19.59,[]],[60.9,"medium",0.6477,0.6842,0.6477,0.6477,0.5966,0.3001,0.7557,24.55,16.47,0.2021,0.3188,13.91,20.09,[]],[63.0,"medium",0.6704,0.7057,0.6704,0.6704,0.6213,0.3035,0.7585,24.92,16.23,0.2034,0.3235,13.91,20.59,[]],[65.1,"critical",0.6927,0.7268,0.6927,0.6927,0.646,0.3062,0.7613,25.28,16.0,0.2048,0.3282,13.91,21.09,[]],[67.1,"critical",0.7147,0.7474,0.7147,0.7147,0.6706,0.3084,0.7639,25.65,15.77,0.2061,0.3328,13.91,21.59,[]],[69.1,"critical",0.7365,0.7676,0.7365,0.7365,0.6953,0.31,0.7666,26.02,15.55,0.2074,0.3375,13.91,22.09,[]],[71.1,"critical",0.7579,0.7874,0.7579,0.7579,0.72,0.3111,0.7691,26.39,15.34,0.2087,0.3422,13.91,22.59,[]],[73.1,"critical",0.779,0.8067,0.779,0.779,0.7447,0.3117,0.7716,26.75,15.13,0.21,0.3469,13.91,23.09,[]],[75.0,"critical",0.7998,0.8256,0.7998,0.7998,0.7693,0.3118,0.7741,27.12,14.93,0.2113,0.3516,13.91,23.59,[]],[76.9,"critical",0.8204,0.8441,0.8204,0.8204,0.794,0.3115,0.7765,27.49,14.74,0.2126,0.3563,13.91,24.09,[]],[78.8,"critical",0.8407,0.8623,0.8407,0.8407,0.8187,0.3107,0.7789,27.86,14.54,0.2138,0.361,13.91,24.59,[]],[80.6,"critical",0.8607,0.88,0.8607,0.8607,0.8433,0.3095,0.7812,28.23,14.36,0.2151,0.3657,13.91,25.09,[]],[82.4,"critical",0.8804,0.8975,0.8804,0.8804,0.868,0.308,0.7835,28.59,14.18,0.2163,0.3703,13.91,25.59,[]],[84.2,"critical",0.9,0.9145,0.9,0.9,0.8927,0.306,0.7857,28.96,14.0,0.2176,0.375,13.91,26.09,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,9.85,35.46,0.1427,0.148,13.66,1.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,10.19,34.32,0.1448,0.153,13.66,1.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,10.52,33.25,0.1469,0.1579,13.66,2.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,10.86,32.24,0.149,0.1628,13.66,2.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,11.19,31.29,0.151,0.1678,13.66,3.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,11.53,30.4,0.153,0.1727,13.66,3.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,11.86,29.55,0.155,0.1776,13.66,4.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,12.2,28.75,0.1569,0.1826,13.66,4.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,12.53,28.0,0.1588,0.1875,13.66,5.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,12.87,27.28,0.1607,0.1925,13.66,5.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,13.2,26.6,0.1626,0.1974,13.66,6.34,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,13.54,25.95,0.1644,0.2023,13.66,6.84,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,13.87,25.33,0.1662,0.2073,13.66,7.34,[6,7]],[1.5,"low",0.0161,0.0185,0.0161,0.0161,0.0124,0.0115,0.6691,14.21,24.74,0.168,0.2122,13.66,7.84,[6]],[4.9,"low",0.0518,0.0592,0.0518,0.0518,0.0383,0.0366,0.6744,14.55,24.18,0.1698,0.2171,13.66,8.34,[6]],[8.1,"low",0.0866,0.0986,0.0866,0.0866,0.0643,0.0606,0.6795,14.88,23.64,0.1715,0.2221,13.66,8.84,[6]],[11.3,"low",0.1208,0.1369,0.1208,0.1208,0.0903,0.0833,0.6845,15.22,23.13,0.1732,0.227,13.66,9.34,[6]],[14.5,"low",0.1541,0.174,0.1541,0.1541,0.1162,0.1049,0.6893,15.55,22.64,0.1749,0.2319,13.66,9.84,[6]],[17.5,"low",0.1868,0.2101,0.1868,0.1868,0.1422,0.1254,0.694,15.89,22.16,0.1766,0.2369,13.66,10.34,[6]],[20.5,"low",0.2188,0.2451,0.2188,0.2188,0.1682,0.1447,0.6986,16.23,21.71,0.1783,0.2418,13.66,10.84,[6]],[23.5,"low",0.2502,0.2791,0.2502,0.2502,0.1942,0.1631,0.703,16.57,21.28,0.1799,0.2467,13.66,11.34,[6]],[26.3,"low",0.2809,0.3122,0.2809,0.2809,0.2201,0.1803,0.7073,16.9,20.86,0.1815,0.2517,13.66,11.84,[6]],[29.2,"low",0.311,0.3443,0.311,0.311,0.2461,0.1966,0.7115,17.24,20.46,0.1831,0.2566,13.66,12.34,[6]],[31.9,"low",0.3406,0.3756,0.3406,0.3406,0.2721,0.2118,0.7155,17.58,20.07,0.1847,0.2615,13.66,12.84,[6]],[34.6,"low",0.3696,0.406,0.3696,0.3696,0.298,0.2261,0.7195,17.91,19.7,0.1863,0.2665,13.66,13.34,[6]],[37.3,"medium",0.3981,0.4356,0.3981,0.3981,0.324,0.2395,0.7234,18.25,19.34,0.1879,0.2714,13.66,13.84,[]],[39.9,"medium",0.426,0.4644,0.426,0.426,0.35,0.2519,0.7271,18.59,19.0,0.1894,0.2763,13.66,14.34,[]],[42.5,"medium",0.4535,0.4925,0.4535,0.4535,0.376,0.2634,0.7308,18.93,18.67,0.1909,0.2813,13.66,14.84,[]],[45.0,"medium",0.4805,0.5199,0.4805,0.4805,0.4019,0.274,0.7343,19.26,18.34,0.1924,0.2862,13.66,15.34,[]],[47.5,"medium",0.507,0.5465,0.507,0.507,0.4279,0.2838,0.7378,19.6,18.03,0.1939,0.2911,13.66,15.84,[]],[49.9,"medium",0.5331,0.5725,0.5331,0.5331,0.4539,0.2927,0.7412,19.94,17.73,0.1954,0.2961,13.66,16.34,[]],[52.3,"medium",0.5588,0.5979,0.5588,0.5588,0.4798,0.3009,0.7445,20.28,17.44,0.1969,0.301,13.66,16.84,[]],[54.7,"medium",0.584,0.6226,0.584,0.584,0.5058,0.3082,0.7477,20.62,17.16,0.1984,0.3059,13.66,17.34,[]],[57.0,"medium",0.6088,0.6468,0.6088,0.6088,0.5318,0.3148,0.7508,20.95,16.89,0.1998,0.3109,13.66,17.84,[]],[59.2,"medium",0.6333,0.6703,0.6333,0.6333,0.5578,0.3206,0.7539,21.29,16.62,0.2012,0.3158,13.66,18.34,[]],[61.5,"medium",0.6573,0.6933,0.6573,0.6573,0.5837,0.3257,0.7569,21.63,16.37,0.2027,0.3208,13.66,18.84,[]],[63.7,"medium",0.681,0.7158,0.681,0.681,0.6097,0.3301,0.7598,21.97,16.12,0.2041,0.3257,13.66,19.34,[]],[65.9,"critical",0.7044,0.7377,0.7044,0.7044,0.6357,0.3339,0.7627,22.31,15.88,0.2055,0.3306,13.66,19.84,[]],[68.0,"critical",0.7274,0.7592,0.7274,0.7274,0.6616,0.337,0.7655,22.65,15.65,0.2069,0.3356,13.66,20.34,[]],[70.1,"critical",0.75,0.7801,0.75,0.75,0.6876,0.3395,0.7682,22.99,15.42,0.2082,0.3405,13.66,20.84,[]],[72.2,"critical",0.7723,0.8006,0.7723,0.7723,0.7136,0.3414,0.7709,23.32,15.2,0.2096,0.3454,13.66,21.34,[]],[74.2,"critical",0.7944,0.8207,0.7944,0.7944,0.7396,0.3427,0.7735,23.66,14.98,0.2109,0.3504,13.66,21.84,[]],[76.2,"critical",0.8161,0.8403,0.8161,0.8161,0.7655,0.3435,0.776,24.0,14.78,0.2123,0.3553,13.66,22.34,[]],[78.2,"critical",0.8375,0.8594,0.8375,0.8375,0.7915,0.3438,0.7785,24.34,14.57,0.2136,0.3602,13.66,22.84,[]],[80.2,"critical",0.8586,0.8782,0.8586,0.8586,0.8175,0.3435,0.781,24.68,14.38,0.2149,0.3652,13.66,23.34,[]],[82.1,"critical",0.8794,0.8966,0.8794,0.8794,0.8434,0.3428,0.7833,25.02,14.19,0.2163,0.3701,13.66,23.84,[]],[84.0,"critical",0.9,0.9145,0.9,0.9,0.8694,0.3417,0.7857,25.36,14.0,0.2176,0.375,13.66,24.34,[]],[85.9,"critical",0.9203,0.9321,0.9203,0.9203,0.8954,0.3401,0.788,25.7,13.82,0.2189,0.38,13.66,24.84,[]],[87.8,"critical",0.9403,0.9494,0.9403,0.9403,0.9214,0.3381,0.7902,26.04,13.64,0.2201,0.3849,13.66,25.34,[]],[89.6,"critical",0.9601,0.9663,0.9601,0.9601,0.9473,0.3358,0.7924,26.38,13.47,0.2214,0.3898,13.66,25.84,[]],[91.4,"critical",0.9796,0.9828,0.9796,0.9796,0.9733,0.3331,0.7946,26.72,13.3,0.2227,0.3948,13.66,26.34,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,9.65,35.01,0.1435,0.15,13.6,1.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,9.98,33.88,0.1457,0.155,13.6,1.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,10.31,32.82,0.1478,0.16,13.6,2.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,10.64,31.83,0.1498,0.165,13.6,2.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,10.97,30.89,0.1519,0.17,13.6,3.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,11.29,30.01,0.1539,0.175,13.6,3.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,11.62,29.17,0.1559,0.18,13.6,4.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,11.95,28.39,0.1578,0.185,13.6,4.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,12.28,27.64,0.1598,0.19,13.6,5.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,12.61,26.93,0.1617,0.195,13.6,5.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,12.94,26.26,0.1635,0.2,13.6,6.4,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,13.27,25.62,0.1654,0.2049,13.6,6.9,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,13.59,25.01,0.1672,0.2099,13.6,7.4,[6,7]],[3.3,"low",0.0361,0.0414,0.0361,0.0361,0.0209,0.0259,0.672,13.92,24.42,0.169,0.2149,13.6,7.9,[6]],[6.6,"low",0.0718,0.0819,0.0718,0.0718,0.0472,0.0508,0.6773,14.25,23.87,0.1708,0.2199,13.6,8.4,[6]],[9.9,"low",0.1067,0.1212,0.1067,0.1067,0.0735,0.0746,0.6824,14.58,23.34,0.1725,0.2249,13.6,8.9,[6]],[13.1,"low",0.1408,0.1592,0.1408,0.1408,0.0998,0.0971,0.6874,14.91,22.83,0.1742,0.2299,13.6,9.4,[6]],[16.2,"low",0.1742,0.1962,0.1742,0.1742,0.1261,0.1185,0.6922,15.24,22.35,0.1759,0.2349,13.6,9.9,[6]],[19.3,"low",0.2068,0.2321,0.2068,0.2068,0.1524,0.1388,0.6969,15.57,21.88,0.1776,0.2399,13.6,10.4,[6]],[22.3,"low",0.2388,0.2669,0.2388,0.2388,0.1787,0.158,0.7014,15.9,21.43,0.1793,0.2449,13.6,10.9,[6]],[25.2,"low",0.2702,0.3007,0.2702,0.2702,0.2051,0.1761,0.7058,16.23,21.01,0.181,0.2499,13.6,11.4,[6]],[28.1,"low",0.3009,0.3336,0.3009,0.3009,0.2314,0.1932,0.7101,16.56,20.59,0.1826,0.2549,13.6,11.9,[6]],[30.9,"low",0.3311,0.3655,0.3311,0.3311,0.2577,0.2093,0.7142,16.89,20.2,0.1842,0.2599,13.6,12.4,[6]],[33.7,"low",0.3606,0.3966,0.3606,0.3606,0.284,0.2243,0.7183,17.22,19.82,0.1858,0.2649,13.6,12.9,[6]],[36.4,"medium",0.3896,0.4269,0.3896,0.3896,0.3103,0.2384,0.7222,17.55,19.45,0.1874,0.2699,13.6,13.4,[]],[39.1,"medium",0.4181,0.4563,0.4181,0.4181,0.3366,0.2515,0.726,17.88,19.1,0.189,0.2749,13.6,13.9,[]],[41.7,"medium",0.4461,0.485,0.4461,0.4461,0.3629,0.2637,0.7298,18.21,18.75,0.1905,0.2799,13.6,14.4,[]],[44.2,"medium",0.4735,0.5129,0.4735,0.4735,0.3892,0.275,0.7334,18.55,18.43,0.192,0.2849,13.6,14.9,[]],[46.8,"medium",0.5005,0.54,0.5005,0.5005,0.4155,0.2854,0.7369,18.88,18.11,0.1936,0.2899,13.6,15.4,[]],[49.2,"medium",0.5271,0.5665,0.5271,0.5271,0.4418,0.295,0.7404,19.21,17.8,0.1951,0.2949,13.6,15.9,[]],[51.7,"medium",0.5532,0.5924,0.5532,0.5532,0.4681,0.3037,0.7438,19.54,17.5,0.1966,0.2999,13.6,16.4,[]],[54.1,"medium",0.5788,0.6176,0.5788,0.5788,0.4945,0.3116,0.747,19.87,17.22,0.1981,0.3049,13.6,16.9,[]],[56.4,"medium",0.604,0.6421,0.604,0.604,0.5208,0.3188,0.7502,20.2,16.94,0.1995,0.3099,13.6,17.4,[]],[58.7,"medium",0.6289,0.6661,0.6289,0.6289,0.5471,0.3251,0.7534,20.53,16.67,0.201,0.3149,13.6,17.9,[]],[61.0,"medium",0.6533,0.6895,0.6533,0.6533,0.5734,0.3307,0.7564,20.86,16.41,0.2024,0.3199,13.6,18.4,[]],[63.3,"medium",0.6774,0.7123,0.6774,0.6774,0.5997,0.3356,0.7594,21.2,16.16,0.2038,0.3249,13.6,18.9,[]],[65.5,"critical",0.7011,0.7346,0.7011,0.7011,0.626,0.3398,0.7623,21.53,15.91,0.2053,0.3299,13.6,19.4,[]],[67.6,"critical",0.7244,0.7564,0.7244,0.7244,0.6523,0.3434,0.7651,21.86,15.68,0.2067,0.3349,13.6,19.9,[]],[69.8,"critical",0.7474,0.7777,0.7474,0.7474,0.6786,0.3463,0.7679,22.19,15.44,0.2081,0.3399,13.6,20.4,[]],[71.9,"critical",0.7701,0.7985,0.7701,0.7701,0.7049,0.3486,0.7706,22.52,15.22,0.2095,0.3449,13.6,20.9,[]],[74.0,"critical",0.7924,0.8189,0.7924,0.7924,0.7312,0.3502,0.7732,22.86,15.0,0.2108,0.3499,13.6,21.4,[]],[76.0,"critical",0.8144,0.8388,0.8144,0.8144,0.7575,0.3514,0.7758,23.19,14.79,0.2122,0.3549,13.6,21.9,[]],[78.0,"critical",0.8361,0.8582,0.8361,0.8361,0.7839,0.3519,0.7784,23.52,14.59,0.2135,0.3599,13.6,22.4,[]],[80.0,"critical",0.8575,0.8772,0.8575,0.8575,0.8102,0.352,0.7808,23.85,14.39,0.2149,0.3649,13.6,22.9,[]],[82.0,"critical",0.8786,0.8959,0.8786,0.8786,0.8365,0.3515,0.7833,24.18,14.19,0.2162,0.3699,13.6,23.4,[]],[83.9,"critical",0.8995,0.9141,0.8995,0.8995,0.8628,0.3506,0.7856,24.52,14.0,0.2175,0.3749,13.6,23.9,[]],[85.8,"critical",0.92,0.9319,0.92,0.92,0.8891,0.3493,0.788,24.85,13.82,0.2188,0.3799,13.6,24.4,[]],[87.7,"critical",0.9403,0.9494,0.9403,0.9403,0.9154,0.3475,0.7902,25.18,13.64,0.2201,0.3849,13.6,24.9,[]],[89.6,"critical",0.9603,0.9665,0.9603,0.9603,0.9417,0.3454,0.7925,25.51,13.46,0.2214,0.3899,13.6,25.4,[]],[91.4,"critical",0.9801,0.9833,0.9801,0.9801,0.968,0.3428,0.7946,25.85,13.29,0.2227,0.3949,13.6,25.9,[]],[93.2,"critical",0.9996,0.9997,0.9996,0.9996,0.9943,0.3399,0.7968,26.18,13.13,0.224,0.3999,13.6,26.4,[]]]],"SIBAL":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,14.66,70.93,0.1041,0.074,33.55,-18.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,15.15,68.64,0.1057,0.0765,33.55,-18.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,15.65,66.49,0.1072,0.079,33.55,-17.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,16.15,64.48,0.1088,0.0814,33.55,-17.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,16.65,62.58,0.1102,0.0839,33.55,-16.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,17.15,60.8,0.1117,0.0864,33.55,-16.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,17.64,59.11,0.1131,0.0888,33.55,-15.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,18.14,57.51,0.1145,0.0913,33.55,-15.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,18.64,56.0,0.1159,0.0938,33.55,-14.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,19.14,54.56,0.1173,0.0962,33.55,-14.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,19.64,53.2,0.1187,0.0987,33.55,-13.55,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,20.14,51.9,0.12,0.1012,33.55,-13.05,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,20.64,50.66,0.1213,0.1036,33.55,-12.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,21.14,49.48,0.1226,0.1061,33.55,-12.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,21.64,48.36,0.1239,0.1086,33.55,-11.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,22.14,47.29,0.1252,0.111,33.55,-11.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,22.64,46.26,0.1265,0.1135,33.55,-10.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,23.14,45.27,0.1277,0.116,33.55,-10.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,23.64,44.33,0.1289,0.1184,33.55,-9.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,24.14,43.43,0.1301,0.1209,33.55,-9.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,24.64,42.56,0.1313,0.1234,33.55,-8.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,25.14,41.72,0.1325,0.1258,33.55,-8.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,25.65,40.92,0.1337,0.1283,33.55,-7.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,26.15,40.15,0.1349,0.1308,33.55,-7.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,26.65,39.4,0.136,0.1332,33.55,-6.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,27.15,38.69,0.1371,0.1357,33.55,-6.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,27.65,38.0,0.1383,0.1382,33.55,-5.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,28.16,37.33,0.1394,0.1406,33.55,-5.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,28.66,36.69,0.1405,0.1431,33.55,-4.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,29.16,36.06,0.1416,0.1456,33.55,-4.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,29.66,35.46,0.1427,0.148,33.55,-3.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,30.17,34.88,0.1437,0.1505,33.55,-3.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,30.67,34.32,0.1448,0.153,33.55,-2.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,31.17,33.77,0.1459,0.1554,33.55,-2.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,31.68,33.25,0.1469,0.1579,33.55,-1.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,32.18,32.74,0.1479,0.1604,33.55,-1.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,32.68,32.24,0.149,0.1628,33.55,-0.55,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.609,33.19,31.76,0.15,0.1653,33.55,-0.05,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,33.69,31.29,0.151,0.1678,33.55,0.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,34.19,30.84,0.152,0.1702,33.55,0.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,34.7,30.4,0.153,0.1727,33.55,1.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6233,35.2,29.97,0.154,0.1752,33.55,1.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,35.71,29.55,0.155,0.1776,33.55,2.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6301,36.21,29.15,0.1559,0.1801,33.55,2.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,36.71,28.75,0.1569,0.1826,33.55,3.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,37.22,28.37,0.1579,0.185,33.55,3.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,37.72,28.0,0.1588,0.1875,33.55,4.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,38.23,27.63,0.1598,0.19,33.55,4.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,38.73,27.28,0.1607,0.1925,33.55,5.45,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6491,39.24,26.93,0.1616,0.1949,33.55,5.95,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,39.74,26.6,0.1626,0.1974,33.55,6.45,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,12.62,64.48,0.1088,0.0814,32.45,-17.45,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,13.04,62.4,0.1104,0.0841,32.45,-16.95,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,13.47,60.45,0.112,0.0868,32.45,-16.45,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,13.9,58.62,0.1136,0.0896,32.45,-15.95,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,14.33,56.89,0.1151,0.0923,32.45,-15.45,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,14.76,55.27,0.1166,0.095,32.45,-14.95,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,15.19,53.73,0.1181,0.0977,32.45,-14.45,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,15.62,52.28,0.1196,0.1004,32.45,-13.95,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,16.05,50.9,0.1211,0.1031,32.45,-13.45,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,16.48,49.6,0.1225,0.1058,32.45,-12.95,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,16.91,48.36,0.1239,0.1086,32.45,-12.45,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,17.34,47.18,0.1253,0.1113,32.45,-11.95,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,17.77,46.06,0.1267,0.114,32.45,-11.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,18.2,44.99,0.1281,0.1167,32.45,-10.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,18.63,43.96,0.1294,0.1194,32.45,-10.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,19.06,42.99,0.1307,0.1221,32.45,-9.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,19.49,42.05,0.132,0.1248,32.45,-9.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,19.92,41.16,0.1333,0.1276,32.45,-8.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,20.35,40.3,0.1346,0.1303,32.45,-8.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,20.78,39.48,0.1359,0.133,32.45,-7.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,21.21,38.69,0.1371,0.1357,32.45,-7.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,21.64,37.93,0.1384,0.1384,32.45,-6.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,22.07,37.2,0.1396,0.1411,32.45,-6.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,22.51,36.5,0.1408,0.1438,32.45,-5.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,22.94,35.82,0.142,0.1466,32.45,-5.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,23.37,35.17,0.1432,0.1493,32.45,-4.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,23.8,34.54,0.1444,0.152,32.45,-4.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,24.24,33.94,0.1455,0.1547,32.45,-3.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,24.67,33.35,0.1467,0.1574,32.45,-3.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,25.1,32.79,0.1478,0.1601,32.45,-2.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,25.53,32.24,0.149,0.1628,32.45,-2.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6094,25.97,31.71,0.1501,0.1656,32.45,-1.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6134,26.4,31.2,0.1512,0.1683,32.45,-1.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6174,26.83,30.7,0.1523,0.171,32.45,-0.95,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,27.27,30.22,0.1534,0.1737,32.45,-0.45,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,27.7,29.76,0.1545,0.1764,32.45,0.05,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6288,28.13,29.31,0.1556,0.1791,32.45,0.55,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6324,28.57,28.87,0.1566,0.1818,32.45,1.05,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,29.0,28.45,0.1577,0.1846,32.45,1.55,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6395,29.43,28.03,0.1587,0.1873,32.45,2.05,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,29.87,27.63,0.1598,0.19,32.45,2.55,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6464,30.3,27.24,0.1608,0.1927,32.45,3.05,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,30.73,26.87,0.1618,0.1954,32.45,3.55,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.653,31.17,26.5,0.1628,0.1981,32.45,4.05,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6562,31.6,26.14,0.1639,0.2008,32.45,4.55,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,32.04,25.79,0.1649,0.2036,32.45,5.05,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,32.47,25.45,0.1658,0.2063,32.45,5.55,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6655,32.91,25.12,0.1668,0.209,32.45,6.05,[6,7]],[0.7,"low",0.0125,0.0143,0.0,0.0125,0.0,0.0,0.6685,33.34,24.8,0.1678,0.2117,32.45,6.55,[6]],[1.7,"low",0.0322,0.0369,0.0,0.0322,0.0,0.0,0.6715,33.78,24.49,0.1688,0.2144,32.45,7.05,[6]],[2.8,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0,0.6744,34.21,24.18,0.1698,0.2171,32.45,7.55,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,12.09,62.77,0.1101,0.0836,32.14,-17.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,12.5,60.74,0.1117,0.0864,32.14,-16.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,12.91,58.84,0.1134,0.0892,32.14,-16.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,13.33,57.06,0.115,0.092,32.14,-15.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,13.74,55.38,0.1165,0.0948,32.14,-15.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,14.15,53.8,0.1181,0.0976,32.14,-14.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,14.56,52.31,0.1196,0.1004,32.14,-14.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,14.97,50.89,0.1211,0.1032,32.14,-13.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,15.38,49.55,0.1226,0.1059,32.14,-13.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,15.79,48.28,0.124,0.1087,32.14,-12.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,16.2,47.08,0.1254,0.1115,32.14,-12.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,16.62,45.93,0.1269,0.1143,32.14,-11.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,17.03,44.83,0.1283,0.1171,32.14,-11.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,17.44,43.79,0.1296,0.1199,32.14,-10.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,17.85,42.8,0.131,0.1227,32.14,-10.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,18.27,41.85,0.1323,0.1255,32.14,-9.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,18.68,40.94,0.1337,0.1283,32.14,-9.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,19.09,40.06,0.135,0.131,32.14,-8.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,19.51,39.23,0.1363,0.1338,32.14,-8.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,19.92,38.43,0.1376,0.1366,32.14,-7.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,20.33,37.66,0.1388,0.1394,32.14,-7.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,20.75,36.92,0.1401,0.1422,32.14,-6.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,21.16,36.21,0.1413,0.145,32.14,-6.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,21.57,35.53,0.1425,0.1478,32.14,-5.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,21.99,34.87,0.1438,0.1506,32.14,-5.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,22.4,34.24,0.145,0.1533,32.14,-4.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,22.82,33.63,0.1462,0.1561,32.14,-4.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,23.23,33.04,0.1473,0.1589,32.14,-3.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,23.65,32.47,0.1485,0.1617,32.14,-3.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,24.06,31.92,0.1497,0.1645,32.14,-2.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6119,24.47,31.38,0.1508,0.1673,32.14,-2.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.616,24.89,30.87,0.1519,0.1701,32.14,-1.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.62,25.3,30.37,0.1531,0.1729,32.14,-1.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.624,25.72,29.89,0.1542,0.1756,32.14,-0.64,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6278,26.14,29.42,0.1553,0.1784,32.14,-0.14,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6316,26.55,28.97,0.1564,0.1812,32.14,0.36,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6353,26.97,28.53,0.1575,0.184,32.14,0.86,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6389,27.38,28.1,0.1586,0.1868,32.14,1.36,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6425,27.8,27.69,0.1596,0.1896,32.14,1.86,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.646,28.21,27.29,0.1607,0.1924,32.14,2.36,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6494,28.63,26.9,0.1617,0.1952,32.14,2.86,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6528,29.04,26.52,0.1628,0.198,32.14,3.36,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6561,29.46,26.15,0.1638,0.2007,32.14,3.86,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,29.88,25.79,0.1648,0.2035,32.14,4.36,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,30.29,25.45,0.1659,0.2063,32.14,4.86,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6657,30.71,25.11,0.1669,0.2091,32.14,5.36,[6,7]],[0.7,"low",0.0139,0.016,0.0,0.0139,0.0,0.0,0.6687,31.13,24.78,0.1679,0.2119,32.14,5.86,[6]],[1.8,"low",0.0342,0.0392,0.0,0.0342,0.0,0.0,0.6718,31.54,24.45,0.1689,0.2147,32.14,6.36,[6]],[2.9,"low",0.0542,0.062,0.0,0.0542,0.0,0.0,0.6747,31.96,24.14,0.1699,0.2175,32.14,6.86,[6]],[4.0,"low",0.074,0.0844,0.0,0.074,0.0,0.0,0.6776,32.38,23.84,0.1709,0.2203,32.14,7.36,[6]],[5.0,"low",0.0935,0.1064,0.0,0.0935,0.0,0.0,0.6805,32.79,23.54,0.1718,0.223,32.14,7.86,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,11.0,59.11,0.1131,0.0888,31.47,-16.47,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,11.38,57.2,0.1148,0.0918,31.47,-15.97,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,11.75,55.41,0.1165,0.0947,31.47,-15.47,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,12.12,53.73,0.1181,0.0977,31.47,-14.97,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,12.5,52.15,0.1197,0.1007,31.47,-14.47,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,12.87,50.66,0.1213,0.1036,31.47,-13.97,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,13.24,49.26,0.1229,0.1066,31.47,-13.47,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,13.62,47.92,0.1244,0.1095,31.47,-12.97,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,13.99,46.66,0.126,0.1125,31.47,-12.47,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,14.37,45.47,0.1274,0.1155,31.47,-11.97,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,14.74,44.33,0.1289,0.1184,31.47,-11.47,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,15.12,43.25,0.1304,0.1214,31.47,-10.97,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,15.49,42.22,0.1318,0.1244,31.47,-10.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,15.87,41.24,0.1332,0.1273,31.47,-9.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,16.24,40.3,0.1346,0.1303,31.47,-9.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,16.62,39.4,0.136,0.1332,31.47,-8.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,16.99,38.55,0.1374,0.1362,31.47,-8.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,17.37,37.73,0.1387,0.1392,31.47,-7.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,17.75,36.94,0.14,0.1421,31.47,-7.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,18.12,36.19,0.1414,0.1451,31.47,-6.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,18.5,35.46,0.1427,0.148,31.47,-6.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,18.87,34.77,0.144,0.151,31.47,-5.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,19.25,34.1,0.1452,0.154,31.47,-5.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,19.63,33.46,0.1465,0.1569,31.47,-4.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,20.0,32.84,0.1477,0.1599,31.47,-4.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,20.38,32.24,0.149,0.1628,31.47,-3.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,20.76,31.66,0.1502,0.1658,31.47,-3.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,21.14,31.11,0.1514,0.1688,31.47,-2.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6184,21.51,30.57,0.1526,0.1717,31.47,-2.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6226,21.89,30.05,0.1538,0.1747,31.47,-1.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,22.27,29.55,0.155,0.1776,31.47,-1.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6308,22.64,29.07,0.1561,0.1806,31.47,-0.97,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6347,23.02,28.6,0.1573,0.1836,31.47,-0.47,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,23.4,28.15,0.1584,0.1865,31.47,0.03,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,23.78,27.71,0.1596,0.1895,31.47,0.53,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,24.16,27.28,0.1607,0.1925,31.47,1.03,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,24.53,26.87,0.1618,0.1954,31.47,1.53,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6533,24.91,26.47,0.1629,0.1984,31.47,2.03,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,25.29,26.08,0.164,0.2013,31.47,2.53,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,25.67,25.7,0.1651,0.2043,31.47,3.03,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,26.05,25.33,0.1662,0.2073,31.47,3.53,[6,7]],[0.1,"low",0.0016,0.0018,0.0,0.0016,0.0,0.0,0.6669,26.42,24.97,0.1673,0.2102,31.47,4.03,[6]],[1.2,"low",0.0233,0.0267,0.0,0.0233,0.0,0.0,0.6701,26.8,24.63,0.1683,0.2132,31.47,4.53,[6]],[2.4,"low",0.0447,0.0511,0.0,0.0447,0.0,0.0,0.6733,27.18,24.29,0.1694,0.2161,31.47,5.03,[6]],[3.5,"low",0.0658,0.0751,0.0,0.0658,0.0,0.0,0.6764,27.56,23.96,0.1705,0.2191,31.47,5.53,[6]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,27.94,23.64,0.1715,0.2221,31.47,6.03,[6]],[5.7,"low",0.1072,0.1217,0.0,0.1072,0.0,0.0,0.6825,28.32,23.33,0.1725,0.225,31.47,6.53,[6]],[6.8,"low",0.1275,0.1444,0.0,0.1275,0.0,0.0,0.6855,28.7,23.03,0.1736,0.228,31.47,7.03,[6]],[7.9,"low",0.1475,0.1667,0.0,0.1475,0.0,0.0,0.6884,29.08,22.73,0.1746,0.2309,31.47,7.53,[6]],[8.9,"low",0.1673,0.1886,0.0,0.1673,0.0,0.0,0.6912,29.46,22.45,0.1756,0.2339,31.47,8.03,[6]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,29.83,22.16,0.1766,0.2369,31.47,8.53,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,9.7,54.56,0.1173,0.0962,30.6,-15.6,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,10.03,52.8,0.1191,0.0994,30.6,-15.1,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,10.36,51.15,0.1208,0.1026,30.6,-14.6,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,10.69,49.6,0.1225,0.1058,30.6,-14.1,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,11.02,48.14,0.1242,0.1091,30.6,-13.6,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,11.35,46.77,0.1258,0.1123,30.6,-13.1,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,11.68,45.47,0.1274,0.1155,30.6,-12.6,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,12.01,44.24,0.129,0.1187,30.6,-12.1,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,12.34,43.07,0.1306,0.1219,30.6,-11.6,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,12.67,41.97,0.1322,0.1251,30.6,-11.1,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,13.0,40.92,0.1337,0.1283,30.6,-10.6,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,13.33,39.92,0.1352,0.1315,30.6,-10.1,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,13.66,38.97,0.1367,0.1347,30.6,-9.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,13.99,38.06,0.1382,0.1379,30.6,-9.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,14.32,37.2,0.1396,0.1411,30.6,-8.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,14.65,36.37,0.141,0.1443,30.6,-8.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,14.98,35.58,0.1424,0.1475,30.6,-7.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,15.32,34.83,0.1438,0.1508,30.6,-7.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,15.65,34.1,0.1452,0.154,30.6,-6.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,15.98,33.4,0.1466,0.1572,30.6,-6.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,16.31,32.74,0.1479,0.1604,30.6,-5.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,16.64,32.09,0.1493,0.1636,30.6,-5.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,16.97,31.48,0.1506,0.1668,30.6,-4.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,17.31,30.88,0.1519,0.17,30.6,-4.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,17.64,30.31,0.1532,0.1732,30.6,-3.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.625,17.97,29.76,0.1545,0.1764,30.6,-3.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,18.3,29.23,0.1558,0.1796,30.6,-2.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,18.63,28.72,0.157,0.1828,30.6,-2.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.638,18.97,28.22,0.1583,0.186,30.6,-1.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6421,19.3,27.74,0.1595,0.1892,30.6,-1.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,19.63,27.28,0.1607,0.1925,30.6,-0.6,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.65,19.97,26.83,0.1619,0.1957,30.6,-0.1,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6539,20.3,26.4,0.1631,0.1989,30.6,0.4,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6577,20.63,25.98,0.1643,0.2021,30.6,0.9,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,20.96,25.57,0.1655,0.2053,30.6,1.4,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.665,21.3,25.18,0.1667,0.2085,30.6,1.9,[6,7]],[0.7,"low",0.0125,0.0143,0.0,0.0125,0.0,0.0,0.6685,21.63,24.8,0.1678,0.2117,30.6,2.4,[6]],[1.9,"low",0.0358,0.041,0.0,0.0358,0.0,0.0,0.672,21.96,24.43,0.169,0.2149,30.6,2.9,[6]],[3.1,"low",0.0588,0.0672,0.0,0.0588,0.0,0.0,0.6754,22.3,24.07,0.1701,0.2181,30.6,3.4,[6]],[4.4,"low",0.0815,0.0928,0.0,0.0815,0.0,0.0,0.6787,22.63,23.72,0.1712,0.2213,30.6,3.9,[6]],[5.5,"low",0.1038,0.1179,0.0,0.1038,0.0,0.0,0.682,22.96,23.38,0.1724,0.2245,30.6,4.4,[6]],[6.7,"low",0.1258,0.1425,0.0,0.1258,0.0,0.0,0.6852,23.3,23.05,0.1735,0.2277,30.6,4.9,[6]],[7.9,"low",0.1475,0.1667,0.0,0.1475,0.0,0.0,0.6884,23.63,22.73,0.1746,0.2309,30.6,5.4,[6]],[9.0,"low",0.1689,0.1904,0.0,0.1689,0.0,0.0,0.6914,23.97,22.42,0.1757,0.2341,30.6,5.9,[6]],[10.1,"low",0.19,0.2136,0.0,0.19,0.0,0.0,0.6945,24.3,22.12,0.1768,0.2374,30.6,6.4,[6]],[11.2,"low",0.2109,0.2364,0.0,0.2109,0.0,0.0,0.6974,24.63,21.82,0.1778,0.2406,30.6,6.9,[6]],[12.3,"low",0.2314,0.2588,0.0,0.2314,0.0,0.0,0.7003,24.97,21.54,0.1789,0.2438,30.6,7.4,[6]],[13.3,"low",0.2517,0.2808,0.0,0.2517,0.0,0.0,0.7032,25.3,21.26,0.18,0.247,30.6,7.9,[6]],[14.4,"low",0.2717,0.3024,0.0,0.2717,0.0,0.0,0.706,25.64,20.98,0.181,0.2502,30.6,8.4,[6]],[15.4,"low",0.2915,0.3235,0.0,0.2915,0.0,0.0,0.7088,25.97,20.72,0.1821,0.2534,30.6,8.9,[6]],[16.4,"low",0.311,0.3443,0.0,0.311,0.0,0.0,0.7115,26.31,20.46,0.1831,0.2566,30.6,9.4,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,8.63,50.66,0.1213,0.1036,29.82,-14.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,8.93,49.03,0.1232,0.1071,29.82,-14.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,9.22,47.5,0.1249,0.1105,29.82,-13.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,9.51,46.06,0.1267,0.114,29.82,-13.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,9.81,44.7,0.1284,0.1174,29.82,-12.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,10.1,43.43,0.1301,0.1209,29.82,-12.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,10.39,42.22,0.1318,0.1244,29.82,-11.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,10.69,41.08,0.1335,0.1278,29.82,-11.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,10.98,40.0,0.1351,0.1313,29.82,-10.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,11.27,38.97,0.1367,0.1347,29.82,-10.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,11.57,38.0,0.1383,0.1382,29.82,-9.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,11.86,37.07,0.1398,0.1416,29.82,-9.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,12.16,36.19,0.1414,0.1451,29.82,-8.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,12.45,35.35,0.1429,0.1485,29.82,-8.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,12.75,34.54,0.1444,0.152,29.82,-7.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,13.04,33.77,0.1459,0.1554,29.82,-7.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,13.34,33.04,0.1473,0.1589,29.82,-6.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,13.63,32.34,0.1488,0.1623,29.82,-6.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,13.93,31.66,0.1502,0.1658,29.82,-5.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,14.22,31.02,0.1516,0.1693,29.82,-5.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,14.52,30.4,0.153,0.1727,29.82,-4.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,14.81,29.8,0.1544,0.1762,29.82,-4.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6294,15.11,29.23,0.1558,0.1796,29.82,-3.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6341,15.4,28.68,0.1571,0.1831,29.82,-3.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,15.7,28.15,0.1584,0.1865,29.82,-2.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,15.99,27.63,0.1598,0.19,29.82,-2.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,16.29,27.14,0.1611,0.1934,29.82,-1.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,16.58,26.66,0.1624,0.1969,29.82,-1.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6556,16.88,26.2,0.1637,0.2003,29.82,-0.82,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6597,17.18,25.76,0.1649,0.2038,29.82,-0.32,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,17.47,25.33,0.1662,0.2073,29.82,0.18,[6,7]],[0.3,"low",0.0052,0.006,0.0,0.0052,0.0,0.0,0.6674,17.77,24.92,0.1675,0.2107,29.82,0.68,[6]],[1.6,"low",0.0305,0.0349,0.0,0.0305,0.0,0.0,0.6712,18.06,24.51,0.1687,0.2142,29.82,1.18,[6]],[3.0,"low",0.0553,0.0632,0.0,0.0553,0.0,0.0,0.6749,18.36,24.12,0.1699,0.2176,29.82,1.68,[6]],[4.3,"low",0.0797,0.0908,0.0,0.0797,0.0,0.0,0.6785,18.66,23.75,0.1712,0.2211,29.82,2.18,[6]],[5.5,"low",0.1038,0.1179,0.0,0.1038,0.0,0.0,0.682,18.95,23.38,0.1724,0.2245,29.82,2.68,[6]],[6.8,"low",0.1275,0.1444,0.0,0.1275,0.0,0.0,0.6855,19.25,23.03,0.1736,0.228,29.82,3.18,[6]],[8.0,"low",0.1508,0.1704,0.0,0.1508,0.0,0.0,0.6888,19.55,22.68,0.1747,0.2314,29.82,3.68,[6]],[9.2,"low",0.1738,0.1958,0.0,0.1738,0.0,0.0,0.6921,19.84,22.35,0.1759,0.2349,29.82,4.18,[6]],[10.4,"low",0.1965,0.2207,0.0,0.1965,0.0,0.0,0.6954,20.14,22.03,0.1771,0.2383,29.82,4.68,[6]],[11.6,"low",0.2188,0.2451,0.0,0.2188,0.0,0.0,0.6986,20.44,21.71,0.1783,0.2418,29.82,5.18,[6]],[12.7,"low",0.2408,0.269,0.0,0.2408,0.0,0.0,0.7017,20.73,21.41,0.1794,0.2453,29.82,5.68,[6]],[13.9,"low",0.2625,0.2925,0.0,0.2625,0.0,0.0,0.7047,21.03,21.11,0.1806,0.2487,29.82,6.18,[6]],[15.0,"low",0.2839,0.3154,0.0,0.2839,0.0,0.0,0.7077,21.33,20.82,0.1817,0.2522,29.82,6.68,[6]],[16.1,"low",0.305,0.338,0.0,0.305,0.0,0.0,0.7106,21.63,20.54,0.1828,0.2556,29.82,7.18,[6]],[17.2,"low",0.3259,0.3601,0.0,0.3259,0.0,0.0,0.7135,21.92,20.27,0.1839,0.2591,29.82,7.68,[6]],[18.2,"low",0.3464,0.3817,0.0,0.3464,0.0,0.0,0.7163,22.22,20.0,0.185,0.2625,29.82,8.18,[6]],[19.2,"low",0.3667,0.403,0.0,0.3667,0.0,0.0,0.7191,22.52,19.74,0.1861,0.266,29.82,8.68,[6]],[20.3,"low",0.3867,0.4239,0.0,0.3867,0.0,0.0,0.7218,22.82,19.49,0.1872,0.2694,29.82,9.18,[6]],[21.3,"low",0.4065,0.4443,0.0,0.4065,0.0,0.0,0.7245,23.11,19.24,0.1883,0.2729,29.82,9.68,[6]],[22.3,"low",0.426,0.4644,0.0,0.426,0.0,0.0,0.7271,23.41,19.0,0.1894,0.2763,29.82,10.18,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,8.58,50.45,0.1216,0.1041,29.78,-14.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,8.87,48.82,0.1234,0.1075,29.78,-14.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,9.16,47.29,0.1252,0.111,29.78,-13.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,9.45,45.86,0.1269,0.1145,29.78,-13.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,9.74,44.51,0.1287,0.1179,29.78,-12.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,10.03,43.24,0.1304,0.1214,29.78,-12.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,10.32,42.04,0.1321,0.1249,29.78,-11.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,10.61,40.9,0.1337,0.1284,29.78,-11.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,10.91,39.83,0.1353,0.1318,29.78,-10.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,11.2,38.8,0.1369,0.1353,29.78,-10.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,11.49,37.83,0.1385,0.1388,29.78,-9.78,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,11.78,36.91,0.1401,0.1422,29.78,-9.28,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,12.08,36.03,0.1416,0.1457,29.78,-8.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,12.37,35.2,0.1432,0.1492,29.78,-8.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,12.66,34.4,0.1447,0.1526,29.78,-7.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,12.95,33.63,0.1461,0.1561,29.78,-7.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,13.25,32.9,0.1476,0.1596,29.78,-6.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,13.54,32.2,0.1491,0.163,29.78,-6.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,13.83,31.53,0.1505,0.1665,29.78,-5.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,14.12,30.89,0.1519,0.17,29.78,-5.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,14.42,30.27,0.1533,0.1735,29.78,-4.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6257,14.71,29.67,0.1547,0.1769,29.78,-4.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6305,15.0,29.1,0.1561,0.1804,29.78,-3.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6351,15.3,28.55,0.1574,0.1839,29.78,-3.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6396,15.59,28.03,0.1588,0.1873,29.78,-2.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.644,15.89,27.52,0.1601,0.1908,29.78,-2.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6483,16.18,27.02,0.1614,0.1943,29.78,-1.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6525,16.47,26.55,0.1627,0.1977,29.78,-1.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6567,16.77,26.09,0.164,0.2012,29.78,-0.78,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6607,17.06,25.65,0.1653,0.2047,29.78,-0.28,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6646,17.36,25.22,0.1665,0.2081,29.78,0.22,[6,7]],[0.6,"low",0.0119,0.0136,0.0,0.0119,0.0,0.0,0.6684,17.65,24.81,0.1678,0.2116,29.78,0.72,[6]],[2.0,"low",0.0371,0.0425,0.0,0.0371,0.0,0.0,0.6722,17.94,24.41,0.169,0.2151,29.78,1.22,[6]],[3.3,"low",0.0619,0.0707,0.0,0.0619,0.0,0.0,0.6759,18.24,24.02,0.1703,0.2185,29.78,1.72,[6]],[4.6,"low",0.0864,0.0983,0.0,0.0864,0.0,0.0,0.6795,18.53,23.65,0.1715,0.222,29.78,2.22,[6]],[5.9,"low",0.1104,0.1254,0.0,0.1104,0.0,0.0,0.683,18.83,23.28,0.1727,0.2255,29.78,2.72,[6]],[7.1,"low",0.1341,0.1518,0.0,0.1341,0.0,0.0,0.6864,19.12,22.93,0.1739,0.229,29.78,3.22,[6]],[8.4,"low",0.1575,0.1777,0.0,0.1575,0.0,0.0,0.6898,19.42,22.59,0.1751,0.2324,29.78,3.72,[6]],[9.6,"low",0.1805,0.2031,0.0,0.1805,0.0,0.0,0.6931,19.71,22.26,0.1763,0.2359,29.78,4.22,[6]],[10.8,"low",0.2031,0.228,0.0,0.2031,0.0,0.0,0.6963,20.01,21.93,0.1774,0.2394,29.78,4.72,[6]],[11.9,"low",0.2254,0.2523,0.0,0.2254,0.0,0.0,0.6995,20.3,21.62,0.1786,0.2428,29.78,5.22,[6]],[13.1,"low",0.2475,0.2762,0.0,0.2475,0.0,0.0,0.7026,20.6,21.32,0.1798,0.2463,29.78,5.72,[6]],[14.2,"low",0.2692,0.2996,0.0,0.2692,0.0,0.0,0.7057,20.89,21.02,0.1809,0.2498,29.78,6.22,[6]],[15.3,"low",0.2906,0.3225,0.0,0.2906,0.0,0.0,0.7086,21.19,20.73,0.182,0.2532,29.78,6.72,[6]],[16.4,"low",0.3117,0.345,0.0,0.3117,0.0,0.0,0.7116,21.48,20.45,0.1832,0.2567,29.78,7.22,[6]],[17.5,"low",0.3325,0.3671,0.0,0.3325,0.0,0.0,0.7144,21.78,20.18,0.1843,0.2602,29.78,7.72,[6]],[18.5,"low",0.3531,0.3887,0.0,0.3531,0.0,0.0,0.7173,22.07,19.91,0.1854,0.2636,29.78,8.22,[6]],[19.6,"low",0.3734,0.4099,0.0,0.3734,0.0,0.0,0.72,22.37,19.65,0.1865,0.2671,29.78,8.72,[6]],[20.6,"low",0.3934,0.4307,0.0,0.3934,0.0,0.0,0.7227,22.66,19.4,0.1876,0.2706,29.78,9.22,[6]],[21.6,"low",0.4132,0.4512,0.0,0.4132,0.0,0.0,0.7254,22.96,19.16,0.1887,0.2741,29.78,9.72,[6]],[22.6,"low",0.4327,0.4712,0.0,0.4327,0.0,0.0,0.728,23.25,18.92,0.1898,0.2775,29.78,10.22,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,7.75,47.29,0.1252,0.111,29.11,-14.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,8.01,45.76,0.1271,0.1147,29.11,-13.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,8.27,44.33,0.1289,0.1184,29.11,-13.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,8.53,42.99,0.1307,0.1221,29.11,-12.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,8.8,41.72,0.1325,0.1258,29.11,-12.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,9.06,40.53,0.1343,0.1295,29.11,-11.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,9.32,39.4,0.136,0.1332,29.11,-11.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,9.59,38.34,0.1377,0.1369,29.11,-10.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,9.85,37.33,0.1394,0.1406,29.11,-10.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,10.11,36.37,0.141,0.1443,29.11,-9.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,10.38,35.46,0.1427,0.148,29.11,-9.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,10.64,34.6,0.1443,0.1517,29.11,-8.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,10.91,33.77,0.1459,0.1554,29.11,-8.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,11.17,32.99,0.1474,0.1591,29.11,-7.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,11.43,32.24,0.149,0.1628,29.11,-7.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,11.7,31.52,0.1505,0.1665,29.11,-6.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,11.96,30.84,0.152,0.1702,29.11,-6.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,12.23,30.18,0.1535,0.1739,29.11,-5.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,12.49,29.55,0.155,0.1776,29.11,-5.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6318,12.76,28.95,0.1564,0.1813,29.11,-4.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6367,13.02,28.37,0.1579,0.185,29.11,-4.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,13.29,27.81,0.1593,0.1887,29.11,-3.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,13.55,27.28,0.1607,0.1925,29.11,-3.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6506,13.82,26.77,0.1621,0.1962,29.11,-2.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,14.08,26.27,0.1635,0.1999,29.11,-2.11,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6594,14.35,25.79,0.1649,0.2036,29.11,-1.61,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,14.61,25.33,0.1662,0.2073,29.11,-1.11,[3]],[0.4,"low",0.007,0.0081,0.0,0.007,0.0,0.0,0.6677,14.88,24.89,0.1675,0.211,29.11,-0.61,[3]],[1.8,"low",0.034,0.039,0.0,0.034,0.0,0.0,0.6717,15.14,24.46,0.1689,0.2147,29.11,-0.11,[3]],[3.2,"low",0.0606,0.0691,0.0,0.0606,0.0,0.0,0.6757,15.41,24.04,0.1702,0.2184,29.11,0.39,[6]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,15.68,23.64,0.1715,0.2221,29.11,0.89,[6]],[6.0,"low",0.1123,0.1274,0.0,0.1123,0.0,0.0,0.6832,15.94,23.25,0.1728,0.2258,29.11,1.39,[6]],[7.3,"low",0.1375,0.1556,0.0,0.1375,0.0,0.0,0.6869,16.21,22.88,0.1741,0.2295,29.11,1.89,[6]],[8.6,"low",0.1624,0.1832,0.0,0.1624,0.0,0.0,0.6905,16.47,22.52,0.1753,0.2332,29.11,2.39,[6]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,16.74,22.16,0.1766,0.2369,29.11,2.89,[6]],[11.2,"low",0.2109,0.2364,0.0,0.2109,0.0,0.0,0.6974,17.0,21.82,0.1778,0.2406,29.11,3.39,[6]],[12.4,"low",0.2346,0.2622,0.0,0.2346,0.0,0.0,0.7008,17.27,21.49,0.1791,0.2443,29.11,3.89,[6]],[13.6,"low",0.2579,0.2875,0.0,0.2579,0.0,0.0,0.7041,17.54,21.17,0.1803,0.248,29.11,4.39,[6]],[14.8,"low",0.2809,0.3122,0.0,0.2809,0.0,0.0,0.7073,17.8,20.86,0.1815,0.2517,29.11,4.89,[6]],[16.0,"low",0.3035,0.3364,0.0,0.3035,0.0,0.0,0.7104,18.07,20.56,0.1827,0.2554,29.11,5.39,[6]],[17.2,"low",0.3259,0.3601,0.0,0.3259,0.0,0.0,0.7135,18.34,20.27,0.1839,0.2591,29.11,5.89,[6]],[18.3,"low",0.3479,0.3833,0.0,0.3479,0.0,0.0,0.7165,18.6,19.98,0.1851,0.2628,29.11,6.39,[6]],[19.4,"low",0.3696,0.406,0.0,0.3696,0.0,0.0,0.7195,18.87,19.7,0.1863,0.2665,29.11,6.89,[6]],[20.5,"low",0.391,0.4283,0.0,0.391,0.0,0.0,0.7224,19.14,19.43,0.1875,0.2702,29.11,7.39,[6]],[21.6,"low",0.4121,0.4501,0.0,0.4121,0.0,0.0,0.7252,19.4,19.17,0.1886,0.2739,29.11,7.89,[6]],[22.6,"low",0.4329,0.4715,0.0,0.4329,0.0,0.0,0.728,19.67,18.91,0.1898,0.2776,29.11,8.39,[6]],[23.6,"low",0.4535,0.4925,0.0,0.4535,0.0,0.0,0.7308,19.94,18.67,0.1909,0.2813,29.11,8.89,[6]],[24.7,"low",0.4738,0.5131,0.0,0.4738,0.0,0.0,0.7334,20.2,18.42,0.1921,0.285,29.11,9.39,[6]],[25.7,"low",0.4938,0.5333,0.0,0.4938,0.0,0.0,0.7361,20.47,18.19,0.1932,0.2887,29.11,9.89,[6]],[26.9,"low",0.5136,0.5531,0.0,0.5136,0.0101,0.0,0.7386,20.74,17.96,0.1943,0.2924,29.11,10.39,[6]],[28.4,"low",0.5331,0.5725,0.0,0.5331,0.0295,0.0,0.7412,21.0,17.73,0.1954,0.2961,29.11,10.89,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,7.0,44.33,0.1289,0.1184,28.46,-13.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,7.24,42.9,0.1309,0.1224,28.46,-12.96,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,7.47,41.56,0.1328,0.1263,28.46,-12.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,7.71,40.3,0.1346,0.1303,28.46,-11.96,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,7.95,39.11,0.1365,0.1342,28.46,-11.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,8.19,38.0,0.1383,0.1382,28.46,-10.96,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,8.42,36.94,0.14,0.1421,28.46,-10.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,8.66,35.94,0.1418,0.1461,28.46,-9.96,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,8.9,35.0,0.1435,0.15,28.46,-9.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,9.14,34.1,0.1452,0.154,28.46,-8.96,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,9.38,33.25,0.1469,0.1579,28.46,-8.46,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,9.62,32.44,0.1486,0.1619,28.46,-7.96,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,9.85,31.66,0.1502,0.1658,28.46,-7.46,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,10.09,30.93,0.1518,0.1698,28.46,-6.96,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,10.33,30.22,0.1534,0.1737,28.46,-6.46,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,10.57,29.55,0.155,0.1776,28.46,-5.96,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6321,10.81,28.91,0.1565,0.1816,28.46,-5.46,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6373,11.05,28.3,0.1581,0.1855,28.46,-4.96,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6424,11.29,27.71,0.1596,0.1895,28.46,-4.46,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6473,11.53,27.14,0.1611,0.1934,28.46,-3.96,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,11.77,26.6,0.1626,0.1974,28.46,-3.46,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,12.0,26.08,0.164,0.2013,28.46,-2.96,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6614,12.24,25.57,0.1655,0.2053,28.46,-2.46,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6658,12.48,25.09,0.1669,0.2092,28.46,-1.96,[3]],[1.2,"low",0.0233,0.0267,0.0,0.0233,0.0,0.0,0.6701,12.72,24.63,0.1683,0.2132,28.46,-1.46,[3]],[2.8,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0,0.6744,12.96,24.18,0.1698,0.2171,28.46,-0.96,[3]],[4.3,"low",0.0797,0.0908,0.0,0.0797,0.0,0.0,0.6785,13.2,23.75,0.1712,0.2211,28.46,-0.46,[3]],[5.7,"low",0.1072,0.1217,0.0,0.1072,0.0,0.0,0.6825,13.44,23.33,0.1725,0.225,28.46,0.04,[6]],[7.2,"low",0.1342,0.1519,0.0,0.1342,0.0,0.0,0.6864,13.68,22.93,0.1739,0.229,28.46,0.54,[6]],[8.5,"low",0.1607,0.1813,0.0,0.1607,0.0,0.0,0.6903,13.92,22.54,0.1753,0.2329,28.46,1.04,[6]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,14.16,22.16,0.1766,0.2369,28.46,1.54,[6]],[11.3,"low",0.2125,0.2382,0.0,0.2125,0.0,0.0,0.6977,14.4,21.8,0.1779,0.2408,28.46,2.04,[6]],[12.6,"low",0.2377,0.2656,0.0,0.2377,0.0,0.0,0.7012,14.64,21.45,0.1792,0.2448,28.46,2.54,[6]],[13.9,"low",0.2625,0.2925,0.0,0.2625,0.0,0.0,0.7047,14.88,21.11,0.1806,0.2487,28.46,3.04,[6]],[15.1,"low",0.287,0.3187,0.0,0.287,0.0,0.0,0.7081,15.12,20.78,0.1818,0.2527,28.46,3.54,[6]],[16.4,"low",0.311,0.3443,0.0,0.311,0.0,0.0,0.7115,15.36,20.46,0.1831,0.2566,28.46,4.04,[6]],[17.6,"low",0.3347,0.3694,0.0,0.3347,0.0,0.0,0.7147,15.6,20.15,0.1844,0.2605,28.46,4.54,[6]],[18.8,"low",0.3581,0.3939,0.0,0.3581,0.0,0.0,0.7179,15.84,19.85,0.1857,0.2645,28.46,5.04,[6]],[20.0,"low",0.381,0.4179,0.0,0.381,0.0,0.0,0.7211,16.08,19.56,0.1869,0.2684,28.46,5.54,[6]],[21.1,"low",0.4037,0.4414,0.0,0.4037,0.0,0.0,0.7241,16.33,19.27,0.1882,0.2724,28.46,6.04,[6]],[22.3,"low",0.426,0.4644,0.0,0.426,0.0,0.0,0.7271,16.57,19.0,0.1894,0.2763,28.46,6.54,[6]],[23.4,"low",0.448,0.487,0.0,0.448,0.0,0.0,0.73,16.81,18.73,0.1906,0.2803,28.46,7.04,[6]],[24.5,"low",0.4698,0.509,0.0,0.4698,0.0,0.0,0.7329,17.05,18.47,0.1918,0.2842,28.46,7.54,[6]],[25.5,"low",0.4912,0.5306,0.0,0.4912,0.0,0.0,0.7357,17.29,18.22,0.193,0.2882,28.46,8.04,[6]],[26.6,"low",0.5123,0.5518,0.0,0.5123,0.0,0.0,0.7385,17.53,17.97,0.1942,0.2921,28.46,8.54,[6]],[27.6,"low",0.5331,0.5725,0.0,0.5331,0.0,0.0,0.7412,17.77,17.73,0.1954,0.2961,28.46,9.04,[6]],[28.7,"low",0.5537,0.5929,0.0,0.5537,0.0017,0.0,0.7438,18.01,17.5,0.1966,0.3,28.46,9.54,[6]],[30.2,"low",0.574,0.6128,0.0,0.574,0.0225,0.0,0.7464,18.25,17.27,0.1978,0.304,28.46,10.04,[6]],[31.7,"low",0.594,0.6324,0.0,0.594,0.0433,0.0,0.749,18.49,17.05,0.1989,0.3079,28.46,10.54,[6]],[33.2,"low",0.6137,0.6515,0.0,0.6137,0.0641,0.0,0.7515,18.73,16.83,0.2001,0.3119,28.46,11.04,[6]],[34.7,"low",0.6333,0.6703,0.0,0.6333,0.0848,0.0,0.7539,18.98,16.62,0.2012,0.3158,28.46,11.54,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,6.36,41.72,0.1325,0.1258,27.86,-12.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,6.58,40.38,0.1345,0.13,27.86,-12.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,6.79,39.11,0.1365,0.1342,27.86,-11.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,7.01,37.93,0.1384,0.1384,27.86,-11.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,7.23,36.81,0.1403,0.1426,27.86,-10.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,7.44,35.76,0.1421,0.1468,27.86,-10.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,7.66,34.77,0.144,0.151,27.86,-9.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,7.87,33.83,0.1458,0.1552,27.86,-9.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,8.09,32.94,0.1475,0.1594,27.86,-8.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,8.31,32.09,0.1493,0.1636,27.86,-8.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,8.52,31.29,0.151,0.1678,27.86,-7.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,8.74,30.53,0.1527,0.172,27.86,-7.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6247,8.96,29.8,0.1544,0.1762,27.86,-6.86,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6304,9.17,29.11,0.156,0.1804,27.86,-6.36,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.636,9.39,28.45,0.1577,0.1846,27.86,-5.86,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6414,9.61,27.81,0.1593,0.1887,27.86,-5.36,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6467,9.83,27.21,0.1609,0.1929,27.86,-4.86,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6518,10.04,26.63,0.1625,0.1971,27.86,-4.36,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6568,10.26,26.08,0.164,0.2013,27.86,-3.86,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6616,10.48,25.54,0.1656,0.2055,27.86,-3.36,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6664,10.7,25.03,0.1671,0.2097,27.86,-2.86,[3]],[1.5,"low",0.0287,0.0329,0.0,0.0287,0.0,0.0,0.6709,10.91,24.54,0.1686,0.2139,27.86,-2.36,[3]],[3.1,"low",0.0588,0.0672,0.0,0.0588,0.0,0.0,0.6754,11.13,24.07,0.1701,0.2181,27.86,-1.86,[3]],[4.7,"low",0.0884,0.1006,0.0,0.0884,0.0,0.0,0.6798,11.35,23.62,0.1716,0.2223,27.86,-1.36,[3]],[6.3,"low",0.1174,0.1331,0.0,0.1174,0.0,0.0,0.684,11.57,23.18,0.173,0.2265,27.86,-0.86,[3]],[7.8,"low",0.1459,0.1649,0.0,0.1459,0.0,0.0,0.6881,11.78,22.76,0.1745,0.2307,27.86,-0.36,[3]],[9.2,"low",0.1738,0.1958,0.0,0.1738,0.0,0.0,0.6921,12.0,22.35,0.1759,0.2349,27.86,0.14,[6]],[10.7,"low",0.2013,0.226,0.0,0.2013,0.0,0.0,0.6961,12.22,21.96,0.1773,0.2391,27.86,0.64,[6]],[12.1,"low",0.2283,0.2554,0.0,0.2283,0.0,0.0,0.6999,12.44,21.58,0.1788,0.2433,27.86,1.14,[6]],[13.5,"low",0.2548,0.2841,0.0,0.2548,0.0,0.0,0.7036,12.66,21.21,0.1801,0.2475,27.86,1.64,[6]],[14.8,"low",0.2809,0.3122,0.0,0.2809,0.0,0.0,0.7073,12.87,20.86,0.1815,0.2517,27.86,2.14,[6]],[16.2,"low",0.3065,0.3396,0.0,0.3065,0.0,0.0,0.7109,13.09,20.52,0.1829,0.2559,27.86,2.64,[6]],[17.5,"low",0.3318,0.3663,0.0,0.3318,0.0,0.0,0.7143,13.31,20.19,0.1842,0.2601,27.86,3.14,[6]],[18.7,"low",0.3566,0.3924,0.0,0.3566,0.0,0.0,0.7177,13.53,19.87,0.1856,0.2642,27.86,3.64,[6]],[20.0,"low",0.381,0.4179,0.0,0.381,0.0,0.0,0.7211,13.75,19.56,0.1869,0.2684,27.86,4.14,[6]],[21.2,"low",0.4051,0.4429,0.0,0.4051,0.0,0.0,0.7243,13.97,19.26,0.1882,0.2726,27.86,4.64,[6]],[22.4,"low",0.4288,0.4673,0.0,0.4288,0.0,0.0,0.7275,14.18,18.96,0.1896,0.2768,27.86,5.14,[6]],[23.6,"low",0.4521,0.4911,0.0,0.4521,0.0,0.0,0.7306,14.4,18.68,0.1909,0.281,27.86,5.64,[6]],[24.7,"low",0.4751,0.5145,0.0,0.4751,0.0,0.0,0.7336,14.62,18.41,0.1921,0.2852,27.86,6.14,[6]],[25.9,"low",0.4978,0.5373,0.0,0.4978,0.0,0.0,0.7366,14.84,18.14,0.1934,0.2894,27.86,6.64,[6]],[27.0,"low",0.5201,0.5596,0.0,0.5201,0.0,0.0,0.7395,15.06,17.88,0.1947,0.2936,27.86,7.14,[6]],[28.1,"low",0.5421,0.5815,0.0,0.5421,0.0,0.0,0.7423,15.28,17.63,0.1959,0.2978,27.86,7.64,[6]],[29.2,"low",0.5638,0.6029,0.0,0.5638,0.0,0.0,0.7451,15.5,17.38,0.1972,0.302,27.86,8.14,[6]],[30.2,"low",0.5852,0.6238,0.0,0.5852,0.0,0.0,0.7479,15.72,17.15,0.1984,0.3062,27.86,8.64,[6]],[31.5,"low",0.6064,0.6444,0.0,0.6064,0.0087,0.0,0.7505,15.93,16.91,0.1997,0.3104,27.86,9.14,[6]],[33.1,"low",0.6272,0.6645,0.0,0.6272,0.0308,0.0,0.7531,16.15,16.69,0.2009,0.3146,27.86,9.64,[6]],[34.6,"low",0.6477,0.6842,0.0,0.6477,0.0529,0.0,0.7557,16.37,16.47,0.2021,0.3188,27.86,10.14,[6]],[36.2,"medium",0.668,0.7035,0.0,0.668,0.075,0.0,0.7582,16.59,16.26,0.2033,0.323,27.86,10.64,[]],[37.7,"medium",0.6881,0.7224,0.0,0.6881,0.097,0.0,0.7607,16.81,16.05,0.2045,0.3272,27.86,11.14,[]],[39.2,"medium",0.7078,0.741,0.0,0.7078,0.1191,0.0,0.7631,17.03,15.84,0.2057,0.3314,27.86,11.64,[]],[40.7,"medium",0.7274,0.7592,0.0,0.7274,0.1412,0.0,0.7655,17.25,15.65,0.2069,0.3356,27.86,12.14,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,5.81,39.4,0.136,0.1332,27.31,-12.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,6.01,38.13,0.138,0.1377,27.31,-11.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,6.21,36.94,0.14,0.1421,27.31,-11.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,6.41,35.82,0.142,0.1466,27.31,-10.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,6.6,34.77,0.144,0.151,27.31,-10.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,6.8,33.78,0.1459,0.1554,27.31,-9.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,7.0,32.84,0.1477,0.1599,27.31,-9.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,7.2,31.95,0.1496,0.1643,27.31,-8.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,7.39,31.11,0.1514,0.1688,27.31,-8.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,7.59,30.31,0.1532,0.1732,27.31,-7.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,7.79,29.55,0.155,0.1776,27.31,-7.31,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6328,7.99,28.83,0.1567,0.1821,27.31,-6.81,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6386,8.19,28.15,0.1584,0.1865,27.31,-6.31,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6442,8.39,27.49,0.1601,0.191,27.31,-5.81,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6497,8.58,26.87,0.1618,0.1954,27.31,-5.31,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6551,8.78,26.27,0.1635,0.1999,27.31,-4.81,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6602,8.98,25.7,0.1651,0.2043,27.31,-4.31,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6653,9.18,25.15,0.1667,0.2087,27.31,-3.81,[3]],[1.2,"low",0.0233,0.0267,0.0,0.0233,0.0,0.0,0.6701,9.38,24.63,0.1683,0.2132,27.31,-3.31,[3]],[3.0,"low",0.0553,0.0632,0.0,0.0553,0.0,0.0,0.6749,9.58,24.12,0.1699,0.2176,27.31,-2.81,[3]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,9.78,23.64,0.1715,0.2221,27.31,-2.31,[3]],[6.3,"low",0.1174,0.1331,0.0,0.1174,0.0,0.0,0.684,9.97,23.18,0.173,0.2265,27.31,-1.81,[3]],[7.9,"low",0.1475,0.1667,0.0,0.1475,0.0,0.0,0.6884,10.17,22.73,0.1746,0.2309,27.31,-1.31,[3]],[9.4,"low",0.1771,0.1994,0.0,0.1771,0.0,0.0,0.6926,10.37,22.3,0.1761,0.2354,27.31,-0.81,[3]],[10.9,"low",0.2061,0.2312,0.0,0.2061,0.0,0.0,0.6968,10.57,21.89,0.1776,0.2398,27.31,-0.31,[3]],[12.4,"low",0.2346,0.2622,0.0,0.2346,0.0,0.0,0.7008,10.77,21.49,0.1791,0.2443,27.31,0.19,[6]],[13.9,"low",0.2625,0.2925,0.0,0.2625,0.0,0.0,0.7047,10.97,21.11,0.1806,0.2487,27.31,0.69,[6]],[15.3,"low",0.29,0.3219,0.0,0.29,0.0,0.0,0.7086,11.17,20.74,0.182,0.2531,27.31,1.19,[6]],[16.7,"low",0.317,0.3506,0.0,0.317,0.0,0.0,0.7123,11.37,20.38,0.1835,0.2576,27.31,1.69,[6]],[18.1,"low",0.3435,0.3787,0.0,0.3435,0.0,0.0,0.7159,11.57,20.04,0.1849,0.262,27.31,2.19,[6]],[19.4,"low",0.3696,0.406,0.0,0.3696,0.0,0.0,0.7195,11.77,19.7,0.1863,0.2665,27.31,2.69,[6]],[20.7,"low",0.3952,0.4327,0.0,0.3952,0.0,0.0,0.723,11.97,19.38,0.1877,0.2709,27.31,3.19,[6]],[22.0,"low",0.4205,0.4587,0.0,0.4205,0.0,0.0,0.7264,12.17,19.07,0.1891,0.2754,27.31,3.69,[6]],[23.2,"low",0.4453,0.4842,0.0,0.4453,0.0,0.0,0.7297,12.37,18.76,0.1905,0.2798,27.31,4.19,[6]],[24.5,"low",0.4698,0.509,0.0,0.4698,0.0,0.0,0.7329,12.57,18.47,0.1918,0.2842,27.31,4.69,[6]],[25.7,"low",0.4938,0.5333,0.0,0.4938,0.0,0.0,0.7361,12.77,18.19,0.1932,0.2887,27.31,5.19,[6]],[26.9,"low",0.5175,0.557,0.0,0.5175,0.0,0.0,0.7392,12.96,17.91,0.1945,0.2931,27.31,5.69,[6]],[28.0,"low",0.5408,0.5802,0.0,0.5408,0.0,0.0,0.7422,13.16,17.64,0.1959,0.2976,27.31,6.19,[6]],[29.2,"low",0.5638,0.6029,0.0,0.5638,0.0,0.0,0.7451,13.36,17.38,0.1972,0.302,27.31,6.69,[6]],[30.3,"low",0.5865,0.6251,0.0,0.5865,0.0,0.0,0.748,13.56,17.13,0.1985,0.3064,27.31,7.19,[6]],[31.4,"low",0.6088,0.6468,0.0,0.6088,0.0,0.0,0.7508,13.76,16.89,0.1998,0.3109,27.31,7.69,[6]],[32.5,"low",0.6308,0.668,0.0,0.6308,0.0,0.0,0.7536,13.96,16.65,0.2011,0.3153,27.31,8.19,[6]],[33.8,"low",0.6525,0.6888,0.0,0.6525,0.0115,0.0,0.7563,14.16,16.42,0.2024,0.3198,27.31,8.69,[6]],[35.4,"medium",0.674,0.7091,0.0,0.674,0.0349,0.0,0.7589,14.36,16.19,0.2036,0.3242,27.31,9.19,[]],[37.1,"medium",0.6951,0.729,0.0,0.6951,0.0583,0.0,0.7615,14.56,15.97,0.2049,0.3286,27.31,9.69,[]],[38.6,"medium",0.7159,0.7485,0.0,0.7159,0.0816,0.0,0.7641,14.76,15.76,0.2062,0.3331,27.31,10.19,[]],[40.2,"medium",0.7365,0.7676,0.0,0.7365,0.105,0.0,0.7666,14.97,15.55,0.2074,0.3375,27.31,10.69,[]],[41.8,"medium",0.7567,0.7863,0.0,0.7567,0.1284,0.0,0.769,15.17,15.35,0.2086,0.342,27.31,11.19,[]],[43.3,"medium",0.7768,0.8047,0.0,0.7768,0.1518,0.0,0.7714,15.37,15.16,0.2099,0.3464,27.31,11.69,[]],[44.9,"medium",0.7965,0.8226,0.0,0.7965,0.1751,0.0,0.7737,15.57,14.96,0.2111,0.3509,27.31,12.19,[]],[46.4,"medium",0.8161,0.8403,0.0,0.8161,0.1985,0.0,0.776,15.77,14.78,0.2123,0.3553,27.31,12.69,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,5.34,37.33,0.1394,0.1406,26.8,-11.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,5.52,36.13,0.1415,0.1453,26.8,-11.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,5.7,35.0,0.1435,0.15,26.8,-10.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,5.88,33.94,0.1455,0.1547,26.8,-10.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,6.07,32.94,0.1475,0.1594,26.8,-9.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,6.25,32.0,0.1495,0.1641,26.8,-9.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,6.43,31.11,0.1514,0.1688,26.8,-8.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,6.61,30.27,0.1533,0.1735,26.8,-8.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6274,6.79,29.47,0.1552,0.1781,26.8,-7.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6337,6.97,28.72,0.157,0.1828,26.8,-7.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,7.16,28.0,0.1588,0.1875,26.8,-6.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6458,7.34,27.31,0.1606,0.1922,26.8,-6.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6515,7.52,26.66,0.1624,0.1969,26.8,-5.8,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6571,7.7,26.04,0.1641,0.2016,26.8,-5.3,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6625,7.88,25.45,0.1658,0.2063,26.8,-4.8,[3]],[0.4,"low",0.007,0.0081,0.0,0.007,0.0,0.0,0.6677,8.07,24.89,0.1675,0.211,26.8,-4.3,[3]],[2.2,"low",0.0412,0.0471,0.0,0.0412,0.0,0.0,0.6728,8.25,24.35,0.1692,0.2156,26.8,-3.8,[3]],[4.0,"low",0.0745,0.085,0.0,0.0745,0.0,0.0,0.6777,8.43,23.83,0.1709,0.2203,26.8,-3.3,[3]],[5.7,"low",0.1072,0.1217,0.0,0.1072,0.0,0.0,0.6825,8.61,23.33,0.1725,0.225,26.8,-2.8,[3]],[7.4,"low",0.1392,0.1575,0.0,0.1392,0.0,0.0,0.6872,8.8,22.86,0.1742,0.2297,26.8,-2.3,[3]],[9.1,"low",0.1706,0.1922,0.0,0.1706,0.0,0.0,0.6917,8.98,22.4,0.1758,0.2344,26.8,-1.8,[3]],[10.7,"low",0.2013,0.226,0.0,0.2013,0.0,0.0,0.6961,9.16,21.96,0.1773,0.2391,26.8,-1.3,[3]],[12.3,"low",0.2314,0.2588,0.0,0.2314,0.0,0.0,0.7003,9.34,21.54,0.1789,0.2438,26.8,-0.8,[3]],[13.8,"low",0.261,0.2908,0.0,0.261,0.0,0.0,0.7045,9.53,21.13,0.1805,0.2485,26.8,-0.3,[3]],[15.3,"low",0.29,0.3219,0.0,0.29,0.0,0.0,0.7086,9.71,20.74,0.182,0.2531,26.8,0.2,[6]],[16.8,"low",0.3185,0.3522,0.0,0.3185,0.0,0.0,0.7125,9.89,20.36,0.1835,0.2578,26.8,0.7,[6]],[18.2,"low",0.3464,0.3817,0.0,0.3464,0.0,0.0,0.7163,10.08,20.0,0.185,0.2625,26.8,1.2,[6]],[19.6,"low",0.3739,0.4105,0.0,0.3739,0.0,0.0,0.7201,10.26,19.65,0.1865,0.2672,26.8,1.7,[6]],[21.0,"low",0.4009,0.4385,0.0,0.4009,0.0,0.0,0.7237,10.44,19.31,0.188,0.2719,26.8,2.2,[6]],[22.3,"low",0.4274,0.4659,0.0,0.4274,0.0,0.0,0.7273,10.62,18.98,0.1895,0.2766,26.8,2.7,[6]],[23.6,"low",0.4535,0.4925,0.0,0.4535,0.0,0.0,0.7308,10.81,18.67,0.1909,0.2813,26.8,3.2,[6]],[24.9,"low",0.4792,0.5185,0.0,0.4792,0.0,0.0,0.7341,10.99,18.36,0.1924,0.286,26.8,3.7,[6]],[26.2,"low",0.5044,0.5439,0.0,0.5044,0.0,0.0,0.7375,11.17,18.06,0.1938,0.2906,26.8,4.2,[6]],[27.4,"low",0.5292,0.5687,0.0,0.5292,0.0,0.0,0.7407,11.36,17.78,0.1952,0.2953,26.8,4.7,[6]],[28.7,"low",0.5537,0.5929,0.0,0.5537,0.0,0.0,0.7438,11.54,17.5,0.1966,0.3,26.8,5.2,[6]],[29.9,"low",0.5777,0.6165,0.0,0.5777,0.0,0.0,0.7469,11.72,17.23,0.198,0.3047,26.8,5.7,[6]],[31.0,"low",0.6014,0.6396,0.0,0.6014,0.0,0.0,0.7499,11.91,16.97,0.1994,0.3094,26.8,6.2,[6]],[32.2,"low",0.6248,0.6621,0.0,0.6248,0.0,0.0,0.7528,12.09,16.72,0.2007,0.3141,26.8,6.7,[6]],[33.3,"low",0.6477,0.6842,0.0,0.6477,0.0,0.0,0.7557,12.27,16.47,0.2021,0.3188,26.8,7.2,[6]],[34.4,"low",0.6704,0.7057,0.0,0.6704,0.0,0.0,0.7585,12.46,16.23,0.2034,0.3235,26.8,7.7,[6]],[35.7,"medium",0.6927,0.7268,0.0,0.6927,0.01,0.0,0.7613,12.64,16.0,0.2048,0.3282,26.8,8.2,[]],[37.4,"medium",0.7147,0.7474,0.0,0.7147,0.0347,0.0,0.7639,12.83,15.77,0.2061,0.3328,26.8,8.7,[]],[39.1,"medium",0.7365,0.7676,0.0,0.7365,0.0594,0.0,0.7666,13.01,15.55,0.2074,0.3375,26.8,9.2,[]],[40.7,"medium",0.7579,0.7874,0.0,0.7579,0.084,0.0,0.7691,13.19,15.34,0.2087,0.3422,26.8,9.7,[]],[42.4,"medium",0.779,0.8067,0.0,0.779,0.1087,0.0,0.7716,13.38,15.13,0.21,0.3469,26.8,10.2,[]],[44.0,"medium",0.7998,0.8256,0.0,0.7998,0.1334,0.0,0.7741,13.56,14.93,0.2113,0.3516,26.8,10.7,[]],[45.6,"medium",0.8204,0.8441,0.0,0.8204,0.158,0.0,0.7765,13.74,14.74,0.2126,0.3563,26.8,11.2,[]],[47.1,"medium",0.8407,0.8623,0.0,0.8407,0.1827,0.0,0.7789,13.93,14.54,0.2138,0.361,26.8,11.7,[]],[48.7,"medium",0.8607,0.88,0.0,0.8607,0.2074,0.0,0.7812,14.11,14.36,0.2151,0.3657,26.8,12.2,[]],[50.2,"medium",0.8804,0.8975,0.0,0.8804,0.2321,0.0,0.7835,14.3,14.18,0.2163,0.3703,26.8,12.7,[]],[51.8,"medium",0.9,0.9145,0.0,0.9,0.2567,0.0,0.7857,14.48,14.0,0.2176,0.375,26.8,13.2,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,4.93,35.46,0.1427,0.148,26.32,-11.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,5.09,34.32,0.1448,0.153,26.32,-10.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,5.26,33.25,0.1469,0.1579,26.32,-10.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,5.43,32.24,0.149,0.1628,26.32,-9.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,5.6,31.29,0.151,0.1678,26.32,-9.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,5.76,30.4,0.153,0.1727,26.32,-8.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6267,5.93,29.55,0.155,0.1776,26.32,-8.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6334,6.1,28.75,0.1569,0.1826,26.32,-7.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6399,6.27,28.0,0.1588,0.1875,26.32,-7.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6461,6.43,27.28,0.1607,0.1925,26.32,-6.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6521,6.6,26.6,0.1626,0.1974,26.32,-6.32,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.658,6.77,25.95,0.1644,0.2023,26.32,-5.82,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6636,6.94,25.33,0.1662,0.2073,26.32,-5.32,[3]],[0.9,"low",0.0161,0.0185,0.0,0.0161,0.0,0.0,0.6691,7.1,24.74,0.168,0.2122,26.32,-4.82,[3]],[2.8,"low",0.0518,0.0592,0.0,0.0518,0.0,0.0,0.6744,7.27,24.18,0.1698,0.2171,26.32,-4.32,[3]],[4.6,"low",0.0866,0.0986,0.0,0.0866,0.0,0.0,0.6795,7.44,23.64,0.1715,0.2221,26.32,-3.82,[3]],[6.4,"low",0.1208,0.1369,0.0,0.1208,0.0,0.0,0.6845,7.61,23.13,0.1732,0.227,26.32,-3.32,[3]],[8.2,"low",0.1541,0.174,0.0,0.1541,0.0,0.0,0.6893,7.78,22.64,0.1749,0.2319,26.32,-2.82,[3]],[9.9,"low",0.1868,0.2101,0.0,0.1868,0.0,0.0,0.694,7.95,22.16,0.1766,0.2369,26.32,-2.32,[3]],[11.6,"low",0.2188,0.2451,0.0,0.2188,0.0,0.0,0.6986,8.11,21.71,0.1783,0.2418,26.32,-1.82,[3]],[13.2,"low",0.2502,0.2791,0.0,0.2502,0.0,0.0,0.703,8.28,21.28,0.1799,0.2467,26.32,-1.32,[3]],[14.8,"low",0.2809,0.3122,0.0,0.2809,0.0,0.0,0.7073,8.45,20.86,0.1815,0.2517,26.32,-0.82,[3]],[16.4,"low",0.311,0.3443,0.0,0.311,0.0,0.0,0.7115,8.62,20.46,0.1831,0.2566,26.32,-0.32,[3]],[17.9,"low",0.3406,0.3756,0.0,0.3406,0.0,0.0,0.7155,8.79,20.07,0.1847,0.2615,26.32,0.18,[6]],[19.4,"low",0.3696,0.406,0.0,0.3696,0.0,0.0,0.7195,8.96,19.7,0.1863,0.2665,26.32,0.68,[6]],[20.8,"low",0.3981,0.4356,0.0,0.3981,0.0,0.0,0.7234,9.13,19.34,0.1879,0.2714,26.32,1.18,[6]],[22.3,"low",0.426,0.4644,0.0,0.426,0.0,0.0,0.7271,9.29,19.0,0.1894,0.2763,26.32,1.68,[6]],[23.6,"low",0.4535,0.4925,0.0,0.4535,0.0,0.0,0.7308,9.46,18.67,0.1909,0.2813,26.32,2.18,[6]],[25.0,"low",0.4805,0.5199,0.0,0.4805,0.0,0.0,0.7343,9.63,18.34,0.1924,0.2862,26.32,2.68,[6]],[26.3,"low",0.507,0.5465,0.0,0.507,0.0,0.0,0.7378,9.8,18.03,0.1939,0.2911,26.32,3.18,[6]],[27.6,"low",0.5331,0.5725,0.0,0.5331,0.0,0.0,0.7412,9.97,17.73,0.1954,0.2961,26.32,3.68,[6]],[28.9,"low",0.5588,0.5979,0.0,0.5588,0.0,0.0,0.7445,10.14,17.44,0.1969,0.301,26.32,4.18,[6]],[30.2,"low",0.584,0.6226,0.0,0.584,0.0,0.0,0.7477,10.31,17.16,0.1984,0.3059,26.32,4.68,[6]],[31.4,"low",0.6088,0.6468,0.0,0.6088,0.0,0.0,0.7508,10.48,16.89,0.1998,0.3109,26.32,5.18,[6]],[32.6,"low",0.6333,0.6703,0.0,0.6333,0.0,0.0,0.7539,10.65,16.62,0.2012,0.3158,26.32,5.68,[6]],[33.8,"low",0.6573,0.6933,0.0,0.6573,0.0,0.0,0.7569,10.82,16.37,0.2027,0.3208,26.32,6.18,[6]],[34.9,"low",0.681,0.7158,0.0,0.681,0.0,0.0,0.7598,10.98,16.12,0.2041,0.3257,26.32,6.68,[6]],[36.1,"medium",0.7044,0.7377,0.0,0.7044,0.0,0.0,0.7627,11.15,15.88,0.2055,0.3306,26.32,7.18,[]],[37.3,"medium",0.7274,0.7592,0.0,0.7274,0.0041,0.0,0.7655,11.32,15.65,0.2069,0.3356,26.32,7.68,[]],[39.0,"medium",0.75,0.7801,0.0,0.75,0.0301,0.0,0.7682,11.49,15.42,0.2082,0.3405,26.32,8.18,[]],[40.7,"medium",0.7723,0.8006,0.0,0.7723,0.0561,0.0,0.7709,11.66,15.2,0.2096,0.3454,26.32,8.68,[]],[42.4,"medium",0.7944,0.8207,0.0,0.7944,0.0821,0.0,0.7735,11.83,14.98,0.2109,0.3504,26.32,9.18,[]],[44.1,"medium",0.8161,0.8403,0.0,0.8161,0.108,0.0,0.776,12.0,14.78,0.2123,0.3553,26.32,9.68,[]],[45.8,"medium",0.8375,0.8594,0.0,0.8375,0.134,0.0,0.7785,12.17,14.57,0.2136,0.3602,26.32,10.18,[]],[47.4,"medium",0.8586,0.8782,0.0,0.8586,0.16,0.0,0.781,12.34,14.38,0.2149,0.3652,26.32,10.68,[]],[49.0,"medium",0.8794,0.8966,0.0,0.8794,0.1859,0.0,0.7833,12.51,14.19,0.2163,0.3701,26.32,11.18,[]],[50.7,"medium",0.9,0.9145,0.0,0.9,0.2119,0.0,0.7857,12.68,14.0,0.2176,0.375,26.32,11.68,[]],[52.3,"medium",0.9203,0.9321,0.0,0.9203,0.2379,0.0,0.788,12.85,13.82,0.2189,0.38,26.32,12.18,[]],[53.8,"medium",0.9403,0.9494,0.0,0.9403,0.2639,0.0,0.7902,13.02,13.64,0.2201,0.3849,26.32,12.68,[]],[55.4,"medium",0.9601,0.9663,0.0,0.9601,0.2898,0.0,0.7924,13.19,13.47,0.2214,0.3898,26.32,13.18,[]],[57.0,"medium",0.9796,0.9828,0.0,0.9796,0.3158,0.0,0.7946,13.36,13.3,0.2227,0.3948,26.32,13.68,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,4.83,35.01,0.1435,0.15,26.2,-11.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,4.99,33.88,0.1457,0.155,26.2,-10.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,5.15,32.82,0.1478,0.16,26.2,-10.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,5.32,31.83,0.1498,0.165,26.2,-9.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,5.48,30.89,0.1519,0.17,26.2,-9.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,5.65,30.01,0.1539,0.175,26.2,-8.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6299,5.81,29.17,0.1559,0.18,26.2,-8.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6365,5.98,28.39,0.1578,0.185,26.2,-7.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.643,6.14,27.64,0.1598,0.19,26.2,-7.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6492,6.3,26.93,0.1617,0.195,26.2,-6.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6552,6.47,26.26,0.1635,0.2,26.2,-6.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.661,6.63,25.62,0.1654,0.2049,26.2,-5.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6666,6.8,25.01,0.1672,0.2099,26.2,-5.2,[3]],[1.9,"low",0.0361,0.0414,0.0,0.0361,0.0,0.0,0.672,6.96,24.42,0.169,0.2149,26.2,-4.7,[3]],[3.8,"low",0.0718,0.0819,0.0,0.0718,0.0,0.0,0.6773,7.13,23.87,0.1708,0.2199,26.2,-4.2,[3]],[5.7,"low",0.1067,0.1212,0.0,0.1067,0.0,0.0,0.6824,7.29,23.34,0.1725,0.2249,26.2,-3.7,[3]],[7.5,"low",0.1408,0.1592,0.0,0.1408,0.0,0.0,0.6874,7.46,22.83,0.1742,0.2299,26.2,-3.2,[3]],[9.3,"low",0.1742,0.1962,0.0,0.1742,0.0,0.0,0.6922,7.62,22.35,0.1759,0.2349,26.2,-2.7,[3]],[11.0,"low",0.2068,0.2321,0.0,0.2068,0.0,0.0,0.6969,7.79,21.88,0.1776,0.2399,26.2,-2.2,[3]],[12.6,"low",0.2388,0.2669,0.0,0.2388,0.0,0.0,0.7014,7.95,21.43,0.1793,0.2449,26.2,-1.7,[3]],[14.3,"low",0.2702,0.3007,0.0,0.2702,0.0,0.0,0.7058,8.12,21.01,0.181,0.2499,26.2,-1.2,[3]],[15.9,"low",0.3009,0.3336,0.0,0.3009,0.0,0.0,0.7101,8.28,20.59,0.1826,0.2549,26.2,-0.7,[3]],[17.4,"low",0.3311,0.3655,0.0,0.3311,0.0,0.0,0.7142,8.45,20.2,0.1842,0.2599,26.2,-0.2,[3]],[18.9,"low",0.3606,0.3966,0.0,0.3606,0.0,0.0,0.7183,8.61,19.82,0.1858,0.2649,26.2,0.3,[6]],[20.4,"low",0.3896,0.4269,0.0,0.3896,0.0,0.0,0.7222,8.78,19.45,0.1874,0.2699,26.2,0.8,[6]],[21.9,"low",0.4181,0.4563,0.0,0.4181,0.0,0.0,0.726,8.94,19.1,0.189,0.2749,26.2,1.3,[6]],[23.3,"low",0.4461,0.485,0.0,0.4461,0.0,0.0,0.7298,9.11,18.75,0.1905,0.2799,26.2,1.8,[6]],[24.7,"low",0.4735,0.5129,0.0,0.4735,0.0,0.0,0.7334,9.27,18.43,0.192,0.2849,26.2,2.3,[6]],[26.0,"low",0.5005,0.54,0.0,0.5005,0.0,0.0,0.7369,9.44,18.11,0.1936,0.2899,26.2,2.8,[6]],[27.3,"low",0.5271,0.5665,0.0,0.5271,0.0,0.0,0.7404,9.6,17.8,0.1951,0.2949,26.2,3.3,[6]],[28.6,"low",0.5532,0.5924,0.0,0.5532,0.0,0.0,0.7438,9.77,17.5,0.1966,0.2999,26.2,3.8,[6]],[29.9,"low",0.5788,0.6176,0.0,0.5788,0.0,0.0,0.747,9.94,17.22,0.1981,0.3049,26.2,4.3,[6]],[31.2,"low",0.604,0.6421,0.0,0.604,0.0,0.0,0.7502,10.1,16.94,0.1995,0.3099,26.2,4.8,[6]],[32.4,"low",0.6289,0.6661,0.0,0.6289,0.0,0.0,0.7534,10.27,16.67,0.201,0.3149,26.2,5.3,[6]],[33.6,"low",0.6533,0.6895,0.0,0.6533,0.0,0.0,0.7564,10.43,16.41,0.2024,0.3199,26.2,5.8,[6]],[34.7,"low",0.6774,0.7123,0.0,0.6774,0.0,0.0,0.7594,10.6,16.16,0.2038,0.3249,26.2,6.3,[6]],[35.9,"medium",0.7011,0.7346,0.0,0.7011,0.0,0.0,0.7623,10.76,15.91,0.2053,0.3299,26.2,6.8,[]],[37.0,"medium",0.7244,0.7564,0.0,0.7244,0.0,0.0,0.7651,10.93,15.68,0.2067,0.3349,26.2,7.3,[]],[38.5,"medium",0.7474,0.7777,0.0,0.7474,0.0156,0.0,0.7679,11.1,15.44,0.2081,0.3399,26.2,7.8,[]],[40.3,"medium",0.7701,0.7985,0.0,0.7701,0.0419,0.0,0.7706,11.26,15.22,0.2095,0.3449,26.2,8.3,[]],[42.0,"medium",0.7924,0.8189,0.0,0.7924,0.0682,0.0,0.7732,11.43,15.0,0.2108,0.3499,26.2,8.8,[]],[43.7,"medium",0.8144,0.8388,0.0,0.8144,0.0945,0.0,0.7758,11.59,14.79,0.2122,0.3549,26.2,9.3,[]],[45.4,"medium",0.8361,0.8582,0.0,0.8361,0.1208,0.0,0.7784,11.76,14.59,0.2135,0.3599,26.2,9.8,[]],[47.0,"medium",0.8575,0.8772,0.0,0.8575,0.1471,0.0,0.7808,11.93,14.39,0.2149,0.3649,26.2,10.3,[]],[48.7,"medium",0.8786,0.8959,0.0,0.8786,0.1734,0.0,0.7833,12.09,14.19,0.2162,0.3699,26.2,10.8,[]],[50.3,"medium",0.8995,0.9141,0.0,0.8995,0.1997,0.0,0.7856,12.26,14.0,0.2175,0.3749,26.2,11.3,[]],[51.9,"medium",0.92,0.9319,0.0,0.92,0.226,0.0,0.788,12.42,13.82,0.2188,0.3799,26.2,11.8,[]],[53.6,"medium",0.9403,0.9494,0.0,0.9403,0.2524,0.0,0.7902,12.59,13.64,0.2201,0.3849,26.2,12.3,[]],[55.1,"medium",0.9603,0.9665,0.0,0.9603,0.2787,0.0,0.7925,12.76,13.46,0.2214,0.3899,26.2,12.8,[]],[56.7,"medium",0.9801,0.9833,0.0,0.9801,0.305,0.0,0.7946,12.92,13.29,0.2227,0.3949,26.2,13.3,[]],[58.3,"medium",0.9996,0.9997,0.0,0.9996,0.3313,0.0,0.7968,13.09,13.13,0.224,0.3999,26.2,13.8,[]]]],"Silicone":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,38.11,70.93,0.1041,0.074,28.43,-13.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,39.4,68.64,0.1057,0.0765,28.43,-12.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,40.7,66.49,0.1072,0.079,28.43,-12.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,41.99,64.48,0.1088,0.0814,28.43,-11.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,43.28,62.58,0.1102,0.0839,28.43,-11.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,44.58,60.8,0.1117,0.0864,28.43,-10.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,45.87,59.11,0.1131,0.0888,28.43,-10.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,47.17,57.51,0.1145,0.0913,28.43,-9.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,48.47,56.0,0.1159,0.0938,28.43,-9.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,49.76,54.56,0.1173,0.0962,28.43,-8.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,51.06,53.2,0.1187,0.0987,28.43,-8.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,52.36,51.9,0.12,0.1012,28.43,-7.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,53.66,50.66,0.1213,0.1036,28.43,-7.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,54.96,49.48,0.1226,0.1061,28.43,-6.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,56.26,48.36,0.1239,0.1086,28.43,-6.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,57.56,47.29,0.1252,0.111,28.43,-5.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,58.86,46.26,0.1265,0.1135,28.43,-5.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,60.16,45.27,0.1277,0.116,28.43,-4.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,61.47,44.33,0.1289,0.1184,28.43,-4.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,62.77,43.43,0.1301,0.1209,28.43,-3.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,64.07,42.56,0.1313,0.1234,28.43,-3.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,65.37,41.72,0.1325,0.1258,28.43,-2.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,66.68,40.92,0.1337,0.1283,28.43,-2.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,67.98,40.15,0.1349,0.1308,28.43,-1.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,69.29,39.4,0.136,0.1332,28.43,-1.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,70.59,38.69,0.1371,0.1357,28.43,-0.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,71.9,38.0,0.1383,0.1382,28.43,-0.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,73.2,37.33,0.1394,0.1406,28.43,0.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,74.51,36.69,0.1405,0.1431,28.43,0.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,75.82,36.06,0.1416,0.1456,28.43,1.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,77.12,35.46,0.1427,0.148,28.43,1.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,78.43,34.88,0.1437,0.1505,28.43,2.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,79.74,34.32,0.1448,0.153,28.43,2.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,81.05,33.77,0.1459,0.1554,28.43,3.07,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,82.36,33.25,0.1469,0.1579,28.43,3.57,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,83.66,32.74,0.1479,0.1604,28.43,4.07,[6,7]],[0.1,"low",0.0,0.0,0.004,0.0,0.0,0.0,0.6052,84.97,32.24,0.149,0.1628,28.43,4.57,[6,7]],[0.3,"low",0.0,0.0,0.0207,0.0,0.0,0.0,0.609,86.28,31.76,0.15,0.1653,28.43,5.07,[6,7]],[0.6,"low",0.0,0.0,0.0371,0.0,0.0,0.0,0.6127,87.59,31.29,0.151,0.1678,28.43,5.57,[6,7]],[0.8,"low",0.0,0.0,0.0533,0.0,0.0,0.0,0.6163,88.9,30.84,0.152,0.1702,28.43,6.07,[6,7]],[1.0,"low",0.0,0.0,0.0693,0.0,0.0,0.0,0.6198,90.21,30.4,0.153,0.1727,28.43,6.57,[6,7]],[1.3,"low",0.0,0.0,0.085,0.0,0.0,0.0,0.6233,91.52,29.97,0.154,0.1752,28.43,7.07,[6,7]],[1.5,"low",0.0,0.0,0.1005,0.0,0.0,0.0,0.6267,92.84,29.55,0.155,0.1776,28.43,7.57,[6,7]],[1.7,"low",0.0,0.0,0.1158,0.0,0.0,0.0,0.6301,94.15,29.15,0.1559,0.1801,28.43,8.07,[6,7]],[2.0,"low",0.0,0.0,0.1308,0.0,0.0,0.0,0.6334,95.46,28.75,0.1569,0.1826,28.43,8.57,[6,7]],[2.2,"low",0.0,0.0,0.1457,0.0,0.0,0.0,0.6367,96.77,28.37,0.1579,0.185,28.43,9.07,[6,7]],[2.4,"low",0.0,0.0,0.1604,0.0,0.0,0.0,0.6399,98.08,28.0,0.1588,0.1875,28.43,9.57,[6,7]],[2.6,"low",0.0,0.0,0.1749,0.0,0.0,0.0,0.643,99.4,27.63,0.1598,0.19,28.43,10.07,[6,7]],[2.8,"low",0.0,0.0,0.1892,0.0,0.0,0.0,0.6461,100.71,27.28,0.1607,0.1925,28.43,10.57,[6,7]],[3.0,"low",0.0,0.0,0.2033,0.0,0.0,0.0,0.6491,102.02,26.93,0.1616,0.1949,28.43,11.07,[6,7]],[3.3,"low",0.0,0.0,0.2172,0.0,0.0,0.0,0.6521,103.34,26.6,0.1626,0.1974,28.43,11.57,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,32.8,64.48,0.1088,0.0814,27.49,-12.49,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,33.92,62.4,0.1104,0.0841,27.49,-11.99,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,35.03,60.45,0.112,0.0868,27.49,-11.49,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,36.14,58.62,0.1136,0.0896,27.49,-10.99,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,37.26,56.89,0.1151,0.0923,27.49,-10.49,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,38.37,55.27,0.1166,0.095,27.49,-9.99,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,39.49,53.73,0.1181,0.0977,27.49,-9.49,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,40.6,52.28,0.1196,0.1004,27.49,-8.99,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,41.72,50.9,0.1211,0.1031,27.49,-8.49,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,42.84,49.6,0.1225,0.1058,27.49,-7.99,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,43.95,48.36,0.1239,0.1086,27.49,-7.49,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,45.07,47.18,0.1253,0.1113,27.49,-6.99,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,46.19,46.06,0.1267,0.114,27.49,-6.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,47.31,44.99,0.1281,0.1167,27.49,-5.99,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,48.43,43.96,0.1294,0.1194,27.49,-5.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,49.55,42.99,0.1307,0.1221,27.49,-4.99,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,50.67,42.05,0.132,0.1248,27.49,-4.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,51.79,41.16,0.1333,0.1276,27.49,-3.99,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,52.91,40.3,0.1346,0.1303,27.49,-3.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,54.03,39.48,0.1359,0.133,27.49,-2.99,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,55.15,38.69,0.1371,0.1357,27.49,-2.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,56.27,37.93,0.1384,0.1384,27.49,-1.99,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,57.39,37.2,0.1396,0.1411,27.49,-1.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,58.52,36.5,0.1408,0.1438,27.49,-0.99,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,59.64,35.82,0.142,0.1466,27.49,-0.49,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,60.76,35.17,0.1432,0.1493,27.49,0.01,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,61.89,34.54,0.1444,0.152,27.49,0.51,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,63.01,33.94,0.1455,0.1547,27.49,1.01,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,64.14,33.35,0.1467,0.1574,27.49,1.51,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,65.26,32.79,0.1478,0.1601,27.49,2.01,[6,7]],[0.1,"low",0.0,0.0,0.004,0.0,0.0,0.0,0.6052,66.39,32.24,0.149,0.1628,27.49,2.51,[6,7]],[0.3,"low",0.0,0.0,0.0224,0.0,0.0,0.0,0.6094,67.51,31.71,0.1501,0.1656,27.49,3.01,[6,7]],[0.6,"low",0.0,0.0,0.0404,0.0,0.0,0.0,0.6134,68.64,31.2,0.1512,0.1683,27.49,3.51,[6,7]],[0.9,"low",0.0,0.0,0.0581,0.0,0.0,0.0,0.6174,69.76,30.7,0.1523,0.171,27.49,4.01,[6,7]],[1.1,"low",0.0,0.0,0.0756,0.0,0.0,0.0,0.6212,70.89,30.22,0.1534,0.1737,27.49,4.51,[6,7]],[1.4,"low",0.0,0.0,0.0928,0.0,0.0,0.0,0.625,72.02,29.76,0.1545,0.1764,27.49,5.01,[6,7]],[1.6,"low",0.0,0.0,0.1097,0.0,0.0,0.0,0.6288,73.14,29.31,0.1556,0.1791,27.49,5.51,[6,7]],[1.9,"low",0.0,0.0,0.1263,0.0,0.0,0.0,0.6324,74.27,28.87,0.1566,0.1818,27.49,6.01,[6,7]],[2.1,"low",0.0,0.0,0.1428,0.0,0.0,0.0,0.636,75.4,28.45,0.1577,0.1846,27.49,6.51,[6,7]],[2.4,"low",0.0,0.0,0.1589,0.0,0.0,0.0,0.6395,76.53,28.03,0.1587,0.1873,27.49,7.01,[6,7]],[2.6,"low",0.0,0.0,0.1749,0.0,0.0,0.0,0.643,77.65,27.63,0.1598,0.19,27.49,7.51,[6,7]],[2.9,"low",0.0,0.0,0.1906,0.0,0.0,0.0,0.6464,78.78,27.24,0.1608,0.1927,27.49,8.01,[6,7]],[3.1,"low",0.0,0.0,0.2061,0.0,0.0,0.0,0.6497,79.91,26.87,0.1618,0.1954,27.49,8.51,[6,7]],[3.3,"low",0.0,0.0,0.2214,0.0,0.0,0.0,0.653,81.04,26.5,0.1628,0.1981,27.49,9.01,[6,7]],[3.5,"low",0.0,0.0,0.2365,0.0,0.0,0.0,0.6562,82.17,26.14,0.1639,0.2008,27.49,9.51,[6,7]],[3.8,"low",0.0,0.0,0.2513,0.0,0.0,0.0,0.6594,83.3,25.79,0.1649,0.2036,27.49,10.01,[6,7]],[4.0,"low",0.0,0.0,0.266,0.0,0.0,0.0,0.6625,84.43,25.45,0.1658,0.2063,27.49,10.51,[6,7]],[4.2,"low",0.0,0.0,0.2805,0.0,0.0,0.0,0.6655,85.56,25.12,0.1668,0.209,27.49,11.01,[6,7]],[5.1,"low",0.0125,0.0143,0.2948,0.0125,0.0,0.0045,0.6685,86.69,24.8,0.1678,0.2117,27.49,11.51,[6]],[6.5,"low",0.0322,0.0369,0.3089,0.0322,0.0,0.0113,0.6715,87.82,24.49,0.1688,0.2144,27.49,12.01,[6]],[7.8,"low",0.0518,0.0592,0.3229,0.0518,0.0,0.0176,0.6744,88.95,24.18,0.1698,0.2171,27.49,12.51,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,31.44,62.77,0.1101,0.0836,27.24,-12.24,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,32.51,60.74,0.1117,0.0864,27.24,-11.74,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,33.58,58.84,0.1134,0.0892,27.24,-11.24,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,34.65,57.06,0.115,0.092,27.24,-10.74,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,35.71,55.38,0.1165,0.0948,27.24,-10.24,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,36.78,53.8,0.1181,0.0976,27.24,-9.74,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,37.85,52.31,0.1196,0.1004,27.24,-9.24,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,38.92,50.89,0.1211,0.1032,27.24,-8.74,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,39.99,49.55,0.1226,0.1059,27.24,-8.24,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,41.06,48.28,0.124,0.1087,27.24,-7.74,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,42.13,47.08,0.1254,0.1115,27.24,-7.24,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,43.2,45.93,0.1269,0.1143,27.24,-6.74,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,44.28,44.83,0.1283,0.1171,27.24,-6.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,45.35,43.79,0.1296,0.1199,27.24,-5.74,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,46.42,42.8,0.131,0.1227,27.24,-5.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,47.49,41.85,0.1323,0.1255,27.24,-4.74,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,48.57,40.94,0.1337,0.1283,27.24,-4.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,49.64,40.06,0.135,0.131,27.24,-3.74,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,50.72,39.23,0.1363,0.1338,27.24,-3.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,51.79,38.43,0.1376,0.1366,27.24,-2.74,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,52.86,37.66,0.1388,0.1394,27.24,-2.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,53.94,36.92,0.1401,0.1422,27.24,-1.74,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,55.02,36.21,0.1413,0.145,27.24,-1.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,56.09,35.53,0.1425,0.1478,27.24,-0.74,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,57.17,34.87,0.1438,0.1506,27.24,-0.24,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,58.25,34.24,0.145,0.1533,27.24,0.26,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,59.32,33.63,0.1462,0.1561,27.24,0.76,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,60.4,33.04,0.1473,0.1589,27.24,1.26,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,61.48,32.47,0.1485,0.1617,27.24,1.76,[6,7]],[0.2,"low",0.0,0.0,0.0152,0.0,0.0,0.0,0.6078,62.56,31.92,0.1497,0.1645,27.24,2.26,[6,7]],[0.5,"low",0.0,0.0,0.0339,0.0,0.0,0.0,0.6119,63.63,31.38,0.1508,0.1673,27.24,2.76,[6,7]],[0.8,"low",0.0,0.0,0.0522,0.0,0.0,0.0,0.616,64.71,30.87,0.1519,0.1701,27.24,3.26,[6,7]],[1.1,"low",0.0,0.0,0.0702,0.0,0.0,0.0,0.62,65.79,30.37,0.1531,0.1729,27.24,3.76,[6,7]],[1.3,"low",0.0,0.0,0.0879,0.0,0.0,0.0,0.624,66.87,29.89,0.1542,0.1756,27.24,4.26,[6,7]],[1.6,"low",0.0,0.0,0.1054,0.0,0.0,0.0,0.6278,67.95,29.42,0.1553,0.1784,27.24,4.76,[6,7]],[1.8,"low",0.0,0.0,0.1226,0.0,0.0,0.0,0.6316,69.03,28.97,0.1564,0.1812,27.24,5.26,[6,7]],[2.1,"low",0.0,0.0,0.1395,0.0,0.0,0.0,0.6353,70.11,28.53,0.1575,0.184,27.24,5.76,[6,7]],[2.3,"low",0.0,0.0,0.1562,0.0,0.0,0.0,0.6389,71.19,28.1,0.1586,0.1868,27.24,6.26,[6,7]],[2.6,"low",0.0,0.0,0.1726,0.0,0.0,0.0,0.6425,72.27,27.69,0.1596,0.1896,27.24,6.76,[6,7]],[2.8,"low",0.0,0.0,0.1888,0.0,0.0,0.0,0.646,73.35,27.29,0.1607,0.1924,27.24,7.26,[6,7]],[3.1,"low",0.0,0.0,0.2047,0.0,0.0,0.0,0.6494,74.44,26.9,0.1617,0.1952,27.24,7.76,[6,7]],[3.3,"low",0.0,0.0,0.2204,0.0,0.0,0.0,0.6528,75.52,26.52,0.1628,0.198,27.24,8.26,[6,7]],[3.5,"low",0.0,0.0,0.2359,0.0,0.0,0.0,0.6561,76.6,26.15,0.1638,0.2007,27.24,8.76,[6,7]],[3.8,"low",0.0,0.0,0.2512,0.0,0.0,0.0,0.6594,77.68,25.79,0.1648,0.2035,27.24,9.26,[6,7]],[4.0,"low",0.0,0.0,0.2663,0.0,0.0,0.0,0.6625,78.76,25.45,0.1659,0.2063,27.24,9.76,[6,7]],[4.2,"low",0.0,0.0,0.2812,0.0,0.0,0.0,0.6657,79.85,25.11,0.1669,0.2091,27.24,10.26,[6,7]],[5.2,"low",0.0139,0.016,0.2958,0.0139,0.0,0.0053,0.6687,80.93,24.78,0.1679,0.2119,27.24,10.76,[6]],[6.6,"low",0.0342,0.0392,0.3103,0.0342,0.0,0.0126,0.6718,82.01,24.45,0.1689,0.2147,27.24,11.26,[6]],[8.0,"low",0.0542,0.062,0.3246,0.0542,0.0,0.0195,0.6747,83.09,24.14,0.1699,0.2175,27.24,11.76,[6]],[9.3,"low",0.074,0.0844,0.3387,0.074,0.0,0.0259,0.6776,84.18,23.84,0.1709,0.2203,27.24,12.26,[6]],[10.6,"low",0.0935,0.1064,0.3527,0.0935,0.0,0.0318,0.6805,85.26,23.54,0.1718,0.223,27.24,12.76,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,28.61,59.11,0.1131,0.0888,26.67,-11.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,29.58,57.2,0.1148,0.0918,26.67,-11.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,30.55,55.41,0.1165,0.0947,26.67,-10.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,31.52,53.73,0.1181,0.0977,26.67,-10.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,32.49,52.15,0.1197,0.1007,26.67,-9.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,33.46,50.66,0.1213,0.1036,26.67,-9.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,34.44,49.26,0.1229,0.1066,26.67,-8.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,35.41,47.92,0.1244,0.1095,26.67,-8.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,36.38,46.66,0.126,0.1125,26.67,-7.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,37.36,45.47,0.1274,0.1155,26.67,-7.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,38.33,44.33,0.1289,0.1184,26.67,-6.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,39.31,43.25,0.1304,0.1214,26.67,-6.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,40.28,42.22,0.1318,0.1244,26.67,-5.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,41.26,41.24,0.1332,0.1273,26.67,-5.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,42.23,40.3,0.1346,0.1303,26.67,-4.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,43.21,39.4,0.136,0.1332,26.67,-4.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,44.19,38.55,0.1374,0.1362,26.67,-3.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,45.16,37.73,0.1387,0.1392,26.67,-3.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,46.14,36.94,0.14,0.1421,26.67,-2.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,47.12,36.19,0.1414,0.1451,26.67,-2.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,48.1,35.46,0.1427,0.148,26.67,-1.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,49.07,34.77,0.144,0.151,26.67,-1.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,50.05,34.1,0.1452,0.154,26.67,-0.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,51.03,33.46,0.1465,0.1569,26.67,-0.17,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,52.01,32.84,0.1477,0.1599,26.67,0.33,[6,7]],[0.1,"low",0.0,0.0,0.004,0.0,0.0,0.0,0.6052,52.99,32.24,0.149,0.1628,26.67,0.83,[6,7]],[0.4,"low",0.0,0.0,0.024,0.0,0.0,0.0,0.6097,53.97,31.66,0.1502,0.1658,26.67,1.33,[6,7]],[0.7,"low",0.0,0.0,0.0436,0.0,0.0,0.0,0.6141,54.95,31.11,0.1514,0.1688,26.67,1.83,[6,7]],[0.9,"low",0.0,0.0,0.0629,0.0,0.0,0.0,0.6184,55.93,30.57,0.1526,0.1717,26.67,2.33,[6,7]],[1.2,"low",0.0,0.0,0.0819,0.0,0.0,0.0,0.6226,56.91,30.05,0.1538,0.1747,26.67,2.83,[6,7]],[1.5,"low",0.0,0.0,0.1005,0.0,0.0,0.0,0.6267,57.89,29.55,0.155,0.1776,26.67,3.33,[6,7]],[1.8,"low",0.0,0.0,0.1188,0.0,0.0,0.0,0.6308,58.88,29.07,0.1561,0.1806,26.67,3.83,[6,7]],[2.1,"low",0.0,0.0,0.1368,0.0,0.0,0.0,0.6347,59.86,28.6,0.1573,0.1836,26.67,4.33,[6,7]],[2.3,"low",0.0,0.0,0.1545,0.0,0.0,0.0,0.6386,60.84,28.15,0.1584,0.1865,26.67,4.83,[6,7]],[2.6,"low",0.0,0.0,0.172,0.0,0.0,0.0,0.6424,61.82,27.71,0.1596,0.1895,26.67,5.33,[6,7]],[2.8,"low",0.0,0.0,0.1892,0.0,0.0,0.0,0.6461,62.8,27.28,0.1607,0.1925,26.67,5.83,[6,7]],[3.1,"low",0.0,0.0,0.2061,0.0,0.0,0.0,0.6497,63.79,26.87,0.1618,0.1954,26.67,6.33,[6,7]],[3.3,"low",0.0,0.0,0.2228,0.0,0.0,0.0,0.6533,64.77,26.47,0.1629,0.1984,26.67,6.83,[6,7]],[3.6,"low",0.0,0.0,0.2392,0.0,0.0,0.0,0.6568,65.75,26.08,0.164,0.2013,26.67,7.33,[6,7]],[3.8,"low",0.0,0.0,0.2554,0.0,0.0,0.0,0.6602,66.74,25.7,0.1651,0.2043,26.67,7.83,[6,7]],[4.1,"low",0.0,0.0,0.2713,0.0,0.0,0.0,0.6636,67.72,25.33,0.1662,0.2073,26.67,8.33,[6,7]],[4.4,"low",0.0016,0.0018,0.287,0.0016,0.0,0.0007,0.6669,68.7,24.97,0.1673,0.2102,26.67,8.83,[6]],[5.9,"low",0.0233,0.0267,0.3025,0.0233,0.0,0.0098,0.6701,69.69,24.63,0.1683,0.2132,26.67,9.33,[6]],[7.3,"low",0.0447,0.0511,0.3178,0.0447,0.0,0.0183,0.6733,70.67,24.29,0.1694,0.2161,26.67,9.83,[6]],[8.8,"low",0.0658,0.0751,0.3329,0.0658,0.0,0.0263,0.6764,71.66,23.96,0.1705,0.2191,26.67,10.33,[6]],[10.2,"low",0.0866,0.0986,0.3478,0.0866,0.0,0.0338,0.6795,72.64,23.64,0.1715,0.2221,26.67,10.83,[6]],[11.6,"low",0.1072,0.1217,0.3625,0.1072,0.0,0.0407,0.6825,73.63,23.33,0.1725,0.225,26.67,11.33,[6]],[12.9,"low",0.1275,0.1444,0.3769,0.1275,0.0,0.0471,0.6855,74.61,23.03,0.1736,0.228,26.67,11.83,[6]],[14.3,"low",0.1475,0.1667,0.3912,0.1475,0.0,0.053,0.6884,75.6,22.73,0.1746,0.2309,26.67,12.33,[6]],[15.7,"low",0.1673,0.1886,0.4054,0.1673,0.0052,0.0585,0.6912,76.58,22.45,0.1756,0.2339,26.67,12.83,[6]],[17.4,"low",0.1868,0.2101,0.4193,0.1868,0.0207,0.0635,0.694,77.57,22.16,0.1766,0.2369,26.67,13.33,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,25.22,54.56,0.1173,0.0962,25.93,-10.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,26.08,52.8,0.1191,0.0994,25.93,-10.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,26.93,51.15,0.1208,0.1026,25.93,-9.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,27.79,49.6,0.1225,0.1058,25.93,-9.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,28.65,48.14,0.1242,0.1091,25.93,-8.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,29.5,46.77,0.1258,0.1123,25.93,-8.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,30.36,45.47,0.1274,0.1155,25.93,-7.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,31.22,44.24,0.129,0.1187,25.93,-7.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,32.08,43.07,0.1306,0.1219,25.93,-6.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,32.94,41.97,0.1322,0.1251,25.93,-6.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,33.8,40.92,0.1337,0.1283,25.93,-5.93,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,34.66,39.92,0.1352,0.1315,25.93,-5.43,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,35.52,38.97,0.1367,0.1347,25.93,-4.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,36.38,38.06,0.1382,0.1379,25.93,-4.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,37.24,37.2,0.1396,0.1411,25.93,-3.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,38.1,36.37,0.141,0.1443,25.93,-3.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,38.96,35.58,0.1424,0.1475,25.93,-2.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,39.82,34.83,0.1438,0.1508,25.93,-2.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,40.68,34.1,0.1452,0.154,25.93,-1.93,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,41.54,33.4,0.1466,0.1572,25.93,-1.43,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,42.41,32.74,0.1479,0.1604,25.93,-0.93,[3]],[0.1,"low",0.0,0.0,0.0091,0.0,0.0,0.0,0.6064,43.27,32.09,0.1493,0.1636,25.93,-0.43,[3]],[0.5,"low",0.0,0.0,0.0306,0.0,0.0,0.0,0.6112,44.13,31.48,0.1506,0.1668,25.93,0.07,[6,7]],[0.8,"low",0.0,0.0,0.0517,0.0,0.0,0.0,0.6159,44.99,30.88,0.1519,0.17,25.93,0.57,[6,7]],[1.1,"low",0.0,0.0,0.0724,0.0,0.0,0.0,0.6205,45.86,30.31,0.1532,0.1732,25.93,1.07,[6,7]],[1.4,"low",0.0,0.0,0.0928,0.0,0.0,0.0,0.625,46.72,29.76,0.1545,0.1764,25.93,1.57,[6,7]],[1.7,"low",0.0,0.0,0.1127,0.0,0.0,0.0,0.6294,47.59,29.23,0.1558,0.1796,25.93,2.07,[6,7]],[2.0,"low",0.0,0.0,0.1323,0.0,0.0,0.0,0.6337,48.45,28.72,0.157,0.1828,25.93,2.57,[6,7]],[2.3,"low",0.0,0.0,0.1516,0.0,0.0,0.0,0.638,49.32,28.22,0.1583,0.186,25.93,3.07,[6,7]],[2.6,"low",0.0,0.0,0.1706,0.0,0.0,0.0,0.6421,50.18,27.74,0.1595,0.1892,25.93,3.57,[6,7]],[2.8,"low",0.0,0.0,0.1892,0.0,0.0,0.0,0.6461,51.05,27.28,0.1607,0.1925,25.93,4.07,[6,7]],[3.1,"low",0.0,0.0,0.2075,0.0,0.0,0.0,0.65,51.91,26.83,0.1619,0.1957,25.93,4.57,[6,7]],[3.4,"low",0.0,0.0,0.2255,0.0,0.0,0.0,0.6539,52.78,26.4,0.1631,0.1989,25.93,5.07,[6,7]],[3.6,"low",0.0,0.0,0.2433,0.0,0.0,0.0,0.6577,53.64,25.98,0.1643,0.2021,25.93,5.57,[6,7]],[3.9,"low",0.0,0.0,0.2607,0.0,0.0,0.0,0.6614,54.51,25.57,0.1655,0.2053,25.93,6.07,[6,7]],[4.2,"low",0.0,0.0,0.2779,0.0,0.0,0.0,0.665,55.37,25.18,0.1667,0.2085,25.93,6.57,[6,7]],[5.2,"low",0.0125,0.0143,0.2948,0.0125,0.0,0.006,0.6685,56.24,24.8,0.1678,0.2117,25.93,7.07,[6]],[6.8,"low",0.0358,0.041,0.3115,0.0358,0.0,0.017,0.672,57.11,24.43,0.169,0.2149,25.93,7.57,[6]],[8.3,"low",0.0588,0.0672,0.3279,0.0588,0.0,0.0272,0.6754,57.97,24.07,0.1701,0.2181,25.93,8.07,[6]],[9.9,"low",0.0815,0.0928,0.3441,0.0815,0.0,0.0369,0.6787,58.84,23.72,0.1712,0.2213,25.93,8.57,[6]],[11.4,"low",0.1038,0.1179,0.36,0.1038,0.0,0.0459,0.682,59.71,23.38,0.1724,0.2245,25.93,9.07,[6]],[12.9,"low",0.1258,0.1425,0.3757,0.1258,0.0,0.0543,0.6852,60.58,23.05,0.1735,0.2277,25.93,9.57,[6]],[14.3,"low",0.1475,0.1667,0.3912,0.1475,0.0,0.0621,0.6884,61.44,22.73,0.1746,0.2309,25.93,10.07,[6]],[15.8,"low",0.1689,0.1904,0.4065,0.1689,0.0,0.0693,0.6914,62.31,22.42,0.1757,0.2341,25.93,10.57,[6]],[17.2,"low",0.19,0.2136,0.4216,0.19,0.0,0.076,0.6945,63.18,22.12,0.1768,0.2374,25.93,11.07,[6]],[18.6,"low",0.2109,0.2364,0.4365,0.2109,0.0,0.0822,0.6974,64.05,21.82,0.1778,0.2406,25.93,11.57,[6]],[20.2,"low",0.2314,0.2588,0.4512,0.2314,0.0127,0.0879,0.7003,64.92,21.54,0.1789,0.2438,25.93,12.07,[6]],[22.0,"low",0.2517,0.2808,0.4656,0.2517,0.0296,0.093,0.7032,65.79,21.26,0.18,0.247,25.93,12.57,[6]],[23.7,"low",0.2717,0.3024,0.4799,0.2717,0.0465,0.0977,0.706,66.66,20.98,0.181,0.2502,25.93,13.07,[6]],[25.4,"low",0.2915,0.3235,0.4941,0.2915,0.0634,0.102,0.7088,67.52,20.72,0.1821,0.2534,25.93,13.57,[6]],[27.1,"low",0.311,0.3443,0.508,0.311,0.0802,0.1058,0.7115,68.39,20.46,0.1831,0.2566,25.93,14.07,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,22.45,50.66,0.1213,0.1036,25.27,-10.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,23.21,49.03,0.1232,0.1071,25.27,-9.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,23.97,47.5,0.1249,0.1105,25.27,-9.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,24.73,46.06,0.1267,0.114,25.27,-8.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,25.5,44.7,0.1284,0.1174,25.27,-8.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,26.26,43.43,0.1301,0.1209,25.27,-7.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,27.02,42.22,0.1318,0.1244,25.27,-7.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,27.78,41.08,0.1335,0.1278,25.27,-6.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,28.55,40.0,0.1351,0.1313,25.27,-6.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,29.31,38.97,0.1367,0.1347,25.27,-5.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,30.08,38.0,0.1383,0.1382,25.27,-5.27,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,30.84,37.07,0.1398,0.1416,25.27,-4.77,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,31.61,36.19,0.1414,0.1451,25.27,-4.27,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,32.37,35.35,0.1429,0.1485,25.27,-3.77,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,33.14,34.54,0.1444,0.152,25.27,-3.27,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,33.91,33.77,0.1459,0.1554,25.27,-2.77,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,34.67,33.04,0.1473,0.1589,25.27,-2.27,[3]],[0.0,"low",0.0,0.0,0.0007,0.0,0.0,0.0,0.6045,35.44,32.34,0.1488,0.1623,25.27,-1.77,[3]],[0.4,"low",0.0,0.0,0.024,0.0,0.0,0.0,0.6097,36.21,31.66,0.1502,0.1658,25.27,-1.27,[3]],[0.7,"low",0.0,0.0,0.0469,0.0,0.0,0.0,0.6148,36.97,31.02,0.1516,0.1693,25.27,-0.77,[3]],[1.0,"low",0.0,0.0,0.0693,0.0,0.0,0.0,0.6198,37.74,30.4,0.153,0.1727,25.27,-0.27,[3]],[1.4,"low",0.0,0.0,0.0912,0.0,0.0,0.0,0.6247,38.51,29.8,0.1544,0.1762,25.27,0.23,[6,7]],[1.7,"low",0.0,0.0,0.1127,0.0,0.0,0.0,0.6294,39.28,29.23,0.1558,0.1796,25.27,0.73,[6,7]],[2.0,"low",0.0,0.0,0.1338,0.0,0.0,0.0,0.6341,40.04,28.68,0.1571,0.1831,25.27,1.23,[6,7]],[2.3,"low",0.0,0.0,0.1545,0.0,0.0,0.0,0.6386,40.81,28.15,0.1584,0.1865,25.27,1.73,[6,7]],[2.6,"low",0.0,0.0,0.1749,0.0,0.0,0.0,0.643,41.58,27.63,0.1598,0.19,25.27,2.23,[6,7]],[2.9,"low",0.0,0.0,0.1949,0.0,0.0,0.0,0.6473,42.35,27.14,0.1611,0.1934,25.27,2.73,[6,7]],[3.2,"low",0.0,0.0,0.2145,0.0,0.0,0.0,0.6515,43.12,26.66,0.1624,0.1969,25.27,3.23,[6,7]],[3.5,"low",0.0,0.0,0.2337,0.0,0.0,0.0,0.6556,43.89,26.2,0.1637,0.2003,25.27,3.73,[6,7]],[3.8,"low",0.0,0.0,0.2527,0.0,0.0,0.0,0.6597,44.66,25.76,0.1649,0.2038,25.27,4.23,[6,7]],[4.1,"low",0.0,0.0,0.2713,0.0,0.0,0.0,0.6636,45.43,25.33,0.1662,0.2073,25.27,4.73,[6,7]],[4.7,"low",0.0052,0.006,0.2896,0.0052,0.0,0.0028,0.6674,46.2,24.92,0.1675,0.2107,25.27,5.23,[6]],[6.4,"low",0.0305,0.0349,0.3077,0.0305,0.0,0.0161,0.6712,46.97,24.51,0.1687,0.2142,25.27,5.73,[6]],[8.1,"low",0.0553,0.0632,0.3254,0.0553,0.0,0.0286,0.6749,47.74,24.12,0.1699,0.2176,25.27,6.23,[6]],[9.8,"low",0.0797,0.0908,0.3428,0.0797,0.0,0.0404,0.6785,48.51,23.75,0.1712,0.2211,25.27,6.73,[6]],[11.5,"low",0.1038,0.1179,0.36,0.1038,0.0,0.0514,0.682,49.28,23.38,0.1724,0.2245,25.27,7.23,[6]],[13.1,"low",0.1275,0.1444,0.3769,0.1275,0.0,0.0618,0.6855,50.05,23.03,0.1736,0.228,25.27,7.73,[6]],[14.6,"low",0.1508,0.1704,0.3936,0.1508,0.0,0.0715,0.6888,50.82,22.68,0.1747,0.2314,25.27,8.23,[6]],[16.2,"low",0.1738,0.1958,0.41,0.1738,0.0,0.0805,0.6921,51.6,22.35,0.1759,0.2349,25.27,8.73,[6]],[17.7,"low",0.1965,0.2207,0.4262,0.1965,0.0,0.0889,0.6954,52.37,22.03,0.1771,0.2383,25.27,9.23,[6]],[19.2,"low",0.2188,0.2451,0.4421,0.2188,0.0,0.0967,0.6986,53.14,21.71,0.1783,0.2418,25.27,9.73,[6]],[20.7,"low",0.2408,0.269,0.4579,0.2408,0.0,0.1039,0.7017,53.91,21.41,0.1794,0.2453,25.27,10.23,[6]],[22.1,"low",0.2625,0.2925,0.4734,0.2625,0.0,0.1105,0.7047,54.68,21.11,0.1806,0.2487,25.27,10.73,[6]],[23.8,"low",0.2839,0.3154,0.4887,0.2839,0.0137,0.1165,0.7077,55.46,20.82,0.1817,0.2522,25.27,11.23,[6]],[25.6,"low",0.305,0.338,0.5037,0.305,0.0318,0.1221,0.7106,56.23,20.54,0.1828,0.2556,25.27,11.73,[6]],[27.4,"low",0.3259,0.3601,0.5186,0.3259,0.05,0.127,0.7135,57.0,20.27,0.1839,0.2591,25.27,12.23,[6]],[29.2,"low",0.3464,0.3817,0.5333,0.3464,0.0682,0.1315,0.7163,57.77,20.0,0.185,0.2625,25.27,12.73,[6]],[31.0,"low",0.3667,0.403,0.5478,0.3667,0.0864,0.1355,0.7191,58.55,19.74,0.1861,0.266,25.27,13.23,[6]],[32.7,"low",0.3867,0.4239,0.5621,0.3867,0.1046,0.1391,0.7218,59.32,19.49,0.1872,0.2694,25.27,13.73,[6]],[34.4,"low",0.4065,0.4443,0.5762,0.4065,0.1227,0.1422,0.7245,60.09,19.24,0.1883,0.2729,25.27,14.23,[6]],[36.1,"medium",0.426,0.4644,0.5901,0.426,0.1409,0.1449,0.7271,60.87,19.0,0.1894,0.2763,25.27,14.73,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,22.3,50.45,0.1216,0.1041,25.23,-10.23,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,23.05,48.82,0.1234,0.1075,25.23,-9.73,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,23.81,47.29,0.1252,0.111,25.23,-9.23,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,24.57,45.86,0.1269,0.1145,25.23,-8.73,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,25.32,44.51,0.1287,0.1179,25.23,-8.23,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,26.08,43.24,0.1304,0.1214,25.23,-7.73,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,26.84,42.04,0.1321,0.1249,25.23,-7.23,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,27.6,40.9,0.1337,0.1284,25.23,-6.73,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,28.36,39.83,0.1353,0.1318,25.23,-6.23,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,29.12,38.8,0.1369,0.1353,25.23,-5.73,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,29.88,37.83,0.1385,0.1388,25.23,-5.23,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,30.64,36.91,0.1401,0.1422,25.23,-4.73,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,31.4,36.03,0.1416,0.1457,25.23,-4.23,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,32.16,35.2,0.1432,0.1492,25.23,-3.73,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,32.92,34.4,0.1447,0.1526,25.23,-3.23,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,33.68,33.63,0.1461,0.1561,25.23,-2.73,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,34.44,32.9,0.1476,0.1596,25.23,-2.23,[3]],[0.1,"low",0.0,0.0,0.0054,0.0,0.0,0.0,0.6056,35.2,32.2,0.1491,0.163,25.23,-1.73,[3]],[0.4,"low",0.0,0.0,0.0288,0.0,0.0,0.0,0.6108,35.96,31.53,0.1505,0.1665,25.23,-1.23,[3]],[0.8,"low",0.0,0.0,0.0516,0.0,0.0,0.0,0.6159,36.72,30.89,0.1519,0.17,25.23,-0.73,[3]],[1.1,"low",0.0,0.0,0.074,0.0,0.0,0.0,0.6209,37.49,30.27,0.1533,0.1735,25.23,-0.23,[3]],[1.4,"low",0.0,0.0,0.0959,0.0,0.0,0.0,0.6257,38.25,29.67,0.1547,0.1769,25.23,0.27,[6,7]],[1.8,"low",0.0,0.0,0.1175,0.0,0.0,0.0,0.6305,39.01,29.1,0.1561,0.1804,25.23,0.77,[6,7]],[2.1,"low",0.0,0.0,0.1386,0.0,0.0,0.0,0.6351,39.78,28.55,0.1574,0.1839,25.23,1.27,[6,7]],[2.4,"low",0.0,0.0,0.1593,0.0,0.0,0.0,0.6396,40.54,28.03,0.1588,0.1873,25.23,1.77,[6,7]],[2.7,"low",0.0,0.0,0.1796,0.0,0.0,0.0,0.644,41.3,27.52,0.1601,0.1908,25.23,2.27,[6,7]],[3.0,"low",0.0,0.0,0.1996,0.0,0.0,0.0,0.6483,42.07,27.02,0.1614,0.1943,25.23,2.77,[6,7]],[3.3,"low",0.0,0.0,0.2192,0.0,0.0,0.0,0.6525,42.83,26.55,0.1627,0.1977,25.23,3.27,[6,7]],[3.6,"low",0.0,0.0,0.2385,0.0,0.0,0.0,0.6567,43.59,26.09,0.164,0.2012,25.23,3.77,[6,7]],[3.9,"low",0.0,0.0,0.2574,0.0,0.0,0.0,0.6607,44.36,25.65,0.1653,0.2047,25.23,4.27,[6,7]],[4.1,"low",0.0,0.0,0.2761,0.0,0.0,0.0,0.6646,45.12,25.22,0.1665,0.2081,25.23,4.77,[6,7]],[5.1,"low",0.0119,0.0136,0.2944,0.0119,0.0,0.0064,0.6684,45.89,24.81,0.1678,0.2116,25.23,5.27,[6]],[6.9,"low",0.0371,0.0425,0.3124,0.0371,0.0,0.0196,0.6722,46.65,24.41,0.169,0.2151,25.23,5.77,[6]],[8.6,"low",0.0619,0.0707,0.3301,0.0619,0.0,0.032,0.6759,47.42,24.02,0.1703,0.2185,25.23,6.27,[6]],[10.3,"low",0.0864,0.0983,0.3476,0.0864,0.0,0.0437,0.6795,48.18,23.65,0.1715,0.222,25.23,6.77,[6]],[11.9,"low",0.1104,0.1254,0.3648,0.1104,0.0,0.0547,0.683,48.95,23.28,0.1727,0.2255,25.23,7.27,[6]],[13.5,"low",0.1341,0.1518,0.3817,0.1341,0.0,0.065,0.6864,49.72,22.93,0.1739,0.229,25.23,7.77,[6]],[15.1,"low",0.1575,0.1777,0.3983,0.1575,0.0,0.0746,0.6898,50.48,22.59,0.1751,0.2324,25.23,8.27,[6]],[16.6,"low",0.1805,0.2031,0.4148,0.1805,0.0,0.0836,0.6931,51.25,22.26,0.1763,0.2359,25.23,8.77,[6]],[18.2,"low",0.2031,0.228,0.4309,0.2031,0.0,0.0919,0.6963,52.02,21.93,0.1774,0.2394,25.23,9.27,[6]],[19.6,"low",0.2254,0.2523,0.4469,0.2254,0.0,0.0996,0.6995,52.78,21.62,0.1786,0.2428,25.23,9.77,[6]],[21.1,"low",0.2475,0.2762,0.4626,0.2475,0.0,0.1068,0.7026,53.55,21.32,0.1798,0.2463,25.23,10.27,[6]],[22.5,"low",0.2692,0.2996,0.4781,0.2692,0.0,0.1133,0.7057,54.32,21.02,0.1809,0.2498,25.23,10.77,[6]],[24.3,"low",0.2906,0.3225,0.4934,0.2906,0.0168,0.1193,0.7086,55.08,20.73,0.182,0.2532,25.23,11.27,[6]],[26.2,"low",0.3117,0.345,0.5085,0.3117,0.0351,0.1247,0.7116,55.85,20.45,0.1832,0.2567,25.23,11.77,[6]],[28.0,"low",0.3325,0.3671,0.5233,0.3325,0.0533,0.1296,0.7144,56.62,20.18,0.1843,0.2602,25.23,12.27,[6]],[29.7,"low",0.3531,0.3887,0.538,0.3531,0.0716,0.134,0.7173,57.39,19.91,0.1854,0.2636,25.23,12.77,[6]],[31.5,"low",0.3734,0.4099,0.5525,0.3734,0.0898,0.138,0.72,58.15,19.65,0.1865,0.2671,25.23,13.27,[6]],[33.2,"low",0.3934,0.4307,0.5668,0.3934,0.1081,0.1415,0.7227,58.92,19.4,0.1876,0.2706,25.23,13.77,[6]],[34.9,"low",0.4132,0.4512,0.5809,0.4132,0.1263,0.1445,0.7254,59.69,19.16,0.1887,0.2741,25.23,14.27,[6]],[36.6,"medium",0.4327,0.4712,0.5949,0.4327,0.1446,0.1471,0.728,60.46,18.92,0.1898,0.2775,25.23,14.77,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,20.14,47.29,0.1252,0.111,24.67,-9.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,20.82,45.76,0.1271,0.1147,24.67,-9.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,21.51,44.33,0.1289,0.1184,24.67,-8.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,22.19,42.99,0.1307,0.1221,24.67,-8.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,22.87,41.72,0.1325,0.1258,24.67,-7.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,23.56,40.53,0.1343,0.1295,24.67,-7.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,24.24,39.4,0.136,0.1332,24.67,-6.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,24.93,38.34,0.1377,0.1369,24.67,-6.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,25.61,37.33,0.1394,0.1406,24.67,-5.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,26.3,36.37,0.141,0.1443,24.67,-5.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,26.98,35.46,0.1427,0.148,24.67,-4.67,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,27.67,34.6,0.1443,0.1517,24.67,-4.17,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,28.36,33.77,0.1459,0.1554,24.67,-3.67,[3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,29.04,32.99,0.1474,0.1591,24.67,-3.17,[3]],[0.1,"low",0.0,0.0,0.004,0.0,0.0,0.0,0.6052,29.73,32.24,0.149,0.1628,24.67,-2.67,[3]],[0.4,"low",0.0,0.0,0.029,0.0,0.0,0.0,0.6108,30.42,31.52,0.1505,0.1665,24.67,-2.17,[3]],[0.8,"low",0.0,0.0,0.0533,0.0,0.0,0.0,0.6163,31.11,30.84,0.152,0.1702,24.67,-1.67,[3]],[1.2,"low",0.0,0.0,0.0771,0.0,0.0,0.0,0.6216,31.79,30.18,0.1535,0.1739,24.67,-1.17,[3]],[1.5,"low",0.0,0.0,0.1005,0.0,0.0,0.0,0.6267,32.48,29.55,0.155,0.1776,24.67,-0.67,[3]],[1.8,"low",0.0,0.0,0.1233,0.0,0.0,0.0,0.6318,33.17,28.95,0.1564,0.1813,24.67,-0.17,[3]],[2.2,"low",0.0,0.0,0.1457,0.0,0.0,0.0,0.6367,33.86,28.37,0.1579,0.185,24.67,0.33,[6,7]],[2.5,"low",0.0,0.0,0.1677,0.0,0.0,0.0,0.6414,34.55,27.81,0.1593,0.1887,24.67,0.83,[6,7]],[2.8,"low",0.0,0.0,0.1892,0.0,0.0,0.0,0.6461,35.24,27.28,0.1607,0.1925,24.67,1.33,[6,7]],[3.2,"low",0.0,0.0,0.2103,0.0,0.0,0.0,0.6506,35.93,26.77,0.1621,0.1962,24.67,1.83,[6,7]],[3.5,"low",0.0,0.0,0.231,0.0,0.0,0.0,0.6551,36.62,26.27,0.1635,0.1999,24.67,2.33,[6,7]],[3.8,"low",0.0,0.0,0.2513,0.0,0.0,0.0,0.6594,37.3,25.79,0.1649,0.2036,24.67,2.83,[6,7]],[4.1,"low",0.0,0.0,0.2713,0.0,0.0,0.0,0.6636,37.99,25.33,0.1662,0.2073,24.67,3.33,[6,7]],[4.8,"low",0.007,0.0081,0.2909,0.007,0.0,0.0041,0.6677,38.68,24.89,0.1675,0.211,24.67,3.83,[6]],[6.7,"low",0.034,0.039,0.3102,0.034,0.0,0.0194,0.6717,39.38,24.46,0.1689,0.2147,24.67,4.33,[6]],[8.5,"low",0.0606,0.0691,0.3291,0.0606,0.0,0.0339,0.6757,40.07,24.04,0.1702,0.2184,24.67,4.83,[6]],[10.3,"low",0.0866,0.0986,0.3478,0.0866,0.0,0.0476,0.6795,40.76,23.64,0.1715,0.2221,24.67,5.33,[6]],[12.1,"low",0.1123,0.1274,0.3661,0.1123,0.0,0.0605,0.6832,41.45,23.25,0.1728,0.2258,24.67,5.83,[6]],[13.8,"low",0.1375,0.1556,0.3841,0.1375,0.0,0.0726,0.6869,42.14,22.88,0.1741,0.2295,24.67,6.33,[6]],[15.5,"low",0.1624,0.1832,0.4018,0.1624,0.0,0.0839,0.6905,42.83,22.52,0.1753,0.2332,24.67,6.83,[6]],[17.2,"low",0.1868,0.2101,0.4193,0.1868,0.0,0.0946,0.694,43.52,22.16,0.1766,0.2369,24.67,7.33,[6]],[18.8,"low",0.2109,0.2364,0.4365,0.2109,0.0,0.1045,0.6974,44.21,21.82,0.1778,0.2406,24.67,7.83,[6]],[20.4,"low",0.2346,0.2622,0.4534,0.2346,0.0,0.1137,0.7008,44.9,21.49,0.1791,0.2443,24.67,8.33,[6]],[21.9,"low",0.2579,0.2875,0.4701,0.2579,0.0,0.1222,0.7041,45.6,21.17,0.1803,0.248,24.67,8.83,[6]],[23.4,"low",0.2809,0.3122,0.4865,0.2809,0.0,0.1301,0.7073,46.29,20.86,0.1815,0.2517,24.67,9.33,[6]],[24.9,"low",0.3035,0.3364,0.5027,0.3035,0.0,0.1374,0.7104,46.98,20.56,0.1827,0.2554,24.67,9.83,[6]],[26.6,"low",0.3259,0.3601,0.5186,0.3259,0.0079,0.144,0.7135,47.67,20.27,0.1839,0.2591,24.67,10.33,[6]],[28.5,"low",0.3479,0.3833,0.5343,0.3479,0.0274,0.1501,0.7165,48.37,19.98,0.1851,0.2628,24.67,10.83,[6]],[30.4,"low",0.3696,0.406,0.5498,0.3696,0.0468,0.1556,0.7195,49.06,19.7,0.1863,0.2665,24.67,11.33,[6]],[32.2,"low",0.391,0.4283,0.5651,0.391,0.0663,0.1605,0.7224,49.75,19.43,0.1875,0.2702,24.67,11.83,[6]],[34.1,"low",0.4121,0.4501,0.5802,0.4121,0.0858,0.1649,0.7252,50.45,19.17,0.1886,0.2739,24.67,12.33,[6]],[35.9,"medium",0.4329,0.4715,0.5951,0.4329,0.1053,0.1688,0.728,51.14,18.91,0.1898,0.2776,24.67,12.83,[]],[37.6,"medium",0.4535,0.4925,0.6097,0.4535,0.1248,0.1722,0.7308,51.83,18.67,0.1909,0.2813,24.67,13.33,[]],[39.4,"medium",0.4738,0.5131,0.6242,0.4738,0.1442,0.1751,0.7334,52.53,18.42,0.1921,0.285,24.67,13.83,[]],[41.1,"medium",0.4938,0.5333,0.6385,0.4938,0.1637,0.1776,0.7361,53.22,18.19,0.1932,0.2887,24.67,14.33,[]],[42.8,"medium",0.5136,0.5531,0.6527,0.5136,0.1832,0.1796,0.7386,53.91,17.96,0.1943,0.2924,24.67,14.83,[]],[44.5,"medium",0.5331,0.5725,0.6666,0.5331,0.2027,0.1813,0.7412,54.61,17.73,0.1954,0.2961,24.67,15.33,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,18.2,44.33,0.1289,0.1184,24.11,-9.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,18.81,42.9,0.1309,0.1224,24.11,-8.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,19.43,41.56,0.1328,0.1263,24.11,-8.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,20.05,40.3,0.1346,0.1303,24.11,-7.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,20.67,39.11,0.1365,0.1342,24.11,-7.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,21.28,38.0,0.1383,0.1382,24.11,-6.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,21.9,36.94,0.14,0.1421,24.11,-6.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,22.52,35.94,0.1418,0.1461,24.11,-5.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,23.14,35.0,0.1435,0.15,24.11,-5.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,23.76,34.1,0.1452,0.154,24.11,-4.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,24.38,33.25,0.1469,0.1579,24.11,-4.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,25.0,32.44,0.1486,0.1619,24.11,-3.61,[1,3]],[0.4,"low",0.0,0.0,0.024,0.0,0.0,0.0,0.6097,25.62,31.66,0.1502,0.1658,24.11,-3.11,[3]],[0.8,"low",0.0,0.0,0.0501,0.0,0.0,0.0,0.6156,26.24,30.93,0.1518,0.1698,24.11,-2.61,[3]],[1.1,"low",0.0,0.0,0.0756,0.0,0.0,0.0,0.6212,26.86,30.22,0.1534,0.1737,24.11,-2.11,[3]],[1.5,"low",0.0,0.0,0.1005,0.0,0.0,0.0,0.6267,27.48,29.55,0.155,0.1776,24.11,-1.61,[3]],[1.9,"low",0.0,0.0,0.1248,0.0,0.0,0.0,0.6321,28.1,28.91,0.1565,0.1816,24.11,-1.11,[3]],[2.2,"low",0.0,0.0,0.1487,0.0,0.0,0.0,0.6373,28.72,28.3,0.1581,0.1855,24.11,-0.61,[3]],[2.6,"low",0.0,0.0,0.172,0.0,0.0,0.0,0.6424,29.35,27.71,0.1596,0.1895,24.11,-0.11,[3]],[2.9,"low",0.0,0.0,0.1949,0.0,0.0,0.0,0.6473,29.97,27.14,0.1611,0.1934,24.11,0.39,[6,7]],[3.3,"low",0.0,0.0,0.2172,0.0,0.0,0.0,0.6521,30.59,26.6,0.1626,0.1974,24.11,0.89,[6,7]],[3.6,"low",0.0,0.0,0.2392,0.0,0.0,0.0,0.6568,31.21,26.08,0.164,0.2013,24.11,1.39,[6,7]],[3.9,"low",0.0,0.0,0.2607,0.0,0.0,0.0,0.6614,31.83,25.57,0.1655,0.2053,24.11,1.89,[6,7]],[4.2,"low",0.0,0.0,0.2818,0.0,0.0,0.0,0.6658,32.46,25.09,0.1669,0.2092,24.11,2.39,[6,7]],[5.9,"low",0.0233,0.0267,0.3025,0.0233,0.0,0.0143,0.6701,33.08,24.63,0.1683,0.2132,24.11,2.89,[6]],[7.9,"low",0.0518,0.0592,0.3229,0.0518,0.0,0.0311,0.6744,33.7,24.18,0.1698,0.2171,24.11,3.39,[6]],[9.9,"low",0.0797,0.0908,0.3428,0.0797,0.0,0.0471,0.6785,34.33,23.75,0.1712,0.2211,24.11,3.89,[6]],[11.8,"low",0.1072,0.1217,0.3625,0.1072,0.0,0.0623,0.6825,34.95,23.33,0.1725,0.225,24.11,4.39,[6]],[13.6,"low",0.1342,0.1519,0.3817,0.1342,0.0,0.0765,0.6864,35.57,22.93,0.1739,0.229,24.11,4.89,[6]],[15.5,"low",0.1607,0.1813,0.4007,0.1607,0.0,0.09,0.6903,36.2,22.54,0.1753,0.2329,24.11,5.39,[6]],[17.2,"low",0.1868,0.2101,0.4193,0.1868,0.0,0.1026,0.694,36.82,22.16,0.1766,0.2369,24.11,5.89,[6]],[19.0,"low",0.2125,0.2382,0.4376,0.2125,0.0,0.1144,0.6977,37.45,21.8,0.1779,0.2408,24.11,6.39,[6]],[20.7,"low",0.2377,0.2656,0.4556,0.2377,0.0,0.1254,0.7012,38.07,21.45,0.1792,0.2448,24.11,6.89,[6]],[22.3,"low",0.2625,0.2925,0.4734,0.2625,0.0,0.1357,0.7047,38.7,21.11,0.1806,0.2487,24.11,7.39,[6]],[24.0,"low",0.287,0.3187,0.4908,0.287,0.0,0.1453,0.7081,39.32,20.78,0.1818,0.2527,24.11,7.89,[6]],[25.5,"low",0.311,0.3443,0.508,0.311,0.0,0.1541,0.7115,39.94,20.46,0.1831,0.2566,24.11,8.39,[6]],[27.1,"low",0.3347,0.3694,0.5249,0.3347,0.0,0.1623,0.7147,40.57,20.15,0.1844,0.2605,24.11,8.89,[6]],[28.6,"low",0.3581,0.3939,0.5416,0.3581,0.0,0.1697,0.7179,41.19,19.85,0.1857,0.2645,24.11,9.39,[6]],[30.5,"low",0.381,0.4179,0.558,0.381,0.0161,0.1765,0.7211,41.82,19.56,0.1869,0.2684,24.11,9.89,[6]],[32.5,"low",0.4037,0.4414,0.5742,0.4037,0.0368,0.1827,0.7241,42.45,19.27,0.1882,0.2724,24.11,10.39,[6]],[34.4,"low",0.426,0.4644,0.5901,0.426,0.0576,0.1883,0.7271,43.07,19.0,0.1894,0.2763,24.11,10.89,[6]],[36.4,"medium",0.448,0.487,0.6059,0.448,0.0784,0.1933,0.73,43.7,18.73,0.1906,0.2803,24.11,11.39,[]],[38.2,"medium",0.4698,0.509,0.6214,0.4698,0.0992,0.1977,0.7329,44.32,18.47,0.1918,0.2842,24.11,11.89,[]],[40.1,"medium",0.4912,0.5306,0.6366,0.4912,0.12,0.2016,0.7357,44.95,18.22,0.193,0.2882,24.11,12.39,[]],[41.9,"medium",0.5123,0.5518,0.6517,0.5123,0.1407,0.205,0.7385,45.58,17.97,0.1942,0.2921,24.11,12.89,[]],[43.8,"medium",0.5331,0.5725,0.6666,0.5331,0.1615,0.2078,0.7412,46.2,17.73,0.1954,0.2961,24.11,13.39,[]],[45.5,"medium",0.5537,0.5929,0.6813,0.5537,0.1823,0.2102,0.7438,46.83,17.5,0.1966,0.3,24.11,13.89,[]],[47.3,"medium",0.574,0.6128,0.6958,0.574,0.2031,0.2121,0.7464,47.46,17.27,0.1978,0.304,24.11,14.39,[]],[49.0,"medium",0.594,0.6324,0.7101,0.594,0.2238,0.2136,0.749,48.08,17.05,0.1989,0.3079,24.11,14.89,[]],[50.8,"medium",0.6137,0.6515,0.7242,0.6137,0.2446,0.2147,0.7515,48.71,16.83,0.2001,0.3119,24.11,15.39,[]],[52.5,"medium",0.6333,0.6703,0.7381,0.6333,0.2654,0.2154,0.7539,49.34,16.62,0.2012,0.3158,24.11,15.89,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,16.54,41.72,0.1325,0.1258,23.61,-8.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,17.1,40.38,0.1345,0.13,23.61,-8.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,17.66,39.11,0.1365,0.1342,23.61,-7.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,18.22,37.93,0.1384,0.1384,23.61,-7.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,18.79,36.81,0.1403,0.1426,23.61,-6.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,19.35,35.76,0.1421,0.1468,23.61,-6.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,19.91,34.77,0.144,0.151,23.61,-5.61,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,20.47,33.83,0.1458,0.1552,23.61,-5.11,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,21.04,32.94,0.1475,0.1594,23.61,-4.61,[1,3]],[0.1,"low",0.0,0.0,0.0091,0.0,0.0,0.0,0.6064,21.6,32.09,0.1493,0.1636,23.61,-4.11,[1,3]],[0.6,"low",0.0,0.0,0.0371,0.0,0.0,0.0,0.6127,22.16,31.29,0.151,0.1678,23.61,-3.61,[1,3]],[1.0,"low",0.0,0.0,0.0645,0.0,0.0,0.0,0.6188,22.73,30.53,0.1527,0.172,23.61,-3.11,[1,3]],[1.4,"low",0.0,0.0,0.0912,0.0,0.0,0.0,0.6247,23.29,29.8,0.1544,0.1762,23.61,-2.61,[3]],[1.8,"low",0.0,0.0,0.1173,0.0,0.0,0.0,0.6304,23.85,29.11,0.156,0.1804,23.61,-2.11,[3]],[2.1,"low",0.0,0.0,0.1428,0.0,0.0,0.0,0.636,24.42,28.45,0.1577,0.1846,23.61,-1.61,[3]],[2.5,"low",0.0,0.0,0.1677,0.0,0.0,0.0,0.6414,24.98,27.81,0.1593,0.1887,23.61,-1.11,[3]],[2.9,"low",0.0,0.0,0.192,0.0,0.0,0.0,0.6467,25.55,27.21,0.1609,0.1929,23.61,-0.61,[3]],[3.2,"low",0.0,0.0,0.2159,0.0,0.0,0.0,0.6518,26.11,26.63,0.1625,0.1971,23.61,-0.11,[3]],[3.6,"low",0.0,0.0,0.2392,0.0,0.0,0.0,0.6568,26.68,26.08,0.164,0.2013,23.61,0.39,[6,7]],[3.9,"low",0.0,0.0,0.262,0.0,0.0,0.0,0.6616,27.24,25.54,0.1656,0.2055,23.61,0.89,[6,7]],[4.3,"low",0.0,0.0,0.2844,0.0,0.0,0.0,0.6664,27.81,25.03,0.1671,0.2097,23.61,1.39,[6,7]],[6.3,"low",0.0287,0.0329,0.3064,0.0287,0.0,0.0184,0.6709,28.37,24.54,0.1686,0.2139,23.61,1.89,[6]],[8.4,"low",0.0588,0.0672,0.3279,0.0588,0.0,0.0372,0.6754,28.94,24.07,0.1701,0.2181,23.61,2.39,[6]],[10.5,"low",0.0884,0.1006,0.349,0.0884,0.0,0.055,0.6798,29.51,23.62,0.1716,0.2223,23.61,2.89,[6]],[12.5,"low",0.1174,0.1331,0.3697,0.1174,0.0,0.0718,0.684,30.07,23.18,0.173,0.2265,23.61,3.39,[6]],[14.5,"low",0.1459,0.1649,0.3901,0.1459,0.0,0.0877,0.6881,30.64,22.76,0.1745,0.2307,23.61,3.89,[6]],[16.4,"low",0.1738,0.1958,0.41,0.1738,0.0,0.1028,0.6921,31.2,22.35,0.1759,0.2349,23.61,4.39,[6]],[18.3,"low",0.2013,0.226,0.4296,0.2013,0.0,0.1169,0.6961,31.77,21.96,0.1773,0.2391,23.61,4.89,[6]],[20.1,"low",0.2283,0.2554,0.4489,0.2283,0.0,0.1302,0.6999,32.34,21.58,0.1788,0.2433,23.61,5.39,[6]],[21.9,"low",0.2548,0.2841,0.4679,0.2548,0.0,0.1426,0.7036,32.91,21.21,0.1801,0.2475,23.61,5.89,[6]],[23.7,"low",0.2809,0.3122,0.4865,0.2809,0.0,0.1542,0.7073,33.47,20.86,0.1815,0.2517,23.61,6.39,[6]],[25.4,"low",0.3065,0.3396,0.5048,0.3065,0.0,0.165,0.7109,34.04,20.52,0.1829,0.2559,23.61,6.89,[6]],[27.0,"low",0.3318,0.3663,0.5228,0.3318,0.0,0.1751,0.7143,34.61,20.19,0.1842,0.2601,23.61,7.39,[6]],[28.7,"low",0.3566,0.3924,0.5406,0.3566,0.0,0.1844,0.7177,35.18,19.87,0.1856,0.2642,23.61,7.89,[6]],[30.3,"low",0.381,0.4179,0.558,0.381,0.0,0.1929,0.7211,35.74,19.56,0.1869,0.2684,23.61,8.39,[6]],[31.8,"low",0.4051,0.4429,0.5752,0.4051,0.0,0.2007,0.7243,36.31,19.26,0.1882,0.2726,23.61,8.89,[6]],[33.9,"low",0.4288,0.4673,0.5921,0.4288,0.0199,0.2079,0.7275,36.88,18.96,0.1896,0.2768,23.61,9.39,[6]],[35.9,"medium",0.4521,0.4911,0.6088,0.4521,0.042,0.2143,0.7306,37.45,18.68,0.1909,0.281,23.61,9.89,[]],[37.9,"medium",0.4751,0.5145,0.6252,0.4751,0.0641,0.2201,0.7336,38.02,18.41,0.1921,0.2852,23.61,10.39,[]],[39.9,"medium",0.4978,0.5373,0.6414,0.4978,0.0862,0.2253,0.7366,38.59,18.14,0.1934,0.2894,23.61,10.89,[]],[41.9,"medium",0.5201,0.5596,0.6573,0.5201,0.1082,0.2299,0.7395,39.15,17.88,0.1947,0.2936,23.61,11.39,[]],[43.8,"medium",0.5421,0.5815,0.673,0.5421,0.1303,0.2339,0.7423,39.72,17.63,0.1959,0.2978,23.61,11.89,[]],[45.7,"medium",0.5638,0.6029,0.6885,0.5638,0.1524,0.2373,0.7451,40.29,17.38,0.1972,0.302,23.61,12.39,[]],[47.5,"medium",0.5852,0.6238,0.7038,0.5852,0.1745,0.2402,0.7479,40.86,17.15,0.1984,0.3062,23.61,12.89,[]],[49.4,"medium",0.6064,0.6444,0.7189,0.6064,0.1965,0.2426,0.7505,41.43,16.91,0.1997,0.3104,23.61,13.39,[]],[51.2,"medium",0.6272,0.6645,0.7338,0.6272,0.2186,0.2445,0.7531,42.0,16.69,0.2009,0.3146,23.61,13.89,[]],[53.0,"medium",0.6477,0.6842,0.7485,0.6477,0.2407,0.2459,0.7557,42.57,16.47,0.2021,0.3188,23.61,14.39,[]],[54.8,"medium",0.668,0.7035,0.7629,0.668,0.2628,0.2469,0.7582,43.14,16.26,0.2033,0.323,23.61,14.89,[]],[56.5,"medium",0.6881,0.7224,0.7772,0.6881,0.2849,0.2474,0.7607,43.71,16.05,0.2045,0.3272,23.61,15.39,[]],[58.2,"medium",0.7078,0.741,0.7914,0.7078,0.3069,0.2476,0.7631,44.28,15.84,0.2057,0.3314,23.61,15.89,[]],[59.9,"medium",0.7274,0.7592,0.8053,0.7274,0.329,0.2473,0.7655,44.85,15.65,0.2069,0.3356,23.61,16.39,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,15.12,39.4,0.136,0.1332,23.14,-8.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,15.63,38.13,0.138,0.1377,23.14,-7.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,16.14,36.94,0.14,0.1421,23.14,-7.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,16.66,35.82,0.142,0.1466,23.14,-6.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,17.17,34.77,0.144,0.151,23.14,-6.14,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,17.68,33.78,0.1459,0.1554,23.14,-5.64,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,18.2,32.84,0.1477,0.1599,23.14,-5.14,[1,3]],[0.2,"low",0.0,0.0,0.0141,0.0,0.0,0.0,0.6075,18.71,31.95,0.1496,0.1643,23.14,-4.64,[1,3]],[0.7,"low",0.0,0.0,0.0436,0.0,0.0,0.0,0.6141,19.23,31.11,0.1514,0.1688,23.14,-4.14,[1,3]],[1.1,"low",0.0,0.0,0.0724,0.0,0.0,0.0,0.6205,19.74,30.31,0.1532,0.1732,23.14,-3.64,[1,3]],[1.5,"low",0.0,0.0,0.1005,0.0,0.0,0.0,0.6267,20.26,29.55,0.155,0.1776,23.14,-3.14,[1,3]],[1.9,"low",0.0,0.0,0.1278,0.0,0.0,0.0,0.6328,20.77,28.83,0.1567,0.1821,23.14,-2.64,[1,3]],[2.3,"low",0.0,0.0,0.1545,0.0,0.0,0.0,0.6386,21.29,28.15,0.1584,0.1865,23.14,-2.14,[3]],[2.7,"low",0.0,0.0,0.1806,0.0,0.0,0.0,0.6442,21.8,27.49,0.1601,0.191,23.14,-1.64,[3]],[3.1,"low",0.0,0.0,0.2061,0.0,0.0,0.0,0.6497,22.32,26.87,0.1618,0.1954,23.14,-1.14,[3]],[3.5,"low",0.0,0.0,0.231,0.0,0.0,0.0,0.6551,22.83,26.27,0.1635,0.1999,23.14,-0.64,[3]],[3.8,"low",0.0,0.0,0.2554,0.0,0.0,0.0,0.6602,23.35,25.7,0.1651,0.2043,23.14,-0.14,[3]],[4.2,"low",0.0,0.0,0.2792,0.0,0.0,0.0,0.6653,23.87,25.15,0.1667,0.2087,23.14,0.36,[6,7]],[5.9,"low",0.0233,0.0267,0.3025,0.0233,0.0,0.0156,0.6701,24.38,24.63,0.1683,0.2132,23.14,0.86,[6]],[8.2,"low",0.0553,0.0632,0.3254,0.0553,0.0,0.0366,0.6749,24.9,24.12,0.1699,0.2176,23.14,1.36,[6]],[10.4,"low",0.0866,0.0986,0.3478,0.0866,0.0,0.0565,0.6795,25.42,23.64,0.1715,0.2221,23.14,1.86,[6]],[12.6,"low",0.1174,0.1331,0.3697,0.1174,0.0,0.0754,0.684,25.93,23.18,0.173,0.2265,23.14,2.36,[6]],[14.7,"low",0.1475,0.1667,0.3912,0.1475,0.0,0.0932,0.6884,26.45,22.73,0.1746,0.2309,23.14,2.86,[6]],[16.7,"low",0.1771,0.1994,0.4123,0.1771,0.0,0.1101,0.6926,26.97,22.3,0.1761,0.2354,23.14,3.36,[6]],[18.7,"low",0.2061,0.2312,0.4331,0.2061,0.0,0.1261,0.6968,27.49,21.89,0.1776,0.2398,23.14,3.86,[6]],[20.6,"low",0.2346,0.2622,0.4534,0.2346,0.0,0.1411,0.7008,28.0,21.49,0.1791,0.2443,23.14,4.36,[6]],[22.5,"low",0.2625,0.2925,0.4734,0.2625,0.0,0.1552,0.7047,28.52,21.11,0.1806,0.2487,23.14,4.86,[6]],[24.4,"low",0.29,0.3219,0.493,0.29,0.0,0.1684,0.7086,29.04,20.74,0.182,0.2531,23.14,5.36,[6]],[26.2,"low",0.317,0.3506,0.5123,0.317,0.0,0.1808,0.7123,29.56,20.38,0.1835,0.2576,23.14,5.86,[6]],[27.9,"low",0.3435,0.3787,0.5312,0.3435,0.0,0.1923,0.7159,30.08,20.04,0.1849,0.262,23.14,6.36,[6]],[29.7,"low",0.3696,0.406,0.5498,0.3696,0.0,0.2029,0.7195,30.59,19.7,0.1863,0.2665,23.14,6.86,[6]],[31.3,"low",0.3952,0.4327,0.5681,0.3952,0.0,0.2128,0.723,31.11,19.38,0.1877,0.2709,23.14,7.36,[6]],[33.0,"low",0.4205,0.4587,0.5862,0.4205,0.0,0.2219,0.7264,31.63,19.07,0.1891,0.2754,23.14,7.86,[6]],[34.6,"low",0.4453,0.4842,0.6039,0.4453,0.0,0.2302,0.7297,32.15,18.76,0.1905,0.2798,23.14,8.36,[6]],[36.7,"medium",0.4698,0.509,0.6214,0.4698,0.0194,0.2378,0.7329,32.67,18.47,0.1918,0.2842,23.14,8.86,[]],[38.8,"medium",0.4938,0.5333,0.6385,0.4938,0.0428,0.2447,0.7361,33.19,18.19,0.1932,0.2887,23.14,9.36,[]],[40.9,"medium",0.5175,0.557,0.6555,0.5175,0.0662,0.2509,0.7392,33.71,17.91,0.1945,0.2931,23.14,9.86,[]],[42.9,"medium",0.5408,0.5802,0.6721,0.5408,0.0896,0.2564,0.7422,34.23,17.64,0.1959,0.2976,23.14,10.36,[]],[44.9,"medium",0.5638,0.6029,0.6885,0.5638,0.1129,0.2612,0.7451,34.75,17.38,0.1972,0.302,23.14,10.86,[]],[46.9,"medium",0.5865,0.6251,0.7047,0.5865,0.1363,0.2655,0.748,35.27,17.13,0.1985,0.3064,23.14,11.36,[]],[48.9,"medium",0.6088,0.6468,0.7207,0.6088,0.1597,0.2691,0.7508,35.79,16.89,0.1998,0.3109,23.14,11.86,[]],[50.8,"medium",0.6308,0.668,0.7364,0.6308,0.1831,0.2722,0.7536,36.31,16.65,0.2011,0.3153,23.14,12.36,[]],[52.7,"medium",0.6525,0.6888,0.7519,0.6525,0.2064,0.2747,0.7563,36.83,16.42,0.2024,0.3198,23.14,12.86,[]],[54.6,"medium",0.674,0.7091,0.7672,0.674,0.2298,0.2766,0.7589,37.35,16.19,0.2036,0.3242,23.14,13.36,[]],[56.4,"medium",0.6951,0.729,0.7822,0.6951,0.2532,0.2781,0.7615,37.87,15.97,0.2049,0.3286,23.14,13.86,[]],[58.3,"medium",0.7159,0.7485,0.7971,0.7159,0.2766,0.2791,0.7641,38.39,15.76,0.2062,0.3331,23.14,14.36,[]],[60.1,"medium",0.7365,0.7676,0.8118,0.7365,0.2999,0.2796,0.7666,38.91,15.55,0.2074,0.3375,23.14,14.86,[]],[61.8,"medium",0.7567,0.7863,0.8263,0.7567,0.3233,0.2797,0.769,39.43,15.35,0.2086,0.342,23.14,15.36,[]],[63.6,"medium",0.7768,0.8047,0.8406,0.7768,0.3467,0.2793,0.7714,39.95,15.16,0.2099,0.3464,23.14,15.86,[]],[65.3,"critical",0.7965,0.8226,0.8547,0.7965,0.3701,0.2786,0.7737,40.47,14.96,0.2111,0.3509,23.14,16.36,[]],[67.0,"critical",0.8161,0.8403,0.8686,0.8161,0.3934,0.2775,0.776,40.99,14.78,0.2123,0.3553,23.14,16.86,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,13.89,37.33,0.1394,0.1406,22.71,-7.71,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,14.36,36.13,0.1415,0.1453,22.71,-7.21,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,14.83,35.0,0.1435,0.15,22.71,-6.71,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,15.3,33.94,0.1455,0.1547,22.71,-6.21,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,15.77,32.94,0.1475,0.1594,22.71,-5.71,[1,3]],[0.2,"low",0.0,0.0,0.0124,0.0,0.0,0.0,0.6071,16.24,32.0,0.1495,0.1641,22.71,-5.21,[1,3]],[0.7,"low",0.0,0.0,0.0436,0.0,0.0,0.0,0.6141,16.71,31.11,0.1514,0.1688,22.71,-4.71,[1,3]],[1.1,"low",0.0,0.0,0.074,0.0,0.0,0.0,0.6209,17.19,30.27,0.1533,0.1735,22.71,-4.21,[1,3]],[1.6,"low",0.0,0.0,0.1036,0.0,0.0,0.0,0.6274,17.66,29.47,0.1552,0.1781,22.71,-3.71,[1,3]],[2.0,"low",0.0,0.0,0.1323,0.0,0.0,0.0,0.6337,18.13,28.72,0.157,0.1828,22.71,-3.21,[1,3]],[2.4,"low",0.0,0.0,0.1604,0.0,0.0,0.0,0.6399,18.6,28.0,0.1588,0.1875,22.71,-2.71,[1,3]],[2.8,"low",0.0,0.0,0.1878,0.0,0.0,0.0,0.6458,19.08,27.31,0.1606,0.1922,22.71,-2.21,[1,3]],[3.2,"low",0.0,0.0,0.2145,0.0,0.0,0.0,0.6515,19.55,26.66,0.1624,0.1969,22.71,-1.71,[3]],[3.6,"low",0.0,0.0,0.2405,0.0,0.0,0.0,0.6571,20.02,26.04,0.1641,0.2016,22.71,-1.21,[3]],[4.0,"low",0.0,0.0,0.266,0.0,0.0,0.0,0.6625,20.5,25.45,0.1658,0.2063,22.71,-0.71,[3]],[4.8,"low",0.007,0.0081,0.2909,0.007,0.0,0.0049,0.6677,20.97,24.89,0.1675,0.211,22.71,-0.21,[3]],[7.2,"low",0.0412,0.0471,0.3153,0.0412,0.0,0.0284,0.6728,21.45,24.35,0.1692,0.2156,22.71,0.29,[6]],[9.6,"low",0.0745,0.085,0.3391,0.0745,0.0,0.0507,0.6777,21.92,23.83,0.1709,0.2203,22.71,0.79,[6]],[11.9,"low",0.1072,0.1217,0.3625,0.1072,0.0,0.0719,0.6825,22.39,23.33,0.1725,0.225,22.71,1.29,[6]],[14.1,"low",0.1392,0.1575,0.3853,0.1392,0.0,0.0921,0.6872,22.87,22.86,0.1742,0.2297,22.71,1.79,[6]],[16.3,"low",0.1706,0.1922,0.4077,0.1706,0.0,0.1112,0.6917,23.34,22.4,0.1758,0.2344,22.71,2.29,[6]],[18.4,"low",0.2013,0.226,0.4296,0.2013,0.0,0.1292,0.6961,23.82,21.96,0.1773,0.2391,22.71,2.79,[6]],[20.5,"low",0.2314,0.2588,0.4512,0.2314,0.0,0.1463,0.7003,24.29,21.54,0.1789,0.2438,22.71,3.29,[6]],[22.5,"low",0.261,0.2908,0.4723,0.261,0.0,0.1623,0.7045,24.77,21.13,0.1805,0.2485,22.71,3.79,[6]],[24.5,"low",0.29,0.3219,0.493,0.29,0.0,0.1774,0.7086,25.24,20.74,0.182,0.2531,22.71,4.29,[6]],[26.4,"low",0.3185,0.3522,0.5133,0.3185,0.0,0.1916,0.7125,25.72,20.36,0.1835,0.2578,22.71,4.79,[6]],[28.2,"low",0.3464,0.3817,0.5333,0.3464,0.0,0.2048,0.7163,26.2,20.0,0.185,0.2625,22.71,5.29,[6]],[30.1,"low",0.3739,0.4105,0.5529,0.3739,0.0,0.2172,0.7201,26.67,19.65,0.1865,0.2672,22.71,5.79,[6]],[31.9,"low",0.4009,0.4385,0.5722,0.4009,0.0,0.2286,0.7237,27.15,19.31,0.188,0.2719,22.71,6.29,[6]],[33.6,"low",0.4274,0.4659,0.5911,0.4274,0.0,0.2392,0.7273,27.62,18.98,0.1895,0.2766,22.71,6.79,[6]],[35.3,"medium",0.4535,0.4925,0.6097,0.4535,0.0,0.249,0.7308,28.1,18.67,0.1909,0.2813,22.71,7.29,[]],[36.9,"medium",0.4792,0.5185,0.6281,0.4792,0.0,0.258,0.7341,28.58,18.36,0.1924,0.286,22.71,7.79,[]],[38.9,"medium",0.5044,0.5439,0.6461,0.5044,0.0145,0.2662,0.7375,29.05,18.06,0.1938,0.2906,22.71,8.29,[]],[41.1,"medium",0.5292,0.5687,0.6638,0.5292,0.0392,0.2736,0.7407,29.53,17.78,0.1952,0.2953,22.71,8.79,[]],[43.3,"medium",0.5537,0.5929,0.6813,0.5537,0.0639,0.2803,0.7438,30.01,17.5,0.1966,0.3,22.71,9.29,[]],[45.4,"medium",0.5777,0.6165,0.6985,0.5777,0.0885,0.2863,0.7469,30.48,17.23,0.198,0.3047,22.71,9.79,[]],[47.5,"medium",0.6014,0.6396,0.7154,0.6014,0.1132,0.2915,0.7499,30.96,16.97,0.1994,0.3094,22.71,10.29,[]],[49.6,"medium",0.6248,0.6621,0.732,0.6248,0.1379,0.2961,0.7528,31.44,16.72,0.2007,0.3141,22.71,10.79,[]],[51.6,"medium",0.6477,0.6842,0.7485,0.6477,0.1626,0.3001,0.7557,31.91,16.47,0.2021,0.3188,22.71,11.29,[]],[53.6,"medium",0.6704,0.7057,0.7646,0.6704,0.1872,0.3035,0.7585,32.39,16.23,0.2034,0.3235,22.71,11.79,[]],[55.6,"medium",0.6927,0.7268,0.7806,0.6927,0.2119,0.3062,0.7613,32.87,16.0,0.2048,0.3282,22.71,12.29,[]],[57.5,"medium",0.7147,0.7474,0.7963,0.7147,0.2366,0.3084,0.7639,33.35,15.77,0.2061,0.3328,22.71,12.79,[]],[59.4,"medium",0.7365,0.7676,0.8118,0.7365,0.2612,0.31,0.7666,33.82,15.55,0.2074,0.3375,22.71,13.29,[]],[61.3,"medium",0.7579,0.7874,0.8271,0.7579,0.2859,0.3111,0.7691,34.3,15.34,0.2087,0.3422,22.71,13.79,[]],[63.2,"medium",0.779,0.8067,0.8422,0.779,0.3106,0.3117,0.7716,34.78,15.13,0.21,0.3469,22.71,14.29,[]],[65.0,"critical",0.7998,0.8256,0.857,0.7998,0.3353,0.3118,0.7741,35.26,14.93,0.2113,0.3516,22.71,14.79,[]],[66.8,"critical",0.8204,0.8441,0.8717,0.8204,0.3599,0.3115,0.7765,35.74,14.74,0.2126,0.3563,22.71,15.29,[]],[68.6,"critical",0.8407,0.8623,0.8862,0.8407,0.3846,0.3107,0.7789,36.22,14.54,0.2138,0.361,22.71,15.79,[]],[70.4,"critical",0.8607,0.88,0.9005,0.8607,0.4093,0.3095,0.7812,36.69,14.36,0.2151,0.3657,22.71,16.29,[]],[72.1,"critical",0.8804,0.8975,0.9146,0.8804,0.434,0.308,0.7835,37.17,14.18,0.2163,0.3703,22.71,16.79,[]],[73.8,"critical",0.9,0.9145,0.9286,0.9,0.4586,0.306,0.7857,37.65,14.0,0.2176,0.375,22.71,17.29,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,12.81,35.46,0.1427,0.148,22.3,-7.3,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,13.24,34.32,0.1448,0.153,22.3,-6.8,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,13.68,33.25,0.1469,0.1579,22.3,-6.3,[1,3]],[0.1,"low",0.0,0.0,0.004,0.0,0.0,0.0,0.6052,14.11,32.24,0.149,0.1628,22.3,-5.8,[1,3]],[0.6,"low",0.0,0.0,0.0371,0.0,0.0,0.0,0.6127,14.55,31.29,0.151,0.1678,22.3,-5.3,[1,3]],[1.0,"low",0.0,0.0,0.0693,0.0,0.0,0.0,0.6198,14.98,30.4,0.153,0.1727,22.3,-4.8,[1,3]],[1.5,"low",0.0,0.0,0.1005,0.0,0.0,0.0,0.6267,15.42,29.55,0.155,0.1776,22.3,-4.3,[1,3]],[2.0,"low",0.0,0.0,0.1308,0.0,0.0,0.0,0.6334,15.85,28.75,0.1569,0.1826,22.3,-3.8,[1,3]],[2.4,"low",0.0,0.0,0.1604,0.0,0.0,0.0,0.6399,16.29,28.0,0.1588,0.1875,22.3,-3.3,[1,3]],[2.8,"low",0.0,0.0,0.1892,0.0,0.0,0.0,0.6461,16.73,27.28,0.1607,0.1925,22.3,-2.8,[1,3]],[3.3,"low",0.0,0.0,0.2172,0.0,0.0,0.0,0.6521,17.16,26.6,0.1626,0.1974,22.3,-2.3,[1,3]],[3.7,"low",0.0,0.0,0.2446,0.0,0.0,0.0,0.658,17.6,25.95,0.1644,0.2023,22.3,-1.8,[1,3]],[4.1,"low",0.0,0.0,0.2713,0.0,0.0,0.0,0.6636,18.04,25.33,0.1662,0.2073,22.3,-1.3,[3]],[5.4,"low",0.0161,0.0185,0.2974,0.0161,0.0,0.0115,0.6691,18.47,24.74,0.168,0.2122,22.3,-0.8,[3]],[8.0,"low",0.0518,0.0592,0.3229,0.0518,0.0,0.0366,0.6744,18.91,24.18,0.1698,0.2171,22.3,-0.3,[3]],[10.5,"low",0.0866,0.0986,0.3478,0.0866,0.0,0.0606,0.6795,19.35,23.64,0.1715,0.2221,22.3,0.2,[6]],[12.9,"low",0.1208,0.1369,0.3721,0.1208,0.0,0.0833,0.6845,19.78,23.13,0.1732,0.227,22.3,0.7,[6]],[15.2,"low",0.1541,0.174,0.396,0.1541,0.0,0.1049,0.6893,20.22,22.64,0.1749,0.2319,22.3,1.2,[6]],[17.5,"low",0.1868,0.2101,0.4193,0.1868,0.0,0.1254,0.694,20.66,22.16,0.1766,0.2369,22.3,1.7,[6]],[19.7,"low",0.2188,0.2451,0.4421,0.2188,0.0,0.1447,0.6986,21.1,21.71,0.1783,0.2418,22.3,2.2,[6]],[21.8,"low",0.2502,0.2791,0.4645,0.2502,0.0,0.1631,0.703,21.53,21.28,0.1799,0.2467,22.3,2.7,[6]],[23.9,"low",0.2809,0.3122,0.4865,0.2809,0.0,0.1803,0.7073,21.97,20.86,0.1815,0.2517,22.3,3.2,[6]],[26.0,"low",0.311,0.3443,0.508,0.311,0.0,0.1966,0.7115,22.41,20.46,0.1831,0.2566,22.3,3.7,[6]],[28.0,"low",0.3406,0.3756,0.5291,0.3406,0.0,0.2118,0.7155,22.85,20.07,0.1847,0.2615,22.3,4.2,[6]],[29.9,"low",0.3696,0.406,0.5498,0.3696,0.0,0.2261,0.7195,23.29,19.7,0.1863,0.2665,22.3,4.7,[6]],[31.8,"low",0.3981,0.4356,0.5702,0.3981,0.0,0.2395,0.7234,23.73,19.34,0.1879,0.2714,22.3,5.2,[6]],[33.6,"low",0.426,0.4644,0.5901,0.426,0.0,0.2519,0.7271,24.17,19.0,0.1894,0.2763,22.3,5.7,[6]],[35.4,"medium",0.4535,0.4925,0.6097,0.4535,0.0,0.2634,0.7308,24.6,18.67,0.1909,0.2813,22.3,6.2,[]],[37.2,"medium",0.4805,0.5199,0.629,0.4805,0.0,0.274,0.7343,25.04,18.34,0.1924,0.2862,22.3,6.7,[]],[38.9,"medium",0.507,0.5465,0.648,0.507,0.0,0.2838,0.7378,25.48,18.03,0.1939,0.2911,22.3,7.2,[]],[40.7,"medium",0.5331,0.5725,0.6666,0.5331,0.0051,0.2927,0.7412,25.92,17.73,0.1954,0.2961,22.3,7.7,[]],[43.0,"medium",0.5588,0.5979,0.6849,0.5588,0.0311,0.3009,0.7445,26.36,17.44,0.1969,0.301,22.3,8.2,[]],[45.2,"medium",0.584,0.6226,0.7029,0.584,0.057,0.3082,0.7477,26.8,17.16,0.1984,0.3059,22.3,8.7,[]],[47.4,"medium",0.6088,0.6468,0.7207,0.6088,0.083,0.3148,0.7508,27.24,16.89,0.1998,0.3109,22.3,9.2,[]],[49.6,"medium",0.6333,0.6703,0.7381,0.6333,0.109,0.3206,0.7539,27.68,16.62,0.2012,0.3158,22.3,9.7,[]],[51.7,"medium",0.6573,0.6933,0.7553,0.6573,0.135,0.3257,0.7569,28.12,16.37,0.2027,0.3208,22.3,10.2,[]],[53.8,"medium",0.681,0.7158,0.7722,0.681,0.1609,0.3301,0.7598,28.56,16.12,0.2041,0.3257,22.3,10.7,[]],[55.9,"medium",0.7044,0.7377,0.7889,0.7044,0.1869,0.3339,0.7627,29.0,15.88,0.2055,0.3306,22.3,11.2,[]],[57.9,"medium",0.7274,0.7592,0.8053,0.7274,0.2129,0.337,0.7655,29.44,15.65,0.2069,0.3356,22.3,11.7,[]],[59.9,"medium",0.75,0.7801,0.8215,0.75,0.2388,0.3395,0.7682,29.88,15.42,0.2082,0.3405,22.3,12.2,[]],[61.9,"medium",0.7723,0.8006,0.8374,0.7723,0.2648,0.3414,0.7709,30.32,15.2,0.2096,0.3454,22.3,12.7,[]],[63.9,"medium",0.7944,0.8207,0.8531,0.7944,0.2908,0.3427,0.7735,30.76,14.98,0.2109,0.3504,22.3,13.2,[]],[65.8,"critical",0.8161,0.8403,0.8686,0.8161,0.3168,0.3435,0.776,31.2,14.78,0.2123,0.3553,22.3,13.7,[]],[67.7,"critical",0.8375,0.8594,0.8839,0.8375,0.3427,0.3438,0.7785,31.64,14.57,0.2136,0.3602,22.3,14.2,[]],[69.6,"critical",0.8586,0.8782,0.899,0.8586,0.3687,0.3435,0.781,32.08,14.38,0.2149,0.3652,22.3,14.7,[]],[71.4,"critical",0.8794,0.8966,0.9139,0.8794,0.3947,0.3428,0.7833,32.53,14.19,0.2163,0.3701,22.3,15.2,[]],[73.2,"critical",0.9,0.9145,0.9286,0.9,0.4206,0.3417,0.7857,32.97,14.0,0.2176,0.375,22.3,15.7,[]],[75.0,"critical",0.9203,0.9321,0.9431,0.9203,0.4466,0.3401,0.788,33.41,13.82,0.2189,0.38,22.3,16.2,[]],[76.8,"critical",0.9403,0.9494,0.9574,0.9403,0.4726,0.3381,0.7902,33.85,13.64,0.2201,0.3849,22.3,16.7,[]],[78.6,"critical",0.9601,0.9663,0.9715,0.9601,0.4986,0.3358,0.7924,34.29,13.47,0.2214,0.3898,22.3,17.2,[]],[80.3,"critical",0.9796,0.9828,0.9854,0.9796,0.5245,0.3331,0.7946,34.73,13.3,0.2227,0.3948,22.3,17.7,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,12.55,35.01,0.1435,0.15,22.2,-7.2,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,12.98,33.88,0.1457,0.155,22.2,-6.7,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,13.4,32.82,0.1478,0.16,22.2,-6.2,[1,3]],[0.3,"low",0.0,0.0,0.0184,0.0,0.0,0.0,0.6085,13.83,31.83,0.1498,0.165,22.2,-5.7,[1,3]],[0.8,"low",0.0,0.0,0.0514,0.0,0.0,0.0,0.6159,14.26,30.89,0.1519,0.17,22.2,-5.2,[1,3]],[1.3,"low",0.0,0.0,0.0836,0.0,0.0,0.0,0.623,14.68,30.01,0.1539,0.175,22.2,-4.7,[1,3]],[1.7,"low",0.0,0.0,0.1148,0.0,0.0,0.0,0.6299,15.11,29.17,0.1559,0.18,22.2,-4.2,[1,3]],[2.2,"low",0.0,0.0,0.1452,0.0,0.0,0.0,0.6365,15.54,28.39,0.1578,0.185,22.2,-3.7,[1,3]],[2.6,"low",0.0,0.0,0.1747,0.0,0.0,0.0,0.643,15.96,27.64,0.1598,0.19,22.2,-3.2,[1,3]],[3.1,"low",0.0,0.0,0.2035,0.0,0.0,0.0,0.6492,16.39,26.93,0.1617,0.195,22.2,-2.7,[1,3]],[3.5,"low",0.0,0.0,0.2316,0.0,0.0,0.0,0.6552,16.82,26.26,0.1635,0.2,22.2,-2.2,[1,3]],[3.9,"low",0.0,0.0,0.2589,0.0,0.0,0.0,0.661,17.25,25.62,0.1654,0.2049,22.2,-1.7,[1,3]],[4.3,"low",0.0,0.0,0.2856,0.0,0.0,0.0,0.6666,17.67,25.01,0.1672,0.2099,22.2,-1.2,[3]],[6.9,"low",0.0361,0.0414,0.3117,0.0361,0.0,0.0259,0.672,18.1,24.42,0.169,0.2149,22.2,-0.7,[3]],[9.4,"low",0.0718,0.0819,0.3372,0.0718,0.0,0.0508,0.6773,18.53,23.87,0.1708,0.2199,22.2,-0.2,[3]],[11.9,"low",0.1067,0.1212,0.3621,0.1067,0.0,0.0746,0.6824,18.96,23.34,0.1725,0.2249,22.2,0.3,[6]],[14.3,"low",0.1408,0.1592,0.3864,0.1408,0.0,0.0971,0.6874,19.39,22.83,0.1742,0.2299,22.2,0.8,[6]],[16.6,"low",0.1742,0.1962,0.4103,0.1742,0.0,0.1185,0.6922,19.81,22.35,0.1759,0.2349,22.2,1.3,[6]],[18.9,"low",0.2068,0.2321,0.4336,0.2068,0.0,0.1388,0.6969,20.24,21.88,0.1776,0.2399,22.2,1.8,[6]],[21.1,"low",0.2388,0.2669,0.4565,0.2388,0.0,0.158,0.7014,20.67,21.43,0.1793,0.2449,22.2,2.3,[6]],[23.2,"low",0.2702,0.3007,0.4789,0.2702,0.0,0.1761,0.7058,21.1,21.01,0.181,0.2499,22.2,2.8,[6]],[25.3,"low",0.3009,0.3336,0.5008,0.3009,0.0,0.1932,0.7101,21.53,20.59,0.1826,0.2549,22.2,3.3,[6]],[27.3,"low",0.3311,0.3655,0.5223,0.3311,0.0,0.2093,0.7142,21.96,20.2,0.1842,0.2599,22.2,3.8,[6]],[29.3,"low",0.3606,0.3966,0.5434,0.3606,0.0,0.2243,0.7183,22.39,19.82,0.1858,0.2649,22.2,4.3,[6]],[31.3,"low",0.3896,0.4269,0.5641,0.3896,0.0,0.2384,0.7222,22.82,19.45,0.1874,0.2699,22.2,4.8,[6]],[33.1,"low",0.4181,0.4563,0.5845,0.4181,0.0,0.2515,0.726,23.25,19.1,0.189,0.2749,22.2,5.3,[6]],[35.0,"medium",0.4461,0.485,0.6044,0.4461,0.0,0.2637,0.7298,23.68,18.75,0.1905,0.2799,22.2,5.8,[]],[36.8,"medium",0.4735,0.5129,0.6241,0.4735,0.0,0.275,0.7334,24.11,18.43,0.192,0.2849,22.2,6.3,[]],[38.5,"medium",0.5005,0.54,0.6433,0.5005,0.0,0.2854,0.7369,24.54,18.11,0.1936,0.2899,22.2,6.8,[]],[40.2,"medium",0.5271,0.5665,0.6623,0.5271,0.0,0.295,0.7404,24.97,17.8,0.1951,0.2949,22.2,7.3,[]],[42.3,"medium",0.5532,0.5924,0.6809,0.5532,0.0156,0.3037,0.7438,25.4,17.5,0.1966,0.2999,22.2,7.8,[]],[44.6,"medium",0.5788,0.6176,0.6992,0.5788,0.0419,0.3116,0.747,25.83,17.22,0.1981,0.3049,22.2,8.3,[]],[46.8,"medium",0.604,0.6421,0.7172,0.604,0.0682,0.3188,0.7502,26.26,16.94,0.1995,0.3099,22.2,8.8,[]],[49.0,"medium",0.6289,0.6661,0.735,0.6289,0.0945,0.3251,0.7534,26.69,16.67,0.201,0.3149,22.2,9.3,[]],[51.2,"medium",0.6533,0.6895,0.7524,0.6533,0.1208,0.3307,0.7564,27.12,16.41,0.2024,0.3199,22.2,9.8,[]],[53.3,"medium",0.6774,0.7123,0.7696,0.6774,0.1471,0.3356,0.7594,27.55,16.16,0.2038,0.3249,22.2,10.3,[]],[55.4,"medium",0.7011,0.7346,0.7865,0.7011,0.1734,0.3398,0.7623,27.99,15.91,0.2053,0.3299,22.2,10.8,[]],[57.5,"medium",0.7244,0.7564,0.8032,0.7244,0.1998,0.3434,0.7651,28.42,15.68,0.2067,0.3349,22.2,11.3,[]],[59.5,"medium",0.7474,0.7777,0.8196,0.7474,0.2261,0.3463,0.7679,28.85,15.44,0.2081,0.3399,22.2,11.8,[]],[61.5,"medium",0.7701,0.7985,0.8358,0.7701,0.2524,0.3486,0.7706,29.28,15.22,0.2095,0.3449,22.2,12.3,[]],[63.5,"medium",0.7924,0.8189,0.8517,0.7924,0.2787,0.3502,0.7732,29.71,15.0,0.2108,0.3499,22.2,12.8,[]],[65.5,"critical",0.8144,0.8388,0.8675,0.8144,0.305,0.3514,0.7758,30.14,14.79,0.2122,0.3549,22.2,13.3,[]],[67.4,"critical",0.8361,0.8582,0.883,0.8361,0.3313,0.3519,0.7784,30.58,14.59,0.2135,0.3599,22.2,13.8,[]],[69.3,"critical",0.8575,0.8772,0.8982,0.8575,0.3576,0.352,0.7808,31.01,14.39,0.2149,0.3649,22.2,14.3,[]],[71.2,"critical",0.8786,0.8959,0.9133,0.8786,0.3839,0.3515,0.7833,31.44,14.19,0.2162,0.3699,22.2,14.8,[]],[73.0,"critical",0.8995,0.9141,0.9282,0.8995,0.4102,0.3506,0.7856,31.87,14.0,0.2175,0.3749,22.2,15.3,[]],[74.8,"critical",0.92,0.9319,0.9429,0.92,0.4365,0.3493,0.788,32.3,13.82,0.2188,0.3799,22.2,15.8,[]],[76.6,"critical",0.9403,0.9494,0.9574,0.9403,0.4628,0.3475,0.7902,32.74,13.64,0.2201,0.3849,22.2,16.3,[]],[78.4,"critical",0.9603,0.9665,0.9717,0.9603,0.4892,0.3454,0.7925,33.17,13.46,0.2214,0.3899,22.2,16.8,[]],[80.2,"critical",0.9801,0.9833,0.9858,0.9801,0.5155,0.3428,0.7946,33.6,13.29,0.2227,0.3949,22.2,17.3,[]],[81.9,"critical",0.9996,0.9997,0.9997,0.9996,0.5418,0.3399,0.7968,34.03,13.13,0.224,0.3999,22.2,17.8,[]]]],"Wax candle":[[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4021,35.18,70.93,0.1041,0.074,16.9,-1.9,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4104,36.37,68.64,0.1057,0.0765,16.9,-1.4,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4184,37.56,66.49,0.1072,0.079,16.9,-0.9,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,38.76,64.48,0.1088,0.0814,16.9,-0.4,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4339,39.95,62.58,0.1102,0.0839,16.9,0.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4414,41.15,60.8,0.1117,0.0864,16.9,0.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,42.35,59.11,0.1131,0.0888,16.9,1.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4558,43.54,57.51,0.1145,0.0913,16.9,1.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4627,44.74,56.0,0.1159,0.0938,16.9,2.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,45.94,54.56,0.1173,0.0962,16.9,2.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.476,47.13,53.2,0.1187,0.0987,16.9,3.1,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4825,48.33,51.9,0.12,0.1012,16.9,3.6,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,49.53,50.66,0.1213,0.1036,16.9,4.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4949,50.73,49.48,0.1226,0.1061,16.9,4.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,51.93,48.36,0.1239,0.1086,16.9,5.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,53.13,47.29,0.1252,0.111,16.9,5.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5125,54.33,46.26,0.1265,0.1135,16.9,6.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5181,55.54,45.27,0.1277,0.116,16.9,6.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,56.74,44.33,0.1289,0.1184,16.9,7.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,57.94,43.43,0.1301,0.1209,16.9,7.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5343,59.14,42.56,0.1313,0.1234,16.9,8.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,60.35,41.72,0.1325,0.1258,16.9,8.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,61.55,40.92,0.1337,0.1283,16.9,9.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5494,62.75,40.15,0.1349,0.1308,16.9,9.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,63.96,39.4,0.136,0.1332,16.9,10.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,65.16,38.69,0.1371,0.1357,16.9,10.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,66.37,38.0,0.1383,0.1382,16.9,11.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,67.57,37.33,0.1394,0.1406,16.9,11.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5726,68.78,36.69,0.1405,0.1431,16.9,12.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5769,69.98,36.06,0.1416,0.1456,16.9,12.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,71.19,35.46,0.1427,0.148,16.9,13.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5854,72.4,34.88,0.1437,0.1505,16.9,13.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,73.6,34.32,0.1448,0.153,16.9,14.1,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,74.81,33.77,0.1459,0.1554,16.9,14.6,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,76.02,33.25,0.1469,0.1579,16.9,15.1,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0104,0.0,0.6014,77.23,32.74,0.1479,0.1604,16.9,15.6,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0234,0.0,0.6052,78.44,32.24,0.149,0.1628,16.9,16.1,[6,7]],[0.9,"low",0.0,0.0,0.0,0.0,0.0363,0.0,0.609,79.65,31.76,0.15,0.1653,16.9,16.6,[6,7]],[1.2,"low",0.0,0.0,0.0,0.0,0.0493,0.0,0.6127,80.85,31.29,0.151,0.1678,16.9,17.1,[6,7]],[1.6,"low",0.0,0.0,0.0,0.0,0.0623,0.0,0.6163,82.06,30.84,0.152,0.1702,16.9,17.6,[6,7]],[1.9,"low",0.0,0.0,0.0,0.0,0.0753,0.0,0.6198,83.27,30.4,0.153,0.1727,16.9,18.1,[6,7]],[2.2,"low",0.0,0.0,0.0,0.0,0.0883,0.0,0.6233,84.48,29.97,0.154,0.1752,16.9,18.6,[6,7]],[2.8,"low",0.0,0.0,0.0145,0.0,0.1013,0.0,0.6267,85.69,29.55,0.155,0.1776,16.9,19.1,[6,7]],[3.3,"low",0.0,0.0,0.0313,0.0,0.1143,0.0,0.6301,86.9,29.15,0.1559,0.1801,16.9,19.6,[6,7]],[3.9,"low",0.0,0.0,0.0478,0.0,0.1272,0.0,0.6334,88.12,28.75,0.1569,0.1826,16.9,20.1,[6,7]],[4.5,"low",0.0,0.0,0.0641,0.0,0.1402,0.0,0.6367,89.33,28.37,0.1579,0.185,16.9,20.6,[6,7]],[5.0,"low",0.0,0.0,0.0802,0.0,0.1532,0.0,0.6399,90.54,28.0,0.1588,0.1875,16.9,21.1,[6,7]],[5.6,"low",0.0,0.0,0.096,0.0,0.1662,0.0,0.643,91.75,27.63,0.1598,0.19,16.9,21.6,[6,7]],[6.2,"low",0.0,0.0,0.1117,0.0,0.1792,0.0,0.6461,92.96,27.28,0.1607,0.1925,16.9,22.1,[6,7]],[6.7,"low",0.0,0.0,0.1272,0.0,0.1922,0.0,0.6491,94.17,26.93,0.1616,0.1949,16.9,22.6,[6,7]],[7.3,"low",0.0,0.0,0.1424,0.0,0.2052,0.0,0.6521,95.39,26.6,0.1626,0.1974,16.9,23.1,[6,7]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4263,30.28,64.48,0.1088,0.0814,16.35,-1.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4347,31.31,62.4,0.1104,0.0841,16.35,-0.85,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4429,32.33,60.45,0.112,0.0868,16.35,-0.35,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4508,33.36,58.62,0.1136,0.0896,16.35,0.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4585,34.39,56.89,0.1151,0.0923,16.35,0.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4661,35.42,55.27,0.1166,0.095,16.35,1.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,36.45,53.73,0.1181,0.0977,16.35,1.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4806,37.48,52.28,0.1196,0.1004,16.35,2.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4875,38.51,50.9,0.1211,0.1031,16.35,2.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,39.54,49.6,0.1225,0.1058,16.35,3.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5009,40.57,48.36,0.1239,0.1086,16.35,3.65,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5074,41.6,47.18,0.1253,0.1113,16.35,4.15,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,42.64,46.06,0.1267,0.114,16.35,4.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5198,43.67,44.99,0.1281,0.1167,16.35,5.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5258,44.7,43.96,0.1294,0.1194,16.35,5.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,45.74,42.99,0.1307,0.1221,16.35,6.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,46.77,42.05,0.132,0.1248,16.35,6.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5429,47.8,41.16,0.1333,0.1276,16.35,7.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,48.84,40.3,0.1346,0.1303,16.35,7.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5537,49.87,39.48,0.1359,0.133,16.35,8.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5589,50.91,38.69,0.1371,0.1357,16.35,8.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,51.94,37.93,0.1384,0.1384,16.35,9.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,52.98,37.2,0.1396,0.1411,16.35,9.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5739,54.02,36.5,0.1408,0.1438,16.35,10.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,55.05,35.82,0.142,0.1466,16.35,10.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5833,56.09,35.17,0.1432,0.1493,16.35,11.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,57.13,34.54,0.1444,0.152,16.35,11.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,58.16,33.94,0.1455,0.1547,16.35,12.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5967,59.2,33.35,0.1467,0.1574,16.35,12.65,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.601,60.24,32.79,0.1478,0.1601,16.35,13.15,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,61.28,32.24,0.149,0.1628,16.35,13.65,[6,7]],[0.2,"low",0.0,0.0,0.0,0.0,0.0096,0.0,0.6094,62.32,31.71,0.1501,0.1656,16.35,14.15,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0239,0.0,0.6134,63.36,31.2,0.1512,0.1683,16.35,14.65,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0382,0.0,0.6174,64.4,30.7,0.1523,0.171,16.35,15.15,[6,7]],[1.3,"low",0.0,0.0,0.0,0.0,0.0524,0.0,0.6212,65.44,30.22,0.1534,0.1737,16.35,15.65,[6,7]],[1.8,"low",0.0,0.0,0.0061,0.0,0.0667,0.0,0.625,66.48,29.76,0.1545,0.1764,16.35,16.15,[6,7]],[2.4,"low",0.0,0.0,0.0246,0.0,0.081,0.0,0.6288,67.52,29.31,0.1556,0.1791,16.35,16.65,[6,7]],[3.0,"low",0.0,0.0,0.0429,0.0,0.0953,0.0,0.6324,68.56,28.87,0.1566,0.1818,16.35,17.15,[6,7]],[3.7,"low",0.0,0.0,0.0608,0.0,0.1096,0.0,0.636,69.6,28.45,0.1577,0.1846,16.35,17.65,[6,7]],[4.3,"low",0.0,0.0,0.0786,0.0,0.1239,0.0,0.6395,70.64,28.03,0.1587,0.1873,16.35,18.15,[6,7]],[4.9,"low",0.0,0.0,0.096,0.0,0.1381,0.0,0.643,71.68,27.63,0.1598,0.19,16.35,18.65,[6,7]],[5.5,"low",0.0,0.0,0.1133,0.0,0.1524,0.0,0.6464,72.72,27.24,0.1608,0.1927,16.35,19.15,[6,7]],[6.1,"low",0.0,0.0,0.1302,0.0,0.1667,0.0,0.6497,73.76,26.87,0.1618,0.1954,16.35,19.65,[6,7]],[6.7,"low",0.0,0.0,0.147,0.0,0.181,0.0,0.653,74.81,26.5,0.1628,0.1981,16.35,20.15,[6,7]],[7.3,"low",0.0,0.0,0.1635,0.0,0.1953,0.0,0.6562,75.85,26.14,0.1639,0.2008,16.35,20.65,[6,7]],[7.9,"low",0.0,0.0,0.1798,0.0,0.2096,0.0,0.6594,76.89,25.79,0.1649,0.2036,16.35,21.15,[6,7]],[8.5,"low",0.0,0.0,0.1959,0.0,0.2239,0.0,0.6625,77.93,25.45,0.1658,0.2063,16.35,21.65,[6,7]],[9.1,"low",0.0,0.0,0.2118,0.0,0.2381,0.0,0.6655,78.98,25.12,0.1668,0.209,16.35,22.15,[6,7]],[10.4,"low",0.0125,0.0143,0.2274,0.0125,0.2524,0.0,0.6685,80.02,24.8,0.1678,0.2117,16.35,22.65,[6]],[12.0,"low",0.0322,0.0369,0.2429,0.0322,0.2667,0.0,0.6715,81.06,24.49,0.1688,0.2144,16.35,23.15,[6]],[13.7,"low",0.0518,0.0592,0.2582,0.0518,0.281,0.0,0.6744,82.11,24.18,0.1698,0.2171,16.35,23.65,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4332,29.03,62.77,0.1101,0.0836,16.19,-1.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4416,30.01,60.74,0.1117,0.0864,16.19,-0.69,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4498,30.99,58.84,0.1134,0.0892,16.19,-0.19,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4578,31.98,57.06,0.115,0.092,16.19,0.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4655,32.97,55.38,0.1165,0.0948,16.19,0.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4731,33.95,53.8,0.1181,0.0976,16.19,1.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4804,34.94,52.31,0.1196,0.1004,16.19,1.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4876,35.93,50.89,0.1211,0.1032,16.19,2.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4945,36.91,49.55,0.1226,0.1059,16.19,2.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5013,37.9,48.28,0.124,0.1087,16.19,3.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5079,38.89,47.08,0.1254,0.1115,16.19,3.81,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5144,39.88,45.93,0.1269,0.1143,16.19,4.31,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5207,40.87,44.83,0.1283,0.1171,16.19,4.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5268,41.86,43.79,0.1296,0.1199,16.19,5.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5328,42.85,42.8,0.131,0.1227,16.19,5.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5386,43.84,41.85,0.1323,0.1255,16.19,6.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5443,44.83,40.94,0.1337,0.1283,16.19,6.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5499,45.82,40.06,0.135,0.131,16.19,7.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5553,46.81,39.23,0.1363,0.1338,16.19,7.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5607,47.81,38.43,0.1376,0.1366,16.19,8.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5659,48.8,37.66,0.1388,0.1394,16.19,8.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5709,49.79,36.92,0.1401,0.1422,16.19,9.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5759,50.78,36.21,0.1413,0.145,16.19,9.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5807,51.78,35.53,0.1425,0.1478,16.19,10.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5855,52.77,34.87,0.1438,0.1506,16.19,10.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5901,53.77,34.24,0.145,0.1533,16.19,11.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5947,54.76,33.63,0.1462,0.1561,16.19,11.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,55.75,33.04,0.1473,0.1589,16.19,12.31,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6035,56.75,32.47,0.1485,0.1617,16.19,12.81,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6078,57.74,31.92,0.1497,0.1645,16.19,13.31,[6,7]],[0.3,"low",0.0,0.0,0.0,0.0,0.0104,0.0,0.6119,58.74,31.38,0.1508,0.1673,16.19,13.81,[6,7]],[0.6,"low",0.0,0.0,0.0,0.0,0.0251,0.0,0.616,59.74,30.87,0.1519,0.1701,16.19,14.31,[6,7]],[1.0,"low",0.0,0.0,0.0,0.0,0.0398,0.0,0.62,60.73,30.37,0.1531,0.1729,16.19,14.81,[6,7]],[1.4,"low",0.0,0.0,0.0008,0.0,0.0545,0.0,0.624,61.73,29.89,0.1542,0.1756,16.19,15.31,[6,7]],[2.0,"low",0.0,0.0,0.0199,0.0,0.0691,0.0,0.6278,62.72,29.42,0.1553,0.1784,16.19,15.81,[6,7]],[2.7,"low",0.0,0.0,0.0387,0.0,0.0838,0.0,0.6316,63.72,28.97,0.1564,0.1812,16.19,16.31,[6,7]],[3.3,"low",0.0,0.0,0.0573,0.0,0.0985,0.0,0.6353,64.72,28.53,0.1575,0.184,16.19,16.81,[6,7]],[4.0,"low",0.0,0.0,0.0755,0.0,0.1132,0.0,0.6389,65.72,28.1,0.1586,0.1868,16.19,17.31,[6,7]],[4.6,"low",0.0,0.0,0.0935,0.0,0.1278,0.0,0.6425,66.71,27.69,0.1596,0.1896,16.19,17.81,[6,7]],[5.2,"low",0.0,0.0,0.1112,0.0,0.1425,0.0,0.646,67.71,27.29,0.1607,0.1924,16.19,18.31,[6,7]],[5.9,"low",0.0,0.0,0.1287,0.0,0.1572,0.0,0.6494,68.71,26.9,0.1617,0.1952,16.19,18.81,[6,7]],[6.5,"low",0.0,0.0,0.1459,0.0,0.1719,0.0,0.6528,69.71,26.52,0.1628,0.198,16.19,19.31,[6,7]],[7.1,"low",0.0,0.0,0.1629,0.0,0.1865,0.0,0.6561,70.71,26.15,0.1638,0.2007,16.19,19.81,[6,7]],[7.7,"low",0.0,0.0,0.1797,0.0,0.2012,0.0,0.6594,71.71,25.79,0.1648,0.2035,16.19,20.31,[6,7]],[8.3,"low",0.0,0.0,0.1962,0.0,0.2159,0.0,0.6625,72.7,25.45,0.1659,0.2063,16.19,20.81,[6,7]],[8.9,"low",0.0,0.0,0.2125,0.0,0.2305,0.0,0.6657,73.7,25.11,0.1669,0.2091,16.19,21.31,[6,7]],[10.3,"low",0.0139,0.016,0.2286,0.0139,0.2452,0.0,0.6687,74.7,24.78,0.1679,0.2119,16.19,21.81,[6]],[12.0,"low",0.0342,0.0392,0.2444,0.0342,0.2599,0.0,0.6718,75.7,24.45,0.1689,0.2147,16.19,22.31,[6]],[13.7,"low",0.0542,0.062,0.2601,0.0542,0.2746,0.0,0.6747,76.7,24.14,0.1699,0.2175,16.19,22.81,[6]],[15.3,"low",0.074,0.0844,0.2756,0.074,0.2892,0.0,0.6776,77.7,23.84,0.1709,0.2203,16.19,23.31,[6]],[17.0,"low",0.0935,0.1064,0.2908,0.0935,0.3039,0.0,0.6805,78.7,23.54,0.1718,0.223,16.19,23.81,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4487,26.41,59.11,0.1131,0.0888,15.86,-0.86,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4572,27.3,57.2,0.1148,0.0918,15.86,-0.36,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4654,28.2,55.41,0.1165,0.0947,15.86,0.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4734,29.1,53.73,0.1181,0.0977,15.86,0.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4812,29.99,52.15,0.1197,0.1007,15.86,1.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,30.89,50.66,0.1213,0.1036,15.86,1.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4961,31.79,49.26,0.1229,0.1066,15.86,2.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5033,32.69,47.92,0.1244,0.1095,15.86,2.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5102,33.58,46.66,0.126,0.1125,15.86,3.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,34.48,45.47,0.1274,0.1155,15.86,3.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,35.38,44.33,0.1289,0.1184,15.86,4.14,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,36.28,43.25,0.1304,0.1214,15.86,4.64,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,37.18,42.22,0.1318,0.1244,15.86,5.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5424,38.08,41.24,0.1332,0.1273,15.86,5.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,38.98,40.3,0.1346,0.1303,15.86,6.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,39.89,39.4,0.136,0.1332,15.86,6.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5599,40.79,38.55,0.1374,0.1362,15.86,7.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5654,41.69,37.73,0.1387,0.1392,15.86,7.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,42.59,36.94,0.14,0.1421,15.86,8.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,43.49,36.19,0.1414,0.1451,15.86,8.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,44.4,35.46,0.1427,0.148,15.86,9.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,45.3,34.77,0.144,0.151,15.86,9.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,46.2,34.1,0.1452,0.154,15.86,10.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.596,47.11,33.46,0.1465,0.1569,15.86,10.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,48.01,32.84,0.1477,0.1599,15.86,11.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,48.91,32.24,0.149,0.1628,15.86,11.64,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,49.82,31.66,0.1502,0.1658,15.86,12.14,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,50.72,31.11,0.1514,0.1688,15.86,12.64,[6,7]],[0.4,"low",0.0,0.0,0.0,0.0,0.0149,0.0,0.6184,51.63,30.57,0.1526,0.1717,15.86,13.14,[6,7]],[0.8,"low",0.0,0.0,0.0,0.0,0.0305,0.0,0.6226,52.54,30.05,0.1538,0.1747,15.86,13.64,[6,7]],[1.4,"low",0.0,0.0,0.0145,0.0,0.046,0.0,0.6267,53.44,29.55,0.155,0.1776,15.86,14.14,[6,7]],[2.1,"low",0.0,0.0,0.0346,0.0,0.0616,0.0,0.6308,54.35,29.07,0.1561,0.1806,15.86,14.64,[6,7]],[2.7,"low",0.0,0.0,0.0543,0.0,0.0772,0.0,0.6347,55.25,28.6,0.1573,0.1836,15.86,15.14,[6,7]],[3.4,"low",0.0,0.0,0.0738,0.0,0.0928,0.0,0.6386,56.16,28.15,0.1584,0.1865,15.86,15.64,[6,7]],[4.1,"low",0.0,0.0,0.0929,0.0,0.1084,0.0,0.6424,57.07,27.71,0.1596,0.1895,15.86,16.14,[6,7]],[4.8,"low",0.0,0.0,0.1117,0.0,0.124,0.0,0.6461,57.97,27.28,0.1607,0.1925,15.86,16.64,[6,7]],[5.4,"low",0.0,0.0,0.1302,0.0,0.1395,0.0,0.6497,58.88,26.87,0.1618,0.1954,15.86,17.14,[6,7]],[6.1,"low",0.0,0.0,0.1485,0.0,0.1551,0.0,0.6533,59.79,26.47,0.1629,0.1984,15.86,17.64,[6,7]],[6.8,"low",0.0,0.0,0.1665,0.0,0.1707,0.0,0.6568,60.7,26.08,0.164,0.2013,15.86,18.14,[6,7]],[7.4,"low",0.0,0.0,0.1842,0.0,0.1863,0.0,0.6602,61.6,25.7,0.1651,0.2043,15.86,18.64,[6,7]],[8.1,"low",0.0,0.0,0.2017,0.0,0.2019,0.0,0.6636,62.51,25.33,0.1662,0.2073,15.86,19.14,[6,7]],[8.8,"low",0.0016,0.0018,0.2189,0.0016,0.2175,0.0,0.6669,63.42,24.97,0.1673,0.2102,15.86,19.64,[6]],[10.6,"low",0.0233,0.0267,0.2359,0.0233,0.233,0.0,0.6701,64.33,24.63,0.1683,0.2132,15.86,20.14,[6]],[12.4,"low",0.0447,0.0511,0.2526,0.0447,0.2486,0.0,0.6733,65.24,24.29,0.1694,0.2161,15.86,20.64,[6]],[14.2,"low",0.0658,0.0751,0.2692,0.0658,0.2642,0.0,0.6764,66.15,23.96,0.1705,0.2191,15.86,21.14,[6]],[15.9,"low",0.0866,0.0986,0.2854,0.0866,0.2798,0.0,0.6795,67.05,23.64,0.1715,0.2221,15.86,21.64,[6]],[17.6,"low",0.1072,0.1217,0.3015,0.1072,0.2954,0.0,0.6825,67.96,23.33,0.1725,0.225,15.86,22.14,[6]],[19.3,"low",0.1275,0.1444,0.3174,0.1275,0.311,0.0,0.6855,68.87,23.03,0.1736,0.228,15.86,22.64,[6]],[21.0,"low",0.1475,0.1667,0.3331,0.1475,0.3265,0.0,0.6884,69.78,22.73,0.1746,0.2309,15.86,23.14,[6]],[22.7,"low",0.1673,0.1886,0.3485,0.1673,0.3421,0.0,0.6912,70.69,22.45,0.1756,0.2339,15.86,23.64,[6]],[24.3,"low",0.1868,0.2101,0.3638,0.1868,0.3577,0.0,0.694,71.6,22.16,0.1766,0.2369,15.86,24.14,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4694,23.28,54.56,0.1173,0.0962,15.42,-0.42,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.478,24.07,52.8,0.1191,0.0994,15.42,0.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4863,24.86,51.15,0.1208,0.1026,15.42,0.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4943,25.65,49.6,0.1225,0.1058,15.42,1.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5021,26.44,48.14,0.1242,0.1091,15.42,1.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5097,27.24,46.77,0.1258,0.1123,15.42,2.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.517,28.03,45.47,0.1274,0.1155,15.42,2.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5242,28.82,44.24,0.129,0.1187,15.42,3.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5311,29.61,43.07,0.1306,0.1219,15.42,3.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5379,30.4,41.97,0.1322,0.1251,15.42,4.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5444,31.2,40.92,0.1337,0.1283,15.42,4.58,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5508,31.99,39.92,0.1352,0.1315,15.42,5.08,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,32.78,38.97,0.1367,0.1347,15.42,5.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5631,33.58,38.06,0.1382,0.1379,15.42,6.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.569,34.37,37.2,0.1396,0.1411,15.42,6.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,35.17,36.37,0.141,0.1443,15.42,7.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5804,35.96,35.58,0.1424,0.1475,15.42,7.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5858,36.76,34.83,0.1438,0.1508,15.42,8.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,37.55,34.1,0.1452,0.154,15.42,8.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5964,38.35,33.4,0.1466,0.1572,15.42,9.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6014,39.14,32.74,0.1479,0.1604,15.42,9.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,39.94,32.09,0.1493,0.1636,15.42,10.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6112,40.74,31.48,0.1506,0.1668,15.42,10.58,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,41.53,30.88,0.1519,0.17,15.42,11.08,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,42.33,30.31,0.1532,0.1732,15.42,11.58,[6,7]],[0.4,"low",0.0,0.0,0.0061,0.0,0.0132,0.0,0.625,43.13,29.76,0.1545,0.1764,15.42,12.08,[6,7]],[1.2,"low",0.0,0.0,0.0279,0.0,0.03,0.0,0.6294,43.93,29.23,0.1558,0.1796,15.42,12.58,[6,7]],[1.9,"low",0.0,0.0,0.0494,0.0,0.0469,0.0,0.6337,44.72,28.72,0.157,0.1828,15.42,13.08,[6,7]],[2.7,"low",0.0,0.0,0.0705,0.0,0.0638,0.0,0.638,45.52,28.22,0.1583,0.186,15.42,13.58,[6,7]],[3.4,"low",0.0,0.0,0.0913,0.0,0.0807,0.0,0.6421,46.32,27.74,0.1595,0.1892,15.42,14.08,[6,7]],[4.1,"low",0.0,0.0,0.1117,0.0,0.0976,0.0,0.6461,47.12,27.28,0.1607,0.1925,15.42,14.58,[6,7]],[4.8,"low",0.0,0.0,0.1318,0.0,0.1144,0.0,0.65,47.92,26.83,0.1619,0.1957,15.42,15.08,[6,7]],[5.6,"low",0.0,0.0,0.1515,0.0,0.1313,0.0,0.6539,48.72,26.4,0.1631,0.1989,15.42,15.58,[6,7]],[6.3,"low",0.0,0.0,0.1709,0.0,0.1482,0.0,0.6577,49.52,25.98,0.1643,0.2021,15.42,16.08,[6,7]],[7.0,"low",0.0,0.0,0.1901,0.0,0.1651,0.0,0.6614,50.31,25.57,0.1655,0.2053,15.42,16.58,[6,7]],[7.7,"low",0.0,0.0,0.2089,0.0,0.182,0.0,0.665,51.11,25.18,0.1667,0.2085,15.42,17.08,[6,7]],[9.1,"low",0.0125,0.0143,0.2274,0.0125,0.1989,0.0,0.6685,51.91,24.8,0.1678,0.2117,15.42,17.58,[6]],[11.0,"low",0.0358,0.041,0.2457,0.0358,0.2157,0.0,0.672,52.71,24.43,0.169,0.2149,15.42,18.08,[6]],[12.9,"low",0.0588,0.0672,0.2637,0.0588,0.2326,0.0,0.6754,53.51,24.07,0.1701,0.2181,15.42,18.58,[6]],[14.8,"low",0.0815,0.0928,0.2814,0.0815,0.2495,0.0,0.6787,54.32,23.72,0.1712,0.2213,15.42,19.08,[6]],[16.7,"low",0.1038,0.1179,0.2989,0.1038,0.2664,0.0,0.682,55.12,23.38,0.1724,0.2245,15.42,19.58,[6]],[18.5,"low",0.1258,0.1425,0.3161,0.1258,0.2833,0.0,0.6852,55.92,23.05,0.1735,0.2277,15.42,20.08,[6]],[20.4,"low",0.1475,0.1667,0.3331,0.1475,0.3001,0.0,0.6884,56.72,22.73,0.1746,0.2309,15.42,20.58,[6]],[22.2,"low",0.1689,0.1904,0.3498,0.1689,0.317,0.0,0.6914,57.52,22.42,0.1757,0.2341,15.42,21.08,[6]],[23.9,"low",0.19,0.2136,0.3663,0.19,0.3339,0.0,0.6945,58.32,22.12,0.1768,0.2374,15.42,21.58,[6]],[25.7,"low",0.2109,0.2364,0.3826,0.2109,0.3508,0.0,0.6974,59.12,21.82,0.1778,0.2406,15.42,22.08,[6]],[27.4,"low",0.2314,0.2588,0.3987,0.2314,0.3677,0.0,0.7003,59.92,21.54,0.1789,0.2438,15.42,22.58,[6]],[29.1,"low",0.2517,0.2808,0.4146,0.2517,0.3846,0.0,0.7032,60.73,21.26,0.18,0.247,15.42,23.08,[6]],[30.8,"low",0.2717,0.3024,0.4303,0.2717,0.4014,0.0,0.706,61.53,20.98,0.181,0.2502,15.42,23.58,[6]],[32.5,"low",0.2915,0.3235,0.4457,0.2915,0.4183,0.0,0.7088,62.33,20.72,0.1821,0.2534,15.42,24.08,[6]],[34.2,"low",0.311,0.3443,0.461,0.311,0.4352,0.0,0.7115,63.13,20.46,0.1831,0.2566,15.42,24.58,[6]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4888,20.72,50.66,0.1213,0.1036,15.02,-0.02,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4973,21.42,49.03,0.1232,0.1071,15.02,0.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5056,22.13,47.5,0.1249,0.1105,15.02,0.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5137,22.83,46.06,0.1267,0.114,15.02,1.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5214,23.53,44.7,0.1284,0.1174,15.02,1.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.529,24.24,43.43,0.1301,0.1209,15.02,2.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5363,24.94,42.22,0.1318,0.1244,15.02,2.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5434,25.65,41.08,0.1335,0.1278,15.02,3.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5503,26.35,40.0,0.1351,0.1313,15.02,3.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5571,27.06,38.97,0.1367,0.1347,15.02,4.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,27.76,38.0,0.1383,0.1382,15.02,4.98,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5699,28.47,37.07,0.1398,0.1416,15.02,5.48,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5761,29.18,36.19,0.1414,0.1451,15.02,5.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5821,29.88,35.35,0.1429,0.1485,15.02,6.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5879,30.59,34.54,0.1444,0.152,15.02,6.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,31.3,33.77,0.1459,0.1554,15.02,7.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5991,32.0,33.04,0.1473,0.1589,15.02,7.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6045,32.71,32.34,0.1488,0.1623,15.02,8.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,33.42,31.66,0.1502,0.1658,15.02,8.98,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6148,34.13,31.02,0.1516,0.1693,15.02,9.48,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,34.84,30.4,0.153,0.1727,15.02,9.98,[6,7]],[0.1,"low",0.0,0.0,0.0044,0.0,0.0,0.0,0.6247,35.55,29.8,0.1544,0.1762,15.02,10.48,[6,7]],[0.5,"low",0.0,0.0,0.0279,0.0,0.0043,0.0,0.6294,36.25,29.23,0.1558,0.1796,15.02,10.98,[6,7]],[1.3,"low",0.0,0.0,0.0511,0.0,0.0225,0.0,0.6341,36.96,28.68,0.1571,0.1831,15.02,11.48,[6,7]],[2.1,"low",0.0,0.0,0.0738,0.0,0.0407,0.0,0.6386,37.67,28.15,0.1584,0.1865,15.02,11.98,[6,7]],[2.9,"low",0.0,0.0,0.096,0.0,0.0589,0.0,0.643,38.38,27.63,0.1598,0.19,15.02,12.48,[6,7]],[3.7,"low",0.0,0.0,0.1179,0.0,0.0771,0.0,0.6473,39.09,27.14,0.1611,0.1934,15.02,12.98,[6,7]],[4.5,"low",0.0,0.0,0.1394,0.0,0.0952,0.0,0.6515,39.8,26.66,0.1624,0.1969,15.02,13.48,[6,7]],[5.2,"low",0.0,0.0,0.1605,0.0,0.1134,0.0,0.6556,40.51,26.2,0.1637,0.2003,15.02,13.98,[6,7]],[6.0,"low",0.0,0.0,0.1813,0.0,0.1316,0.0,0.6597,41.22,25.76,0.1649,0.2038,15.02,14.48,[6,7]],[6.8,"low",0.0,0.0,0.2017,0.0,0.1498,0.0,0.6636,41.93,25.33,0.1662,0.2073,15.02,14.98,[6,7]],[7.8,"low",0.0052,0.006,0.2218,0.0052,0.168,0.0,0.6674,42.64,24.92,0.1675,0.2107,15.02,15.48,[6]],[9.9,"low",0.0305,0.0349,0.2415,0.0305,0.1861,0.0,0.6712,43.36,24.51,0.1687,0.2142,15.02,15.98,[6]],[12.0,"low",0.0553,0.0632,0.2609,0.0553,0.2043,0.0,0.6749,44.07,24.12,0.1699,0.2176,15.02,16.48,[6]],[14.0,"low",0.0797,0.0908,0.28,0.0797,0.2225,0.0,0.6785,44.78,23.75,0.1712,0.2211,15.02,16.98,[6]],[16.0,"low",0.1038,0.1179,0.2989,0.1038,0.2407,0.0,0.682,45.49,23.38,0.1724,0.2245,15.02,17.48,[6]],[18.0,"low",0.1275,0.1444,0.3174,0.1275,0.2589,0.0,0.6855,46.2,23.03,0.1736,0.228,15.02,17.98,[6]],[20.0,"low",0.1508,0.1704,0.3357,0.1508,0.2771,0.0,0.6888,46.91,22.68,0.1747,0.2314,15.02,18.48,[6]],[21.9,"low",0.1738,0.1958,0.3536,0.1738,0.2952,0.0,0.6921,47.63,22.35,0.1759,0.2349,15.02,18.98,[6]],[23.8,"low",0.1965,0.2207,0.3714,0.1965,0.3134,0.0,0.6954,48.34,22.03,0.1771,0.2383,15.02,19.48,[6]],[25.7,"low",0.2188,0.2451,0.3888,0.2188,0.3316,0.0,0.6986,49.05,21.71,0.1783,0.2418,15.02,19.98,[6]],[27.6,"low",0.2408,0.269,0.4061,0.2408,0.3498,0.0,0.7017,49.76,21.41,0.1794,0.2453,15.02,20.48,[6]],[29.4,"low",0.2625,0.2925,0.423,0.2625,0.368,0.0,0.7047,50.48,21.11,0.1806,0.2487,15.02,20.98,[6]],[31.2,"low",0.2839,0.3154,0.4398,0.2839,0.3861,0.0,0.7077,51.19,20.82,0.1817,0.2522,15.02,21.48,[6]],[33.0,"low",0.305,0.338,0.4563,0.305,0.4043,0.0,0.7106,51.9,20.54,0.1828,0.2556,15.02,21.98,[6]],[34.8,"low",0.3259,0.3601,0.4726,0.3259,0.4225,0.0,0.7135,52.62,20.27,0.1839,0.2591,15.02,22.48,[6]],[36.6,"medium",0.3464,0.3817,0.4887,0.3464,0.4407,0.0,0.7163,53.33,20.0,0.185,0.2625,15.02,22.98,[]],[38.3,"medium",0.3667,0.403,0.5046,0.3667,0.4589,0.0,0.7191,54.04,19.74,0.1861,0.266,15.02,23.48,[]],[40.0,"medium",0.3867,0.4239,0.5202,0.3867,0.477,0.0,0.7218,54.76,19.49,0.1872,0.2694,15.02,23.98,[]],[41.7,"medium",0.4065,0.4443,0.5357,0.4065,0.4952,0.0,0.7245,55.47,19.24,0.1883,0.2729,15.02,24.48,[]],[43.4,"medium",0.426,0.4644,0.551,0.426,0.5134,0.0,0.7271,56.19,19.0,0.1894,0.2763,15.02,24.98,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4899,20.58,50.45,0.1216,0.1041,15.0,-0.0,[1,3]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.4984,21.28,48.82,0.1234,0.1075,15.0,0.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5067,21.98,47.29,0.1252,0.111,15.0,1.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5148,22.68,45.86,0.1269,0.1145,15.0,1.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5226,23.38,44.51,0.1287,0.1179,15.0,2.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5301,24.08,43.24,0.1304,0.1214,15.0,2.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5374,24.78,42.04,0.1321,0.1249,15.0,3.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5445,25.48,40.9,0.1337,0.1284,15.0,3.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5514,26.18,39.83,0.1353,0.1318,15.0,4.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5582,26.88,38.8,0.1369,0.1353,15.0,4.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5647,27.58,37.83,0.1385,0.1388,15.0,5.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.571,28.28,36.91,0.1401,0.1422,15.0,5.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5772,28.98,36.03,0.1416,0.1457,15.0,6.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5831,29.68,35.2,0.1432,0.1492,15.0,6.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.589,30.38,34.4,0.1447,0.1526,15.0,7.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5946,31.09,33.63,0.1461,0.1561,15.0,7.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6002,31.79,32.9,0.1476,0.1596,15.0,8.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6056,32.49,32.2,0.1491,0.163,15.0,8.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,33.2,31.53,0.1505,0.1665,15.0,9.0,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,33.9,30.89,0.1519,0.17,15.0,9.5,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,34.6,30.27,0.1533,0.1735,15.0,10.0,[6,7]],[0.1,"low",0.0,0.0,0.0096,0.0,0.0,0.0,0.6257,35.31,29.67,0.1547,0.1769,15.0,10.5,[6,7]],[0.7,"low",0.0,0.0,0.0331,0.0,0.0069,0.0,0.6305,36.01,29.1,0.1561,0.1804,15.0,11.0,[6,7]],[1.5,"low",0.0,0.0,0.0563,0.0,0.0251,0.0,0.6351,36.72,28.55,0.1574,0.1839,15.0,11.5,[6,7]],[2.3,"low",0.0,0.0,0.079,0.0,0.0434,0.0,0.6396,37.42,28.03,0.1588,0.1873,15.0,12.0,[6,7]],[3.1,"low",0.0,0.0,0.1012,0.0,0.0617,0.0,0.644,38.13,27.52,0.1601,0.1908,15.0,12.5,[6,7]],[3.8,"low",0.0,0.0,0.1231,0.0,0.0799,0.0,0.6483,38.83,27.02,0.1614,0.1943,15.0,13.0,[6,7]],[4.6,"low",0.0,0.0,0.1446,0.0,0.0982,0.0,0.6525,39.54,26.55,0.1627,0.1977,15.0,13.5,[6,7]],[5.4,"low",0.0,0.0,0.1657,0.0,0.1164,0.0,0.6567,40.24,26.09,0.164,0.2012,15.0,14.0,[6,7]],[6.2,"low",0.0,0.0,0.1865,0.0,0.1347,0.0,0.6607,40.95,25.65,0.1653,0.2047,15.0,14.5,[6,7]],[6.9,"low",0.0,0.0,0.2069,0.0,0.1529,0.0,0.6646,41.65,25.22,0.1665,0.2081,15.0,15.0,[6,7]],[8.3,"low",0.0119,0.0136,0.2269,0.0119,0.1712,0.0,0.6684,42.36,24.81,0.1678,0.2116,15.0,15.5,[6]],[10.4,"low",0.0371,0.0425,0.2467,0.0371,0.1895,0.0,0.6722,43.07,24.41,0.169,0.2151,15.0,16.0,[6]],[12.5,"low",0.0619,0.0707,0.2661,0.0619,0.2077,0.0,0.6759,43.77,24.02,0.1703,0.2185,15.0,16.5,[6]],[14.5,"low",0.0864,0.0983,0.2852,0.0864,0.226,0.0,0.6795,44.48,23.65,0.1715,0.222,15.0,17.0,[6]],[16.6,"low",0.1104,0.1254,0.3041,0.1104,0.2442,0.0,0.683,45.19,23.28,0.1727,0.2255,15.0,17.5,[6]],[18.5,"low",0.1341,0.1518,0.3226,0.1341,0.2625,0.0,0.6864,45.89,22.93,0.1739,0.229,15.0,18.0,[6]],[20.5,"low",0.1575,0.1777,0.3409,0.1575,0.2808,0.0,0.6898,46.6,22.59,0.1751,0.2324,15.0,18.5,[6]],[22.4,"low",0.1805,0.2031,0.3588,0.1805,0.299,0.0,0.6931,47.31,22.26,0.1763,0.2359,15.0,19.0,[6]],[24.4,"low",0.2031,0.228,0.3766,0.2031,0.3173,0.0,0.6963,48.01,21.93,0.1774,0.2394,15.0,19.5,[6]],[26.2,"low",0.2254,0.2523,0.394,0.2254,0.3355,0.0,0.6995,48.72,21.62,0.1786,0.2428,15.0,20.0,[6]],[28.1,"low",0.2475,0.2762,0.4113,0.2475,0.3538,0.0,0.7026,49.43,21.32,0.1798,0.2463,15.0,20.5,[6]],[29.9,"low",0.2692,0.2996,0.4282,0.2692,0.372,0.0,0.7057,50.14,21.02,0.1809,0.2498,15.0,21.0,[6]],[31.8,"low",0.2906,0.3225,0.445,0.2906,0.3903,0.0,0.7086,50.85,20.73,0.182,0.2532,15.0,21.5,[6]],[33.6,"low",0.3117,0.345,0.4615,0.3117,0.4086,0.0,0.7116,51.56,20.45,0.1832,0.2567,15.0,22.0,[6]],[35.3,"medium",0.3325,0.3671,0.4778,0.3325,0.4268,0.0,0.7144,52.26,20.18,0.1843,0.2602,15.0,22.5,[]],[37.1,"medium",0.3531,0.3887,0.4939,0.3531,0.4451,0.0,0.7173,52.97,19.91,0.1854,0.2636,15.0,23.0,[]],[38.8,"medium",0.3734,0.4099,0.5098,0.3734,0.4633,0.0,0.72,53.68,19.65,0.1865,0.2671,15.0,23.5,[]],[40.5,"medium",0.3934,0.4307,0.5254,0.3934,0.4816,0.0,0.7227,54.39,19.4,0.1876,0.2706,15.0,24.0,[]],[42.2,"medium",0.4132,0.4512,0.5409,0.4132,0.4998,0.0,0.7254,55.1,19.16,0.1887,0.2741,15.0,24.5,[]],[43.9,"medium",0.4327,0.4712,0.5562,0.4327,0.5181,0.0,0.728,55.81,18.92,0.1898,0.2775,15.0,25.0,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5068,18.59,47.29,0.1252,0.111,14.67,0.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5153,19.22,45.76,0.1271,0.1147,14.67,0.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,19.85,44.33,0.1289,0.1184,14.67,1.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5316,20.48,42.99,0.1307,0.1221,14.67,1.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,21.11,41.72,0.1325,0.1258,14.67,2.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5469,21.75,40.53,0.1343,0.1295,14.67,2.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,22.38,39.4,0.136,0.1332,14.67,3.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5613,23.01,38.34,0.1377,0.1369,14.67,3.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,23.64,37.33,0.1394,0.1406,14.67,4.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5748,24.28,36.37,0.141,0.1443,14.67,4.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,24.91,35.46,0.1427,0.148,14.67,5.33,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5875,25.54,34.6,0.1443,0.1517,14.67,5.83,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,26.18,33.77,0.1459,0.1554,14.67,6.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5995,26.81,32.99,0.1474,0.1591,14.67,6.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,27.44,32.24,0.149,0.1628,14.67,7.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6108,28.08,31.52,0.1505,0.1665,14.67,7.83,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6163,28.71,30.84,0.152,0.1702,14.67,8.33,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6216,29.35,30.18,0.1535,0.1739,14.67,8.83,[6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,29.98,29.55,0.155,0.1776,14.67,9.33,[6,7]],[0.6,"low",0.0,0.0,0.0396,0.0,0.0,0.0,0.6318,30.62,28.95,0.1564,0.1813,14.67,9.83,[6,7]],[1.2,"low",0.0,0.0,0.0641,0.0,0.0079,0.0,0.6367,31.25,28.37,0.1579,0.185,14.67,10.33,[6,7]],[2.0,"low",0.0,0.0,0.0881,0.0,0.0273,0.0,0.6414,31.89,27.81,0.1593,0.1887,14.67,10.83,[6,7]],[2.8,"low",0.0,0.0,0.1117,0.0,0.0468,0.0,0.6461,32.53,27.28,0.1607,0.1925,14.67,11.33,[6,7]],[3.7,"low",0.0,0.0,0.1348,0.0,0.0663,0.0,0.6506,33.16,26.77,0.1621,0.1962,14.67,11.83,[6,7]],[4.5,"low",0.0,0.0,0.1575,0.0,0.0858,0.0,0.6551,33.8,26.27,0.1635,0.1999,14.67,12.33,[6,7]],[5.3,"low",0.0,0.0,0.1798,0.0,0.1053,0.0,0.6594,34.44,25.79,0.1649,0.2036,14.67,12.83,[6,7]],[6.1,"low",0.0,0.0,0.2017,0.0,0.1247,0.0,0.6636,35.07,25.33,0.1662,0.2073,14.67,13.33,[6,7]],[7.3,"low",0.007,0.0081,0.2232,0.007,0.1442,0.0,0.6677,35.71,24.89,0.1675,0.211,14.67,13.83,[6]],[9.6,"low",0.034,0.039,0.2443,0.034,0.1637,0.0,0.6717,36.35,24.46,0.1689,0.2147,14.67,14.33,[6]],[11.8,"low",0.0606,0.0691,0.265,0.0606,0.1832,0.0,0.6757,36.98,24.04,0.1702,0.2184,14.67,14.83,[6]],[14.0,"low",0.0866,0.0986,0.2854,0.0866,0.2026,0.0,0.6795,37.62,23.64,0.1715,0.2221,14.67,15.33,[6]],[16.1,"low",0.1123,0.1274,0.3055,0.1123,0.2221,0.0,0.6832,38.26,23.25,0.1728,0.2258,14.67,15.83,[6]],[18.2,"low",0.1375,0.1556,0.3253,0.1375,0.2416,0.0,0.6869,38.9,22.88,0.1741,0.2295,14.67,16.33,[6]],[20.3,"low",0.1624,0.1832,0.3447,0.1624,0.2611,0.0,0.6905,39.54,22.52,0.1753,0.2332,14.67,16.83,[6]],[22.4,"low",0.1868,0.2101,0.3638,0.1868,0.2806,0.0,0.694,40.17,22.16,0.1766,0.2369,14.67,17.33,[6]],[24.4,"low",0.2109,0.2364,0.3826,0.2109,0.3,0.0,0.6974,40.81,21.82,0.1778,0.2406,14.67,17.83,[6]],[26.4,"low",0.2346,0.2622,0.4012,0.2346,0.3195,0.0,0.7008,41.45,21.49,0.1791,0.2443,14.67,18.33,[6]],[28.4,"low",0.2579,0.2875,0.4194,0.2579,0.339,0.0,0.7041,42.09,21.17,0.1803,0.248,14.67,18.83,[6]],[30.4,"low",0.2809,0.3122,0.4374,0.2809,0.3585,0.0,0.7073,42.73,20.86,0.1815,0.2517,14.67,19.33,[6]],[32.3,"low",0.3035,0.3364,0.4551,0.3035,0.378,0.0,0.7104,43.37,20.56,0.1827,0.2554,14.67,19.83,[6]],[34.2,"low",0.3259,0.3601,0.4726,0.3259,0.3974,0.0,0.7135,44.01,20.27,0.1839,0.2591,14.67,20.33,[6]],[36.0,"medium",0.3479,0.3833,0.4898,0.3479,0.4169,0.0,0.7165,44.65,19.98,0.1851,0.2628,14.67,20.83,[]],[37.9,"medium",0.3696,0.406,0.5068,0.3696,0.4364,0.0,0.7195,45.29,19.7,0.1863,0.2665,14.67,21.33,[]],[39.7,"medium",0.391,0.4283,0.5236,0.391,0.4559,0.0,0.7224,45.93,19.43,0.1875,0.2702,14.67,21.83,[]],[41.5,"medium",0.4121,0.4501,0.5401,0.4121,0.4754,0.0,0.7252,46.57,19.17,0.1886,0.2739,14.67,22.33,[]],[43.3,"medium",0.4329,0.4715,0.5564,0.4329,0.4948,0.0,0.728,47.21,18.91,0.1898,0.2776,14.67,22.83,[]],[45.1,"medium",0.4535,0.4925,0.5725,0.4535,0.5143,0.0,0.7308,47.85,18.67,0.1909,0.2813,14.67,23.33,[]],[46.8,"medium",0.4738,0.5131,0.5883,0.4738,0.5338,0.0,0.7334,48.49,18.42,0.1921,0.285,14.67,23.83,[]],[48.6,"medium",0.4938,0.5333,0.604,0.4938,0.5533,0.0,0.7361,49.13,18.19,0.1932,0.2887,14.67,24.33,[]],[50.3,"medium",0.5136,0.5531,0.6195,0.5136,0.5727,0.0,0.7386,49.77,17.96,0.1943,0.2924,14.67,24.83,[]],[52.0,"medium",0.5331,0.5725,0.6347,0.5331,0.5922,0.0,0.7412,50.41,17.73,0.1954,0.2961,14.67,25.33,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5236,16.8,44.33,0.1289,0.1184,14.34,0.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5322,17.37,42.9,0.1309,0.1224,14.34,1.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5404,17.94,41.56,0.1328,0.1263,14.34,1.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5484,18.51,40.3,0.1346,0.1303,14.34,2.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,19.08,39.11,0.1365,0.1342,14.34,2.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5636,19.65,38.0,0.1383,0.1382,14.34,3.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,20.22,36.94,0.14,0.1421,14.34,3.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5778,20.79,35.94,0.1418,0.1461,14.34,4.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,21.36,35.0,0.1435,0.15,14.34,4.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5912,21.93,34.1,0.1452,0.154,14.34,5.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,22.5,33.25,0.1469,0.1579,14.34,5.66,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6037,23.08,32.44,0.1486,0.1619,14.34,6.16,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6097,23.65,31.66,0.1502,0.1658,14.34,6.66,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6156,24.22,30.93,0.1518,0.1698,14.34,7.16,[6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6212,24.79,30.22,0.1534,0.1737,14.34,7.66,[6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,25.37,29.55,0.155,0.1776,14.34,8.16,[6,7]],[0.6,"low",0.0,0.0,0.0412,0.0,0.0,0.0,0.6321,25.94,28.91,0.1565,0.1816,14.34,8.66,[6,7]],[1.0,"low",0.0,0.0,0.0673,0.0,0.0,0.0,0.6373,26.51,28.3,0.1581,0.1855,14.34,9.16,[6,7]],[1.6,"low",0.0,0.0,0.0929,0.0,0.0068,0.0,0.6424,27.09,27.71,0.1596,0.1895,14.34,9.66,[6,7]],[2.5,"low",0.0,0.0,0.1179,0.0,0.0275,0.0,0.6473,27.66,27.14,0.1611,0.1934,14.34,10.16,[6,7]],[3.3,"low",0.0,0.0,0.1424,0.0,0.0483,0.0,0.6521,28.24,26.6,0.1626,0.1974,14.34,10.66,[6,7]],[4.2,"low",0.0,0.0,0.1665,0.0,0.0691,0.0,0.6568,28.81,26.08,0.164,0.2013,14.34,11.16,[6,7]],[5.1,"low",0.0,0.0,0.1901,0.0,0.0899,0.0,0.6614,29.39,25.57,0.1655,0.2053,14.34,11.66,[6,7]],[6.0,"low",0.0,0.0,0.2132,0.0,0.1106,0.0,0.6658,29.96,25.09,0.1669,0.2092,14.34,12.16,[6,7]],[8.1,"low",0.0233,0.0267,0.2359,0.0233,0.1314,0.0,0.6701,30.54,24.63,0.1683,0.2132,14.34,12.66,[6]],[10.5,"low",0.0518,0.0592,0.2582,0.0518,0.1522,0.0,0.6744,31.11,24.18,0.1698,0.2171,14.34,13.16,[6]],[12.8,"low",0.0797,0.0908,0.28,0.0797,0.173,0.0,0.6785,31.69,23.75,0.1712,0.2211,14.34,13.66,[6]],[15.1,"low",0.1072,0.1217,0.3015,0.1072,0.1938,0.0,0.6825,32.26,23.33,0.1725,0.225,14.34,14.16,[6]],[17.4,"low",0.1342,0.1519,0.3226,0.1342,0.2145,0.0,0.6864,32.84,22.93,0.1739,0.229,14.34,14.66,[6]],[19.6,"low",0.1607,0.1813,0.3434,0.1607,0.2353,0.0,0.6903,33.41,22.54,0.1753,0.2329,14.34,15.16,[6]],[21.8,"low",0.1868,0.2101,0.3638,0.1868,0.2561,0.0,0.694,33.99,22.16,0.1766,0.2369,14.34,15.66,[6]],[23.9,"low",0.2125,0.2382,0.3839,0.2125,0.2769,0.0,0.6977,34.57,21.8,0.1779,0.2408,14.34,16.16,[6]],[26.1,"low",0.2377,0.2656,0.4036,0.2377,0.2976,0.0,0.7012,35.14,21.45,0.1792,0.2448,14.34,16.66,[6]],[28.2,"low",0.2625,0.2925,0.423,0.2625,0.3184,0.0,0.7047,35.72,21.11,0.1806,0.2487,14.34,17.16,[6]],[30.3,"low",0.287,0.3187,0.4422,0.287,0.3392,0.0,0.7081,36.3,20.78,0.1818,0.2527,14.34,17.66,[6]],[32.3,"low",0.311,0.3443,0.461,0.311,0.36,0.0,0.7115,36.87,20.46,0.1831,0.2566,14.34,18.16,[6]],[34.3,"low",0.3347,0.3694,0.4795,0.3347,0.3807,0.0,0.7147,37.45,20.15,0.1844,0.2605,14.34,18.66,[6]],[36.3,"medium",0.3581,0.3939,0.4978,0.3581,0.4015,0.0,0.7179,38.03,19.85,0.1857,0.2645,14.34,19.16,[]],[38.3,"medium",0.381,0.4179,0.5158,0.381,0.4223,0.0,0.7211,38.6,19.56,0.1869,0.2684,14.34,19.66,[]],[40.2,"medium",0.4037,0.4414,0.5335,0.4037,0.4431,0.0,0.7241,39.18,19.27,0.1882,0.2724,14.34,20.16,[]],[42.1,"medium",0.426,0.4644,0.551,0.426,0.4639,0.0,0.7271,39.76,19.0,0.1894,0.2763,14.34,20.66,[]],[44.0,"medium",0.448,0.487,0.5682,0.448,0.4846,0.0,0.73,40.34,18.73,0.1906,0.2803,14.34,21.16,[]],[45.9,"medium",0.4698,0.509,0.5852,0.4698,0.5054,0.0,0.7329,40.91,18.47,0.1918,0.2842,14.34,21.66,[]],[47.7,"medium",0.4912,0.5306,0.6019,0.4912,0.5262,0.0,0.7357,41.49,18.22,0.193,0.2882,14.34,22.16,[]],[49.6,"medium",0.5123,0.5518,0.6184,0.5123,0.547,0.0,0.7385,42.07,17.97,0.1942,0.2921,14.34,22.66,[]],[51.4,"medium",0.5331,0.5725,0.6347,0.5331,0.5677,0.0,0.7412,42.65,17.73,0.1954,0.2961,14.34,23.16,[]],[53.1,"medium",0.5537,0.5929,0.6508,0.5537,0.5885,0.0,0.7438,43.23,17.5,0.1966,0.3,14.34,23.66,[]],[54.9,"medium",0.574,0.6128,0.6667,0.574,0.6093,0.0,0.7464,43.81,17.27,0.1978,0.304,14.34,24.16,[]],[56.6,"medium",0.594,0.6324,0.6824,0.594,0.6301,0.0,0.749,44.38,17.05,0.1989,0.3079,14.34,24.66,[]],[58.4,"medium",0.6137,0.6515,0.6978,0.6137,0.6509,0.0,0.7515,44.96,16.83,0.2001,0.3119,14.34,25.16,[]],[60.1,"medium",0.6333,0.6703,0.7131,0.6333,0.6716,0.0,0.7539,45.54,16.62,0.2012,0.3158,14.34,25.66,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5394,15.27,41.72,0.1325,0.1258,14.04,0.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5479,15.79,40.38,0.1345,0.13,14.04,1.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5561,16.3,39.11,0.1365,0.1342,14.04,1.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.564,16.82,37.93,0.1384,0.1384,14.04,2.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5717,17.34,36.81,0.1403,0.1426,14.04,2.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5791,17.86,35.76,0.1421,0.1468,14.04,3.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,18.38,34.77,0.144,0.151,14.04,3.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5932,18.9,33.83,0.1458,0.1552,14.04,4.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,19.42,32.94,0.1475,0.1594,14.04,4.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6064,19.94,32.09,0.1493,0.1636,14.04,5.46,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,20.46,31.29,0.151,0.1678,14.04,5.96,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6188,20.98,30.53,0.1527,0.172,14.04,6.46,[1,6,7]],[0.1,"low",0.0,0.0,0.0044,0.0,0.0,0.0,0.6247,21.5,29.8,0.1544,0.1762,14.04,6.96,[6,7]],[0.5,"low",0.0,0.0,0.0329,0.0,0.0,0.0,0.6304,22.02,29.11,0.156,0.1804,14.04,7.46,[6,7]],[0.9,"low",0.0,0.0,0.0608,0.0,0.0,0.0,0.636,22.54,28.45,0.1577,0.1846,14.04,7.96,[6,7]],[1.3,"low",0.0,0.0,0.0881,0.0,0.0,0.0,0.6414,23.06,27.81,0.1593,0.1887,14.04,8.46,[6,7]],[1.7,"low",0.0,0.0,0.1148,0.0,0.001,0.0,0.6467,23.58,27.21,0.1609,0.1929,14.04,8.96,[6,7]],[2.7,"low",0.0,0.0,0.1409,0.0,0.0231,0.0,0.6518,24.1,26.63,0.1625,0.1971,14.04,9.46,[6,7]],[3.6,"low",0.0,0.0,0.1665,0.0,0.0451,0.0,0.6568,24.62,26.08,0.164,0.2013,14.04,9.96,[6,7]],[4.6,"low",0.0,0.0,0.1915,0.0,0.0672,0.0,0.6616,25.15,25.54,0.1656,0.2055,14.04,10.46,[6,7]],[5.5,"low",0.0,0.0,0.216,0.0,0.0893,0.0,0.6664,25.67,25.03,0.1671,0.2097,14.04,10.96,[6,7]],[7.9,"low",0.0287,0.0329,0.2401,0.0287,0.1114,0.0,0.6709,26.19,24.54,0.1686,0.2139,14.04,11.46,[6]],[10.4,"low",0.0588,0.0672,0.2637,0.0588,0.1334,0.0,0.6754,26.71,24.07,0.1701,0.2181,14.04,11.96,[6]],[12.9,"low",0.0884,0.1006,0.2868,0.0884,0.1555,0.0,0.6798,27.24,23.62,0.1716,0.2223,14.04,12.46,[6]],[15.3,"low",0.1174,0.1331,0.3095,0.1174,0.1776,0.0,0.684,27.76,23.18,0.173,0.2265,14.04,12.96,[6]],[17.7,"low",0.1459,0.1649,0.3318,0.1459,0.1997,0.0,0.6881,28.28,22.76,0.1745,0.2307,14.04,13.46,[6]],[20.1,"low",0.1738,0.1958,0.3536,0.1738,0.2217,0.0,0.6921,28.8,22.35,0.1759,0.2349,14.04,13.96,[6]],[22.4,"low",0.2013,0.226,0.3751,0.2013,0.2438,0.0,0.6961,29.33,21.96,0.1773,0.2391,14.04,14.46,[6]],[24.7,"low",0.2283,0.2554,0.3963,0.2283,0.2659,0.0,0.6999,29.85,21.58,0.1788,0.2433,14.04,14.96,[6]],[26.9,"low",0.2548,0.2841,0.417,0.2548,0.288,0.0,0.7036,30.37,21.21,0.1801,0.2475,14.04,15.46,[6]],[29.1,"low",0.2809,0.3122,0.4374,0.2809,0.3101,0.0,0.7073,30.9,20.86,0.1815,0.2517,14.04,15.96,[6]],[31.3,"low",0.3065,0.3396,0.4575,0.3065,0.3321,0.0,0.7109,31.42,20.52,0.1829,0.2559,14.04,16.46,[6]],[33.5,"low",0.3318,0.3663,0.4772,0.3318,0.3542,0.0,0.7143,31.95,20.19,0.1842,0.2601,14.04,16.96,[6]],[35.6,"medium",0.3566,0.3924,0.4967,0.3566,0.3763,0.0,0.7177,32.47,19.87,0.1856,0.2642,14.04,17.46,[]],[37.7,"medium",0.381,0.4179,0.5158,0.381,0.3984,0.0,0.7211,32.99,19.56,0.1869,0.2684,14.04,17.96,[]],[39.7,"medium",0.4051,0.4429,0.5346,0.4051,0.4204,0.0,0.7243,33.52,19.26,0.1882,0.2726,14.04,18.46,[]],[41.8,"medium",0.4288,0.4673,0.5531,0.4288,0.4425,0.0,0.7275,34.04,18.96,0.1896,0.2768,14.04,18.96,[]],[43.8,"medium",0.4521,0.4911,0.5714,0.4521,0.4646,0.0,0.7306,34.57,18.68,0.1909,0.281,14.04,19.46,[]],[45.7,"medium",0.4751,0.5145,0.5894,0.4751,0.4867,0.0,0.7336,35.09,18.41,0.1921,0.2852,14.04,19.96,[]],[47.7,"medium",0.4978,0.5373,0.6071,0.4978,0.5087,0.0,0.7366,35.62,18.14,0.1934,0.2894,14.04,20.46,[]],[49.6,"medium",0.5201,0.5596,0.6246,0.5201,0.5308,0.0,0.7395,36.14,17.88,0.1947,0.2936,14.04,20.96,[]],[51.5,"medium",0.5421,0.5815,0.6418,0.5421,0.5529,0.0,0.7423,36.67,17.63,0.1959,0.2978,14.04,21.46,[]],[53.4,"medium",0.5638,0.6029,0.6588,0.5638,0.575,0.0,0.7451,37.19,17.38,0.1972,0.302,14.04,21.96,[]],[55.3,"medium",0.5852,0.6238,0.6755,0.5852,0.597,0.0,0.7479,37.72,17.15,0.1984,0.3062,14.04,22.46,[]],[57.1,"medium",0.6064,0.6444,0.692,0.6064,0.6191,0.0,0.7505,38.24,16.91,0.1997,0.3104,14.04,22.96,[]],[58.9,"medium",0.6272,0.6645,0.7083,0.6272,0.6412,0.0,0.7531,38.77,16.69,0.2009,0.3146,14.04,23.46,[]],[60.7,"medium",0.6477,0.6842,0.7244,0.6477,0.6633,0.0,0.7557,39.29,16.47,0.2021,0.3188,14.04,23.96,[]],[62.5,"medium",0.668,0.7035,0.7403,0.668,0.6853,0.0,0.7582,39.82,16.26,0.2033,0.323,14.04,24.46,[]],[64.3,"medium",0.6881,0.7224,0.756,0.6881,0.7074,0.0,0.7607,40.35,16.05,0.2045,0.3272,14.04,24.96,[]],[66.0,"critical",0.7078,0.741,0.7714,0.7078,0.7295,0.0,0.7631,40.87,15.84,0.2057,0.3314,14.04,25.46,[]],[67.8,"critical",0.7274,0.7592,0.7867,0.7274,0.7516,0.0,0.7655,41.4,15.65,0.2069,0.3356,14.04,25.96,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5542,13.96,39.4,0.136,0.1332,13.76,1.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5626,14.43,38.13,0.138,0.1377,13.76,1.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5708,14.9,36.94,0.14,0.1421,13.76,2.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5787,15.38,35.82,0.142,0.1466,13.76,2.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5862,15.85,34.77,0.144,0.151,13.76,3.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5936,16.32,33.78,0.1459,0.1554,13.76,3.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6007,16.8,32.84,0.1477,0.1599,13.76,4.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6075,17.27,31.95,0.1496,0.1643,13.76,4.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,17.75,31.11,0.1514,0.1688,13.76,5.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6205,18.22,30.31,0.1532,0.1732,13.76,5.74,[1,6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,18.7,29.55,0.155,0.1776,13.76,6.24,[1,6,7]],[0.7,"low",0.0,0.0,0.0445,0.0,0.0,0.0,0.6328,19.17,28.83,0.1567,0.1821,13.76,6.74,[1,6,7]],[1.1,"low",0.0,0.0,0.0738,0.0,0.0,0.0,0.6386,19.65,28.15,0.1584,0.1865,13.76,7.24,[6,7]],[1.5,"low",0.0,0.0,0.1023,0.0,0.0,0.0,0.6442,20.13,27.49,0.1601,0.191,13.76,7.74,[6,7]],[2.0,"low",0.0,0.0,0.1302,0.0,0.0,0.0,0.6497,20.6,26.87,0.1618,0.1954,13.76,8.24,[6,7]],[2.7,"low",0.0,0.0,0.1575,0.0,0.0139,0.0,0.6551,21.08,26.27,0.1635,0.1999,13.76,8.74,[6,7]],[3.7,"low",0.0,0.0,0.1842,0.0,0.0373,0.0,0.6602,21.55,25.7,0.1651,0.2043,13.76,9.24,[6,7]],[4.7,"low",0.0,0.0,0.2103,0.0,0.0606,0.0,0.6653,22.03,25.15,0.1667,0.2087,13.76,9.74,[6,7]],[6.9,"low",0.0233,0.0267,0.2359,0.0233,0.084,0.0,0.6701,22.51,24.63,0.1683,0.2132,13.76,10.24,[6]],[9.6,"low",0.0553,0.0632,0.2609,0.0553,0.1074,0.0,0.6749,22.98,24.12,0.1699,0.2176,13.76,10.74,[6]],[12.2,"low",0.0866,0.0986,0.2854,0.0866,0.1308,0.0,0.6795,23.46,23.64,0.1715,0.2221,13.76,11.24,[6]],[14.8,"low",0.1174,0.1331,0.3095,0.1174,0.1541,0.0,0.684,23.94,23.18,0.173,0.2265,13.76,11.74,[6]],[17.3,"low",0.1475,0.1667,0.3331,0.1475,0.1775,0.0,0.6884,24.42,22.73,0.1746,0.2309,13.76,12.24,[6]],[19.8,"low",0.1771,0.1994,0.3562,0.1771,0.2009,0.0,0.6926,24.89,22.3,0.1761,0.2354,13.76,12.74,[6]],[22.2,"low",0.2061,0.2312,0.3789,0.2061,0.2243,0.0,0.6968,25.37,21.89,0.1776,0.2398,13.76,13.24,[6]],[24.6,"low",0.2346,0.2622,0.4012,0.2346,0.2476,0.0,0.7008,25.85,21.49,0.1791,0.2443,13.76,13.74,[6]],[27.0,"low",0.2625,0.2925,0.423,0.2625,0.271,0.0,0.7047,26.33,21.11,0.1806,0.2487,13.76,14.24,[6]],[29.3,"low",0.29,0.3219,0.4445,0.29,0.2944,0.0,0.7086,26.81,20.74,0.182,0.2531,13.76,14.74,[6]],[31.6,"low",0.317,0.3506,0.4657,0.317,0.3178,0.0,0.7123,27.28,20.38,0.1835,0.2576,13.76,15.24,[6]],[33.9,"low",0.3435,0.3787,0.4864,0.3435,0.3411,0.0,0.7159,27.76,20.04,0.1849,0.262,13.76,15.74,[6]],[36.1,"medium",0.3696,0.406,0.5068,0.3696,0.3645,0.0,0.7195,28.24,19.7,0.1863,0.2665,13.76,16.24,[]],[38.3,"medium",0.3952,0.4327,0.5269,0.3952,0.3879,0.0,0.723,28.72,19.38,0.1877,0.2709,13.76,16.74,[]],[40.5,"medium",0.4205,0.4587,0.5466,0.4205,0.4113,0.0,0.7264,29.2,19.07,0.1891,0.2754,13.76,17.24,[]],[42.6,"medium",0.4453,0.4842,0.566,0.4453,0.4346,0.0,0.7297,29.68,18.76,0.1905,0.2798,13.76,17.74,[]],[44.7,"medium",0.4698,0.509,0.5852,0.4698,0.458,0.0,0.7329,30.16,18.47,0.1918,0.2842,13.76,18.24,[]],[46.8,"medium",0.4938,0.5333,0.604,0.4938,0.4814,0.0,0.7361,30.64,18.19,0.1932,0.2887,13.76,18.74,[]],[48.8,"medium",0.5175,0.557,0.6225,0.5175,0.5048,0.0,0.7392,31.12,17.91,0.1945,0.2931,13.76,19.24,[]],[50.8,"medium",0.5408,0.5802,0.6408,0.5408,0.5281,0.0,0.7422,31.6,17.64,0.1959,0.2976,13.76,19.74,[]],[52.8,"medium",0.5638,0.6029,0.6588,0.5638,0.5515,0.0,0.7451,32.07,17.38,0.1972,0.302,13.76,20.24,[]],[54.8,"medium",0.5865,0.6251,0.6765,0.5865,0.5749,0.0,0.748,32.55,17.13,0.1985,0.3064,13.76,20.74,[]],[56.8,"medium",0.6088,0.6468,0.694,0.6088,0.5983,0.0,0.7508,33.03,16.89,0.1998,0.3109,13.76,21.24,[]],[58.7,"medium",0.6308,0.668,0.7112,0.6308,0.6216,0.0,0.7536,33.51,16.65,0.2011,0.3153,13.76,21.74,[]],[60.6,"medium",0.6525,0.6888,0.7282,0.6525,0.645,0.0,0.7563,33.99,16.42,0.2024,0.3198,13.76,22.24,[]],[62.5,"medium",0.674,0.7091,0.7449,0.674,0.6684,0.0,0.7589,34.47,16.19,0.2036,0.3242,13.76,22.74,[]],[64.3,"medium",0.6951,0.729,0.7614,0.6951,0.6918,0.0,0.7615,34.96,15.97,0.2049,0.3286,13.76,23.24,[]],[66.2,"critical",0.7159,0.7485,0.7777,0.7159,0.7151,0.0,0.7641,35.44,15.76,0.2062,0.3331,13.76,23.74,[]],[68.0,"critical",0.7365,0.7676,0.7938,0.7365,0.7385,0.0,0.7666,35.92,15.55,0.2074,0.3375,13.76,24.24,[]],[69.8,"critical",0.7567,0.7863,0.8097,0.7567,0.7619,0.0,0.769,36.4,15.35,0.2086,0.342,13.76,24.74,[]],[71.6,"critical",0.7768,0.8047,0.8254,0.7768,0.7853,0.0,0.7714,36.88,15.16,0.2099,0.3464,13.76,25.24,[]],[73.3,"critical",0.7965,0.8226,0.8408,0.7965,0.8086,0.0,0.7737,37.36,14.96,0.2111,0.3509,13.76,25.74,[]],[75.1,"critical",0.8161,0.8403,0.8561,0.8161,0.832,0.0,0.776,37.84,14.78,0.2123,0.3553,13.76,26.24,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5681,12.82,37.33,0.1394,0.1406,13.5,1.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5765,13.25,36.13,0.1415,0.1453,13.5,2.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5846,13.69,35.0,0.1435,0.15,13.5,2.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5924,14.12,33.94,0.1455,0.1547,13.5,3.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5999,14.56,32.94,0.1475,0.1594,13.5,3.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6071,14.99,32.0,0.1495,0.1641,13.5,4.0,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6141,15.43,31.11,0.1514,0.1688,13.5,4.5,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6209,15.86,30.27,0.1533,0.1735,13.5,5.0,[1,6,7]],[0.3,"low",0.0,0.0,0.0179,0.0,0.0,0.0,0.6274,16.3,29.47,0.1552,0.1781,13.5,5.5,[1,6,7]],[0.7,"low",0.0,0.0,0.0494,0.0,0.0,0.0,0.6337,16.74,28.72,0.157,0.1828,13.5,6.0,[1,6,7]],[1.2,"low",0.0,0.0,0.0802,0.0,0.0,0.0,0.6399,17.17,28.0,0.1588,0.1875,13.5,6.5,[1,6,7]],[1.7,"low",0.0,0.0,0.1101,0.0,0.0,0.0,0.6458,17.61,27.31,0.1606,0.1922,13.5,7.0,[1,6,7]],[2.1,"low",0.0,0.0,0.1394,0.0,0.0,0.0,0.6515,18.05,26.66,0.1624,0.1969,13.5,7.5,[6,7]],[2.5,"low",0.0,0.0,0.168,0.0,0.0,0.0,0.6571,18.48,26.04,0.1641,0.2016,13.5,8.0,[6,7]],[3.6,"low",0.0,0.0,0.1959,0.0,0.0246,0.0,0.6625,18.92,25.45,0.1658,0.2063,13.5,8.5,[6,7]],[5.0,"low",0.007,0.0081,0.2232,0.007,0.0493,0.0,0.6677,19.36,24.89,0.1675,0.211,13.5,9.0,[6]],[7.8,"low",0.0412,0.0471,0.2499,0.0412,0.074,0.0,0.6728,19.8,24.35,0.1692,0.2156,13.5,9.5,[6]],[10.6,"low",0.0745,0.085,0.276,0.0745,0.0987,0.0,0.6777,20.23,23.83,0.1709,0.2203,13.5,10.0,[6]],[13.3,"low",0.1072,0.1217,0.3015,0.1072,0.1233,0.0,0.6825,20.67,23.33,0.1725,0.225,13.5,10.5,[6]],[16.0,"low",0.1392,0.1575,0.3266,0.1392,0.148,0.0,0.6872,21.11,22.86,0.1742,0.2297,13.5,11.0,[6]],[18.7,"low",0.1706,0.1922,0.3511,0.1706,0.1727,0.0,0.6917,21.55,22.4,0.1758,0.2344,13.5,11.5,[6]],[21.2,"low",0.2013,0.226,0.3751,0.2013,0.1974,0.0,0.6961,21.99,21.96,0.1773,0.2391,13.5,12.0,[6]],[23.8,"low",0.2314,0.2588,0.3987,0.2314,0.222,0.0,0.7003,22.43,21.54,0.1789,0.2438,13.5,12.5,[6]],[26.3,"low",0.261,0.2908,0.4218,0.261,0.2467,0.0,0.7045,22.86,21.13,0.1805,0.2485,13.5,13.0,[6]],[28.7,"low",0.29,0.3219,0.4445,0.29,0.2714,0.0,0.7086,23.3,20.74,0.182,0.2531,13.5,13.5,[6]],[31.2,"low",0.3185,0.3522,0.4668,0.3185,0.2961,0.0,0.7125,23.74,20.36,0.1835,0.2578,13.5,14.0,[6]],[33.6,"low",0.3464,0.3817,0.4887,0.3464,0.3207,0.0,0.7163,24.18,20.0,0.185,0.2625,13.5,14.5,[6]],[35.9,"medium",0.3739,0.4105,0.5102,0.3739,0.3454,0.0,0.7201,24.62,19.65,0.1865,0.2672,13.5,15.0,[]],[38.2,"medium",0.4009,0.4385,0.5313,0.4009,0.3701,0.0,0.7237,25.06,19.31,0.188,0.2719,13.5,15.5,[]],[40.5,"medium",0.4274,0.4659,0.552,0.4274,0.3947,0.0,0.7273,25.5,18.98,0.1895,0.2766,13.5,16.0,[]],[42.7,"medium",0.4535,0.4925,0.5725,0.4535,0.4194,0.0,0.7308,25.94,18.67,0.1909,0.2813,13.5,16.5,[]],[44.9,"medium",0.4792,0.5185,0.5925,0.4792,0.4441,0.0,0.7341,26.38,18.36,0.1924,0.286,13.5,17.0,[]],[47.1,"medium",0.5044,0.5439,0.6123,0.5044,0.4688,0.0,0.7375,26.82,18.06,0.1938,0.2906,13.5,17.5,[]],[49.3,"medium",0.5292,0.5687,0.6317,0.5292,0.4934,0.0,0.7407,27.26,17.78,0.1952,0.2953,13.5,18.0,[]],[51.4,"medium",0.5537,0.5929,0.6508,0.5537,0.5181,0.0,0.7438,27.7,17.5,0.1966,0.3,13.5,18.5,[]],[53.5,"medium",0.5777,0.6165,0.6696,0.5777,0.5428,0.0,0.7469,28.14,17.23,0.198,0.3047,13.5,19.0,[]],[55.5,"medium",0.6014,0.6396,0.6882,0.6014,0.5675,0.0,0.7499,28.58,16.97,0.1994,0.3094,13.5,19.5,[]],[57.6,"medium",0.6248,0.6621,0.7064,0.6248,0.5921,0.0,0.7528,29.02,16.72,0.2007,0.3141,13.5,20.0,[]],[59.6,"medium",0.6477,0.6842,0.7244,0.6477,0.6168,0.0,0.7557,29.46,16.47,0.2021,0.3188,13.5,20.5,[]],[61.6,"medium",0.6704,0.7057,0.7421,0.6704,0.6415,0.0,0.7585,29.9,16.23,0.2034,0.3235,13.5,21.0,[]],[63.5,"medium",0.6927,0.7268,0.7596,0.6927,0.6661,0.0,0.7613,30.34,16.0,0.2048,0.3282,13.5,21.5,[]],[65.5,"critical",0.7147,0.7474,0.7768,0.7147,0.6908,0.0,0.7639,30.78,15.77,0.2061,0.3328,13.5,22.0,[]],[67.4,"critical",0.7365,0.7676,0.7938,0.7365,0.7155,0.0,0.7666,31.22,15.55,0.2074,0.3375,13.5,22.5,[]],[69.3,"critical",0.7579,0.7874,0.8106,0.7579,0.7402,0.0,0.7691,31.66,15.34,0.2087,0.3422,13.5,23.0,[]],[71.2,"critical",0.779,0.8067,0.8271,0.779,0.7648,0.0,0.7716,32.11,15.13,0.21,0.3469,13.5,23.5,[]],[73.0,"critical",0.7998,0.8256,0.8434,0.7998,0.7895,0.0,0.7741,32.55,14.93,0.2113,0.3516,13.5,24.0,[]],[74.9,"critical",0.8204,0.8441,0.8595,0.8204,0.8142,0.0,0.7765,32.99,14.74,0.2126,0.3563,13.5,24.5,[]],[76.7,"critical",0.8407,0.8623,0.8753,0.8407,0.8389,0.0,0.7789,33.43,14.54,0.2138,0.361,13.5,25.0,[]],[78.5,"critical",0.8607,0.88,0.891,0.8607,0.8635,0.0,0.7812,33.87,14.36,0.2151,0.3657,13.5,25.5,[]],[80.2,"critical",0.8804,0.8975,0.9065,0.8804,0.8882,0.0,0.7835,34.31,14.18,0.2163,0.3703,13.5,26.0,[]],[82.0,"critical",0.9,0.9145,0.9217,0.9,0.9129,0.0,0.7857,34.75,14.0,0.2176,0.375,13.5,26.5,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5812,11.82,35.46,0.1427,0.148,13.26,1.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5895,12.22,34.32,0.1448,0.153,13.26,2.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5975,12.63,33.25,0.1469,0.1579,13.26,2.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6052,13.03,32.24,0.149,0.1628,13.26,3.24,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6127,13.43,31.29,0.151,0.1678,13.26,3.74,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6198,13.83,30.4,0.153,0.1727,13.26,4.24,[1,6,7]],[0.2,"low",0.0,0.0,0.0145,0.0,0.0,0.0,0.6267,14.23,29.55,0.155,0.1776,13.26,4.74,[1,6,7]],[0.7,"low",0.0,0.0,0.0478,0.0,0.0,0.0,0.6334,14.63,28.75,0.1569,0.1826,13.26,5.24,[1,6,7]],[1.2,"low",0.0,0.0,0.0802,0.0,0.0,0.0,0.6399,15.04,28.0,0.1588,0.1875,13.26,5.74,[1,6,7]],[1.7,"low",0.0,0.0,0.1117,0.0,0.0,0.0,0.6461,15.44,27.28,0.1607,0.1925,13.26,6.24,[1,6,7]],[2.1,"low",0.0,0.0,0.1424,0.0,0.0,0.0,0.6521,15.84,26.6,0.1626,0.1974,13.26,6.74,[1,6,7]],[2.6,"low",0.0,0.0,0.1724,0.0,0.0,0.0,0.658,16.25,25.95,0.1644,0.2023,13.26,7.24,[1,6,7]],[3.2,"low",0.0,0.0,0.2017,0.0,0.0073,0.0,0.6636,16.65,25.33,0.1662,0.2073,13.26,7.74,[6,7]],[5.1,"low",0.0161,0.0185,0.2303,0.0161,0.0332,0.0,0.6691,17.05,24.74,0.168,0.2122,13.26,8.24,[6]],[8.1,"low",0.0518,0.0592,0.2582,0.0518,0.0592,0.0,0.6744,17.45,24.18,0.1698,0.2171,13.26,8.74,[6]],[11.0,"low",0.0866,0.0986,0.2854,0.0866,0.0852,0.0,0.6795,17.86,23.64,0.1715,0.2221,13.26,9.24,[6]],[13.9,"low",0.1208,0.1369,0.3121,0.1208,0.1111,0.0,0.6845,18.26,23.13,0.1732,0.227,13.26,9.74,[6]],[16.7,"low",0.1541,0.174,0.3382,0.1541,0.1371,0.0,0.6893,18.67,22.64,0.1749,0.2319,13.26,10.24,[6]],[19.5,"low",0.1868,0.2101,0.3638,0.1868,0.1631,0.0,0.694,19.07,22.16,0.1766,0.2369,13.26,10.74,[6]],[22.2,"low",0.2188,0.2451,0.3888,0.2188,0.1891,0.0,0.6986,19.47,21.71,0.1783,0.2418,13.26,11.24,[6]],[24.8,"low",0.2502,0.2791,0.4134,0.2502,0.215,0.0,0.703,19.88,21.28,0.1799,0.2467,13.26,11.74,[6]],[27.4,"low",0.2809,0.3122,0.4374,0.2809,0.241,0.0,0.7073,20.28,20.86,0.1815,0.2517,13.26,12.24,[6]],[30.0,"low",0.311,0.3443,0.461,0.311,0.267,0.0,0.7115,20.69,20.46,0.1831,0.2566,13.26,12.74,[6]],[32.5,"low",0.3406,0.3756,0.4841,0.3406,0.2929,0.0,0.7155,21.09,20.07,0.1847,0.2615,13.26,13.24,[6]],[35.0,"medium",0.3696,0.406,0.5068,0.3696,0.3189,0.0,0.7195,21.5,19.7,0.1863,0.2665,13.26,13.74,[]],[37.4,"medium",0.3981,0.4356,0.5291,0.3981,0.3449,0.0,0.7234,21.9,19.34,0.1879,0.2714,13.26,14.24,[]],[39.8,"medium",0.426,0.4644,0.551,0.426,0.3709,0.0,0.7271,22.31,19.0,0.1894,0.2763,13.26,14.74,[]],[42.2,"medium",0.4535,0.4925,0.5725,0.4535,0.3968,0.0,0.7308,22.71,18.67,0.1909,0.2813,13.26,15.24,[]],[44.5,"medium",0.4805,0.5199,0.5936,0.4805,0.4228,0.0,0.7343,23.12,18.34,0.1924,0.2862,13.26,15.74,[]],[46.8,"medium",0.507,0.5465,0.6143,0.507,0.4488,0.0,0.7378,23.52,18.03,0.1939,0.2911,13.26,16.24,[]],[49.0,"medium",0.5331,0.5725,0.6347,0.5331,0.4747,0.0,0.7412,23.93,17.73,0.1954,0.2961,13.26,16.74,[]],[51.3,"medium",0.5588,0.5979,0.6548,0.5588,0.5007,0.0,0.7445,24.33,17.44,0.1969,0.301,13.26,17.24,[]],[53.4,"medium",0.584,0.6226,0.6745,0.584,0.5267,0.0,0.7477,24.74,17.16,0.1984,0.3059,13.26,17.74,[]],[55.6,"medium",0.6088,0.6468,0.694,0.6088,0.5527,0.0,0.7508,25.15,16.89,0.1998,0.3109,13.26,18.24,[]],[57.8,"medium",0.6333,0.6703,0.7131,0.6333,0.5786,0.0,0.7539,25.55,16.62,0.2012,0.3158,13.26,18.74,[]],[59.9,"medium",0.6573,0.6933,0.7319,0.6573,0.6046,0.0,0.7569,25.96,16.37,0.2027,0.3208,13.26,19.24,[]],[61.9,"medium",0.681,0.7158,0.7505,0.681,0.6306,0.0,0.7598,26.36,16.12,0.2041,0.3257,13.26,19.74,[]],[64.0,"medium",0.7044,0.7377,0.7687,0.7044,0.6565,0.0,0.7627,26.77,15.88,0.2055,0.3306,13.26,20.24,[]],[66.0,"critical",0.7274,0.7592,0.7867,0.7274,0.6825,0.0,0.7655,27.18,15.65,0.2069,0.3356,13.26,20.74,[]],[68.0,"critical",0.75,0.7801,0.8044,0.75,0.7085,0.0,0.7682,27.58,15.42,0.2082,0.3405,13.26,21.24,[]],[70.0,"critical",0.7723,0.8006,0.8219,0.7723,0.7345,0.0,0.7709,27.99,15.2,0.2096,0.3454,13.26,21.74,[]],[72.0,"critical",0.7944,0.8207,0.8391,0.7944,0.7604,0.0,0.7735,28.4,14.98,0.2109,0.3504,13.26,22.24,[]],[73.9,"critical",0.8161,0.8403,0.8561,0.8161,0.7864,0.0,0.776,28.8,14.78,0.2123,0.3553,13.26,22.74,[]],[75.8,"critical",0.8375,0.8594,0.8728,0.8375,0.8124,0.0,0.7785,29.21,14.57,0.2136,0.3602,13.26,23.24,[]],[77.7,"critical",0.8586,0.8782,0.8894,0.8586,0.8383,0.0,0.781,29.62,14.38,0.2149,0.3652,13.26,23.74,[]],[79.6,"critical",0.8794,0.8966,0.9057,0.8794,0.8643,0.0,0.7833,30.02,14.19,0.2163,0.3701,13.26,24.24,[]],[81.4,"critical",0.9,0.9145,0.9217,0.9,0.8903,0.0,0.7857,30.43,14.0,0.2176,0.375,13.26,24.74,[]],[83.3,"critical",0.9203,0.9321,0.9376,0.9203,0.9163,0.0,0.788,30.84,13.82,0.2189,0.38,13.26,25.24,[]],[85.1,"critical",0.9403,0.9494,0.9533,0.9403,0.9422,0.0,0.7902,31.25,13.64,0.2201,0.3849,13.26,25.74,[]],[86.9,"critical",0.9601,0.9663,0.9687,0.9601,0.9682,0.0,0.7924,31.65,13.47,0.2214,0.3898,13.26,26.24,[]],[88.7,"critical",0.9796,0.9828,0.984,0.9796,0.9942,0.0,0.7946,32.06,13.3,0.2227,0.3948,13.26,26.74,[]]],[[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5845,11.59,35.01,0.1435,0.15,13.2,1.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.5928,11.98,33.88,0.1457,0.155,13.2,2.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6008,12.37,32.82,0.1478,0.16,13.2,2.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6085,12.77,31.83,0.1498,0.165,13.2,3.3,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.6159,13.16,30.89,0.1519,0.17,13.2,3.8,[1,6,7]],[0.0,"low",0.0,0.0,0.0,0.0,0.0,0.0,0.623,13.55,30.01,0.1539,0.175,13.2,4.3,[1,6,7]],[0.5,"low",0.0,0.0,0.0302,0.0,0.0,0.0,0.6299,13.95,29.17,0.1559,0.18,13.2,4.8,[1,6,7]],[1.0,"low",0.0,0.0,0.0635,0.0,0.0,0.0,0.6365,14.34,28.39,0.1578,0.185,13.2,5.3,[1,6,7]],[1.4,"low",0.0,0.0,0.0958,0.0,0.0,0.0,0.643,14.73,27.64,0.1598,0.19,13.2,5.8,[1,6,7]],[1.9,"low",0.0,0.0,0.1274,0.0,0.0,0.0,0.6492,15.13,26.93,0.1617,0.195,13.2,6.3,[1,6,7]],[2.4,"low",0.0,0.0,0.1581,0.0,0.0,0.0,0.6552,15.52,26.26,0.1635,0.2,13.2,6.8,[1,6,7]],[2.8,"low",0.0,0.0,0.1881,0.0,0.0,0.0,0.661,15.92,25.62,0.1654,0.2049,13.2,7.3,[1,6,7]],[3.7,"low",0.0,0.0,0.2174,0.0,0.0156,0.0,0.6666,16.31,25.01,0.1672,0.2099,13.2,7.8,[6,7]],[6.7,"low",0.0361,0.0414,0.2459,0.0361,0.0419,0.0,0.672,16.71,24.42,0.169,0.2149,13.2,8.3,[6]],[9.7,"low",0.0718,0.0819,0.2738,0.0718,0.0682,0.0,0.6773,17.1,23.87,0.1708,0.2199,13.2,8.8,[6]],[12.6,"low",0.1067,0.1212,0.3011,0.1067,0.0946,0.0,0.6824,17.5,23.34,0.1725,0.2249,13.2,9.3,[6]],[15.4,"low",0.1408,0.1592,0.3278,0.1408,0.1209,0.0,0.6874,17.89,22.83,0.1742,0.2299,13.2,9.8,[6]],[18.2,"low",0.1742,0.1962,0.3539,0.1742,0.1472,0.0,0.6922,18.29,22.35,0.1759,0.2349,13.2,10.3,[6]],[21.0,"low",0.2068,0.2321,0.3795,0.2068,0.1735,0.0,0.6969,18.69,21.88,0.1776,0.2399,13.2,10.8,[6]],[23.7,"low",0.2388,0.2669,0.4045,0.2388,0.1998,0.0,0.7014,19.08,21.43,0.1793,0.2449,13.2,11.3,[6]],[26.4,"low",0.2702,0.3007,0.4291,0.2702,0.2261,0.0,0.7058,19.48,21.01,0.181,0.2499,13.2,11.8,[6]],[29.0,"low",0.3009,0.3336,0.4531,0.3009,0.2524,0.0,0.7101,19.87,20.59,0.1826,0.2549,13.2,12.3,[6]],[31.5,"low",0.3311,0.3655,0.4767,0.3311,0.2787,0.0,0.7142,20.27,20.2,0.1842,0.2599,13.2,12.8,[6]],[34.1,"low",0.3606,0.3966,0.4998,0.3606,0.305,0.0,0.7183,20.67,19.82,0.1858,0.2649,13.2,13.3,[6]],[36.5,"medium",0.3896,0.4269,0.5225,0.3896,0.3313,0.0,0.7222,21.06,19.45,0.1874,0.2699,13.2,13.8,[]],[39.0,"medium",0.4181,0.4563,0.5448,0.4181,0.3576,0.0,0.726,21.46,19.1,0.189,0.2749,13.2,14.3,[]],[41.4,"medium",0.4461,0.485,0.5666,0.4461,0.384,0.0,0.7298,21.86,18.75,0.1905,0.2799,13.2,14.8,[]],[43.7,"medium",0.4735,0.5129,0.5881,0.4735,0.4103,0.0,0.7334,22.25,18.43,0.192,0.2849,13.2,15.3,[]],[46.1,"medium",0.5005,0.54,0.6093,0.5005,0.4366,0.0,0.7369,22.65,18.11,0.1936,0.2899,13.2,15.8,[]],[48.4,"medium",0.5271,0.5665,0.63,0.5271,0.4629,0.0,0.7404,23.05,17.8,0.1951,0.2949,13.2,16.3,[]],[50.6,"medium",0.5532,0.5924,0.6504,0.5532,0.4892,0.0,0.7438,23.45,17.5,0.1966,0.2999,13.2,16.8,[]],[52.9,"medium",0.5788,0.6176,0.6705,0.5788,0.5155,0.0,0.747,23.84,17.22,0.1981,0.3049,13.2,17.3,[]],[55.1,"medium",0.604,0.6421,0.6902,0.604,0.5418,0.0,0.7502,24.24,16.94,0.1995,0.3099,13.2,17.8,[]],[57.2,"medium",0.6289,0.6661,0.7097,0.6289,0.5681,0.0,0.7534,24.64,16.67,0.201,0.3149,13.2,18.3,[]],[59.4,"medium",0.6533,0.6895,0.7288,0.6533,0.5944,0.0,0.7564,25.04,16.41,0.2024,0.3199,13.2,18.8,[]],[61.5,"medium",0.6774,0.7123,0.7476,0.6774,0.6207,0.0,0.7594,25.44,16.16,0.2038,0.3249,13.2,19.3,[]],[63.6,"medium",0.7011,0.7346,0.7661,0.7011,0.6471,0.0,0.7623,25.83,15.91,0.2053,0.3299,13.2,19.8,[]],[65.6,"critical",0.7244,0.7564,0.7844,0.7244,0.6734,0.0,0.7651,26.23,15.68,0.2067,0.3349,13.2,20.3,[]],[67.7,"critical",0.7474,0.7777,0.8024,0.7474,0.6997,0.0,0.7679,26.63,15.44,0.2081,0.3399,13.2,20.8,[]],[69.7,"critical",0.7701,0.7985,0.8201,0.7701,0.726,0.0,0.7706,27.03,15.22,0.2095,0.3449,13.2,21.3,[]],[71.7,"critical",0.7924,0.8189,0.8376,0.7924,0.7523,0.0,0.7732,27.43,15.0,0.2108,0.3499,13.2,21.8,[]],[73.6,"critical",0.8144,0.8388,0.8548,0.8144,0.7786,0.0,0.7758,27.82,14.79,0.2122,0.3549,13.2,22.3,[]],[75.6,"critical",0.8361,0.8582,0.8718,0.8361,0.8049,0.0,0.7784,28.22,14.59,0.2135,0.3599,13.2,22.8,[]],[77.5,"critical",0.8575,0.8772,0.8885,0.8575,0.8312,0.0,0.7808,28.62,14.39,0.2149,0.3649,13.2,23.3,[]],[79.4,"critical",0.8786,0.8959,0.905,0.8786,0.8575,0.0,0.7833,29.02,14.19,0.2162,0.3699,13.2,23.8,[]],[81.3,"critical",0.8995,0.9141,0.9213,0.8995,0.8838,0.0,0.7856,29.42,14.0,0.2175,0.3749,13.2,24.3,[]],[83.1,"critical",0.92,0.9319,0.9374,0.92,0.9101,0.0,0.788,29.82,13.82,0.2188,0.3799,13.2,24.8,[]],[85.0,"critical",0.9403,0.9494,0.9533,0.9403,0.9365,0.0,0.7902,30.22,13.64,0.2201,0.3849,13.2,25.3,[]],[86.8,"critical",0.9603,0.9665,0.969,0.9603,0.9628,0.0,0.7925,30.62,13.46,0.2214,0.3899,13.2,25.8,[]],[88.6,"critical",0.9801,0.9833,0.9844,0.9801,0.9891,0.0,0.7946,31.02,13.29,0.2227,0.3949,13.2,26.3,[]],[90.0,"critical",0.9996,0.9997,0.9997,0.9996,1.0,0.0,0.7968,31.42,13.13,0.224,0.3999,13.2,26.8,[]]]]},
  "level_thresholds": {
   "critical": 65.0,
   "medium": 35.0
  },
  "materials": [
   {
    "basis": "data",
    "inert": false,
    "key": "PMMA",
    "label": "PMMA / acrylic",
    "threshold_o2_pct_ref": 13.5
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "SIBAL",
    "label": "SIBAL fabric",
    "threshold_o2_pct_ref": 26.2
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "Nomex",
    "label": "Nomex",
    "threshold_o2_pct_ref": 24.7
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "Wax candle",
    "label": "Wax / paraffin",
    "threshold_o2_pct_ref": 13.2
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "Kapton",
    "label": "Kapton (polyimide)",
    "threshold_o2_pct_ref": 19.2
   },
   {
    "basis": "literature",
    "inert": true,
    "key": "PTFE",
    "label": "PTFE / Teflon",
    "threshold_o2_pct_ref": 91.2
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "Silicone",
    "label": "Silicone rubber",
    "threshold_o2_pct_ref": 22.2
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "Polyethylene",
    "label": "Polyethylene",
    "threshold_o2_pct_ref": 13.6
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "Cotton",
    "label": "Cotton",
    "threshold_o2_pct_ref": 14.6
   },
   {
    "basis": "literature",
    "inert": false,
    "key": "PU foam",
    "label": "Polyurethane foam",
    "threshold_o2_pct_ref": 13.2
   },
   {
    "basis": "literature",
    "inert": true,
    "key": "Inert",
    "label": "Metal / ceramic / glass",
    "threshold_o2_pct_ref": 100.0
   }
  ],
  "presets": [
   {
    "key": "iss",
    "o2_pct": 21.0,
    "pressure_kpa": 101.3
   },
   {
    "key": "exploration",
    "o2_pct": 34.0,
    "pressure_kpa": 56.5
   },
   {
    "key": "iss_reduced",
    "o2_pct": 26.5,
    "pressure_kpa": 70.3
   },
   {
    "key": "ceiling",
    "o2_pct": 40.0,
    "pressure_kpa": 101.3
   }
  ],
  "provenance": [
   {
    "basis": "assumption",
    "component": "oxygen",
    "doi": null,
    "n": null,
    "note_key": "risk.prov.oxygen",
    "params": {
     "ceiling_po2_atm": 0.4,
     "ref_po2_atm": 0.21
    },
    "psi_id": null,
    "r2": null,
    "weight": 0.15
   },
   {
    "basis": "data",
    "component": "ignition",
    "doi": "10.60555/cyt1-kh64",
    "n": 333,
    "note_key": "risk.prov.ignition",
    "params": {
     "coef": 1.045,
     "intercept": 2.324
    },
    "psi_id": "PSI-159",
    "r2": null,
    "weight": 0.25
   },
   {
    "basis": "mixed",
    "component": "duration",
    "doi": "10.60555/cyt1-kh64",
    "n": 175,
    "note_key": "risk.prov.duration",
    "params": {
     "duration_multiplier": {
      "Cotton": 0.9,
      "Inert": 0.0,
      "Kapton": 1.2,
      "Nomex": 0.5,
      "PMMA": 1.0,
      "PTFE": 0.3,
      "PU foam": 0.7,
      "Polyethylene": 1.0,
      "SIBAL": 0.5,
      "Silicone": 1.3,
      "Wax candle": 1.2
     },
     "intercept": -0.487,
     "o2_exp": 1.017,
     "p_exp": -1.573
    },
    "psi_id": "PSI-159",
    "r2": 0.402,
    "weight": 0.15
   },
   {
    "basis": "data",
    "component": "spread",
    "doi": "10.60555/m6pj-a914",
    "embedded": {
     "coef": 0.454,
     "n": 74,
     "r2": 0.044
    },
    "feature_store_refit": {
     "coef": 0.31922935654153256,
     "n": 66,
     "r2": 0.0303
    },
    "n": 74,
    "note_key": "risk.prov.spread_low_r2_refit_differs",
    "params": {
     "coef": 0.454,
     "intercept": -1.08
    },
    "psi_id": "PSI-39",
    "r2": 0.044,
    "refit_differs": true,
    "weight": 0.1
   },
   {
    "basis": "mixed",
    "component": "margin",
    "doi": "10.60555/4qc4-de67",
    "n": 98,
    "note_key": "risk.prov.margin",
    "params": {
     "pmma_threshold_pct": 13.5
    },
    "psi_id": "PSI-25",
    "r2": null,
    "weight": 0.25
   },
   {
    "basis": "mixed",
    "component": "material",
    "doi": "10.60555/4qc4-de67",
    "n": 93,
    "note_key": "risk.prov.material",
    "params": {
     "burn_share": {
      "Nomex": 0.0,
      "PMMA": 0.763,
      "SIBAL": 0.0,
      "Wax candle": 0.0
     },
     "n_tests": {
      "Nomex": 3,
      "PMMA": 98,
      "SIBAL": 27,
      "Wax candle": 1
     },
     "pmma_logit_intercept": 0.971,
     "pmma_logit_o2_slope": -0.086
    },
    "psi_id": "PSI-25",
    "r2": null,
    "weight": 0.1
   },
   {
    "basis": "literature",
    "component": "ignition_delay",
    "doi": null,
    "n": null,
    "note_key": "risk.prov.ignition_delay",
    "params": {
     "po2_exponent": 1.0,
     "t_ref_s": 25.0
    },
    "psi_id": null,
    "r2": null,
    "ref": "NASA-STD-6001"
   },
   {
    "basis": "mixed",
    "component": "material_thresholds",
    "doi": "10.60555/4qc4-de67",
    "n": 98,
    "note_key": "risk.prov.material_thresholds",
    "params": {
     "materials": [
      {
       "basis": "data",
       "bass2_n_tests": 98,
       "inert": false,
       "key": "PMMA",
       "loi_pct": 17.3,
       "profile_source": "BASS-II",
       "threshold_o2_pct_ref": 13.5
      },
      {
       "basis": "literature",
       "bass2_n_tests": 27,
       "inert": false,
       "key": "SIBAL",
       "loi_pct": 30.0,
       "profile_source": "BASS-II",
       "threshold_o2_pct_ref": 26.2
      },
      {
       "basis": "literature",
       "bass2_n_tests": 3,
       "inert": false,
       "key": "Nomex",
       "loi_pct": 28.5,
       "profile_source": "BASS-II",
       "threshold_o2_pct_ref": 24.7
      },
      {
       "basis": "literature",
       "bass2_n_tests": 1,
       "inert": false,
       "key": "Wax candle",
       "loi_pct": 17.0,
       "profile_source": "BASS-II",
       "threshold_o2_pct_ref": 13.2
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": false,
       "key": "Kapton",
       "loi_pct": 23.0,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 19.2
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": true,
       "key": "PTFE",
       "loi_pct": 95.0,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 91.2
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": false,
       "key": "Silicone",
       "loi_pct": 26.0,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 22.2
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": false,
       "key": "Polyethylene",
       "loi_pct": 17.4,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 13.6
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": false,
       "key": "Cotton",
       "loi_pct": 18.4,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 14.6
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": false,
       "key": "PU foam",
       "loi_pct": 17.0,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 13.2
      },
      {
       "basis": "literature",
       "bass2_n_tests": null,
       "inert": true,
       "key": "Inert",
       "loi_pct": 100.0,
       "profile_source": "lit",
       "threshold_o2_pct_ref": 100.0
      }
     ]
    },
    "psi_id": "PSI-25",
    "r2": null
   },
   {
    "basis": "assumption",
    "component": "weights",
    "doi": null,
    "n": null,
    "note_key": "risk.prov.weights",
    "params": {
     "duration": 0.15,
     "ignition": 0.25,
     "margin": 0.25,
     "material": 0.1,
     "oxygen": 0.15,
     "spread": 0.1
    },
    "psi_id": null,
    "r2": null
   },
   {
    "basis": "assumption",
    "component": "level_thresholds",
    "doi": null,
    "n": null,
    "note_key": "risk.prov.level_thresholds",
    "params": {
     "critical": 65.0,
     "medium": 35.0
    },
    "psi_id": null,
    "r2": null
   },
   {
    "basis": "assumption",
    "component": "pressure_scaling",
    "doi": null,
    "n": null,
    "note_key": "risk.prov.pressure_scaling",
    "params": {
     "exponent": 0.35
    },
    "psi_id": null,
    "r2": null
   }
  ],
  "reference": {
   "o2_pct": 21.0,
   "pressure_kpa": 101.325
  },
  "source": {
   "author": "sametozantopcu",
   "pr": 7
  },
  "warning_keys": [
   "material_fallback",
   "outside_envelope",
   "pressure_outside_envelope",
   "below_threshold",
   "inert_material",
   "ignition_saturated",
   "above_threshold_low_index",
   "clipped_below_reference"
  ],
  "weights": {
   "duration": 0.15,
   "ignition": 0.25,
   "margin": 0.25,
   "material": 0.1,
   "oxygen": 0.15,
   "spread": 0.1
  }
 },
 "series": {
  "PSI-101": {
   "n_plotted": 121,
   "n_total": 167,
   "points": [
    [
     8.0,
     0.32595928472085983,
     2,
     0
    ],
    [
     8.0,
     0.2968716485960629,
     2,
     1
    ],
    [
     8.0,
     0.35676111898033164,
     3,
     1
    ],
    [
     8.0,
     0.2267233068714381,
     6,
     0
    ],
    [
     8.0,
     0.1450018215767459,
     6,
     1
    ],
    [
     8.0,
     0.37246136490403414,
     7,
     0
    ],
    [
     8.0,
     0.2336965921777638,
     7,
     1
    ],
    [
     4.0,
     0.20547096060057599,
     8,
     0
    ],
    [
     8.0,
     0.2792996722026177,
     8,
     1
    ],
    [
     4.0,
     0.13371556018952235,
     9,
     0
    ],
    [
     8.0,
     0.18683766619447323,
     10,
     0
    ],
    [
     8.0,
     0.11595922968141949,
     10,
     1
    ],
    [
     8.0,
     0.24924957168477233,
     11,
     0
    ],
    [
     8.0,
     0.18564470202739639,
     12,
     0
    ],
    [
     8.0,
     0.15206897674845057,
     13,
     0
    ],
    [
     8.0,
     0.09417291186421026,
     14,
     0
    ],
    [
     8.0,
     0.1661823293897764,
     15,
     0
    ],
    [
     8.0,
     0.1599055846948122,
     15,
     1
    ],
    [
     4.0,
     0.11462877287753323,
     16,
     0
    ],
    [
     4.0,
     0.14857509108232342,
     17,
     0
    ],
    [
     8.0,
     0.2036016771125715,
     18,
     0
    ],
    [
     8.0,
     0.27572006122365567,
     19,
     0
    ],
    [
     8.0,
     0.2564882176457989,
     19,
     1
    ],
    [
     2.0,
     0.15228375712362852,
     20,
     0
    ],
    [
     2.0,
     0.163602001340456,
     21,
     0
    ],
    [
     8.0,
     0.20776147068589287,
     22,
     0
    ],
    [
     8.0,
     0.27610024306330005,
     23,
     0
    ],
    [
     2.0,
     0.17780543707723964,
     33,
     0
    ],
    [
     2.0,
     0.18204359333877107,
     34,
     0
    ],
    [
     8.0,
     0.17673711105910242,
     40,
     1
    ],
    [
     8.0,
     0.33083774865382987,
     41,
     1
    ],
    [
     8.0,
     0.1690964585465218,
     42,
     1
    ],
    [
     8.0,
     0.26798625255286757,
     43,
     0
    ],
    [
     8.0,
     0.3008240287584537,
     43,
     1
    ],
    [
     8.0,
     0.34470125820028336,
     44,
     0
    ],
    [
     8.0,
     0.21852328663676657,
     45,
     0
    ],
    [
     8.0,
     0.253617668885698,
     46,
     0
    ],
    [
     8.0,
     0.2438703570253213,
     47,
     0
    ],
    [
     8.0,
     0.14936620957955926,
     48,
     0
    ],
    [
     8.1,
     0.14808630459171615,
     49,
     0
    ],
    [
     8.1,
     0.0563731190105457,
     50,
     0
    ],
    [
     8.1,
     0.0668156766313406,
     51,
     0
    ],
    [
     8.1,
     0.2080442916652481,
     52,
     0
    ],
    [
     8.1,
     0.25033936032853354,
     53,
     0
    ],
    [
     8.1,
     0.10962569424235284,
     54,
     0
    ],
    [
     8.1,
     0.11626086070116975,
     55,
     0
    ],
    [
     8.1,
     0.14894929432553272,
     56,
     0
    ],
    [
     8.1,
     0.13183675328073566,
     57,
     0
    ],
    [
     8.1,
     0.08522870685648089,
     58,
     0
    ],
    [
     8.1,
     0.0531282678168605,
     59,
     0
    ],
    [
     8.1,
     0.10459065809534994,
     60,
     0
    ],
    [
     8.1,
     0.19225459171796622,
     61,
     0
    ],
    [
     8.1,
     0.3380752866414779,
     62,
     0
    ],
    [
     8.1,
     0.24064095529695867,
     63,
     0
    ],
    [
     8.1,
     0.46768580414007993,
     64,
     0
    ],
    [
     8.1,
     0.05858172837771935,
     65,
     0
    ],
    [
     8.1,
     0.10874987326977262,
     66,
     0
    ],
    [
     8.1,
     0.1483363981099871,
     67,
     0
    ],
    [
     8.1,
     0.24311218052959396,
     68,
     0
    ],
    [
     8.1,
     0.20703943977434275,
     69,
     0
    ],
    [
     8.1,
     0.3590427447986828,
     70,
     0
    ],
    [
     8.1,
     0.2538303437849373,
     71,
     0
    ],
    [
     8.1,
     0.45014457959499116,
     72,
     0
    ],
    [
     8.1,
     0.19513944234574185,
     73,
     0
    ],
    [
     8.1,
     0.46210291491123606,
     74,
     0
    ],
    [
     8.1,
     0.24249019691958648,
     75,
     0
    ],
    [
     8.1,
     0.45471849501032435,
     76,
     0
    ],
    [
     8.1,
     0.3850335208269428,
     77,
     0
    ],
    [
     8.1,
     0.2300449811647426,
     78,
     0
    ],
    [
     8.1,
     0.47310143830376716,
     79,
     0
    ],
    [
     8.1,
     0.16100578273346813,
     80,
     0
    ],
    [
     8.1,
     0.32117867003030603,
     81,
     0
    ],
    [
     8.1,
     0.18227320062546948,
     82,
     0
    ],
    [
     8.1,
     0.05878238575975495,
     83,
     0
    ],
    [
     8.1,
     0.09551761203838137,
     84,
     0
    ],
    [
     8.1,
     0.1976149506837051,
     85,
     0
    ],
    [
     8.1,
     0.37899697072214944,
     86,
     0
    ],
    [
     8.1,
     0.11797700268537473,
     88,
     0
    ],
    [
     8.1,
     0.3539879092760971,
     89,
     0
    ],
    [
     8.1,
     0.4448100716712697,
     90,
     0
    ],
    [
     8.1,
     0.0883966382810287,
     91,
     0
    ],
    [
     8.1,
     0.13818103735430015,
     92,
     0
    ],
    [
     8.1,
     0.12988195937811292,
     93,
     0
    ],
    [
     8.1,
     0.22351514410596268,
     94,
     0
    ],
    [
     8.1,
     0.16283968830998286,
     95,
     0
    ],
    [
     8.1,
     0.2666932791556306,
     96,
     0
    ],
    [
     8.1,
     0.12429628628849503,
     97,
     0
    ],
    [
     8.1,
     0.25394710707642226,
     98,
     0
    ],
    [
     8.1,
     0.20838028193207944,
     99,
     0
    ],
    [
     8.1,
     0.38498978203935447,
     100,
     0
    ],
    [
     8.1,
     0.13891501803978532,
     101,
     0
    ],
    [
     8.1,
     0.2301097131615957,
     102,
     0
    ],
    [
     8.1,
     0.1399012126877059,
     103,
     0
    ],
    [
     8.1,
     0.3369907290446838,
     104,
     0
    ],
    [
     8.1,
     0.23268245230988843,
     105,
     0
    ],
    [
     8.1,
     0.3547564468721438,
     106,
     0
    ],
    [
     8.1,
     0.11219893930621616,
     108,
     0
    ],
    [
     8.1,
     0.24490687440172548,
     109,
     0
    ],
    [
     8.1,
     0.40730436810302983,
     110,
     0
    ],
    [
     8.1,
     0.2196149542448691,
     111,
     0
    ],
    [
     8.1,
     0.12574795390624272,
     112,
     0
    ],
    [
     8.1,
     0.05508867666449692,
     113,
     0
    ],
    [
     8.1,
     0.06629052423309552,
     114,
     0
    ],
    [
     8.1,
     0.08295309971535206,
     115,
     0
    ],
    [
     8.1,
     0.18598777657726576,
     116,
     0
    ],
    [
     8.1,
     0.04900510396933735,
     117,
     0
    ],
    [
     8.1,
     0.06434157427531689,
     118,
     0
    ],
    [
     8.1,
     0.10509227008761539,
     119,
     0
    ],
    [
     8.1,
     0.0919403014378164,
     120,
     0
    ],
    [
     8.1,
     0.13550220539017285,
     121,
     0
    ],
    [
     1.0,
     0.38960521311196605,
     138,
     0
    ],
    [
     1.0,
     0.44340822903935495,
     139,
     0
    ],
    [
     1.0,
     0.2593920187306404,
     146,
     0
    ],
    [
     1.0,
     0.2820672902572448,
     147,
     0
    ],
    [
     1.0,
     0.1346708034598724,
     148,
     0
    ],
    [
     1.0,
     0.14499643709710786,
     149,
     0
    ],
    [
     2.0,
     0.25698065436822065,
     150,
     0
    ],
    [
     2.0,
     0.29459322042440694,
     151,
     0
    ],
    [
     2.0,
     0.2752888217516672,
     152,
     0
    ],
    [
     2.0,
     0.19061768489019365,
     153,
     0
    ],
    [
     2.0,
     0.39088623557228447,
     154,
     0
    ]
   ],
   "psi_id": "PSI-101",
   "reference": null,
   "source_files": [
    "PSI-101/Combined_SAMER_Results_06_02_14__Reduced_data_sheet.csv",
    "PSI-101/Combined_SAMER_Results_06_02_14__SAME_Ground_Test_Results.csv"
   ],
   "table": "smoke",
   "x": {
    "col": "inlet_velocity_cm_s",
    "label": "Inlet velocity",
    "unit": "cm/s"
   },
   "y": {
    "col": "amd_um",
    "label": "Aerosol mean diameter (AMD)",
    "unit": "um"
   }
  },
  "PSI-25": {
   "n_plotted": 127,
   "n_total": 129,
   "points": [
    [
     22.2,
     22.2,
     0,
     0
    ],
    [
     22.2,
     1.6,
     1,
     0
    ],
    [
     22.2,
     21.8,
     2,
     0
    ],
    [
     22.2,
     22.2,
     3,
     0
    ],
    [
     22.2,
     21.9,
     4,
     0
    ],
    [
     21.0,
     20.9,
     5,
     0
    ],
    [
     22.2,
     22.1,
     6,
     0
    ],
    [
     21.0,
     20.5,
     7,
     0
    ],
    [
     21.0,
     20.9,
     8,
     0
    ],
    [
     21.0,
     20.8,
     9,
     0
    ],
    [
     21.0,
     20.7,
     10,
     0
    ],
    [
     22.2,
     22.1,
     11,
     0
    ],
    [
     21.0,
     20.5,
     12,
     0
    ],
    [
     21.0,
     20.8,
     14,
     0
    ],
    [
     17.3,
     17.2,
     15,
     0
    ],
    [
     17.5,
     17.4,
     16,
     0
    ],
    [
     17.4,
     17.4,
     17,
     0
    ],
    [
     17.3,
     17.2,
     18,
     0
    ],
    [
     17.4,
     17.4,
     19,
     0
    ],
    [
     20.8,
     20.6,
     20,
     0
    ],
    [
     20.7,
     20.5,
     21,
     0
    ],
    [
     22.2,
     22.2,
     22,
     0
    ],
    [
     21.0,
     21.0,
     23,
     0
    ],
    [
     17.4,
     17.4,
     25,
     0
    ],
    [
     22.2,
     21.9,
     26,
     0
    ],
    [
     22.2,
     21.2,
     27,
     0
    ],
    [
     20.8,
     19.7,
     28,
     0
    ],
    [
     21.8,
     19.8,
     29,
     0
    ],
    [
     22.2,
     19.0,
     30,
     0
    ],
    [
     21.8,
     20.7,
     31,
     0
    ],
    [
     18.9,
     18.4,
     32,
     0
    ],
    [
     19.1,
     18.2,
     33,
     0
    ],
    [
     18.0,
     17.6,
     34,
     0
    ],
    [
     20.1,
     18.6,
     35,
     0
    ],
    [
     20.0,
     18.5,
     36,
     0
    ],
    [
     21.7,
     20.4,
     37,
     0
    ],
    [
     20.8,
     19.0,
     38,
     0
    ],
    [
     22.2,
     21.6,
     39,
     0
    ],
    [
     21.0,
     20.0,
     40,
     0
    ],
    [
     19.2,
     18.7,
     41,
     0
    ],
    [
     18.8,
     17.1,
     42,
     0
    ],
    [
     17.9,
     16.8,
     43,
     0
    ],
    [
     19.0,
     17.4,
     44,
     0
    ],
    [
     18.0,
     17.4,
     45,
     0
    ],
    [
     22.2,
     21.7,
     46,
     0
    ],
    [
     22.2,
     21.9,
     47,
     0
    ],
    [
     18.0,
     18.0,
     48,
     0
    ],
    [
     18.0,
     17.7,
     49,
     0
    ],
    [
     14.8,
     13.6,
     50,
     0
    ],
    [
     15.1,
     14.2,
     51,
     0
    ],
    [
     14.2,
     14.1,
     52,
     0
    ],
    [
     16.7,
     16.0,
     53,
     0
    ],
    [
     16.0,
     15.5,
     54,
     0
    ],
    [
     15.7,
     15.3,
     55,
     0
    ],
    [
     15.5,
     15.2,
     56,
     0
    ],
    [
     15.0,
     14.8,
     57,
     0
    ],
    [
     16.7,
     16.1,
     58,
     0
    ],
    [
     15.4,
     14.8,
     59,
     0
    ],
    [
     13.6,
     13.5,
     60,
     0
    ],
    [
     15.9,
     14.6,
     61,
     0
    ],
    [
     14.6,
     14.4,
     62,
     0
    ],
    [
     16.3,
     15.3,
     63,
     0
    ],
    [
     17.1,
     16.7,
     64,
     0
    ],
    [
     16.7,
     15.6,
     65,
     0
    ],
    [
     14.5,
     14.5,
     66,
     0
    ],
    [
     15.1,
     14.3,
     67,
     0
    ],
    [
     15.2,
     14.5,
     68,
     0
    ],
    [
     15.3,
     14.6,
     69,
     0
    ],
    [
     16.5,
     15.9,
     70,
     0
    ],
    [
     15.9,
     15.4,
     71,
     0
    ],
    [
     15.4,
     14.9,
     72,
     0
    ],
    [
     17.7,
     17.5,
     73,
     0
    ],
    [
     17.4,
     17.2,
     74,
     0
    ],
    [
     17.7,
     17.4,
     75,
     0
    ],
    [
     17.4,
     16.8,
     76,
     0
    ],
    [
     18.5,
     17.1,
     77,
     0
    ],
    [
     19.3,
     17.6,
     78,
     0
    ],
    [
     18.9,
     18.5,
     79,
     0
    ],
    [
     16.4,
     16.3,
     80,
     0
    ],
    [
     17.6,
     17.1,
     81,
     0
    ],
    [
     17.0,
     16.4,
     82,
     0
    ],
    [
     17.5,
     16.8,
     83,
     0
    ],
    [
     20.7,
     19.1,
     84,
     0
    ],
    [
     20.6,
     20.2,
     85,
     0
    ],
    [
     18.4,
     18.0,
     86,
     0
    ],
    [
     18.0,
     17.5,
     87,
     0
    ],
    [
     18.2,
     17.4,
     88,
     0
    ],
    [
     16.8,
     16.5,
     89,
     0
    ],
    [
     20.0,
     19.0,
     90,
     0
    ],
    [
     17.5,
     16.7,
     91,
     0
    ],
    [
     19.0,
     18.2,
     92,
     0
    ],
    [
     16.3,
     16.3,
     93,
     0
    ],
    [
     16.3,
     16.3,
     94,
     0
    ],
    [
     20.8,
     0.6,
     95,
     0
    ],
    [
     20.0,
     39.1,
     96,
     0
    ],
    [
     18.2,
     17.0,
     97,
     0
    ],
    [
     19.0,
     17.5,
     98,
     0
    ],
    [
     20.9,
     20.2,
     99,
     0
    ],
    [
     18.5,
     18.5,
     100,
     0
    ],
    [
     18.5,
     18.5,
     101,
     0
    ],
    [
     17.2,
     16.8,
     102,
     0
    ],
    [
     18.7,
     18.7,
     103,
     0
    ],
    [
     18.8,
     18.9,
     104,
     0
    ],
    [
     18.8,
     18.8,
     105,
     0
    ],
    [
     17.3,
     17.1,
     106,
     0
    ],
    [
     16.4,
     16.4,
     107,
     0
    ],
    [
     16.4,
     16.5,
     108,
     0
    ],
    [
     17.1,
     17.0,
     109,
     0
    ],
    [
     16.8,
     16.9,
     110,
     0
    ],
    [
     17.5,
     17.6,
     111,
     0
    ],
    [
     16.9,
     16.9,
     112,
     0
    ],
    [
     18.7,
     18.7,
     113,
     0
    ],
    [
     17.6,
     17.5,
     114,
     0
    ],
    [
     16.9,
     16.9,
     115,
     0
    ],
    [
     17.4,
     17.4,
     116,
     0
    ],
    [
     17.2,
     17.2,
     117,
     0
    ],
    [
     17.2,
     17.2,
     118,
     0
    ],
    [
     17.2,
     17.2,
     119,
     0
    ],
    [
     17.1,
     17.0,
     120,
     0
    ],
    [
     17.2,
     17.3,
     121,
     0
    ],
    [
     18.2,
     18.2,
     122,
     0
    ],
    [
     20.8,
     20.7,
     123,
     0
    ],
    [
     20.8,
     20.7,
     124,
     0
    ],
    [
     20.7,
     20.6,
     125,
     0
    ],
    [
     20.7,
     0.9,
     126,
     0
    ],
    [
     20.7,
     40.4,
     127,
     0
    ],
    [
     20.7,
     20.5,
     128,
     0
    ]
   ],
   "psi_id": "PSI-25",
   "reference": {
    "kind": "identity",
    "label": "reference: no O2 change"
   },
   "source_files": [
    "PSI-25/PSI-25_Experimental_table_BASS-II.csv"
   ],
   "table": "bass2",
   "x": {
    "col": "o2_init_pct",
    "label": "Initial O2",
    "unit": "% vol"
   },
   "y": {
    "col": "o2_final_pct",
    "label": "Final O2",
    "unit": "% vol"
   }
  },
  "PSI-39": {
   "n_plotted": 148,
   "n_total": 227,
   "points": [
    [
     21.0,
     0.379,
     0,
     0
    ],
    [
     21.0,
     0.338,
     1,
     0
    ],
    [
     21.0,
     0.36,
     2,
     0
    ],
    [
     21.0,
     0.359,
     3,
     0
    ],
    [
     21.0,
     0.403,
     4,
     0
    ],
    [
     21.0,
     0.339,
     5,
     0
    ],
    [
     17.0,
     0.062,
     6,
     0
    ],
    [
     17.0,
     0.189,
     7,
     0
    ],
    [
     17.0,
     0.311,
     8,
     0
    ],
    [
     17.0,
     0.163,
     9,
     0
    ],
    [
     17.0,
     0.313,
     10,
     0
    ],
    [
     17.0,
     0.331,
     11,
     0
    ],
    [
     21.0,
     0.371,
     12,
     0
    ],
    [
     21.0,
     0.243,
     13,
     0
    ],
    [
     21.0,
     0.341,
     15,
     0
    ],
    [
     21.0,
     0.645,
     16,
     0
    ],
    [
     21.0,
     0.388,
     17,
     0
    ],
    [
     21.0,
     0.516,
     18,
     0
    ],
    [
     21.0,
     0.402,
     19,
     0
    ],
    [
     21.0,
     0.427,
     20,
     0
    ],
    [
     21.0,
     0.399,
     21,
     0
    ],
    [
     21.0,
     0.626,
     23,
     0
    ],
    [
     21.0,
     0.369,
     24,
     0
    ],
    [
     17.0,
     0.49,
     25,
     0
    ],
    [
     17.0,
     0.324,
     26,
     0
    ],
    [
     17.0,
     0.11,
     27,
     0
    ],
    [
     21.0,
     0.413,
     28,
     0
    ],
    [
     21.0,
     0.301,
     30,
     0
    ],
    [
     21.0,
     0.319,
     31,
     0
    ],
    [
     21.0,
     0.369,
     32,
     0
    ],
    [
     21.0,
     0.318,
     33,
     0
    ],
    [
     21.0,
     0.351,
     34,
     0
    ],
    [
     21.0,
     0.333,
     36,
     0
    ],
    [
     21.0,
     0.338,
     37,
     0
    ],
    [
     21.0,
     0.381,
     38,
     0
    ],
    [
     21.0,
     0.366,
     39,
     0
    ],
    [
     21.0,
     0.356,
     40,
     0
    ],
    [
     21.0,
     0.326,
     41,
     0
    ],
    [
     21.0,
     0.409,
     42,
     0
    ],
    [
     21.0,
     0.426,
     43,
     0
    ],
    [
     21.0,
     0.383,
     44,
     0
    ],
    [
     21.0,
     0.379,
     45,
     0
    ],
    [
     21.0,
     0.398,
     46,
     0
    ],
    [
     21.0,
     0.47,
     47,
     0
    ],
    [
     21.0,
     0.338,
     48,
     0
    ],
    [
     21.0,
     0.412,
     49,
     0
    ],
    [
     21.0,
     0.35,
     50,
     0
    ],
    [
     21.0,
     0.373,
     51,
     0
    ],
    [
     21.0,
     0.215,
     52,
     0
    ],
    [
     21.0,
     0.588,
     53,
     0
    ],
    [
     21.0,
     0.488,
     54,
     0
    ],
    [
     21.0,
     0.618,
     55,
     0
    ],
    [
     21.0,
     0.659,
     56,
     0
    ],
    [
     21.0,
     0.421,
     57,
     0
    ],
    [
     21.0,
     0.426,
     58,
     0
    ],
    [
     21.0,
     0.539,
     59,
     0
    ],
    [
     21.0,
     0.447,
     60,
     0
    ],
    [
     21.0,
     0.43,
     61,
     0
    ],
    [
     21.0,
     0.404,
     62,
     0
    ],
    [
     21.0,
     0.461,
     64,
     0
    ],
    [
     21.0,
     0.739,
     65,
     0
    ],
    [
     21.0,
     0.789,
     66,
     0
    ],
    [
     21.0,
     0.67,
     67,
     0
    ],
    [
     21.0,
     0.78,
     68,
     0
    ],
    [
     21.0,
     1.371,
     69,
     0
    ],
    [
     21.0,
     1.496,
     70,
     0
    ],
    [
     21.0,
     1.164,
     71,
     0
    ],
    [
     21.0,
     1.703,
     72,
     0
    ],
    [
     21.0,
     0.938,
     73,
     0
    ],
    [
     21.0,
     1.141,
     74,
     0
    ],
    [
     21.0,
     0.714,
     75,
     0
    ],
    [
     21.0,
     0.322,
     76,
     0
    ],
    [
     21.0,
     0.339,
     77,
     0
    ],
    [
     21.0,
     0.293,
     79,
     0
    ],
    [
     17.0,
     0.108,
     80,
     0
    ],
    [
     17.0,
     0.073,
     81,
     0
    ],
    [
     17.0,
     0.119,
     82,
     0
    ],
    [
     17.0,
     0.075,
     83,
     0
    ],
    [
     17.0,
     0.001,
     84,
     0
    ],
    [
     17.0,
     0.156,
     85,
     0
    ],
    [
     17.0,
     0.048,
     86,
     0
    ],
    [
     17.0,
     0.136,
     87,
     0
    ],
    [
     17.0,
     0.008,
     88,
     0
    ],
    [
     17.0,
     0.095,
     89,
     0
    ],
    [
     21.0,
     0.309,
     90,
     0
    ],
    [
     21.0,
     0.223,
     91,
     0
    ],
    [
     21.0,
     0.307,
     92,
     0
    ],
    [
     21.0,
     0.309,
     93,
     0
    ],
    [
     21.0,
     0.294,
     94,
     0
    ],
    [
     21.0,
     0.34,
     95,
     0
    ],
    [
     21.0,
     0.172,
     96,
     0
    ],
    [
     21.0,
     0.348,
     97,
     0
    ],
    [
     21.0,
     0.337,
     100,
     0
    ],
    [
     21.0,
     0.356,
     102,
     0
    ],
    [
     21.0,
     0.268,
     103,
     0
    ],
    [
     21.0,
     0.158,
     104,
     0
    ],
    [
     21.0,
     0.229,
     105,
     0
    ],
    [
     21.0,
     0.176,
     106,
     0
    ],
    [
     21.0,
     0.489,
     107,
     0
    ],
    [
     21.0,
     0.228,
     109,
     0
    ],
    [
     21.0,
     0.317,
     110,
     0
    ],
    [
     21.0,
     0.23,
     111,
     0
    ],
    [
     21.0,
     0.41,
     112,
     0
    ],
    [
     21.0,
     0.332,
     113,
     0
    ],
    [
     21.0,
     0.134,
     114,
     0
    ],
    [
     21.0,
     0.248,
     115,
     0
    ],
    [
     21.0,
     0.223,
     116,
     0
    ],
    [
     21.0,
     0.331,
     117,
     0
    ],
    [
     21.0,
     0.259,
     118,
     0
    ],
    [
     17.0,
     0.097,
     119,
     0
    ],
    [
     17.0,
     0.012,
     120,
     0
    ],
    [
     17.0,
     0.09,
     121,
     0
    ],
    [
     17.0,
     0.085,
     122,
     0
    ],
    [
     17.0,
     0.177,
     123,
     0
    ],
    [
     17.0,
     0.034,
     124,
     0
    ],
    [
     17.0,
     0.096,
     125,
     0
    ],
    [
     17.0,
     0.088,
     126,
     0
    ],
    [
     17.0,
     0.07,
     127,
     0
    ],
    [
     21.0,
     0.327,
     128,
     0
    ],
    [
     21.0,
     0.115,
     129,
     0
    ],
    [
     21.0,
     0.238,
     130,
     0
    ],
    [
     21.0,
     0.133,
     131,
     0
    ],
    [
     21.0,
     0.367,
     132,
     0
    ],
    [
     21.0,
     0.148,
     133,
     0
    ],
    [
     21.0,
     0.648,
     134,
     0
    ],
    [
     21.0,
     0.385,
     135,
     0
    ],
    [
     21.0,
     0.709,
     136,
     0
    ],
    [
     21.0,
     0.562,
     137,
     0
    ],
    [
     21.0,
     0.289,
     138,
     0
    ],
    [
     21.0,
     0.302,
     139,
     0
    ],
    [
     21.0,
     0.394,
     140,
     0
    ],
    [
     21.0,
     0.367,
     141,
     0
    ],
    [
     21.0,
     0.205,
     142,
     0
    ],
    [
     21.0,
     0.209,
     143,
     0
    ],
    [
     21.0,
     0.136,
     144,
     0
    ],
    [
     21.0,
     0.21,
     146,
     0
    ],
    [
     21.0,
     0.28,
     150,
     0
    ],
    [
     21.0,
     0.252,
     151,
     0
    ],
    [
     21.0,
     0.292,
     152,
     0
    ],
    [
     21.0,
     0.196,
     153,
     0
    ],
    [
     21.0,
     0.264,
     158,
     0
    ],
    [
     21.0,
     0.137,
     159,
     0
    ],
    [
     21.0,
     0.332,
     160,
     0
    ],
    [
     21.0,
     0.105,
     161,
     0
    ],
    [
     21.0,
     0.485,
     165,
     0
    ],
    [
     21.0,
     0.5,
     166,
     0
    ],
    [
     21.0,
     1.193,
     171,
     0
    ],
    [
     21.0,
     0.043,
     172,
     0
    ]
   ],
   "psi_id": "PSI-39",
   "reference": null,
   "source_files": [
    "PSI-39/CFI_DataSummary_Spreadsheet_Jan2021__Master_Sheet.csv"
   ],
   "table": "cfi",
   "x": {
    "col": "x_o2_pct",
    "label": "Oxygen in ambient gas",
    "unit": "%"
   },
   "y": {
    "col": "k_hot_mm2_s",
    "label": "Hot-flame burn rate K",
    "unit": "mm2/s"
   }
  },
  "PSI-69": {
   "n_plotted": 258,
   "n_total": 274,
   "points": [
    [
     21.0,
     0.52,
     0,
     0
    ],
    [
     21.0,
     0.6,
     1,
     0
    ],
    [
     21.0,
     0.58,
     2,
     0
    ],
    [
     21.0,
     0.6,
     3,
     0
    ],
    [
     21.0,
     0.48,
     4,
     0
    ],
    [
     21.0,
     0.51,
     5,
     0
    ],
    [
     21.0,
     0.67,
     6,
     0
    ],
    [
     21.0,
     0.79,
     7,
     0
    ],
    [
     21.0,
     0.37,
     9,
     0
    ],
    [
     21.0,
     0.4,
     10,
     0
    ],
    [
     21.0,
     0.49,
     12,
     0
    ],
    [
     21.0,
     0.53,
     15,
     0
    ],
    [
     21.0,
     0.61,
     17,
     0
    ],
    [
     34.0,
     0.9,
     18,
     0
    ],
    [
     34.0,
     0.53,
     19,
     0
    ],
    [
     34.0,
     0.66,
     20,
     0
    ],
    [
     34.0,
     0.65,
     21,
     0
    ],
    [
     34.0,
     0.73,
     22,
     0
    ],
    [
     30.0,
     0.65,
     24,
     0
    ],
    [
     30.0,
     0.62,
     25,
     0
    ],
    [
     30.0,
     0.64,
     26,
     0
    ],
    [
     30.0,
     0.64,
     27,
     0
    ],
    [
     30.0,
     0.74,
     28,
     0
    ],
    [
     30.0,
     0.59,
     29,
     0
    ],
    [
     30.0,
     0.85,
     30,
     0
    ],
    [
     30.0,
     0.68,
     31,
     0
    ],
    [
     21.0,
     0.48,
     32,
     0
    ],
    [
     21.0,
     0.44,
     33,
     0
    ],
    [
     21.0,
     0.43,
     34,
     0
    ],
    [
     20.0,
     0.45,
     35,
     0
    ],
    [
     34.0,
     0.72,
     36,
     0
    ],
    [
     34.0,
     0.71,
     37,
     0
    ],
    [
     34.0,
     0.8,
     38,
     0
    ],
    [
     30.0,
     0.62,
     39,
     0
    ],
    [
     30.0,
     0.65,
     40,
     0
    ],
    [
     30.0,
     0.58,
     41,
     0
    ],
    [
     30.0,
     0.78,
     42,
     0
    ],
    [
     30.0,
     0.63,
     43,
     0
    ],
    [
     30.0,
     0.73,
     44,
     0
    ],
    [
     21.0,
     0.54,
     45,
     0
    ],
    [
     21.0,
     0.5,
     46,
     0
    ],
    [
     21.0,
     0.27,
     47,
     0
    ],
    [
     21.0,
     0.59,
     48,
     0
    ],
    [
     21.0,
     0.52,
     49,
     0
    ],
    [
     21.0,
     0.65,
     50,
     0
    ],
    [
     30.0,
     0.7,
     51,
     0
    ],
    [
     20.0,
     0.41,
     53,
     0
    ],
    [
     20.0,
     0.46,
     54,
     0
    ],
    [
     20.0,
     0.44,
     55,
     0
    ],
    [
     20.0,
     0.54,
     56,
     0
    ],
    [
     18.0,
     0.42,
     57,
     0
    ],
    [
     18.0,
     0.43,
     58,
     0
    ],
    [
     18.0,
     0.45,
     59,
     0
    ],
    [
     18.0,
     0.41,
     60,
     0
    ],
    [
     18.0,
     0.39,
     61,
     0
    ],
    [
     18.0,
     0.51,
     62,
     0
    ],
    [
     18.0,
     0.6,
     63,
     0
    ],
    [
     15.0,
     0.4,
     64,
     0
    ],
    [
     15.0,
     0.38,
     65,
     0
    ],
    [
     15.0,
     0.36,
     66,
     0
    ],
    [
     15.0,
     0.39,
     67,
     0
    ],
    [
     14.000000000000002,
     0.94,
     68,
     0
    ],
    [
     15.0,
     0.41,
     69,
     0
    ],
    [
     15.0,
     0.4,
     70,
     0
    ],
    [
     15.0,
     0.52,
     71,
     0
    ],
    [
     15.0,
     0.56,
     72,
     0
    ],
    [
     15.0,
     0.77,
     73,
     0
    ],
    [
     13.0,
     0.37,
     74,
     0
    ],
    [
     13.0,
     0.37,
     75,
     0
    ],
    [
     14.000000000000002,
     0.34,
     76,
     0
    ],
    [
     14.000000000000002,
     0.35,
     77,
     0
    ],
    [
     13.0,
     0.25,
     78,
     0
    ],
    [
     13.0,
     0.35,
     81,
     0
    ],
    [
     12.0,
     0.35,
     83,
     0
    ],
    [
     12.0,
     0.35,
     84,
     0
    ],
    [
     12.0,
     0.35,
     85,
     0
    ],
    [
     12.0,
     0.38,
     86,
     0
    ],
    [
     25.0,
     0.53,
     87,
     0
    ],
    [
     25.0,
     0.51,
     88,
     0
    ],
    [
     25.0,
     0.53,
     89,
     0
    ],
    [
     25.0,
     0.51,
     90,
     0
    ],
    [
     25.0,
     0.55,
     91,
     0
    ],
    [
     25.0,
     0.71,
     92,
     0
    ],
    [
     24.0,
     0.51,
     93,
     0
    ],
    [
     24.0,
     0.58,
     94,
     0
    ],
    [
     23.0,
     0.45,
     96,
     0
    ],
    [
     23.0,
     0.47,
     97,
     0
    ],
    [
     23.0,
     0.42,
     98,
     0
    ],
    [
     23.0,
     0.34,
     99,
     0
    ],
    [
     23.0,
     0.5,
     100,
     0
    ],
    [
     21.0,
     0.33,
     101,
     0
    ],
    [
     21.0,
     0.35,
     102,
     0
    ],
    [
     23.0,
     0.49,
     103,
     0
    ],
    [
     23.0,
     0.47,
     104,
     0
    ],
    [
     23.0,
     0.51,
     105,
     0
    ],
    [
     23.0,
     0.52,
     106,
     0
    ],
    [
     23.0,
     0.47,
     107,
     0
    ],
    [
     21.0,
     0.42,
     108,
     0
    ],
    [
     21.0,
     0.45,
     109,
     0
    ],
    [
     21.0,
     0.45,
     110,
     0
    ],
    [
     21.0,
     0.43,
     111,
     0
    ],
    [
     20.0,
     0.49,
     112,
     0
    ],
    [
     20.0,
     0.42,
     113,
     0
    ],
    [
     20.0,
     0.41,
     114,
     0
    ],
    [
     20.0,
     0.46,
     115,
     0
    ],
    [
     20.0,
     0.25,
     116,
     0
    ],
    [
     20.0,
     0.38,
     117,
     0
    ],
    [
     18.0,
     0.37,
     118,
     0
    ],
    [
     18.0,
     0.38,
     119,
     0
    ],
    [
     18.0,
     0.34,
     120,
     0
    ],
    [
     18.0,
     0.41,
     121,
     0
    ],
    [
     18.0,
     0.35,
     122,
     0
    ],
    [
     18.0,
     0.3,
     123,
     0
    ],
    [
     17.0,
     0.35,
     124,
     0
    ],
    [
     17.0,
     0.4,
     125,
     0
    ],
    [
     17.0,
     0.38,
     126,
     0
    ],
    [
     17.0,
     0.39,
     127,
     0
    ],
    [
     17.0,
     0.33,
     128,
     0
    ],
    [
     17.0,
     0.05,
     129,
     0
    ],
    [
     24.0,
     0.61,
     130,
     0
    ],
    [
     24.0,
     0.6,
     131,
     0
    ],
    [
     24.0,
     0.56,
     132,
     0
    ],
    [
     24.0,
     0.56,
     133,
     0
    ],
    [
     24.0,
     0.59,
     134,
     0
    ],
    [
     24.0,
     0.51,
     135,
     0
    ],
    [
     24.0,
     0.55,
     136,
     0
    ],
    [
     24.0,
     0.63,
     138,
     0
    ],
    [
     15.0,
     0.2,
     139,
     0
    ],
    [
     15.0,
     0.3,
     140,
     0
    ],
    [
     15.0,
     0.39,
     141,
     0
    ],
    [
     15.0,
     0.36,
     142,
     0
    ],
    [
     20.0,
     0.45,
     143,
     0
    ],
    [
     20.0,
     0.45,
     144,
     0
    ],
    [
     20.0,
     0.41,
     145,
     0
    ],
    [
     17.0,
     0.4,
     146,
     0
    ],
    [
     20.0,
     0.54,
     147,
     0
    ],
    [
     20.0,
     0.53,
     148,
     0
    ],
    [
     20.0,
     0.46,
     149,
     0
    ],
    [
     18.0,
     0.36,
     150,
     0
    ],
    [
     18.0,
     0.43,
     151,
     0
    ],
    [
     18.0,
     0.42,
     152,
     0
    ],
    [
     18.0,
     0.34,
     153,
     0
    ],
    [
     18.0,
     0.39,
     154,
     0
    ],
    [
     18.0,
     0.48,
     155,
     0
    ],
    [
     16.0,
     0.3,
     156,
     0
    ],
    [
     16.0,
     0.37,
     157,
     0
    ],
    [
     16.0,
     0.38,
     158,
     0
    ],
    [
     16.0,
     0.38,
     159,
     0
    ],
    [
     15.0,
     0.28,
     160,
     0
    ],
    [
     15.0,
     0.37,
     161,
     0
    ],
    [
     15.0,
     0.37,
     162,
     0
    ],
    [
     15.0,
     0.42,
     163,
     0
    ],
    [
     18.0,
     0.54,
     164,
     0
    ],
    [
     14.000000000000002,
     0.28,
     165,
     0
    ],
    [
     14.000000000000002,
     0.37,
     166,
     0
    ],
    [
     21.0,
     0.48,
     167,
     0
    ],
    [
     21.0,
     0.51,
     168,
     0
    ],
    [
     21.0,
     0.46,
     169,
     0
    ],
    [
     18.0,
     0.35,
     170,
     0
    ],
    [
     18.0,
     0.46,
     171,
     0
    ],
    [
     18.0,
     0.5,
     172,
     0
    ],
    [
     24.0,
     0.56,
     173,
     0
    ],
    [
     24.0,
     0.55,
     174,
     0
    ],
    [
     24.0,
     0.46,
     175,
     0
    ],
    [
     24.0,
     0.52,
     176,
     0
    ],
    [
     23.0,
     0.5,
     177,
     0
    ],
    [
     23.0,
     0.57,
     178,
     0
    ],
    [
     19.0,
     0.41,
     179,
     0
    ],
    [
     19.0,
     0.49,
     180,
     0
    ],
    [
     19.0,
     0.54,
     181,
     0
    ],
    [
     23.0,
     0.53,
     182,
     0
    ],
    [
     23.0,
     0.51,
     183,
     0
    ],
    [
     23.0,
     0.51,
     184,
     0
    ],
    [
     23.0,
     0.52,
     185,
     0
    ],
    [
     19.0,
     0.47,
     186,
     0
    ],
    [
     19.0,
     0.46,
     187,
     0
    ],
    [
     18.0,
     0.42,
     188,
     0
    ],
    [
     18.0,
     0.5,
     189,
     0
    ],
    [
     18.0,
     0.46,
     190,
     0
    ],
    [
     17.0,
     0.39,
     191,
     0
    ],
    [
     17.0,
     0.4,
     192,
     0
    ],
    [
     17.0,
     0.29,
     193,
     0
    ],
    [
     17.0,
     0.36,
     194,
     0
    ],
    [
     20.0,
     0.52,
     195,
     0
    ],
    [
     20.0,
     0.49,
     196,
     0
    ],
    [
     20.0,
     0.53,
     197,
     0
    ],
    [
     20.0,
     0.49,
     198,
     0
    ],
    [
     20.0,
     0.47,
     199,
     0
    ],
    [
     20.0,
     0.48,
     200,
     0
    ],
    [
     21.0,
     0.47,
     201,
     0
    ],
    [
     21.0,
     0.52,
     202,
     0
    ],
    [
     21.0,
     0.43,
     203,
     0
    ],
    [
     21.0,
     0.42,
     204,
     0
    ],
    [
     21.0,
     0.5,
     205,
     0
    ],
    [
     21.0,
     0.54,
     206,
     0
    ],
    [
     21.0,
     0.69,
     207,
     0
    ],
    [
     16.0,
     0.34,
     208,
     0
    ],
    [
     16.0,
     0.42,
     210,
     0
    ],
    [
     15.0,
     0.37,
     211,
     0
    ],
    [
     14.000000000000002,
     0.24,
     212,
     0
    ],
    [
     14.000000000000002,
     0.39,
     213,
     0
    ],
    [
     14.000000000000002,
     0.3,
     214,
     0
    ],
    [
     14.000000000000002,
     0.38,
     215,
     0
    ],
    [
     13.0,
     0.36,
     216,
     0
    ],
    [
     13.0,
     0.35,
     217,
     0
    ],
    [
     12.0,
     0.36,
     218,
     0
    ],
    [
     12.0,
     0.35,
     219,
     0
    ],
    [
     12.0,
     0.38,
     220,
     0
    ],
    [
     20.0,
     0.51,
     221,
     0
    ],
    [
     20.0,
     0.57,
     223,
     0
    ],
    [
     19.0,
     0.57,
     224,
     0
    ],
    [
     18.0,
     0.51,
     225,
     0
    ],
    [
     18.0,
     0.53,
     226,
     0
    ],
    [
     21.0,
     0.52,
     227,
     0
    ],
    [
     21.0,
     0.57,
     228,
     0
    ],
    [
     21.0,
     0.57,
     229,
     0
    ],
    [
     19.0,
     0.54,
     230,
     0
    ],
    [
     18.0,
     0.41,
     231,
     0
    ],
    [
     18.0,
     0.49,
     232,
     0
    ],
    [
     18.0,
     0.51,
     233,
     0
    ],
    [
     17.0,
     0.46,
     234,
     0
    ],
    [
     17.0,
     0.59,
     235,
     0
    ],
    [
     17.0,
     0.91,
     237,
     0
    ],
    [
     17.0,
     0.49,
     238,
     0
    ],
    [
     17.0,
     0.51,
     239,
     0
    ],
    [
     16.0,
     0.51,
     240,
     0
    ],
    [
     16.0,
     0.6,
     242,
     0
    ],
    [
     15.0,
     0.43,
     243,
     0
    ],
    [
     15.0,
     0.56,
     244,
     0
    ],
    [
     14.000000000000002,
     0.56,
     245,
     0
    ],
    [
     14.000000000000002,
     0.58,
     246,
     0
    ],
    [
     13.0,
     0.51,
     247,
     0
    ],
    [
     24.0,
     0.72,
     248,
     0
    ],
    [
     23.0,
     0.71,
     249,
     0
    ],
    [
     24.0,
     0.62,
     250,
     0
    ],
    [
     24.0,
     0.7,
     251,
     0
    ],
    [
     23.0,
     0.6,
     252,
     0
    ],
    [
     23.0,
     0.73,
     253,
     0
    ],
    [
     21.0,
     0.56,
     254,
     0
    ],
    [
     21.0,
     0.65,
     255,
     0
    ],
    [
     21.0,
     0.7,
     256,
     0
    ],
    [
     21.0,
     0.67,
     257,
     0
    ],
    [
     21.0,
     0.7,
     258,
     0
    ],
    [
     20.0,
     0.61,
     259,
     0
    ],
    [
     20.0,
     0.67,
     260,
     0
    ],
    [
     20.0,
     0.6,
     261,
     0
    ],
    [
     20.0,
     0.63,
     262,
     0
    ],
    [
     18.0,
     0.59,
     263,
     0
    ],
    [
     18.0,
     0.63,
     264,
     0
    ],
    [
     18.0,
     0.62,
     265,
     0
    ],
    [
     18.0,
     0.71,
     266,
     0
    ],
    [
     18.0,
     0.77,
     267,
     0
    ],
    [
     17.0,
     0.76,
     268,
     0
    ],
    [
     17.0,
     1.06,
     269,
     0
    ],
    [
     17.0,
     0.63,
     270,
     0
    ],
    [
     17.0,
     0.66,
     271,
     0
    ],
    [
     21.0,
     0.55,
     272,
     0
    ],
    [
     21.0,
     0.65,
     273,
     0
    ]
   ],
   "psi_id": "PSI-69",
   "reference": null,
   "source_files": [
    "PSI-69/PSI-69_Experimental_table_FLEX.csv"
   ],
   "table": "flex",
   "x": {
    "col": "x_o2_pct",
    "label": "Oxygen in ambient gas",
    "unit": "%"
   },
   "y": {
    "col": "burn_rate_K_mm2_s",
    "label": "Burn rate K",
    "unit": "mm2/s (assumed)"
   }
  }
 }
};
window.FF.siteData = window.FF.site;
