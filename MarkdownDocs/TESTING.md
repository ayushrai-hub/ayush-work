# Testing Guide

This guide covers the comprehensive test suite for the React + TypeScript portfolio application, including unit tests, integration tests, accessibility tests, API tests, and end-to-end tests.

## Overview

The test suite includes:
- **Unit Tests**: Jest + React Testing Library for component testing
- **Integration Tests**: Component interaction and data flow testing
- **Accessibility Tests**: jest-axe for WCAG compliance
- **API Tests**: API route testing with node-mocks-http
- **E2E Tests**: Playwright for user journey testing
- **Coverage Reporting**: >85% coverage target

## Test Structure

```
├── src/__tests__/           # Unit and integration tests
├── api/__tests__/           # API route tests
├── e2e/                     # End-to-end tests
├── .github/workflows/       # CI/CD pipeline
└── coverage/                # Coverage reports
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests with Coverage
```bash
npm run test:coverage
```

### E2E Tests
```bash
npx playwright test
```

### E2E Tests in UI Mode
```bash
npx playwright test --ui
```

## E2E Testing Setup Guide

The E2E testing framework uses Playwright to simulate real user interactions across multiple browsers and devices. This section provides step-by-step guidance for setting up and running E2E tests.

### Prerequisites

1. **Node.js**: Version 18 or higher
2. **Package Manager**: npm or yarn
3. **Browser Binaries**: Installed automatically by Playwright
4. **Development Server**: Running on http://localhost:5173

### Installation

E2E dependencies are included in package.json:

```json
{
  "@playwright/test": "^1.55.0",
  "playwright": "^1.55.0"
}
```

Install dependencies:
```bash
npm install
```

Install Playwright browsers:
```bash
npx playwright install
```

### Configuration Breakdown

The `playwright.config.ts` file contains the complete E2E setup:

```typescript
export default defineConfig({
  // Test directory containing all E2E test files
  testDir: './e2e',

  // Parallel execution settings
  fullyParallel: true,  // Run tests in parallel

  // CI/CD settings
  forbidOnly: !!process.env.CI,  // Prevent .only in CI
  retries: process.env.CI ? 2 : 0,  // Retry on CI failure

  // Execution settings
  workers: process.env.CI ? 1 : undefined,  // Single worker in CI

  // Base settings for all tests
  use: {
    baseURL: 'http://localhost:5173',  // Test URL
    trace: 'on-first-retry',           // Capture traces on retry
  },

  // Browser configurations
  projects: [
    // Desktop browsers
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },

    // Mobile browsers
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  // Development server configuration
  webServer: {
    command: 'npm run dev',           // Start dev server
    url: 'http://localhost:5173',     // Wait for this URL
    reuseExistingServer: !process.env.CI,  // Reuse server in dev
  },
});
```

### Running E2E Tests

#### Basic Execution

Run all E2E tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test example.spec.ts
```

Run tests in specific browser:
```bash
npx playwright test --project=chromium
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

#### Advanced Options

Run tests in headed mode (visible browser):
```bash
npx playwright test --headed
```

Run tests with UI mode (interactive):
```bash
npx playwright test --ui
```

Run tests in specific viewport:
```bash
npx playwright test --viewport-size="375,667"
```

#### Parallel and Sequential Execution

Tests run in parallel by default. To run sequentially:
```bash
npx playwright test --workers=1
```

### Writing E2E Tests

#### Test File Structure

Create `.spec.ts` files in the `e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Journey Tests', () => {
  test('complete portfolio interaction flow', async ({ page }) => {
    // Test implementation
  });
});
```

#### Test Patterns

1. **Page Navigation**
```typescript
await page.goto('/');
await expect(page).toHaveURL('http://localhost:5173/');
```

2. **Element Interaction**
```typescript
await page.click('button[type="submit"]');
await page.fill('input[name="email"]', 'test@example.com');
```

3. **Assertions**
```typescript
await expect(page.locator('text=Success')).toBeVisible();
await expect(page.locator('.error')).toBeHidden();
```

4. **Waiting Strategies**
```typescript
await page.waitForLoadState('networkidle');  // Wait for network
await page.waitForSelector('.loaded');       // Wait for element
await page.waitForTimeout(1000);             // Fixed delay (use sparingly)
```

#### Examples from Current Tests

**Basic Page Load Test:**
```typescript
test('should load homepage and display key elements', async ({ page }) => {
  await page.goto('/');

  // Check hero section
  await expect(page.locator('text=Ayush Rai')).toBeVisible();

  // Check navigation menu
  await expect(page.locator('text=About')).toBeVisible();
  await expect(page.locator('text=Projects')).toBeVisible();
  await expect(page.locator('text=Contact')).toBeVisible();
});
```

**Form Interaction Test:**
```typescript
test('should show contact form and validate input', async ({ page }) => {
  await page.goto('/');

  // Navigate to contact section
  await page.locator('a[href="#contact"]').click();

  // Verify form elements
  await expect(page.locator('#contact')).toBeVisible();
  await expect(page.locator('input[placeholder*="name"]')).toBeVisible();
  await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
  await expect(page.locator('textarea[placeholder*="message"]')).toBeVisible();
});
```

**Cross-browser Compatibility Test:**
```typescript
test('should work on mobile viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  // Test mobile-specific behavior
  await expect(page.locator('text=Ayush Rai')).toBeVisible();
});
```

### Debugging E2E Tests

#### Visual Debugging

1. **Screenshots on Failure**
```typescript
// Automatic screenshots on failure (configured in playwright.config.ts)
// Screenshots saved to test-results/

// Manual screenshots
await page.screenshot({ path: 'debug-screenshot.png' });
```

2. **Traces and Videos**
```typescript
// Enable tracing in config
trace: 'on-first-retry'

// Playwright UI mode
npx playwright test --ui
```

#### Console Debugging

Add debugging statements:
```typescript
console.log('Current URL:', page.url());
console.log('Element count:', await page.locator('.item').count());
```

#### Step-by-Step Execution

Use `--debug` flag for step-through debugging:
```bash
npx playwright test --debug
```

### CI/CD Integration

#### GitHub Actions Setup

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

#### Test Results and Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `playwright-report/results.json`
- **Screenshots**: `test-results/` directory
- **Traces**: `test-results/trace.zip`

### Performance Testing with E2E

#### Measuring Load Times

```typescript
test('should load homepage within performance budget', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - startTime;

  // Assert page loads within 3 seconds
  expect(loadTime).toBeLessThan(3000);

  // Measure specific resource load times
  const heroImage = page.locator('img[alt="Hero image"]');
  await expect(heroImage).toBeVisible();

  const imageLoadTime = await page.evaluate(() => {
    const img = document.querySelector('img[alt="Hero image"]') as HTMLImageElement;
    return img.complete ? 0 : Date.now() - performance.now();
  });

  expect(imageLoadTime).toBeLessThan(2000);
});
```

#### Network Conditions Testing

```typescript
test('should work on slow connections', async ({ page, context }) => {
  // Simulate slow 3G connection
  await context.route('**/*', async route => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
    await route.continue();
  });

  await page.goto('/');
  // Test that core functionality still works
});
```

### Best Practices for E2E Tests

#### Test Organization
- Group related tests using `test.describe()`
- Use descriptive test names
- Keep tests focused on single features
- Avoid flaky selectors (prefer semantic selectors over brittle CSS/XPath)

#### Selector Strategies
```typescript
// Best: Semantic selectors
page.locator('button[aria-label="Close"]')

// Good: Role-based selectors
page.getByRole('button', { name: 'Submit' })

// Avoid: Brittle CSS selectors
page.locator('.btn-primary.large')
```

#### Waiting Strategies
```typescript
// Prefer explicit waits over fixed timeouts
await expect(page.locator('.results')).toBeVisible();

// Use actionability checks
await page.click('button:enabled');
```

#### Test Data Management
```typescript
// Use fixtures or factories for test data
const testUser = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Test message content'
};

await page.fill('input[name="email"]', testUser.email);
```

#### Cross-browser Considerations
- Test critical user journeys across all supported browsers
- Use browser-specific expect assertions when needed
- Account for rendering differences between browsers

### Troubleshooting Common Issues

#### Flaky Tests
- **Cause**: Race conditions, animations, dynamic content
- **Solution**: Use proper wait strategies, avoid fixed timeouts

#### Element Not Found
- **Cause**: Incorrect selectors, async loading
- **Solution**: Use semantic selectors, implement proper waits

#### Browser-specific Failures
- **Cause**: Implementation differences across browsers
- **Solution**: Add browser-specific handling, check browser support

#### CI Failures
- **Cause**: Different environment, missing dependencies
- **Solution**: Ensure proper CI setup, match local environment

### Maintenance

#### Updating Tests
- Keep tests in sync with application changes
- Update selectors when UI changes
- Regularly review and remove obsolete tests

#### Test Coverage
- Focus E2E tests on critical user journeys
- Complement with unit tests for component logic
- Balance test execution time with coverage needs

This E2E setup provides comprehensive coverage of user interactions while maintaining fast execution and reliable results across different environments.

### Accessibility Tests (integrated with unit tests)
```bash
npm run test:coverage
```

## Writing Tests

### Unit Tests for Components

Create `ComponentName.test.tsx` files in `src/__tests__/`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import Component from '../components/Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    render(<Component />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Props Testing

```tsx
it('renders with different props', () => {
  const { rerender } = render(<Button variant="primary">Primary</Button>);
  expect(screen.getByText('Primary')).toBeInTheDocument();

  rerender(<Button variant="secondary">Secondary</Button>);
  expect(screen.getByText('Secondary')).toBeInTheDocument();
});
```

### API Tests

Create `route.test.ts` files in `api/__tests__/`:

```tsx
import { createMocks } from 'node-mocks-http';
import handler from '../handler';

describe('API Route', () => {
  it('returns 200 for valid request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { data: 'test' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

### E2E Tests

Create `.spec.ts` files in `e2e/`:

```tsx
import { test, expect } from '@playwright/test';

test('user journey', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Welcome')).toBeVisible();

  await page.click('a[href="/contact"]');
  await expect(page).toHaveURL('/contact');

  // User flow testing
});
```

## Test Coverage

### Current Coverage Targets
- **Lines**: >85%
- **Functions**: >85%
- **Branches**: >85%
- **Statements**: >85%

### Coverage Areas
- [x] All React components
- [x] Utility functions
- [x] API routes
- [x] Error handling
- [x] Accessibility compliance

## Accessibility Testing

All components are tested for accessibility compliance using `jest-axe`:

```tsx
it('is accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Accessibility Rules
- ✅ Color contrast ratios
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Semantic HTML
- ✅ Keyboard navigation

## CI/CD Pipeline

### GitHub Actions
- Runs on push/PR to main branches
- Tests on Node.js 18
- Coverage reporting with Codecov
- Lighthouse accessibility checks
- Coverage threshold enforcement (>85%)

### Pipeline Stages
1. **Linting**: ESLint checks
2. **Unit Tests**: Jest with coverage
3. **E2E Tests**: Playwright browser tests
4. **Accessibility**: Lighthouse audits
5. **Coverage Check**: Threshold validation

## Mock Setup

### Component Mocks
```tsx
// setupTests.ts
vi.mock('lucide-react', () => ({
  IconName: () => 'IconMock',
}));

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) =>
    React.createElement('div', props, children) },
}));
```

### API Mocks
```tsx
vi.mock('@sendgrid/mail', () => ({
  setApiKey: vi.fn(),
  send: vi.fn().mockResolvedValue({}),
}));
```

## Debugging Tests

### Debug Mode
```bash
npm test -- --testNamePattern="specific test" --verbose
```

### Watch Mode
```bash
npm test -- --watch
```

### Playwright Debug
```bash
npx playwright test --debug
```

## Test Best Practices

### Component Tests
- [x] Test rendering with default props
- [x] Test edge cases and error states
- [x] Test user interactions
- [x] Test accessibility compliance
- [x] Mock external dependencies

### API Tests
- [x] Test successful requests
- [x] Test error handling
- [x] Test input validation
- [x] Test external service failures
- [x] Mock external APIs

### E2E Tests
- [x] Real user journeys
- [x] Cross-browser compatibility
- [x] Mobile responsiveness
- [x] Form submissions
- [x] Navigation flows

## Performance Testing

### Bundle Analysis
```bash
npm run build
npx analyze-bundle-size
```

### Lighthouse Metrics
- Performance: >85
- Accessibility: >90
- Best Practices: >90
- SEO: >90

## Reporting

### Coverage Reports
- HTML: `coverage/lcov-report/index.html`
- JSON: `coverage/coverage-summary.json`
- LCOV: `coverage/lcov.info`

### Test Reports
- JUnit: `reports/junit.xml`
- Playwright: `results/`

## Contributing

### Adding New Tests
1. Create test file: `ComponentName.test.tsx`
2. Follow existing patterns
3. Include accessibility tests (axe)
4. Add coverage for new code
5. Update this guide if needed

### Code Coverage Requirements
- Branch coverage for conditionals
- Function coverage for exported functions
- Line coverage for executable statements

## Troubleshooting

### Common Issues
- **Mock failures**: Check `setupTests.ts`
- **Coverage issues**: Add `.not` to irrelevant assertions
- **E2E timeouts**: Increase timeout values
- **Access issues**: Wait for elements properly

### Dependencies
```json
{
  "vitest": "^3.2.4",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.8.0",
  "jest-axe": "^10.0.0",
  "@playwright/test": "^1.55.0",
  "node-mocks-http": "^1.12.2"
}
```

---

For questions about testing or to report issues, please check existing tests or create an issue in the repository.
