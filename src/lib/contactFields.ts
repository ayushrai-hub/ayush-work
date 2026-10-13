/**
 * Contact form field limits and the honeypot field name, shared by the browser form and the server.
 *
 * Kept separate from src/lib/server/contactEmail.ts so the browser bundle does not pull in the
 * SendGrid client. The honeypot is a hidden input that people never see or fill; automated
 * submitters that fill every field put a value in it, and the server then skips sending.
 *
 * Connects to:
 * - src/pages/ContactPage.tsx (input `maxLength` values and the hidden honeypot input).
 * - src/lib/server/contactEmail.ts (server-side length checks and honeypot handling).
 */

/** Maximum lengths, in characters, accepted for each submitted field. */
export const CONTACT_FIELD_LIMITS = {
  name: 200,
  email: 254,
  subject: 200,
  service: 200,
  message: 5000,
} as const;

/** JSON key of the honeypot field. A non-empty value marks the submission as automated. */
export const CONTACT_HONEYPOT_FIELD = "website";
