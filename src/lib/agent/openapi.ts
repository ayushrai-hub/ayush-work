/**
 * The OpenAPI 3.1 document for the public REST API, served as `/openapi.json`.
 *
 * Enums and limits come from the code that enforces them (search types, project categories and
 * types, rate-limit numbers, error codes), so the spec follows the implementation. The policy
 * notes exported here are reused word for word on the `/developers` page.
 *
 * Connects to:
 * - `surfaces.ts` `agentFiles()` writes `openapi.json`; `vitePlugin.ts` serves it in dev and preview.
 * - `developerDocs.ts` imports `API_ACCESS_NOTE`, `API_RATE_LIMIT_NOTE`, and `API_VERSIONING_POLICY`.
 * - Tested in `src/__tests__/agentSurfaces.test.ts` and `agentReadiness.test.ts`.
 * - Depends on `src/content` (`person`, project label maps), `apiError.ts`, `mcpCard.ts`,
 *   `rateLimit.ts`, and `search.ts`.
 */
import { person, projectCategoryLabels, projectTypeLabels } from "../../content";
import type { ApiErrorCode } from "./apiError";
import { SERVER_CARD_CONTENT_TYPE, SERVER_CARD_PATH, SERVER_CARD_SCHEMA } from "./mcpCard";
import { RATE_LIMIT_QUOTA, RATE_LIMIT_WINDOW_SECONDS } from "./rateLimit";
import { SEARCH_MAX_QUERY, SEARCH_TYPES } from "./search";

/** Versioning and deprecation policy text, shared with the developer docs. */
export const API_VERSIONING_POLICY =
  "Versioned in the URL path. /api/v1 is stable: fields may be added, but none are removed or renamed. Breaking changes ship under a new path such as /api/v2. A replaced version keeps working for at least 90 days; during that window its responses carry Deprecation and Sunset headers and a Link with rel=\"successor-version\", and the dates are listed on /developers. The unversioned /api/search and /api/projects are aliases of v1 and follow the same policy. No version is deprecated today.";

/** Access and caching note, shared with the developer docs. */
export const API_ACCESS_NOTE =
  "Free and public. No account or API key is needed because the read endpoints serve published content. /api/sandbox/v1/* is an alias of those reads: the same records, no separate dataset, and no write, so a call there cannot change live data. There is no paid tier. Clients may cache responses for five minutes. REST responses grant CORS only to the site's own origins, so call the REST API from a server, an agent, or the CLI rather than from a browser page on another site. The MCP endpoints and their Server Cards allow any origin.";

/** Rate-limit note built from the constants in `rateLimit.ts`, shared with the developer docs. */
export const API_RATE_LIMIT_NOTE = `${RATE_LIMIT_QUOTA} requests per ${RATE_LIMIT_WINDOW_SECONDS} seconds per client address, counted per server instance. Every response carries RateLimit-Policy and RateLimit headers (draft-ietf-httpapi-ratelimit-headers-11). Over the limit, the API returns 429 with a Retry-After header in seconds and error code rate_limited.`;

/** Enum for `ErrorResponse.error.code`. Must list every `ApiErrorCode`; the type does not enforce completeness. */
const ERROR_CODES: ApiErrorCode[] = [
  "invalid_query",
  "invalid_slug",
  "invalid_filter",
  "invalid_compare",
  "invalid_cursor",
  "not_found",
  "route_not_found",
  "method_not_allowed",
  "rate_limited",
  "idempotency_conflict",
  "internal_error",
];

/** `application/json` content object that references a component schema by name. */
const json = (ref: string) => ({ "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } });

/** RateLimit header references used by the 200, 400, 404, and 429 responses. */
const rateLimitHeaders = {
  RateLimit: { $ref: "#/components/headers/RateLimit" },
  "RateLimit-Policy": { $ref: "#/components/headers/RateLimitPolicy" },
};

/** A 200 response with rate-limit headers and a JSON body of the named schema. */
function ok(description: string, schema: string) {
  return { "200": { description, headers: rateLimitHeaders, content: json(schema) } };
}

/** `/ask` 200: NLWeb JSON by default, or SSE frames when streaming was requested. */
function askOk() {
  return {
    "200": {
      description:
        "NLWeb conversational_search answer or failure. With streaming, text/event-stream frames: start (_meta.streaming true), result ({ index, item }) per hit or error, then complete.",
      headers: rateLimitHeaders,
      content: {
        ...json("AskResponse"),
        "text/event-stream": { schema: { type: "string" } },
      },
    },
  };
}

type ErrorStatus = "400" | "404" | "405" | "409" | "429" | "500";

/** Description and headers for each REST error status. Bodies are always `ErrorResponse`. */
const REST_ERRORS: Record<ErrorStatus, { description: string; headers: Record<string, unknown> }> = {
  "400": {
    description:
      "Invalid query, filter, slug, cursor, or compare list. error.code is one of invalid_query, invalid_slug, invalid_filter, invalid_compare, invalid_cursor.",
    headers: rateLimitHeaders,
  },
  "404": {
    description: "Unknown or archived slug. error.code is not_found.",
    headers: rateLimitHeaders,
  },
  "405": {
    description:
      "Unsupported HTTP method. error.code is method_not_allowed. Read routes accept GET, HEAD, and OPTIONS. POST is accepted on /api/v1/batch and /ask.",
    headers: rateLimitHeaders,
  },
  "409": {
    description: "Idempotency-Key was reused with a different body. error.code is idempotency_conflict.",
    headers: rateLimitHeaders,
  },
  "429": {
    description: "Rate limit exceeded. error.code is rate_limited.",
    headers: { ...rateLimitHeaders, "Retry-After": { $ref: "#/components/headers/RetryAfter" } },
  },
  "500": {
    description: "Unexpected server fault, not a problem with the request. error.code is internal_error.",
    headers: rateLimitHeaders,
  },
};

/** `/ask` error statuses. Bodies use the NLWeb failure shape (`AskResponse` with `error`). */
const ASK_ERRORS: Partial<Record<ErrorStatus, string>> = {
  "400": "POST body is not JSON. _meta.response_type is failure; error.code is invalid_query.",
  "405": "Unsupported HTTP method. error.code is method_not_allowed. /ask accepts GET, HEAD, and POST.",
  "429": "Rate limit exceeded. error.code is rate_limited.",
};

/**
 * Inline error responses for one operation, each with a typed JSON body. Only list statuses the
 * handler can actually return.
 */
function errors(statuses: ErrorStatus[], schema: "ErrorResponse" | "AskResponse" = "ErrorResponse") {
  return Object.fromEntries(
    statuses.map((status) => {
      const rest = REST_ERRORS[status];
      const description = schema === "AskResponse" ? (ASK_ERRORS[status] ?? rest.description) : rest.description;
      return [status, { description, headers: rest.headers, content: json(schema) }];
    }),
  );
}

const cursorParameter = {
  name: "cursor",
  in: "query",
  required: false,
  description: "Opaque nextCursor from the previous page. Omit for the first page.",
  schema: { type: "string" },
};

/** Marks a response as the sandbox alias. The records stay the published ones. */
const environmentParameter = {
  name: "environment",
  in: "query",
  required: false,
  description: "Pass sandbox to receive X-Api-Environment: sandbox. The body is the same public record.",
  schema: { type: "string", enum: ["sandbox"] },
};

/** Optional replay key for POST /api/v1/batch and POST /api/send-email. */
const idempotencyParameter = {
  name: "Idempotency-Key",
  in: "header",
  required: false,
  description:
    "Optional client key, at most 128 characters. The same key and body replay the stored success. The same key with a different body returns 409.",
  schema: { type: "string", maxLength: 128 },
};

const archiveParameter = {
  name: "archive",
  in: "query",
  required: false,
  description: "Pass 1 to include archived projects.",
  schema: { type: "string", enum: ["1"] },
};

/** GET operation for a search path; used for both `/api/v1/search` and its `/api/search` alias. */
function searchOperation(operationId: string, summary: string) {
  return {
    get: {
      operationId,
      summary,
      description:
        "Lexical match on title, then tags or type, then summary. Ties keep content order. This is not semantic search. An empty q returns the same default slice as the on-site search dialog. Page with cursor and nextCursor.",
      parameters: [
        {
          name: "q",
          in: "query",
          required: false,
          schema: { type: "string", maxLength: SEARCH_MAX_QUERY },
        },
        {
          name: "type",
          in: "query",
          required: false,
          schema: { type: "string", enum: [...SEARCH_TYPES] },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Page size. Defaults to 12 with a query and 8 without.",
          schema: { type: "integer", minimum: 1, maximum: 20 },
        },
        cursorParameter,
      ],
      responses: {
        ...ok("Matching public records", "SearchResponse"),
        ...errors(["400", "405", "429", "500"]),
      },
    },
  };
}

/**
 * The full OpenAPI 3.1 document: search, projects, compare, and Server Card paths with shared
 * components. `/api/mcp` itself is only described in `info.description`, because it is JSON-RPC
 * over POST rather than REST.
 */
export function buildOpenApiDocument() {
  const origin = person.siteUrl.replace(/\/$/, "");
  const categories = Object.keys(projectCategoryLabels);
  const projectTypes = Object.keys(projectTypeLabels);
  /** Filters and paging shared by `/api/v1/projects` and its `/api/projects` alias. */
  const listParameters = [
    { name: "category", in: "query", required: false, schema: { type: "string", enum: categories } },
    { name: "type", in: "query", required: false, schema: { type: "string", enum: projectTypes } },
    {
      name: "limit",
      in: "query",
      required: false,
      schema: { type: "integer", minimum: 1, maximum: 20 },
    },
    archiveParameter,
    cursorParameter,
  ];
  return {
    openapi: "3.1.0",
    info: {
      title: "Ayush Rai public API",
      version: "1.0.0",
      description: `Read API over the same public content as Ayush Rai's website, plus POST /api/v1/batch for several reads in one call and POST /api/send-email for the contact form. Unverified award metrics are omitted. There is no separate dataset for this API.\n\nAccess: ${API_ACCESS_NOTE}\n\nRate limits: ${API_RATE_LIMIT_NOTE}\n\nErrors: read and batch errors are { "error": { "code", "message", "hint", "docs" } }. code is stable; hint says how to fix the request. POST /api/v1/batch and POST /api/send-email accept an optional Idempotency-Key header.\n\nVersioning: ${API_VERSIONING_POLICY}\n\nMCP: project tools are POST /api/mcp (Server Card GET ${SERVER_CARD_PATH}). Documentation tools are POST /api/mcp/docs (Server Card GET /api/mcp/docs/server-card).`,
      contact: { name: person.name, email: person.email, url: `${origin}/developers/` },
    },
    externalDocs: { description: "Developer notes", url: `${origin}/developers/` },
    servers: [{ url: origin }],
    security: [],
    paths: {
      "/api/v1/search": searchOperation("searchPortfolioV1", "Search the public site index"),
      "/api/search": searchOperation("searchPortfolio", "Search the public site index (v1 alias)"),
      "/api/projects": {
        get: {
          operationId: "projects",
          summary: "List, fetch, or compare public projects",
          description:
            "v1 alias. No query lists projects in pages, like /api/v1/projects. slug returns one project. compare accepts 2 to 4 comma-separated slugs.",
          parameters: [
            ...listParameters,
            { name: "slug", in: "query", required: false, schema: { type: "string" } },
            {
              name: "compare",
              in: "query",
              required: false,
              description: "Comma-separated slugs, two to four",
              schema: { type: "string" },
            },
            {
              name: "slugs",
              in: "query",
              required: false,
              description: "Same as compare; read only when compare is absent.",
              schema: { type: "string" },
            },
          ],
          responses: {
            ...ok("A page of projects, one project, or a comparison", "ProjectsAliasResponse"),
            ...errors(["400", "404", "405", "429", "500"]),
          },
        },
      },
      "/api/v1/projects": {
        get: {
          operationId: "listProjectsV1",
          summary: "List public projects",
          description:
            "Active projects by default. Pass archive=1 to include archived records. Maximum limit is 20 when set; the default page is 50. Page with cursor and nextCursor.",
          parameters: listParameters,
          responses: {
            ...ok("One page of projects", "ProjectListResponse"),
            ...errors(["400", "405", "429", "500"]),
          },
        },
      },
      "/api/v1/projects/{slug}": {
        get: {
          operationId: "getProjectV1",
          summary: "Fetch one public project",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
            },
            archiveParameter,
          ],
          responses: {
            ...ok("One project", "ProjectResponse"),
            ...errors(["400", "404", "405", "429", "500"]),
          },
        },
      },
      "/api/v1/compare": {
        get: {
          operationId: "compareProjectsV1",
          summary: "Compare two to four public projects",
          parameters: [
            {
              name: "slugs",
              in: "query",
              required: true,
              description: "Comma-separated slugs, two to four, no duplicates",
              schema: { type: "string" },
            },
            archiveParameter,
          ],
          responses: {
            ...ok("Projects found, plus slugs that were not", "CompareResponse"),
            ...errors(["400", "405", "429", "500"]),
          },
        },
      },
      "/api/sandbox/v1/search": (() => {
        const operation = searchOperation(
          "searchPortfolioSandbox",
          "Search the public index through the sandbox alias",
        );
        return {
          get: {
            ...operation.get,
            description: `Sandbox alias of GET /api/v1/search. ${operation.get.description} The records are the published ones. Responses include X-Api-Environment: sandbox.`,
            parameters: [...operation.get.parameters, environmentParameter],
          },
        };
      })(),
      "/api/sandbox/v1/projects": {
        get: {
          operationId: "listProjectsSandbox",
          summary: "List public projects through the sandbox alias",
          description:
            "Sandbox alias of GET /api/v1/projects. Same published records. Responses include X-Api-Environment: sandbox.",
          parameters: [environmentParameter],
          responses: {
            ...ok("One page of projects", "ProjectListResponse"),
            ...errors(["400", "405", "429", "500"]),
          },
        },
      },
      "/api/sandbox/v1/compare": {
        get: {
          operationId: "compareProjectsSandbox",
          summary: "Compare public projects through the sandbox alias",
          description:
            "Sandbox alias of GET /api/v1/compare. Same published records. Responses include X-Api-Environment: sandbox.",
          parameters: [
            {
              name: "slugs",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
            environmentParameter,
          ],
          responses: {
            ...ok("Projects found, plus slugs that were not", "CompareResponse"),
            ...errors(["400", "405", "429", "500"]),
          },
        },
      },
      "/api/v1/batch": {
        post: {
          operationId: "batchReadsV1",
          summary: "Run up to 8 public read calls in one request",
          description:
            "Body is { operations: [{ method: GET, path, query }] }. path is /api/v1/search, /api/v1/projects, /api/v1/projects/{slug}, or /api/v1/compare (the unversioned search and projects aliases are also accepted). Each result is { status, body }. An optional Idempotency-Key replays the same body.",
          parameters: [idempotencyParameter],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["operations"],
                  properties: {
                    operations: {
                      type: "array",
                      minItems: 1,
                      maxItems: 8,
                      items: {
                        type: "object",
                        required: ["path"],
                        properties: {
                          method: { type: "string", enum: ["GET"] },
                          path: { type: "string" },
                          query: { type: "object", additionalProperties: { type: "string" } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            ...ok("One result per operation, in request order", "BatchResponse"),
            ...errors(["400", "405", "409", "429", "500"]),
          },
        },
      },
      "/api/send-email": {
        post: {
          operationId: "sendContactEmail",
          summary: "Send the site contact form",
          description:
            "The contact-form write. Optional Idempotency-Key: the same key and body replay the stored success and do not send a second email. This route's JSON is { success, message }, not the read-API error envelope.",
          parameters: [idempotencyParameter],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "subject", "message"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    subject: { type: "string" },
                    message: { type: "string" },
                    service: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Sent, or replayed from Idempotency-Key",
              content: json("ContactResponse"),
            },
            "400": {
              description: "Missing fields, bad email, or an Idempotency-Key longer than 128 characters",
              content: json("ContactResponse"),
            },
            "405": {
              description: "Only POST and OPTIONS are accepted",
              content: json("ContactResponse"),
            },
            "409": {
              description: "Idempotency-Key reused with a different body",
              content: json("ContactResponse"),
            },
            "429": {
              description: "Contact form rate limit",
              content: json("ContactResponse"),
            },
            "500": {
              description: "Email service is not configured",
              content: json("ContactResponse"),
            },
            "502": {
              description: "The mail provider rejected the message",
              content: json("ContactResponse"),
            },
          },
        },
      },
      [SERVER_CARD_PATH]: {
        get: {
          operationId: "getMcpServerCard",
          summary: "MCP Server Card for the Streamable HTTP endpoint",
          description: `SEP-2127 Server Card. Supports ETag and If-None-Match. The card itself conforms to ${SERVER_CARD_SCHEMA}.`,
          responses: {
            "200": {
              description: "Server Card",
              headers: {
                ...rateLimitHeaders,
                ETag: { description: "Entity tag of the card", schema: { type: "string" } },
              },
              content: {
                [SERVER_CARD_CONTENT_TYPE]: { schema: { $ref: "#/components/schemas/ServerCard" } },
              },
            },
            "304": { description: "Not modified since the ETag sent in If-None-Match" },
            ...errors(["405", "429"]),
          },
        },
      },
      "/ask": {
        get: {
          operationId: "askGet",
          summary: "NLWeb-shaped lexical ask (GET)",
          description:
            "Natural-language query over the same lexical index as /api/v1/search. Not generative. Pass query or q. Responses include _meta.version (0.55) and _meta.response_type.",
          parameters: [
            {
              name: "query",
              in: "query",
              required: false,
              schema: { type: "string", maxLength: SEARCH_MAX_QUERY },
            },
            {
              name: "q",
              in: "query",
              required: false,
              description: "Alias for query",
              schema: { type: "string", maxLength: SEARCH_MAX_QUERY },
            },
            {
              name: "streaming",
              in: "query",
              required: false,
              description: "Pass true for a text/event-stream response (start, result, complete events).",
              schema: { type: "string", enum: ["true"] },
            },
          ],
          responses: {
            ...askOk(),
            ...errors(["405", "429"], "AskResponse"),
          },
        },
        post: {
          operationId: "askPost",
          summary: "NLWeb-shaped lexical ask (POST)",
          description:
            "Same as GET /ask. Body may be { \"query\": \"…\" }, { \"query\": { \"text\": \"…\" } }, or { \"q\": \"…\" }.",
          requestBody: {
            required: false,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AskRequest" } },
            },
          },
          responses: {
            ...askOk(),
            ...errors(["400", "405", "429"], "AskResponse"),
          },
        },
      },
    },
    components: {
      headers: {
        RateLimit: {
          description: 'Remaining quota and seconds until reset, for example "default";r=59;t=60.',
          schema: { type: "string" },
        },
        RateLimitPolicy: {
          description: `Quota policy: "default";q=${RATE_LIMIT_QUOTA};w=${RATE_LIMIT_WINDOW_SECONDS}.`,
          schema: { type: "string" },
        },
        RetryAfter: {
          description: "Seconds to wait before retrying.",
          schema: { type: "integer", minimum: 1 },
        },
      },
      schemas: {
        SearchItem: {
          type: "object",
          required: ["id", "title", "type", "summary", "href", "tags"],
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            type: { type: "string", enum: [...SEARCH_TYPES] },
            summary: { type: "string" },
            href: { type: "string", description: "Site-relative path of the page" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
        PublicProject: {
          type: "object",
          required: [
            "slug",
            "title",
            "summary",
            "type",
            "category",
            "status",
            "yearStart",
            "technologies",
            "archive",
            "pagePath",
            "htmlUrl",
          ],
          properties: {
            slug: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            type: { type: "string", enum: projectTypes },
            category: { type: "string", enum: categories },
            status: { type: "string" },
            yearStart: { type: "integer" },
            yearEnd: { oneOf: [{ type: "integer" }, { type: "string", const: "present" }] },
            technologies: { type: "array", items: { type: "string" } },
            links: {
              type: "object",
              properties: {
                demo: { type: "string", format: "uri" },
                github: { type: "string", format: "uri" },
              },
            },
            archive: { type: "boolean" },
            workPath: { type: "string", description: "On-site case study, when one exists" },
            pagePath: { type: "string" },
            htmlUrl: { type: "string", format: "uri" },
          },
        },
        SearchResponse: {
          type: "object",
          required: ["query", "match", "ranking", "results", "nextCursor"],
          properties: {
            query: { type: "string" },
            match: { type: "string", const: "lexical" },
            ranking: { type: "string" },
            results: { type: "array", items: { $ref: "#/components/schemas/SearchItem" } },
            nextCursor: { $ref: "#/components/schemas/NextCursor" },
          },
        },
        AskRequest: {
          type: "object",
          properties: {
            query: {
              oneOf: [
                { type: "string", maxLength: SEARCH_MAX_QUERY },
                {
                  type: "object",
                  properties: { text: { type: "string", maxLength: SEARCH_MAX_QUERY } },
                },
              ],
            },
            q: { type: "string", maxLength: SEARCH_MAX_QUERY },
            prefer: {
              type: "object",
              properties: { streaming: { type: "boolean", description: "true selects the SSE response" } },
            },
          },
        },
        AskResponse: {
          type: "object",
          required: ["_meta"],
          properties: {
            query: { type: "string" },
            site: { type: "string" },
            mode: { type: "string" },
            total_results: { type: "integer" },
            results: { type: "array", items: { type: "object" } },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
              },
            },
            _meta: {
              type: "object",
              required: ["version", "response_type"],
              properties: {
                version: { type: "string", const: "0.55" },
                response_type: { type: "string", enum: ["answer", "failure"] },
                response_format: { type: "string" },
                mode: { type: "string" },
                site: { type: "string" },
                note: { type: "string" },
              },
            },
          },
        },
        ContactResponse: {
          type: "object",
          required: ["message"],
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
        BatchResponse: {
          type: "object",
          required: ["results"],
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                required: ["status", "body"],
                properties: {
                  status: { type: "integer" },
                  body: {},
                },
              },
            },
          },
        },
        ProjectListResponse: {
          type: "object",
          required: ["projects", "count", "nextCursor"],
          properties: {
            projects: { type: "array", items: { $ref: "#/components/schemas/PublicProject" } },
            count: { type: "integer", description: "Number of projects in this page" },
            nextCursor: { $ref: "#/components/schemas/NextCursor" },
          },
        },
        ProjectResponse: {
          type: "object",
          required: ["project"],
          properties: { project: { $ref: "#/components/schemas/PublicProject" } },
        },
        CompareResponse: {
          type: "object",
          required: ["projects", "missing"],
          properties: {
            projects: { type: "array", items: { $ref: "#/components/schemas/PublicProject" } },
            missing: { type: "array", items: { type: "string" }, description: "Requested slugs with no public project" },
          },
        },
        ProjectsAliasResponse: {
          oneOf: [
            { $ref: "#/components/schemas/ProjectListResponse" },
            { $ref: "#/components/schemas/ProjectResponse" },
            { $ref: "#/components/schemas/CompareResponse" },
          ],
        },
        NextCursor: {
          type: ["string", "null"],
          description:
            "Pass as cursor to fetch the next page. null means this is the last page. Treat it as opaque.",
        },
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message", "hint", "docs"],
              properties: {
                code: { type: "string", enum: ERROR_CODES },
                message: { type: "string", description: "What was wrong with this request" },
                hint: { type: "string", description: "How to fix the request" },
                docs: { type: "string", format: "uri" },
              },
            },
          },
        },
        ServerCard: {
          type: "object",
          required: ["$schema", "name", "version", "description"],
          properties: {
            $schema: { type: "string", const: SERVER_CARD_SCHEMA },
            name: { type: "string", pattern: "^[a-zA-Z0-9.-]+/[a-zA-Z0-9._-]+$" },
            version: { type: "string" },
            description: { type: "string", maxLength: 100 },
            title: { type: "string" },
            websiteUrl: { type: "string", format: "uri" },
            repository: {
              type: "object",
              required: ["url", "source"],
              properties: { url: { type: "string", format: "uri" }, source: { type: "string" } },
            },
            remotes: {
              type: "array",
              items: {
                type: "object",
                required: ["type", "url"],
                properties: {
                  type: { type: "string", enum: ["streamable-http", "sse"] },
                  url: { type: "string" },
                  supportedProtocolVersions: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
  };
}
