import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import {
  capabilities,
  education,
  experience,
  leadership,
  person,
} from "../content";

export default function AboutPage() {
  return (
    <>
      <PageSEO
        title="About"
        description={person.positioning}
        path="/about"
      />
      <article className="site-shell page-section">
        <PageHeader
          label="About"
          title={person.name}
          dek={person.tagline}
        />

        <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-14">
          {person.portrait && (
            <figure className="md:sticky md:top-24">
              <img
                src={person.portrait}
                alt={`${person.name}`}
                width={560}
                height={700}
                className="aspect-[4/5] w-full max-w-xs object-cover object-top md:max-w-none"
                loading="eager"
                decoding="async"
              />
              <figcaption className="mt-3 font-mono text-xs text-ink-faint">
                {person.name} · {person.location}
              </figcaption>
            </figure>
          )}
          <Prose>
            <p>{person.positioning}</p>
            <p className="mt-4">
              Based in {person.location}. Day work leans toward AI evaluation and
              generative systems; evenings and weekends go to products, client
              sites, and careful notes on what actually shipped.
            </p>
          </Prose>
        </div>

        <section className="mt-16">
          <SectionHeading title="Where I’ve been working" />
          <ul className="space-y-8 max-w-measure">
            {experience.map((role) => (
              <li key={role.slug} className="border-t border-rule pt-6">
                <h3 className="font-display text-xl text-ink">{role.title}</h3>
                <p className="meta-row mt-1">
                  <span>{role.organization}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {role.start} – {role.end}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{role.type}</span>
                </p>
                <p className="mt-3 text-ink-muted leading-relaxed">
                  {role.narrative}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <SectionHeading title="Education" />
          <ul className="space-y-6 max-w-measure">
            {education.map((ed) => (
              <li key={ed.slug}>
                <h3 className="font-display text-lg text-ink">{ed.degree}</h3>
                <p className="text-ink-muted">
                  {ed.institution}
                  {ed.location ? ` · ${ed.location}` : ""}
                </p>
                <p className="meta-row mt-1">
                  <span>
                    {ed.start} – {ed.end}
                  </span>
                  {ed.grade && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{ed.grade}</span>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
          <Link to="/education" className="link-accent text-sm mt-4 inline-block">
            Full education list →
          </Link>
        </section>

        <section className="mt-16">
          <SectionHeading title="Community & leadership (grounded)" />
          <ul className="space-y-6 max-w-measure">
            {leadership.slice(0, 4).map((item) => (
              <li key={item.slug}>
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="meta-row mt-1">
                  <span>{item.organization}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.period}</span>
                </p>
                <p className="mt-2 text-ink-muted leading-relaxed">
                  {item.narrative}
                </p>
              </li>
            ))}
          </ul>
          <Link to="/leadership" className="link-accent text-sm mt-4 inline-block">
            More leadership →
          </Link>
        </section>

        <section className="mt-16">
          <SectionHeading title="Capabilities" />
          <ul className="space-y-8">
            {capabilities.map((cap) => (
              <li key={cap.domain} className="max-w-measure">
                <h3 className="font-display text-lg text-ink">{cap.domain}</h3>
                <p className="mt-2 text-ink-muted leading-relaxed">
                  {cap.summary}
                </p>
                <p className="mt-2 text-sm text-ink-faint">
                  {cap.skills.map((s) => s.name).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16">
          <Link to="/timeline" className="link-accent">
            See the timeline →
          </Link>
        </p>
      </article>
    </>
  );
}
