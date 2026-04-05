# TICKET-016: Share URLs + return loops

**Status:** ready  
**Band:** P2  
**Workstream:** Product  
**Agent hint:** Product agent

## Problem

Tools with **shareable state** (URL params) can drive return visits and indirect acquisition. Not every tool needs it; prioritize ICP tools.

## Outcome

Audit which tools already encode state; add or improve **copy** (“Copy link to this scenario”) on 1–3 high-fit tools. Ensure shared links don’t leak sensitive data in obvious ways.

## Acceptance criteria

- [ ] Inventory: which tools support share/update URL today.
- [ ] At least **one** improvement shipped (UX or docs).
- [ ] Privacy note in FAQ if URLs contain user content.

## Metrics

- Leading: `copy_link` event if instrumented; return visits (analytics).
