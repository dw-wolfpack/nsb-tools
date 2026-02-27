/**
 * Loan / Debt Payoff Calculator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  window.NSB_LOAN_PAYOFF = {
    calculate(inputs) {
      const principal = parse(inputs.principal);
      const rateAnnual = parse(inputs.interestRate);
      const monthlyPay = parse(inputs.monthlyPayment);
      const extraPayRaw = parse(inputs.extraPayment);

      const extraPay = Number.isFinite(extraPayRaw) ? extraPayRaw : 0;

      // Required
      if (!Number.isFinite(principal) || !Number.isFinite(monthlyPay)) {
        return { error: "Enter principal and monthly payment." };
      }
      if (principal <= 0) return { error: "Principal must be greater than 0." };
      if (monthlyPay <= 0) return { error: "Monthly payment must be greater than 0." };

      // Rate handling
      const rate = Number.isFinite(rateAnnual) ? rateAnnual : 0;
      if (rate < 0) return { error: "Interest rate cannot be negative." };

      if (extraPay < 0) return { error: "Extra payment cannot be negative." };

      const monthlyRate = (rate / 100) / 12;
      const totalPay = monthlyPay + extraPay;

      // Interest-only guard (rate > 0)
      if (monthlyRate > 0) {
        const firstMonthInterest = principal * monthlyRate;
        if (totalPay <= firstMonthInterest + 1e-9) {
          return { error: "Payment is too low to reduce principal. Increase payment or lower rate." };
        }
      }

      // With extra
      let bal = principal;
      let months = 0;
      let totalInterest = 0;
      const schedule = [];

      while (bal > 0 && months < 1200) {
        const startingBal = bal;
        const interestPay = startingBal * monthlyRate;
        const remainingAfterInterest = totalPay - interestPay;

        if (remainingAfterInterest <= 0) {
          return { error: "Payment is too low to reduce principal. Increase payment or lower rate." };
        }

        const prinPay = Math.min(bal, remainingAfterInterest);
        const endingBal = startingBal - prinPay;

        totalInterest += interestPay;
        bal = endingBal;
        months++;

        // Sample schedule: first 24 months, then yearly
        if (schedule.length < 24 || months % 12 === 0 || bal <= 0) {
          const pay = Number(totalPay);
          const pPaid = Number(prinPay);
          const iPaid = Number(interestPay);
          const eBal = Number(Math.max(0, endingBal));
          schedule.push({
            month: months,
            startingBalance: startingBal,
            payment: pay,
            principalPaid: pPaid,
            interestPaid: iPaid,
            endingBalance: eBal
          });
        }
      }

      if (bal > 0) {
        return { error: "Payoff exceeds 100 years. Increase payment." };
      }

      // No-extra baseline (for interest savings)
      let nb = principal;
      let noExtraMonths = 0;
      let noExtraInterest = 0;

      if (monthlyRate > 0) {
        const firstMonthInterestNoExtra = principal * monthlyRate;
        if (monthlyPay <= firstMonthInterestNoExtra + 1e-9) {
          // Baseline payoff is impossible; savings comparison not meaningful
          noExtraMonths = 0;
          noExtraInterest = NaN;
        }
      }

      while (Number.isFinite(noExtraInterest) && nb > 0 && noExtraMonths < 1200) {
        const ip = nb * monthlyRate;
        const remaining = monthlyPay - ip;

        if (remaining <= 0) {
          // Cannot reduce principal
          noExtraInterest = NaN;
          break;
        }

        const pp = Math.min(nb, remaining);
        noExtraInterest += ip;
        nb -= pp;
        noExtraMonths++;
      }

      const interestSavings = Number.isFinite(noExtraInterest)
        ? Math.max(0, noExtraInterest - totalInterest)
        : null;

      return {
        monthsToPayoff: months,
        totalInterest,
        interestSavings,
        schedule,
        principal,
        rateAnnual: rate,
        monthlyPayment: monthlyPay,
        extraPayment: extraPay
      };
    }
  };
})();

/*
QA cases:
1) principal=360000, rate=6, monthly=3400, extra=0 -> should return monthsToPayoff > 0 and schedule.length > 0
2) principal=360000, rate=600, monthly=3400, extra=0 -> should return { error: "Payment is too low..." }
3) principal=10000, rate=0, monthly=500, extra=0 -> should return totalInterest=0 and monthsToPayoff=20
*/
