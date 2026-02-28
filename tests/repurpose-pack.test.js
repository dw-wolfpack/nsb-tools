import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/repurpose-pack/logic.js");
const gen = w.NSB_REPURPOSE;

test("repurpose: empty source safe", () => {
  const out = gen.generate({ text: "" }, 111);
  assert.ok(out && "hooks" in out && "script" in out && "captions" in out && "visuals" in out);
});

test("repurpose: output has hooks, script, captions, visuals", () => {
  const out = gen.generate({ text: "How to grow your audience with consistent content" }, 222);
  assert.ok(Array.isArray(out.hooks));
  assert.ok(typeof out.script === "string");
  assert.ok(Array.isArray(out.captions));
  assert.ok(Array.isArray(out.visuals));
});

test("repurpose: no duplicate hooks", () => {
  const out = gen.generate({ text: "single phrase here" }, 333);
  const unique = new Set(out.hooks);
  assert.strictEqual(out.hooks.length, unique.size, "no duplicate hooks");
});

test("repurpose: very long source does not crash", () => {
  const long = "word ".repeat(500);
  const out = gen.generate({ text: long }, 444);
  assert.ok(out.hooks.length >= 0 && out.script.length >= 0);
});
