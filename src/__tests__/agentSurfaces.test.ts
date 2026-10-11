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
import { dispatchAgentApi } from "../lib/agent/http";
import { escapeMarkdownText, renderLlmsFull, renderLlmsTxt, renderPageMarkdown } from "../lib/agent/markdown";
import { executePortfolioSearch } from "../lib/agent/searchTool";
import { buildOpenApiDocument } from "../lib/agent/openapi";
import { comparePublicProjects, getPublicProject } from "../lib/agent/projectsQuery";
import { isExternalHref, isKnownRoute, pathnameOf } from "../lib/agent/routes";
import { searchPortfolio } from "../lib/agent/search";
import { work } from "../content";

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
  if (path === "/about") {
    if (hash.startsWith("capability-")) {
      return capabilities.some(
        (item) => `capability-${item.domain.toLowerCase()}` === hash,
      );
    }
    return experience.some((item) => item.slug === hash);
  }
  return false;
}

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
    expect(renderLlmsTxt()).toContain("/api/search");
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
});
