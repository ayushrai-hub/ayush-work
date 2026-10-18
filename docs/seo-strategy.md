# SEO Strategy

**Site type:** Personal digital home. Vite + React Router, every public route prerendered at build time.
**Canonical:** `https://www.ayushrai.site` (`person.siteUrl`). The apex 301s to www. `ayush-me.netlify.app` is not the live host.
**Positioning in metadata:** `person.roleTitle` ("AI Engineer & AI Product Builder"), not a generic full-stack portfolio.

Companion docs in `docs/seo/`: `domain-evidence-map.md`, `keyword-and-content-strategy.md`, `measurement-plan.md`, and `agent-readiness-execution-report.md`.

---

## 1. Goals

1. Appear for **name queries** ("Ayush Rai", "Ayush Rai IIT Madras", "Ayush Rai AI engineer").
2. Be understood correctly by link unfurlers (LinkedIn, X, Slack).
3. Make work, products, domains, and About indexable on their substance.
4. No keyword stuffing and no false claims in structured data.

---

## 2. How crawlers get content

| Concern | How it is handled |
| --- | --- |
| Empty SPA shell | `scripts/prerender.mjs` writes static HTML for every route in `src/lib/publicRoutes.ts`, with per-page Helmet title, description, canonical, and Open Graph tags. |
| Unknown URLs | `dist/404.html` with HTTP 404, not the homepage. Host rewrites keep `force` off so static files win. |
| Sitemap | Generated as `dist/sitemap.xml` from `sitemapRoutes()`. There is no second, hand-kept sitemap. |
| Thin or legacy URLs | Client redirects: `/services` → `/contact`, `/certifications` → `/recognition`, `/extracurriculars` → `/leadership`. |
| Phone in schema | `telephone` comes from `person.phone` (published at Ayush's request, 14 October 2026). |
| Agents | Markdown twins, `llms.txt`, and the API; see `AGENTS.md`. Googlebot and browsers keep HTML. |

**Not migrating to Next.js** for SEO.

---

## 3. Indexing rules

| URL | Index? |
| --- | --- |
| Pages in `sitemapRoutes()` | Yes |
| `/design-system` | No (`noindex`, not in the sitemap) |
| Product logs with no entries, unknown detail slugs, Agent view (`?agent=1`) | No (`noindex`) |
| `?audience=` variants | Do not request indexing; canonical points to the base page |

---

## 4. Metadata

**Title pattern:** `{Page} · Ayush Rai`. Default (home and fallback): `Ayush Rai · AI Engineer & AI Product Builder` (`src/constants/seo.ts`).

Descriptions are natural sentences from the page's content. If keywords are listed at all, keep them sparse: name, role, product names. Never "100% success" style claims.

**OG image:** `/IMG_0029.jpeg` (portrait). A designed 1200×630 card with name and role would unfurl better; not made yet.

---

## 5. Structured data (JSON-LD)

Built in `src/lib/structuredData.ts` and shared by `PageSEO`, the product pages, and the Schema Feed (`/feeds/portfolio.jsonl`).

- **Person:** name, URL, email, `telephone`, `jobTitle` from `person.roleTitle`, `sameAs` profiles, `knowsAbout` for published specialties. No street or city address; the public location is "Remote".
- **WebSite** on the homepage, plus an `ItemList` of the case studies shown there.

**Do not include:** AggregateRating, Review, Offer or price, a Service catalog, or unverified awards.

---

## 6. On-page hygiene

- One `<h1>` per route.
- Descriptive titles for work entries.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- Images have human `alt` text.
- A canonical link on every route; non-root canonicals end in a slash.

---

## 7. Content SEO

- Case studies with real problem and approach text beat skill clouds.
- Unverified metrics stay out; they are a reputational risk if challenged (`content-fact-check.md`).
- Name consistency: **Ayush Rai** everywhere.
- Domains that have no evidence (inference, distributed systems) get no URL; see `seo/domain-evidence-map.md`.

---

## 8. Analytics and Search Console

- GA4 and GTM load from `index.html`; Vercel Web Analytics from `src/main.tsx`. Whether each collects correctly is open as issue 19 in `known-issues.md`.
- Search Console: the verification file is `public/google87b9f7dc435c0793.html`. Monthly checks are in `seo/measurement-plan.md`.
- Performance: no current baseline is recorded. Measure LCP, INP, and CLS on the prerendered site before claiming improvements.

---

## 9. Checklist

- [x] Final domain `www.ayushrai.site`, HTTPS, apex 301
- [x] `defaultSEO.url` and OG URLs on the canonical host
- [x] Prerendered HTML for every public route
- [x] Generated sitemap; real 404s
- [x] Legacy routes redirect (client side)
- [ ] Sitemap submitted and coverage checked in Search Console (needs a human sign-in)
- [ ] Social share test (LinkedIn Post Inspector and similar)
- [ ] Designed OG card

---

## 10. Out of scope

- Buying backlinks or directory spam
- Keyword-stuffed titles such as "Top AI Developer in India"
- Indexing empty pages or placeholder slugs
