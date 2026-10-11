# Agent-readiness implementation report

Date: 2026-10-11

Branch: `agent-readiness` (from `9214d7d`). Not committed, not merged, not deployed.

OpenMemory’s remote store was unavailable in this session. Project notes were updated in `openmemory.md` only.

## What already existed

The editorial Vite + React site, `src/content/` as the only public dataset, Helmet SEO, a hand-maintained sitemap, Netlify as the live host, and a first agent layer in the working tree: Markdown twins, `/llms.txt`, `/llms-full.txt`, lexical-but-unordered search, `/api/search` and `/api/projects`, homepage role reorder, agent view, a stdio MCP server, and an OpenAPI file for the two original routes.

Production at audit time still served prerendered HTML for known pages and the SPA shell for unknown paths, including `/llms.txt`. This repository has no prerender script. Deploying this branch can replace that host-generated HTML and sitemap. That was not done.

## What this pass changed

- Search ranking is lexical and shared: exact title, title substring, tag or type, then summary. The payload says `match: "lexical"`. It is not a model.
- `GET /api/v1/projects`, `GET /api/v1/projects/:slug`, and `GET /api/v1/compare?slugs=a,b` call the same project functions as `/api/projects`. Archived projects are omitted unless `archive=1`. Duplicate compares and bad slugs return `{ error: { code, message } }`.
- CORS echoes only `https://www.ayushrai.site`, `https://ayushrai.site`, and local Vite origins. Other origins get no `Access-Control-Allow-Origin`.
- Vercel rewrites and Netlify redirects send the v1 paths to the existing projects function. Dev middleware handles the paths directly.
- Role labels are Overview, Hiring, AI / ML and LLM Engineering, Software and Backend Engineering, Research and Evaluation, and Product and Systems Building. Old ids (`recruiter`, `ai-ml`, `software`, `product`) stay. `?audience=hiring` maps to the hiring order. `?audience=` and `?agent=1` are `noindex`.
- Agent view announces copy success and clipboard failure. Markdown is rendered as text.
- `/developers`, `/developers.md`, `/AGENTS.md`, and `/SKILL.md` are public. OpenAPI 3.1 includes the v1 routes and the error schema.
- Phone links were removed from the homepage, contact page, and footer. `person.phone` and `person.phoneDisplay` are empty so the editorial bundle does not contain the number. JSON-LD no longer has `telephone`.
- Legacy `src/components/Hero.tsx`, `src/components/Contact.tsx`, and `src/lib/profilesData.ts` still contain the old number. They are not imported by the editorial routes and do not appear in `dist/`.

## API examples

```bash
curl "https://www.ayushrai.site/api/search?q=overlay"
curl "https://www.ayushrai.site/api/v1/projects?limit=5&category=tooling"
curl "https://www.ayushrai.site/api/v1/projects/overlay-text-box"
curl "https://www.ayushrai.site/api/v1/compare?slugs=overlay-text-box,expert-o"
```

Those production URLs are the intended contract. They were exercised on `http://localhost:5174`, not on the live host.

## MCP

Local only:

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

Tools: `list_projects`, `get_project`, `compare_projects`. Stdio was chosen because the live site is static files plus short read functions. A Streamable HTTP process was not added. There is no Smithery or mcp.so listing.

## WebMCP

`search_portfolio_projects` registers on `document.modelContext` when that object exists, with `AbortSignal` cleanup. `navigator.modelContext` is only a fallback. The handler is unit-tested. No experimental Chrome build was available, so browser registration was not executed. The tool is a no-op in current stable browsers.

## Markdown URLs

Generated from `src/content/` at build time. Examples: `/index.md`, `/about.md`, `/work/the-open-framework.md`, `/products/the-open-framework.md`, `/developers.md`, `/llms.txt`. `Accept: text/markdown` without `text/html` negotiates known pages. The `.md` URL is the stable contract. `llms.txt` is a discovery file, not a ranking promise.

## How to run and test

```bash
npm install
npm run dev
npm test
npm run build
npm run mcp
```

## Results on 2026-10-11

- `npx vitest run` before the gap edits: 4 files, 14 tests passed.
- `npx vitest run` after the gap edits: 4 files, 14 tests passed. New assertions live inside `src/__tests__/agentSurfaces.test.ts`.
- `npx tsc -p tsconfig.app.json --noEmit`: passed.
- `npm run build`: passed. `dist/` contains the Markdown twins, `llms.txt`, `openapi.json`, `AGENTS.md`, and `SKILL.md`. A search of `dist/` found no phone digits.
- `npm run lint`: failed before reading any rule, including on `src/main.tsx`. ESLint 9 throws `allowShortCircuit` of undefined while loading `@typescript-eslint/no-unused-expressions`. That failure is pre-existing.
- Playwright `e2e/example.spec.ts` still targets the archived SPA. It was not run. `e2e/agent-readiness.spec.ts` was added and not executed: `playwright.config.ts` waits on port 5173, and the running dev server is on 5174 because 5173 was already taken.
- Browser check on `http://localhost:5174`: Hiring reordered selected work with shipped case studies first; agent view showed Human view, `/index.md`, Copy, and Download; contact has email and Calendly and no phone link; `/developers` links to `llms.txt`, OpenAPI, `AGENTS.md`, and `SKILL.md`.
- Local API: search returned `match: "lexical"`; project lookup returned the work URL; a missing slug returned 404; duplicate compare returned 400; Markdown content type was `text/markdown; charset=utf-8`; an unknown origin did not receive `Access-Control-Allow-Origin`.

## Security decisions

Read-only GET endpoints. No API key. No caller-supplied URL fetch, file path, shell, or SQL. Slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Query length and list limits are bounded. CORS is an allowlist. Phone digits are absent from the editorial bundle. Withheld award strings stay out of Markdown and llms output.

## Deferred

- SDK and CLI. Do not publish.
- Remote MCP / Streamable HTTP.
- A2A card and registry listings.
- A second prerenderer or sitemap generator.
- Playwright against the editorial site until the dev-server port in `playwright.config.ts` matches the server that is actually running.
- Removal of phone strings from unused legacy components (`Hero.tsx`, `Contact.tsx`, `profilesData.ts`).

## Environment

No new environment variables. Contact email functions still use the existing local `.env.example` setup and are unrelated to these read endpoints.
