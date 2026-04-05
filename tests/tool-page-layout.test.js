import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(__dirname, "..");

function walkHtml(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, acc);
    else if (name === "index.html") acc.push(p);
  }
  return acc;
}

const toolIndexes = walkHtml(join(REPO_ROOT, "tools"));

for (const file of toolIndexes) {
  const rel = relative(REPO_ROOT, file);
  test(`tool layout: ${rel} workspace before guide when both exist`, () => {
    const html = readFileSync(file, "utf8");
    if (!html.includes("tool-workspace")) return;
    assert.ok(html.includes('id="tool-guide"'), `${rel} must define #tool-guide`);
    const ws = html.indexOf('class="tool-workspace"');
    const tg = html.indexOf('id="tool-guide"');
    assert.ok(ws !== -1 && tg !== -1, `${rel} must include tool-workspace and #tool-guide`);
    assert.ok(ws < tg, `${rel}: tool-workspace must appear before #tool-guide`);
  });
}
