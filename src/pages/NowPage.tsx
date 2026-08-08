import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import EmptyNote from "../components/editorial/EmptyNote";
import { now } from "../content";

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
          dek={`Living status. Last updated ${now.lastUpdated}.`}
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
