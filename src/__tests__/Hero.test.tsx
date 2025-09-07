import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Hero />);
    expect(container).toBeInTheDocument();
  });

  it('displays the name Ayush Rai', () => {
    const { getByText } = render(<Hero />);
    expect(getByText('Hi, I\'m Ayush Rai')).toBeInTheDocument();
  });

  it('shows initial headline', () => {
    const { getByText } = render(<Hero />);
    expect(getByText('SDE - AI Engineer | Generative AI Specialist')).toBeInTheDocument();
  });

  it('displays contact links', () => {
    const { container } = render(<Hero />);
    const emailLink = container.querySelector('a[href="mailto:ayushrai0211@gmail.com"]');
    const phoneLink = container.querySelector('a[href="tel:+917440567944"]');
    const githubLink = container.querySelector('a[href="https://github.com/ayushrai-hub"]');
    const linkedinLink = container.querySelector('a[href="https://linkedin.com/in/ayushrai02"]');

    expect(emailLink).toBeInTheDocument();
    expect(phoneLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
  });

  it('shows call-to-action buttons', () => {
    const { getByText } = render(<Hero />);
    expect(getByText('Let\'s Work Together')).toBeInTheDocument();
    expect(getByText('View My Work')).toBeInTheDocument();
  });

  it('displays statistics', () => {
    const { getAllByText } = render(<Hero />);
    expect(getAllByText('+')).toBeTruthy(); // suffixes
    // Since CountUp is mocked, check the labels
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('Degrees in Progress')).toBeInTheDocument();
  });

  it('shows status badges', () => {
    render(<Hero />);
    
    // Use a function to find text that might be split across elements
    const statusBadge1 = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === 'Available for Freelance Projects';
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        child => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    
    const statusBadge2 = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === 'Open to Full-time Opportunities';
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        child => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    
    const statusBadge3 = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === 'Actively Learning: Advanced AI/ML';
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        child => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    });
    
    expect(statusBadge1).toBeInTheDocument();
    expect(statusBadge2).toBeInTheDocument();
    expect(statusBadge3).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Hero />);
    const mainHeading = getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Hi, I\'m Ayush Rai');
  });
});
