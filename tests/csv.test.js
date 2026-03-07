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
