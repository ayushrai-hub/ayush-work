# OpenMemory Guide

## Overview
Personal portfolio site cloned from [ayushrai-hub/ayush-work](https://github.com/ayushrai-hub/ayush-work). Vite + React + TypeScript + Tailwind + Framer Motion. Deployed historically on Netlify/Vercel. Evolving into a personal digital home with a typed content layer as the single source of truth.

## Architecture
- **Entry:** `src/main.tsx` → `src/App.tsx` (react-router, lazy pages)
- **Shell:** `src/components/site/` — SkipLink, SiteHeader, SiteFooter, SiteLayout, SearchDialog, PageSEO
- **Editorial UI:** `src/components/editorial/` — PageHeader, SectionHeading, Prose, WorkRow, MetaList, EmptyNote
- **Pages:** `src/pages/*` — Home, About, Work (+detail), Products (+detail/+log), Projects, Research (+detail), Writing, Notes, Now, Ideas, Principles, Timeline, Education, Leadership, Recognition, Elsewhere, Contact, Archive, Uses, Resume, DesignSystem, NotFound
- **Content layer:** `src/content/` — typed modules (person, now, work, products, projects, research, experience, education, leadership, recognition, ideas, principles, timeline, writing, notes, uses, elsewhere, archive, capabilities, searchIndex). Re-export via `src/content/index.ts`. Cautious/verified language; vanity metrics and unverified claims go to `needsConfirmation` or are omitted.
- **Styling:** Tailwind (`tailwind.config.js`) + design tokens in `src/index.css` (paper/ink/rule/accent/signal); theme via `ThemeContext` (light-first)
- **Serverless:** Netlify/Vercel contact email API under `api/`, plus read-only `api/search.ts` and `api/projects.ts`. `/api/v1/projects`, `/api/v1/projects/:slug`, and `/api/v1/compare` rewrite onto the projects function
- **Agent surfaces:** `src/lib/agent/` serializes the same content into Markdown twins, `/llms.txt`, `/llms-full.txt`, `/openapi.json`, `/AGENTS.md`, and `/SKILL.md` (Vite plugin emits them and serves them in dev). Search is lexical, not semantic. Role view reorders the homepage (`?audience=`). Agent view is `?agent=1`. WebMCP tool `search_portfolio_projects` calls the same search function. Local MCP server is stdio only: `mcp/server.ts` (`npm run mcp`)
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
| `docs/personal-positioning.md` | Positioning narrative and checks |
| `docs/migration-plan.md` | Phased migration on current stack |
| `docs/content-style.md` | Voice, banned hype, copy patterns |
| `docs/questions-for-ayush.md` | Decision blockers for Ayush |

**Positioning:** Ayush moves across AI, software, products and research to turn messy real-world problems into working systems. Digital home, not portfolio brochure. Phone/WhatsApp number must not be public.
