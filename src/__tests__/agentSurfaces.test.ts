/**
 * Tests the agent surfaces built from src/content: search, project API, Markdown twins, negotiation, catalogs, and MCP tools.
 *
 * Verifies that every search-index href resolves to a real route, record, or
 * anchor; that lexical ranking puts title hits before summary hits and matches
 * /api/search; that project list, detail, compare, archive, and traversal cases
 * return the right statuses; that Markdown and llms files omit the phone number
 * and every needsConfirmation claim; that role view only reorders work; that
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
  researchAwardsNeedsConfirmation,
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
import { executePortfolioSearch } from "../lib/agent/searchTool";
import { buildOpenApiDocument } from "../lib/agent/openapi";
import { comparePublicProjects, getPublicProject } from "../lib/agent/projectsQuery";
import { isExternalHref, isKnownRoute, pathnameOf } from "../lib/agent/routes";
import { searchPortfolio } from "../lib/agent/search";
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

  // The literal phone number below is a guard value: it must never appear in generated output.
  it("writes markdown twins and llms.txt without phone numbers or withheld awards", () => {
    const workPage = renderPageMarkdown("/work/the-open-framework");
    expect(workPage).toContain("The Open Framework");
    expect(workPage).toContain("https://www.ayushrai.site/work/the-open-framework");
    const full = `${renderLlmsTxt()}\n${renderLlmsFull()}`;
    expect(full).not.toContain("7440567944");
    expect(person.phone).toBe("");
    expect(person.phoneDisplay).toBe("");
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

  // Also checks the WebMCP search tool's type validation and phone-number omission.
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
    expect(JSON.stringify(found)).not.toContain("7440567944");
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
  });

  it("publishes about, contact, and privacy pages with substantive Markdown", () => {
    for (const path of ["/about", "/contact", "/privacy"]) {
      const markdown = renderPageMarkdown(path) ?? "";
      expect(markdown.length).toBeGreaterThan(500);
      expect(isKnownRoute(path)).toBe(true);
    }
    expect(renderPageMarkdown("/privacy")).toContain("Google Analytics");
    expect(renderPageMarkdown("/privacy")).not.toContain("7440567944");
  });
});
