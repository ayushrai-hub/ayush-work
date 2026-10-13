/**
 * Smoke test that the full App renders the current SiteLayout shell at "/".
 *
 * Renders <App /> inside ThemeProvider and HelmetProvider, as src/main.tsx does,
 * and checks for a <main> landmark, the brand name, the "Remote" location from
 * src/content/person.ts, the footer's "continuously evolving" line from
 * src/components/site/SiteFooter.tsx, and that the old "Bhopal" location is gone.
 *
 * Mocks: GTMProvider becomes a pass-through; BrowserRouter (used inside
 * src/App.tsx) is swapped for MemoryRouter so the test starts at "/"; and
 * framer-motion is replaced locally, although the current App tree does not import it.
 *
 * Connects to:
 * - src/App.tsx, src/contexts/ThemeContext.tsx, src/components/site/*
 * - src/setupTests.ts (Helmet pass-through and other global mocks)
 */
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "../contexts/ThemeContext";
import App from "../App";
import { vi } from "vitest";
import React from "react";

vi.mock("../components/layout/GTMProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => {
      const { MemoryRouter } = actual as typeof import("react-router-dom");
      return React.createElement(MemoryRouter, null, children);
    },
  };
});

vi.mock("framer-motion", () => ({
  motion: {
    main: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => (
      <main {...props}>{children}</main>
    ),
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode;
    }) => <div {...props}>{children}</div>,
    section: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => (
      <section {...props}>{children}</section>
    ),
  },
  useReducedMotion: () => true,
}));

/** Renders the whole application once and checks shell content that every page shares. */
describe("App", () => {
  const renderApp = () =>
    render(
      <ThemeProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ThemeProvider>
    );

  it("should render the main application layout", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
    // Brand text appears in the header and footer; location comes from src/content/person.ts.
    expect(screen.getAllByText("Ayush Rai").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Remote").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/Bhopal/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/continuously evolving/i)
    ).toBeInTheDocument();
  });
});
