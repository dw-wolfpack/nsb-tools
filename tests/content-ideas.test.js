import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/content-ideas/logic.js");
const gen = w.NSB_CONTENT_IDEAS;

test("content-ideas: empty niche safe", () => {
  const out = gen.generate({ niche: "" }, 111);
  assert.ok(Array.isArray(out) && out.length >= 3, "empty niche must produce output");
});

test("content-ideas: output is array of objects with angle, hook, format", () => {
  const out = gen.generate({ niche: "SaaS" }, 222);
  for (const item of out) {
    assert.ok("angle" in item && "hook" in item && "format" in item);
  }
});

test("content-ideas: no duplicates by composite key", () => {
  const out = gen.generate({ niche: "creator", count: "6" }, 333);
  const keys = out.map((x) => x.angle + "|" + x.hook + "|" + x.format);
  const unique = new Set(keys);
  assert.strictEqual(keys.length, unique.size, "no duplicate ideas");
});

test("content-ideas: count respected (3-8)", () => {
  const out = gen.generate({ count: "5" }, 444);
  assert.ok(out.length >= 3 && out.length <= 8, `count 5 should yield 3-8, got ${out.length}`);
});
