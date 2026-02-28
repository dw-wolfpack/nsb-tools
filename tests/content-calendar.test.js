import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/content-calendar/logic.js");
const gen = w.NSB_CONTENT_CALENDAR;

test("content-calendar: returns array of rows", () => {
  const out = gen.generate({ niche: "creator" }, 111);
  assert.ok(Array.isArray(out));
  assert.ok(out.length >= 7, "should have at least 7 days");
});

test("content-calendar: each row has day, type, angle", () => {
  const out = gen.generate({ niche: "SaaS" }, 222);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (let i = 0; i < out.length; i++) {
    assert.ok("day" in out[i] && "type" in out[i] && "angle" in out[i]);
    assert.ok(days.includes(out[i].day) || out[i].day, `row ${i} should have day`);
  }
});

test("content-calendar: empty niche safe", () => {
  const out = gen.generate({ niche: "" }, 333);
  assert.ok(Array.isArray(out) && out.length >= 7);
});
