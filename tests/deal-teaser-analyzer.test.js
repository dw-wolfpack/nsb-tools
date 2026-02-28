import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";
import { DEAL_TEASER_SAMPLES } from "./fixtures/deal-teaser-samples.js";

const w = await loadLogic("assets/js/tools/deal-teaser-analyzer/logic.js");
const gen = w.NSB_DEAL_TEASER;

test("deal-teaser: empty text safe", () => {
  const out = gen.generate({ text: "" }, 111);
  assert.ok(out && "fields" in out && "redFlags" in out && "diligence" in out);
  assert.ok(Array.isArray(out.redFlags) && out.redFlags.length >= 1);
});

test("deal-teaser: $699,000 extracted to PriceRange", () => {
  const out = gen.generate({ text: DEAL_TEASER_SAMPLES.withDollarCommas }, 222);
  assert.ok(out.fields.PriceRange, "PriceRange must be set when $ present");
  assert.ok(out.fields.PriceRange.includes("699") || out.fields.PriceRange.includes("120"), "must extract dollar amounts");
});

test("deal-teaser: messy formatting does not crash", () => {
  const out = gen.generate({ text: DEAL_TEASER_SAMPLES.conflictingNumbers }, 333);
  assert.ok(out && "fields" in out);
});

test("deal-teaser: output has fields, redFlags, diligence", () => {
  const out = gen.generate({ text: DEAL_TEASER_SAMPLES.withDollarCommas }, 444);
  assert.ok(Array.isArray(out.redFlags));
  assert.ok(Array.isArray(out.diligence));
  assert.ok(out.diligence.length >= 1);
});
