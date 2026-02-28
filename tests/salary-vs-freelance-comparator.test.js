import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/salary-vs-freelance-comparator/logic.js");
const calc = w.NSB_SALARY_FREELANCE;

test("salary-freelance: salary=100000, benefits=15000, taxes=25, rate=120, util=70, expenses=20000 => finite outputs", () => {
  const r = calc.calculate({
    salaryW2: "100000",
    benefitsValue: "15000",
    taxesPercent: "25",
    freelanceHourlyRate: "120",
    utilization: "70",
    expenses: "20000",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.breakevenHourly) && r.breakevenHourly > 0,
    `breakevenHourly must be finite > 0, got ${r.breakevenHourly}`);
  assert.ok(Number.isFinite(r.freelanceNetMonthly),
    `freelanceNetMonthly must be finite (not NaN), got ${r.freelanceNetMonthly}`);
});

test("salary-freelance: salary=0 returns error", () => {
  const r = calc.calculate({
    salaryW2: "0",
    benefitsValue: "0",
    taxesPercent: "25",
    freelanceHourlyRate: "120",
    utilization: "70",
    expenses: "0",
  });
  assert.ok(typeof r.error === "string");
});

test("salary-freelance: utilization=0 clamped, no crash", () => {
  const r = calc.calculate({
    salaryW2: "100000",
    benefitsValue: "0",
    taxesPercent: "25",
    freelanceHourlyRate: "120",
    utilization: "0",
    expenses: "0",
  });
  assert.ok(!r.error);
  assert.ok(r.util >= 1);
});

test("salary-freelance: monotonic - higher W2 salary => higher breakeven rate", () => {
  const r80 = calc.calculate({ salaryW2: "80000", benefitsValue: "0", taxesPercent: "25", freelanceHourlyRate: "100", utilization: "70", expenses: "0" });
  const r120 = calc.calculate({ salaryW2: "120000", benefitsValue: "0", taxesPercent: "25", freelanceHourlyRate: "100", utilization: "70", expenses: "0" });
  assert.ok(!r80.error && !r120.error);
  assert.ok(r120.breakevenHourly > r80.breakevenHourly);
});
