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
