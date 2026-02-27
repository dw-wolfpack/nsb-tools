import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/employee-vs-contractor-calculator/logic.js");
const calc = w.NSB_EMPLOYEE_CONTRACTOR;

test("employee-contractor: salary=80000, hours=2000, contractorRate=120 => finite outputs and breakevenHours", () => {
  const r = calc.calculate({
    employeeMode: "salary",
    employeeSalary: "80000",
    annualHours: "2000",
    contractorHourlyRate: "120",
  });
  assert.ok(!r.error, `Unexpected error: ${r.error}`);
  assert.ok(Number.isFinite(r.trueEmployeeAnnualCost),      "trueEmployeeAnnualCost must be finite");
  assert.ok(Number.isFinite(r.trueEmployeeHourlyEquivalent), "trueEmployeeHourlyEquivalent must be finite");
  assert.ok(Number.isFinite(r.breakevenHours),               "breakevenHours must be finite");
});
