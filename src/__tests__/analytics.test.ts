/**
 * Unit tests for the Google Analytics 4 helpers in src/lib/analytics.ts.
 *
 * initGA: logs and returns early when `window` is undefined, and otherwise
 * creates and appends two scripts (the gtag.js loader and the inline config).
 * trackEvent: is a no-op without a global `gtag`, and forwards
 * ('event', name, params) to it when present.
 *
 * The browser case spies on document.createElement and document.head.appendChild
 * so no real script tags are added.
 *
 * Connects to:
 * - src/lib/analytics.ts (initGA, trackEvent)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initGA, trackEvent } from '../lib/analytics';

// Google Analytics gtag function type
interface GtagFunction {
  (...args: unknown[]): void;
}

// Declare global gtag property
declare global {
  var gtag: GtagFunction | undefined;
}

/** GA4 helper behaviour with and without a browser environment and gtag global. */
describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /** Server guard and script injection. */
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
      const mockScript = { async: true, src: '', type: 'text/javascript' } as HTMLScriptElement;
      const createElementSpy = vi.fn(() => mockScript);
      const appendChildSpy = vi.fn();

      vi.spyOn(document, 'createElement').mockImplementation(createElementSpy);
      vi.spyOn(document.head, 'appendChild').mockImplementation(appendChildSpy);
      vi.spyOn(document, 'title', 'get').mockReturnValue('Test Title');

      initGA();

      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalledTimes(2);
    });
  });

  /** Safe no-op without gtag, and argument forwarding with it. */
  describe('trackEvent', () => {
    it('should not throw error when gtag is not available', () => {
      // Mock window.gtag as undefined
      const originalGtag = global.gtag;
      global.gtag = undefined;

      expect(() => trackEvent('test')).not.toThrow();

      // Restore original gtag
      global.gtag = originalGtag;
    });

    it('should call gtag when available', () => {
      const gtagSpy: GtagFunction = vi.fn();
      global.gtag = gtagSpy;

      trackEvent('test_event', { param: 'value' });

      expect(gtagSpy).toHaveBeenCalledWith('event', 'test_event', { param: 'value' });

      // Clean up
      global.gtag = undefined;
    });
  });
});
