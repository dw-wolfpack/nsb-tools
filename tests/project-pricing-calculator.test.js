import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/project-pricing-calculator/logic.js");
const calc = w.NSB_PROJECT_PRICING;

test("project-pricing: hours=40, rate=100, complexity=1, buffer=20, expenses=0 => target approx 4800", () => {
  const r = calc.calculate({
    estimatedHours: "40",
    hourlyRate: "100",
    complexityMultiplier: "1",
    riskBufferPercent: "20",
    expenses: "0",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.target), "target must be finite");
  assert.ok(Math.abs(r.target - 4800) <= 1, `target expected ~4800, got ${r.target}`);
});
