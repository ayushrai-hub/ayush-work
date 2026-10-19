/**
 * `/pow/agentic-ai`: agentic AI engineering proof of work.
 *
 * Composes the ORBIT demonstration: a scripted controller, a tool registry, approval,
 * failure scenarios, and illustrative metrics. The page does not call a model. The run
 * state lives in this component so the workbench and the approval panel share it.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/agentic-ai`; prerendered via STATIC_PAGES.
 * - src/content/agenticPow.ts, src/lib/orbit/simulation.ts, src/components/orbit/*.
 * - src/components/pow/PowNav.tsx. Markdown twin from `renderAgenticPowBody`.
 */
import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PowNav } from "../components/pow/PowNav";
import ArchitectureMap from "../components/orbit/ArchitectureMap";
import ApprovalPanel from "../components/orbit/ApprovalPanel";
import DecisionExplorer from "../components/orbit/DecisionExplorer";
import EvaluationPanel from "../components/orbit/EvaluationPanel";
import ExecutionTrace from "../components/orbit/ExecutionTrace";
import FailureLab from "../components/orbit/FailureLab";
import ObservabilityPanel from "../components/orbit/ObservabilityPanel";
import StateInspector from "../components/orbit/StateInspector";
import ToolRegistry from "../components/orbit/ToolRegistry";
import Workbench from "../components/orbit/Workbench";
import PageSEO from "../components/site/PageSEO";
import {
  AGENTIC_PATH,
  agenticPow,
  agenticPowDescription,
  agenticRelatedWork,
  agenticRoadmap,
  agenticSafeguards,
  agenticThesis,
  pageUpdatedAt,
  person,
} from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";
import { createRun } from "../lib/orbit/simulation";
import type { Run } from "../lib/orbit/types";

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Numbered section with a stable id for in-page links. */
function Section({
  id,
  number,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-20 scroll-mt-28" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="font-display text-2xl text-ink md:text-[1.75rem]">
        <span className="mr-3 font-mono text-sm text-ink-faint">{number}</span>
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-measure text-ink-muted leading-relaxed">{intro}</p>}
      <div className={intro ? "mt-8" : "mt-6"}>{children}</div>
    </section>
  );
}

/** Agentic AI proof-of-work page. Lazy-loaded by the `pow/agentic-ai` route. */
export default function AgenticPowPage() {
  const [run, setRun] = useState<Run>(() => createRun("investigate"));
  const related = agenticRelatedWork();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(AGENTIC_PATH)}#webpage`,
    url: canonicalUrl(AGENTIC_PATH),
    name: agenticPow.title,
    description: agenticPowDescription,
    dateModified: pageUpdatedAt("pow"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title={agenticPow.title}
        description={agenticPowDescription}
        path={AGENTIC_PATH}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <header className="max-w-[46rem]">
          <p className="label">{agenticPow.eyebrow}</p>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
            {agenticPow.headline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{agenticPow.support}</p>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-ink-muted">{agenticPow.status}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn-primary" href="#workbench">Explore the agent workbench</a>
            <a className="btn-secondary" href="#architecture">Inspect the architecture</a>
          </div>
          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
            <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
            <Link to="/" className="link-underline">ayushrai.site</Link>
          </p>
          <div className="mt-6">
            <PowNav />
          </div>
        </header>

        <Section
          id="thesis"
          number="02"
          title="An agent is more than an LLM call."
          intro="Reasoning can propose a step. Execution is a transition the controller allows. A sentence that says a task was created is not evidence. The workbench only treats the task as done after it reads the row back from the fixture store."
        >
          <ul className="max-w-measure list-disc space-y-2 pl-5 text-ink-muted">
            {agenticThesis.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Section>

        <Section
          id="workbench"
          number="03"
          title="Agent workbench"
          intro="Four scripted tasks. Each step is deterministic. Run them one at a time, or run until the controller stops for approval or finishes."
        >
          <Workbench run={run} onRun={setRun} />
        </Section>

        <Section
          id="trace"
          number="04"
          title="Execution trace"
          intro="The same run, as a timeline. Open a step for its input, output, attempts, and evidence ids."
        >
          <ExecutionTrace run={run} />
        </Section>

        <Section
          id="tools"
          number="05"
          title="Tool registry"
          intro="Eight tools. Reads are separate from the write. Malformed JSON and unknown keys are rejected before a handler runs. The try-it store is not the workbench run."
        >
          <ToolRegistry />
        </Section>

        <Section
          id="state"
          number="06"
          title="State and memory"
          intro="Execution state is this run. Working context is the evidence it has collected. Persistent memory is not built."
        >
          <StateInspector run={run} />
        </Section>

        <Section
          id="architecture"
          number="07"
          title="Orchestration architecture"
          intro="The execution controller decides which transition is legal. A model, if one were added later, could propose a plan. It would not grant itself a tool or a success status."
        >
          <ArchitectureMap />
        </Section>

        <Section
          id="decisions"
          number="08"
          title="Design decisions"
          intro="The simplest controller that can show the control is the one this page uses. More agents are not treated as an improvement."
        >
          <DecisionExplorer />
        </Section>

        <Section
          id="failures"
          number="09"
          title="Failure lab"
          intro="Eight scripted failures. Replay returns the same outcome. Nothing here is a random fault."
        >
          <FailureLab />
        </Section>

        <Section
          id="approval"
          number="10"
          title="Human approval"
          intro="Proposed, approved, executed, and verified are different states. Rejecting a proposal does not write. Approving does not, by itself, verify."
        >
          <ApprovalPanel run={run} onRun={setRun} />
        </Section>

        <Section
          id="evaluation"
          number="11"
          title="Evaluation"
          intro="Reliability is not only whether a task ended. A write without approval, or a success the store cannot show, does not count."
        >
          <EvaluationPanel />
        </Section>

        <Section
          id="observability"
          number="12"
          title="Observability"
          intro="These are the records a runner should keep. Cost, latency, and model request ids are blank here because they were not produced."
        >
          <ObservabilityPanel run={run} />
        </Section>

        <Section
          id="security"
          number="13"
          title="Security and control"
          intro="The rows marked demonstrated are behaviors of this page. The rows marked backend are not implemented and are not claimed."
        >
          <ul className="space-y-4">
            {agenticSafeguards.map((item) => (
              <li key={item.threat} className="border-t border-rule pt-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-display text-lg text-ink">{item.threat}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-label text-ink-faint">
                    {item.where === "demonstrated" ? "Shown on this page" : "Needs a backend"}
                  </span>
                </div>
                <p className="mt-2 max-w-measure text-sm text-ink-muted">{item.safeguard}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="roadmap"
          number="14"
          title="Implementation roadmap"
          intro="Statuses describe this repository today."
        >
          <ol className="space-y-4">
            {agenticRoadmap.map((phase) => (
              <li key={phase.phase} className="border-t border-rule pt-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-display text-lg text-ink">Phase {phase.phase}. {phase.title}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-label text-ink-faint">{phase.status}</span>
                </div>
                <p className="mt-2 max-w-measure text-sm text-ink-muted">{phase.detail}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="related"
          number="15"
          title="Related work"
          intro="What each project actually implements, and the habit it shares with this page. None of these is described as a production multi-agent system."
        >
          <ul className="space-y-8">
            {related.map((item) => (
              <li key={item.title} className="border-t border-rule pt-6">
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 max-w-measure text-sm leading-relaxed text-ink-muted">{item.detail}</p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {item.links.map((link) => (
                    link.href.startsWith("/")
                      ? <Link key={link.href} to={link.href} className="link-underline">{link.label}</Link>
                      : <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <section id="closing" className="mt-20 scroll-mt-28 border-t border-rule pt-10">
          <p className="max-w-measure font-display text-2xl leading-snug text-ink">
            An agent is only as useful as the work it can reliably complete—and the evidence that it completed it.
          </p>
          <div className="mt-6">
            <PowNav />
          </div>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
            <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
            <Link to="/" className="link-underline">Personal site</Link>
          </p>
        </section>
      </article>
    </>
  );
}
