/**
 * Legacy tests for the old canvas ParticleBackground (canvas element, size, 2d context, resize listener cleanup).
 *
 * Fixes the window size to 1024x768 and stubs requestAnimationFrame so the
 * animation loop never advances, then checks the `particle-canvas` test id, the
 * canvas width and height attributes, the getContext('2d') call, and that the
 * resize listener is added and removed. The component never calls
 * cancelAnimationFrame, so that stub is unused.
 *
 * Legacy: this file never runs. vite.config.ts excludes src/__tests__/legacy/** from
 * Vitest and tsconfig.app.json excludes it from type checking. The
 * '../components/backgrounds/ParticleBackground' import resolves under src/__tests__/,
 * where it does not exist; the component is src/components/backgrounds/ParticleBackground.tsx,
 * itself unused by the current site. Assertions have not been re-checked against the component.
 *
 * Connects to:
 * - src/components/backgrounds/ParticleBackground.tsx (intended target)
 */
import { render, screen, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import ParticleBackground from '../components/backgrounds/ParticleBackground';

/** Canvas setup and resize-listener lifecycle. */
describe('ParticleBackground', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
    
    global.requestAnimationFrame = vi.fn(() => 1);
    
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
    
    // Replaces the prototype method for the rest of the file; it is not restored.
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

    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
    window.dispatchEvent(new Event('resize'));

    unmount();

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<ParticleBackground />);
    
    // Read from the remove spy before unmount, so this is normally undefined and the
    // identity check below is skipped; it never compares against the added handler.
    const resizeHandler = removeEventListenerSpy.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    if (resizeHandler) {
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', resizeHandler);
    }
    
    removeEventListenerSpy.mockRestore();
  });
});
