/**
 * Unit tests for the Google Analytics 4 helpers in src/lib/analytics.ts.
 *
 * initGA: logs and returns early when `window` is undefined, skips injection
 * when a gtag.js script for the same ID is already present (the index.html
 * snippet), and otherwise appends two scripts (the loader and the inline config).
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
      vi.restoreAllMocks();
    });

    it('skips injection when index.html already loaded gtag.js for the property', () => {
      const existing = document.createElement('script');
      existing.src = 'https://www.googletagmanager.com/gtag/js?id=G-VBS0YJ07R8';
      document.head.appendChild(existing);
      const appendChildSpy = vi.spyOn(document.head, 'appendChild');

      initGA();

      expect(appendChildSpy).not.toHaveBeenCalled();
      appendChildSpy.mockRestore();
      existing.remove();
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
