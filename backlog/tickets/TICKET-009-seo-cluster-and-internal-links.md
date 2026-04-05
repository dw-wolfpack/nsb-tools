# TICKET-009: SEO cluster + internal links (ICP-aligned)

**Status:** ready  
**Band:** P1  
**Workstream:** Growth  
**Agent hint:** SEO agent

## Problem

Individual tool pages rank better when **clusters** reinforce intent: hub → spokes, AI hub → calculators, glossary ↔ tools.

## Outcome

For the wedge in TICKET-004: map **pillar URL(s)**, **supporting tools**, and add **internal links** + anchor text that humans would click. Run `npm run seo:metrics` after; no regression on broken links.

## Acceptance criteria

- [ ] Cluster map written (even bullet list).
- [ ] Minimum **10** new intentional internal links OR one new pillar page shipped.
- [ ] AI hub / categories updated if they are entry points for the cluster.

## Metrics

- Leading: impressions/clicks for cluster (GSC, TICKET-010).
- Lagging: organic sessions to money pages.
