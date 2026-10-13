# Keyword and content strategy

Updated 11 October 2026. Priorities are **qualitative hypotheses**. This pass did not use a keyword tool, so there are no search volumes, difficulty scores, traffic estimates, or competitor rankings. Validate in Google Search Console after the new URLs are indexed.

One page per intent. Synonyms of a missing specialty do not get URLs.

## Pages

| Page | Intent | Topic and nearby terms | Audience / stage | Evidence on hand | Internal links | Gap | Priority | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Who is Ayush Rai and where do I go next | Name, AI engineer, AI product builder | Anyone arriving cold | Biography, selected work, domain index | Domains, work, about, contact | Homepage title is the name only. A richer title would need a careful length check. | High | Updated this pass |
| `/ai-engineering/` | What AI work can he show | AI engineering portfolio, LLM products, evaluation | Hiring, collaborators | Hub over the child pages | Evaluation, RLHF, LLM systems, agents, retrieval | Easy to over-claim. The page lists non-claims. | High | Added |
| `/ai-engineering/llm-evaluation/` | Has he done LLM evaluation | LLM evaluation, rubrics, code review of model output | Hiring for eval roles | FoCDoT and Outlier narratives, one note | RLHF, MedVoice, experience | No public rubric pack or scores | High | Added |
| `/ai-engineering/rlhf/` | Has he done RLHF | RLHF, preference data, human feedback | Same, more specific | The phrase on the FoCDoT record, scoped down | Evaluation | No training stack | High | Added |
| `/ai-engineering/llm-systems/` | Production-shaped LLM apps | LLM application architecture, constrained generation | Product collaborators | MedVoice and AGENYRA | Agents, products | Not a general platform | High | Added |
| `/ai-engineering/agents/` | Agent projects | AI agent engineering, tool use | Curious collaborators | AGENYRA staging plus this site's read-only agent API | Developers, AGENYRA | Not an orchestrator | Medium | Added, deliberately narrow |
| `/ai-engineering/rag/` | RAG portfolio | Production RAG, legal retrieval | Researchers | One 2023 investigation | Research | Do not target "production RAG implementation" as if it were shipped | Low | Added as a boundary, not a landing page to push |
| Inference | Serving, quantization, cost | — | — | None | Mentioned as a gap on the hub | Creating the URL would be a doorway | — | Not published |
| `/software-engineering/` | Can he build the application | Full-stack, React, Next.js, APIs | Clients, hiring | Sites and products already case-studied | Open source, services, products | No systems-design war story | Medium | Added |
| Distributed systems | Reliability, queues, consistency | — | — | A sentence in MedVoice, not a system | Gap on the software page | No URL | — | Not published |
| `/software-services/` | Can I hire him | AI product development services, without a price | Potential clients | Client sites and the product stance | Contact, work | No offer catalog | Medium | Added |
| `/products/medvoice/` | Voice wholesale billing | Voice-assisted pharmaceutical billing | Niche, high intent | Product dossier | Case study, LLM systems | No demo URL | High | Already existed; linked from the new LLM systems page |
| `/experience/` | Employment history | AI evaluation engineer, contract | Hiring | Experience module | About, timeline, resume | Dates still need his confirmation | Medium | Added |
| `/open-source/` | Public code | GitHub, extension | Hiring | Repos already linked | Projects | No contribution graph | Low | Added |
| `/writing/` | Essays | — | Readers | External hubs only | — | On-site essays would be the next content investment | Later | Unchanged, still thin |

## Queries that look attractive and should wait

These showed up in the brief. They are hypotheses, not targets with volume:

- "RLHF evaluation engineer portfolio" — the RLHF and evaluation pages can answer this only at the level of the experience text.
- "Production RAG implementation" — do not chase. The retrieval page says the work is an investigation.
- "LLM evaluation pipeline design" — would need a public pipeline. The current page is about review practice.
- "Voice-assisted pharmaceutical billing software" — MedVoice is the right URL if someone searches that. It must keep the "building, no public demo" wording.

## Competitor research still required

Before writing another long page, look up who already ranks for the query and whether they show a system, a paper, or a job description. Do that in Search Console and by reading the results. Do not invent their traffic.

## What not to do

- Doorway pages for "LLM eval" vs "LLM evaluation" vs "preference ranking portfolio".
- Articles that restate a paper without an implementation, a measurement, or a lesson from a project on this site.
- Automated publishing.
