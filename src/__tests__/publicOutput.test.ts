// @vitest-environment node
/**
 * Guards every generated public surface against withheld or internal content.
 *
 * Renders each prerendered route with the same `render()` the build uses (src/entry-server.tsx), and
 * collects every generated agent file (`agentFiles()`: Markdown twins, llms files, OpenAPI, catalogs,
 * Server Card) plus the search index and REST project payloads. None of them may contain the internal
 * `needsConfirmation` marker, a withheld award, leadership, or funding claim, or the phone number.
 * Hand-written developer files (AGENTS.md, SKILL.md) are excluded: they describe the rule by name.
 *
 * Runs in the node environment because that is where the prerender runs.
 *
 * Connects to:
 * - src/entry-server.tsx (render), src/lib/publicRoutes.ts (prerenderRoutes)
 * - src/lib/agent/surfaces.ts (agentFiles), src/lib/agent/http.ts (dispatchAgentApi)
 * - src/content (searchIndex and the *NeedsConfirmation lists)
 */
import { describe, expect, it } from "vitest";
import {
  leadershipNeedsConfirmation,
  researchAwardsNeedsConfirmation,
  researchFundingNeedsConfirmation,
  searchIndex,
} from "../content";
import { render } from "../entry-server";
import { dispatchAgentApi } from "../lib/agent/http";
import { agentFiles } from "../lib/agent/surfaces";
import { prerenderRoutes } from "../lib/publicRoutes";

const INTERNAL_MARKER = "needsConfirmation";
// Any Indian mobile number, bare or spaced as 5+5 digits; kept as a pattern so the repo holds no number.
const PHONE = /(?<!\d)[6-9]\d{4}[\s-]?\d{5}(?!\d)/;
const WITHHELD = [
  ...leadershipNeedsConfirmation,
  ...researchAwardsNeedsConfirmation,
  ...Object.values(researchFundingNeedsConfirmation),
];

/** Every forbidden string found in `text`, labelled with where it was found. */
function leaks(label: string, text: string): string[] {
  const found: string[] = [];
  if (text.includes(INTERNAL_MARKER)) found.push(`${label}: ${INTERNAL_MARKER}`);
  if (PHONE.test(text)) found.push(`${label}: phone`);
  const lower = text.toLowerCase();
  for (const claim of WITHHELD) {
    if (lower.includes(claim.toLowerCase())) found.push(`${label}: ${claim}`);
  }
  return found;
}

/** All project records the REST API can return, following `nextCursor` with archived items included. */
function allProjectPayloads(): string {
  const pages: string[] = [];
  let cursor = "";
  for (let i = 0; i < 50; i += 1) {
    const params = new URLSearchParams({ archive: "1", limit: "20" });
    if (cursor) params.set("cursor", cursor);
    const result = dispatchAgentApi("/api/v1/projects", "GET", params);
    pages.push(JSON.stringify(result.body));
    const next = (result.body as { nextCursor: string | null }).nextCursor;
    if (!next) break;
    cursor = next;
  }
  return pages.join("\n");
}

/** Prerendered HTML, agent files, search records, and API payloads. */
describe("public output", () => {
  it("keeps internal markers and withheld claims out of every generated agent file", () => {
    const found: string[] = [];
    for (const [path, body] of Object.entries(agentFiles())) found.push(...leaks(path, body));
    found.push(...leaks("search index", JSON.stringify(searchIndex)));
    found.push(...leaks("/api/v1/projects", allProjectPayloads()));
    expect(found).toEqual([]);
  });

  it("keeps internal markers and withheld claims out of every prerendered page", async () => {
    const found: string[] = [];
    for (const route of prerenderRoutes()) {
      const { html, helmet } = await render(route);
      const head = helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.script.toString()}` : "";
      found.push(...leaks(route, `${head}${html}`));
    }
    expect(found).toEqual([]);
  }, 60_000);

  it("withholds the specific funding sources while keeping the neutral public note", async () => {
    for (const slug of Object.keys(researchFundingNeedsConfirmation)) {
      const { html } = await render(`/research/${slug}`);
      expect(html).toContain("No funding claim verified.");
    }
  });
});
