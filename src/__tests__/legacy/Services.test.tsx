/**
 * Legacy tests for the old Services section (service titles, prices, durations, categories, features, axe audit).
 *
 * Renders <Services /> with no providers, checks static copy including the
 * "Starting at $..." price strings, and runs a jest-axe audit. The current site has
 * no pricing page (/services redirects to /contact), so these prices exist only in
 * the legacy component.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The '../components/Services'
 * import resolves to src/__tests__/components/Services, which does not exist; the component
 * is src/components/Services.tsx, itself unused by the current site. Assertions have not
 * been re-checked against the component.
 *
 * Connects to:
 * - src/components/Services.tsx (intended target)
 * - jest-axe (matcher registered in src/setupTests.ts)
 */
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { vi } from 'vitest';
import Services from '../components/Services';

// Overrides the global IntersectionObserver mock from src/setupTests.ts for this file.
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

/** Static content and accessibility of the Services section. */
describe('Services', () => {
  it('renders the services section heading', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { name: /Services.*Solutions/i })).toBeInTheDocument();
    expect(screen.getByText('Comprehensive technical and strategic solutions for your business needs')).toBeInTheDocument();
  });

  it('renders all service titles', () => {
    render(<Services />);
    expect(screen.getByText('AI & Machine Learning Development')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Web Development')).toBeInTheDocument();
    expect(screen.getByText('Data Science & Analytics')).toBeInTheDocument();
    expect(screen.getByText('Community Management & Strategy')).toBeInTheDocument();
    expect(screen.getByText('Technical Consultation & Training')).toBeInTheDocument();
    expect(screen.getByText('Rapid Prototyping & MVP')).toBeInTheDocument();
  });

  it('displays pricing and duration', () => {
    render(<Services />);
    expect(screen.getByText('Starting at $2000, negotiable')).toBeInTheDocument();
    expect(screen.getByText('Starting at $1500, negotiable')).toBeInTheDocument();
    expect(screen.getByText('2-8 weeks')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('shows service categories', () => {
    render(<Services />);
    expect(screen.getAllByText('Technical').length).toBeGreaterThan(0);
    expect(screen.getByText('Strategic')).toBeInTheDocument();
    expect(screen.getByText('Consultation')).toBeInTheDocument();
  });

  it('renders features for each service', () => {
    render(<Services />);
    expect(screen.getByText('Custom AI model development')).toBeInTheDocument();
    expect(screen.getByText('React/TypeScript applications')).toBeInTheDocument();
    expect(screen.getByText('Community strategy development')).toBeInTheDocument();
  });

  it('renders the Why Choose Me section', () => {
    render(<Services />);
    expect(screen.getByText('Why Choose My Services')).toBeInTheDocument();
    expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
    expect(screen.getByText('Premium Quality')).toBeInTheDocument();
    expect(screen.getByText('Dedicated Support')).toBeInTheDocument();
    expect(screen.getByText('Innovation Focus')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<Services />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
