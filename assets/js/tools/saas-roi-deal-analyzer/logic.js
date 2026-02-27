/**
 * SaaS ROI Deal Analyzer - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  window.NSB_SAAS_ROI = {
    calculate(inputs) {
      const cac = parse(inputs.cac);
      const arpa = parse(inputs.arpa);
      const marginParsed = parse(inputs.grossMargin);
      const churn = parse(inputs.monthlyChurn);

      const margin = Number.isFinite(marginParsed) ? marginParsed : 80;

      // Required fields
      if (!Number.isFinite(cac) || !Number.isFinite(arpa) || !Number.isFinite(churn)) {
        return { error: "Enter CAC, ARPA, and monthly churn." };
      }
      if (cac <= 0) return { error: "CAC must be greater than 0." };
      if (arpa <= 0) return { error: "ARPA must be greater than 0." };

      // Percent range validation
      if (!Number.isFinite(margin) || margin < 0 || margin > 100) {
        return { error: "Gross margin must be between 0 and 100." };
      }
      if (churn <= 0 || churn >= 100) {
        return { error: "Monthly churn must be between 0 and 100." };
      }

      const lifetimeMonths = 100 / churn; // expected lifetime approximation
      const contribPerMonth = arpa * (margin / 100);

      if (contribPerMonth <= 0) {
        return { error: "Gross profit per month must be greater than 0." };
      }

      const ltv = contribPerMonth * lifetimeMonths;
      const paybackMonths = cac / contribPerMonth;
      const roi = ((ltv - cac) / cac) * 100;

      return {
        lifetimeMonths,
        ltv,
        paybackMonths,
        roi,
        contribPerMonth,
        cac,
        arpa,
        margin,
        churn
      };
    }
  };
})();
