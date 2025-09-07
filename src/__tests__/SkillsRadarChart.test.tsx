import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SkillsRadarChart from '../components/SkillsRadarChart';

// Mock Chart.js
vi.mock('chart.js', () => {
  const Chart = vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
  }));
  
  Chart.register = vi.fn();
  
  return {
    __esModule: true,
    default: Chart,
    Chart,
  };
});

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Radar: () => <div data-testid="radar-chart">Radar Chart</div>,
}));

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('SkillsRadarChart', () => {
  it('renders the component', () => {
    render(<SkillsRadarChart />);
    expect(screen.getByText('Skills Overview Radar')).toBeInTheDocument();
  });

  it('displays key stats', () => {
    render(<SkillsRadarChart />);
    expect(screen.getByText('18+')).toBeInTheDocument();
    expect(screen.getByText('Skills Mastered')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Problem Solving')).toBeInTheDocument();
  });

  it('shows skills insights section', () => {
    render(<SkillsRadarChart />);
    expect(screen.getByText('Skills Insights')).toBeInTheDocument();
    expect(screen.getByText('Strong foundation across both technical and leadership domains')).toBeInTheDocument();
  });

  it('renders chart explanation sections', () => {
    render(<SkillsRadarChart />);
    expect(screen.getByText('Technical Proficiency')).toBeInTheDocument();
    expect(screen.getByText('Leadership & Strategic')).toBeInTheDocument();
  });

  it('renders the radar chart', () => {
    render(<SkillsRadarChart />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });
});
