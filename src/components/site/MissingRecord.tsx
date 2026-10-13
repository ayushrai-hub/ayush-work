/**
 * "Not found" state for a detail route whose slug matches no record.
 *
 * Renders PageSEO with `noIndex` and the same `/404` canonical as NotFoundPage, so client-side
 * navigation to a bad slug replaces the previous page's title instead of keeping it, then a page
 * header and a link back to the list. A direct visit to an unknown slug already gets HTTP 404 from
 * the host (no prerendered file exists), so this only affects in-app navigation and the tab title.
 *
 * Connects to:
 * - Used by WorkDetailPage, ProductDetailPage, ProductLogPage, ResearchDetailPage, NoteDetailPage,
 *   and WritingDetailPage.
 * - Components PageSEO and PageHeader.
 */
import { Link } from "react-router-dom";
import PageSEO from "./PageSEO";
import PageHeader from "../editorial/PageHeader";

/** Props: the heading, optional dek, and the list page to go back to. */
interface MissingRecordProps {
  title: string;
  dek?: string;
  backTo: string;
  backLabel: string;
}

/** Noindexed not-found message with a link back to the list page. */
export default function MissingRecord({ title, dek, backTo, backLabel }: MissingRecordProps) {
  return (
    <>
      <PageSEO title={title} description={dek ?? "This record does not exist."} path="/404" noIndex />
      <div className="site-shell page-section">
        <PageHeader title={title} dek={dek} />
        <Link to={backTo} className="link-accent">
          {backLabel}
        </Link>
      </div>
    </>
  );
}
