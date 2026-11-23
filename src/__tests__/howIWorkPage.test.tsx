/**
 * Tests the `/how-i-work` operating manual page, its media/video slots, and its Markdown twin.
 *
 * Verifies that the page renders one h1, the 5-step learning playbook, reading habits,
 * high-agency/feedback/teamwork traits, interactive live work gallery tabs, and YouTube/Loom/Vimeo
 * video slots; that setting a video URL renders an iframe with a privacy-enhanced embed URL; and
 * that `/how-i-work` is prerendered, in the sitemap, in search, and published as `/how-i-work.md`.
 *
 * Connects to:
 * - src/pages/HowIWorkPage.tsx, src/content/howIWork.ts, src/App.tsx (AppRoutes)
 * - src/lib/agent/markdown.ts, src/lib/publicRoutes.ts, src/content/searchIndex.ts
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { howIWork, searchIndex, videoEmbedUrl } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { renderPageMarkdown } from "../lib/agent/markdown";
import { prerenderRoutes, sitemapRoutes } from "../lib/publicRoutes";

/** Renders AppRoutes at `/how-i-work` and waits for the lazy-loaded page heading. */
async function renderHowIWork() {
  await import("../pages/HowIWorkPage");
  render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={["/how-i-work"]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  return screen.findByRole("heading", { level: 1, name: "How I work" }, { timeout: 5000 });
}

afterEach(() => {
  howIWork.liveWorkVideos[0].url = undefined;
});

/** The `/how-i-work` record, page, gallery, video embeds, and Markdown twin. */
describe("How I work page", () => {
  it("renders learning playbook, reading habits, teamwork traits, live gallery, and video slots", async () => {
    expect(await renderHowIWork()).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    for (const step of howIWork.learningPlaybook) {
      expect(screen.getByRole("heading", { name: step.title })).toBeInTheDocument();
    }
    for (const habit of howIWork.readingHabits) {
      expect(screen.getByRole("heading", { name: habit.category })).toBeInTheDocument();
    }
    for (const trait of howIWork.teamAndPersonality) {
      expect(screen.getByRole("heading", { name: trait.title })).toBeInTheDocument();
    }

    const secondTab = screen.getByRole("button", { name: howIWork.liveWorkImages[1].label });
    expect(secondTab).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(secondTab);
    expect(secondTab).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getAllByText(/Video slot ready \(YouTube, Loom, or Vimeo\)/i),
    ).toHaveLength(howIWork.liveWorkVideos.length);
    expect(document.querySelector("iframe")).toBeNull();
  }, 15000);

  it("embeds YouTube, YouTube Shorts, and Vimeo URLs when configured", async () => {
    howIWork.liveWorkVideos[0].url = "https://www.youtube.com/watch?v=abc123XYZ";
    await renderHowIWork();
    expect(screen.getByTitle(howIWork.liveWorkVideos[0].title)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/abc123XYZ",
    );
    expect(videoEmbedUrl("https://youtube.com/shorts/short99ID")).toBe(
      "https://www.youtube-nocookie.com/embed/short99ID",
    );
    expect(videoEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789",
    );
  });

  it("publishes a Markdown twin, prerendered route, sitemap entry, and search record", () => {
    const markdown = renderPageMarkdown("/how-i-work") ?? "";
    for (const heading of [
      "## Universal builder mindset",
      "## How I learn unfamiliar technology fast (and implement accurately)",
      "## Reading & staying sharp (books, articles, engineering blogs)",
      "## Teamwork, high agency, feedback & iteration",
      "## Live work snapshots",
      "## Live work & personality videos (YouTube, Loom, Vimeo)",
    ]) {
      expect(markdown).toContain(heading);
    }
    expect(prerenderRoutes()).toContain("/how-i-work");
    expect(sitemapRoutes()).toContain("/how-i-work");
    expect(searchIndex.some((item) => item.href === "/how-i-work")).toBe(true);
  });
});
