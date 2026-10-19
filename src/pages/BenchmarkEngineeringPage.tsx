/**
 * /pow/ai-benchmark: EVALFORGE, a personal evaluation demonstration.
 *
 * Composes the hero, principles, lifecycle, specification, dataset inspector,
 * playground, scoring methods, results, statistical reading, and a provenance
 * note that separates contract work from this fixture. Aggregates are computed
 * from stored records. The page does not call a model.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/ai-benchmark`. `pow/benchmark-engineering` redirects there.
 * - Prerendered from src/lib/publicRoutes.ts. Markdown via renderBenchmarkBody.
 * - Content from src/content/benchmarkEngineering.ts. Components in
 *   src/components/benchmark/. PageSEO, PageHeader, SectionHeading, ContactCta.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import SectionHeading from "../components/editorial/SectionHeading";
import DatasetInspector from "../components/benchmark/DatasetInspector";
import LifecyclePanel from "../components/benchmark/LifecyclePanel";
import Playground from "../components/benchmark/Playground";
import { PowNav } from "../components/pow/PowNav";
import ReliabilityPanel from "../components/benchmark/ReliabilityPanel";
import ResultsDashboard from "../components/benchmark/ResultsDashboard";
import ScoringPanel from "../components/benchmark/ScoringPanel";
import {
  benchmarkPage,
  benchmarkPrinciples,
  benchmarkPriorWork,
  benchmarkSpec,
  demonstrationRun,
  pageUpdatedAt,
  person,
} from "../content";
import { specificationStatus } from "../lib/benchmark/aggregate";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** EVALFORGE page. Lazy-loaded by the benchmark-engineering route. */
export default function BenchmarkEngineeringPage() {
  const run = demonstrationRun();
  const checks = specificationStatus(run);
  const [principle, setPrinciple] = useState(0);
  const [specCategory, setSpecCategory] = useState<"coding" | "reasoning">("coding");
  const category = benchmarkSpec.categories[specCategory];
  const activePrinciple = benchmarkPrinciples[principle] ?? benchmarkPrinciples[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(benchmarkPage.path)}#webpage`,
    url: canonicalUrl(benchmarkPage.path),
    name: benchmarkPage.title,
    description: benchmarkPage.description,
    dateModified: pageUpdatedAt("pow"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title={benchmarkPage.title}
        description={benchmarkPage.description}
        path={benchmarkPage.path}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <PageHeader
          label={benchmarkPage.eyebrow}
          title={benchmarkPage.headline}
          dek={benchmarkPage.support}
          updated={pageUpdatedAt("pow")}
        />
        <p className="max-w-measure text-ink-muted leading-relaxed">
          {benchmarkPage.projectName} — {benchmarkPage.projectLine}. {benchmarkPage.status} The
          walkthrough covers how a task is specified, how a dataset is checked, how a response is
          scored, and how a small sample should be read. It does not establish that a benchmark is
          valid because the page has charts.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#playground" className="btn-primary">
            Explore the benchmark
          </a>
          <a href="#lifecycle" className="btn-secondary">
            Inspect the evaluation methodology
          </a>
          <a
            href={person.primaryProfiles.github}
            className="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <PowNav />

        <section className="mt-16" id="thesis">
          <SectionHeading number="01" title="The engineering thesis" />
          <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <div className="flex flex-col gap-2" role="group" aria-label="Principles">
              {benchmarkPrinciples.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-pressed={principle === index}
                  onClick={() => setPrinciple(index)}
                  className={`border px-3 py-2 text-left text-sm ${
                    principle === index ? "border-ink bg-accent-soft text-ink" : "border-rule text-ink-muted"
                  }`}
                >
                  {index + 1}. {item.title}
                </button>
              ))}
            </div>
            {activePrinciple && (
              <div className="border border-rule bg-paper-elevated p-5" aria-live="polite">
                <p className="text-ink leading-relaxed">{activePrinciple.explanation}</p>
                <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                  <span className="label mr-2">Example</span>
                  {activePrinciple.example}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-16" id="lifecycle">
          <SectionHeading number="02" title="The evaluation lifecycle" />
          <LifecyclePanel />
        </section>

        <section className="mt-16" id="specification">
          <SectionHeading number="03" title="Benchmark specification" />
          <div className="max-w-measure space-y-3 text-sm leading-relaxed text-ink-muted">
            <p><span className="text-ink">Name. </span>{benchmarkSpec.name}</p>
            <p><span className="text-ink">Question. </span>{benchmarkSpec.question}</p>
            <p><span className="text-ink">Capability. </span>{benchmarkSpec.capability}</p>
            <p><span className="text-ink">Unit. </span>{benchmarkSpec.unit}</p>
            <p><span className="text-ink">Output. </span>{benchmarkSpec.outputFormat}</p>
            <p><span className="text-ink">Acceptance. </span>{benchmarkSpec.acceptance}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Task category">
            <button
              type="button"
              aria-pressed={specCategory === "coding"}
              onClick={() => setSpecCategory("coding")}
              className={`border px-3 py-1.5 text-sm ${specCategory === "coding" ? "border-ink bg-accent-soft" : "border-rule text-ink-muted"}`}
            >
              Coding correctness
            </button>
            <button
              type="button"
              aria-pressed={specCategory === "reasoning"}
              onClick={() => setSpecCategory("reasoning")}
              className={`border px-3 py-1.5 text-sm ${specCategory === "reasoning" ? "border-ink bg-accent-soft" : "border-rule text-ink-muted"}`}
            >
              Structured reasoning
            </button>
          </div>
          <article className="mt-4 border border-rule bg-paper-elevated p-5" aria-live="polite">
            <h3 className="font-display text-xl text-ink">{category.title}</h3>
            <p className="mt-3 text-sm text-ink-muted">{category.question}</p>
            <p className="mt-3 text-sm text-ink-muted"><span className="label mr-2">Rule</span>{category.rule}</p>
            <p className="mt-3 text-sm text-ink-muted"><span className="label mr-2">Limit</span>{category.limitation}</p>
          </article>
          <h3 className="mt-8 font-display text-xl text-ink">Checks against this fixture</h3>
          <ul className="mt-3 space-y-2">
            {checks.map((check) => (
              <li key={check.id} className="border border-rule px-3 py-2 text-sm">
                <span className="font-mono text-xs text-ink-faint">{check.met ? "met" : "not met"}</span>
                <p className="mt-1 text-ink">{check.label}</p>
                <p className="text-ink-muted">{check.detail}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-display text-xl text-ink">Known limitations</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-muted">
            {benchmarkSpec.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16" id="dataset">
          <SectionHeading number="04" title="Dataset quality" />
          <DatasetInspector />
        </section>

        <section className="mt-16" id="playground">
          <SectionHeading number="05" title="Evaluation playground" />
          <Playground run={run} />
        </section>

        <section className="mt-16" id="scoring">
          <SectionHeading number="06" title="Scoring engine" />
          <ScoringPanel run={run} />
        </section>

        <section className="mt-16" id="results">
          <SectionHeading number="07" title="Results" />
          <ResultsDashboard run={run} />
        </section>

        <section className="mt-16" id="reliability">
          <SectionHeading number="08" title="Statistical reliability" />
          <ReliabilityPanel run={run} />
        </section>

        <section className="mt-16" id="provenance">
          <SectionHeading number="09" title="What is verified, what is demonstrated, what is later" />
          <div className="max-w-measure space-y-6">
            {benchmarkPriorWork.map((item) => (
              <article key={item.title}>
                <h3 className="text-lg text-ink">
                  {item.href ? (
                    item.href.startsWith("/") ? (
                      <Link to={item.href} className="link-underline">
                        {item.title}
                      </Link>
                    ) : (
                      <a href={item.href} className="link-underline" target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    )
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </article>
            ))}
            <p className="text-sm leading-relaxed text-ink-muted">
              The pass counts above are the demonstration. A later phase can supply an EvaluationRun
              from a service. This phase does not queue jobs, store traces from a runner, or send
              prompts to a model API.
            </p>
          </div>
        </section>

        <ContactCta prompt="If you want to talk about evaluation design, rubric rules, or a system that has to show its work, write or schedule a call." />
      </article>
    </>
  );
}
