/**
 * Browser tests for the human site (Playwright, `npx playwright test`).
 *
 * They run against the Vite dev server started by `playwright.config.ts` and cover the
 * routes and behaviours a visitor relies on: the homepage, primary navigation, the
 * contact form's client-side validation, the privacy page, the in-app 404, keyboard
 * access through the skip link, keyboard use of search and the "More" menu, scroll reset
 * after navigation, the mobile menu, and external-link safety.
 * Agent-facing behaviour (Markdown, API, agent view) lives in `agent-readiness.spec.ts`.
 */
import { expect, test } from "@playwright/test";

test.describe("human site", () => {
  test("homepage shows the name, the role title, and primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Ayush Rai" })).toBeVisible();
    await expect(page).toHaveTitle("Ayush Rai · AI Engineer & AI Product Builder");
    const description = await page
      .locator('meta[name="description"][data-rh="true"]')
      .getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(50);

    const primary = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Work", "Products", "Research", "Writing", "About"]) {
      await expect(primary.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("primary navigation opens the work index", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("contact form requires an email and a message before sending", async ({ page }) => {
    await page.goto("/contact");
    const email = page.getByLabel(/email/i);
    const message = page.getByLabel(/message/i);
    await expect(email).toBeVisible();
    await expect(message).toBeVisible();

    await page.getByRole("button", { name: "Send" }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
    expect(await email.evaluate((node: HTMLInputElement) => node.validity.valueMissing)).toBe(true);
    await expect(page.getByRole("link", { name: /privacy/i }).first()).toBeVisible();
  });

  test("privacy page explains what the site collects", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
    await expect(page.getByText(/Google Analytics/).first()).toBeVisible();
  });

  test("unknown paths render the in-app 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { level: 1, name: "This page does not exist yet." })).toBeVisible();
  });

  test("the first Tab focuses the skip link to main content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Ayush Rai" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  });

  test("mobile menu reveals the full navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobile = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobile.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("search works from the keyboard and returns focus when closed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Ayush Rai" })).toBeVisible();
    await page.keyboard.press("ControlOrMeta+k");
    const input = page.getByRole("combobox", { name: "Search" });
    await expect(input).toBeFocused();
    await input.fill("open framework");
    const first = page.getByRole("option").first();
    await expect(first).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option").nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowUp");
    const href = await first.getAttribute("href");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`${(href ?? "").split("#")[0].replace(/\//g, "\\/")}/?(#.*)?$`));

    const opener = page.getByRole("button", { name: "Open search" });
    await opener.click();
    await expect(input).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test("the More menu closes with Escape and an outside click", async ({ page }) => {
    await page.goto("/");
    const more = page.locator("header summary", { hasText: "More" });
    await more.click();
    const timeline = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Timeline" });
    await expect(timeline).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(timeline).toBeHidden();
    await expect(more).toBeFocused();

    await more.click();
    await expect(timeline).toBeVisible();
    await page.getByRole("heading", { level: 1, name: "Ayush Rai" }).click();
    await expect(timeline).toBeHidden();
  });

  test("a page link opens the next page at the top", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("contentinfo").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("external profile links open safely in a new tab", async ({ page }) => {
    await page.goto("/elsewhere");
    const external = page.locator('#main a[target="_blank"]');
    await expect(external.first()).toBeVisible();
    expect(await external.count()).toBeGreaterThan(0);
    for (const rel of await external.evaluateAll((links) => links.map((link) => link.getAttribute("rel") ?? ""))) {
      expect(rel).toContain("noopener");
    }
  });
});
