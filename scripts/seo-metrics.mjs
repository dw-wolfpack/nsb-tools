#!/usr/bin/env node

/**
 * SEO content metrics report for NSB Tools.
 * Run: node scripts/seo-metrics.mjs
 * Writes reports/seo-metrics.md and reports/seo-metrics.json
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS_DIR = join(ROOT, "reports");

/** Parse registry.js for tools with isHidden: true. Returns Set of base routes like /tools/slug/ */
function loadHiddenToolRoutes() {
  const path = resolve(ROOT, "assets/js/registry.js");
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    return new Set();
  }
  const hidden = new Set();
  const re = /\{\s*slug:\s*["']([^"']+)["']((?:(?!\},)[\s\S])*?)isHidden:\s*true/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    hidden.add("/tools/" + m[1] + "/");
  }
  return hidden;
}

/** Normalize /tools/foo/ or /tools/foo/bar/ to base /tools/foo/ */
function getToolBaseRoute(href) {
  const norm = normalizePath(href);
  if (!norm.startsWith("/tools/")) return null;
  const match = norm.match(/^\/tools\/([^/]+)\//);
  return match ? "/tools/" + match[1] + "/" : null;
}

/** Load seo-targets.json if present */
function loadTargets() {
  try {
    const p = resolve(ROOT, "scripts/seo-targets.json");
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

/** Resolve targets for a route: exact match in routes, else defaults */
function resolveTargets(route, config) {
  if (!config) return null;
  const def = config.defaults || {};
  const routeCfg = config.routes?.[route];
  if (!routeCfg) return def;
  return { ...def, ...routeCfg };
}

function dirname(p) {
  const idx = p.lastIndexOf("/");
  return idx < 0 ? "." : p.slice(0, idx);
}

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

/** Recursively find all index.html under dir (relative to ROOT) */
function findIndexHtml(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
      const rel = join(dir, entry.name);
      if (entry.isDirectory()) {
        const idx = join(rel, "index.html");
        try {
          read(idx);
          results.push(idx);
        } catch {}
        results.push(...findIndexHtml(rel));
      }
    }
  } catch {}
  return results;
}

/** Discover all pages to scan (file paths) */
function discoverPages() {
  const paths = [];

  paths.push("index.html");

  // categories
  try {
    for (const entry of readdirSync(resolve(ROOT, "categories"), { withFileTypes: true })) {
      if (entry.isDirectory()) {
        paths.push(join("categories", entry.name, "index.html"));
      }
    }
  } catch {}
  try {
    read("categories/index.html");
    paths.push("categories/index.html");
  } catch {}

  // tools (including nested)
  const toolIndexes = findIndexHtml("tools");
  paths.push(...toolIndexes.filter((p) => !paths.includes(p)));

  // ai (include ai/index.html; findIndexHtml finds nested dirs only)
  try {
    read("ai/index.html");
    paths.push("ai/index.html");
  } catch {}
  const aiIndexes = findIndexHtml("ai");
  paths.push(...aiIndexes.filter((p) => !paths.includes(p)));

  const system = [
    "glossary/index.html",
    "faq/index.html",
    "updates/index.html",
    "about/index.html",
    "terms/index.html",
    "privacy/index.html",
    "changelog/index.html",
  ];
  for (const p of system) {
    try {
      read(p);
      paths.push(p);
    } catch {}
  }

  return [...new Set(paths)].filter((p) => {
    if (p.startsWith("embed/")) return false;
    if (p.startsWith("docs/")) return false;
    if (p === "404.html") return false;
    if (p.includes("seo-health")) return false;
    return true;
  });
}

/** File path to route e.g. "ai/toolkit/index.html" => "/ai/toolkit/" */
function filePathToRoute(filePath) {
  if (filePath === "index.html") return "/";
  const base = filePath.replace(/\/index\.html$/, "");
  return "/" + base + "/";
}

/** Extract main content (strip script, style) */
function extractMainContent(html) {
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) return "";
  let main = mainMatch[0];
  main = main.replace(/<script[\s\S]*?<\/script>/gi, "");
  main = main.replace(/<style[\s\S]*?<\/style>/gi, "");
  return main;
}

/** Strip HTML tags, return plain text */
function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Word count from body content */
function wordCount(html) {
  const text = stripTags(html);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

/** Extract text of first h1 */
function extractH1(html) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]).trim() : "";
}

/** Extract title */
function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : "";
}

/** Extract meta description */
function extractMetaDescription(html) {
  const re = /<meta[^>]+name=['"]description['"][^>]*content=['"]([^'"]+)['"][^>]*>/i;
  const m = html.match(re);
  return m ? m[1].trim() : "";
}

/** Extract canonical href */
function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=['"]canonical['"][^>]*href=['"]([^'"]+)['"][^>]*>/i);
  return m ? m[1].trim() : "";
}

/**
 * Strip elements that are hidden in static HTML so their links are not counted.
 * Handles: hidden attribute, display:none/visibility:hidden inline style,
 * aria-hidden="true", and class visually-hidden/sr-only.
 * Uses best-effort regex (no real DOM); safe for this repo's patterns.
 */
function stripHiddenElements(html) {
  // Remove elements with boolean hidden attribute
  html = html.replace(/<([a-z][a-z0-9]*)\b[^>]*\s+hidden(?:\s[^>]*)?\/?>[^]*?<\/\1>/gi, "");
  // Remove elements with aria-hidden="true"
  html = html.replace(/<([a-z][a-z0-9]*)\b[^>]*\s+aria-hidden=['"]true['"][^>]*>[^]*?<\/\1>/gi, "");
  // Remove elements with inline display:none or visibility:hidden
  html = html.replace(/<([a-z][a-z0-9]*)\b[^>]*\sstyle=['"][^'"]*(?:display\s*:\s*none|visibility\s*:\s*hidden)[^'"]*['"][^>]*>[^]*?<\/\1>/gi, "");
  // Remove elements with class visually-hidden or sr-only (a11y text wrappers)
  html = html.replace(/<([a-z][a-z0-9]*)\b[^>]*\sclass=['"][^'"]*\b(?:visually-hidden|sr-only)\b[^'"]*['"][^>]*>[^]*?<\/\1>/gi, "");
  return html;
}

/** Get all internal links (href starts with /) from html, optionally only from inBody region */
function getInternalLinks(html, onlyInBody = false) {
  let source = onlyInBody ? getInBodyHtml(html) : extractMainContent(html);
  source = stripHiddenElements(source);
  const links = [];
  const re = /<a[^>]+href=['"]([^'"#?]+)(?:[#'"][^'"]*)?['"][^>]*>/gi;
  let m;
  while ((m = re.exec(source)) !== null) {
    const href = m[1].trim();
    if (href.startsWith("/") && !href.startsWith("//")) {
      links.push(href);
    }
  }
  return links;
}

/** Get main content before "Related tools" or "Related glossary terms" sections */
function getInBodyHtml(html) {
  const main = extractMainContent(html);
  const relatedRe = /<h2[^>]*>\s*Related\s+(?:tools|glossary\s+terms)\s*<\/h2>/i;
  const idx = main.search(relatedRe);
  if (idx >= 0) {
    return main.slice(0, idx);
  }
  return main;
}

/** Normalize internal path for route lookup: /foo/bar?x=1 => /foo/bar/ */
function normalizePath(href) {
  let path = href.split("#")[0].split("?")[0].trim();
  if (!path.endsWith("/") && path !== "/") path += "/";
  return path;
}

/** Check if keyword appears in text (case-insensitive) */
function containsKeyword(text, keyword) {
  if (!text) return false;
  return text.toLowerCase().includes(String(keyword).toLowerCase());
}

/** Compute all metrics for a page */
function computeMetrics(filePath, html, knownRoutes, targetsConfig, hiddenToolsSet = new Set()) {
  const mainHtml = extractMainContent(html);
  const inBodyHtml = getInBodyHtml(html);
  const route = filePathToRoute(filePath);

  const allInternal = getInternalLinks(html, false);
  const inBodyInternal = getInternalLinks(html, true);

  const hiddenToolLinksFound = [];
  const isHiddenTool = (href) => {
    const base = getToolBaseRoute(href);
    return base && hiddenToolsSet.has(base);
  };
  const liveInternal = allInternal.filter((h) => {
    if (isHiddenTool(h)) {
      const norm = normalizePath(h);
      if (!hiddenToolLinksFound.includes(norm)) hiddenToolLinksFound.push(norm);
      return false;
    }
    return true;
  });
  const liveInBodyInternal = inBodyInternal.filter((h) => !isHiddenTool(h));

  const internalPaths = liveInternal.map(normalizePath);
  const internalUnique = [...new Set(internalPaths)];

  const aiLinks = liveInternal.filter((h) => h.startsWith("/ai/"));
  const toolLinks = liveInternal.filter((h) => h.startsWith("/tools/"));
  const glossaryLinks = liveInternal.filter((h) => h.startsWith("/glossary"));

  const broken = [];
  for (const href of internalUnique) {
    if (href === "/" || href.startsWith("/#")) continue;
    const pathOnly = href.split("#")[0];
    const pathRoute = pathOnly.endsWith("/") ? pathOnly : pathOnly + "/";
    if (!knownRoutes.has(pathRoute) && !knownRoutes.has(pathOnly)) {
      broken.push(href);
    }
  }

  const metaDesc = extractMetaDescription(html);
  const isAiPage = filePath.startsWith("ai/");
  const flags = [];

  const wordCountBody = wordCount(mainHtml);
  const h1Text = extractH1(html);
  const bodyText = stripTags(mainHtml);

  const targets = targetsConfig ? resolveTargets(route, targetsConfig) : null;
  const targetsMinWords = targets?.minWords ?? 350;
  const isBelowTargetWords = targets ? wordCountBody < targetsMinWords : wordCountBody < 350;
  const requiredKeywordsMissing = [];
  const optionalKeywordsPresent = [];

  if (targets) {
    if (isBelowTargetWords) flags.push(`below target words (${wordCountBody}/${targetsMinWords})`);
    for (const kw of targets.requiredKeywords || []) {
      if (!containsKeyword(h1Text, kw) && !containsKeyword(bodyText, kw)) {
        requiredKeywordsMissing.push(kw);
      }
    }
    if (requiredKeywordsMissing.length > 0) {
      flags.push(`missing required keywords: ${requiredKeywordsMissing.join(", ")}`);
    }
    for (const kw of targets.optionalKeywords || []) {
      if (containsKeyword(h1Text, kw) || containsKeyword(bodyText, kw)) {
        optionalKeywordsPresent.push(kw);
      }
    }
  } else {
    if (wordCountBody < 350) flags.push("wordCountBody < 350");
  }

  if (internalUnique.length < 6) flags.push("internalLinksUnique < 6");
  if (isAiPage && liveInBodyInternal.length < 2) flags.push("inBodyLinksCount < 2 (AI page)");
  if (metaDesc.length < 50 || metaDesc.length > 160) flags.push(`metaDescription length ${metaDesc.length} (target 50-160)`);

  const out = {
    route,
    filePath,
    wordCountBody,
    h1Text,
    titleText: extractTitle(html),
    metaDescriptionLength: metaDesc.length,
    internalLinksTotal: liveInternal.length,
    internalLinksUnique: internalUnique.length,
    aiLinksCount: aiLinks.length,
    toolLinksCount: toolLinks.length,
    glossaryLinksCount: glossaryLinks.length,
    inBodyLinksCount: liveInBodyInternal.length,
    hiddenToolLinksFound,
    brokenLinks: broken,
    hasLastUpdated: html.includes("Last updated:"),
    hasFAQSection: /<h2[^>]*>\s*FAQ\s*<\/h2>|<section[^>]*(?:id|aria-label)=['"].*faq.*['"]/i.test(html),
    canonicalEndsWithSlash: (() => {
      const c = extractCanonical(html);
      return c ? c.endsWith("/") : false;
    })(),
    flags,
    isAiPage,
  };

  if (targets) {
    out.targetsMinWords = targetsMinWords;
    out.isBelowTargetWords = isBelowTargetWords;
    out.requiredKeywordsMissing = requiredKeywordsMissing;
    out.optionalKeywordsPresent = optionalKeywordsPresent;
    out.optionalKeywordsTotal = (targets.optionalKeywords || []).length;
  }

  return out;
}

function main() {
  mkdirSync(REPORTS_DIR, { recursive: true });

  const targetsConfig = loadTargets();
  const hiddenToolsSet = loadHiddenToolRoutes();
  const pages = discoverPages();
  const knownRoutes = new Set(pages.map(filePathToRoute));
  knownRoutes.add("/categories/");

  const results = [];
  for (const p of pages) {
    try {
      const html = read(p);
      results.push(computeMetrics(p, html, knownRoutes, targetsConfig, hiddenToolsSet));
    } catch (err) {
      console.warn("Skip", p, err.message);
    }
  }

  const flagged = results.filter((r) => r.flags.length > 0);
  const totalBroken = results.reduce((s, r) => s + r.brokenLinks.length, 0);
  const belowTargetWords = results.filter((r) => r.isBelowTargetWords === true).length;
  const missingRequired = results.filter((r) => r.requiredKeywordsMissing?.length > 0).length;
  const pagesWithHiddenLinks = results.filter((r) => r.hiddenToolLinksFound?.length > 0);

  // Top internal link targets (exclude hidden tool routes)
  const targetCounts = {};
  for (const r of results) {
    const html = read(r.filePath);
    const links = getInternalLinks(html, false);
    for (const href of links) {
      const route = normalizePath(href);
      if (!route || route === "/") continue;
      const toolBase = getToolBaseRoute(href);
      if (toolBase && hiddenToolsSet.has(toolBase)) continue;
      targetCounts[route] = (targetCounts[route] || 0) + 1;
    }
  }
  const topTargets = Object.entries(targetCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  // Build markdown report
  let md = "# SEO Content Metrics Report\n\n";
  md += `Generated: ${new Date().toISOString().slice(0, 10)}\n\n`;
  md += "## Summary table\n\n";
  md += "| Route | Words | Target | Missing req | Internal | Unique | In-body | Broken |\n";
  md += "|-------|-------|--------|--------------|----------|--------|---------|--------|\n";
  for (const r of results) {
    const targetCol = r.targetsMinWords != null ? r.targetsMinWords : "-";
    const missingCol = r.requiredKeywordsMissing != null ? r.requiredKeywordsMissing.length : "-";
    md += `| ${r.route} | ${r.wordCountBody} | ${targetCol} | ${missingCol} | ${r.internalLinksTotal} | ${r.internalLinksUnique} | ${r.inBodyLinksCount} | ${r.brokenLinks.length} |\n`;
  }
  md += "\n## Needs work\n\n";
  if (flagged.length === 0) {
    md += "No pages flagged.\n\n";
  } else {
    for (const r of flagged) {
      let line = `- **${r.route}**: ${r.flags.join("; ")}`;
      if (r.optionalKeywordsTotal != null && r.optionalKeywordsTotal > 0) {
        const present = r.optionalKeywordsPresent?.length ?? 0;
        line += `; ${present}/${r.optionalKeywordsTotal} optional keywords`;
      }
      md += line + "\n";
    }
    md += "\n";
  }
  md += "## Top internal link targets\n\n";
  for (const [route, count] of topTargets) {
    md += `- ${route}: ${count} links\n`;
  }

  if (pagesWithHiddenLinks.length > 0) {
    md += "\n## Hidden tool links\n\n";
    md += "Pages that link to tools marked isHidden in registry.js (excluded from link counts):\n\n";
    for (const r of pagesWithHiddenLinks) {
      md += `- **${r.route}**: ${r.hiddenToolLinksFound.join(", ")}\n`;
    }
  }

  writeFileSync(join(REPORTS_DIR, "seo-metrics.md"), md);
  writeFileSync(
    join(REPORTS_DIR, "seo-metrics.json"),
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        pages: results,
        topInternalLinkTargets: topTargets,
      },
      null,
      2
    )
  );

  if (process.env.STRICT_HIDDEN_LINKS === "1" && pagesWithHiddenLinks.length > 0) {
    console.error(`STRICT_HIDDEN_LINKS=1: ${pagesWithHiddenLinks.length} page(s) contain links to hidden tools.`);
    process.exit(1);
  }

  console.log(
    `SEO metrics: ${results.length} pages scanned, ${flagged.length} flagged, ${totalBroken} broken links, ${belowTargetWords} below target words, ${missingRequired} missing required keywords.`
  );
  console.log(`Reports written to reports/seo-metrics.md and reports/seo-metrics.json`);
}

export { computeMetrics, loadHiddenToolRoutes, stripHiddenElements };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error("seo-metrics error:", err);
    process.exit(1);
  }
}
