import { person } from "../content/person";

/** Absolute canonical URL. Non-root pages use a trailing slash, matching Netlify pretty URLs. */
export function canonicalUrl(path: string): string {
  const origin = person.siteUrl.replace(/\/$/, "");
  if (!path || path === "/") return `${origin}/`;
  const clean = (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "");
  return `${origin}${clean}/`;
}

export function personId(): string {
  return `${person.siteUrl.replace(/\/$/, "")}/#person`;
}

export function websiteId(): string {
  return `${person.siteUrl.replace(/\/$/, "")}/#website`;
}
