/**
 * Host-independent contact form logic: validate the submitted fields and send them as an email via SendGrid.
 *
 * handleContactEmail takes an HTTP method and a raw body (JSON string, bytes, or an already parsed
 * object) and returns a status plus JSON body; it never touches a request or response object. It
 * reads env SENDGRID_API_KEY (required), FROM_EMAIL (sender), and CONTACT_EMAIL (recipient inbox);
 * the last two fall back to hard-coded defaults. The visitor's address is set as reply-to.
 *
 * Connects to:
 * - api/send-email.ts, which adapts Netlify, Vercel, and legacy event calls to this function.
 * - src/__tests__/contactEmail.test.ts (mocks @sendgrid/mail).
 * - @sendgrid/mail.
 */
import sgMail from "@sendgrid/mail";

/** Fields the contact form posts. All are optional here because the body is untrusted. */
type ContactFields = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  service?: string;
};

/** HTTP status and JSON body for the caller to send. A null body means an empty response (preflight). */
export type ContactEmailResult = {
  status: number;
  body: { success?: boolean; message: string } | null;
};

/**
 * Normalizes the body: parses a JSON string or UTF-8 bytes, treats empty/null as `{}`, and passes
 * objects through. Returns null for malformed JSON so the handler can answer 400.
 */
function readFields(raw: unknown): ContactFields | null {
  try {
    if (typeof raw === "string" || raw == null) {
      return JSON.parse(raw && raw.length > 0 ? raw : "{}") as ContactFields;
    }
    if (raw instanceof Uint8Array) {
      return JSON.parse(new TextDecoder().decode(raw)) as ContactFields;
    }
  } catch {
    return null;
  }
  return raw as ContactFields;
}

/** True for a non-empty string; JSON bodies can carry numbers, arrays, or objects instead. */
function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/** Escapes visitor text before it is placed in the notification email's HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validate a contact request and send it through SendGrid.
 *
 * OPTIONS returns 200 with no body; other non-POST methods return 405. A body that is not valid
 * JSON, missing name, email, subject, or message, or a malformed email returns 400. A missing
 * SENDGRID_API_KEY returns 500. Field values are HTML-escaped before they go into the email body.
 * SendGrid errors are not caught here; they propagate to the caller.
 * Runtime-specific request and response adaptation stays in api/send-email.ts.
 */
export async function handleContactEmail(
  method: string,
  rawBody: unknown,
): Promise<ContactEmailResult> {
  if (method === "OPTIONS") {
    return { status: 200, body: null };
  }

  if (method !== "POST") {
    return { status: 405, body: { message: "Method not allowed" } };
  }

  const fields = readFields(rawBody);
  if (!fields) {
    return {
      status: 400,
      body: { success: false, message: "Request body must be valid JSON" },
    };
  }

  const { name, email, subject, message, service } = fields;

  if (
    !isFilled(name) ||
    !isFilled(email) ||
    !isFilled(subject) ||
    !isFilled(message) ||
    (service !== undefined && typeof service !== "string")
  ) {
    return {
      status: 400,
      body: { success: false, message: "Missing required fields" },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: 400,
      body: { success: false, message: "Invalid email format" },
    };
  }

  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (!sendgridApiKey) {
    console.error("SENDGRID_API_KEY not configured");
    return {
      status: 500,
      body: { success: false, message: "Email service not configured" },
    };
  }

  sgMail.setApiKey(sendgridApiKey);
  // The FROM_EMAIL fallback is a placeholder; SendGrid only accepts a verified sender.
  await sgMail.send({
    to: process.env.CONTACT_EMAIL || "ayushrai0211@gmail.com",
    from: {
      email: process.env.FROM_EMAIL || "noreply@yourdomain.com",
      name: "Portfolio Contact Form",
    },
    subject: `Portfolio Contact: ${subject}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p><strong>Service Interest:</strong> ${escapeHtml(service || "Not specified")}</p>
          </div>

          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

          <p style="color: #64748b; font-size: 14px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    replyTo: {
      email,
      name,
    },
  });

  return {
    status: 200,
    body: { success: true, message: "Message sent successfully!" },
  };
}
