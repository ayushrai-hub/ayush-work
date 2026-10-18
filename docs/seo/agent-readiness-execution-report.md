# Agent-readiness execution report

## Follow-up, 18 Oct 2026 (deployed)

The orank list from 18 Oct still read 75/100 from the cached 15 Oct scan, so most "fail" rows (ARD `displayName`, `trustManifest`, MCP icon, agent mode, `/auth.md`, alternates, frontmatter, bot-UA Markdown, MCP `instructions`, `/ask`) describe the old production build, not the current one. This pass shipped the 16 Oct working tree plus:

| Gap | Change | Files |
| --- | --- | --- |
| MCP error handling (1/2) | Unknown tools and schema-invalid arguments now return JSON-RPC `-32602` with `data.code` (`unknown_tool`, `invalid_arguments`). The SDK's default handler wrapped those as `isError` results with no code. Execution failures stay `isError`. | `src/lib/agent/mcpServer.ts`, `agentSurfaces.test.ts` |
| NLWeb streaming | `/ask` returns `text/event-stream` with `start`, `result` (`index`, `item`), `error`, `complete` when `prefer.streaming: true`, `?streaming=true`, or `Accept: text/event-stream`. JSON stays the default. | `nlwebAsk.ts`, `api/ask.ts`, `vitePlugin.ts` |
| NLWeb Schema Feeds | `schemamap:` in robots.txt → `/schemamap.xml` → `/feeds/portfolio.jsonl` (WebSite, Person, case studies, products; the same nodes as page JSON-LD). | `schemaFeed.ts`, `src/lib/structuredData.ts`, `public/robots.txt`, host headers |
| Schema type breadth | Homepage graph adds an `ItemList` of the selected case studies shown on the page. No FAQ, Review, rating, or Offer was invented. | `PageSEO.tsx`, `structuredData.ts` |
| Agent Plugins manifest | Root `plugin.json` + `mcp.json` (streamable-http → `/api/mcp`). Skill `name` renamed to `portfolio-discovery` to match its directory, as the Agent Skills spec requires. | `plugin.json`, `mcp.json`, `skills/portfolio-discovery/SKILL.md` |

Still not built, by decision: A2A card, OAuth PRM/AS metadata, `WWW-Authenticate`, `agent_auth` endpoints, Idempotency-Key, async jobs, batch, Web Bot Auth keys, sandbox, docs-only second MCP, paid pricing tiers. Still external: Wikipedia/Wikidata, Smithery/mcp.so, skills.sh, ChatGPT directory, npm/PyPI publish, brand SERP rank.

Checks before deploy: lint, typecheck, 124 Vitest tests, build (58 prerendered routes), 15 Playwright tests.

---

## Original report, 16 Oct 2026

**Date:** 16 Oct 2026  
**Canonical host:** `https://www.ayushrai.site` (apex `ayushrai.site` → 301 www; Netlify)  
**Repo baseline:** Vite 7 + React 18 + TypeScript; content SSOT in `src/content/`  
**Ora reads (this session):**

| Metric | Value | Source |
| --- | --- | --- |
| Canonical score | **75/100**, grade B | `GET https://ora.ai/api/score/ayushrai.site` (`scannedAt` 2026-10-15T23:59:35Z) |
| Essentials score | **100/100**, “Strong technical baseline” | Same endpoint with `?include=essentials` |
| Spec claim of 66/100 | Not reproduced | Likely an older essentials or is-agentic snapshot |

**Deployment this session:** Not committed, not pushed, not deployed (no authorization).  
**Force rescan:** `POST /api/scan` with `force:true` returned **429** (daily scan budget; `Retry-After` ~22h). Do not claim a higher canonical score until a successful post-deploy rescan.

---

## Executive summary

Most of the Essential and Recommended **code** findings in the 14-item brief were already live on production before this session (real 404s, homepage Markdown negotiation, rate-limit headers, When-to-use guidance, ARD/`displayName`/`trustManifest`, `/auth.md`, `?mode=agent` JSON, `/ask`, MCP instructions, Markdown frontmatter/alternates, agent-UA Markdown, modular `/developers/llms.txt`). Ora’s cached canonical scan still reports many of those as fail—a **measurement lag**, confirmed by live `curl` against www.

This session added the remaining **honest, in-repo** improvements that still moved the needle:

1. Consistent OpenAPI error `$ref`s (400/404/405/429 → shared `ErrorResponse`) for `api-error-model`
2. Literal `document.modelContext` / `navigator.modelContext` / `registerTool` in `public/webmcp.js`
3. Section indexes `/work/llms.txt` and `/products/llms.txt`
4. Honest `/pricing.md` (free public API; no invented tiers)
5. Tests + build verification + this report

Essentials is already maxed. Remaining canonical-score gaps are mostly external (Wikipedia, registries, npm publish, brand SERP) or deliberately N/A (A2A, OAuth, payments, fake sandbox).

---

## Gap matrix (14 brief findings)

| # | Finding | Observed (www, this session) | Root cause / classification | Action |
| --- | --- | --- | --- | --- |
| 1 | Agent-friendly 404 | HTML + MD both **404**; MD body ≥20 chars with llms/sitemap links | Already fixed | Preserve; no code change |
| 2 | Consistent JSON API errors | `{ error: { code, message, hint, docs } }` on unknown `/api/*`, 400, 429 | OpenAPI refs were uneven → Ora `api-error-model` partial | **Fixed** shared `commonErrors` + `MethodNotAllowed` |
| 3 | Homepage MD negotiation | `Accept: text/markdown` → 200 `text/markdown`, `Vary: Accept` | Already fixed (Netlify edge) | Preserve |
| 4 | REST schema coverage | OpenAPI 3.1 with success schemas; errors now uniformly `$ref`’d | Partial Ora credit | **Improved** this session |
| 5 | When-to-use guidance | Present in `/llms.txt` and `AGENTS.md` | Already fixed | Preserve |
| 6 | Rate-limit headers | Live `RateLimit` / `RateLimit-Policy`; 429 + `Retry-After` | Already fixed | Preserve |
| 7 | Developer discoverability | Resources exist; Ora search sample weak | Indexing / SERP | External; not inventable |
| 8 | Brand discoverability | Domain ranks mid for “Ayush Rai Software Engineer” | SEO / positioning | External; persona already AI Engineer |
| 9 | MCP identity / errors | Live initialize has `instructions`; tool errors use `code:` + `structuredContent` | Ora cache stale | Preserve; no fake second MCP |
| 10 | Public API verification | Live GET search/projects/compare/ask | Already working | Preserve |
| 11 | Person JSON-LD `description` | Present on homepage `@graph` Person | Already fixed | Preserve |
| 12 | Trust-anchor pages | `/about`, `/contact`, `/privacy` 200 | Already fixed | Preserve |
| 13 | Versioning / deprecation | Documented in OpenAPI + `/developers` | Already fixed; no fake Sunset dates | Preserve |
| 14 | Protocol / manifests | Live ARD + AI Catalog with `displayName` + HTTPS `trustManifest`; MCP card has icons | Ora cache stale vs live | Preserve; no forged signatures |

---

## Changes in this working tree

| Area | Files | What changed |
| --- | --- | --- |
| OpenAPI errors | `src/lib/agent/openapi.ts`, tests | Every op refs BadRequest / NotFound / MethodNotAllowed / TooManyRequests |
| Pricing | `src/lib/agent/pricingDocs.ts`, `surfaces.ts`, `netlify.toml`, `vercel.json`, `AGENTS.md` | `/pricing.md` free-access statement |
| Modular llms | `markdown.ts`, `surfaces.ts`, `agentMode.ts`, `developerDocs.ts` | `/work/llms.txt`, `/products/llms.txt` |
| WebMCP | `public/webmcp.js` | Literal `document.modelContext` / `registerTool` for scanners |
| Dev serve | `vitePlugin.ts` | Serve any `agentFiles()` key in preview/dev |

---

## Conditional features (explicit decisions)

| Feature | Decision | Why |
| --- | --- | --- |
| A2A `agent-card.json` | **Skip** | No A2A JSON-RPC endpoint |
| OAuth PRM / WWW-Authenticate / agent_auth | **Skip** | Public read-only API; documented in `/auth.md` |
| Idempotency / async jobs / batch | **Skip** | No mutating REST writes |
| Web Bot Auth key directory | **Skip** | Site is not a signing bot; no private keys |
| NLWeb SSE streaming | **Defer** | Sync lexical `/ask` is enough |
| Second “docs” MCP | **Skip** | Would duplicate the portfolio MCP |
| Wikipedia / Wikidata | **External** | Needs human notability decision |
| MCP registries / skills.sh / ChatGPT directory | **External** | Needs accounts + approval |
| npm SDK / CLI publish | **Blocked** | CLI exists in `packages/cli` (`private: true`); publish needs owner auth |
| Fake pricing tiers / Offer | **Skip** | Honest `/pricing.md` instead |
| ARD cryptographic trust | **Skip** | HTTPS identity only; no fabricated signatures |
| schemamap: in robots.txt | **Skip** | No valid NLWeb schema-map feed |

---

## Verification evidence

### Production smoke (www, pre-new-deploy)

| Check | Result |
| --- | --- |
| `GET /` `Accept: text/markdown` | 200, `text/markdown`, frontmatter, `Vary: Accept` |
| `GET /a-definitely-nonexistent-resource-7f3c` HTML | 404, `text/html` |
| Same path `Accept: text/markdown` | 404, Markdown body with llms/sitemap |
| `GET /api/v1/does-not-exist` | 404 JSON `route_not_found` |
| `GET /api/v1/search?limit=999` | 400 + RateLimit headers |
| `GET /?mode=agent` | 200 `application/json` |
| `GET /auth.md` | 200 Markdown |
| `GET /developers/llms.txt` | 200 |
| `POST /api/mcp` initialize | `serverInfo` + `instructions` |
| `GET /ask?q=agents` | 200 NLWeb `_meta.version` 0.55 |
| Person JSON-LD | `description` present |
| GPTBot UA on `/about/` | Markdown twin |

### Local (this branch)

| Command | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npx vitest run` | Pass (120) |
| `npm run build` | Pass; emits `pricing.md`, `work/llms.txt`, `products/llms.txt`, updated `openapi.json` / `webmcp.js` |

### Ora

| Action | Result |
| --- | --- |
| Score + essentials read | Essentials **100**; canonical **75** (stale vs live) |
| Force rescan | **429** daily budget |

---

## Deployment status

| Step | Status |
| --- | --- |
| Commit | Not created (await authorization) |
| Push / PR | Not done |
| Netlify / Vercel deploy | Not done |
| Production smoke of **new** artifacts | Blocked on deploy |
| Official rescan | Blocked on deploy + Ora budget |

**Required next actions (owner):**

1. Review and authorize commit + merge to `main` (Netlify deploys from `main`).
2. After deploy, smoke: `/pricing.md`, `/work/llms.txt`, `/products/llms.txt`, `/openapi.json` error refs, `/webmcp.js` literals.
3. When Ora budget resets, `POST https://ora.ai/api/scan` with `{"url":"ayushrai.site","force":true}` and `?include=essentials`.
4. Optionally publish CLI to npm and/or list MCP registries if those points matter.

---

## Remaining recommendations

**Engineering (after deploy):** Confirm Ora flips ARD/auth/agent-mode/nlweb/webmcp/markdown checks that already pass live; investigate any still-failing check against apex-vs-www redirect behavior.

**Owner / external:** Brand SERP, Wikipedia/Wikidata, Smithery/mcp.so, skills.sh, ChatGPT directory, npm publish.

**Do not build:** Fake A2A, OAuth, payments, forged trust signatures, paid Offer schema, empty schemamap.
