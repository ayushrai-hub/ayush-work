/**
 * Browser client for the contact form endpoint.
 *
 * sendContactEmail POSTs the form fields as JSON to `/api/send-email` and always resolves to
 * `{ success, message }`; it never throws. A non-JSON reply (for example an HTML error page) is
 * caught with fetch failures and reported as a network error.
 *
 * Connects to:
 * - Live site: src/pages/ContactPage.tsx.
 * - api/send-email.ts on the same origin (SendGrid delivery in src/lib/server/contactEmail.ts).
 */

/** Request body for `/api/send-email`. `service` is the selected intent label. */
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
}

/** Static wrapper around the contact endpoint; there is no instance state. */
class EmailService {
  /**
   * Sends one contact message. Success requires an HTTP 2xx and `success: true` in the body;
   * otherwise the server's `message` (or a generic one) is returned with `success: false`.
   */
  static async sendContactEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: result.message };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to send message. Please try again.'
        };
      }
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Network error. Please check your internet connection and try again.'
      };
    }
  }
}

export default EmailService;
