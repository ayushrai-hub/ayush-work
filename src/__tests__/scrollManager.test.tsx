/**
 * Tests scroll handling after client-side navigation and the timeline's anchored links.
 *
 * Verifies that a link navigation scrolls to the top, that a `#slug` navigation scrolls the matching
 * element into view (including one that renders a frame later, like a lazy page), that the first
 * load (POP) leaves scrolling to the browser, and that timeline entries link to `#slug` anchors that
 * exist on the target list pages.
 *
 * Connects to:
 * - src/components/site/ScrollManager.tsx
 * - src/pages/TimelinePage.tsx (relatedHref) and the list pages' `id={slug}` anchors
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScrollManager from "../components/site/ScrollManager";
import TimelinePage from "../pages/TimelinePage";
import { education, experience, leadership, recognition, timeline } from "../content";

/** Renders its anchor one frame after mount, like a page whose chunk is still loading. */
function LateAnchor() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return ready ? <p id="late-target">Late target</p> : null;
}

/** Router with ScrollManager and three routes linked from the start page. */
function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/start"]}>
      <ScrollManager />
      <Routes>
        <Route
          path="/start"
          element={
            <>
              <Link to="/plain">plain</Link>
              <Link to="/anchors#second">anchored</Link>
              <Link to="/late#late-target">late</Link>
            </>
          }
        />
        <Route path="/plain" element={<p>Plain page</p>} />
        <Route
          path="/anchors"
          element={
            <>
              <p id="first">First</p>
              <p id="second">Second</p>
            </>
          }
        />
        <Route path="/late" element={<LateAnchor />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.mocked(window.scrollTo).mockClear();
  vi.mocked(Element.prototype.scrollIntoView).mockClear();
});

/** Scroll behavior per navigation type. */
describe("ScrollManager", () => {
  it("leaves the first load to the browser", () => {
    renderApp();
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("scrolls to the top after a link navigation", () => {
    renderApp();
    fireEvent.click(screen.getByText("plain"));
    expect(screen.getByText("Plain page")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls the hash target into view", () => {
    const calls: string[] = [];
    vi.mocked(Element.prototype.scrollIntoView).mockImplementation(function (this: Element) {
      calls.push(this.id);
    });
    renderApp();
    fireEvent.click(screen.getByText("anchored"));
    expect(calls).toEqual(["second"]);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("waits for an anchor that renders after the route", async () => {
    const calls: string[] = [];
    vi.mocked(Element.prototype.scrollIntoView).mockImplementation(function (this: Element) {
      calls.push(this.id);
    });
    renderApp();
    fireEvent.click(screen.getByText("late"));
    await waitFor(() => expect(calls).toEqual(["late-target"]));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

/** Timeline entries link to anchors that exist on the list pages. */
describe("timeline links", () => {
  it("links education, role, leadership, and recognition entries to their #slug anchor", () => {
    render(
      <MemoryRouter>
        <TimelinePage />
      </MemoryRouter>,
    );
    const anchorIds: Record<string, Set<string>> = {
      "/education": new Set(education.map((e) => e.slug)),
      "/about": new Set(experience.map((e) => e.slug)),
      "/leadership": new Set(leadership.map((e) => e.slug)),
      "/recognition": new Set(recognition.filter((r) => r.featured || r.archive).map((r) => r.slug)),
    };
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.split("#")[0] in anchorIds);

    const listKinds = new Set(["education", "role", "leadership", "recognition"]);
    expect(hrefs.length).toBe(timeline.filter((e) => listKinds.has(e.kind) && e.relatedSlug).length);
    for (const href of hrefs) {
      const [path, anchor] = href.split("#");
      expect(anchor, href).toBeTruthy();
      expect(anchorIds[path].has(anchor), href).toBe(true);
    }
  });
});
