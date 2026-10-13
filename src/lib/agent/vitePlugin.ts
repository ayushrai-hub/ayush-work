import { readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { resolve } from "node:path";
import type { Connect, Plugin } from "vite";
import { API_CATALOG_CONTENT_TYPE, API_CATALOG_PATH } from "./apiCatalog";
import { agentApiResponse } from "./http";
import { renderNotFoundMarkdown } from "./markdown";
import {
  AI_CATALOG_CONTENT_TYPE,
  AI_CATALOG_PATH,
  LEGACY_SERVER_CARD_PATH,
  MCP_ENDPOINT_PATH,
  SERVER_CARD_HEADERS,
  SERVER_CARD_PATH,
} from "./mcpCard";
import { handleMcpRequest } from "./mcpHttp";
import { clientKeyFrom } from "./rateLimit";
import {
  agentFiles,
  MARKDOWN_HEADERS,
  markdownForRequestPath,
  negotiateMarkdown,
  type MarkdownNegotiation,
} from "./surfaces";

const DISCOVERY_CORS = { "Access-Control-Allow-Origin": "*" };

const WELL_KNOWN_TYPES: Record<string, Record<string, string>> = {
  [API_CATALOG_PATH]: { "Content-Type": API_CATALOG_CONTENT_TYPE, ...DISCOVERY_CORS },
  [AI_CATALOG_PATH]: { "Content-Type": AI_CATALOG_CONTENT_TYPE, ...DISCOVERY_CORS },
  [LEGACY_SERVER_CARD_PATH]: SERVER_CARD_HEADERS,
};

function send(
  res: {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (body?: string) => void;
  },
  status: number,
  contentType: string,
  body: string,
  extra?: Record<string, string>,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", contentType);
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (extra) {
    for (const [key, value] of Object.entries(extra)) res.setHeader(key, value);
  }
  res.end(body);
}

async function serveMcp(req: IncomingMessage, res: ServerResponse, url: URL) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string" && key !== "content-length") headers.set(key, value);
  }
  const method = (req.method ?? "GET").toUpperCase();
  const response = await handleMcpRequest(
    new Request(url, {
      method,
      headers,
      body: method === "POST" ? Buffer.concat(chunks).toString("utf8") : undefined,
    }),
  );
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(await response.text());
}

function explicitMarkdown(pathname: string): MarkdownNegotiation {
  const markdown = markdownForRequestPath(pathname);
  if (markdown) return { status: 200, body: markdown };
  return { status: 404, body: renderNotFoundMarkdown() };
}

function attach(middlewares: Connect.Server) {
  middlewares.use((req, res, next) => {
    const raw = req.url ?? "/";
    let url: URL;
    try {
      url = new URL(raw, "http://localhost");
    } catch {
      next();
      return;
    }
    const pathname = url.pathname;
    const method = (req.method ?? "GET").toUpperCase();

    if (pathname === MCP_ENDPOINT_PATH || pathname === SERVER_CARD_PATH) {
      void serveMcp(req, res, url).catch(next);
      return;
    }

    const wellKnownType = WELL_KNOWN_TYPES[pathname];
    if (wellKnownType) {
      const { "Content-Type": type, ...headers } = wellKnownType;
      send(res, 200, type, agentFiles()[pathname.slice(1)] ?? "", headers);
      return;
    }

    if (pathname.startsWith("/api/")) {
      const response = agentApiResponse({
        pathname,
        method,
        params: url.searchParams,
        origin: typeof req.headers.origin === "string" ? req.headers.origin : undefined,
        clientKey: req.socket.remoteAddress ?? clientKeyFrom(req.headers),
      });
      const { "Content-Type": type, ...headers } = response.headers;
      send(res, response.status, type, response.body ?? "", headers);
      return;
    }

    if (pathname === "/AGENTS.md" || pathname === "/SKILL.md") {
      const docs = documentationFiles();
      const key = pathname.slice(1);
      send(res, 200, "text/markdown; charset=utf-8", docs[key] ?? "");
      return;
    }

    if (
      pathname === "/llms.txt" ||
      pathname === "/llms-full.txt" ||
      pathname === "/openapi.json"
    ) {
      const files = agentFiles();
      const key = pathname.slice(1);
      const type = pathname.endsWith(".json")
        ? "application/json; charset=utf-8"
        : "text/plain; charset=utf-8";
      send(res, 200, type, files[key] ?? "");
      return;
    }

    const markdownResult = pathname.endsWith(".md")
      ? explicitMarkdown(pathname)
      : negotiateMarkdown(
          pathname,
          typeof req.headers.accept === "string" ? req.headers.accept : undefined,
        );
    if (markdownResult) {
      const { "Content-Type": type, ...headers } = MARKDOWN_HEADERS;
      const body = method === "HEAD" ? "" : markdownResult.body;
      send(res, markdownResult.status, type, body, headers);
      return;
    }

    next();
  });
}

function documentationFiles(): Record<string, string> {
  return {
    "AGENTS.md": readFileSync(resolve(process.cwd(), "AGENTS.md"), "utf8"),
    "SKILL.md": readFileSync(
      resolve(process.cwd(), "skills/portfolio-discovery/SKILL.md"),
      "utf8",
    ),
  };
}

/** Dev, preview, and production files for Markdown twins, llms.txt, and OpenAPI. */
export function agentSurfacesPlugin(): Plugin {
  return {
    name: "agent-surfaces",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
    generateBundle() {
      const files = { ...agentFiles(), ...documentationFiles() };
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}
