# TICKET-014: Subscribe + license Worker — observability

**Status:** ready  
**Band:** P2  
**Workstream:** Eng / Ops  
**Agent hint:** Ops agent

## Problem

`/api/subscribe` and license Worker failures are **silent** to you until users complain. At revenue scale, you need fast detection.

## Outcome

Lightweight approach: CF analytics/dashboard checks, scheduled ping, or log review checklist. Document **who** checks weekly and what “red” means.

## Acceptance criteria

- [ ] Document: env vars required for subscribe; how to test locally (`dev:cf`).
- [ ] Document: Worker URL(s); how to spot 5xx spikes.
- [ ] Optional: pingmon or free uptime check on critical endpoints (no overbuild).

## Metrics

- Leading: error rate (manual weekly OK at small scale).
