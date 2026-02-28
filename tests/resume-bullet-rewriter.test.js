import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";
import { RESUME_BULLET_SAMPLES } from "./fixtures/resume-bullets-samples.js";

const w = await loadLogic("assets/js/tools/resume-bullet-rewriter/logic.js");
const gen = w.NSB_RESUME_BULLET;

test("resume-bullet: empty bullets safe", () => {
  const out = gen.generate({ bullet: "" }, 111);
  assert.ok(Array.isArray(out) && out.length >= 2);
});

test("resume-bullet: no new digits when input has none", () => {
  const out = gen.generate({ bullet: RESUME_BULLET_SAMPLES.noDigits }, 222);
  for (const s of out) {
    const hasNewDigit = /\b\d+\b/.test(s) && !/\[metric\]/.test(s);
    assert.ok(!hasNewDigit, `output "${s}" must not invent digits when input has none`);
  }
});

test("resume-bullet: verb-first pattern", () => {
  const verbs = ["Led", "Managed", "Increased", "Reduced", "Developed", "Implemented", "Achieved", "Streamlined", "Optimized", "Launched", "Coordinated"];
  const out = gen.generate({ bullet: "improved sales" }, 333);
  for (const s of out) {
    const startsWithVerb = verbs.some((v) => s.startsWith(v + " ") || s.startsWith(v.toLowerCase() + " "));
    assert.ok(startsWithVerb, `"${s}" should start with action verb`);
  }
});

test("resume-bullet: count within range 2-5", () => {
  const out = gen.generate({ bullet: "shipped feature", count: "4" }, 444);
  assert.ok(out.length >= 2 && out.length <= 5);
});
