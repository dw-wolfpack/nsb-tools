import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/linkedin-post-builder/logic.js");
const gen = w.NSB_LINKEDIN;

test("linkedin: short/medium/long produce different lengths", () => {
  const short = gen.generate({ topic: "AI", stance: "AI changes work", length: "short" }, 111);
  const medium = gen.generate({ topic: "AI", stance: "AI changes work", length: "medium" }, 222);
  const long = gen.generate({ topic: "AI", stance: "AI changes work", length: "long" }, 333);
  assert.ok(short.full.length <= 950, "short should be ~900 or less");
  assert.ok(medium.full.length >= 200, "medium should have substantial content");
  assert.ok(long.full.length >= 400, "long should be longest");
});

test("linkedin: output has opener, body, full keys", () => {
  const out = gen.generate({ topic: "productivity", stance: "focus matters" }, 444);
  assert.ok("opener" in out && "body" in out && "full" in out);
  assert.ok(typeof out.opener === "string" && out.opener.length > 0);
});

test("linkedin: blank topic/stance safe", () => {
  const out = gen.generate({ topic: "", stance: "" }, 555);
  assert.ok(out.full && out.full.length > 0);
});

test("linkedin: preserves double newlines in structure", () => {
  const out = gen.generate({ topic: "remote", stance: "async works", length: "medium" }, 666);
  assert.ok(out.full.includes("\n\n"), "should have paragraph breaks");
});
