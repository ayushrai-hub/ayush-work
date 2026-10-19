/**
 * DevOps proof of work: the record behind /pow/devops-engineer and its Markdown twin.
 *
 * Delivery notes distinguish a file read in a public repository from a behavior this page only
 * simulates. The pipeline model lives in src/lib/devopsPipeline.ts. Counts of deploys, uptime,
 * incidents, and savings are omitted because they were not measured for this page.
 *
 * Connects to:
 * - src/pages/DevopsPowPage.tsx and src/components/devops/*.
 * - src/lib/agent/markdown.ts (`renderDevopsBody`), searchIndex.ts, and publicRoutes.ts.
 * - person.ts for the GitHub and LinkedIn URLs. Repository names below were listed with `gh` on 19 Oct 2026.
 */
import { person } from "./person";

/** Route for this page. Sibling proof-of-work routes stay in powPages.ts. */
export const DEVOPS_PATH = "/pow/devops-engineer";

/** Description shared by the page head, search, and the Markdown twin. */
export const devopsDescription =
  "Ayush Rai on DevOps: a local delivery workbench, plus what the public repositories actually automate. Simulations are labeled. Unmeasured uptime and incident history are left out.";

/** Hero and the two calls to action. */
export const devopsPow = {
  path: DEVOPS_PATH,
  title: "DevOps engineer proof of work",
  description: devopsDescription,
  name: person.name,
  headline: "I automate the path from code to reliable production.",
  dek: "I approach DevOps as an engineering discipline: automate repetitive work, make delivery reproducible, detect failures early, release safely, and make recovery predictable.",
  status:
    "This page is a deterministic simulation running in the browser. It does not deploy, call a CI provider, or read production credentials. A working demonstration here is not a claim of production operations experience.",
  primaryCta: { href: "#control-room", label: "Explore the Delivery Pipeline" },
  secondaryCta: { href: "#evidence", label: "Inspect My Engineering Work" },
} as const;

/** Principles shown under the hero. They are a working stance, not a list of certified controls. */
export const devopsPrinciples: readonly { id: string; title: string; body: string }[] = [
  {
    id: "automate",
    title: "Automation over repetitive manual work",
    body: "A release step that people retype will drift. Put the repeatable part in a workflow and keep the judgment where a person is still required.",
  },
  {
    id: "reproducible",
    title: "Reproducible builds",
    body: "The same revision and the same locked dependencies should be what the pipeline builds. I do not claim bit-for-bit reproducibility unless a build has been compared.",
  },
  {
    id: "feedback",
    title: "Fast feedback from CI",
    body: "Lint and unit tests belong close to the change. A slow or optional check that can fail the release has to be explicit about that.",
  },
  {
    id: "immutable",
    title: "Immutable release artifacts",
    body: "Build once, name the artifact, and promote that object. Rebuilding per environment is a way to ship something you did not test.",
  },
  {
    id: "safe",
    title: "Safe deployments",
    body: "A deploy needs a gate, a health check, and a way back. The strategy depends on compatibility and how much extra infrastructure you can carry.",
  },
  {
    id: "versioned",
    title: "Infrastructure and configuration under version control",
    body: "If the change is not in a repository, the next person cannot review it. A directory reserved for Terraform is not the same thing as resources under management.",
  },
  {
    id: "observable",
    title: "Observable systems",
    body: "A health endpoint and a log line are the start. They are not a service level, and this page does not invent one.",
  },
  {
    id: "recovery",
    title: "Tested recovery procedures",
    body: "Rollback is a procedure you can rehearse. An application rollback does not automatically undo a schema change.",
  },
  {
    id: "security",
    title: "Security throughout the delivery lifecycle",
    body: "Least privilege, locked dependencies, and secret references belong in the workflow. A scan that cannot fail the job is a report, not a gate.",
  },
  {
    id: "evidence",
    title: "Continuous improvement based on evidence",
    body: "Change the pipeline because a failure or a measurement said so. This page does not supply deployment frequency or an error budget.",
  },
];

/** Jump nav, in page order. */
export const devopsSections: readonly { id: string; label: string }[] = [
  { id: "principles", label: "Principles" },
  { id: "control-room", label: "Control room" },
  { id: "pipeline", label: "Pipeline" },
  { id: "actions", label: "GitHub Actions" },
  { id: "artifacts", label: "Artifacts" },
  { id: "containers", label: "Containers" },
  { id: "strategies", label: "Strategies" },
  { id: "gates", label: "Gates and rollback" },
  { id: "evidence", label: "Repositories" },
  { id: "limits", label: "Limits" },
];

/** Named changes for the control room. Failure ids match pipeline stage ids. */
export const devopsChanges: readonly {
  id: string;
  title: string;
  summary: string;
  failing: Record<string, boolean>;
}[] = [
  {
    id: "copy",
    title: "Copy fix on a docs page",
    summary: "A small change with no injected failure. The simulated path can reach a release.",
    failing: {},
  },
  {
    id: "lint",
    title: "Lint regression",
    summary: "Static checks fail. The build is not allowed to start.",
    failing: { lint: true },
  },
  {
    id: "tests",
    title: "Failing unit test",
    summary: "The unit suite fails. No artifact is promoted.",
    failing: { unit: true },
  },
  {
    id: "advisory",
    title: "Dependency advisory",
    summary: "The security stage fails. With the block policy, deploy does not start.",
    failing: { security: true },
  },
  {
    id: "config",
    title: "Missing runtime configuration",
    summary: "Earlier checks pass. Deploy stops because required configuration is absent.",
    failing: { deploy: true },
  },
  {
    id: "smoke",
    title: "Smoke test failure",
    summary: "The candidate deploys, smoke tests fail, and the simulator marks a rollback.",
    failing: { smoke: true },
  },
];

/** Why the waves are ordered the way they are. */
export const pipelineOrderNotes: readonly string[] = [
  "Checkout and dependency installation are sequential. Nothing else has a revision or a lockfile until they finish.",
  "Lint, unit tests, and security checks share the next wave. They need the install and they do not need each other, so they can run together.",
  "Integration tests wait for unit tests. If you leave them enabled, the build waits for them too.",
  "The build waits for lint and unit tests. A lint failure or a test failure blocks it. The artifact is created only from a build that ran.",
  "Artifact validation, when enabled, sits between the artifact and deploy. Deploy also waits for a blocking security failure.",
  "Smoke tests run only after deploy. Release verification waits for them when they are enabled. A smoke failure rejects the release.",
];

/** Sample manifest. Every field is synthetic and labeled on the page. */
export const sampleManifest = {
  application: "sample-web",
  version: "1.5.0",
  revision: "a1b2c3d",
  buildConfig: "pipeline-config@4",
  lockfile: "present",
  buildResult: "simulated pass",
  artifactId: "sha256:sample-not-a-real-digest",
  created: "not created — this manifest is synthetic",
} as const;

/** What a traceable release is made of, in the order a visitor inspects them. */
export const artifactLayers: readonly { id: string; title: string; body: string }[] = [
  {
    id: "source",
    title: "Source code",
    body: "The revision the pipeline checked out. A release that cannot name this revision cannot be rebuilt or audited.",
  },
  {
    id: "dependencies",
    title: "Dependencies",
    body: "Libraries resolved for that build. A lockfile pins the set. Pinning a range in a manifest is weaker than locking the resolved tree.",
  },
  {
    id: "config",
    title: "Build configuration",
    body: "The workflow, toolchain versions, and build flags. Changing them can change the artifact even when the application source did not.",
  },
  {
    id: "artifact",
    title: "Build artifact",
    body: "The output of one build: a bundle, a package, or an image. Promotion should ship this object onward.",
  },
  {
    id: "image",
    title: "Container image",
    body: "One way to package an artifact. It is not the application itself. An image tag that moves, such as latest, hides which build you are running.",
  },
  {
    id: "version",
    title: "Release version",
    body: "The name people use for a promoted artifact. The version should point at one revision and one build, not at whatever the branch tip is today.",
  },
];

/** Supply-chain notes that stay qualitative. */
export const supplyChainNotes: readonly { title: string; body: string }[] = [
  {
    title: "Dependency pinning and lockfiles",
    body: "Install with the lockfile (`npm ci`, `pnpm install --frozen-lockfile`, or the equivalent) so CI does not resolve a newer tree than the one you reviewed.",
  },
  {
    title: "Reproducible builds",
    body: "A reproducible build can be repeated from the same inputs. I have not run a bit-for-bit comparison of any artifact in these repositories, so this page does not claim that.",
  },
  {
    title: "Immutable artifacts and promotion",
    body: "Build once. Promote the same artifact from the test environment to staging and production. Rebuilding in each environment is how configuration and dependency drift sneak in.",
  },
  {
    title: "Software bills of materials and integrity",
    body: "An SBOM lists what is inside the artifact. A digest lets a later stage check it was not swapped. Neither is generated by this page.",
  },
  {
    title: "Supply-chain security",
    body: "Least-privilege workflow tokens, pinned actions, and a review before a secret is used are the practical controls. A sample workflow below follows that shape and is not installed anywhere.",
  },
];

/** Container lifecycle the lab walks, in order. */
export const containerPhases = [
  "Source",
  "Image build",
  "Image validation",
  "Security scan",
  "Registry publication",
  "Deployment",
  "Health check",
] as const;

/** Hypothetical container failures and the pipeline reaction. None of these were executed. */
export const containerScenarios: readonly {
  id: string;
  title: string;
  phase: (typeof containerPhases)[number];
  reaction: string;
}[] = [
  {
    id: "build",
    title: "Image build fails",
    phase: "Image build",
    reaction: "Stop. Do not publish a tag. The previous image, if one exists, keeps serving.",
  },
  {
    id: "dependency",
    title: "A required dependency is missing",
    phase: "Image build",
    reaction: "The build fails closed. Adding the dependency belongs in the image or the lockfile, not as a manual step on the server.",
  },
  {
    id: "pull",
    title: "The image cannot be pulled",
    phase: "Deployment",
    reaction: "Leave the running version in place. A deploy that cannot fetch the candidate is a failed deploy, not a partial success.",
  },
  {
    id: "env",
    title: "A runtime environment variable is absent",
    phase: "Deployment",
    reaction: "Refuse to start the new process. Missing configuration is a failed release gate, which the pipeline builder models on the deploy stage.",
  },
  {
    id: "health",
    title: "The health check fails",
    phase: "Health check",
    reaction: "Do not widen traffic. Roll back or leave the previous version serving, then treat the candidate as rejected.",
  },
  {
    id: "restart",
    title: "The process restarts repeatedly",
    phase: "Health check",
    reaction: "Stop the rollout. A crash loop is an unhealthy release even if the image pulled. Investigate logs before the next attempt.",
  },
];

/** Container concepts explained beside the lab. */
export const containerNotes: readonly { title: string; body: string }[] = [
  {
    title: "Images and containers",
    body: "An image is the built filesystem and start command. A container is a running instance of an image. Building an image does not deploy it.",
  },
  {
    title: "Build context",
    body: "The context is the set of files sent to the build. A context that includes secrets or a huge repository makes the build slower and riskier.",
  },
  {
    title: "Multi-stage builds",
    body: "One stage can install toolchains and another can copy only the runtime output. That keeps compilers out of the image you run.",
  },
  {
    title: "Tagging",
    body: "A tag should name an immutable build. Moving tags such as latest are convenient and ambiguous.",
  },
  {
    title: "Non-root execution",
    body: "A process that does not need root should not run as root. The SpiderWeb API Dockerfile sets a user. The RevenueRoles worker Dockerfile I read does not.",
  },
  {
    title: "Scanning, registries, and runtime configuration",
    body: "Scan before publish. Authenticate the registry with a short-lived credential, not a token baked into the image. Runtime configuration arrives as environment or mounts, not as a rebuilt image per environment.",
  },
  {
    title: "Health checks and shutdown",
    body: "A health check tells the platform whether the process should receive traffic. A graceful shutdown handles the signal, finishes or drops in-flight work, and exits. This page does not run either.",
  },
];

/** Comparison rows. Levels are assumptions for the hypothetical, not measurements. */
export const strategyCriteria = [
  "Downtime risk",
  "Infrastructure overhead",
  "Rollback complexity",
  "Compatibility requirements",
  "Monitoring requirements",
  "Operational complexity",
] as const;

/** Deployment strategies. None of these is claimed as the method used by a live project. */
export const deploymentStrategies: readonly {
  id: string;
  name: string;
  summary: string;
  assumption: string;
  scores: Record<(typeof strategyCriteria)[number], string>;
}[] = [
  {
    id: "rolling",
    name: "Rolling deployment",
    summary:
      "Replace instances gradually. Old and new versions serve at the same time, so they have to tolerate each other and the shared database.",
    assumption: "Assumes more than one instance and a load balancer that can drain connections.",
    scores: {
      "Downtime risk": "Low, if capacity remains while an instance is replaced",
      "Infrastructure overhead": "Low beyond the spare capacity for the overlap",
      "Rollback complexity": "Medium — roll forward or back while versions overlap",
      "Compatibility requirements": "High — adjacent versions share traffic and data",
      "Monitoring requirements": "Medium — watch errors during the overlap",
      "Operational complexity": "Medium",
    },
  },
  {
    id: "blue-green",
    name: "Blue-green deployment",
    summary:
      "Keep two environments and switch traffic after the idle one is verified. The idle environment costs money even when it is not serving.",
    assumption: "Assumes you can run a second full copy and that the switch is a routing change.",
    scores: {
      "Downtime risk": "Low at the switch, if the idle side is already healthy",
      "Infrastructure overhead": "High — two environments",
      "Rollback complexity": "Low for the application — switch routing back",
      "Compatibility requirements": "High for the database — a migration still has one schema",
      "Monitoring requirements": "Medium — verify the idle side before the switch",
      "Operational complexity": "Medium",
    },
  },
  {
    id: "canary",
    name: "Canary deployment",
    summary:
      "Send a small share of traffic to the new version, watch it, then widen or stop. The stop condition has to be decided before the rollout.",
    assumption: "Assumes traffic can be split and that the sample is large enough to notice a failure.",
    scores: {
      "Downtime risk": "Low for the majority of traffic",
      "Infrastructure overhead": "Medium — both versions run during the split",
      "Rollback complexity": "Low if the split can be set back to zero",
      "Compatibility requirements": "High — both versions write the same data",
      "Monitoring requirements": "High — the canary needs its own error and latency view",
      "Operational complexity": "High",
    },
  },
  {
    id: "flags",
    name: "Feature flags",
    summary:
      "Deploy the code dark, then turn the behavior on. The flag is not a deploy strategy by itself. Old flags that nobody removes become a second product.",
    assumption: "Assumes the unsafe behavior defaults off and that flag state is visible.",
    scores: {
      "Downtime risk": "Low for activation, separate from the deploy's own risk",
      "Infrastructure overhead": "Low, plus whatever stores the flag",
      "Rollback complexity": "Low if turning the flag off is enough",
      "Compatibility requirements": "Medium — both paths remain in the binary",
      "Monitoring requirements": "Medium — compare the on and off paths",
      "Operational complexity": "Medium, and it grows with forgotten flags",
    },
  },
  {
    id: "recreate",
    name: "Recreate deployment",
    summary:
      "Stop the old version, then start the new one. There is a gap. The procedure is simple, which is sometimes the right trade when the gap is acceptable.",
    assumption: "Assumes a maintenance window or a workload that can be down for the swap.",
    scores: {
      "Downtime risk": "High — the gap is the strategy",
      "Infrastructure overhead": "Low",
      "Rollback complexity": "Medium — start the previous artifact again",
      "Compatibility requirements": "Low during the swap, because only one version runs",
      "Monitoring requirements": "Low beyond the health check after start",
      "Operational complexity": "Low",
    },
  },
];

/** Illustrative GitHub Actions workflow. It is not committed to any repository by this page. */
export const proposedWorkflowYaml = `name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

concurrency:
  group: ci-\${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: verify
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    permissions:
      contents: read
    steps:
      - run: echo "Proposed only. This workflow is not installed."
`;

/** How to read the proposed workflow. */
export const workflowLessons: readonly { title: string; body: string }[] = [
  {
    title: "push and pull_request",
    body: "Pull requests get the verify job. The deploy job's if condition limits it to a push of main, so a pull request cannot take the production path.",
  },
  {
    title: "Job dependencies",
    body: "deploy needs verify. GitHub will not start it when verify fails.",
  },
  {
    title: "Cache keys",
    body: "setup-node with cache: npm keys the cache from the lockfile. A lockfile change misses the cache on purpose.",
  },
  {
    title: "Artifacts and test reports",
    body: "This example does not upload an artifact. A real workflow should upload the built output it intends to promote, and upload test reports when the job fails if someone needs them.",
  },
  {
    title: "Environment protection and approvals",
    body: "environment: production is a request to use that GitHub environment. Protection rules, including required reviewers, are configured on the environment. Naming the environment in YAML does not prove the rules exist.",
  },
  {
    title: "Concurrency",
    body: "cancel-in-progress keeps one verify run per ref. The RevenueRoles deploy workflows I read set cancel-in-progress to false so a production migrate is not cancelled by a second push.",
  },
  {
    title: "Secrets and permissions",
    body: "The example grants contents: read and does not echo a secret. A secret is passed through the secrets context into an environment variable at the step that needs it. It is not written into the repository.",
  },
];

/** One repository inspection. `verified` means I read the file. `absent` means the path was not in the tree. */
export interface DeliveryFinding {
  id: string;
  name: string;
  href: string;
  live?: string;
  verdict: string;
  found: readonly string[];
  absent: readonly string[];
}

/**
 * Findings from public repositories on 19 Oct 2026.
 * Workflow bodies were read with the GitHub API. I did not re-run the pipelines.
 */
export const deliveryFindings: readonly DeliveryFinding[] = [
  {
    id: "site",
    name: "This site (ayush-work)",
    href: "https://github.com/ayushrai-hub/ayush-work",
    live: person.siteUrl,
    verdict: "Verified workflow",
    found: [
      ".github/workflows/tests.yml runs on push and pull_request to main. It checks out the repo, sets up Node 22 with the npm cache, runs npm ci, lint, typecheck, unit tests with coverage, the production build, and Playwright.",
      "package-lock.json is the JavaScript lockfile. netlify.toml and vercel.json are the host configs. Merging to main is what deploys.",
      "The repository documents GA4 and Vercel Analytics. This page does not publish traffic numbers.",
    ],
    absent: [
      "No Dockerfile and no Terraform files in this repository.",
      "The tests workflow does not set a permissions block, does not upload a build artifact, and does not deploy by itself.",
    ],
  },
  {
    id: "revenueroles",
    name: "RevenueRoles",
    href: "https://github.com/ayushrai-hub/RevenueRoles",
    live: "https://revenueroles.in/",
    verdict: "Verified workflows, images, and a Terraform stub",
    found: [
      "CI (ci.yml) on pull_request and push to main, with concurrency that cancels an in-progress run for the same ref. Jobs: TypeScript (pnpm 9.15.0, Node 22, frozen lockfile, typecheck, lint, web and API builds, API tests), Python (uv, ruff, mypy, pytest), E2E smoke after the TypeScript job, migration and RLS checks, a worker Docker build, and ops unit tests.",
      "The worker job runs docker build for services/ai-pipeline and curls http://127.0.0.1:18000/healthz. I did not see a registry push in that job.",
      "Deploy Staging runs on push to main and workflow_dispatch. It waits for the TypeScript check, then uses the staging environment, the Supabase CLI, and scripts/smoke-deploy.sh. Secrets are referenced as SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF, and SUPABASE_DB_PASSWORD. URLs come from vars.STAGING_WEB_URL, STAGING_API_URL, and STAGING_WORKER_URL.",
      "Deploy Production is workflow_dispatch only. The confirm input must be the word deploy. Jobs use the production environment and the same smoke script with PRODUCTION_* variables.",
      "scheduled-health.yml is a cron every 6 hours plus workflow_dispatch. It GETs https://revenueroles.in/healthz and the API healthz URLs. I did not read run history, so I am not claiming the schedule succeeds.",
      "security.yml runs ops tests, a secret-pattern scan, and pnpm audit --prod || true. The || true means a non-zero audit does not fail that step.",
      "pnpm-lock.yaml and uv.lock are present. Dockerfiles exist for the web app, the API, and the AI pipeline. The worker Dockerfile is multi-stage (Python 3.12, uv) and the file I read does not set a USER. The web Dockerfile I read starts next dev for compose.",
      "apps/web and apps/api have healthz routes. scripts/ops/commands/health.mjs and the pipeline's test_health.py are in the tree.",
      "infra/terraform/main.tf states that it declares no resources. The README says Terraform is not required for the MVP skeleton.",
    ],
    absent: [
      "No measured deploy frequency, uptime, or incident count.",
      "The environments API on 19 Oct 2026 listed Production and Preview environments with empty protection_rules. The workflow requests environment names staging and production. An empty rule list is not a reviewer gate, and a differently cased name may be a different environment.",
    ],
  },
  {
    id: "engine",
    name: "Revenue Intelligence Engine",
    href: "https://github.com/ayushrai-hub/REVENUE-INTELLIGENCE-ENGINE",
    live: "https://revopy.vercel.app/",
    verdict: "Dockerfile and Compose present. No Actions workflow directory.",
    found: [
      "Dockerfile is a single stage from python:3.12-slim. It copies the app, data, and tests, pip-installs the project, and starts uvicorn on port 8000. The file has no USER and no HEALTHCHECK.",
      "docker-compose.yml defines an api service built from that file and a web service that runs npm run dev from a node:22-alpine image. The API uses a sqlite URL in the compose file.",
      "vercel.json is present. pyproject.toml and web/package-lock.json are the lockfiles I found. app/workflows is application code, not GitHub Actions.",
    ],
    absent: [
      "The .github/workflows path returned 404, which is what the contents API does when the directory is missing.",
      "I did not build or push the image.",
    ],
  },
  {
    id: "agenyra",
    name: "AGENYRA",
    href: "https://github.com/ayushrai-hub/AGENYRA_product",
    live: "https://agenyra.space/",
    verdict: "Host config only, in the files I listed.",
    found: [
      "vercel.json sets the framework to Next.js and the region to bom1. pnpm-lock.yaml is present.",
      "The GitHub homepage field points at agenyra-product.vercel.app. The product URL used on this site is agenyra.space. I did not inspect that host's deploy logs.",
    ],
    absent: [
      "No .github/workflows directory and no Dockerfile in the recursive tree listing.",
    ],
  },
  {
    id: "spiderweb",
    name: "SpiderWeb",
    href: "https://github.com/ayushrai-hub/SpiderWeb",
    verdict: "Verified CI and Dockerfiles. The CI file does not build the images.",
    found: [
      "ci.yml runs on push to main and on pull_request, with cancel-in-progress concurrency. The verify job starts Postgres (pgvector) and Redis as service containers, installs with pnpm's frozen lockfile on Node 20, migrates, typechecks, lints, checks formatting, tests, and builds. The e2e job needs verify and uploads the Playwright report only when it fails, for 7 days.",
      "apps/api/Dockerfile is multi-stage. The runner stage adds an app user, copies the deployed output as that user, and defines a HEALTHCHECK against /health. apps/web and the ingestion worker also have Dockerfiles. docker-compose.yml is in the repository.",
      "pnpm-lock.yaml is present. The API has a health route.",
    ],
    absent: [
      "The CI workflow I read does not run docker build and does not push an image.",
      "No live URL is recorded on the project homepage field I read.",
    ],
  },
  {
    id: "framework",
    name: "The Open Framework",
    href: "https://github.com/ayushrai-hub/the-open-framework",
    live: "https://the-open-framework.vercel.app/",
    verdict: "Vercel config and an npm lockfile. No Actions workflow in the tree.",
    found: [
      "vercel.json builds with npm run build, publishes dist, and rewrites paths to index.html. package-lock.json is present.",
    ],
    absent: [
      "No .github/workflows directory and no Dockerfile in the recursive tree listing.",
    ],
  },
  {
    id: "life",
    name: "LifeOS",
    href: "https://github.com/ayushrai-hub/LifeOS",
    live: "https://life.ayushrai.site/",
    verdict: "Verified content workflows. The live site is the archive linked from this portfolio; I did not read its deploy logs.",
    found: [
      "currently-reading.yml runs on push and pull_request when the reading data, the build script, or the reading site changes. It runs node scripts/build-reading.js --check.",
      "publish-sdk.yml runs on workflow_dispatch and on a published GitHub release. It references NPM_TOKEN and PYPI_TOKEN. Both publish steps set continue-on-error, so a failed publish does not fail the job.",
      "package-lock.json and vercel.json are present. vercel.json sets an empty build command and clean URLs.",
    ],
    absent: [
      "sites/domains/kubernetes is a content page in the repository, not a cluster I found.",
      "No Dockerfile turned up in the filtered tree listing.",
    ],
  },
];

/** What the page refuses to imply. */
export const devopsLimits: readonly string[] = [
  "The control room, pipeline, container lab, strategy comparison, and release gates are local simulations. Logs, waves, versions, and the sample error rule are illustrative.",
  "I did not re-run GitHub Actions, build an image, or push a tag while making this page.",
  "I am not publishing deployment frequency, uptime, release duration, cost, team size, customer impact, or an incident narrative.",
  "A GitHub environment name in a workflow is not proof of required reviewers. The RevenueRoles environments I listed had no protection rules in the API response.",
  "Terraform in RevenueRoles reserves a directory and declares no resources.",
  "An audit step that ends in || true does not block a release.",
  "Application rollback and database rollback are different. Restoring the previous artifact does not reverse a migration that already ran.",
];

/** Verification steps shown after a simulated rollback. They are a checklist, not a log of a real rollback. */
export const rollbackChecks: readonly string[] = [
  "Confirm the serving revision matches the last approved artifact, not the candidate.",
  "Hit the health check for that revision.",
  "Run the smoke path against the restored revision.",
  "Read the error rate against the sample threshold. This page has no live metric.",
  "Leave the failed candidate immutable so it can be inspected. Do not rebuild it under the same digest.",
  "If a migration ran, treat the schema separately. Shipping the old application onto a new schema can be its own incident.",
];

/**
 * Markdown body for /pow/devops-engineer.md.
 * Generated from the same records the page renders.
 */
export function renderDevopsBody(): string {
  const findings = deliveryFindings
    .map((finding) => {
      const live = finding.live ? `Live site: ${finding.live}. ` : "";
      return [
        `### ${finding.name}`,
        "",
        `${finding.verdict} ${live}Repository: ${finding.href}.`,
        "",
        ...finding.found.map((line) => `- ${line}`),
        "",
        "Not found, or not claimed:",
        "",
        ...finding.absent.map((line) => `- ${line}`),
      ].join("\n");
    })
    .join("\n\n");

  return [
    devopsPow.headline,
    "",
    devopsPow.dek,
    "",
    devopsPow.status,
    "",
    "## Principles",
    "",
    ...devopsPrinciples.map((item) => `- **${item.title}.** ${item.body}`),
    "",
    "## DevOps Control Room",
    "",
    "The control room is a browser simulation of one fictional change moving through checkout, tests, build, security, artifact, deploy, smoke tests, and verification. A failed mandatory stage blocks a successful release. Every log line is illustrative.",
    "",
    "## Pipeline",
    "",
    ...pipelineOrderNotes.map((line) => `- ${line}`),
    "",
    "## GitHub Actions",
    "",
    "Verified workflows are summarized from the repositories below. The YAML example on the page is proposed and is not installed.",
    "",
    ...workflowLessons.map((item) => `- **${item.title}.** ${item.body}`),
    "",
    "## Artifacts",
    "",
    `The sample manifest names ${sampleManifest.application} ${sampleManifest.version} at revision ${sampleManifest.revision}. It is synthetic. ${sampleManifest.created}.`,
    "",
    ...supplyChainNotes.map((item) => `- **${item.title}.** ${item.body}`),
    "",
    "## Containers",
    "",
    ...containerNotes.map((item) => `- **${item.title}.** ${item.body}`),
    "",
    "## Deployment strategies",
    "",
    "These comparisons use hypothetical assumptions. I am not claiming that a listed project runs rolling, blue-green, canary, flag, or recreate deploys.",
    "",
    ...deploymentStrategies.map((item) => `- **${item.name}.** ${item.summary} ${item.assumption}`),
    "",
    "## Release gates and rollback",
    "",
    "A mandatory failing gate blocks promotion of the synthetic candidate. Rollback returns the sample to the last approved version name. Restoring an application artifact does not reverse a database migration.",
    "",
    "## Repository evidence",
    "",
    findings,
    "",
    "## Limits",
    "",
    ...devopsLimits.map((line) => `- ${line}`),
    "",
    `- GitHub: ${person.primaryProfiles.github}`,
    `- LinkedIn: ${person.primaryProfiles.linkedin}`,
    `- Site: ${person.siteUrl}`,
  ].join("\n");
}
