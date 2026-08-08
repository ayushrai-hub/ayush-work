import { Link } from "react-router-dom";
import PageSEO from "../components/site/PageSEO";

export default function NotFoundPage() {
  return (
    <>
      <PageSEO
        title="Not found"
        description="This page does not exist yet."
        path="/404"
        noIndex
      />
      <div className="site-shell page-section min-h-[50vh] flex flex-col justify-center">
        <p className="label mb-3">404</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink">
          This page does not exist yet.
        </h1>
        <p className="mt-4 text-lg text-ink-muted italic max-w-measure">
          That happens to ideas too.
        </p>
        <p className="mt-8">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        </p>
      </div>
    </>
  );
}
