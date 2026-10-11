import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import ProductLogPage from "../pages/ProductLogPage";

vi.mock("../content", async () => {
  const actual = await vi.importActual<typeof import("../content")>("../content");
  return {
    ...actual,
    getProductBySlug: (slug: string) => {
      if (slug === "empty-log-fixture") {
        return {
          ...actual.products[0],
          slug: "empty-log-fixture",
          title: "Empty Log Fixture",
          summary: "Fixture with no dated notes.",
          log: [],
          demoUrl: undefined,
          githubUrl: undefined,
          relatedWorkSlug: undefined,
        };
      }
      return actual.getProductBySlug(slug);
    },
  };
});

describe("empty product build log", () => {
  it("explains that dates are withheld until a record exists", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/products/empty-log-fixture/log"]}>
          <Routes>
            <Route path="/products/:slug/log" element={<ProductLogPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Empty Log Fixture" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No verified build-log entries yet/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
