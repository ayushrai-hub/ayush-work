# API endpoints

Every endpoint the site deploys, what it accepts, and where the code lives. The machine-readable contract is `/openapi.json` (built by `src/lib/agent/openapi.ts`); the public guide is `/developers` (built from `src/lib/agent/developerDocs.ts`). This file is the maintainer view.

Base URL in production: `https://www.ayushrai.site`. In development: `http://localhost:5173` (the Vite plugin in `src/lib/agent/vitePlugin.ts` serves the read-only API; `/api/send-email` only works under `netlify dev` or a deployed host).

## How a request flows

| Layer | File | Notes |
| --- | --- | --- |
| Host function | `api/search.ts`, `api/projects.ts`, `api/mcp.ts`, `api/ask.ts`, `api/send-email.ts` | Same files run as Netlify Functions (v2, Web `Request` in, `Response` out) and Vercel Node functions (`req`, `res`). |
| Host routing | `netlify.toml`, `vercel.json` | Rewrite `/api/v1/*`, `/api/mcp/server-card`, and `/ask` to those functions. |
| Unknown `/api/*` | `middleware.ts` (Vercel), `netlify/edge-functions/markdown-negotiation.js` (Netlify) | JSON 404 `route_not_found`. Both use the route list in `src/lib/agent/apiRoutes.ts`; a test keeps the Netlify copy in sync. |
| Adapter | `src/lib/agent/http.ts` (`handleAgentRequest`, `agentApiResponse`) | Reads the method, path, and query from either host shape, applies the rate limit, adds CORS and cache headers. |
| Dispatch | `src/lib/agent/http.ts` (`dispatchAgentApi`, `projectsHttp`) | Validates input (`validate.ts`, `pagination.ts`) and calls `search.ts` or `projectsQuery.ts`. |
| Data | `src/content/` | The only source of facts. |

## Read-only REST API

All routes accept `GET`, `HEAD`, and `OPTIONS` (204). Any other method returns 405 `method_not_allowed`. No key is needed.

### `GET /api/v1/search` (alias `/api/search`)

| Param | Rule |
| --- | --- |
| `q` | Up to 200 characters. Empty returns the default first slice the on-site search dialog shows. |
| `type` | Optional. One of the record types in `SEARCH_TYPES` (`src/lib/agent/search.ts`). |
| `limit` | Integer 1–20. |
| `cursor` | Opaque value from a previous `nextCursor`. |

Ranking is lexical and shared with the site's search dialog and the MCP and WebMCP search tools: exact title, title substring, tag or type, then summary. Ties keep content order.

### `GET /api/v1/projects` (alias `/api/projects`)

| Param | Rule |
| --- | --- |
| `category` | Optional. Own key of `projectCategoryLabels` (`src/content`). |
| `type` | Optional. Own key of `projectTypeLabels`. |
| `archive` | `1` includes archived projects. |
| `limit`, `cursor` | As for search. |

Response: `{ projects, count, nextCursor }`. `nextCursor` is `null` on the last page.

The older query forms still work: `/api/projects?slug=<slug>` and `/api/projects?compare=a,b`.

### `GET /api/v1/projects/{slug}`

Slug must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` (400 `invalid_slug`). Unknown slug: 404 `not_found`. `archive=1` allows archived projects.

### `GET /api/v1/compare?slugs=a,b`

Two to four distinct slugs (400 `invalid_compare` otherwise). Response: `{ projects, missing }`.

### Errors

Every error body is:

```json
{ "error": { "code": "invalid_filter", "message": "…", "hint": "…", "docs": "https://www.ayushrai.site/developers/" } }
```

Codes: `invalid_query`, `invalid_slug`, `invalid_filter`, `invalid_compare`, `invalid_cursor` (400); `not_found`, `route_not_found` (404); `method_not_allowed` (405); `rate_limited` (429); `internal_error` (500, generic message, when a handler throws). Messages and hints live in `src/lib/agent/apiError.ts`.

### Rate limit

60 requests per 60 seconds per client address, counted in memory per function instance (`src/lib/agent/rateLimit.ts`). Responses carry `RateLimit-Policy: "default";q=60;w=60` and `RateLimit: "default";r=<remaining>;t=<seconds>` (draft-ietf-httpapi-ratelimit-headers-11). A 429 adds `Retry-After`. Because the counter is per instance, it is a courtesy limit, not abuse protection.

### CORS

This is a deliberate policy, stated on `/developers` and in `/openapi.json`. REST responses echo `Access-Control-Allow-Origin` only for the site's own origins and localhost (`SITE_ORIGINS` in `src/lib/siteOrigins.ts`), always with `Vary: Origin`. A browser page on another site cannot read them; server-side clients, agents, and the CLI are unaffected. The MCP endpoint, the Server Card, and the JSON 404 use `*`. Tested in `src/__tests__/agentReadiness.test.ts` ("CORS").

Clients with no address header are keyed by a hash of their User-Agent, so they do not share one `anonymous` bucket.

## MCP

### `POST /api/mcp`

Streamable HTTP, stateless: JSON responses, no sessions, no `GET` stream, no auth. Built by `src/lib/agent/mcpHttp.ts` on top of the server in `src/lib/agent/mcpServer.ts`. Tools: `list_projects`, `get_project`, `compare_projects`, `search_portfolio`. The same server runs over stdio with `npm run mcp` (`mcp/server.ts`).

- `search_portfolio` takes `query`, optional `type`, `limit` (1–20), and `cursor` (a previous `nextCursor`); the WebMCP tool `search_portfolio_projects` takes the same arguments. Both page exactly like `GET /api/v1/search`.
- `compare_projects` takes `slugs` (two to four) and optional `includeArchive`, like `archive=1` on `/api/v1/compare`. A malformed slug is reported in `missing`, as on the REST endpoint, rather than rejected; changing that to a 400 would be a breaking change under the v1 policy.

### `GET /api/mcp/server-card`

MCP Server Card (SEP-2127), `application/mcp-server-card+json`, with `ETag` and `304` on `If-None-Match`. Built by `src/lib/agent/mcpCard.ts`. The AI Catalog at `/.well-known/ai-catalog.json` lists it, and `/.well-known/mcp/server-card.json` is a static copy for older scanners.

## Ask

### `GET` or `POST /ask`

NLWeb-shaped (v0.55) lexical search over the same index as `/api/v1/search`. It is not generative: it returns ranked hits, an empty answer, or a `failure`. Logic: `src/lib/agent/nlwebAsk.ts`; host adapter: `api/ask.ts`. It sits outside `/api/` so scanners find it at `/ask`; Netlify routes it to the function and Vercel rewrites it to `/api/ask`.

- Query: `?query=` or `?q=` on GET; on POST a JSON body with `query` as a string, `query.text`, or `q`.
- Responses carry `_meta.response_type` and `_meta.version`.
- Streaming: `prefer.streaming: true` in the body, `?streaming=true`, or `Accept: text/event-stream` returns SSE with `start`, `result`, `error`, and `complete` events. A wildcard `Accept` never selects streaming. JSON is the default.
- Rate-limited like the REST API (`rateLimit.ts`).

## Contact

### `POST /api/send-email`

Used by the contact form on `/contact` (`src/pages/ContactPage.tsx` → `src/lib/emailService.ts`). Logic: `src/lib/server/contactEmail.ts`; host adapter: `api/send-email.ts`.

Body (JSON):

```json
{ "name": "Jane", "email": "jane@example.com", "subject": "Hello", "message": "…", "service": "Collaboration" }
```

`name`, `email`, `subject`, and `message` are required non-empty strings; `service` is an optional string. Length limits (`src/lib/contactFields.ts`): name 200, email 254, subject 200, service 200, message 5000 characters. `website` is a honeypot that the form never shows; when it is filled the request gets the normal success reply and nothing is sent.

| Status | Body `message` | When |
| --- | --- | --- |
| 200 | `Message sent successfully!` | SendGrid accepted the message (or the honeypot was filled). |
| 200 (empty) | | `OPTIONS` preflight. |
| 400 | `Request body must be valid JSON` | Body is not JSON. |
| 400 | `Missing required fields` | A required field is missing, empty, or not a string. |
| 400 | `One or more fields are too long` | A field is over its limit. |
| 400 | `Invalid email format` | `email` fails `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. |
| 405 | `Method not allowed` | Any method other than `POST` or `OPTIONS` (with `Allow`). |
| 429 | `Too many messages…` | More than 5 messages per client in 10 minutes, per function instance (with `Retry-After`). |
| 500 | `Email service not configured` | `SENDGRID_API_KEY` or `FROM_EMAIL` is not set. Only the variable names are logged. |
| 502 | `Failed to send message. Please try again later.` | SendGrid rejected the message. Only its status code is logged. |

Visitor text is HTML-escaped before it goes into the notification email, and line breaks are stripped from the name and subject. The visitor's address is the reply-to. CORS is granted only to the site's own origins, and responses are `Cache-Control: no-store`.

Environment variables (set per host; never commit them):

- `SENDGRID_API_KEY`: required.
- `FROM_EMAIL`: required; a SendGrid-verified sender. There is no fallback.
- `CONTACT_EMAIL`: optional recipient; defaults to the public contact address.

There is no CAPTCHA. The rate limit is per instance, so it slows a casual script but is not a global limit. Whether the variables are set on Netlify and Vercel has not been verified from this repository.

## Static machine files

Generated at build time by `src/lib/agent/vitePlugin.ts` from `src/content` (and served by the same plugin in dev):

The full list is `agentFiles()` in `src/lib/agent/surfaces.ts`:

- `/llms.txt`, `/llms-full.txt`, section indexes `/developers/llms.txt`, `/work/llms.txt`, `/products/llms.txt`, and a `.md` twin for every page with YAML frontmatter (`src/lib/agent/markdown.ts`)
- `/404.md`, `/auth.md` (public, no authentication; opens with `# Authentication`), `/pricing.md` (free; no paid tiers)
- `/agent-mode.json`, served for `/?mode=agent` (`agentMode.ts`)
- `/openapi.json` (`openapi.ts`)
- `/.well-known/api-catalog` (RFC 9727, `apiCatalog.ts`)
- `/.well-known/ard.json` (ARD v0.91, canonical), `/.well-known/ai-catalog.json` (legacy), and `/.well-known/mcp/server-card.json` (`mcpCard.ts`)
- `/schemamap.xml` and `/feeds/portfolio.jsonl`, the Schema Feed that `robots.txt` points to (`schemaFeed.ts`, nodes from `src/lib/structuredData.ts`)
- `/AGENTS.md`, `/SKILL.md`, `/developers.md`

`public/webmcp.js` is a static script that registers the WebMCP tools on `document.modelContext` when it exists.

Content negotiation: a request whose `Accept` header gives `text/markdown` a positive quality higher than `text/html` gets the page's Markdown (Vercel `middleware.ts`, Netlify edge function). `Accept: text/markdown` alone qualifies; a tie, `q=0`, or a wildcard does not. Known AI-agent User-Agents (`AGENT_BOT_UA` in `surfaces.ts`: GPTBot, ClaudeBot, PerplexityBot, ora-agent, and others) always get Markdown; Googlebot and browsers keep HTML. Markdown responses send `Vary: Accept, User-Agent`. Unknown paths get a Markdown 404. Netlify cannot match redirects on `Accept`, so the edge function does it.

## Tests

- `src/__tests__/agentReadiness.test.ts`: error envelope, JSON 404, rate limits, OpenAPI, MCP discovery, CLI.
- `src/__tests__/agentSurfaces.test.ts`: Markdown twins, search, projects, MCP tools, host adapters.
- `src/__tests__/contactEmail.test.ts`: contact validation, escaping, and SendGrid payload.
- `e2e/agent-readiness.spec.ts`: Markdown and search responses from the dev server.
