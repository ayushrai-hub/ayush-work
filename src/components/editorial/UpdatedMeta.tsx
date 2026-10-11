import { formatUpdated } from "../../content/siteMeta";

interface UpdatedMetaProps {
  date: string;
  /** Defaults to "Updated" */
  label?: string;
  className?: string;
}

/** Quiet freshness stamp for page headers and intro meta. */
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
