import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMetrics, loadHiddenToolRoutes, stripHiddenElements } from "../scripts/seo-metrics.mjs";

// Minimal known routes set used by computeMetrics for broken-link checks
const KNOWN_ROUTES = new Set([
  "/",
  "/tools/hook-generator/",
  "/tools/freelance-rate-calculator/",
  "/categories/",
  "/glossary/",
]);

// -------------------------------------------------------------------------
// stripHiddenElements unit tests
// -------------------------------------------------------------------------

test("stripHiddenElements: removes element with hidden attribute", () => {
  const html = `<div><p hidden><a href="/tools/hidden-route/">should be gone</a></p><a href="/tools/hook-generator/">visible</a></div>`;
  const result = stripHiddenElements(html);
  assert.ok(!result.includes("/tools/hidden-route/"), "link inside hidden element should be stripped");
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
});

test("stripHiddenElements: removes element with aria-hidden=true", () => {
  const html = `<span aria-hidden="true"><a href="/tools/hidden-route/">gone</a></span><a href="/tools/hook-generator/">kept</a>`;
  const result = stripHiddenElements(html);
  assert.ok(!result.includes("/tools/hidden-route/"), "link inside aria-hidden element should be stripped");
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
});

test("stripHiddenElements: removes element with display:none style", () => {
  const html = `<div style="display:none"><a href="/tools/hidden-route/">gone</a></div><a href="/tools/hook-generator/">kept</a>`;
  const result = stripHiddenElements(html);
  assert.ok(!result.includes("/tools/hidden-route/"), "link inside display:none element should be stripped");
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
});

test("stripHiddenElements: removes element with visibility:hidden style", () => {
  const html = `<div style="visibility:hidden"><a href="/tools/hidden-route/">gone</a></div><a href="/tools/hook-generator/">kept</a>`;
  const result = stripHiddenElements(html);
  assert.ok(!result.includes("/tools/hidden-route/"), "link inside visibility:hidden element should be stripped");
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
});

test("stripHiddenElements: removes element with class visually-hidden", () => {
  const html = `<span class="visually-hidden"><a href="/tools/hidden-route/">gone</a></span><a href="/tools/hook-generator/">kept</a>`;
  const result = stripHiddenElements(html);
  assert.ok(!result.includes("/tools/hidden-route/"), "link inside visually-hidden element should be stripped");
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
});

test("stripHiddenElements: removes element with class sr-only", () => {
  const html = `<span class="sr-only"><a href="/tools/hidden-route/">gone</a></span><a href="/tools/hook-generator/">kept</a>`;
  const result = stripHiddenElements(html);
  assert.ok(!result.includes("/tools/hidden-route/"), "link inside sr-only element should be stripped");
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
});

test("stripHiddenElements: does not remove visible links", () => {
  const html = `<main><p>Normal content</p><a href="/tools/hook-generator/">tool</a><a href="/glossary/">glossary</a></main>`;
  const result = stripHiddenElements(html);
  assert.ok(result.includes("/tools/hook-generator/"), "visible link should remain");
  assert.ok(result.includes("/glossary/"), "visible link should remain");
});

// -------------------------------------------------------------------------
// computeMetrics integration: hidden links do not affect counts
// -------------------------------------------------------------------------

const HIDDEN_IN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test Page</title>
  <meta name="description" content="A description that is between fifty and one hundred sixty characters for testing.">
  <link rel="canonical" href="https://tools.nextstepsbeyond.online/">
</head>
<body>
<main>
  <h1>Test</h1>
  <p>Content to meet word count. More words here to keep things simple for testing purposes in this fixture file.</p>
  <div hidden><a href="/tools/freelance-rate-calculator/">hidden link</a></div>
  <a href="/tools/hook-generator/">visible link</a>
  <span aria-hidden="true"><a href="/categories/">aria hidden link</a></span>
</main>
</body>
</html>`;

test("computeMetrics: links inside hidden elements are excluded from internalLinksUnique", () => {
  const result = computeMetrics("index.html", HIDDEN_IN_HTML, KNOWN_ROUTES, null, new Set());
  // Only /tools/hook-generator/ should be counted; hidden and aria-hidden links must not be
  assert.ok(
    result.internalLinksUnique <= 1,
    `Expected at most 1 unique link (the visible one), got ${result.internalLinksUnique}`
  );
});

test("computeMetrics: visible links are counted (not zero)", () => {
  const visibleOnly = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test Page</title>
  <meta name="description" content="A description that is between fifty and one hundred sixty characters for testing.">
  <link rel="canonical" href="https://tools.nextstepsbeyond.online/">
</head>
<body>
<main>
  <h1>Test</h1>
  <p>Content to meet word count. More words here for testing purposes.</p>
  <a href="/tools/hook-generator/">visible link</a>
</main>
</body>
</html>`;
  const result = computeMetrics("index.html", visibleOnly, KNOWN_ROUTES, null, new Set());
  assert.ok(result.internalLinksUnique >= 1, `Expected at least 1 unique link, got ${result.internalLinksUnique}`);
  assert.ok(result.internalLinksTotal >= 1, `Expected at least 1 total link, got ${result.internalLinksTotal}`);
});

// -------------------------------------------------------------------------
// loadHiddenToolRoutes: returns empty set when no tools are hidden
// -------------------------------------------------------------------------

test("loadHiddenToolRoutes: returns empty set (no tools are hidden)", () => {
  const hidden = loadHiddenToolRoutes();
  assert.strictEqual(hidden.size, 0, `Expected 0 hidden tool routes, got ${hidden.size}: ${[...hidden].join(", ")}`);
});

// -------------------------------------------------------------------------
// computeMetrics: hiddenToolLinksFound is empty when all tools are visible
// -------------------------------------------------------------------------

test("computeMetrics: hiddenToolLinksFound is empty when registry has no hidden tools", () => {
  const hiddenToolsSet = loadHiddenToolRoutes();
  const result = computeMetrics("index.html", HIDDEN_IN_HTML, KNOWN_ROUTES, null, hiddenToolsSet);
  assert.deepStrictEqual(
    result.hiddenToolLinksFound,
    [],
    `Expected no hidden tool links, got: ${result.hiddenToolLinksFound.join(", ")}`
  );
});
