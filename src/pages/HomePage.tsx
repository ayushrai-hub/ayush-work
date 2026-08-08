import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import PageSEO from "../components/site/PageSEO";
import SectionHeading from "../components/editorial/SectionHeading";
import WorkRow from "../components/editorial/WorkRow";
import Prose from "../components/editorial/Prose";
import {
  ideas,
  now,
  person,
  principles,
  products,
  research,
  selectedWork,
  writing,
} from "../content";

export default function HomePage() {
  const reduceMotion = useReducedMotion();
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
            If you’d like to read more — who I am, what I’ve built, how the work
            connects — these are the best places to start.
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

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number="01"
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
          Updated {now.lastUpdated}
        </p>
      </section>

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number="02"
          title="Selected work"
          link={{ to: "/work", label: "All work →" }}
        />
        <ul className="border-b border-rule">
          {selectedWork.map((item) => (
            <WorkRow key={item.slug} item={item} />
          ))}
        </ul>
      </section>

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number="03"
          title="Things I build"
          link={{ to: "/products", label: "Products →" }}
        />
        <ul className="space-y-6 max-w-measure">
          {products.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link
                to={`/products/${p.slug}`}
                className="font-display text-xl text-ink hover:text-accent"
              >
                {p.title}
              </Link>
              <p className="mt-1 text-ink-muted leading-relaxed">{p.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number="04"
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

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading number="05" title="Journey" />
        <Prose>
          <p>
            Education, roles, and side paths — the long arc rather than a résumé
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

      <section className="site-shell page-section border-t border-rule">
        <SectionHeading
          number="06"
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

      {pullQuote && (
        <section className="site-shell page-section border-t border-rule">
          <SectionHeading
            number="07"
            title="Principles"
            link={{ to: "/principles", label: "All principles →" }}
          />
          <blockquote className="max-w-measure border-l-2 border-accent pl-6">
            <p className="font-display text-2xl text-ink leading-snug">
              “{pullQuote.statement}”
            </p>
            <footer className="mt-3 text-sm text-ink-faint">
              — {pullQuote.title}
            </footer>
          </blockquote>
        </section>
      )}

      <section className="site-shell page-section border-t border-rule pb-24">
        <SectionHeading number="08" title="Say hello" />
        <Prose>
          <p>
            For work, products, research, or a quiet hello — email works best.
            No sales pitch required.
          </p>
        </Prose>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href={`mailto:${person.email}`} className="btn-primary">
            {person.email}
          </a>
          <Link to="/contact" className="btn-secondary">
            Contact options
          </Link>
        </div>
      </section>
    </>
  );
}
