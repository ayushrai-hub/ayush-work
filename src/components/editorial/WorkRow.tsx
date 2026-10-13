/**
 * One row in a work list: title, type, year range, and summary, linking to `/work/<slug>`.
 *
 * Stateless. Renders an <li>, so callers must place it inside a <ul> or <ol>. The whole row is a
 * single router Link. The type is shown with its first hyphen replaced by a space
 * (e.g. "open-source" becomes "open source").
 *
 * Connects to:
 * - Rendered by WorkPage (full list) and HomePage (selected work, reordered by `?audience=`)
 * - content: WorkItem type
 */
import { Link } from "react-router-dom";
import type { WorkItem } from "../../content";

/** Props for WorkRow; only the WorkItem fields the row displays. */
interface WorkRowProps {
  item: Pick<
    WorkItem,
    "slug" | "title" | "type" | "summary" | "yearStart" | "yearEnd"
  >;
}

/** Formats a year range: "2024" for a single year, otherwise "2023–2025" or "2023–present". */
function yearLabel(start: number, end?: number | "present") {
  if (!end || end === start) return String(start);
  return `${start}–${end === "present" ? "present" : end}`;
}

/** Linked list item for one work entry. */
export default function WorkRow({ item }: WorkRowProps) {
  return (
    <li className="border-t border-rule">
      <Link
        to={`/work/${item.slug}`}
        className="group block py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-xl text-ink group-hover:text-accent transition-colors">
            {item.title}
          </h3>
          <p className="meta-row">
            <span className="capitalize">{item.type.replace("-", " ")}</span>
            <span aria-hidden="true">·</span>
            <span>{yearLabel(item.yearStart, item.yearEnd)}</span>
          </p>
        </div>
        <p className="mt-2 max-w-measure text-ink-muted leading-relaxed">
          {item.summary}
        </p>
      </Link>
    </li>
  );
}
