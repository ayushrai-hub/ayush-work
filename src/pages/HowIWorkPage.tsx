/**
 * `/how-i-work`: operating manual covering rapid technology learning, reading habits, business & UX
 * instincts, high-agency teamwork, feedback loops, and live work images and video walkthroughs.
 *
 * Static editorial render backed by `src/content/howIWork.ts`, with interactive image switching via
 * `MediaGallery` and YouTube/Loom/Vimeo embeds (or structured slots) via `VideoEmbed`.
 *
 * Connects to:
 * - Routed in src/App.tsx as `how-i-work`; prerendered via STATIC_PAGES in src/lib/publicRoutes.ts.
 * - Linked from SiteHeader ("More"), SiteFooter, HomePage, AboutPage, and PrinciplesPage.
 * - Content from src/content (`howIWork`, `pageUpdatedAt("how-i-work")`).
 * - Markdown twin `/how-i-work.md` built in `buildPages()` in src/lib/agent/markdown.ts.
 */
import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";
import ContactCta from "../components/site/ContactCta";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import MediaGallery from "../components/editorial/MediaGallery";
import VideoEmbed from "../components/editorial/VideoEmbed";
import { howIWork, pageUpdatedAt } from "../content";

/** Operating manual page component. Lazy-loaded by the `how-i-work` route in src/App.tsx. */
export default function HowIWorkPage() {
  return (
    <>
      <PageSEO
        title={howIWork.title}
        description={howIWork.description}
        path={howIWork.path}
      />
      <article className="site-shell page-section">
        <PageHeader
          label="Operating manual"
          title={howIWork.title}
          dek={howIWork.dek}
          updated={pageUpdatedAt("how-i-work")}
        />

        <Prose className="mt-8">
          {howIWork.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>

        <blockquote className="mt-10 max-w-measure border-l-2 border-accent pl-6">
          <p className="font-display text-xl text-ink leading-snug">
            {howIWork.universalBuilderSummary}
          </p>
        </blockquote>

        <section id="learning-approach" className="mt-16 scroll-mt-24 border-t border-rule pt-12">
          <SectionHeading
            number="01"
            title="How I learn unfamiliar technology fast"
          />
          <Prose>
            <p>
              Fast startup work rewards people who can step into an unfamiliar stack, understand the
              real constraint quickly, and ship an accurate solution instead of a fragile hack. This
              is the loop I run when picking up something new.
            </p>
          </Prose>
          <ol className="mt-8 max-w-measure space-y-8">
            {howIWork.learningPlaybook.map((item) => (
              <li
                key={item.step}
                className="border-t border-rule pt-6"
              >
                <p className="font-mono text-xs text-ink-faint">{item.step}</p>
                <h3 className="mt-1 font-display text-2xl text-ink">{item.title}</h3>
                <p className="mt-2 text-ink-muted leading-relaxed">{item.summary}</p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  <span className="label mr-2">In practice</span>
                  {item.inPractice}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section id="reading-and-product-sense" className="mt-16 scroll-mt-24 border-t border-rule pt-12">
          <SectionHeading
            number="02"
            title="Books, articles, engineering blogs & business context"
            link={{ to: "/now", label: "Current reading on /now" }}
          />
          <Prose>
            <p>
              I read continuously—books, engineering blogs, technical articles, and primary specs—so
              each build starts with stronger pattern recognition. Reading is paired with business
              and user-experience judgment: knowing why a workflow stalls matters as much as knowing
              which library to import.
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {howIWork.readingHabits.map((habit) => (
              <div
                key={habit.category}
                className="border border-rule bg-paper-elevated p-5"
              >
                <h3 className="font-display text-lg text-ink">{habit.category}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{habit.focus}</p>
                <p className="mt-3 border-t border-rule pt-3 text-xs text-ink-faint leading-relaxed">
                  {habit.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="team-and-agency" className="mt-16 scroll-mt-24 border-t border-rule pt-12">
          <SectionHeading
            number="03"
            title="As a person & teammate: high agency, feedback, iteration"
            link={{ to: "/principles", label: "Working principles" }}
          />
          <Prose>
            <p>
              A portfolio of finished screens hides the part teams actually live with every day:
              how someone communicates under pressure, responds to critique, owns ambiguity, and
              iterates until the experience feels right.
            </p>
          </Prose>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {howIWork.teamAndPersonality.map((trait) => (
              <li
                key={trait.slug}
                id={trait.slug}
                className="scroll-mt-24 border border-rule bg-paper-elevated p-6"
              >
                <h3 className="font-display text-xl text-ink">{trait.title}</h3>
                <p className="mt-2 font-medium text-sm text-ink">{trait.headline}</p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{trait.detail}</p>
                <p className="mt-4 border-t border-rule pt-3 text-xs text-ink-faint leading-relaxed">
                  <span className="label mr-2">Example</span>
                  {trait.example}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="live-work-images" className="mt-16 scroll-mt-24 border-t border-rule pt-12">
          <SectionHeading
            number="04"
            title="Live work snapshots & visual proof"
            link={{ to: "/work", label: "All case studies" }}
          />
          <Prose>
            <p>
              Real screens from live products, operator consoles, and client builds—plus a ready
              drop-in slot for ongoing build snapshots, architecture sketches, and team moments.
            </p>
          </Prose>
          <div className="mt-8 max-w-4xl">
            <MediaGallery
              items={howIWork.liveWorkImages}
              heading="Live builds, operator UX & work-in-progress gallery"
              ariaLabel="Live work snapshots gallery"
            />
          </div>
        </section>

        <section id="live-work-videos" className="mt-16 scroll-mt-24 border-t border-rule pt-12">
          <SectionHeading
            number="05"
            title="Videos & live walkthroughs (YouTube, Loom, Vimeo)"
          />
          <Prose>
            <p>
              Short, direct recordings of live builds, product decisions, and how I think out loud—so
              you can see the person and the working style, not just static copy. Each slot accepts a
              YouTube, Loom, or Vimeo link directly.
            </p>
          </Prose>
          <div className="mt-8 space-y-10">
            {howIWork.liveWorkVideos.map((video) => (
              <div
                key={video.id}
                id={video.id}
                className="scroll-mt-24 border-t border-rule pt-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 max-w-3xl">
                  <h3 className="font-display text-2xl text-ink">{video.title}</h3>
                  <span className="font-mono text-xs text-ink-faint">{video.platform}</span>
                </div>
                <p className="mt-2 max-w-measure text-ink-muted leading-relaxed">
                  {video.description}
                </p>
                <VideoEmbed
                  url={video.url}
                  title={video.title}
                  plannedTopics={video.plannedTopics}
                  placeholderHeading="Video slot ready (YouTube, Loom, or Vimeo). Planned recording:"
                  caption={video.caption}
                  slot={video.id}
                />
              </div>
            ))}
          </div>
        </section>

        <ContactCta prompt="Want to see how I'd approach a specific technical or product bottleneck on your team? Reach out directly or book a call." />

        <nav className="mt-12 flex flex-wrap gap-6 text-sm" aria-label="Related pages">
          <Link to="/about" className="link-accent">
            About & background
          </Link>
          <Link to="/principles" className="link-accent">
            Working principles
          </Link>
          <Link to="/pow" className="link-accent">
            Proof of work
          </Link>
          <Link to="/now" className="link-accent">
            What I’m doing now
          </Link>
        </nav>
      </article>
    </>
  );
}
