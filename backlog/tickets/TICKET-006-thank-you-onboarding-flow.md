# TICKET-006: Thank-you + post-purchase onboarding

**Status:** ready  
**Band:** P1  
**Workstream:** UX / Monetization  
**Agent hint:** Conversion agent

## Problem

After Stripe, users must **feel unlock** immediately: verify email expectation, where to click, how to confirm Pro, what to do if it failed.

## Outcome

Thank-you / verify page(s) explain: next step (open tool X, check license), troubleshooting (clear cache, different browser), support path. Matches Worker + `localStorage` behavior truthfully.

## Acceptance criteria

- [ ] Thank-you route reviewed for ICP clarity.
- [ ] “Paid but not unlocked” path documented in FAQ or on-page.
- [ ] Analytics event for `purchase_return` or page view on thank-you (with TICKET-001).

## Metrics

- Leading: bounce on thank-you; visits to FAQ after purchase.
- Lagging: refund / “not working” complaints.
