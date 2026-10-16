# SEO + AI SEO + Agentic SEO execution report — 16 Oct 2026

## A. Changes made

### Already in working tree (agent readiness — Priority D)

| Change | Why | Files |
| --- | --- | --- |
| ARD v0.91 + `displayName` + HTTPS trust identity | Prod AI Catalog invalid; `ard.json` 404 | `mcpCard.ts`, `surfaces.ts`, host headers |
| `/auth.md` | Document public unauthenticated API (no fake OAuth) | `authDocs.ts` |
| `/?mode=agent` JSON | Homepage was identical for agents | `agentMode.ts`, edge, middleware |
| Classic `/webmcp.js` | Scanner missed React-bundled WebMCP | `public/webmcp.js`, `index.html` |
| NLWeb-shaped `/ask` | Lexical ask over same search index | `nlwebAsk.ts`, `api/ask.ts` |
| MCP `instructions` + structured tool errors | Initialize identity incomplete | `mcpServer.ts`, `mcpCard.ts` |
| Agent-bot Markdown when Accept does not prefer HTML | Bot UA + wildcard Accept got HTML | `surfaces.ts`, Netlify edge |

### SEO / conversion (Priorities A–C)

| Change | Why | Files |
| --- | --- | --- |
| Brand meta + tagline/positioning | Weak branded SERP; stale shell meta | `index.html`, `constants/seo.ts`, `person.ts` |
| Person `knowsAbout` | Entity clarity for AI retrieval | `PageSEO.tsx` |
| Domain / work / product meta lead with name | Disambiguate “Ayush Rai” collisions | `domains.ts`, page SEO props |
| Flagship outcome clarity | Works vs remaining buried | `work.ts` (Open Framework, AGENYRA, MedVoice) |
| Shared `ContactCta` | Soft conversion path | `ContactCta.tsx`, Home, About, Domain, Work, Work detail, Products, Product detail |
| `life.ayushrai.site` | Verified host for MyLifeOS | `person.ts`, `elsewhere.ts`, `projects.ts` |

**Not invented:** metrics, clients, OAuth, A2A, Wikidata, payment rails.

## B. Verified improvements

### Local (build / tests)

| Check | Result |
| --- | --- |
| `npm run lint` | Pass (re-run after final CTA patch) |
| `npm run typecheck` | Pass |
| `npx vitest run` | Pass (119) prior to last CTA patch — re-run below |
| `npm run build` | Emits `dist/.well-known/ard.json`, `auth.md`, `agent-mode.json`, `webmcp.js` |
| Dist Person JSON-LD | Includes `knowsAbout`; description names ayushrai.site |
| Agent e2e | Pass (4) against Vite middleware |

### Production (live HTTP, pre-deploy)

| URL | Status | Note |
| --- | --- | --- |
| `/` | 200 | Title OK; **old** description still live; **no Bhopal** in HTML |
| `/.well-known/ard.json` | **404** | Undeployed |
| `/auth.md` | **404** | Undeployed |
| `/?mode=agent` | 200 **HTML** | Undeployed JSON mode |
| `/webmcp.js` | **404** | Undeployed |
| `/ask` | **404** | Undeployed |
| Domain hubs / 404s / API | Working | Strengths preserved |

## C. Case-study quality

Flagship `/work/{the-open-framework,agenyra,medvoice}` already had Problem, Role, Thinking, Execution, Outcome, Lessons, and confirmation lists. This pass added explicit **what works / remaining** sentences inside Outcome, drawn from existing execution text — no new metrics.

## D. SEO and AI discovery

| Item | Status |
| --- | --- |
| Canonical / sitemap / robots / soft 404 | Already good in prod |
| Brand meta + schema `knowsAbout` | Fixed in repo |
| Markdown / llms / OpenAPI / MCP | Working; enhanced in repo |
| ARD / auth / agent mode / WebMCP / ask | Fixed in repo; **not in prod** |
| OAuth / A2A / payments / Wikipedia | Intentionally out of scope |

## E. Tests

| Command | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npx vitest run` | Pass (119) |
| Pre-existing failures | None observed |

## F. Deployment

**Not deployed.** Blocker: commit/PR/merge authorization. After merge to `main`, Netlify (primary) and Vercel Git integration should publish. Then smoke the agent URLs above.

## G. Measurement

| Available now | Needs owner access |
| --- | --- |
| Production HTTP smoke | GSC indexed/query reports |
| GA4/GTM present in HTML | GA4 conversion events / consent review |
| AI probe set (below) | Manual runs in ChatGPT / etc. |

### AI discovery probe set (repeat monthly)

1. Who is Ayush Rai at ayushrai.site, and what does he do?
2. What evidence supports his LLM evaluation experience?
3. What did he contribute to The Open Framework / MedVoice / AGENYRA?
4. What is MedVoice’s voice-AI role and current status?
5. What freelance/software services does he offer?
6. Where is the resume, GitHub, and contact path?

Record: date, system, accuracy, citation URL, misattribution.

## H. Remaining blockers (owner)

| Blocker | Why | Action needed |
| --- | --- | --- |
| Deploy | Changes only in working tree | Authorize commit → PR → merge to `main` |
| GSC baselines | No authenticated access here | Confirm www property; submit sitemap; export brand vs eval queries |
| LinkedIn / marketplace copy | Live profile fetch blocked (999); SERP snippets overclaim vs site | Approve replacement copy below and edit LinkedIn/Cryptotask/Freelancermap |
| Orank rescan | Needs production | After deploy, `POST https://ora.ai/api/scan` |

### Claim-consistency table (from public SERP snippets + site)

| Claim (external SERP) | Site evidence | Recommendation |
| --- | --- | --- |
| “Production LLM and GenAI systems” | Site says contract evaluation + building products; flagships are in-progress / prototype | Soften LinkedIn to match site: evaluation + product-building with stage honesty |
| “RLHF pipelines” | Site: RLHF-*oriented* human feedback / evaluation, not reward-model training | Prefer “preference feedback / LLM evaluation” wording |
| “Bhopal” in old snippets | Site: Remote; HTML has no Bhopal | GSC URL inspection + wait for recrawl after deploy |
| Name collisions (other Ayush Rais) | Brand meta now includes ayushrai.site | Keep name+domain in titles/descriptions; LinkedIn vanity URL `ayushrai02` |

### Suggested LinkedIn About (for approval — not applied)

> I’m Ayush Rai (ayushrai.site), a remote AI engineer and AI product builder. Paid work includes contract LLM evaluation and preference-feedback review (FoCDoT, Outlier). I also build AI-assisted software products with explicit stage labels — including MedVoice, AGENYRA, and The Open Framework — and I describe what ships versus what remains incomplete.
