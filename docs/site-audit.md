# Site Audit — Existing Portfolio

**Scope:** Vite + React + TypeScript portfolio at `ayushrai-hub/ayush-work` (this repo).  
**Date of audit basis:** content and structure as of the rebuild planning cycle.  
**Purpose:** Record what exists, what hurts trust/clarity, and what must change before redesign.

---

## 1. Stack and deployment

| Layer | Current |
| --- | --- |
| Build | Vite |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS, dark/light via `ThemeContext` |
| Motion | Framer Motion, `react-intersection-observer`, CountUp |
| 3D / ambience | Three.js hero (`ThreeJSHero`), particle background |
| Routing | `react-router-dom` — SPA home + 5 dedicated routes |
| Analytics | GA init, GTM provider, web vitals helpers |
| Contact | Form → Netlify/Vercel serverless `api/send-email` |
| Tests | Vitest + Testing Library; Playwright e2e skeleton |
| Hosting (historical) | Netlify (`ayush-me.netlify.app`), also Vercel-capable |

**Decision for rebuild:** Stay on **Vite + React Router multi-page** (not Next.js). Improve IA, content integrity, and design language; do not migrate frameworks.

---

## 2. Information surface today

### Homepage (`/`) — section dump

Rendered in order in `App.tsx`:

1. `ThreeJSHero` (primary hero; separate `Hero.tsx` also exists in codebase)
2. `AboutMe`
3. `Experience`
4. `Projects`
5. `Products`
6. `Education`
7. `Skills`
8. `Other` (hub links to satellite pages)
9. `About` (second about — overlap with AboutMe)
10. `Contact`
11. Header + FloatingNav + Footer + ParticleBackground globally on home

**Problem:** One long scroll that tries to be résumé, agency brochure, research CV, and social directory at once. Duplicate About. Thin “Other” hub. Heavy Three.js + particles compete with content.

### Dedicated routes

| Route | Component | Role today |
| --- | --- | --- |
| `/research` | `ResearchPage` → Research | Projects + awards |
| `/leadership` | `LeadershipPage` → CommunityLeadership | Inflated leadership cards |
| `/certifications` | `CertificationsPage` | Cert list + vanity stats |
| `/services` | `ServicesPage` | Agency pricing packages |
| `/extracurriculars` | `ExtraCurricularsPage` | Grounded activities (stronger than leadership) |

**Problem:** Several pages are thin, claim-heavy, or off-brand (services pricing). Leadership and extracurriculars overlap conceptually; certifications do not need a full route if content is sparse.

### Profiles

`src/lib/profilesData.ts` — **40+** external links across development, design, data, writing, professional, portfolio, social. Includes **WhatsApp with phone number**. Feels like a linkdump, not a curated presence map.

---

## 3. Visual / UX diagnosis

| Pattern | Where it shows up | Verdict |
| --- | --- | --- |
| Purple/blue gradients | App shell, buttons, cards, SEO-era “tech portfolio” look | Generic AI-portfolio aesthetic — replace |
| Particle / Three.js ambience | Home background + hero | High cost, low signal; retire or demote heavily |
| Title stacking | Hero headline rotator (SDE / GenAI / Full-Stack / Community Leader / Polymath / RLHF…) | Undermines positioning |
| Vanity metrics | “100% success”, “24/7 support”, CountUp grids on Projects/Certs/Extra | Agency filler — remove |
| Card grids everywhere | Projects, Products, Services, Leadership | Fine for interactive lists later; not for hero |
| Dark mode default vibes | Blue-900 / purple CTAs | Avoid defaulting to dark + purple glow |

---

## 4. Content inventory (facts as coded)

### Person

- **Name:** Ayush Rai  
- **Location:** Bhopal / India  
- **Email (public OK):** ayushrai0211@gmail.com  
- **LinkedIn:** ayushrai02  
- **GitHub:** ayushrai-hub  
- **Phone:** present in Hero, Contact, SEO structured data, WhatsApp profile — **must not remain public**

### Education

- B.Tech CSE — LNCTS Bhopal — 2020–2024 — CGPA 8.47  
- BS Data Science — IIT Madras — 2021–2024 — CGPA 6.86  
- Higher secondary — Seoni — 78.2% (in Education component)

### Experience (as listed)

| Role | Org | Dates | Notes |
| --- | --- | --- | --- |
| SDE–AI | FoCDoT | Apr 2024–Present | RLHF; claims collab with Turing/OpenAI/ScaleAI/Outlier — **VERIFY** |
| Generative AI | Outlier | Aug 2025–Present | Part-time |
| Web Dev | RaSoR–IITM | Dec 2023 | Internship |
| Student Champion | UiPath | 2022–23 | Leadership internship |
| Virtual Intern | Salesforce | 2022 | Cert-linked |
| WebOps | Kanha House | 2022–23 | In Experience component |

### Products

- **The Open Framework** — DPI for Indian NGOs/CSOs — In progress — demo on Vercel  
- **AyushMushrooms** — Agrotech brand MVP — In progress  

### Projects (featured)

- Overlay Text Box Extension  
- Portfolio site (self-referential)  
- Expert-O  
- Shiksha-Mitra  
- Iha-By-Himani (claims **300% inquiries** — **VERIFY**)  
- Praful H. client site  

### Research

- AI Agricultural Advisory — 85% accuracy, 20 farmers — **VERIFY**  
- NLP Legal Docs — 60% time reduction — **VERIFY**  
- Smart Campus Energy — 15% savings, Bhopal Smart City — **VERIFY**  
- Awards: SIH Top 5, Best Research Paper, ACM SRC — **ALL VERIFY**

### Leadership vs extracurriculars

- **Leadership page:** GDSC Lead, Microsoft Learn Ambassador (50K reach), $30K funding, many large round numbers — **VERIFY / likely inflate**  
- **Extracurriculars:** BachpanShala, MUN, Raahat, Dragonfly Festival, Beyond The Words, etc. — more grounded  

### Services

- Six agency-style packages with USD starting prices ($800–$2000+, hourly $150)  
- **Rebuild stance:** de-emphasize or remove as primary nav; optional contact note only  

---

## 5. Trust and privacy risks

1. **Public phone** in UI, WhatsApp deep link, and JSON-LD `telephone` (`src/lib/seo.ts`).  
2. **Unverified impact metrics** on research, leadership, and client projects.  
3. **Company name-dropping** (OpenAI, Turing, ScaleAI) without clarifying employment vs platform/vendor relationship.  
4. **Services pricing** without delivery proof or case studies — reads as agency template.  
5. **Duplicate / conflicting About** sections dilute story.  
6. **40+ profiles** including low-signal platforms — dilutes primary channels.

---

## 6. Technical debt relevant to rebuild

- Content embedded in components (hard to fact-check and update).  
- Lazy-loaded home sections + always-on particles = performance tax.  
- `Hero.tsx` vs `ThreeJSHero` dual landing paths — consolidate.  
- SEO constants still “AI & Full-Stack Developer Portfolio” + Netlify URL — outdated positioning.  
- Tests assert vanity strings (`100%`, phone links) — will need rewrite with content.  
- Existing docs (`MarkdownDocs/`, `docs/other-pages-consolidation-strategy.md`) describe older consolidation plans; this strategy set supersedes them for product direction.

---

## 7. What works (keep the signal)

- Real dual-degree education story (LNCTS + IITM).  
- Current AI work (FoCDoT, Outlier) is timely if claims are honest.  
- Products (Open Framework, AyushMushrooms) show builder ambition beyond client sites.  
- Extracurriculars feel human and specific.  
- Contact form + serverless email path is useful infrastructure.  
- React Router already supports multi-page — good base for editorial archive.

---

## 8. Rebuild implications (summary)

| From | To |
| --- | --- |
| Portfolio dump + vanity | Editorial magazine × personal archive |
| Title stacking | One clear positioning line |
| Thin satellite pages | Merge until each route earns its keep |
| Services as nav pillar | Contact / collaboration only |
| Phone + WhatsApp public | Email + LinkedIn (+ optional Cal) |
| Purple particles | Quiet, typed, image-led design system |
| Unverified metrics | Evidence-backed or removed |

See also: `information-architecture.md`, `content-fact-check.md`, `design-system.md`, `migration-plan.md`.
