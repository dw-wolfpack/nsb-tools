/**
 * NSB Tools - Environment-aware config (license worker base URL + checkout URL).
 * Use window.NSB_CONFIG.LICENSE_API_BASE for license API calls; fall back to PROD if missing.
 * Use window.NSB_CONFIG.PRO_CHECKOUT_URL to open Stripe checkout (empty string = not configured).
 */

const LICENSE_DEV  = "https://nsb-tools-license-dev.cnfiegel.workers.dev";
const LICENSE_PROD = "https://nsb-tools-license.cnfiegel.workers.dev";

// Set these to your Stripe Payment Link URLs. They are public (not secrets).
const CHECKOUT_DEV  = "https://buy.stripe.com/test_fZu00ka10dGU0YSb6pdZ601"; // e.g. "https://buy.stripe.com/test_..."
const CHECKOUT_PROD = ""; // e.g. "https://buy.stripe.com/..."

/**
 * Resolve config from hostname. Safe to call in Node (no window).
 * @param {string} hostname
 * @returns {{ LICENSE_API_BASE: string, ENV_NAME: "local" | "preview" | "prod", PRO_CHECKOUT_URL: string }}
 */
export function resolveEnvConfig(hostname) {
  const h = (hostname || "").toLowerCase();
  const isLocal   = h === "localhost" || h === "127.0.0.1";
  const isPreview = h.endsWith(".pages.dev");
  const isDev     = isLocal || isPreview;
  return {
    LICENSE_API_BASE: isDev ? LICENSE_DEV : LICENSE_PROD,
    ENV_NAME:         isLocal ? "local" : isPreview ? "preview" : "prod",
    PRO_CHECKOUT_URL: isDev ? CHECKOUT_DEV : CHECKOUT_PROD,
  };
}

if (typeof window !== "undefined") {
  try {
    const hostname = (window.location && window.location.hostname) || "";
    window.NSB_CONFIG = resolveEnvConfig(hostname);
  } catch (_) {
    window.NSB_CONFIG = resolveEnvConfig("");
  }
}
