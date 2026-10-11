---
name: ayush-portfolio
description: Read Ayush Rai's public portfolio from llms.txt, Markdown page twins, the search API, or the local MCP server. Use when looking up his work, products, projects, or research.
---

# Ayush portfolio

Canonical site: https://www.ayushrai.site

## Read

1. Start at https://www.ayushrai.site/llms.txt
2. Open the linked `.md` URL for a page. Home is https://www.ayushrai.site/index.md
3. Treat that Markdown as the public copy. Do not promote numbers the text says are unverified. Do not look up a phone number; it is omitted on purpose.

## Search

`GET https://www.ayushrai.site/api/search?q=your+query`

Empty `q` returns a short default slice. Matches are lexical: title, then tag or type, then summary. Do not describe the result as semantic understanding.

## Projects

- `GET /api/v1/projects`
- `GET /api/v1/projects/SLUG`
- `GET /api/v1/compare?slugs=slug-a,slug-b`

`/api/projects?slug=` and `?compare=` remain. Archived slugs need `archive=1`.

If this repository is checked out, the same three operations are MCP tools named `list_projects`, `get_project`, and `compare_projects` via `npx tsx mcp/server.ts`. See `AGENTS.md` for the client config.

Specification: https://www.ayushrai.site/openapi.json
