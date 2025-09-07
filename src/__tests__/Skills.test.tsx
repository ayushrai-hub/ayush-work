import { render } from '@testing-library/react';
import Skills from '../components/Skills';

describe('Skills Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Skills />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('Multi-Disciplinary Skills')).toBeInTheDocument();
    expect(getByText('Technical Expertise Across Multiple Domains')).toBeInTheDocument();
  });

  it('renders skill categories', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('AI & Machine Learning')).toBeInTheDocument();
    expect(getByText('Web Development')).toBeInTheDocument();
    expect(getByText('Data Science')).toBeInTheDocument();
    expect(getByText('Cloud & DevOps')).toBeInTheDocument();
    expect(getByText('Leadership')).toBeInTheDocument();
    expect(getByText('Creative & Strategic')).toBeInTheDocument();
  });

  it('displays individual skills', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('Python')).toBeInTheDocument();
    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('SQL')).toBeInTheDocument();
    expect(getByText('Git/GitHub')).toBeInTheDocument();
    expect(getByText('Team Management')).toBeInTheDocument();
    expect(getByText('Problem Solving')).toBeInTheDocument();
  });

  it('shows skill levels', () => {
    const { getByText } = render(<Skills />);
    expect(getByText('90%')).toBeInTheDocument();
    expect(getByText('85%')).toBeInTheDocument();
    expect(getByText('80%')).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Skills />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Multi-Disciplinary Skills');
  });
});
