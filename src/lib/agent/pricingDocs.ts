/**
 * Machine-readable pricing notes for this site's public API and MCP surfaces.
 *
 * There is no paid product, checkout, or metered commercial API. Agents looking for `/pricing.md`
 * need an honest statement of that fact rather than invented tiers or Offer schema.
 *
 * Connects to:
 * - `surfaces.ts` emits `/pricing.md` via `agentFiles()`.
 * - Linked from `llms.txt`, developer docs, and agent-mode JSON. Tested in `agentReadiness.test.ts`.
 */
import { person } from "../../content";
import { API_ACCESS_NOTE, API_RATE_LIMIT_NOTE } from "./openapi";

/** Absolute origin without a trailing slash. */
function origin() {
  return person.siteUrl.replace(/\/$/, "");
}

/**
 * Full `/pricing.md` body: free public read-only access, limits, and what is not sold here.
 */
export function renderPricingMarkdown(): string {
  const base = origin();
  return `---
title: Pricing
description: The public REST API and MCP server on ayushrai.site are free. There are no paid tiers.
canonical: ${base}/pricing.md
last-updated: 2026-10-16
---

# Pricing

${person.name}'s site is a **personal portfolio and developer-discovery surface**, not a paid API product.

## Public API and MCP

| Surface | Price | Notes |
| --- | --- | --- |
| \`GET /api/v1/*\` (search, projects, compare) | Free | ${API_ACCESS_NOTE} |
| \`POST /api/mcp\` (Streamable HTTP) | Free | Same public records; no write tools |
| Markdown twins, \`/llms.txt\`, OpenAPI, ARD | Free | Static files; no account |

Rate limits: ${API_RATE_LIMIT_NOTE}

## What this site does not sell

- No paid API tiers, subscriptions, or usage-based billing.
- No checkout, carts, invoices, or commerce Offer markup for this API.
- No separate sandbox with different data: production content is already public and read-only.
- Custom software or evaluation work is arranged by email (${person.email}), not through this API.

## Related

- Authentication (none required): ${base}/auth.md
- Developer docs: ${base}/developers/
- OpenAPI: ${base}/openapi.json
`;
}
