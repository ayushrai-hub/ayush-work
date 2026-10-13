# Ayush Rai, digital home

Personal website for **Ayush Rai**, not a résumé dump, not a freelancing landing page. A structured archive of work, products, research notes, ideas, and how he thinks.

Live content lives in `src/content/` (TypeScript modules). Edit those files to update the site without touching layouts.

## Deploy & legacy site

- **Production track:** `main` (this digital-home rebuild)
- **Old portfolio SPA preserved on:** branch [`archive/portfolio-spa-2026`](https://github.com/ayushrai-hub/ayush-work/tree/archive/portfolio-spa-2026) and tag `legacy-portfolio-spa`
- Details: [`docs/preserving-old-site.md`](docs/preserving-old-site.md)

Hosts: Netlify (`netlify.toml` → `dist`) and/or Vercel (`vercel.json` Vite config). SPA fallback is configured so client routes work.

## Stack

- Vite + React 18 + TypeScript
- React Router (multi-page)
- Tailwind CSS (editorial tokens)
- Framer Motion (minimal, respects `prefers-reduced-motion`)
- react-helmet-async (per-page SEO + Person JSON-LD)

## Quick start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

Tests:

```bash
npm test
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Editorial home |
| `/work`, `/work/:slug` | Selected work & case studies |
| `/products`, `/products/:slug`, `/products/:slug/log` | Products + build logs |
| `/projects` | Bounded projects & experiments |
| `/research`, `/research/:slug` | Investigations (not peer-review theatre) |
| `/writing`, `/notes` | Publication surface |
| `/now` | Living status |
| `/ideas`, `/principles`, `/timeline` | Thinking & chronology |
| `/about`, `/education`, `/leadership`, `/recognition` | Person & path |
| `/elsewhere` | Curated profiles (no phone) |
| `/contact` | Intent-based contact |
| `/archive`, `/uses`, `/resume` | Archive, tools, résumé |
| `/design-system` | Internal tokens (not in nav) |
| `/developers` | Public notes for Markdown, search, and the project API |

Legacy redirects: `/services` → `/contact`, `/certifications` → `/recognition`, `/extracurriculars` → `/leadership`.

## Agent-readable surfaces

The human site and the machine surfaces read `src/content/`. Details are in `docs/agent-readiness-audit.md` and `docs/agent-readiness-report.md`.

- Markdown twins: `/index.md`, `/about.md`, `/work/the-open-framework.md`, and the other pages listed in `/llms.txt`
- Search: `GET /api/search?q=` (lexical, shared with the on-site dialog)
- Projects: `GET /api/v1/projects`, `GET /api/v1/projects/:slug`, `GET /api/v1/compare?slugs=a,b`
- Spec: `/openapi.json`, `/AGENTS.md`, `/SKILL.md`
- MCP: `npm run mcp` (stdio), or `POST /api/mcp` (Streamable HTTP)

Homepage role view (`?audience=`) reorders existing sections. Agent view (`?agent=1`) shows the page Markdown. Neither query is meant for the sitemap.

## Content & strategy docs

See `docs/`:

- `site-audit.md`, what existed and what changed
- `personal-positioning.md`, coherent narrative
- `information-architecture.md`, route decisions
- `content-fact-check.md`, claims needing confirmation
- `questions-for-ayush.md`, open questions
- `design-system.md`, `content-style.md`, `seo-strategy.md`, `migration-plan.md`

## Privacy

Public pages do **not** expose phone numbers. Prefer email / Cal.com / LinkedIn.

## Contact API

Serverless email endpoints live under `api/` (Netlify/Vercel). Copy `.env.example` for local config.

## Design direction

Warm paper background, near-black ink, deep green accent, Source Serif 4 + Source Sans 3. Evidence over adjectives. No particle fields, vanity metrics, or title-stacking carousels.
