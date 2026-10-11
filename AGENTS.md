# Agent guide

This site is a personal digital home. The human pages, Markdown twins, search API, and MCP tools all read `src/content/`. Do not invent a second biography, and do not cite numbers that the pages themselves mark as unverified.

Canonical origin: `https://www.ayushrai.site`. `https://ayushrai.site` redirects there with HTTP 301. The old `ayush-me.netlify.app` host does not.

## Read a page

- Human page: `https://www.ayushrai.site/work/the-open-framework`
- Markdown twin: `https://www.ayushrai.site/work/the-open-framework.md`
- Home Markdown: `https://www.ayushrai.site/index.md`
- Index: `https://www.ayushrai.site/llms.txt`
- One-file dump, generated from the same pages: `https://www.ayushrai.site/llms-full.txt`

Content negotiation: send `Accept: text/markdown` and do not send `text/html`. The stable contract is the `.md` URL. `llms.txt` is a discovery file, not a promise of extra indexing.

On the site, "Agent view" shows that Markdown with copy and download. "Role view" on the homepage only reorders existing work for a reader. It does not change the Markdown.

## Search

`GET /api/search?q=open+framework`

Ranking is lexical and shared with the on-site dialog: exact title, title substring, tag or type, then summary. Ties keep content order. This is not semantic search. An empty `q` returns the dialog's default first slice. `limit` is 1–20. `type` must be a known record type.

OpenAPI: `https://www.ayushrai.site/openapi.json`
Developer notes: `https://www.ayushrai.site/developers`

## Projects

Versioned routes:

- `GET /api/v1/projects`
- `GET /api/v1/projects/overlay-text-box`
- `GET /api/v1/compare?slugs=overlay-text-box,expert-o`

The older query form still works: `GET /api/projects`, `?slug=`, and `?compare=a,b`. Archived projects are omitted unless `archive=1`. Comparison needs two to four distinct slugs. Errors use `{ "error": { "code", "message" } }`.

Browser agents that expose WebMCP can call `search_portfolio_projects`. It runs the same search function as `/api/search`.

## Local MCP

From this repository, after `npm install`:

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

Tools: `list_projects`, `get_project`, `compare_projects`. They return the same public project records as the API. Transport is stdio. A remote Streamable HTTP endpoint is not deployed: the live host is a static Vite site plus thin read functions, and adding a long-lived MCP process would be a separate service.

An SDK and CLI are intentionally not published yet. Add them after these endpoints stay stable. An A2A agent card is not implemented. This server is not listed on Smithery, mcp.so, or any other registry.

WebMCP `search_portfolio_projects` registers on `document.modelContext` when that API exists, and does nothing otherwise. `navigator.modelContext` is only a fallback. No experimental Chrome WebMCP browser run was completed in this repository.

## Working in this repo

- Change public facts in `src/content/`, then let Markdown, search, and MCP follow.
- Do not add a second sitemap or prerender pipeline. Host rewrites must keep `force` off for the SPA fallback so existing HTML files win.
- Phone numbers stay off public pages and machine-readable output. Withheld award and leadership claims stay in `needsConfirmation` lists and must not be copied into new endpoints.
