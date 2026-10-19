/**
 * Tests the /pow index, the header hover list, and the Markdown twin.
 *
 * The page lists every role in `powMenu`. The twin, prerender list, sitemap, and search index
 * include `/pow`.
 *
 * Connects to:
 * - src/pages/PowIndexPage.tsx, src/App.tsx
 * - src/content/powPages.ts, src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { powMenu, searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders /pow inside the site shell and waits for the lazy page. */
async function renderPowIndex() {
  await import("../pages/PowIndexPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: "POW" }, { timeout: 5000 });
}

/** The index, its links, and the agent surfaces. */
describe("POW index", () => {
  it("lists every targeted role and publishes the twin", async () => {
    expect(await renderPowIndex()).toBeInTheDocument();
    for (const item of powMenu) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.to);
      expect(screen.getByText(item.note)).toBeInTheDocument();
    }

    const markdown = renderPageMarkdown("/pow") ?? "";
    expect(markdown).toContain("https://www.ayushrai.site/pow/");
    for (const item of powMenu) {
      expect(markdown).toContain(`(${item.to})`);
      expect(markdown).toContain(item.note);
    }
    expect(prerenderRoutes()).toContain("/pow");
    expect(sitemapRoutes()).toContain("/pow");
    expect(searchIndex.some((entry) => entry.href === "/pow")).toBe(true);
  });
});
