/**
 * `/uses`: tools and stack, grouped by category.
 *
 * Groups `uses` by `CATEGORY_ORDER` and drops empty groups. Items with `todo` set show EmptyNote.
 *
 * Connects to:
 * - Routed in src/App.tsx as `uses`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`uses`); components PageSEO, PageHeader, EmptyNote.
 * - Markdown twin `/uses.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import EmptyNote from "../components/editorial/EmptyNote";
import { uses } from "../content";

/** Display order of `uses` categories. Must cover every `UseItem["category"]`; a category left out is not rendered. */
const CATEGORY_ORDER = [
  "editor",
  "runtime",
  "language",
  "framework",
  "styling",
  "hosting",
  "ops",
  "other",
] as const;

/** Uses page component. Lazy-loaded by the `uses` route in src/App.tsx. */
export default function UsesPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: uses.filter((u) => u.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageSEO
        title="Uses"
        description="Tools and stack Ayush actually uses."
        path="/uses"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Uses"
          title="Tools"
          dek="Honest tooling from the known stack. Todo-marked items still need confirmation."
        />
        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.category}>
              <h2 className="label mb-4 capitalize">{group.category}</h2>
              <ul className="max-w-measure space-y-4">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <h3 className="font-medium text-ink">{item.name}</h3>
                    <p className="text-sm text-ink-muted">{item.notes}</p>
                    {item.todo && (
                      <div className="mt-1">
                        <EmptyNote />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
