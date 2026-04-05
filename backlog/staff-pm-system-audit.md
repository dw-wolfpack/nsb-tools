# Staff PM system audit (no ads)

Honest cross-functional view: what is **missing or weak** between **0-1** (it exists, it ships) and **1-100** (it compounds). Ads are out of scope unless you add them later with proper policy work.

## Product / strategy

- **Single ICP × wedge:** Who is the *primary* user for the next 90 days? (e.g. “solo operator polishing revenue story,” “job seeker,” “content creator”). Tool farms win when **one narrative** pulls a cluster of tools, not when every page is generic.
- **Upgrade narrative:** Why Pro *now* for that ICP? Tie features to **outcomes** (time saved, export for stakeholders) not feature dumps.
- **Roadmap ritual:** Weekly bet, monthly theme. The `/backlog` folder is the home; avoid thrash.

## Engineering

- **Observability:** Analytics shim exists but is mostly console — **wire to a provider** or you cannot steer.
- **Entitlements:** Client `localStorage` + Worker verification mix — decide **source of truth** for “Pro” for high-value actions (CSV, limits). Reduce bypass friction for honest users; clarify threat model for bad actors.
- **Ops debt:** README/tool count drift vs `registry.js`; sitemap/registry sync (noted in README TODO).
- **Reliability:** Pages Functions (e.g. subscribe) need env validation and monitoring mindset (errors → visible).

## UX / design

- **First-run clarity:** On high-intent tools, ensure empty states and “what do I do in 30 seconds” are obvious.
- **Trust:** Privacy/terms must match actual behavior (analytics, email, Stripe) — update when you ship measurement.
- **Progressive disclosure:** Pro upsell without blocking utility too early; **limit UX** should feel fair, not punitive.

## Marketing / growth (non-ads)

- **SEO is your main engine:** You already invest in SEO scripts — pair with **intent clusters** (pillar pages, internal links from AI hub to tools).
- **Owned audience:** `/updates/` + Mailchimp — define **cadence** and **one job per email** (one tool deep-dive, one workflow).
- **Distribution experiments:** Communities, partnerships, templates, “share results” moments — pick **one** monthly experiment, log outcome in `metrics-scorecard.md`.

## Monetization

- **SKUs complete:** Monthly Pro path vs lifetime — if lifetime is real, **config and Worker** paths must be done end-to-end.
- **Pricing story:** Anchor vs alternatives (DIY spreadsheet, hiring someone). Keep copy grounded.

## Legal / trust

- **Privacy policy** is a living doc once analytics and payments evolve.
- **Refund/support posture:** FAQ-level clarity reduces chargebacks.

## What “good” looks like at 1-100

You can answer in one sitting:

1. Who is this for?
2. What do they do on site in the first visit?
3. What makes them come back?
4. What makes a subset pay?
5. What number proves (2)-(4) week over week?

If any answer is fuzzy, that fuzzy area is backlog fodder.
