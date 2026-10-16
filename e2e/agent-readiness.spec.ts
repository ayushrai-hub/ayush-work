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
  const mdBody = await markdown.text();
  expect(mdBody.startsWith("---\n")).toBe(true);
  expect(mdBody).toContain("title:");
  expect(mdBody).toContain("last-updated:");
  const search = await request.get("/api/search?q=overlay");
  expect(search.status()).toBe(200);
  const body = await search.json();
  expect(body.match).toBe("lexical");
  expect(Array.isArray(body.results)).toBe(true);
});

test("discovery surfaces: ARD, auth, agent mode, ask, webmcp", async ({ request }) => {
  const ard = await request.get("/.well-known/ard.json");
  expect(ard.status()).toBe(200);
  const ardBody = await ard.json();
  expect(ardBody.entries[0].displayName).toBeTruthy();
  expect(ardBody.entries[0].identifier).toBe("urn:air:ayushrai.site:mcp:portfolio");

  const catalog = await request.get("/.well-known/ai-catalog.json");
  expect(catalog.status()).toBe(200);
  expect((await catalog.json()).entries[0].displayName).toBeTruthy();

  const auth = await request.get("/auth.md");
  expect(auth.status()).toBe(200);
  expect(auth.headers()["content-type"] ?? "").toContain("text/markdown");
  expect(await auth.text()).toContain("no authentication");

  const agentMode = await request.get("/?mode=agent");
  expect(agentMode.status()).toBe(200);
  expect(agentMode.headers()["content-type"] ?? "").toContain("application/json");
  const agentDoc = await agentMode.json();
  expect(agentDoc.api.authentication).toBe("none");
  expect(agentDoc.mcp.url).toContain("/api/mcp");

  const ask = await request.post("/ask", {
    data: { query: { text: "overlay" }, meta: { version: "0.55" } },
  });
  expect(ask.status()).toBe(200);
  const askBody = await ask.json();
  expect(askBody._meta.response_type).toBe("answer");
  expect(askBody._meta.version).toBe("0.55");

  const webmcp = await request.get("/webmcp.js");
  expect(webmcp.status()).toBe(200);
  const script = await webmcp.text();
  expect(script).toContain("modelContext");
  expect(script).toContain("registerTool");
  expect(script).toContain("search_projects");
});
