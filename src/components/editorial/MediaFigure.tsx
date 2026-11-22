/**
 * Reusable media figure: displays an image or an SVG architectural diagram when `src` is present,
 * and renders an accessible replacement slot when `src` is not yet provided.
 *
 * Keeps image dimensions, captions, source attributions, and replacement slots consistent across
 * products, GTM systems, case studies, and domain pages. Never renders decorative empty boxes;
 * a missing image states the slot ID and what artifact belongs there.
 *
 * Connects to:
 * - Used by GtmPage, ProductDetailPage, WorkDetailPage, and MediaGallery.
 * - No external dependencies.
 */

/** Props for MediaFigure. */
export interface MediaFigureProps {
  /** Image path under /public or external URL. When omitted, renders a replacement slot. */
  src?: string;
  /** Accessible alt text required whenever `src` is set. */
  alt: string;
  /** Caption displayed below the image or slot. */
  caption?: string;
  /** Provenance label (e.g. "Repository screenshot", "Design artifact", "Live capture"). */
  badge?: string;
  /** Stable slot identifier shown when `src` is omitted so future screenshots drop in cleanly. */
  slot?: string;
  /** Intrinsic width hint to avoid layout shift. */
  width?: number;
  /** Intrinsic height hint to avoid layout shift. */
  height?: number;
  /** Aspect ratio utility class, defaults to `aspect-[16/10]`. */
  aspectClassName?: string;
  /** Load priority; defaults to lazy. */
  loading?: "lazy" | "eager";
}

/** Framed figure with optional provenance badge and a clean replacement slot fallback. */
export default function MediaFigure({
  src,
  alt,
  caption,
  badge,
  slot,
  width = 1280,
  height = 800,
  aspectClassName = "aspect-[16/10]",
  loading = "lazy",
}: MediaFigureProps) {
  return (
    <figure className="border border-rule bg-paper-elevated">
      {src ? (
        <div className={`${aspectClassName} w-full overflow-hidden bg-paper`}>
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        </div>
      ) : (
        <div
          className={`${aspectClassName} flex flex-col justify-between border-b border-dashed border-rule bg-paper p-5`}
          role="img"
          aria-label={alt}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-ink-faint">
              {slot ? `Image slot · ${slot}` : "Image slot"}
            </span>
            {badge && (
              <span className="border border-rule px-2 py-0.5 font-mono text-xs text-ink-muted">
                {badge}
              </span>
            )}
          </div>
          <p className="max-w-md text-sm text-ink-muted">{alt}</p>
          <p className="font-mono text-xs text-ink-faint">
            Drop replacement asset into public/images/work/ and set src
          </p>
        </div>
      )}
      {(caption || badge) && (
        <figcaption className="flex flex-wrap items-baseline justify-between gap-3 border-t border-rule px-4 py-2.5 text-xs text-ink-muted">
          <span>{caption ?? alt}</span>
          {badge && src && (
            <span className="shrink-0 font-mono text-[11px] text-ink-faint">{badge}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
