import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

var createdScripts = [];

test("loadProScriptsIfNeeded is idempotent and does not double-inject", async () => {
  var appendCount = 0;
  createdScripts.length = 0;
  var doc = {
    readyState: "complete",
    getElementById: function () { return null; },
    querySelector: function () { return null; },
    createElement: function () {
      var el = { src: "", async: false, setAttribute: function () {}, onload: function () {}, onerror: function () {} };
      createdScripts.push(el);
      return el;
    },
    head: { appendChild: function () { appendCount++; } }
  };
  globalThis.window = {
    location: { origin: "http://localhost:8000", pathname: "/" },
    NSB_PRO: undefined,
    __NSB_CSV_LOADING: undefined,
    __NSB_PRO_LOADING: undefined,
    document: doc
  };
  globalThis.document = doc;
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/main.js")).href);
  var loader = globalThis.window.NSB_LOAD_PRO_SCRIPTS_IF_NEEDED;
  assert.ok(typeof loader === "function", "loader should be exposed");

  assert.strictEqual(appendCount, 1, "first init should append exactly one script (csv)");

  loader();
  assert.strictEqual(appendCount, 1, "second call should not append when __NSB_CSV_LOADING was set");

  globalThis.window.NSB_PRO = {};
  appendCount = 0;
  loader();
  assert.strictEqual(appendCount, 0, "should not append when NSB_PRO exists");

  globalThis.window.NSB_PRO = undefined;
  globalThis.window.__NSB_CSV_LOADING = true;
  loader();
  assert.strictEqual(appendCount, 0, "should not append when __NSB_CSV_LOADING is true");
});

test("loader does not append when script[data-nsb=\"csv\"] already in DOM", async () => {
  var appendCount = 0;
  globalThis.window.NSB_PRO = undefined;
  globalThis.window.__NSB_CSV_LOADING = undefined;
  globalThis.window.__NSB_PRO_LOADING = undefined;
  globalThis.document = {
    querySelector: function (sel) { if (sel === "script[data-nsb=\"csv\"]") return {}; return null; },
    head: { appendChild: function () { appendCount++; } },
    createElement: function () { return { setAttribute: function () {} }; }
  };
  globalThis.window.document = globalThis.document;
  globalThis.window.NSB_LOAD_PRO_SCRIPTS_IF_NEEDED();
  assert.strictEqual(appendCount, 0, "should not append when csv script tag already exists");
});

test("csv onload with global missing clears __NSB_CSV_LOADING", async () => {
  globalThis.window.__NSB_CSV_LOADING = true;
  assert.strictEqual(createdScripts.length >= 1, true, "csv script should exist from first test");
  createdScripts[0].onload();
  assert.strictEqual(globalThis.window.__NSB_CSV_LOADING, false, "__NSB_CSV_LOADING should be cleared when NSB_CSV missing");
});

test("pro onload with global missing clears __NSB_PRO_LOADING", async () => {
  globalThis.window.NSB_CSV = { toCSV: function () {} };
  globalThis.window.__NSB_CSV_LOADING = false;
  globalThis.window.__NSB_PRO_LOADING = undefined;
  globalThis.document = {
    querySelector: function () { return null; },
    createElement: function () {
      var el = { setAttribute: function () {} };
      createdScripts.push(el);
      return el;
    },
    head: { appendChild: function () {} }
  };
  globalThis.window.document = globalThis.document;
  createdScripts[0].onload();
  assert.strictEqual(createdScripts.length >= 2, true, "pro script should be created after csv onload");
  globalThis.window.NSB_PRO = undefined;
  createdScripts[1].onload();
  assert.strictEqual(globalThis.window.__NSB_PRO_LOADING, false, "__NSB_PRO_LOADING should be cleared when NSB_PRO missing");
});
