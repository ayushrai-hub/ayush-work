# Design System — Editorial Magazine × Personal Archive

**Direction:** Quiet, typed, image-led. Feels like a small magazine and a personal archive — not a SaaS landing page or “AI engineer portfolio” template.

**Stay on:** Vite + React + Tailwind (tokens via CSS variables). Framer Motion for 2–3 intentional motions only. **No** Three.js particles as brand.

---

## 1. Design principles

1. **One composition** — first viewport is a single idea, not a dashboard.  
2. **Brand first** — “Ayush Rai” is a hero-level signal; no headline outranks the name.  
3. **Evidence over ornament** — real work images beat abstract gradients.  
4. **One job per section** — one headline, one short supporting sentence.  
5. **Cards are rare** — allowed when they are the interaction container (work index). Never in the hero.  
6. **Motion with purpose** — presence and hierarchy, not noise.  
7. **Avoid AI-portfolio clichés** — purple-on-white / purple–indigo gradients; cream+#terracotta serif kitsch; broadsheet hairline newspaper pastiche; dark mode + glow + rounded-full pills as defaults.

---

## 2. Visual direction (recommended)

| Aspect | Choice | Rationale |
| --- | --- | --- |
| Metaphor | Editorial print + archive index | Matches “digital home” |
| Light/dark | Light-first; dark optional later | Escape default dark/glow portfolio |
| Atmosphere | Paper grain / soft ink wash / photographic field — subtle | Not flat gray-50→blue-50 |
| Imagery | Portrait + product stills / UI crops | Real visual anchor |
| Density | Generous whitespace, long measure for prose | Magazine feel |

**Working palette (CSS variables — tune in implementation):**

```css
:root {
  --bg: #f7f4ef;           /* warm off-white — not #F4F1EA cream cliché if paired with terracotta/serif; keep cool-neutral if needed */
  --bg-elevated: #fffdf9;
  --ink: #1a1a1a;
  --ink-muted: #5c5a57;
  --rule: #d9d4cb;
  --accent: #2c5f4e;       /* deep green — craft/systems, not purple */
  --accent-soft: #e4efe9;
  --signal: #9a3412;       /* sparingly — links/hover only */
  --focus: #1d4ed8;        /* a11y focus only */
}
```

**Anti-palette:** `#7c3aed` / indigo CTA gradients, neon glow, glassmorphism stacks.

If warm paper + green reads too “eco template,” shift `--bg` to cool stone (`#f3f2f0`) and accent to ink-red or navy — still **not** purple.

---

## 3. Typography

Avoid Inter / Roboto / Arial / system-only stacks as the expressive voice.

| Role | Suggestion | Notes |
| --- | --- | --- |
| Display / name | Fraunces, Newsreader, or Source Serif 4 | Hero name + section titles |
| UI / body | Source Sans 3, IBM Plex Sans, or Geist | Readable, contemporary |
| Mono / data | IBM Plex Mono or JetBrains Mono | Dates, slugs, stack tags |

**Scale (desktop):**

- Name / display: ~48–72px  
- Page H1: ~36–48px  
- Section H2: ~28–32px  
- Body: 18–20px, line-height ~1.6, measure ~60–68ch for articles  
- Meta / labels: 12–14px uppercase or small caps sparingly  

**Rules:** No rotating headline carousel. No gradient text on titles.

---

## 4. Layout

- Max content width: ~1120px for indexes; ~680–720px for long prose.  
- Home hero: full-bleed visual plane **or** full-bleed photographic background with typography in a clear safe zone — not an inset rounded media card.  
- Work index: simple list or sparse grid; hairline rules OK if not “newspaper cosplay.”  
- Avoid: stat strips, pill clusters, icon rows, floating badges on imagery.

---

## 5. Components (rebuild inventory)

| Component | Behavior |
| --- | --- |
| `SiteHeader` | Name mark + text links; minimal |
| `SiteFooter` | Elsewhere, colophon, theme if any |
| `HeroHome` | Name, one line, one sentence, CTAs, visual |
| `WorkList` / `WorkCard` | Interaction containers — quiet borders, no heavy shadow |
| `CaseStudyLayout` | Title, dek, body, figure, meta |
| `Timeline` | Education / experience — typographic, not roadmap chrome |
| `ContactForm` | Simple fields; no purple gradient button |
| `LinkElsewhere` | Text list with domain — not rainbow domain chips |

**Retire:** `ParticleBackground`, `ThreeJSHero` as default, CountUp vanity blocks, FloatingNav (or drastically simplify), emoji-led “Other” hubs.

---

## 6. Motion

Ship **2–3** intentional motions:

1. Home hero: fade/slide of text + subtle image settle (once).  
2. Work list: gentle stagger on first in-view (short, ≤400ms).  
3. Page transition: opacity crossfade via router (optional).  

Respect `prefers-reduced-motion`. No continuous particle fields, no headline rotators, no infinite shimmer.

---

## 7. Imagery guidelines

- Portrait: high-quality, consistent crop; not tiny circle-in-circle unless intentional archival stamp.  
- Work: real UI screenshots, photos of workshops only if honest, product frames.  
- Alt text required.  
- Prefer WebP/AVIF with dimensions reserved to avoid CLS.

---

## 8. Iconography & decoration

- Prefer text links over icon soups.  
- Lucide OK for UI affordances (external link, mail) — monochrome.  
- No emoji as section icons in production IA.

---

## 9. Accessibility

- Contrast: body text ≥ 4.5:1 on `--bg`.  
- Focus rings visible (`--focus`).  
- Keyboard nav for header + form.  
- Don’t rely on color alone for work-type badges.  
- Form errors in text, not color-only.

---

## 10. Responsive

- Mobile: single column; hero stacks name → text → CTA → image (or image as background with readable scrim).  
- Touch targets ≥ 44px for primary actions.  
- No horizontal scroll from particles/canvas leftovers.

---

## 11. Theme toggle

Optional. If kept: light default; dark as ink-on-near-black without neon accents. Do not make dark+purple the brand.

---

## 12. Implementation notes (Tailwind)

- Map CSS variables into `tailwind.config` theme extension.  
- Prefer semantic classes (`bg-bg`, `text-ink`, `border-rule`) over ad-hoc `from-blue-600 to-purple-600`.  
- Purge unused gradient utility patterns from old components during migration.

---

## 13. Design QA checklist

- [ ] First viewport passes brand test (recognizable without nav).  
- [ ] No purple/indigo gradient CTAs.  
- [ ] No particles / Three.js required for identity.  
- [ ] No vanity metrics in chrome.  
- [ ] Cards absent from hero.  
- [ ] At least two intentional motions; reduced-motion OK.  
- [ ] Desktop and mobile readable without horizontal scroll.
