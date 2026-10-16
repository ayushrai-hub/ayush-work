# Agent guide

This site is a personal digital home. The human pages, Markdown twins, search API, and MCP tools all read `src/content/`. Do not invent a second biography, and do not cite numbers that the pages themselves mark as unverified.

Canonical origin: `https://www.ayushrai.site`. `https://ayushrai.site` redirects there with HTTP 301. The old `ayush-me.netlify.app` host does not.

## When to use this site

Use it for:

- Who Ayush Rai is, what he works on, and how to reach him (email, phone +91 7440567944, WhatsApp): read `/index.md`, `/about.md`, and `/contact.md`.
- Whether he has built something in an area (agents, retrieval, extensions, research): call `GET /api/v1/search?q=<topic>`, then open each hit's `href` with `.md` appended.
- Listing, fetching, or comparing his projects with stable fields: `GET /api/v1/projects`, `/api/v1/projects/{slug}`, `/api/v1/compare?slugs=a,b`, or the matching MCP tools.
- Citing a claim: quote the Markdown page that states it and link its HTML URL.

Do not use it for:

- General programming help, other people, or companies. It covers one person's work.
- Live data such as availability, prices, or openings. Content changes only when the site is redeployed.
- Semantic search. Search is lexical, so send a few short keywords rather than a sentence.
- Unconfirmed award details. They are deliberately not published.

## Read a page

- Human page: `https://www.ayushrai.site/work/the-open-framework`
- Markdown twin: `https://www.ayushrai.site/work/the-open-framework.md`
- Home Markdown: `https://www.ayushrai.site/index.md`
- Index: `https://www.ayushrai.site/llms.txt`
- One-file dump, generated from the same pages: `https://www.ayushrai.site/llms-full.txt`

Content negotiation: send `Accept: text/markdown` and do not send `text/html`. The response is `text/markdown` with `Vary: Accept`. An unknown path returns 404 with a Markdown body that points to `llms.txt` and the sitemap. The stable contract is the `.md` URL. `llms.txt` is a discovery file, not a promise of extra indexing.

On the site, "Agent view" shows that Markdown with copy and download. "Role view" on the homepage only reorders existing work for a reader. It does not change the Markdown.

## Search

`GET /api/v1/search?q=open+framework` (`/api/search` is the same endpoint)

Ranking is lexical and shared with the on-site dialog: exact title, title substring, tag or type, then summary. Ties keep content order. This is not semantic search. An empty `q` returns the dialog's default first slice. `limit` is 1–20. `type` must be a known record type.

OpenAPI: `https://www.ayushrai.site/openapi.json`
API catalog (RFC 9727): `https://www.ayushrai.site/.well-known/api-catalog`
Developer docs: `https://www.ayushrai.site/developers`

The API is free, public, and needs no key. There is no separate test environment or paid tier.

## Errors and rate limits

Every error is JSON: `{ "error": { "code", "message", "hint", "docs" } }`. Branch on `code`; `hint` says how to fix the request. Codes: `invalid_query`, `invalid_slug`, `invalid_filter`, `invalid_compare`, `invalid_cursor` (400), `not_found` and `route_not_found` (404), `method_not_allowed` (405), `rate_limited` (429). Unknown `/api/` paths return `route_not_found` as JSON.

The limit is 60 requests per 60 seconds per client address, counted per server instance. Responses carry `RateLimit-Policy: "default";q=60;w=60` and `RateLimit: "default";r=<remaining>;t=<seconds>` (draft-ietf-httpapi-ratelimit-headers-11). A 429 also carries `Retry-After` in seconds.

## Pagination and versioning

List endpoints return `nextCursor`. Pass it back as `cursor`; it is `null` on the last page. Cursors are opaque.

`/api/v1` is stable: fields may be added, never removed or renamed. Breaking changes ship as `/api/v2`. A replaced version keeps working for at least 90 days and sends `Deprecation`, `Sunset`, and a `successor-version` link during that window. Nothing is deprecated today.

## Projects

Versioned routes:

- `GET /api/v1/projects`
- `GET /api/v1/projects/overlay-text-box`
- `GET /api/v1/compare?slugs=overlay-text-box,expert-o`

The older query form still works: `GET /api/projects`, `?slug=`, and `?compare=a,b`. Archived projects are omitted unless `archive=1`. Comparison needs two to four distinct slugs.

Browser agents that expose WebMCP can call `search_portfolio_projects`. It runs the same search function as `/api/search`.

## MCP

Remote: `POST https://www.ayushrai.site/api/mcp` over Streamable HTTP. It is stateless: JSON responses, no sessions, no GET stream, no auth.

```json
{ "mcpServers": { "ayush-portfolio": { "url": "https://www.ayushrai.site/api/mcp" } } }
```

Local, from this repository after `npm install`:

```json
{
  "mcpServers": {
    "ayush-portfolio": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"],
      "cwd": "/absolute/path/to/this/repo"
    }
  }
}
```

Tools: `list_projects`, `get_project`, `compare_projects`, `search_portfolio`. They return the same public records as the API. Both transports build the server from `src/lib/agent/mcpServer.ts`. The server identifies itself as `site.ayushrai/portfolio`.

Discovery follows SEP-2127. The Server Card is `GET https://www.ayushrai.site/api/mcp/server-card` (`application/mcp-server-card+json`, with `ETag`). The AI Catalog at `/.well-known/ai-catalog.json` lists it. The older `/.well-known/mcp/server-card.json` serves the same card for clients that still look there.

A zero-dependency CLI lives in `packages/cli` (`node packages/cli/bin/ayushrai.mjs search agents`). It is not published to npm yet. An SDK is not published. An A2A agent card is not implemented (and not advertised). This server is not listed on Smithery, mcp.so, or any other registry.

WebMCP `search_portfolio_projects` registers on `document.modelContext` when that API exists, and does nothing otherwise. `navigator.modelContext` is only a fallback. No experimental Chrome WebMCP browser run was completed in this repository.

## Authentication

The REST API, `/ask`, and MCP server are public and unauthenticated. See `/auth.md`. There is no OAuth protected-resource metadata and no `WWW-Authenticate` challenge on these routes by design.

## Agent mode and discovery

- `GET /?mode=agent` returns JSON (capabilities, API, MCP, docs), not the marketing homepage.
- ARD v0.91: `/.well-known/ard.json` (canonical). Legacy AI Catalog: `/.well-known/ai-catalog.json`.
- `POST /ask` is NLWeb-shaped lexical search over the same index as `/api/v1/search` (not generative).
- WebMCP tools register from `/webmcp.js` when `document.modelContext` exists.
- An A2A `/.well-known/agent-card.json` is not published: there is no A2A JSON-RPC endpoint.

## Domains

Evidence-backed dossiers live under `/ai-engineering`, `/software-engineering`, `/software-services`, `/experience`, and `/open-source`. They are generated from `src/content/domains.ts`. There is no `/ai-engineering/inference` or `/software-engineering/distributed-systems` page: those topics are gaps, not empty URLs. There is no published SDK package, pricing page, or OAuth login.

## Working in this repo

- Change public facts in `src/content/`, then let Markdown, search, and MCP follow.
- Do not add a second sitemap or prerender pipeline. Host rewrites must keep `force` off for the SPA fallback so existing HTML files win.
- The only phone number in public output is `person.phone` in `src/content/person.ts`; `src/__tests__/publicOutput.test.ts` fails on any other. Withheld award and leadership claims stay in `needsConfirmation` lists and must not be copied into new endpoints.
- Every source file opens with a header comment (purpose, mechanism, and what it connects to), and every function has a short doc comment. Update them with the code. The old single-page site's components were removed from `main`; they live only on tag `legacy-portfolio-spa` and contain withheld information, so do not copy them back.
- Before pushing, run `npm run lint`, `npm run typecheck`, `npx vitest run`, `npm run build`, and `npm run test:e2e`. CI runs the same steps on every pull request to `main`, and merging to `main` deploys.
