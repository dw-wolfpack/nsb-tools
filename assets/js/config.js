/**
 * NSB Tools - Environment-aware config (license worker base URL).
 * Use window.NSB_CONFIG.LICENSE_API_BASE for license API calls; fall back to PROD if missing.
 */

const LICENSE_DEV = "https://nsb-tools-license-dev.cnfiegel.workers.dev";
const LICENSE_PROD = "https://nsb-tools-license.cnfiegel.workers.dev";

/**
 * Resolve LICENSE_API_BASE and ENV_NAME from hostname. Safe to call in Node (no window).
 * @param {string} hostname
 * @returns {{ LICENSE_API_BASE: string, ENV_NAME: "local" | "preview" | "prod" }}
 */
export function resolveEnvConfig(hostname) {
  const h = (hostname || "").toLowerCase();
  if (h === "localhost" || h === "127.0.0.1") {
    return { LICENSE_API_BASE: LICENSE_DEV, ENV_NAME: "local" };
  }
  if (h.endsWith(".pages.dev")) {
    return { LICENSE_API_BASE: LICENSE_DEV, ENV_NAME: "preview" };
  }
  if (h === "tools.nextstepsbeyond.online") {
    return { LICENSE_API_BASE: LICENSE_PROD, ENV_NAME: "prod" };
  }
  return { LICENSE_API_BASE: LICENSE_PROD, ENV_NAME: "prod" };
}

if (typeof window !== "undefined") {
  try {
    const hostname = (window.location && window.location.hostname) || "";
    window.NSB_CONFIG = resolveEnvConfig(hostname);
  } catch (_) {
    window.NSB_CONFIG = resolveEnvConfig("");
  }
}
