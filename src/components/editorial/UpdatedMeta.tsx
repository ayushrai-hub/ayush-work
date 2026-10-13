/**
 * Small "Updated <date>" stamp wrapped in a <time> element.
 *
 * Stateless. Formats the ISO `date` (YYYY-MM-DD) with formatUpdated (e.g. "3 Mar 2026") and keeps
 * the raw value in `dateTime`. `label` replaces the default "Updated" prefix.
 *
 * Connects to:
 * - Rendered by PageHeader (when `updated` is set) and directly by HomePage
 * - content/siteMeta: formatUpdated
 */
import { formatUpdated } from "../../content/siteMeta";

/** Props for UpdatedMeta. `date` is an ISO date string (YYYY-MM-DD). */
interface UpdatedMetaProps {
  date: string;
  /** Defaults to "Updated" */
  label?: string;
  className?: string;
}

/** Freshness stamp for page headers and the homepage intro. */
export default function UpdatedMeta({
  date,
  label = "Updated",
  className = "",
}: UpdatedMetaProps) {
  const formatted = formatUpdated(date);
  return (
    <p
      className={`font-mono text-xs text-ink-faint tracking-wide ${className}`.trim()}
    >
      <time dateTime={date}>
        {label} {formatted}
      </time>
    </p>
  );
}
