# TICKET-003: README, registry, and sitemap alignment

**Status:** ready  
**Workstream:** Eng + Growth  
**Agent hint:** Ops agent or SEO agent

## Problem

README says “17 tools”; `registry.js` has many more entries. Drift erodes trust and confuses contributors. Sitemap updates are manual (README TODO).

## Outcome

Public docs match reality. Optional: script or CI step to regenerate `sitemap.xml` from registry (or a single manifest).

## Acceptance criteria

- [ ] README structure section reflects actual routes/tool count (or says “see registry” with count script).
- [ ] `npm run seo:metrics` still passes after changes.
- [ ] If auto-sitemap shipped: documented command + CI hook; if not: clear manual checklist in README.

## Metrics

- Leading: time to add a new tool (minutes).
- Lagging: SEO indexation issues (Search Console if used).
