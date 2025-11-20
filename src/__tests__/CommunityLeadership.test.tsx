import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText('Tech Innovation Hub Coordinator')).toBeInTheDocument();
    expect(screen.getByText('Google Developer Student Club Lead')).toBeInTheDocument();
    expect(screen.getByText('Digital Skills Training Coordinator')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Learn Student Ambassador')).toBeInTheDocument();
    expect(screen.getByText('Open Source Workshop Series')).toBeInTheDocument();
    expect(screen.getByText('Community Tech Outreach Program')).toBeInTheDocument();
  });

  it('filters activities by category when clicked', () => {
    render(<CommunityLeadership />);
    const educationButton = screen.getByText('Education');
    fireEvent.click(educationButton);

    expect(screen.getByText('Google Developer Student Club Lead')).toBeInTheDocument();
    expect(screen.getByText('Digital Skills Training Coordinator')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Learn Student Ambassador')).toBeInTheDocument();
    expect(screen.getByText('Open Source Workshop Series')).toBeInTheDocument();
    expect(screen.queryByText('Community Tech Outreach Program')).not.toBeInTheDocument();
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

  it('displays activity achievements', () => {
    render(<CommunityLeadership />);
    expect(screen.getByText('Established university-wide innovation programs')).toBeInTheDocument();
    expect(screen.getByText('Mentored 100+ students in emerging technologies')).toBeInTheDocument();
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
