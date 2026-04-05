# NSB Pro: Stripe Payment Links and static config

The marketing site is static (Cloudflare Pages). Checkout uses **Stripe Payment Links** embedded from `assets/js/config.js` via `resolveEnvConfig()`.

## Required URLs

| Key | Purpose |
|-----|---------|
| `PRO_CHECKOUT_URL` | Monthly (or primary subscription) Payment Link |
| `LIFETIME_CHECKOUT_URL` | One-time lifetime Payment Link (e.g. $300) |

Development and production hosts each map to placeholder constants at the top of `config.js` (`*_DEV` / `*_PROD`). **Leave empty strings until the real Stripe links are pasted**, then deploy.

Display copy for the lifetime button uses `LIFETIME_PRICE_TEXT` (for example `$300 one-time`).

## License worker

After payment, Pro unlock is **email verification** against the license Worker (`GET {LICENSE_API_BASE}/verify?email=`). One-time lifetime buyers must still resolve as **`active: true`** for that email, or the modal will show “No active Pro.” See `docs/LICENSE_WORKER_LIFETIME.md`.

## Testing

Use Stripe test mode Payment Links on preview/staging hostnames, complete a test purchase, then verify unlock with the payer email on the deployed Worker.
