# Workstreams and agents

“Agents” here means **focused execution modes** you spin in Cursor (or assign to humans). Each agent has a **charter** (JSON + paste-ready prompt) in [`charterfile/`](charterfile/README.md) — same idea as a soul profile, but for execution. Each run should still attach **one ticket** and **one owner** (you) who integrates outputs.

## Core workstreams


| Workstream       | Owns                                          | Outputs                                            |
| ---------------- | --------------------------------------------- | -------------------------------------------------- |
| **Product / PM** | Priority, scope, success metric, cut line     | `active-priorities.md`, ticket acceptance criteria |
| **Engineering**  | Shipping, tests, reliability, instrumentation | PRs, passing CI, config correctness                |
| **UX / Content** | Clarity, tone, flows, empty states            | Copy + layout tweaks on tool pages                 |
| **Growth / SEO** | Discoverability, internal linking, snippets   | `seo:metrics` clean, sitemap, content briefs       |
| **Monetization** | Stripe, Worker, Pro UX, pricing copy          | End-to-end pay → unlock → retain                   |


## Suggested Cursor agents (spin these with tight prompts)

1. **Analytics agent** — Wire `nsbAnalytics.track` to chosen provider; event map; privacy notes.
2. **Entitlements agent** — Audit Pro gates; align license Worker + client; document bypass assumptions.
3. **SEO agent** — Cluster keywords, fix thin pages, internal links AI hub ↔ tools, sitemap/registry sync script.
4. **Conversion agent** — Pro hub, modal, thank-you flow, one ICP narrative; A/B list (even if manual).
5. **UX polish agent** — One tool at a time: inputs explained, mobile, focus states, errors.
6. **Ops agent** — CI, CF env docs, README accuracy, incident checklist (subscribe 500s, Worker down).
7. **Behavioral UX — perception & meaning** — [Growth.Design](https://growth.design/psychology) phases 1–2: cognitive load, progressive disclosure, mental models, honest framing (`charterfile/psychology-perception-meaning.json`).
8. **Behavioral UX — action & memory** — phases 3–4: feedback, reactance-safe paywalls, peak-end, chunking, exits (`charterfile/psychology-action-memory.json`).
9. **Behavioral ethics — red team** — manipulation/deception/autonomy audit vs privacy copy; Block/Fix/Watch (`charterfile/psychology-ethics-review.json`). Run after conversion changes or **before** merging money-path PRs.

Use **`charterfile/psychology-reference.md`** as the shared cheat sheet. **Ethics:** no fake scarcity/social proof/dark patterns — the ethics charter exists to **catch** drift the build charters might miss.

**Rule:** One agent, one ticket, one week slice — avoids spaghetti diffs.

## Integrating agents (your job as PM)

- Paste **acceptance criteria** from the ticket into the agent prompt.
- Reject scope creep in-session; file new tickets instead.
- After merge: update `metrics-scorecard.md` or move ticket to `done`.

## RACI-ish (lightweight)


| Activity              | Responsible              | Accountable (you) |
| --------------------- | ------------------------ | ----------------- |
| Priority order        | You                      | You               |
| Code merge            | Eng agent                | You               |
| Policy copy (privacy) | You + legal common sense | You               |
| Email campaigns       | You                      | You               |


