/**
 * Legacy tests for the old Research section (project titles, awards list, two h2 headings).
 *
 * Renders <Research /> with no providers. The award titles it expects are listed in
 * `researchAwardsNeedsConfirmation` in src/content/research.ts, so the current site
 * withholds them; this suite only reflects what the legacy component hard-codes.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The '../components/Research'
 * import resolves to src/__tests__/components/Research, which does not exist; the component
 * is src/components/Research.tsx, itself unused by the current site (/research renders
 * src/pages/ResearchPage.tsx). Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/Research.tsx (intended target)
 */
import { render } from '@testing-library/react';
import Research from '../components/Research';

/** Static content and heading count of the Research section. */
describe('Research Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Research />);
    expect(container).toBeInTheDocument();
  });

  it('displays research projects section', () => {
    const { getByText, getByRole } = render(<Research />);
    expect(getByRole('heading', { name: /Research Projects/i })).toBeInTheDocument();
    expect(getByText('AI-Powered Agricultural Advisory System')).toBeInTheDocument();
    expect(getByText('NLP for Legal Document Analysis')).toBeInTheDocument();
  });

  it('shows awards and achievements', () => {
    const { getByText, getByRole } = render(<Research />);
    expect(getByRole('heading', { name: /Awards.*Achievements/i })).toBeInTheDocument();
    expect(getByText('Top 5 Finalist - Smart India Hackathon 2024')).toBeInTheDocument();
    expect(getByText('Best Research Paper Award')).toBeInTheDocument();
  });

  it('has accessible markup for headings', () => {
    const { getAllByRole } = render(<Research />);
    const headings = getAllByRole('heading', { level: 2 });
    expect(headings).toHaveLength(2);
  });
});
