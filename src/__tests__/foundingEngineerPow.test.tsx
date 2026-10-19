/**
 * Tests the /pow/founding-engineer page, its workbench, and its Markdown twin.
 *
 * Renders the real route, walks the BUILDLOG steps, and checks that synthetic copy stays labeled
 * while case-study links point at the recorded artifacts.
 *
 * Connects to:
 * - src/pages/FoundingEngineerPowPage.tsx, src/App.tsx
 * - src/content/foundingEngineer.ts, src/content/powPages.ts
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { powPages } from "../content/powPages";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { canonicalUrl } from "../lib/canonical";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the founding-engineer route and waits for the lazy page. */
async function renderFounding() {
  await import("../pages/FoundingEngineerPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/founding-engineer"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "I don't just build features. I build the system that makes the product work." },
    { timeout: 15000 },
  );
}

/** The page, the workbench, and the twin. */
describe("founding engineer proof of work", () => {
  it("links the seven proof-of-work routes and the recorded project artifacts", async () => {
    expect(await renderFounding()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const nav = screen.getByRole("navigation", { name: "Proof of work" });
    for (const page of powPages) {
      expect(nav.querySelector(`a[href="${page.to}"]`)).not.toBeNull();
    }
    expect(screen.getByRole("link", { name: "revenueroles.in" })).toHaveAttribute("href", "https://revenueroles.in/");
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "https://revopy.vercel.app/");
    expect(screen.getByText(/Northline is not a customer/)).toBeInTheDocument();
    expect(screen.getByText(/I am not citing an Adaptive RAG system/)).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).toBeNull();
  }, 20000);

  it("reclassifies scope, switches architecture, and marks the release list", async () => {
    const user = userEvent.setup();
    expect(await renderFounding()).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "MVP scope" }));
    expect(screen.getByText(/Illustrative load/)).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "CRM sync: required" }));
    expect(screen.getByText(/CRM sync depends on Sign-in/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Architecture" }));
    await user.click(screen.getByRole("radio", { name: "Several services" }));
    expect(screen.getByText(/Not the starting point/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Data and API" }));
    expect(screen.getByText(/POST \/imports/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Implementation" }));
    expect(screen.getByRole("heading", { name: "On the critical path" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Release" }));
    await user.click(screen.getByRole("checkbox", { name: /Authentication/ }));
    expect(screen.getByText(/1 of 12 marked/)).toBeInTheDocument();

    const releaseTab = screen.getByRole("tab", { name: "Release" });
    releaseTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "After launch" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("checkbox", { name: /darker chart palette/ }));
    expect(screen.getByText(/labeled ignore/)).toBeInTheDocument();
  }, 20000);

  it("inspects decisions, constraints, the timeline, tests, the stack, and the synthetic incident", async () => {
    const user = userEvent.setup();
    expect(await renderFounding()).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "AI inference versus deterministic logic" }));
    expect(screen.getAllByText(/from the code/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("option", { name: "Deployment" }));
    expect(screen.getByText(/Separate build from release/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ship the workflow" }));
    expect(screen.getByText(/Someone can use the ranking/)).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Save an ICP" }));
    expect(screen.getByText(/do not sum to 100/)).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Revenue Intelligence Engine" }));
    await user.click(screen.getByRole("option", { name: "The dashboard looks reset" }));
    expect(screen.getByText(/seeded fixture/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/Separate build from health/)).toBeInTheDocument();
  }, 20000);

  it("is prerendered, searchable, and present in the Markdown twin", () => {
    const markdown = renderPageMarkdown("/pow/founding-engineer") ?? "";
    expect(markdown).toContain(canonicalUrl("/pow/founding-engineer"));
    expect(markdown).toContain("BUILDLOG is the name of this on-page demonstration");
    expect(markdown).toContain("SpiderWeb");
    expect(prerenderRoutes()).toContain("/pow/founding-engineer");
    expect(sitemapRoutes()).toContain("/pow/founding-engineer");
    expect(searchIndex.some((item) => item.href === "/pow/founding-engineer")).toBe(true);
  });
});
