import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const THANK_YOU_HTML = resolve(REPO_ROOT, "thank-you", "index.html");

test("thank-you page exists", () => {
  assert.ok(existsSync(THANK_YOU_HTML), "thank-you/index.html should exist");
});

test("thank-you page has title Pro activated and H1 You're almost there", () => {
  const html = readFileSync(THANK_YOU_HTML, "utf8");
  assert.ok(html.includes("Pro activated - NSB Tools") || html.includes("<title>Pro activated"), "page should have title Pro activated");
  assert.ok(html.includes("You're almost there"), "page should have H1 You're almost there");
});

test("thank-you page has Activate Pro button that calls openUpgradeModal", () => {
  const html = readFileSync(THANK_YOU_HTML, "utf8");
  assert.ok(html.includes("thank-you-activate") && html.includes("Activate Pro"), "page should have Activate Pro button with id");
  assert.ok(html.includes("openUpgradeModal"), "page should call openUpgradeModal");
  assert.ok(html.includes("focusUnlock") || html.includes("openUpgradeModal("), "page should pass focusUnlock or call openUpgradeModal");
});

test("thank-you page shows already activated state when Pro", () => {
  const html = readFileSync(THANK_YOU_HTML, "utf8");
  assert.ok(html.includes("thank-you-already") && html.includes("You are already activated"), "page should have already-activated block");
  assert.ok(html.includes("/pro/") && html.includes("Open Pro hub"), "page should have Open Pro hub link");
});
