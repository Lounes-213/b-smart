import { describe, expect, it, vi } from "vitest";
import type { TimelineRow } from "@bb/server-contract";
import { conversationRow, turnRow } from "@/test/fixtures/thread-timeline-rows";
import {
  buildThreadExportFileName,
  buildThreadJsonExport,
  buildThreadMarkdownExport,
  collectThreadExportMessages,
  loadAllThreadTimelineRows,
  type ThreadTimelinePage,
} from "./thread-export";

const EXPORTED_AT = new Date("2026-11-03T19:00:00.000Z");

describe("collectThreadExportMessages", () => {
  it("flattens turn children, deduplicates by message sequence, and sorts", () => {
    const rows: TimelineRow[] = [
      conversationRow({ role: "user", seq: 2, text: "second" }),
      turnRow({
        seq: 5,
        children: [
          conversationRow({ role: "assistant", seq: 4, text: "third" }),
          conversationRow({ role: "user", seq: 1, text: "first" }),
          conversationRow({ role: "user", seq: 1, text: "first duplicate" }),
        ],
      }),
    ];

    expect(
      collectThreadExportMessages(rows).map((message) => message.text),
    ).toEqual(["first", "second", "third"]);
  });

  it("skips rows that are not conversation rows", () => {
    expect(collectThreadExportMessages([turnRow({ seq: 1 })])).toEqual([]);
  });
});

describe("buildThreadMarkdownExport", () => {
  it("writes a titled transcript with one section per message", () => {
    const markdown = buildThreadMarkdownExport({
      threadId: "thr_1",
      title: "Fix the parser",
      exportedAt: EXPORTED_AT,
      messages: collectThreadExportMessages([
        conversationRow({ role: "user", seq: 1, text: "Fix it" }),
        conversationRow({ role: "assistant", seq: 2, text: "Done." }),
      ]),
    });

    expect(markdown).toContain("# Fix the parser");
    expect(markdown).toContain("- Thread: `thr_1`");
    expect(markdown).toContain("- Messages: 2");
    expect(markdown).toContain("### User ·");
    expect(markdown).toContain("### Assistant ·");
    expect(markdown).toContain("Fix it");
    expect(markdown).toContain("Done.");
  });
});

describe("buildThreadJsonExport", () => {
  it("serializes messages with ISO timestamps", () => {
    const parsed = JSON.parse(
      buildThreadJsonExport({
        threadId: "thr_1",
        title: "Fix the parser",
        exportedAt: EXPORTED_AT,
        messages: collectThreadExportMessages([
          conversationRow({
            role: "user",
            seq: 1,
            createdAt: Date.UTC(2026, 10, 3, 12, 30),
            text: "Fix it",
          }),
        ]),
      }),
    );

    expect(parsed).toMatchObject({
      version: 1,
      threadId: "thr_1",
      title: "Fix the parser",
      exportedAt: "2026-11-03T19:00:00.000Z",
      messages: [
        {
          role: "user",
          messageSeq: 1,
          createdAt: "2026-11-03T12:30:00.000Z",
          text: "Fix it",
        },
      ],
    });
  });
});

describe("buildThreadExportFileName", () => {
  it("slugifies the title and picks the extension", () => {
    expect(buildThreadExportFileName("Fix the parser!", "markdown")).toBe(
      "fix-the-parser.md",
    );
    expect(buildThreadExportFileName("Fix the parser!", "json")).toBe(
      "fix-the-parser.json",
    );
  });

  it("falls back when the title has no latin characters", () => {
    expect(buildThreadExportFileName("إصلاح", "markdown")).toBe("thread.md");
  });
});

describe("loadAllThreadTimelineRows", () => {
  it("walks older pages until the server stops returning a cursor", async () => {
    const pages: Record<string, ThreadTimelinePage> = {
      latest: {
        rows: [conversationRow({ seq: 3, text: "third" })],
        olderCursor: { anchorSeq: 3, anchorId: "row_3" },
      },
      "3": {
        rows: [conversationRow({ seq: 2, text: "second" })],
        olderCursor: { anchorSeq: 2, anchorId: "row_2" },
      },
      "2": {
        rows: [conversationRow({ seq: 1, text: "first" })],
        olderCursor: null,
      },
    };
    const fetchPage = vi.fn(
      async ({
        beforeAnchorSeq,
      }: {
        threadId: string;
        beforeAnchorSeq?: string;
      }): Promise<ThreadTimelinePage> =>
        pages[beforeAnchorSeq ?? "latest"] ?? { rows: [], olderCursor: null },
    );

    const rows = await loadAllThreadTimelineRows("thr_1", fetchPage);

    expect(
      collectThreadExportMessages(rows).map((message) => message.text),
    ).toEqual(["first", "second", "third"]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });
});
