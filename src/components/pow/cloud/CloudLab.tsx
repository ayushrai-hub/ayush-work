/**
 * Interactive sections for the Cloud Operations Lab.
 *
 * Each explorer keeps its state in the browser. Deployment, telemetry, cost, and scaling call
 * src/lib/cloudOpsLab.ts. Copy comes from src/content/cloudEngineerPow.ts. Nothing here contacts
 * a cloud API.
 *
 * Connects to:
 * - src/pages/CloudEngineerPowPage.tsx places these sections.
 * - src/components/pow/PmChrome.tsx (`TabSet`) supplies the tab keyboard pattern.
 */
import { useMemo, useState, type ReactNode } from "react";
import { TabSet } from "../PmChrome";
import {
  architectureDecisions,
  architectureProfiles,
  cloudDeployTargets,
  containerFailures,
  containerLessons,
  deliveryLessons,
  dockerfileLines,
  iacExample,
  iacLessons,
  iacModules,
  networkScenarios,
  pipelineStages,
  securityScenarios,
  securityTopics,
  sloNote,
  troubleshootingScenarios,
} from "../../../content/cloudEngineerPow";
import {
  costPreset,
  deployScenarios,
  deployTargetNotes,
  estimateCost,
  sampleTelemetry,
  scaleOutcome,
  simulateDeployment,
} from "../../../lib/cloudOpsLab";
import type { CostInput, DeployScenario, DeployTarget, RetryPolicy, ScaleBottleneck, TelemetryScenario, WorkloadSize } from "../../../lib/cloudOpsLab";

/** Tab set that keeps its own selection. Use this when the panel only depends on the chosen id. */
function RecordTabs({
  label,
  tabs,
  layout = "row",
  renderPanel,
}: {
  label: string;
  tabs: readonly { id: string; label: string }[];
  layout?: "row" | "stack";
  renderPanel: (id: string) => ReactNode;
}) {
  const [selected, setSelected] = useState(tabs[0]?.id ?? "");
  return (
    <TabSet
      label={label}
      tabs={tabs}
      selected={selected}
      onSelect={setSelected}
      layout={layout}
      renderPanel={renderPanel}
    />
  );
}

/** Two-column fact list. */
function Facts({ rows }: { rows: readonly { label: string; value: string }[] }) {
  return (
    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="label">{row.label}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Reference architecture diagram: a profile, then one component. */
export function ArchitectureExplorer() {
  const [profileId, setProfileId] = useState(architectureProfiles[0].id);
  const [componentId, setComponentId] = useState(architectureProfiles[0].components[0].id);
  const profile = architectureProfiles.find((item) => item.id === profileId) ?? architectureProfiles[0];
  const selected = profile.components.some((item) => item.id === componentId)
    ? componentId
    : profile.components[0].id;

  return (
    <div>
      <p className="text-sm text-ink-muted">
        Reference architectures for a fictional app. They are not a diagram of a live cloud account.
      </p>
      <div className="mt-4">
        <TabSet
          label="Architecture profiles"
          tabs={architectureProfiles.map((item) => ({ id: item.id, label: item.name }))}
          selected={profile.id}
          onSelect={(id) => {
            setProfileId(id);
            const next = architectureProfiles.find((item) => item.id === id);
            setComponentId(next?.components[0].id ?? componentId);
          }}
          renderPanel={(id) => {
            const current = architectureProfiles.find((item) => item.id === id) ?? profile;
            return (
              <div>
                <p className="max-w-measure text-ink-muted">{current.summary}</p>
                <p className="mt-3 max-w-measure text-sm text-ink">{current.priority}</p>
                <p className="mt-2 max-w-measure text-sm text-ink-muted">{current.complexity}</p>
              </div>
            );
          }}
        />
      </div>
      <div className="mt-6">
        <TabSet
          label={`${profile.name} components`}
          tabs={profile.components.map((item) => ({ id: item.id, label: item.name }))}
          selected={selected}
          onSelect={setComponentId}
          renderPanel={(id) => {
            const component = profile.components.find((item) => item.id === id) ?? profile.components[0];
            return (
              <Facts
                rows={[
                  { label: "Responsibility", value: component.responsibility },
                  { label: "Request flow", value: component.requestFlow },
                  { label: "Data flow", value: component.dataFlow },
                  { label: "Trust boundary", value: component.trust },
                  { label: "Deployment", value: component.deploy },
                  { label: "Failure mode", value: component.failure },
                  { label: "Scaling", value: component.scaling },
                  { label: "Operational burden", value: component.burden },
                  { label: "Security", value: component.security },
                  { label: "Cost driver", value: component.cost },
                ]}
              />
            );
          }}
        />
      </div>
    </div>
  );
}

/** Local deployment state machine. A failed stage is never labeled as a release. */
export function DeploymentWorkbench() {
  const [target, setTarget] = useState<DeployTarget>("managed");
  const [scenario, setScenario] = useState<DeployScenario>("health-check");
  const run = useMemo(() => simulateDeployment(target, scenario), [target, scenario]);

  return (
    <div>
      <p className="text-sm text-ink-muted">
        A local state machine. It does not deploy Fieldnote anywhere.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="text-sm text-ink">
          Target
          <select
            className="mt-1 block border border-rule bg-paper px-2 py-2 text-ink"
            value={target}
            onChange={(event) => setTarget(event.target.value as DeployTarget)}
          >
            {cloudDeployTargets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink">
          Scenario
          <select
            className="mt-1 block border border-rule bg-paper px-2 py-2 text-ink"
            value={scenario}
            onChange={(event) => setScenario(event.target.value as DeployScenario)}
          >
            {deployScenarios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 font-medium text-ink" role="status">
        {run.released ? "Simulated release verified" : "Release blocked"}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{run.summary}</p>
      <ol className="mt-4 space-y-2">
        {run.stages.map((stage) => (
          <li key={stage.id} className="border border-rule px-3 py-2">
            <span className="font-mono text-xs uppercase tracking-label text-ink-faint">{stage.status}</span>
            <span className="ml-2 text-sm text-ink">{stage.label}</span>
            <p className="mt-1 text-sm text-ink-muted">{stage.detail}</p>
          </li>
        ))}
      </ol>
      <table className="mt-6 w-full border-collapse text-left text-sm">
        <caption className="mb-2 text-left text-ink">How the three targets differ in this model</caption>
        <thead>
          <tr className="border-b border-rule text-ink-faint">
            <th scope="col" className="py-2 pr-3 font-medium">Target</th>
            <th scope="col" className="py-2 pr-3 font-medium">Complexity</th>
            <th scope="col" className="py-2 pr-3 font-medium">Control</th>
            <th scope="col" className="py-2 pr-3 font-medium">Portability</th>
            <th scope="col" className="py-2 font-medium">Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {deployTargetNotes.map((row) => (
            <tr key={row.id} className="border-b border-rule align-top text-ink-muted">
              <th scope="row" className="py-2 pr-3 font-medium text-ink">{row.label}</th>
              <td className="py-2 pr-3">{row.complexity}</td>
              <td className="py-2 pr-3">{row.control}</td>
              <td className="py-2 pr-3">{row.portability}</td>
              <td className="py-2">{row.maintenance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Illustrative infrastructure modules and an example file that is not applied. */
export function IacExplorer() {
  return (
    <div>
      <ul className="max-w-measure space-y-2 text-sm text-ink-muted">
        {iacLessons.map((lesson) => (
          <li key={lesson}>{lesson}</li>
        ))}
      </ul>
      <div className="mt-6">
        <RecordTabs
          label="Example infrastructure modules"
          tabs={iacModules.map((item) => ({ id: item.id, label: item.label }))}
          renderPanel={(id) => {
            const module = iacModules.find((item) => item.id === id) ?? iacModules[0];
            return <p className="max-w-measure text-sm text-ink-muted">{module.body}</p>;
          }}
        />
      </div>
      <pre className="mt-6 overflow-x-auto border border-rule bg-paper-elevated p-4 font-mono text-xs leading-relaxed text-ink">
        {iacExample}
      </pre>
    </div>
  );
}

/** Reference Dockerfile plus the failure cases. RevenueRoles and SpiderWeb notes stay on the case studies. */
export function ContainerExplorer() {
  const [line, setLine] = useState(0);
  const current = dockerfileLines[line] ?? dockerfileLines[0];
  return (
    <div>
      <p className="text-sm text-ink-muted">
        Illustrative Dockerfile. No image was built for this page.
      </p>
      <ul className="mt-4 max-w-measure list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {containerLessons.map((lesson) => (
          <li key={lesson}>{lesson}</li>
        ))}
      </ul>
      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div role="listbox" aria-label="Dockerfile lines" className="border border-rule">
          {dockerfileLines.map((item, index) => (
            <button
              key={item.instruction}
              type="button"
              role="option"
              aria-selected={index === line}
              onClick={() => setLine(index)}
              className={`block w-full px-3 py-2 text-left font-mono text-xs ${
                index === line ? "bg-accent-soft/50 text-ink" : "text-ink-muted"
              }`}
            >
              {item.instruction}
            </button>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-ink-muted">{current.meaning}</p>
      </div>
      <div className="mt-6">
        <RecordTabs
          label="Container failure cases"
          tabs={containerFailures.map((item) => ({ id: item.id, label: item.label }))}
          renderPanel={(id) => (
            <p className="max-w-measure text-sm text-ink-muted">
              {(containerFailures.find((item) => item.id === id) ?? containerFailures[0]).body}
            </p>
          )}
        />
      </div>
    </div>
  );
}

/** Request path and diagnostic sequences. */
export function NetworkExplorer() {
  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        A request crosses DNS, then TLS at the edge, then the origin, then the app, then the database
        if the handler needs it. An application error has an HTTP status. A network error often has a
        timeout and no application log.
      </p>
      <RecordTabs
        label="Network troubleshooting"
        tabs={networkScenarios.map((item) => ({ id: item.id, label: item.label }))}
        renderPanel={(id) => {
          const scenario = networkScenarios.find((item) => item.id === id) ?? networkScenarios[0];
          return (
            <div>
              <p className="text-sm text-ink">{scenario.symptom}</p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink-muted">
                {scenario.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 text-sm text-ink-muted">{scenario.distinction}</p>
            </div>
          );
        }}
      />
    </div>
  );
}

/** Pipeline stages. The gate text is the rule the deployment simulator enforces. */
export function PipelineExplorer() {
  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        Illustrative pipeline. Verified workflows are in the project case studies. A failed test or
        health check blocks release: the deployment workbench will not mark that run verified.
      </p>
      <ul className="mt-4 max-w-measure list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {deliveryLessons.map((lesson) => (
          <li key={lesson}>{lesson}</li>
        ))}
      </ul>
      <div className="mt-4">
        <RecordTabs
          label="Pipeline stages"
          tabs={pipelineStages.map((stage) => ({ id: stage.id, label: stage.label }))}
          renderPanel={(id) => (
            <p className="max-w-measure text-sm text-ink-muted">
              {(pipelineStages.find((stage) => stage.id === id) ?? pipelineStages[0]).body}
            </p>
          )}
        />
      </div>
    </div>
  );
}

/** Synthetic dashboard bound to `sampleTelemetry`. */
export function ObservabilityDashboard() {
  const [scenario, setScenario] = useState<TelemetryScenario>("baseline");
  const snap = sampleTelemetry(scenario);
  const options: { id: TelemetryScenario; label: string }[] = [
    { id: "baseline", label: "Steady sample" },
    { id: "surge", label: "Traffic surge" },
    { id: "errors", label: "Elevated errors" },
    { id: "slow-db", label: "Slow database" },
    { id: "memory", label: "Memory pressure" },
    { id: "workers", label: "Worker failures" },
    { id: "queue", label: "Queue backlog" },
    { id: "failed-deploy", label: "Failed deployment" },
    { id: "dependency", label: "Dependency outage" },
  ];
  return (
    <div>
      <p className="text-sm text-ink-muted">{snap.notice}</p>
      <div className="mt-4">
        <TabSet
          label="Synthetic scenarios"
          layout="stack"
          tabs={options}
          selected={scenario}
          onSelect={(id) => setScenario(id as TelemetryScenario)}
          renderPanel={() => (
            <div>
              <p className="label">Alerts</p>
              <p className="mt-1 text-sm text-ink">{snap.alerts.length ? snap.alerts.join(" · ") : "None"}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {snap.metrics.map((metric) => (
                  <div key={metric.id} className="border border-rule px-3 py-2">
                    <dt className="text-sm text-ink">{metric.label}</dt>
                    <dd className="mt-1 font-mono text-sm text-ink-muted">
                      {metric.value}
                      {metric.alert ? " — alert" : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        />
      </div>
      <ol className="mt-6 max-w-measure list-decimal space-y-2 pl-5 text-sm text-ink-muted">
        <li>Detect the symptom. {snap.investigation.symptom}</li>
        <li>Affected service. {snap.investigation.service}</li>
        <li>Recent change. {snap.investigation.change}</li>
        <li>Correlate. {snap.investigation.correlation}</li>
        <li>Likely failure. {snap.investigation.likely}</li>
        <li>Mitigate. {snap.investigation.mitigate}</li>
        <li>Verify recovery. {snap.investigation.verify}</li>
        <li>Prevent. {snap.investigation.prevent}</li>
      </ol>
      <div className="mt-6 max-w-measure space-y-2 text-sm text-ink-muted">
        <p>Logs are events. Metrics are numbers over time. Traces follow one request across services. Alerts fire when a rule you wrote matches.</p>
        <p>{sloNote.sli}</p>
        <p>{sloNote.slo}</p>
        <p>{sloNote.budget}</p>
      </div>
    </div>
  );
}

/** Security topics and scenarios. The list is not a claim that a system passed it. */
export function SecurityExplorer() {
  return (
    <div>
      <p className="max-w-measure text-sm text-ink-muted">
        A checklist does not make a system secure. Security is the implementation, the configuration,
        the verification, and the ongoing operation.
      </p>
      <ul className="mt-4 max-w-measure list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {securityTopics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      <div className="mt-6">
        <RecordTabs
          label="Security scenarios"
          tabs={securityScenarios.map((item) => ({ id: item.id, label: item.label }))}
          renderPanel={(id) => (
            <p className="max-w-measure text-sm text-ink-muted">
              {(securityScenarios.find((item) => item.id === id) ?? securityScenarios[0]).body}
            </p>
          )}
        />
      </div>
    </div>
  );
}

/** Sample cost model. Every figure is computed from the visible assumptions. */
export function CostExplorer() {
  const [input, setInput] = useState<CostInput>(costPreset("small"));
  const estimate = estimateCost(input);
  const setWorkload = (workload: WorkloadSize) => setInput(costPreset(workload));

  return (
    <div>
      <p className="text-sm text-ink-muted">{estimate.caveat}</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Workload size">
        {(["small", "moderate", "higher"] as const).map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={input.workload === size}
            onClick={() => setWorkload(size)}
            className={`border px-3 py-2 text-sm ${
              input.workload === size ? "border-ink text-ink" : "border-rule text-ink-muted"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Requests per month"
          value={input.requestsPerMonth}
          onChange={(requestsPerMonth) => setInput({ ...input, requestsPerMonth })}
        />
        <NumberField label="Stored GB" value={input.storedGb} onChange={(storedGb) => setInput({ ...input, storedGb })} />
        <NumberField label="Log GB" value={input.logGb} onChange={(logGb) => setInput({ ...input, logGb })} />
        <NumberField label="Workers" value={input.workers} onChange={(workers) => setInput({ ...input, workers })} />
        <NumberField
          label="Idle instances"
          value={input.idleInstances}
          onChange={(idleInstances) => setInput({ ...input, idleInstances })}
        />
        <NumberField
          label="Cache hit ratio"
          value={input.cacheHitRatio}
          step={0.05}
          onChange={(cacheHitRatio) => setInput({ ...input, cacheHitRatio })}
        />
      </div>
      <table className="mt-6 w-full text-left text-sm">
        <caption className="mb-2 text-left text-ink">Sample monthly estimate ${estimate.total.toFixed(2)}</caption>
        <tbody>
          {estimate.lines.map((line) => (
            <tr key={line.id} className="border-b border-rule">
              <th scope="row" className="py-2 pr-3 font-medium text-ink">{line.label}</th>
              <td className="py-2 pr-3 font-mono text-ink">${line.amount.toFixed(2)}</td>
              <td className="py-2 text-ink-muted">{line.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-4 max-w-measure list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {estimate.assumptions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 max-w-measure text-sm text-ink-muted">
        Practical moves, after you measure: right-size, autoscale, scale to zero when the workload allows,
        cache, fix expensive queries, shorten log retention, expire storage, alert on budget, and delete
        what is unused. A lower number in this table is not a saving I have booked.
      </p>
    </div>
  );
}

/** Number input with a visible label. */
function NumberField({
  label,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-sm text-ink">
      {label}
      <input
        className="mt-1 block w-full border border-rule bg-paper px-2 py-2"
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

/** Scaling levers and the bottleneck they do not magically remove. */
export function ScalingSimulator() {
  const [instances, setInstances] = useState(2);
  const [cache, setCache] = useState(false);
  const [queue, setQueue] = useState(false);
  const [readReplica, setReadReplica] = useState(false);
  const [pool, setPool] = useState(true);
  const [index, setIndex] = useState(false);
  const [rateLimit, setRateLimit] = useState(false);
  const [bottleneck, setBottleneck] = useState<ScaleBottleneck>("database");
  const [retries, setRetries] = useState<RetryPolicy>("immediate");
  const report = scaleOutcome({
    instances,
    cache,
    queue,
    readReplica,
    pool,
    index,
    rateLimit,
    bottleneck,
    retries,
  });
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField label="Application instances" value={instances} onChange={setInstances} />
        <label className="text-sm text-ink">
          Bottleneck
          <select
            className="mt-1 block w-full border border-rule bg-paper px-2 py-2"
            value={bottleneck}
            onChange={(event) => setBottleneck(event.target.value as ScaleBottleneck)}
          >
            <option value="application">Application</option>
            <option value="database">Database</option>
            <option value="downstream">Downstream</option>
          </select>
        </label>
        <label className="text-sm text-ink">
          Retries
          <select
            className="mt-1 block w-full border border-rule bg-paper px-2 py-2"
            value={retries}
            onChange={(event) => setRetries(event.target.value as RetryPolicy)}
          >
            <option value="none">None</option>
            <option value="immediate">Immediate</option>
            <option value="backoff">Limited backoff</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink">
        <Toggle label="Caching" checked={cache} onChange={setCache} />
        <Toggle label="Queue" checked={queue} onChange={setQueue} />
        <Toggle label="Read replica" checked={readReplica} onChange={setReadReplica} />
        <Toggle label="Connection pool" checked={pool} onChange={setPool} />
        <Toggle label="Index" checked={index} onChange={setIndex} />
        <Toggle label="Rate limit" checked={rateLimit} onChange={setRateLimit} />
      </div>
      <ul className="mt-4 max-w-measure list-disc space-y-2 pl-5 text-sm text-ink-muted">
        {report.effects.map((effect) => (
          <li key={effect}>{effect}</li>
        ))}
      </ul>
      <p className="mt-3 max-w-measure text-sm text-ink">{report.limitation}</p>
      <p className="mt-3 max-w-measure text-sm text-ink-muted">
        Also in the model, even when the controls above are off: backpressure, graceful degradation,
        timeouts, circuit breakers, health checks, a recovery objective, a tested restore, and a rollback
        to the previous artifact. Vertical scaling makes one machine larger. Horizontal scaling adds
        stateless instances. Neither is free, and neither fixes a query that does too much work.
      </p>
    </div>
  );
}

/** Checkbox with a visible label. */
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 border border-rule px-3 py-2">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

/** Reference decisions. */
export function DecisionExplorer() {
  return (
    <RecordTabs
      label="Architecture decisions"
      layout="stack"
      tabs={architectureDecisions.map((item) => ({ id: item.id, label: item.title }))}
      renderPanel={(id) => {
        const decision = architectureDecisions.find((item) => item.id === id) ?? architectureDecisions[0];
        return (
          <Facts
            rows={[
              { label: "Context", value: decision.context },
              { label: "Requirements", value: decision.requirements },
              { label: "Options", value: decision.options },
              { label: "Decision", value: decision.decision },
              { label: "Benefits", value: decision.benefits },
              { label: "Trade-offs", value: decision.tradeoffs },
              { label: "Risks", value: decision.risks },
              { label: "Revisit when", value: decision.revisit },
            ]}
          />
        );
      }}
    />
  );
}

/** Diagnostic lab. */
export function TroubleshootingLab() {
  return (
    <div>
      <p className="mb-4 max-w-measure text-sm text-ink-muted">
        Commands are illustrative. This page does not run them.
      </p>
      <RecordTabs
        label="Troubleshooting scenarios"
        layout="stack"
        tabs={troubleshootingScenarios.map((item) => ({ id: item.id, label: item.label }))}
        renderPanel={(id) => {
          const scenario = troubleshootingScenarios.find((item) => item.id === id) ?? troubleshootingScenarios[0];
          return (
            <Facts
              rows={[
                { label: "Symptoms", value: scenario.symptoms },
                { label: "Hypotheses", value: scenario.hypotheses },
                { label: "Checks", value: scenario.checks },
                { label: "Evidence", value: scenario.evidence },
                { label: "Likely causes", value: scenario.causes },
                { label: "Mitigation", value: scenario.mitigate },
                { label: "Verification", value: scenario.verify },
                { label: "Prevention", value: scenario.prevent },
              ]}
            />
          );
        }}
      />
    </div>
  );
}
