import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

var elementsById = {};
var mainChildren = [];

function createEl(tag) {
  var el = {
    tagName: tag,
    id: "",
    className: "",
    parentNode: null,
    nextSibling: null,
    innerHTML: "",
    setAttribute: function () {},
    getAttribute: function () { return null; },
    appendChild: function (child) {
      if (child.id) elementsById[child.id] = child;
      mainChildren.push(child);
    },
    querySelectorAll: function () { return []; },
    addEventListener: function () {},
  };
  return el;
}

function setupDoc() {
  elementsById = {};
  mainChildren = [];
  var main = {
    appendChild: function (child) {
      if (child.id) elementsById[child.id] = child;
      mainChildren.push(child);
    },
  };
  globalThis.document = {
    querySelector: function (sel) {
      if (sel === "main") return main;
      return null;
    },
    getElementById: function (id) {
      return elementsById[id] || null;
    },
    createElement: function (tag) {
      var el = createEl(tag);
      Object.defineProperty(el, "id", { get: function () { return this._id || ""; }, set: function (v) { this._id = v; if (v) elementsById[v] = el; }, configurable: true });
      return el;
    },
    head: { appendChild: function () {} },
  };
  globalThis.window = globalThis.window || {};
  globalThis.window.dispatchEvent = function () {};
  globalThis.window.addEventListener = function () {};
}

beforeEach(function () {
  setupDoc();
});

test("bottom strip mounts only on /tools/ path", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.location = { pathname: "/tools/loan-debt-payoff-calculator/" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-cta.js")).href);
  globalThis.window.NSB_PRO_CTA.mountBottomStrip();
  assert.ok(globalThis.document.getElementById("nsb-pro-cta-strip"), "strip should exist when path is /tools/");
});

test("bottom strip copy includes Save your inputs and price text", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.location = { pathname: "/tools/some-tool/" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-cta.js")).href);
  globalThis.window.NSB_PRO_CTA.mountBottomStrip();
  var strip = globalThis.document.getElementById("nsb-pro-cta-strip");
  assert.ok(strip && strip.innerHTML.indexOf("Save your inputs") >= 0, "strip should include Save your inputs");
  assert.ok(strip && (strip.innerHTML.indexOf("/mo") >= 0 || strip.innerHTML.indexOf("Pro.") >= 0), "strip should include price or Pro meta");
});

test("bottom strip does not mount when path is /", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.location = { pathname: "/" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-cta.js")).href);
  globalThis.window.NSB_PRO_CTA.mountBottomStrip();
  assert.strictEqual(globalThis.document.getElementById("nsb-pro-cta-strip"), null, "strip should not exist when path is /");
});

test("bottom strip does not mount when nsb_pro true", async () => {
  globalThis.localStorage = { getItem: function (k) { return k === "nsb_pro" ? "true" : null; } };
  globalThis.window.location = { pathname: "/tools/some-tool/" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-cta.js")).href);
  globalThis.window.NSB_PRO_CTA.mountBottomStrip();
  assert.strictEqual(globalThis.document.getElementById("nsb-pro-cta-strip"), null, "strip should not exist when pro");
});

test("bottom strip mount is idempotent", async () => {
  globalThis.localStorage = { getItem: function () { return null; } };
  globalThis.window.location = { pathname: "/tools/foo/" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/pro-cta.js")).href);
  globalThis.window.NSB_PRO_CTA.mountBottomStrip();
  globalThis.window.NSB_PRO_CTA.mountBottomStrip();
  assert.strictEqual(mainChildren.length, 1, "only one child (strip) should be appended after double mount");
});
