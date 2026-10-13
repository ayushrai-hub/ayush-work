/**
 * One row in a work list: title, type, year range, and summary, linking to `/work/<slug>`.
 *
 * Stateless. Renders an <li>, so callers must place it inside a <ul> or <ol>. The whole row is a
 * single router Link. The type is shown with its label from `projectTypeLabels`
 * (e.g. "open-source" becomes "Open source"), and the years with the shared `yearLabel`.
 *
 * Connects to:
 * - Rendered by WorkPage (full list) and HomePage (selected work, reordered by `?audience=`)
 * - content: WorkItem type, projectTypeLabels; lib/format: yearLabel
 */
import { Link } from "react-router-dom";
import { projectTypeLabels, type WorkItem } from "../../content";
import { yearLabel } from "../../lib/format";

/** Props for WorkRow; only the WorkItem fields the row displays. */
interface WorkRowProps {
  item: Pick<
    WorkItem,
    "slug" | "title" | "type" | "summary" | "yearStart" | "yearEnd"
  >;
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
            <span className="capitalize">{projectTypeLabels[item.type] ?? item.type}</span>
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
