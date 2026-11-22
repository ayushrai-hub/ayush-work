/**
 * A2A JSON-RPC for one read-only skill: lexical portfolio search.
 *
 * `message/send` reads the text parts of the user message, runs the same search as
 * `GET /api/v1/search`, and returns an agent message whose text is that JSON. There is no
 * streaming, no push, and no write. Unknown methods return JSON-RPC `-32601`.
 *
 * Connects to:
 * - `agentCard.ts` advertises `POST /api/a2a`. `http.ts` routes that path.
 * - `api/a2a.ts` is the Vercel entry. `search.ts` produces the payload.
 */
import { randomBytes } from "node:crypto";
import { searchPayload } from "./search";
import { validateQuery } from "./validate";

/** One JSON-RPC response body. HTTP status stays 200 so the client can read `error`. */
export interface A2aResult {
  status: number;
  body: unknown;
}

/** JSON-RPC error object. */
function rpcError(id: unknown, code: number, message: string): A2aResult {
  return { status: 200, body: { jsonrpc: "2.0", id: id ?? null, error: { code, message } } };
}

/** Text joined from A2A message parts. Data parts are ignored. */
function messageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const parts = (message as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => {
      if (!part || typeof part !== "object") return "";
      const record = part as { kind?: unknown; text?: unknown };
      return record.kind === "text" && typeof record.text === "string" ? record.text : "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

/**
 * Handles one A2A JSON-RPC call. A body that is not JSON is HTTP 400.
 * `message/send` searches with the message text and returns an agent message.
 */
export function handleA2aRpc(rawBody: string): A2aResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } } };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return rpcError(null, -32600, "Invalid Request");
  }
  const request = parsed as { jsonrpc?: unknown; id?: unknown; method?: unknown; params?: unknown };
  if (request.jsonrpc !== "2.0" || typeof request.method !== "string") {
    return rpcError(request.id, -32600, "Invalid Request");
  }
  if (request.method !== "message/send") {
    return rpcError(request.id, -32601, `Method ${request.method} is not implemented. This agent accepts message/send.`);
  }
  const params = request.params;
  const message = params && typeof params === "object" ? (params as { message?: unknown }).message : undefined;
  const text = messageText(message);
  const queryError = validateQuery(text);
  if (queryError) return rpcError(request.id, -32602, queryError.message);
  const payload = searchPayload(text);
  return {
    status: 200,
    body: {
      jsonrpc: "2.0",
      id: request.id ?? null,
      result: {
        kind: "message",
        messageId: `msg_${randomBytes(8).toString("hex")}`,
        role: "agent",
        parts: [{ kind: "text", text: JSON.stringify(payload) }],
      },
    },
  };
}
