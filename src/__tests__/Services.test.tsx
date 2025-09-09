import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { vi } from 'vitest';
import Services from '../components/Services';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('Services', () => {
  it('renders the services section heading', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { name: /Services.*Solutions/i })).toBeInTheDocument();
    expect(screen.getByText('Comprehensive technical and strategic solutions for your business needs')).toBeInTheDocument();
  });

  it('renders all service titles', () => {
    render(<Services />);
    expect(screen.getByText('AI & Machine Learning Development')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Web Development')).toBeInTheDocument();
    expect(screen.getByText('Data Science & Analytics')).toBeInTheDocument();
    expect(screen.getByText('Community Management & Strategy')).toBeInTheDocument();
    expect(screen.getByText('Technical Consultation & Training')).toBeInTheDocument();
    expect(screen.getByText('Rapid Prototyping & MVP')).toBeInTheDocument();
  });

  it('displays pricing and duration', () => {
    render(<Services />);
    expect(screen.getByText('Starting at $2000')).toBeInTheDocument();
    expect(screen.getByText('Starting at $1500')).toBeInTheDocument();
    expect(screen.getByText('2-8 weeks')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('shows service categories', () => {
    render(<Services />);
    expect(screen.getAllByText('Technical').length).toBeGreaterThan(0);
    expect(screen.getByText('Strategic')).toBeInTheDocument();
    expect(screen.getByText('Consultation')).toBeInTheDocument();
  });

  it('renders features for each service', () => {
    render(<Services />);
    expect(screen.getByText('Custom AI model development')).toBeInTheDocument();
    expect(screen.getByText('React/TypeScript applications')).toBeInTheDocument();
    expect(screen.getByText('Community strategy development')).toBeInTheDocument();
  });

  it('renders the Why Choose Me section', () => {
    render(<Services />);
    expect(screen.getByText('Why Choose My Services')).toBeInTheDocument();
    expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
    expect(screen.getByText('Premium Quality')).toBeInTheDocument();
    expect(screen.getByText('Dedicated Support')).toBeInTheDocument();
    expect(screen.getByText('Innovation Focus')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    const { container } = render(<Services />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
