/**
 * Test suite for the About component.
 *
 * This test file validates the rendering and functionality of the About component,
 * which displays personal story, core values, and philosophical content.
 * The component is part of the portfolio's main sections and is tested for:
 * - Basic rendering capabilities
 * - Content accuracy and display
 * - Accessibility compliance
 * - UI structure and markup
 *
 * @see ../components/About.tsx - The component being tested
 * @see src/components/ - Related portfolio components
 */
import { render, screen } from '@testing-library/react';
import About from '../components/About';

/**
 * Test suite for About component functionality.
 *
 * Tests the About component's rendering behavior, content display,
 * and accessibility features. Covers user-facing features including
 * personal story presentation, core values display, and philosophical content.
 *
 * @test-environment jsdom
 * @test-framework vitest + react-testing-library
 */
describe('About Component', () => {
  /**
   * Validates that the About component mounts successfully without errors.
   *
   * This basic smoke test ensures the component renders in the DOM
   * and provides a foundation for other tests. Verifies component
   * successfully handles initial render state.
   *
   * @returns {void} - Test assertion results
   */
  it('renders without crashing', () => {
    const { container } = render(<About />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Verifies main heading content and structure display.
   *
   * Tests that the About component renders its primary headings correctly,
   * including the main "My Story" section title and subtitle. This ensures
   * the narrative introduction is properly presented to users.
   *
   * @returns {void} - Test assertion results
   */
  it('displays the correct heading', () => {
    const { getByText } = render(<About />);
    expect(getByText((content) => content.includes("My Story"))).toBeInTheDocument();
    expect(getByText('The Polymath\'s Journey')).toBeInTheDocument();
  });

  /**
   * Validates core values section rendering and content.
   *
   * Ensures the About component successfully displays the four core values
   * that define the personal professional philosophy. This test covers
   * the display of strategic thinking, technical innovation, community
   * leadership, and continuous learning principles.
   *
   * @returns {void} - Test assertion results
   */
  it('renders core values section', () => {
    const { getByText } = render(<About />);
    expect(getByText('Core Values & Approach')).toBeInTheDocument();
    expect(getByText('Strategic Thinking')).toBeInTheDocument();
    expect(getByText('Technical Innovation')).toBeInTheDocument();
    expect(getByText('Community Leadership')).toBeInTheDocument();
    expect(getByText('Continuous Learning')).toBeInTheDocument();
  });

  /**
   * Tests personal story text content rendering.
   *
   * Validates that biographical content about technology enthusiasm
   * and career journey is properly displayed. Ensures the narrative
   * sections that introduce the professional background are correctly
   * rendered for user consumption.
   *
   * @returns {void} - Test assertion results
   */
  it('displays personal story content', () => {
    const { getByText } = render(<About />);
    expect(getByText(/I'm a technology enthusiast/)).toBeInTheDocument();
    expect(getByText(/My journey spans across AI\/ML development/)).toBeInTheDocument();
  });

  /**
   * Validates philosophical content and attribution display.
   *
   * Ensures the component renders inspirational quotes and proper
   * attribution. This tests the display of core philosophy text
   * and credit information that provides brand voice and identity.
   *
   * @returns {void} - Test assertion results
   */
  it('includes philosophical quote', () => {
    const { getByText } = render(<About />);
    expect(getByText(/Technology should amplify human potential/)).toBeInTheDocument();
    expect(getByText('- Ayush Rai')).toBeInTheDocument();
  });

  /**
   * Tests semantic HTML structure and accessibility compliance.
   *
   * Validates proper heading hierarchy and ARIA landmark usage
   * for screen readers and assistive technologies. Ensures the
   * About section follows WCAG guidelines for semantic markup
   * and logical content structure.
   *
   * @returns {void} - Test assertion results
   * @example
   * // Verifies heading levels: h2 -> h3 -> h4
   * // Tests semantic organization for screen readers
   */
  it('has accessible markup for heading structure', () => {
    render(<About />);

    // Check main heading
    const mainHeading = screen.getByRole('heading', { level: 2, name: /My Story/i });
    expect(mainHeading).toBeInTheDocument();

    // Check for specific h3 headings
    const storyHeading = screen.getByRole('heading', { level: 3, name: 'My Story' });
    const coreValuesHeading = screen.getByRole('heading', { level: 3, name: 'Core Values & Approach' });

    expect(storyHeading).toBeInTheDocument();
    expect(coreValuesHeading).toBeInTheDocument();

    // Check for h4 headings in core values cards
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBe(4); // Four core value headings
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
