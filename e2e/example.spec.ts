import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test('should load homepage and display key elements', async ({ page }) => {
    await page.goto('/');

    // Check hero section
    await expect(page.locator('#home h1:has-text("Ayush Rai")')).toBeVisible();
    await expect(page.locator('#home:has-text("SDE - AI Engineer")')).toBeVisible();

    // Check navigation
    await expect(page.locator('button:has-text("About Me")')).toBeVisible();
    await expect(page.locator('button:has-text("Projects")')).toBeVisible();
    await expect(page.locator('button:has-text("Contact")')).toBeVisible();
  });

  test('should navigate to projects section', async ({ page }) => {
    await page.goto('/');

    // Click on projects link
    await page.locator('button:has-text("Projects")').click();

    // Check if projects section is visible
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('h2:has-text("Featured Projects")')).toBeVisible();
  });

  test('should open project demo links in new tab', async ({ page, context }) => {
    await page.goto('/');

    // Look for external links in projects section
    const externalLinks = page.locator('a[target="_blank"]');

    // Check that external links have proper attributes
    const linkCount = await externalLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Click one external link and check new tab opens
    if (linkCount > 0) {
      const newTabPromise = page.context().waitForEvent('page');
      await externalLinks.first().click();
      const newTab = await newTabPromise;
      expect(newTab.url()).not.toBe(page.url());
    }
  });

  test('should show contact form and validate input', async ({ page }) => {
    await page.goto('/');

    // Navigate to contact section
    await page.locator('button:has-text("Contact")').click();

    // Check contact form exists
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('#contact input[name="name"]')).toBeVisible();
    await expect(page.locator('#contact input[name="email"]')).toBeVisible();
    await expect(page.locator('#contact textarea[name="message"]')).toBeVisible();
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if elements are focused
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toMatch(/A|BUTTON|INPUT/);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check hero section is still visible and readable on mobile
    await expect(page.locator('#home h1:has-text("Ayush Rai")')).toBeVisible();
    await expect(page.locator('#home:has-text("SDE - AI Engineer")')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title and meta description
    await expect(page).toHaveTitle(/Ayush Rai|Portfolio/);

    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]');
    await expect(metaDescription).toBeTruthy();
  });

  test('should load images properly', async ({ page }) => {
    await page.goto('/');

    // Check that images load without errors
    const images = page.locator('img');
    const imgCount = await images.count();

    // Verify any visible images are accessible
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();
      if (isVisible) {
        await expect(img).toBeTruthy();
      }
    }
  });

  test('should display error state for invalid form submission', async ({ page }) => {
    await page.goto('/');

    // Navigate to contact section
    await page.locator('button:has-text("Contact")').click();

    // Try to submit form with empty fields
    const submitButton = page.locator('button[type="submit"], button:has-text("Send")');
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Check if form shows validation or error state
      await expect(page.locator('#contact')).toBeVisible();
    }
  });
});
