import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/sba-payment-estimator/logic.js");
const calc = w.NSB_SBA;

test("sba: normal case produces finite payment", () => {
  const r = calc.calculate({
    principal: "500000",
    rate: "6.9",
    years: "10",
    noi: "60000",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.monthlyPI));
  assert.ok(r.monthlyPI > 0);
});

test("sba: higher rate => higher payment (monotonic)", () => {
  const base = { principal: "300000", years: "10", noi: "0" };
  const r5 = calc.calculate({ ...base, rate: "5" });
  const r8 = calc.calculate({ ...base, rate: "8" });
  assert.ok(!r5.error && !r8.error);
  assert.ok(r8.monthlyPI > r5.monthlyPI, "higher rate must yield higher payment");
});

test("sba: rate=0 safe (principal/n amortization)", () => {
  const r = calc.calculate({ principal: "120000", rate: "0", years: "10", noi: "0" });
  assert.ok(!r.error);
  assert.strictEqual(r.monthlyPI, 1000, "0% => principal/120");
});

test("sba: invalid inputs return error object", () => {
  const zeroPrincipal = calc.calculate({ principal: "0", rate: "6", years: "10" });
  assert.ok(zeroPrincipal.error, "principal=0 must return error");

  const negRate = calc.calculate({ principal: "100000", rate: "-1", years: "10" });
  assert.ok(negRate.error);

  const zeroTerm = calc.calculate({ principal: "100000", rate: "6", years: "0" });
  assert.ok(zeroTerm.error);
});
