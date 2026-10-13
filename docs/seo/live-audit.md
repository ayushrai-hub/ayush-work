# Live audit — 11 October 2026

Observed with curl against `https://www.ayushrai.site` (redirects followed, 15s connect timeout, 40s max). Bodies and headers were saved under `/tmp/ayush-seo-audit`, outside this repository. Nothing in this file is inferred from a status code alone.

Production is Netlify (`server: Netlify`). `https://ayushrai.site/` returned **301** to `https://www.ayushrai.site/`.

## What already works

Prerendered HTML routes contain real copy, one `h1`, a description, Open Graph tags, and a canonical link. Titles are present as `<title data-rh="true">…</title>`. Checked examples:

| Request | Final URL | Status | Content-Type | Notes |
| --- | --- | --- | --- | --- |
| `/` | `https://www.ayushrai.site/` | 200 | `text/html` | Prerendered homepage. Title `Ayush Rai`. h1 `Ayush Rai`. Canonical `/`. Person JSON-LD. |
| `/about` | `https://www.ayushrai.site/about/` | 301 then 200 | `text/html` | Title `About · Ayush Rai`. h1 `Ayush Rai`. Canonical without the trailing slash. |
| `/work` | `…/work/` | 301 then 200 | `text/html` | Title `Work · Ayush Rai`. h1 `Index`. |
| `/products` | `…/products/` | 301 then 200 | `text/html` | Distinct description and h1 `Things I build`. |
| `/research` | `…/research/` | 301 then 200 | `text/html` | Distinct. |
| `/writing` | `…/writing/` | 301 then 200 | `text/html` | Distinct. |
| `/contact` | `…/contact/` | 301 then 200 | `text/html` | Distinct. |
| `/developers` | `…/developers/` | 301 then 200 | `text/html` | Real developer notes, not an SDK. |
| `/index.md` | same | 200 | `text/markdown` | 2909 bytes. Matches the public biography. |
| `/about.md`, `/work.md`, `/products.md` | same | 200 | `text/markdown` | Real twins. |
| `/llms.txt` | same | 200 | `text/plain` | 9470 bytes. Identity, page index, API notes. |
| `/llms-full.txt` | same | 200 | `text/plain` | 77202 bytes. Dump of the Markdown twins. |
| `/AGENTS.md`, `/SKILL.md` | same | 200 | `text/markdown` | Real files. |
| `/openapi.json` | same | 200 | `application/json` | OpenAPI 3.1.0, title "Ayush Rai portfolio", paths `/api/search`, `/api/projects`, `/api/v1/projects`, `/api/v1/projects/{slug}`, `/api/v1/compare`. Server URL is the www origin. Parsed with `JSON.parse`. A Spectral-style schema lint was not run; no linter is installed. |
| `/robots.txt` | same | 200 | `text/plain` | See below. |
| `/sitemap.xml` | same | 200 | `application/xml` | 40 `<loc>` values, all `https://www.ayushrai.site…`, with `<lastmod>`. Well-formed enough to extract every loc. URLs have no trailing slash. |

`/robots.txt` body:

```
User-agent: *
Allow: /
Disallow: /design-system

Sitemap: https://www.ayushrai.site/sitemap.xml
```

That does not block Googlebot, Bing, or common AI crawlers. It also does not block CSS or JS. `/design-system` is the only disallow, and it is an internal specimen.

Homepage HTML includes visible work, products, and contact text without executing the module script. It is not an empty `#root`.

## Defects observed

### 1. Unknown URLs return the homepage with HTTP 200

These requests returned **200**, `text/html`, **31449 bytes**, canonical `https://www.ayushrai.site/`, title `Ayush Rai`, h1 `Ayush Rai`, and `robots` index,follow. That is the homepage document, not a 404 and not the resource the path names.

- `/.well-known/api-catalog`
- `/openapi.yaml`
- `/auth.md`
- `/pricing`
- `/pricing.md`
- `/developers/sdk`
- `/ai-engineering`
- `/software-engineering`
- `/software-services`
- `/experience`
- `/open-source`

`/ai-engineering` and the other missing sections were not implementations that failed. They were the soft-404. An API catalog, YAML spec, auth guide, pricing page, and SDK were **not** published. This audit does not add them. The site has no priced product and no published SDK; inventing those URLs would be the defect.

### 2. Canonical URLs disagree with the redirect

`/about` **301**s to `/about/`. The HTML canonical and the sitemap loc are `https://www.ayushrai.site/about` with no slash. Same pattern on `/work`, `/products`, `/research`, `/writing`, `/contact`, and `/developers`.

### 3. Read API returns 502

`GET /api/search?q=open+framework` and `GET /api/v1/projects` both returned **502**, `text/plain`, 546 bytes:

```json
{"errorType":"NetlifyUserError","errorMessage":"Function returned an unsupported value. Accepted types are 'Response' or 'undefined'"}
```

The deployed function returns a `{ statusCode, headers, body }` object. Netlify's current runtime does not accept that. A local change in `src/lib/agent/http.ts` returns a `Response` instead. It was already in the working tree and is kept. It is not what production is running.

### 4. `Accept: text/markdown` on `/` still returns HTML

Request: `Accept: text/markdown` and no `text/html`. Final URL `/`. Status 200. `content-type: text/html`. `vary: Accept-Encoding` only. The Netlify redirect conditions in `netlify.toml` did not negotiate. `/index.md` itself is fine. The stable contract remains the `.md` URL until the edge function in this change is deployed.

`Accept: text/markdown` on `/work/the-open-framework` followed a 301 to the trailing-slash HTML page. It did not return Markdown.

### 5. Homepage hero is invisible without JavaScript

The prerendered homepage sets the intro block to `opacity:0;transform:translateY(12px)`. The text is in the HTML, but a browser with CSS and without the animation leaves it hidden. The local homepage no longer uses that initial hidden state.

### 6. Product log URLs are not separate HTML files

`/products/:slug/log` is a real route and is linked from product pages. It was not in `getRoutes()`, so a direct request fell through to the homepage shell. Logs with entries are now prerendered and added to the sitemap.

## Intentionally absent

Do not treat these as missing features to imitate:

- `/openapi.yaml` — JSON is the published spec.
- `/auth.md`, `/pricing`, `/pricing.md` — no accounts and no public prices.
- `/developers/sdk` — AGENTS.md says an SDK is not published yet.
- `/.well-known/http-message-signatures-directory` — Web Bot Auth keys identify a bot that signs its own outgoing requests. This site runs no such bot, so a key directory would describe nothing.

`/.well-known/api-catalog` was added on 14 October 2026 because the read API and a remote MCP endpoint now exist. It lists only those deployed endpoints.

## Recommendations that this change implements

- Serve a real 404 document with status 404 for unknown paths, instead of the homepage.
- Align canonical URLs and sitemap locs with the trailing-slash redirect.
- Return `Response` from the read API adapter.
- Negotiate Markdown on Netlify with an edge function, because the redirect condition did not run.
- Publish domain pages only where `src/content/` already has evidence. Leave inference and distributed systems as written gaps.
