# API endpoints

Every endpoint the site deploys, what it accepts, and where the code lives. The machine-readable contract is `/openapi.json` (built by `src/lib/agent/openapi.ts`); the public guide is `/developers` (built from `src/lib/agent/developerDocs.ts`). This file is the maintainer view.

Base URL in production: `https://www.ayushrai.site`. In development: `http://localhost:5173` (the Vite plugin in `src/lib/agent/vitePlugin.ts` serves the read-only API; `/api/send-email` only works under `netlify dev` or a deployed host).

## How a request flows

| Layer | File | Notes |
| --- | --- | --- |
| Host function | `api/search.ts`, `api/projects.ts`, `api/mcp.ts`, `api/send-email.ts` | Same files run as Netlify Functions (v2, Web `Request` in, `Response` out) and Vercel Node functions (`req`, `res`). |
| Host routing | `netlify.toml`, `vercel.json` | Rewrite `/api/v1/*` and `/api/mcp/server-card` to the four functions. |
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

Codes: `invalid_query`, `invalid_slug`, `invalid_filter`, `invalid_compare`, `invalid_cursor` (400); `not_found`, `route_not_found` (404); `method_not_allowed` (405); `rate_limited` (429). Messages and hints live in `src/lib/agent/apiError.ts`.

### Rate limit

60 requests per 60 seconds per client address, counted in memory per function instance (`src/lib/agent/rateLimit.ts`). Responses carry `RateLimit-Policy: "default";q=60;w=60` and `RateLimit: "default";r=<remaining>;t=<seconds>` (draft-ietf-httpapi-ratelimit-headers-11). A 429 adds `Retry-After`. Because the counter is per instance, it is a courtesy limit, not abuse protection.

### CORS

REST responses echo `Access-Control-Allow-Origin` only for the site's own origins and localhost (`ALLOWED_ORIGINS` in `http.ts`). Server-side clients, agents, and the CLI are unaffected. The MCP endpoint, the Server Card, and the JSON 404 use `*`.

## MCP

### `POST /api/mcp`

Streamable HTTP, stateless: JSON responses, no sessions, no `GET` stream, no auth. Built by `src/lib/agent/mcpHttp.ts` on top of the server in `src/lib/agent/mcpServer.ts`. Tools: `list_projects`, `get_project`, `compare_projects`, `search_portfolio`. The same server runs over stdio with `npm run mcp` (`mcp/server.ts`).

### `GET /api/mcp/server-card`

MCP Server Card (SEP-2127), `application/mcp-server-card+json`, with `ETag` and `304` on `If-None-Match`. Built by `src/lib/agent/mcpCard.ts`. The AI Catalog at `/.well-known/ai-catalog.json` lists it, and `/.well-known/mcp/server-card.json` is a static copy for older scanners.

## Contact

### `POST /api/send-email`

Used by the contact form on `/contact` (`src/pages/ContactPage.tsx` → `src/lib/emailService.ts`). Logic: `src/lib/server/contactEmail.ts`; host adapter: `api/send-email.ts`.

Body (JSON):

```json
{ "name": "Jane", "email": "jane@example.com", "subject": "Hello", "message": "…", "service": "Collaboration" }
```

`name`, `email`, `subject`, and `message` are required non-empty strings; `service` is an optional string.

| Status | Body `message` | When |
| --- | --- | --- |
| 200 | `Message sent successfully!` | SendGrid accepted the message. |
| 200 (empty) | | `OPTIONS` preflight. |
| 400 | `Request body must be valid JSON` | Body is not JSON. |
| 400 | `Missing required fields` | A required field is missing, empty, or not a string. |
| 400 | `Invalid email format` | `email` fails `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. |
| 405 | `Method not allowed` | Any method other than `POST` or `OPTIONS`. |
| 500 | `Email service not configured` | `SENDGRID_API_KEY` is not set. |
| 500 | `Failed to send message. Please try again later.` | SendGrid or another error was thrown. |

Visitor text is HTML-escaped before it goes into the notification email. The visitor's address is the reply-to.

Environment variables (set per host; never commit them):

- `SENDGRID_API_KEY`: required.
- `FROM_EMAIL`: a SendGrid-verified sender. The code falls back to a placeholder that SendGrid will reject, so set it.
- `CONTACT_EMAIL`: optional recipient; defaults to the public contact address.

This endpoint has no rate limit or CAPTCHA.

## Static machine files

Generated at build time by `src/lib/agent/vitePlugin.ts` from `src/content` (and served by the same plugin in dev):

- `/llms.txt`, `/llms-full.txt`, and a `.md` twin for every page (`src/lib/agent/markdown.ts`)
- `/openapi.json` (`openapi.ts`)
- `/.well-known/api-catalog` (RFC 9727, `apiCatalog.ts`)
- `/.well-known/ai-catalog.json` and `/.well-known/mcp/server-card.json` (`mcpCard.ts`)
- `/AGENTS.md`, `/SKILL.md`, `/developers.md`

Content negotiation: a request with `Accept: text/markdown` and without `text/html` gets the page's Markdown (Vercel `middleware.ts`, Netlify edge function). Unknown paths get a Markdown 404.

## Tests

- `src/__tests__/agentReadiness.test.ts`: error envelope, JSON 404, rate limits, OpenAPI, MCP discovery, CLI.
- `src/__tests__/agentSurfaces.test.ts`: Markdown twins, search, projects, MCP tools, host adapters.
- `src/__tests__/contactEmail.test.ts`: contact validation, escaping, and SendGrid payload.
- `e2e/agent-readiness.spec.ts`: Markdown and search responses from the dev server.
