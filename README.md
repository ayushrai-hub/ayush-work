# Ayush Rai — AI Engineer × Revenue × GTM

Production source for **[www.ayushrai.site](https://www.ayushrai.site)** — the technical portfolio, GTM & revenue systems showcase, interactive proof-of-work (POW) workbenches, REST API, and MCP servers for **Ayush Rai**.

Every public fact lives in `src/content/` as typed TypeScript records. Human HTML pages, Markdown twins (`/*.md`), `llms.txt`, `llms-full.txt`, lexical search (`/api/v1/search`, `/ask`), REST endpoints (`/api/v1/projects`), and MCP servers (`/api/mcp`, `/api/mcp/docs`) read from that single source of truth.

---

## Positioning & Core Systems

**AI Engineer × Revenue × GTM** — building AI systems for evaluation, revenue operations, and deterministic execution where language models propose and tested code decides what is allowed to persist.

### GTM & Revenue Systems (`/gtm`, `/gtm-revops`, `/pow/revops-engineering`)
1. **RevenueRoles** ([`ayushrai-hub/RevenueRoles`](https://github.com/ayushrai-hub/RevenueRoles) · [revenueroles.in](https://revenueroles.in)) — ATS job discovery (Greenhouse, Lever, Ashby, RemoteOK) and Python FastAPI classification pipeline that categorizes technical revenue postings (GTM Engineer, RevOps Engineer, Forward Deployed Engineer) by the work described rather than title.
2. **GTM-Strato (ICP Finder)** ([`ayushrai-hub/GTM-Strato`](https://github.com/ayushrai-hub/GTM-Strato)) — SSRF-hardened company website extractor, NVIDIA Build inference separating `[Website fact]` from `[Hypothesis]`, deterministic 100-point ICP fit scorer, and prospecting filter generator for Apollo.io, LinkedIn Sales Navigator, and Clay.
3. **Revenue Intelligence Engine** ([`ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE`](https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE) · [revopy.vercel.app](https://revopy.vercel.app)) — Six-stage Python/FastAPI and Next.js GTM pipeline: ICP configuration, 100-point deterministic scoring, buying-signal detection, temperature-0 account research with deterministic fallback, human approval queue, and gated CRM export.
4. **Relationship Intelligence Engine** ([`ayushrai-hub/RELATIONSHIP-INTELLIGENCE-ENGINE`](https://github.com/ayushrai-hub/RELATIONSHIP-INTELLIGENCE-ENGINE)) — TypeScript/Node and PGlite public-source intelligence pipeline wrapping every extracted field in provenance (`value`, `source`, `sourceUrl`, `retrievedAt`, `confidence`, `verificationStatus`).
5. **AIworks Lead Research & Qualification Pipeline** ([`ayushrai-hub/leads`](https://github.com/ayushrai-hub/leads)) — Zero-dependency Python qualification CLI + SQLite store enforcing mandatory per-field source URLs, direct-phone rules, pre-run database backups, and cross-run identity deduplication.
6. **SpiderWeb** ([`ayushrai-hub/spiderWeb`](https://github.com/ayushrai-hub/spiderWeb)) — Next.js, PostgreSQL, and Redis personal relationship graph with two-stage LinkedIn CSV archive detection and entity resolution.
7. **MailU** ([`ayushrai-hub/Mailu`](https://github.com/ayushrai-hub/Mailu)) — Local FastAPI, React, ChromaDB, and Ollama email intelligence and RAG workspace.

### Flagship Products (`/products`)
- **The Open Framework** ([`ayushrai-hub/the-open-framework`](https://github.com/ayushrai-hub/the-open-framework)) — Civil-society discovery and consent-scoped verification concept (Vite + React prototype).
- **AGENYRA** ([`ayushrai-hub/AGENYRA_product`](https://github.com/ayushrai-hub/AGENYRA_product) · [agenyra.space](https://agenyra.space)) — Structured representation layer for AI products (Next.js 16 + Supabase).
- **MedVoice** ([`ayushrai-hub/MedVoiceERP`](https://github.com/ayushrai-hub/MedVoiceERP)) — Voice-assisted pharmaceutical wholesale billing where speech proposes candidate lines and deterministic code computes GST in integer paise and enforces human confirmation.

---

## Tech Stack

- **Frontend**: Vite 7, React 18, TypeScript, React Router v7 (lazy routes), Tailwind CSS with editorial design tokens
- **SEO & Structured Data**: `react-helmet-async`, Schema.org JSON-LD (`WebSite`, `Person`, `ProfilePage`, `CreativeWork`, `BreadcrumbList`, `Service`, `FAQPage`), Schema Feed (`/feeds/portfolio.jsonl`)
- **Build & Prerender**: Static SSR prerendering of all 80 public routes (`scripts/prerender.mjs`) + esbuild serverless bundling for Vercel Node ESM (`scripts/bundle-api.mjs`)
- **Edge & Serverless**: Self-contained Vercel Edge Middleware (`middleware.ts`) + serverless API endpoints (`api/*.ts`)
- **Agent Protocol Layer**: `@modelcontextprotocol/sdk` (Portfolio MCP + Docs MCP over stateless Streamable HTTP and stdio), OpenAPI 3.1 (`/openapi.json`), ARD v0.91 (`/.well-known/ard.json`), RFC 9727 API Catalog (`/.well-known/api-catalog`), WebMCP (`/webmcp.js`)
- **Telemetry**: `@vercel/analytics` and `@vercel/speed-insights`
- **Testing**: Vitest + React Testing Library (34 suites, 242 tests, V8 coverage gates) and Playwright Chromium E2E (15 specs)

Node `^20.19.0 || >=22.12.0` (CI runs on Ubuntu 24.04 with Node 22).

---

## Quick Start

```bash
npm install
npm run dev          # http://localhost:5173 (serves SPA, /api/*, *.md twins, llms.txt, and .well-known/*)
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with the agent middleware plugin (`src/lib/agent/vitePlugin.ts`). |
| `npm run build` | Build client bundle, build SSR bundle (`dist-server/`), prerender 80 HTML routes + Markdown twins + OpenAPI + feeds (`scripts/prerender.mjs`), and bundle `api/*.ts` on Vercel (`scripts/bundle-api.mjs`). |
| `npm run preview` | Preview the production `dist/` directory locally. |
| `npm run lint` | Run ESLint across the repository (`eslint.config.js`). |
| `npm run typecheck` | Run TypeScript project references (`tsc -b`). |
| `npx vitest run` | Run all 34 Vitest unit and integration test suites. |
| `npm run test:coverage` | Run Vitest with V8 coverage enforcement (`95%` lines/statements, `87%` branches, `91%` functions). |
| `npm run test:e2e` | Run Playwright Chromium end-to-end tests (`e2e/site.spec.ts`, `e2e/agent-readiness.spec.ts`). |
| `npm run mcp` | Start the portfolio MCP server over stdio (`mcp/server.ts`). |

---

## Repository Architecture

| Path | Responsibility |
| --- | --- |
| `src/content/` | Single source of truth for identity (`person.ts`, `practice.ts`), GTM portfolio (`gtm.ts`), products (`products.ts`), case studies (`work.ts`), projects (`projects.ts`), domain dossiers (`domains.ts`), visual artifacts & replacement slots (`visuals.ts`), and interactive POW simulations (`revopsPow.ts`, `agenticPow.ts`, `fde.ts`, `foundingEngineer.ts`, `benchmarkEngineering.ts`, `productManagementPow.ts`, `aiResearchPow.ts`, `mlEngineerPow.ts`, `devopsPow.ts`). |
| `src/pages/` | Route components lazy-loaded from `src/App.tsx`. |
| `src/components/editorial/` | Reusable editorial and visual components: `PageHeader`, `SectionHeading`, `Prose`, `WorkRow`, `MetaList`, `MediaFigure`, `MediaGallery`, `VideoEmbed` (Loom/YouTube + replacement slots), `UpdatedMeta`. |
| `src/components/pow/` & `src/components/orbit/` & `src/components/benchmark/` | Interactive local engineering workbenches (REVFLOW RevOps simulation, ORBIT agent runtime, LLM evaluation benchmark lab, FDE triage, Founding Engineer workbench, Cloud/DevOps/Data Science/ML labs). |
| `src/components/site/` | Layout shell, navigation (`SiteHeader`, `SiteFooter`), command search (`SearchDialog`), SEO (`PageSEO`), Markdown agent drawer (`AgentViewBar`), audience selector (`RoleSelector`), WebMCP (`PortfolioWebMcp`). |
| `src/lib/agent/` | Markdown twin generator (`markdown.ts`), lexical search (`search.ts`), REST handlers (`http.ts`), Portfolio MCP (`mcpServer.ts`, `mcpCard.ts`), Docs MCP (`docsMcp.ts`, `docsMcpCard.ts`), OpenAPI (`openapi.ts`), ARD & discovery surfaces (`surfaces.ts`). |
| `api/` | Serverless endpoints for Vercel/Node: `search.ts`, `projects.ts`, `compare.ts`, `batch.ts`, `ask.ts`, `mcp.ts`, `mcp-card.ts`, `docs-mcp.ts`, `docs-mcp-card.ts`, `api-catalog.ts`, `ai-catalog.ts`, `ard.ts`, `send-email.ts`. |
| `middleware.ts` | Zero-import Vercel Edge Middleware handling `Accept: text/markdown` content negotiation, `/?mode=agent`, and JSON 404s for unknown `/api/*` paths. |
| `scripts/prerender.mjs` | Build-time static HTML prerenderer, Markdown twin emitter, `llms.txt` / `llms-full.txt` builder, and `sitemap.xml` generator. |
| `scripts/bundle-api.mjs` | Bundles `api/*.ts` with esbuild during Vercel builds so Node ESM resolves local imports without runtime module errors. |
| `packages/cli/` | Zero-dependency Node CLI (`node packages/cli/bin/ayushrai.mjs search gtm`) over `/api/v1`. |

---

## Public Routes

| Route Group | Paths |
| --- | --- |
| **Core & GTM** | `/`, `/gtm`, `/about`, `/now`, `/resume`, `/timeline`, `/contact` |
| **Work, Products & Projects** | `/work`, `/work/:slug`, `/products`, `/products/:slug`, `/products/:slug/log`, `/projects` |
| **Domain Dossiers** | `/gtm-revops`, `/ai-engineering`, `/ai-engineering/llm-evaluation`, `/ai-engineering/rlhf`, `/ai-engineering/llm-systems`, `/ai-engineering/agents`, `/ai-engineering/rag`, `/software-engineering`, `/software-services`, `/experience`, `/open-source` |
| **Proof of Work (`/pow`)** | `/pow`, `/pow/revops-engineering`, `/pow/agentic-ai`, `/pow/fde`, `/pow/founding-engineer`, `/pow/product-management`, `/pow/ai-benchmark`, `/pow/ai-research-engineering`, `/pow/ml-engineer`, `/pow/ai-data-scientist`, `/pow/devops-engineer`, `/pow/cloud-engineer` |
| **Research, Writing & Context** | `/research`, `/research/:slug`, `/writing`, `/writing/:slug`, `/notes`, `/notes/:slug`, `/ideas`, `/principles`, `/uses`, `/education`, `/leadership`, `/recognition`, `/elsewhere`, `/archive`, `/privacy` |
| **Developers & Specs** | `/developers`, `/design-system` (`noindex`) |

Appending `?agent=1` to any route opens the on-site Markdown Agent View. Appending `.md` (or sending `Accept: text/markdown`) returns the raw Markdown twin.

---

## Agent & API Surfaces

- **Markdown Twins**: Every page has a `<path>.md` twin (e.g., `/index.md`, `/gtm.md`, `/work/gtm-strato.md`).
- **Discovery Indexes**: `/llms.txt`, `/llms-full.txt`, `/.well-known/ard.json`, `/.well-known/api-catalog`, `/.well-known/ai-catalog.json`, `/openapi.json`, `/AGENTS.md`, `/SKILL.md`, `/?mode=agent`.
- **REST API (`/api/v1/*` and `/api/sandbox/v1/*`)**:
  - `GET /api/v1/search?q=<query>&type=<type>&limit=<1..20>`
  - `GET /api/v1/projects` (cursor-paginated)
  - `GET /api/v1/projects/{slug}`
  - `GET /api/v1/compare?slugs=a,b`
  - `POST /api/v1/batch` (up to 8 read operations per call)
  - `POST /ask` (NLWeb-shaped lexical search with optional SSE streaming)
- **MCP Servers**:
  - **Portfolio MCP (`POST /api/mcp`)**: `list_projects`, `get_project`, `compare_projects`, `search_portfolio` (Server Card at `GET /api/mcp/server-card`).
  - **Docs MCP (`POST /api/mcp/docs`)**: `list_pages`, `get_page`, `search_docs` (Server Card at `GET /api/mcp/docs/server-card`).

---

## Quality Gates & Deployment

Before pushing to `main`, run the full verification pipeline (enforced in `.github/workflows/tests.yml`):

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run test:e2e
```

Merging or pushing to `main` deploys directly to Vercel (`https://www.ayushrai.site`, with `https://ayushrai.site` redirecting permanently to `www`).
