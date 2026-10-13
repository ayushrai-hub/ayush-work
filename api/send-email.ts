import {
  handleContactEmail,
  type ContactEmailResult,
} from "../src/lib/server/contactEmail";

const headers: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

function isNodeResponse(value: unknown): value is NodeResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NodeResponse>;
  return (
    typeof candidate.status === "function" &&
    typeof candidate.setHeader === "function"
  );
}

function sendNode(res: NodeResponse, result: ContactEmailResult) {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  if (result.body == null) {
    res.status(result.status).end();
    return;
  }
  res.status(result.status).json(result.body);
}

/**
 * Contact form handler.
 * Netlify calls this with an event and expects { statusCode, headers, body }.
 * Vercel calls it with a Node request and response, or a Web Request.
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
