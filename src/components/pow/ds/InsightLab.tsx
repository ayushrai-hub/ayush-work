/**
 * Interactive Insight Lab for the AI data scientist proof of work.
 *
 * Holds the cleaning toggles and the display controls. Every count, chart,
 * test, coefficient, and margin comes from `analyzeRetail` or the pricing
 * helpers. The component does not invent a metric when a calculation returns null.
 *
 * Connects to:
 * - src/lib/dataScience/analysis.ts, models.ts, pricing.ts, quality.ts, retailDataset.ts, stats.ts.
 * - src/pages/AiDataScientistPowPage.tsx.
 */
import { useMemo, useState, type ReactNode } from "react";
import { analyzeRetail } from "../../../lib/dataScience/analysis";
import { describeErrors } from "../../../lib/dataScience/models";
import { priceGrid, priceOutcome, DEMAND_ANCHOR, DEMAND_SLOPE } from "../../../lib/dataScience/pricing";
import { CLEANING_EFFECTS, DEFAULT_CLEANING, type CleaningOptions } from "../../../lib/dataScience/quality";
import { RETAIL_SKUS, TRAIN_LAST_DAY } from "../../../lib/dataScience/retailDataset";
import { sampleSizePerGroup } from "../../../lib/dataScience/stats";

/** Format a calculated number. Null and non-finite values stay visible as an em dash. */
function fmt(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

/** Shared section heading. */
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-rule pt-10" aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl text-ink md:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-ink-muted">{children}</div>
    </section>
  );
}

/** Horizontal bars whose lengths are the group means. A table under the figure repeats the numbers. */
function MeanBars({ label, rows }: { label: string; rows: { key: string; n: number; mean: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.mean));
  return (
    <div>
      <svg role="img" aria-label={label} viewBox="0 0 360 160" className="h-40 w-full max-w-xl text-accent">
        <title>{label}</title>
        {rows.map((row, index) => {
          const width = (row.mean / max) * 240;
          const y = 16 + index * 28;
          return (
            <g key={row.key}>
              <text x="0" y={y + 12} className="fill-current text-[11px] text-ink">
                {row.key}
              </text>
              <rect x="92" y={y} width={width} height="16" className="fill-accent" />
            </g>
          );
        })}
      </svg>
      <table className="mt-2 w-full max-w-xl text-sm">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr className="border-b border-rule text-left">
            <th className="py-1 pr-3 font-medium">Group</th>
            <th className="py-1 pr-3 font-medium">Rows</th>
            <th className="py-1 font-medium">Mean units</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-rule">
              <td className="py-1 pr-3">{row.key}</td>
              <td className="py-1 pr-3 font-mono">{row.n}</td>
              <td className="py-1 font-mono">{fmt(row.mean)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The workbench. State here only chooses what to calculate or which rows to show. */
export default function InsightLab() {
  const [options, setOptions] = useState<CleaningOptions>(DEFAULT_CLEANING);
  const [modelId, setModelId] = useState("ols");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [errorTag, setErrorTag] = useState("all");
  const [skuId, setSkuId] = useState("NL-02");
  const [candidate, setCandidate] = useState(28);
  const [openId, setOpenId] = useState<string | null>(null);
  const snapshot = useMemo(() => analyzeRetail(options, "ols"), [options]);
  const sku = RETAIL_SKUS.find((item) => item.productId === skuId) ?? RETAIL_SKUS[1] ?? RETAIL_SKUS[0];
  const skuRows = snapshot.cleaning.kept.filter((row) => row.productId === sku?.productId);
  const inventoryCap = skuRows.length
    ? Math.min(...skuRows.map((row) => row.inventory))
    : null;
  const outcome = sku ? priceOutcome(candidate, sku, inventoryCap) : null;
  const grid = sku ? priceGrid(sku, inventoryCap) : null;
  const visible = snapshot.cleaning.kept.filter((row) => {
    const haystack = `${row.productId} ${row.productName} ${row.category}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    return matchesQuery && (category === "all" || row.category === category);
  });
  const categories = [...new Set(snapshot.cleaning.kept.map((row) => row.category))].sort();
  const selectedModel = snapshot.models.find((model) => model.id === modelId) ?? snapshot.models[0];
  const modelErrors = useMemo(
    () =>
      selectedModel
        ? describeErrors(
            selectedModel,
            snapshot.cleaning.kept,
            snapshot.train.map((row) => row.price),
          )
        : [],
    [selectedModel, snapshot],
  );
  const errors = modelErrors.filter((row) => errorTag === "all" || row.tags.includes(errorTag));
  const predictedNote = `The selected fit's test MAE is ${fmt(selectedModel?.metrics?.mae ?? null)} units on ${selectedModel?.nTest ?? 0} holdout rows. That is a prediction error, not a measured sales result.`;
  const ols = snapshot.models.find((model) => model.id === "ols");
  const priceCoef = ols?.coefficients?.find((item) => item.name === "price")?.value ?? null;
  const open = snapshot.cleaning.kept.find((row) => row.id === openId) ?? null;
  const sampleSize = sampleSizePerGroup(snapshot.unitsSummary.stdev ?? 0, 4);
  const trainUnits = snapshot.train.map((row) => row.units);
  const testUnits = snapshot.test.map((row) => row.units);
  const trainMean = trainUnits.length ? trainUnits.reduce((sum, value) => sum + value, 0) / trainUnits.length : null;
  const testMean = testUnits.length ? testUnits.reduce((sum, value) => sum + value, 0) / testUnits.length : null;

  /** Toggle one cleaning decision. */
  function toggle(key: keyof CleaningOptions) {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div id="workbench">
      <Block id="question" title="Insight Lab — from raw data to decisions">
        <p>
          <span className="mr-2 inline-block border border-rule px-2 py-0.5 font-mono text-[11px] uppercase tracking-label text-ink">
            Synthetic
          </span>
          Northline Goods is fictional. The rows are generated in the page source, then a few defective
          rows are planted. Nothing here is a retailer’s history or a commercial result.
        </p>
        <p>
          The question is illustrative: how should a pricing review separate description, prediction,
          and a decision when demand, product traits, and constraints are tangled together? The
          generating rule adds units on promotion days and schedules more promotions in spring, so
          those two factors are mixed on purpose.
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Define the question before choosing a model.</li>
          <li>Inspect the extract and the failed checks.</li>
          <li>Decide which rows to keep, and look at what that changes.</li>
          <li>Compare a mean and a median with linear fits on a later-day holdout.</li>
          <li>Read errors, then treat any price suggestion as an assumption.</li>
        </ol>
      </Block>

      <Block id="inspect" title="Inspect the extract">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="block text-sm text-ink">
            Search products
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-1 block w-full border border-rule bg-paper-elevated px-2 py-1.5 text-ink"
            />
          </label>
          <label className="block text-sm text-ink">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 block w-full border border-rule bg-paper-elevated px-2 py-1.5 text-ink"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm">
          Showing {visible.length} of {snapshot.cleaning.kept.length} cleaned rows. Search and category
          change this table only. They do not refit the models.
        </p>
        <div className="max-h-96 overflow-auto border border-rule">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <caption className="sr-only">Cleaned Northline rows</caption>
            <thead className="sticky top-0 bg-paper">
              <tr className="border-b border-rule">
                {["Product", "Day", "Category", "Price", "Units", "Discount", "Promo", "Inventory"].map((heading) => (
                  <th key={heading} className="px-2 py-2 font-medium text-ink">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-b border-rule">
                  <td className="px-2 py-1.5">
                    <button type="button" className="link-underline" onClick={() => setOpenId(row.id)}>
                      {row.productName}
                    </button>
                  </td>
                  <td className="px-2 py-1.5 font-mono">{row.day}</td>
                  <td className="px-2 py-1.5">{row.category}</td>
                  <td className="px-2 py-1.5 font-mono">{fmt(row.price, 0)}</td>
                  <td className="px-2 py-1.5 font-mono">{fmt(row.units, 0)}</td>
                  <td className="px-2 py-1.5 font-mono">{fmt(row.discount, 2)}</td>
                  <td className="px-2 py-1.5 font-mono">{row.promotion}</td>
                  <td className="px-2 py-1.5 font-mono">{fmt(row.inventory, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {open && (
          <div className="border border-rule p-4 text-sm text-ink">
            <p className="font-medium">
              {open.productName} · day {open.day} · {open.origin === "planted-issue" ? "planted, then kept" : "generated"}
            </p>
            <p className="mt-2 text-ink-muted">
              Competitor price {fmt(open.competitorPrice, 0)}, rating {fmt(open.rating, 1)}, unit cost{" "}
              {fmt(open.unitCost, 0)}, season {open.season}, {open.dayOfWeek}. Revenue on this row would be
              price times units, {fmt(open.price * open.units, 0)}. That product is calculated, not stored as a
              separate measured demand.
            </p>
          </div>
        )}
      </Block>

      <Block id="quality" title="Data quality">
        <p>
          {snapshot.examined} raw rows were examined. {snapshot.findings.length} check findings were
          recorded. {snapshot.cleaning.kept.length} rows remain after the decisions below.{" "}
          {snapshot.cleaning.dropped.length} rows were dropped. {snapshot.cleaning.futureUnitsStripped}{" "}
          kept rows had next-day units stripped. An outlier can be a bad value or a real rare event.
          Units of 900 are above the planted-error cutoff of 200. A large generated value under that
          cutoff stays.
        </p>
        <ul className="space-y-3">
          {CLEANING_EFFECTS.map((item) => (
            <li key={item.key}>
              <label className="flex items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={options[item.key]}
                  onChange={() => toggle(item.key)}
                />
                <span>
                  <span className="font-medium">{item.label}</span>
                  <span className="mt-1 block text-ink-muted">{item.effect}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-2 text-left text-ink">Findings on the raw extract</caption>
            <thead>
              <tr className="border-b border-rule">
                <th className="py-1 pr-3 font-medium">Check</th>
                <th className="py-1 pr-3 font-medium">Row</th>
                <th className="py-1 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.findings
                .filter((finding) => finding.check !== "potential-leakage")
                .map((finding) => (
                  <tr key={`${finding.check}-${finding.recordId}-${finding.detail}`} className="border-b border-rule">
                    <td className="py-1 pr-3 font-mono text-xs">{finding.check}</td>
                    <td className="py-1 pr-3 font-mono text-xs">{finding.recordId}</td>
                    <td className="py-1">{finding.detail}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Next-day units are present on {snapshot.findings.filter((finding) => finding.check === "potential-leakage").length}{" "}
          generated rows. Those findings are counted above and omitted from the table so the other defects stay readable.
        </p>
        <div>
          <p className="text-sm text-ink">Dropped by the current decisions</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {snapshot.cleaning.dropped.map((row) => (
              <li key={row.id}>
                <span className="font-mono">{row.id}</span> — {row.reasons.join(" ")}
              </li>
            ))}
          </ul>
        </div>
        {snapshot.cleaning.edits.length > 0 && (
          <div>
            <p className="text-sm text-ink">Edits on kept rows</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {snapshot.cleaning.edits.map((edit) => (
                <li key={`${edit.id}-${edit.field}`}>
                  <span className="font-mono">{edit.id}</span> {edit.field}: {edit.from} → {edit.to}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Block>

      <Block id="eda" title="Exploratory summaries">
        <p>
          These summaries use the cleaned rows. Mean is the arithmetic average. Median is the middle
          ordered value, averaging the two middle values when the count is even. Standard deviation
          uses the sample divisor n − 1. Interquartile range is the type-7 third quartile minus the
          type-7 first quartile. A grouped average is the mean inside one category, season, or weekday.
        </p>
        <dl className="grid gap-3 sm:grid-cols-4">
          {[
            ["Rows", String(snapshot.unitsSummary.n)],
            ["Mean units", fmt(snapshot.unitsSummary.mean)],
            ["Median units", fmt(snapshot.unitsSummary.median)],
            ["Std. dev.", fmt(snapshot.unitsSummary.stdev)],
            ["IQR", fmt(snapshot.unitsSummary.iqr)],
          ].map(([label, value]) => (
            <div key={label} className="border border-rule p-3">
              <dt className="label">{label}</dt>
              <dd className="mt-1 font-mono text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <MeanBars label="Mean units by category in the cleaned sample" rows={snapshot.categoryMeans} />
        <MeanBars label="Mean units by season in the cleaned sample" rows={snapshot.seasonMeans} />
        <div>
          <p className="text-sm text-ink">Histogram of cleaned units, bin width 5</p>
          {snapshot.histogram.length > 24 && (
            <p className="text-sm">
              The bin list is long because at least one kept value sits far from the rest. That stretch
              is the sensitivity of leaving the extreme row in. The table still counts every bin.
            </p>
          )}
          <svg
            role="img"
            aria-label="Histogram of cleaned units"
            viewBox={`0 0 ${Math.max(320, snapshot.histogram.length * 28)} 140`}
            className="mt-2 h-36 w-full text-accent"
          >
            <title>Histogram of cleaned units</title>
            {snapshot.histogram.map((bin, index) => {
              const max = Math.max(1, ...snapshot.histogram.map((item) => item.count));
              const height = (bin.count / max) * 100;
              return (
                <rect
                  key={`${bin.start}-${bin.end}`}
                  x={index * 28 + 4}
                  y={120 - height}
                  width="20"
                  height={height}
                  className="fill-accent"
                >
                  <title>{`${bin.start} to ${bin.end}: ${bin.count}`}</title>
                </rect>
              );
            })}
          </svg>
          <table className="mt-2 w-full max-w-xl text-sm">
            <caption className="sr-only">Histogram counts for cleaned units</caption>
            <thead>
              <tr className="border-b border-rule text-left">
                <th className="py-1 pr-3 font-medium">From</th>
                <th className="py-1 pr-3 font-medium">To</th>
                <th className="py-1 font-medium">Rows</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.histogram.map((bin) => (
                <tr key={`${bin.start}-${bin.end}`} className="border-b border-rule">
                  <td className="py-1 pr-3 font-mono">{bin.start}</td>
                  <td className="py-1 pr-3 font-mono">{bin.end}</td>
                  <td className="py-1 font-mono">{bin.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <table className="w-full text-left text-sm">
          <caption className="mb-2 text-left text-ink">Pearson correlations in the cleaned sample</caption>
          <thead>
            <tr className="border-b border-rule">
              <th className="py-1 pr-3 font-medium">Pair</th>
              <th className="py-1 pr-3 font-medium">r</th>
              <th className="py-1 font-medium">How to read it</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.correlations.map((item) => (
              <tr key={item.pair} className="border-b border-rule">
                <td className="py-1 pr-3">{item.pair}</td>
                <td className="py-1 pr-3 font-mono">{fmt(item.value, 3)}</td>
                <td className="py-1">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          A correlation between price and units does not show that price caused the sales. Promotions,
          the spring label, discounts, and inventory all move with the outcome in this file. Pearson’s
          r also only describes a straight-line association.
        </p>
        <MeanBars label="Mean units by weekday in the cleaned sample" rows={snapshot.weekdayMeans} />
      </Block>

      <Block id="inference" title="Does the promotion gap survive a closer look?">
        <p>
          Research question: in this synthetic sample, do units differ between promotional and
          non-promotional rows? Null: the two labels are exchangeable. Alternative: the mean gap is
          not zero. Outcome: units. This is not a test that a promotion caused the gap.
        </p>
        <p>
          A normal-theory t test is a poor default here. Group skewness is {fmt(snapshot.promotion.leftSkew, 2)} and{" "}
          {fmt(snapshot.promotion.rightSkew, 2)}. The page therefore uses a permutation test of the
          mean difference. The Welch t statistic ({fmt(snapshot.promotion.welchT, 2)} on{" "}
          {fmt(snapshot.promotion.welchDf, 1)} df) is shown as a description only. It is not converted
          into a p-value.
        </p>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="border border-rule p-3">
            <dt className="label">Mean difference</dt>
            <dd className="mt-1 font-mono text-ink">{fmt(snapshot.promotion.differenceOfMeans)}</dd>
          </div>
          <div className="border border-rule p-3">
            <dt className="label">Cohen&apos;s d</dt>
            <dd className="mt-1 font-mono text-ink">{fmt(snapshot.promotion.cohensD)}</dd>
          </div>
          <div className="border border-rule p-3">
            <dt className="label">Permutation p</dt>
            <dd className="mt-1 font-mono text-ink">
              {snapshot.promotion.pValue === null ? "not reported" : fmt(snapshot.promotion.pValue, 3)}
            </dd>
          </div>
        </dl>
        <p className="text-sm">{snapshot.promotion.warning}</p>
        <p className="text-sm">Method: {snapshot.promotion.pMethod}. Groups: {snapshot.promotion.leftN} promotional and {snapshot.promotion.rightN} other rows.</p>
        {snapshot.promotionBySeason.map((item) => (
          <p key={item.season} className="text-sm">
            Within {item.season}: mean difference {fmt(item.comparison.differenceOfMeans)} (
            {item.comparison.leftN} vs {item.comparison.rightN}).{" "}
            {item.comparison.pValue === null
              ? item.comparison.warning
              : `Permutation p ${fmt(item.comparison.pValue, 3)}. Still not a causal effect.`}
          </p>
        ))}
        <p>
          Statistical significance, even when a p-value is small, is not practical importance and it
          is not a reason to change a price. These findings stay inside this file.
        </p>
      </Block>

      <Block id="features" title="Features and leakage">
        <p>
          Discount percent is the stored fraction times 100. Lagged units and the three-day rolling
          mean use only earlier days of the same product. Price relative to the category median uses
          only earlier days in that category. A day-of-week indicator is shown as the weekday name.
          It is not expanded into six extra columns: this panel is too short to support that. Previous
          promotion and the inventory flag are calculated the same way. The fitted models below use
          price, discount, promotion, competitor price, inventory, rating, and a spring indicator.
          The lag model adds lagged units. The other engineered columns are visible here and are not
          silently added to those fits.
        </p>
        <div className="max-h-72 overflow-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Engineered features for cleaned rows</caption>
            <thead>
              <tr className="border-b border-rule">
                {["Row", "Lag units", "Rolling 3", "Price / earlier median", "Prior promo", "Next-day units"].map((heading) => (
                  <th key={heading} className="px-2 py-1 font-medium text-ink">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshot.features.slice(0, 12).map((row) => (
                <tr key={row.id} className="border-b border-rule">
                  <td className="px-2 py-1 font-mono text-xs">{row.id}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.lagUnits, 0)}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.rolling3, 1)}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.priceRelativeToEarlierCategoryMedian, 2)}</td>
                  <td className="px-2 py-1 font-mono">{row.previousPromotion === null ? "—" : row.previousPromotion}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.futureUnits, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Next-day units, and revenue divided by price, repeat information that is not known when
          the units are still in the future. A model that uses them can look excellent on a holdout
          that also contains the leaked column. The holdout does not repair that. The leaked fit is
          in the comparison table and marked as leakage.
        </p>
      </Block>

      <Block id="models" title="Baselines and linear fits">
        <p>
          A training mean is the baseline. If a more flexible fit cannot beat it on later days, the
          extra structure has not earned its place. Train rows are days 1–{TRAIN_LAST_DAY}. Test rows
          are the later days. The split is by day, not by a random shuffle.{" "}
          {snapshot.testIsAllSpring
            ? "Every current test row is labeled spring, so the holdout is also a season shift."
            : "The holdout is the later days."}{" "}
          {snapshot.train.length} train rows and {snapshot.test.length} test rows are in the cleaned set.
        </p>
        <fieldset>
          <legend className="text-sm text-ink">Model used for the error table</legend>
          <div className="mt-2 flex flex-col gap-2">
            {snapshot.models.map((model) => (
              <label key={model.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="radio"
                  name="model"
                  value={model.id}
                  checked={modelId === model.id}
                  onChange={() => setModelId(model.id)}
                />
                {model.name}
                {model.role === "leakage" ? " (leakage)" : ""}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="overflow-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="mb-2 text-left text-ink">Test metrics from the fits above</caption>
            <thead>
              <tr className="border-b border-rule">
                {["Model", "Train", "Test", "MAE", "RMSE", "MAPE %", "R²"].map((heading) => (
                  <th key={heading} className="py-1 pr-3 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshot.models.map((model) => (
                <tr key={model.id} className="border-b border-rule">
                  <td className="py-1 pr-3">{model.name}</td>
                  <td className="py-1 pr-3 font-mono">{model.nTrain}</td>
                  <td className="py-1 pr-3 font-mono">{model.nTest}</td>
                  <td className="py-1 pr-3 font-mono">{fmt(model.metrics?.mae ?? null)}</td>
                  <td className="py-1 pr-3 font-mono">{fmt(model.metrics?.rmse ?? null)}</td>
                  <td className="py-1 pr-3 font-mono">{model.metrics?.mape === null || model.metrics === null ? "—" : fmt(model.metrics.mape)}</td>
                  <td className="py-1 pr-3 font-mono">{fmt(model.metrics?.rSquared ?? null, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedModel && (
          <p className="text-sm">
            {selectedModel.purpose} {selectedModel.assumptions}{" "}
            {selectedModel.unavailable ?? "Metrics use this model’s own test rows."}
          </p>
        )}
        <div className="text-sm">
          <p>MAE is the average absolute error, in units.</p>
          <p>RMSE squares errors before averaging, so a large miss counts more than a small one.</p>
          <p>MAPE divides by the actual value. It is left blank when any actual value is zero.</p>
          <p>R² compares residual variance with the variance of the actual test values. A high R² is not a reason to act.</p>
          <p>
            Precision, recall, F1, ROC-AUC, and PR-AUC answer classification questions. This retail
            target is a count, so those metrics are not computed here.
          </p>
        </div>
        <p>
          Leaving price out of the linear fit changes the test MAE from {fmt(ols?.metrics?.mae ?? null)} to{" "}
          {fmt(snapshot.sensitivityMae)}. That is a sensitivity of this sample, not a causal price effect.
          The same MAE can hide a bad category. Grouped absolute errors for the selected model:
        </p>
        <ul className="list-disc pl-5 text-sm">
          {categories.map((item) => {
            const group = modelErrors.filter((row) => row.category === item);
            const mae = group.length
              ? group.reduce((sum, row) => sum + Math.abs(row.error), 0) / group.length
              : null;
            return (
              <li key={item}>
                {item}: {group.length} test rows, MAE {fmt(mae)}
              </li>
            );
          })}
        </ul>
      </Block>

      <Block id="errors" title="Where the selected fit misses">
        <label className="block text-sm text-ink">
          Filter by a rule tag
          <select
            value={errorTag}
            onChange={(event) => setErrorTag(event.target.value)}
            className="mt-1 block border border-rule bg-paper-elevated px-2 py-1.5"
          >
            {["all", "large-underprediction", "large-overprediction", "low-inventory", "promotional", "price-outside-train", "within-typical-error"].map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </label>
        <p className="text-sm">
          Error is predicted minus actual. A tag is a rule, not a proven cause. Low inventory means
          the row’s inventory is 5 or below. It might be a stock constraint. This file does not
          establish that.
        </p>
        <div className="max-h-80 overflow-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Prediction errors for the selected model</caption>
            <thead>
              <tr className="border-b border-rule">
                {["Row", "Actual", "Predicted", "Error", "Tags"].map((heading) => (
                  <th key={heading} className="px-2 py-1 font-medium text-ink">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errors.map((row) => (
                <tr key={row.id} className="border-b border-rule">
                  <td className="px-2 py-1">{row.productName} d{row.day}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.actual, 1)}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.predicted, 1)}</td>
                  <td className="px-2 py-1 font-mono">{fmt(row.error, 1)}</td>
                  <td className="px-2 py-1">{row.tags.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Train mean units {fmt(trainMean, 1)}; test mean units {fmt(testMean, 1)}. The shift is
          expected because the series was given a spring level and the holdout is later. Robustness
          is not claimed. A missing price is not scored. Rows outside the training price range are
          tagged rather than trusted. No drift monitor is running, because this is a fixed file.
        </p>
      </Block>

      <Block id="pricing" title="An assumed price calculation">
        <p>
          Predicting units and choosing a price are different tasks. The curve below is an assumption:
          {` ${DEMAND_ANCHOR}`} units at the SKU’s reference price, then {DEMAND_SLOPE} fewer units per
          currency unit above that reference, floored at zero. It is not estimated from the panel.
          The ordinary-least-squares price coefficient on the original scale is {fmt(priceCoef, 3)}.
          That coefficient is an association. It is not the slope used here, and neither number is a
          causal elasticity.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="text-sm text-ink">
            SKU
            <select
              value={skuId}
              onChange={(event) => {
                const next = RETAIL_SKUS.find((item) => item.productId === event.target.value);
                setSkuId(event.target.value);
                if (next) setCandidate(next.referencePrice);
              }}
              className="mt-1 block border border-rule bg-paper-elevated px-2 py-1.5"
            >
              {RETAIL_SKUS.map((item) => (
                <option key={item.productId} value={item.productId}>
                  {item.productName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-ink">
            Candidate price
            <input
              type="number"
              value={candidate}
              min={0}
              step={1}
              onChange={(event) => setCandidate(Number(event.target.value))}
              className="mt-1 block w-32 border border-rule bg-paper-elevated px-2 py-1.5"
            />
          </label>
        </div>
        {outcome && sku && (
          <p aria-live="polite" className="text-ink">
            Assumed contribution margin: {fmt(outcome.margin)} at price {fmt(candidate, 0)}. Assumed
            units {fmt(outcome.units, 1)}
            {outcome.capped ? ` after an inventory cap of ${inventoryCap}` : ""}. Revenue {fmt(outcome.revenue)}.
            Unit cost {fmt(sku.unitCost, 0)}.
            {outcome.belowCost ? " The price is below unit cost, so the margin is negative." : ""}
          </p>
        )}
        {grid?.gridMax && (
          <p className="text-sm">
            On the integer grid from unit cost to 1.8 times the reference price, the highest assumed
            margin is {fmt(grid.gridMax.margin)} at price {fmt(grid.gridMax.price, 0)}. That is the
            maximum of this assumption. It is not a prediction that the price will maximize profit.
          </p>
        )}
        <p>
          A real pricing rule would also need promotion constraints, contractual floors, and
          uncertainty around the demand assumption. Observational history does not identify the
          effect of changing the price. A randomized test could, if the operational and ethical
          conditions for one were actually met. They are not met by this demo.
        </p>
      </Block>

      <Block id="series" title="Time order, on a different synthetic series">
        <p>
          These 24 weeks are a second constructed series: a trend, a four-week wiggle, and a higher
          level after week 12. They are not market prices and they are not the retail panel. Lag-1
          autocorrelation is {fmt(snapshot.series.lag1Correlation, 3)}. The first 18 weeks average{" "}
          {fmt(snapshot.series.trainMean, 1)} units. The last 6 average {fmt(snapshot.series.testMean, 1)}.
          The level was constructed to change, so a constant mean is the wrong summary. No
          stationarity test is implemented.
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li>One-step naive MAE on the last 6 weeks: {fmt(snapshot.series.naiveMae)}</li>
          <li>Training-mean MAE on those weeks: {fmt(snapshot.series.trainMeanMae)}</li>
          <li>Flat three-step forecast MAE, repeating the last training week: {fmt(snapshot.series.flatHorizonMae)}</li>
          <li>Temporal MAE using a trailing two-week mean as the only feature: {fmt(snapshot.series.trailingProtocolMae)}</li>
          <li>Temporal MAE using a centered mean that includes the next week: {fmt(snapshot.series.centeredProtocolMae)}</li>
          <li>Seeded random-split MAE using that same centered feature: {fmt(snapshot.series.randomSplitCenteredMae)}</li>
        </ul>
        <p>
          A random split of a time series lets training rows sit on both sides of a test row. A
          centered window also puts the future into the feature. Either protocol can make a forecast
          look better than a past-only temporal check. The numbers above are whatever this series
          produces. They are not a claim that the invalid protocol always wins, and they are not a
          trading result. No LSTM or GRU is trained on this page.
        </p>
      </Block>

      <Block id="experiment" title="A pricing experiment that was not run">
        <p>
          Treatment would be a lower shelf price. Control would be the current price. Primary outcome:
          units per store-week. Guardrails: contribution margin, stockouts, and returns. Randomization
          unit: store-week, so products in one store in one week are not split across arms. Duration
          and stopping rules would be written before the test. This page has no assignment, no
          outcome, and no p-value for that experiment.
        </p>
        <p>
          Using the cleaned sample’s unit standard deviation ({fmt(snapshot.unitsSummary.stdev)}) as a
          planning assumption, a two-sided normal-theory calculation at α 0.05 and power 0.80 needs
          about {sampleSize ?? "—"} observations per group to detect a 4-unit mean difference. That
          formula assumes independent observations and a known variance. The retail rows are repeated
          products, so the formula is only a sketch. It is not a sample size I collected.
        </p>
        <p>
          I would not recommend running the test from this page. There is no population, no consent
          design, and no operational owner. An experiment that cannot be randomized cleanly, or that
          would withhold a price people are entitled to, should not be dressed up as rigor.
        </p>
      </Block>

      <Block id="explain" title="What the linear fit can and cannot explain">
        <p>
          The ordinary-least-squares coefficients are calculated. In a linear fit, a coefficient is
          the associated change in predicted units when that column increases by one and the other
          columns in the fit stay fixed. It is not the effect of changing the column in the world.
          Partial dependence below moves price along the training range and holds the other training
          means in place. It is a picture of the line, not of customers.
        </p>
        <ul className="list-disc pl-5 font-mono text-sm text-ink">
          {(ols?.coefficients ?? []).map((item) => (
            <li key={item.name}>
              {item.name}: {fmt(item.value, 3)}
            </li>
          ))}
        </ul>
        <table className="w-full max-w-md text-left text-sm">
          <caption className="mb-2 text-left text-ink">OLS partial dependence on price</caption>
          <thead>
            <tr className="border-b border-rule">
              <th className="py-1 pr-3 font-medium">Price</th>
              <th className="py-1 font-medium">Line prediction</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.partialPrice.map((point) => (
              <tr key={point.feature} className="border-b border-rule">
                <td className="py-1 pr-3 font-mono">{fmt(point.feature, 1)}</td>
                <td className="py-1 font-mono">{fmt(point.prediction, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border border-rule p-4 text-sm text-ink">
          <p>1. Observed: {snapshot.decision.observed}</p>
          <p className="mt-2">2. Predicted: {predictedNote}</p>
          <p className="mt-2">3. Reliability: {snapshot.decision.reliability}</p>
          <p className="mt-2">4. Uncertain: {snapshot.decision.uncertain}</p>
          <p className="mt-2">5. Action that could be considered: {snapshot.decision.action}</p>
          <p className="mt-2">6. Further evidence: {snapshot.decision.evidence}</p>
        </div>
      </Block>

      <Block id="manifest" title="Experiment manifest">
        <p>
          A manifest makes two analyses comparable. This one describes the demo. It does not invent
          a dataset hash, a model version, or an execution timestamp.
        </p>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {[
            ["Analysis ID", "insight-lab-synthetic-retail-v1"],
            ["Question", "How should a fictional pricing review separate description, prediction, and a decision?"],
            ["Dataset", "synthetic-retail-v1, generated in src/lib/dataScience/retailDataset.ts"],
            ["Provenance", "Deterministic formula plus planted defects. Not a retailer extract."],
            ["Features", "See the feature section. Future units are stripped before fitting."],
            ["Models", "Training mean, training median, OLS, ridge (λ = 1), OLS with lag, and one leaked copy of the outcome."],
            ["Split", `Days 1–${TRAIN_LAST_DAY} train. Later days test. No random row split for the retail fits.`],
            ["Seed", "Permutation Monte Carlo uses 20261019 and 4,999 draws when an exact test is too large."],
            ["Dependencies", "TypeScript in this site. No model library and no external API."],
            ["Artifacts", "The kept-row counts and metrics on this page. No checkpoint file."],
            ["Limitations", "Synthetic, confounded promotion rule, small later-day holdout, no causal price effect."],
          ].map(([term, detail]) => (
            <div key={term} className="border-b border-rule pb-2">
              <dt className="label">{term}</dt>
              <dd className="mt-1 text-ink">{detail}</dd>
            </div>
          ))}
        </dl>
      </Block>
    </div>
  );
}
