/**
 * `/work`: index of all case studies with a type filter.
 *
 * Keeps the selected `WorkType` (or "all") in component state; it is not reflected in the URL.
 * Rows are rendered by WorkRow in content order.
 *
 * Connects to:
 * - Routed in src/App.tsx as `work`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   Rows link to WorkDetailPage at `/work/:slug`.
 * - Content from src/content (`work`, `pageUpdatedAt("work")`, type `WorkType`); components
 *   PageSEO, PageHeader, WorkRow.
 * - Markdown twin `/work.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { useMemo, useState } from "react";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import WorkRow from "../components/editorial/WorkRow";
import { work, pageUpdatedAt, type WorkType } from "../content";

/** Type filter buttons, one per `WorkType` plus "all". */
const FILTERS: Array<{ label: string; value: WorkType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Product", value: "product" },
  { label: "Project", value: "project" },
  { label: "Client", value: "client" },
  { label: "Experiment", value: "experiment" },
  { label: "Open source", value: "open-source" },
];

/** Work index component. Lazy-loaded by the `work` route in src/App.tsx. */
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
        description="Ayush Rai work index: AI product and software case studies, including The Open Framework, MedVoice, AGENYRA, and client sites."
        path="/work"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Work"
          title="Index"
          dek="Case studies and shipped systems. Fewer items, clearer roles."
          updated={pageUpdatedAt("work")}
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

        <ContactCta prompt="If a case study matches a role or project you are filling, open the resume or book a short call." />
      </div>
    </>
  );
}
