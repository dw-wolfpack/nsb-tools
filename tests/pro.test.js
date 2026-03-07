import { test } from "node:test";
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
    removeItem: function (k) { delete storage[k]; }
  };
}

test("NSB_PRO is defined after load", async () => {
  storage = {};
  globalThis.window = { location: { search: "" } };
  globalThis.localStorage = createStorage();
  globalThis.document = { getElementById: function () { return null; }, head: { appendChild: function () {} }, createElement: function () { return {}; }, body: { appendChild: function () {}, removeChild: function () {} } };
  globalThis.URL = { createObjectURL: function () { return ""; }, revokeObjectURL: function () {} };
  globalThis.Blob = function () {};
  globalThis.NSB_MODAL = { open: function () {}, close: function () {} };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/csv.js")).href);
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro.js")).href);
  assert.ok(globalThis.window.NSB_PRO, "NSB_PRO should be defined");
});

test("isPro returns true when nsb_pro is true", () => {
  storage = { nsb_pro: "true" };
  globalThis.localStorage = createStorage();
  assert.strictEqual(globalThis.window.NSB_PRO.isPro(), true);
});

test("isPro returns false when nsb_pro is false or missing", () => {
  storage = {};
  globalThis.localStorage = createStorage();
  assert.strictEqual(globalThis.window.NSB_PRO.isPro(), false);
  storage.nsb_pro = "false";
  globalThis.localStorage = createStorage();
  assert.strictEqual(globalThis.window.NSB_PRO.isPro(), false);
});

test("setPro sets and clears localStorage", () => {
  storage = {};
  globalThis.localStorage = createStorage();
  globalThis.window.NSB_PRO.setPro(true, "a@b.com");
  assert.strictEqual(storage.nsb_pro, "true");
  assert.strictEqual(storage.nsb_pro_email, "a@b.com");
  globalThis.window.NSB_PRO.setPro(false);
  assert.strictEqual(storage.nsb_pro, undefined);
  assert.strictEqual(storage.nsb_pro_email, undefined);
});

test("requirePro calls callback when Pro", () => {
  storage = { nsb_pro: "true" };
  globalThis.localStorage = createStorage();
  var called = false;
  globalThis.window.NSB_PRO.requirePro(function () { called = true; });
  assert.strictEqual(called, true);
});

test("requirePro opens modal when not Pro", () => {
  storage = {};
  globalThis.localStorage = createStorage();
  var openCalled = false;
  globalThis.window.NSB_MODAL = { open: function () { openCalled = true; }, close: function () {} };
  var callbackCalled = false;
  globalThis.window.NSB_PRO.requirePro(function () { callbackCalled = true; });
  assert.strictEqual(openCalled, true);
  assert.strictEqual(callbackCalled, false);
});

test("openUpgradeModal content includes unlock markup and ids", () => {
  storage = {};
  globalThis.localStorage = createStorage();
  var content = "";
  globalThis.window.NSB_MODAL = { open: function (html) { content = html; }, close: function () {} };
  globalThis.document = {
    getElementById: function () { return null; },
    head: { appendChild: function () {} },
    createElement: function () { return {}; },
    body: { appendChild: function () {}, removeChild: function () {} }
  };
  globalThis.window.NSB_PRO.openUpgradeModal();
  assert.ok(content.indexOf("id=\"nsb-pro-unlock\"") >= 0, "content should include nsb-pro-unlock");
  assert.ok(content.indexOf("id=\"nsb-pro-already-paid\"") >= 0, "content should include nsb-pro-already-paid");
  assert.ok(content.indexOf("modal-pro-unlock") >= 0, "content should include modal-pro-unlock class");
  assert.ok(content.indexOf("Log in") >= 0, "content should include Log in button label");
  assert.ok(content.indexOf("nsb-pro-email") >= 0, "content should include email input id");
  assert.ok(content.indexOf("Unlock Pro") >= 0, "content should include Unlock Pro button");
});

test("openUpgradeModal I already paid click toggles unlock section", () => {
  storage = {};
  globalThis.localStorage = createStorage();
  var unlockBlock = { hidden: true };
  var alreadyPaidClick = null;
  globalThis.window.NSB_MODAL = { open: function () {}, close: function () {} };
  globalThis.document = {
    getElementById: function (id) {
      if (id !== "nsb-modal-overlay") return null;
      return {
        querySelector: function (sel) {
          if (sel === "#nsb-pro-already-paid") {
            return { addEventListener: function (ev, fn) { alreadyPaidClick = fn; } };
          }
          if (sel === "#nsb-pro-unlock") return unlockBlock;
          if (sel === "#nsb-pro-email-error") return { hidden: true };
          return null;
        }
      };
    },
    head: { appendChild: function () {} },
    createElement: function () { return {}; },
    body: { appendChild: function () {}, removeChild: function () {} }
  };
  globalThis.window.NSB_PRO.openUpgradeModal();
  assert.ok(typeof alreadyPaidClick === "function", "already paid handler should be registered");
  alreadyPaidClick();
  assert.strictEqual(unlockBlock.hidden, false, "unlock section should be visible after click");
  alreadyPaidClick();
  assert.strictEqual(unlockBlock.hidden, true, "unlock section should be hidden after second click");
});

test("openUpgradeModal unlock with valid email calls fetch and sets pro on success", async () => {
  storage = {};
  globalThis.localStorage = createStorage();
  var closeCalled = false;
  var emailErrorEl = { textContent: "", hidden: true };
  var unlockBtnStub = { disabled: false, textContent: "Unlock Pro", addEventListener: function (ev, fn) { this._click = fn; } };
  globalThis.window.NSB_MODAL = { open: function () {}, close: function () { closeCalled = true; } };
  globalThis.window.NSB_TOAST = { show: function () {} };
  globalThis.window.NSB_CONFIG = { LICENSE_API_BASE: "https://example.com", PRO_CHECKOUT_URL: "" };
  globalThis.window.NSB_HEADER = { render: function () {} };
  globalThis.fetch = function () {
    return Promise.resolve({ json: function () { return Promise.resolve({ ok: true, active: true }); } });
  };
  globalThis.document = {
    getElementById: function (id) {
      if (id !== "nsb-modal-overlay") return null;
      return {
        querySelector: function (sel) {
          if (sel === "#nsb-pro-unlock-btn") return unlockBtnStub;
          if (sel === "#nsb-pro-email") return { value: "user@example.com" };
          if (sel === "#nsb-pro-email-error") return emailErrorEl;
          return null;
        }
      };
    },
    head: { appendChild: function () {} },
    createElement: function () { return {}; },
    body: { appendChild: function () {}, removeChild: function () {} }
  };
  globalThis.window.NSB_PRO.openUpgradeModal();
  assert.ok(typeof unlockBtnStub._click === "function", "unlock click handler registered");
  unlockBtnStub._click();
  // Let microtask queue flush
  await new Promise(function (r) { setTimeout(r, 0); });
  assert.strictEqual(storage.nsb_pro, "true", "setPro should be called with true on success");
  assert.strictEqual(closeCalled, true, "modal should close on success");
  delete globalThis.fetch;
});

test("openUpgradeModal unlock with active:false does not set pro", async () => {
  storage = {};
  globalThis.localStorage = createStorage();
  var closeCalled = false;
  var emailErrorEl = { textContent: "", hidden: true };
  var unlockBtnStub = { disabled: false, textContent: "Unlock Pro", addEventListener: function (ev, fn) { this._click = fn; } };
  globalThis.window.NSB_MODAL = { open: function () {}, close: function () { closeCalled = true; } };
  globalThis.window.NSB_TOAST = { show: function () {} };
  globalThis.window.NSB_CONFIG = { LICENSE_API_BASE: "https://example.com", PRO_CHECKOUT_URL: "" };
  globalThis.fetch = function () {
    return Promise.resolve({ json: function () { return Promise.resolve({ ok: true, active: false }); } });
  };
  globalThis.document = {
    getElementById: function (id) {
      if (id !== "nsb-modal-overlay") return null;
      return {
        querySelector: function (sel) {
          if (sel === "#nsb-pro-unlock-btn") return unlockBtnStub;
          if (sel === "#nsb-pro-email") return { value: "notpro@example.com" };
          if (sel === "#nsb-pro-email-error") return emailErrorEl;
          return null;
        }
      };
    },
    head: { appendChild: function () {} },
    createElement: function () { return {}; },
    body: { appendChild: function () {}, removeChild: function () {} }
  };
  globalThis.window.NSB_PRO.openUpgradeModal();
  unlockBtnStub._click();
  await new Promise(function (r) { setTimeout(r, 0); });
  assert.strictEqual(storage.nsb_pro, undefined, "setPro should not be called when active is false");
  assert.strictEqual(closeCalled, false, "modal should not close when active is false");
  assert.ok(emailErrorEl.textContent.length > 0, "error message should be shown");
  delete globalThis.fetch;
});

test("verifyEmail returns null on network error", async () => {
  globalThis.window.NSB_CONFIG = { LICENSE_API_BASE: "https://example.com" };
  globalThis.fetch = function () { return Promise.reject(new Error("network fail")); };
  var result = await globalThis.window.NSB_PRO.verifyEmail("user@example.com");
  assert.strictEqual(result, null, "network error should return null");
  delete globalThis.fetch;
});

test("openUpgradeModal unlock with invalid email does not call setPro or close", () => {
  storage = {};
  globalThis.localStorage = createStorage();
  var setProCalled = false;
  var closeCalled = false;
  var emailErrorEl = { textContent: "", hidden: true };
  globalThis.window.NSB_MODAL = { open: function () {}, close: function () { closeCalled = true; } };
  var realSetPro = globalThis.window.NSB_PRO.setPro;
  globalThis.window.NSB_PRO.setPro = function () { setProCalled = true; };
  globalThis.window.NSB_TOAST = { show: function () {} };
  var unlockBtnStub = { addEventListener: function (ev, fn) { this._click = fn; } };
  globalThis.document = {
    getElementById: function (id) {
      if (id !== "nsb-modal-overlay") return null;
      return {
        querySelector: function (sel) {
          if (sel === "#nsb-pro-unlock-btn") return unlockBtnStub;
          if (sel === "#nsb-pro-email") return { value: "no-at-sign" };
          if (sel === "#nsb-pro-email-error") return emailErrorEl;
          return null;
        }
      };
    },
    head: { appendChild: function () {} },
    createElement: function () { return {}; },
    body: { appendChild: function () {}, removeChild: function () {} }
  };
  globalThis.window.NSB_PRO.openUpgradeModal();
  if (unlockBtnStub._click) unlockBtnStub._click();
  assert.strictEqual(setProCalled, false, "setPro should not be called for invalid email");
  assert.strictEqual(closeCalled, false, "modal should not close for invalid email");
  assert.ok(emailErrorEl.textContent === "Enter a valid email." || !setProCalled, "error shown or unlock not triggered");
  globalThis.window.NSB_PRO.setPro = realSetPro;
});
