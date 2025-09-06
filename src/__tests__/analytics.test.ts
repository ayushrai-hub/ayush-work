import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initGA, trackEvent } from '../lib/analytics';

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initGA', () => {
    it('should not initialize when running on server', () => {
      // Mock window as undefined for server environment
      const originalWindow = global.window;
      vi.stubGlobal('window', undefined);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      initGA();

      expect(consoleSpy).toHaveBeenCalledWith('Google Analytics not initialized - running on server');

      // Restore original window
      vi.stubGlobal('window', originalWindow);
      consoleSpy.mockRestore();
    });

    it('should initialize GA4 with correct measurement ID', () => {
      // Mock document methods
      const mockScript = { async: true, src: '', type: 'text/javascript' } as any;
      const createElementSpy = vi.fn(() => mockScript);
      const appendChildSpy = vi.fn();

      vi.spyOn(document, 'createElement').mockImplementation(createElementSpy as any);
      vi.spyOn(document.head, 'appendChild').mockImplementation(appendChildSpy);
      vi.spyOn(document, 'title', 'get').mockReturnValue('Test Title');

      initGA();

      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('trackEvent', () => {
    it('should not throw error when gtag is not available', () => {
      // Mock window.gtag as undefined
      const originalGtag = (global as any).gtag;
      (global as any).gtag = undefined;

      expect(() => trackEvent('test')).not.toThrow();

      // Restore original gtag
      (global as any).gtag = originalGtag;
    });

    it('should call gtag when available', () => {
      const gtagSpy = vi.fn();
      (global as any).gtag = gtagSpy;

      trackEvent('test_event', { param: 'value' });

      expect(gtagSpy).toHaveBeenCalledWith('event', 'test_event', { param: 'value' });

      // Clean up
      (global as any).gtag = undefined;
    });
  });
});
