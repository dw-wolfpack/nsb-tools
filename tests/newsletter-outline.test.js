import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/newsletter-outline/logic.js");
const gen = w.NSB_NEWSLETTER;

test("newsletter: empty topic safe", () => {
  const out = gen.generate({ topic: "" }, 111);
  assert.ok(typeof out === "string" && out.length > 0);
});

test("newsletter: includes SUBJECT and OUTLINE sections", () => {
  const out = gen.generate({ topic: "productivity" }, 222);
  assert.ok(out.includes("SUBJECT"), "must include SUBJECT section");
  assert.ok(out.includes("OUTLINE"), "must include OUTLINE section");
});

test("newsletter: includes CTA", () => {
  const out = gen.generate({ topic: "growth" }, 333);
  assert.ok(out.includes("CTA"), "must include CTA");
});

test("newsletter: subject lines present", () => {
  const out = gen.generate({ topic: "leadership" }, 444);
  assert.ok(out.includes("SUBJECT LINES") || out.includes("SUBJECT"), "must have subject lines block");
});
