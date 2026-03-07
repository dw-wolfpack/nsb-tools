import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const subscribeLib = await import(pathToFileURL(resolve(REPO_ROOT, "functions/_lib/subscribe.js")).href);
const { normalizeEmail, validateEmail, validateFirstName, getDoubleOptInStatus } = subscribeLib;

test("normalizeEmail: trims and lowercases", () => {
  assert.strictEqual(normalizeEmail("  Foo@Example.COM  "), "foo@example.com");
  assert.strictEqual(normalizeEmail("a@b.co"), "a@b.co");
});

test("validateEmail: rejects empty", () => {
  assert.strictEqual(validateEmail(""), "invalid_email");
  assert.strictEqual(validateEmail(normalizeEmail("   ")), "invalid_email");
});

test("validateEmail: rejects missing @", () => {
  assert.strictEqual(validateEmail("notanemail"), "invalid_email");
  assert.strictEqual(validateEmail("@nodomain"), "invalid_email");
});

test("validateEmail: rejects length > 254", () => {
  const long = "a".repeat(250) + "@b.co";
  assert.strictEqual(long.length, 255);
  assert.strictEqual(validateEmail(long), "invalid_email");
  const atLimit = "a".repeat(245) + "@b.co";
  assert.strictEqual(atLimit.length, 250);
  assert.strictEqual(validateEmail(atLimit), null);
});

test("validateEmail: accepts valid", () => {
  assert.strictEqual(validateEmail("a@b.co"), null);
  assert.strictEqual(validateEmail("user+tag@example.com"), null);
});

test("validateFirstName: trims and allows empty", () => {
  const r1 = validateFirstName("  Jane  ");
  assert.strictEqual(r1.value, "Jane");
  assert.strictEqual(r1.error, null);
  const r2 = validateFirstName(undefined);
  assert.strictEqual(r2.value, "");
  assert.strictEqual(r2.error, null);
});

test("validateFirstName: rejects length > 80", () => {
  const r = validateFirstName("a".repeat(81));
  assert.strictEqual(r.error, "invalid_first_name");
  assert.strictEqual(r.value, "");
  const ok = validateFirstName("a".repeat(80));
  assert.strictEqual(ok.error, null);
  assert.strictEqual(ok.value.length, 80);
});

test("getDoubleOptInStatus: true => pending", () => {
  assert.strictEqual(getDoubleOptInStatus("true"), "pending");
  assert.strictEqual(getDoubleOptInStatus(true), "pending");
});

test("getDoubleOptInStatus: false or undefined => subscribed", () => {
  assert.strictEqual(getDoubleOptInStatus("false"), "subscribed");
  assert.strictEqual(getDoubleOptInStatus(undefined), "subscribed");
  assert.strictEqual(getDoubleOptInStatus(""), "subscribed");
});
