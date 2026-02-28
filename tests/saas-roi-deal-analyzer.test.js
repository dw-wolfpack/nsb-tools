import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/saas-roi-deal-analyzer/logic.js");
const calc = w.NSB_SAAS_ROI;

test("saas-roi: cac=500, arpa=50, margin=80, churn=5 => paybackMonths approx 12.5", () => {
  const r = calc.calculate({
    cac: "500",
    arpa: "50",
    grossMargin: "80",
    monthlyChurn: "5",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.paybackMonths), "paybackMonths must be finite");
  assert.ok(Math.abs(r.paybackMonths - 12.5) <= 0.2, `paybackMonths expected ~12.5, got ${r.paybackMonths}`);
});

test("saas-roi: churn=0 returns error string", () => {
  const r = calc.calculate({
    cac: "500",
    arpa: "50",
    grossMargin: "80",
    monthlyChurn: "0",
  });
  assert.ok(typeof r.error === "string", `Expected error string, got ${JSON.stringify(r)}`);
});

test("saas-roi: gross margin=0 returns error", () => {
  const r = calc.calculate({
    cac: "500",
    arpa: "50",
    grossMargin: "0",
    monthlyChurn: "5",
  });
  assert.ok(typeof r.error === "string");
});

test("saas-roi: CAC=0 returns error", () => {
  const r = calc.calculate({
    cac: "0",
    arpa: "50",
    grossMargin: "80",
    monthlyChurn: "5",
  });
  assert.ok(typeof r.error === "string");
});

test("saas-roi: high churn (50%) produces finite LTV", () => {
  const r = calc.calculate({
    cac: "100",
    arpa: "20",
    grossMargin: "80",
    monthlyChurn: "50",
  });
  assert.ok(!r.error);
  assert.ok(Number.isFinite(r.ltv) && r.ltv > 0);
});
