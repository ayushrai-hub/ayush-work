import { render, screen } from '@testing-library/react';
import About from '../components/About';

describe('About Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<About />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    const { getByText } = render(<About />);
    expect(getByText((content) => content.includes("My Story"))).toBeInTheDocument();
    expect(getByText('The Polymath\'s Journey')).toBeInTheDocument();
  });

  it('renders core values section', () => {
    const { getByText } = render(<About />);
    expect(getByText('Core Values & Approach')).toBeInTheDocument();
    expect(getByText('Strategic Thinking')).toBeInTheDocument();
    expect(getByText('Technical Innovation')).toBeInTheDocument();
    expect(getByText('Community Leadership')).toBeInTheDocument();
    expect(getByText('Continuous Learning')).toBeInTheDocument();
  });

  it('displays personal story content', () => {
    const { getByText } = render(<About />);
    expect(getByText(/I'm a technology enthusiast/)).toBeInTheDocument();
    expect(getByText(/My journey spans across AI\/ML development/)).toBeInTheDocument();
  });

  it('includes philosophical quote', () => {
    const { getByText } = render(<About />);
    expect(getByText(/Technology should amplify human potential/)).toBeInTheDocument();
    expect(getByText('- Ayush Rai')).toBeInTheDocument();
  });

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
