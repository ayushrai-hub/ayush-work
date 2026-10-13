/**
 * Browser client for the contact form endpoint.
 *
 * sendContactEmail POSTs the form fields as JSON to `/api/send-email` and always resolves to
 * `{ success, message }`; it never throws. A failed fetch is reported as a network problem. A reply
 * that is not JSON (for example a host error page, or the dev server, which has no functions) is
 * reported with its HTTP status so the cause is visible. JSON errors pass the server's message
 * through (validation, rate limit, or "Email service not configured"). Visitor fields are never
 * logged.
 *
 * Connects to:
 * - Live site: src/pages/ContactPage.tsx.
 * - api/send-email.ts on the same origin (SendGrid delivery in src/lib/server/contactEmail.ts).
 * - src/__tests__/contactEmail.test.ts (responses) and src/__tests__/pageStates.test.tsx (form states).
 */

/** Request body for `/api/send-email`. `service` is the selected intent label; `website` is the honeypot. */
export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
  website?: string;
}

/** Result shown to the visitor. */
export interface EmailResult {
  success: boolean;
  message: string;
}

/** Reads `{ success, message }` from a JSON body, or returns null if the body is not that shape. */
async function readJson(response: Response): Promise<{ success?: unknown; message?: unknown } | null> {
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return null;
  try {
    const body: unknown = await response.json();
    return body && typeof body === "object" ? (body as { success?: unknown; message?: unknown }) : null;
  } catch {
    return null;
  }
}

/** Static wrapper around the contact endpoint; there is no instance state. */
class EmailService {
  /**
   * Sends one contact message. Success requires an HTTP 2xx and `success: true` in a JSON body;
   * otherwise returns `success: false` with the server's message or a status-specific one.
   */
  static async sendContactEmail(data: EmailData): Promise<EmailResult> {
    let response: Response;
    try {
      response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      return {
        success: false,
        message: "Network error. Please check your internet connection and try again.",
      };
    }

    const result = await readJson(response);
    if (!result) {
      return {
        success: false,
        message: `The contact service returned an unexpected response (HTTP ${response.status}). Please use the email link instead.`,
      };
    }

    const serverMessage = typeof result.message === "string" && result.message ? result.message : null;
    if (response.ok && result.success === true) {
      return { success: true, message: serverMessage ?? "Message sent." };
    }
    return {
      success: false,
      message: serverMessage ?? `Failed to send message (HTTP ${response.status}). Please try again.`,
    };
  }
}

export default EmailService;
