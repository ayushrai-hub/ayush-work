import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import { ThemeProvider } from '../contexts/ThemeContext';
import { vi } from 'vitest';

// Mock the motion component from framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    header: 'header',
    div: 'div',
    button: 'button',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">MenuIcon</div>,
  X: () => <div data-testid="close-icon">XIcon</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDownIcon</div>,
  Sun: () => <div data-testid="sun-icon">SunIcon</div>,
  Moon: () => <div data-testid="moon-icon">MoonIcon</div>,
  Monitor: () => <div data-testid="monitor-icon">MonitorIcon</div>,
}));

describe('Header Component', () => {
  const originalScrollY = window.scrollY;
  
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    
    // Mock window.innerWidth for responsive testing
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    
    // Mock matchMedia
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
    // Restore original scrollY
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

    // Check if navigation buttons are present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Check if Home button is present
    const homeButton = screen.getByText('Home');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.tagName).toBe('BUTTON');
  });

  it('shows mobile menu button on small screens', () => {
    // Set small screen size
    window.innerWidth = 600;

    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );

    // Menu button should be visible on mobile
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
