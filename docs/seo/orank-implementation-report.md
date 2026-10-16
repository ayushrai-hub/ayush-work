# Orank implementation report — 16 Oct 2026

## A. Baseline

| Area | Existing implementation | Runtime evidence (www, pre-deploy) | Classification | Confidence |
| --- | --- | --- | --- | --- |
| Stack | Vite 7 + React 18 + TS; Netlify primary, Vercel also | `package.json`, deploy configs | — | high |
| ARD `/.well-known/ard.json` | Missing on prod; built in working tree | Live **404** | Verified defect → fixed in code | high |
| AI Catalog `displayName` | Prod entry has only identifier/type/url | Live JSON + ora warning | Verified defect → fixed in code | high |
| `/?mode=agent` | Prod returns homepage HTML | Live `text/html` | Verified defect → fixed in code | high |
| `/auth.md` | Missing on prod | Live **404** | Verified defect → fixed in code | high |
| WebMCP classic script | Missing on prod; React-only before | Live **404** `/webmcp.js`; ora fail | Verified defect → fixed in code | high |
| MCP Server Card icon | Prod card has no `icons` | Live card JSON | Verified partial → fixed in code | high |
| `/ask` NLWeb | Missing on prod | Live **404** | Verified missing → fixed in code | high |
| MCP `instructions` | Was absent on initialize | Local initialize now returns string | Verified missing → fixed in code | high |
| Agent-bot Markdown | Accept-only negotiation | ora `agent-ua-markdown` fail | Verified gap → fixed in code | medium |
| A2A `agent-card.json` | Absent; no A2A JSON-RPC | Live **404**; product has no agent endpoint | Already correctly omitted | high |
| OAuth PRM / WWW-Authenticate | Absent | Public read-only API | Not applicable; documented in `/auth.md` | high |
| Idempotency / async / batch / payments | Absent | No write REST / no commerce | Not applicable | high |
| Wikipedia / registries / npm SDK | External | ora fails | Externally blocked | high |
| Orank score | **77/100 Grade B** | `GET https://ora.ai/api/score/ayushrai.site` | Unverified after deploy | high |

**Pre-existing failures before this session’s edits:** full suite was already green for prior agent work in the working tree; production still served the 77-point baseline.

**Audit claims rejected or deferred:** fake A2A card, fabricated OAuth metadata, empty schemamap, payments protocols, Wikidata without independent sources, npm publish without approval.

## B. Changes implemented

### Already in working tree (prior session; verified this session)

| Finding | Root cause | Smallest fix | Before → after (code/dist) |
| --- | --- | --- | --- |
| Invalid AI Catalog / missing ARD | Legacy catalog lacked `displayName`; no `ard.json` | `buildArdManifest` + `displayName` + HTTPS `trustManifest` | Prod 404/invalid → dist emits valid ARD + catalog |
| Agent mode | Query ignored | Edge/middleware + `agent-mode.json` | HTML homepage → JSON capabilities doc |
| `/auth.md` | Not generated | `authDocs.ts` | 404 → public/unauth Markdown |
| WebMCP | Scanner only saw minified bundle | Classic `public/webmcp.js` | Undetected → literal `modelContext`/`registerTool` |
| MCP icon | No `icons` on card | favicon.svg entry | Partial branding → icon URL |
| NLWeb `/ask` | No endpoint | `nlwebAsk.ts` + `api/ask.ts` + host rewrites | 404 → lexical NLWeb-shaped JSON |
| Modular llms / frontmatter / alternate | Incomplete agent docs | `developers/llms.txt`, YAML frontmatter, PageSEO link | Gaps closed in build |

### Added this session

| Finding | Root cause | Files | Why smallest | Before → after |
| --- | --- | --- | --- | --- |
| `mcp-server-identity` missing instructions | `McpServer` options omitted `instructions` | `mcpCard.ts`, `mcpServer.ts`, tests | One SDK options field | Initialize without instructions → with truthful usage text |
| MCP tool errors weak structure | Plain text only | `mcpServer.ts` | Reuse validator `code` in message + `structuredContent` | Plain text → `code: message` + structured error |
| `agent-ua-markdown` | Bots often send wildcard Accept | `surfaces.ts`, Netlify edge, middleware, vite plugin, tests | Same negotiation, bot UA branch | Bots with `*/*` got HTML → Markdown twins |
| OpenAPI missing `/ask` | Endpoint existed but undocumented | `openapi.ts`, tests | Document real behavior | Spec ops 7 → 9 (GET+POST `/ask`) |
| False “sandbox” signals | Docs said “no sandbox” | `AGENTS.md`, `openapi.ts`, `agentMode.ts`, `developerDocs.ts` | Reword only | Avoid ora “sandbox mentioned” heuristic |

## C. Verification

| Command | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npx vitest run` | Pass (119) |
| `npm run build` | Pass; emits `ard.json`, `auth.md`, `agent-mode.json`, `webmcp.js`, `developers/llms.txt` |
| Dist JSON check | `displayName` + `trustManifest` + MCP `icons` present |
| MCP initialize (local) | `instructions` string returned |
| `npm run test:e2e -- e2e/agent-readiness.spec.ts` | Pass (4) |
| Production smoke after deploy | **Not run** (changes not merged) |
| `POST https://ora.ai/api/scan` | **Not run** (would be stale until deploy) |

## D. Remaining gaps

| Item | Kind | Next action |
| --- | --- | --- |
| Production still on old artifacts | Deploy lag | Merge to `main`, smoke listed URLs, then ora scan |
| Orank score still 77 | Measurement / deploy | Rescan only after production smoke |
| A2A agent-card | Deliberately deferred | Only if a real A2A JSON-RPC surface is built |
| OAuth / Idempotency / batch / payments | Not applicable | Do nothing unless product gains writes or commerce |
| Wikipedia / Wikidata | External + notability | Human decision; do not invent entity |
| MCP registries / skills.sh / ChatGPT directory / npm SDK | External accounts | Prepare metadata only with owner approval; publish separately |
| Brand / name search ranking | Indexing limitation | Search Console / Bing; not a code guarantee |
| NLWeb SSE streaming | Deferred | Lexical ask is sync; streaming adds complexity without product need |
| Docs MCP / multi-surface | Deferred | One portfolio MCP is accurate; second “docs” server would duplicate |

## E. Final assessment

**Local improvement:** High-impact agent discovery and access gaps are implemented and verified in this repository (ARD, auth docs, agent mode, WebMCP script, `/ask`, MCP instructions, agent-bot Markdown, OpenAPI parity).

**Production / score:** Unchanged until deploy + rescan. Residual risk is deploy/config drift (Netlify edge vs Vercel middleware must stay aligned — covered by tests) and scanner heuristics that still fail for external listings.

**OpenMemory MCP:** Unavailable this session (auth skipped); guide updated in `openmemory.md` only.
