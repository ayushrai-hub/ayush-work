/**
 * Legacy tests for the old Skills grid (heading, six categories, sample skills, card count).
 *
 * Renders <Skills /> with no providers, checks static copy, and counts category
 * cards by their Tailwind class selector, which breaks if those classes change.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The '../components/Skills'
 * import resolves to src/__tests__/components/Skills, which does not exist; the component
 * is src/components/Skills.tsx, itself unused by the current site. Assertions have not
 * been re-checked against the component.
 *
 * Connects to:
 * - src/components/Skills.tsx (intended target)
 */
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Skills from '../components/Skills';

// Overrides the global IntersectionObserver mock from src/setupTests.ts for this file.
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

/** Static content and category count of the Skills section. */
describe('Skills Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Skills />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('Multi-Disciplinary')).toBeInTheDocument();
    expect(getByText('Skills')).toBeInTheDocument();
    expect(getByText('Technical Expertise Across Multiple Domains')).toBeInTheDocument();
  });

  it('renders skill categories', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('AI & ML')).toBeInTheDocument();
    expect(getByText('Web Dev')).toBeInTheDocument();
    expect(getByText('Data Science')).toBeInTheDocument();
    expect(getByText('Cloud & DevOps')).toBeInTheDocument();
    expect(getByText('Leadership')).toBeInTheDocument();
    expect(getByText('Creative')).toBeInTheDocument();
  });

  it('displays individual skills', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('Python')).toBeInTheDocument();
    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('SQL')).toBeInTheDocument();
    expect(getByText('Git')).toBeInTheDocument();
    expect(getByText('Team Mgmt')).toBeInTheDocument();
    expect(getByText('Problem Solving')).toBeInTheDocument();
  });

  it('renders all skill categories', () => {
    const { container } = render(<Skills />);
    const skillCategories = container.querySelectorAll('.group.bg-white.dark\\:bg-gray-800');
    expect(skillCategories).toHaveLength(6);
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Skills />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Multi-Disciplinary Skills');
  });
});
