/**
 * Prose for the /privacy page and the explanatory sections beside the contact form.
 *
 * Each export is a list of `PolicySection`s (a heading plus paragraphs). The
 * same arrays render as HTML and as Markdown, so the two never diverge.
 * Paragraphs interpolate `person.email` and `person.responseTime`.
 *
 * Connects to:
 * - `privacySections`: PrivacyPage and /privacy.md.
 * - `contactSections`: ContactPage and /contact.md.
 * - `PolicySection` is also reused by src/lib/agent/developerDocs.ts for the
 *   /developers page body.
 * - Reads `person` from person.ts; defines its own `PolicySection` type
 *   rather than one from types.ts.
 */
import { person } from "./person";

/** One headed block of policy prose. Each paragraph is plain text. */
export interface PolicySection {
  heading: string;
  paragraphs: string[];
}

/**
 * Privacy notice rendered on /privacy and /privacy.md. Describes what the
 * shipped code does. Update it when analytics, hosting, or the contact form
 * change. Do not add retention periods or guarantees that are not configured.
 */
export const privacySections: PolicySection[] = [
  {
    heading: "Who runs this site",
    paragraphs: [
      `${person.name} runs this site as a personal website. There are no accounts, no paid plans, no advertising, and no newsletter sign-up on it. Questions about this page go to ${person.email}.`,
    ],
  },
  {
    heading: "Analytics",
    paragraphs: [
      "Every page loads Google Tag Manager and Google Analytics 4. They record which pages you view, some clicks, and the browser, device, referrer, and approximate location data Google collects by default. Google sets cookies so it can tell repeat visits apart. Google keeps that data under its own terms and the property's retention setting.",
      "Vercel Web Analytics also counts page views. Its script and requests go through this site's own /_vercel/insights path to Vercel. It does not set cookies.",
    ],
  },
  {
    heading: "Hosting and server logs",
    paragraphs: [
      "The site is static HTML served by Netlify, and may also be served by Vercel. Like any web host, they process your IP address, user agent, and the URL you requested in order to deliver the page and protect the service. The public search and project API runs on the same hosts and is logged the same way. None of it requires an API key or identifies you to me.",
    ],
  },
  {
    heading: "Contact form and email",
    paragraphs: [
      "The contact form sends your name, email address, chosen intent, and message to a serverless function, which delivers it to my inbox through SendGrid. This site does not store the message in a database. Your email address is used only to reply to you and is not added to any mailing list.",
      "If you email me directly or book a call through Calendly, those services handle the message or booking under their own privacy policies.",
    ],
  },
  {
    heading: "Stored in your browser",
    paragraphs: [
      "If you switch between light and dark themes, the choice is saved in your browser's local storage under the key \"theme\". It never leaves your device.",
    ],
  },
  {
    heading: "Your requests",
    paragraphs: [
      `To ask what I hold from your messages, or to have that correspondence deleted, email ${person.email}. Requests about Google Analytics data can also go to Google directly, and Google offers a browser add-on to opt out of Analytics.`,
    ],
  },
];

/**
 * Context shown beside the contact form on /contact and appended to
 * /contact.md. The phone line reads `person.phoneDisplay`.
 */
export const contactSections: PolicySection[] = [
  {
    heading: "What to write about",
    paragraphs: [
      "This page is for work opportunities in AI engineering or software, conversations about one of my products, research and evaluation questions, collaborations, speaking, and consulting. A plain hello is fine too.",
      "A short note works best. Say who you are, what you need, and any deadline. Links to a repository, a document, or a job description help more than a long first message.",
    ],
  },
  {
    heading: "What happens next",
    paragraphs: [
      `The form delivers your message to my inbox; it is not stored on this site. I reply from ${person.email}, usually within ${person.responseTime}. If the form fails, the "Open mail app" button opens the same message in your email client.`,
      `You can also call me or message me on WhatsApp at ${person.phoneDisplay}. For a longer conversation, book a time through Calendly.`,
    ],
  },
];
