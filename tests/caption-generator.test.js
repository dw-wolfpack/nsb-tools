import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/caption-generator/logic.js");
const gen = w.NSB_CAPTION;

test("caption: blank topic safe", () => {
  const out = gen.generate({ topic: "" }, 111);
  assert.ok(out && typeof out.caption === "string", "must return caption object");
  assert.ok(out.caption.length > 0);
});

test("caption: output has caption and commentPrompt", () => {
  const out = gen.generate({ topic: "productivity" }, 222);
  assert.ok("caption" in out, "must have caption");
  assert.ok("commentPrompt" in out, "must have commentPrompt");
});

test("caption: weird input (unicode, angle brackets) does not crash", () => {
  const out = gen.generate({ topic: "<script>alert(1)</script> or 日本語" }, 333);
  assert.ok(typeof out.caption === "string");
  assert.ok(out.caption.length > 0, "must produce output");
});

test("caption: different seeds produce different output", () => {
  const a = gen.generate({ topic: "growth" }, 444);
  const b = gen.generate({ topic: "growth" }, 555);
  assert.ok(a.caption !== b.caption || a.commentPrompt !== b.commentPrompt, "seeds should vary output");
});
