/**
 * Legacy tests for the old single-page About section (story, core values, quote, heading levels).
 *
 * Renders <About /> with no providers and checks static copy plus the h2/h3/h4
 * heading structure.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The '../components/About'
 * import resolves to src/__tests__/components/About, which does not exist; the
 * component is src/components/About.tsx, itself unused by the current site.
 * Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/About.tsx (intended target)
 */
import { render, screen } from '@testing-library/react';
import About from '../components/About';

/** Static content and heading hierarchy of the About section. */
describe('About Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<About />);
    expect(container).toBeInTheDocument();
  });

  /** Checks the "My Story" title and "The Polymath's Journey" subtitle. */
  it('displays the correct heading', () => {
    const { getByText } = render(<About />);
    expect(getByText((content) => content.includes("My Story"))).toBeInTheDocument();
    expect(getByText('The Polymath\'s Journey')).toBeInTheDocument();
  });

  it('renders core values section', () => {
    const { getByText } = render(<About />);
    expect(getByText('Core Values & Approach')).toBeInTheDocument();
    expect(getByText('Strategic Thinking')).toBeInTheDocument();
    expect(getByText('Technical Innovation')).toBeInTheDocument();
    expect(getByText('Community Leadership')).toBeInTheDocument();
    expect(getByText('Continuous Learning')).toBeInTheDocument();
  });

  it('displays personal story content', () => {
    const { getByText } = render(<About />);
    expect(getByText(/I'm a technology enthusiast/)).toBeInTheDocument();
    expect(getByText(/My journey spans across AI\/ML development/)).toBeInTheDocument();
  });

  it('includes philosophical quote', () => {
    const { getByText } = render(<About />);
    expect(getByText(/Technology should amplify human potential/)).toBeInTheDocument();
    expect(getByText('- Ayush Rai')).toBeInTheDocument();
  });

  /** Expects an h2 "My Story", h3s "My Story" and "Core Values & Approach", and four h4 core-value titles. */
  it('has accessible markup for heading structure', () => {
    render(<About />);

    const mainHeading = screen.getByRole('heading', { level: 2, name: /My Story/i });
    expect(mainHeading).toBeInTheDocument();

    const storyHeading = screen.getByRole('heading', { level: 3, name: 'My Story' });
    const coreValuesHeading = screen.getByRole('heading', { level: 3, name: 'Core Values & Approach' });

    expect(storyHeading).toBeInTheDocument();
    expect(coreValuesHeading).toBeInTheDocument();

    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBe(4);
    expect(headings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textContent: 'Strategic Thinking' }),
        expect.objectContaining({ textContent: 'Technical Innovation' }),
        expect.objectContaining({ textContent: 'Community Leadership' }),
        expect.objectContaining({ textContent: 'Continuous Learning' })
      ])
    );
  });
});
