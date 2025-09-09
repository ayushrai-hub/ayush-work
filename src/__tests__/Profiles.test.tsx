import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/Footer';
import * as profilesData from '../lib/profilesData';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Mock useGTM hook
vi.mock('../hooks/useGTM', () => ({
  useGTM: () => ({
    trackButton: vi.fn(),
    trackExternal: vi.fn(),
  }),
}));

// Wrapper component for Router context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

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
    // Check for social media links (they should be present as icons)
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

    // Check if there are more than 2 domains to show "More Platforms"
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
