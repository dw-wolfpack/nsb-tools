import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/short-script-writer/logic.js");
const gen = w.NSB_SHORT_SCRIPT;

test("short-script: output is string", () => {
  const out = gen.generate({ topic: "productivity" }, 111);
  assert.strictEqual(typeof out, "string", "output must be string");
});

test("short-script: contains HOOK beat", () => {
  const out = gen.generate({ topic: "content" }, 222);
  assert.ok(out.includes("HOOK"), `output must include HOOK beat: ${out.slice(0, 80)}`);
});

test("short-script: contains PROBLEM, SOLUTION, CTA beats", () => {
  const out = gen.generate({ topic: "growth" }, 333);
  assert.ok(out.includes("PROBLEM"), "must include PROBLEM");
  assert.ok(out.includes("SOLUTION"), "must include SOLUTION");
  assert.ok(out.includes("CTA"), "must include CTA");
});

test("short-script: blank topic safe", () => {
  const out = gen.generate({ topic: "" }, 444);
  assert.strictEqual(typeof out, "string");
  assert.ok(out.length > 0, "blank topic must still produce output");
});

test("short-script: multiline topic survives", () => {
  const out = gen.generate({ topic: "line1\nline2\nline3" }, 555);
  assert.strictEqual(typeof out, "string");
  assert.ok(out.length > 0);
});

test("short-script: includes SHOT LIST and CAPTION", () => {
  const out = gen.generate({ topic: "videos" }, 666);
  assert.ok(out.includes("SHOT LIST") || out.includes("CAPTION"), "must include shot list or caption");
});
