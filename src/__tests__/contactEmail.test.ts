/**
 * Unit tests for the framework-neutral contact handler behind the /api/send-email function.
 *
 * Verifies that OPTIONS returns 200 without sending, that an invalid email
 * returns 400 "Invalid email format" without sending, and that a valid POST
 * sets the SendGrid key from SENDGRID_API_KEY and sends to CONTACT_EMAIL from
 * FROM_EMAIL with the visitor as reply-to.
 *
 * SendGrid is replaced by hoisted spies so no network call is made; env vars
 * are stubbed per test and restored afterwards.
 *
 * Connects to:
 * - src/lib/server/contactEmail.ts (`handleContactEmail`)
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

import { handleContactEmail } from "../lib/server/contactEmail";

/** Preflight, validation rejection, and successful send through handleContactEmail. */
describe("contact email service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("SENDGRID_API_KEY", "test-sendgrid-key");
    vi.stubEnv("CONTACT_EMAIL", "inbox@example.com");
    vi.stubEnv("FROM_EMAIL", "sender@example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("handles preflight without sending mail", async () => {
    await expect(handleContactEmail("OPTIONS", null)).resolves.toEqual({
      status: 200,
      body: null,
    });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    await expect(
      handleContactEmail("POST", {
        name: "Visitor",
        email: "invalid",
        subject: "Hello",
        message: "Test message",
      }),
    ).resolves.toEqual({
      status: 400,
      body: { success: false, message: "Invalid email format" },
    });
    expect(sendGrid.send).not.toHaveBeenCalled();
  });

  it("sends a validated message using the configured addresses", async () => {
    sendGrid.send.mockResolvedValue(undefined);

    await expect(
      handleContactEmail("POST", {
        name: "Visitor",
        email: "visitor@example.com",
        subject: "Hello",
        message: "Test message",
        service: "Collaboration",
      }),
    ).resolves.toEqual({
      status: 200,
      body: { success: true, message: "Message sent successfully!" },
    });

    expect(sendGrid.setApiKey).toHaveBeenCalledWith("test-sendgrid-key");
    expect(sendGrid.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "inbox@example.com",
        from: {
          email: "sender@example.com",
          name: "Portfolio Contact Form",
        },
        replyTo: {
          email: "visitor@example.com",
          name: "Visitor",
        },
      }),
    );
  });
});
