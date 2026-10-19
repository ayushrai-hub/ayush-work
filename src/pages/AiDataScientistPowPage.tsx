/**
 * `/pow/ai-data-scientist`: data-science proof of work.
 *
 * Hero, analytical stance, the Insight Lab workbench, and the repository notes.
 * The workbench calculates from the synthetic extract. The case studies only say
 * what an inspection of the repositories or of this site's records supports.
 *
 * Connects to:
 * - Routed as `pow/ai-data-scientist` in src/App.tsx. Prerendered in src/lib/publicRoutes.ts.
 * - src/components/pow/ds/InsightLab.tsx and src/components/pow/PowNav.tsx.
 * - src/content/aiDataScientist.ts. Markdown twin from `renderAiDataScientistBody`.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import { PowNav } from "../components/pow/PowNav";
import InsightLab from "../components/pow/ds/InsightLab";
import {
  AI_DATA_SCIENTIST_PATH,
  aiDataScientistCases,
  aiDataScientistDescription,
  aiDataScientistProfiles,
} from "../content/aiDataScientist";
import { pageUpdatedAt } from "../content/siteMeta";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External profile link. */
function External({ href, children }: { href: string; children: string }) {
  const external = href.startsWith("http");
  if (!external) {
    return (
      <Link to={href} className="link-underline">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** AI data scientist proof-of-work page. */
export default function AiDataScientistPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(AI_DATA_SCIENTIST_PATH)}#webpage`,
    url: canonicalUrl(AI_DATA_SCIENTIST_PATH),
    name: "AI data science proof of work",
    description: aiDataScientistDescription,
    dateModified: pageUpdatedAt("ai-data-scientist"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="AI data science proof of work"
        description={aiDataScientistDescription}
        path={AI_DATA_SCIENTIST_PATH}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <p className="label">Ayush Rai · AI data science / proof of work</p>
        <h1 className="mt-3 max-w-measure font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
          Find the signal. Test the assumption. Make the decision.
        </h1>
        <p className="mt-5 max-w-measure text-lg leading-relaxed text-ink-muted">
          I build data-driven solutions by combining rigorous analysis, predictive modeling,
          evaluation, and practical decision-making.
        </p>
        <p className="mt-4 max-w-measure leading-relaxed text-ink-muted">
          I turn data into evidence, models into decisions, and experiments into measurable learning.
          I combine statistical reasoning, machine learning, experimentation, and software engineering
          to investigate complex problems and build data-driven systems. The workbench below is a
          synthetic demonstration of that stance. The project notes say only what the repositories support.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#workbench" className="btn-primary">
            Explore the data science workbench
          </a>
          <a href="#projects" className="btn-secondary">
            Inspect my analytical projects
          </a>
        </div>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {aiDataScientistProfiles.map((profile) => (
            <External key={profile.href} href={profile.href}>
              {profile.label}
            </External>
          ))}
        </p>
        <div className="mt-8">
          <PowNav />
        </div>

        <section className="mt-16 max-w-measure" aria-labelledby="philosophy">
          <h2 id="philosophy" className="font-display text-2xl text-ink md:text-3xl">
            A model is only as useful as the decision it improves.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-muted">
            Question, then data, then validation, exploration, a hypothesis, a baseline, a model,
            an evaluation, an error analysis, a decision, and monitoring. The objective has to be
            named before the model is chosen. A flexible model does not repair an unclear decision.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
            <li>Description says what happened in the sample. Prediction says what the fit expects on new rows from the same process.</li>
            <li>A prediction is not a causal effect. Correlation is not causation.</li>
            <li>A small p-value is not practical importance.</li>
            <li>Training fit is not generalization. Accuracy, or a low error, is not the same as a better decision.</li>
            <li>A forecast is not a recommendation. Someone still has to choose, under constraints the forecast does not know.</li>
          </ul>
          <p className="mt-4 leading-relaxed text-ink-muted">
            I am not claiming a research record in every method this page names. Where the repository
            has the work, the note says so. Everywhere else, the label is synthetic or proposed.
            A model does not replace judgment about what the decision is allowed to do.
          </p>
        </section>

        <InsightLab />

        <section className="mt-16 border-t border-rule pt-10" aria-labelledby="projects">
          <h2 id="projects" className="font-display text-2xl text-ink md:text-3xl">
            Repositories I inspected
          </h2>
          <p className="mt-4 max-w-measure text-ink-muted">
            Each note is labeled. An inspected repository is code I opened. A published note repeats
            a record already on this site. A limited claim is someone else’s design or a system that
            is not a statistical result. Not found means I did not locate the project.
          </p>
          <div className="mt-8 space-y-8">
            {aiDataScientistCases.map((item) => (
              <article key={item.id} className="border-b border-rule pb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <span className="border border-rule px-2 py-0.5 font-mono text-[11px] uppercase tracking-label text-ink-muted">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 max-w-measure leading-relaxed text-ink-muted">{item.body}</p>
                {item.href && (
                  <p className="mt-2 text-sm">
                    <External href={item.href}>{item.href.startsWith("/") ? "On this site" : "Repository or live page"}</External>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
