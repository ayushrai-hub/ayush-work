import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Hero />);
    expect(container).toBeInTheDocument();
  });

  it('displays the name Ayush Rai', () => {
    const { getByText } = render(<Hero />);
    expect(getByText(/Hi, I'm/)).toBeInTheDocument();
    expect(getByText('Ayush Rai')).toBeInTheDocument();
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
    render(<Hero />);
    // Check the labels
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('Companies Worked')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
    expect(screen.getByText('Leadership Roles')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();
  });

  it('shows status badges', () => {
    render(<Hero />);

    // Check for the status badge text (including emojis as they appear in the component)
    expect(screen.getByText('🟢 Available for Freelance Projects')).toBeInTheDocument();
    expect(screen.getByText('🔵 Open to Full-time Opportunities')).toBeInTheDocument();
    expect(screen.getByText('🟡 Actively Learning: Advanced AI/ML')).toBeInTheDocument();
  });

  it('has accessible markup for main heading', () => {
    const { getByRole } = render(<Hero />);
    const mainHeading = getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Hi, I\'m Ayush Rai');
  });
});
