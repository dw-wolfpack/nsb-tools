# TICKET-013: Stripe — customer care (portal, emails, failures)

**Status:** ready  
**Band:** P2  
**Workstream:** Monetization / Ops  
**Agent hint:** Ops agent

## Problem

Subscriptions generate **failed payments**, card updates, and “where is my invoice.” Reduce support load with Stripe-native surfaces.

## Outcome

Customer Portal enabled where appropriate, receipt emails branded/plain enough, **dunning** awareness (even if “manual for now”). Document in README or `docs/` for you.

## Acceptance criteria

- [ ] Portal tested: cancel/update card if you promise that in FAQ.
- [ ] Branding + customer email settings reviewed in Stripe.
- [ ] Short runbook: “user says charged but locked” debug steps.

## Metrics

- Lagging: failed payment rate; churn reasons in Stripe.
