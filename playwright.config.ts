/**
 * Playwright configuration for the browser tests in `e2e/`.
 *
 * `npx playwright test` starts the Vite dev server (`npm run dev`, port 5173) and runs
 * `e2e/site.spec.ts` (human pages) and `e2e/agent-readiness.spec.ts` (agent view,
 * Markdown, and API) in desktop Chromium. The mobile case sets its own viewport inside
 * the test, so one browser project covers both layouts. CI runs this after unit tests
 * (see `.github/workflows/tests.yml`); locally it reuses a dev server that is already up.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
