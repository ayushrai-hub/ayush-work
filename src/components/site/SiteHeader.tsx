/**
 * Sticky site header: wordmark, primary nav, POW hover menu, "More" menu, agent/human view toggle, search, theme toggle, and mobile menu.
 *
 * From md up, PRIMARY_NAV shows inline. POW is a link to /pow; hovering or focusing it opens
 * `powMenu` (a list of links, not an ARIA menu). Moving the pointer out, blurring the group, or
 * pressing Escape closes it, and Escape returns focus to the POW link. SECONDARY_NAV sits in a
 * native <details> "More" disclosure, closed by Escape (focus returns to "More"), by a pointer
 * press outside it, or by clicking "More" again. Opening one menu closes the other. Below md, a
 * menu button opens a panel listing the primary links, every POW role, More, Search, and the view
 * toggle; while that panel is open, Escape closes it and body scroll is locked. Route changes
 * close both menus. The search button advertises its shortcuts with `aria-keyshortcuts` rather
 * than a platform-specific label. The view toggle links to the same path with `agent=1` added or
 * removed, keeping other query parameters. The theme button calls toggleTheme from ThemeContext.
 *
 * Connects to:
 * - Rendered once by SiteLayout, which passes `onOpenSearch` to open SearchDialog
 * - contexts/ThemeContext: useTheme
 * - The `?agent=1` link is read by SiteLayout, which then renders AgentView instead of the page
 * - src/content/powPages.ts (`powMenu`, the role list). The POW link goes to /pow.
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { POW_PATH, powMenu } from "../../content/powPages";

/** Links shown inline in the desktop header; also listed first in the mobile menu. */
const PRIMARY_NAV = [
  { to: "/work", label: "Work" },
  { to: "/products", label: "Products" },
  { to: "/research", label: "Research" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
] as const;

/** Links in the desktop "More" dropdown; listed after the POW roles in the mobile menu. */
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

/**
 * Desktop POW control. Hover or focus opens the role list; pointer exit, blur, and Escape close it.
 * `onOpen` lets the header close the More disclosure so the two panels are not open together.
 */
function PowMenu({ onOpen }: { onOpen: () => void }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const suppressOpen = useRef(false);
  const panelId = useId();
  const onPow =
    location.pathname === POW_PATH ||
    location.pathname.startsWith(`${POW_PATH}/`) ||
    location.pathname === "/gtm";

  /** Opens the role list and asks the header to close More. Ignored while Escape is returning focus. */
  const show = () => {
    if (suppressOpen.current) return;
    setOpen(true);
    onOpen();
  };

  /** Closes the list and returns focus to the POW link without opening it again. */
  const hideFromKeyboard = useCallback(() => {
    suppressOpen.current = true;
    setOpen(false);
    rootRef.current?.querySelector("a")?.focus();
    suppressOpen.current = false;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      hideFromKeyboard();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hideFromKeyboard]);

  return (
    <div
      ref={rootRef}
      className="relative"
      role="group"
      aria-label="Proof of work"
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={(event) => {
        const trigger = rootRef.current?.querySelector("a");
        if (event.target instanceof HTMLAnchorElement && event.target === trigger) show();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <NavLink
        to={POW_PATH}
        end
        className={`text-sm transition-colors ${onPow ? "text-ink" : "text-ink-muted hover:text-ink"}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        POW
      </NavLink>
      {open && (
        <div id={panelId} className="absolute left-0 top-full z-50 pt-2">
          <div className="max-h-[min(32rem,70vh)] min-w-[20rem] overflow-y-auto rounded-sm border border-rule bg-paper-elevated py-2 shadow-sm">
            {powMenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-baseline gap-3 px-4 py-2 text-sm ${
                    isActive ? "text-ink bg-accent-soft/50" : "text-ink-muted hover:bg-paper hover:text-ink"
                  }`
                }
              >
                <span className="w-16 shrink-0 font-mono text-xs text-ink-faint" aria-hidden="true">
                  {item.short}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Props for SiteHeader; `onOpenSearch` opens the SearchDialog owned by SiteLayout. */
interface SiteHeaderProps {
  onOpenSearch: () => void;
}

/**
 * Site header; `mobileOpen` tracks the mobile panel. `powEpoch` remounts the POW menu when More
 * opens, so the two panels are not shown together. The "More" <details> keeps its own open state,
 * and `moreRef` lets route changes, Escape, and outside presses close it. Those listeners are
 * registered once and read `details.open` when the event fires, so an Escape pressed right after
 * opening is not lost waiting for a re-render.
 */
export default function SiteHeader({ onOpenSearch }: SiteHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [powEpoch, setPowEpoch] = useState(0);
  const moreRef = useRef<HTMLDetailsElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMobileOpen(false);
    if (moreRef.current) moreRef.current.open = false;
  }, [location.pathname]);

  /** Closes the More disclosure. The POW menu calls this when it opens. */
  const closeMore = useCallback(() => {
    if (moreRef.current) moreRef.current.open = false;
  }, []);

  useEffect(() => {
    const details = moreRef.current;
    if (!details) return;
    const close = (returnFocus: boolean) => {
      details.open = false;
      if (returnFocus) details.querySelector("summary")?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && details.open) close(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (details.open && !details.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

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

          <PowMenu key={`${location.pathname}-${powEpoch}`} onOpen={closeMore} />

          <details
            ref={moreRef}
            className="relative"
            onToggle={(event) => {
              if (event.currentTarget.open) setPowEpoch((epoch) => epoch + 1);
            }}
          >
            <summary className="list-none cursor-pointer text-sm text-ink-muted hover:text-ink [&::-webkit-details-marker]:hidden">
              More
            </summary>
            <div className="absolute right-0 top-full mt-2 min-w-[11rem] rounded-sm border border-rule bg-paper-elevated py-2 shadow-sm">
              {SECONDARY_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
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
            aria-label="Open search"
            aria-keyshortcuts="/ Control+K Meta+K"
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
            {PRIMARY_NAV.map((item) => (
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
            <NavLink
              to={POW_PATH}
              end
              className={({ isActive }) =>
                `rounded-sm px-2 py-2.5 text-base ${
                  isActive ? "text-ink bg-accent-soft/40" : "text-ink-muted"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              POW
            </NavLink>
            {powMenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-sm py-2 pl-6 pr-2 text-base ${
                    isActive ? "text-ink bg-accent-soft/40" : "text-ink-muted"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {SECONDARY_NAV.map((item) => (
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
