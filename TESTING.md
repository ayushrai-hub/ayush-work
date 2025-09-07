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
