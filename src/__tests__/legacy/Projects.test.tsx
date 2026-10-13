/**
 * Legacy tests for the old Featured Projects section (titles, tech tags, Code and Live Demo links, impact stats, categories).
 *
 * Renders <Projects /> with no providers and checks static copy, that each of the
 * six projects has a "Code" and a "Live Demo" link, and the h2.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The '../components/Projects'
 * import resolves to src/__tests__/components/Projects, which does not exist; the component
 * is src/components/Projects.tsx, itself unused by the current site. Assertions have not
 * been re-checked against the component.
 *
 * Connects to:
 * - src/components/Projects.tsx (intended target)
 */
import { render } from '@testing-library/react';
import Projects from '../components/Projects';

/** Static content and links of the Featured Projects section. */
describe('Projects Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Projects />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText, getByRole } = render(<Projects />);
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Featured Projects');
    expect(getByText('Technical Excellence Across Multiple Domains')).toBeInTheDocument();
  });

  it('renders project titles', () => {
    const { getByText } = render(<Projects />);
    expect(getByText('Stock Price Analysis Platform')).toBeInTheDocument();
    expect(getByText('Iha-By-Himani Art Studio Website')).toBeInTheDocument();
    expect(getByText('Overlay Text Box Extension')).toBeInTheDocument();
    expect(getByText('Personal Portfolio Website')).toBeInTheDocument();
    expect(getByText('Expert-O')).toBeInTheDocument();
    expect(getByText('Shiksha-Mitra')).toBeInTheDocument();
  });

  it('displays technologies', () => {
    const { getAllByText } = render(<Projects />);
    expect(getAllByText('React').length).toBeGreaterThan(0);
    expect(getAllByText('Python').length).toBeGreaterThan(0);
    expect(getAllByText('TypeScript').length).toBeGreaterThan(0);
  });

  it('shows GitHub and Demo links', () => {
    const { getAllByText } = render(<Projects />);
    const codeLinks = getAllByText('Code');
    const demoLinks = getAllByText('Live Demo');

    expect(codeLinks.length).toBe(6);
    expect(demoLinks.length).toBe(6);
  });

  it('displays project impact stats', () => {
    const { getByText } = render(<Projects />);
    expect(getByText('Project Impact')).toBeInTheDocument();
    expect(getByText('10+')).toBeInTheDocument();
    expect(getByText('5+')).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
  });

  it('shows categories for projects', () => {
    const { getByText } = render(<Projects />);
    expect(getByText('Data Science & Web Development')).toBeInTheDocument();
    expect(getByText('AI & Digital Innovation')).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Projects />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Featured Projects');
  });
});
