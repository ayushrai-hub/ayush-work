import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ThreeJSHero from '../components/ThreeJSHero';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock three.js and react-three-fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: {}, mouse: { x: 0, y: 0 } })),
}));

vi.mock('@react-three/drei', () => ({
  Sphere: vi.fn(() => null),
  Box: vi.fn(() => null),
  Octahedron: vi.fn(() => null),
  Float: vi.fn(({ children }: any) => children),
  MeshDistortMaterial: vi.fn(() => null),
  PresentationControls: vi.fn(({ children }: any) => children),
}));

vi.mock('three', () => ({
  THREE: {
    MathUtils: { lerp: vi.fn() },
    Group: vi.fn(),
    Mesh: vi.fn(),
  },
}));

describe('ThreeJSHero', () => {
  it('renders the hero section', () => {
    render(<ThreeJSHero />);
    expect(screen.getByText('Ayush Rai')).toBeInTheDocument();
    expect(screen.getByText(/SDE - AI Engineer \| Generative AI Specialist/i)).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<ThreeJSHero />);
    expect(screen.getByText('View My Work')).toBeInTheDocument();
    expect(screen.getByText('Let\'s Connect')).toBeInTheDocument();
  });



  it('has correct section id', () => {
    const { container } = render(<ThreeJSHero />);
    expect(container.querySelector('#home')).toBeInTheDocument();
  });
});
