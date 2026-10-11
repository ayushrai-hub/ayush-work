import { handleAgentRequest } from "../src/lib/agent/http";

export default function handler(req: unknown, res?: unknown) {
  return handleAgentRequest(
    req as Parameters<typeof handleAgentRequest>[0],
    res as Parameters<typeof handleAgentRequest>[1],
    "/api/search",
  );
}
