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
  "Free and public. No account or API key is needed because every endpoint is read-only over published content. There is no separate test environment or paid tier. Clients may cache responses for five minutes. REST responses grant CORS only to the site's own origins, so call the REST API from a server, an agent, or the CLI rather than from a browser page on another site. The MCP endpoint and its Server Card allow any origin.";

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

const commonErrors = {
  "429": { $ref: "#/components/responses/TooManyRequests" },
};

const cursorParameter = {
  name: "cursor",
  in: "query",
  required: false,
  description: "Opaque nextCursor from the previous page. Omit for the first page.",
  schema: { type: "string" },
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
        "400": { $ref: "#/components/responses/BadRequest" },
        ...commonErrors,
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
      description: `Read-only API over the same public content as Ayush Rai's website. Unverified award metrics are omitted. There is no separate dataset for this API.\n\nAccess: ${API_ACCESS_NOTE}\n\nRate limits: ${API_RATE_LIMIT_NOTE}\n\nErrors: every error body is { "error": { "code", "message", "hint", "docs" } }. code is stable; hint says how to fix the request.\n\nVersioning: ${API_VERSIONING_POLICY}\n\nMCP: the same project and search tools are available over Streamable HTTP at POST /api/mcp. Its Server Card is at GET ${SERVER_CARD_PATH}.`,
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
            "400": { $ref: "#/components/responses/BadRequest" },
            "404": { $ref: "#/components/responses/NotFound" },
            ...commonErrors,
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
            "400": { $ref: "#/components/responses/BadRequest" },
            ...commonErrors,
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
            "400": { $ref: "#/components/responses/BadRequest" },
            "404": { $ref: "#/components/responses/NotFound" },
            ...commonErrors,
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
            "400": { $ref: "#/components/responses/BadRequest" },
            ...commonErrors,
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
            ...commonErrors,
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
          ],
          responses: {
            ...ok("NLWeb conversational_search answer or failure", "AskResponse"),
            ...commonErrors,
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
            ...ok("NLWeb conversational_search answer or failure", "AskResponse"),
            "400": { $ref: "#/components/responses/BadRequest" },
            ...commonErrors,
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
      responses: {
        BadRequest: {
          description: "Invalid query, filter, slug, or cursor",
          headers: rateLimitHeaders,
          content: json("ErrorResponse"),
        },
        NotFound: {
          description: "Unknown or archived slug",
          headers: rateLimitHeaders,
          content: json("ErrorResponse"),
        },
        TooManyRequests: {
          description: "Rate limit exceeded",
          headers: {
            ...rateLimitHeaders,
            "Retry-After": { $ref: "#/components/headers/RetryAfter" },
          },
          content: json("ErrorResponse"),
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
