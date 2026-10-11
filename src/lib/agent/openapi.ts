import { person } from "../../content";

export function buildOpenApiDocument() {
  const origin = person.siteUrl.replace(/\/$/, "");
  return {
    openapi: "3.1.0",
    info: {
      title: "Ayush Rai portfolio",
      version: "1.0.0",
      description:
        "Read-only API over the same public content as the website. Phone numbers and unverified award metrics are omitted. There is no separate dataset for this API.",
    },
    servers: [{ url: origin }],
    paths: {
      "/api/search": {
        get: {
          operationId: "searchPortfolio",
          summary: "Search the public site index",
          description:
            "Lexical match on title, then tags or type, then summary. Ties keep content order. This is not semantic search. An empty q returns the same default slice as the on-site search dialog.",
          parameters: [
            {
              name: "q",
              in: "query",
              required: false,
              schema: { type: "string", maxLength: 200 },
            },
            {
              name: "type",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1, maximum: 20 },
            },
          ],
          responses: {
            "200": {
              description: "Matching public records",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SearchResponse" },
                },
              },
            },
            "400": {
              description: "Invalid query or filter",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/api/projects": {
        get: {
          operationId: "projects",
          summary: "List, fetch, or compare public projects",
          description:
            "No query lists projects. slug returns one project. compare accepts 2 to 4 comma-separated slugs.",
          parameters: [
            {
              name: "slug",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
            {
              name: "compare",
              in: "query",
              required: false,
              schema: {
                type: "string",
                description: "Comma-separated slugs, maximum 4",
              },
            },
          ],
          responses: {
            "200": { description: "Project payload" },
            "400": {
              description: "Invalid query",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
            "404": {
              description: "Unknown slug",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/api/v1/projects": {
        get: {
          operationId: "listProjectsV1",
          summary: "List public projects",
          description:
            "Active projects by default. Pass archive=1 to include archived records. Maximum limit is 20 when set; the default cap is 50.",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "type", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 20 } },
            { name: "archive", in: "query", schema: { type: "string", enum: ["1"] } },
          ],
          responses: {
            "200": { description: "Project list" },
            "400": {
              description: "Invalid filter",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/api/v1/projects/{slug}": {
        get: {
          operationId: "getProjectV1",
          summary: "Fetch one public project",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
            { name: "archive", in: "query", schema: { type: "string", enum: ["1"] } },
          ],
          responses: {
            "200": { description: "One project" },
            "400": {
              description: "Invalid slug",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
            "404": {
              description: "Unknown or archived slug",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
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
              schema: { type: "string", description: "Comma-separated slugs, two to four, no duplicates" },
            },
          ],
          responses: {
            "200": { description: "Comparison" },
            "400": {
              description: "Invalid comparison",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        SearchResponse: {
          type: "object",
          required: ["query", "ranking", "results"],
          properties: {
            query: { type: "string" },
            ranking: { type: "string" },
            match: { type: "string", const: "lexical" },
            results: { type: "array", items: { type: "object" } },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message"],
              properties: {
                code: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
}
