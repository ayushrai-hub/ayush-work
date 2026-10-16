# Agent readiness audit — ayushrai.site

**Date:** 16 Oct 2026  
**Canonical host:** `https://www.ayushrai.site` (apex `ayushrai.site` → 301 www)  
**Baseline orank:** 77/100, Grade B (`GET https://ora.ai/api/score/ayushrai.site`)  
**Repo:** Vite 7 + React 18 + TypeScript; Netlify primary; Vercel also deploys `main`

---

## 1. Repository architecture

| Layer | Implementation |
| --- | --- |
| App | `src/main.tsx` → React Router SPA with prerender (`scripts/prerender.mjs`) |
| Content SSOT | `src/content/*` → HTML, Markdown twins, search, REST, MCP, WebMCP |
| Agent lib | `src/lib/agent/*` (surfaces, markdown, MCP, OpenAPI, rate limit, ARD) |
| Host adapters | `api/*.ts`, `middleware.ts` (Vercel), `netlify/edge-functions/markdown-negotiation.js` |
| Deploy | Merge to `main`; Netlify publish `dist`; SPA fallback must not `force` over static files |

**Already shipped (verified in source + production before this upgrade):** Markdown twins, `/llms.txt`, `/AGENTS.md`, `/openapi.json`, `/api/v1/*`, Streamable HTTP MCP, Server Card, API catalog, typed JSON errors, rate limits, WebMCP React registration (scanner-invisible), Person/WebSite JSON-LD.

---

## 2. Verified baseline (production, 16 Oct 2026)

| Resource | Status | Notes |
| --- | --- | --- |
| `https://ayushrai.site/` | 301 → www | Correct |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/openapi.json` | 200 | Working |
| `/.well-known/ai-catalog.json` | 200 | **Missing `displayName`** |
| `/.well-known/ard.json` | 404 | **Missing** |
| `/?mode=agent` | 200 HTML | **Identical to homepage** |
| `/auth.md` | 404 | **Missing** |
| `/api/v1/projects`, `/api/mcp` | 200 | Working |
| `/.well-known/mcp/server-card.json` | 200 | Name/desc present; icon partial |

Orank layers (cached): Discovery 5/12, Accessibility/Access 56/58, Usability 63/79, Payments 0/0.

---

## 3. Audit findings and evidence

| Finding | Classification | Evidence | Action taken in repo |
| --- | --- | --- | --- |
| AI catalog missing `displayName` | `CONFIRMED_DEFECT` | Live JSON; ora `ard-entries-valid` | Fixed in `mcpCard.ts`; ARD + legacy catalog |
| No `/.well-known/ard.json` | `CONFIRMED_DEFECT` | Live 404; ARD v0.91 | Emit `buildArdManifest()` |
| `?mode=agent` = homepage | `CONFIRMED_DEFECT` | Live HTML; ora `agent-mode-view` | `agentMode.ts` + edge/middleware |
| WebMCP undetected | `CONFIRMED_DEFECT` | ora: scanned 1 bundle, no `modelContext` | Classic `public/webmcp.js` |
| MCP card no icon | `PARTIALLY_IMPLEMENTED` | ora `registry-branding` 1/2 | `icons` → `/favicon.svg` |
| `/auth.md` missing | `CONFIRMED_DEFECT` (docs) | Live 404 | `authDocs.ts` documents public API |
| OAuth PRM / AS | `NOT_APPLICABLE` | Public read-only API | Documented; no fake OAuth |
| Idempotency / async / batch | `NOT_APPLICABLE` | No write REST | Skip |
| Payments protocols | `NOT_APPLICABLE` | No paid product | Skip |
| A2A agent-card | `NOT_APPLICABLE` | No A2A JSON-RPC server | Do not publish fake card |
| Web Bot Auth directory | `NOT_APPLICABLE` / deferred | Site is not a signing bot | Skip |
| NLWeb `/ask` | `CONFIRMED_DEFECT` (gap) | ora fail | Lexical `nlwebAsk.ts` + `api/ask.ts` |
| Markdown twins + Accept | `ALREADY_WORKING` | Live `.md` 200 | Add frontmatter + `rel=alternate` |
| MCP server / errors / rate limits | `ALREADY_WORKING` | Live + tests | Keep |
| Wikipedia / registries / npm | `EXTERNAL_BLOCKER` | Need accounts/approval | Document only |
| Orank rescan | `EXTERNAL_BLOCKER` | Needs production deploy | Pending |

---

## 4. Proposed / implemented work

**P0–P1 (implemented in working tree):**

1. ARD v0.91 + `displayName` + HTTPS `trustManifest.identity` (no forged signature)
2. `/auth.md`, `/?mode=agent` JSON, Link `rel="ard"`
3. WebMCP classic script + tools: `search_projects`, `search_articles`, `get_project`, `get_profile`, `find_developer_docs`
4. NLWeb-shaped `/ask` (documented in OpenAPI)
5. Markdown YAML frontmatter (`title`, `description`, `canonical`, `last-updated`) + HTML `rel="alternate" type="text/markdown"`
6. Modular `/developers/llms.txt` linked from root `/llms.txt`
7. Root cleanup: historical docs under `docs/archive/`
8. Playwright coverage for discovery endpoints (dev server)
9. MCP initialize `instructions` + structured tool error codes
10. Agent-bot User-Agent Markdown when Accept does not prefer HTML

**Explicitly not built:** fake A2A card, OAuth servers, idempotency store, payment protocols, empty schemamap, fabricated Wikidata.

---

## 5. Dependencies and risks

| Risk | Mitigation |
| --- | --- |
| Deploy lag | Score cannot improve until Netlify serves new static files |
| WebMCP browser support | Capability-detected; graceful no-op |
| Scanner false negatives | Classic script literals; still may need live rescan |
| Over-claiming A2A/OAuth | Documented as N/A in AGENTS.md and auth.md |
| Parallel vitest ThemeContext noise | Full suite re-run green (118) |

---

## 6. Acceptance criteria

- [x] ARD entry validates required fields (`identifier`, `displayName`, `type`, exactly one of `url`/`data`)
- [x] `auth.md` and agent-mode JSON generated in `agentFiles()` / build
- [x] `/ask` returns `_meta.version` / `response_type`
- [x] Lint, typecheck, vitest, build pass locally
- [ ] Production HTTP smoke after deploy
- [ ] Orank `POST /api/scan` after deploy
- [ ] Search Console / registry submissions (human)

---

## Related docs

- `docs/seo/orank-execution-checklist.md`
- `docs/seo/orank-implementation-report.md`
- `docs/seo/live-audit.md`
- `AGENTS.md`
