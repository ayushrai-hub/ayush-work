import { render } from '@testing-library/react';
import Certifications from '../components/Certifications';

describe('Certifications Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Certifications />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Certifications & Achievements')).toBeInTheDocument();
    expect(getByText('Continuous Learning and Professional Development')).toBeInTheDocument();
  });

  it('renders certification categories', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Cybersecurity (2)')).toBeInTheDocument();
    expect(getByText('Cloud Computing (1)')).toBeInTheDocument();
    expect(getByText('Machine Learning (1)')).toBeInTheDocument();
  });

  it('displays individual certifications', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('CyberOps Associate')).toBeInTheDocument();
    expect(getByText('30 Days of Google Cloud Challenge')).toBeInTheDocument();
    expect(getByText('Foundations: Data, Everywhere')).toBeInTheDocument();
    expect(getByText('Introduction to Machine Learning')).toBeInTheDocument();
  });

  it('shows achievement timeline', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Achievement Timeline')).toBeInTheDocument();
    expect(getByText('2021')).toBeInTheDocument();
    expect(getByText('2022')).toBeInTheDocument();
    expect(getByText('2023')).toBeInTheDocument();
    expect(getByText('2024')).toBeInTheDocument();
  });

  it('displays learning impact stats', () => {
    const { getByText } = render(<Certifications />);
    expect(getByText('Learning Impact')).toBeInTheDocument();
    expect(getByText('8+')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument();
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
    expect(verifyButtons.length).toBe(8); // 8 certifications
  });
});
