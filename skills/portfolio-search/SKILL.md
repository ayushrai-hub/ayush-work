---
name: portfolio-search
description: Search Ayush Rai's public portfolio with the lexical search API. Use when the question is whether he has built something in an area and a keyword query is enough.
---

# Search the portfolio

Canonical site: https://www.ayushrai.site

## Call

`GET https://www.ayushrai.site/api/v1/search?q=agents`

The same call through the sandbox alias, which returns the same records and sets `X-Api-Environment: sandbox`:

`GET https://www.ayushrai.site/api/sandbox/v1/search?q=agents`

Ranking is lexical: exact title, title substring, tag or type, then summary. It is not semantic search. Pass `nextCursor` back as `cursor` until it is null. `limit` is 1 to 20.

## Poll

`POST https://www.ayushrai.site/api/v1/jobs` with `{ "operation": "search", "q": "agents" }` returns `202` and a `statusUrl`. `GET` that URL for the same result. Send `Idempotency-Key` when a retry must not be treated as a second job.

## Read a hit

Append `.md` to the hit's `href`, or send `Accept: text/markdown` without `text/html`.
