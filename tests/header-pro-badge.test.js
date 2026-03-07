import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

test("header exposes getProNavHtml and returns correct nav HTML", async () => {
  globalThis.window = { location: { pathname: "/", origin: "http://localhost:8000", search: "" } };
  globalThis.document = {
    getElementById: function () { return { innerHTML: "" }; },
    querySelector: function () { return null; },
    head: { appendChild: function () {} }
  };
  globalThis.localStorage = { getItem: function () { return null; } };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/header.js")).href);
  var header = globalThis.window.NSB_HEADER;
  assert.ok(header && typeof header.getProNavHtml === "function", "getProNavHtml should be defined");

  var htmlPro = header.getProNavHtml(true, false);
  assert.ok(htmlPro.indexOf("nsb-pro-badge") !== -1, "pro=true: should contain nsb-pro-badge id");
  assert.ok(htmlPro.indexOf("button") !== -1, "pro=true: should be a button");
  assert.ok(htmlPro.indexOf("pro-badge") !== -1, "pro=true: should have pro-badge class");

  var htmlUpgrade = header.getProNavHtml(false, true);
  assert.ok(htmlUpgrade.indexOf("data-nsb-open-upgrade") !== -1, "showProBtn=true: should contain upgrade button");

  var htmlEmpty = header.getProNavHtml(false, false);
  assert.strictEqual(htmlEmpty, "", "both false: should be empty string");
});

test("header finishRender binds events once per element when render runs twice", async () => {
  function makeStubEl() {
    var addCalls = 0;
    var attrs = {};
    return {
      get addEventListenerCalls() { return addCalls; },
      addEventListener: function () { addCalls++; },
      setAttribute: function (k, v) { attrs[k] = v; },
      getAttribute: function (k) { return attrs[k] != null ? attrs[k] : null; }
    };
  }
  var searchEl = makeStubEl();
  var upgradeEl = makeStubEl();
  var proBadgeEl = makeStubEl();
  var container = { innerHTML: "" };
  globalThis.window.location = { pathname: "/", origin: "http://localhost:8000", search: "" };
  globalThis.window.NSB_CONFIG = {};
  globalThis.window.NSB_SEARCH_QUERY = "";
  globalThis.window.NSB_UTILS = { debounce: function (fn) { return fn; } };
  globalThis.window.NSB_OPEN_UPGRADE = function () {};
  globalThis.window.document = {
    getElementById: function (id) {
      if (id === "nsb-search") return searchEl;
      if (id === "nsb-pro-badge") return proBadgeEl;
      return null;
    },
    querySelector: function (sel) {
      if (sel === "[data-nsb-open-upgrade]") return upgradeEl;
      return null;
    },
    head: { appendChild: function () {} }
  };
  globalThis.document = globalThis.window.document;
  globalThis.localStorage = { getItem: function () { return "true"; } };
  var header = globalThis.window.NSB_HEADER;
  assert.ok(header && typeof header.render === "function", "NSB_HEADER.render from first test");
  header.render(container);
  header.render(container);
  assert.strictEqual(searchEl.addEventListenerCalls, 2, "search input should get two listeners (input + keydown Enter)");
  assert.strictEqual(upgradeEl.addEventListenerCalls, 1, "upgrade button should get one listener");
  assert.strictEqual(proBadgeEl.addEventListenerCalls, 1, "pro badge should get one listener");
});
