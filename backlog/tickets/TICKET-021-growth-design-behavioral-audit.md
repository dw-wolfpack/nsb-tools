# TICKET-021: Growth.Design behavioral audit pass

**Status:** ready  
**Band:** P1  
**Workstream:** UX / Product  
**Agent hint:** `psychology-perception-meaning` then `psychology-action-memory` (two sessions); close with **`psychology-ethics-review`** red-team on the same scope before merge.

## Problem

Tool pages and money paths can be “correct” but still **feel confusing, pushy, or forgettable**. [Growth.Design’s psychology reference](https://growth.design/psychology) encodes how people **filter info, make meaning, act under time pressure, and remember** — we have not systematically applied it.

## Outcome

For **ICP-flagship tools** (from TICKET-004/011) **and** **Pro paths** (modal, `/pro/`, thank-you): a short audit mapping issues to **named principles**, then **small shipped fixes** or a prioritized backlog of follow-ups.

## Acceptance criteria

- [ ] Read `backlog/charterfile/psychology-reference.md`.
- [ ] At least **3** tool slugs + **Pro funnel** reviewed across the two charters (perception/meaning vs action/memory).
- [ ] Each finding names a principle (e.g. cognitive load, peak-end rule) + **ethical** fix — no dark patterns.
- [ ] At least **5** concrete changes merged **or** documented as next tickets with owners.
- [ ] **`psychology-ethics-review`:** one pass with Block/Fix/Watch — **no open Block** items unless owner accepts risk in writing.
- [ ] `npm test` / `precommit` still green if code changed.

## Metrics

- Leading: session quality (qualitative), support confusion drops.
- Lagging: upgrade modal dismiss vs checkout (once analytics live).

## Reference

- External: https://growth.design/psychology  
- Charters: `backlog/charterfile/psychology-perception-meaning.json`, `psychology-action-memory.json`, `psychology-ethics-review.json`
