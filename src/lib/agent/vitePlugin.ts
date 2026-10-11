import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Connect, Plugin } from "vite";
import { corsHeaders, dispatchAgentApi } from "./http";
import {
  agentFiles,
  markdownForRequestPath,
  wantsMarkdown,
} from "./surfaces";

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

    if (pathname.startsWith("/api/")) {
      const result = dispatchAgentApi(pathname, method, url.searchParams);
      const body =
        method === "HEAD" || result.status === 204 || result.body == null
          ? ""
          : JSON.stringify(result.body);
      const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
      send(res, result.status, "application/json; charset=utf-8", body, {
        ...corsHeaders(origin),
        "Cache-Control": "public, max-age=300",
      });
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

    const accept = typeof req.headers.accept === "string" ? req.headers.accept : undefined;
    const explicitMarkdown = pathname.endsWith(".md");
    if (explicitMarkdown || wantsMarkdown(accept)) {
      const markdown = markdownForRequestPath(pathname);
      if (markdown) {
        const body = method === "HEAD" ? "" : markdown;
        send(res, 200, "text/markdown; charset=utf-8", body, { Vary: "Accept" });
        return;
      }
      if (explicitMarkdown) {
        send(
          res,
          404,
          "text/markdown; charset=utf-8",
          "No markdown twin for this path.\n\nSee /llms.txt\n",
        );
        return;
      }
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
