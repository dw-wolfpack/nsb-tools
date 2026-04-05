import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const hashtagUi = readFileSync(resolve(REPO_ROOT, "assets/js/tools/hashtag-generator/ui.js"), "utf8");
const contentCalendarUi = readFileSync(resolve(REPO_ROOT, "assets/js/tools/content-calendar/ui.js"), "utf8");
const loanUi = readFileSync(resolve(REPO_ROOT, "assets/js/tools/loan-debt-payoff-calculator/ui.js"), "utf8");
const burnUi = readFileSync(resolve(REPO_ROOT, "assets/js/tools/burn-rate-runway-calculator/ui.js"), "utf8");

test("hashtag-generator export triggers requirePro when not Pro", () => {
  assert.ok(hashtagUi.includes("NSB_PRO.requirePro"), "hashtag ui should call requirePro for export");
  assert.ok(hashtagUi.includes("requirePro(function"), "hashtag export action should be wrapped in requirePro callback");
});

test("hashtag-generator Export CSV button has data-nsb-lock-context export", () => {
  assert.ok(hashtagUi.includes("data-nsb-lock-context") && hashtagUi.includes("export"), "hashtag csv button should have data-nsb-lock-context=\"export\"");
});

test("content-calendar export triggers requirePro when not Pro", () => {
  assert.ok(contentCalendarUi.includes("NSB_PRO.requirePro"), "content-calendar ui should call requirePro for export");
  assert.ok(contentCalendarUi.includes("requirePro(function"), "content-calendar export action should be wrapped in requirePro callback");
});

test("content-calendar Export CSV button has data-nsb-lock-context export", () => {
  assert.ok(contentCalendarUi.includes("data-nsb-lock-context") && contentCalendarUi.includes("export"), "content-calendar csv button should have data-nsb-lock-context=\"export\"");
});

test("loan calculator export uses buildToolExportCSV and import is Pro-gated", () => {
  assert.ok(loanUi.includes("buildToolExportCSV"), "loan export should use buildToolExportCSV for inputs+schedule");
  assert.ok(loanUi.includes("nsb-import-csv") && loanUi.includes("data-nsb-lock-context") && loanUi.includes("import"), "loan should have Import CSV with import lock context");
  assert.ok(loanUi.includes("parseToolExportWithInputs"), "loan import should parse combined export");
});

test("burn calculator export uses buildToolExportCSV and import is Pro-gated", () => {
  assert.ok(burnUi.includes("buildToolExportCSV"), "burn export should use buildToolExportCSV");
  assert.ok(burnUi.includes("nsb-import-csv") && burnUi.includes("import"), "burn should have Import CSV");
  assert.ok(burnUi.includes("parseToolExportWithInputs"), "burn import should parse combined export");
});
