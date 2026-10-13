/**
 * Legacy tests for the old Certifications section (headings, category counts, titles, stats, "Verify Certificate" buttons).
 *
 * Renders <Certifications /> with no providers and checks static copy, the
 * per-category counts, the "Learning Impact" numbers, and that seven
 * "Verify Certificate" buttons exist. The buttons have no click handler in the
 * component, so the test only checks that they render.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/Certifications' import resolves to src/__tests__/components/Certifications,
 * which does not exist; the component is src/components/Certifications.tsx, itself
 * unused by the current site (/certifications redirects to /recognition).
 * Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/Certifications.tsx (intended target)
 */
import { render } from '@testing-library/react';
import Certifications from '../components/Certifications';

/** Static content and button presence in the Certifications section. */
describe('Certifications Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Certifications />);
    expect(container).toBeInTheDocument();
  });

  /** Checks the h2 text and the "Continuous Learning and Professional Development" subtitle. */
  it('displays the correct heading', () => {
    const { getByText, getByRole } = render(<Certifications />);
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Certifications & Achievements');
    expect(getByText('Continuous Learning and Professional Development')).toBeInTheDocument();
  });

  /** Checks category labels with their counts, such as "Cybersecurity (3)". */
  it('renders certification categories', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Cybersecurity (3)')).toBeInTheDocument();
    expect(getByText('Cloud Computing (1)')).toBeInTheDocument();
    expect(getByText('Machine Learning (1)')).toBeInTheDocument();
  });

  it('displays individual certifications', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('CyberOps Associate')).toBeInTheDocument();
    expect(getByText('30 Days of Google Cloud')).toBeInTheDocument();
    expect(getByText('Foundations: Data, Everywhere')).toBeInTheDocument();
    expect(getByText('Introduction to Machine Learning')).toBeInTheDocument();
  });

  // A timeline test was removed because the component has no timeline view.

  /** Checks the hard-coded "Learning Impact" numbers 7, 100%, and 4. */
  it('displays learning impact stats', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Learning Impact')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
  });

  /** Checks that the only h2 reads "Certifications & Achievements". */
  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Certifications />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Certifications & Achievements');
  });

  /** Counts seven "Verify Certificate" labels; it does not click them or check any link target. */
  it('verifies certificate buttons are present', () => {
    const { getAllByText } = render(<Certifications />);
    const verifyButtons = getAllByText('Verify Certificate');
    expect(verifyButtons.length).toBe(7);
  });
});
