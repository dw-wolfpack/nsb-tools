/**
 * tests/load-logic.js
 *
 * Loads a browser-style IIFE logic file into the current Node process by:
 *   1. Setting a fresh globalThis.window stub (so window.NSB_* is clean).
 *   2. Dynamically importing the file with a cache-busting query param
 *      (forces Node to re-evaluate the IIFE on each call).
 *   3. Returning globalThis.window so tests can read window.NSB_*.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

/**
 * @param {string} relativePath  e.g. "assets/js/tools/loan-debt-payoff-calculator/logic.js"
 * @returns {Promise<typeof globalThis.window>}
 */
export async function loadLogic(relativePath) {
  // Reset window stub before each load so globals from previous files don't leak.
  globalThis.window = {
    NSB_UTILS: {
      parseNumberSafe(value) {
        const cleaned = String(value ?? "")
          .replace(/\$/g, "")
          .replace(/,/g, "")
          .replace(/%/g, "")
          .trim();
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : NaN;
      },
    },
  };

  const absPath = resolve(REPO_ROOT, relativePath);
  // Cache-bust so the IIFE re-evaluates on every loadLogic() call.
  await import(pathToFileURL(absPath).href + "?v=" + Date.now());

  return globalThis.window;
}
