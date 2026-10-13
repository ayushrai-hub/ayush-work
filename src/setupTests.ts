/**
 * Vitest setup file: runs before every test file to add matchers and mock the few libraries the
 * live site uses that are awkward under test.
 *
 * Registered in vite.config.ts as `test.setupFiles`. Most suites run in jsdom; a suite can opt into
 * the node environment with `// @vitest-environment node` (publicOutput.test.ts does, to match the
 * prerender), so browser-only shims are guarded by `typeof window`.
 *
 * Connects to:
 * - vite.config.ts (test.setupFiles); every suite in src/__tests__
 * - @testing-library/jest-dom and jest-axe matchers (toBeInTheDocument, toHaveNoViolations)
 */
import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import "jest-axe/extend-expect";

// Helmet and HelmetProvider become pass-throughs, so <title>, <meta>, and <link> from PageSEO and
// AgentView render inline into the test DOM, where tests query them with document.querySelector.
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: React.PropsWithChildren) => children,
  HelmetProvider: ({ children }: React.PropsWithChildren) => children,
}));

// Prevents real email sends from src/lib/server/contactEmail.ts. contactEmail.test.ts declares its
// own @sendgrid/mail mock with spies it asserts on.
vi.mock("@sendgrid/mail", () => ({
  setApiKey: vi.fn(),
  send: vi.fn().mockResolvedValue({}),
}));

if (typeof window !== "undefined") {
  // jsdom has no matchMedia. Every query reports matches: false (no reduced motion, light scheme).
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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

  // jsdom implements neither; ScrollManager calls them after every navigation. Suites that assert
  // on scrolling replace these with spies.
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
}
