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
- **Serverless:** Netlify/Vercel contact email API under `api/`
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
- `src/pages/HomePage.tsx` — narrative home arc; “Go deeper” links About/Work/Timeline/Writing + MyLifeOS

## Patterns
- **Content SSOT:** Prefer `import { … } from '../content'` instead of hardcoding copy
- External links: `target="_blank"` + `rel="noopener noreferrer"`
- **Public safety:** No phone/WhatsApp in UI; research is Note|Investigation|Experiment; inflated leadership claims stay out of grounded pages
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
