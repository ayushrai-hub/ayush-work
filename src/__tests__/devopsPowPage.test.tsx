/**
 * Tests /pow/devops-engineer, its workbench, and its Markdown twin.
 *
 * Renders the real route and walks the control room, pipeline, strategies, container lab,
 * and release gates. Repository claims in the twin have to match the content record.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx, src/App.tsx
 * - src/content/devopsPow.ts
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { searchIndex } from "../content";
import { deliveryFindings } from "../content/devopsPow";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { canonicalUrl } from "../lib/canonical";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the devops route and waits for the lazy page. */
async function renderDevops() {
  await import("../pages/DevopsPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/devops-engineer"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "I automate the path from code to reliable production." },
    { timeout: 15000 },
  );
}

/** The page, the simulations, and the twin. */
describe("devops engineer proof of work", { timeout: 20000 }, () => {
  it("states the headline, links the series, and keeps the route discoverable", async () => {
    expect(await renderDevops()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Explore the Delivery Pipeline" })).toHaveAttribute(
      "href",
      "/pow/devops-engineer#control-room",
    );
    expect(screen.getByRole("link", { name: "Inspect My Engineering Work" })).toHaveAttribute(
      "href",
      "/pow/devops-engineer#evidence",
    );
    const nav = screen.getByRole("navigation", { name: "Proof of work" });
    expect(within(nav).getByRole("link", { name: "DevOps" })).toHaveAttribute("href", "/pow/devops-engineer");
    expect(within(nav).getByRole("link", { name: "FDE" })).toHaveAttribute("href", "/pow/fde");
    expect(prerenderRoutes()).toContain("/pow/devops-engineer");
    expect(sitemapRoutes()).toContain("/pow/devops-engineer");
    expect(searchIndex.some((item) => item.href === "/pow/devops-engineer")).toBe(true);
  });

  it("blocks a simulated release when lint fails and rolls back a smoke failure", async () => {
    const user = userEvent.setup();
    expect(await renderDevops()).toBeInTheDocument();
    const room = document.getElementById("control-room");
    if (!room) throw new Error("missing control room");
    await user.click(within(room).getByRole("button", { name: "Step" }));
    expect(within(room).getByText("Running")).toBeInTheDocument();
    await user.click(within(room).getByRole("button", { name: "Lint regression" }));
    await user.click(within(room).getByRole("button", { name: "Run to end" }));
    expect(within(room).getByText(/Linting failed/)).toBeInTheDocument();
    expect(within(room).getAllByText(/illustrative/i).length).toBeGreaterThan(0);

    await user.click(within(room).getByRole("button", { name: "Smoke test failure" }));
    await user.click(within(room).getByRole("button", { name: "Run to end" }));
    expect(within(room).getByText("Rolled back")).toBeInTheDocument();
  });

  it("previews pipeline policy, strategies, containers, and a failed release gate", async () => {
    const user = userEvent.setup();
    expect(await renderDevops()).toBeInTheDocument();

    const pipeline = document.getElementById("pipeline");
    if (!pipeline) throw new Error("missing pipeline");
    await user.click(within(pipeline).getByRole("button", { name: "Report only" }));
    const injections = within(pipeline).getAllByRole("button", { name: "Inject failure" });
    await user.click(injections[4]);
    expect(within(pipeline).getByText(/non-blocking policy/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Canary deployment" }));
    expect(screen.getByText(/small share of traffic/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "The health check fails" }));
    expect(screen.getByText(/Do not widen traffic/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mark lockfile absent" }));
    expect(screen.getByText(/would not be promoted/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "SpiderWeb" }));
    expect(screen.getByText(/does not run docker build/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Simulate a failed release" }));
    expect(screen.getByText("Eligible")).toBeInTheDocument();
    expect(screen.getByText(/does not reverse a migration/)).toBeInTheDocument();
  });

  it("writes the markdown twin from the same findings and does not invent uptime", () => {
    const markdown = renderPageMarkdown("/pow/devops-engineer") ?? "";
    expect(markdown).toContain("I automate the path from code to reliable production.");
    expect(markdown).toContain(canonicalUrl("/pow/devops-engineer"));
    expect(markdown).toContain("RevenueRoles");
    expect(markdown).toContain("proposed and is not installed");
    expect(markdown).not.toMatch(/99\.9%|saved \$|incidents per/i);
    for (const finding of deliveryFindings) {
      expect(markdown).toContain(finding.name);
      expect(markdown).toContain(finding.href);
    }
  });
});
