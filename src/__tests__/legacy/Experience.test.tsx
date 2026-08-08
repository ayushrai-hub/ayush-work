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
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Professional Experience');
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
    // UiPath appears as both company and technology, so expect 2 instances
    expect(screen.getAllByText('UiPath')).toHaveLength(2);
    // Salesforce appears as both company and technology, so expect 2 instances
    expect(screen.getAllByText('Salesforce')).toHaveLength(2);
    expect(screen.getByText('Kanha House, IITM')).toBeInTheDocument();
  });

  it('shows location and duration for each experience', () => {
    render(<Experience />);
    // Remote appears in 4 experiences
    expect(screen.getAllByText('Remote')).toHaveLength(4);
    expect(screen.getByText('Apr 2024 - Present')).toBeInTheDocument();
    expect(screen.getByText('Aug 2025 - Present')).toBeInTheDocument();
    // Chennai, India appears in 2 experiences
    expect(screen.getAllByText('Chennai, India')).toHaveLength(2);
  });

  it('displays job types with correct styling', () => {
    render(<Experience />);
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    // Part-time appears in 2 experiences
    expect(screen.getAllByText('Part-time')).toHaveLength(2);
    expect(screen.getByText('Leadership Internship')).toBeInTheDocument();
    expect(screen.getAllByText('Internship')).toHaveLength(2);
  });

  it('renders technology tags', () => {
    render(<Experience />);
    // Python appears in 2 experiences, so we expect exactly 2 instances
    expect(screen.getAllByText('Python')).toHaveLength(2);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    // UiPath is tested in company names test
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
    expect(screen.getByText('2+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
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
    const { container } = render(<Experience />);
    const cards = container.querySelectorAll('.card');
    expect(cards.length).toBe(10); // 6 experience cards + 4 metric cards
  });
});
