interface PageHeaderProps {
  label?: string;
  title: string;
  dek?: string;
}

export default function PageHeader({ label, title, dek }: PageHeaderProps) {
  return (
    <header className="mb-12 md:mb-16 max-w-measure">
      {label && <p className="label mb-3">{label}</p>}
      <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-tight text-ink">
        {title}
      </h1>
      {dek && (
        <p className="mt-4 text-lg text-ink-muted leading-relaxed">{dek}</p>
      )}
    </header>
  );
}
