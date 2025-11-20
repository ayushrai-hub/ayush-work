import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import "jest-axe/extend-expect";

// Type definitions for test mocks
interface MockCanvasContext {
  fillRect: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  getImageData: ReturnType<typeof vi.fn>;
  putImageData: ReturnType<typeof vi.fn>;
  createImageData: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  strokeRect: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  measureText: ReturnType<typeof vi.fn>;
  clip: ReturnType<typeof vi.fn>;
  canvas: HTMLCanvasElement;
  globalAlpha: number;
  globalCompositeOperation: GlobalCompositeOperation;
}



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

interface DreiProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface LucideIconProps {
  size?: number | string;
  color?: string;
  className?: string;
  [key: string]: unknown;
}

// Setup global mocks for jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
  writable: true,
  value: vi.fn(() => ({
    getPropertyValue: (prop: string) => (prop === "font-size" ? "16px" : ""),
  })),
});

// Mock HTMLElement method for testing-library
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});

// Mock Canvas for Chart.js
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

// Mock chart.js with proper scale registration
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
  (ChartClass as any).register = vi.fn();

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

// Mock React Helmet
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: React.PropsWithChildren) => children,
  HelmetProvider: ({ children }: React.PropsWithChildren) => children,
}));



// Mock lucide-react icons with partial mock using importOriginal
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

// Mock next/image
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

// Mock IntersectionObserver
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

// Mock window.matchMedia
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

// Mock ResizeObserver
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserver;
global.ResizeObserver = ResizeObserver;

// Mock framer-motion with proper React component forwarding
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

// Mock react-intersection-observer
vi.mock('react-intersection-observer', () => ({
  useInView: () => [null, true], // [ref, inView]
}));

// Mock intersection observer
// vi.mock("react-intersection-observer", () => ({
//   useInView: vi.fn(() => [vi.fn(), true]),
// }));

// Mock react-countup
vi.mock("react-countup", () => ({
  __esModule: true,
  default: vi.fn(({ end }: { end?: number }) => end?.toString() || "0"),
}));

// Mock @sendgrid/mail for API tests
vi.mock("@sendgrid/mail", () => ({
  setApiKey: vi.fn(),
  send: vi.fn().mockResolvedValue({}),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 16) as unknown as number;
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id as unknown as NodeJS.Timeout);
});

// Mock Three.js
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

// Mock @react-three/fiber
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
  ambientLight: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'ambient-light', ...props }, children),
  directionalLight: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'directional-light', ...props }, children),
  pointLight: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'point-light', ...props }, children),
  group: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
  meshStandardMaterial: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'mesh-standard-material', ...props }, children),
}));

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  __esModule: true,
  Sphere: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'sphere', ...props }, children),
  Box: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'box', ...props }, children),
  Octahedron: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'octahedron', ...props }, children),
  Float: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'float', ...props }, children),
  MeshDistortMaterial: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'mesh-distort-material', ...props }, children),
  PresentationControls: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'presentation-controls', ...props }, children),
}));
