import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/burn-rate-runway-calculator/logic.js");
const calc = w.NSB_BURN_RATE;

test("burn-rate: revenue > expenses => runwayMonths null, runwayLabel includes 'infinite'", () => {
  const r = calc.calculate({
    cashOnHand: "100000",
    monthlyRevenue: "20000",
    monthlyExpenses: "15000",
    revenueGrowthRate: "0",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.strictEqual(r.runwayMonths, null, "runwayMonths must be null when not burning");
  assert.ok(
    r.runwayLabel.toLowerCase().includes("infinite"),
    `runwayLabel must include 'infinite', got "${r.runwayLabel}"`,
  );
});

test("burn-rate: revenue < expenses => runwayMonths finite and > 0", () => {
  const r = calc.calculate({
    cashOnHand: "100000",
    monthlyRevenue: "5000",
    monthlyExpenses: "15000",
    revenueGrowthRate: "0",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.runwayMonths) && r.runwayMonths > 0, `runwayMonths must be finite > 0, got ${r.runwayMonths}`);
});
