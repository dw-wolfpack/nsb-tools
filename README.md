# NSB Tools

Static, ultra-fast "tool farm" for creators, writers, and professionals. 17 tools across 5 categories. Pure HTML, CSS, and JavaScript. No build step. Deploys to Cloudflare Pages.

## Local development

```bash
python -m http.server 8000
```

Then open http://localhost:8000/

## Deploy to Cloudflare Pages

1. Connect your repo to Cloudflare Pages.
2. Build settings:
   - Build command: *(leave empty)*
   - Build output directory: `/`
   - Root directory: `/`
3. Deploy.

Domain: tools.nextstepsbeyond.online

## SEO checklist

- Update `sitemap.xml` when adding new tools or pages.
- Keep meta `title` and `description` unique per page.
- Use trailing slashes in all internal links.
- Ensure canonical URLs match sitemap entries.

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
