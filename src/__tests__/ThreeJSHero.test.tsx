import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock React's lazy and Suspense before importing ThreeJSHero
vi.mock('react', async () => {
  const actualReact = await vi.importActual('react');
  return {
    ...actualReact,
    Suspense: ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) =>
      children || fallback || null,
    lazy: vi.fn(() => {
      return () => null;
    }),
  };
});

// Mock ThreeJSContent before importing ThreeJSHero
vi.mock('../components/ThreeJSContent', () => ({
  ThreeJSContent: () => null,
}));

import ThreeJSHero from '../components/ThreeJSHero';

// Mock component props interfaces
interface MockMotionProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface MockCanvasProps {
  children?: React.ReactNode;
}

interface MockFloatProps {
  children?: React.ReactNode;
}

interface MockPresentationControlsProps {
  children?: React.ReactNode;
}

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: MockMotionProps) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: MockMotionProps) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: MockMotionProps) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: MockMotionProps) => <button {...props}>{children}</button>,
  },
}));

// Mock three.js and react-three-fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: MockCanvasProps) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: {}, mouse: { x: 0, y: 0 } })),
}));

// Mock React's Suspense and lazy
vi.mock('react', async () => {
  const actualReact = await vi.importActual('react');
  return {
    ...actualReact,
    Suspense: ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) =>
      children || fallback || null,
    lazy: vi.fn(() => {
      return () => null;
    }),
  };
});

// Mock the isWebGLAvailable function
vi.mock('../components/ThreeJSHero', async () => {
  const actual = await vi.importActual('../components/ThreeJSHero');
  return {
    ...actual,
    isWebGLAvailable: vi.fn(() => false),
  };
});

vi.mock('@react-three/drei', () => ({
  Sphere: vi.fn(() => null),
  Box: vi.fn(() => null),
  Octahedron: vi.fn(() => null),
  Float: vi.fn(({ children }: MockFloatProps) => children),
  MeshDistortMaterial: vi.fn(() => null),
  PresentationControls: vi.fn(({ children }: MockPresentationControlsProps) => children),
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
