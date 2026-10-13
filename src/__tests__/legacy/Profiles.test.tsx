/**
 * Legacy tests for the profile links shown in the old layout Footer. Despite the file name, it renders Footer, not src/components/Profiles.tsx.
 *
 * Renders <Footer /> inside BrowserRouter with useGTM mocked, and checks the
 * brand line, "Connect:" social links, Quick Links, "Top Platforms", the
 * conditional "More Platforms" block, the hard-coded "© 2025 Ayush Rai" line
 * with extra platform names, the back-to-top button, and rel="noopener noreferrer"
 * on every target="_blank" link.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/layout/Footer', '../lib/profilesData', and '../hooks/useGTM' paths
 * resolve under src/__tests__/, where none exist; the targets are
 * src/components/layout/Footer.tsx (unused by the current site), src/lib/profilesData.ts,
 * and src/hooks/useGTM.ts. Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/layout/Footer.tsx (intended target), src/lib/profilesData.ts, src/hooks/useGTM.ts
 * - legacy/Footer.test.tsx covers the same component
 */
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import * as profilesData from '../lib/profilesData';

// Overrides the global IntersectionObserver mock from src/setupTests.ts for this file.
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Footer calls trackButton and trackExternal from useGTM; the spies keep dataLayer untouched.
vi.mock('../hooks/useGTM', () => ({
  useGTM: () => ({
    trackButton: vi.fn(),
    trackExternal: vi.fn(),
  }),
}));

/** Supplies the router context that Footer's useLocation and useNavigate need. */
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

/** Profile and navigation links rendered by the legacy Footer. */
describe('Footer Profiles Integration', () => {
  it('renders footer with brand information', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    expect(screen.getByText('Ayush Rai')).toBeInTheDocument();
    expect(screen.getByText('Polymath | AI Engineer | Creative Technologist')).toBeInTheDocument();
  });

  it('renders primary social links', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    expect(screen.getByText('Connect:')).toBeInTheDocument();
    // Counts every link in the footer, not only the icon-only social links.
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('renders quick navigation links', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    // Note: Contact link is not rendered in the first 4 links slice
  });

  it('renders top platforms section', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    expect(screen.getByText('Top Platforms')).toBeInTheDocument();
  });

  it('renders more platforms section when available', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    if (profilesData.domains.length > 2) {
      expect(screen.getByText('More Platforms')).toBeInTheDocument();
    }
  });

  it('renders copyright and additional links', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    expect(screen.getByText('© 2025 Ayush Rai')).toBeInTheDocument();
    expect(screen.getByText('Workana')).toBeInTheDocument();
    expect(screen.getByText('Guru')).toBeInTheDocument();
    expect(screen.getByText('Codementor')).toBeInTheDocument();
  });

  it('renders back to top button', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );
    const backToTopButton = screen.getByLabelText('Back to top');
    expect(backToTopButton).toBeInTheDocument();
  });

  it('handles external links with proper attributes', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    );

    const externalLinks = screen.getAllByRole('link').filter(link =>
      link.hasAttribute('target') && link.getAttribute('target') === '_blank'
    );

    externalLinks.forEach(link => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
