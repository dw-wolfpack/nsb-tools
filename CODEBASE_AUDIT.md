# NSB Tools – Codebase Audit for Product Roadmap Planning

---

## 1. Full Tool Inventory

For every tool in `assets/js/registry.js` (TOOLS array). Pro gating, presets adapter, and Export CSV are derived from code; all tools have `isPro: false` in the registry.

| Slug | Display name | Category | Tags | consumesCredit | isPro | Has Pro gating | Has presets adapter | Has Export CSV | One-line description | Input fields | Output type | Re-use pattern |
|------|--------------|----------|------|----------------|-------|----------------|---------------------|----------------|----------------------|---------------|-------------|----------------|
| username-generator | Username Generator | social | social, creator, username, profile | true | false | No (daily limit only) | No | No | Generate platform-safe usernames from niche, tone, keywords, name. | niche, keywords, name, count | Text list | One-shot |
| hook-generator | Hook Generator | social | social, creator, hooks, short-form | true | false | No (daily limit only) | No | No | Generate grouped short-form hooks (curiosity/contrarian/authority/story) by goal + tone. | topic, types, perType | Grouped text | One-shot |
| short-script-writer | Short-Form Script Writer | social | social, creator, script, short-form, video | true | false | No (daily limit only) | No | No | Generate a timed short-form script with beats, shot list, caption. | topic | Structured text (hook, problem, solution, CTA, shot list, caption) | One-shot |
| hashtag-generator | Hashtag Generator | social | social, creator, hashtags, instagram, tiktok | true | false | No (daily limit only) | No | No (UI has export but no requirePro) | Generate hashtag sets (broad/niche/community) from niche, keywords, content type. | niche, keywords, count | Grouped lists | One-shot |
| caption-generator | Caption Generator | social | social, creator, caption, instagram, engagement | true | false | No (daily limit only) | No | No | Generate captions and ethical comment prompts by platform, tone, CTA. | topic, platform | Text (caption + comment prompt) | One-shot |
| content-ideas | Content Ideas Generator | social | social, creator, ideas, content | true | false | No (daily limit only) | No | No | Generate content ideas with angles, hooks, format suggestions. | niche, count | Array of objects (angle, hook, format) | One-shot |
| linkedin-post-builder | LinkedIn Post Builder | writing | writing, linkedin, professional, posts | true | false | No (daily limit only) | No | No | Generate short/medium/long LinkedIn posts and openers by stance, tone. | stance, topic, length, tone, stanceStyle, audience | Object (opener, body, full) | One-shot |
| newsletter-outline | Newsletter Outline Generator | writing | writing, newsletter, email, outline | true | false | No (daily limit only) | No | No | Generate newsletter outline with sections, subject lines, CTAs. | topic | Structured outline | One-shot |
| title-headline-generator | Title + Headline Generator | writing | writing, headline, title, copy | true | false | No (daily limit only) | No | No | Generate headline/title options by style (how-to, list, contrarian, story). | topic, styles | Grouped text | One-shot |
| resume-bullet-rewriter | Resume Bullet Rewriter | career | career, resume, job, bullet | true | false | No (daily limit only) | No | No | Rewrite a resume bullet into stronger variants with metric placeholders. | bullet, count | Text list | One-shot |
| star-stories | Interview Stories (STAR) Generator | career | career, interview, star, stories | true | false | No (daily limit only) | No | No | Turn notes into STAR story drafts (concise + detailed) with follow-up Qs. | notes, format | Structured text | One-shot |
| cold-outreach-email | Cold Outreach Email Draft | career | career, email, outreach, recruiter | true | false | No (daily limit only) | No | No | Draft 2 outreach emails (punchy + formal) for recruiter/hm/broker. | context | Two text variants | One-shot |
| deal-teaser-analyzer | Deal Teaser Analyzer | business | business, deal, teaser, acquisitions | true | false | No (daily limit only) | No | No | Parse pasted teaser text into key fields, red flags, diligence questions. | text | Object (fields, redFlags, diligence) | One-shot |
| sba-payment-estimator | Simple SBA Payment Estimator | business | business, sba, loan, payment, dscr | false | false | No | No | No | Estimate monthly P&I, basic DSCR placeholders, quick scenario toggles. | amount, rate, term, noi | Calculated values + optional DSCR | Recurring |
| loi-outline | Offer / LOI Outline Generator | business | business, loi, offer, acquisitions | true | false | No (daily limit only) | No | No | Generate LOI outline bullets from asset, price, financing structure. | asset, price, financing, count | Bullet list | One-shot |
| repurpose-pack | Repurpose Pack Generator | repurpose | repurpose, content, hooks, scripts | true | false | No (daily limit only) | No | No | Convert source text into hooks, scripts, captions, visual ideas. | source | Object (hooks, script, captions, visuals) | One-shot |
| content-calendar | Content Calendar Generator | repurpose | repurpose, content, calendar, planning | true | false | No (daily limit only) | No | No | Generate 1-week calendar table with post types/angles; export CSV (no Pro gate in code). | niche | Table (day, type, angle) | One-shot |
| freelance-rate-calculator | Freelance Rate Calculator | career | calculator, freelance, pricing | false | false | No | No | No | Calculate hourly, day, project rates from desired income and utilization. | desiredAnnualIncome, expenses, billableHoursPerWeek, vacationWeeks, utilization, bufferPercent | Calculated rates | Recurring |
| project-pricing-calculator | Project Pricing Calculator | career | calculator, freelance, pricing | false | false | No | No | No | Get recommended quote ranges with complexity and risk buffer. | hours, hourlyRate, complexity, bufferPercent, expenses | Quote range (low, target, high) | Recurring |
| salary-vs-freelance-comparator | Salary vs Freelance Comparator | career | calculator, career, freelance | false | false | No | No | No | Compare W2 salary to freelance income and breakeven hourly rate. | salary, benefits, taxPercent, rate, utilization, expenses | Comparators + breakeven | Recurring |
| loan-debt-payoff-calculator | Loan / Debt Payoff Calculator | business | calculator, debt, finance | false | false | Yes (Export CSV, Save/Load preset) | Yes | Yes | Calculate payoff timeline, total interest, savings with extra payments. | principal, interestRate, monthlyPayment, extraPayment | Calculated values + amortization table | Recurring |
| employee-vs-contractor-calculator | Employee vs Contractor Cost Calculator | business | calculator, hiring, finance | false | false | No | No | No | Compare true employee cost to contractor cost and breakeven hours. | salary, benefitsPercent, payrollTaxPercent, overheadPercent, contractorRate, contractorHours | Comparators + breakeven | Recurring |
| break-even-calculator | Break-even Calculator | business | calculator, pricing, break-even | false | false | No | No | No | Calculate break-even units or MRR for service, ecommerce, or SaaS. | mode, fixedCosts, variableCost/price/arpa, margin (SaaS) | Units or MRR | Recurring |
| burn-rate-runway-calculator | Burn Rate / Runway Calculator | business | calculator, startup, runway | false | false | Yes (Export CSV, Save/Load preset) | Yes | Yes | Calculate net burn, runway, 12-month projection. | cashOnHand, monthlyRevenue, monthlyExpenses, revenueGrowthRate | Burn, runway, projection table | Recurring |
| saas-roi-deal-analyzer | SaaS ROI Deal Analyzer | business | calculator, saas, roi, deals | false | false | No | No | No | LTV, CAC payback, ROI for SaaS; sensitivity on CAC, ARPA, churn. | cac, arpa, margin, churn, optional initial customers/months | LTV, payback, ROI, sensitivity | Recurring |

**Notes on table:**
- **Has Pro gating implemented:** Only `loan-debt-payoff-calculator` and `burn-rate-runway-calculator` call `requirePro()` in their tool UI (for Export CSV). Same two tools mount Pro actions (Save/Load preset) which call `requirePro()` in `pro-actions.js`.
- **Has presets adapter:** Only the two tools above have entries in `tool-adapters.js` (keys: loan = principal, interestRate, monthlyPayment, extraPayment; burn = cashOnHand, monthlyRevenue, monthlyExpenses, revenueGrowthRate).
- **Has Export CSV:** Only loan and burn add an Export CSV button and gate it with `requirePro()`.
- **consumesCredit:** 17 tools have `true` (generators/analyzers that call `NSB_CAN_GENERATE(true)` before running). 8 have `false` (calculators that do not consume daily credits).
- **Output type:** “Calculated values” = numbers and optional table; “Text list” / “Grouped text” = copy-paste output; “Structured text” / “Object” = JSON-like or sectioned content.

---

## 2. Pro Infrastructure Audit

**Files that call or depend on `requirePro()`:**
- `assets/js/pro.js` – defines `requirePro(onAllowed)`; if not Pro, calls `openUpgradeModal()` instead of the callback.
- `assets/js/components/pro-actions.js` – calls `window.NSB_PRO.requirePro(function () { promptSavePreset(toolSlug); })` and `window.NSB_PRO.requirePro(function () { openLoadModal(toolSlug); })` for Save preset and Load preset.
- `assets/js/tools/loan-debt-payoff-calculator/ui.js` – calls `window.NSB_PRO.requirePro(function () { ... })` around the Export CSV action.
- `assets/js/tools/burn-rate-runway-calculator/ui.js` – same for Export CSV.

**Files that call `NSB_PRO_ACTIONS.mount()`:**
- `assets/js/tools/loan-debt-payoff-calculator/ui.js` – `window.NSB_PRO_ACTIONS.mount(SLUG)` after output is rendered.
- `assets/js/tools/burn-rate-runway-calculator/ui.js` – same.

**Files that call `mountProSection()`:**
- `assets/js/tools/loan-debt-payoff-calculator/ui.js` – `window.NSB_PRO_ACTIONS.mountProSection(SLUG)`.
- `assets/js/tools/burn-rate-runway-calculator/ui.js` – same.

**Adapters in `tool-adapters.js`:**
- **loan-debt-payoff-calculator:** keys = principal, interestRate, monthlyPayment, extraPayment. toolUrl = /tools/loan-debt-payoff-calculator/.
- **burn-rate-runway-calculator:** keys = cashOnHand, monthlyRevenue, monthlyExpenses, revenueGrowthRate. toolUrl = /tools/burn-rate-runway-calculator/.

**What each adapter saves/loads:**  
Each adapter’s `readInputs()` reads form fields by `name` (the keys above) and returns an object of those keys and string values. `applyInputs(inputs)` sets the same form fields from that object. So the fields listed are exactly what is saved and restored for presets.

**Shared pattern for adding Pro to a new tool:**  
There is no single shared template. To add Pro (presets + Export CSV) to another tool you would:
1. Add an adapter in `assets/js/tool-adapters.js` with `keys` matching the form input names and `toolUrl` for the tool.
2. In the tool’s `ui.js`, after the output area exists: call `NSB_PRO_ACTIONS.mount(toolSlug)` to inject the Save/Load preset row; call `NSB_PRO_ACTIONS.mountProSection(toolSlug)` if the page has `#nsb-pro-section`.
3. Add an Export CSV button in the same UI, with `requirePro()` wrapping the export logic and `NSB_PRO_INLINE_LOCK.show(exportBtn)` when not Pro (and set `exportBtn.setAttribute("data-nsb-lock-context", "export")`).
4. Ensure the tool page HTML includes a Pro section placeholder, e.g. `<section id="nsb-pro-section" ...>` and the script load order includes pro-store, tool-adapters, pro-actions (and pro.js for the modal).

So the pattern is copy-paste from loan or burn UI + add one adapter entry; no abstract “add Pro” helper exists.

---

## 3. SEO Audit Per Tool

Tool pages follow a consistent pattern. Below is the pattern and one full example; then a compact table for all 24 tools.

**Common structure:**  
Each tool has: `<title>{seoTitle}</title>`, `<meta name="description" content="{seoDescription}">`, `<h1>` (often matching registry name or a slight variant), one or two JSON-LD blocks (SoftwareApplication and/or BreadcrumbList), sections “What this tool does”, “When to use it”, “Inputs explained”, “How to use it”, plus optional “Common mistakes”, “Use it with AI”, “Related tools”. Internal links go to category, glossary (e.g. /glossary/#amortization), other tools, and sometimes /ai/toolkit/ or a playbook.

**Example – Loan Debt Payoff Calculator:**
- **Title tag:** Loan Debt Payoff Calculator | NSB Tools
- **Meta description:** Calculate loan payoff timeline, total interest, and extra payment savings. Free business tool.
- **H1:** Loan / Debt Payoff Calculator
- **Structured data:** SoftwareApplication (FinanceApplication), BreadcrumbList (Home > Business / Finance > Loan Debt Payoff Calculator).
- **Word count (body/explainer):** ~400–500 words (What this tool does, When to use it, Inputs explained, How to use it, Common mistakes, Use it with AI, Related tools).
- **Internal links:** /glossary/#amortization, /glossary/#principal, /glossary/#interest-rate, /categories/business/, /tools/sba-payment-estimator/, /tools/break-even-calculator/, /tools/burn-rate-runway-calculator/, /ai/toolkit/, /ai/playbooks/founder-ops-ai-workflow/.
- **How to use / explainer:** Yes – “How to use it” and “Inputs explained” sections.

**All tools (title, meta description, H1, JSON-LD, explainer):**

| Slug | Title tag | Meta description | H1 | JSON-LD | Dedicated how-to/explainer |
|------|-----------|------------------|-----|---------|----------------------------|
| username-generator | Username Generator \| NSB Tools | Generate platform-safe usernames... Free tool for social profiles. | Username Generator | SoftwareApplication, BreadcrumbList | Yes (What/When/Inputs/How/FAQ) |
| hook-generator | Hook Generator \| NSB Tools | Generate short-form hooks in curiosity... Free creator tool. | Hook Generator | SoftwareApplication, BreadcrumbList | Yes |
| short-script-writer | Short-Form Script Writer \| NSB Tools | Generate timed short-form scripts... Free video content tool. | Short-Form Script Writer | SoftwareApplication, BreadcrumbList | Yes |
| hashtag-generator | Hashtag Generator \| NSB Tools | Generate hashtag sets for broad, niche... Free social media tool. | Hashtag Generator | SoftwareApplication, BreadcrumbList | Yes |
| caption-generator | Caption Generator \| NSB Tools | Generate captions and ethical comment prompts... Free creator tool. | Caption Generator | SoftwareApplication, BreadcrumbList | Yes |
| content-ideas | Content Ideas Generator \| NSB Tools | Generate content ideas with angles... Free creator tool. | Content Ideas Generator | SoftwareApplication, BreadcrumbList | Yes |
| linkedin-post-builder | LinkedIn Post Builder \| NSB Tools | Generate LinkedIn posts (short, medium, long)... Free professional writing tool. | LinkedIn Post Builder | SoftwareApplication, BreadcrumbList | Yes |
| newsletter-outline | Newsletter Outline Generator \| NSB Tools | Generate newsletter outlines... Free writing tool. | Newsletter Outline Generator | SoftwareApplication, BreadcrumbList | Yes |
| title-headline-generator | Title + Headline Generator \| NSB Tools | Generate headlines grouped by style... Free copywriting tool. | Title + Headline Generator | SoftwareApplication, BreadcrumbList | Yes |
| resume-bullet-rewriter | Resume Bullet Rewriter \| NSB Tools | Rewrite resume bullets into stronger variants... Free career tool. | Resume Bullet Rewriter | SoftwareApplication, BreadcrumbList | Yes |
| star-stories | Interview Stories (STAR) Generator \| NSB Tools | Turn notes into STAR interview story drafts... Free career tool. | Interview Stories (STAR) Generator | SoftwareApplication, BreadcrumbList | Yes |
| cold-outreach-email | Cold Outreach Email Draft \| NSB Tools | Draft punchy and formal cold outreach emails... Free career tool. | Cold Outreach Email Draft | SoftwareApplication, BreadcrumbList | Yes |
| deal-teaser-analyzer | Deal Teaser Analyzer \| NSB Tools | Parse deal teaser text into key fields... Free business tool. | Deal Teaser Analyzer | SoftwareApplication, BreadcrumbList | Yes |
| sba-payment-estimator | Simple SBA Payment Estimator \| NSB Tools | Estimate monthly SBA loan payments... Free business tool. | Simple SBA Payment Estimator | SoftwareApplication, BreadcrumbList | Yes |
| loi-outline | Offer / LOI Outline Generator \| NSB Tools | Generate LOI outline bullets... Free business tool. | Offer / LOI Outline Generator | SoftwareApplication, BreadcrumbList | Yes |
| repurpose-pack | Repurpose Pack Generator \| NSB Tools | Convert source text into hooks, scripts... Free content repurposing tool. | Repurpose Pack Generator | SoftwareApplication, BreadcrumbList | Yes |
| content-calendar | Content Calendar Generator \| NSB Tools | Generate a 1-week content calendar... Export to CSV. Free tool. | Content Calendar Generator | SoftwareApplication, BreadcrumbList | Yes |
| freelance-rate-calculator | Freelance Rate Calculator \| NSB Tools | Calculate freelance hourly, day, and project rates... Free career tool. | Freelance Rate Calculator | SoftwareApplication, BreadcrumbList | Yes |
| project-pricing-calculator | Project Pricing Calculator \| NSB Tools | Calculate recommended project quotes... Free freelance tool. | Project Pricing Calculator | SoftwareApplication, BreadcrumbList | Yes |
| salary-vs-freelance-comparator | Salary vs Freelance Comparator \| NSB Tools | Compare W2 salary to freelance income... Free career calculator. | Salary vs Freelance Comparator | SoftwareApplication, BreadcrumbList | Yes |
| loan-debt-payoff-calculator | Loan Debt Payoff Calculator \| NSB Tools | Calculate loan payoff timeline... Free business tool. | Loan / Debt Payoff Calculator | SoftwareApplication, BreadcrumbList | Yes |
| employee-vs-contractor-calculator | Employee vs Contractor Cost Calculator \| NSB Tools | Compare true employee cost to contractor cost... Free hiring calculator. | Employee vs Contractor Cost Calculator | SoftwareApplication, BreadcrumbList | Yes |
| break-even-calculator | Break-even Calculator \| NSB Tools | Calculate break-even units or MRR... Free business tool. | Break-even Calculator | SoftwareApplication, BreadcrumbList | Yes |
| burn-rate-runway-calculator | Burn Rate Runway Calculator \| NSB Tools | Calculate burn rate, runway, and 12-month cash projection. Free startup tool. | Burn Rate / Runway Calculator | SoftwareApplication, BreadcrumbList | Yes |
| saas-roi-deal-analyzer | SaaS ROI Deal Analyzer \| NSB Tools | Calculate LTV, CAC payback, and ROI for SaaS... Free deal calculator. | SaaS ROI Deal Analyzer | SoftwareApplication, BreadcrumbList | Yes |

All tool index.html pages use the same pattern: title and meta match or closely match registry seoTitle/seoDescription; H1 matches or slightly varies from registry name (e.g. “Loan / Debt Payoff Calculator” vs “Loan Debt Payoff Calculator”). Every tool has a dedicated “How to use it” and “Inputs explained” (or equivalent) via the shared tool-page-sections pattern and TOOL_PAGE_CONTENT in the registry.

---

## 4. Content and Glossary

**Glossary terms (from `assets/js/glossary.js`):**  
cac, ltv, arpa, gross-margin, churn, payback, roi, utilization, buffer, fixed-costs, variable-cost, contribution-margin, break-even, burn-rate, runway, principal, interest-rate, amortization, benefits-load, payroll-tax, overhead, deposit, ats, rag, llm, hallucination, sop, mrr, sla, prompt-injection, chunking, sso, rbac.

**AI checklist/playbook pages under /ai/:**  
- /ai/ – AI Hub index  
- /ai/toolkit/ – AI Toolkit  
- /ai/checklists/ – Checklists index  
- /ai/checklists/llm-safety-review/  
- /ai/checklists/ai-meeting-notes-workflow/  
- /ai/checklists/vendor-eval-scorecard/  
- /ai/checklists/resume-ats-checklist/  
- /ai/playbooks/ – Playbooks index  
- /ai/playbooks/rag-readiness-checklist/  
- /ai/playbooks/small-business-ai-adoption/  
- /ai/playbooks/job-search-ai-workflow/  
- /ai/playbooks/founder-ops-ai-workflow/  

**Pages under /updates/ and /changelog/:**  
- /updates/ – Single page: “Get updates” with email signup form (POST /api/subscribe), no sub-pages.  
- /changelog/ – Single page: “Changelog” with dated sections (e.g. 2026-03, 2025-02, 2025-01), no sub-pages.

---

## 5. Tech Debt and Inconsistencies

**Tools in registry with no corresponding tools/<slug>/index.html:**  
None. The test “routes: every tool has a corresponding index.html on disk” asserts every `R.TOOLS` path maps to a file; all 24 tools have a matching index.html (e.g. tools/username-generator/index.html).

**Tools with missing or empty meta description:**  
None. Every tool in the registry has `seoDescription` and the generated tool pages use it in `<meta name="description">`.

**Tools where H1 does not match registry display name:**  
Minor wording differences only (e.g. “Loan / Debt Payoff Calculator” vs “Loan / Debt Payoff Calculator” in registry name “Loan / Debt Payoff Calculator”). No tool has a completely different or generic H1.

**Tools with title tag missing or generic:**  
None. All tool pages use a title of the form “{Name} | NSB Tools” from registry seoTitle.

**Broken internal links:**  
Not fully re-verified in this audit. The SEO metrics script and tests (e.g. seo-audit, routes-exist) run in CI; reports mention “0 broken links” in the last run. Any new link added in content should be validated by the existing link-check logic.

**Tools with consumesCredit: true but no daily limit UI shown:**  
All 17 tools with `consumesCredit: true` call `NSB_CAN_GENERATE(true)` (or equivalent) before generating; when the limit is exceeded they call `NSB_OPEN_UPGRADE()` (or equivalent), which opens the upgrade modal. There is no separate “daily limit UI” (e.g. “3/20 left today”) on the page; the only feedback is the modal when the user hits the limit. So behavior is consistent; the “gap” is that the user does not see remaining count until they hit the limit.

---

## 6. Daily Limit / Credit System

**How NSB_CAN_GENERATE works:**  
In `assets/js/main.js`, `canGenerate(consumesCredit)` returns true if: (1) the tool does not consume a credit (`!consumesCredit`), or (2) the user is Pro (`checkPro()`), or (3) the current day’s count is below `DAILY_LIMIT`. Otherwise it returns false. The day key is `nsb_gens_YYYY-MM-DD` in localStorage. When a tool that consumes a credit runs, it should call `NSB_INCREMENT_GEN` to increment that day’s count (and the tool must have called `NSB_CAN_GENERATE(true)` before running; if false, the tool opens the upgrade modal and does not run or increment).

**Current free limit per day:**  
`DAILY_LIMIT = 20` in main.js.

**Which tools enforce it and which don’t:**  
- Enforce (consumesCredit: true, call NSB_CAN_GENERATE before generate): username-generator, hook-generator, short-script-writer, hashtag-generator, caption-generator, content-ideas, linkedin-post-builder, newsletter-outline, title-headline-generator, resume-bullet-rewriter, star-stories, cold-outreach-email, deal-teaser-analyzer, loi-outline, repurpose-pack, content-calendar.  
- Do not enforce (consumesCredit: false): sba-payment-estimator, freelance-rate-calculator, project-pricing-calculator, salary-vs-freelance-comparator, loan-debt-payoff-calculator, employee-vs-contractor-calculator, break-even-calculator, burn-rate-runway-calculator, saas-roi-deal-analyzer.

**What happens when the limit is hit:**  
The tool’s generate handler calls `NSB_CAN_GENERATE(true)`; it returns false. The tool then calls `window.NSB_OPEN_UPGRADE()` (or equivalent) and returns without running or incrementing. The user sees the Pro upgrade modal (or the fallback “Pro is coming soon” modal if pro.js is not loaded).

**Where the limit is stored:**  
localStorage, key `nsb_gens_YYYY-MM-DD`, value string number (e.g. "5").

**Can it be reset by clearing localStorage?**  
Yes. Clearing localStorage for the origin removes the day key and any `nsb_pro` / `nsb_pro_email`; the next generate will see count 0 and allow up to 20 again (and Pro status would be lost unless the user logs in again).

---

## 7. Email / Mailchimp Integration

**Data sent to Mailchimp on subscribe:**  
- Email (required), normalized and validated.  
- First name (optional), max 80 chars, trimmed.

Sent via `functions/api/subscribe.js`: POST to Mailchimp API to create or update the member (PUT list member by subscriber hash). Merge fields: FNAME = firstName or "".

**Tags applied:**  
Single tag: `nsb-tools` (status: active). Applied in a separate POST to the member’s tags resource after the put.

**Segmentation by tool category or referrer:**  
No. The API does not receive or use referrer, UTM, or category; only email and optional firstName. No segmentation is applied in code.

**Subscribe entry points on the site:**  
- /updates/ – Main form: “Get updates” with email and optional first name; onSubmit POSTs to /api/subscribe.  
- Banner link “Get updates” on every page points to /updates/; it does not open a form elsewhere.  
So there is effectively one subscribe entry point: the form on /updates/.

**Double opt-in:**  
Controlled by env: `MAILCHIMP_DOUBLE_OPTIN`. In `functions/_lib/subscribe.js`, `getDoubleOptInStatus(envValue)` returns "pending" if env is "true" or true, else "subscribed". So double opt-in is configurable via Cloudflare env (e.g. .dev.vars or Pages env); it is not hardcoded.

---

## 8. Performance and Bundle

**Approximate page weight of a typical tool page:**  
Not measured in this audit. A typical tool page includes: one CSS file (styles.css), multiple JS files (utils, registry, header, search-autocomplete, search-suggest, footer, modal, toast, main, plus tool-specific logic and optionally csv, pro, pro-store, tool-adapters, pro-actions, share-embed, tool-page-sections, related-guides). No formal bundle size or total weight was captured here.

**Large dependencies loaded on every page:**  
Registry and header/search/footer/modal/toast/main are loaded on every page that uses the standard layout. Scripts are deferred. No heavy third-party SDK (e.g. full analytics or chat) is loaded. Wrangler/miniflare and node_modules are dev/build only, not served to the client.

**Lazy loading:**  
- main.js dynamically loads csv.js and then pro-copy.js and pro.js only when needed (no script[data-nsb="csv"] or NSB_PRO yet).  
- On /tools/ and /ai/, main.js dynamically loads pro-cta.js and pro-inline-lock.js for the bottom strip and inline lock.  
So some scripts are lazy-loaded; the rest are included via script tags and load with the page.

**Cloudflare caching (from _headers):**  
- /assets/*: Cache-Control: public, max-age=31536000, immutable  
- /embed/*: Cache-Control: public, max-age=3600  
- /*: Cache-Control: public, max-age=300  

HTML and non-asset paths are cached for 5 minutes; assets for 1 year; embeds for 1 hour.

---

## 9. Missing Obvious Tools

**From glossary `usedIn` and internal links that point to paths not in the tool registry:**  
- Glossary terms reference /ai/... and /tools/... only. All /tools/... links in the glossary and in TOOL_PAGE_CONTENT point to existing tools.  
- “Related tools” on each tool page are from the registry’s relatedSlugs; no broken or “coming soon” tool slugs were found.  
- Some AI playbooks reference concepts (e.g. MRR, SOP) that are explained in the glossary and used in existing tools (e.g. break-even, burn-rate); no missing *tool* was inferred from that.

**Potential gaps (reasonable additions, not necessarily linked as missing):**  
- No dedicated “Amortization calculator” or “Mortgage calculator” beyond the existing loan payoff tool.  
- No “Content repurposing” or “Clip generator” as a separate tool (repurpose-pack and short-script-writer cover adjacent use cases).  
- No “Invoice template” or “Contract rate calculator” in the registry, though freelance/project tools exist.  
- No “DSCR calculator” as a standalone (SBA tool has DSCR placeholder).  

Suggested slugs if added: e.g. `dscr-calculator`, `invoice-template`, `mortgage-calculator` (only if differentiating from loan-debt-payoff-calculator). These are product ideas, not references to broken or missing links in the current codebase.

---

## 10. Current Conversion Funnel Gaps

**Where does a user land from Google?**  
Typically a tool page (e.g. /tools/loan-debt-payoff-calculator/) or the homepage, category page, or /updates/. Depends on which URLs are indexed and rank.

**Path from landing to seeing the Pro modal:**  
- **Non-Pro, tool with consumesCredit:** User uses a generator tool; on the 21st run in a calendar day, `NSB_CAN_GENERATE(true)` is false and the tool calls `NSB_OPEN_UPGRADE()` → modal opens.  
- **Non-Pro, tool with Pro features (loan/burn):** User clicks “Export CSV” or “Save preset” or “Load preset” → `requirePro()` runs → modal opens.  
- **Any page:** User clicks header “Upgrade” or bottom-strip “Upgrade” or “Log in” → modal opens.  
- **Scenario save (if used):** scenario-builder.js can call `NSB_OPEN_UPGRADE` when save fails (e.g. over limit).  

So the modal is triggered by: (1) daily limit hit on a credit-consuming tool, (2) Export CSV / Save preset / Load preset on loan or burn, (3) header or bottom-strip Upgrade/Log in, (4) scenario save path when upgrade is needed.

**Path from Pro modal to Stripe checkout:**  
User clicks “Upgrade ($X/mo)” in the modal. pro.js reads `window.NSB_CONFIG.PRO_CHECKOUT_URL`; if set, it opens that URL in a new tab (Stripe Payment Link). If not set, a toast “Checkout not configured.” is shown. So the path is one click from modal to Stripe (or to a dead end if CHECKOUT_PROD/CHECKOUT_DEV is empty).

**After payment, exact activation flow:**  
- Stripe sends a webhook to the license worker (not in this repo); the worker marks the customer email as licensed.  
- User returns to the site and clicks “Log in” (or “I already paid”), enters the same email, clicks “Unlock Pro.”  
- Front end calls the license worker’s /verify?email=... endpoint. If the worker returns active: true, pro.js calls setPro(true, email), shows “Pro unlocked,” closes the modal, and dispatches `nsb:pro-changed`.  
- setPro stores nsb_pro and nsb_pro_email in localStorage and dispatches the event; the header re-renders (Pro pill), and any bottom strip or inline lock banners listening for nsb:pro-changed remove themselves.  
So activation is: pay on Stripe → webhook updates license backend → user enters email in modal → verify → setPro → UI updates. There is no automatic “already paid” detection; the user must use “Log in” and the same email.

**Dead ends where a paid user could get stuck:**  
- If the user pays but never clicks “Log in” and enters their email, they remain non-Pro in the app until they do. No persistent “post-purchase” page or auto-verify from Stripe session.  
- If the license worker is down or returns an error on /verify, the user sees an error message and stays non-Pro until the worker is fixed or they retry.  
- If the user uses a different email in the modal than at checkout, verify will return active: false and they will see “No active Pro found for that email.”  
- If CHECKOUT_PROD is empty and the user is on production, clicking Upgrade shows “Checkout not configured.” and they cannot reach Stripe from that button.

---

*End of codebase audit.*
