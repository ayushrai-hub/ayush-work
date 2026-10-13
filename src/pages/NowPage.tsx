/**
 * `/now`: current status page listing what Ayush is working on, researching, learning,
 * thinking about, reading, and prioritizing.
 *
 * Static render of the `now` record; no state. Each list is a NowList section.
 *
 * Connects to:
 * - Routed in src/App.tsx as `now`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 *   HomePage's "Now" section shows the first three `workingOn` items and links here.
 * - Content from src/content (`now`, `pageUpdatedAt("now")`); components PageSEO, PageHeader, EmptyNote.
 * - Markdown twin `/now.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import EmptyNote from "../components/editorial/EmptyNote";
import { now, pageUpdatedAt } from "../content";

/** Titled bullet list for one `now` field. Shows EmptyNote when any item contains "todo" (case-insensitive). */
function NowList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mb-10">
      <h2 className="label mb-3">{title}</h2>
      <ul className="max-w-measure space-y-2 text-ink-muted leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {items.some((i) => i.toLowerCase().includes("todo")) && <EmptyNote />}
    </section>
  );
}

/** Now page component. Lazy-loaded by the `now` route in src/App.tsx. */
export default function NowPage() {
  return (
    <>
      <PageSEO
        title="Now"
        description="What Ayush is working on, learning, and prioritizing right now."
        path="/now"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Now"
          title="What I’m focused on"
          dek="Living status page. Change the bullets when reality changes."
          updated={pageUpdatedAt("now")}
        />

        <NowList title="Working on" items={now.workingOn} />
        <NowList title="Researching" items={now.researching} />
        <NowList title="Learning" items={now.learning} />
        <NowList title="Thinking about" items={now.thinking} />
        <NowList title="Reading" items={now.reading} />
        <NowList title="Priorities" items={now.priorities} />

        <p className="mt-8">
          <Link to="/" className="link-accent">
            ← Home
          </Link>
        </p>
      </div>
    </>
  );
}
