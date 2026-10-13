/**
 * Serverless entry for the contact form: `POST /api/send-email` (plus `OPTIONS` preflight).
 *
 * Adapts each host's calling convention to handleContactEmail, which rate-limits, validates, and
 * sends through SendGrid. Netlify Functions v2 pass a Web Request and expect a Web Response. Vercel's
 * Node runtime passes (req, res). A legacy Lambda-style event branch (`{ httpMethod, body }` in,
 * `{ statusCode, headers, body }` out) remains for older callers. Any thrown error becomes a 500.
 *
 * CORS: the form posts from the same origin, which needs no grant. `Access-Control-Allow-Origin`
 * is echoed only for the site's own origins (src/lib/siteOrigins.ts), so other sites' pages cannot
 * use a visitor's browser to send through this endpoint.
 *
 * Connects to:
 * - src/lib/emailService.ts posts here; src/pages/ContactPage.tsx calls that service.
 * - Netlify: netlify.toml routes `/api/*` to `/.netlify/functions/:splat`. Vercel serves it as `/api/send-email`.
 * - src/lib/server/contactEmail.ts (handleContactEmail): env SENDGRID_API_KEY, FROM_EMAIL, optional CONTACT_EMAIL.
 * - src/lib/agent/rateLimit.ts (clientKeyFrom) for the per-client limit key.
 */
import {
  handleContactEmail,
  type ContactEmailResult,
} from "../src/lib/server/contactEmail";
import { clientKeyFrom } from "../src/lib/agent/rateLimit";
import { isSiteOrigin } from "../src/lib/siteOrigins";

/** Request headers as a Web `Headers` object or a Node-style record. */
type HeaderBag = Headers | Record<string, string | string[] | undefined> | undefined;

/** Reads the Origin header from either header shape. */
function originOf(headers: HeaderBag): string | undefined {
  if (!headers) return undefined;
  if (typeof (headers as Headers).get === "function") return (headers as Headers).get("origin") ?? undefined;
  const value = (headers as Record<string, string | string[] | undefined>).origin;
  return Array.isArray(value) ? value[0] : value;
}

/** Content-type, CORS, and per-result headers for one response. */
export function responseHeaders(
  origin: string | undefined,
  extra: Record<string, string> = {},
): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Expose-Headers": "RateLimit, RateLimit-Policy, Retry-After",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    Vary: "Origin",
    ...extra,
  };
  if (isSiteOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

/** The subset of Vercel's Node response this handler writes to. */
type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

/** True when the second argument looks like Vercel's Node response (has `status` and `setHeader`). */
function isNodeResponse(value: unknown): value is NodeResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NodeResponse>;
  return (
    typeof candidate.status === "function" &&
    typeof candidate.setHeader === "function"
  );
}

/** Writes a result to a Node response: headers, then JSON, or an empty body when `body` is null. */
function sendNode(res: NodeResponse, origin: string | undefined, result: ContactEmailResult) {
  for (const [key, value] of Object.entries(responseHeaders(origin, result.headers))) {
    res.setHeader(key, value);
  }
  if (result.body == null) {
    res.status(result.status).end();
    return;
  }
  res.status(result.status).json(result.body);
}

const FAILURE: ContactEmailResult = {
  status: 500,
  body: { success: false, message: "Failed to send message. Please try again later." },
};

/**
 * Contact form handler. Branches on the argument shape:
 * - Web Request (Netlify Functions v2): returns a Web Response.
 * - Node (req, res) (Vercel): writes to `res` and returns undefined.
 * - Lambda-style event (legacy callers only): returns `{ statusCode, headers, body }`.
 * Unexpected errors are logged without request data and answered with a generic 500.
 */
export default async function handler(
  eventOrRequest: unknown,
  responseOrContext?: unknown,
) {
  if (typeof Request !== "undefined" && eventOrRequest instanceof Request) {
    const request = eventOrRequest;
    const origin = originOf(request.headers);
    let result: ContactEmailResult;
    try {
      const raw = request.method === "POST" ? await request.text() : null;
      result = await handleContactEmail(request.method, raw, clientKeyFrom(request.headers));
    } catch (error) {
      console.error("Contact handler error:", error instanceof Error ? error.name : "unknown");
      result = FAILURE;
    }
    const body = result.body == null ? "" : JSON.stringify(result.body);
    return new Response(body, { status: result.status, headers: responseHeaders(origin, result.headers) });
  }

  if (isNodeResponse(responseOrContext)) {
    const request = eventOrRequest as { method?: string; body?: unknown; headers?: HeaderBag };
    const origin = originOf(request.headers);
    let result: ContactEmailResult;
    try {
      result = await handleContactEmail(
        (request.method || "GET").toUpperCase(),
        request.body,
        clientKeyFrom(request.headers),
      );
    } catch (error) {
      console.error("Contact handler error:", error instanceof Error ? error.name : "unknown");
      result = FAILURE;
    }
    sendNode(responseOrContext, origin, result);
    return;
  }

  const event = eventOrRequest as {
    httpMethod?: string;
    body?: string | null;
    headers?: Record<string, string | undefined>;
  };
  const origin = originOf(event.headers);
  let result: ContactEmailResult;
  try {
    result = await handleContactEmail(
      (event.httpMethod || "GET").toUpperCase(),
      event.body ?? null,
      clientKeyFrom(event.headers),
    );
  } catch (error) {
    console.error("Contact handler error:", error instanceof Error ? error.name : "unknown");
    result = FAILURE;
  }
  return {
    statusCode: result.status,
    headers: responseHeaders(origin, result.headers),
    body: result.body == null ? "" : JSON.stringify(result.body),
  };
}
