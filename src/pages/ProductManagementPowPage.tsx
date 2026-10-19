/**
 * `/pow/product-management`: a product-management proof of work built around RevenueRoles.
 *
 * The page is a notebook: a six-stage framework, a case study, a discovery workspace, a journey,
 * a scoring explorer, an example PRD, metric definitions, a proposed experiment, a synthetic funnel,
 * an engineering chain, and a proposed roadmap. Copy lives in src/content/productManagementPow.ts.
 * Interactions stay in the browser. There is no backend and no model call.
 *
 * Connects to:
 * - Routed as `pow/product-management` in src/App.tsx. Prerendered in src/lib/publicRoutes.ts.
 * - Markdown twin via `renderProductManagementBody` in src/lib/agent/markdown.ts.
 * - Components in src/components/pow/. PageSEO, and canonical helpers.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import { EngineeringChain, RoadmapBoard } from "../components/pow/PmDelivery";
import { CaseStudyPanel, DiscoveryPanel, FrameworkPanel, JourneyPanel } from "../components/pow/PmExplore";
import { PrdDocument, PrioritizationExplorer } from "../components/pow/PmDecide";
import { AnalyticsSample, ExperimentExplorer, MetricPanel } from "../components/pow/PmMeasure";
import { NotebookSection, PowLinks, StatusMark } from "../components/pow/PmChrome";
import {
  learnings,
  otherWork,
  productManagementDescription,
  productManagementToc,
  PRODUCT_MANAGEMENT_PATH,
} from "../content/productManagementPow";
import { pageUpdatedAt, person } from "../content";
import { canonicalUrl, personId, websiteId } from "../lib/canonical";

/** External link that opens in a new tab. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
      {children}
    </a>
  );
}

/** Product-management proof of work. Lazy-loaded by the route in src/App.tsx. */
export default function ProductManagementPowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(PRODUCT_MANAGEMENT_PATH)}#webpage`,
    url: canonicalUrl(PRODUCT_MANAGEMENT_PATH),
    name: "Product management proof of work",
    description: productManagementDescription,
    dateModified: pageUpdatedAt("pow"),
    isPartOf: { "@id": websiteId() },
    about: { "@id": personId() },
  };

  return (
    <>
      <PageSEO
        title="Product management"
        description={productManagementDescription}
        path={PRODUCT_MANAGEMENT_PATH}
        jsonLd={jsonLd}
      />
      <article>
        <header className="site-shell pb-10 pt-16 md:pt-24">
          <PowLinks />
          <p className="label mb-3 mt-8">Product management / Proof of work</p>
          <h1 className="max-w-[18ch] font-display text-4xl leading-tight text-ink sm:text-5xl">
            I turn ambiguous problems into products people can use.
          </h1>
          <p className="mt-5 max-w-measure text-lg leading-relaxed text-ink-muted">
            I work across problem discovery, product strategy, prioritization, engineering, and measurement
            to build products that solve practical problems.
          </p>
          <p className="mt-6 max-w-measure border-l-2 border-accent pl-4 text-ink">
            Start with the problem. Make the trade-offs explicit. Ship the smallest useful solution. Measure
            what happens. Improve from evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#case-study" className="btn-primary">
              Explore the case study
            </a>
            <Link to="/products" className="btn-secondary">
              View my products
            </Link>
          </div>
          <p className="mt-6 max-w-measure text-sm leading-relaxed text-ink-faint">
            Ayush Rai. This is a working notebook about{" "}
            <ExternalLink href="https://revenueroles.in/">RevenueRoles</ExternalLink>, not a record of a
            product-management title or of commercial results. Inventory figures are the live site’s own
            counts. Where a number was not measured, the page says so.
          </p>
        </header>

        <div className="sticky top-14 z-30 border-y border-rule bg-paper/95 backdrop-blur-md md:top-16">
          <nav aria-label="On this page" className="site-shell flex gap-4 overflow-x-auto py-3 text-sm">
            {productManagementToc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="shrink-0 text-ink-muted hover:text-ink">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="site-shell pb-20">
          <NotebookSection
            id="framework"
            number="01"
            title="How I think about products"
            intro="Six questions I want answered before a feature is treated as progress. Select a stage."
          >
            <FrameworkPanel />
          </NotebookSection>

          <NotebookSection
            id="case-study"
            number="02"
            title="RevenueRoles: Helping people move from job discovery to informed decisions."
            intro="The product question: how might we help users identify relevant opportunities and make better-informed decisions about which ones deserve their attention? The answer below is split into what the product does and what this notebook proposes."
          >
            <CaseStudyPanel />
          </NotebookSection>

          <NotebookSection
            id="discovery"
            number="03"
            title="Problem discovery"
            intro="The primary segment for this case is a candidate comparing revenue-technical roles. Their intended outcome, as a hypothesis, is to spend application time on a few roles whose work matches. The groups below keep verified product behavior apart from everything still untested."
          >
            <DiscoveryPanel />
          </NotebookSection>

          <NotebookSection
            id="journey"
            number="04"
            title="From discovery to a decision"
            intro="Discover an opportunity, inspect the role, evaluate relevance, compare alternatives, decide whether to apply, then track the decision. The first steps describe the live product. The later steps are proposed."
          >
            <JourneyPanel />
          </NotebookSection>

          <NotebookSection
            id="prioritize"
            number="05"
            title="Opportunity prioritization"
            intro="These initiatives are proposals, except where the note says the live product already does part of the work. The scores are starting estimates. They are not research findings and they do not measure business impact."
          >
            <PrioritizationExplorer />
          </NotebookSection>

          <NotebookSection
            id="prd"
            number="06"
            title="Example requirements: freshness and duplicates"
            intro="One specification an engineer could test. It is not a claim that RevenueRoles already behaves this way. Open a section to read it."
          >
            <PrdDocument />
          </NotebookSection>

          <NotebookSection
            id="metrics"
            number="07"
            title="Metrics"
            intro="How I would tell whether RevenueRoles is helping someone decide. The north star is a candidate, not a metric the product has adopted. Every baseline is unmeasured."
          >
            <MetricPanel />
          </NotebookSection>

          <NotebookSection
            id="experiment"
            number="08"
            title="Experiment design"
            intro="A design for a freshness label. It is proposed. It has not been run, and a movement in a proxy would not prove that anyone got a better job."
          >
            <ExperimentExplorer />
          </NotebookSection>

          <NotebookSection
            id="analytics"
            number="09"
            title="How a funnel would be read"
            intro="A sample analytics view for a funnel that is only partly real. Discovery and detail views could be instrumented. Saves, revisits, and application intent are not events the product collects today."
          >
            <AnalyticsSample />
          </NotebookSection>

          <NotebookSection
            id="engineering"
            number="10"
            title="Product and engineering"
            intro="The same freshness and duplicate decision, followed into the work it would create. The technical design is proposed."
          >
            <EngineeringChain />
          </NotebookSection>

          <NotebookSection
            id="roadmap"
            number="11"
            title="Roadmap and trade-offs"
            intro="Ordered by the outcome each theme is for, not by how recognizable the feature is."
          >
            <RoadmapBoard />
          </NotebookSection>

          <NotebookSection
            id="learnings"
            number="12"
            title="What I will not pretend to know"
            intro="No retrospective from an experiment that did not happen. Where the evidence stops, the item stays an open question or a risk."
          >
            <ul className="divide-y divide-rule border-y border-rule">
              {learnings.map((item) => (
                <li key={item.title} className="py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg text-ink">{item.title}</h3>
                    <StatusMark kind={item.status} />
                  </div>
                  <p className="mt-2 max-w-measure leading-relaxed text-ink-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </NotebookSection>

          <NotebookSection
            id="other-work"
            number="13"
            title="Other work"
            intro="A short set of products and projects, and the product decision each one actually demonstrates."
          >
            <ul className="divide-y divide-rule border-y border-rule">
              {otherWork.map((item) => (
                <li key={item.title} className="py-5">
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 max-w-measure leading-relaxed text-ink-muted">{item.demonstrates}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {item.links.map((link) =>
                      link.external ? (
                        <ExternalLink key={link.href} href={link.href}>
                          {link.label}
                        </ExternalLink>
                      ) : (
                        <Link key={link.href} to={link.href} className="link-underline">
                          {link.label}
                        </Link>
                      ),
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </NotebookSection>

          <NotebookSection id="close" number="14" title="Close">
            <p className="max-w-measure font-display text-2xl leading-snug text-ink">
              I care about understanding the problem, making the trade-offs explicit, and shipping something useful.
            </p>
            <nav aria-label="Closing links" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link to="/" className="link-underline">
                Main website
              </Link>
              <ExternalLink href={person.primaryProfiles.github}>GitHub</ExternalLink>
              <ExternalLink href={person.primaryProfiles.linkedin}>LinkedIn</ExternalLink>
              <Link to="/pow/fde" className="link-underline">
                FDE proof of work
              </Link>
              <Link to={PRODUCT_MANAGEMENT_PATH} className="link-underline">
                Product management proof of work
              </Link>
            </nav>
          </NotebookSection>
        </div>
      </article>
    </>
  );
}
