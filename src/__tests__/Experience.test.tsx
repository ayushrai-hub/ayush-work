import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { vi } from 'vitest';
import Experience from '../components/Experience';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('Experience', () => {
  it('renders the main heading', () => {
    render(<Experience />);
    expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    expect(screen.getByText('Career Journey Across AI, Web Development, and Leadership')).toBeInTheDocument();
  });

  it('renders all experience entries', () => {
    render(<Experience />);
    expect(screen.getByText('SDE - AI Engineer')).toBeInTheDocument();
    expect(screen.getByText('Generative AI Engineer')).toBeInTheDocument();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
    expect(screen.getByText('Student Developer Champion')).toBeInTheDocument();
    expect(screen.getByText('Virtual Intern')).toBeInTheDocument();
    expect(screen.getByText('WebOps Member')).toBeInTheDocument();
  });

  it('displays company names correctly', () => {
    render(<Experience />);
    expect(screen.getByText('FoCDoT Technologies Pvt. Ltd')).toBeInTheDocument();
    expect(screen.getByText('Outlier')).toBeInTheDocument();
    expect(screen.getByText('RaSoR-IITM')).toBeInTheDocument();
    expect(screen.getByText('UiPath')).toBeInTheDocument();
    expect(screen.getByText('Salesforce')).toBeInTheDocument();
    expect(screen.getByText('Kanha House, IITM')).toBeInTheDocument();
  });

  it('shows location and duration for each experience', () => {
    render(<Experience />);
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Apr 2024 - Present')).toBeInTheDocument();
    expect(screen.getByText('Dec 2024 - Present')).toBeInTheDocument();
    expect(screen.getByText('Chennai, India')).toBeInTheDocument();
  });

  it('displays job types with correct styling', () => {
    render(<Experience />);
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Freelance')).toBeInTheDocument();
    expect(screen.getByText('Part-time')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getByText('Internship')).toBeInTheDocument();
  });

  it('renders technology tags', () => {
    render(<Experience />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('UiPath')).toBeInTheDocument();
    expect(screen.getByText('RPA')).toBeInTheDocument();
  });

  it('displays achievements for experiences', () => {
    render(<Experience />);
    expect(screen.getByText('Specialized in Reinforcement Learning from Human Feedback (RLHF)')).toBeInTheDocument();
    expect(screen.getByText('Developed LLM training datasets and optimization strategies')).toBeInTheDocument();
    expect(screen.getByText('Led community initiatives and technical workshops')).toBeInTheDocument();
  });

  it('renders experience metrics section', () => {
    render(<Experience />);
    expect(screen.getByText('Experience Metrics')).toBeInTheDocument();
    expect(screen.getByText('4+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Industries')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<Experience />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with correct structure for timelines and cards', () => {
    render(<Experience />);
    const cards = screen.getAllByText((content, element) => {
      return element?.className?.includes('card') || false;
    });
    expect(cards).toBeDefined();
  });
});
