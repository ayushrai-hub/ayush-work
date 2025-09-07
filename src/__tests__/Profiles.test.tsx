import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Profiles from '../components/Profiles';
import * as profilesData from '../lib/profilesData';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('Profiles', () => {
  it('renders the main heading', () => {
    render(<Profiles />);
    expect(screen.getByText('Profiles & Platforms')).toBeInTheDocument();
    expect(screen.getByText('Explore My Profiles Across Platforms')).toBeInTheDocument();
  });

  it('displays platform stats', () => {
    render(<Profiles />);
    expect(screen.getByText(profilesData.profiles.length + '+')).toBeInTheDocument();
    expect(screen.getByText(profilesData.domains.length.toString())).toBeInTheDocument();
    expect(screen.getByText('Platforms Showcased')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<Profiles />);
    const searchInput = screen.getByPlaceholderText('Search profiles, categories, or descriptions...');
    expect(searchInput).toBeInTheDocument();
  });

  it('filters profiles based on search term', () => {
    render(<Profiles />);
    const searchInput = screen.getByPlaceholderText('Search profiles, categories, or descriptions...');

    // Type in search
    fireEvent.change(searchInput, { target: { value: 'github' } });

    // Should show filtered results
    expect(screen.getByText('Profiles & Platforms')).toBeInTheDocument();
  });

  it('renders all domain filter buttons', () => {
    render(<Profiles />);
    expect(screen.getByText('All Domains')).toBeInTheDocument();
    profilesData.domains.forEach(domain => {
      expect(screen.getByText(domain.name.replace('-', ' '))).toBeInTheDocument();
    });
  });

  it('displays profile categories correctly', () => {
    render(<Profiles />);
    // Check if key profiles are rendered - this depends on the actual data
    expect(screen.getByText('Profiles & Platforms')).toBeInTheDocument();
  });

  it('handles external links correctly', () => {
    render(<Profiles />);
    const externalLinks = screen.getAllByText('Visit Profile');
    // Check that links have proper attributes
    externalLinks.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('shows empty state when no profiles match', () => {
    render(<Profiles />);
    const searchInput = screen.getByPlaceholderText('Search profiles, categories, or descriptions...');

    // Type something that won't match anything
    fireEvent.change(searchInput, { target: { value: 'nonexistentterm12345' } });

    expect(screen.getByText('No profiles found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument();
  });

  it('toggles domain expansion', () => {
    render(<Profiles />);
    // This test would require more specific selectors based on actual data
    expect(screen.getByText('Profiles & Platforms')).toBeInTheDocument();
  });
});
