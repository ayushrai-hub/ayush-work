# OpenMemory Guide

## Overview
Personal portfolio site cloned from [ayushrai-hub/ayush-work](https://github.com/ayushrai-hub/ayush-work). Vite + React + TypeScript + Tailwind + Framer Motion. Deployed historically on Netlify/Vercel. Evolving into a personal digital home with a typed content layer as the single source of truth.

## Architecture
- **Entry:** `src/main.tsx` → `src/App.tsx` (react-router, lazy pages)
- **Shell:** `src/components/site/` — SkipLink, SiteHeader, SiteFooter, SiteLayout, SearchDialog, PageSEO
- **Editorial UI:** `src/components/editorial/` — PageHeader, SectionHeading, Prose, WorkRow, MetaList, EmptyNote
- **Pages:** `src/pages/*` — Home, About, Work (+detail), Products (+detail/+log), Projects, Research (+detail), Writing, Notes, Now, Ideas, Principles, Timeline, Education, Leadership, Recognition, Elsewhere, Contact, Archive, Uses, Resume, DesignSystem, Developers, DomainPage (AI engineering and children, software engineering, software services, experience, open source), NotFound
- **Content layer:** `src/content/` — typed modules (person, now, work, products, projects, research, experience, education, leadership, recognition, ideas, principles, timeline, writing, notes, uses, elsewhere, archive, capabilities, domains, searchIndex). Re-export via `src/content/index.ts`. `domains.ts` is the dossier source for `/ai-engineering` and related routes. Inference and distributed-systems URLs are intentionally absent. Cautious/verified language; vanity metrics and unverified claims go to `needsConfirmation` or are omitted.
- **Styling:** Tailwind (`tailwind.config.js`) + design tokens in `src/index.css` (paper/ink/rule/accent/signal); theme via `ThemeContext` (light-first)
- **Serverless:** Thin Netlify/Vercel adapters under `api/`, with shared contact validation and SendGrid delivery in `src/lib/server/contactEmail.ts`; read-only search and project endpoints remain in `api/search.ts` and `api/projects.ts`. `/api/v1/projects`, `/api/v1/projects/:slug`, and `/api/v1/compare` rewrite onto the projects function
- **Agent surfaces:** `src/lib/agent/` serializes the same content into Markdown twins, `/llms.txt`, `/llms-full.txt`, `/openapi.json`, `/AGENTS.md`, and `/SKILL.md` (Vite plugin emits them and serves them in dev). `Accept: text/markdown` negotiation (twin with `Vary: Accept`, or 404 with `dist/404.md`) is `negotiateMarkdown` in `surfaces.ts`, used by the Vite plugin and root `middleware.ts` on Vercel; `netlify/edge-functions/markdown-negotiation.js` mirrors it in JS. Netlify redirect `Accept` conditions and Vercel rewrites do not negotiate over prerendered HTML. Search is lexical, not semantic. Role view reorders the homepage (`?audience=`). Agent view is `?agent=1`. WebMCP tool `search_portfolio_projects` calls the same search function. MCP tools live in `src/lib/agent/mcpServer.ts`; transports are stdio (`mcp/server.ts`, `npm run mcp`) and stateless Streamable HTTP (`api/mcp.ts` → `src/lib/agent/mcpHttp.ts`). List endpoints use opaque cursors (`src/lib/agent/pagination.ts`, `cursor` in, `nextCursor` out). `/api/v1` versioning and 90-day deprecation policy text lives in `openapi.ts` (`API_VERSIONING_POLICY`) and feeds `/developers` via `developerDocs.ts`. RFC 9727 catalog: `apiCatalog.ts`, emitted as `dist/.well-known/api-catalog`. MCP discovery (SEP-2127): `mcpCard.ts` builds the Server Card (served by the MCP function at `/api/mcp/server-card` with ETag/304; `MCP_SERVER_INFO` is also the runtime serverInfo `site.ayushrai/portfolio`), the AI Catalog `/.well-known/ai-catalog.json`, and a legacy copy at `/.well-known/mcp/server-card.json`. Errors: `apiError.ts` gives every error `{code, message, hint, docs}`; unknown `/api/*` paths return JSON `route_not_found` via `apiRoutes.ts` (`API_ROUTES`, mirrored in the Netlify edge function and test-compared). Rate limit: `rateLimit.ts`, per-instance fixed window 60/60s, draft-11 `RateLimit`/`RateLimit-Policy` headers, 429 + `Retry-After`; REST goes through `agentApiResponse()` in `http.ts`, MCP through `mcpHttp.ts`. OpenAPI types every response (`PublicProject`, `SearchItem`, `ErrorResponse`, 429). `WHEN_TO_USE`/`WHEN_NOT_TO_USE` in `developerDocs.ts` feed `llms.txt` (before the first H2, per llmstxt format) and `/developers`. Unpublished CLI: `packages/cli/bin/ayushrai.mjs` (package `ayushrai`, `private: true` until a license and npm publish are approved). Privacy and contact copy: `src/content/policies.ts` (describes shipped analytics/hosting/SendGrid only)
- **Canonical host:** `https://www.ayushrai.site` (`person.siteUrl`). Apex `ayushrai.site` 301s to www. `ayush-me.netlify.app` is not the live host
- **Tests:** Vitest + Testing Library; legacy UI tests under `src/__tests__/legacy/` (excluded). Playwright e2e

## User Defined Namespaces
- [Leave blank - user populates]

## Components
- `src/content/` — structured content SSOT
- `src/components/site/SiteLayout.tsx` — app chrome (skip link, header, main#main, footer, search)
- `src/components/site/SiteHeader.tsx` — primary + secondary nav, `/` and ⌘K search, quiet theme toggle
- `src/components/site/SearchDialog.tsx` — client search over `searchIndex`
- `src/components/site/PageSEO.tsx` — Helmet title template, OG, Person JSON-LD on home
- `src/components/editorial/*` — shared editorial patterns (list rows, prose, empty notes)
- `src/pages/HomePage.tsx` — narrative home arc; “Go deeper” links About/Work/Timeline/Writing + MyLifeOS. “Things I build” lists `featuredProducts()` only.

## Patterns
- **Content SSOT:** Prefer `import { … } from '../content'` instead of hardcoding copy. Search, Markdown, REST, WebMCP, and MCP must call `src/lib/agent/` rather than a second dataset. Omit phone numbers from public pages and machine output. Keep `needsConfirmation` / withheld award lists out of machine output
- **Flagship products:** `featured` on `src/content/products.ts` orders The Open Framework, AGENYRA, and MedVoice. Stages include `building` and `experimental` via `productStageLabels`. The product page and the `/work/:slug` case study share a slug and say different things. MedVoice has no demo URL until one is verified. AGENYRA waitlist admin and MedVoice demo credentials stay out of public copy. Audit: `docs/flagship-products-audit.md`.
- **Search ranking:** substring match on title, summary, type, and tags; original index order; empty query returns 8, a query returns 12. Do not add a separate score
- **SPA fallback:** do not set Netlify `force` on `/*` → `/index.html`. Static HTML, `.md`, `llms.txt`, and the sitemap must win over the shell
- **Deployment ownership:** Keep host-required `vercel.json`, `netlify.toml`, and public `api/*.ts` entry points at the repository root. Put reusable server-only logic in `src/lib/server/` and deployment notes in `docs/deployment/`
- External links: `target="_blank"` + `rel="noopener noreferrer"`
- **Public safety:** No phone/WhatsApp in UI; research is Note|Investigation|Experiment; inflated leadership claims stay out of grounded pages
- **Public location:** Current place is `person.location` = `Remote` (home, about, footer, SEO). Do not publish a city. Historical school and org places stay (LNCTS Bhopal, past role cities).
- Legacy redirects: `/services` → `/contact`, `/certifications` → `/recognition`, `/extracurriculars` → `/leadership`
- Empty/TODO surfaces use `EmptyNote` pointing at `docs/questions-for-ayush.md`

## Rebuild strategy docs (`docs/`)
Product direction for the site rebuild (Vite + React Router MPA — not Next.js). Editorial magazine × personal archive; evidence over vanity; merge thin pages.

| Doc | Role |
| --- | --- |
| `docs/site-audit.md` | Current stack, routes, content inventory, risks |
| `docs/information-architecture.md` | Target routes, density gates, redirects |
| `docs/content-strategy.md` | Pillars, keep/cut, audiences |
| `docs/content-fact-check.md` | Claim verification log (metrics, awards, PII) |
| `docs/design-system.md` | Visual direction, anti-clichés, motion |
| `docs/seo-strategy.md` | Meta, schema (no phone), SPA mitigations |
| `docs/seo/live-audit.md` | Observed production HTTP audit |
| `docs/seo/domain-evidence-map.md` | Domain pages mapped to existing evidence |
| `docs/seo/keyword-and-content-strategy.md` | Qualitative search intents, no invented volumes |
| `docs/seo/measurement-plan.md` | Search Console and analytics review, no fake metrics |
| `docs/deployment/vercel.md` | Vercel layout, variables, preview checks, and safe rollout |
| `docs/personal-positioning.md` | Positioning narrative and checks |
| `docs/migration-plan.md` | Phased migration on current stack |
| `docs/content-style.md` | Voice, banned hype, copy patterns |
| `docs/questions-for-ayush.md` | Decision blockers for Ayush |

**Positioning:** Public role line is `person.roleTitle`: "AI Engineer & AI Product Builder". It is a self-description, not a ranking. Digital home, not portfolio brochure. Phone/WhatsApp number must not be public. Non-root canonical URLs use a trailing slash. Unknown paths must 404, not reuse the homepage. Netlify read functions must return a Web `Response`. Vercel must not use `trailingSlash: true` (it 308s `/api/*`); an explicit page-only redirect in `vercel.json` adds the slash.
