/**
 * Vitest setup file: runs before every test file to add matchers, fill jsdom gaps, and mock heavy UI libraries.
 *
 * Registered in vite.config.ts as `test.setupFiles: ['./src/setupTests.ts']`
 * (environment jsdom, globals on). Top-level `vi.mock` calls here apply to every
 * suite; a test file can override one with its own `vi.mock` (App.test.tsx
 * does this for framer-motion). Several mocks exist only for the legacy
 * components in src/components, whose tests in src/__tests__/legacy are
 * excluded from the run by vite.config.ts `test.exclude`.
 *
 * Connects to:
 * - vite.config.ts (test.setupFiles); every non-legacy suite in src/__tests__
 * - @testing-library/jest-dom and jest-axe matchers (toBeInTheDocument, toHaveNoViolations)
 */
import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import "jest-axe/extend-expect";

type MockProps = { children?: React.ReactNode; [key: string]: unknown };

interface MotionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface R3FProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface LucideIconProps {
  size?: number | string;
  color?: string;
  className?: string;
  [key: string]: unknown;
}

// jsdom has no ResizeObserver. This vi.fn version is replaced by the class
// version further down, which is the one tests actually see.
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Replaces getComputedStyle with a stub whose only member is getPropertyValue
// (font-size reads as 16px, everything else as ""). Code that reads other
// CSSStyleDeclaration properties gets undefined.
Object.defineProperty(window, "getComputedStyle", {
  writable: true,
  value: vi.fn(() => ({
    getPropertyValue: (prop: string) => (prop === "font-size" ? "16px" : ""),
  })),
});

// jsdom does not implement scrollIntoView; components that scroll to sections call it.
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});

// jsdom has no canvas implementation. getContext("2d") returns a stub with the
// drawing methods the legacy ParticleBackground uses; any other context type
// (including "webgl") returns null, so WebGL checks report it as unavailable.
const mockGetContext = vi.fn((contextType: string) => {
  if (contextType === "2d") {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      measureText: vi.fn(() => ({ width: 10 })),
      canvas: {} as HTMLCanvasElement,
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      clip: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  }
  return null;
});

// Properly type the mock getContext method
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: mockGetContext,
});

// chart.js is in package.json but nothing in src/, api/, or mcp/ imports it,
// so this mock currently has no effect.
vi.mock("chart.js", () => {
  // Registry mock
  const registry = {
    scales: new Map([
      ['linear', { id: 'linear' }],
      ['radialLinear', { id: 'radialLinear' }]
    ]),
    getScale: vi.fn((id: string) => {
      const scale = registry.scales.get(id);
      return scale || { id };
    }),
    register: vi.fn(),
    addScales: vi.fn(),
    add: vi.fn()
  };

  const ChartClass = vi.fn().mockImplementation(() => ({
    update: vi.fn(),
    destroy: vi.fn(),
    resize: vi.fn(),
    getDatasetMeta: vi.fn(() => ({
      controller: { update: vi.fn() }
    })),
    render: vi.fn(),
    reset: vi.fn(),
    clear: vi.fn(),
    stop: vi.fn(),
    ensureScalesHaveIDs: vi.fn(),
    buildOrUpdateScales: vi.fn(),
    buildOrUpdateControllers: vi.fn(),
    resetElements: vi.fn(),
    updateControllers: vi.fn(),
    updateDatasets: vi.fn(),
    renderDatasets: vi.fn()
  }));

  // Add register method to Chart class
  (ChartClass as unknown as { register: unknown }).register = vi.fn();

  return {
    Chart: ChartClass,
    register: vi.fn(),
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(() => ({ id: 'linear' })),
    RadialLinearScale: vi.fn(() => ({ id: 'radialLinear' })),
    PointElement: vi.fn(),
    LineElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
    Filler: vi.fn(),
    RadarController: vi.fn(),
    ArcElement: vi.fn(),
    BarController: vi.fn(),
    BarElement: vi.fn(),
    // Registry with proper scale access
    Registry: registry,
    _adapters: {},
    defaults: {},
    // Make sure scales are available
    scales: registry.scales,
    getScale: vi.fn((id: string) => {
      return registry.getScale(id);
    }),
    // Export individual scale classes
    RadialLinear: vi.fn(() => ({ id: 'radialLinear' })),
  };
});

// Helmet and HelmetProvider become pass-throughs, so <title>, <meta>, and
// <link> from PageSEO and AgentView render inline into the test DOM. Tests
// such as flagshipProducts.test.tsx query those tags with document.querySelector.
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: React.PropsWithChildren) => children,
  HelmetProvider: ({ children }: React.PropsWithChildren) => children,
}));



// Real lucide icons are kept when the export exists. Any other capitalised
// name that is accessed returns a stub `<div data-testid="<name>-icon">`, so a
// missing icon renders a stub instead of crashing the render.
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const createIconMock = (name: string) => {
    return (props: LucideIconProps) => {
      const { className, ...otherProps } = props;
      const testId = `${name.toLowerCase()}-icon`;
      return React.createElement('div', {
        'data-testid': testId,
        className,
        ...otherProps,
      });
    };
  };

  return new Proxy(actual as Record<string, unknown>, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target) {
        return target[prop];
      }
      // Auto-mock any icon component
      if (typeof prop === 'string' && /^[A-Z]/.test(prop)) {
        return createIconMock(prop);
      }
      return undefined;
    }
  });
});

// next is not a dependency of this Vite app and nothing imports next/image;
// this mock is left over and has no effect.
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const img = document.createElement('img');
    // Safely assign properties that exist on HTMLImageElement
    if (typeof props.src === 'string') img.src = props.src;
    if (typeof props.alt === 'string') img.alt = props.alt;
    if (typeof props.width === 'number') img.width = props.width;
    if (typeof props.height === 'number') img.height = props.height;
    return img;
  },
}));

// jsdom has no IntersectionObserver. This inert class never fires callbacks;
// components using react-intersection-observer get the module mock below instead.
class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// jsdom has no matchMedia. Every query reports matches: false (for example,
// prefers-reduced-motion and prefers-color-scheme are both "no").
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// The effective ResizeObserver stub: an inert class that never fires callbacks.
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserver;
global.ResizeObserver = ResizeObserver;

// framer-motion is used only by the legacy components. `motion.<tag>` becomes
// the plain element with every prop forwarded (animation props therefore reach
// the DOM and may trigger unknown-prop warnings), and AnimatePresence renders
// its children directly, so content is visible immediately with no animation.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');

  // Create motion component factory
  const createMotionComponent = (elementType: string) => {
    return ({ children, ...props }: MotionProps) => React.createElement(elementType, props, children);
  };

  // Create motion object with common HTML elements
  const motion = {
    div: createMotionComponent('div'),
    button: createMotionComponent('button'),
    header: createMotionComponent('header'),
    nav: createMotionComponent('nav'),
    ul: createMotionComponent('ul'),
    li: createMotionComponent('li'),
    a: createMotionComponent('a'),
    span: createMotionComponent('span'),
    p: createMotionComponent('p'),
    h1: createMotionComponent('h1'),
    h2: createMotionComponent('h2'),
    h3: createMotionComponent('h3'),
    h4: createMotionComponent('h4'),
    img: createMotionComponent('img'),
    section: createMotionComponent('section'),
    article: createMotionComponent('article'),
    main: createMotionComponent('main'),
    aside: createMotionComponent('aside'),
    footer: createMotionComponent('footer'),
  };

  // Add Proxy for dynamic property access
  const motionProxy = new Proxy(motion, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target) {
        return target[prop as keyof typeof target];
      }
      // For any other property, create a generic div component
      return createMotionComponent(prop as string);
    }
  });

  return {
    ...(actual as Record<string, unknown>),
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

// useInView always returns [null ref, inView = true], so legacy sections that
// gate content on visibility render it immediately.
vi.mock('react-intersection-observer', () => ({
  useInView: () => [null, true], // [ref, inView]
}));

// CountUp renders its final `end` value as text with no animation (legacy Hero, Experience, Projects).
vi.mock("react-countup", () => ({
  __esModule: true,
  default: vi.fn(({ end }: { end?: number }) => end?.toString() || "0"),
}));

// Prevents real email sends from src/lib/server/contactEmail.ts. Its suite,
// contactEmail.test.ts, also declares its own @sendgrid/mail mock with spies it asserts on.
vi.mock("@sendgrid/mail", () => ({
  setApiKey: vi.fn(),
  send: vi.fn().mockResolvedValue({}),
}));

// Animation frames run on a 16ms setTimeout so loops (such as the legacy
// ParticleBackground) progress under fake or real timers.
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 16) as unknown as number;
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id as unknown as NodeJS.Timeout);
});

// three, @react-three/fiber, and @react-three/drei are used only by the legacy
// src/components/backgrounds/ThreeJSContent.tsx; jsdom has no WebGL. Constructors
// are inert vi.fn()s, and scene components render as <div data-testid="...">.
vi.mock('three', () => ({
  __esModule: true,
  default: {
    MathUtils: {
      lerp: vi.fn((start, end, alpha) => start + (end - start) * alpha),
    },
    Group: vi.fn(),
    SphereGeometry: vi.fn(),
    BoxGeometry: vi.fn(),
    OctahedronGeometry: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    MeshDistortMaterial: vi.fn(),
    AmbientLight: vi.fn(),
    DirectionalLight: vi.fn(),
    PointLight: vi.fn(),
    PerspectiveCamera: vi.fn(),
    WebGLRenderer: vi.fn(),
    Scene: vi.fn(),
    Clock: vi.fn(() => ({
      elapsedTime: 0,
      getElapsedTime: vi.fn(() => 0),
    })),
  },
  MathUtils: {
    lerp: vi.fn((start, end, alpha) => start + (end - start) * alpha),
  },
  Group: vi.fn(),
  SphereGeometry: vi.fn(),
  BoxGeometry: vi.fn(),
  OctahedronGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  MeshDistortMaterial: vi.fn(),
  AmbientLight: vi.fn(),
  DirectionalLight: vi.fn(),
  PointLight: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(),
  Scene: vi.fn(),
  Clock: vi.fn(() => ({
    elapsedTime: 0,
    getElapsedTime: vi.fn(() => 0),
  })),
}));

// Canvas renders as <div data-testid="canvas">; useFrame never runs its callback.
vi.mock('@react-three/fiber', () => ({
  __esModule: true,
  Canvas: ({ children, ...props }: R3FProps) => React.createElement('div', { 'data-testid': 'canvas', ...props }, children),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { x: 0, y: 0, z: 5 },
      lookAt: vi.fn(),
    },
    mouse: { x: 0, y: 0 },
  })),
  extend: vi.fn(),
  // Add lowercase elements that might be used
  ambientLight: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'ambient-light', ...props }, children),
  directionalLight: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'directional-light', ...props }, children),
  pointLight: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'point-light', ...props }, children),
  group: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
  meshStandardMaterial: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'mesh-standard-material', ...props }, children),
}));

// Each drei helper used by ThreeJSContent renders as a <div> with a matching data-testid.
vi.mock('@react-three/drei', () => ({
  __esModule: true,
  Sphere: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'sphere', ...props }, children),
  Box: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'box', ...props }, children),
  Octahedron: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'octahedron', ...props }, children),
  Float: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'float', ...props }, children),
  MeshDistortMaterial: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'mesh-distort-material', ...props }, children),
  PresentationControls: ({ children, ...props }: MockProps) => React.createElement('div', { 'data-testid': 'presentation-controls', ...props }, children),
}));
