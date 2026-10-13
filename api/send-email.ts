/**
 * Serverless entry for the contact form: `POST /api/send-email` (plus `OPTIONS` preflight).
 *
 * Adapts each host's calling convention to handleContactEmail, which validates the fields and sends
 * through SendGrid. Netlify Functions v2 pass a Web Request and expect a Web Response. Vercel's Node
 * runtime passes (req, res). A legacy Lambda-style event branch (`{ httpMethod, body }` in,
 * `{ statusCode, headers, body }` out) remains for older callers. Any thrown error becomes a 500.
 *
 * Connects to:
 * - src/lib/emailService.ts posts here; src/pages/ContactPage.tsx calls that service.
 * - Netlify: netlify.toml routes `/api/*` to `/.netlify/functions/:splat`. Vercel serves it as `/api/send-email`.
 * - src/lib/server/contactEmail.ts (handleContactEmail): env SENDGRID_API_KEY, FROM_EMAIL, optional CONTACT_EMAIL.
 */
import {
  handleContactEmail,
  type ContactEmailResult,
} from "../src/lib/server/contactEmail";

/** CORS and content-type headers sent on every response, including errors and preflight. */
const headers: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

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

/** Writes a result to a Node response: shared headers, then JSON, or an empty body when `body` is null. */
function sendNode(res: NodeResponse, result: ContactEmailResult) {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  if (result.body == null) {
    res.status(result.status).end();
    return;
  }
  res.status(result.status).json(result.body);
}

/**
 * Contact form handler. Branches on the argument shape:
 * - Web Request (Netlify Functions v2): returns a Web Response.
 * - Node (req, res) (Vercel): writes to `res` and returns undefined.
 * - Lambda-style event (legacy callers only): returns `{ statusCode, headers, body }`.
 * Errors are logged and answered with a generic 500 in the same shape as the request.
 */
export default async function handler(
  eventOrRequest: unknown,
  responseOrContext?: unknown,
) {
  try {
    if (typeof Request !== "undefined" && eventOrRequest instanceof Request) {
      const request = eventOrRequest;
      const raw = request.method === "POST" ? await request.text() : null;
      const result = await handleContactEmail(request.method, raw);
      const body = result.body == null ? "" : JSON.stringify(result.body);
      return new Response(body, { status: result.status, headers });
    }

    if (isNodeResponse(responseOrContext)) {
      const request = eventOrRequest as { method?: string; body?: unknown };
      const result = await handleContactEmail(
        (request.method || "GET").toUpperCase(),
        request.body,
      );
      sendNode(responseOrContext, result);
      return;
    }

    const event = eventOrRequest as { httpMethod?: string; body?: string | null };
    const result = await handleContactEmail(
      (event.httpMethod || "GET").toUpperCase(),
      event.body ?? null,
    );
    return {
      statusCode: result.status,
      headers,
      body: result.body == null ? "" : JSON.stringify(result.body),
    };
  } catch (error) {
    console.error("Email service error:", error);
    const failure = {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
    if (isNodeResponse(responseOrContext)) {
      sendNode(responseOrContext, { status: 500, body: failure });
      return;
    }
    if (typeof Request !== "undefined" && eventOrRequest instanceof Request) {
      return new Response(JSON.stringify(failure), { status: 500, headers });
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(failure),
    };
  }
}
