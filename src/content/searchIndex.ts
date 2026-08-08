import type { SearchItem } from "./types";
import { person } from "./person";
import { work } from "./work";
import { products } from "./products";
import { projects } from "./projects";
import { research } from "./research";
import { experience } from "./experience";
import { education } from "./education";
import { leadership } from "./leadership";
import { recognition } from "./recognition";
import { ideas } from "./ideas";
import { principles } from "./principles";
import { notes } from "./notes";
import { writing } from "./writing";
import { elsewhereProfiles } from "./elsewhere";
import { capabilities } from "./capabilities";

/**
 * Flat searchable items for client-side search.
 * href values are route hints — wire to the real router when pages exist.
 */
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [
    {
      id: "person",
      title: person.name,
      type: "person",
      summary: person.tagline,
      href: "/",
      tags: ["ayush", "about", "contact", person.location],
    },
  ];

  for (const w of work) {
    items.push({
      id: `work:${w.slug}`,
      title: w.title,
      type: "work",
      summary: w.summary,
      href: `/work/${w.slug}`,
      tags: [w.type, w.status, ...w.technologies, ...(w.selected ? ["selected"] : [])],
    });
  }

  for (const p of products) {
    items.push({
      id: `product:${p.slug}`,
      title: p.title,
      type: "product",
      summary: p.summary,
      href: `/products/${p.slug}`,
      tags: [p.stage, ...p.audience],
    });
  }

  for (const p of projects) {
    items.push({
      id: `project:${p.slug}`,
      title: p.title,
      type: "project",
      summary: p.summary,
      href: `/projects/${p.slug}`,
      tags: [p.type, p.status, ...(p.archive ? ["archive"] : []), ...p.technologies],
    });
  }

  for (const r of research) {
    items.push({
      id: `research:${r.slug}`,
      title: r.title,
      type: "research",
      summary: r.summary,
      href: `/research/${r.slug}`,
      tags: [r.status, ...r.technologies],
    });
  }

  for (const e of experience) {
    items.push({
      id: `experience:${e.slug}`,
      title: `${e.title} · ${e.organization}`,
      type: "experience",
      summary: e.narrative.slice(0, 180) + (e.narrative.length > 180 ? "…" : ""),
      href: `/experience#${e.slug}`,
      tags: [e.type, e.organization, ...(e.current ? ["current"] : []), ...e.technologies],
    });
  }

  for (const edu of education) {
    items.push({
      id: `education:${edu.slug}`,
      title: edu.degree,
      type: "education",
      summary: `${edu.institution}${edu.grade ? ` · ${edu.grade}` : ""}`,
      href: `/education#${edu.slug}`,
      tags: ["education", edu.institution],
    });
  }

  for (const l of leadership) {
    items.push({
      id: `leadership:${l.slug}`,
      title: l.title,
      type: "leadership",
      summary: l.narrative.slice(0, 180) + (l.narrative.length > 180 ? "…" : ""),
      href: `/leadership#${l.slug}`,
      tags: [l.category, l.organization],
    });
  }

  for (const rec of recognition) {
    items.push({
      id: `recognition:${rec.slug}`,
      title: rec.title,
      type: "recognition",
      summary: `${rec.issuer} · ${rec.description}`,
      href: `/recognition#${rec.slug}`,
      tags: [rec.category, ...(rec.featured ? ["featured"] : []), ...(rec.archive ? ["archive"] : [])],
    });
  }

  for (const idea of ideas) {
    items.push({
      id: `idea:${idea.slug}`,
      title: idea.title,
      type: "idea",
      summary: idea.summary,
      href: `/ideas#${idea.slug}`,
      tags: [idea.status, idea.theme],
    });
  }

  for (const pr of principles) {
    items.push({
      id: `principle:${pr.slug}`,
      title: pr.title,
      type: "principle",
      summary: pr.statement,
      href: `/principles#${pr.slug}`,
      tags: ["principle"],
    });
  }

  for (const n of notes) {
    items.push({
      id: `note:${n.slug}`,
      title: n.title,
      type: "note",
      summary: n.body.slice(0, 180) + (n.body.length > 180 ? "…" : ""),
      href: `/notes/${n.slug}`,
      tags: [n.kind],
    });
  }

  for (const w of writing) {
    items.push({
      id: `writing:${w.slug}`,
      title: w.title,
      type: "writing",
      summary: w.summary,
      href: w.url ?? `/writing/${w.slug}`,
      tags: [w.kind],
    });
  }

  for (const profile of elsewhereProfiles) {
    items.push({
      id: `elsewhere:${profile.id}`,
      title: profile.name,
      type: "elsewhere",
      summary: profile.description ?? profile.url,
      href: profile.url,
      tags: [
        profile.category,
        ...(profile.primary ? ["primary"] : []),
        ...(profile.archive ? ["archive"] : []),
      ],
    });
  }

  for (const cap of capabilities) {
    items.push({
      id: `capability:${cap.domain.toLowerCase()}`,
      title: cap.domain,
      type: "capability",
      summary: cap.summary,
      href: `/capabilities#${cap.domain.toLowerCase()}`,
      tags: ["capability", ...cap.skills.map((s) => s.name)],
    });
  }

  return items;
}

export const searchIndex: SearchItem[] = buildSearchIndex();
