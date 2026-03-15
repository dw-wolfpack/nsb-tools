import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

function getTodayKey() {
  const d = new Date();
  return "nsb_gens_" + d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

test("NSB_CAN_GENERATE returns true for runs 1-5", async () => {
  const storage = {};
  globalThis.localStorage = {
    getItem: function (k) { return storage[k] != null ? storage[k] : null; },
    setItem: function (k, v) { storage[k] = String(v); },
    removeItem: function (k) { delete storage[k]; }
  };
  globalThis.window = { location: { origin: "http://localhost:8000", pathname: "/tools/hook/" } };
  globalThis.document = {
    readyState: "complete",
    getElementById: function () { return null; },
    querySelector: function () { return null; },
    addEventListener: function () {},
    head: { appendChild: function () {} },
    createElement: function () { return { setAttribute: function () {} }; }
  };

  const key = getTodayKey();
  for (let count = 0; count <= 4; count++) {
    storage[key] = String(count);
    storage.nsb_pro = "false";
    delete storage.nsb_pro;
    globalThis.localStorage.setItem(key, String(count));
    globalThis.localStorage.removeItem("nsb_pro");
    await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/main.js")).href + "?v=" + Date.now());
    assert.strictEqual(globalThis.window.NSB_CAN_GENERATE(true), true, "run " + (count + 1) + " should be allowed");
  }
});

test("NSB_CAN_GENERATE returns false on run 6+", async () => {
  const storage = {};
  globalThis.localStorage = {
    getItem: function (k) { return storage[k] != null ? storage[k] : null; },
    setItem: function (k, v) { storage[k] = String(v); },
    removeItem: function (k) { delete storage[k]; }
  };
  globalThis.window = { location: { origin: "http://localhost:8000", pathname: "/tools/hook/" } };
  globalThis.document = {
    readyState: "complete",
    getElementById: function () { return null; },
    querySelector: function () { return null; },
    addEventListener: function () {},
    head: { appendChild: function () {} },
    createElement: function () { return { setAttribute: function () {} }; }
  };

  const key = getTodayKey();
  storage[key] = "5";
  globalThis.localStorage.setItem(key, "5");
  globalThis.localStorage.removeItem("nsb_pro");
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/main.js")).href + "?v=" + Date.now());
  assert.strictEqual(globalThis.window.NSB_CAN_GENERATE(true), false, "run 6 should be blocked");
});

test("daily limit resets per calendar day (key format)", () => {
  const key = getTodayKey();
  assert.ok(/^nsb_gens_\d{4}-\d{2}-\d{2}$/.test(key), "key should be nsb_gens_YYYY-MM-DD");
});
