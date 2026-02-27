/**
 * Employee vs Contractor Cost Calculator - Logic
 */
(function () {
  "use strict";

  function parse(v) {
    return window.NSB_UTILS ? window.NSB_UTILS.parseNumberSafe(v) : parseFloat(String(v).replace(/,/g, "")) || NaN;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  window.NSB_EMPLOYEE_CONTRACTOR = {
    calculate(inputs) {
      const isHourly = String(inputs.employeeMode || "salary") === "hourly";

      const annualHoursRaw = parse(inputs.annualHours);
      const annualHours = Number.isFinite(annualHoursRaw) ? annualHoursRaw : 2000;

      if (annualHours <= 0) return { error: "Annual hours must be greater than 0." };

      const hourlyRateRaw = parse(inputs.employeeHourlyRate);
      const salaryRaw = parse(inputs.employeeSalary);

      const employeeBase = isHourly
        ? (Number.isFinite(hourlyRateRaw) ? hourlyRateRaw : 0) * annualHours
        : (Number.isFinite(salaryRaw) ? salaryRaw : 0);

      if (employeeBase <= 0) {
        return { error: isHourly ? "Enter an employee hourly rate greater than 0." : "Enter an employee salary greater than 0." };
      }

      const benefitsPercentRaw = parse(inputs.benefitsPercent);
      const payrollTaxPercentRaw = parse(inputs.payrollTaxPercent);
      const overheadPercentRaw = parse(inputs.overheadPercent);

      const benefitsPercent = Number.isFinite(benefitsPercentRaw) ? clamp(benefitsPercentRaw, 0, 100) : 25;
      const payrollTaxPercent = Number.isFinite(payrollTaxPercentRaw) ? clamp(payrollTaxPercentRaw, 0, 50) : 7.65;
      const overheadPercent = Number.isFinite(overheadPercentRaw) ? clamp(overheadPercentRaw, 0, 100) : 10;

      const contractorRateRaw = parse(inputs.contractorHourlyRate);
      const contractorRate = Number.isFinite(contractorRateRaw) ? contractorRateRaw : 0;

      if (contractorRate <= 0) return { error: "Contractor hourly rate must be greater than 0." };

      const benefits = employeeBase * (benefitsPercent / 100);
      const payrollTax = employeeBase * (payrollTaxPercent / 100);
      const overhead = employeeBase * (overheadPercent / 100);

      const trueEmployeeCost = employeeBase + benefits + payrollTax + overhead;
      const trueEmployeeHourly = trueEmployeeCost / annualHours;

      const contractorCost = contractorRate * annualHours;

      // Hours where contractor spend equals employee annual cost
      const breakevenHours = trueEmployeeCost / contractorRate;

      return {
        trueEmployeeAnnualCost: trueEmployeeCost,
        trueEmployeeHourlyEquivalent: trueEmployeeHourly,
        contractorAnnualCost: contractorCost,
        breakevenHours,
        contractorRate,
        annualHours,
        employeeBase,
        benefitsPercent,
        payrollTaxPercent,
        overheadPercent
      };
    }
  };
})();
