/**
 * Shared chrome for the product-management proof-of-work page.
 *
 * `PowLinks` moves between the portfolio, the FDE route, and this page. `TabBar` is the keyboard
 * tab pattern used by the notebook sections. `NotebookSection`, `StatusMark`, and `BulletList` keep
 * the sections in the same editorial type and status language.
 *
 * Connects to:
 * - src/pages/ProductManagementPowPage.tsx and the other components in src/components/pow/.
 * - Sibling routes linked from `PowLinks`: `/pow/fde`, `/pow/product-management`, and `/pow/ml-engineer`.
 */
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

/** Status language used throughout the notebook. The label is the only signal; color is not required. */
export type PmStatus = "fact" | "hypothesis" | "proposed" | "synthetic" | "unmeasured" | "open";

const STATUS_LABELS: Record<PmStatus, string> = {
  fact: "Verified fact",
  hypothesis: "Hypothesis",
  proposed: "Proposed",
  synthetic: "Synthetic",
  unmeasured: "Not measured",
  open: "Open question",
};

/** Links across the proof-of-work series and the portfolio. */
const POW_LINKS = [
  { to: "/", label: "Portfolio" },
  { to: "/pow/fde", label: "FDE proof of work" },
  { to: "/pow/product-management", label: "Product management" },
  { to: "/pow/ai-benchmark", label: "AI benchmark engineering" },
  { to: "/pow/agentic-ai", label: "Agentic AI engineering" },
  { to: "/pow/revenue-operations", label: "Revenue operations engineering" },
  { to: "/pow/ai-research-engineering", label: "AI research engineering" },
  { to: "/pow/founding-engineer", label: "Founding engineer" },
  { to: "/pow/devops-engineer", label: "DevOps engineer" },
  { to: "/pow/cloud-engineer", label: "Cloud engineering" },
  { to: "/pow/ml-engineer", label: "ML engineering" },
] as const;

/** One tab in a `TabBar`. */
export interface PmTab {
  id: string;
  label: string;
}

/**
 * Small bordered status label.
 * `kind` selects the words; the component does not imply that a hypothesis has been confirmed.
 */
export function StatusMark({ kind }: { kind: PmStatus }) {
  return (
    <span className="inline-block border border-rule px-2 py-0.5 font-mono text-[11px] uppercase tracking-label text-ink-muted">
      {STATUS_LABELS[kind]}
    </span>
  );
}

/** Proof-of-work switcher. The portfolio link uses `end` so it is not active on every route. */
export function PowLinks() {
  return (
    <nav aria-label="Proof of work" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {POW_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) => (isActive ? "text-ink" : "link-underline text-ink-muted")}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * Roving tab list plus every panel. Arrow keys, Home, and End move the selection and the focus.
 * Inactive panels stay mounted with the `hidden` attribute so their controls are not in the way.
 * `layout="stack"` is a vertical list on small screens and a horizontal row from the `md` breakpoint.
 */
export function TabSet({
  label,
  tabs,
  selected,
  onSelect,
  layout = "row",
  renderPanel,
}: {
  label: string;
  tabs: readonly PmTab[];
  selected: string;
  onSelect: (id: string) => void;
  layout?: "row" | "stack";
  renderPanel: (id: string) => ReactNode;
}) {
  const prefix = useId();
  const listRef = useRef<HTMLDivElement>(null);

  /** Moves selection and returns focus to the newly selected tab. */
  const move = (nextId: string) => {
    onSelect(nextId);
    requestAnimationFrame(() => {
      listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${nextId}"]`)?.focus();
    });
  };

  /** Arrow, Home, and End keys follow the tab pattern. Other keys are left to the browser. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = Math.max(0, tabs.findIndex((tab) => tab.id === selected));
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(tabs[(index + 1) % tabs.length].id);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(tabs[(index - 1 + tabs.length) % tabs.length].id);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(tabs[0].id);
    } else if (event.key === "End") {
      event.preventDefault();
      move(tabs[tabs.length - 1].id);
    }
  };

  const listClass =
    layout === "stack"
      ? "flex flex-col gap-2 md:flex-row md:overflow-x-auto"
      : "flex gap-2 overflow-x-auto pb-1";

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        aria-orientation={layout === "stack" ? undefined : "horizontal"}
        onKeyDown={onKeyDown}
        className={listClass}
      >
        {tabs.map((tab) => {
          const active = tab.id === selected;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${prefix}-${tab.id}-tab`}
              data-tab-id={tab.id}
              aria-selected={active}
              aria-controls={`${prefix}-${tab.id}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              className={`shrink-0 border px-3 py-2 text-left text-sm transition-colors ${
                active
                  ? "border-ink bg-accent-soft/50 text-ink"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${prefix}-${tab.id}-panel`}
          aria-labelledby={`${prefix}-${tab.id}-tab`}
          hidden={tab.id !== selected}
          className="mt-5"
        >
          {renderPanel(tab.id)}
        </div>
      ))}
    </div>
  );
}

/**
 * Numbered section with a scroll margin so the sticky header and the on-page nav do not cover the heading.
 */
export function NotebookSection({
  id,
  number,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mt-16 scroll-mt-28 border-t border-rule pt-10 md:mt-20"
    >
      <h2 id={headingId} className="font-display text-2xl text-ink md:text-[1.75rem]">
        <span className="mr-3 font-mono text-sm font-normal text-ink-faint">{number}</span>
        {title}
      </h2>
      {intro ? <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Dash list. The dash is hidden from assistive tech because the list role already announces items. */
export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-ink-muted">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="-indent-4 pl-4">
          <span aria-hidden="true">– </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
