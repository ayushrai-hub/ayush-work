---
name: portfolio-nlweb-and-a2a
description: Query Ayush Rai's portfolio over NLWeb (/ask with JSON or SSE streaming) or Agent-to-Agent protocol (/.well-known/agent-card.json and POST /api/a2a message/send).
---

# NLWeb `/ask` and A2A `message/send`

Canonical site: https://www.ayushrai.site

## NLWeb (`/ask`)

`POST https://www.ayushrai.site/ask` (or `GET /ask?q=<keywords>`) runs lexical search over the site index and returns an NLWeb v0.55 envelope (`_meta.version: "0.55"`, `_meta.response_type: "answer" | "failure"`):

```bash
curl -X POST "https://www.ayushrai.site/ask" \
  -H "Content-Type: application/json" \
  -d '{"query":{"text":"revenue intelligence"},"prefer":{"streaming":false}}'
```

Pass `prefer.streaming: true` (or `?streaming=true`, or `Accept: text/event-stream`) to receive Server-Sent Events (`start`, `result`, `complete`).

## A2A (`/.well-known/agent-card.json` and `POST /api/a2a`)

1. Discover the card at `GET https://www.ayushrai.site/.well-known/agent-card.json`.
2. Call `POST https://www.ayushrai.site/api/a2a` with JSON-RPC 2.0 `message/send`:

```bash
curl -X POST "https://www.ayushrai.site/api/a2a" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{ "kind": "text", "text": "agents" }]
      }
    }
  }'
```
