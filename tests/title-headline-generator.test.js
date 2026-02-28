import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/title-headline-generator/logic.js");
const gen = w.NSB_HEADLINE;

test("title-headline: empty topic safe", () => {
  const out = gen.generate({ topic: "" }, 111);
  assert.ok(Array.isArray(out) && out.length >= 1);
});

test("title-headline: no duplicates in output", () => {
  const out = gen.generate({ topic: "productivity", styles: "howto,list" }, 222);
  const texts = out.map((x) => x.text);
  const unique = new Set(texts);
  assert.strictEqual(texts.length, unique.size, "no duplicate headlines");
});

test("title-headline: punctuation/topic safe", () => {
  const out = gen.generate({ topic: "Stop. Start. Go!" }, 333);
  assert.ok(Array.isArray(out) && out.length >= 1);
  for (const item of out) {
    assert.ok("style" in item && "text" in item);
  }
});
