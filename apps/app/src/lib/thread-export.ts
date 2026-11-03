import type { TimelineRow } from "@bb/server-contract";

const EXPORT_MAX_PAGES = 40;

export type ThreadExportFormat = "markdown" | "json";

export interface ThreadExportMessage {
  role: "user" | "assistant";
  messageSeq: number;
  createdAt: number;
  text: string;
}

export interface ThreadExportSource {
  threadId: string;
  title: string;
  messages: readonly ThreadExportMessage[];
  exportedAt: Date;
}

export interface ThreadTimelinePage {
  rows: readonly TimelineRow[];
  olderCursor: { anchorSeq: number; anchorId: string } | null;
}

export type ThreadTimelinePageFetcher = (args: {
  threadId: string;
  beforeAnchorSeq?: string;
  beforeAnchorId?: string;
}) => Promise<ThreadTimelinePage>;

export async function loadAllThreadTimelineRows(
  threadId: string,
  fetchPage: ThreadTimelinePageFetcher,
): Promise<TimelineRow[]> {
  const latest = await fetchPage({ threadId });
  let rows: TimelineRow[] = [...latest.rows];
  let cursor = latest.olderCursor;
  let pages = 1;

  while (cursor !== null && pages < EXPORT_MAX_PAGES) {
    const older = await fetchPage({
      threadId,
      beforeAnchorSeq: String(cursor.anchorSeq),
      beforeAnchorId: cursor.anchorId,
    });
    rows = [...older.rows, ...rows];
    cursor = older.olderCursor;
    pages += 1;
  }

  return rows;
}

function visitConversationRows(
  rows: readonly TimelineRow[],
  visit: (message: ThreadExportMessage) => void,
): void {
  for (const row of rows) {
    if (row.kind === "conversation") {
      visit({
        role: row.role,
        messageSeq: row.messageSeq,
        createdAt: row.createdAt,
        text: row.text,
      });
      continue;
    }
    if (row.kind === "turn" && row.children !== null) {
      visitConversationRows(row.children, visit);
    }
  }
}

export function collectThreadExportMessages(
  rows: readonly TimelineRow[],
): ThreadExportMessage[] {
  const bySeq = new Map<number, ThreadExportMessage>();
  visitConversationRows(rows, (message) => {
    if (!bySeq.has(message.messageSeq)) {
      bySeq.set(message.messageSeq, message);
    }
  });
  return [...bySeq.values()].sort((left, right) => left.messageSeq - right.messageSeq);
}

function formatExportTimestamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/u, "Z");
}

function messageHeading(message: ThreadExportMessage, exportedAt: Date): string {
  const role = message.role === "user" ? "User" : "Assistant";
  const time = new Date(message.createdAt);
  const sameDay = time.toDateString() === exportedAt.toDateString();
  const when = sameDay
    ? time.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : time.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
  return `### ${role} · ${when}`;
}

export function buildThreadMarkdownExport(source: ThreadExportSource): string {
  const { threadId, title, messages, exportedAt } = source;
  const lines = [
    `# ${title}`,
    "",
    `- Thread: \`${threadId}\``,
    `- Exported: ${formatExportTimestamp(exportedAt)}`,
    `- Messages: ${messages.length}`,
    "",
    "---",
    "",
  ];

  for (const message of messages) {
    lines.push(messageHeading(message, exportedAt), "", message.text.trim(), "");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export function buildThreadJsonExport(source: ThreadExportSource): string {
  const { threadId, title, messages, exportedAt } = source;
  return `${JSON.stringify(
    {
      version: 1,
      threadId,
      title,
      exportedAt: exportedAt.toISOString(),
      messages: messages.map((message) => ({
        role: message.role,
        messageSeq: message.messageSeq,
        createdAt: new Date(message.createdAt).toISOString(),
        text: message.text,
      })),
    },
    null,
    2,
  )}\n`;
}

export function buildThreadExportFileName(
  title: string,
  format: ThreadExportFormat,
): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 60);
  const base = slug === "" ? "thread" : slug;
  return `${base}.${format === "json" ? "json" : "md"}`;
}

export function threadExportContentType(format: ThreadExportFormat): string {
  return format === "json"
    ? "application/json;charset=utf-8"
    : "text/markdown;charset=utf-8";
}

export function isThreadExportFormat(value: string): value is ThreadExportFormat {
  return value === "markdown" || value === "json";
}
