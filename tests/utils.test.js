import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

async function loadUtils() {
  globalThis.window = { location: { search: "" } };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/utils.js")).href);
  return globalThis.window.NSB_UTILS;
}

const utils = await loadUtils();

test("parseNumberSafe: 6.9% returns 6.9", () => {
  const n = utils.parseNumberSafe("6.9%");
  assert.ok(!Number.isNaN(n), `Expected number, got NaN`);
  assert.strictEqual(n, 6.9);
});

test("parseNumberSafe: 1,234.56 with spaces returns 1234.56", () => {
  const n = utils.parseNumberSafe("  1,234.56 ");
  assert.ok(!Number.isNaN(n), `Expected number, got NaN`);
  assert.strictEqual(n, 1234.56);
});

test("parseNumberSafe: $1,200 returns 1200", () => {
  const n = utils.parseNumberSafe("$1,200");
  assert.ok(!Number.isNaN(n), `Expected number, got NaN`);
  assert.strictEqual(n, 1200);
});

test("encodeParams and decodeParams roundtrip", () => {
  const obj = { a: 1, b: "x y", c: "special=value" };
  const encoded = utils.encodeParams(obj);
  const decoded = utils.decodeParams("?" + encoded);
  assert.deepStrictEqual(decoded, { a: "1", b: "x y", c: "special=value" });
});

test("updateURLParams does not throw in Node when history is undefined", () => {
  assert.doesNotThrow(() => {
    utils.updateURLParams("/foo/", { x: 1 }, "replace");
  });
});
