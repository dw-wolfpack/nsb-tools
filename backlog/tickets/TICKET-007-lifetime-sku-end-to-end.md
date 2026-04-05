# TICKET-007: Lifetime SKU end-to-end

**Status:** ready  
**Band:** P1  
**Workstream:** Eng / Monetization  
**Agent hint:** Entitlements + Eng

## Problem

`LIFETIME_CHECKOUT_*` in `config.js` may be empty; Worker must **recognize** one-time buyers; copy must not promise what Stripe does not deliver.

## Outcome

If lifetime is a real SKU: Payment Link live, URLs in config, Worker marks customer active, Pro UI shows both options without tripping users. If never shipping lifetime: remove UI surface and close ticket explicitly.

## Acceptance criteria

- [ ] Decision: ship lifetime or remove from UX.
- [ ] If ship: prod test purchase (small amount or coupon) → verify unlock.
- [ ] If ship: docs for how lifetime is stored vs subscription in Worker/Stripe.

## Metrics

- Lagging: % of revenue from lifetime vs monthly; refund rate by SKU.
