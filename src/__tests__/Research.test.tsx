import { render } from '@testing-library/react';
import Research from '../components/Research';

describe('Research Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Research />);
    expect(container).toBeInTheDocument();
  });

  it('displays research projects section', () => {
    const { getByText } = render(<Research />);
    expect(getByText('Research Projects')).toBeInTheDocument();
    expect(getByText('AI-Powered Agricultural Advisory System')).toBeInTheDocument();
    expect(getByText('NLP for Legal Document Analysis')).toBeInTheDocument();
  });

  it('shows awards and achievements', () => {
    const { getByText } = render(<Research />);
    expect(getByText('Awards & Achievements')).toBeInTheDocument();
    expect(getByText('Top 5 Finalist - Smart India Hackathon 2024')).toBeInTheDocument();
    expect(getByText('Best Research Paper Award')).toBeInTheDocument();
  });

  it('has accessible markup for headings', () => {
    const { getAllByRole } = render(<Research />);
    const headings = getAllByRole('heading', { level: 2 });
    expect(headings).toHaveLength(2); // Research Projects and Awards & Achievements
  });
});
