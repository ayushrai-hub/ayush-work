# SEO Strategy

**Site type:** Personal digital home (Vite + React Router SPA with multiple routes).  
**Current canonical (historical):** `https://ayush-me.netlify.app` — confirm final domain before launch.  
**Positioning in metadata:** Systems builder across AI, software, products, research — not “generic full-stack portfolio.”

---

## 1. Goals

1. Rank / appear for **name queries** (“Ayush Rai”, “Ayush Rai Bhopal”, “Ayush Rai IIT Madras”).  
2. Be correctly understood by link unfurlers (LinkedIn, X, Slack).  
3. Make **Work** and **About** indexable enough for discovery beyond vanity keywords.  
4. Avoid spammy keyword stuffing and false claim signals in structured data.

---

## 2. Technical constraints (SPA)

Vite + React Router is client-rendered by default:

| Risk | Mitigation |
| --- | --- |
| Crawlers seeing empty shell | Ensure critical meta in `index.html`; per-route meta via existing `SEO` component on navigation; consider prerender (`vite-plugin-ssr` alternatives, `vite-plugin-prerender`, or host prerender) for `/`, `/work`, `/about`, `/connect` |
| Soft 404s on refresh | Host rewrites: all routes → `index.html` |
| Duplicate thin URLs | Merge pages (see IA); 301 legacy routes |
| Phone in schema | **Remove** `telephone` from JSON-LD |

**Not migrating to Next.js** for SEO alone; prerender or SSR-lite later if needed.

---

## 3. Information architecture ↔ SEO

| URL | Index? | Primary intent |
| --- | --- | --- |
| `/` | Yes | Identity + positioning |
| `/work` | Yes | Proof / projects |
| `/work/:slug` | Yes if substantive | Case study |
| `/about` | Yes | Bio / path |
| `/connect` | Yes (or noindex if pure form) | Contact — usually index with thin content OK |
| `/notes` | Yes when content exists | Writing |
| `/elsewhere` | Optional noindex | Link hub |
| Legacy thin routes | Redirect | Equity → new URLs |

---

## 4. Metadata templates

### Defaults (replace `constants/seo.ts`)

**Title pattern:** `Ayush Rai` or `Ayush Rai — {Page}`

| Page | Title | Description (draft) |
| --- | --- | --- |
| Home | Ayush Rai | Ayush Rai builds working systems across AI, software, products, and research — a digital home for selected work and notes. |
| Work | Work — Ayush Rai | Selected products, projects, and research from Ayush Rai. |
| Case | {Title} — Ayush Rai | {1 sentence from case summary} |
| About | About — Ayush Rai | Path, education, and experience — Bhopal / India. |
| Connect | Connect — Ayush Rai | Contact Ayush Rai for collaborations on applied AI and product systems. |

**Keywords:** Prefer natural language in description over keyword lists. If kept, use sparse: `Ayush Rai`, `AI engineer`, `Bhopal`, `IIT Madras`, product names — **not** “100% success portfolio.”

**OG image:** Dedicated 1200×630 editorial card (name + short line) — not a random selfie crop unless designed. Update from `/IMG_0029.jpeg` as sole OG if unstyled.

---

## 5. Structured data (JSON-LD)

**Person** (home / about):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ayush Rai",
  "url": "https://{CANONICAL}/",
  "email": "mailto:ayushrai0211@gmail.com",
  "sameAs": [
    "https://github.com/ayushrai-hub",
    "https://www.linkedin.com/in/ayushrai02"
  ],
  "jobTitle": "AI Engineer",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bhopal",
    "addressCountry": "IN"
  }
}
```

**Do not include:** telephone, fake AggregateRating, Service catalog with prices, unverified awards as `Award` entities until verified.

**CreativeWork** optional per case study when pages are rich enough.

---

## 6. On-page SEO hygiene

- One `<h1>` per route.  
- Descriptive titles for work entries (not “Project 1”).  
- Internal links: Home → Work → Case; About ↔ Connect.  
- `rel="noopener noreferrer"` on external links (already patterned).  
- Image `alt` with human descriptions.  
- Canonical link per route once domain fixed.  
- `robots.txt` + `sitemap.xml` listing real routes only.

---

## 7. Content SEO (substance over tricks)

- Case studies with real problem/approach text outperform skill clouds.  
- Notes (when they exist) can attract long-tail queries.  
- Avoid publishing unverified metrics — they create reputational SEO risk if challenged.  
- Name consistency: **Ayush Rai** everywhere (not fluctuating brand spellings).

---

## 8. Analytics & Search Console

- Keep GA/GTM only if useful; document IDs in env, not in strategy prose.  
- Verify property in Google Search Console on final domain.  
- Track: outbound GitHub/LinkedIn, contact submit, work case opens — not vanity scroll depth alone.  
- Web vitals: removing Three.js/particles should improve LCP/INP — re-baseline after redesign (`MarkdownDocs/performance-baseline.md` can be updated later).

---

## 9. Migration SEO checklist

- [ ] Final domain decided; HTTPS  
- [ ] Update `defaultSEO.url` and OG URLs  
- [ ] Remove phone from schema + pages  
- [ ] Host redirects for `/research`, `/leadership`, `/certifications`, `/services`, `/extracurriculars`  
- [ ] Sitemap submitted  
- [ ] Prerender or confirm crawler rendering for key routes  
- [ ] Social share test (LinkedIn Post Inspector, etc.)

---

## 10. Out of scope

- Buying backlinks / directory spam  
- Keyword-stuffed “Top AI Developer in India” titles  
- Indexing empty Notes or placeholder case slugs
