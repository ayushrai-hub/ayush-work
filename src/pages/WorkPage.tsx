import { useMemo, useState } from "react";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import WorkRow from "../components/editorial/WorkRow";
import { work, type WorkType } from "../content";

const FILTERS: Array<{ label: string; value: WorkType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Product", value: "product" },
  { label: "Project", value: "project" },
  { label: "Client", value: "client" },
  { label: "Experiment", value: "experiment" },
  { label: "Open source", value: "open-source" },
];

export default function WorkPage() {
  const [filter, setFilter] = useState<WorkType | "all">("all");

  const items = useMemo(() => {
    if (filter === "all") return work;
    return work.filter((w) => w.type === filter);
  }, [filter]);

  return (
    <>
      <PageSEO
        title="Work"
        description="Selected and indexed work — products, projects, client sites, and experiments."
        path="/work"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Work"
          title="Index"
          dek="Case studies and shipped systems. Fewer items, clearer roles."
        />

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by type"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`rounded-sm px-3 py-1.5 text-sm border transition-colors ${
                filter === f.value
                  ? "border-ink bg-ink text-paper-elevated"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="border-b border-rule">
          {items.map((item) => (
            <WorkRow key={item.slug} item={item} />
          ))}
        </ul>
        {items.length === 0 && (
          <p className="py-8 text-ink-faint">No work in this filter.</p>
        )}
      </div>
    </>
  );
}
