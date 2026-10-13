/**
 * Legacy tests for the old Community Leadership section (category filter, activities, workshops, axe audit).
 *
 * Renders <CommunityLeadership /> with no providers, clicks the category filter
 * buttons, checks the active-button classes, workshop details, achievement text,
 * and runs a jest-axe audit. The "Diversity" filter is only checked for presence,
 * not clicked. One test body is intentionally empty (see below).
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/CommunityLeadership' import resolves to
 * src/__tests__/components/CommunityLeadership, which does not exist; the component is
 * src/components/CommunityLeadership.tsx, itself unused by the current site.
 * Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/CommunityLeadership.tsx (intended target)
 * - jest-axe (matcher registered in src/setupTests.ts)
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { vi } from 'vitest';
import CommunityLeadership from '../components/CommunityLeadership';

// Overrides the global IntersectionObserver mock from src/setupTests.ts for this file.
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

/** Static content, category filtering, and accessibility of the Community Leadership section. */
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

  /** Clicks "Education" and expects the four education activities to remain and the outreach program to disappear. */
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

  /** The active filter carries "bg-accent text-primary shadow-lg"; "All" is active until "Education" is clicked. */
  it('shows active category button styling', () => {
    render(<CommunityLeadership />);
    const allButton = screen.getByText('All');
    const educationButton = screen.getByText('Education');

    expect(allButton).toHaveClass('bg-accent text-primary shadow-lg');

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
    // Placeholder with no assertions, so it always passes. Clicking the "Diversity"
    // filter would exercise the empty state: no activity in the component uses that category.
  });

  /** Runs jest-axe on the rendered section and expects no violations. */
  it('is accessible', async () => {
    const { container } = render(<CommunityLeadership />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /** Only checks that the "All" button can receive focus; no key events are sent. */
  it('handles keyboard navigation for category buttons', () => {
    render(<CommunityLeadership />);
    const allButton = screen.getByText('All');
    allButton.focus();
    expect(document.activeElement).toBe(allButton);
  });
});
