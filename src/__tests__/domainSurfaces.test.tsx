/**
 * Tests the evidence-backed domain dossiers (/ai-engineering, /software-engineering, and so on).
 *
 * Verifies that domain paths, titles, and descriptions are unique and listed in
 * the sitemap; that each dossier's Markdown twin contains its h1, description,
 * and canonical URL; that internal evidence and related links resolve to known
 * routes; that the intentional gaps (/ai-engineering/inference,
 * /software-engineering/distributed-systems) have no record; that every domain
 * is in the search index; and that a rendered dossier has exactly one h1, a
 * trailing-slash canonical link, and JSON-LD with a BreadcrumbList but no
 * aggregateRating.
 *
 * Connects to:
 * - src/content/domains.ts and src/content/searchIndex.ts (via src/content)
 * - src/lib/agent/markdown.ts, src/lib/agent/routes.ts, src/lib/canonical.ts,
 *   src/lib/publicRoutes.ts
 * - src/App.tsx (AppRoutes) and src/pages/DomainPage.tsx
 */
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AppRoutes } from "../App";
import {
  domains,
  getDomainByPath,
  searchIndex,
} from "../content";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { isKnownRoute, pathnameOf } from "../lib/agent/routes";
import { canonicalUrl } from "../lib/canonical";
import { sitemapRoutes } from "../lib/publicRoutes";

/** Domain records, their Markdown and search projections, and the rendered dossier page. */
describe("domain knowledge pages", () => {
  it("keeps unique paths, titles, and descriptions inside the sitemap", () => {
    const paths = domains.map((page) => page.path);
    const titles = domains.map((page) => page.title);
    const descriptions = domains.map((page) => page.description);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const path of paths) {
      expect(sitemapRoutes()).toContain(path);
      expect(isKnownRoute(path)).toBe(true);
    }
    expect(sitemapRoutes()).not.toContain("/design-system");
    expect(new Set(sitemapRoutes()).size).toBe(sitemapRoutes().length);
  });

  it("generates markdown from the same records, with a canonical source URL", () => {
    for (const page of domains) {
      const markdown = renderPageMarkdown(page.path);
      expect(markdown).toContain(page.h1);
      expect(markdown).toContain(canonicalUrl(page.path));
      expect(markdown).toContain(page.description);
      for (const link of [...page.evidence, ...page.related]) {
        if (/^https?:\/\//i.test(link.href)) continue;
        expect(isKnownRoute(pathnameOf(link.href))).toBe(true);
      }
    }
    expect(getDomainByPath("/ai-engineering/inference")).toBeUndefined();
    expect(getDomainByPath("/software-engineering/distributed-systems")).toBeUndefined();
  });

  it("indexes domain pages for site search", () => {
    const indexed = searchIndex.filter((item) => item.type === "domain");
    expect(indexed.map((item) => item.href).sort()).toEqual(
      domains.map((page) => page.path).sort(),
    );
  });

  it("renders one h1 and parseable structured data", async () => {
    // AppRoutes loads DomainPage with React.lazy; importing it first keeps the Suspense wait short.
    await import("../pages/DomainPage");
    render(
      <HelmetProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={["/ai-engineering/llm-evaluation"]}>
            <AppRoutes />
          </MemoryRouter>
        </ThemeProvider>
      </HelmetProvider>,
    );
    const heading = await screen.findByRole(
      "heading",
      {
        level: 1,
        name: "LLM evaluation",
      },
      { timeout: 5000 },
    );
    expect(heading).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    await waitFor(() => {
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://www.ayushrai.site/ai-engineering/llm-evaluation/",
      );
    });
    const raw = document.querySelector('script[type="application/ld+json"]')?.textContent;
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw ?? "");
    expect(JSON.stringify(data)).toContain("BreadcrumbList");
    expect(JSON.stringify(data)).not.toContain("aggregateRating");
  });
});
