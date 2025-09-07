import { render, screen, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import ParticleBackground from '../components/ParticleBackground';

describe('ParticleBackground', () => {
  beforeEach(() => {
    // Mock window properties
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
    
    // Mock requestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      return setTimeout(cb, 0);
    });
    
    global.cancelAnimationFrame = vi.fn((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders a canvas element', () => {
    render(<ParticleBackground />);
    const canvas = screen.getByTestId('particle-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('sets up canvas with correct dimensions', () => {
    render(<ParticleBackground />);
    const canvas = screen.getByTestId('particle-canvas');
    expect(canvas).toHaveAttribute('width', '1024');
    expect(canvas).toHaveAttribute('height', '768');
  });

  it('calls getContext to get 2d rendering context', () => {
    const mockGetContext = vi.fn();
    
    // Mock the canvas getContext method
    HTMLCanvasElement.prototype.getContext = mockGetContext.mockImplementation(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    }));
    
    render(<ParticleBackground />);
    expect(mockGetContext).toHaveBeenCalledWith('2d');
  });

  it('handles window resize events', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<ParticleBackground />);
    
    // Simulate window resize
    window.innerWidth = 800;
    window.innerHeight = 600;
    window.dispatchEvent(new Event('resize'));
    
    // Cleanup
    unmount();
    
    // Verify event listeners were added and removed
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    // Clean up spies
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<ParticleBackground />);
    
    // Get the resize handler that was added
    const resizeHandler = removeEventListenerSpy.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];
    
    // Unmount the component
    unmount();
    
    // Verify the resize event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    // If we found the handler, verify it was the same one that was added
    if (resizeHandler) {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', resizeHandler);
    }
    
    // Clean up spy
    removeEventListenerSpy.mockRestore();
  });
});
