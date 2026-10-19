/**
 * Cloud engineering proof of work: the copy and records behind /pow/cloud-engineer.
 *
 * Verified notes come from repository files and from HTTP checks on 19 Oct 2026. Reference
 * architectures, the Fieldnote lab, prices, and telemetry are labeled as examples. The deployment
 * math lives in src/lib/cloudOpsLab.ts.
 *
 * Connects to:
 * - src/pages/CloudEngineerPowPage.tsx and src/components/pow/cloud/CloudLab.tsx.
 * - src/lib/agent/markdown.ts (`renderCloudEngineerBody`).
 * - searchIndex.ts and publicRoutes.ts.
 */
import type { DeployTarget } from "../lib/cloudOpsLab";

/** Route for this page. */
export const CLOUD_ENGINEER_PATH = "/pow/cloud-engineer";

/** Search and Markdown description. */
export const cloudEngineerDescription =
  "How I think about deployment, networking, security, reliability, and cost. Verified project setup is separated from a local lab that does not provision a cloud account.";

/** Jump links on the page, in reading order. */
export const cloudSections = [
  { id: "cloud-operations-lab", label: "Lab" },
  { id: "architecture", label: "Architecture" },
  { id: "deployments", label: "Deploy" },
  { id: "infrastructure-as-code", label: "IaC" },
  { id: "containers", label: "Containers" },
  { id: "networking", label: "Network" },
  { id: "cicd", label: "CI/CD" },
  { id: "observability", label: "Observe" },
  { id: "security", label: "Security" },
  { id: "cost", label: "Cost" },
  { id: "scaling", label: "Scaling" },
  { id: "case-studies", label: "Projects" },
  { id: "decisions", label: "Decisions" },
  { id: "troubleshooting", label: "Troubleshoot" },
  { id: "roadmap", label: "Roadmap" },
] as const;

/** Principles under the hero. They are a stance, not a list of certifications. */
export const cloudPrinciples = [
  "Infrastructure as code.",
  "Reproducible deployments.",
  "Least-privilege security.",
  "Observable systems.",
  "Automated delivery.",
  "Reliable failure recovery.",
  "Cost-aware architecture.",
  "Clear operational ownership.",
] as const;

/** One box in a reference diagram. */
export interface CloudComponent {
  id: string;
  name: string;
  responsibility: string;
  requestFlow: string;
  dataFlow: string;
  trust: string;
  deploy: string;
  failure: string;
  scaling: string;
  burden: string;
  security: string;
  cost: string;
}

/** A reference architecture. Not a picture of a live account. */
export interface ArchitectureProfile {
  id: string;
  name: string;
  summary: string;
  priority: string;
  complexity: string;
  components: readonly CloudComponent[];
}

const dns: CloudComponent = {
  id: "dns",
  name: "DNS",
  responsibility: "Turns the public name into an address for the edge.",
  requestFlow: "The browser asks DNS before it opens a connection.",
  dataFlow: "No application data. Only the name and the answer.",
  trust: "Outside the app. A wrong record sends people to the wrong place.",
  deploy: "Change the record, then wait for the TTL you set.",
  failure: "The name does not resolve, or it resolves to an old address.",
  scaling: "DNS is rarely the app bottleneck at the sizes I ship.",
  burden: "Low, if one person owns the zone and the records are written down.",
  security: "Lock the registrar account. Do not leave unused records pointing at old origins.",
  cost: "Usually a small fixed fee, until you add a traffic-routing product.",
};

const edge: CloudComponent = {
  id: "edge",
  name: "CDN or edge",
  responsibility: "Terminates TLS and can cache public responses.",
  requestFlow: "After DNS. Before the origin.",
  dataFlow: "May store cacheable responses. Should not store private responses.",
  trust: "The edge sees the client request. The origin should only trust the edge.",
  deploy: "Point the origin at the current app, and set what is cacheable.",
  failure: "Stale cache, or the origin address is wrong.",
  scaling: "Absorbs repeated public reads. Does not fix a slow database.",
  burden: "Low on a managed host. You still own cache rules.",
  security: "HTTPS only. Do not cache authenticated pages.",
  cost: "Grows with egress and cache misses, not with idle CPU.",
};

const web: CloudComponent = {
  id: "web",
  name: "Web application hosting",
  responsibility: "Serves the client application.",
  requestFlow: "Receives the page request from the edge.",
  dataFlow: "Reads public content. Does not hold the database password in the browser.",
  trust: "Public. Treat everything from the browser as untrusted.",
  deploy: "Publish a new build. Keep the previous build available for rollback.",
  failure: "A bad build, or a route that 404s because the file was not generated.",
  scaling: "Static files scale at the edge. A server-rendered app scales with the host.",
  burden: "Low when the host builds from Git.",
  security: "No secrets in the client bundle.",
  cost: "Often included with the host until bandwidth or build minutes grow.",
};

const api: CloudComponent = {
  id: "api",
  name: "API",
  responsibility: "Runs the request handlers that read and write data.",
  requestFlow: "The client calls the API after the page loads, or the edge routes /api to it.",
  dataFlow: "Reads and writes the database. Returns only what the caller may see.",
  trust: "Public edge, private data access.",
  deploy: "Same pipeline as the web tier, or its own service.",
  failure: "Unhandled exceptions become HTTP 500. A bad config fails closed.",
  scaling: "More instances help only while the database can take the connections.",
  burden: "You own the process, the logs, and the health path.",
  security: "Authenticate writes. Authorize every row you would not show the public.",
  cost: "Compute time, and the database it talks to.",
};

const database: CloudComponent = {
  id: "database",
  name: "Managed database",
  responsibility: "Stores the records the product cannot lose.",
  requestFlow: "The API connects. Browsers do not.",
  dataFlow: "Durable data. Migrations change the shape.",
  trust: "Private network path from the app. Not a public internet address.",
  deploy: "Migrations are a separate step from the app binary, with a backup first.",
  failure: "Connections exhausted, disk full, or a migration that cannot roll back.",
  scaling: "Vertical size, indexes, then read replicas. Not 'add more web servers' alone.",
  burden: "Backups, restore drills, and migration review.",
  security: "No public listen address. Least-privilege database roles.",
  cost: "Often the largest line once the app is small and the data is not.",
};

const registry: CloudComponent = {
  id: "registry",
  name: "Container registry",
  responsibility: "Stores immutable images by digest.",
  requestFlow: "Not on the user request path. On the deploy path.",
  dataFlow: "Images, not user data.",
  trust: "Only the runtime identity can pull. Only CI can push.",
  deploy: "CI pushes the digest. The host runs that digest.",
  failure: "Missing tag, or a pull denied because the identity is wrong.",
  scaling: "Irrelevant to request rate.",
  burden: "Retention and scan results.",
  security: "Scan before promotion. Do not run a tag you did not build.",
  cost: "Storage of old images if you never delete them.",
};

const containerHost: CloudComponent = {
  id: "container-host",
  name: "Container host",
  responsibility: "Runs the image, restarts it, and checks the health path.",
  requestFlow: "The edge forwards to the container's port.",
  dataFlow: "The process memory. Durable data stays in the database.",
  trust: "The host's network reaches the database. The public internet should not.",
  deploy: "Replace the running digest. Wait for the health check.",
  failure: "Crash loop, wrong port, or a health path that does not exist.",
  scaling: "More replicas if the app is stateless and the database allows it.",
  burden: "Image builds plus the host's logs and restarts.",
  security: "Non-root user, read-only filesystem where you can, and a secret mount rather than a baked-in env file.",
  cost: "You pay for replicas that stay running, including idle ones.",
};

const balancer: CloudComponent = {
  id: "balancer",
  name: "Load balancer",
  responsibility: "Spreads requests across healthy instances.",
  requestFlow: "After the edge, before an instance.",
  dataFlow: "Does not store user data. May log the request.",
  trust: "Knows which instances are healthy.",
  deploy: "Register the new instances, then drain the old ones.",
  failure: "No healthy target, or sticky sessions pinning everyone to a dead one.",
  scaling: "Needed once you have more than one instance.",
  burden: "Health checks and drain behavior.",
  security: "Do not expose the instance ports beside the balancer.",
  cost: "A fixed hourly charge plus traffic, depending on the product.",
};

const queue: CloudComponent = {
  id: "queue",
  name: "Queue",
  responsibility: "Holds work the request should not do inline.",
  requestFlow: "The API enqueues and returns. The user does not wait for the job.",
  dataFlow: "Job payloads. Keep them small and free of secrets.",
  trust: "Producers and workers share it. The public does not.",
  deploy: "The queue exists before the worker that reads it.",
  failure: "Depth grows when workers stop, or poison messages retry forever.",
  scaling: "Decouples web traffic from job speed. It is not infinite.",
  burden: "Dead-letter handling and depth alerts.",
  security: "The worker's identity can read. A random app role cannot.",
  cost: "Requests and payload size, plus workers you leave running.",
};

const worker: CloudComponent = {
  id: "worker",
  name: "Background worker",
  responsibility: "Does the slow or retryable work.",
  requestFlow: "Not on the user's HTTP path.",
  dataFlow: "Reads the queue and writes results to the database or object storage.",
  trust: "Private. A different deploy from the web tier.",
  deploy: "Its own image and health check.",
  failure: "Crash, or a dependency it calls is down.",
  scaling: "Add workers only if the thing they call can take the extra rate.",
  burden: "Another service to log, alert, and roll back.",
  security: "Its own credentials, narrower than the API's.",
  cost: "Always-on cost unless the platform scales it to zero.",
};

const storage: CloudComponent = {
  id: "storage",
  name: "Object storage",
  responsibility: "Holds files that do not belong in the database.",
  requestFlow: "The API signs an upload or download. The file does not pass through the app server when you can avoid it.",
  dataFlow: "Blobs. Lifecycle rules delete or archive them.",
  trust: "Private bucket. Public only for objects you mean to publish.",
  deploy: "The bucket and the policy exist before the app expects them.",
  failure: "Wrong bucket name, or a policy that blocks the app.",
  scaling: "The store scales. Your egress bill scales with downloads.",
  burden: "Lifecycle rules and access reviews.",
  security: "Block public listing. Separate backup access from app access.",
  cost: "Storage plus retrieval and egress.",
};

const secrets: CloudComponent = {
  id: "secrets",
  name: "Secrets",
  responsibility: "Holds credentials the app reads at runtime.",
  requestFlow: "Not on the user path.",
  dataFlow: "The secret value stays out of git and out of logs.",
  trust: "The deploy identity can read the names for this environment only.",
  deploy: "Inject at release. Never bake into the image.",
  failure: "A missing variable stops the release in the lab's config stage.",
  scaling: "Not a scaling tool.",
  burden: "Rotation and knowing which app uses which name.",
  security: "Least privilege, and no secrets in the repository.",
  cost: "Usually small beside the database.",
};

const iam: CloudComponent = {
  id: "iam",
  name: "Identity and access",
  responsibility: "Decides which identity may call which API.",
  requestFlow: "Checked on deploy and on admin actions.",
  dataFlow: "Policies, not product data.",
  trust: "The control plane.",
  deploy: "Change a policy in review, then apply it.",
  failure: "A deploy fails closed when the role is too small, or you are exposed when it is too large.",
  scaling: "Not a traffic tool.",
  burden: "Reviews. Unused permissions accumulate.",
  security: "Start from none and add the calls you can name.",
  cost: "The time to review, not a large invoice line.",
};

const logs: CloudComponent = {
  id: "logs",
  name: "Logs and metrics",
  responsibility: "Records what the running system did.",
  requestFlow: "Off to the side of the request.",
  dataFlow: "Events and numbers. Not a second copy of the database.",
  trust: "Operators can read them. They must not contain secrets or raw personal data you do not need.",
  deploy: "The app emits structured logs from the first environment, not only production.",
  failure: "You cannot tell a bad deploy from a bad dependency if nothing is recorded.",
  scaling: "Volume grows with traffic and with careless log lines.",
  burden: "Retention, dashboards, and someone who looks at alerts.",
  security: "Audit admin actions. Restrict who can read production logs.",
  cost: "Ingestion and retention. This is a real bill if you keep everything.",
};

const alerts: CloudComponent = {
  id: "alerts",
  name: "Alerting",
  responsibility: "Tells a person when a gauge crosses a line you chose.",
  requestFlow: "Not on the user path.",
  dataFlow: "Alert events.",
  trust: "The on-call path.",
  deploy: "Ship the alert with the feature that can page you.",
  failure: "No alert, or an alert that fires so often people ignore it.",
  scaling: "More services means more alerts to tune.",
  burden: "Ownership. An alert with no owner is noise.",
  security: "Do not put secret values in the alert text.",
  cost: "Notification and monitoring products, usually smaller than the database.",
};

const cicd: CloudComponent = {
  id: "cicd",
  name: "CI/CD",
  responsibility: "Runs checks and publishes only a commit that passed.",
  requestFlow: "Not on the user path.",
  dataFlow: "Source, test results, and the artifact.",
  trust: "The pipeline identity can deploy. A laptop should not be the only path.",
  deploy: "The pipeline is the deploy path.",
  failure: "A green pipeline that skipped tests, or a red one that someone bypassed.",
  scaling: "Build time grows with the repo.",
  burden: "Keeping the checks honest.",
  security: "Secrets as pipeline secrets. Protected environments for production.",
  cost: "Build minutes.",
};

/** Three reference profiles. Components are omitted on purpose when the profile does not need them. */
export const architectureProfiles: readonly ArchitectureProfile[] = [
  {
    id: "lean",
    name: "Lean application",
    summary:
      "A small app on managed hosting and a managed database. Reference architecture, not a map of a live account.",
    priority: "Simplicity and a small maintenance burden.",
    complexity:
      "The provider runs the machines. You still own the app, the schema, the domain, and what happens when a deploy is wrong.",
    components: [dns, edge, web, api, database, secrets, cicd],
  },
  {
    id: "container",
    name: "Containerized application",
    summary:
      "An image in a registry, a host that runs it, health checks, and a managed database. Reference architecture.",
    priority: "Repeatable builds and a portable artifact.",
    complexity: "You add the registry, the image build, and the probe. You do not yet operate a cluster.",
    components: [dns, edge, registry, containerHost, api, database, secrets, logs],
  },
  {
    id: "distributed",
    name: "Distributed application",
    summary:
      "More than one service, a queue, separate scaling, and one place to look at logs. Reference architecture.",
    priority: "Independent scaling and a place for slow work.",
    complexity:
      "Each new service adds a deploy, a failure mode, and an owner. This is the right shape when one process cannot meet the constraints, not because it looks more professional.",
    components: [dns, edge, balancer, api, worker, queue, database, storage, secrets, iam, logs, alerts],
  },
];

/** Illustrative modules. None of these is applied. */
export const iacModules = [
  {
    id: "network",
    label: "Network",
    body: "A private network for the database and a public entry only at the edge. Example module, not a deployed VPC.",
  },
  {
    id: "app",
    label: "Application service",
    body: "The service name, the image digest or build, the port, and the health path. Example, not a live service.",
  },
  {
    id: "database",
    label: "Database",
    body: "Engine, size, backup window, and a private address. Example. I have not applied this module.",
  },
  {
    id: "storage",
    label: "Storage",
    body: "A private bucket and a lifecycle rule. Example.",
  },
  {
    id: "iam",
    label: "IAM permissions",
    body: "A role that can read one secret and write one bucket prefix. Example of least privilege, not an account policy.",
  },
  {
    id: "monitoring",
    label: "Monitoring",
    body: "A log group with a retention period and an alert on error rate. Example.",
  },
  {
    id: "secrets",
    label: "Secrets",
    body: "Names only. Values come from the secret store at apply time, or the plan shows a change you should reject.",
  },
  {
    id: "deploy",
    label: "Deployment configuration",
    body: "Environment name, variable names, and the release steps. Example. Production would be a different state file.",
  },
] as const;

/** Why the lab talks about declarative infrastructure. */
export const iacLessons = [
  "Version control gives you a review before a change, and a history after it.",
  "A plan shows what would be created, changed, or destroyed. Read destroy lines before you apply.",
  "State is the tool's memory of what it created. Lock it, back it up, and do not edit it by hand.",
  "Secrets do not belong in the repository or in a plan that is pasted into a ticket.",
  "Environments differ by variables and state, not by a copy of the whole definition that drifts.",
  "Drift is a change made outside the tool. It means the next apply may surprise you.",
  "Destructive changes need a named owner and a backup you have restored at least once in a drill.",
] as const;

/** Example configuration. Not Terraform I have applied. */
export const iacExample = `# Example only. Not applied. Not a real account.
# Values would come from variables. Secrets are not in this file.

resource "example_service" "fieldnote_web" {
  name         = "fieldnote-web"
  image_digest = var.image_digest
  health_path  = "/healthz"
}

resource "example_database" "fieldnote" {
  name    = "fieldnote"
  public  = false
  size    = var.database_size
}`;

/** Annotated reference Dockerfile. Not an image I built for this page. */
export const dockerfileLines = [
  { instruction: "FROM node:22-alpine AS build", meaning: "Build stage. Alpine is smaller. The tag should be pinned further in a real file." },
  { instruction: "WORKDIR /app", meaning: "Every later path is relative to /app." },
  { instruction: "COPY package.json package-lock.json ./", meaning: "Copy the lockfile first so dependency installs cache." },
  { instruction: "RUN npm ci", meaning: "Install from the lockfile. A missing lockfile or the wrong context makes this fail." },
  { instruction: "COPY . .", meaning: "Copy source after dependencies. A bad build context sends secrets or node_modules in." },
  { instruction: "RUN npm run build", meaning: "Produce the artifact in this stage." },
  { instruction: "FROM node:22-alpine AS runtime", meaning: "A second stage. The build tools do not have to ship." },
  { instruction: "RUN adduser --disabled-password app", meaning: "A non-root user." },
  { instruction: "COPY --from=build /app/dist ./dist", meaning: "Only the artifact moves forward." },
  { instruction: "USER app", meaning: "The process does not run as root." },
  { instruction: "EXPOSE 3000", meaning: "Documents the port. It does not publish it." },
  { instruction: 'CMD ["node", "dist/server.js"]', meaning: "The process. If it exits, the host restarts the container." },
] as const;

/** Container failure cases for the explorer. */
export const containerFailures = [
  { id: "context", label: "Incorrect build context", body: "The Dockerfile copies a path that is not in the context. Fix the context directory or the COPY path. Do not disable the ignore file to hide the mistake." },
  { id: "dependency", label: "Missing dependency", body: "The lockfile and the import disagree, or a native module was built for the wrong platform. Reproduce the install in the same base image." },
  { id: "port", label: "Port mismatch", body: "The process listens on 3000 and the host probes 8080. Align the listen port, EXPOSE, and the service port." },
  { id: "env", label: "Missing environment variable", body: "The image starts and the app exits because a variable is unset. Pass it at runtime. Do not rebuild the image to embed the secret." },
  { id: "health", label: "Incorrect health-check path", body: "The probe calls /health and the app serves /healthz. The host kills a healthy process. Fix the path, then watch one restart stop." },
  { id: "exit", label: "Process exits during startup", body: "The main process is a shell that exits, or the server crashes on boot. Logs from the first seconds matter more than another restart." },
] as const;

/** Container concepts, short enough to scan. */
export const containerLessons = [
  "An image is a file. A container is a running process from that file.",
  "Multi-stage builds keep compilers out of the runtime image.",
  "A lockfile is what makes the install repeatable.",
  "A smaller base image has fewer packages to patch. It still needs updates.",
  "Run as a user that is not root.",
  "Configuration belongs at runtime, not in the image layer.",
  "Tags move. A digest does not. Promote a digest.",
  "Scan the image before you trust it. A scan is not a deployment.",
  "Set a memory and CPU limit so one process cannot take the host.",
  "A health check tells the host when to stop sending traffic.",
  "Handle SIGTERM and finish in-flight work before exit.",
] as const;

/** Network scenarios and the checks a person would run. Commands are illustrative. */
export const networkScenarios = [
  {
    id: "dns",
    label: "DNS failure",
    symptom: "The name does not resolve, or it resolves to an old address.",
    steps: [
      "Check the record type and name at the authoritative DNS, not only the browser cache.",
      "Compare the TTL with how long ago the record changed.",
      "Illustrative: dig example.com A and dig example.com CNAME.",
    ],
    distinction: "This fails before HTTP. The application log will be empty because the request never arrived.",
  },
  {
    id: "tls",
    label: "TLS failure",
    symptom: "The certificate is expired, for the wrong name, or incomplete.",
    steps: [
      "Read the error: name mismatch, expired, or unknown authority.",
      "Check which certificate the edge presents, including intermediate certificates.",
      "Illustrative: openssl s_client -connect example.com:443 -servername example.com.",
    ],
    distinction: "TCP connects. The handshake fails. Application routes are not the first place to look.",
  },
  {
    id: "origin",
    label: "Incorrect origin",
    symptom: "The edge returns another site, or a default page.",
    steps: [
      "Read the edge's origin setting for this hostname.",
      "Confirm the origin host answers the same path directly, from a network that is allowed to reach it.",
      "Check cache. A previous origin can still be cached.",
    ],
    distinction: "TLS can succeed while the content is wrong. That is a routing configuration failure.",
  },
  {
    id: "blocked",
    label: "Blocked connection",
    symptom: "The client or the app times out. A firewall or security group drops the packet.",
    steps: [
      "See whether the timeout is from the public client or only from the app to the database.",
      "Read the allow rule: source, port, and direction.",
      "Do not open the port to the world to finish the test.",
    ],
    distinction: "A timeout with no application log on the destination means the packet did not arrive. An HTTP 403 means it did.",
  },
  {
    id: "database",
    label: "Database connection failure",
    symptom: "The app is up and cannot open a database session.",
    steps: [
      "Confirm the host, port, database name, and that the password is the current one.",
      "Confirm the database is not reachable from the public internet and is reachable from the app network.",
      "Illustrative, from the app network: psql \"host=… dbname=… user=…\" -c 'select 1'.",
    ],
    distinction: "The user-facing symptom is often HTTP 500. The network symptom is the failed session. Read both.",
  },
  {
    id: "routing",
    label: "Incorrect routing",
    symptom: "The request reaches the wrong service or path.",
    steps: [
      "Match the method and path to the route table.",
      "Check a rewrite that sends every path to one file.",
      "Confirm there is one route for that path, not a duplicate that wins.",
    ],
    distinction: "HTTP arrived. The status and the body tell you which service answered.",
  },
] as const;

/** Pipeline stages the visitor can inspect. The gate is local, like the deploy simulator. */
export const pipelineStages = [
  { id: "change", label: "Code change", body: "A commit is the input. A laptop deploy is not the pipeline." },
  { id: "lint", label: "Linting", body: "Style and static checks fail the job before tests spend minutes." },
  { id: "test", label: "Automated tests", body: "The suite that must pass. A skipped suite is not a pass." },
  { id: "build", label: "Build", body: "The same command the host will run, or the image build." },
  { id: "security", label: "Security checks", body: "Dependency audit and a secret scan. A warning you ignore on purpose should be written down." },
  { id: "artifact", label: "Artifact creation", body: "One immutable artifact for this commit. Do not rebuild it later and call it the same release." },
  { id: "deploy", label: "Deployment", body: "Publish that artifact to one environment." },
  { id: "smoke", label: "Smoke tests", body: "A short check against the new version before it is the version users get." },
  { id: "verify", label: "Release verification", body: "The health path and one real read. Failure here blocks the release in the lab." },
] as const;

/** Delivery ideas. Not a claim that every repo implements each one. */
export const deliveryLessons = [
  "Continuous integration runs the checks on every change.",
  "Continuous delivery means a passing build is ready to release, and a person or a rule still promotes it.",
  "Continuous deployment promotes a passing build without a manual click. Use it when the rollback is boring.",
  "An immutable artifact is what you promote. Rebuilding on the production host is a different binary.",
  "Promotion is dev, then a staging environment, then production. Each has its own config.",
  "An approval is a gate, not a meeting. Production migrations in RevenueRoles require a typed confirmation in the workflow.",
  "A release tag or digest names the artifact you can roll back to.",
  "Rollback returns traffic to the previous artifact. It does not undo a destructive migration.",
  "A migration is safe when it expands first and contracts later, and when you have a backup.",
  "Secrets are injected by the pipeline or the host. They are not stored in the workflow file.",
] as const;

/** Security scenarios. A checklist is not proof the system is secure. */
export const securityScenarios = [
  {
    id: "secret-commit",
    label: "Secret committed to source control",
    body: "Treat the value as public. Revoke it, issue a new one, and remove it from history only after the new value works. Scanning later does not un-leak the old one.",
  },
  {
    id: "public-db",
    label: "Database exposed publicly",
    body: "Remove the public address. Allow the application network only. Then confirm the app still connects, and that the public address no longer accepts a session.",
  },
  {
    id: "permissions",
    label: "Excessive permissions",
    body: "List the API calls the workload makes. Grant those. Remove the rest. A deploy that fails closed is the signal you cut too far.",
  },
  {
    id: "dependency",
    label: "Vulnerable dependency",
    body: "Update it, run the tests, and ship through the same pipeline. A scanner finding is not a fix, and a rushed upgrade without tests is a second incident.",
  },
  {
    id: "image",
    label: "Untrusted container image",
    body: "Build from source you review, scan the image, and promote by digest. Do not pull a floating tag in production.",
  },
  {
    id: "audit",
    label: "Missing audit trail",
    body: "Turn on admin audit logs for the host, the database, and the secret store. Decide who can read them and how long they are kept.",
  },
] as const;

export const securityTopics = [
  "Least-privilege IAM.",
  "Identity for people and for workloads, separately.",
  "Secret management, with rotation.",
  "Encryption in transit (HTTPS, and TLS to the database).",
  "Encryption at rest, which the managed database usually provides and you still have to confirm.",
  "No public bucket or database you did not mean to publish.",
  "Database access only from the application network.",
  "Network segmentation between the edge, the app, and the data.",
  "Dependency review.",
  "Image provenance and scanning where you ship images.",
  "Audit logs for administrative actions.",
  "Backup access that is not the same role as the app.",
  "Separate environments, so a staging key cannot read production.",
  "Credential rotation with a written owner.",
] as const;

/** Reference decisions. They are not minutes from a production review unless a case study says so. */
export const architectureDecisions = [
  {
    id: "host",
    title: "Managed hosting versus virtual machines",
    context: "A small app needs a public URL and a repeatable build.",
    requirements: "One person can deploy it, and a bad deploy can be reversed.",
    options: "Managed hosting, or virtual machines you patch.",
    decision: "Managed hosting while the app fits the platform.",
    benefits: "The provider runs the machines, TLS, and the build.",
    tradeoffs: "You accept the platform's limits and its outage domain.",
    risks: "A feature you need later is awkward or expensive on that host.",
    revisit: "Revisit when you need a long-lived process, a private network the host cannot give you, or costs that beat a smaller machine.",
  },
  {
    id: "runtime",
    title: "Serverless versus containers",
    context: "The app is request-driven, or it also has a worker.",
    requirements: "A place to run the code and a way to roll it back.",
    options: "Functions, or a container.",
    decision: "Functions or static hosting for a request-shaped app. A container when the process must stay up or the build is already an image.",
    benefits: "Functions scale to zero. Containers make the runtime explicit.",
    tradeoffs: "Functions have time and size limits. Containers sit there and cost money when idle.",
    risks: "Choosing containers early adds a registry and a probe before you need them.",
    revisit: "Revisit when cold starts, timeouts, or a background worker show up in real use.",
  },
  {
    id: "data",
    title: "Managed database versus self-hosted",
    context: "The product stores data it cannot lose.",
    requirements: "Backups, a private path, and a restore you trust.",
    options: "A managed database, or a database on a machine you operate.",
    decision: "Managed, until its limits are the actual problem.",
    benefits: "Backups, patching, and failover are the provider's job to offer. You still test a restore.",
    tradeoffs: "Less control over version and placement. A monthly floor price.",
    risks: "A managed default can still be left open to the internet.",
    revisit: "Revisit for a hard latency, tenancy, or cost constraint you have measured.",
  },
  {
    id: "shape",
    title: "One application versus several services",
    context: "The first version has a web app and a database.",
    requirements: "A deploy one person understands.",
    options: "One deployable, or a service per concern.",
    decision: "One application until a workload needs its own scale or its own failure domain.",
    benefits: "One pipeline, one log stream, one rollback.",
    tradeoffs: "A worker and a web process share a fate if you never split them.",
    risks: "Splitting early creates distributed bugs without a user.",
    revisit: "Revisit when a job queue, a separate team, or a measured hotspot shows up.",
  },
  {
    id: "iac",
    title: "Infrastructure as code versus manual configuration",
    context: "Someone will change the host again.",
    requirements: "The change is reviewed, and the next person can see it.",
    options: "Click the console, or commit the definition.",
    decision: "Commit the definition once there is more than a single host setting to remember.",
    benefits: "Review, history, and a plan.",
    tradeoffs: "A tool and a state file to look after. A bad plan can destroy resources.",
    risks: "A reserved folder of empty Terraform, like RevenueRoles has today, is not infrastructure as code yet.",
    revisit: "Revisit the tool choice when the first real resource is about to be applied.",
  },
  {
    id: "async",
    title: "Synchronous API versus a queue",
    context: "Some work is slower than a request should be.",
    requirements: "The user gets a response, and the slow work still happens.",
    options: "Do it in the request, or enqueue it.",
    decision: "Keep it synchronous until the latency or the failure mode hurts.",
    benefits: "A queue isolates a slow dependency.",
    tradeoffs: "You now have retries, ordering, and a backlog.",
    risks: "A queue with immediate retries can amplify an outage.",
    revisit: "Revisit when a request timeout is caused by work that can finish later.",
  },
  {
    id: "region",
    title: "Single region versus multi-region",
    context: "Users are in one region, or the data must survive a region failure.",
    requirements: "A recovery objective you can say out loud.",
    options: "One region, or an active second region.",
    decision: "One region, with backups, until the recovery objective requires another.",
    benefits: "Simpler writes and a smaller bill.",
    tradeoffs: "A region outage is your outage.",
    risks: "Multi-region without a tested failover is a diagram, not a recovery.",
    revisit: "Revisit when the product's written recovery objective is shorter than a restore in one region.",
  },
  {
    id: "logging",
    title: "Centralized versus local logs",
    context: "One process is easy to read on the host. Several are not.",
    requirements: "You can find a request after it fails.",
    options: "Files on the machine, or a log store.",
    decision: "Send structured logs to one store once more than one process is running.",
    benefits: "One search, and logs that survive a restart.",
    tradeoffs: "Cost, and a place that can leak secrets if you log carelessly.",
    risks: "Two log tools means you will look in the wrong one.",
    revisit: "Revisit retention when the invoice or the privacy need changes.",
  },
] as const;

/** Troubleshooting lab. Commands are illustrative and are not run by the page. */
export const troubleshootingScenarios = [
  {
    id: "http-500",
    label: "Application returns HTTP 500",
    symptoms: "The route returns 500. Other routes may still work.",
    hypotheses: "An unhandled exception, a bad config, or a dependency the handler calls.",
    checks: "Read the application log for that request id. Reproduce with one input. Illustrative: curl -i https://example.com/the-path.",
    evidence: "The stack or error code, the version that is serving, and whether the database call succeeded.",
    causes: "A bug in the handler, a missing variable, or a down dependency.",
    mitigate: "Roll back if it started with a deploy. Otherwise disable the one feature.",
    verify: "The same request returns a non-500, and the error log stops growing.",
    prevent: "A test for the handler and a smoke check on that path.",
  },
  {
    id: "build",
    label: "Deployment fails during build",
    symptoms: "The pipeline is red on the build step. Nothing new is serving.",
    hypotheses: "A type error, a missing dependency, or a command that differs from local.",
    checks: "Read the build log. Run the same script locally. Illustrative: npm run build.",
    evidence: "The first error, not the cascade after it.",
    causes: "Source that does not compile, or a lockfile out of date.",
    mitigate: "Fix the build on a branch. Do not hand-copy files to the host.",
    verify: "The pipeline build step passes on the commit you intend to ship.",
    prevent: "The same build command in CI and in the host.",
  },
  {
    id: "env",
    label: "Environment variable is missing",
    symptoms: "The process exits on boot, or a feature fails only in one environment.",
    hypotheses: "The name is unset, empty, or set on the wrong environment.",
    checks: "Compare the names the app requires with the names configured. Print only the names, never the values.",
    evidence: "The missing name, and which environment.",
    causes: "A new variable was added in code and not in the host.",
    mitigate: "Set it in the secret store and restart or redeploy.",
    verify: "The boot check passes and the value is not in the log.",
    prevent: "Fail the release in configuration validation when a required name is absent.",
  },
  {
    id: "connections",
    label: "Database connections are exhausted",
    symptoms: "Timeouts acquiring a connection. The database is up.",
    hypotheses: "Too many app instances, a pool with no limit, or leaked sessions.",
    checks: "Read the database's connection count and the app's pool size. Illustrative: a server status query such as showing active connections, using the database's own tool.",
    evidence: "Count versus the max, and which role owns the sessions.",
    causes: "A pool per instance times the instance count, or transactions left open.",
    mitigate: "Cap the pool. Scale the app down before you raise the database max.",
    verify: "New requests acquire a session, and the count stays under the max.",
    prevent: "A pool size written next to the max connections, and an alert on saturation.",
  },
  {
    id: "dns",
    label: "Domain does not resolve",
    symptoms: "The browser says the server cannot be found.",
    hypotheses: "Missing record, wrong name, or a resolver cache.",
    checks: "Query the authoritative server. Illustrative: dig example.com.",
    evidence: "The answer section, or the absence of one.",
    causes: "The record was never created, or it was deleted.",
    mitigate: "Restore the record. Wait for the TTL.",
    verify: "A resolver that is not your laptop returns the address you intended.",
    prevent: "The record lives in the same reviewed config as the host.",
  },
  {
    id: "tls",
    label: "TLS certificate validation fails",
    symptoms: "The browser warns, or a client rejects the handshake.",
    hypotheses: "Expired, wrong name, or a missing intermediate.",
    checks: "Inspect the certificate the server presents. Illustrative: openssl s_client.",
    evidence: "The not-after date and the names on the certificate.",
    causes: "Renewal did not run, or the name on the certificate is not the name users type.",
    mitigate: "Renew and install the full chain. Do not tell users to bypass the warning.",
    verify: "A client that checks certificates succeeds.",
    prevent: "Renewal earlier than expiry, and an alert on days remaining.",
  },
  {
    id: "restart",
    label: "Container repeatedly restarts",
    symptoms: "The host shows a crash loop. Users see 502 or nothing.",
    hypotheses: "The process exits, the probe is wrong, or memory is over the limit.",
    checks: "Read the container logs from the last start. Compare the probe path with the app.",
    evidence: "The exit code and the last log lines.",
    causes: "A missing variable, an address already in use, or a probe that kills a slow start.",
    mitigate: "Stop the rollout. Serve the previous digest.",
    verify: "One start stays up and the probe passes.",
    prevent: "A startup probe separate from the liveness probe when boot is slow.",
  },
  {
    id: "slow",
    label: "Application becomes slow under load",
    symptoms: "Latency climbs as requests climb. Errors may still be rare.",
    hypotheses: "A saturated database, a missing cache, or an unbounded fan-out.",
    checks: "Look at latency, CPU, and database time together. A load test with a written limit beats a guess.",
    evidence: "Which gauge moved first.",
    causes: "The bottleneck is often the database or a downstream, not the web CPU.",
    mitigate: "Shed load with a rate limit. Cache what can be cached. Do not only add instances.",
    verify: "Latency at the same request rate is back inside the bound you wrote down.",
    prevent: "A latency alert and a test that fails when a query regresses.",
  },
  {
    id: "jobs",
    label: "Background jobs accumulate",
    symptoms: "The queue depth grows. The site still loads.",
    hypotheses: "Workers are down, too slow, or retrying poison messages.",
    checks: "Count running workers and the age of the oldest message.",
    evidence: "Depth over time, and the error on the failing job.",
    causes: "Worker crash, or a downstream that errors and is retried immediately.",
    mitigate: "Pause poison messages. Fix the worker. Add workers only if the downstream can take them.",
    verify: "Depth falls while new work still arrives.",
    prevent: "A dead-letter queue and an alert on depth and age.",
  },
  {
    id: "restore",
    label: "Database backup restoration fails",
    symptoms: "The restore errors, or the restored data is not the data you expected.",
    hypotheses: "The backup is incomplete, the target is too small, or the procedure was never run.",
    checks: "Read the restore error. Confirm the backup's time and the target version.",
    evidence: "The backup id, the error, and a row count you expected.",
    causes: "An untested backup, a version mismatch, or a permission on the backup store.",
    mitigate: "Restore into a new instance. Do not overwrite the only copy until the new one is checked.",
    verify: "The application reads a known row from the restored instance.",
    prevent: "A scheduled restore drill with a date on it.",
  },
] as const;

/** Evidence label for a case-study line. */
export type CloudEvidence = "verified" | "observed" | "proposed";

/** One project write-up. */
export interface CloudCaseStudy {
  id: string;
  title: string;
  href?: string;
  repo?: string;
  lines: readonly { kind: CloudEvidence; text: string }[];
}

/** Case studies. Verified lines are from repository files. Observed lines are from checks on 19 Oct 2026. */
export const cloudCaseStudies: readonly CloudCaseStudy[] = [
  {
    id: "revenueroles",
    title: "RevenueRoles",
    href: "https://revenueroles.in",
    repo: "https://github.com/ayushrai-hub/RevenueRoles",
    lines: [
      {
        kind: "verified",
        text: "The repository is a monorepo: Next.js web and API apps, a Python pipeline, Supabase migrations, Dockerfiles, and GitHub Actions for CI, a secret scan, staging migrations, a manual production migration, and a scheduled health probe.",
      },
      {
        kind: "verified",
        text: "infra/terraform contains a README and a main file that declare no resources. Terraform is reserved there, not applied.",
      },
      {
        kind: "verified",
        text: "The web and API Dockerfiles start the Next.js dev server for local compose. The pipeline Dockerfile is a multi-stage Python image that runs Uvicorn. services/ai-pipeline/railway.toml points Railway at that Dockerfile and at /healthz. I am not claiming a Railway dashboard setting from that file alone.",
      },
      {
        kind: "verified",
        text: "docker-compose defines web, api, ai-pipeline, Postgres with pgvector, and Redis for local use.",
      },
      {
        kind: "observed",
        text: "On 19 Oct 2026, GET https://revenueroles.in/healthz and https://api.revenueroles.in/healthz returned HTTP 200 with server Vercel. The JSON said production and ok. The API payload said the AI pipeline was configured. That is one check, not an uptime figure.",
      },
      {
        kind: "proposed",
        text: "The empty Terraform root should stay empty until a resource is reviewed, or it should be removed so it is not mistaken for a live stack.",
      },
    ],
  },
  {
    id: "rie",
    title: "Revenue Intelligence Engine",
    href: "https://cashmaker-two.vercel.app",
    repo: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    lines: [
      {
        kind: "verified",
        text: "vercel.json describes a FastAPI service and a Next.js web app, with the web app receiving the API URL. I did not find a GitHub Actions workflow in that repository.",
      },
      {
        kind: "verified",
        text: "The Dockerfile is a single-stage Python 3.12 image that installs the project and also copies the tests. docker-compose runs the API with a SQLite file and the web app with npm run dev.",
      },
      {
        kind: "observed",
        text: "On 19 Oct 2026, https://cashmaker-two.vercel.app and https://revopy.vercel.app both returned HTTP 200. I did not verify from a dashboard that they are the same Vercel project.",
      },
      {
        kind: "proposed",
        text: "A production image would drop the tests and the dev server, and CI would build the same artifact the host runs.",
      },
    ],
  },
  {
    id: "agenyra",
    title: "AGENYRA",
    href: "https://agenyra.space",
    repo: "https://github.com/ayushrai-hub/AGENYRA_product",
    lines: [
      {
        kind: "verified",
        text: "The public site is Next.js. vercel.json sets the framework to Next.js and the region to bom1. A Supabase migration exists for the waitlist. Package scripts include build, lint, typecheck, and test. I did not find a Dockerfile or a GitHub Actions workflow in that repository.",
      },
      {
        kind: "observed",
        text: "On 19 Oct 2026, https://agenyra.space returned HTTP 200 with server Vercel.",
      },
      {
        kind: "proposed",
        text: "The checks in package.json are not a pipeline until a workflow runs them on each change.",
      },
    ],
  },
  {
    id: "spiderweb",
    title: "SpiderWeb",
    repo: "https://github.com/ayushrai-hub/SpiderWeb",
    lines: [
      {
        kind: "verified",
        text: "docker-compose runs Postgres with pgvector and Redis. The API Dockerfile is a multi-stage build that deploys production dependencies into a runner stage. GitHub Actions CI runs against Postgres and Redis service containers. The project record says it runs locally and has no production deployment. I am not claiming a registry push or a live host.",
      },
      {
        kind: "proposed",
        text: "If it ever leaves the laptop, the same image digest CI built should be the one that runs, with secrets outside the image.",
      },
    ],
  },
  {
    id: "open-framework",
    title: "The Open Framework",
    href: "https://the-open-frameworks.vercel.app",
    repo: "https://github.com/ayushrai-hub/the-open-framework",
    lines: [
      {
        kind: "verified",
        text: "vercel.json builds a Vite site and rewrites paths to index.html. I did not find a GitHub Actions workflow or a Dockerfile. The product record describes a front-end prototype with mock sign-in, not a verification backend.",
      },
      {
        kind: "observed",
        text: "On 19 Oct 2026, https://the-open-frameworks.vercel.app returned HTTP 200.",
      },
      {
        kind: "proposed",
        text: "Static hosting is the right weight for a prototype. It becomes the wrong weight when a private API and a database are actually required.",
      },
    ],
  },
  {
    id: "site",
    title: "This website",
    href: "https://www.ayushrai.site",
    repo: "https://github.com/ayushrai-hub/ayush-work",
    lines: [
      {
        kind: "verified",
        text: "Vite, React, and TypeScript. vercel.json and netlify.toml both exist. GitHub Actions runs lint, typecheck, coverage, build, and Playwright. The build prerenders HTML. There is no Dockerfile in this repository. Serverless functions under api/ handle the contact form and the read-only API.",
      },
      {
        kind: "observed",
        text: "On 19 Oct 2026, https://www.ayushrai.site returned HTTP 200 with server Vercel. The repository is also configured for Netlify. I did not inspect DNS beyond that response.",
      },
      {
        kind: "proposed",
        text: "A static prerender plus a few functions is enough for this site. A cluster would add ownership without a workload that needs it.",
      },
    ],
  },
  {
    id: "life",
    title: "Life blog",
    href: "https://life.ayushrai.site",
    repo: "https://github.com/ayushrai-hub/LifeOS",
    lines: [
      {
        kind: "verified",
        text: "The LifeOS vercel.json sets an empty build command, security headers, and rewrites for static files and API paths, including markdown negotiation. I did not treat that file as proof of a particular database or cluster.",
      },
      {
        kind: "observed",
        text: "On 19 Oct 2026, https://life.ayushrai.site returned HTTP 200 with server Vercel.",
      },
      {
        kind: "proposed",
        text: "Header and rewrite config should stay in the repo so a console click is not the only copy.",
      },
    ],
  },
];

/** Roadmap. Every stage is planned. */
export const cloudRoadmap = [
  {
    stage: "1",
    title: "Understand the existing system",
    status: "Planned",
    items: [
      "Map the architecture.",
      "Document dependencies.",
      "Verify environment configuration.",
      "Establish a repeatable deployment process.",
      "Identify critical failure paths.",
    ],
  },
  {
    stage: "2",
    title: "Automate delivery",
    status: "Planned",
    items: [
      "Add or improve CI checks.",
      "Automate builds.",
      "Validate configuration.",
      "Introduce release verification.",
      "Document rollback procedures.",
    ],
  },
  {
    stage: "3",
    title: "Improve reliability",
    status: "Planned",
    items: [
      "Add health checks.",
      "Standardize logs.",
      "Monitor errors and latency.",
      "Configure meaningful alerts.",
      "Test backup and recovery procedures.",
    ],
  },
  {
    stage: "4",
    title: "Strengthen security",
    status: "Planned",
    items: [
      "Audit access permissions.",
      "Remove unnecessary public exposure.",
      "Review secrets handling.",
      "Scan dependencies and container images where applicable.",
      "Document security-sensitive operations.",
    ],
  },
  {
    stage: "5",
    title: "Optimize cost and performance",
    status: "Planned",
    items: [
      "Measure resource utilization.",
      "Identify bottlenecks.",
      "Review logging and storage costs.",
      "Benchmark representative workloads.",
      "Optimize based on evidence.",
    ],
  },
  {
    stage: "6",
    title: "Introduce infrastructure as code",
    status: "Planned",
    items: [
      "Select an appropriate tool.",
      "Version infrastructure configuration.",
      "Review changes before applying them.",
      "Separate environments.",
      "Add drift detection and safe change management.",
    ],
  },
] as const;

/** Illustrative reliability language. Not a measured SLO. */
export const sloNote = {
  sli: "An SLI is a measurement, such as the share of health checks that succeed, or the p95 latency of one route.",
  slo: "An SLO is a target for that measurement over a window, such as 99% of health checks succeeding in 30 days. I am not publishing an SLO for any live site.",
  budget: "An error budget is the allowed failure inside that target. When it is gone, the useful move is to slow releases and fix reliability, not to add features on top.",
};

/** Target ids the deployment panel understands, with the labels from the lab. */
export const cloudDeployTargets: readonly { id: DeployTarget; label: string }[] = [
  { id: "managed", label: "Managed hosting" },
  { id: "container", label: "Containers" },
  { id: "kubernetes", label: "Kubernetes" },
];

/**
 * Markdown body for /pow/cloud-engineer.md.
 * Uses the same records as the page and says which parts are examples.
 */
export function renderCloudEngineerBody(): string {
  const principles = cloudPrinciples.map((item) => `- ${item}`).join("\n");
  const profiles = architectureProfiles
    .map(
      (profile) =>
        `### ${profile.name}\n\n${profile.summary}\n\n${profile.priority} ${profile.complexity}\n\nComponents: ${profile.components.map((item) => item.name).join(", ")}.`,
    )
    .join("\n\n");
  const cases = cloudCaseStudies
    .map((study) => {
      const lines = study.lines.map((line) => `- (${line.kind}) ${line.text}`).join("\n");
      return `### ${study.title}\n\n${lines}`;
    })
    .join("\n\n");
  const roadmap = cloudRoadmap
    .map((phase) => `### Stage ${phase.stage}. ${phase.title} (${phase.status})\n\n${phase.items.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");
  return [
    "I approach cloud engineering as a systems problem: deployment, networking, security, reliability, observability, and cost have to work together.",
    "",
    "The Cloud Operations Lab on this page is a local simulation of a fictional app called Fieldnote. It does not provision a cloud account. Reference architectures and sample prices are examples.",
    "",
    "## Principles",
    "",
    principles,
    "",
    "## Reference architectures",
    "",
    profiles,
    "",
    "## Projects",
    "",
    "Lines are marked verified (repository), observed (a check on 19 Oct 2026), or proposed (not done).",
    "",
    cases,
    "",
    "## Roadmap",
    "",
    roadmap,
    "",
    `${sloNote.sli} ${sloNote.slo} ${sloNote.budget}`,
  ].join("\n");
}
