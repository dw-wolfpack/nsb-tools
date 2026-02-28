import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPageFromHtml } from "../scripts/seo-audit.mjs";

const ORIGIN = "https://tools.nextstepsbeyond.online";

const FIXTURE_CANONICAL_NO_SLASH = `<!DOCTYPE html><html><head>
  <link rel="canonical" href="${ORIGIN}/ai/foo">
  <title>Short</title>
</head><body><h1>Test</h1></body></html>`;

const FIXTURE_CANONICAL_WITH_SLASH = `<!DOCTYPE html><html><head>
  <link rel="canonical" href="${ORIGIN}/ai/foo/">
  <title>Valid Title Here</title>
  <meta name="description" content="A description that is between fifty and one hundred sixty characters in length for the meta tag.">
  <meta property="og:title" content="OG">
  <meta property="og:description" content="OG desc">
  <meta property="og:url" content="${ORIGIN}/">
  <meta property="og:image" content="${ORIGIN}/img.png">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Tw">
  <meta name="twitter:description" content="Tw desc">
  <meta name="twitter:image" content="${ORIGIN}/img.png">
</head><body><h1>Test</h1></body></html>`;

const FIXTURE_EMBED_NO_NOINDEX = `<!DOCTYPE html><html><head>
  <link rel="canonical" href="${ORIGIN}/embed/bar/">
  <title>Embed</title>
</head><body></body></html>`;

const FIXTURE_EMBED_WITH_NOINDEX = `<!DOCTYPE html><html><head>
  <link rel="canonical" href="${ORIGIN}/embed/bar/">
  <meta name="robots" content="noindex, nofollow">
  <title>Embed</title>
</head><body></body></html>`;

test("canonical without trailing slash yields end-with-slash issue", () => {
  const issues = checkPageFromHtml(FIXTURE_CANONICAL_NO_SLASH, "ai/foo/index.html", false);
  const canonicalIssue = issues.find((m) => m.includes("end with /"));
  assert.ok(canonicalIssue, `Expected canonical trailing-slash issue, got: ${JSON.stringify(issues)}`);
});

test("canonical with trailing slash has no canonical issues", () => {
  const issues = checkPageFromHtml(FIXTURE_CANONICAL_WITH_SLASH, "ai/foo/index.html", false);
  const canonicalIssue = issues.find((m) => m.includes("end with /") || m.includes("canonical"));
  assert.ok(!canonicalIssue, `Unexpected canonical issue: ${canonicalIssue}`);
});

test("embed page without robots noindex yields embed noindex issue", () => {
  const issues = checkPageFromHtml(FIXTURE_EMBED_NO_NOINDEX, "embed/bar/index.html", false);
  const noindexIssue = issues.find((m) => m.includes("embed page should be noindex"));
  assert.ok(noindexIssue, `Expected embed noindex issue, got: ${JSON.stringify(issues)}`);
});

test("embed page with robots noindex has no embed issues", () => {
  const issues = checkPageFromHtml(FIXTURE_EMBED_WITH_NOINDEX, "embed/bar/index.html", false);
  const noindexIssue = issues.find((m) => m.includes("embed page should be noindex"));
  assert.ok(!noindexIssue, `Unexpected embed noindex issue, got: ${JSON.stringify(issues)}`);
});
