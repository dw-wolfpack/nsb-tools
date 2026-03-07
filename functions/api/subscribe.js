/**
 * Cloudflare Pages Function: POST /api/subscribe
 * Adds or updates a Mailchimp audience member (email + optional first name), tags with "nsb-tools".
 */

import { md5Hex } from "../_lib/md5.js";
import { normalizeEmail, validateEmail, validateFirstName, getDoubleOptInStatus } from "../_lib/subscribe.js";

function missingConfig(env) {
  const missing = [];
  if (!env.MAILCHIMP_API_KEY) missing.push("MAILCHIMP_API_KEY");
  if (!env.MAILCHIMP_AUDIENCE_ID) missing.push("MAILCHIMP_AUDIENCE_ID");
  if (!env.MAILCHIMP_SERVER_PREFIX) missing.push("MAILCHIMP_SERVER_PREFIX");
  return missing;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const missing = missingConfig(env);
  if (missing.length) {
    return jsonResponse({ ok: false, error: "missing_config", missing }, 500);
  }

  const apiKey = env.MAILCHIMP_API_KEY;
  const audienceId = env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = env.MAILCHIMP_SERVER_PREFIX;
  const doubleOptIn = env.MAILCHIMP_DOUBLE_OPTIN;

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const rawEmail = body && body.email;
  const email = normalizeEmail(rawEmail);
  const emailError = validateEmail(email);
  if (emailError) {
    return jsonResponse({ ok: false, error: emailError }, 400);
  }

  const { value: firstName, error: firstNameError } = validateFirstName(body && body.firstName);
  if (firstNameError) {
    return jsonResponse({ ok: false, error: firstNameError }, 400);
  }

  const statusIfNew = getDoubleOptInStatus(doubleOptIn);
  const subscriberHash = md5Hex(email);
  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = btoa("anystring:" + apiKey);

  const memberPayload = {
    email_address: email,
    status_if_new: statusIfNew,
    merge_fields: { FNAME: firstName || "" },
  };

  try {
    const putRes = await fetch(
      `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberPayload),
      }
    );

    const putBody = await putRes.text();
    if (!putRes.ok) {
      return jsonResponse({
        ok: false,
        error: "mailchimp_error",
        status: putRes.status,
        body: putBody.slice(0, 2000),
      }, 502);
    }

    const tagRes = await fetch(
      `${baseUrl}/lists/${audienceId}/members/${subscriberHash}/tags`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: [{ name: "nsb-tools", status: "active" }] }),
      }
    );
    if (!tagRes.ok) {
      // Member was added; tagging failed. Still return 200.
    }

    return jsonResponse({ ok: true, doubleOptIn: statusIfNew === "pending" }, 200);
  } catch (_) {
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}
