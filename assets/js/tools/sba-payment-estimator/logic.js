(function () {
  "use strict";
  window.NSB_SBA = {
    calculate(inputs) {
      const principal = parseFloat(inputs.principal) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const years = parseFloat(inputs.years) || 10;
      const noi = parseFloat(inputs.noi) || 0;
      if (principal <= 0 || rate < 0) return null;
      const monthlyRate = (rate / 100) / 12;
      const n = years * 12;
      const payment = monthlyRate === 0 ? principal / n : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      const annualDebt = payment * 12;
      const dscr = noi > 0 ? noi / annualDebt : null;
      return { monthlyPI: payment, annualDebt, dscr };
    }
  };
})();
