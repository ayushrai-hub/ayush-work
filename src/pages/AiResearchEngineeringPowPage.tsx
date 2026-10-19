/**
 * `/pow/ai-research-engineering`: AI research engineering proof of work.
 *
 * The hero states the positioning. The notebook scores a prepared retrieval comparison.
 * Sibling proof-of-work routes come from `powPages`, including pages that may still be in progress.
 *
 * Connects to:
 * - Routed as `pow/ai-research-engineering` in src/App.tsx. `/pow/ai-research` redirects here.
 * - Prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Markdown twin from `renderAiResearchBody` in src/lib/agent/markdown.ts.
 * - src/components/pow/ResearchNotebook.tsx, src/content/aiResearchPow.ts, PageSEO.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import { NotebookSection, StatusMark } from "../components/pow/PmChrome";
import ResearchNotebook from "../components/pow/ResearchNotebook";
import {
  AI_RESEARCH_PATH,
  aiResearchDescription,
  aiResearchHero,
  aiResearchTitle,
  philosophyPairs,
  practiceNotes,
} from "../content/aiResearchPow";
import { powPages } from "../content/powPages";
import { person } from "../content/person";
import { pageUpdatedAt } from "../content/siteMeta";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** Proof-of-work links, with this page marked current. */
function ResearchPowNav() {
  return (
    <nav aria-label="Proof of work" className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {powPages.map((page) => (
        <Link
          key={page.to}
          to={page.to}
          aria-current={page.to === AI_RESEARCH_PATH ? "page" : undefined}
          className={page.to === AI_RESEARCH_PATH ? "text-ink" : "link-underline text-ink-muted"}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}

/** AI research engineering proof-of-work page. */
export default function AiResearchEngineeringPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(AI_RESEARCH_PATH)}#webpage`,
    url: canonicalUrl(AI_RESEARCH_PATH),
    name: aiResearchTitle,
    description: aiResearchDescription,
    dateModified: pageUpdatedAt("ai-research-engineering"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title={aiResearchTitle}
        description={aiResearchDescription}
        path={AI_RESEARCH_PATH}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <header className="max-w-measure">
          <p className="label mb-3">{aiResearchHero.eyebrow}</p>
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl md:text-[2.75rem]">
            {aiResearchHero.headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{aiResearchHero.support}</p>
          <p className="mt-4 leading-relaxed text-ink">{aiResearchHero.positioning}</p>
          <p className="mt-3 leading-relaxed text-ink-muted">{aiResearchHero.supporting}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#workbench" className="btn-primary">
              Explore the research workbench
            </a>
            <a href="#method" className="btn-secondary">
              Inspect the experiment methodology
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <a href={person.primaryProfiles.github} className="link-underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={person.primaryProfiles.linkedin} className="link-underline" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <Link to="/" className="link-underline">
                ayushrai.site
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/ayushrai-hub/OpenAI-RLHF"
                className="link-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI-RLHF
              </a>
            </li>
            <li>
              <a href="https://agenyra.space/" className="link-underline" target="_blank" rel="noopener noreferrer">
                AGENYRA
              </a>
            </li>
          </ul>
          <ResearchPowNav />
        </header>

        <NotebookSection
          id="philosophy"
          number="00"
          title="An interesting result is not enough. It must survive scrutiny."
          intro="Research engineering is the work of making a question fail-able, then building the comparison that can fail it. Calling a model through an API is a different job."
        >
          <ul className="space-y-4">
            {philosophyPairs.map((pair) => (
              <li key={pair.left} className="border border-rule p-4">
                <p className="text-ink">
                  {pair.left} <span className="text-ink-faint">and</span> {pair.right}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pair.note}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-display text-lg">What the method has to name</h3>
          <ul className="mt-3 space-y-3">
            {practiceNotes.map((item) => (
              <li key={item.title} className="text-sm">
                <span className="text-ink">{item.title}. </span>
                <span className="text-ink-muted">{item.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-measure text-sm text-ink-muted">
            <StatusMark kind="open" />{" "}
            <span className="ml-2">
              Not every question needs a significance test. A deterministic check on a complete fixture does not
              become more true because a p-value was attached. A sample from a noisy process does need a statement
              of uncertainty. The method follows the question, the data, and the measurement, rather than a default test.
            </span>
          </p>
        </NotebookSection>

        <div id="workbench">
          <ResearchNotebook />
        </div>
      </article>
    </>
  );
}
