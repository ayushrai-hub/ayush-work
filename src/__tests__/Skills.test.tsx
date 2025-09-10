import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Skills from '../components/Skills';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

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
    const skillDivs = container.querySelectorAll('div[data-testid$="-icon"]');
    expect(skillDivs).toHaveLength(6); // Should have 6 skill categories
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Skills />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Multi-Disciplinary Skills');
  });
});
