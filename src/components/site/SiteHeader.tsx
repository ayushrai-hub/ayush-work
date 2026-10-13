/**
 * Sticky site header: wordmark, primary nav, "More" menu, agent/human view toggle, search, theme toggle, and mobile menu.
 *
 * From md up, PRIMARY_NAV shows inline and SECONDARY_NAV sits in a native <details> "More"
 * dropdown. Below md, a menu button opens a panel listing both groups plus Search and the view
 * toggle; while that panel is open, Escape closes it and body scroll is locked. Route changes
 * close both menus. The view toggle links to the same path with `agent=1` added or removed,
 * keeping other query parameters. The theme button calls toggleTheme from ThemeContext.
 *
 * Connects to:
 * - Rendered once by SiteLayout, which passes `onOpenSearch` to open SearchDialog
 * - contexts/ThemeContext: useTheme
 * - The `?agent=1` link is read by SiteLayout, which then renders AgentView instead of the page
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

/** Links shown inline in the desktop header; also listed first in the mobile menu. */
const PRIMARY_NAV = [
  { to: "/work", label: "Work" },
  { to: "/products", label: "Products" },
  { to: "/research", label: "Research" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
] as const;

/** Links in the desktop "More" dropdown; listed after PRIMARY_NAV in the mobile menu. */
const SECONDARY_NAV = [
  { to: "/ai-engineering", label: "AI engineering" },
  { to: "/software-engineering", label: "Software" },
  { to: "/experience", label: "Experience" },
  { to: "/open-source", label: "Open source" },
  { to: "/now", label: "Now" },
  { to: "/ideas", label: "Ideas" },
  { to: "/timeline", label: "Timeline" },
  { to: "/principles", label: "Principles" },
  { to: "/elsewhere", label: "Elsewhere" },
  { to: "/contact", label: "Contact" },
] as const;

/** Props for SiteHeader; `onOpenSearch` opens the SearchDialog owned by SiteLayout. */
interface SiteHeaderProps {
  onOpenSearch: () => void;
}

/** Site header; `mobileOpen` and `moreOpen` track the two menus, `moreRef` lets route changes close the <details>. */
export default function SiteHeader({ onOpenSearch }: SiteHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDetailsElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    if (moreRef.current) moreRef.current.open = false;
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /** Class name for desktop primary NavLinks, highlighting the active route. */
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${
      isActive ? "text-ink" : "text-ink-muted hover:text-ink"
    }`;

  /** Closes the mobile menu before opening search so the two overlays never stack. */
  const openSearch = useCallback(() => {
    setMobileOpen(false);
    onOpenSearch();
  }, [onOpenSearch]);

  // Link target for the view toggle: current path and query with `agent=1` flipped.
  const agentParams = new URLSearchParams(location.search);
  const agentOn = agentParams.get("agent") === "1";
  if (agentOn) agentParams.delete("agent");
  else agentParams.set("agent", "1");
  const agentSearch = agentParams.toString();
  const agentTo = {
    pathname: location.pathname,
    search: agentSearch ? `?${agentSearch}` : "",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-rule/80 bg-paper/90 backdrop-blur-md">
      <div className="site-shell flex h-14 items-center justify-between gap-4 md:h-16">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-ink shrink-0"
        >
          Ayush Rai
        </Link>

        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Primary"
        >
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}

          <details
            ref={moreRef}
            className="relative"
            onToggle={(e) => setMoreOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary
              className="list-none cursor-pointer text-sm text-ink-muted hover:text-ink [&::-webkit-details-marker]:hidden"
              aria-expanded={moreOpen}
            >
              More
            </summary>
            <div
              className="absolute right-0 top-full mt-2 min-w-[11rem] rounded-sm border border-rule bg-paper-elevated py-2 shadow-sm"
              role="menu"
            >
              {SECONDARY_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "text-ink bg-accent-soft/50"
                        : "text-ink-muted hover:bg-paper hover:text-ink"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to={agentTo}
            className="btn-ghost hidden px-2 text-sm sm:inline"
          >
            {agentOn ? "Human view" : "Agent view"}
          </Link>
          <button
            type="button"
            onClick={openSearch}
            className="btn-ghost p-2"
            aria-label="Open search ( / or ⌘K )"
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost p-2"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" aria-hidden />
            ) : (
              <Sun className="h-4 w-4" aria-hidden />
            )}
          </button>
          <button
            type="button"
            className="btn-ghost p-2 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id={menuId}
          className="border-t border-rule bg-paper md:hidden"
          role="dialog"
          aria-label="Site navigation"
        >
          <nav className="site-shell flex flex-col gap-1 py-4" aria-label="Mobile">
            {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-sm px-2 py-2.5 text-base ${
                    isActive ? "text-ink bg-accent-soft/40" : "text-ink-muted"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              className="mt-2 rounded-sm px-2 py-2.5 text-left text-base text-ink-muted"
              onClick={openSearch}
            >
              Search
            </button>
            <Link
              to={agentTo}
              className="rounded-sm px-2 py-2.5 text-base text-ink-muted"
              onClick={() => setMobileOpen(false)}
            >
              {agentOn ? "Human view" : "Agent view"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
