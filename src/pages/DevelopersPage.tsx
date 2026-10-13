import { Link } from "react-router-dom";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import SectionHeading from "../components/editorial/SectionHeading";
import PageSEO from "../components/site/PageSEO";
import { pageUpdatedAt } from "../content";
import {
  DEVELOPER_DESCRIPTION,
  DEVELOPER_TITLE,
  developerSections,
} from "../lib/agent/developerDocs";

function withCode(text: string) {
  return text.split("`").map((part, index) =>
    index % 2 === 1 ? <code key={index}>{part}</code> : part,
  );
}

const RESOURCES = [
  { href: "/openapi.json", label: "OpenAPI spec" },
  { href: "/.well-known/api-catalog", label: "API catalog" },
  { href: "/api/mcp/server-card", label: "MCP Server Card" },
  { href: "/.well-known/ai-catalog.json", label: "AI Catalog" },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/AGENTS.md", label: "AGENTS.md" },
  { href: "/SKILL.md", label: "SKILL.md" },
  { href: "/developers.md", label: "This page as Markdown" },
] as const;

export default function DevelopersPage() {
  return (
    <>
      <PageSEO
        title="Developer docs: API and MCP server"
        description={DEVELOPER_DESCRIPTION}
        path="/developers"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Developers"
          title={DEVELOPER_TITLE}
          dek="Read-only REST API and MCP server over the same content records as the website. Free, public, and keyless."
          updated={pageUpdatedAt("developers")}
        />
        {developerSections().map((section) => (
          <section key={section.heading} className="mt-10">
            <SectionHeading title={section.heading} />
            <Prose>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{withCode(paragraph)}</p>
              ))}
            </Prose>
          </section>
        ))}
        <section className="mt-10">
          <SectionHeading title="Resources" />
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {RESOURCES.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-accent">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/" className="link-accent">
                Back to the site
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
