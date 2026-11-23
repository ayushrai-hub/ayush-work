---
name: portfolio-batch-and-sandbox
description: Execute up to 8 read operations in a single POST /api/v1/batch call with Idempotency-Key replay protection, or test against the read-only /api/sandbox/v1/* endpoints.
---

# Batch reads, Idempotency-Key, and sandbox endpoints

Canonical site: https://www.ayushrai.site

## Batch reads (`POST /api/v1/batch`)

Run 1 to 8 public `GET` reads (`/api/v1/search`, `/api/v1/projects`, `/api/v1/projects/{slug}`, `/api/v1/compare`) in one request:

```bash
curl -X POST "https://www.ayushrai.site/api/v1/batch" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: batch-run-001" \
  -d '{
    "operations": [
      { "method": "GET", "path": "/api/v1/search", "query": { "q": "agents", "limit": "3" } },
      { "method": "GET", "path": "/api/v1/projects/overlay-text-box", "query": {} }
    ]
  }'
```

## Idempotency-Key

`POST /api/v1/batch`, `POST /api/v1/jobs`, and `POST /api/send-email` accept an optional `Idempotency-Key` header (at most 128 characters):

- Sending the same key with the same JSON body replays the stored response with `Idempotent-Replayed: true`.
- Reusing the same key with a different JSON body returns `409 Conflict` (`idempotency_conflict`).

## Sandbox environment (`/api/sandbox/v1/*`)

Exercise the API in test mode without touching live state:

- `GET https://www.ayushrai.site/api/sandbox/v1/search?q=agents`
- `GET https://www.ayushrai.site/api/sandbox/v1/projects`
- `GET https://www.ayushrai.site/api/sandbox/v1/projects/overlay-text-box`
- `GET https://www.ayushrai.site/api/sandbox/v1/compare?slugs=overlay-text-box,expert-o`

Responses carry `X-Api-Environment: sandbox` and return the published records.
