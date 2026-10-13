/**
 * Serverless entry for the lexical site search endpoint.
 *
 * A thin adapter: handleAgentRequest accepts either a Web Request (Netlify Functions v2, returns a
 * Web Response) or Vercel's Node (req, res) pair (writes to `res`), applies rate limiting and CORS,
 * and runs the same search function as the on-site dialog.
 *
 * Connects to:
 * - Routes: `/api/search` and `/api/v1/search`. netlify.toml redirects the v1 path to
 *   `/.netlify/functions/search`; vercel.json rewrites it to `/api/search`.
 * - src/lib/agent/http.ts (handleAgentRequest), which calls src/lib/agent/search.ts.
 */
import { handleAgentRequest } from "../src/lib/agent/http";

/** Default export picked up by both hosts. The casts defer runtime shape checks to handleAgentRequest. */
export default function handler(req: unknown, res?: unknown) {
  return handleAgentRequest(
    req as Parameters<typeof handleAgentRequest>[0],
    res as Parameters<typeof handleAgentRequest>[1],
    "/api/search",
  );
}
