#!/usr/bin/env node

/**
 * Dev-only SEO audit for NSB Tools.
 *
 * Run:
 *   node scripts/seo-audit.mjs
 *
 * Checks:
 * - Exactly one <h1> per page
 * - <title> 10–70 chars
 * - meta[name="description"] 50–160 chars
 * - canonical exists and starts with https://tools.nextstepsbeyond.online/
 * - OG + Twitter tags present
 * - BreadcrumbList JSON-LD on categories, tools, and system pages
 * - No noindex on non-embed pages (embeds must be noindex)
 * - sitemap.xml contains key urls and excludes /embed/
 *
 * This script is best-effort and intended for CI / local checks only.
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import process from "node:process";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const ORIGIN = "https://tools.nextstepsbeyond.online";

/** @param {string} p */
function read(p) {
  return readFileSync(resolve(ROOT, p), "utf8");
}

/** @param {string} html @param {RegExp} re */
function matchAll(html, re) {
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) out.push(m);
  return out;
}

function hasBreadcrumbLD(html) {
  return html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"');
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : "";
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]+name=['"]${name}['\"][^>]*content=['\"]([^'\"]+)['\"][^>]*>`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : "";
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=['"]canonical['\"][^>]*href=['"]([^'"]+)['\"][^>]*>/i);
  return m ? m[1].trim() : "";
}

/**
 * Validate page HTML without reading from disk. Exported for tests.
 * @param {string} html - Full HTML content
 * @param {string} path - Logical path e.g. "ai/foo/index.html" or "embed/bar/index.html"
 * @param {boolean} [requireBreadcrumb] - Whether BreadcrumbList JSON-LD is required
 * @returns {string[]} List of issue messages
 */
export function checkPageFromHtml(html, path, requireBreadcrumb = false) {
  const issues = [];
  const isEmbed = path.startsWith("embed/");

  const canonical = extractCanonical(html);
  if (!canonical) {
    issues.push("missing canonical link");
  } else {
    if (path === "index.html") {
      if (canonical !== ORIGIN + "/") {
        issues.push(`home canonical must be ${ORIGIN}/ (got ${canonical})`);
      }
    } else {
      if (!canonical.startsWith(ORIGIN) || !canonical.endsWith("/")) {
        issues.push(`canonical must start with ${ORIGIN} and end with / (got ${canonical})`);
      }
    }
  }

  // Embed pages: only require canonical and noindex
  if (isEmbed) {
    const robotsMeta = matchAll(html, /<meta[^>]+name=['"]robots['\"][^>]*>/gi)
      .map((m) => m[0].toLowerCase())
      .join(" ");
    if (!/noindex/.test(robotsMeta)) {
      issues.push("embed page should be noindex");
    }
    return issues;
  }

  const h1s = matchAll(html, /<h1\b[^>]*>/gi);
  if (h1s.length !== 1) {
    issues.push(`expected exactly 1 <h1>, found ${h1s.length}`);
  }

  const title = extractTitle(html);
  if (!title) {
    issues.push("missing <title>");
  } else if (title.length < 10 || title.length > 70) {
    issues.push(`title length ${title.length} outside 10–70 chars`);
  }

  const desc = extractMeta(html, "description");
  if (!desc) {
    issues.push("missing meta description");
  } else if (desc.length < 50 || desc.length > 160) {
    issues.push(`description length ${desc.length} outside 50–160 chars`);
  }

  // OG and Twitter tags
  const requiredOg = ["og:title", "og:description", "og:url", "og:image"];
  for (const prop of requiredOg) {
    if (!new RegExp(`<meta[^>]+property=['"]${prop}['\"]`, "i").test(html)) {
      issues.push(`missing ${prop}`);
    }
  }
  const requiredTw = ["twitter:card", "twitter:title", "twitter:description", "twitter:image"];
  for (const name of requiredTw) {
    if (!new RegExp(`<meta[^>]+name=['"]${name}['\"]`, "i").test(html)) {
      issues.push(`missing ${name}`);
    }
  }

  if (requireBreadcrumb && !hasBreadcrumbLD(html)) {
    issues.push("expected BreadcrumbList JSON-LD");
  }

  // Robots: non-embed pages must not be noindex
  const robotsMeta = matchAll(html, /<meta[^>]+name=['"]robots['\"][^>]*>/gi)
    .map((m) => m[0].toLowerCase())
    .join(" ");
  if (/noindex/.test(robotsMeta)) {
    issues.push("non-embed page should not be noindex");
  }

  return issues;
}

function checkPage(path, requireBreadcrumb) {
  return checkPageFromHtml(read(path), path, requireBreadcrumb);
}

function gatherHtmlPaths() {
  const paths = [];

  // Home
  paths.push("index.html");

  // Categories
  const catDir = resolve(ROOT, "categories");
  try {
    for (const entry of readdirSync(catDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        paths.push(join("categories", entry.name, "index.html"));
      }
    }
  } catch {}

  // Tools
  const toolsDir = resolve(ROOT, "tools");
  try {
    for (const entry of readdirSync(toolsDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        paths.push(join("tools", entry.name, "index.html"));
      }
    }
  } catch {}

  // System pages
  const system = [
    "about/index.html",
    "privacy/index.html",
    "terms/index.html",
    "faq/index.html",
    "updates/index.html",
    "changelog/index.html",
    "glossary/index.html",
    "collections/index.html",
    "link-to-us/index.html",
  ];
  for (const p of system) {
    try {
      read(p);
      paths.push(p);
    } catch {
      // ignore missing optional pages
    }
  }

  // AI Hub pages
  const aiPages = [
    "ai/index.html",
    "ai/playbooks/index.html",
    "ai/toolkit/index.html",
    "ai/checklists/index.html",
    "ai/playbooks/job-search-ai-workflow/index.html",
    "ai/playbooks/founder-ops-ai-workflow/index.html",
    "ai/playbooks/rag-readiness-checklist/index.html",
    "ai/playbooks/small-business-ai-adoption/index.html",
    "ai/checklists/resume-ats-checklist/index.html",
    "ai/checklists/vendor-eval-scorecard/index.html",
    "ai/checklists/llm-safety-review/index.html",
    "ai/checklists/ai-meeting-notes-workflow/index.html",
  ];
  for (const p of aiPages) {
    try {
      read(p);
      paths.push(p);
    } catch {
      // ignore missing
    }
  }

  // Embeds
  const embedDir = resolve(ROOT, "embed");
  try {
    for (const entry of readdirSync(embedDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        paths.push(join("embed", entry.name, "index.html"));
      }
    }
  } catch {}

  return paths;
}

function auditSitemap() {
  const issues = [];
  let xml = "";
  try {
    xml = read("sitemap.xml");
  } catch {
    issues.push("missing sitemap.xml");
    return issues;
  }

  if (!xml.includes("<urlset")) {
    issues.push("sitemap.xml missing <urlset>");
  }

  // Embeds should be excluded
  if (/\/embed\//.test(xml)) {
    issues.push("sitemap.xml should not include /embed/ URLs");
  }

  // Every sitemap URL must use a trailing slash
  const locs = matchAll(xml, /<loc>([^<]+)<\/loc>/g).map((m) => m[1]);
  for (const loc of locs) {
    if (!loc.endsWith("/")) {
      issues.push(`sitemap.xml URL must end with /: ${loc}`);
    }
  }

  // Spot-check a few important URLs
  const mustHave = [
    ORIGIN + "/",
    ORIGIN + "/categories/",
    ORIGIN + "/ai/",
    ORIGIN + "/faq/",
    ORIGIN + "/updates/",
    ORIGIN + "/glossary/",
  ];
  for (const url of mustHave) {
    if (!xml.includes(`<loc>${url}</loc>`)) {
      issues.push(`sitemap.xml missing ${url}`);
    }
  }

  return issues;
}

const IGNORED_PATHS = new Set([
  "404.html",
  "robots.txt",
]);

/** Paths that are preview/dev-only and should not be audited. */
function isPreviewOrIgnored(path) {
  if (IGNORED_PATHS.has(path)) return true;
  if (path.includes("robots.txt")) return true;
  if (/preview|seo-health/i.test(path)) return true;
  return false;
}

async function main() {
  const allIssues = [];
  let paths = gatherHtmlPaths();
  paths = paths.filter((p) => !isPreviewOrIgnored(p));

  for (const p of paths) {
    const requireBreadcrumb =
      p.startsWith("categories/") ||
      p.startsWith("tools/") ||
      p.startsWith("ai/") ||
      p === "about/index.html" ||
      p === "privacy/index.html" ||
      p === "terms/index.html" ||
      p === "faq/index.html" ||
      p === "updates/index.html" ||
      p === "changelog/index.html" ||
      p === "glossary/index.html" ||
      p === "collections/index.html" ||
      p === "link-to-us/index.html";

    const issues = checkPage(p, requireBreadcrumb);
    if (issues.length) {
      allIssues.push({ path: p, issues });
    }
  }

  const sitemapIssues = auditSitemap();
  if (sitemapIssues.length) {
    allIssues.push({ path: "sitemap.xml", issues: sitemapIssues });
  }

  if (!allIssues.length) {
    console.log("SEO audit passed.");
    process.exit(0);
  }

  console.log("SEO audit found issues:");
  for (const entry of allIssues) {
    console.log(`\n[${entry.path}]`);
    for (const msg of entry.issues) {
      console.log(" - " + msg);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error("seo-audit error:", err);
  process.exit(1);
});

