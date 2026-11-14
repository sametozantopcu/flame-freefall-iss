/* Tüm sabitler tek yerde (repodaki app/config.py'nin karşılığı).
 * Fizik sabitleri oradan birebir alındı; kaynak: BASS-II Summary Report.
 */
(function (FF) {
  FF.config = {
    // Olson U-şekilli yanabilirlik sınırı
    //   X_O2 = A exp(-B a) + C a + D     [% hacim O2]
    //   a    = 1.5 (U / r) (r / 0.318)^0.5   [1/s], U [cm/s], r [cm]
    OLSON_A: 6.0,
    OLSON_B: 0.5,
    OLSON_C: 0.0167,
    OLSON_D: 13.4,
    R_REF_CM: 0.318,              // 1/8 inç referans yarıçap

    // Ekipman ekranındaki bulgular
    EARTH_PMMA_LOI_PCT: 15.4,     // Dünya'da PMMA'nın söndüğü O2 seviyesi
    MICROG_PMMA_LIMIT_PCT: 13.5,  // BASS-II: düşük akışta yanmanın sürdüğü en düşük O2
    AIR_O2_PCT: 21,
    STD6001_IGNITION_S: 25,       // NASA-STD-6001 Test 1 tutuşturucu süresi
    BASS2_MAX_IGNITION_S: 230,    // BASS-II'de gözlenen en uzun tutuşma gecikmesi
    GOLDILOCKS_CM_S: [1, 5],      // alevin en dirençli olduğu akış bandı
    CO_MAX_ENHANCEMENT: 10,       // sınır yakınında Dünya'ya göre ~10x CO
    CO_SENSOR_SAT_PPM: 1000,

    // Senaryo ekranı: seçenekler ve başlangıç değerleri
    O2_OPTIONS: [15, 17, 19, 21, 22],
    FLOW_OPTIONS: [0.5, 1, 2, 5, 10, 20],
    DEFAULT_O2: 17,
    DEFAULT_FLOW: 2,
    NEAREST_COUNT: 4,

    // Keşif ekranı
    DEFAULT_EXPERIMENT: 'PSI-25',
    CHART_EXPERIMENT: 'PSI-25',   // grafiği olan tek deney
    BASS2_PERIOD: ['2014-02', '2014-08'],
    BASS2_HARDWARE: 'MSG',
    BASS2_INVESTIGATORS: 6,

    // Canlı ekranı: ÖRNEK değerler. Cihaz bağlanınca buradan değil MQTT'den okunacak.
    LIVE_SAMPLE: {
      connected: false,
      o2_pct: 20.9,
      co_ppm: 2,
      co2_pct: 0.30,
      flow_cm_s: 3.2,
      pressure_kpa: 101.3,
      ir_max_c: 31
    },

    // U-eğrisi grafiğinin eksenleri
    CHART: { U_MAX: 20, O2_MIN: 13, O2_MAX: 22.5 }
  };
})(window.FF = window.FF || {});
