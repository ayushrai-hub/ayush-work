import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchIndex } from "../../content";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8);
    return searchIndex
      .filter((item) => {
        const hay = [
          item.title,
          item.summary,
          item.type,
          ...item.tags,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl rounded-sm border border-rule bg-paper-elevated shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-rule px-4 py-3">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search work, products, notes…"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-faint outline-none"
            autoComplete="off"
          />
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {results.length === 0 && (
            <li className="px-4 py-6 text-sm text-ink-faint">No matches.</li>
          )}
          {results.map((item) => (
            <li key={item.id} role="option" aria-selected={false}>
              <Link
                to={item.href}
                onClick={onClose}
                className="block px-4 py-3 hover:bg-accent-soft/40 focus-visible:bg-accent-soft/40"
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
        <p className="border-t border-rule px-4 py-2 font-mono text-xs text-ink-faint">
          Esc to close · / or ⌘K to open
        </p>
      </div>
    </div>
  );
}
