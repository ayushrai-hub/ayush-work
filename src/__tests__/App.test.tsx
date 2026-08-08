/**
 * App component smoke test — new SiteLayout shell.
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
    // Logo / brand in header + footer positioning
    expect(screen.getAllByText("Ayush Rai").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/continuously evolving/i)
    ).toBeInTheDocument();
  });
});
