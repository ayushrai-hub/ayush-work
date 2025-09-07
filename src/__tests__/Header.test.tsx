import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
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
    render(<Header />);
    expect(screen.getByText('Ayush Rai')).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(<Header />);
    const logo = screen.getByText('Ayush Rai');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('gradient-text');
  });

  it('renders navigation menu items', () => {
    render(<Header />);
    
    const menuItems = [
      'Home',
      'About',
      'Education',
      'Experience',
      'Skills',
      'Projects',
      'Services',
      'Contact'
    ];
    
    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('has accessible navigation', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Check if all links are accessible
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Check if each link has an href attribute
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^#/);
    });
  });
  
  it('shows mobile menu button on small screens', () => {
    // Set small screen size
    window.innerWidth = 600;
    
    render(<Header />);
    
    // Menu button should be visible on mobile
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
  
  it('adds background when scrolled', () => {
    // Mock scroll position
    window.scrollY = 100;
    
    // Trigger scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-primary-dark/95');
    expect(header).toHaveClass('backdrop-blur-md');
    expect(header).toHaveClass('shadow-lg');
  });
});
