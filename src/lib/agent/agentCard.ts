/**
 * A2A agent card for `/.well-known/agent-card.json`.
 *
 * The card describes the one implemented skill: lexical search through `POST /api/a2a`.
 * It does not advertise streaming, payments, or a registry listing.
 *
 * Connects to:
 * - `a2a.ts` implements `message/send`. `surfaces.ts` emits this JSON.
 * - `developerDocs.ts` and `llms.txt` link the path. Uses `person.siteUrl`.
 */
import { person } from "../../content";

/** Path of the card. Scanners request this exact well-known URL. */
export const AGENT_CARD_PATH = "/.well-known/agent-card.json";

/** JSON-RPC endpoint the card's `url` field points at. */
export const A2A_PATH = "/api/a2a";

/** Canonical origin without a trailing slash. */
function origin(): string {
  return person.siteUrl.replace(/\/$/, "");
}

/**
 * Agent card for the public portfolio search skill.
 * `url` is the JSON-RPC endpoint, not a marketing page.
 */
export function buildAgentCard() {
  const base = origin();
  return {
    protocolVersion: "0.3.0",
    name: `${person.name} portfolio`,
    description:
      "Read-only agent for Ayush Rai's public portfolio. message/send runs the same lexical search as GET /api/v1/search. It does not write, send email, or call a model.",
    url: `${base}${A2A_PATH}`,
    preferredTransport: "JSONRPC",
    provider: {
      organization: person.name,
      url: base,
    },
    version: "1.0.0",
    documentationUrl: `${base}/developers/`,
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    securitySchemes: {},
    defaultInputModes: ["text/plain"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: [
      {
        id: "search-portfolio",
        name: "Search portfolio",
        description: "Lexical search of published projects, products, writing, and notes on ayushrai.site.",
        tags: ["search", "portfolio", "ayushrai.site"],
        examples: ["agents", "revenue intelligence", "overlay text box"],
        inputModes: ["text/plain"],
        outputModes: ["application/json", "text/plain"],
      },
    ],
  };
}

/** Pretty-printed card with a trailing newline, matching the other well-known JSON files. */
export function agentCardJson(): string {
  return `${JSON.stringify(buildAgentCard(), null, 2)}\n`;
}
