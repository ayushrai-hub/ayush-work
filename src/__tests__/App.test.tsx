/**
 * Smoke test that the full App renders the current SiteLayout shell at "/".
 *
 * Renders <App /> inside ThemeProvider and HelmetProvider, as src/main.tsx does,
 * and checks for a <main> landmark, the brand name, the "Remote" location from
 * src/content/person.ts, the footer's "continuously evolving" line from
 * src/components/site/SiteFooter.tsx, and that the old "Bhopal" location is gone.
 *
 * BrowserRouter (used inside src/App.tsx) is swapped for MemoryRouter so the test starts at "/".
 *
 * Connects to:
 * - src/App.tsx, src/contexts/ThemeContext.tsx, src/components/site/*
 * - src/setupTests.ts (Helmet pass-through)
 */
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "../contexts/ThemeContext";
import App from "../App";
import { vi } from "vitest";
import React from "react";

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
