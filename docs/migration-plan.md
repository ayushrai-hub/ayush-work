# Migration Plan — Stay on Vite + React Router

**Non-goals:** Next.js migration, full rewrite for its own sake, empty new routes.  
**Goals:** New IA, honest content, editorial design, privacy fixes, merge thin pages.

---

## 1. Principles

1. Ship continuous value on the same stack (Vite + React + TS + Tailwind + React Router).  
2. Content truth before visual polish when they conflict.  
3. Redirect legacy URLs; don’t leave soft 404s.  
4. No empty pages — density gates from `information-architecture.md`.  
5. Update tests when vanity metrics / phone disappear.

---

## 2. Phase overview

| Phase | Name | Outcome |
| --- | --- | --- |
| 0 | Safety & privacy | Phone/WhatsApp/schema cleaned; fact-check started |
| 1 | Content model | Centralize work/about data; kill worst claims |
| 2 | IA & routes | New routes live; legacy redirects; home slimmed |
| 3 | Design system | Tokens, typography, retire particles/Three.js default |
| 4 | Case depth | 3–5 case studies; services/leadership merged |
| 5 | SEO & polish | Meta, sitemap, prerender decision, perf baseline |
| 6 | Harden | Tests, a11y, analytics events aligned |

Phases can overlap slightly; do not launch public redesign with Phase 0 incomplete.

---

## 3. Phase 0 — Safety & privacy (week 0–1)

**Tasks:**

- [ ] Remove `tel:` links and phone display from `Hero`, `Contact`, footer if any  
- [ ] Remove WhatsApp profile entries with phone  
- [ ] Remove `telephone` from `src/lib/seo.ts` JSON-LD  
- [ ] Update tests that assert phone / WhatsApp  
- [ ] Start filling `content-fact-check.md` with Ayush (see `questions-for-ayush.md`)  
- [ ] Soften or comment out OpenAI/Turing/ScaleAI collaboration bullet pending wording  

**Exit:** No public phone; no schema telephone; known toxic claims flagged.

---

## 4. Phase 1 — Content model (week 1–2)

**Tasks:**

- [ ] Create `src/content/` (or `src/data/`) modules: `work.ts`, `about.ts`, `site.ts`  
- [ ] Move products/projects/research into `WorkEntry[]` with slugs  
- [ ] Curate profiles → `elsewhere.ts` (≤12)  
- [ ] Draft home/about/connect copy per `content-style.md`  
- [ ] Delete or empty services pricing from nav-facing UI  

**Exit:** Components read from data files; fact-check statuses attached in comments or companion fields (`verified: boolean` optional).

---

## 5. Phase 2 — IA & routes (week 2–3)

**Tasks:**

- [ ] Add routes: `/work`, `/work/:slug`, `/about`, `/connect` (+ `/notes` only if ready)  
- [ ] Rebuild home to editorial composition (may temporarily reuse layout chrome)  
- [ ] Implement redirects from `/research`, `/leadership`, `/certifications`, `/services`, `/extracurriculars`  
- [ ] Remove home section dump (Skills/Other/duplicate About/full Experience) or replace with teaser blocks  
- [ ] Update `Header` / `Footer` nav  

**Router sketch:**

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/work" element={<WorkPage />} />
  <Route path="/work/:slug" element={<CasePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/connect" element={<ConnectPage />} />
  <Route path="/research" element={<Navigate to="/work?type=research" replace />} />
  <Route path="/leadership" element={<Navigate to="/about#roles" replace />} />
  <Route path="/certifications" element={<Navigate to="/about#credentials" replace />} />
  <Route path="/services" element={<Navigate to="/connect" replace />} />
  <Route path="/extracurriculars" element={<Navigate to="/about#life" replace />} />
</Routes>
```

Also add host-level redirects when deploying.

**Exit:** Primary nav matches IA; no empty Notes; legacy URLs redirect.

---

## 6. Phase 3 — Design system (week 3–5)

**Tasks:**

- [ ] Introduce CSS variables + Tailwind theme per `design-system.md`  
- [ ] New typography (self-host or fontsource)  
- [ ] Replace gradient CTAs; light-first shell  
- [ ] Remove `ParticleBackground` / `ThreeJSHero` from default home (archive code under `legacy/` only if needed)  
- [ ] Implement 2–3 motions with reduced-motion support  
- [ ] Hero brand composition QA  

**Exit:** Visual language no longer generic purple/particle portfolio.

---

## 7. Phase 4 — Case depth & merges (week 4–6)

**Tasks:**

- [ ] Write 3–5 case studies (Open Framework, AyushMushrooms, + best verified projects/research)  
- [ ] About page: education, experience, extracurriculars, verified leadership only  
- [ ] Connect page: form + collaboration copy; no pricing  
- [ ] Drop Featured “portfolio itself” as a case  
- [ ] Certifications compact list or omit  

**Exit:** Density gates met for every live route.

---

## 8. Phase 5 — SEO & performance (week 5–7)

**Tasks:**

- [ ] Rewrite `defaultSEO` + per-route meta  
- [ ] OG image  
- [ ] `sitemap.xml` / `robots.txt`  
- [ ] Decide prerender for key routes  
- [ ] Re-measure LCP/INP vs old baseline  
- [ ] Confirm canonical domain  

**Exit:** Share cards correct; no phone in metadata; redirects crawlable.

---

## 9. Phase 6 — Harden (ongoing)

**Tasks:**

- [ ] Vitest updates for new pages  
- [ ] Playwright smoke: home, work, about, connect, one redirect  
- [ ] A11y pass (keyboard, contrast, form errors)  
- [ ] Analytics events remap  
- [ ] Delete dead components / MarkdownDocs that contradict new strategy (or mark superseded)

---

## 10. File-level migration map

| Legacy | Action |
| --- | --- |
| `ThreeJSHero`, `ParticleBackground` | Remove from tree default |
| `Hero.tsx` | Replace with `HeroHome` or fold into `HomePage` |
| `AboutMe.tsx` + `About.tsx` | Merge → `AboutPage` |
| `Experience.tsx` | Data → About timeline |
| `Projects.tsx` + `Products.tsx` + `Research.tsx` | → `work` content + pages |
| `Skills.tsx` | Demote to tags on cases |
| `Other.tsx` + `pages/*Page.tsx` | Replace with redirects + new pages |
| `Services.tsx` | Retire UI; optional Connect blurb |
| `CommunityLeadership.tsx` | Filter into About |
| `ExtraCurriculars.tsx` | About `#life` |
| `Certifications.tsx` | About `#credentials` or cut |
| `profilesData.ts` | Curate → elsewhere |
| `Contact.tsx` | → Connect page |
| `api/send-email.ts` | Keep |

---

## 11. Risk register

| Risk | Mitigation |
| --- | --- |
| Content verification stalls | Ship qualitative copy; hide metrics |
| Scope creep (Next.js, CMS) | Explicit non-goal; markdown in-repo OK |
| Broken deep links | Redirect table + host config |
| Test suite anchors old strings | Update in same PRs as UI |
| Design regression to purple | Design QA checklist in PR template |

---

## 12. Definition of done (public relaunch)

- [ ] Positioning readable in 10 seconds  
- [ ] No public phone / WhatsApp number  
- [ ] No services pricing page  
- [ ] No vanity 100% / 24/7 metrics  
- [ ] Work archive with ≥3 honest entries  
- [ ] About merges education + experience + life  
- [ ] Legacy routes redirect  
- [ ] Design system applied; particles gone  
- [ ] SEO basics + fact-check backlog empty for anything published as a number
