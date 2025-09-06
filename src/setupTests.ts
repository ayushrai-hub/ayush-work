import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup global mocks for jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn(() => ({
    getPropertyValue: (prop: string) => prop === 'font-size' ? '16px' : '',
  })),
});

// Mock HTMLElement method for testing-library
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: vi.fn(),
});

// Mock Canvas for Chart.js
HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
  if (contextType === '2d') {
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
    };
  }
  return null;
});

// Mock chart.js
vi.mock('chart.js', () => ({
  Chart: vi.fn().mockImplementation(() => ({
    update: vi.fn(),
    destroy: vi.fn(),
    resize: vi.fn(),
  })),
  register: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
  RadialLinearScale: vi.fn(),
  RadarController: vi.fn(),
  ArcElement: vi.fn(),
  BarController: vi.fn(),
  BarElement: vi.fn(),
}));

// Mock React Helmet
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => children,
  HelmetProvider: ({ children }: any) => children,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Home: () => 'HomeIcon',
  Mail: () => 'MailIcon',
  Phone: () => 'PhoneIcon',
  MapPin: () => 'MapPinIcon',
  ExternalLink: () => 'ExternalLinkIcon',
  Github: () => 'GithubIcon',
  Linkedin: () => 'LinkedinIcon',
  Twitter: () => 'TwitterIcon',
  CheckCircle: () => 'CheckCircleIcon',
  AlertCircle: () => 'AlertCircleIcon',
  Loader: () => 'LoaderIcon',
  Award: () => 'AwardIcon',
  Briefcase: () => 'BriefcaseIcon',
  GraduationCap: () => 'GraduationCapIcon',
  Star: () => 'StarIcon',
  TrendingUp: () => 'TrendingUpIcon',
  Users: () => 'UsersIcon',
  Calendar: () => 'CalendarIcon',
  ChevronLeft: () => 'ChevronLeftIcon',
  ChevronRight: () => 'ChevronRightIcon',
  BookOpen: () => 'BookOpenIcon',
  MessageCircle: () => 'MessageCircleIcon',
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }: any) => ({ type: 'div', props: { ...props, children } })),
    section: vi.fn(({ children, ...props }: any) => ({ type: 'section', props: { ...props, children } })),
    main: vi.fn(({ children, ...props }: any) => ({ type: 'main', props: { ...props, children } })),
    h1: vi.fn(({ children, ...props }: any) => ({ type: 'h1', props: { ...props, children } })),
    h2: vi.fn(({ children, ...props }: any) => ({ type: 'h2', props: { ...props, children } })),
    h3: vi.fn(({ children, ...props }: any) => ({ type: 'h3', props: { ...props, children } })),
    p: vi.fn(({ children, ...props }: any) => ({ type: 'p', props: { ...props, children } })),
    span: vi.fn(({ children, ...props }: any) => ({ type: 'span', props: { ...props, children } })),
    button: vi.fn(({ children, ...props }: any) => ({ type: 'button', props: { ...props, children } })),
    ul: vi.fn(({ children, ...props }: any) => ({ type: 'ul', props: { ...props, children } })),
    li: vi.fn(({ children, ...props }: any) => ({ type: 'li', props: { ...props, children } })),
    img: vi.fn((props: any) => ({ type: 'img', props })),
    a: vi.fn(({ children, ...props }: any) => ({ type: 'a', props: { ...props, children } })),
  },
  AnimatePresence: vi.fn(({ children }: any) => children),
  useInView: vi.fn(() => true),
}));

// Mock intersection observer
vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(() => [vi.fn(), true]),
}));

// Mock react-countup
vi.mock('react-countup', () => ({
  __esModule: true,
  default: vi.fn(({ end, duration }: any) => ({ type: 'span', props: { children: end } })),
}));
