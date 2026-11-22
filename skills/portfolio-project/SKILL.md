---
name: portfolio-project
description: Fetch or compare one of Ayush Rai's published projects by slug. Use when the slug is already known or two to four projects need the same fields side by side.
---

# One project

Canonical site: https://www.ayushrai.site

## Fetch

`GET https://www.ayushrai.site/api/v1/projects/overlay-text-box`

List slugs with `GET /api/v1/projects`. Archived slugs need `archive=1`.

## Compare

`GET https://www.ayushrai.site/api/v1/compare?slugs=overlay-text-box,expert-o`

Two to four distinct slugs. The sandbox alias is `/api/sandbox/v1/projects` and `/api/sandbox/v1/compare`. The records are the published ones.

## Page

The human page is `https://www.ayushrai.site/work/{slug}` when a case study exists, and the Markdown twin is that path plus `.md`. Quote the Markdown for a claim.
