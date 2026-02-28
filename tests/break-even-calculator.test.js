import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/break-even-calculator/logic.js");
const calc = w.NSB_BREAKEVEN;

test("breakeven: service mode - fixed=2000, price=30, variable=20 => 200 units", () => {
  const r = calc.calculate({
    mode: "service",
    fixedCostsPerMonth: "2000",
    pricePerUnit: "30",
    variableCostPerUnit: "20",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.strictEqual(r.unitsToBreakEven, 200);
});

test("breakeven: service mode - variable >= price returns error string", () => {
  const r = calc.calculate({
    mode: "service",
    fixedCostsPerMonth: "2000",
    pricePerUnit: "20",
    variableCostPerUnit: "20",
  });
  assert.ok(typeof r.error === "string", `Expected error string, got ${JSON.stringify(r)}`);
});

test("breakeven: saas mode - fixed=2000, arpa=50, margin=80 => customersToBreakEven finite >= 0", () => {
  const r = calc.calculate({
    mode: "saas",
    fixedCostsPerMonth: "2000",
    arpa: "50",
    grossMargin: "80",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.customersToBreakEven), "customersToBreakEven must be finite");
  assert.ok(r.customersToBreakEven >= 0, "customersToBreakEven must be >= 0");
});

test("breakeven: service mode - fixed=0 => unitsToBreakEven 0", () => {
  const r = calc.calculate({
    mode: "service",
    fixedCostsPerMonth: "0",
    pricePerUnit: "30",
    variableCostPerUnit: "20",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.strictEqual(r.unitsToBreakEven, 0);
});

test("breakeven: saas mode - margin=0 returns error", () => {
  const r = calc.calculate({
    mode: "saas",
    fixedCostsPerMonth: "2000",
    arpa: "50",
    grossMargin: "0",
  });
  assert.ok(typeof r.error === "string", `Expected error, got ${JSON.stringify(r)}`);
});
