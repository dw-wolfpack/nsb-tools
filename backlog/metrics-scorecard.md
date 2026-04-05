# Metrics scorecard

Update **weekly** (15 minutes). Prefer directional truth over precision theater.

---

## This week — **2026-04-04**

### One sentence — what moved?

**Shipped system, not traffic yet:** backlog is now runnable (tickets 001–021, charterfile + manifest, `instructions.md` / playbook, three psychology charters + ethics red-team). Repo CI stays green; SEO script still reports **technical/content debt** (flags + broken links) to clear over time.

### One bet for next week

**Pick one:** (a) **TICKET-004** — write ICP + 90-day wedge, or (b) **TICKET-001** — wire analytics so this scorecard stops saying N/A on traffic and events. *Recommendation:* 004 first if it unlocks copy/SEO focus; 001 first if you want measurement before the next big content push.

### Lagging snapshot (outcomes) — *you paste from dashboards*

| Metric | This week (2026-04-04) | Notes |
|--------|-------------------------|--------|
| MRR or equivalent | *— pull Stripe —* | Bridge: `north-star.md` |
| One-time revenue | *— pull Stripe —* | Lifetime vs sub |
| Paid customers (active) | *— Stripe + Worker reality —* | Define “active” once |

### Leading snapshot (inputs) — *mostly unwired until TICKET-001*

| Metric | This week (2026-04-04) | Notes |
|--------|-------------------------|--------|
| Organic sessions | **N/A** | Analytics provider not wired to `nsbAnalytics` yet |
| Tool completion proxy | **N/A** | Same; events only in console today |
| Limit hits / upgrade intent | **N/A** | No dashboard; optional manual guess from support |
| Checkout clicks | **N/A** | `checkout_click` exists in code; not in a tool |
| Email list growth | *— Mailchimp —* | Net new / unsub |
| Top pages by entry | **N/A** | Needs analytics |

### Quality / product health (repo — verified locally)

| Metric | This week (2026-04-04) |
|--------|-------------------------|
| **Tests** | **282 passed** (`npm test`) |
| **Precommit** | **Green** (`npm test` + `seo:audit` + `seo:metrics`) |
| **SEO metrics run** | **60** pages scanned; **24** flagged; **9** broken links; **20** below target words; **0** missing required keywords → `reports/seo-metrics.md` |
| Core Web Vitals | *Not measured in CI* — spot-check Search Console / Lighthouse when you care about a page |

### If stuck

Open `staff-pm-system-audit.md` and pick **one** gap (usually ICP clarity or measurement).

---

## Lagging (outcomes) — template

| Metric | Definition | Where to get it | Target / note |
|--------|------------|-----------------|---------------|
| MRR or equivalent | Monthly recurring from subscriptions (annual normalized if you add yearly) | Stripe dashboard | Bridge to north star in `north-star.md` |
| One-time revenue | Lifetime / lump purchases | Stripe | Separate row; do not confuse with MRR |
| Paid customers (active) | Paying or in trial, your definition | Stripe + license Worker reality | Track churn informally at low N |

## Leading (inputs you control)

| Metric | Definition | Where to get it |
|--------|------------|-----------------|
| Organic sessions | Unbranded + branded split ideally | Analytics (once wired) |
| Tool completion proxy | `tool_generate` or key events per tool | `window.nsbAnalytics` → provider |
| Limit hits | Users bumping free tier | Event: limit / upgrade modal |
| Checkout clicks | Intent to pay | `checkout_click` (already partially instrumented) |
| Email list growth | Net new engaged subscribers | Mailchimp / ESP |
| Top pages by entry | Where people land first | Analytics landing report |

## Quality / product health

| Metric | Definition |
|--------|------------|
| Core Web Vitals | At least no regressions on LCP/CLS for tool pages |
| Test pass | `npm test` + `npm run precommit` green before deploy |
| SEO hygiene | `npm run seo:metrics` — fix regressions before they stack |

## Weekly ritual (suggested)

1. Update numbers (even if some are “N/A — not wired yet”).
2. One sentence: **what moved?**
3. One bet for next week: **single ship** or **single experiment**.
4. If stuck, open `staff-pm-system-audit.md` and pick **one** gap.
