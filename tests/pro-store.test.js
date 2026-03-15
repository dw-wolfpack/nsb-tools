import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

var storage = {};
function createStorage() {
  return {
    getItem: function (k) { return storage[k] != null ? storage[k] : null; },
    setItem: function (k, v) { storage[k] = String(v); },
    removeItem: function (k) { delete storage[k]; },
  };
}

function setupGlobals() {
  storage = {};
  globalThis.localStorage = createStorage();
  globalThis.window = globalThis.window || {};
  globalThis.URL = { createObjectURL: function () { return "blob:test"; }, revokeObjectURL: function () {} };
  globalThis.Blob = function (parts) { this.parts = parts; };
  var appendedEls = [];
  globalThis.document = {
    createElement: function (tag) {
      var el = { tagName: tag, href: "", download: "", click: function () {}, remove: function () { appendedEls = appendedEls.filter(function (x) { return x !== el; }); } };
      return el;
    },
    body: {
      appendChild: function (el) { appendedEls.push(el); },
    },
    _appended: appendedEls,
  };
}

// Inline require the module fresh for each test using a unique cache-bust query
var importCount = 0;
async function loadStore() {
  importCount++;
  var url = pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-store.js")).href + "?v=" + importCount;
  await import(url);
  return globalThis.window.NSB_PRO_STORE;
}

test("NSB_PRO_STORE is defined after load", async () => {
  setupGlobals();
  var store = await loadStore();
  assert.ok(store, "NSB_PRO_STORE should be defined");
  assert.ok(typeof store.listPresets === "function");
  assert.ok(typeof store.savePreset === "function");
  assert.ok(typeof store.deletePreset === "function");
  assert.ok(typeof store.renamePreset === "function");
  assert.ok(typeof store.exportPresets === "function");
  assert.ok(typeof store.importPresets === "function");
});

test("savePreset creates a new preset with expected shape", async () => {
  setupGlobals();
  var store = await loadStore();
  var result = store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "My plan", inputs: { principal: "10000", interestRate: "5" } });
  assert.ok(result, "savePreset should return the preset");
  assert.ok(result.id, "should have an id");
  assert.strictEqual(result.toolSlug, "loan-debt-payoff-calculator");
  assert.strictEqual(result.name, "My plan");
  assert.deepStrictEqual(result.inputs, { principal: "10000", interestRate: "5" });
  assert.ok(result.createdAt, "should have createdAt");
  assert.ok(result.updatedAt, "should have updatedAt");
});

test("listPresets returns all presets when no filter", async () => {
  setupGlobals();
  var store = await loadStore();
  store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "A", inputs: {} });
  store.savePreset({ toolSlug: "burn-rate-runway-calculator", name: "B", inputs: {} });
  var all = store.listPresets();
  assert.strictEqual(all.length, 2);
});

test("listPresets filters by toolSlug", async () => {
  setupGlobals();
  var store = await loadStore();
  store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "A", inputs: {} });
  store.savePreset({ toolSlug: "burn-rate-runway-calculator", name: "B", inputs: {} });
  store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "C", inputs: {} });
  var loans = store.listPresets("loan-debt-payoff-calculator");
  assert.strictEqual(loans.length, 2);
  assert.ok(loans.every(function (p) { return p.toolSlug === "loan-debt-payoff-calculator"; }));
});

test("deletePreset removes the preset by id", async () => {
  setupGlobals();
  var store = await loadStore();
  var p = store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "To delete", inputs: {} });
  store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "Keep", inputs: {} });
  store.deletePreset(p.id);
  var all = store.listPresets();
  assert.strictEqual(all.length, 1);
  assert.strictEqual(all[0].name, "Keep");
});

test("renamePreset updates the name", async () => {
  setupGlobals();
  var store = await loadStore();
  var p = store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "Old name", inputs: {} });
  store.renamePreset(p.id, "New name");
  var all = store.listPresets();
  assert.strictEqual(all[0].name, "New name");
});

test("renamePreset clamps long names", async () => {
  setupGlobals();
  var store = await loadStore();
  var p = store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "X", inputs: {} });
  var longName = "A".repeat(100);
  store.renamePreset(p.id, longName);
  var all = store.listPresets();
  assert.ok(all[0].name.length <= 60);
});

test("savePreset persists to localStorage", async () => {
  setupGlobals();
  var store = await loadStore();
  store.savePreset({ toolSlug: "burn-rate-runway-calculator", name: "Persist test", inputs: { cashOnHand: "50000" } });
  var raw = storage["nsb_pro_state_v1"];
  assert.ok(raw, "Should have written to nsb_pro_state_v1");
  var parsed = JSON.parse(raw);
  assert.strictEqual(parsed.version, 1);
  assert.ok(Array.isArray(parsed.presets));
  assert.strictEqual(parsed.presets[0].name, "Persist test");
});

test("importPresets merges without duplicates", async () => {
  setupGlobals();
  var store = await loadStore();
  var p = store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "Existing", inputs: {} });
  var importData = JSON.stringify({
    version: 1,
    presets: [
      { id: p.id, toolSlug: "loan-debt-payoff-calculator", name: "Existing", inputs: {} },
      { id: "new-id-1234", toolSlug: "burn-rate-runway-calculator", name: "Imported", inputs: { cashOnHand: "20000" } },
    ],
  });
  var result = store.importPresets(importData);
  assert.ok(result.ok);
  assert.strictEqual(result.added, 1);
  assert.strictEqual(result.skipped, 1);
  var all = store.listPresets();
  assert.strictEqual(all.length, 2);
});

test("importPresets returns error for invalid JSON", async () => {
  setupGlobals();
  var store = await loadStore();
  var result = store.importPresets("not json {{");
  assert.strictEqual(result.ok, false);
  assert.ok(result.error);
});

test("importPresets returns error for wrong shape", async () => {
  setupGlobals();
  var store = await loadStore();
  var result = store.importPresets(JSON.stringify({ something: "else" }));
  assert.strictEqual(result.ok, false);
});

test("exportPresets does not throw", async () => {
  setupGlobals();
  var store = await loadStore();
  store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "Export me", inputs: {} });
  assert.doesNotThrow(function () { store.exportPresets(); });
});

test("savePreset dispatches nsb:pro-presets-changed", async () => {
  setupGlobals();
  var events = [];
  globalThis.window = globalThis.window || {};
  globalThis.window.dispatchEvent = function (ev) {
    if (ev && ev.type) events.push(ev.type);
  };
  var store = await loadStore();
  store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "E", inputs: {} });
  assert.ok(events.indexOf("nsb:pro-presets-changed") !== -1, "savePreset should dispatch nsb:pro-presets-changed");
});

test("deletePreset dispatches nsb:pro-presets-changed", async () => {
  setupGlobals();
  var events = [];
  globalThis.window = globalThis.window || {};
  globalThis.window.dispatchEvent = function (ev) {
    if (ev && ev.type) events.push(ev.type);
  };
  var store = await loadStore();
  var p = store.savePreset({ toolSlug: "loan-debt-payoff-calculator", name: "D", inputs: {} });
  events.length = 0;
  store.deletePreset(p.id);
  assert.ok(events.indexOf("nsb:pro-presets-changed") !== -1, "deletePreset should dispatch nsb:pro-presets-changed");
});
