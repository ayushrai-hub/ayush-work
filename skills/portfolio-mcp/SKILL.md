---
name: portfolio-mcp
description: Connect to and call Ayush Rai's two remote Streamable HTTP MCP servers (/api/mcp for portfolio projects and search, /api/mcp/docs for published Markdown pages and documentation search).
---

# Portfolio and documentation MCP servers

Canonical site: https://www.ayushrai.site

## Servers

1. **Portfolio MCP (`site.ayushrai/portfolio`)**
   - Endpoint: `POST https://www.ayushrai.site/api/mcp` (Streamable HTTP, stateless JSON responses, no auth)
   - Server Card: `GET https://www.ayushrai.site/api/mcp/server-card`
   - Tools:
     - `list_projects` (`category`, `type`, `limit`, `cursor`, `includeArchive`)
     - `get_project` (`slug`, `includeArchive`)
     - `compare_projects` (`slugs` array of 2–4 distinct slugs, `includeArchive`)
     - `search_portfolio` (`query`, `type`, `limit`, `cursor`)

2. **Documentation MCP (`site.ayushrai/docs`)**
   - Endpoint: `POST https://www.ayushrai.site/api/mcp/docs` (Streamable HTTP, stateless JSON responses, no auth)
   - Server Card: `GET https://www.ayushrai.site/api/mcp/docs/server-card`
   - Tools:
     - `list_pages` (returns `path`, `title`, and `description` for every published Markdown page)
     - `get_page` (`path`, e.g. `/about` or `/developers`)
     - `search_docs` (`query`, `limit`)

## Client configuration

Both servers are listed in `https://www.ayushrai.site/mcp.json` and `https://www.ayushrai.site/.well-known/ard.json`:

```json
{
  "mcpServers": {
    "ayush-portfolio": {
      "type": "streamable-http",
      "url": "https://www.ayushrai.site/api/mcp"
    },
    "ayush-portfolio-docs": {
      "type": "streamable-http",
      "url": "https://www.ayushrai.site/api/mcp/docs"
    }
  }
}
```
