/**
 * Unit tests for the contact form: the framework-neutral handler, the serverless adapter, and the
 * browser client.
 *
 * Handler: OPTIONS returns 200 without sending; invalid email, malformed JSON, non-string and
 * over-long fields return 400; a valid POST sends to CONTACT_EMAIL from FROM_EMAIL with the visitor
 * as reply-to; visitor text is HTML-escaped and line breaks are removed from the subject; missing
 * FROM_EMAIL or SENDGRID_API_KEY returns 500 without sending; a filled honeypot returns success
 * without sending; the sixth POST in a window returns 429 with Retry-After; a SendGrid failure
 * returns 502 and logs no visitor data.
 * Adapter (api/send-email.ts): CORS is granted only to the site's own origins.
 * Client (src/lib/emailService.ts): non-JSON replies report the HTTP status, server messages pass
 * through, and fetch failures report a network error.
 *
 * SendGrid is replaced by hoisted spies so no network call is made; env vars are stubbed per test.
 *
 * Connects to:
 * - src/lib/server/contactEmail.ts, api/send-email.ts, src/lib/emailService.ts
 * - @sendgrid/mail (mocked here and also, more loosely, in src/setupTests.ts)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// vi.hoisted makes the spies available inside the hoisted vi.mock factory below.
const sendGrid = vi.hoisted(() => ({
  setApiKey: vi.fn(),
  send: vi.fn(),
}));

vi.mock("@sendgrid/mail", () => ({
  default: sendGrid,
}));

import {
  CONTACT_RATE_LIMIT,
  handleContactEmail,
  resetContactRateLimit,
} from "../lib/server/contactEmail";
import sendEmailHandler from "../../api/send-email";
import EmailService from "../lib/emailService";

const VALID = {
  name: "Visitor",
  email: "visitor@example.com",
  subject: "Hello",
  message: "Test message",
};

beforeEach(() => {
  vi.clearAllMocks();
  resetContactRateLimit();
  vi.stubEnv("SENDGRID_API_KEY", "test-sendgrid-key");
  vi.stubEnv("CONTACT_EMAIL", "inbox@example.com");
  vi.stubEnv("FROM_EMAIL", "sender@example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

/** Preflight, validation, configuration, abuse protection, and delivery through handleContactEmail. */
describe("contact email handler", () => {
  it("handles preflight without sending mail", async () => {
    await expect(handleContactEmail("OPTIONS", null)).resolves.toEqual({
      status: 200,
      body: null,
    });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const result = await handleContactEmail("POST", { ...VALID, email: "invalid" });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({ success: false, message: "Invalid email format" });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("sends a validated message using the configured addresses", async () => {
    sendGrid.send.mockResolvedValue(undefined);

    const result = await handleContactEmail("POST", { ...VALID, service: "Collaboration" });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true, message: "Message sent successfully!" });

    expect(sendGrid.setApiKey).toHaveBeenCalledWith("test-sendgrid-key");
    expect(sendGrid.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "inbox@example.com",
        from: { email: "sender@example.com", name: "Portfolio Contact Form" },
        replyTo: { email: "visitor@example.com", name: "Visitor" },
      }),
    );
  });

  it("answers malformed JSON, non-object bodies, and non-string fields with 400", async () => {
    expect((await handleContactEmail("POST", "{not json")).body).toEqual({
      success: false,
      message: "Request body must be valid JSON",
    });
    expect((await handleContactEmail("POST", "[1,2]")).status).toBe(400);
    expect((await handleContactEmail("POST", { ...VALID, name: { first: "Visitor" } })).body).toEqual({
      success: false,
      message: "Missing required fields",
    });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("rejects over-long fields", async () => {
    const result = await handleContactEmail("POST", { ...VALID, message: "x".repeat(5001) });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({ success: false, message: "One or more fields are too long" });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("escapes visitor text in the email HTML and keeps the subject on one line", async () => {
    sendGrid.send.mockResolvedValue(undefined);

    await handleContactEmail("POST", {
      ...VALID,
      name: "<b>Visitor</b>",
      subject: "Hello\r\nBcc: someone@example.com",
      message: `<script>alert("x")</script> & 'quotes'`,
    });

    const sent = sendGrid.send.mock.calls[0][0];
    const html = sent.html as string;
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Visitor</b>");
    expect(html).toContain("&lt;b&gt;Visitor&lt;/b&gt;");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quotes&#39;");
    expect(sent.subject).toBe("Portfolio Contact: Hello Bcc: someone@example.com");
  });

  it("returns 500 without sending when FROM_EMAIL or SENDGRID_API_KEY is missing", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("FROM_EMAIL", "");
    const result = await handleContactEmail("POST", VALID);
    expect(result).toEqual({
      status: 500,
      body: { success: false, message: "Email service not configured" },
    });
    expect(log).toHaveBeenCalledWith("Contact email not configured: missing FROM_EMAIL");

    vi.stubEnv("FROM_EMAIL", "sender@example.com");
    vi.stubEnv("SENDGRID_API_KEY", "");
    expect((await handleContactEmail("POST", VALID)).status).toBe(500);
    expect(sendGrid.send).not.toHaveBeenCalled();
    expect(JSON.stringify(log.mock.calls)).not.toContain("test-sendgrid-key");
  });

  it("answers a filled honeypot with success but sends nothing", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await handleContactEmail("POST", { ...VALID, website: "https://spam.example" });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true, message: "Message sent successfully!" });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("limits each client to the contact quota and reports Retry-After", async () => {
    sendGrid.send.mockResolvedValue(undefined);
    for (let i = 0; i < CONTACT_RATE_LIMIT.quota; i += 1) {
      expect((await handleContactEmail("POST", VALID, "203.0.113.9")).status).toBe(200);
    }
    const limited = await handleContactEmail("POST", VALID, "203.0.113.9");
    expect(limited.status).toBe(429);
    expect(limited.headers?.["Retry-After"]).toMatch(/^\d+$/);
    expect(sendGrid.send).toHaveBeenCalledTimes(CONTACT_RATE_LIMIT.quota);

    // Another client is unaffected.
    expect((await handleContactEmail("POST", VALID, "198.51.100.4")).status).toBe(200);
  });

  it("returns 502 when SendGrid fails and logs no visitor data", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sendGrid.send.mockRejectedValue(Object.assign(new Error("Forbidden"), { code: 403 }));
    const result = await handleContactEmail("POST", VALID);
    expect(result.status).toBe(502);
    expect(log).toHaveBeenCalledWith("SendGrid send failed (403)");
    const logged = JSON.stringify(log.mock.calls);
    expect(logged).not.toContain(VALID.email);
    expect(logged).not.toContain(VALID.message);
  });
});

/** The serverless adapter's CORS and header handling. */
describe("api/send-email adapter", () => {
  /** Calls the Web Request branch with an Origin header. */
  async function post(origin: string) {
    sendGrid.send.mockResolvedValue(undefined);
    return (await sendEmailHandler(
      new Request("https://www.ayushrai.site/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: origin, "x-real-ip": origin },
        body: JSON.stringify(VALID),
      }),
    )) as Response;
  }

  it("grants CORS to the site's own origin", async () => {
    const response = await post("https://www.ayushrai.site");
    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("https://www.ayushrai.site");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("ratelimit-policy")).toBe('"contact";q=5;w=600');
  });

  it("does not grant CORS to other origins", async () => {
    const response = await post("https://evil.example");
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(response.headers.get("vary")).toBe("Origin");
  });
});

/** The browser client's handling of each kind of reply. */
describe("EmailService.sendContactEmail", () => {
  it("reports the HTTP status for a non-JSON reply", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>Bad gateway</html>", { status: 502, headers: { "Content-Type": "text/html" } }),
    );
    await expect(EmailService.sendContactEmail(VALID)).resolves.toEqual({
      success: false,
      message:
        "The contact service returned an unexpected response (HTTP 502). Please use the email link instead.",
    });
  });

  it("passes a JSON error message through", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ success: false, message: "Email service not configured" }, { status: 500 }),
    );
    await expect(EmailService.sendContactEmail(VALID)).resolves.toEqual({
      success: false,
      message: "Email service not configured",
    });
  });

  it("reports a network error when fetch rejects", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    const result = await EmailService.sendContactEmail(VALID);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/^Network error/);
  });

  it("returns success for a 2xx JSON success body", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ success: true, message: "Message sent successfully!" }),
    );
    await expect(EmailService.sendContactEmail(VALID)).resolves.toEqual({
      success: true,
      message: "Message sent successfully!",
    });
  });
});
