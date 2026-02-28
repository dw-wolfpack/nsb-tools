import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLogic } from "./load-logic.js";

const w = await loadLogic("assets/js/tools/loi-outline/logic.js");
const gen = w.NSB_LOI;

test("loi: blank deal still returns array with placeholders", () => {
  const out = gen.generate({ asset: "", price: "", financing: "" }, 111);
  assert.ok(Array.isArray(out) && out.length >= 4);
});

test("loi: required sections present (price, financing)", () => {
  const out = gen.generate({ asset: "restaurant", price: "500k", financing: "SBA" }, 222);
  const joined = out.join(" ");
  assert.ok(joined.includes("Purchase price") || joined.includes("price"));
  assert.ok(joined.includes("Financing") || joined.includes("financing"));
});

test("loi: count respected (4-8)", () => {
  const out = gen.generate({ count: "6" }, 333);
  assert.ok(out.length >= 4 && out.length <= 8);
});
