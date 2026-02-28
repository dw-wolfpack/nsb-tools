import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/freelance-rate-calculator/logic.js");
const calc = w.NSB_FREELANCE_RATE;

test("freelance: desiredAnnualIncome=80000, billableHoursPerWeek=25 => hourlyRate finite and > 0", () => {
  const r = calc.calculate({
    desiredAnnualIncome: "80000",
    billableHoursPerWeek: "25",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.hourlyRate), "hourlyRate must be finite");
  assert.ok(r.hourlyRate > 0, `hourlyRate must be > 0, got ${r.hourlyRate}`);
});

test("freelance: utilization=0 or invalid is handled (clamped), no crash", () => {
  const r = calc.calculate({
    desiredAnnualIncome: "80000",
    billableHoursPerWeek: "25",
    utilizationRate: "0",
  });
  assert.ok(!r.error, `utilization 0 must not crash, got ${r.error}`);
  assert.ok(r.utilization >= 1 && r.utilization <= 100);
});

test("freelance: monotonic - lower utilization => higher hourly rate", () => {
  const r50 = calc.calculate({
    desiredAnnualIncome: "80000",
    billableHoursPerWeek: "40",
    utilizationRate: "50",
  });
  const r80 = calc.calculate({
    desiredAnnualIncome: "80000",
    billableHoursPerWeek: "40",
    utilizationRate: "80",
  });
  assert.ok(!r50.error && !r80.error);
  assert.ok(r50.hourlyRate > r80.hourlyRate, "lower utilization must yield higher hourly");
});
