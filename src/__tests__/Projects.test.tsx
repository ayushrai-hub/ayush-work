import { render } from '@testing-library/react';
import Projects from '../components/Projects';

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
    expect(getByText('AI-Powered Code Review Assistant')).toBeInTheDocument();
    expect(getByText('Community Management Dashboard')).toBeInTheDocument();
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

    expect(codeLinks.length).toBe(4); // 4 projects
    expect(demoLinks.length).toBe(4);
  });

  it('displays project impact stats', () => {
    const { getByText } = render(<Projects />);
    expect(getByText('Project Impact')).toBeInTheDocument();
    expect(getByText('15+')).toBeInTheDocument();
    expect(getByText('50+')).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
  });

  it('shows categories for projects', () => {
    const { getByText } = render(<Projects />);
    expect(getByText('Data Science & Web Development')).toBeInTheDocument();
    expect(getByText('AI & Machine Learning')).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Projects />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Featured Projects');
  });
});
