/**
 * Modal site search over the public content index, built on the ARIA combobox-with-listbox pattern.
 *
 * Controlled by the `open` and `onClose` props. While open it remembers the element that had focus,
 * focuses the input, locks body scroll, and keeps Tab inside the dialog; Escape or a backdrop click
 * closes it, and closing returns focus to the remembered element and clears the query. Results are
 * recomputed on every keystroke with searchPortfolio, the same lexical ranking used by GET
 * /api/search: an empty query shows the first 8 index entries in content order, a non-empty query
 * shows up to 12 matches. Focus stays in the input; ArrowUp/ArrowDown move the active option
 * (wrapping, announced through `aria-activedescendant`), Enter opens it, and pointer hover also sets
 * it. Home and End keep their text-editing meaning. Each option is itself a router Link with
 * `role="option"` (allowed on `<a href>`), out of the Tab order, so a click or middle-click still
 * works without nesting interactive elements.
 * The footer hint names ⌘K or Ctrl K for the visitor's platform.
 *
 * Connects to:
 * - Rendered once by SiteLayout, which owns the open state and the "/" and Cmd/Ctrl+K shortcuts;
 *   SiteHeader's search buttons also open it
 * - lib/agent/search: searchPortfolio (default index from content/searchIndex)
 * - lib/platform: shortcutLabel
 * - src/__tests__/searchDialog.test.tsx and e2e/site.spec.ts (keyboard checks)
 */
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchPortfolio } from "../../lib/agent/search";
import { shortcutLabel } from "../../lib/platform";

/** Props for SearchDialog; the parent owns the open state. */
interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Search modal; returns null while closed. */
export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const titleId = useId();
  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      const target = returnFocusRef.current;
      if (target && target.isConnected) target.focus();
    };
  }, [open, onClose]);

  const results = useMemo(() => searchPortfolio(query), [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open || results.length === 0) return;
    document.getElementById(`${listId}-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, results.length, listId]);

  if (!open) return null;

  /** Opens a result and closes the dialog. */
  function choose(index: number) {
    const item = results[index];
    if (!item) return;
    onClose();
    navigate(item.href);
  }

  /** ArrowUp/ArrowDown (wrapping) and Enter for the combobox input; other keys edit the text. */
  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const last = results.length - 1;
    if (last < 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i >= last ? 0 : i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? last : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  }

  /** Keeps Tab and Shift+Tab cycling through the dialog's focusable elements. */
  function trapTab(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>("input, button, [href]:not([tabindex='-1'])"),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const lastEl = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      first.focus();
    }
  }

  const hasResults = results.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh]"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl rounded-sm border border-rule bg-paper-elevated shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapTab}
      >
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <h2 id={titleId} className="sr-only">
            Search site
          </h2>
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={hasResults}
            aria-controls={hasResults ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={hasResults ? optionId(active) : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search work, products, notes…"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-faint outline-none"
            autoComplete="off"
          />
          <button type="button" onClick={onClose} className="btn-ghost px-2 text-xs text-ink-faint">
            Close
          </button>
        </div>
        {hasResults && (
        <ul id={listId} className="max-h-[50vh] overflow-y-auto py-2" role="listbox" aria-label="Results">
          {results.map((item, index) => (
            <li key={item.id} role="none">
              <Link
                to={item.href}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                tabIndex={-1}
                onMouseMove={() => setActive(index)}
                onClick={onClose}
                className={`block px-4 py-3 ${index === active ? "bg-accent-soft/40" : "hover:bg-accent-soft/40"}`}
              >
                <span className="font-medium text-ink">{item.title}</span>
                <span className="mt-0.5 block font-mono text-xs uppercase tracking-label text-ink-faint">
                  {item.type}
                </span>
                <span className="mt-1 block text-sm text-ink-muted line-clamp-2">
                  {item.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        )}
        {!hasResults && (
          <p className="px-4 py-6 text-sm text-ink-faint" role="status">
            No matches.
          </p>
        )}
        <p className="border-t border-rule px-4 py-2 font-mono text-xs text-ink-faint">
          ↑↓ to choose · Enter to open · Esc to close · / or {shortcutLabel("K")} to open
        </p>
      </div>
    </div>
  );
}
