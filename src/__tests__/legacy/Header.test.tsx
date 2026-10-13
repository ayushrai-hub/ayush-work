/**
 * Legacy tests for the old layout Header (logo, nav items, nav landmark, mobile menu button, initial classes).
 *
 * Renders <Header /> inside ThemeProvider and MemoryRouter with framer-motion
 * and lucide-react replaced by plain elements, and with window.scrollY,
 * innerWidth, and matchMedia stubbed per test. Setting innerWidth to 600 does not
 * hide anything in jsdom, so the mobile test only checks that a "menu" button
 * exists.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/layout/Header' and '../contexts/ThemeContext' imports resolve under
 * src/__tests__/, where neither exists; the targets are src/components/layout/Header.tsx
 * (unused by the current site, whose header is src/components/site/SiteHeader.tsx) and
 * src/contexts/ThemeContext.tsx. Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/layout/Header.tsx (intended target)
 * - src/contexts/ThemeContext.tsx
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ThemeProvider } from '../contexts/ThemeContext';
import { vi } from 'vitest';

// Motion elements become plain tags, so animation props are passed to the DOM unchanged.
vi.mock('framer-motion', () => ({
  motion: {
    header: 'header',
    div: 'div',
    button: 'button',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Header imports Menu, X, and ChevronDown; ThemeToggle imports Sun and Moon. Monitor is not imported by either.
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">MenuIcon</div>,
  X: () => <div data-testid="close-icon">XIcon</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDownIcon</div>,
  Sun: () => <div data-testid="sun-icon">SunIcon</div>,
  Moon: () => <div data-testid="moon-icon">MoonIcon</div>,
  Monitor: () => <div data-testid="monitor-icon">MonitorIcon</div>,
}));

/** Static structure of the legacy Header at the top of the page. */
describe('Header Component', () => {
  const originalScrollY = window.scrollY;
  
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    
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
  });
  
  afterEach(() => {
    window.scrollY = originalScrollY;
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    const logo = screen.getByAltText('Ayush Rai');
    expect(logo).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    const logo = screen.getByAltText('Ayush Rai');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('w-10', 'h-10', 'rounded-full');
  });

  it('renders navigation menu items', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    const menuItems = [
      'Home',
      'About Me',
      'Experience',
      'Projects',
      'Education',
      'Skills',
      'Work',
      'Contact'
    ];

    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('has accessible navigation', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    const homeButton = screen.getByText('Home');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.tagName).toBe('BUTTON');
  });

  it('shows mobile menu button on small screens', () => {
    window.innerWidth = 600;

    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('renders with correct initial styling', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'w-full', 'z-50');
    expect(header).toHaveClass('bg-transparent');
  });
});
