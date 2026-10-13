/**
 * Tests the page-area error boundary on its own and mounted inside the real SiteLayout.
 *
 * Verifies that children render normally; that a throwing page shows an accessible fallback while
 * the header and footer stay; that "Try again" re-renders the page; that navigating to another
 * route clears the error; that a failed lazy-chunk import reloads once and then stops (no reload
 * loop); and that exactly one GA4 `exception` event is sent per caught error. React logs the thrown
 * errors to the console; the suite silences console.error for that.
 *
 * Connects to:
 * - src/components/layout/ErrorBoundary.tsx and src/lib/chunkReload.ts
 * - src/components/site/SiteLayout.tsx (mounts the boundary around the routed page)
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Link, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "../components/layout/ErrorBoundary";
import { CHUNK_RELOAD_KEY, isChunkLoadError, reloadOnceForChunkError } from "../lib/chunkReload";
import SiteLayout from "../components/site/SiteLayout";
import { ThemeProvider } from "../contexts/ThemeContext";

let shouldThrow = true;

/** Throws while `shouldThrow` is set, otherwise renders a marker. */
function Flaky() {
  if (shouldThrow) throw new Error("Page exploded");
  return <p>Recovered page</p>;
}

/** Throws the error Vite raises when a hashed chunk is gone after a deploy. */
function MissingChunk(): never {
  throw new TypeError("Failed to fetch dynamically imported module: /assets/WorkPage-abc123.js");
}

/** SiteLayout with a throwing route, a working route, and a link between them. */
function renderSite(path: string) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<p>Home page</p>} />
            <Route path="boom" element={<Flaky />} />
            <Route
              path="fine"
              element={
                <p>
                  Fine page <Link to="/boom">to boom</Link>
                </p>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

const reload = vi.fn();

beforeEach(() => {
  shouldThrow = true;
  vi.spyOn(console, "error").mockImplementation(() => {});
  window.sessionStorage.clear();
  reload.mockReset();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (window as { gtag?: unknown }).gtag;
});

/** Standalone boundary behavior. */
describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <div>Test component</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Test component")).toBeInTheDocument();
  });

  it("shows an alert with recovery actions and retries the page", () => {
    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "This page could not be displayed." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to the homepage" })).toHaveAttribute("href", "/");

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText("Recovered page")).toBeInTheDocument();
  });

  it("sends exactly one GA4 exception event per caught error", () => {
    const gtag = vi.fn();
    (window as { gtag?: unknown }).gtag = gtag;
    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "exception", {
      description: "render: Page exploded",
      fatal: false,
    });
  });

  it("reloads once for a missing chunk and then shows the fallback instead of looping", () => {
    render(
      <ErrorBoundary>
        <MissingChunk />
      </ErrorBoundary>,
    );
    expect(reload).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem(CHUNK_RELOAD_KEY)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "This page needs a reload." })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();

    // The reloaded page fails the same way: no second automatic reload inside the window.
    expect(reloadOnceForChunkError()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    // After the window passes, a later deploy may reload again.
    expect(reloadOnceForChunkError(Date.now() + 60_000)).toBe(true);
  });

  it("recognizes chunk-load errors from Chromium, Firefox, and Safari", () => {
    expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /a.js"))).toBe(true);
    expect(isChunkLoadError(new TypeError("error loading dynamically imported module"))).toBe(true);
    expect(isChunkLoadError(new TypeError("Importing a module script failed."))).toBe(true);
    expect(isChunkLoadError(new Error("Page exploded"))).toBe(false);
  });
});

/** The boundary as mounted in the live layout. */
describe("SiteLayout error boundary", () => {
  it("keeps the header and footer when a page throws", () => {
    renderSite("/boom");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("alert"));
  });

  it("clears the error after navigating to another route", () => {
    renderSite("/boom");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("link", { name: /Ayush Rai/i })[0]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });
});
