/**
 * NSB Tools - Environment-aware config (license worker base URL + checkout URL).
 * Use window.NSB_CONFIG.LICENSE_API_BASE for license API calls; fall back to PROD if missing.
 * Use window.NSB_CONFIG.PRO_CHECKOUT_URL to open Stripe checkout (empty string = not configured).
 */

const LICENSE_DEV  = "https://nsb-tools-license-dev.cnfiegel.workers.dev";
const LICENSE_PROD = "https://nsb-tools-license.cnfiegel.workers.dev";

// Set these to your Stripe Payment Link URLs. They are public (not secrets).
const CHECKOUT_DEV  = "https://buy.stripe.com/test_fZu00ka10dGU0YSb6pdZ601"; // e.g. "https://buy.stripe.com/test_..."
const CHECKOUT_PROD = "https://buy.stripe.com/14AcN6ebf7rR6hfdBG5kk01"; // e.g. "https://buy.stripe.com/..."

// One-time lifetime Pro: create a separate Payment Link in Stripe and paste URLs here.
const LIFETIME_CHECKOUT_DEV  = "";
const LIFETIME_CHECKOUT_PROD = "";

// Set this as the redirect URL in your Stripe Payment Link settings for both dev and prod checkout links.
const THANK_YOU_URL_DEV  = "http://localhost:8788/thank-you/";
const THANK_YOU_URL_PROD = "https://tools.nextstepsbeyond.online/thank-you/";

const PRO_PRICE_TEXT_DEV  = "$14.99/mo";
const PRO_PRICE_TEXT_PROD = "$14.99/mo";

const LIFETIME_PRICE_TEXT_DEV  = "$300 one-time";
const LIFETIME_PRICE_TEXT_PROD = "$300 one-time";

/**
 * Resolve config from hostname. Safe to call in Node (no window).
 * @param {string} hostname
 * @returns {{ LICENSE_API_BASE: string, ENV_NAME: "local" | "preview" | "prod", PRO_CHECKOUT_URL: string, LIFETIME_CHECKOUT_URL: string, THANK_YOU_URL: string, PRO_PRICE_TEXT: string, LIFETIME_PRICE_TEXT: string }}
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
    LIFETIME_CHECKOUT_URL: isDev ? LIFETIME_CHECKOUT_DEV : LIFETIME_CHECKOUT_PROD,
    THANK_YOU_URL:    isDev ? THANK_YOU_URL_DEV : THANK_YOU_URL_PROD,
    PRO_PRICE_TEXT:   (isDev ? PRO_PRICE_TEXT_DEV : PRO_PRICE_TEXT_PROD) || "$14.99/mo",
    LIFETIME_PRICE_TEXT: (isDev ? LIFETIME_PRICE_TEXT_DEV : LIFETIME_PRICE_TEXT_PROD) || "$300 one-time",
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
