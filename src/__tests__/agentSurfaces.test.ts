/**
 * Tests the agent surfaces built from src/content: search, project API, Markdown twins, negotiation, catalogs, and MCP tools.
 *
 * Verifies that every search-index href resolves to a real route, record, or
 * anchor; that lexical ranking puts title hits before summary hits and matches
 * /api/search; that project list, detail, compare, archive, and traversal cases
 * return the right statuses; that Markdown and llms files list the published phone
 * number and omit every needsConfirmation claim; that role view only reorders work; that
 * Accept: text/markdown negotiation returns Markdown or a Markdown 404; that
 * cursors page through all projects; that the RFC 9727 catalog lists only
 * deployed APIs; and that the stateless MCP endpoint initializes, lists four
 * tools, answers get_project, and rejects GET with 405.
 *
 * Connects to:
 * - src/content (records, search index, needsConfirmation lists)
 * - src/lib/agent/{audiences,http,markdown,markdownMiddleware,mcpHttp,surfaces,searchTool,openapi,projectsQuery,routes,search}.ts
 */
import { describe, expect, it } from "vitest";
import {
  capabilities,
  education,
  experience,
  getProductBySlug,
  getResearchBySlug,
  getWorkBySlug,
  ideas,
  leadership,
  leadershipNeedsConfirmation,
  notes,
  person,
  principles,
  projects,
  recognition,
  research as researchItems,
  researchAwardsNeedsConfirmation,
  SEARCH_ITEM_TYPES,
  searchIndex,
  writing,
} from "../content";
import { parseAudience, rankWorkForAudience } from "../lib/agent/audiences";
import { dispatchAgentApi, handleAgentRequest } from "../lib/agent/http";
import {
  escapeMarkdownText,
  renderLlmsFull,
  renderLlmsTxt,
  renderNotFoundMarkdown,
  renderPageMarkdown,
} from "../lib/agent/markdown";
import { markdownMiddleware } from "../lib/agent/markdownMiddleware";
import { handleMcpRequest } from "../lib/agent/mcpHttp";
import { agentFiles, negotiateMarkdown } from "../lib/agent/surfaces";
import { executePortfolioSearch, PORTFOLIO_SEARCH_TOOL } from "../lib/agent/searchTool";
import { buildOpenApiDocument } from "../lib/agent/openapi";
import { comparePublicProjects, getPublicProject } from "../lib/agent/projectsQuery";
import { isExternalHref, isKnownRoute, pathnameOf } from "../lib/agent/routes";
import { SEARCH_TYPES, searchPortfolio } from "../lib/agent/search";
import { work } from "../content";

/**
 * Returns true when `href` is external, or is a known route whose slug and
 * optional #anchor match an existing content record.
 */
function hrefResolves(href: string): boolean {
  if (isExternalHref(href)) return true;
  const path = pathnameOf(href);
  const hash = href.includes("#") ? href.split("#")[1] : undefined;
  if (!isKnownRoute(path)) return false;

  const workMatch = path.match(/^\/work\/([^/]+)$/);
  if (workMatch) return Boolean(getWorkBySlug(workMatch[1]));
  const productLog = path.match(/^\/products\/([^/]+)\/log$/);
  if (productLog) return Boolean(getProductBySlug(productLog[1]));
  const product = path.match(/^\/products\/([^/]+)$/);
  if (product) return Boolean(getProductBySlug(product[1]));
  const research = path.match(/^\/research\/([^/]+)$/);
  if (research) return Boolean(getResearchBySlug(research[1]));
  const note = path.match(/^\/notes\/([^/]+)$/);
  if (note) return notes.some((item) => item.slug === note[1]);
  const piece = path.match(/^\/writing\/([^/]+)$/);
  if (piece) return writing.some((item) => item.slug === piece[1]);

  if (!hash) return true;
  if (path === "/projects") return projects.some((item) => item.slug === hash);
  if (path === "/education") return education.some((item) => item.slug === hash);
  if (path === "/leadership") return leadership.some((item) => item.slug === hash);
  if (path === "/recognition") return recognition.some((item) => item.slug === hash);
  if (path === "/ideas") return ideas.some((item) => item.slug === hash);
  if (path === "/principles") return principles.some((item) => item.slug === hash);
  if (path === "/about" || path === "/experience") {
    if (path === "/about" && hash.startsWith("capability-")) {
      return capabilities.some(
        (item) => `capability-${item.domain.toLowerCase()}` === hash,
      );
    }
    return experience.some((item) => item.slug === hash);
  }
  return false;
}

/** Content-derived agent outputs and the HTTP handlers that serve them. */
describe("agent surfaces", () => {
  it("points every search result at a real route or external URL", () => {
    const broken = searchIndex.filter((item) => !hrefResolves(item.href));
    expect(broken.map((item) => `${item.id} -> ${item.href}`)).toEqual([]);
  });

  it("ranks lexical title matches ahead of summary matches and shares that order with the API", () => {
    expect(searchPortfolio("").length).toBeLessThanOrEqual(8);
    expect(searchPortfolio("zzzz-no-such-record")).toEqual([]);
    const ranked = searchPortfolio(
      "open framework",
      {},
      [
        {
          id: "summary-only",
          type: "note",
          title: "Other note",
          summary: "mentions open framework in passing",
          href: "/notes",
          tags: [],
        },
        {
          id: "title-hit",
          type: "work",
          title: "Open Framework notes",
          summary: "case study",
          href: "/work/open-framework-notes",
          tags: [],
        },
      ],
    );
    expect(ranked.map((item) => item.id)).toEqual(["title-hit", "summary-only"]);
    const hits = searchPortfolio("open framework");
    expect(hits.some((item) => item.id === "work:the-open-framework")).toBe(true);
    expect(hits.length).toBeLessThanOrEqual(12);
    const api = dispatchAgentApi(
      "/api/search",
      "GET",
      new URLSearchParams("q=open+framework"),
    );
    expect(api.status).toBe(200);
    expect(api.body).toMatchObject({ match: "lexical", results: hits });
    const tooLong = dispatchAgentApi(
      "/api/search",
      "GET",
      new URLSearchParams(`q=${"a".repeat(201)}`),
    );
    expect(tooLong.status).toBe(400);
    expect(tooLong.body).toMatchObject({ error: { code: "invalid_query" } });
  });

  it("serves project list, detail, and comparison from the site records", () => {
    const listed = dispatchAgentApi("/api/projects", "GET", new URLSearchParams());
    expect(listed.status).toBe(200);
    const one = getPublicProject("overlay-text-box");
    expect(one?.workPath).toBe("/work/overlay-text-box");
    const missing = dispatchAgentApi(
      "/api/projects",
      "GET",
      new URLSearchParams("slug=does-not-exist"),
    );
    expect(missing.status).toBe(404);
    const compared = comparePublicProjects(["overlay-text-box", "expert-o", "nope"]);
    expect(compared.ok).toBe(true);
    if (compared.ok) {
      expect(compared.projects.map((item) => item.slug)).toEqual([
        "overlay-text-box",
        "expert-o",
      ]);
      expect(compared.missing).toEqual(["nope"]);
    }
    expect(comparePublicProjects(["overlay-text-box", "overlay-text-box"]).ok).toBe(false);
    const detail = dispatchAgentApi(
      "/api/v1/projects/overlay-text-box",
      "GET",
      new URLSearchParams(),
    );
    expect(detail.status).toBe(200);
    const archived = dispatchAgentApi(
      "/api/v1/projects/super-site-archive",
      "GET",
      new URLSearchParams(),
    );
    expect(archived.status).toBe(404);
    const traversal = dispatchAgentApi(
      "/api/v1/projects/..%2Fetc%2Fpasswd",
      "GET",
      new URLSearchParams(),
    );
    expect(traversal.status).toBe(400);
    const compare = dispatchAgentApi(
      "/api/v1/compare",
      "GET",
      new URLSearchParams("slugs=overlay-text-box,overlay-text-box"),
    );
    expect(compare.status).toBe(400);
  });

  it("writes markdown twins and llms.txt with the published phone and without withheld awards", () => {
    const workPage = renderPageMarkdown("/work/the-open-framework");
    expect(workPage).toContain("The Open Framework");
    expect(workPage).toContain("https://www.ayushrai.site/work/the-open-framework");
    const full = `${renderLlmsTxt()}\n${renderLlmsFull()}`;
    expect(full).toContain(person.phoneDisplay);
    expect(full).toContain(person.whatsappUrl);
    for (const claim of leadershipNeedsConfirmation) {
      expect(full).not.toContain(claim);
    }
    for (const claim of researchAwardsNeedsConfirmation) {
      expect(full).not.toContain(claim);
    }
    expect(renderLlmsTxt()).toContain("/api/v1/search");
    expect(renderLlmsTxt()).toContain("/api/mcp");
    expect(renderLlmsTxt()).toContain("/.well-known/api-catalog");
    expect(renderLlmsTxt()).toContain("/developers");
    expect(escapeMarkdownText("Title with *stars* and [link](http://example.com)")).not.toContain(
      "*stars*",
    );
    expect(escapeMarkdownText("")).toBe("");
    expect(renderPageMarkdown("/missing-slug")).toBeNull();
  });

  it("reorders existing work for a role without inventing records", () => {
    expect(parseAudience("nope")).toBe("general");
    expect(parseAudience("hiring")).toBe("recruiter");
    expect(parseAudience("evaluation")).toBe("research");
    const ranked = rankWorkForAudience("product", work);
    expect(ranked.map((item) => item.slug).sort()).toEqual(work.map((item) => item.slug).sort());
    expect(ranked[0]?.type).toBe("product");
  });

  it("returns a Web Response when the host does not pass a Node response", async () => {
    const response = await handleAgentRequest(
      { method: "GET", url: "https://www.ayushrai.site/api/search?q=medvoice" },
      undefined,
      "/api/search",
    );
    expect(response).toBeInstanceOf(Response);
    if (!(response instanceof Response)) return;
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.match).toBe("lexical");
  });

  // Also checks the WebMCP search tool's type validation, and that "phone" finds the person record.
  it("publishes an OpenAPI document for the read API", () => {
    const spec = buildOpenApiDocument();
    expect(spec.paths["/api/search"]).toBeTruthy();
    expect(spec.paths["/api/projects"]).toBeTruthy();
    expect(spec.paths["/api/v1/projects"]).toBeTruthy();
    expect(spec.paths["/api/v1/projects/{slug}"]).toBeTruthy();
    expect(spec.paths["/api/v1/compare"]).toBeTruthy();
    expect(spec.servers[0]?.url).toBe("https://www.ayushrai.site");
    const tool = executePortfolioSearch({ query: "open framework", type: "not-a-type" });
    expect(tool.isError).toBe(true);
    const found = executePortfolioSearch({ query: "open framework" });
    expect(found.isError).toBeUndefined();
    expect(searchPortfolio("phone").map((item) => item.id)).toContain("person");
  });

  it("negotiates Markdown for pages and a Markdown 404 for unknown paths", async () => {
    const markdownAccept = "text/markdown";
    const browserAccept = "text/html,application/xhtml+xml,*/*;q=0.8";

    const home = markdownMiddleware(
      new Request("https://www.ayushrai.site/", { headers: { accept: markdownAccept } }),
    );
    expect(home?.status).toBe(200);
    expect(home?.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(home?.headers.get("vary")).toBe("Accept");
    expect(await home?.text()).toBe(renderPageMarkdown("/"));

    const missing = markdownMiddleware(
      new Request("https://www.ayushrai.site/some-path-that-does-not-exist/", {
        headers: { accept: markdownAccept },
      }),
    );
    expect(missing?.status).toBe(404);
    expect(missing?.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    const body = (await missing?.text()) ?? "";
    expect(body).toBe(renderNotFoundMarkdown());
    expect(body).toContain("https://www.ayushrai.site/llms.txt");
    expect(body).toContain("https://www.ayushrai.site/sitemap.xml");
    expect(agentFiles()["404.md"]).toBe(body);

    expect(
      markdownMiddleware(
        new Request("https://www.ayushrai.site/", { headers: { accept: browserAccept } }),
      ),
    ).toBeUndefined();
    expect(negotiateMarkdown("/about/", markdownAccept)?.body).toBe(renderPageMarkdown("/about"));
    expect(negotiateMarkdown("/design-system", markdownAccept)).toBeNull();
    expect(negotiateMarkdown("/api/search", markdownAccept)).toBeNull();
    expect(negotiateMarkdown("/favicon.ico", markdownAccept)).toBeNull();
    expect(negotiateMarkdown("/%E0%A4%A", markdownAccept)?.status).toBe(404);
  });

  it("pages list endpoints with an opaque cursor until nextCursor is null", () => {
    const seen: string[] = [];
    let cursor: string | null = "";
    do {
      const params = new URLSearchParams({ limit: "2", archive: "1" });
      if (cursor) params.set("cursor", cursor);
      const result = dispatchAgentApi("/api/v1/projects", "GET", params);
      expect(result.status).toBe(200);
      const body = result.body as { projects: { slug: string }[]; nextCursor: string | null };
      seen.push(...body.projects.map((item) => item.slug));
      cursor = body.nextCursor;
    } while (cursor);
    expect(seen).toEqual(projects.map((item) => item.slug));

    const first = dispatchAgentApi("/api/v1/search", "GET", new URLSearchParams("q=&limit=3"));
    const firstBody = first.body as { results: { title: string }[]; nextCursor: string };
    const second = dispatchAgentApi(
      "/api/search",
      "GET",
      new URLSearchParams({ q: "", limit: "3", cursor: firstBody.nextCursor }),
    );
    const secondBody = second.body as { results: { title: string }[] };
    expect(secondBody.results[0]?.title).toBe(searchIndex[3]?.title);

    const bad = dispatchAgentApi("/api/v1/projects", "GET", new URLSearchParams("cursor=nope"));
    expect(bad.status).toBe(400);
    expect((bad.body as { error: { code: string } }).error.code).toBe("invalid_cursor");
  });

  it("publishes an RFC 9727 catalog that points only at deployed APIs", () => {
    const catalog = JSON.parse(agentFiles()[".well-known/api-catalog"] ?? "{}");
    const items = catalog.linkset[0].item.map((link: { href: string }) => link.href);
    expect(items).toEqual([
      "https://www.ayushrai.site/api/v1/projects",
      "https://www.ayushrai.site/api/v1/search",
      "https://www.ayushrai.site/api/mcp",
    ]);
    expect(catalog.linkset[1]["service-desc"][0].href).toBe(
      "https://www.ayushrai.site/openapi.json",
    );
  });

  it("serves the MCP tools over stateless Streamable HTTP", async () => {
    const call = (body: unknown) =>
      handleMcpRequest(
        new Request("https://www.ayushrai.site/api/mcp", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json, text/event-stream",
          },
          body: JSON.stringify(body),
        }),
      );

    const init = await call({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "test", version: "0" },
      },
    });
    expect(init.status).toBe(200);
    expect((await init.json()).result.serverInfo.name).toBe("site.ayushrai/portfolio");

    const listed = await call({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    const names = (await listed.json()).result.tools.map((tool: { name: string }) => tool.name);
    expect(names.sort()).toEqual(
      ["compare_projects", "get_project", "list_projects", "search_portfolio"].sort(),
    );

    const got = await call({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "get_project", arguments: { slug: "overlay-text-box" } },
    });
    const text = (await got.json()).result.content[0].text;
    expect(JSON.parse(text).project.slug).toBe("overlay-text-box");

    const get = await handleMcpRequest(new Request("https://www.ayushrai.site/api/mcp"));
    expect(get.status).toBe(405);

    /** Calls one tool and returns its parsed JSON-RPC result. */
    const tool = async (id: number, name: string, args: Record<string, unknown>) =>
      (await (await call({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } })).json()).result;

    const page1 = await tool(4, "search_portfolio", { query: "", limit: 3 });
    const page1Body = JSON.parse(page1.content[0].text);
    expect(page1Body.results).toHaveLength(3);
    const page2 = await tool(5, "search_portfolio", { query: "", limit: 3, cursor: page1Body.nextCursor });
    const page2Body = JSON.parse(page2.content[0].text);
    expect(page2Body.results[0].title).toBe(searchIndex[3]?.title);
    expect(page2Body).toEqual(
      dispatchAgentApi("/api/v1/search", "GET", new URLSearchParams({ q: "", limit: "3", cursor: page1Body.nextCursor }))
        .body,
    );
    expect((await tool(6, "search_portfolio", { query: "", cursor: "nope" })).isError).toBe(true);
    const overLimit = await (
      await call({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "search_portfolio", arguments: { query: "", limit: 21 } } })
    ).json();
    expect(overLimit.error.code).toBe(-32602);
    expect(overLimit.error.data.code).toBe("invalid_arguments");

    const slugs = ["overlay-text-box", "super-site-archive"];
    const withoutArchive = JSON.parse((await tool(8, "compare_projects", { slugs })).content[0].text);
    expect(withoutArchive.missing).toEqual(["super-site-archive"]);
    const withArchive = JSON.parse(
      (await tool(9, "compare_projects", { slugs, includeArchive: true })).content[0].text,
    );
    expect(withArchive.missing).toEqual([]);
    expect(withArchive.projects.map((item: { slug: string }) => item.slug)).toEqual(slugs);
  });

  it("returns the same project pages over MCP and REST, and tool errors for bad arguments", async () => {
    /** Calls one MCP tool and returns its JSON-RPC result. */
    const tool = async (name: string, args: Record<string, unknown>) => {
      const response = await handleMcpRequest(
        new Request("https://www.ayushrai.site/api/mcp", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
        }),
      );
      return (await response.json()).result as { isError?: boolean; content: Array<{ text: string }> };
    };

    const listed = JSON.parse((await tool("list_projects", { category: "tooling", limit: 2 })).content[0].text);
    const rest = dispatchAgentApi("/api/v1/projects", "GET", new URLSearchParams("category=tooling&limit=2"))
      .body as { projects: unknown[]; nextCursor: string | null };
    expect(listed.projects).toEqual(rest.projects);
    expect(listed.nextCursor).toBe(rest.nextCursor);
    expect(listed.count).toBe(rest.projects.length);

    const errors: Array<[string, Record<string, unknown>, RegExp]> = [
      ["list_projects", { category: "toString" }, /Unknown category/],
      ["list_projects", { type: "constructor" }, /Unknown project type/],
      ["list_projects", { cursor: "nope" }, /cursor must be a nextCursor/],
      ["get_project", { slug: "../etc/passwd" }, /slug/i],
      ["get_project", { slug: "no-such-project" }, /No public project with slug "no-such-project"/],
      ["get_project", { slug: "super-site-archive" }, /No public project/],
      ["compare_projects", { slugs: ["overlay-text-box", "overlay-text-box"] }, /Duplicate slugs/],
    ];
    for (const [name, args, message] of errors) {
      const result = await tool(name, args);
      expect(result.isError, `${name} ${JSON.stringify(args)}`).toBe(true);
      expect(result.content[0].text).toMatch(message);
    }
    const archived = await tool("get_project", { slug: "super-site-archive", includeArchive: true });
    expect(JSON.parse(archived.content[0].text).project.slug).toBe("super-site-archive");
  });

  it("answers unknown tools and schema-invalid arguments with JSON-RPC -32602 errors", async () => {
    /** Sends one tools/call and returns the parsed JSON-RPC envelope. */
    const rpc = async (name: string, args: unknown) =>
      (
        await handleMcpRequest(
          new Request("https://www.ayushrai.site/api/mcp", {
            method: "POST",
            headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 9, method: "tools/call", params: { name, arguments: args } }),
          }),
        )
      ).json();

    const unknown = await rpc("no_such_tool", {});
    expect(unknown.result).toBeUndefined();
    expect(unknown.error.code).toBe(-32602);
    expect(unknown.error.message).toContain("no_such_tool");
    expect(unknown.error.data.code).toBe("unknown_tool");
    expect(unknown.error.data.tools).toContain("search_portfolio");

    const wrongType = await rpc("get_project", { slug: 5 });
    expect(wrongType.error.code).toBe(-32602);
    expect(wrongType.error.data.code).toBe("invalid_arguments");
    expect(wrongType.error.data.issues[0].path).toBe("slug");

    const missing = await rpc("compare_projects", {});
    expect(missing.error.data.code).toBe("invalid_arguments");
  });

  it("validates REST limit, type, and compare inputs the same way on every path", () => {
    const cases: Array<[string, string, number]> = [
      ["/api/v1/projects", "limit=abc", 400],
      ["/api/v1/projects", "limit=1.5", 400],
      ["/api/v1/projects", "limit=0", 400],
      ["/api/v1/projects", "limit=21", 400],
      ["/api/v1/projects", "limit=20", 200],
      ["/api/v1/projects", "limit=", 200],
      ["/api/v1/projects", "type=open-source", 200],
      ["/api/v1/projects", "type=Open-Source", 400],
      ["/api/v1/projects", "category=hasOwnProperty", 400],
      ["/api/projects", "limit=99", 400],
      ["/api/projects", "type=nope", 400],
      ["/api/v1/compare", "slugs=a,b,c,d,e", 400],
      ["/api/v1/compare", "slugs=overlay-text-box,expert-o", 200],
      ["/api/v1/search", "q=x&limit=0", 400],
    ];
    for (const [path, search, status] of cases) {
      expect(dispatchAgentApi(path, "GET", new URLSearchParams(search)).status, `${path}?${search}`).toBe(status);
    }
  });

  it("filters search by exactly the record types the index can contain, in a stable order", () => {
    expect(SEARCH_TYPES).toBe(SEARCH_ITEM_TYPES);
    expect([...SEARCH_TYPES]).toEqual([
      "person", "work", "product", "project", "research", "experience", "education", "leadership",
      "recognition", "idea", "principle", "note", "writing", "elsewhere", "capability", "domain",
    ]);
    expect(new Set(SEARCH_TYPES).size).toBe(SEARCH_TYPES.length);
    for (const item of searchIndex) expect(SEARCH_TYPES, item.id).toContain(item.type);
    const spec = buildOpenApiDocument();
    const searchParams = (spec.paths["/api/v1/search"] as { get: { parameters: Array<{ name: string; schema: { enum?: string[] } }> } })
      .get.parameters;
    expect(searchParams.find((parameter) => parameter.name === "type")?.schema.enum).toEqual([...SEARCH_TYPES]);
    for (const type of SEARCH_TYPES) {
      expect(dispatchAgentApi("/api/v1/search", "GET", new URLSearchParams({ q: "", type })).status, type).toBe(200);
    }
    for (const type of ["Work", "projects", "", " work", "toString"]) {
      const response = dispatchAgentApi("/api/v1/search", "GET", new URLSearchParams({ q: "", type }));
      expect(response.status, JSON.stringify(type)).toBe(type === "" ? 200 : 400);
    }
  });

  it("pages the WebMCP search tool with the same limit and cursor rules as the API", () => {
    expect(Object.keys(PORTFOLIO_SEARCH_TOOL.inputSchema.properties)).toEqual(["query", "type", "limit", "cursor"]);
    const first = executePortfolioSearch({ query: "", limit: 2 });
    const next = first.structuredContent?.nextCursor;
    expect(first.structuredContent?.results).toHaveLength(2);
    expect(executePortfolioSearch({ query: "", limit: 2, cursor: next }).structuredContent?.results[0]?.title).toBe(
      searchIndex[2]?.title,
    );
    for (const limit of [0, 21, 2.5, "3"]) {
      expect(executePortfolioSearch({ query: "", limit }).isError, String(limit)).toBe(true);
    }
    expect(executePortfolioSearch({ query: "", cursor: "bad" }).isError).toBe(true);
  });

  it("publishes about, contact, and privacy pages with substantive Markdown", () => {
    for (const path of ["/about", "/contact", "/privacy"]) {
      const markdown = renderPageMarkdown(path) ?? "";
      expect(markdown.length).toBeGreaterThan(500);
      expect(isKnownRoute(path)).toBe(true);
    }
    expect(renderPageMarkdown("/privacy")).toContain("Google Analytics");
    expect(renderPageMarkdown("/contact")).toContain(`Phone: ${person.phoneDisplay}`);
  });

  it("prints each record's public caveats in its Markdown twin, as on the HTML page", () => {
    for (const item of [...work, ...researchItems]) {
      const markdown = renderPageMarkdown(`/${"problem" in item ? "work" : "research"}/${item.slug}`) ?? "";
      if (!item.needsConfirmation?.length) {
        expect(markdown).not.toContain("## Needs confirmation");
        continue;
      }
      expect(markdown).toContain("## Needs confirmation\n\nUnverified. Do not cite these as facts.");
      for (const caveat of item.needsConfirmation) expect(markdown).toContain(`- ${caveat}`);
    }
  });

  it("formats work years like the HTML pages", () => {
    for (const item of work) {
      const markdown = renderPageMarkdown(`/work/${item.slug}`) ?? "";
      const status = markdown.split("\n").find((line) => line.startsWith("Status:")) ?? "";
      expect(status).not.toMatch(/–\.$/);
      expect(status).not.toMatch(/(\d{4})–\1/);
    }
  });

  it("prints no dangling date separators for records with blank dates", () => {
    expect(education.some((ed) => !ed.start && !ed.end)).toBe(true);
    for (const path of ["/education", "/about", "/resume"]) {
      const markdown = renderPageMarkdown(path) ?? "";
      const broken = markdown
        .split("\n")
        .filter((line) => /(^|[\s,·])–(\s*([,·]|$))/.test(line.trim()) || /,\s*,/.test(line));
      expect(broken).toEqual([]);
    }
    expect(renderPageMarkdown("/education")).toContain("IIT Madras · Online");
  });
});
