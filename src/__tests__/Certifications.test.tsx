/**
 * Test suite for the Certifications component.
 *
 * This test file validates the rendering and functionality of the Certifications
 * component, which displays professional certifications, achievements, and
 * learning impact statistics. The component showcases completed certifications
 * across different technology domains and provides verifiable credentials.
 *
 * The component is part of the portfolio's credentials section and is tested for:
 * - Certification display and categorization
 * - Statistical information presentation
 * - Accessibility compliance for credentials verification
 * - Content accuracy and user experience
 *
 * @see ../components/Certifications.tsx - The component being tested
 * @see src/components/ - Related portfolio components
 */
import { render } from '@testing-library/react';
import Certifications from '../components/Certifications';

/**
 * Test suite for Certifications component functionality.
 *
 * Tests the certifications display behavior, content accuracy, and accessibility.
 * Covers user-facing features including credential categorization, verification
 * capabilities, and achievement metrics presentation for professional validation.
 *
 * @test-environment jsdom
 * @test-framework vitest + react-testing-library
 */
describe('Certifications Component', () => {
  /**
   * Validates that the Certifications component mounts successfully without errors.
   *
   * This basic smoke test ensures the component renders in the DOM
   * and can display certificate information. Verifies component handles
   * initial render state and data presentation requirements.
   *
   * @returns {void} - Test assertion results
   */
  it('renders without crashing', () => {
    const { container } = render(<Certifications />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Verifies main heading content and section introduction display.
   *
   * Tests that the Certifications component renders its primary headings correctly,
   * including the main section title and subtitle describing the professional
   * development focus. Ensures proper contextual introduction to credentials.
   *
   * @returns {void} - Test assertion results
   */
  it('displays the correct heading', () => {
    const { getByText, getByRole } = render(<Certifications />);
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Certifications & Achievements');
    expect(getByText('Continuous Learning and Professional Development')).toBeInTheDocument();
  });

  /**
   * Validates certification categorization and count display.
   *
   * Ensures the component properly organizes certifications by technology domains
   * and accurately displays the count of certifications within each category.
   * This test verifies the organizational structure for credential display.
   *
   * @returns {void} - Test assertion results
   */
  it('renders certification categories', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Cybersecurity (3)')).toBeInTheDocument();
    expect(getByText('Cloud Computing (1)')).toBeInTheDocument();
    expect(getByText('Machine Learning (1)')).toBeInTheDocument();
  });

  /**
   * Tests individual certification credential display.
   *
   * Validates that specific professional certifications are properly rendered
   * and visible to users. This ensures the component successfully displays
   * the complete list of earned technical credentials for verification.
   *
   * @returns {void} - Test assertion results
   */
  it('displays individual certifications', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('CyberOps Associate')).toBeInTheDocument();
    expect(getByText('30 Days of Google Cloud')).toBeInTheDocument();
    expect(getByText('Foundations: Data, Everywhere')).toBeInTheDocument();
    expect(getByText('Introduction to Machine Learning')).toBeInTheDocument();
  });

/**
 * Note: Timeline visualization test was removed.
 * The certifications component currently does not implement a timeline view,
 * so the related test case was removed to avoid false positives.
 */

  /**
   * Validates learning impact metrics and statistics display.
   *
   * Ensures the component successfully shows quantitative metrics about
   * professional development achievements, including certification counts,
   * completion rates, and category diversity for credibility demonstration.
   *
   * @returns {void} - Test assertion results
   */
  it('displays learning impact stats', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Learning Impact')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument(); // 7 certifications earned
    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
  });

  /**
   * Tests semantic HTML structure and heading accessibility.
   *
   * Validates proper heading hierarchy implementation for screen readers
   * and assistive technologies. Ensures the certifications section follows
   * WCAG guidelines for content organization and navigation support.
   *
   * @returns {void} - Test assertion results
   */
  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Certifications />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Certifications & Achievements');
  });

  /**
   * Validates credential verification accessibility.
   *
   * Ensures all professional certifications have associated verification
   * mechanisms (external links/buttons) for credential validation.
   * This test confirms users can independently verify claimed qualifications.
   *
   * @returns {void} - Test assertion results
   */
  it('verifies certificate buttons are present', () => {
    const { getAllByText } = render(<Certifications />);
    const verifyButtons = getAllByText('Verify Certificate');
    expect(verifyButtons.length).toBe(7); // 7 certifications
  });
});
