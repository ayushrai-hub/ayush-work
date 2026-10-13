import { handleMcpRequest } from "../src/lib/agent/mcpHttp";

type NodeRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

const DROPPED_HEADERS = new Set(["content-length", "connection", "transfer-encoding"]);

function toWebRequest(req: NodeRequest): Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (DROPPED_HEADERS.has(key.toLowerCase())) continue;
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const method = (req.method || "GET").toUpperCase();
  const body =
    method === "POST"
      ? typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body ?? null)
      : undefined;
  const host = headers.get("host") ?? "www.ayushrai.site";
  return new Request(new URL(req.url || "/api/mcp", `https://${host}`), { method, headers, body });
}

/**
 * Remote MCP endpoint (Streamable HTTP).
 * Netlify passes a Web Request. Vercel passes a Node request and response.
 */
export default async function handler(request: unknown, response?: unknown) {
  if (request instanceof Request) return handleMcpRequest(request);

  const res = response as NodeResponse;
  const result = await handleMcpRequest(toWebRequest(request as NodeRequest));
  result.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(result.status).end(await result.text());
}
