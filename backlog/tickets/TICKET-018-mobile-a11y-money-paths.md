# TICKET-018: Mobile + a11y on money paths

**Status:** ready  
**Band:** P2  
**Workstream:** UX  
**Agent hint:** UX polish agent

## Problem

Checkout and Pro flows on **mobile** silently kill conversion. Basic **focus states** and modals matter for keyboard and screen reader users.

## Outcome

Pass through `/pro/`, upgrade modal, and **one flagship tool** on phone + keyboard-only: no traps, tap targets OK, modals labeled.

## Acceptance criteria

- [ ] Checklist run (WCAG-ish pragmatism, not certification theater).
- [ ] Issues fixed or ticketed explicitly if deferred.
- [ ] No visual regression on desktop.

## Metrics

- Leading: mobile share of checkout clicks (analytics).
- Lagging: mobile vs desktop conversion (when N is enough).
