# TICKET-001: Analytics spine + privacy sync

**Status:** ready  
**Workstream:** Eng + Product  
**Agent hint:** Analytics agent (implementation); you own provider choice

## Problem

`window.nsbAnalytics.track` only logs to the console. You cannot steer product or monetization without real event data. Privacy page currently downplays tracking; adding measurement requires **honest disclosure**.

## Outcome

- Events flow to a chosen analytics tool (Plausible, GA4, or other).
- Privacy (and Terms if needed) describe what is collected, why, and retention at a high level.
- `metrics-scorecard.md` has non-N/A rows for traffic and key events.

## Acceptance criteria

- [ ] Provider account + domain configured.
- [ ] Loader/script integrated without breaking CSP (if you add CSP later, track that).
- [ ] `nsbAnalytics.track` forwards events with consistent names (`page_view` optional via provider, `tool_generate`, `upgrade_click`, `checkout_click`, etc.).
- [ ] Privacy page updated: analytics section accurate; “may add in future” replaced with specifics.
- [ ] Deploy verified on production hostname.

## Metrics

- Leading: event volume per tool, funnel from generate → upgrade modal → checkout click.
- Lagging: correlation with revenue (weekly eyeball, not overfit early).
