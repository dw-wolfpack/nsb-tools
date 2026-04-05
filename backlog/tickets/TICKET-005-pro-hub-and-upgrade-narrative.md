# TICKET-005: Pro hub + upgrade narrative

**Status:** ready  
**Band:** P0  
**Workstream:** UX / Monetization  
**Agent hint:** Conversion agent

## Problem

Paywall moments (modal, `/pro/`) must tell a **coherent outcome story** for the ICP from TICKET-004. Feature lists without “so what” leave money on the table.

## Outcome

`/pro/` and upgrade modal aligned: headline + 3 outcome bullets + social proof placeholder (or real quotes later) + clear CTA to checkout. Monthly vs lifetime framed as **choice**, not confusion.

## Acceptance criteria

- [ ] `/pro/` copy passes “10-second skim” test for chosen ICP.
- [ ] Modal copy does not contradict Pro hub.
- [ ] Pricing text matches `config.js` / Stripe reality.
- [ ] One secondary CTA (FAQ / contact / updates) for people not ready to buy.

## Metrics

- Leading: `upgrade_click`, `checkout_click`, time on `/pro/`.
- Lagging: checkout completion (Stripe).
