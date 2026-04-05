import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

var insertedNodes = [];

function createEl(tag) {
  return {
    tagName: tag,
    id: "",
    className: "",
    parentNode: null,
    nextSibling: null,
    innerHTML: "",
    setAttribute: function () {},
    getAttribute: function () { return null; },
    removeAttribute: function () {},
    insertBefore: function (newEl, ref) {
      insertedNodes.push(newEl);
    },
    querySelectorAll: function () { return []; },
    addEventListener: function () {},
  };
}

function setupDoc() {
  insertedNodes = [];
  globalThis.document = {
    createElement: function (tag) {
      var el = createEl(tag);
      return el;
    },
    querySelector: function () { return null; },
    querySelectorAll: function () { return insertedNodes; },
  };
  globalThis.window = globalThis.window || {};
  globalThis.window.addEventListener = function () {};
}

beforeEach(function () {
  setupDoc();
});

test("show() inserts once per anchor", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  var anchorAttrs = {};
  var anchor = {
    parentNode: { insertBefore: function (newEl) { insertedNodes.push(newEl); } },
    nextSibling: null,
    getAttribute: function (k) { return anchorAttrs[k] != null ? anchorAttrs[k] : null; },
    setAttribute: function (k, v) { anchorAttrs[k] = v; },
  };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-inline-lock.js")).href);
  globalThis.window.NSB_PRO_INLINE_LOCK.show(anchor);
  globalThis.window.NSB_PRO_INLINE_LOCK.show(anchor);
  assert.strictEqual(insertedNodes.length, 1, "only one banner should be inserted for same anchor");
});

test("show() does nothing when pro", async () => {
  globalThis.localStorage = { getItem: function (k) { return k === "nsb_pro" ? "true" : null; } };
  var anchor = {
    parentNode: { insertBefore: function (newEl) { insertedNodes.push(newEl); } },
    nextSibling: null,
    getAttribute: function () { return null; },
    setAttribute: function () {},
  };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-inline-lock.js")).href);
  globalThis.window.NSB_PRO_INLINE_LOCK.show(anchor);
  assert.strictEqual(insertedNodes.length, 0, "no banner when user is pro");
});

test("show() with data-nsb-lock-context export uses export copy", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.NSB_PRO_COPY = {
    inlineLockText: function (ctx) { return ctx === "export" ? "Export to CSV. Unlock Pro." : "Unlock Pro to continue."; },
    formatPrice: function () { return "$14.99/mo"; }
  };
  var anchorAttrs = {};
  var anchor = {
    parentNode: { insertBefore: function (newEl) { insertedNodes.push(newEl); } },
    nextSibling: null,
    getAttribute: function (k) { return anchorAttrs[k] != null ? anchorAttrs[k] : null; },
    setAttribute: function (k, v) { anchorAttrs[k] = v; },
  };
  anchor.setAttribute("data-nsb-lock-context", "export");
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-inline-lock.js")).href);
  globalThis.window.NSB_PRO_INLINE_LOCK.show(anchor);
  assert.strictEqual(insertedNodes.length, 1);
  assert.ok(insertedNodes[0].innerHTML.indexOf("Export to CSV") >= 0, "banner should show export copy");
});

test("show() with data-nsb-lock-context import uses import copy", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.NSB_PRO_COPY = {
    inlineLockText: function (ctx) { return ctx === "import" ? "Import from CSV. Unlock Pro." : "Unlock Pro to continue."; },
    formatPrice: function () { return "$14.99/mo"; },
  };
  var anchorAttrs = {};
  var anchor = {
    parentNode: { insertBefore: function (newEl) { insertedNodes.push(newEl); } },
    nextSibling: null,
    getAttribute: function (k) { return anchorAttrs[k] != null ? anchorAttrs[k] : null; },
    setAttribute: function (k, v) { anchorAttrs[k] = v; },
  };
  anchor.setAttribute("data-nsb-lock-context", "import");
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-inline-lock.js")).href);
  globalThis.window.NSB_PRO_INLINE_LOCK.show(anchor);
  assert.strictEqual(insertedNodes.length, 1);
  assert.ok(insertedNodes[0].innerHTML.indexOf("Import from CSV") >= 0, "banner should show import copy");
});

test("show() with data-nsb-lock-context presets uses presets copy", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.NSB_PRO_COPY = {
    inlineLockText: function (ctx) { return (ctx === "presets" || ctx === "save" || ctx === "load") ? "Save inputs for next time. Unlock Pro." : "Unlock Pro to continue."; },
    formatPrice: function () { return "$14.99/mo"; }
  };
  var anchorAttrs = {};
  var anchor = {
    parentNode: { insertBefore: function (newEl) { insertedNodes.push(newEl); } },
    nextSibling: null,
    getAttribute: function (k) { return anchorAttrs[k] != null ? anchorAttrs[k] : null; },
    setAttribute: function (k, v) { anchorAttrs[k] = v; },
  };
  anchor.setAttribute("data-nsb-lock-context", "presets");
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-inline-lock.js")).href);
  globalThis.window.NSB_PRO_INLINE_LOCK.show(anchor);
  assert.strictEqual(insertedNodes.length, 1);
  assert.ok(insertedNodes[0].innerHTML.indexOf("Save inputs for next time") >= 0, "banner should show presets copy");
});
