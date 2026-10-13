#!/usr/bin/env node
/**
 * Zero-dependency command-line client for the public v1 REST API (search, projects, compare).
 *
 * Parses argv into a command, positionals, and flags, maps them to one `/api/v1/*` GET URL, fetches
 * it, and prints the JSON body. Exit codes: 0 success, 1 API error or non-JSON reply, 2 network
 * error, 64 usage error. Not published to npm.
 *
 * Connects to:
 * - packages/cli/package.json declares it as the `ayushrai` bin.
 * - src/__tests__/agentReadiness.test.ts imports parseArgs, buildRequest, and run, injecting fetch
 *   and output sinks.
 * - The v1 endpoints served by api/search.ts and api/projects.ts (default origin www.ayushrai.site).
 */
import { pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = "https://www.ayushrai.site";

const USAGE = `Usage: ayushrai <command> [options]

Read Ayush Rai's public portfolio API. Prints JSON.

Commands:
  search <query>            Lexical search over the site index
  projects                  List public projects, one page at a time
  project <slug>            Fetch one project
  compare <slug> <slug>...  Compare two to four projects

Options:
  --type <type>             Filter search by record type, or projects by project type
  --category <category>     Filter projects by category
  --limit <n>               Page size, 1 to 20
  --cursor <cursor>         nextCursor from the previous page
  --archive                 Include archived projects
  --base-url <url>          API origin (default ${DEFAULT_BASE_URL})
  --compact                 Print JSON on one line
  -h, --help                Show this help

Exit codes: 0 success, 1 API error, 2 network error, 64 usage error.
Docs: ${DEFAULT_BASE_URL}/developers/`;

const VALUE_FLAGS = new Set(["type", "category", "limit", "cursor", "base-url"]);
const BOOLEAN_FLAGS = new Set(["archive", "compact", "help"]);

/**
 * Splits argv into `{ command, args, flags }`. Accepts `--flag value`, `--flag=value`, and `-h`.
 * Throws UsageError for unknown options or a value flag with no value.
 */
export function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "-h") {
      flags.help = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const [name, inline] = arg.slice(2).split(/=(.*)/s, 2);
    if (BOOLEAN_FLAGS.has(name)) {
      flags[name] = true;
    } else if (VALUE_FLAGS.has(name)) {
      const value = inline ?? argv[++index];
      if (value === undefined) throw new UsageError(`--${name} needs a value.`);
      flags[name] = value;
    } else {
      throw new UsageError(`Unknown option --${name}.`);
    }
  }
  return { command: positionals[0], args: positionals.slice(1), flags };
}

/** Bad command-line input; run() turns it into usage text on stderr and exit code 64. */
class UsageError extends Error {}

/**
 * Returns the full GET URL for a command, applying only the flags that command supports.
 * Throws UsageError for an unknown command or the wrong number of positionals.
 */
export function buildRequest(command, args, flags) {
  const params = new URLSearchParams();
  const set = (key, value) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  };
  let path;
  switch (command) {
    case "search":
      if (args.length === 0) throw new UsageError("search needs a query.");
      path = "/api/v1/search";
      set("q", args.join(" "));
      set("type", flags.type);
      set("limit", flags.limit);
      set("cursor", flags.cursor);
      break;
    case "projects":
      path = "/api/v1/projects";
      set("category", flags.category);
      set("type", flags.type);
      set("limit", flags.limit);
      set("cursor", flags.cursor);
      if (flags.archive) set("archive", "1");
      break;
    case "project":
      if (args.length !== 1) throw new UsageError("project needs exactly one slug.");
      path = `/api/v1/projects/${encodeURIComponent(args[0])}`;
      if (flags.archive) set("archive", "1");
      break;
    case "compare":
      if (args.length < 2 || args.length > 4) throw new UsageError("compare needs two to four slugs.");
      path = "/api/v1/compare";
      set("slugs", args.join(","));
      if (flags.archive) set("archive", "1");
      break;
    default:
      throw new UsageError(command ? `Unknown command "${command}".` : "No command given.");
  }
  const base = (flags["base-url"] ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const query = params.toString();
  return `${base}${path}${query ? `?${query}` : ""}`;
}

/**
 * Runs one CLI invocation and resolves to its exit code instead of exiting the process.
 * `io` can replace `fetch`, `stdout`, and `stderr` for tests. API errors are printed to stderr
 * as JSON; a 429 also prints its Retry-After value.
 */
export async function run(argv, io = {}) {
  const fetchImpl = io.fetch ?? globalThis.fetch;
  const stdout = io.stdout ?? ((text) => process.stdout.write(text));
  const stderr = io.stderr ?? ((text) => process.stderr.write(text));

  let parsed;
  let url;
  try {
    parsed = parseArgs(argv);
    if (parsed.flags.help || parsed.command === "help") {
      stdout(`${USAGE}\n`);
      return 0;
    }
    url = buildRequest(parsed.command, parsed.args, parsed.flags);
  } catch (error) {
    if (!(error instanceof UsageError)) throw error;
    stderr(`${error.message}\n\n${USAGE}\n`);
    return 64;
  }

  let response;
  try {
    response = await fetchImpl(url, {
      headers: { Accept: "application/json", "User-Agent": "ayushrai-cli/1.0.0" },
    });
  } catch (error) {
    stderr(`Network error calling ${url}: ${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    stderr(`Expected JSON from ${url}, got HTTP ${response.status}.\n`);
    return 1;
  }
  const output = parsed.flags.compact ? JSON.stringify(body) : JSON.stringify(body, null, 2);
  if (!response.ok) {
    if (response.status === 429) {
      const retry = response.headers.get("retry-after");
      if (retry) stderr(`Rate limited. Retry after ${retry} seconds.\n`);
    }
    stderr(`${output}\n`);
    return 1;
  }
  stdout(`${output}\n`);
  return 0;
}

// Run only when executed directly, so tests can import the exports without side effects.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = await run(process.argv.slice(2));
}
