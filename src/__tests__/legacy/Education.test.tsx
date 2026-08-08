import { render } from '@testing-library/react';
import Education from '../components/Education';

describe('Education Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Education />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText } = render(<Education />);
    expect(getByText('Education')).toBeInTheDocument();
    expect(getByText('Academic Excellence & Continuous Learning Journey')).toBeInTheDocument();
  });

  it('renders degree information', () => {
    const { getByText } = render(<Education />);
    expect(getByText('B.Tech Computer Science Engineering')).toBeInTheDocument();
    expect(getByText('BS Data Science and Applications')).toBeInTheDocument();
    expect(getByText('Higher Secondary (PCM)')).toBeInTheDocument();
  });

  it('displays coursework subjects', () => {
    const { getByText } = render(<Education />);
    expect(getByText('Operating Systems')).toBeInTheDocument();
    expect(getByText('Machine Learning')).toBeInTheDocument();
    expect(getByText('Mathematics')).toBeInTheDocument();
  });

  it('shows CGPA and percentage information', () => {
    const { getByText } = render(<Education />);
    expect(getByText('8.47/10.0')).toBeInTheDocument();
    expect(getByText('6.86/10.0')).toBeInTheDocument();
    expect(getByText('78.2%')).toBeInTheDocument();
  });

  it('displays academic highlights', () => {
    const { getByText } = render(<Education />);
    expect(getByText('8.47/10.0')).toBeInTheDocument();
    expect(getByText('Indian Institute of Technology, Madras')).toBeInTheDocument();
    expect(getByText('Lakshmi Narain College of Technology and Science, Bhopal')).toBeInTheDocument();
  });

  it('shows degree types', () => {
    const { getByText } = render(<Education />);
    expect(getByText('Primary Degree')).toBeInTheDocument();
    expect(getByText('Parallel Degree')).toBeInTheDocument();
    expect(getByText('Foundation')).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Education />);
    const mainHeading = getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Education');
  });
});
