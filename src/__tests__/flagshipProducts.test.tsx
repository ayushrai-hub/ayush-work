/**
 * Tests the three flagship products (The Open Framework, AGENYRA, MedVoice) across data, agent, and page surfaces.
 *
 * Data: featured order, unique slugs, GitHub and demo URLs (MedVoice has no
 * demo), stage labels, and the product-to-case-study mapping. Agent surfaces:
 * search-index hrefs are known routes, and llms-full plus product and work
 * Markdown leak no private operational strings. Pages: the homepage "Things I
 * build" section lists the three flagships in order, the products catalog keeps
 * AyushMushrooms after them, detail pages set canonical and og:url and
 * CreativeWork JSON-LD, the AGENYRA build log shows dated entries, and the
 * MedVoice case study links back to its product page.
 *
 * Meta and canonical assertions rely on the react-helmet-async pass-through in
 * src/setupTests.ts, which writes tags straight into document.head.
 *
 * Connects to:
 * - src/content (products, works, searchIndex)
 * - src/lib/agent/markdown.ts, src/lib/agent/routes.ts
 * - src/pages/HomePage, ProductsPage, ProductDetailPage, ProductLogPage, WorkDetailPage
 */
import type { ReactElement } from "react";
import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  featuredProducts,
  getProductBySlug,
  getWorkBySlug,
  productStageLabels,
  products,
  searchIndex,
} from "../content";
import { renderLlmsFull, renderPageMarkdown } from "../lib/agent/markdown";
import { isKnownRoute } from "../lib/agent/routes";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductLogPage from "../pages/ProductLogPage";
import ProductsPage from "../pages/ProductsPage";
import WorkDetailPage from "../pages/WorkDetailPage";

const FLAGSHIP = ["the-open-framework", "agenyra", "medvoice"] as const;

/** Renders `element` at `path` under HelmetProvider and a MemoryRouter with the product and work route shapes. */
function renderRoute(path: string, element: ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={element} />
          <Route path="/products" element={element} />
          <Route path="/products/:slug" element={element} />
          <Route path="/products/:slug/log" element={element} />
          <Route path="/work/:slug" element={element} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

/** Content records, search index entries, and agent Markdown for the flagship products. */
describe("flagship products", () => {
  it("keeps three unique featured slugs in portfolio order", () => {
    const slugs = featuredProducts().map((product) => product.slug);
    expect(slugs).toEqual([...FLAGSHIP]);
    expect(new Set(products.map((product) => product.slug)).size).toBe(
      products.length,
    );
    expect(products.some((product) => product.slug === "ayushmushrooms")).toBe(
      true,
    );
  });

  it("uses verified https links and no invented MedVoice demo", () => {
    for (const slug of FLAGSHIP) {
      const product = getProductBySlug(slug);
      expect(product?.githubUrl).toMatch(/^https:\/\/github\.com\/ayushrai-hub\//);
      expect(product?.relatedWorkSlug).toBe(slug);
      expect(getWorkBySlug(slug)?.links?.github).toBe(product?.githubUrl);
    }
    expect(getProductBySlug("the-open-framework")?.demoUrl).toBe(
      "https://the-open-frameworks.vercel.app/",
    );
    expect(getProductBySlug("agenyra")?.demoUrl).toBe("https://agenyra.space/");
    expect(getProductBySlug("medvoice")?.demoUrl).toBeUndefined();
    expect(getWorkBySlug("medvoice")?.links?.demo).toBeUndefined();
  });

  it("maps each product to its case study and a precise stage label", () => {
    expect(productStageLabels.building).toBe("Building");
    expect(productStageLabels.experimental).toBe("Experimental");
    expect(productStageLabels.mvp).toBe("MVP");
    for (const slug of FLAGSHIP) {
      const product = getProductBySlug(slug);
      expect(product?.stage).toBe("building");
      expect(product?.stageExplanation.length).toBeGreaterThan(40);
      expect(getWorkBySlug(product?.relatedWorkSlug ?? "")?.title).toBe(
        product?.title,
      );
    }
    expect(getProductBySlug("the-open-framework")?.stage).not.toBe("mvp");
    expect(getProductBySlug("ayushmushrooms")?.stage).toBe("mvp");
  });

  it("indexes products and case studies on real routes", () => {
    for (const slug of FLAGSHIP) {
      const productHit = searchIndex.find((item) => item.id === `product:${slug}`);
      const workHit = searchIndex.find((item) => item.id === `work:${slug}`);
      expect(productHit?.href).toBe(`/products/${slug}`);
      expect(workHit?.href).toBe(`/work/${slug}`);
      expect(isKnownRoute(productHit?.href ?? "")).toBe(true);
      expect(isKnownRoute(workHit?.href ?? "")).toBe(true);
      expect(isKnownRoute(`/products/${slug}/log`)).toBe(true);
    }
  });

  it("keeps private operational details out of the agent pages", () => {
    const dump = [
      renderLlmsFull(),
      renderPageMarkdown("/products/agenyra"),
      renderPageMarkdown("/products/medvoice"),
      renderPageMarkdown("/work/agenyra"),
    ].join("\n");
    expect(dump).toContain("AGENYRA");
    expect(dump).toContain("MedVoice");
    expect(dump).not.toContain("WAITLIST_EXPORT");
    expect(dump).not.toContain("SERVICE_ROLE");
    expect(dump).not.toContain("/api/admin/waitlist");
    expect(dump).not.toContain("demo-pass");
  });
});

/** Rendered homepage, catalog, detail, build-log, and case-study pages for the flagships. */
describe("flagship product pages", () => {
  it("prioritizes the three products on the homepage", () => {
    renderRoute("/", <HomePage />);
    const productSection = screen
      .getByRole("heading", { name: /Things I build/ })
      .closest("section");
    expect(productSection).not.toBeNull();
    const headings = within(productSection as HTMLElement).getAllByRole("heading", {
      level: 3,
    });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "The Open Framework",
      "AGENYRA",
      "MedVoice",
    ]);
    expect(screen.getAllByText("Building").length).toBeGreaterThanOrEqual(3);
    const medvoice = within(productSection as HTMLElement)
      .getByRole("heading", { name: "MedVoice" })
      .closest("li");
    expect(medvoice).not.toBeNull();
    expect(
      within(medvoice as HTMLElement).queryByRole("link", { name: /live site/i }),
    ).toBeNull();
    const repo = within(medvoice as HTMLElement).getByRole("link", {
      name: /source repository/i,
    });
    expect(repo).toHaveAttribute(
      "href",
      "https://github.com/ayushrai-hub/MedVoiceERP",
    );
    expect(repo).toHaveAttribute("target", "_blank");
    expect(repo).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      within(productSection as HTMLElement).queryByRole("heading", {
        name: "AyushMushrooms",
      }),
    ).toBeNull();
  });

  it("keeps AyushMushrooms in the catalog behind the flagship list", () => {
    renderRoute("/products", <ProductsPage />);
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(headings.slice(0, 3)).toEqual([
      "The Open Framework",
      "AGENYRA",
      "MedVoice",
    ]);
    expect(screen.getByRole("link", { name: "AyushMushrooms" })).toHaveAttribute(
      "href",
      "/products/ayushmushrooms",
    );
    expect(screen.getByText("MVP")).toBeInTheDocument();
    const framework = screen
      .getByRole("heading", { name: "The Open Framework" })
      .closest("li");
    const live = within(framework as HTMLElement).getByRole("link", {
      name: /live site/i,
    });
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders distinct product detail pages with canonical URLs", () => {
    const { unmount } = renderRoute(
      "/products/medvoice",
      <ProductDetailPage />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "MedVoice" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/must not decide medicine identity/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Live site" })).toBeNull();
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.ayushrai.site/products/medvoice/",
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.ayushrai.site/products/medvoice/",
    );
    const structured = document.querySelector(
      'script[type="application/ld+json"]',
    )?.textContent;
    expect(structured).toContain("CreativeWork");
    expect(structured).not.toContain("aggregateRating");
    unmount();

    renderRoute("/products/the-open-framework", <ProductDetailPage />);
    expect(screen.getByText(/Vite, React, TypeScript/)).toBeInTheDocument();
    expect(screen.queryByText(/Kubernetes/)).toBeNull();
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.ayushrai.site/products/the-open-framework/",
    );
    const descriptions = FLAGSHIP.map(
      (slug) => getProductBySlug(slug)?.summary,
    );
    expect(new Set(descriptions).size).toBe(3);
  });

  it("shows a verified build log and the matching case study", () => {
    const { unmount } = renderRoute(
      "/products/agenyra/log",
      <ProductLogPage />,
    );
    expect(screen.getByText("2026-09-29")).toBeInTheDocument();
    expect(screen.queryByText(/No verified build-log entries yet/)).toBeNull();
    unmount();

    renderRoute("/work/medvoice", <WorkDetailPage />);
    expect(screen.getByRole("link", { name: "Product page" })).toHaveAttribute(
      "href",
      "/products/medvoice",
    );
    expect(screen.getAllByText(/MedVoice Agent/).length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: /live \/ demo/i })).toBeNull();
  });
});
