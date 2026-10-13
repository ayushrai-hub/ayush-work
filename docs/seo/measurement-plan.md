# SEO measurement plan

11 October 2026. This repository does not include Search Console credentials, and this pass did not sign in. No index coverage, click, or ranking numbers are stated here.

## What is already on the site

The live homepage HTML loads Google Tag Manager container `GTM-NJZ5ZBX4` and calls `gtag('config', 'G-VBS0YJ07R8')`. That is Universal-style GA4 configuration in the document, not a proof of filtered traffic or of a privacy review. `public/google87b9f7dc435c0793.html` is a Search Console HTML verification file in the repo. Whether the property is verified and which URLs are indexed has to be checked in the product.

Prefer that existing GA4 property over adding a second analytics script. If the goal is fewer third parties, the decision is to remove or gate these tags, not to add another vendor in the same change.

## Search Console, after deploy

1. Confirm the property is `https://www.ayushrai.site/` (the www host), matching the apex 301.
2. Submit `https://www.ayushrai.site/sitemap.xml` again after this release. Locs will use trailing slashes.
3. Inspect URL for `/`, `/ai-engineering/`, `/ai-engineering/llm-evaluation/`, `/ai-engineering/rlhf/`, `/products/medvoice/`, and `/experience/`.
4. Watch the pages report for "Crawled, currently not indexed" and for soft 404s. Unknown paths should start returning 404 instead of the homepage. That can look like a drop in indexed URLs and is the intended correction.
5. Do not request indexing for `/design-system`, query variants with `?audience=`, or the 404 document.

## What to record each month

| Signal | Where | What "wrong" looks like |
| --- | --- | --- |
| Indexed canonical URLs | Search Console pages | Homepage canonical on a domain URL, or `/about` and `/about/` both indexed |
| Sitemap processing | Sitemaps report | Errors, or discovered URLs that are not the trailing-slash locs |
| Impressions, clicks, CTR, position | Performance, by page and query | A query landing on a page that says the topic is a gap |
| Organic landing pages | GA4, organic | `/` receiving queries that a domain page should answer, after those pages have had time to be crawled |
| Inbound links | Search Console links | Unexpected. Do not buy or generate any. |
| Contact | GA4 event or simply email | The contact page and `mailto:` are the conversion. There is no form goal in this pass. |
| Core Web Vitals | Search Console experience, and a local Lighthouse run when convenient | The hidden-until-JS hero was a CLS/LCP risk. Recheck after deploy. |

## Repeatable review

When content changes, before calling the site done:

1. `npm test` and `npm run build`.
2. Curl the production build for `/`, one domain page, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, a `.md` twin, and a nonsense path. The nonsense path must be 404 once it is on Netlify. `vite preview` does not apply Netlify's 404 redirect or pretty URLs.
3. Confirm titles and descriptions differ across the domain pages (the domain test does this).
4. Confirm new claims were added to `docs/content-fact-check.md` and that phone numbers and withheld award strings are still absent from Markdown.
5. Do not publish a page because a query exists. Publish it when a content record can support it.

## This pass did not prove

- That any URL is indexed.
- That any query ranks.
- That `llms.txt`, JSON-LD, or Markdown twins cause citations.
- Field Core Web Vitals. No Lighthouse score was collected against production in this session.
