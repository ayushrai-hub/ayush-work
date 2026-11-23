/**
 * Reusable Loom and YouTube video embed component with a planned-walkthrough placeholder slot.
 *
 * Normalizes Loom share links (`loom.com/share/<id>` -> `loom.com/embed/<id>`) and YouTube watch
 * or short links (`youtube.com/watch?v=<id>`, `youtu.be/<id>`) into privacy-enhanced embed URLs
 * via `videoEmbedUrl` from `src/content`. When `url` is unset, renders a structured replacement
 * slot listing the planned walkthrough topics so the page has no broken iframe and no fake recording.
 *
 * Connects to:
 * - Used by GtmPage (`/gtm`) and available to product and case-study pages.
 * - Uses `videoEmbedUrl` from `src/content`.
 */
import { videoEmbedUrl } from "../../content";

/** Props for VideoEmbed. */
export interface VideoEmbedProps {
  /** Loom, YouTube, or Vimeo URL. When omitted, renders the planned walkthrough placeholder slot. */
  url?: string;
  /** Accessible iframe title. */
  title: string;
  /** Topics the walkthrough covers when `url` is not recorded yet. */
  plannedTopics?: readonly string[];
  /** Optional heading shown in the placeholder slot before `url` is set. */
  placeholderHeading?: string;
  /** Optional caption or status note below the video. */
  caption?: string;
  /** Optional replacement slot identifier. */
  slot?: string;
}

/** Responsive 16:9 YouTube/Loom/Vimeo iframe, or a structured planned-topics slot when unrecorded. */
export default function VideoEmbed({
  url,
  title,
  plannedTopics = [],
  placeholderHeading = "Loom walkthrough coming soon. It will cover:",
  caption,
  slot = "walkthrough-video",
}: VideoEmbedProps) {
  if (url) {
    return (
      <figure className="mt-4 max-w-3xl">
        <div className="aspect-video w-full border border-rule bg-paper-elevated">
          <iframe
            src={videoEmbedUrl(url)}
            title={title}
            className="h-full w-full"
            allow="fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </div>
        {caption && (
          <figcaption className="mt-2 font-mono text-xs text-ink-faint">{caption}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <div
      className="mt-4 max-w-measure border border-dashed border-rule bg-paper-elevated p-5"
      data-slot={slot}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium text-ink">{placeholderHeading}</p>
        <span className="font-mono text-xs text-ink-faint">Video slot · {slot}</span>
      </div>
      {plannedTopics.length > 0 && (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
          {plannedTopics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      )}
      {caption && <p className="mt-3 font-mono text-xs text-ink-faint">{caption}</p>}
    </div>
  );
}
