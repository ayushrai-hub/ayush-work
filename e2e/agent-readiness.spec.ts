/**
 * Browser tests for agent-facing behaviour (Playwright, `npx playwright test`).
 *
 * They run against the Vite dev server started by `playwright.config.ts`, where the
 * agent middleware in src/lib/agent/vitePlugin.ts serves `.md` twins and `/api/*`.
 * Covered: the homepage Role view ("Hiring" sets `?audience=recruiter` and keeps the
 * selected-work section), the in-page Agent view (`?agent=1`) with its Human view link
 * and Markdown URL, and the content types of a Markdown twin and `/api/search`.
 * Human-site behaviour lives in `site.spec.ts`.
 *
 * Connects to:
 * - src/pages/HomePage.tsx, src/components/site/RoleSelector.tsx, src/lib/agent/audiences.ts
 * - src/components/site/AgentView.tsx
 * - src/lib/agent/vitePlugin.ts (dev-server routing for Markdown and API)
 */
import { expect, test } from "@playwright/test";

test("homepage role view reorders sections without a second biography", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ayush Rai" })).toBeVisible();
  await page.getByRole("button", { name: "Hiring" }).click();
  await expect(page).toHaveURL(/audience=recruiter/);
  await expect(page.getByRole("heading", { name: /Selected work/ })).toBeVisible();
});

test("agent view links back to the human page and a markdown URL", async ({ page }) => {
  await page.goto("/work/the-open-framework?agent=1");
  await expect(page.getByRole("heading", { name: "Agent view" })).toBeVisible();
  await expect(page.locator("#main").getByRole("link", { name: "Human view" })).toBeVisible();
  await expect(page.getByRole("link", { name: "/work/the-open-framework.md" })).toBeVisible();
});

test("markdown and search endpoints return the expected types", async ({ request }) => {
  const markdown = await request.get("/work/the-open-framework.md");
  expect(markdown.status()).toBe(200);
  expect(markdown.headers()["content-type"] ?? "").toContain("text/markdown");
  const search = await request.get("/api/search?q=overlay");
  expect(search.status()).toBe(200);
  const body = await search.json();
  expect(body.match).toBe("lexical");
  expect(Array.isArray(body.results)).toBe(true);
});
