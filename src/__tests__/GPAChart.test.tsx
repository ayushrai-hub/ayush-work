import { render } from '@testing-library/react';
import GPAChart from '../components/GPAChart';

describe('GPAChart Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<GPAChart />);
    expect(container).toBeInTheDocument();
  });

  it('displays the chart title', () => {
    const { getByText } = render(<GPAChart />);
    expect(getByText('GPA Progression Chart')).toBeInTheDocument();
  });

  it('shows GPA summary stats', () => {
    const { getByText } = render(<GPAChart />);
    expect(getByText('8.47')).toBeInTheDocument();
    expect(getByText('6.86')).toBeInTheDocument();
    expect(getByText('9.1')).toBeInTheDocument();
    expect(getByText('8/8')).toBeInTheDocument();
  });

  it('displays chart legend', () => {
    const { getByText } = render(<GPAChart />);
    expect(getByText('B.Tech CSE')).toBeInTheDocument();
    expect(getByText('BS Data Science')).toBeInTheDocument();
  });

  it('shows key insights', () => {
    const { getByText } = render(<GPAChart />);
    expect(getByText('Insights')).toBeInTheDocument();
    expect(getByText('Consistent performance across 8 semesters')).toBeInTheDocument();
  });

  it('has accessible markup for heading', () => {
    const { getByRole } = render(<GPAChart />);
    const heading = getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('GPA Progression Chart');
  });
});
