import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import PageSEO from "../components/site/PageSEO";
import { pageUpdatedAt, privacySections } from "../content";

export default function PrivacyPage() {
  return (
    <>
      <PageSEO
        title="Privacy"
        description="What Ayush Rai's site collects: Google Analytics, hosting logs, and contact form messages delivered by email. No accounts, ads, or mailing lists."
        path="/privacy"
      />
      <article className="site-shell page-section">
        <PageHeader
          label="Privacy"
          title="Privacy"
          dek="What this site collects, who processes it, and how to ask about it."
          updated={pageUpdatedAt("privacy")}
        />
        {privacySections.map((section) => (
          <section key={section.heading} className="mt-10">
            <SectionHeading title={section.heading} />
            <Prose>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </section>
        ))}
      </article>
    </>
  );
}
