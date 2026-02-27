/**
 * Freelance Rate Calculator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  window.NSB_FREELANCE_RATE = {
    calculate(inputs) {
      const desiredAnnualRaw = parse(inputs.desiredAnnualIncome);
      const expensesRaw = parse(inputs.annualExpenses);
      const billableHRaw = parse(inputs.billableHoursPerWeek);
      const vacationWRaw = parse(inputs.vacationWeeks);
      const utilizationRaw = parse(inputs.utilizationRate);
      const bufferRaw = parse(inputs.bufferPercent);

      if (!Number.isFinite(desiredAnnualRaw) || desiredAnnualRaw <= 0) {
        return { error: "Desired annual income must be greater than 0." };
      }

      const desiredAnnual = desiredAnnualRaw;

      const expenses = Number.isFinite(expensesRaw) ? Math.max(0, expensesRaw) : 0;

      // Guardrails
      const billableH = Number.isFinite(billableHRaw) ? clamp(billableHRaw, 1, 80) : 0;
      if (billableH <= 0) return { error: "Billable hours per week must be greater than 0." };

      const vacationW = Number.isFinite(vacationWRaw) ? clamp(vacationWRaw, 0, 52) : 0;

      const utilization = Number.isFinite(utilizationRaw) ? clamp(utilizationRaw, 1, 100) : 70;

      const buffer = Number.isFinite(bufferRaw) ? clamp(bufferRaw, 0, 200) : 20;

      const weeksPerYear = 52 - vacationW;
      const totalHours = weeksPerYear * billableH;
      const billableHoursAnnual = totalHours * (utilization / 100);

      if (billableHoursAnnual <= 0) {
        return { error: "Billable hours per year must be greater than 0. Check vacation and utilization." };
      }

      const grossNeeded = desiredAnnual + expenses;
      const withBuffer = grossNeeded * (1 + buffer / 100);

      const hourlyRate = withBuffer / billableHoursAnnual;
      const dayRate = hourlyRate * 8;
      const weeklyRate = hourlyRate * billableH;

      const monthlyTarget = grossNeeded / 12;
      const monthlyTargetWithBuffer = withBuffer / 12;

      return {
        hourlyRate,
        dayRate,
        weeklyRate,
        monthlyTarget,
        monthlyTargetWithBuffer,

        project10h: hourlyRate * 10,
        project20h: hourlyRate * 20,
        project40h: hourlyRate * 40,

        utilization,
        buffer,
        billableHoursAnnual,

        weeksPerYear,
        expenses,
        grossNeeded,
        withBuffer
      };
    }
  };
})();
