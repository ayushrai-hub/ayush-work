# ayush.me – Development Plan

## 1) Scope Summary
- Build a modern, performant portfolio for Ayush Rai highlighting Hero, About, Education, Experience, Skills, Projects, Certifications, Research/Blog, Services, Community, Testimonials, Resume, and Contact.
- Deliver smooth animations, responsive design, accessibility, and SEO.
- Prepare for future CMS integration and serverless features (contact, resume download).

## 2) Key Requirements (from PRD, checklist, docs)
- Hero: rotating headlines, counters, status indicators, animated background.
- About/Timeline: interactive timeline, “My Story” content.
- Education: dual degree, achievements.
- Experience: structured roles, metrics.
- Skills: categorized skills.
- Projects: cards, live/demo, GitHub, categories, testimonials.
- Certifications: verification links, timeline.
- Research/Blog: CMS or Markdown, tagging.
- Community/Leadership: highlights, icons/badges.
- Domain Expertise: showcase of expertise areas.
- Services: cards + pricing models.
- Frameworks & Strategies: methodologies and visuals.
- Workshops & Events: timeline view.
- Testimonials: carousel/cards.
- Dynamic Resume: download, later API.
- Contact: form + serverless, calendar, social links.
- Performance/SEO: lazy load, code-splitting, meta/OG/JSON-LD, sitemap, robots, Lighthouse.
- Accessibility: semantic HTML, ARIA, keyboard nav, contrast, alt text.
- Integrations: GA4, CMS (Sanity/Contentful/Strapi), serverless (contact), optional social APIs.

## 3) Architecture & Conventions
- Tech: React + Vite + TS + Tailwind + Framer Motion. Dark mode via class strategy.
- Structure:
  - `src/components/` reusable UI: `Navbar`, `Footer`, `Section`, `Hero`, `About`, `Experience`, `Skills`, `Projects`, `Certifications`, `Contact`, etc.
  - `src/hooks/`: `useDarkMode`, `useAnalytics` (placeholder).
  - `src/data/`: static JSON/TS for skills, projects, etc. (migrate later from inline).
  - `src/utils/`: helpers (e.g., analytics, formatters).
- Coding standards:
  - TypeScript with explicit props types.
  - Functional components, hooks, small pure components.
  - Tailwind for styling; consistent spacing, color tokens from theme.
  - Accessibility: roles/aria-labels, focus states.
  - Linting: follow default ESLint config (extend later if needed).

## 4) Milestones & Deliverables
- M1: Core shell + theming
  - Navbar, Footer, Layout, anchors, dark mode toggle.
  - Tailwind config fix, base SEO meta.
- M2: Hero polish
  - CTA buttons, status badge, animated counters.
  - Background visual baseline (non-Three.js for now, progressive enhancement later).
- M3: Data-driven sections
  - Move hardcoded arrays to `src/data/*` and map components.
  - Add basic filtering in Projects.
- M4: Visualizations
  - Integrate lightweight charting for skills visualization (Recharts or Chart.js) behind feature flag.
- M5: Contact & Resume
  - Accessible form with client + server validation (zod).
  - Serverless: rate limit, CAPTCHA, spam filtering, secret management, audit logs, and safe email handling.
  - Resume: signed URL or tokenized endpoint to deter scraping; cache headers.
- M6: SEO/Perf/Accessibility
  - Full meta/OG/JSON-LD, sitemap/robots generation, lazy loading.
  - Pass basic Lighthouse checks; fix a11y findings.
- M7: Deployment & CI/CD
  - Vercel/Netlify preview builds; GA4 env var; domain.

## 5) Testing & QA Plan
- Local smoke tests across major sections and routes (SPA anchors).
- Component-level checks: rendering, responsive breakpoints.
- Accessibility: keyboard-only nav, screen-reader labels, color contrast.
- Performance: Lighthouse in Chrome; ensure no layout shift from animations.
- Regression: basic manual test list per section before deploy.

## 6) Risks & Mitigations
- Scope breadth: prioritize MVP visuals first; stage advanced 3D later.
- Performance from animations: prefer CSS/Framer Motion; throttle effects; lazy mount.
- Data accuracy: externalize to `src/data` and review content.
- CMS integration timing: ship static data MVP; integrate CMS in phase 2.

## 7) Immediate Action Items
- Fix Tailwind `content` paths and update base meta in `index.html`.
- Add `Navbar`, `Footer`, `Layout`, `Section`, `useDarkMode` and wire up anchors.
- Enhance `Hero` with CTA + status badge, leave counters for next pass.
- Create `useAnalytics` hook stub and wire page load event.

## 8) Definition of Done (MVP)
- Clean, responsive SPA with discoverable sections via navbar.
- Dark mode toggle persisted across reloads.
- Hero, About, Experience, Skills, Projects, Certifications, Contact present.
- Basic SEO meta and accessible structure.
- App builds (`npm run build`) and previews cleanly.

## 9) Future Enhancements (Phase 2)
- GA4 integration; CMS for projects/blog/testimonials.
- Serverless contact + resume generation; calendar integration.
- Skills visualization; project filters/search.
- 3D/particles background; testimonials carousel; sitemap/robots automation.
