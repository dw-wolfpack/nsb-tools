/**
 * Burn Rate / Runway Calculator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  window.NSB_BURN_RATE = {
    calculate(inputs) {
      const cashRaw = parse(inputs.cashOnHand);
      const revenueRaw = parse(inputs.monthlyRevenue);
      const expensesRaw = parse(inputs.monthlyExpenses);
      const growthRaw = parse(inputs.revenueGrowthRate);

      // Required: cash + expenses (revenue can be 0)
      if (!Number.isFinite(cashRaw) || cashRaw < 0) return { error: "Cash on hand must be 0 or greater." };
      if (!Number.isFinite(expensesRaw) || expensesRaw < 0) return { error: "Monthly expenses must be 0 or greater." };

      const cash = cashRaw;
      const revenue = Number.isFinite(revenueRaw) ? Math.max(0, revenueRaw) : 0;
      const expenses = expensesRaw;

      // Revenue growth can be negative, clamp to avoid insane values
      const growthRate = Number.isFinite(growthRaw) ? clamp(growthRaw, -50, 200) : 0;

      const netBurn = expenses - revenue; // >0 means burning
      let runwayMonths = null;
      let runwayLabel = "";

      if (netBurn <= 0) {
        runwayMonths = null;
        runwayLabel = "Infinite (not burning)";
      } else if (cash === 0) {
        runwayMonths = 0;
        runwayLabel = "0 months (no cash)";
      } else {
        runwayMonths = cash / netBurn;
        runwayLabel = "";
      }

      // 12-month projection
      const projection = [];
      let c = cash;
      let r = revenue;

      for (let i = 0; i < 12; i++) {
        c = c - expenses + r;
        r = r * (1 + growthRate / 100);

        projection.push({
          month: i + 1,
          cash: Math.round(c),
          revenue: Math.round(r),
          expenses: Math.round(expenses),
          cashRaw: c,
          revenueRaw: r,
          expensesRaw: expenses
        });
      }

      return {
        netBurn,
        runwayMonths,
        runwayLabel,
        projection,
        cash,
        monthlyRevenue: revenue,
        monthlyExpenses: expenses,
        revenueGrowthRate: growthRate
      };
    }
  };
})();
