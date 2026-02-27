import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/loan-debt-payoff-calculator/logic.js");
const calc = w.NSB_LOAN_PAYOFF;

test("loan: normal case - monthsToPayoff, totalInterest, schedule keys", () => {
  const r = calc.calculate({
    principal: "360000",
    interestRate: "6",
    monthlyPayment: "3400",
    extraPayment: "0",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(r.monthsToPayoff > 0, "monthsToPayoff must be > 0");
  assert.ok(r.totalInterest > 0, "totalInterest must be > 0");
  assert.ok(r.schedule && r.schedule.length > 0, "schedule must be non-empty");

  const row = r.schedule[0];
  for (const key of ["payment", "principalPaid", "interestPaid", "endingBalance"]) {
    assert.ok(key in row, `schedule[0] missing key: ${key}`);
    assert.ok(Number.isFinite(row[key]), `schedule[0].${key} must be finite, got ${row[key]}`);
  }
  assert.ok(row.payment > 0, "schedule[0].payment must be > 0");
});

test("loan: extreme rate (600%) returns error string", () => {
  const r = calc.calculate({
    principal: "360000",
    interestRate: "600",
    monthlyPayment: "3400",
    extraPayment: "0",
  });
  assert.ok(typeof r.error === "string", `Expected error string, got ${JSON.stringify(r)}`);
});

test("loan: zero interest - totalInterest equals 0", () => {
  const r = calc.calculate({
    principal: "10000",
    interestRate: "0",
    monthlyPayment: "500",
    extraPayment: "0",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.strictEqual(r.totalInterest, 0);
});
