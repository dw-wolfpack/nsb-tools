import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/cold-outreach-email/logic.js");
const gen = w.NSB_COLD_OUTREACH;

test("cold-outreach: missing recipient uses [Name] placeholder", () => {
  const out = gen.generate({ context: "a role" }, 111);
  assert.ok(out.punchy.includes("[Name]") || out.formal.includes("[Name]"), "must include [Name] placeholder");
});

test("cold-outreach: includes both punchy and formal variants", () => {
  const out = gen.generate({ context: "opportunity" }, 222);
  assert.ok("punchy" in out && "formal" in out);
  assert.ok(out.punchy.length > 0 && out.formal.length > 0);
});

test("cold-outreach: output has reasonable length", () => {
  const out = gen.generate({ context: "sales role" }, 333);
  assert.ok(out.punchy.length < 500 && out.formal.length < 600, "reasonable length");
});
