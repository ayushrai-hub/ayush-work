# Orank execution checklist (16 Oct 2026)

Baseline: ora score **77/100**, grade **B** (`GET https://ora.ai/api/score/ayushrai.site`). Canonical host: `https://www.ayushrai.site` (apex 301s).

## Verified against source + production

| Finding | Classification | Action |
| --- | --- | --- |
| AI catalog missing `displayName`; no `/.well-known/ard.json` | Confirmed defect | Add ARD v0.91 manifest + `displayName` on shared entry |
| `?mode=agent` returns homepage HTML | Confirmed defect | Serve JSON agent view from edge/middleware + static twin |
| WebMCP not detected in bundle scan | Confirmed defect | Classic `public/webmcp.js` with literal `modelContext` / `registerTool` |
| `/auth.md` missing | Partially applicable | Document public/unauthenticated API (no invented OAuth) |
| MCP card missing icon | Confirmed partial | Add `icons` pointing at `/favicon.svg` |
| A2A `agent-card.json` | Not applicable yet | No A2A JSON-RPC server; do not publish a fake card |
| OAuth PRM / AS metadata | Not applicable | Public read-only API; document in `/auth.md` |
| Idempotency-Key / async jobs / batch / sandbox | Not applicable | No state-changing REST writes |
| Payments (MPP/x402/UCP/ACP) | Not applicable | No paid product |
| Web Bot Auth key directory | Deferred | Site is not a signing bot; no private keys in repo |
| NLWeb `/ask` | Implementable | Lexical search over the same index |
| Wikipedia / Wikidata / registry listings | External | Human approval required |
| SDK npm publish / ChatGPT directory | External | CLI exists unpublished; no publish without approval |

## Implementation order

1. ARD + AI catalog `displayName` + trust identity (HTTPS URI only, no fabricated signature)
2. `/auth.md`, agent-mode JSON, Link/`rel="ard"` headers
3. WebMCP classic script + extra read-only tools
4. `POST/GET /ask` (NLWeb-shaped, lexical)
5. Root cleanup (`MarkdownDocs` → `docs/archive/`)
6. Tests, build, document blockers; rescan only after deploy
