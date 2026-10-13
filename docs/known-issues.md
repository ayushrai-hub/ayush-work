# Known issues

Issues on www.ayushrai.site found on 14 October 2026, after [PR #6](https://github.com/ayushrai-hub/ayush-work/pull/6) was merged and deployed. The status table below records which ones the `fix/known-issues` branch fixed.

None of these break the live site today. They were found while documenting every source file. Some need a content decision from Ayush, some need credentials or dashboard access, and some are code changes that were too large or too risky to include in that pass. Each entry explains the problem, where it lives, why it matters, and a suggested fix.

**How to read this**

- **Priority:** P1 = fix soon (public correctness, privacy, or reliability). P2 = should fix (quality, accessibility, or consistency). P3 = cleanup or a future decision.
- **Owner:** *Ayush* = needs a content or product decision. *Code* = an engineering change anyone can make. *Dashboard* = needs access to Netlify, Vercel, Google Analytics, SendGrid, or npm.

## Remediation status (branch `fix/known-issues`)

The entries below still describe each problem as it was found. This table records what the `fix/known-issues` branch changed. "Fixed" means a code change plus a test. Nothing here has been checked in a dashboard (Netlify, Vercel, SendGrid, Google Analytics, GTM).

| # | Status | What changed | Still open |
| --- | --- | --- | --- |
| 1 | Fixed in code | All three research funding notes now read "No funding claim verified."; the claims moved to `researchFundingNeedsConfirmation`. `publicOutput.test.ts` renders every prerendered page and fails on internal markers or withheld claims. | Ayush: confirm or reject each funding source. |
| 2 | Fixed in code | `/uses` and `/principles` now describe Open Framework as a front-end prototype. PostgreSQL and Docker were removed from `/uses`; their only listed use was the false Open Framework claim. | Ayush: confirm the wording, and whether PostgreSQL or Docker belong on `/uses` for other work. |
| 3 | Fixed | `ErrorBoundary` wraps the page area in `SiteLayout`, resets on navigation, reloads once on a chunk-load error (`src/lib/chunkReload.ts`), sends one gtag `exception`. `ErrorBoundary.test.tsx`. | — |
| 4 | Fixed | 52 unreachable legacy files and their 16 never-run tests deleted; 10 packages only they used removed. | — (the phone number is now published on purpose, so its presence in git history no longer matters). |
| 5 | Partly fixed | No placeholder sender; missing `FROM_EMAIL` gives "Email service not configured". Honeypot, field length limits, 5 messages per 10 minutes per client (per instance), CR/LF stripped from headers, site-only CORS, non-JSON replies reported with their HTTP status. `contactEmail.test.ts`, `pageStates.test.tsx`. | Dashboard: confirm `SENDGRID_API_KEY` and `FROM_EMAIL` on the serving host and send one real message. Ayush: Turnstile or hCaptcha; the 5-per-10-minutes quota. |
| 6 | Open | — | Ayush: the real dates. |
| 7 | Fixed | Visitors see "More here soon."; the repository path is only in a code comment. | Ayush may reword. |
| 8 | Fixed | `/resume` description no longer promises a download; `/recognition` copy matches the archive button; `/contact` reads `person.responseTime`. | — |
| 9 | Partly fixed | Markdown skips empty date ranges; work and research twins print the same caveats as the HTML; timeline links carry `#slug` anchors. | Ayush: hosting wording, AyushMushrooms tense, overlay naming and "demo" link, agritech vs agrotech. |
| 10 | Not changed (blocked) | Measured; see issue 10. `createRoot` stays. | Code: see the blockers in issue 10. |
| 11 | Fixed | Search is a combobox with arrow keys, Enter, a focus trap, focus return, and a platform shortcut label; "More" is a disclosure that closes on Escape and outside press. Vitest with jest-axe, and Playwright. | — |
| 12 | Fixed | Agent view sets its own title, canonical, and `noindex`, works on trailing-slash URLs, and names the platform's copy shortcut. Empty product logs are `noindex`. Unknown detail slugs render `MissingRecord` with `noindex`. | — |
| 13 | Fixed (policy kept) | REST CORS stays limited to the site's origins (`src/lib/siteOrigins.ts`), now stated on `/developers`, in OpenAPI, and in `docs/API_ENDPOINTS.md`, with a test. | Ayush: open REST to `*` only if cross-origin browser use is wanted. |
| 14 | Mostly fixed | MCP `search_portfolio` and WebMCP accept `limit` and `cursor`; `compare_projects` accepts `includeArchive`. | Decision: malformed compare slugs still go to `missing` (REST and MCP alike). A 400 would be a breaking v1 change. |
| 15 | Fixed | `/api/projects` documents `category`, `type`, `limit`, and `slugs`; 400 and 404 declare RateLimit headers. A test reads every `params.get` in `http.ts` and checks it is documented. | — |
| 16 | Partly fixed | No shared `anonymous` bucket (User-Agent hash); the Server Card 405 carries RateLimit headers. | Dashboard: a global limit (Netlify rules or Vercel Firewall). |
| 17 | Fixed | Both copies parse q-values; a parity test runs the same table through `surfaces.ts` and the edge function. | — |
| 18 | Fixed | The 21 Accept-conditioned redirects are gone from `netlify.toml`. | Verify `Accept: text/markdown` on production after deploy. |
| 19 | Partly fixed | One `Window.gtag`/`dataLayer` declaration (no TS2717); unused GA and GTM helpers removed; `VITE_GTM_ID` typed and documented in `.env.example`. `GTMProvider` and every tag and ID are unchanged. | Dashboard: GA4 history page views, GTM GA4 tag (double counting), Vercel Analytics. |
| 20 | Open | — | Code: small; not done. |
| 21 | Fixed | Dead files and unused exports removed; `SEARCH_TYPES` is the content layer's `SEARCH_ITEM_TYPES`, and `SearchItem["type"]` is derived from it. | — |
| 22 | Fixed | `src/__tests__/legacy/` deleted. | — |
| 23 | Fixed | Coverage 96.4% lines, 88.3% branches, 93.1% functions; `vite.config.ts` thresholds 95/95/87/91 fail `npm run test:coverage` and CI below that. | — |
| 24 | Open | — | Ayush: one production host. |
| 25 | Open | — | Ayush: license, CLI publishing, registries. |
| 26 | Fixed | `person.footerLine`, label maps in `WorkRow`, `person.portrait` in JSON-LD, `audienceDescription` in `RoleSelector`. | — |

## Summary

| # | Issue | Priority | Owner |
| --- | --- | --- | --- |
| 1 | Unconfirmed funding notes are published on research pages | P1 | Ayush |
| 2 | The Open Framework is described inconsistently across pages | P1 | Ayush |
| 3 | No error boundary in the live app | P1 | Code |
| 4 | Legacy code still contains the phone number, withheld awards, and prices | P1 | Ayush + Code |
| 5 | Contact form: sender address, abuse protection, and env vars not verified | P1 | Dashboard + Code |
| 6 | Timeline and `/now` dates conflict with other records | P2 | Ayush |
| 7 | Internal file path is shown to visitors | P2 | Ayush + Code |
| 8 | Page copy that promises things the page doesn't do | P2 | Ayush |
| 9 | Smaller content inconsistencies | P2 | Ayush |
| 10 | The client re-renders the page instead of hydrating it | P2 | Code |
| 11 | Search dialog and "More" menu keyboard accessibility | P2 | Code |
| 12 | Agent view and edge cases in page metadata | P2 | Code |
| 13 | CORS policy differs between the REST API and MCP | P2 | Ayush (policy) + Code |
| 14 | MCP tools are missing options the REST API has | P2 | Code |
| 15 | OpenAPI document is incomplete for `/api/projects` | P2 | Code |
| 16 | Rate limiting is per instance only | P2 | Dashboard |
| 17 | `Accept` header parsing ignores quality values | P3 | Code |
| 18 | Dead Netlify rewrite rules for Markdown negotiation | P3 | Code |
| 19 | Analytics: unverified collection, type conflict, dormant GTM loader | P2 | Dashboard + Code |
| 20 | Dev server differs from production | P3 | Code |
| 21 | Dead code and unused exports | P3 | Code |
| 22 | Legacy tests never run | P3 | Code |
| 23 | Test coverage is low and has no threshold | P3 | Code |
| 24 | Two production hosts build the same branch | P2 | Ayush |
| 25 | No license; CLI, SDK, and registry listings unpublished | P3 | Ayush |
| 26 | Small text-handling fragilities | P3 | Code |

---

## Content and accuracy

### 1. Unconfirmed funding notes are published on research pages (P1, Ayush)

**What happens.** Two research records have a `fundingNote` that still contains the internal marker `needsConfirmation`:

- `legal-nlp-contracts`: "LNCT Internal Research Grant — needsConfirmation."
- `smart-campus-energy`: "BHOPAL SMART CITY INITIATIVE — needsConfirmation."

`src/pages/ResearchDetailPage.tsx` and the Markdown twin (`src/lib/agent/markdown.ts`) print `fundingNote` word for word. So `/research/legal-nlp-contracts/`, `/research/smart-campus-energy/`, their `.md` twins, and `/llms-full.txt` all show these strings to visitors and agents.

**Where.** `src/content/research.ts` lines 69 and 95.

**Why it matters.** `AGENTS.md` says unconfirmed claims must stay in `needsConfirmation` lists and never be published. This is the only place on the site where that rule is broken. It also exposes an internal field name in public copy.

**Suggested fix.**
1. Ayush confirms or rejects each funding source.
2. If it is confirmed, replace the note with plain text, for example "Supported by an LNCT internal research grant."
3. If it is not confirmed, set `fundingNote` to "No funding claim verified." (as `agri-advisory-ai` does) and move the claim into that record's `needsConfirmation` list.
4. Add a test that no public Markdown contains the string `needsConfirmation`. It would sit alongside the phone-number checks in `src/__tests__/agentSurfaces.test.ts`.

### 2. The Open Framework is described inconsistently across pages (P1, Ayush)

**What happens.** The case study and product page say it is a Vite + React prototype with mock authentication, at the `building` stage (`src/content/work.ts`, `products.ts`; verified in `docs/content-fact-check.md` §13). Two other pages say otherwise:

- `/uses` (`src/content/uses.ts`) lists it under Next.js, with PostgreSQL and Docker as its architecture.
- `/principles` (`src/content/principles.ts`) says its architecture "starts from RBAC" and that it "ships as MVP". No role-based access control is implemented, and it is not at MVP.

**Why it matters.** This is the flagship product. A recruiter or agent comparing pages sees contradictory technical claims, and the fact-check log explicitly says not to name PostgreSQL or a backend that doesn't exist.

**Suggested fix.** Rewrite the `/uses` entry to the real stack (Vite, React, TypeScript, Tailwind). Rephrase the principle so it describes intent ("designed around role-based access, not yet implemented") or uses a different example. No code change is needed.

### 6. Timeline and `/now` dates conflict with other records (P2, Ayush)

**What happens.**
- `/timeline` places The Open Framework in 2024, but its repository was created in December 2025 and its work record starts in 2025.
- The Google Cloud entry on the timeline is dated 2020, while `/recognition` says 2020–2024.
- `/now` shows two different dates: `now.lastUpdated` is 2026-09-29 and `siteMeta.pages.now` is 2026-08-08. `/now.md` prints both.
- `siteMeta.pages.resume` exists but nothing reads it.

**Where.** `src/content/timeline.ts`, `now.ts`, `siteMeta.ts`, `recognition.ts`.

**Suggested fix.** Confirm the real dates and use one source per fact. For `/now`, either drop `now.lastUpdated` and use `pageUpdatedAt("now")` everywhere, or the reverse. Delete the unused `resume` key, or start using it on `/resume`.

### 7. Internal file path is shown to visitors (P2, Ayush + Code)

**What happens.** `src/components/editorial/EmptyNote.tsx` renders a placeholder that mentions `docs/questions-for-ayush.md`, a file in this repository. It appears on `/writing` today, and on `/uses`, `/now`, and writing detail pages whenever an item is marked `todo`.

**Why it matters.** Visitors can't open that file, and it reads like a leftover from development.

**Suggested fix.** Change the copy to something visitor-facing, for example "More here soon." Keep the repository path in a code comment only. Ayush picks the wording; the change is one line.

### 8. Page copy that promises things the page doesn't do (P2, Ayush)

| Page | Says | Reality | Fix |
| --- | --- | --- | --- |
| `/resume` (`ResumePage.tsx:23`) | Meta description: "plus resume download" | No download link is rendered; `person.resumeUrl` is not used on the page | Add a link to a hosted PDF, or remove "download" from the description |
| `/recognition` (`RecognitionPage.tsx:42`) | "Archive available on request" | The page has a button that shows the archive | Change to "Older items are in the archive below" |
| `/contact` (`ContactPage.tsx:91`) | "Usual reply time: <24 hrs" (hard-coded) | Same value as `person.responseTime` today, but the two will drift when one changes | Render `person.responseTime` so there is one source |

### 9. Smaller content inconsistencies (P2, Ayush)

- **Education dates.** The IIT Madras entry in `src/content/education.ts` has an empty start and end. The HTML page hides the row, but the Markdown twin prints a bare " – ". Add dates, or make `markdown.ts` skip empty ranges (a code fix that is worth doing either way).
- **Hosting wording.** `/uses` says Netlify hosts the site. `/privacy` says Netlify and possibly Vercel. The `personal-portfolio` project lists only Netlify. See issue 24, then state it the same way in all three.
- **AyushMushrooms architecture.** It lists a headless CMS (Sanity/Strapi), PDF generation, and a CRM webhook in the present tense, with no "built vs planned" breakdown. The other products separate the two.
- **Naming.** The work item is "Overlay Text Box" and the project is "Overlay Text Box Extension". Its "demo" link points to GitHub, not a demo. "agritech" and "agrotech" are both used.
- **HTML vs Markdown.** The per-item `needsConfirmation` caveats show on the work and research HTML pages but are left out of the Markdown twins. Decide whether agents should see the same caveats. Including them is the safer default, as long as the withheld award and leadership lists stay out.
- **Timeline anchors.** Timeline entries for roles, leadership, and recognition link to the list page without the `#slug` anchor, even though those pages have anchors. A small improvement in `relatedHref` in `src/pages/TimelinePage.tsx`.

### 4. Legacy code still contains the phone number, withheld awards, and prices (P1, Ayush + Code)

**What happens.** The old single-page portfolio's components are still in the repository. They are not imported by the live site, are excluded from `tsconfig.app.json`, and do not appear in `dist/`. But they contain material the live site deliberately withholds:

- The phone number: `src/components/Hero.tsx`, `src/components/Contact.tsx`, `src/lib/profilesData.ts` (a WhatsApp link), and `src/__tests__/legacy/Hero.test.tsx`.
- Withheld research awards: `src/components/Research.tsx` and its legacy test.
- Old service prices: `src/components/Services.tsx` and its legacy test.

**Why it matters.** The repository is public on GitHub, so the phone number is public there even though the website doesn't show it. Anyone, human or agent, who wires a legacy component back in would republish it.

**Suggested fix.** The old site is already preserved on branch `archive/portfolio-spa-2026` and tag `legacy-portfolio-spa`, so the legacy folders can be deleted from `main` with no loss:

- top-level `src/components/*.tsx`
- `src/components/{backgrounds,ui,pages}/`
- `src/components/layout/{Footer,Header,SEO,GTMProvider}.tsx`
- `src/lib/profilesData.ts`, `securityLogger.ts`, `seo.ts`, `webVitals.ts`, `src/hooks/useGTM.ts`
- `src/__tests__/legacy/`

Keep `src/components/layout/ErrorBoundary.tsx` if issue 3 is fixed with it. Deleting the files does not remove the number from git history; removing it there needs a history rewrite and a force-push, which is a separate decision for Ayush.

---

## Reliability and user experience

### 3. No error boundary in the live app (P1, Code)

**What happens.** `src/components/layout/ErrorBoundary.tsx` exists, but nothing in `src/main.tsx`, `src/App.tsx`, or `src/components/site/` mounts it. Only its unit test imports it.

**Why it matters.** If any page component throws while rendering, React unmounts the whole tree and the visitor sees a blank page with no navigation. A failed lazy chunk download after a redeploy, where old chunk names no longer exist, triggers exactly this.

**Suggested fix.**
1. Wrap the `<Outlet />` (or the `<Suspense>`) inside `SiteLayout` with an error boundary, so the header and footer survive and only the page area shows an error.
2. Give the fallback a "Reload" button, and on a chunk-load error reload once automatically.
3. Restyle `ErrorBoundary` with the site's design tokens; it currently uses raw Tailwind red and gray. Remove its `securityLogger` call, which would send a second, duplicate gtag event.
4. Add a test that a throwing page renders the fallback inside the layout.

### 10. The client re-renders the page instead of hydrating it (P2, Code)

**What happens.** Every route is prerendered to HTML at build time, but `src/main.tsx` uses `createRoot(...).render(...)`, not `hydrateRoot`. React throws away the server markup and renders the page again from scratch.

**Why it matters.** Visitors see a flash or layout shift when JavaScript loads, Largest Contentful Paint and Cumulative Layout Shift get worse, and the work of rendering happens twice.

**Suggested fix.** Switch to `hydrateRoot` with the same provider tree as `src/entry-server.tsx`, and wrap lazy routes so the first render matches the server output. Usually that means preloading the matching route chunk before hydrating. Then fix any hydration mismatch warnings in dev (theme class, dates, `window` checks). This needs careful testing, which is why it was not part of the comment pass.

**Measured on 14 October 2026 (not shipped).** A copy of the branch was built with `hydrateRoot` and the same provider tree, served with `vite preview`, and 63 page loads in Chromium were checked through `onRecoverableError`:

- All 56 prerendered routes, in light mode with no query string, hydrated with no errors. Lazy route chunks were not a problem.
- Every page loaded with a saved dark theme failed (React #418): `ThemeProvider` reads `localStorage` in its first render, so the header's theme button icon and label differ from the light-mode prerender.
- `?agent=1` failed (#418, #425): `SiteLayout` renders `AgentView` instead of the page, but the prerendered file has no query.
- `?audience=recruiter` and `?audience=research` failed (#418, #425): the home page reorders sections from the query.

So `createRoot` stays. To switch safely: start the theme as `light` on both sides and apply the stored theme after mount (with an inline `<html>` class script in `index.html` to avoid a flash), render the query-dependent views only after mount, then add a Playwright test that loads each prerendered route (and those variants) and fails on any recoverable hydration error.

### 11. Search dialog and "More" menu keyboard accessibility (P2, Code)

**What happens.**
- **Search dialog** (`src/components/site/SearchDialog.tsx`):
  - It uses `role="listbox"` and `role="option"` but has no arrow-key navigation, and every option has `aria-selected={false}`.
  - Focus isn't trapped inside the dialog, and it isn't returned to the trigger when the dialog closes.
  - The footer hint only mentions ⌘K, although Ctrl+K also works.
- **Header "More" menu** (`src/components/site/SiteHeader.tsx`):
  - It uses `role="menu"` and `role="menuitem"` without the arrow-key behavior that pattern requires.
  - Escape and clicking outside don't close it; only a route change or clicking "More" again does.

**Why it matters.** Screen-reader users are told these are a listbox and a menu, then the expected keys don't work. This is a WCAG 2.1 AA problem (4.1.2 and 2.1.1).

**Suggested fix.**
- **Search:** either implement the combobox pattern (arrow keys move `aria-activedescendant`, Enter opens) or drop the roles and use a plain list of links. Add a focus trap, restore focus on close, and show "⌘K / Ctrl K" based on the platform.
- **More menu:** the simplest correct fix is to remove `role="menu"` and `role="menuitem"` and treat it as a disclosure with links. Then add Escape and outside-click handlers.
- Add Playwright checks for keyboard use.

### 12. Agent view and edge cases in page metadata (P2, Code)

- **Agent view head tags.** With `?agent=1`, the page's own `PageSEO` doesn't render, so the document keeps a stale or default `<title>` and no canonical link. Set a title such as "<Page> (Markdown) · Ayush Rai" and a canonical pointing to the human page.
- **Copy hint.** "Selected. Press ⌘C" makes no sense on Windows or Linux. Detect the platform, or say "Press Ctrl+C or ⌘C".
- **Empty product logs** are prerendered and kept out of the sitemap, but `ProductLogPage` doesn't set `noIndex`, so search engines can still index a thin page. Pass `noIndex` when `product.log.length === 0`.
- **"Not found" states on detail pages** (unknown slugs on work, products, research, notes, writing) render without `PageSEO`. A direct visit already gets HTTP 404 from the host, so this is not a soft 404. But after client-side navigation the title of the previous page stays. Render `PageSEO` with `noIndex`, or reuse `NotFoundPage`.

### 26. Small text-handling fragilities (P3, Code)

- `SiteFooter` shows `person.positioning.split(".")[0]`, which breaks on text like "e.g." or "v1.0". Add a dedicated short field in `src/content/person.ts`.
- `WorkRow` uses `type.replace("-", " ")`, which only replaces the first hyphen. Use `replaceAll` or the label maps in `src/content`.
- `PageSEO` hard-codes `/IMG_0029.jpeg` in the Person JSON-LD instead of `defaultSEO.image`.
- `RoleSelector` repeats the lookup that `audienceDescription()` in `src/lib/agent/audiences.ts` already does, and that function is otherwise unused.

---

## Contact form

### 5. Contact form: sender address, abuse protection, and env vars not verified (P1, Dashboard + Code)

**What happens.**
- **Environment variables.** `/api/send-email` needs `SENDGRID_API_KEY` and a SendGrid-verified `FROM_EMAIL` on whichever host serves the site. Whether they are set in Netlify and Vercel has not been verified from this repository. The live function answers validation errors correctly, which only shows that the code runs.
- **Fallback sender.** If `FROM_EMAIL` is missing, `src/lib/server/contactEmail.ts` falls back to `noreply@yourdomain.com`. SendGrid rejects that, so every message would fail with a 500.
- **No abuse protection.** The endpoint has no rate limit, CAPTCHA, or honeypot, so a script can make it send unlimited email through the SendGrid account.
- **Error reporting.** `src/lib/emailService.ts` reports any non-JSON response, such as a host error page, as "Network error", which hides the real cause.

**Suggested fix.**
1. In the Netlify and Vercel dashboards, confirm that `SENDGRID_API_KEY` and `FROM_EMAIL` exist for production (names only; never paste values into the repo). Send one real test message from `/contact`.
2. Remove the placeholder fallback and return "Email service not configured" when `FROM_EMAIL` is missing, as the code already does for the API key.
3. Add abuse protection. The cheapest step is a hidden honeypot field plus the existing in-memory rate limiter (`src/lib/agent/rateLimit.ts`) applied to this function. For stronger protection, add Cloudflare Turnstile or hCaptcha, which needs a site key and a secret key.
4. In `emailService.ts`, show the HTTP status when the response isn't JSON.

---

## API, MCP, and agent surfaces

### 13. CORS policy differs between the REST API and MCP (P2, Ayush + Code)

**What happens.** The REST API (`/api/v1/*`) only sends `Access-Control-Allow-Origin` for the site's own origins and localhost (`ALLOWED_ORIGINS` in `src/lib/agent/http.ts`). The MCP endpoint, the Server Card, and the JSON 404 send `*`.

**Why it matters.** The docs call the API "free and public", but a browser app on another site can't read REST responses, while it can call MCP. Server-side clients, agents, and the CLI are unaffected.

**Suggested fix.** Decide the policy. The API is read-only and holds only public data, so allowing `*` on REST is low risk and matches the docs. If Ayush prefers to keep REST same-origin only, say so in `/developers` and `docs/API_ENDPOINTS.md`. Either way, update the tests in `src/__tests__/agentSurfaces.test.ts`.

### 14. MCP tools are missing options the REST API has (P2, Code)

- **No paging.** `search_portfolio` (MCP) and `search_portfolio_projects` (WebMCP) return `nextCursor` but don't accept `cursor` or `limit`, so callers can never get page two.
- **No archive option.** `compare_projects` has no `includeArchive` argument, while `/api/v1/compare` accepts `archive=1`.
- **Slug format isn't checked.** `comparePublicProjects` puts a malformed slug in `missing`, while `/api/v1/projects/{slug}` rejects the same slug with 400 `invalid_slug`.

**Suggested fix.** Add `cursor` and `limit` to the search tool schemas in `src/lib/agent/mcpServer.ts` and `searchTool.ts`, reusing `decodeCursor` and `parseLimit`. Add `includeArchive` to `compare_projects`. Run `validateSlug` on each compare slug. Update the Server Card tool list and tests.

### 15. OpenAPI document is incomplete for `/api/projects` (P2, Code)

**What happens.** `src/lib/agent/openapi.ts` doesn't list the `category`, `type`, and `limit` parameters for `/api/projects`, although `projectsHttp` accepts them. Its 400 and 404 responses also don't declare the `RateLimit` and `RateLimit-Policy` headers that the API actually sends.

**Suggested fix.** Add the parameters, using the label maps for `enum` values, and the headers to those responses. Extend the OpenAPI test in `src/__tests__/agentReadiness.test.ts` to check that every query parameter read in `http.ts` is documented.

### 16. Rate limiting is per instance only (P2, Dashboard)

**What happens.** `src/lib/agent/rateLimit.ts` keeps counters in memory inside each function instance. Netlify and Vercel run many instances, so the real limit is 60 requests per minute *per instance*, and counters reset on cold start. Requests with no client address all share a single `anonymous` key, so they can throttle each other. The 405 response from the Server Card also omits the rate-limit headers.

**Why it matters.** It is a courtesy limit, not protection against abuse. The headers are honest about remaining quota only within one instance.

**Suggested fix.** For a real global limit, use the host: Netlify rate-limiting rules or Vercel Firewall rate limiting on `/api/*`. Both need dashboard access and may need a paid plan. A shared store (Upstash Redis or Netlify Blobs) would also work, but adds a dependency and a secret. Fall back to a hash of the user agent instead of a single `anonymous` key.

### 17. `Accept` header parsing ignores quality values (P3, Code)

**What happens.** `wantsMarkdown` in `src/lib/agent/surfaces.ts`, and its copy in `netlify/edge-functions/markdown-negotiation.js`, match substrings. `Accept: text/markdown;q=0` still gets Markdown, and any mention of `text/html`, even with `q=0.1`, blocks it.

**Suggested fix.** Parse the header into media ranges with q-values, and pick Markdown when its q is greater than zero and higher than `text/html`'s. Keep the two copies identical and extend the existing parity test.

### 18. Dead Netlify rewrite rules for Markdown negotiation (P3, Code)

**What happens.** `netlify.toml` lines 43–191 contain about 20 redirect rules with `conditions = {Accept = ["text/markdown"]}` and `force = true`. Netlify redirect conditions only support Language, Country, Role, and Cookie, so these rules never fire. The edge function `markdown-negotiation.js` does the real work.

**Why it matters.** They mislead anyone reading the config, and `force = true` on a rule that someday matched would override prerendered HTML, which `AGENTS.md` forbids.

**Suggested fix.** Delete those rules and leave a one-line comment pointing to the edge function. Then confirm on a deploy preview that `curl -H 'Accept: text/markdown' https://<preview>/` still returns Markdown.

---

## Analytics and tracking

### 19. Analytics: unverified collection, type conflict, dormant GTM loader (P2, Dashboard + Code)

**What happens.**
- **GA4 route changes.** GA4 (`G-VBS0YJ07R8`) loads from the inline snippet in `index.html`. Since PR #6, `initGA()` no longer configures it a second time. No code reports client-side route changes (`trackPageView` is never called), so page views after the first depend on GA4's "page changes based on browser history events" setting.
- **Vercel Web Analytics.** It is mounted in `src/main.tsx`, but it only collects data if enabled in the Vercel dashboard, and only on traffic Vercel serves. Production traffic goes through Netlify (issue 24).
- **Google Tag Manager.**
  - `GTM-NJZ5ZBX4` loads from `index.html`.
  - `src/components/layout/GTMProvider.tsx` only injects its own copy when `GTM_ID` differs from the default, and `VITE_GTM_ID` isn't in `.env.example`.
  - GTM and a direct GA4 tag both on the page can double-count if GTM also fires a GA4 tag.
- **Type conflict.** `Window.gtag` is declared differently in `src/lib/gtm.ts` and `src/vite-env.d.ts` (TS2717). `skipLibCheck` hides the error.

**Why it matters.** Nobody can say analytics numbers are accurate until someone checks the dashboards. Double-counting or missing route changes would skew every report.

**Suggested fix.**
1. In GA4 Admin → Data streams → Enhanced measurement, confirm that "Page changes based on browser history events" is on.
2. Open GTM and check whether the container fires a GA4 configuration tag. If it does, remove either that tag or the direct gtag snippet so GA4 loads exactly once.
3. Use GA4 DebugView or Tag Assistant to confirm that one page view fires per navigation.
4. Decide whether Vercel Analytics is worth keeping, given issue 24.
5. Delete one of the two `Window.gtag` declarations so the types agree.
6. Either remove the dormant `GTMProvider` loader, or document `VITE_GTM_ID` in `.env.example`.

---

## Development and code health

### 20. Dev server differs from production (P3, Code)

- In `npm run dev`, `src/lib/agent/vitePlugin.ts` sends every `/api/*` path to the read-only API, so `POST /api/send-email` returns 405 locally. Use `npm run netlify:dev` to test the contact form, or make the plugin skip that path so it 404s clearly.
- A direct request for `/404.md` returns 404 in dev; production serves it as a static file with 200. This is harmless, but surprising when testing.

### 21. Dead code and unused exports (P3, Code)

Nothing in the live site uses any of these:

- `src/lib/webVitals.ts` and the `web-vitals` dependency.
- **`src/lib/securityLogger.ts`.** Most of its reporting helpers are unused, and it starts a `setInterval` on import that is never cleared.
- **`src/lib/analytics.ts`:** `trackPageView`, `trackGoogleAnalyticsEvent`, `trackPortfolioInteraction`, `trackProjectClick`, and `trackSocialClick`.
- **The agent layer:** `audienceDescription`, `listPublicProjects`, and `projectHref`.
- **Content helpers:** `projectsByType`, `currentExperience`, `getExperienceBySlug`, and the `LinkRef` type. `productsByCategory` is only used inside its own file.
- **`src/setupTests.ts`.** The chart.js and `next/image` mocks are unused, and `ResizeObserver` is defined twice.
- **`SEARCH_TYPES`.** The list in `src/lib/agent/search.ts` repeats the `SearchItem["type"]` union from `src/content/types.ts`, so the two can drift apart. Derive one from the other.

**Suggested fix.** Delete them together with the legacy cleanup in issue 4, then run lint, typecheck, tests, and the build.

### 22. Legacy tests never run (P3, Code)

**What happens.** `src/__tests__/legacy/*` (16 files) is excluded from Vitest and `tsconfig`, and every `../components/...` import in those files resolves under `src/__tests__/`, where nothing exists. Some assertions describe behavior the components never had.

**Suggested fix.** Delete them along with the legacy components (issue 4). They give a false sense of coverage.

### 23. Test coverage is low and has no threshold (P3, Code)

**What happens.** Line coverage was about 48% at the last measurement, and CI no longer enforces a threshold. The 85% gate was removed because it had never passed. Most pages are only exercised indirectly by e2e tests.

**Suggested fix.** Add component tests for the pages with logic (`HomePage` role ordering, `ContactPage` states, `SearchDialog`, `AgentView`). Then set a threshold slightly below the measured value in `vite.config.ts` (`test.coverage.thresholds`) and raise it over time.

---

## Hosting and product decisions

### 24. Two production hosts build the same branch (P2, Ayush)

**What happens.** Every merge into `main` deploys to both Netlify and Vercel. Netlify serves `www.ayushrai.site` (response header `server: Netlify`). Vercel builds a production deployment as well, but no custom domain points at it.

**Why it matters.**
- Behavior depends on two parallel configurations, `netlify.toml` + edge function and `vercel.json` + `middleware.ts`, which must be kept in sync by hand.
- Analytics (issue 19), rate limits (issue 16), and environment variables (issue 5) all have to be set up twice.
- The privacy page has to hedge about which host processes requests.

**Suggested fix.** Choose one production host.
- **To stay on Netlify:** disconnect or pause the Vercel project, or keep it for previews only, and simplify the privacy text.
- **To move to Vercel:** follow the "Safe rollout" steps in `docs/deployment/vercel.md`, changing DNS only after a preview passes every check.

Either way, this is Ayush's decision; no DNS or host connection was changed in this pass.

### 25. No license; CLI, SDK, and registry listings unpublished (P3, Ayush)

- **No license.** The repository has no license file, so by default nobody may reuse the code. `packages/cli/package.json` is marked `"private": true` and `"license": "UNLICENSED"` for that reason. Pick a license (MIT is common for personal sites; content can stay "all rights reserved" with a separate note).
- **CLI.** `packages/cli` works and is tested, but isn't published. Publishing needs an npm account, a free package name, and the license decision. Then remove `"private": true` and run `npm publish`.
- **SDK and A2A agent card.** Neither exists. They are not needed for current use; `AGENTS.md` correctly says they are not implemented.
- **MCP registries.** The server isn't listed on the official MCP registry, Smithery, or mcp.so. Listing it needs an account on each, and possibly a DNS or GitHub-based namespace check for `site.ayushrai/portfolio`.
- **Search ranking for "Ayush Rai".** This depends on Google indexing, not on code. Verify the domain in Google Search Console, submit `https://www.ayushrai.site/sitemap.xml`, and follow `docs/seo/measurement-plan.md`.

---

## Already fixed in PR #6 (for reference)

These were found in the same review and are no longer open:

- The contact email now HTML-escapes visitor input. Malformed JSON and non-string fields return 400.
- Project `category` and `type` filters reject inherited keys such as `toString`.
- The timeline's Legal NLP entry links to `/research/legal-nlp-contracts` instead of a missing work page.
- `/writing/:slug` pages are prerendered, so their Markdown twins no longer point to a 404.
- `initGA()` no longer configures GA4 a second time on top of the `index.html` snippet.
- The Agent view download no longer cancels itself in Safari and Firefox.
- A failed WebMCP registration logs a warning instead of an unhandled rejection.
