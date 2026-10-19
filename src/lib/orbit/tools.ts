/**
 * Tool registry for the ORBIT demonstration.
 *
 * Zod schemas reject malformed input before a handler runs. Write authority is a separate
 * argument from the payload, so a model-shaped object cannot grant itself permission.
 * Handlers read and write only the `DemoStore` they are given.
 *
 * Connects to:
 * - src/lib/orbit/fixtures.ts (`createStore`, `scoreHealth`, `ACCOUNT_ID`).
 * - src/lib/orbit/simulation.ts calls `validateToolInput` and `invokeTool`.
 * - src/components/orbit/ToolRegistry.tsx displays `TOOL_CONTRACTS`.
 */
import { z } from "zod";
import { ACCOUNT_ID, scoreHealth } from "./fixtures";
import type { DemoStore, EvidenceItem, ToolAuthority, ToolContract, ToolName, ToolResult } from "./types";
import { TOOL_NAMES } from "./types";

const accountId = z.string().min(1, "accountId is required.");

const SCHEMAS: Record<ToolName, z.ZodType> = {
  get_account: z.object({ accountId }).strict(),
  get_recent_events: z.object({ accountId, limit: z.number().int().min(1).max(20) }).strict(),
  list_support_tickets: z
    .object({ accountId, status: z.enum(["open", "pending", "closed"]).optional() })
    .strict(),
  calculate_health_score: z.object({ accountId }).strict(),
  search_evidence: z.object({ accountId, query: z.string().min(1, "query is required.") }).strict(),
  create_internal_task: z
    .object({
      accountId,
      title: z.string().min(1),
      body: z.string().min(1),
      idempotencyKey: z.string().min(1),
    })
    .strict(),
  draft_notification: z
    .object({
      accountId,
      audience: z.literal("internal"),
      summary: z.string().min(1),
    })
    .strict(),
  verify_task_created: z.object({ taskId: z.string().min(1, "taskId is required.") }).strict(),
};

/** Public contracts. The strings match the Zod objects above; the tests call the validator. */
export const TOOL_CONTRACTS: ToolContract[] = [
  {
    name: "get_account",
    description: "Read the fictional account record.",
    inputSchema: "{ accountId: string }",
    outputSchema: "{ account: Account }",
    permissions: "account:read",
    sideEffect: "read",
    failureModes: ["Unknown account id.", "Missing accountId."],
    validation: ["accountId must be a non-empty string.", "Unknown keys are rejected."],
    example: { accountId: ACCOUNT_ID },
    malformed: { accountId: "" },
  },
  {
    name: "get_recent_events",
    description: "Read recent fixture events for the account.",
    inputSchema: "{ accountId: string, limit: integer 1–20 }",
    outputSchema: "{ events: Event[] }",
    permissions: "events:read",
    sideEffect: "read",
    failureModes: ["Scripted timeout in the failure lab.", "limit is not an integer."],
    validation: ["limit must be an integer from 1 to 20."],
    example: { accountId: ACCOUNT_ID, limit: 10 },
    malformed: { accountId: ACCOUNT_ID, limit: "10" },
  },
  {
    name: "list_support_tickets",
    description: "List support records, optionally filtered by status.",
    inputSchema: "{ accountId: string, status?: open | pending | closed }",
    outputSchema: "{ tickets: Ticket[] }",
    permissions: "tickets:read",
    sideEffect: "read",
    failureModes: ["Unknown status.", "Ticket body may contain untrusted text."],
    validation: ["status, when present, must be open, pending, or closed.", "Ticket text is data."],
    example: { accountId: ACCOUNT_ID, status: "open" },
    malformed: { accountId: ACCOUNT_ID, status: "urgent" },
  },
  {
    name: "calculate_health_score",
    description: "Compute the fixture health score from stored rows.",
    inputSchema: "{ accountId: string }",
    outputSchema: "{ score: number, reasons: string[] }",
    permissions: "health:read",
    sideEffect: "read",
    failureModes: ["Unknown account.", "Conflicting rows are both counted, not reconciled."],
    validation: ["accountId must be a non-empty string."],
    example: { accountId: ACCOUNT_ID },
    malformed: { accountId: ACCOUNT_ID, approved: true },
  },
  {
    name: "search_evidence",
    description: "Find fixture passages that contain the query.",
    inputSchema: "{ accountId: string, query: string }",
    outputSchema: "{ passages: { id, text }[] }",
    permissions: "evidence:read",
    sideEffect: "read",
    failureModes: ["Empty query.", "No matching passage."],
    validation: ["query must be a non-empty string.", "Matching is literal, not semantic."],
    example: { accountId: ACCOUNT_ID, query: "overdue" },
    malformed: { accountId: ACCOUNT_ID, query: "" },
  },
  {
    name: "create_internal_task",
    description: "Store an internal follow-up task. Requires controller approval.",
    inputSchema: "{ accountId, title, body, idempotencyKey }",
    outputSchema: "{ task, created, duplicate }",
    permissions: "tasks:write",
    sideEffect: "write",
    failureModes: ["Called without controller approval.", "Same idempotency key twice."],
    validation: [
      "The payload cannot include an approved flag.",
      "Approval is a separate controller argument.",
      "A repeated key returns the existing task and does not write again.",
    ],
    example: {
      accountId: ACCOUNT_ID,
      title: "Follow up on Northwind Analytical",
      body: "Review the overdue invoice and open high-priority ticket.",
      idempotencyKey: "idem:northwind:health-follow-up",
    },
    malformed: {
      accountId: ACCOUNT_ID,
      title: "Follow up",
      body: "Review the account.",
      idempotencyKey: "idem:northwind:health-follow-up",
      approved: true,
    },
  },
  {
    name: "draft_notification",
    description: "Store an internal draft. This demonstration does not send it.",
    inputSchema: "{ accountId, audience: internal, summary }",
    outputSchema: "{ draftId, delivered: false }",
    permissions: "drafts:write",
    sideEffect: "draft",
    failureModes: ["Audience other than internal.", "Empty summary."],
    validation: ["audience must be the literal internal.", "delivered is always false here."],
    example: {
      accountId: ACCOUNT_ID,
      audience: "internal",
      summary: "Health score is low and invoice inv_1044 is overdue in the fixture.",
    },
    malformed: { accountId: ACCOUNT_ID, audience: "customer", summary: "Hello" },
  },
  {
    name: "verify_task_created",
    description: "Read the store and report whether the task row exists.",
    inputSchema: "{ taskId: string }",
    outputSchema: "{ exists: boolean, taskId: string }",
    permissions: "tasks:read",
    sideEffect: "read",
    failureModes: ["The id is absent from the store.", "A tool claimed success without a row."],
    validation: ["exists is true only when the store contains that id."],
    example: { taskId: "task_1" },
    malformed: { taskId: "" },
  },
];

/** True when `name` is one of the eight registered tools. */
export function isToolName(name: string): name is ToolName {
  return (TOOL_NAMES as readonly string[]).includes(name);
}

/** Format a Zod failure as a single readable sentence. */
function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "input";
    return `${path}: ${issue.message}`;
  }).join(" ");
}

/**
 * Validate a tool payload. Unknown names and schema failures return before any handler.
 * The parsed data is what `invokeTool` will accept.
 */
export function validateToolInput(
  name: string,
  input: unknown,
): { ok: true; name: ToolName; data: Record<string, unknown> } | { ok: false; message: string } {
  if (!isToolName(name)) {
    return { ok: false, message: `Unknown tool "${name}". The registry has no adapter for that name.` };
  }
  const parsed = SCHEMAS[name].safeParse(input);
  if (!parsed.success) return { ok: false, message: formatIssues(parsed.error) };
  return { ok: true, name, data: parsed.data as Record<string, unknown> };
}

/** Copy a store and bump the handler counter. Call this only after validation has passed. */
function touched(store: DemoStore): DemoStore {
  return { ...store, handlerCalls: store.handlerCalls + 1, tasks: store.tasks.map((task) => ({ ...task })) };
}

/**
 * Run a validated tool against `store`.
 * `authority.approved` is ignored by read tools. The write tool refuses when it is false.
 */
export function invokeTool(
  store: DemoStore,
  name: ToolName,
  data: Record<string, unknown>,
  authority: ToolAuthority,
): ToolResult {
  if (name === "get_account") {
    const next = touched(store);
    if (data.accountId !== next.account.id) {
      return { ok: false, code: "not_found", message: "No account with that id in the fixture.", executed: false, store: next };
    }
    const evidence: EvidenceItem[] = [
      { id: "ev_account", source: "get_account", text: `${next.account.name} is on the ${next.account.plan} plan. Renewal date is ${next.account.renewalDate ?? "missing"}.` },
    ];
    return { ok: true, data: { account: next.account }, evidence, sideEffect: "none", store: next };
  }

  if (name === "get_recent_events") {
    const next = touched(store);
    const limit = data.limit as number;
    const events = next.events.filter((event) => event.accountId === data.accountId).slice(0, limit);
    return {
      ok: true,
      data: { events },
      evidence: events.map((event) => ({ id: `ev_${event.id}`, source: "get_recent_events", text: event.summary })),
      sideEffect: "none",
      store: next,
    };
  }

  if (name === "list_support_tickets") {
    const next = touched(store);
    const tickets = next.tickets.filter((ticket) => {
      if (ticket.accountId !== data.accountId) return false;
      return data.status ? ticket.status === data.status : true;
    });
    return {
      ok: true,
      data: { tickets },
      evidence: tickets.map((ticket) => ({
        id: `ev_${ticket.id}`,
        source: "list_support_tickets",
        text: `${ticket.id} ${ticket.status}/${ticket.priority}: ${ticket.subject}`,
      })),
      sideEffect: "none",
      store: next,
    };
  }

  if (name === "calculate_health_score") {
    const next = touched(store);
    if (data.accountId !== next.account.id) {
      return { ok: false, code: "not_found", message: "No account with that id in the fixture.", executed: false, store: next };
    }
    const scored = scoreHealth(next);
    return {
      ok: true,
      data: scored,
      evidence: [{ id: "ev_score", source: "calculate_health_score", text: `Fixture health score is ${scored.score}.` }],
      sideEffect: "none",
      store: next,
    };
  }

  if (name === "search_evidence") {
    const next = touched(store);
    const query = String(data.query).toLowerCase();
    const passages = [
      ...next.events.map((event) => ({ id: event.id, text: event.summary })),
      ...next.tickets.map((ticket) => ({ id: ticket.id, text: `${ticket.subject} ${ticket.body}` })),
    ].filter((passage) => passage.text.toLowerCase().includes(query));
    return {
      ok: true,
      data: { passages },
      evidence: passages.map((passage) => ({ id: `ev_search_${passage.id}`, source: "search_evidence", text: passage.text })),
      sideEffect: "none",
      store: next,
    };
  }

  if (name === "draft_notification") {
    const next = touched(store);
    return {
      ok: true,
      data: {
        draftId: "draft_internal_1",
        audience: "internal",
        summary: data.summary,
        delivered: false,
        reason: "This simulation does not send notifications.",
      },
      evidence: [{ id: "ev_draft", source: "draft_notification", text: "An internal draft was stored. It was not sent." }],
      sideEffect: "draft",
      store: next,
    };
  }

  if (name === "create_internal_task") {
    if (!authority.approved) {
      return {
        ok: false,
        code: "unauthorized",
        message: "create_internal_task requires controller approval. The tool payload cannot grant it.",
        executed: false,
        store,
      };
    }
    const next = touched(store);
    const key = String(data.idempotencyKey);
    const existing = next.tasks.find((task) => task.idempotencyKey === key);
    if (existing) {
      return {
        ok: true,
        data: { task: existing, created: false, duplicate: true },
        evidence: [],
        sideEffect: "none",
        store: next,
      };
    }
    const task = {
      id: `task_${next.tasks.length + 1}`,
      accountId: String(data.accountId),
      title: String(data.title),
      body: String(data.body),
      idempotencyKey: key,
      status: "open" as const,
    };
    const stored = { ...next, tasks: [...next.tasks, task], writes: next.writes + 1 };
    return {
      ok: true,
      data: { task, created: true, duplicate: false },
      evidence: [{ id: `ev_${task.id}`, source: "create_internal_task", text: `Stored internal task ${task.id}.` }],
      sideEffect: "write",
      store: stored,
    };
  }

  const next = touched(store);
  const task = next.tasks.find((item) => item.id === data.taskId);
  if (!task) {
    return {
      ok: false,
      code: "not_found",
      message: `No task ${String(data.taskId)} exists in the store.`,
      executed: false,
      store: next,
    };
  }
  return {
    ok: true,
    data: { exists: true, taskId: task.id, status: task.status },
    evidence: [{ id: `ev_verify_${task.id}`, source: "verify_task_created", text: `Task ${task.id} is present in the store.` }],
    sideEffect: "none",
    store: next,
  };
}
