import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

var domElements = {};

function makeInput(name, value) {
  return { tagName: "INPUT", name: name, value: value || "" };
}

function setupDom(fieldDefs) {
  domElements = {};
  fieldDefs.forEach(function (f) {
    domElements[f.name] = makeInput(f.name, f.value || "");
  });

  var form = {
    id: "nsb-form",
    querySelector: function (sel) {
      var m = sel.match(/\[name=([^\]]+)\]/);
      if (m) return domElements[m[1]] || null;
      if (sel === "button[type=submit]") return submitBtn;
      return null;
    },
  };

  var submitBtn = { tagName: "BUTTON", type: "submit", clicked: false, click: function () { submitBtn.clicked = true; } };

  globalThis.document = {
    getElementById: function (id) {
      if (id === "nsb-form") return form;
      return null;
    },
    querySelector: function (sel) {
      // Fallback for queries outside the form
      var m = sel.match(/\[name=([^\]]+)\]/);
      if (m) return domElements[m[1]] || null;
      if (sel.includes("button[type=submit]")) return submitBtn;
      return null;
    },
  };

  globalThis.window = globalThis.window || {};
  return { form: form, submitBtn: submitBtn };
}

var importCount = 0;
async function loadAdapters() {
  importCount++;
  var url = pathToFileURL(resolve(REPO_ROOT, "assets/js/tool-adapters.js")).href + "?v=" + importCount;
  await import(url);
  return globalThis.window.NSB_TOOL_ADAPTERS;
}

test("NSB_TOOL_ADAPTERS is defined after load", async () => {
  setupDom([]);
  var adapters = await loadAdapters();
  assert.ok(adapters, "NSB_TOOL_ADAPTERS should be defined");
  assert.ok(typeof adapters.getAdapter === "function");
});

test("getAdapter returns null for unknown slug", async () => {
  setupDom([]);
  var adapters = await loadAdapters();
  assert.strictEqual(adapters.getAdapter("unknown-tool"), null);
});

test("loan adapter readInputs returns correct keys", async () => {
  var fields = [
    { name: "principal", value: "10000" },
    { name: "interestRate", value: "5.5" },
    { name: "monthlyPayment", value: "200" },
    { name: "extraPayment", value: "50" },
  ];
  setupDom(fields);
  var adapters = await loadAdapters();
  var adapter = adapters.getAdapter("loan-debt-payoff-calculator");
  assert.ok(adapter, "should have loan adapter");
  var inputs = adapter.readInputs();
  assert.strictEqual(inputs.principal, "10000");
  assert.strictEqual(inputs.interestRate, "5.5");
  assert.strictEqual(inputs.monthlyPayment, "200");
  assert.strictEqual(inputs.extraPayment, "50");
});

test("loan adapter applyInputs sets field values", async () => {
  var fields = [
    { name: "principal", value: "" },
    { name: "interestRate", value: "" },
    { name: "monthlyPayment", value: "" },
    { name: "extraPayment", value: "" },
  ];
  setupDom(fields);
  var adapters = await loadAdapters();
  var adapter = adapters.getAdapter("loan-debt-payoff-calculator");
  adapter.applyInputs({ principal: "15000", interestRate: "4", monthlyPayment: "300", extraPayment: "0" });
  assert.strictEqual(domElements.principal.value, "15000");
  assert.strictEqual(domElements.interestRate.value, "4");
  assert.strictEqual(domElements.monthlyPayment.value, "300");
  assert.strictEqual(domElements.extraPayment.value, "0");
});

test("burn adapter readInputs returns correct keys", async () => {
  var fields = [
    { name: "cashOnHand", value: "50000" },
    { name: "monthlyRevenue", value: "10000" },
    { name: "monthlyExpenses", value: "15000" },
    { name: "revenueGrowthRate", value: "2" },
  ];
  setupDom(fields);
  var adapters = await loadAdapters();
  var adapter = adapters.getAdapter("burn-rate-runway-calculator");
  assert.ok(adapter, "should have burn adapter");
  var inputs = adapter.readInputs();
  assert.strictEqual(inputs.cashOnHand, "50000");
  assert.strictEqual(inputs.monthlyRevenue, "10000");
  assert.strictEqual(inputs.monthlyExpenses, "15000");
  assert.strictEqual(inputs.revenueGrowthRate, "2");
});

test("burn adapter applyInputs sets field values", async () => {
  var fields = [
    { name: "cashOnHand", value: "" },
    { name: "monthlyRevenue", value: "" },
    { name: "monthlyExpenses", value: "" },
    { name: "revenueGrowthRate", value: "" },
  ];
  setupDom(fields);
  var adapters = await loadAdapters();
  var adapter = adapters.getAdapter("burn-rate-runway-calculator");
  adapter.applyInputs({ cashOnHand: "80000", monthlyRevenue: "5000", monthlyExpenses: "12000", revenueGrowthRate: "3" });
  assert.strictEqual(domElements.cashOnHand.value, "80000");
  assert.strictEqual(domElements.monthlyRevenue.value, "5000");
  assert.strictEqual(domElements.monthlyExpenses.value, "12000");
  assert.strictEqual(domElements.revenueGrowthRate.value, "3");
});

test("applyInputs does not throw when elements are missing", async () => {
  setupDom([]);
  var adapters = await loadAdapters();
  var adapter = adapters.getAdapter("loan-debt-payoff-calculator");
  assert.doesNotThrow(function () {
    adapter.applyInputs({ principal: "99999", interestRate: "7" });
  });
});

test("applyInputs does not throw for null inputs", async () => {
  var fields = [{ name: "principal", value: "0" }];
  setupDom(fields);
  var adapters = await loadAdapters();
  var adapter = adapters.getAdapter("loan-debt-payoff-calculator");
  assert.doesNotThrow(function () {
    adapter.applyInputs(null);
  });
});

test("getToolUrl returns correct paths", async () => {
  setupDom([]);
  var adapters = await loadAdapters();
  assert.strictEqual(adapters.getToolUrl("loan-debt-payoff-calculator"), "/tools/loan-debt-payoff-calculator/");
  assert.strictEqual(adapters.getToolUrl("burn-rate-runway-calculator"), "/tools/burn-rate-runway-calculator/");
  assert.strictEqual(adapters.getToolUrl("unknown"), null);
});
