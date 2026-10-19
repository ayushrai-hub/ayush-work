/**
 * Host-independent contact form logic: rate-limit, validate, and send the submitted fields as an
 * email via SendGrid.
 *
 * handleContactEmail takes an HTTP method, a raw body (JSON string, bytes, or an already parsed
 * object), and the client's rate-limit key, and returns a status, JSON body, and extra headers; it
 * never touches a request or response object. It needs env SENDGRID_API_KEY and FROM_EMAIL (a
 * SendGrid-verified sender); if either is missing it answers 500 "Email service not configured"
 * without attempting a send. CONTACT_EMAIL (recipient) defaults to the public address in
 * src/content/person.ts. The visitor's address is set as reply-to.
 *
 * Abuse protection: a per-client limit (CONTACT_RATE_LIMIT, counted per function instance, so the
 * real ceiling across instances is higher), field length limits, and a honeypot field. A filled
 * honeypot gets the normal success reply but nothing is sent. Logs never include visitor fields.
 *
 * Connects to:
 * - api/send-email.ts, which adapts Netlify, Vercel, and legacy event calls to this function.
 * - src/lib/contactFields.ts (limits and honeypot name, shared with the browser form).
 * - src/lib/agent/rateLimit.ts (createRateLimiter).
 * - src/__tests__/contactEmail.test.ts (mocks @sendgrid/mail).
 * - @sendgrid/mail.
 */
import sgMail from "@sendgrid/mail";
import { person } from "../../content/person";
import { fingerprintBody, lookupIdempotent, readIdempotencyKey, storeIdempotent } from "../agent/idempotency";
import { createRateLimiter, type RateLimitPolicy } from "../agent/rateLimit";
import { CONTACT_FIELD_LIMITS, CONTACT_HONEYPOT_FIELD } from "../contactFields";

/** Fields the contact form posts. All are optional here because the body is untrusted. */
type ContactFields = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  service?: unknown;
  [CONTACT_HONEYPOT_FIELD]?: unknown;
};

/** HTTP status, JSON body, and extra headers for the caller to send. A null body means an empty response (preflight). */
export type ContactEmailResult = {
  status: number;
  body: { success?: boolean; message: string } | null;
  headers?: Record<string, string>;
};

/** Five messages per client per ten minutes, per function instance. */
export const CONTACT_RATE_LIMIT: RateLimitPolicy = {
  name: "contact",
  quota: 5,
  windowSeconds: 600,
};

const contactLimiter = createRateLimiter(CONTACT_RATE_LIMIT);

/** Clears the contact limiter's windows. Used by tests. */
export function resetContactRateLimit() {
  contactLimiter.reset();
}

const SENT = { success: true, message: "Message sent successfully!" } as const;

/**
 * Normalizes the body: parses a JSON string or UTF-8 bytes, treats empty/null as `{}`, and passes
 * objects through. Returns null for malformed JSON or a non-object body so the handler can answer 400.
 */
function readFields(raw: unknown): ContactFields | null {
  let value: unknown = raw;
  try {
    if (typeof raw === "string" || raw == null) {
      value = JSON.parse(raw && raw.length > 0 ? raw : "{}");
    } else if (raw instanceof Uint8Array) {
      value = JSON.parse(new TextDecoder().decode(raw));
    }
  } catch {
    return null;
  }
  return value && typeof value === "object" && !Array.isArray(value) ? (value as ContactFields) : null;
}

/** True for a non-empty string; JSON bodies can carry numbers, arrays, or objects instead. */
function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/** Collapses line breaks so a value is safe in a single-line header such as the subject. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
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

/** 400 result with the shared failure shape. */
function badRequest(message: string): ContactEmailResult {
  return { status: 400, body: { success: false, message } };
}

/**
 * Validate a contact request and send it through SendGrid.
 *
 * OPTIONS returns 200 with no body; other non-POST methods return 405. Each POST counts against
 * CONTACT_RATE_LIMIT for `clientKey`; over the limit returns 429 with Retry-After. A body that is
 * not a JSON object, missing name, email, subject, or message, an over-long field, or a malformed
 * email returns 400. A filled honeypot returns the success reply without sending. Missing
 * SENDGRID_API_KEY or FROM_EMAIL returns 500. A SendGrid failure returns 502 and logs only the
 * error code. Runtime-specific request and response adaptation stays in api/send-email.ts.
 */
export async function handleContactEmail(
  method: string,
  rawBody: unknown,
  clientKey = "anonymous",
  idempotencyKey?: string | null,
): Promise<ContactEmailResult> {
  if (method === "OPTIONS") {
    return { status: 200, body: null };
  }

  if (method !== "POST") {
    return { status: 405, body: { message: "Method not allowed" }, headers: { Allow: "POST, OPTIONS" } };
  }

  const key = readIdempotencyKey(idempotencyKey);
  if (key.error) return badRequest(key.error);
  const rawText = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody ?? {});
  const fingerprint = fingerprintBody(rawText);
  if (key.key) {
    const prior = lookupIdempotent("contact", key.key, fingerprint);
    if (prior.kind === "conflict") {
      return { status: 409, body: { success: false, message: "Idempotency-Key was already used with a different body." } };
    }
    if (prior.kind === "replay") {
      return {
        status: prior.status,
        body: prior.body as ContactEmailResult["body"],
        headers: { ...(prior.extraHeaders ?? {}), "Idempotent-Replayed": "true" },
      };
    }
  }

  /** Stores a successful send so a retry with the same key does not send again. */
  const remember = (result: ContactEmailResult): ContactEmailResult => {
    if (key.key && result.status === 200 && result.body) {
      storeIdempotent("contact", key.key, fingerprint, result.status, result.body, result.headers);
    }
    return result;
  };

  const limit = contactLimiter.take(clientKey);
  if (!limit.allowed) {
    return {
      status: 429,
      body: {
        success: false,
        message: `Too many messages. Please wait a few minutes, or email ${person.email} directly.`,
      },
      headers: limit.headers,
    };
  }

  const fields = readFields(rawBody);
  if (!fields) {
    return badRequest("Request body must be valid JSON");
  }

  const honeypot = fields[CONTACT_HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    console.warn("Contact form honeypot filled; message dropped");
    return remember({ status: 200, body: { ...SENT }, headers: limit.headers });
  }

  const { name, email, subject, message, service } = fields;

  if (
    !isFilled(name) ||
    !isFilled(email) ||
    !isFilled(subject) ||
    !isFilled(message) ||
    (service !== undefined && typeof service !== "string")
  ) {
    return badRequest("Missing required fields");
  }

  if (
    name.length > CONTACT_FIELD_LIMITS.name ||
    email.length > CONTACT_FIELD_LIMITS.email ||
    subject.length > CONTACT_FIELD_LIMITS.subject ||
    message.length > CONTACT_FIELD_LIMITS.message ||
    (typeof service === "string" && service.length > CONTACT_FIELD_LIMITS.service)
  ) {
    return badRequest("One or more fields are too long");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return badRequest("Invalid email format");
  }

  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  if (!sendgridApiKey || !fromEmail) {
    const missing = [!sendgridApiKey && "SENDGRID_API_KEY", !fromEmail && "FROM_EMAIL"].filter(Boolean);
    console.error(`Contact email not configured: missing ${missing.join(", ")}`);
    return {
      status: 500,
      body: { success: false, message: "Email service not configured" },
    };
  }

  const safeName = singleLine(name);
  const safeService = typeof service === "string" && service.length > 0 ? service : "Not specified";

  sgMail.setApiKey(sendgridApiKey);
  try {
    await sgMail.send({
      to: process.env.CONTACT_EMAIL || person.email,
      from: {
        email: fromEmail,
        name: "Portfolio Contact Form",
      },
      subject: `Portfolio Contact: ${singleLine(subject)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p><strong>Service Interest:</strong> ${escapeHtml(safeService)}</p>
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
        name: safeName,
      },
    });
  } catch (error) {
    const code = (error as { code?: unknown }).code;
    console.error(`SendGrid send failed (${typeof code === "number" ? code : "no status"})`);
    return {
      status: 502,
      body: { success: false, message: "Failed to send message. Please try again later." },
    };
  }

  return remember({ status: 200, body: { ...SENT }, headers: limit.headers });
}
