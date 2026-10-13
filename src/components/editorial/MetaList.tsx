/**
 * Two-column label/value list for the facts block on detail pages.
 *
 * Stateless. Renders `items` as a <dl>, one <dt>/<dd> pair per item, keyed by label, so labels
 * must be unique within a list.
 *
 * Connects to:
 * - Rendered by WorkDetailPage, ProductDetailPage, and ResearchDetailPage
 */

/** One label/value pair. */
interface MetaItem {
  label: string;
  value: string;
}

/** Props for MetaList. */
interface MetaListProps {
  items: MetaItem[];
}

/** Definition list of label/value pairs, two columns from the `sm` breakpoint up. */
export default function MetaList({ items }: MetaListProps) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 border-y border-rule py-6 my-8">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="label mb-1">{item.label}</dt>
          <dd className="text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
