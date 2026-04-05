import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

test("NSB_CSV is defined after load", async () => {
  globalThis.window = {};
  globalThis.document = { createElement: function () { return { setAttribute: function () {}, click: function () {}, remove: function () {}, style: {}, href: "", download: "" }; }, head: {}, body: { appendChild: function () {}, removeChild: function () {} } };
  globalThis.URL = { createObjectURL: function () { return "blob:test"; }, revokeObjectURL: function () {} };
  globalThis.Blob = function (parts, opts) { this.parts = parts; this.opts = opts; };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/csv.js")).href);
  assert.ok(globalThis.window.NSB_CSV, "NSB_CSV should be defined");
  assert.strictEqual(typeof globalThis.window.NSB_CSV.toCSV, "function");
  assert.strictEqual(typeof globalThis.window.NSB_CSV.downloadCSV, "function");
});

test("toCSV: simple two columns two rows", () => {
  var rows = [{ a: 1, b: 2 }, { a: 3, b: 4 }];
  var out = globalThis.window.NSB_CSV.toCSV(rows, ["a", "b"]);
  assert.strictEqual(out, "a,b\n1,2\n3,4");
});

test("toCSV: commas in value are quoted", () => {
  var rows = [{ x: "a,b", y: "c" }];
  var out = globalThis.window.NSB_CSV.toCSV(rows, ["x", "y"]);
  assert.strictEqual(out, "x,y\n\"a,b\",c");
});

test("toCSV: double quotes in value are doubled", () => {
  var rows = [{ x: "a\"b", y: "c" }];
  var out = globalThis.window.NSB_CSV.toCSV(rows, ["x", "y"]);
  assert.strictEqual(out, "x,y\n\"a\"\"b\",c");
});

test("toCSV: newlines in value are quoted", () => {
  var rows = [{ x: "a\nb", y: "c" }];
  var out = globalThis.window.NSB_CSV.toCSV(rows, ["x", "y"]);
  assert.strictEqual(out, "x,y\n\"a\nb\",c");
});

test("toCSV: empty rows returns header only", () => {
  var out = globalThis.window.NSB_CSV.toCSV([], ["a", "b"]);
  assert.strictEqual(out, "a,b\n");
});

test("downloadCSV does not throw when document stubbed", () => {
  assert.doesNotThrow(function () {
    globalThis.window.NSB_CSV.downloadCSV("test.csv", "a,b\n1,2");
  });
});

test("parseCSVText: simple header and one row", () => {
  var p = globalThis.window.NSB_CSV.parseCSVText("a,b\n1,2");
  assert.deepStrictEqual(p.headers, ["a", "b"]);
  assert.strictEqual(p.rows.length, 1);
  assert.deepStrictEqual(p.rows[0], { a: "1", b: "2" });
});

test("parseCSVText: commas in quoted field", () => {
  var p = globalThis.window.NSB_CSV.parseCSVText('x,y\n"a,b","c"');
  assert.deepStrictEqual(p.rows[0], { x: "a,b", y: "c" });
});

test("parseCSVText: doubled quotes inside field", () => {
  var p = globalThis.window.NSB_CSV.parseCSVText('x\n"a""b"');
  assert.strictEqual(p.rows[0].x, 'a"b');
});

test("parseCSVText: newline inside quoted field", () => {
  var p = globalThis.window.NSB_CSV.parseCSVText('col1,col2\n"a\nb",c');
  assert.strictEqual(p.rows.length, 1);
  assert.strictEqual(p.rows[0].col1, "a\nb");
  assert.strictEqual(p.rows[0].col2, "c");
});

test("parseCSVText: header only", () => {
  var p = globalThis.window.NSB_CSV.parseCSVText("h1,h2\n");
  assert.deepStrictEqual(p.headers, ["h1", "h2"]);
  assert.strictEqual(p.rows.length, 0);
});

test("buildToolExportCSV and parseToolExportWithInputs round-trip inputs", () => {
  var inputs = { principal: "1000", interestRate: "5", monthlyPayment: "50", extraPayment: "0" };
  var keys = ["principal", "interestRate", "monthlyPayment", "extraPayment"];
  var sched = [{ month: "1", payment: "50", principalPaid: "10", interestPaid: "40", endingBalance: "990" }];
  var sh = ["month", "payment", "principalPaid", "interestPaid", "endingBalance"];
  var combined = globalThis.window.NSB_CSV.buildToolExportCSV(inputs, keys, sched, sh);
  var parsed = globalThis.window.NSB_CSV.parseToolExportWithInputs(combined);
  assert.ok(parsed.inputs);
  assert.strictEqual(parsed.inputs.rows[0].principal, "1000");
  assert.strictEqual(parsed.scheduleTable.rows.length, 1);
  assert.strictEqual(parsed.scheduleTable.rows[0].month, "1");
});

test("buildToolExportCSV burn-style keys round-trip", () => {
  var inputs = { cashOnHand: "100000", monthlyRevenue: "5000", monthlyExpenses: "15000", revenueGrowthRate: "0" };
  var keys = ["cashOnHand", "monthlyRevenue", "monthlyExpenses", "revenueGrowthRate"];
  var sched = [{ month: "1", cashStart: "100000", revenue: "5000", expenses: "15000", netBurn: "10000", cashEnd: "90000" }];
  var sh = ["month", "cashStart", "revenue", "expenses", "netBurn", "cashEnd"];
  var combined = globalThis.window.NSB_CSV.buildToolExportCSV(inputs, keys, sched, sh);
  var parsed = globalThis.window.NSB_CSV.parseToolExportWithInputs(combined);
  assert.ok(parsed.inputs);
  assert.strictEqual(parsed.inputs.rows[0].cashOnHand, "100000");
  assert.strictEqual(parsed.scheduleTable.rows[0].cashEnd, "90000");
});
