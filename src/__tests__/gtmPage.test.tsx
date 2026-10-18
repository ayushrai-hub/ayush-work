/**
 * Tests the /gtm GTM engineering page and its Markdown twin.
 *
 * Verifies that every proof slug resolves to a product or project record, that the page renders one
 * h1, each proof with its evidence label and links, and the Loom placeholder while no video URL is
 * set; that setting `walkthrough.loomUrl` swaps in an embed; that the Markdown twin carries the same
 * sections; and that /gtm is prerendered, in the sitemap, and in search.
 *
 * Connects to:
 * - src/pages/GtmPage.tsx, src/content/gtm.ts, src/App.tsx (AppRoutes)
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { gtmPortfolio, gtmProofs, gtmReadingProgress, loomEmbedUrl, searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the real routes at /gtm with the client providers and waits for the lazy page. */
async function renderGtm() {
  await import("../pages/GtmPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/gtm"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: "GTM engineering" }, { timeout: 5000 });
}

afterEach(() => {
  gtmPortfolio.walkthrough.loomUrl = undefined;
});

/** The /gtm record, page, and twin. */
describe("GTM portfolio", () => {
  it("resolves every proof against products or projects", () => {
    expect(gtmProofs().map((proof) => proof.slug)).toEqual(
      gtmPortfolio.proofs.map((proof) => proof.slug),
    );
    expect(gtmProofs()[0]).toMatchObject({
      slug: "revenueroles",
      kind: "product",
      demoUrl: "https://revenueroles.in",
      href: "/products/revenueroles",
    });
  });

  it("renders each proof with its evidence and links, and a Loom placeholder", async () => {
    expect(await renderGtm()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/Loom walkthrough coming soon/)).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();

    for (const proof of gtmProofs()) {
      const item = document.getElementById(`gtm-${proof.slug}`);
      expect(item).not.toBeNull();
      const scope = within(item as HTMLElement);
      expect(scope.getByRole("heading", { level: 3, name: proof.title })).toBeInTheDocument();
      if (proof.githubUrl) {
        expect(scope.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", proof.githubUrl);
      }
      if (proof.demoUrl) {
        expect(scope.getByRole("link", { name: "Live" })).toHaveAttribute("href", proof.demoUrl);
      }
    }
    for (const group of gtmPortfolio.resources.groups) {
      for (const resource of group.items) {
        expect(screen.getByRole("link", { name: resource.label })).toHaveAttribute("href", resource.href);
      }
    }
  });

  it("embeds the Loom video once a URL is set", async () => {
    gtmPortfolio.walkthrough.loomUrl = "https://www.loom.com/share/abc123";
    await renderGtm();
    expect(screen.getByTitle("GTM engineering walkthrough on Loom")).toHaveAttribute(
      "src",
      "https://www.loom.com/embed/abc123",
    );
    expect(screen.queryByText(/Loom walkthrough coming soon/)).toBeNull();
    expect(loomEmbedUrl("https://example.com/video")).toBe("https://example.com/video");
  });

  it("publishes a Markdown twin, a prerendered route, and a search entry", () => {
    const markdown = renderPageMarkdown("/gtm") ?? "";
    for (const heading of [
      "## Walkthrough video",
      "## Product and projects",
      "## GTM infrastructure layers: built and missing",
      "## What I already know",
      "## What I am studying now",
      "## Resources I am using",
      "## What I will build next",
    ]) {
      expect(markdown).toContain(heading);
    }
    expect(markdown).toContain("https://revenueroles.in");
    expect(markdown).toContain("Not recorded yet.");
    const { read, total } = gtmReadingProgress();
    expect(read).toBeGreaterThan(0);
    expect(markdown).toContain(`${read} of ${total} read.`);
    expect(markdown).toContain("(https://www.clay.com/blog/gtm-infrastructure) (read 2026-10-18)");
    expect(prerenderRoutes()).toContain("/gtm");
    expect(sitemapRoutes()).toContain("/gtm");
    expect(searchIndex.some((item) => item.href === "/gtm")).toBe(true);
  });
});
