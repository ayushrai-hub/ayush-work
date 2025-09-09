import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import "jest-axe/extend-expect";

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

(HTMLCanvasElement.prototype as any).getContext = mockGetContext;

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
    })
  };
});

// Mock React Helmet
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: any) => children,
  HelmetProvider: ({ children }: any) => children,
}));

// Mock lucide-react icons
const createIconMock = (name: string) => {
  return ({ className, ...props }: { className?: string; [key: string]: any }) => {
    const testId = `${name.toLowerCase()}-icon`;
    return React.createElement('div', {
      'data-testid': testId,
      className,
      ...props,
    }, `${name}Icon`);
  };
};

// Mock all lucide-react icons used in the application
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Mail: createIconMock('Mail'),
    Phone: createIconMock('Phone'),
    Github: createIconMock('Github'),
    Linkedin: createIconMock('Linkedin'),
    Calendar: createIconMock('Calendar'),
    Code: createIconMock('Code'),
    Users: createIconMock('Users'),
    TrendingUp: createIconMock('TrendingUp'),
    Mic: createIconMock('Mic'),
    FileText: createIconMock('FileText'),
    // Add other icons as needed
  };
});

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const img = document.createElement('img');
    Object.assign(img, props);
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
  const motionComponents = (actual as any).motion || {};
  return {
    ...actual,
    motion: {
      ...Object.entries(motionComponents).reduce((acc: any, [key, value]: [string, any]) => {
        if (typeof value === 'string') {
          acc[key] = ({ children, ...props }: any) => React.createElement(value, props, children);
        }
        return acc;
      }, {}),
      div: ({ children, ...props }: any) => React.createElement('div', props, children),
      section: ({ children, ...props }: any) => React.createElement('section', props, children),
      // Add other motion components as needed
    },
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
  default: vi.fn(({ end }: any) => end?.toString() || "0"),
}));

// Mock @sendgrid/mail for API tests
vi.mock("@sendgrid/mail", () => ({
  setApiKey: vi.fn(),
  send: vi.fn().mockResolvedValue({}),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 16) as any;
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id as any);
});
