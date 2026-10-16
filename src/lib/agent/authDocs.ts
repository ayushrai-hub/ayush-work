/**
 * Markdown documentation for authentication on this site's public API and MCP surfaces.
 *
 * The API and MCP server are intentionally public and unauthenticated. This file explains that
 * architecture so agents do not hunt for OAuth metadata that does not exist. It does not advertise
 * identity, claim, or token endpoints.
 *
 * Connects to:
 * - `surfaces.ts` emits `/auth.md` via `agentFiles()`.
 * - `developerDocs.ts` and `agentMode.ts` link here. Tested in `agentReadiness.test.ts`.
 */
import { person } from "../../content";

/** Absolute origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

/**
 * Full `/auth.md` body: discovery facts, how to call the API without tokens, and what is not offered.
 */
export function renderAuthMarkdown(): string {
  const base = origin();
  return `---
title: Authentication
description: This site's public REST API and MCP server require no authentication.
canonical: ${base}/auth.md
last-updated: 2026-10-16
---

# Authentication

${person.name}'s site exposes a **public, read-only** REST API and MCP server. There is no login, API key, OAuth client, or bearer token for these surfaces today.

## Discover

| Resource | URL | Auth |
| --- | --- | --- |
| OpenAPI | ${base}/openapi.json | None |
| API catalog (RFC 9727) | ${base}/.well-known/api-catalog | None |
| ARD catalog (v0.91) | ${base}/.well-known/ard.json | None |
| AI Catalog (legacy path) | ${base}/.well-known/ai-catalog.json | None |
| MCP Server Card | ${base}/api/mcp/server-card | None |
| Developer docs | ${base}/developers/ | None |
| This document | ${base}/auth.md | None |

## Pick a method

Use **no authentication**. Send ordinary HTTPS GET (REST) or POST (MCP Streamable HTTP) requests.

Do **not** expect:

- \`/.well-known/oauth-protected-resource\` (RFC 9728) — there is no OAuth resource server.
- \`/.well-known/oauth-authorization-server\` (RFC 8414) — there is no authorization server on this origin.
- \`WWW-Authenticate\` challenges on \`/api/v1/*\` or \`/api/mcp\` — those routes return 200 with public data, or typed JSON errors for bad input / rate limits, not 401.

## Register / Claim / Exchange

Not applicable. There is no client registration, identity claim, or token exchange.

## Use the API

Examples (no \`Authorization\` header):

\`\`\`bash
curl "${base}/api/v1/search?q=open+framework"
curl "${base}/api/v1/projects/overlay-text-box"
curl -X POST "${base}/api/mcp" -H "Content-Type: application/json" -H "Accept: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"example","version":"0.0.1"}}}'
\`\`\`

Rate limits still apply: 60 requests per 60 seconds per client address (see \`/developers\`). A 429 includes \`Retry-After\` and draft-11 \`RateLimit\` headers.

## Errors

Public endpoints never return \`401 Unauthorized\` for missing credentials. They return the shared JSON error envelope \`{ "error": { "code", "message", "hint", "docs" } }\` for validation, not-found, method, and rate-limit failures. See \`/openapi.json\` and \`/developers\`.

## Revocation

Not applicable. There are no issued tokens to revoke.

## Contact

Questions about access: ${person.email}. Phone ${person.phoneDisplay}.
`;
}
