import { Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import PageSEO from "../components/site/PageSEO";
import SectionHeading from "../components/editorial/SectionHeading";
import WorkRow from "../components/editorial/WorkRow";
import Prose from "../components/editorial/Prose";
import RoleSelector from "../components/site/RoleSelector";
import {
  featuredProducts,
  formatUpdated,
  ideas,
  now,
  pageUpdatedAt,
  person,
  principles,
  productCategoryLabels,
  productStageLabels,
  research,
  selectedWork,
  writing,
} from "../content";
import UpdatedMeta from "../components/editorial/UpdatedMeta";
import {
  HOME_SECTION_ORDER,
  parseAudience,
  rankWorkForAudience,
  type HomeSectionId,
} from "../lib/agent/audiences";

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [params] = useSearchParams();
  const audience = parseAudience(params.get("audience"));
  const rankedWork = rankWorkForAudience(audience, selectedWork);
  const sectionOrder = HOME_SECTION_ORDER[audience];
  const sectionNumber = (id: HomeSectionId) =>
    String(sectionOrder.indexOf(id) + 1).padStart(2, "0");
  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: "easeOut" as const },
      };

  const pullQuote = principles[0];

  return (
    <>
      <PageSEO
        description={person.tagline}
        path="/"
        personSchema
        noIndex={Boolean(params.get("audience"))}
      />

      <section className="site-shell page-section pt-16 md:pt-24">
        <motion.div
          {...fade}
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16"
        >
          <div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-ink">
              {person.name}
            </h1>
            <p className="mt-6 max-w-measure text-xl md:text-2xl font-display text-ink leading-snug">
              {person.tagline}
            </p>
            <Prose className="mt-6">
              <p>{person.positioning}</p>
            </Prose>
            <p className="meta-row mt-6">
              <span>{person.location}</span>
              <span aria-hidden="true">·</span>
              <span>AI + software + products</span>
            </p>
            <UpdatedMeta
              date={pageUpdatedAt("home")}
              label="Info updated"
              className="mt-3"
            />
            <nav
              className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
              aria-label="Primary links"
            >
              <a
                href={person.primaryProfiles.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                GitHub
              </a>
              <a
                href={person.primaryProfiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                LinkedIn
              </a>
              <a
                href={person.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                Resume
              </a>
              <a
                href={person.resumeDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
                download="AyushRai.pdf"
              >
                Download
              </a>
              <a
                href={`mailto:${person.email}`}
                className="link-underline"
              >
                Email
              </a>
              <a
                href={person.primaryProfiles.cal}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                Calendly
              </a>
            </nav>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/work" className="btn-primary">
                Work
              </Link>
              <Link to="/about" className="btn-secondary">
                About
              </Link>
              <a href="#go-deeper" className="btn-ghost">
                Go deeper
              </a>
            </div>
          </div>
          {person.portrait && (
            <figure className="order-first w-28 sm:w-36 lg:order-none lg:w-full lg:pt-2">
              <img
                src={person.portrait}
                alt={`${person.name}`}
                width={448}
                height={560}
                className="aspect-[4/5] w-full object-cover object-top grayscale-[15%] contrast-[1.02]"
                loading="eager"
                decoding="async"
              />
              <figcaption className="mt-2 font-mono text-xs text-ink-faint">
                {person.location}
              </figcaption>
            </figure>
          )}
        </motion.div>
      </section>

      <section
        id="go-deeper"
        className="site-shell page-section border-t border-rule scroll-mt-20"
      >
        <SectionHeading number="00" title="Go deeper" />
        <Prose>
          <p>
            If you’d like to read more about who I am, what I’ve built, and how
            the work connects, these are the best places to start.
          </p>
        </Prose>
        <ul className="mt-8 max-w-measure divide-y divide-rule border-y border-rule">
          <li>
            <Link
              to="/about"
              className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-display text-lg text-ink group-hover:text-accent">
                About
              </span>
              <span className="text-sm text-ink-muted sm:text-right">
                Background, path, and how I got here
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/work"
              className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-display text-lg text-ink group-hover:text-accent">
                Work
              </span>
              <span className="text-sm text-ink-muted sm:text-right">
                Case studies across products, projects, and clients
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/timeline"
              className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-display text-lg text-ink group-hover:text-accent">
                Timeline
              </span>
              <span className="text-sm text-ink-muted sm:text-right">
                Chronology of roles, builds, and transitions
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/writing"
              className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-display text-lg text-ink group-hover:text-accent">
                Writing
              </span>
              <span className="text-sm text-ink-muted sm:text-right">
                Notes and longer pieces when they exist
              </span>
            </Link>
          </li>
          {person.deepDive && (
            <li>
              <a
                href={person.deepDive.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="font-display text-lg text-ink group-hover:text-accent">
                  {person.deepDive.label}
                  <span className="ml-2 font-sans text-xs text-ink-faint">
                    ↗
                  </span>
                </span>
                <span className="text-sm text-ink-muted sm:text-right">
                  {person.deepDive.description}
                </span>
              </a>
            </li>
          )}
        </ul>
      </section>

      <div className="site-shell border-t border-rule pt-10">
        <RoleSelector />
      </div>

      {sectionOrder.map((id) => (
        <Fragment key={id}>
          {id === "now" && (
      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number={sectionNumber("now")}
          title="Now"
          link={{ to: "/now", label: "Full now →" }}
        />
        <ul className="max-w-measure space-y-2 text-ink-muted">
          {now.workingOn.slice(0, 3).map((item) => (
            <li key={item} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-xs text-ink-faint">
          <time dateTime={now.lastUpdated}>
            Now section updated {formatUpdated(now.lastUpdated)}
          </time>
        </p>
      </section>
          )}
          {id === "work" && (
      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number={sectionNumber("work")}
          title="Selected work"
          link={{ to: "/work", label: "All work →" }}
        />
        <ul className="border-b border-rule">
          {rankedWork.map((item) => (
            <WorkRow key={item.slug} item={item} />
          ))}
        </ul>
      </section>
          )}
          {id === "products" && (

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number={sectionNumber("products")}
          title="Things I build"
          link={{ to: "/products", label: "Products →" }}
        />
        <ul className="border-b border-rule">
          {featuredProducts().map((p) => (
            <li key={p.slug} className="border-t border-rule py-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="font-display text-2xl text-ink">
                  <Link
                    to={`/products/${p.slug}`}
                    className="hover:text-accent"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="meta-row">
                  <span>{productStageLabels[p.stage]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{productCategoryLabels[p.category]}</span>
                </p>
              </div>
              <p className="mt-2 max-w-measure text-ink-muted leading-relaxed">
                {p.summary}
              </p>
              {p.descriptors && p.descriptors.length > 0 && (
                <p className="meta-row mt-2">
                  {p.descriptors.map((descriptor, index) => (
                    <span key={descriptor}>
                      {index > 0 && (
                        <span aria-hidden="true" className="mx-2">
                          ·
                        </span>
                      )}
                      {descriptor}
                    </span>
                  ))}
                </p>
              )}
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link
                  to={`/products/${p.slug}`}
                  className="link-accent"
                  aria-label={`${p.title} product detail`}
                >
                  Product detail
                </Link>
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-accent"
                    aria-label={`${p.title} live site`}
                  >
                    Live site
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-accent"
                    aria-label={`${p.title} source repository`}
                  >
                    Source repository
                  </a>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
          )}
          {id === "research" && (
      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number={sectionNumber("research")}
          title="Things I think about"
          link={{ to: "/research", label: "Research →" }}
        />
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="label mb-3">Research</p>
            <ul className="space-y-4">
              {research.slice(0, 2).map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/research/${r.slug}`}
                    className="link-underline font-medium"
                  >
                    {r.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">{r.summary}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-3">Ideas</p>
            <ul className="space-y-4">
              {ideas.slice(0, 2).map((idea) => (
                <li key={idea.slug}>
                  <Link to="/ideas" className="link-underline font-medium">
                    {idea.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">{idea.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
          )}
          {id === "journey" && (
      <section className="site-shell page-section border-t border-rule">
        <SectionHeading number={sectionNumber("journey")} title="Journey" />
        <Prose>
          <p>
            Education, roles, and side paths, the long arc rather than a résumé
            dump.
          </p>
        </Prose>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/timeline" className="link-accent">
            Timeline →
          </Link>
          <Link to="/about" className="link-accent">
            About →
          </Link>
        </div>
      </section>
          )}
          {id === "writing" && (
      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number={sectionNumber("writing")}
          title="Writing"
          link={{ to: "/writing", label: "Writing →" }}
        />
        <ul className="space-y-4 max-w-measure">
          {writing.slice(0, 2).map((w) => (
            <li key={w.slug}>
              {w.url ? (
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-medium"
                >
                  {w.title}
                </a>
              ) : (
                <Link to={`/writing/${w.slug}`} className="link-underline font-medium">
                  {w.title}
                </Link>
              )}
              <p className="mt-1 text-sm text-ink-muted">{w.summary}</p>
            </li>
          ))}
        </ul>
      </section>
          )}
          {id === "principles" && pullQuote && (
        <section className="site-shell page-section border-t border-rule">
          <SectionHeading
            number={sectionNumber("principles")}
            title="Principles"
            link={{ to: "/principles", label: "All principles →" }}
          />
          <blockquote className="max-w-measure border-l-2 border-accent pl-6">
            <p className="font-display text-2xl text-ink leading-snug">
              “{pullQuote.statement}”
            </p>
            <footer className="mt-3 text-sm text-ink-faint">
              {pullQuote.title}
            </footer>
          </blockquote>
        </section>
          )}
          {id === "contact" && (
      <section className="site-shell page-section border-t border-rule pb-24">
        <SectionHeading number={sectionNumber("contact")} title="Say hello" />
        <Prose>
          <p>
            For work, products, research, or a quiet hello, email works best.
            Usual reply time: {person.responseTime}.
          </p>
        </Prose>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href={`mailto:${person.email}`} className="btn-primary">
            {person.email}
          </a>
          <a
            href={person.primaryProfiles.cal}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Book on Calendly
          </a>
          <Link to="/contact" className="btn-ghost">
            Contact options
          </Link>
        </div>
      </section>
          )}
        </Fragment>
      ))}
    </>
  );
}
