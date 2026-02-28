# NSB Tools

Static, ultra-fast "tool farm" for creators, writers, and professionals. 17 tools across 5 categories. Pure HTML, CSS, and JavaScript. No build step. Deploys to Cloudflare Pages.

## Local development

```bash
python -m http.server 8000
```

Then open http://localhost:8000/

## Unit tests

One test file per calculator under `tests/`. Requires Node 18+, no external dependencies.

```bash
npm test
```

Uses Node's built-in `node --test` runner. Logic files (browser-style IIFEs) are loaded
via `tests/load-logic.js`, which stubs `globalThis.window.NSB_UTILS` before each import.

## Pre-commit hook (one-time setup per clone)

```bash
bash scripts/setup-githooks.sh
```

Configures `core.hooksPath=.githooks`. The pre-commit hook runs `npm test` and blocks
the commit on any failure.

## Deploy to Cloudflare Pages

1. Connect your repo to Cloudflare Pages.
2. Build settings:
   - Build command: *(leave empty)*
   - Build output directory: `/`
   - Root directory: `/`
3. Deploy.

Domain: tools.nextstepsbeyond.online

## Verifying cache headers (Cloudflare Pages)

After deploy, confirm `_headers` is applied by checking response headers:

```bash
curl -I https://tools.nextstepsbeyond.online/assets/css/styles.css
curl -I https://tools.nextstepsbeyond.online/assets/js/main.js
```

Expected: `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`.

For HTML: `curl -I https://tools.nextstepsbeyond.online/` should show `Cache-Control: public, max-age=300`. For embeds: `/embed/*` uses `max-age=3600`.

See [Cloudflare hardening](docs/cloudflare-hardening/) for WAF and security recommendations (docs only; no config in repo).

## SEO metrics report

Generate a content metrics report (word count, links, thin content flags, broken links):

```bash
npm run seo:metrics
```

Writes `reports/seo-metrics.md` and `reports/seo-metrics.json`. Safe to run locally and in CI.

Link metrics count only **visible** links. Before counting, the script strips elements that are hidden in static HTML:

- Elements with the `hidden` attribute
- Elements with inline `style` containing `display:none` or `visibility:hidden`
- Elements with `aria-hidden="true"`
- Elements with class `visually-hidden` or `sr-only`

Tools marked `isHidden` in `assets/js/registry.js` are also excluded from link counts. The report includes a "Hidden tool links" section when any page links to a hidden tool.

To fail the script when any page contains links to hidden tools (e.g. for CI):

```bash
STRICT_HIDDEN_LINKS=1 npm run seo:metrics
```

### Per-page targets (optional)

Create `scripts/seo-targets.json` to set per-route min word counts and required/optional keywords. See the file for structure. Routes use exact match (e.g. `/ai/toolkit/`). Pages without a route entry use `defaults`.

## SEO checklist

- Update `sitemap.xml` when adding new tools or pages.
- Keep meta `title` and `description` unique per page.
- Use trailing slashes in all internal links.
- Ensure canonical URLs match sitemap entries.
- See [SEO runbook](docs/seo-runbook/) for target keywords, internal linking, backlink playbook, and metrics.

## Structure

- `/` - Home (tool directory, search, recently used)
- `/categories/` - Category listing
- `/categories/{category}/` - Category pages (social, writing, career, business, repurpose)
- `/tools/{slug}/` - Tool pages (17 tools)
- `/about/`, `/privacy/`, `/terms/`, `/changelog/` - System pages
- `/assets/js/registry.js` - Single source of truth for tools and categories

## Tools

| Category | Tools |
|----------|-------|
| Social | Username Generator, Hook Generator, Short-Form Script Writer, Hashtag Generator, Caption Generator, Content Ideas |
| Writing | LinkedIn Post Builder, Newsletter Outline, Title + Headline Generator |
| Career | Resume Bullet Rewriter, STAR Stories, Cold Outreach Email |
| Business | Deal Teaser Analyzer, SBA Payment Estimator, LOI Outline |
| Repurpose | Repurpose Pack, Content Calendar |

## TODOs (future)

- Real login/auth
- Payments for Pro
- Third-party analytics (Plausible/GA) - wiring ready via `window.nsbAnalytics.track()`
- CI to auto-generate sitemap from registry
