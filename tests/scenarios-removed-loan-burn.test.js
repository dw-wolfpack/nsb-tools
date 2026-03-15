import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const loanUi = readFileSync(resolve(REPO_ROOT, "assets/js/tools/loan-debt-payoff-calculator/ui.js"), "utf8");
const burnUi = readFileSync(resolve(REPO_ROOT, "assets/js/tools/burn-rate-runway-calculator/ui.js"), "utf8");

test("loan ui does not inject legacy Scenarios UI (no NSB_SCENARIOS.renderUI)", () => {
  assert.ok(loanUi.indexOf("NSB_SCENARIOS.renderUI") === -1, "loan ui must not call NSB_SCENARIOS.renderUI");
});

test("burn ui does not inject legacy Scenarios UI (no NSB_SCENARIOS.renderUI)", () => {
  assert.ok(burnUi.indexOf("NSB_SCENARIOS.renderUI") === -1, "burn ui must not call NSB_SCENARIOS.renderUI");
});

test("loan and burn tool HTML do not contain scenario-builder.js script", () => {
  const loanHtml = readFileSync(resolve(REPO_ROOT, "tools/loan-debt-payoff-calculator/index.html"), "utf8");
  const burnHtml = readFileSync(resolve(REPO_ROOT, "tools/burn-rate-runway-calculator/index.html"), "utf8");
  assert.ok(loanHtml.indexOf("scenario-builder.js") === -1, "loan index must not load scenario-builder.js");
  assert.ok(burnHtml.indexOf("scenario-builder.js") === -1, "burn index must not load scenario-builder.js");
});
