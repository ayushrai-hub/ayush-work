# Domain evidence map

Source of truth: `src/content/domains.ts`, which links back to experience, work, products, research, and notes. Updated 11 October 2026.

A row is "shipped" only when this site already describes an artifact. Contract evaluation is self-reported employment, not a public dataset.

| Domain | Page | Evidence level | Supporting work | Repository or record | Gaps |
| --- | --- | --- | --- | --- | --- |
| AI engineering | `/ai-engineering/` | Mixed | FoCDoT evaluation (Apr 2024–Aug 2025); Outlier contract (Aug 2025–); MedVoice; AGENYRA; eval note | Experience records; `/work/medvoice`; `/notes/eval-is-the-job` | No public eval harness. No inference specialty. |
| LLM evaluation | `/ai-engineering/llm-evaluation/` | Mixed | Same two roles; note "evaluation is the job"; idea "code-eval rubrics" (exploring) | `/experience#outlier-genai`, `/experience#focdot-sde-ai`, `/ideas` | No agreement stats, sample sizes, or benchmark table. |
| RLHF and preference feedback | `/ai-engineering/rlhf/` | Mixed | Experience text says RLHF-oriented evaluation. Not reward-model training. | `/experience#focdot-sde-ai` | No preference UI, reward model, or policy update. |
| LLM systems | `/ai-engineering/llm-systems/` | Mixed | MedVoice speech-to-draft-invoice path; AGENYRA structured data before agent placement | [MedVoiceERP](https://github.com/ayushrai-hub/MedVoiceERP); `/products/medvoice`; `/work/agenyra` | No live wholesaler, production speech, or general LLM gateway. Authorship of some MedVoice commits is unverified. |
| Agents | `/ai-engineering/agents/` | Investigation | AGENYRA's refusal to call distribution "launched"; this site's read-only MCP and search API | `/developers`; `/work/agenyra` | No production orchestrator, remote MCP, or agent eval suite. |
| Retrieval / RAG | `/ai-engineering/rag/` | Investigation | Legal NLP investigation, Aug–Dec 2023, mentions retrieval | `/research/legal-nlp-contracts` | Not a production RAG system. Older volume and time-saved figures stay unverified and are omitted. |
| Inference and serving | No URL | Gap | None that this site can show | — | Quantization, latency budgets, and model serving are not pages. |
| Software engineering | `/software-engineering/` | Shipped | This site; Open Framework; Overlay Text Box; Iha; Shiksha-Mitra; Next.js products | [ayush-work](https://github.com/ayushrai-hub/ayush-work); product repos linked from `/open-source/` | No load-test or multi-region write-up. |
| Distributed systems | No URL | Gap | MedVoice mentions idempotent posting and a prepared Redis. The API still defaults to an in-memory catalog. | `/products/medvoice` | That is a constraint, not a distributed-systems case study. |
| Software services | `/software-services/` | Shipped as a description of past delivery | Iha by Himani; Praful H.; stage-honest product framing | `/work/iha-by-himani`; `/work/praful-h`; `/contact` | No rate card, SLA, or team. |
| Products | `/products/` (existing) | Shipped as catalog | The Open Framework, AGENYRA, MedVoice, plus earlier MVPs | Product records and their GitHub URLs | Stages stay "building" where the product page says so. |
| Research | `/research/` (existing) | Notes and investigations | Agri advisory, legal NLP, campus energy | `src/content/research.ts` | Not peer-reviewed. Unverified metrics stay withheld. |
| Open source | `/open-source/` | Shipped as a link list | Overlay Text Box and public product/client repos already cited | GitHub links on those records | No star counts. No inventory of outside pull requests. |
| Work | `/work/` (existing) | Case studies | Selected work module | `src/content/work.ts` | Unverified outcome percentages stay out. |
| Experience | `/experience/` | Self-reported roles | FoCDoT, Outlier, UiPath champion, Salesforce virtual intern | `src/content/experience.ts` | Offer letters are not published. Lab employment is not implied. |
| Writing | `/writing/` (existing) | Thin | Medium and Substack hubs | External URLs on the writing records | No on-site essays yet. |
| Contact | `/contact/` (existing) | Shipped | Email and Calendly | `person.ts` | Phone stays unpublished. |
