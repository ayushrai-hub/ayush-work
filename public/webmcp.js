/**
 * Progressive WebMCP registration for browser agents.
 *
 * Registers read-only tools when document.modelContext or navigator.modelContext exposes
 * registerTool. Tools call the public REST API (same records as MCP). Property names are written
 * as literal member access so scanners that inspect classic scripts can detect support.
 *
 * Loaded from index.html as a classic script (not a module chunk).
 */
(function () {
  "use strict";

  var ORIGIN = "";

  try {
    ORIGIN = window.location.origin;
  } catch {
    ORIGIN = "https://www.ayushrai.site";
  }

  function getModelContext() {
    // Keep these as literal member expressions for WebMCP scanners.
    var docCtx = document.modelContext;
    var navCtx = typeof navigator !== "undefined" ? navigator.modelContext : undefined;
    var ctx = docCtx || navCtx;
    if (!ctx || typeof ctx.registerTool !== "function") return null;
    return ctx;
  }

  function fetchJson(path) {
    return fetch(ORIGIN + path, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit",
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) {
          var msg =
            body && body.error && body.error.message
              ? body.error.message
              : "Request failed with status " + res.status;
          throw new Error(msg);
        }
        return body;
      });
    });
  }

  function clampQuery(value) {
    if (typeof value !== "string") return "";
    return value.length > 200 ? value.slice(0, 200) : value;
  }

  function searchExecute(args, forcedType) {
    var q = clampQuery(args && args.query);
    var params = new URLSearchParams();
    params.set("q", q);
    var type = forcedType || (args && typeof args.type === "string" ? args.type : "");
    if (type) params.set("type", type);
    if (args && typeof args.limit === "number") params.set("limit", String(args.limit));
    return fetchJson("/api/v1/search?" + params.toString());
  }

  var searchSchema = {
    type: "object",
    properties: {
      query: { type: "string", maxLength: 200, description: "Search text" },
      type: { type: "string", description: "Optional record type" },
      limit: { type: "integer", minimum: 1, maximum: 20 },
    },
    required: ["query"],
    additionalProperties: false,
  };

  var tools = [
    {
      name: "search_projects",
      description:
        "Search Ayush Rai's public work and projects (lexical; same as GET /api/v1/search). Not semantic search.",
      inputSchema: searchSchema,
      annotations: { readOnlyHint: true },
      execute: function (args) {
        return searchExecute(args);
      },
    },
    {
      name: "search_portfolio_projects",
      description:
        "Alias of search_projects for older clients. Lexical portfolio search via GET /api/v1/search.",
      inputSchema: searchSchema,
      annotations: { readOnlyHint: true },
      execute: function (args) {
        return searchExecute(args);
      },
    },
    {
      name: "search_articles",
      description:
        "Search published writing and notes on this site (lexical type filter for writing).",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", maxLength: 200, description: "Search text" },
          limit: { type: "integer", minimum: 1, maximum: 20 },
        },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: function (args) {
        return searchExecute(args, "writing");
      },
    },
    {
      name: "get_project",
      description: "Fetch one public project by slug (same as GET /api/v1/projects/{slug}).",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Project slug, e.g. overlay-text-box" },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: function (args) {
        var slug = args && typeof args.slug === "string" ? args.slug.trim() : "";
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          return Promise.reject(new Error("Invalid project slug."));
        }
        return fetchJson("/api/v1/projects/" + encodeURIComponent(slug));
      },
    },
    {
      name: "get_profile",
      description: "Return Ayush Rai's public profile summary from the agent-mode document.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: function () {
        return fetchJson("/agent-mode.json").then(function (doc) {
          return doc.identity || doc;
        });
      },
    },
    {
      name: "find_developer_docs",
      description: "Locate API, OpenAPI, MCP, and auth documentation URLs for this site.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: function () {
        return fetchJson("/agent-mode.json").then(function (doc) {
          return {
            developers: doc.pages && doc.pages.developers,
            openapi: doc.api && doc.api.openapi,
            auth: doc.markdown && doc.markdown.auth,
            pricing: doc.markdown && doc.markdown.pricing,
            mcp: doc.mcp,
            discovery: doc.discovery,
          };
        });
      },
    },
  ];

  function registerAll() {
    var ctx = getModelContext();
    if (!ctx || window.__ayushWebMcpRegistered) return;
    window.__ayushWebMcpRegistered = true;
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    tools.forEach(function (tool) {
      try {
        var result = ctx.registerTool(
          {
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations,
            execute: tool.execute,
          },
          controller ? { signal: controller.signal } : undefined,
        );
        if (result && typeof result.catch === "function") {
          result.catch(function (err) {
            console.warn("WebMCP tool registration failed", err);
          });
        }
      } catch (err) {
        console.warn("WebMCP tool registration failed", err);
      }
    });
  }

  // document.modelContext / navigator.modelContext may appear after load.
  registerAll();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerAll);
  }
  setTimeout(registerAll, 0);
  setTimeout(registerAll, 1000);
})();
