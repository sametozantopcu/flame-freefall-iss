/* Veri: deney listesi ve BASS-II testleri (arayüzden bağımsız).
 *
 * Bu dosya veriseti/ klasöründen üretildi; elle düzenleme.
 *   EXPERIMENTS : her deneyin raw/ altındaki detail.json dosyası (ad, başlık) + csv/manifest.csv (deney tablosu satır sayısı)
 *   BASS2_TESTS : raw/PSI-25/PSI-25_Experimental table_BASS-II.csv -> [test, araştırmacı, başlangıç O2 yüzdesi]
 * rows = null: deneyin PSI'da deney tablosu yok.
 */
(function (FF) {
  var EXPERIMENTS = [
      {
          "psi": "PSI-159",
          "name": "ACME CFI-G",
          "title": "Advanced Combustion via Microgravity Experiments / Cool Flames Investigation with Gases",
          "rows": 1194
      },
      {
          "psi": "PSI-107",
          "name": "SPICE",
          "title": "Smoke Point In Co-flow Experiment",
          "rows": 469
      },
      {
          "psi": "PSI-10",
          "name": "ACME/Flame Design",
          "title": "Advanced Combustion via Microgravity Experiments / Flame Design",
          "rows": 327
      },
      {
          "psi": "PSI-69",
          "name": "FLEX",
          "title": "Flame Extinguishment Experiment",
          "rows": 274
      },
      {
          "psi": "PSI-25",
          "name": "BASS-II",
          "title": "Burning and Suppression of Solids - II",
          "rows": 129
      },
      {
          "psi": "PSI-26",
          "name": "BASS",
          "title": "Burning and Suppression of Solids",
          "rows": 122
      },
      {
          "psi": "PSI-101",
          "name": "SAME-R",
          "title": "Smoke Aerosol Measurement Experiment-Reflight",
          "rows": 109
      },
      {
          "psi": "PSI-39",
          "name": "CFI",
          "title": "Cool Flames Investigation",
          "rows": 87
      },
      {
          "psi": "PSI-21",
          "name": "ACME CLD Flame",
          "title": "Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame",
          "rows": 32
      },
      {
          "psi": "PSI-22",
          "name": "ACME E-FIELD Flames",
          "title": "Advanced Combustion via Microgravity Experiments Electric-Field Effects on Laminar Diffusion Flames",
          "rows": 32
      },
      {
          "psi": "PSI-20",
          "name": "ACME BRE",
          "title": "Advanced Combustion via Microgravity Experiments - Burning Rate Emulator",
          "rows": 18
      },
      {
          "psi": "PSI-23",
          "name": "ACME s-Flame",
          "title": "Advanced Combustion via Microgravity Experiments-Structure and Response of Spherical Diffusion Flames",
          "rows": 18
      },
      {
          "psi": "PSI-99",
          "name": "SAFFIRE-II",
          "title": "Spacecraft Fire Experiment-II",
          "rows": 15
      },
      {
          "psi": "PSI-106",
          "name": "SLICE",
          "title": "Structure and Liftoff In Combustion Experiment",
          "rows": 12
      },
      {
          "psi": "PSI-68",
          "name": "FLEX-2",
          "title": "Flame Extinguishment Experiment - 2",
          "rows": 8
      },
      {
          "psi": "PSI-102",
          "name": "SAME",
          "title": "Smoke and Aerosol Measurement Experiment",
          "rows": 8
      },
      {
          "psi": "PSI-142",
          "name": "PSI-142",
          "title": "Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames",
          "rows": 8
      },
      {
          "psi": "PSI-98",
          "name": "SAFFIRE-I",
          "title": "Spacecraft Fire Safety Experiment-I",
          "rows": 4
      },
      {
          "psi": "PSI-47",
          "name": "DAFT / DAFT-2",
          "title": "Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2",
          "rows": 2
      },
      {
          "psi": "PSI-100",
          "name": "SAFFIRE-III",
          "title": "Spacecraft Fire Experiment-III",
          "rows": 2
      },
      {
          "psi": "PSI-60",
          "name": "PSI-60",
          "title": "Computational and Experimental Analysis of SPICE Data Sets",
          "rows": null
      },
      {
          "psi": "PSI-62",
          "name": "PSI-62",
          "title": "Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography",
          "rows": null
      },
      {
          "psi": "PSI-115",
          "name": "PSI-115",
          "title": "Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity",
          "rows": null
      },
      {
          "psi": "PSI-117",
          "name": "PSI-117",
          "title": "Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis",
          "rows": null
      }
  ];

  var BASS2_TESTS = [["B1","Bhattacharjee",22.2],["B2","Bhattacharjee",22.2],["B3","Bhattacharjee",22.2],["B4","Bhattacharjee",22.2],["B5","Bhattacharjee",22.2],["B6","Bhattacharjee",21.0],["B7","Bhattacharjee",22.2],["B8","Bhattacharjee",21.0],["B9","Bhattacharjee",21.0],["B10","Bhattacharjee",21.0],["B11","Bhattacharjee",21.0],["B12","Bhattacharjee",22.2],["B13","Bhattacharjee",21.0],["B14","Bhattacharjee",15.0],["B15","Bhattacharjee",21.0],["B16","Bhattacharjee",17.3],["B17","Bhattacharjee",17.5],["B18","Bhattacharjee",17.4],["B19","Bhattacharjee",17.3],["B20","Bhattacharjee",17.4],["B21","Bhattacharjee",20.8],["B22","Bhattacharjee",20.7],["F1","Ferkul",22.2],["F2","Ferkul",21.0],["F3","Ferkul",21.7],["F4","Ferkul",17.4],["M1","Miller",22.2],["M2","Miller",22.2],["M3","Miller",20.8],["M4","Miller",21.8],["M5","Miller",22.2],["M6","Miller",21.8],["M7","Miller",18.9],["M8","Miller",19.1],["M9","Miller",18.0],["M10","Miller",20.1],["M11","Miller",20.0],["M12","Miller",21.7],["M13","Miller",20.8],["M14","Miller",22.2],["M15","Miller",21.0],["M16","Miller",19.2],["M17","Miller",18.8],["M18","Miller",17.9],["M19","Miller",19.0],["M20","Miller",18.0],["O1","Olson",22.2],["O2","Olson",22.2],["O3a","Olson",18.0],["O3b","Olson",18.0],["O4","Olson",14.8],["O5a","Olson",15.1],["O5b","Olson",14.2],["O6","Olson",16.7],["O7","Olson",16.0],["O8a","Olson",15.7],["O8b","Olson",15.5],["O9","Olson",15.0],["O10","Olson",16.7],["O11","Olson",15.4],["O12","Olson",13.6],["O13a","Olson",15.9],["O13b","Olson",14.6],["O14","Olson",16.3],["O15a","Olson",17.1],["O15b","Olson",16.7],["O16","Olson",14.5],["O17","Olson",15.1],["O18","Olson",15.2],["O19","Olson",15.3],["O20","Olson",16.5],["O21","Olson",15.9],["O22","Olson",15.4],["P1","Fernandez-Pello",17.7],["P2","Fernandez-Pello",17.4],["P3a","Fernandez-Pello",17.7],["P3b","Fernandez-Pello",17.4],["P4","Fernandez-Pello",18.5],["P5","Fernandez-Pello",19.3],["P6","Fernandez-Pello",18.9],["P8","Fernandez-Pello",16.4],["P9","Fernandez-Pello",17.6],["P10","Fernandez-Pello",17.0],["P12","Fernandez-Pello",17.5],["P13a","Fernandez-Pello",20.7],["P13b","Fernandez-Pello",20.6],["P14","Fernandez-Pello",18.4],["P15","Fernandez-Pello",18.0],["P16","Fernandez-Pello",18.2],["P17","Fernandez-Pello",16.8],["P18","Fernandez-Pello",20.0],["P19","Fernandez-Pello",17.5],["P20","Fernandez-Pello",19.0],["P21a","Fernandez-Pello",16.3],["P21b","Fernandez-Pello",16.3],["P22a","Fernandez-Pello",20.8],["P22b","Fernandez-Pello",20.0],["P23","Fernandez-Pello",18.2],["P24","Fernandez-Pello",19.0],["P25","Fernandez-Pello",20.9],["T1","T'ien",18.5],["T2","T'ien",18.5],["T3","T'ien",17.2],["T4","T'ien",18.7],["T5","T'ien",18.8],["T6","T'ien",18.8],["T7","T'ien",17.3],["T9","T'ien",16.4],["T10","T'ien",16.4],["T11","T'ien",17.1],["T12","T'ien",16.8],["T13","T'ien",17.5],["T14","T'ien",16.9],["T15","T'ien",18.7],["T16","T'ien",17.6],["T17","T'ien",16.9],["T18","T'ien",17.4],["T19","T'ien",17.2],["T20","T'ien",17.2],["T21","T'ien",17.2],["T22","T'ien",17.1],["T23","T'ien",17.2],["T24","T'ien",18.2],["T25","T'ien",20.8],["T26","T'ien",20.8],["T27","T'ien",20.7],["T28a","T'ien",20.7],["T28b","T'ien",20.7],["T29","T'ien",20.7]];

  /** Başlangıç O2 değerine göre test sayıları: [[o2, adet], ...], artan sırada. */
  function o2Histogram() {
    var counts = {};
    BASS2_TESTS.forEach(function (t) { counts[t[2].toFixed(1)] = (counts[t[2].toFixed(1)] || 0) + 1; });
    return Object.keys(counts).map(function (k) { return [parseFloat(k), counts[k]]; })
      .sort(function (a, b) { return a[0] - b[0]; });
  }

  /** O2 değeri verilen değere en yakın n test (eşitlikte tablo sırası korunur). */
  function nearestByO2(o2, n) {
    return BASS2_TESTS.map(function (t, i) { return { test: t[0], pi: t[1], o2: t[2], i: i, d: Math.abs(t[2] - o2) }; })
      .sort(function (a, b) { return a.d - b.d || a.i - b.i; })
      .slice(0, n);
  }

  function o2Range() {
    var v = BASS2_TESTS.map(function (t) { return t[2]; });
    return [Math.min.apply(null, v), Math.max.apply(null, v)];
  }

  FF.data = {
    EXPERIMENTS: EXPERIMENTS,
    BASS2_TESTS: BASS2_TESTS,
    o2Histogram: o2Histogram,
    nearestByO2: nearestByO2,
    o2Range: o2Range
  };
})(window.FF = window.FF || {});
