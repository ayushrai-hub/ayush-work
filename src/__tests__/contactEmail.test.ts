import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendGrid = vi.hoisted(() => ({
  setApiKey: vi.fn(),
  send: vi.fn(),
}));

vi.mock("@sendgrid/mail", () => ({
  default: sendGrid,
}));

import { handleContactEmail } from "../lib/server/contactEmail";

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
