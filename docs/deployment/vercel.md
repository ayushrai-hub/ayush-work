# Vercel deployment

The Vercel deployment uses the existing Vite application and does not replace
the Netlify deployment.

## Repository layout

- `vercel.json` — Vercel build, route, and header rules.
- `middleware.ts` — Vercel Routing Middleware for `Accept: text/markdown`;
  the logic lives in `src/lib/agent/markdownMiddleware.ts`.
- `netlify.toml` — existing Netlify deployment configuration; keep it intact.
- `netlify/edge-functions/markdown-negotiation.js` — the same negotiation on
  Netlify, in plain JavaScript because Deno cannot import `src/`.
- `api/*.ts` — public serverless entry points used by both hosts.
- `src/lib/server/contactEmail.ts` — host-independent contact validation and
  SendGrid delivery.
- `scripts/prerender.mjs` — writes route HTML and `sitemap.xml` into `dist/`.
- `.env.example` — variable names and safe placeholders only.

Host-required configuration files stay at the repository root. Runtime logic
belongs under `src/lib/server/`, while `api/` remains a thin adapter layer.

## Build

- Package manager: npm (`package-lock.json`)
- Command: `npm run build`
- Output: `dist`
- Framework preset: Vite
- Node: 22.x (Vite 7 needs `^20.19.0 || >=22.12.0`; see `engines` in `package.json`)

Production deploys come from the GitHub integration: every merge into `main`
creates a Vercel production deployment, and every other branch gets a preview.
`.github/workflows/tests.yml` runs lint, typecheck, Vitest, the build, and
Playwright on the same pushes and pull requests.

The build emits static HTML for known routes. Unknown routes must resolve to
`dist/404.html`; do not add a catch-all rewrite to `index.html`.

Page URLs get a trailing slash from an explicit 308 redirect in `vercel.json`,
matching the canonical URLs. Do not use `"trailingSlash": true`: it would also
redirect `/api/search` and `POST /api/mcp`.

## API and MCP

`api/mcp.ts` is the remote MCP endpoint (stateless Streamable HTTP). It and the
read API need no environment variables. `/.well-known/api-catalog` is a static
file emitted by the build; both hosts set its RFC 9727 content type.

The MCP Server Card is served by the same function at `/api/mcp/server-card`.
Vercel rewrites that path to `/api/mcp?resource=server-card`; Netlify redirects
it to `/.netlify/functions/mcp?resource=server-card`. The function accepts
either form. `/.well-known/ai-catalog.json` and the legacy
`/.well-known/mcp/server-card.json` are static build files with their media
types set in `vercel.json` and `netlify.toml`.

Unknown `/api/*` paths get a JSON `route_not_found` 404 from `middleware.ts` on
Vercel and from the edge function on Netlify. When adding a function, add its
path to `API_ROUTES` in `src/lib/agent/apiRoutes.ts` and to the copy in
`netlify/edge-functions/markdown-negotiation.js`; a test fails if they differ.

Rate limiting (60 requests per 60 seconds per client address, with
`RateLimit` and `RateLimit-Policy` headers and 429 plus `Retry-After`) runs
inside each function instance. It is best effort. Host-level limits, such as
the Vercel Firewall or Netlify rate limiting rules, would enforce a global
ceiling and are not configured.

## Markdown negotiation

A request that sends `Accept: text/markdown` without `text/html` gets the
page's Markdown twin with `Content-Type: text/markdown; charset=utf-8` and
`Vary: Accept`. An unknown path gets status 404 and the body of `dist/404.md`,
which links to `llms.txt`, the sitemap, `AGENTS.md`, and `/developers`. A real
page without a twin, such as `/design-system`, stays HTML. Browsers are not
affected.

Vercel rewrites run after the filesystem, so they cannot replace a prerendered
`index.html`; middleware runs first, which is why negotiation is not in
`vercel.json`. Check a deployment with:

```sh
curl -sS -L -i -H 'Accept: text/markdown' https://<host>/
curl -sS -L -i -H 'Accept: text/html' https://<host>/
curl -sS -L -i -H 'Accept: text/markdown' https://<host>/some-path-that-does-not-exist
```

## Environment variables

Configure these in the Vercel project:

- `SENDGRID_API_KEY` — required by `/api/send-email`.
- `FROM_EMAIL` — required verified SendGrid sender.
- `CONTACT_EMAIL` — optional destination inbox.

Vercel supplies its own platform variables. Do not copy project IDs, team IDs,
tokens, or `VERCEL_ENV` into application configuration.

## Web Analytics

`@vercel/analytics/react` is mounted once in `src/main.tsx`. Web Analytics is
enabled on the `ayush-rais-work22/ayush-work` project.

`www.ayushrai.site` resolves to Netlify, which cannot serve `/_vercel/insights`
itself. `netlify.toml` proxies `/_vercel/insights/*` (the script plus its
`view`, `event`, and `session` endpoints) to `https://ayush-rai-work.vercel.app`,
the project's own alias, so live visits are counted in the same project. This
proxy is not an officially documented Vercel setup. If counts stop, first check
that `https://www.ayushrai.site/_vercel/insights/script.js` returns JavaScript.
Visitor location comes from the request Vercel receives, so it may reflect the
Netlify edge rather than the visitor.

## Safe rollout

1. Build and test locally.
2. Deploy a preview from a non-production branch.
3. Check HTML routes, API routes, Markdown twins, assets, metadata, and 404s.
4. Keep Netlify active until the preview passes.
5. Change DNS only after reviewing the records shown by Vercel.
