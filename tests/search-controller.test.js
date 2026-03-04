import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SEARCH_CONTROLLER_PATH = resolve(REPO_ROOT, "assets/js/search-controller.js");

function createSearchDomStub(withChipRow = true) {
  const heroInput = { value: "", setAttribute() {}, getAttribute() { return ""; }, addEventListener() {} };
  const headerInput = { value: "", setAttribute() {}, getAttribute() { return ""; }, addEventListener() {} };

  const allChip = { _attrs: { "data-category": "", "data-tag": "" }, setAttribute(k, v) { this._attrs[k] = v; }, getAttribute(k) { return this._attrs[k] || ""; } };
  const socialChip = { _attrs: { "data-category": "social", "data-tag": "" }, setAttribute(k, v) { this._attrs[k] = v; }, getAttribute(k) { return this._attrs[k] || ""; } };
  const chips = [allChip, socialChip];

  const chipRow = withChipRow ? {
    querySelector(sel) {
      if (sel === ".chip[data-category='']") return allChip;
      return null;
    },
    querySelectorAll(sel) {
      if (sel === ".chip" || (sel && sel.includes("chip"))) return chips;
      return [];
    }
  } : null;

  const document = {
    getElementById(id) {
      if (id === "nsb-hero-search") return heroInput;
      if (id === "nsb-search") return headerInput;
      return null;
    },
    querySelector(sel) {
      if (sel === ".chip-row") return chipRow;
      return null;
    },
    querySelectorAll() { return []; }
  };

  let onSearchCalled = 0;
  const window = {
    NSB_SEARCH_QUERY: "",
    NSB_CATEGORY_FILTER: "",
    NSB_TAG_FILTER: "",
    NSB_ON_SEARCH() { onSearchCalled++; },
    NSB_UTILS: { debounce(fn) { return fn; } },
    get onSearchCalled() { return onSearchCalled; },
    _heroInput: heroInput,
    _headerInput: headerInput,
    _allChip: allChip,
    _socialChip: socialChip
  };

  return { document, window };
}

async function loadSearchController(stub) {
  globalThis.document = stub.document;
  globalThis.window = stub.window;
  await import(pathToFileURL(SEARCH_CONTROLLER_PATH).href + "?v=" + Date.now());
  return globalThis.window.NSB_SEARCH;
}

test("search-controller: setQuery(loan, hero) sets globals, resets chips, syncs inputs, calls NSB_ON_SEARCH", async () => {
  const stub = createSearchDomStub(true);
  const NSB_SEARCH = await loadSearchController(stub);
  assert.ok(NSB_SEARCH && typeof NSB_SEARCH.setQuery === "function");

  const calledBefore = stub.window.onSearchCalled;
  NSB_SEARCH.setQuery("loan", "hero");

  assert.strictEqual(stub.window.NSB_SEARCH_QUERY, "loan");
  assert.strictEqual(stub.window.NSB_CATEGORY_FILTER, "");
  assert.strictEqual(stub.window.NSB_TAG_FILTER, "");
  assert.strictEqual(stub.window._headerInput.value, "loan");
  assert.strictEqual(stub.window._allChip._attrs["aria-pressed"], "true");
  assert.strictEqual(stub.window._socialChip._attrs["aria-pressed"], "false");
  assert.ok(stub.window.onSearchCalled > calledBefore, "NSB_ON_SEARCH should have been called");
});

test("search-controller: setQuery(whitespace, header) sets empty query, syncs inputs", async () => {
  const stub = createSearchDomStub(true);
  await loadSearchController(stub);
  const NSB_SEARCH = stub.window.NSB_SEARCH;

  stub.window._heroInput.value = "x";
  stub.window._headerInput.value = "x";
  NSB_SEARCH.setQuery("  ", "header");

  assert.strictEqual(stub.window.NSB_SEARCH_QUERY, "");
  assert.strictEqual(stub.window._heroInput.value, "");
  assert.strictEqual(stub.window._headerInput.value, "");
});

test("search-controller: setQuery(test, header) when no chip row does not throw", async () => {
  const stub = createSearchDomStub(false);
  const NSB_SEARCH = await loadSearchController(stub);

  assert.doesNotThrow(() => {
    NSB_SEARCH.setQuery("test", "header");
  });
  assert.strictEqual(stub.window.NSB_SEARCH_QUERY, "test");
  assert.strictEqual(stub.window._heroInput.value, "test");
  assert.strictEqual(stub.window._headerInput.value, "test");
});
