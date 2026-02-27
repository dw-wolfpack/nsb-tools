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
