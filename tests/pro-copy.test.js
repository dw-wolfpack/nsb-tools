import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

beforeEach(function () {
  if (typeof globalThis.window === "undefined") globalThis.window = {};
  delete globalThis.window.NSB_CONFIG;
});

test("formatPrice returns config value when present", async () => {
  globalThis.window.NSB_CONFIG = { PRO_PRICE_TEXT: "$9.99/mo" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.strictEqual(globalThis.window.NSB_PRO_COPY.formatPrice(), "$9.99/mo");
});

test("formatPrice falls back to default when missing", async () => {
  globalThis.window.NSB_CONFIG = {};
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.ok(globalThis.window.NSB_PRO_COPY, "NSB_PRO_COPY should be defined after import");
  assert.strictEqual(globalThis.window.NSB_PRO_COPY.formatPrice(), "$14.99/mo");
});

test("modalBenefits returns the two benefit bullets", async () => {
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.ok(globalThis.window.NSB_PRO_COPY, "NSB_PRO_COPY should be defined after import");
  var bullets = globalThis.window.NSB_PRO_COPY.modalBenefits();
  assert.strictEqual(bullets.length, 2);
  assert.ok(bullets[0].indexOf("Pick up where you left off") >= 0);
  assert.ok(bullets[1].indexOf("Export to CSV") >= 0);
});

test("inlineLockText returns export variant for export context", async () => {
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.ok(globalThis.window.NSB_PRO_COPY, "NSB_PRO_COPY should be defined after import");
  assert.strictEqual(globalThis.window.NSB_PRO_COPY.inlineLockText("export"), "Export to CSV. Unlock Pro.");
});

test("inlineLockText returns presets variant for presets context", async () => {
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.ok(globalThis.window.NSB_PRO_COPY, "NSB_PRO_COPY should be defined after import");
  assert.strictEqual(globalThis.window.NSB_PRO_COPY.inlineLockText("presets"), "Save inputs for next time. Unlock Pro.");
});

test("bottomStripText returns headline and subtext with price", async () => {
  globalThis.window.NSB_CONFIG = { PRO_PRICE_TEXT: "$14.99/mo" };
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.ok(globalThis.window.NSB_PRO_COPY, "NSB_PRO_COPY should be defined after import");
  var out = globalThis.window.NSB_PRO_COPY.bottomStripText();
  assert.ok(out.headline.indexOf("Save your inputs") >= 0);
  assert.ok(out.subtext.indexOf("$14.99/mo") >= 0);
});

test("bottomStripText returns calculator headline when toolHint is calculator", async () => {
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/pro-copy.js")).href);
  assert.ok(globalThis.window.NSB_PRO_COPY, "NSB_PRO_COPY should be defined after import");
  var out = globalThis.window.NSB_PRO_COPY.bottomStripText("calculator");
  assert.ok(out.headline.indexOf("Running this monthly") >= 0);
});
