/**
 * Keyboard and accessibility tests for the header's search dialog, "More" disclosure, and Agent view.
 *
 * Search: the input is a combobox whose ArrowDown/ArrowUp moves `aria-activedescendant` and
 * `aria-selected`, Enter navigates to the active result, Tab stays inside the dialog, Escape closes it
 * and returns focus to the button that opened it, and the shortcut hint matches the platform.
 * More menu: no ARIA menu roles; Escape and an outside press close it. POW menu: hover lists the
 * role pages; Escape closes it and returns focus to POW. Agent view: title and canonical
 * point at the human page, including on a trailing-slash URL. Each surface also passes jest-axe.
 *
 * Connects to:
 * - src/components/site/SearchDialog.tsx, SiteHeader.tsx, SiteLayout.tsx, AgentView.tsx
 * - src/lib/platform.ts
 */
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import SiteLayout from "../components/site/SiteLayout";
import { ThemeProvider } from "../contexts/ThemeContext";
import { getAgentPage } from "../lib/agent/markdown";
import { searchPortfolio } from "../lib/agent/search";

/** Shows the current path so tests can assert navigation. */
function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname}</p>;
}

/** The real layout with a catch-all page that prints the path. */
function renderSite(path = "/") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="*" element={<Where />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

/** Opens the dialog from the header button and returns the button and the combobox. */
function openSearch() {
  const button = screen.getByRole("button", { name: "Open search" });
  button.focus();
  fireEvent.click(button);
  return { button, input: screen.getByRole("combobox", { name: "Search" }) };
}

/** Search dialog keyboard behavior. */
describe("SearchDialog", () => {
  it("moves the active option with the arrow keys and opens it with Enter", () => {
    renderSite();
    const { input } = openSearch();
    expect(input).toHaveFocus();
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(input).toHaveAttribute("aria-activedescendant", options[1].id);

    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[options.length - 1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const expected = searchPortfolio("")[options.length - 1].href.split("#")[0];
    expect(screen.getByTestId("where")).toHaveTextContent(expected);
  });

  it("keeps Tab inside the dialog and returns focus on Escape", () => {
    renderSite();
    const { button, input } = openSearch();
    const close = screen.getByRole("button", { name: "Close" });

    close.focus();
    fireEvent.keyDown(close, { key: "Tab" });
    expect(input).toHaveFocus();
    fireEvent.keyDown(input, { key: "Tab", shiftKey: true });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("names the platform's shortcut", () => {
    vi.spyOn(navigator, "platform", "get").mockReturnValue("MacIntel");
    renderSite();
    openSearch();
    expect(screen.getByText(/or ⌘K to open/)).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });

    vi.spyOn(navigator, "platform", "get").mockReturnValue("Win32");
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Windows NT 10.0)");
    openSearch();
    expect(screen.getByText(/or Ctrl K to open/)).toBeInTheDocument();
  });

  it("reports no matches without an empty listbox and has no axe violations", async () => {
    renderSite();
    const { input } = openSearch();
    fireEvent.change(input, { target: { value: "zzzz-no-such-thing" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No matches.");
    expect(input).toHaveAttribute("aria-expanded", "false");

    fireEvent.change(input, { target: { value: "open framework" } });
    expect(await axe(screen.getByRole("dialog"))).toHaveNoViolations();
  });
});

/** Header "More" disclosure. */
describe("SiteHeader More menu", () => {
  it("is a disclosure of links that Escape and outside presses close", async () => {
    const { container } = renderSite();
    const details = container.querySelector("header details") as HTMLDetailsElement;
    const summary = details.querySelector("summary") as HTMLElement;
    expect(container.querySelector('[role="menu"], [role="menuitem"]')).toBeNull();

    /** Clicks "More" and lets jsdom deliver its asynchronous `toggle` event. */
    const openMore = async () => {
      await act(async () => {
        summary.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(details.open).toBe(true);
    };

    await openMore();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(details.open).toBe(false);
    expect(summary).toHaveFocus();

    await openMore();
    fireEvent.pointerDown(document.body);
    expect(details.open).toBe(false);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(await axe(container.querySelector("header") as HTMLElement)).toHaveNoViolations();
  });
});

/** Header POW hover menu. */
describe("SiteHeader POW menu", () => {
  it("lists the role pages on hover and closes with Escape", async () => {
    const { container } = renderSite();
    const header = container.querySelector("header") as HTMLElement;
    const group = within(header).getByRole("group", { name: "Proof of work" });
    const trigger = within(group).getByRole("link", { name: "POW" });
    expect(trigger).toHaveAttribute("href", "/pow");
    expect(within(header).queryByRole("link", { name: "GTM engineering" })).not.toBeInTheDocument();

    fireEvent.mouseEnter(group);
    expect(within(header).getByRole("link", { name: "GTM engineering" })).toHaveAttribute("href", "/gtm");
    expect(within(header).getByRole("link", { name: "Forward deployed engineering" })).toHaveAttribute(
      "href",
      "/pow/fde",
    );
    expect(container.querySelector('[role="menu"], [role="menuitem"]')).toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(within(header).queryByRole("link", { name: "GTM engineering" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    fireEvent.mouseEnter(group);
    expect(within(header).getByRole("link", { name: "Revenue operations engineering" })).toHaveAttribute(
      "href",
      "/pow/revops-engineering",
    );
    fireEvent.mouseLeave(group);
    expect(within(header).queryByRole("link", { name: "Revenue operations engineering" })).not.toBeInTheDocument();

    act(() => {
      trigger.blur();
      trigger.focus();
    });
    expect(trigger).toHaveFocus();
    expect(within(header).getByRole("link", { name: "Forward deployed engineering" })).toHaveAttribute(
      "href",
      "/pow/fde",
    );

    expect(await axe(header)).toHaveNoViolations();
  });
});

/** Agent view head tags. */
describe("AgentView", () => {
  it("sets a Markdown title and a canonical to the human page, with or without a trailing slash", () => {
    for (const path of ["/about?agent=1", "/about/?agent=1"]) {
      const { unmount } = renderSite(path);
      expect(screen.getByRole("heading", { name: "Agent view" })).toBeInTheDocument();
      expect(document.querySelector("title")?.textContent).toBe(
        `${getAgentPage("/about")?.title} (Markdown) · Ayush Rai`,
      );
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://www.ayushrai.site/about/",
      );
      unmount();
    }
  });
});
