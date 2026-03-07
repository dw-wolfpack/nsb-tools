import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveEnvConfig } from "../assets/js/config.js";

const LICENSE_DEV = "https://nsb-tools-license-dev.cnfiegel.workers.dev";
const LICENSE_PROD = "https://nsb-tools-license.cnfiegel.workers.dev";

test("localhost => dev + local", () => {
  const out = resolveEnvConfig("localhost");
  assert.strictEqual(out.LICENSE_API_BASE, LICENSE_DEV);
  assert.strictEqual(out.ENV_NAME, "local");
});

test("127.0.0.1 => dev + local", () => {
  const out = resolveEnvConfig("127.0.0.1");
  assert.strictEqual(out.LICENSE_API_BASE, LICENSE_DEV);
  assert.strictEqual(out.ENV_NAME, "local");
});

test("nsb-tools.pages.dev => dev + preview", () => {
  const out = resolveEnvConfig("nsb-tools.pages.dev");
  assert.strictEqual(out.LICENSE_API_BASE, LICENSE_DEV);
  assert.strictEqual(out.ENV_NAME, "preview");
});

test("something.pages.dev => dev + preview", () => {
  const out = resolveEnvConfig("something.pages.dev");
  assert.strictEqual(out.LICENSE_API_BASE, LICENSE_DEV);
  assert.strictEqual(out.ENV_NAME, "preview");
});

test("tools.nextstepsbeyond.online => prod + prod", () => {
  const out = resolveEnvConfig("tools.nextstepsbeyond.online");
  assert.strictEqual(out.LICENSE_API_BASE, LICENSE_PROD);
  assert.strictEqual(out.ENV_NAME, "prod");
});

test("randomdomain.com => prod + prod", () => {
  const out = resolveEnvConfig("randomdomain.com");
  assert.strictEqual(out.LICENSE_API_BASE, LICENSE_PROD);
  assert.strictEqual(out.ENV_NAME, "prod");
});

test("import does not throw when window is undefined", () => {
  assert.strictEqual(typeof globalThis.window, "undefined");
  const out = resolveEnvConfig("localhost");
  assert.strictEqual(out.ENV_NAME, "local");
});

test("resolveEnvConfig includes PRO_CHECKOUT_URL string for dev", () => {
  const out = resolveEnvConfig("localhost");
  assert.strictEqual(typeof out.PRO_CHECKOUT_URL, "string", "PRO_CHECKOUT_URL should be a string");
});

test("resolveEnvConfig includes PRO_CHECKOUT_URL string for prod", () => {
  const out = resolveEnvConfig("randomdomain.com");
  assert.strictEqual(typeof out.PRO_CHECKOUT_URL, "string", "PRO_CHECKOUT_URL should be a string for prod");
});
