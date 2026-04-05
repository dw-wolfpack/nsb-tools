# TICKET-002: Pro entitlements — source of truth

**Status:** ready  
**Workstream:** Eng + Product  
**Agent hint:** Entitlements agent

## Problem

Pro state mixes **client `localStorage`** (`nsb_pro`) with **license Worker** verification. Free tier limits are client-enforced. Honest users can get confused after checkout; skeptics note bypass risk. Before scaling revenue, decide what must be **server-checked**.

## Outcome

Documented entitlement model: which actions require Worker verification vs fast client path. Implementation matches the doc for **high-value** actions (e.g. CSV export, lifted limits on specific tools).

## Acceptance criteria

- [ ] Short architecture note (in ticket or `docs/`) describing verify flow for monthly vs lifetime.
- [ ] List of gated features + enforcement point (client only / Worker on action).
- [ ] Happy path manual test: pay → thank-you → verify unlock on prod.
- [ ] Known limitations (bypass) noted for founder; no false “bank-grade” claims in copy.

## Metrics

- Leading: verify API success rate; support messages about “paid but locked.”
- Lagging: refund rate; repeat Pro usage (proxy: export events if instrumented).
