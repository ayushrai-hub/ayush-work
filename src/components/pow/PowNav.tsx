/**
 * Proof-of-work series navigation.
 *
 * Renders every route in `powPages`, including pages that are still being added, plus a link back
 * to the portfolio. The current route is marked with aria-current.
 *
 * Connects to:
 * - src/content/powPages.ts
 * - Proof-of-work pages import `PowNav` or the default export.
 */
import { NavLink } from "react-router-dom";
import { powPages } from "../../content/powPages";

/** Series links shared by the proof-of-work pages. */
export function PowNav() {
  return (
    <nav aria-label="Proof of work" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "text-ink" : "link-underline text-ink-muted")}>
        Portfolio
      </NavLink>
      {powPages.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? "text-ink" : "link-underline text-ink-muted")}
        >
          {link.short}
        </NavLink>
      ))}
    </nav>
  );
}

export default PowNav;
