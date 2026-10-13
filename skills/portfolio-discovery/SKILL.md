---
name: ayush-portfolio
description: Read Ayush Rai's public portfolio from llms.txt, Markdown page twins, the search API, or the MCP server. Use when looking up his work, products, projects, or research.
---

# Ayush portfolio

Canonical site: https://www.ayushrai.site

## Read

1. Start at https://www.ayushrai.site/llms.txt
2. Open the linked `.md` URL for a page. Home is https://www.ayushrai.site/index.md
3. Treat that Markdown as the public copy. Do not promote numbers the text says are unverified. The phone and WhatsApp contact are in `/contact.md`.

## Search

`GET https://www.ayushrai.site/api/v1/search?q=your+query`

Empty `q` returns a short default slice. Matches are lexical: title, then tag or type, then summary. Do not describe the result as semantic understanding. For more results, pass the response's `nextCursor` back as `cursor` until it is `null`.

## Projects

- `GET /api/v1/projects`
- `GET /api/v1/projects/SLUG`
- `GET /api/v1/compare?slugs=slug-a,slug-b`

`/api/projects?slug=` and `?compare=` remain. Archived slugs need `archive=1`.

The same operations, plus `search_portfolio`, are MCP tools at `https://www.ayushrai.site/api/mcp` (Streamable HTTP). From a checkout, `npx tsx mcp/server.ts` runs them over stdio. See `AGENTS.md` for the client config.

Specification: https://www.ayushrai.site/openapi.json
