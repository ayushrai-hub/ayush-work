import { Link } from "react-router-dom";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import PageSEO from "../components/site/PageSEO";

export default function DevelopersPage() {
  return (
    <>
      <PageSEO
        title="Developers"
        description="How to read Ayush Rai's public pages as Markdown, search them, and call the read-only project API."
        path="/developers"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Developers"
          title="Public interfaces"
          dek="The same content records as the website. Search is lexical. Nothing here is a model."
        />
        <Prose>
          <p>
            Start at <a href="/llms.txt">llms.txt</a>. Each linked page has a{" "}
            <code>.md</code> twin. The homepage twin is <a href="/index.md">/index.md</a>.
            Sending <code>Accept: text/markdown</code> without <code>text/html</code> returns
            Markdown for known pages. The <code>.md</code> URL is the stable contract.
          </p>
          <p>
            <code>GET /api/search?q=</code> matches titles, tags, types, and summaries. It
            does not infer meaning. <code>GET /api/v1/projects</code> lists active projects.{" "}
            <code>GET /api/v1/projects/overlay-text-box</code> fetches one.{" "}
            <code>GET /api/v1/compare?slugs=overlay-text-box,expert-o</code> compares two to
            four. Archived projects stay out unless <code>archive=1</code>.
          </p>
          <p>
            The specification is <a href="/openapi.json">openapi.json</a>. Agent notes are{" "}
            <a href="/AGENTS.md">AGENTS.md</a> and <a href="/SKILL.md">SKILL.md</a>. A local
            stdio MCP server in the repository exposes <code>list_projects</code>,{" "}
            <code>get_project</code>, and <code>compare_projects</code>. There is no remote
            MCP endpoint and no registry listing.
          </p>
          <p>
            <Link to="/" className="link-accent">
              Back to the site
            </Link>
          </p>
        </Prose>
      </div>
    </>
  );
}
