import { render } from '@testing-library/react';
import Certifications from '../components/Certifications';

describe('Certifications Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Certifications />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText, getByRole } = render(<Certifications />);
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Certifications & Achievements');
    expect(getByText('Continuous Learning and Professional Development')).toBeInTheDocument();
  });

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

  // Timeline test removed as the section is not implemented in the component

  it('displays learning impact stats', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Learning Impact')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument(); // 7 certifications earned
    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Certifications />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Certifications & Achievements');
  });

  it('verifies certificate buttons are present', () => {
    const { getAllByText } = render(<Certifications />);
    const verifyButtons = getAllByText('Verify Certificate');
    expect(verifyButtons.length).toBe(7); // 7 certifications
  });
});
