/**
 * State tests for pages with client-side behavior: the contact form, Agent view, and not-found routes.
 *
 * Contact: the submit button is disabled while sending, success shows the server message and clears
 * the message, failure keeps the message and shows the error, the honeypot field is sent empty, and
 * the mail-app link follows the chosen intent. Agent view: Copy uses the Clipboard API, falls back to
 * execCommand, and finally selects the Markdown and names the shortcut; Download saves `<page>.md`;
 * a path without a twin gets a noindexed notice. Not found: an unknown detail slug and an unknown
 * path both render a noindexed page with a `/404` canonical and a way back.
 *
 * Connects to:
 * - src/pages/ContactPage.tsx and src/lib/emailService.ts
 * - src/components/site/AgentView.tsx, SiteLayout.tsx, MissingRecord.tsx; src/pages/NotFoundPage.tsx
 * - src/App.tsx (AppRoutes)
 */
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppRoutes } from "../App";
import { person } from "../content";
import { ThemeProvider } from "../contexts/ThemeContext";
import { getAgentPage } from "../lib/agent/markdown";
import { CONTACT_HONEYPOT_FIELD } from "../lib/contactFields";
import EmailService, { type EmailResult } from "../lib/emailService";

/** Renders the real routes at `path` with the providers the client entry uses. */
function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
}

/** The rendered `<meta name="robots">` content. setupTests makes Helmet a pass-through, so tags render in place. */
function robots() {
  return document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
}

afterEach(() => {
  vi.restoreAllMocks();
});

/** Contact form submit states. */
describe("ContactPage", () => {
  /** Fills the required fields and returns the message box. */
  async function fillForm() {
    await import("../pages/ContactPage");
    renderAt("/contact");
    fireEvent.change(await screen.findByLabelText("Email"), { target: { value: "reader@example.com" } });
    const message = screen.getByLabelText("Message");
    fireEvent.change(message, { target: { value: "Hello there" } });
    return message as HTMLTextAreaElement;
  }

  it("disables Send while sending, then shows the server message and clears the note", async () => {
    let resolve: (value: EmailResult) => void = () => undefined;
    const send = vi
      .spyOn(EmailService, "sendContactEmail")
      .mockReturnValue(new Promise<EmailResult>((done) => (resolve = done)));
    const message = await fillForm();

    fireEvent.click(screen.getByRole("radio", { name: "Research" }));
    fireEvent.submit(message.closest("form") as HTMLFormElement);
    const pending = screen.getByRole("button", { name: "Sending…" });
    expect(pending).toBeDisabled();
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Visitor",
        email: "reader@example.com",
        message: "Hello there",
        service: "Research",
        [CONTACT_HONEYPOT_FIELD]: "",
      }),
    );

    await act(async () => resolve({ success: true, message: "Message sent." }));
    expect(screen.getByRole("status")).toHaveTextContent("Message sent.");
    expect(message.value).toBe("");
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });

  it("keeps the note and shows the error when sending fails", async () => {
    vi.spyOn(EmailService, "sendContactEmail").mockResolvedValue({
      success: false,
      message: "Too many messages from this address.",
    });
    const message = await fillForm();
    await act(async () => {
      fireEvent.submit(message.closest("form") as HTMLFormElement);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Too many messages from this address.");
    expect(message.value).toBe("Hello there");
  });

  it("points the mail-app link at the chosen intent and includes the note", async () => {
    await fillForm();
    const link = screen.getByRole("link", { name: "Open mail app" });
    expect(link.getAttribute("href")).toMatch(new RegExp(`^mailto:${person.email}\\?subject=`));
    expect(link.getAttribute("href")).toContain("&body=Hello%20there");
  });
});

/** Agent view controls. */
describe("AgentView controls", () => {
  const markdown = getAgentPage("/about")?.markdown ?? "";

  /** Installs (or removes) `navigator.clipboard` for one test. */
  function setClipboard(writeText: ((text: string) => Promise<void>) | undefined) {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: writeText ? { writeText } : undefined,
    });
  }

  afterEach(() => {
    setClipboard(undefined);
    Reflect.deleteProperty(document, "execCommand");
  });

  it("copies with the Clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    renderAt("/about?agent=1");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    expect(writeText).toHaveBeenCalledWith(markdown);
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByText("Markdown copied.")).toBeInTheDocument();
  });

  it("falls back to execCommand when the Clipboard API is refused", async () => {
    setClipboard(() => Promise.reject(new Error("denied")));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });
    renderAt("/about?agent=1");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(document.querySelector("textarea[readonly]")).toBeNull();
  });

  it("selects the Markdown and names the shortcut when no copy method works", async () => {
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn().mockReturnValue(false) });
    renderAt("/about?agent=1");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    expect(screen.getByRole("button", { name: /^Selected\. Press / })).toBeInTheDocument();
    expect(screen.getByText("Clipboard unavailable. The markdown text is selected.")).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toContain(markdown.slice(0, 40));
    expect(document.querySelector("textarea[readonly]")).toBeNull();
  });

  it("downloads the Markdown as the page's .md file", () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:about");
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("about.md");
      expect(this.href).toBe("blob:about");
    });
    renderAt("/about?agent=1");
    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    expect(click).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("text/markdown;charset=utf-8");
    expect(blob.size).toBe(new TextEncoder().encode(markdown).length);
  });

  it("explains when a path has no Markdown twin and is not indexed", async () => {
    renderAt("/design-system?agent=1");
    expect(screen.getByRole("heading", { name: "No agent view for this page" })).toBeInTheDocument();
    const notice = screen.getByText(/does not have a Markdown twin/);
    expect(within(notice).getByRole("link", { name: "llms.txt" })).toHaveAttribute("href", "/llms.txt");
    await waitFor(() => expect(robots()).toBe("noindex, follow"));
    expect(document.title).toBe(`No agent view · ${person.name}`);
  });
});

/** Unknown slugs and unknown paths. */
describe("not-found routes", () => {
  it.each([
    ["/work/no-such-case-study", "Work not found", "/work"],
    ["/products/no-such-product", "Product not found", "/products"],
    ["/products/no-such-product/log", "Log not found", "/products"],
    ["/research/no-such-paper", "Research not found", "/research"],
    ["/writing/no-such-essay", "Writing not found", "/writing"],
    ["/notes/no-such-note", "Note not found", "/notes"],
  ])("%s renders a noindexed not-found record", async (path, title, back) => {
    renderAt(path);
    expect(
      await screen.findByRole("heading", { level: 1, name: title }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Back to / })).toHaveAttribute("href", back);
    await waitFor(() => expect(robots()).toContain("noindex"));
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(/\/404\/?$/);
  });

  it("renders the 404 page for an unknown path", async () => {
    renderAt("/no/such/page");
    expect(await screen.findByRole("heading", { level: 1, name: "This page does not exist yet." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
    await waitFor(() => expect(robots()).toContain("noindex"));
  });
});
