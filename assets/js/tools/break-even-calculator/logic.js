/**
 * Break-even Calculator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  function normMode(m) {
    const s = String(m || "").toLowerCase();
    if (s === "saas") return "saas";
    if (s === "ecommerce" || s === "ecom") return "ecommerce";
    return "service";
  }

  window.NSB_BREAKEVEN = {
    calculate(inputs) {
      const mode = normMode(inputs.mode || "service");
      const fixedRaw = parse(inputs.fixedCostsPerMonth);
      const fixed = Number.isFinite(fixedRaw) ? fixedRaw : 0;

      if (fixed < 0) return { error: "Fixed costs must be 0 or greater." };

      // SaaS mode: break-even in customers and MRR
      if (mode === "saas") {
        const marginRaw = parse(inputs.grossMargin);
        const margin = Number.isFinite(marginRaw) ? marginRaw : 80;
        const arpa = parse(inputs.arpa);

        if (!Number.isFinite(arpa) || arpa <= 0) return { error: "ARPA must be greater than 0." };
        if (!Number.isFinite(margin) || margin <= 0 || margin > 100) {
          return { error: "Gross margin must be between 0 and 100." };
        }

        const contribPer = arpa * (margin / 100);
        if (contribPer <= 0) return { error: "Contribution per customer must be greater than 0." };

        const customers = fixed === 0 ? 0 : Math.ceil(fixed / contribPer);
        const mrr = customers * arpa;

        return {
          mode: "saas",
          customersToBreakEven: customers,
          mrrToBreakEven: mrr,
          contributionPer: contribPer,
          grossMargin: margin,
          arpa,
          fixed
        };
      }

      // Service/Ecommerce mode: break-even in units and revenue
      const variableRaw = parse(inputs.variableCostPerUnit);
      const priceRaw = parse(inputs.pricePerUnit);

      const variable = Number.isFinite(variableRaw) ? variableRaw : 0;
      const price = Number.isFinite(priceRaw) ? priceRaw : 0;

      if (price <= 0) return { error: "Price per unit must be greater than 0." };
      if (variable < 0) return { error: "Variable cost must be 0 or greater." };
      if (variable >= price) return { error: "Price must exceed variable cost." };

      const contrib = price - variable;
      const marginPct = (contrib / price) * 100;

      const units = fixed === 0 ? 0 : Math.ceil(fixed / contrib);
      const revenue = units * price;

      return {
        mode,
        unitsToBreakEven: units,
        revenueToBreakEven: revenue,
        contributionMargin: marginPct,
        contributionPerUnit: contrib,
        fixed,
        variable,
        price
      };
    }
  };
})();
