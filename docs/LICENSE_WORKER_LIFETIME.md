# Lifetime Pro and the license worker

NSB Tools Pro unlock uses **email verification** against the Cloudflare Worker at `LICENSE_API_BASE` (`GET /verify?email=`).

For **monthly** Stripe subscriptions, your worker should already mark the customer email as active when billing is valid.

For **one-time lifetime** purchases ($\$300$ Payment Link):

- The **same** `/verify` response must return `{ "ok": true, "active": true }` for the buyer’s email after Stripe reports a successful payment.
- Typical approach: Stripe webhook on `checkout.session.completed` (or `payment_intent.succeeded`) for the **lifetime** price/product, then persist that email as entitled in KV/D1 (same store as monthly).

Until the worker treats lifetime payments as **active**, buyers will see *“No active Pro found for that email”* after paying.

Ship the Payment Link and `LIFETIME_CHECKOUT_URL` in the static site only after the worker path is verified in **Stripe test mode**.
