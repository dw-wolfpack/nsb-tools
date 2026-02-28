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

test("employee-contractor: salary=0 returns error", () => {
  const r = calc.calculate({
    employeeMode: "salary",
    employeeSalary: "0",
    annualHours: "2000",
    contractorHourlyRate: "120",
  });
  assert.ok(typeof r.error === "string");
});

test("employee-contractor: monotonic - higher salary => higher total cost", () => {
  const r60 = calc.calculate({ employeeMode: "salary", employeeSalary: "60000", annualHours: "2000", contractorHourlyRate: "100" });
  const r100 = calc.calculate({ employeeMode: "salary", employeeSalary: "100000", annualHours: "2000", contractorHourlyRate: "100" });
  assert.ok(!r60.error && !r100.error);
  assert.ok(r100.trueEmployeeAnnualCost > r60.trueEmployeeAnnualCost);
});
