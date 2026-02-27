/**
 * Project Pricing Calculator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  window.NSB_PROJECT_PRICING = {
    calculate(inputs) {
      const hoursRaw = parse(inputs.estimatedHours);
      const rateRaw = parse(inputs.hourlyRate);
      const complexityRaw = parse(inputs.complexityMultiplier);
      const riskBufferRaw = parse(inputs.riskBufferPercent);
      const expensesRaw = parse(inputs.expenses);
      const hoursPerWeekRaw = parse(inputs.hoursPerWeek);

      if (!Number.isFinite(hoursRaw) || hoursRaw <= 0) {
        return { error: "Estimated hours must be greater than 0." };
      }
      if (!Number.isFinite(rateRaw) || rateRaw <= 0) {
        return { error: "Hourly rate must be greater than 0." };
      }

      const hours = clamp(hoursRaw, 0.25, 100000);
      const rate = clamp(rateRaw, 1, 100000);

      // Match UI hint: 0.8-1.5
      const complexity = Number.isFinite(complexityRaw) ? clamp(complexityRaw, 0.8, 1.5) : 1;

      const riskBuffer = Number.isFinite(riskBufferRaw) ? clamp(riskBufferRaw, 0, 200) : 20;

      const expenses = Number.isFinite(expensesRaw) ? Math.max(0, expensesRaw) : 0;

      const totalBeforeBuffer = hours * rate * complexity;
      const bufferAmount = totalBeforeBuffer * (riskBuffer / 100);
      const totalWithBuffer = totalBeforeBuffer + bufferAmount;
      const target = totalWithBuffer + expenses;

      // Quote range: +/- 10% around target
      const rangePct = 10;
      const low = target * (1 - rangePct / 100);
      const high = target * (1 + rangePct / 100);

      // Deposit: 40% default (keep existing)
      const depositPct = 40;
      const deposit = target * (depositPct / 100);

      const hoursPerWeek = Number.isFinite(hoursPerWeekRaw) ? clamp(hoursPerWeekRaw, 1, 80) : 20;
      const weeksEstimate = hoursPerWeek > 0 ? Math.ceil(hours / hoursPerWeek) : null;

      return {
        low,
        target,
        high,
        deposit,
        weeksEstimate,

        // existing keys kept
        riskBuffer,
        base: totalBeforeBuffer,

        // extra transparency (UI can ignore safely)
        totalBeforeBuffer,
        bufferAmount,
        totalWithBuffer,
        expenses,
        complexity,
        depositPercentUsed: depositPct,
        rangePercentUsed: rangePct,
        hours,
        rate,
        hoursPerWeek
      };
    }
  };
})();
