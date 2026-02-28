import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/hook-generator/logic.js");
const gen = w.NSB_HOOK_GENERATOR;

test("hook: blank topic safe, no crash", () => {
  const out = gen.generate({ topic: "" }, 111);
  assert.ok(Array.isArray(out) && out.length >= 2, "blank topic must produce output");
});

test("hook: very long topic truncated, no crash", () => {
  const long = "a".repeat(200);
  const out = gen.generate({ topic: long }, 222);
  assert.ok(Array.isArray(out) && out.length >= 2, "long topic must not crash");
});

test("hook: outputs have type and text keys", () => {
  const out = gen.generate({ topic: "productivity" }, 333);
  for (const item of out) {
    assert.ok("type" in item && "text" in item, `item must have type and text`);
    assert.ok(typeof item.text === "string" && item.text.length > 0, "text must be non-empty string");
  }
});

test("hook: type modes produce different structure (curiosity vs contrarian)", () => {
  const curiosity = gen.generate({ topic: "AI", types: "curiosity" }, 444);
  const contrarian = gen.generate({ topic: "AI", types: "contrarian" }, 555);
  const curiousTexts = curiosity.map((x) => x.text).join(" ");
  const contrarianTexts = contrarian.map((x) => x.text).join(" ");
  assert.ok(curiousTexts.includes("curiosity") || curiosity.every((x) => x.type === "curiosity"));
  assert.ok(
    contrarianTexts.toLowerCase().includes("unpopular") ||
      contrarianTexts.toLowerCase().includes("stop") ||
      contrarian.every((x) => x.type === "contrarian")
  );
});

test("hook: no duplicate hooks in output", () => {
  const out = gen.generate({ topic: "sales", perType: "3" }, 666);
  const texts = out.map((x) => x.text);
  const unique = new Set(texts);
  assert.strictEqual(texts.length, unique.size, "no duplicate text");
});

test("hook: count boundaries respected (perType 2-4)", () => {
  const out = gen.generate({ topic: "x", perType: "2", types: "curiosity" }, 777);
  assert.ok(out.length >= 2 && out.length <= 4, `perType 2 should yield 2-4, got ${out.length}`);
});
