import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/username-generator/logic.js");
const gen = w.NSB_USERNAME_GENERATOR;

test("username: returns array of N usernames within count range", () => {
  const out = gen.generate({}, 999);
  assert.ok(Array.isArray(out), "output must be array");
  assert.ok(out.length >= 5 && out.length <= 10, `count in 5-10, got ${out.length}`);
});

test("username: no duplicates", () => {
  const out = gen.generate({ niche: "test", keywords: "kw" }, 111);
  const unique = new Set(out);
  assert.strictEqual(out.length, unique.size, `duplicates found: ${out.join(", ")}`);
});

test("username: each username max length 30", () => {
  const out = gen.generate({ count: "8" }, 222);
  for (const u of out) {
    assert.ok(u.length <= 30, `username "${u}" exceeds 30 chars`);
  }
});

test("username: usernames are slugified (no spaces, alphanumeric + underscore)", () => {
  const out = gen.generate({}, 333);
  for (const u of out) {
    assert.ok(/^[a-z0-9_]+$/.test(u), `username "${u}" contains invalid chars`);
  }
});

test("username: empty keywords still returns N usernames, no crash", () => {
  const out = gen.generate({ niche: "", keywords: "", name: "" }, 444);
  assert.ok(Array.isArray(out) && out.length >= 5, "empty inputs must still produce output");
});

test("username: special chars and emojis in keywords are normalized, no crash", () => {
  const out = gen.generate({ keywords: "C++ B2B @#$ emoji 🎉" }, 555);
  assert.ok(Array.isArray(out) && out.length >= 5, "special chars must not crash");
  for (const u of out) {
    assert.ok(/^[a-z0-9_]+$/.test(u), `output must be slugified`);
  }
});
