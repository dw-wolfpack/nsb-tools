import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createDomStub } from "./dom-stub.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const LINK_TO_THIS_PATH = resolve(REPO_ROOT, "assets/js/components/link-to-this.js");

async function loadAndRender(opts, renderOpts = {}) {
  const { document, window, container } = createDomStub(opts);
  globalThis.document = document;
  globalThis.window = window;
  await import(pathToFileURL(LINK_TO_THIS_PATH).href + "?v=" + Date.now());
  const render = globalThis.window.NSB_LINK_TO_THIS?.render;
  assert.ok(typeof render === "function", "NSB_LINK_TO_THIS.render not found");
  render(container, renderOpts);
  return container.innerHTML;
}

test("anchor text prefers H1 over title", async () => {
  const html = await loadAndRender({
    h1Text: "My H1 Text",
    title: "Other Title",
    pathname: "/ai/checklists/foo/",
  });
  // preserveAcronyms lowercases to "my h1 text"
  assert.ok(html.includes("my h1 text"), `Expected H1-derived anchor in output, got: ${html.slice(0, 300)}`);
  assert.ok(!html.includes("Other Title"), `Should not use title when H1 present`);
});

test("suffix adds checklist for /ai/checklists/*", async () => {
  const html = await loadAndRender({
    h1Text: "Resume ATS",
    pathname: "/ai/checklists/resume-ats-checklist/",
  });
  assert.ok(html.includes("checklist"), `Expected "checklist" suffix in anchor text, got: ${html.slice(0, 300)}`);
});

test("origin uses canonical when present and hostname is localhost", async () => {
  const canonicalOrigin = "https://tools.nextstepsbeyond.online";
  const html = await loadAndRender({
    h1Text: "Test",
    pathname: "/ai/foo/",
    hostname: "localhost",
    canonicalHref: canonicalOrigin + "/ai/foo/",
  });
  assert.ok(html.includes(canonicalOrigin + "/ai/foo/"), `Expected URL to use canonical origin, got: ${html.slice(0, 400)}`);
});

test("origin uses production when hostname is localhost and no canonical", async () => {
  const prodOrigin = "https://tools.nextstepsbeyond.online";
  const html = await loadAndRender({
    h1Text: "Test",
    pathname: "/ai/bar/",
    hostname: "localhost",
    canonicalHref: "",
  });
  assert.ok(html.includes(prodOrigin + "/ai/bar/"), `Expected URL to use production origin, got: ${html.slice(0, 400)}`);
});
