/* Mikro-yerçekimi yanma fiziği: saf fonksiyonlar (arayüzden bağımsız).
 * Repodaki app/core/physics.py'nin Olson bölümünün birebir karşılığı.
 * Metin üretmez; regime() dilden bağımsız bir kod döndürür.
 */
(function (FF) {
  var C = FF.config;

  /** Gerilme hızı a [1/s] = 1.5 (U/r) (r/0.318)^0.5 */
  function strainRate(uCmS, rCm) {
    var r = Math.max(rCm, 1e-6);
    return 1.5 * (uCmS / r) * Math.sqrt(r / C.R_REF_CM);
  }

  /** Sınır O2 mol yüzdesi X_O2 = 6 exp(-0.5a) + 0.0167a + 13.4 */
  function olsonLimit(a) {
    return C.OLSON_A * Math.exp(-C.OLSON_B * a) + C.OLSON_C * a + C.OLSON_D;
  }

  function limitVsVelocity(uCmS, rCm) {
    return olsonLimit(strainRate(uCmS, rCm));
  }

  /** U-eğrisinin minimumu: dX/da = 0 -> a* = (1/B) ln(A·B / C) */
  function optimalStrainRate() {
    return Math.log(C.OLSON_A * C.OLSON_B / C.OLSON_C) / C.OLSON_B;
  }

  function minimumLimit() {
    return olsonLimit(optimalStrainRate());
  }

  /** a'yı veren akış hızı (strainRate'in tersi). */
  function velocityForStrain(a, rCm) {
    return a * rCm / (1.5 * Math.sqrt(rCm / C.R_REF_CM));
  }

  /** Sınırın en düşük olduğu, yani alevin en dirençli olduğu akış hızı. */
  function mostDangerousVelocity(rCm) {
    return velocityForStrain(optimalStrainRate(), rCm);
  }

  /** U-eğrisinin hangi kolunda olduğumuz. */
  function regime(a) {
    var aStar = optimalStrainRate();
    if (a < 0.15 * aStar) return 'quiescent';
    if (a < aStar) return 'radiative';
    return 'blowoff';
  }

  FF.physics = {
    strainRate: strainRate,
    olsonLimit: olsonLimit,
    limitVsVelocity: limitVsVelocity,
    optimalStrainRate: optimalStrainRate,
    minimumLimit: minimumLimit,
    velocityForStrain: velocityForStrain,
    mostDangerousVelocity: mostDangerousVelocity,
    regime: regime
  };
})(window.FF = window.FF || {});
