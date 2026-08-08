# Information Architecture

**Goal:** A Vite + React Router multi-page site that feels like an editorial magazine and personal archive — not a résumé dump. Every route must have enough verified content to justify itself. No empty pages. Merge thin pages.

---

## 1. Principles

1. **One job per page** — clear purpose, one primary headline, short supporting line.  
2. **Evidence over inventory** — fewer items, deeper treatment.  
3. **Home is a composition** — brand-level name, one positioning line, one short sentence, one CTA group, one dominant visual. No stats strip, no card grid in the first viewport.  
4. **Archive depth lives on secondary routes** — work, writing/notes, about, contact.  
5. **Merge until dense** — if a topic cannot fill ~1–2 solid screens with real content, nest it under a parent.  
6. **Stay MPA-with-React-Router** — distinct URLs, shared shell (header/footer), client-side transitions OK.

---

## 2. Proposed route map

| Route | Purpose | Primary content | Nav? |
| --- | --- | --- | --- |
| `/` | Digital home / editorial front | Positioning, selected work (3–5), current focus, soft CTA | Yes |
| `/work` | Proof archive | Selected projects + products as case entries; filters optional | Yes |
| `/work/:slug` | Case study | Problem → approach → outcome → links/evidence | Via work |
| `/about` | Person & path | Bio, education, experience timeline (honest), values | Yes |
| `/notes` | Thinking / archive index | Short essays, research notes, talks (only if content exists) | Yes if ≥3 pieces |
| `/notes/:slug` | Single note | Long-form or research write-up | Via notes |
| `/connect` | Contact | Email, LinkedIn, optional form; collaboration framing | Yes |
| `/elsewhere` | Curated profiles | 6–12 primary links only | Footer / About |

### Redirects / retirements

| Old route | Action |
| --- | --- |
| `/research` | Merge into `/work` (research cases) and/or `/notes` (write-ups). 301/alias optional during migration |
| `/leadership` | Merge into `/about` (selected roles) + extracurriculars subsection; drop inflated cards |
| `/certifications` | Collapse into `/about` as a compact list or omit until verified certificates with links |
| `/services` | Remove as primary route; one short “how we might work together” on `/connect` — **no pricing grid** |
| `/extracurriculars` | Merge into `/about#life` or a short “Outside work” block |

**Rule:** Do not ship `/notes` until there are at least three publishable pieces. Until then, research appears as work entries with “Research” type.

---

## 3. Home composition (`/`)

**First viewport (hero budget):**

- Name: **Ayush Rai** (hero-level brand signal)  
- One headline (positioning — see `personal-positioning.md`)  
- One supporting sentence  
- CTA group: e.g. View work · About · Email  
- One dominant visual plane (photo, still from a product, or editorial image — **not** particles / Three.js as the idea)

**Below fold (still one scroll, restrained):**

1. **Selected work** — 3–5 entries max (mix of product / project / research)  
2. **Currently** — 2–3 lines on FoCDoT / Outlier / Open Framework (no title stack)  
3. **Archive tease** — link to `/work` and `/about`  

**Explicitly not on home:** skills cloud, cert carousels, services pricing, 40 profiles, vanity CountUps, duplicate About.

---

## 4. Work archive (`/work`)

### Content model (suggested)

```ts
type WorkEntry = {
  slug: string;
  title: string;
  type: 'product' | 'project' | 'research' | 'client';
  status: 'shipped' | 'in-progress' | 'archived';
  summary: string;          // 1–2 sentences
  year?: string;
  roles?: string[];
  stack?: string[];
  outcomes?: Evidence[];    // only verified
  links?: { label: string; url: string }[];
  cover?: string;
};
```

### Grouping / filters (optional)

- All | Products | Projects | Research | Client  
- Prefer chronological or intentional “featured” order over category silos on first paint.

### Case study (`/work/:slug`) structure

1. Title + type + status  
2. Context (who/where/why)  
3. What was built  
4. Evidence (metrics only if verified; else qualitative)  
5. Links (demo, repo, paper, press)  
6. Related entries  

**Seed candidates from current site:** Open Framework, AyushMushrooms, Overlay Extension, Expert-O, Shiksha-Mitra, Iha-By-Himani (post fact-check), Praful H., AI Ag Advisory, Legal NLP, Smart Campus (post fact-check).

---

## 5. About (`/about`)

Single page, clear sections (anchor IDs, not separate thin routes):

| Section | Content |
| --- | --- |
| Intro | Positioning narrative expanded |
| Path | Education (both degrees) + career timeline |
| Selected roles | Only leadership/community items that survive fact-check |
| Outside work | Extracurriculars (grounded list) |
| Credentials | Optional compact cert list with issuer + year + link |
| Elsewhere | Short link to curated profiles |

---

## 6. Connect (`/connect`)

- Prefer **email** and **LinkedIn** as primary.  
- Keep contact form if deliverability works.  
- Optional: calendar link later.  
- Collaboration framing: what kinds of problems are interesting; what is out of scope.  
- **No phone, no WhatsApp with number, no pricing table.**

---

## 7. Navigation

### Primary (header)

`Work · About · Notes* · Connect`  
\*Omit Notes until ready.

### Secondary (footer)

Elsewhere · Privacy note (no phone) · Source / colophon optional · Theme toggle if retained  

### Kill

- FloatingNav duplicating header on every section (or reduce to minimal).  
- “Other” dropdown hub that exists only because pages were thin.

---

## 8. Content density gates (no empty pages)

A route ships only if it meets **all** of:

1. ≥1 unique H1 purpose distinct from other routes  
2. ≥400 words of verified prose **or** ≥3 substantive case cards with real summaries  
3. At least one primary CTA that is not “coming soon”  
4. No placeholder / lorem / “update soon”

If gate fails → merge into parent.

---

## 9. URL aliases during migration

Preserve inbound links where useful:

| Legacy | Temporary behavior |
| --- | --- |
| `/research` | Redirect → `/work?type=research` or first research case |
| `/leadership` | Redirect → `/about#roles` |
| `/certifications` | Redirect → `/about#credentials` |
| `/services` | Redirect → `/connect` |
| `/extracurriculars` | Redirect → `/about#life` |

Implement with React Router `<Navigate>` and/or host redirects (Netlify `_redirects` / Vercel rewrites).

---

## 10. Sitemap (target)

```
/
/work
/work/the-open-framework
/work/ayushmushrooms
/work/... (only entries with content)
/about
/notes            (gated)
/notes/...        (gated)
/connect
/elsewhere        (optional; can be About section only)
```

---

## 11. Relationship to old SPA sections

| Old home section | New home |
| --- | --- |
| ThreeJSHero / Hero | Redesigned editorial hero |
| AboutMe + About | `/about` (+ short home blurb) |
| Experience | `/about` timeline |
| Projects + Products + Research | `/work` (+ home selected) |
| Skills | Demote: tags on case studies only |
| Other | Delete |
| Contact | `/connect` |
| Leadership / Extra / Certs / Services pages | Merged / retired per above |

See `migration-plan.md` for phased execution.
