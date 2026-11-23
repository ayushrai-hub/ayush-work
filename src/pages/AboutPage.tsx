/**
 * `/about`: biography page with portrait, roles, education, leadership, and capabilities.
 *
 * Static render of content records; no state. Experience roles and capability entries get
 * `id` anchors (`#<role.slug>`, `#capability-<domain>`) so other pages and search hits can
 * deep-link. Only the first four leadership entries are shown; the rest live on /leadership.
 *
 * Connects to:
 * - Routed in src/App.tsx as `about`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Content from src/content (`person`, `experience`, `education`, `leadership`, `capabilities`,
 *   `pageUpdatedAt("about")`); components PageSEO, PageHeader, Prose, SectionHeading.
 * - Markdown twin `/about.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import MediaGallery from "../components/editorial/MediaGallery";
import VideoEmbed from "../components/editorial/VideoEmbed";
import {
  capabilities,
  education,
  experience,
  howIWork,
  leadership,
  pageUpdatedAt,
  person,
  practice,
} from "../content";

/** About page component. Lazy-loaded by the `about` route in src/App.tsx. */
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
          updated={pageUpdatedAt("about")}
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
              I work remotely. The day work is evaluation and the software around it. The other half is products and client sites.
            </p>
          </Prose>
        </div>

        <section className="mt-16">
          <SectionHeading title="What I've done" />
          <ul className="max-w-measure space-y-4 text-ink-muted">
            {practice.did.map((item) => (
              <li key={item} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <SectionHeading title="What I'm doing" />
          <ul className="max-w-measure space-y-4 text-ink-muted">
            {practice.doing.map((item) => (
              <li key={item} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <SectionHeading title="Where this goes" />
          <ul className="max-w-measure space-y-4 text-ink-muted">
            {practice.aspirations.map((item) => (
              <li key={item} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </section>

        <section id="how-i-work" className="mt-16 scroll-mt-24 border-t border-rule pt-12">
          <SectionHeading
            title="How I learn, collaborate & ship"
            link={{ to: "/how-i-work", label: "Open full operating manual" }}
          />
          <Prose>
            <p>{howIWork.universalBuilderSummary}</p>
          </Prose>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {howIWork.teamAndPersonality.map((trait) => (
              <li key={trait.slug} className="border border-rule bg-paper-elevated p-5">
                <h3 className="font-display text-lg text-ink">{trait.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{trait.headline}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-8 max-w-4xl">
            <MediaGallery
              items={howIWork.liveWorkImages}
              heading="Live work snapshots & builds"
              ariaLabel="About page live work snapshots"
            />
            <div>
              <h3 className="font-display text-xl text-ink">
                {howIWork.liveWorkVideos[2].title}
              </h3>
              <p className="mt-1.5 max-w-measure text-sm text-ink-muted leading-relaxed">
                {howIWork.liveWorkVideos[2].description}
              </p>
              <VideoEmbed
                url={howIWork.liveWorkVideos[2].url}
                title={howIWork.liveWorkVideos[2].title}
                plannedTopics={howIWork.liveWorkVideos[2].plannedTopics}
                placeholderHeading="Video slot ready (YouTube, Loom, or Vimeo). Planned recording:"
                caption={howIWork.liveWorkVideos[2].caption}
                slot={howIWork.liveWorkVideos[2].id}
              />
            </div>
          </div>
          <p className="mt-6 text-sm">
            <Link to="/how-i-work" className="link-accent">
              See the full learning playbook, reading habits, and all video slots
            </Link>
          </p>
        </section>

        <section className="mt-16">
          <SectionHeading title="Companies" />
          <ul className="space-y-8 max-w-measure">
            {experience.map((role) => (
              <li id={role.slug} key={role.slug} className="scroll-mt-24 border-t border-rule pt-6">
                <h3 className="font-display text-xl text-ink">{role.title}</h3>
                <p className="meta-row mt-1">
                  <span>{role.organization}</span>
                  <span aria-hidden="true">·</span>
                  <span>{role.location}</span>
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
                {(ed.start || ed.end || ed.grade) && <p className="meta-row mt-1">
                  {(ed.start || ed.end) && <span>{ed.start} – {ed.end}</span>}
                  {ed.grade && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{ed.grade}</span>
                    </>
                  )}
                </p>}
                {ed.note && <p className="mt-2 text-sm text-ink-muted">{ed.note}</p>}
              </li>
            ))}
          </ul>
          <Link to="/education" className="link-accent text-sm mt-4 inline-block">
            Full education list
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
            More leadership
          </Link>
        </section>

        <section className="mt-16">
          <SectionHeading title="Capabilities" />
          <ul className="space-y-8">
            {capabilities.map((cap) => (
              <li
                id={`capability-${cap.domain.toLowerCase()}`}
                key={cap.domain}
                className="scroll-mt-24 max-w-measure"
              >
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

        <ContactCta prompt="For hiring, contract evaluation, or product-building conversations, use contact, resume, or Calendly." />

        <p className="mt-12">
          <Link to="/timeline" className="link-accent">
            Explore timeline
          </Link>
        </p>
      </article>
    </>
  );
}
