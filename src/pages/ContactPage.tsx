import { useState, type FormEvent } from "react";
import PageSEO from "../components/site/PageSEO";
import PageHeader from "../components/editorial/PageHeader";
import Prose from "../components/editorial/Prose";
import { person } from "../content";
import EmailService from "../lib/emailService";

const INTENTS = [
  { id: "work", label: "Work opportunity", subject: "Work opportunity" },
  { id: "product", label: "Product", subject: "Product conversation" },
  { id: "research", label: "Research", subject: "Research" },
  { id: "collaboration", label: "Collaboration", subject: "Collaboration" },
  { id: "speaking", label: "Speaking", subject: "Speaking" },
  { id: "consulting", label: "Consulting", subject: "Consulting" },
  { id: "hello", label: "Hello", subject: "Hello" },
] as const;

type IntentId = (typeof INTENTS)[number]["id"];

export default function ContactPage() {
  const [intent, setIntent] = useState<IntentId>("hello");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );
  const [statusMsg, setStatusMsg] = useState("");

  const selected = INTENTS.find((i) => i.id === intent) ?? INTENTS[6];

  const mailtoHref = `mailto:${person.email}?subject=${encodeURIComponent(
    selected.subject
  )}${message ? `&body=${encodeURIComponent(message)}` : ""}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const result = await EmailService.sendContactEmail({
      name: name || "Visitor",
      email,
      subject: selected.subject,
      message,
      service: selected.label,
    });
    if (result.success) {
      setStatus("ok");
      setStatusMsg(result.message);
      setMessage("");
    } else {
      setStatus("err");
      setStatusMsg(result.message);
    }
  }

  return (
    <>
      <PageSEO
        title="Contact"
        description="Email Ayush about work, products, research, or a quiet hello."
        path="/contact"
      />
      <div className="site-shell page-section">
        <PageHeader
          label="Contact"
          title="Get in touch"
          dek="Pick an intent, write a short note. No hire-me spam required."
        />

        <Prose className="mb-10">
          <p>
            Direct email always works:{" "}
            <a href={`mailto:${person.email}`} className="link-accent">
              {person.email}
            </a>
            . For a scheduled call, use{" "}
            <a
              href={person.primaryProfiles.cal}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Cal.com
            </a>
            .
          </p>
        </Prose>

        <fieldset className="mb-8">
          <legend className="label mb-3">Intent</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Contact intent">
            {INTENTS.map((i) => (
              <button
                key={i.id}
                type="button"
                role="radio"
                aria-checked={intent === i.id}
                onClick={() => setIntent(i.id)}
                className={`rounded-sm border px-3 py-1.5 text-sm ${
                  intent === i.id
                    ? "border-ink bg-ink text-paper-elevated"
                    : "border-rule text-ink-muted hover:border-ink"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </fieldset>

        <form onSubmit={onSubmit} className="max-w-measure space-y-5">
          <div>
            <label htmlFor="contact-name" className="label mb-1 block">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-sm border border-rule bg-paper-elevated px-3 py-2 text-ink"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="label mb-1 block">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-rule bg-paper-elevated px-3 py-2 text-ink"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="label mb-1 block">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-sm border border-rule bg-paper-elevated px-3 py-2 text-ink"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-primary"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <a href={mailtoHref} className="btn-secondary">
              Open mail app
            </a>
          </div>
          {statusMsg && (
            <p
              role="status"
              className={`text-sm ${
                status === "ok" ? "text-accent" : "text-signal"
              }`}
            >
              {statusMsg}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
