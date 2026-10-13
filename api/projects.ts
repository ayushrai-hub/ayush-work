/**
 * Serverless entry for the project list, project detail, and comparison REST endpoints.
 *
 * A thin adapter: handleAgentRequest accepts either a Web Request (Netlify Functions v2, returns a
 * Web Response) or Vercel's Node (req, res) pair (writes to `res`), applies rate limiting and CORS,
 * and dispatches on the request path. `/api/projects` is the fallback route when no path is readable.
 *
 * Connects to:
 * - Routes: `/api/projects` (with `?slug=` / `?compare=`), `/api/v1/projects`, `/api/v1/projects/{slug}`,
 *   `/api/v1/compare`. netlify.toml redirects the v1 paths to `/.netlify/functions/projects`;
 *   vercel.json rewrites them to `/api/projects`.
 * - src/lib/agent/http.ts (handleAgentRequest).
 */
import { handleAgentRequest } from "../src/lib/agent/http";

/** Default export picked up by both hosts. The casts defer runtime shape checks to handleAgentRequest. */
export default function handler(req: unknown, res?: unknown) {
  return handleAgentRequest(
    req as Parameters<typeof handleAgentRequest>[0],
    res as Parameters<typeof handleAgentRequest>[1],
    "/api/projects",
  );
}
