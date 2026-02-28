import { test } from "node:test";
import assert from "node:assert/strict";
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

const EXPECTED_TOOL_COUNT = 25;

test("registry: tool count is at least expected minimum", () => {
  assert.ok(
    R.TOOLS.length >= EXPECTED_TOOL_COUNT,
    `Expected at least ${EXPECTED_TOOL_COUNT} tools, got ${R.TOOLS.length}`
  );
});

test("registry: all tools are visible (no isHidden: true)", () => {
  const hidden = R.TOOLS.filter((t) => t.isHidden);
  assert.deepStrictEqual(
    hidden.map((t) => t.slug),
    [],
    `Hidden tools found: ${hidden.map((t) => t.slug).join(", ")}`
  );
});

test("registry: no duplicate slugs", () => {
  const slugs = R.TOOLS.map((t) => t.slug);
  const unique = new Set(slugs);
  assert.strictEqual(slugs.length, unique.size, "Duplicate slugs found in TOOLS");
});

test("registry: every tool has required fields", () => {
  for (const t of R.TOOLS) {
    assert.ok(t.slug, `A tool is missing slug`);
    assert.ok(t.name, `Tool ${t.slug} is missing name`);
    assert.ok(t.path, `Tool ${t.slug} is missing path`);
    assert.ok(t.category, `Tool ${t.slug} is missing category`);
    assert.ok(Array.isArray(t.tags), `Tool ${t.slug} tags must be an array`);
  }
});

test("registry: every tool path starts with /tools/ and ends with /", () => {
  for (const t of R.TOOLS) {
    assert.ok(
      t.path.startsWith("/tools/"),
      `Tool ${t.slug} path "${t.path}" should start with /tools/`
    );
    assert.ok(
      t.path.endsWith("/"),
      `Tool ${t.slug} path "${t.path}" should end with /`
    );
  }
});

test("registry: visible tool count equals total tool count", () => {
  const visible = R.TOOLS.filter((t) => !t.isHidden);
  assert.strictEqual(
    visible.length,
    R.TOOLS.length,
    `${R.TOOLS.length - visible.length} tool(s) are hidden; expected all tools to be visible`
  );
});

export const ALL_TOOL_SLUGS = R.TOOLS.map((t) => t.slug);
