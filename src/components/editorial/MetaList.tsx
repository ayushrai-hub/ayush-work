interface MetaItem {
  label: string;
  value: string;
}

interface MetaListProps {
  items: MetaItem[];
}

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
