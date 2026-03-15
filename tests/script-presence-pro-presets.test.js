import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const REQUIRED_SCRIPTS = ["/assets/js/pro-store.js", "/assets/js/tool-adapters.js"];
const TOOL_PAGES_ALSO = ["/assets/js/components/pro-actions.js"];

const FILES = [
  { path: "tools/loan-debt-payoff-calculator/index.html", scripts: [...REQUIRED_SCRIPTS, ...TOOL_PAGES_ALSO] },
  { path: "tools/burn-rate-runway-calculator/index.html", scripts: [...REQUIRED_SCRIPTS, ...TOOL_PAGES_ALSO] },
  { path: "pro/index.html", scripts: REQUIRED_SCRIPTS },
];

test("loan, burn, and pro pages include required Pro Presets scripts", () => {
  for (const { path: rel, scripts } of FILES) {
    const html = readFileSync(resolve(REPO_ROOT, rel), "utf8");
    for (const src of scripts) {
      assert.ok(
        html.indexOf(src) !== -1,
        rel + " must include script: " + src
      );
    }
  }
});
