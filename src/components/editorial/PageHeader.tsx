/**
 * Standard page header: optional eyebrow label, the page's <h1>, optional dek, and optional updated date.
 *
 * Stateless. `label` renders above the title, `dek` is the one-paragraph intro below it, and
 * `updated` (ISO date) renders an UpdatedMeta stamp. Pages that use it get their <h1> from here.
 *
 * Connects to:
 * - Rendered at the top of most pages in src/pages (Work, Products, About, Contact, Developers,
 *   DomainPage, the detail pages, and others; HomePage, ElsewherePage, and NotFoundPage do not use it)
 * - editorial/UpdatedMeta
 */
import UpdatedMeta from "./UpdatedMeta";

/** Props for PageHeader. */
interface PageHeaderProps {
  label?: string;
  title: string;
  dek?: string;
  /** ISO date YYYY-MM-DD when this page's info was last revised */
  updated?: string;
}

/** Page title block; optional parts are omitted when their props are absent. */
export default function PageHeader({
  label,
  title,
  dek,
  updated,
}: PageHeaderProps) {
  return (
    <header className="mb-10 md:mb-12 max-w-measure">
      {label && <p className="label mb-3">{label}</p>}
      <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-tight text-ink">
        {title}
      </h1>
      {dek && (
        <p className="mt-4 text-lg text-ink-muted leading-relaxed">{dek}</p>
      )}
      {updated && <UpdatedMeta date={updated} className="mt-4" />}
    </header>
  );
}
