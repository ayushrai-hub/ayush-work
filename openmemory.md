# OpenMemory Guide

## Overview
Personal portfolio site cloned from [ayushrai-hub/ayush-work](https://github.com/ayushrai-hub/ayush-work). Vite 7 + React 18 + TypeScript + Tailwind (Framer Motion only in legacy components). Production: Netlify serves www.ayushrai.site; Vercel also deploys `main` through its GitHub integration. Deploy = merge a PR into `main`. Evolving into a personal digital home with a typed content layer as the single source of truth.

## Architecture
- **Entry:** `src/main.tsx` → `src/App.tsx` (react-router, lazy pages)
- **Shell:** `src/components/site/` — SkipLink, SiteHeader, SiteFooter, SiteLayout, SearchDialog, PageSEO
- **Editorial UI:** `src/components/editorial/` — PageHeader, SectionHeading, Prose, WorkRow, MetaList, EmptyNote
- **Pages:** `src/pages/*` — Home, About, Work (+detail), Products (+detail/+log), Projects, Research (+detail), Writing, Notes, Now, Ideas, Principles, Timeline, Education, Leadership, Recognition, Elsewhere, Contact, Archive, Uses, Resume, DesignSystem, Developers, DomainPage (AI engineering and children, software engineering, software services, experience, open source), NotFound
- **Content layer:** `src/content/` — typed modules (person, now, work, products, projects, research, experience, education, leadership, recognition, ideas, principles, timeline, writing, notes, uses, elsewhere, archive, capabilities, domains, searchIndex). Re-export via `src/content/index.ts`. `domains.ts` is the dossier source for `/ai-engineering` and related routes. Inference and distributed-systems URLs are intentionally absent. Cautious/verified language; vanity metrics and unverified claims go to `needsConfirmation` or are omitted.
- **Styling:** Tailwind (`tailwind.config.js`) + design tokens in `src/index.css` (paper/ink/rule/accent/signal); theme via `ThemeContext` (light-first)
- **Serverless:** Thin Netlify/Vercel adapters under `api/`, with shared contact validation and SendGrid delivery in `src/lib/server/contactEmail.ts`; read-only search and project endpoints remain in `api/search.ts` and `api/projects.ts`. `/api/v1/projects`, `/api/v1/projects/:slug`, and `/api/v1/compare` rewrite onto the projects function
- **Agent surfaces:** `src/lib/agent/` serializes Markdown twins (YAML frontmatter: title/description/canonical/last-updated), `/llms.txt`, `/developers/llms.txt`, `/llms-full.txt`, `/openapi.json`, `/auth.md`, `/agent-mode.json`, `/AGENTS.md`, `/SKILL.md`. PageSEO advertises `rel="alternate" type="text/markdown"`. Negotiation via `negotiateMarkdown` (Vite plugin, Vercel `middleware.ts`, Netlify edge); known agent bot UAs get Markdown when Accept does not prefer HTML. Search is lexical. Human Markdown view `?agent=1`; machine JSON `?mode=agent`. WebMCP: `/webmcp.js` (`search_projects`, `search_articles`, `get_project`, `get_profile`, `find_developer_docs`) + React fallback. MCP: `mcpServer.ts` / Streamable HTTP with `instructions` on initialize. NLWeb-shaped `/ask` (also in OpenAPI). ARD `/.well-known/ard.json` (canonical) + AI Catalog legacy. No OAuth; no A2A card. Audit: `docs/agent-readiness-audit.md`. Orank notes: `docs/seo/orank-*.md`. Archive: `docs/archive/markdown-docs/`.
- **Canonical host:** `https://www.ayushrai.site` (`person.siteUrl`). Apex `ayushrai.site` 301s to www. `ayush-me.netlify.app` is not the live host
- **Tests:** Vitest + Testing Library (`npx vitest run`); legacy UI tests under `src/__tests__/legacy/` are excluded from Vitest and their imports do not resolve. Playwright e2e in `e2e/site.spec.ts` and `e2e/agent-readiness.spec.ts` (Chromium; reuses a dev server on 5173 outside CI). Key guards: `domainSurfaces.test.tsx` asserts every Markdown twin has a prerendered HTML route and every /timeline link lands on a prerendered page
- **CI:** `.github/workflows/tests.yml` on push/PR to `main`, Node 22: `npm ci`, lint, typecheck, `test:coverage` (no threshold), build, Playwright. Netlify `NODE_VERSION = "22"`. Generated `coverage/`, `playwright-report/`, `test-results/` are gitignored
- **Local Node:** use arm64 Node from nvm (`$HOME/.nvm/versions/node/v24.21.0/bin`); the x64 Node in `/usr/local/bin` breaks Rollup/esbuild native binaries

## User Defined Namespaces
- [Leave blank - user populates]

## Components
- `src/content/` — structured content SSOT
- `src/components/site/SiteLayout.tsx` — app chrome (skip link, header, main#main, footer, search)
- `src/components/site/SiteHeader.tsx` — primary + secondary nav, `/` and ⌘K search, quiet theme toggle
- `src/components/site/SearchDialog.tsx` — client search over `searchIndex`
- `src/components/site/PageSEO.tsx` — Helmet title template, OG, Person JSON-LD on home (`knowsAbout` for published specialties)
- `src/components/site/ContactCta.tsx` — shared contact / resume / Calendly / WhatsApp conversion block on domains, case studies, About
- `src/components/editorial/*` — shared editorial patterns (list rows, prose, empty notes)
- `src/pages/HomePage.tsx` — narrative home arc; primary links include Resume; CTAs Work/Contact/About/Domains; MyLifeOS → `life.ayushrai.site`. “Things I build” lists `featuredProducts()` only.

## Patterns
- **Content SSOT:** Prefer `import { … } from '../content'` instead of hardcoding copy. Search, Markdown, REST, WebMCP, and MCP must call `src/lib/agent/` rather than a second dataset. The only phone number in public output is `person.phone` (published on purpose; `publicOutput.test.ts` rejects any other). Keep `needsConfirmation` / withheld award lists out of machine output
- **Flagship products:** `featured` on `src/content/products.ts` orders The Open Framework, AGENYRA, and MedVoice. Stages include `building` and `experimental` via `productStageLabels`. The product page and the `/work/:slug` case study share a slug and say different things. MedVoice has no demo URL until one is verified. AGENYRA waitlist admin and MedVoice demo credentials stay out of public copy. Audit: `docs/flagship-products-audit.md`.
- **Search ranking:** lexical tiers shared by the dialog, REST, MCP, and WebMCP (`src/lib/agent/search.ts`): exact title, title substring, tag or type, then summary; ties keep content order. Not semantic
- **Code documentation:** every source file starts with a `/** */` header (what it is for, how it works, "Connects to:" with grep-verified callers and dependencies); every function/component/hook has a short JSDoc. Keep these accurate when code changes
- **Prerender list:** `src/lib/publicRoutes.ts` — `sitemapRoutes()` (indexable) and `prerenderRoutes()` (adds all product logs, writing detail pages, `/design-system`). Anything with a Markdown twin must be prerendered
- **Contact email:** `src/lib/server/contactEmail.ts` HTML-escapes visitor fields, returns 400 for malformed JSON or non-string fields, length limits from `src/lib/contactFields.ts`, `website` honeypot, 5 per 10 min per client (per instance), 500 when `SENDGRID_API_KEY` or `FROM_EMAIL` is missing (no fallback sender)
- **Hydration:** `src/main.tsx` keeps `createRoot`. A `hydrateRoot` trial (Oct 2026) was clean on all 56 routes in light mode but mismatched for a saved dark theme (ThemeProvider reads localStorage in its first render), `?agent=1`, and `?audience=`. See issue 10 in `docs/known-issues.md`
- **Coverage gate:** `vite.config.ts` thresholds 95/95/87/91 (lines/statements/branches/functions); `npm run test:coverage` and CI fail below them. Measure before raising
- **Search types:** `SEARCH_ITEM_TYPES` in `src/content/types.ts` is the only list; `SearchItem["type"]` and `SEARCH_TYPES` derive from it
- **Legacy SPA:** removed from `main` (components, tests, unused packages); recover from tag `legacy-portfolio-spa`
- **Analytics:** GA4 `G-VBS0YJ07R8` loads from the inline snippet in `index.html`; `initGA()` skips injection when that script exists (prevents double page_view). GTM `GTM-NJZ5ZBX4` also loads from `index.html`
- **SPA fallback:** do not set Netlify `force` on `/*` → `/index.html`. Static HTML, `.md`, `llms.txt`, and the sitemap must win over the shell
- **Deployment ownership:** Keep host-required `vercel.json`, `netlify.toml`, and public `api/*.ts` entry points at the repository root. Put reusable server-only logic in `src/lib/server/` and deployment notes in `docs/deployment/`
- External links: `target="_blank"` + `rel="noopener noreferrer"`
- **Public safety:** Phone +91 7440567944 and WhatsApp (`person.phone`, `person.whatsappUrl`) are public since Oct 2026 on contact, home, footer, JSON-LD, Markdown, llms; research is Note|Investigation|Experiment; inflated leadership claims stay out of grounded pages
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
| `docs/seo-strategy.md` | Meta, schema, SPA mitigations |
| `docs/seo/live-audit.md` | Observed production HTTP audit |
| `docs/seo/domain-evidence-map.md` | Domain pages mapped to existing evidence |
| `docs/seo/keyword-and-content-strategy.md` | Qualitative search intents, no invented volumes |
| `docs/seo/measurement-plan.md` | Search Console and analytics review, no fake metrics |
| `docs/deployment/vercel.md` | Vercel layout, variables, preview checks, and safe rollout |
| `docs/API_ENDPOINTS.md` | Every endpoint, parameters, errors, rate limit, CORS, contact API |
| `docs/known-issues.md` | Open issues (P1–P3) with owner, cause, and suggested fix; update when one is fixed |
| `docs/personal-positioning.md` | Positioning narrative and checks |
| `docs/migration-plan.md` | Phased migration on current stack |
| `docs/content-style.md` | Voice, banned hype, copy patterns |
| `docs/questions-for-ayush.md` | Decision blockers for Ayush |

**Positioning:** Public role line is `person.roleTitle`: "AI Engineer & AI Product Builder". It is a self-description, not a ranking. Digital home, not portfolio brochure. Phone/WhatsApp number is public (user decision, Oct 2026). Non-root canonical URLs use a trailing slash. Unknown paths must 404, not reuse the homepage. Netlify read functions must return a Web `Response`. Vercel must not use `trailingSlash: true` (it 308s `/api/*`); an explicit page-only redirect in `vercel.json` adds the slash.
