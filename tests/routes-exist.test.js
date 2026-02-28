import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

async function loadRegistry() {
  globalThis.window = {};
  await import(pathToFileURL(resolve(REPO_ROOT, "assets/js/registry.js")).href + "?v=" + Date.now());
  return globalThis.window.NSB_REGISTRY;
}

const R = await loadRegistry();

test("routes: every tool has a corresponding index.html on disk", () => {
  const missing = [];
  for (const t of R.TOOLS) {
    // /tools/foo/ -> tools/foo/index.html
    const rel = t.path.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
    const abs = resolve(REPO_ROOT, rel);
    if (!existsSync(abs)) {
      missing.push(`${t.slug}: ${rel}`);
    }
  }
  assert.deepStrictEqual(missing, [], `Missing tool pages:\n  ${missing.join("\n  ")}`);
});

test("routes: every category has a corresponding index.html on disk", () => {
  const missing = [];
  for (const c of R.CATEGORIES) {
    const rel = "categories/" + c.slug + "/index.html";
    const abs = resolve(REPO_ROOT, rel);
    if (!existsSync(abs)) {
      missing.push(rel);
    }
  }
  assert.deepStrictEqual(missing, [], `Missing category pages:\n  ${missing.join("\n  ")}`);
});
