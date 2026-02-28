import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/hashtag-generator/logic.js");
const gen = w.NSB_HASHTAG;

test("hashtag: output has broad, niche, community arrays", () => {
  const out = gen.generate({ niche: "creator" }, 111);
  assert.ok(Array.isArray(out.broad), "broad must be array");
  assert.ok(Array.isArray(out.niche), "niche must be array");
  assert.ok(Array.isArray(out.community), "community must be array");
});

test("hashtag: no spaces in tags", () => {
  const out = gen.generate({ keywords: "B2B SaaS" }, 222);
  const all = [...out.broad, ...out.niche, ...out.community];
  for (const tag of all) {
    assert.ok(!tag.includes(" "), `tag "${tag}" must not contain spaces`);
  }
});

test("hashtag: tags have # prefix", () => {
  const out = gen.generate({}, 333);
  const all = [...out.broad, ...out.niche, ...out.community];
  for (const tag of all) {
    assert.ok(tag.startsWith("#"), `tag "${tag}" must start with #`);
  }
});

test("hashtag: special tokens C++ and B2B SaaS produce valid hashtags", () => {
  const out = gen.generate({ keywords: "C++, B2B SaaS" }, 444);
  const all = [...out.broad, ...out.niche, ...out.community];
  assert.ok(all.length >= 5, "must have tags");
  for (const tag of all) {
    assert.ok(/^#[a-z0-9]+$/i.test(tag), `tag "${tag}" must be valid format`);
  }
});

test("hashtag: empty topic safe", () => {
  const out = gen.generate({ niche: "", keywords: "" }, 555);
  assert.ok(out.broad.length + out.niche.length + out.community.length >= 5);
});

test("hashtag: no duplicate tags across output", () => {
  const out = gen.generate({ niche: "tech" }, 666);
  const all = [...out.broad, ...out.niche, ...out.community];
  const unique = new Set(all);
  assert.strictEqual(all.length, unique.size, "no duplicate tags");
});
