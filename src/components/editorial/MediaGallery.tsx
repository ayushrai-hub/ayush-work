/**
 * Reusable media gallery: displays one or more project screenshots, architecture artifacts, or
 * replacement slots with keyboard-accessible tab selection when multiple items exist.
 *
 * When `items` has a single entry, renders `MediaFigure` directly without tab controls. When
 * `items` has two or more entries, renders a thumbnail/tab bar above the active figure and a
 * compact grid preview option so visitors can inspect multi-stage workflows (such as the
 * 6-stage Revenue Intelligence Engine run or the RevenueRoles taxonomy and job screens).
 *
 * Connects to:
 * - Used by GtmPage, ProductDetailPage, WorkDetailPage, and HomePage.
 * - Uses MediaFigure from `./MediaFigure`.
 */
import { useState } from "react";
import MediaFigure from "./MediaFigure";

/** One item in a MediaGallery. */
export interface MediaGalleryItem {
  /** Short tab label for multi-item galleries. */
  label: string;
  /** Image path under /public, or omitted for a clearly labeled replacement slot. */
  src?: string;
  /** Accessible alt description. */
  alt: string;
  /** Caption below the figure. */
  caption?: string;
  /** Provenance label (e.g. "Repository screenshot", "Design artifact", "Live capture"). */
  badge?: string;
  /** Replacement slot identifier when `src` is not yet set. */
  slot?: string;
}

/** Props for MediaGallery. */
export interface MediaGalleryProps {
  /** Gallery items; returns nothing when empty. */
  items: readonly MediaGalleryItem[];
  /** Accessible label for the gallery control group. */
  ariaLabel?: string;
  /** Optional heading rendered above the gallery. */
  heading?: string;
}

/** Multi-screenshot switcher or single MediaFigure. */
export default function MediaGallery({
  items,
  ariaLabel = "Screen gallery",
  heading,
}: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (items.length === 0) return null;

  const current = items[activeIndex] ?? items[0];

  if (items.length === 1) {
    return (
      <div>
        {heading && <h4 className="label mb-3">{heading}</h4>}
        <MediaFigure
          src={current.src}
          alt={current.alt}
          caption={current.caption}
          badge={current.badge}
          slot={current.slot}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {heading ? <h4 className="label">{heading}</h4> : <span className="label">{ariaLabel}</span>}
        <span className="font-mono text-xs text-ink-faint">
          {activeIndex + 1} / {items.length}
        </span>
      </div>
      <div
        className="mb-3 flex flex-wrap gap-1.5"
        role="group"
        aria-label={ariaLabel}
      >
        {items.map((item, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={`${item.label}-${idx}`}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveIndex(idx)}
              className={`rounded-sm border px-2.5 py-1 text-xs transition-colors ${
                active
                  ? "border-ink bg-ink text-paper-elevated"
                  : "border-rule bg-paper-elevated text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <MediaFigure
        src={current.src}
        alt={current.alt}
        caption={current.caption}
        badge={current.badge}
        slot={current.slot}
      />
    </div>
  );
}
