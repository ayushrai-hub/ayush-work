/**
 * Legacy tests for the old ThreeJSHero section (name, headline, CTA labels, `#home` id).
 *
 * Mocks React's lazy/Suspense, framer-motion, @react-three/fiber, drei, three, the
 * ThreeJSContent module, and ThreeJSHero itself, so only the text overlay is
 * checked. Several mocks do not line up with the component:
 * - 'react' is mocked twice with identical factories.
 * - The 'react' mocks override the named `lazy` and `Suspense` exports, but
 *   ThreeJSHero calls `React.lazy` on the default import.
 * - The ThreeJSHero mock adds an `isWebGLAvailable` export, but the component keeps
 *   that function private, so the mock does not change its behaviour.
 * - The 'three' mock exports a `THREE` member, while ThreeJSContent uses
 *   `import * as THREE`; it is moot because ThreeJSContent is mocked too.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/backgrounds/...' paths resolve under src/__tests__/, where they do not
 * exist; the component is src/components/backgrounds/ThreeJSHero.tsx, itself unused by
 * the current site. Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/backgrounds/ThreeJSHero.tsx (intended target)
 * - src/components/backgrounds/ThreeJSContent.tsx (mocked out)
 */
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

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

vi.mock('../components/backgrounds/ThreeJSContent', () => ({
  ThreeJSContent: () => null,
}));

import ThreeJSHero from '../components/backgrounds/ThreeJSHero';

interface MockMotionProps {
  children?: React.ReactNode;
  [key: string]: unknown;
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

// Animation props such as `initial` and `animate` are spread onto plain DOM elements.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: MockMotionProps) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: MockMotionProps) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: MockMotionProps) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: MockMotionProps) => <button {...props}>{children}</button>,
  },
}));

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: MockCanvasProps) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: {}, mouse: { x: 0, y: 0 } })),
}));

// Duplicate of the 'react' mock at the top of the file.
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

// ThreeJSHero does not export isWebGLAvailable, so this extra export has no effect on the component.
vi.mock('../components/backgrounds/ThreeJSHero', async () => {
  const actual = await vi.importActual('../components/backgrounds/ThreeJSHero');
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

/** Text overlay and section id of ThreeJSHero with the 3D scene mocked out. */
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
