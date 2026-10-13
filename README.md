# Ayush Rai, digital home

Personal website for **Ayush Rai** at [www.ayushrai.site](https://www.ayushrai.site): a structured archive of work, products, research, ideas, and how he thinks. The same content is published three ways: human HTML pages, Markdown twins plus a read-only API for agents, and an MCP server.

Every public fact lives in `src/content/` (TypeScript modules). Edit those files and the pages, Markdown, search, API, and MCP tools all follow. Do not add a second biography anywhere else.

## Stack

- Vite 7 + React 18 + TypeScript, React Router v7 (lazy routes)
- Tailwind CSS with editorial tokens
- react-helmet-async for per-page SEO and JSON-LD
- Build-time prerender of every public route (`scripts/prerender.mjs`)
- Serverless functions in `api/` that run on Netlify and Vercel
- `@modelcontextprotocol/sdk` for the MCP server
- Vitest + Testing Library, Playwright (Chromium)

Node `^20.19.0 || >=22.12.0` (see `engines` in `package.json`). CI and Netlify use Node 22.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173, includes the agent API and Markdown twins
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server. `src/lib/agent/vitePlugin.ts` also serves `/api/*`, `.md` twins, `llms.txt`, and `.well-known` files. |
| `npm run build` | Client build, SSR build of `src/entry-server.tsx`, then `scripts/prerender.mjs` writes `dist/<route>/index.html`, `dist/404.html`, and `dist/sitemap.xml`. |
| `npm run preview` | Serves `dist/` locally. |
| `npm run lint` | ESLint over the whole repo (`eslint.config.js`). |
| `npm run typecheck` | `tsc -b` over the app and Node project references. |
| `npm test` | Vitest in watch mode. `npx vitest run` for a single pass. |
| `npm run test:coverage` | Vitest with V8 coverage. |
| `npm run test:e2e` | Playwright against the dev server (reuses one already on port 5173 outside CI). Run `npx playwright install chromium` once. |
| `npm run mcp` | The MCP server over stdio (`mcp/server.ts`). |
| `npm run netlify:dev` | Netlify CLI dev, needed to exercise `/api/send-email` locally. |

## How the code is organised

| Path | Role |
| --- | --- |
| `src/content/` | Single source of truth for all public facts. `types.ts` documents every field. |
| `src/pages/` | One component per route, lazy-loaded from `src/App.tsx`. |
| `src/components/site/` | Live layout: header, footer, search dialog, SEO, agent view, role selector, WebMCP registration. |
| `src/components/editorial/` | Small presentational building blocks used by the pages. |
| `src/lib/agent/` | Agent layer: Markdown twins, lexical search, REST dispatch, JSON errors, rate limits, pagination, OpenAPI, API catalog, MCP server and Server Card, Markdown negotiation, Vite plugin. |
| `src/lib/server/` | Host-independent server logic (contact email via SendGrid). |
| `src/lib/publicRoutes.ts` | The list of routes to prerender and to put in the sitemap. |
| `api/` | Thin host adapters: `search.ts`, `projects.ts`, `mcp.ts`, `send-email.ts`. |
| `middleware.ts` | Vercel Routing Middleware: Markdown negotiation and JSON 404 for unknown `/api/*`. |
| `netlify/edge-functions/` | The same negotiation for Netlify, in plain JS. |
| `mcp/server.ts` | Stdio MCP entry point. |
| `packages/cli/` | Zero-dependency CLI over the v1 API. Not published to npm. |
| `scripts/prerender.mjs` | Prerender and sitemap step of the build. |
| `e2e/` | Playwright specs. |
| `src/__tests__/` | Vitest suites. `legacy/` holds tests for the old SPA; they are excluded from the run. |

Every source file starts with a header comment that says what the module is for, how it works, and what it connects to, and every function and component has a short doc comment. Keep those accurate when you change code.

### Legacy code

The previous single-page portfolio's components are still in the repo (top-level `src/components/*.tsx`, `src/components/{layout,backgrounds,ui,pages}/`, and a few `src/lib` helpers). They are not routed or imported by the live site, are excluded from `tsconfig.app.json`, and each file's header says so. Some still contain a phone number and withheld claims, which is why they must never be wired back in without review. The old site is also preserved on branch [`archive/portfolio-spa-2026`](https://github.com/ayushrai-hub/ayush-work/tree/archive/portfolio-spa-2026) and tag `legacy-portfolio-spa` ([`docs/preserving-old-site.md`](docs/preserving-old-site.md)).

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Editorial home (`?audience=` reorders sections for a reader role) |
| `/about`, `/education`, `/leadership`, `/recognition`, `/timeline` | Person and path |
| `/work`, `/work/:slug` | Selected work and case studies |
| `/products`, `/products/:slug`, `/products/:slug/log` | Products and build logs |
| `/projects`, `/research`, `/research/:slug` | Projects and investigations |
| `/writing`, `/writing/:slug`, `/notes`, `/notes/:slug` | Publication surface |
| `/ai-engineering`, `/software-engineering`, `/software-services`, `/experience`, `/open-source` (and sub-pages) | Evidence dossiers from `src/content/domains.ts` |
| `/now`, `/ideas`, `/principles`, `/uses`, `/archive`, `/resume` | Status, thinking, tools |
| `/elsewhere`, `/contact`, `/privacy` | Profiles (no phone), contact form, privacy |
| `/developers` | Public guide to Markdown, the API, and MCP |
| `/design-system` | Internal tokens (prerendered, `noindex`, not in the sitemap) |

Client-side redirects for old URLs: `/services` → `/contact`, `/certifications` → `/recognition`, `/extracurriculars` → `/leadership`. Any path with `?agent=1` shows that page's Markdown ("Agent view").

## Agent-readable surfaces

- Markdown twin for every page: append `.md` (for example `/work/the-open-framework.md`, `/index.md`), or send `Accept: text/markdown` without `text/html`.
- `/llms.txt` (index) and `/llms-full.txt` (everything in one file).
- REST: `GET /api/v1/search`, `/api/v1/projects`, `/api/v1/projects/{slug}`, `/api/v1/compare`. JSON errors with hints, cursor pagination, 60 requests per minute per instance with draft-11 `RateLimit` headers.
- `/openapi.json`, `/.well-known/api-catalog` (RFC 9727), `/AGENTS.md`, `/SKILL.md`.
- MCP: `POST /api/mcp` (stateless Streamable HTTP) or `npm run mcp` (stdio). Server Card at `/api/mcp/server-card`, listed in `/.well-known/ai-catalog.json`.
- WebMCP tool `search_portfolio_projects` in browsers that expose `document.modelContext`.

Endpoint details: [`docs/API_ENDPOINTS.md`](docs/API_ENDPOINTS.md). Agent instructions: [`AGENTS.md`](AGENTS.md).

## Testing and CI

- `npx vitest run`: unit and component tests in `src/__tests__/` (agent surfaces, API errors and rate limits, MCP, contact email, domain pages, product pages, analytics, WebMCP, app shell).
- `npm run test:e2e`: `e2e/site.spec.ts` (navigation, contact form validation, privacy, 404, skip link, mobile menu, external links) and `e2e/agent-readiness.spec.ts` (role view, agent view, Markdown and search responses).
- `.github/workflows/tests.yml` runs on pushes and pull requests to `main`: `npm ci`, lint, typecheck, coverage, build, Playwright, and uploads the coverage and Playwright reports. There is no coverage threshold.

## Deployment

- **Production** is `main`. Merging a pull request into `main` triggers both hosts.
- **Netlify** serves `www.ayushrai.site` today: `netlify.toml` (Node 22, `dist`, functions in `api/`, edge function for Markdown negotiation).
- **Vercel** builds the same repository through its Git integration: `vercel.json` plus `middleware.ts`. See [`docs/deployment/vercel.md`](docs/deployment/vercel.md).
- Static HTML exists for every known route; unknown routes get `dist/404.html` with HTTP 404. Host rewrites keep `force` off so prerendered files win.
- Environment variables are listed in `.env.example` (names and placeholders only). Only `/api/send-email` needs any.

## Content and strategy docs

In `docs/`: `site-audit.md`, `personal-positioning.md`, `information-architecture.md`, `content-fact-check.md` (claims still needing confirmation), `questions-for-ayush.md`, `design-system.md`, `content-style.md`, `seo-strategy.md`, `seo/` (evidence map, keyword strategy, live audit, measurement plan), `agent-readiness-audit.md`, `agent-readiness-report.md`, `migration-plan.md`.

## Privacy

Public pages and machine-readable output never include phone numbers. Unconfirmed awards and leadership claims stay in the `*NeedsConfirmation` lists in `src/content/` and are not published. Contact is by email or Calendly.

## Design direction

Warm paper background, near-black ink, deep green accent, Source Serif 4 + Source Sans 3. Evidence over adjectives. No particle fields, vanity metrics, or title-stacking carousels.
