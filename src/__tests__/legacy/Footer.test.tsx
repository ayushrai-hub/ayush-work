/**
 * Legacy tests for the old layout Footer (copyright line and section navigation buttons).
 *
 * Renders <Footer /> inside BrowserRouter and checks the "© <year> Ayush Rai"
 * line and the About Me, Projects, and Experience buttons.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/layout/Footer' import resolves to src/__tests__/components/layout/Footer,
 * which does not exist; the component is src/components/layout/Footer.tsx, itself unused
 * by the current site (the live footer is src/components/site/SiteFooter.tsx).
 * legacy/Profiles.test.tsx also renders this Footer. Assertions have not been re-checked
 * against the component.
 *
 * Connects to:
 * - src/components/layout/Footer.tsx (intended target)
 */
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/layout/Footer';

/** Copyright text and quick-navigation buttons of the legacy Footer. */
describe('Footer', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(/© \d{4} Ayush Rai/)).toBeInTheDocument();
  });

  it('contains expected navigation buttons', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /About Me/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Projects/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Experience/ })).toBeInTheDocument();
  });
});
