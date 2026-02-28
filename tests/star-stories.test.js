import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/star-stories/logic.js");
const gen = w.NSB_STAR;

test("star-stories: missing notes outputs STAR template with placeholders", () => {
  const out = gen.generate({ notes: "" }, 111);
  assert.ok(out.includes("Situation:") && out.includes("Task:") && out.includes("Action:") && out.includes("Result:"));
});

test("star-stories: no invented metric percentages when notes have none", () => {
  const out = gen.generate({ notes: "Led a project that improved outcomes" }, 222);
  const contentBeforeFollowups = out.split("FOLLOW-UP")[0] || out;
  const hasInventedMetricPct = /\d+%/.test(contentBeforeFollowups);
  assert.ok(!hasInventedMetricPct, "should not invent percentages like 25% when input has no digits");
});

test("star-stories: concise vs detailed mode differ", () => {
  const concise = gen.generate({ notes: "x", mode: "concise" }, 333);
  const detailed = gen.generate({ notes: "x", mode: "detailed" }, 444);
  assert.ok(detailed.includes("DETAILED") || detailed.length > concise.length, "detailed should expand");
});

test("star-stories: includes follow-up questions", () => {
  const out = gen.generate({}, 555);
  assert.ok(out.includes("FOLLOW-UP") || out.includes("?"));
});
