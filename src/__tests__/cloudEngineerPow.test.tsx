/**
 * Tests /pow/cloud-engineer, its lab interactions, and its Markdown twin.
 *
 * Confirms the route renders one h1, a failed health check stays blocked, the cost total follows
 * the inputs, and the page is prerendered, indexed, and linked from the proof-of-work nav.
 *
 * Connects to:
 * - src/pages/CloudEngineerPowPage.tsx, src/components/pow/cloud/CloudLab.tsx
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts, src/content/powPages.ts
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { powPages } from "../content/powPages";
import { searchIndex } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders the cloud engineering route and waits for the lazy page. */
async function renderCloud() {
  await import("../pages/CloudEngineerPowPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/pow/cloud-engineer"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole(
    "heading",
    { level: 1, name: "I build, deploy, and operate the infrastructure behind software." },
    { timeout: 5000 },
  );
}

/** The page, the simulations, and the twin. */
describe("cloud engineering proof of work", () => {
  it("renders the lab, blocks a failed health check, and prices from assumptions", async () => {
    const user = userEvent.setup({ delay: null });
    expect(await renderCloud()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText(/Fieldnote/).length).toBeGreaterThan(0);
    expect(screen.getByText(/does not create cloud resources/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Cloud" }).length).toBeGreaterThan(0);
    const nav = screen.getByRole("navigation", { name: "Proof of work" });
    for (const page of powPages) {
      expect(nav.querySelector(`a[href="${page.to}"]`)).not.toBeNull();
    }

    expect(screen.getByRole("status").textContent).toMatch(/Release blocked/);
    await user.selectOptions(screen.getByLabelText("Scenario"), "success");
    expect(screen.getByRole("status").textContent).toMatch(/Simulated release verified/);
    await user.selectOptions(screen.getByLabelText("Scenario"), "health-check");
    expect(screen.getByRole("status").textContent).toMatch(/Release blocked/);
    expect(screen.queryByText("Simulated release verified")).toBeNull();

    await user.click(screen.getByRole("tab", { name: "Containerized application" }));
    expect(screen.getAllByText(/Repeatable builds/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: "Container registry" }));
    expect(screen.getAllByText(/Only the runtime identity can pull/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: /^Database$/ }));
    expect(screen.getAllByText(/I have not applied this module/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("option", { name: "USER app" }));
    expect(screen.getAllByText(/The process does not run as root/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: "TLS failure" }));
    expect(screen.getAllByText(/openssl s_client/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: "Smoke tests" }));
    expect(screen.getAllByText(/before it is the version users get/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: /^Failed deployment$/ }));
    expect(screen.getAllByText(/Synthetic telemetry/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: "Database exposed publicly" }));
    expect(screen.getAllByText(/Remove the public address/).length).toBeGreaterThan(0);

    const requests = screen.getByLabelText("Requests per month");
    fireEvent.change(requests, { target: { value: "10000000" } });
    expect(screen.getAllByText(/10,000,000 requests/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "higher" }));
    expect(screen.getAllByText(/Not a bill/).length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("Application instances"), { target: { value: "5" } });
    expect(screen.getAllByText(/do not remove a database bottleneck/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: "Managed hosting versus virtual machines" }));
    expect(screen.getAllByText(/Revisit when you need a long-lived process/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("tab", { name: "Container repeatedly restarts" }));
    expect(screen.getAllByText(/This page does not run them/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("RevenueRoles").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Verified in the repository").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Planned").length).toBeGreaterThanOrEqual(6);
  }, 40000);

  it("publishes a Markdown twin and a prerendered route", () => {
    const markdown = renderPageMarkdown("/pow/cloud-engineer") ?? "";
    expect(markdown).toContain("Fieldnote");
    expect(markdown).toContain("Terraform");
    expect(markdown).toContain("(verified)");
    expect(markdown).toContain("(proposed)");
    expect(markdown).not.toContain("99.9%");
    expect(prerenderRoutes()).toContain("/pow/cloud-engineer");
    expect(sitemapRoutes()).toContain("/pow/cloud-engineer");
    expect(searchIndex.some((item) => item.href === "/pow/cloud-engineer")).toBe(true);
  }, 20000);
});
