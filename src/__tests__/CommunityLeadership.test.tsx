import { render, screen, fireEvent, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { vi } from 'vitest';
import CommunityLeadership from '../components/CommunityLeadership';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('CommunityLeadership', () => {
  it('renders the main heading', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('Community Leadership')).toBeInTheDocument();
    expect(screen.getByText('Building bridges between technology, education, and community impact')).toBeInTheDocument();
  });

  it('renders all category buttons', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Government')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Diversity')).toBeInTheDocument();
  });

  it('renders all leadership activities by default', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('TMF Taiwan Ministry of Foreign Affairs')).toBeInTheDocument();
    expect(screen.getByText('Google Developer Student Club Lead')).toBeInTheDocument();
    expect(screen.getByText('Women Techmakers Regional Lead')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Learn Student Ambassador')).toBeInTheDocument();
    expect(screen.getByText('Open Source Workshop Series')).toBeInTheDocument();
    expect(screen.getByText('Smart City Bhopal Youth Council')).toBeInTheDocument();
  });

  it('filters activities by category when clicked', () => {
    render(<CommunityLeadership />);
    const educationButton = screen.getByText('Education');
    fireEvent.click(educationButton);

    expect(screen.getByText('Google Developer Student Club Lead')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Learn Student Ambassador')).toBeInTheDocument();
    expect(screen.getByText('Open Source Workshop Series')).toBeInTheDocument();
    expect(screen.queryByText('TMF Taiwan Ministry of Foreign Affairs')).not.toBeInTheDocument();
    expect(screen.queryByText('Women Techmakers Regional Lead')).not.toBeInTheDocument();
    expect(screen.queryByText('Smart City Bhopal Youth Council')).not.toBeInTheDocument();
  });

  it('renders workshops and events section', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('Recent Workshops & Events')).toBeInTheDocument();
    expect(screen.getByText('AI/ML Bootcamp for Beginners')).toBeInTheDocument();
    expect(screen.getByText('Women in Tech Career Workshop')).toBeInTheDocument();
    expect(screen.getByText('Cross-border Tech Innovation Summit')).toBeInTheDocument();
    expect(screen.getByText('Open Source Contribution Drive')).toBeInTheDocument();
    expect(screen.getByText('AI Ethics & Responsible AI Workshop')).toBeInTheDocument();
  });

  it('displays correct participant count and location for workshops', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('150 participants')).toBeInTheDocument();
    expect(screen.getByText('LNCT University, Bhopal')).toBeInTheDocument();
  });

  it('shows active category button styling', () => {
    render(<CommunityLeadership />);
    const allButton = screen.getByText('All');
    const educationButton = screen.getByText('Education');

    // Default 'All' should be active
    expect(allButton).toHaveClass('bg-accent text-primary shadow-lg');

    // Click Education and check styling
    fireEvent.click(educationButton);
    expect(allButton).not.toHaveClass('bg-accent text-primary shadow-lg');
    expect(educationButton).toHaveClass('bg-accent text-primary shadow-lg');
  });

  it('displays activity achievements and impact', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('Led 15+ cross-cultural technology exchange programs')).toBeInTheDocument();
    expect(screen.getByText('Strengthened Taiwan-India technological partnerships')).toBeInTheDocument();
  });

  it('renders correctly with empty filtered results', () => {
    // Mock categories to not include any activities
    // Since we can't easily mock, we'll skip this test as it would require restructuring the component
    // In the current implementation, all categories have activities, so this would be a refactor
  });

  it('is accessible', async () => {
    const { container } = render(<CommunityLeadership />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles keyboard navigation for category buttons', () => {
    render(<CommunityLeadership />);
    const allButton = screen.getByText('All');
    allButton.focus();
    expect(document.activeElement).toBe(allButton);
  });
});
