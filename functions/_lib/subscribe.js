/**
 * Shared validation and helpers for subscribe API. Used by functions/api/subscribe.js and tests.
 */

const EMAIL_MAX_LENGTH = 254;
const FIRST_NAME_MAX_LENGTH = 80;

/**
 * @param {string} raw
 * @returns {string}
 */
export function normalizeEmail(raw) {
  return (raw || "").trim().toLowerCase();
}

/**
 * @param {string} email - already normalized
 * @returns {string|null} Error code or null if valid
 */
export function validateEmail(email) {
  if (!email) return "invalid_email";
  if (email.length > EMAIL_MAX_LENGTH) return "invalid_email";
  if (email.indexOf("@") < 1) return "invalid_email";
  return null;
}

/**
 * @param {string} [raw] - optional first name
 * @returns {{ value: string, error: string|null }}
 */
export function validateFirstName(raw) {
  const value = (raw === undefined || raw === null) ? "" : String(raw).trim();
  if (value.length > FIRST_NAME_MAX_LENGTH) return { value: "", error: "invalid_first_name" };
  return { value, error: null };
}

/**
 * @param {string} [envValue] - MAILCHIMP_DOUBLE_OPTIN env
 * @returns {"pending"|"subscribed"}
 */
export function getDoubleOptInStatus(envValue) {
  if (envValue === "true" || envValue === true) return "pending";
  return "subscribed";
}
