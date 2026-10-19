/**
 * `/pow/ml-engineer`: machine-learning engineering proof of work.
 *
 * The hero states the stance. `MlLab` is a browser simulation of a retail-demand lifecycle over
 * synthetic rows. Case-study claims live in `mlEngineerPow` and stay inside what the repositories
 * support. The page does not call a trainer or a model API.
 *
 * Connects to:
 * - Routed in src/App.tsx as `pow/ml-engineer`. Prerendered in src/lib/publicRoutes.ts.
 * - Markdown twin via `renderMlEngineerBody` in src/lib/agent/markdown.ts.
 * - src/components/pow/ml/Lab.tsx, src/components/pow/PmChrome.tsx (`PowLinks`), PageSEO.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import MlLab from "../components/pow/ml/Lab";
import { PowLinks } from "../components/pow/PmChrome";
import {
  ML_ENGINEER_PATH,
  ML_HEADLINE,
  ML_PRINCIPLES,
  ML_SUPPORT,
  mlEngineerDescription,
} from "../content/mlEngineerPow";
import { pageUpdatedAt, person } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External profile link. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Machine-learning proof-of-work page. Lazy-loaded by the `pow/ml-engineer` route. */
export default function MlEngineerPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(ML_ENGINEER_PATH)}#webpage`,
    url: canonicalUrl(ML_ENGINEER_PATH),
    name: "Machine learning engineering",
    description: mlEngineerDescription,
    dateModified: pageUpdatedAt("ml-engineer"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="Machine learning engineering"
        description={mlEngineerDescription}
        path={ML_ENGINEER_PATH}
        jsonLd={jsonLd}
      />
      <article className="site-shell page-section">
        <PowLinks />
        <div className="mt-8">
          <PageHeader
            label={`${person.name} · Machine learning engineering`}
            title={ML_HEADLINE}
            dek={ML_SUPPORT}
            updated={pageUpdatedAt("ml-engineer")}
          />
        </div>
        <p className="max-w-measure text-sm text-ink-muted">
          Frontend simulation. The lab uses a synthetic retail-demand table and disclosed functions. It does not train, serve, or monitor a real model.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {ML_PRINCIPLES.map((principle) => (
            <li key={principle} className="border-t border-rule py-2 text-sm text-ink">
              {principle}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#ml-systems-lab" className="btn-primary">
            Explore the ML lifecycle
          </a>
          <a href="#case-studies" className="btn-secondary">
            Inspect my projects
          </a>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li>
            <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
          </li>
          <li>
            <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
          </li>
          <li>
            <Link to="/" className="link-underline">
              {person.siteUrl.replace("https://", "")}
            </Link>
          </li>
        </ul>
        <nav aria-label="Lifecycle stages" className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {[
            ["#problem", "Problem"],
            ["#data", "Data"],
            ["#features", "Features"],
            ["#training", "Training"],
            ["#experiments", "Experiments"],
            ["#evaluation", "Evaluation"],
            ["#registry", "Artifacts"],
            ["#inference", "Inference"],
            ["#performance", "Performance"],
            ["#monitoring", "Monitoring"],
            ["#retraining", "Retraining"],
            ["#architecture", "Architecture"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="link-underline text-ink-muted">
              {label}
            </a>
          ))}
        </nav>
        <MlLab />
      </article>
    </>
  );
}
