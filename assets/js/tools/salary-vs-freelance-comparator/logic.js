/**
 * Salary vs Freelance Comparator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  window.NSB_SALARY_FREELANCE = {
    calculate(inputs) {
      const salaryRaw = parse(inputs.salaryW2);
      const benefitsRaw = parse(inputs.benefitsValue);
      const taxesRaw = parse(inputs.taxesPercent);
      const freelanceRateRaw = parse(inputs.freelanceHourlyRate);
      const utilRaw = parse(inputs.utilization);
      const expensesRaw = parse(inputs.expenses);

      if (!Number.isFinite(salaryRaw) || salaryRaw <= 0) {
        return { error: "Enter a W2 salary greater than 0." };
      }

      const salary = salaryRaw;
      const benefits = Number.isFinite(benefitsRaw) ? Math.max(0, benefitsRaw) : 0;
      const expenses = Number.isFinite(expensesRaw) ? Math.max(0, expensesRaw) : 0;

      const taxesPct = Number.isFinite(taxesRaw) ? clamp(taxesRaw, 0, 60) : 25;
      const taxMult = 1 - (taxesPct / 100);

      const utilPct = Number.isFinite(utilRaw) ? clamp(utilRaw, 1, 100) : 70;
      const util = utilPct;

      const freelanceRate = Number.isFinite(freelanceRateRaw) ? Math.max(0, freelanceRateRaw) : 0;

      const hoursYear = 2000;
      const billableHoursYear = hoursYear * (util / 100);

      const totalCompGross = salary + benefits;
      const w2AnnualGross = totalCompGross;
      const w2AnnualNet = w2AnnualGross * taxMult;

      const effectiveW2HourlyGross = w2AnnualGross / hoursYear;
      const effectiveW2HourlyNet = w2AnnualNet / hoursYear;

      const freelanceGross = freelanceRate * billableHoursYear;
      const freelanceNetBeforeTax = freelanceGross - expenses;
      const freelanceNetAfterTax = freelanceNetBeforeTax * taxMult;

      // Breakeven hourly to MATCH W2 gross comp (coverage)
      const breakevenHourlyGross = (w2AnnualGross + expenses) / billableHoursYear;

      // Optional: breakeven hourly to MATCH W2 after-tax take-home
      const breakevenHourlyNet = (w2AnnualNet + expenses) / billableHoursYear;

      return {
        // Backward compatible fields
        effectiveW2Hourly: effectiveW2HourlyGross,
        freelanceNetAnnual: freelanceNetAfterTax,
        freelanceNetMonthly: freelanceNetAfterTax / 12,
        breakevenHourly: breakevenHourlyGross,
        freelanceGross,
        util,
        expenses,

        // Extra clarity fields (UI can ignore for now)
        w2AnnualGross,
        w2AnnualNet,
        effectiveW2HourlyGross,
        effectiveW2HourlyNet,
        freelanceNetBeforeTax,
        freelanceNetAfterTax,
        breakevenHourlyGross,
        breakevenHourlyNet,
        taxesPercent: taxesPct,
        benefitsValue: benefits
      };
    }
  };
})();
