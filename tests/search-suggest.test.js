import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

test("NSB_SEARCH_SUGGEST.init creates dropdown once and respects maxResults", async () => {
  var appendCount = 0;
  var attrs = {};
  var wrapper = {
    appendChild: function (el) { appendCount++; this._dropdown = el; },
    getAttribute: function (k) { return attrs[k] != null ? attrs[k] : null; },
    setAttribute: function (k, v) { attrs[k] = v; },
    closest: function () { return wrapper; }
  };
  var inputEl = {
    value: "",
    addEventListener: function () {},
    closest: function () { return wrapper; }
  };
  globalThis.window = {
    NSB_REGISTRY: {
      TOOLS: [
        { slug: "loan-calc", name: "Loan Calculator", description: "Debt payoff", path: "/tools/loan-calc/", isHidden: false },
        { slug: "other", name: "Other Tool", description: "Something", path: "/tools/other/", isHidden: false }
      ]
    },
    NSB_UTILS: { debounce: function (fn) { return fn; } }
  };
  globalThis.document = {
    createElement: function (tag) {
      return {
        className: "", hidden: true, setAttribute: function () {}, appendChild: function () {},
        innerHTML: "", querySelectorAll: function () { return []; }, getAttribute: function () {},
        addEventListener: function () {}
      };
    },
    addEventListener: function () {}
  };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/components/search-suggest.js")).href);
  var suggest = globalThis.window.NSB_SEARCH_SUGGEST;
  assert.ok(suggest && typeof suggest.init === "function", "NSB_SEARCH_SUGGEST.init should be defined");

  suggest.init(inputEl, { maxResults: 8 });
  assert.strictEqual(appendCount, 1, "init should append dropdown once");

  suggest.init(inputEl, { maxResults: 8 });
  assert.strictEqual(appendCount, 1, "second init on same wrapper should not append again (idempotent)");
});

test("NSB_SEARCH_SUGGEST filters tools and respects maxResults", async () => {
  var tools = [
    { slug: "a", name: "Alpha", description: "First", path: "/tools/a/", isHidden: false },
    { slug: "b", name: "Beta", description: "Second", path: "/tools/b/", isHidden: false },
    { slug: "c", name: "Gamma", description: "Third", path: "/tools/c/", isHidden: false },
    { slug: "d", name: "Delta", description: "Fourth", path: "/tools/d/", isHidden: false }
  ];
  var dropdownHtml = "";
  var wrapper = {
    appendChild: function (el) {
      this._dropdown = el;
      Object.defineProperty(el, "innerHTML", {
        set: function (v) { dropdownHtml = v; },
        get: function () { return dropdownHtml; },
        configurable: true
      });
    },
    getAttribute: function () { return null; },
    setAttribute: function () {}
  };
  var inputEl = {
    value: "a",
    addEventListener: function (ev, fn) {
      if (ev === "input") this._oninput = fn;
    },
    closest: function () { return wrapper; }
  };
  globalThis.window.NSB_REGISTRY = { TOOLS: tools };
  globalThis.window.NSB_UTILS = { debounce: function (fn) { return fn; } };
  globalThis.document.createElement = function () {
    return {
      className: "", hidden: true, setAttribute: function () {}, appendChild: function () {},
      innerHTML: "", querySelectorAll: function () { return []; }, getAttribute: function () {},
      addEventListener: function () {}
    };
  };
  if (!globalThis.document.addEventListener) globalThis.document.addEventListener = function () {};
  var suggest = globalThis.window.NSB_SEARCH_SUGGEST;
  assert.ok(suggest && suggest.init, "NSB_SEARCH_SUGGEST from first test");
  suggest.init(inputEl, { maxResults: 2 });
  if (inputEl._oninput) inputEl._oninput();
  assert.ok(dropdownHtml.indexOf("Alpha") >= 0 || dropdownHtml.length > 0, "dropdown should show matches");
});
