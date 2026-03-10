import { describe, it, expect } from "vitest";
import {
  threadToSuggestionContext,
  formatRelativeTime,
  formatFullDate,
  getFirstLine,
} from "./emailThread.utils";
import type { MockEmail } from "./emailThread.types";

const makeEmail = (id: string, body: string): MockEmail => ({
  id,
  from: { name: "A", email: "a@x.com", role: "customer" },
  to: { name: "B", email: "b@x.com", role: "agent" },
  subject: "Sub",
  timestamp: "2026-03-06T09:00:00Z",
  body,
});

describe("threadToSuggestionContext", () => {
  it("returns empty incomingEmail and threadHistory when no emails", () => {
    const ctx = threadToSuggestionContext([]);
    expect(ctx.incomingEmail).toBe("");
    expect(ctx.threadHistory).toEqual([]);
  });

  it("uses last email as incomingEmail and rest as threadHistory", () => {
    const e1 = makeEmail("1", "First");
    const e2 = makeEmail("2", "Second");
    const ctx = threadToSuggestionContext([e1, e2]);
    expect(ctx.incomingEmail).toContain("Second");
    expect(ctx.incomingEmail).toContain("From: A (customer)");
    expect(ctx.threadHistory).toHaveLength(1);
    expect(ctx.threadHistory[0]).toContain("First");
  });

  it("includes threadHistory in oldest-first order", () => {
    const e1 = makeEmail("1", "One");
    const e2 = makeEmail("2", "Two");
    const e3 = makeEmail("3", "Three");
    const ctx = threadToSuggestionContext([e1, e2, e3]);
    expect(ctx.threadHistory[0]).toContain("One");
    expect(ctx.threadHistory[1]).toContain("Two");
    expect(ctx.incomingEmail).toContain("Three");
  });

  it("sets casePriority to Medium when emails.length < 4", () => {
    const emails = [makeEmail("1", "a"), makeEmail("2", "b"), makeEmail("3", "c")];
    const ctx = threadToSuggestionContext(emails);
    expect(ctx.crmData?.casePriority).toBe("Medium");
  });

  it("sets casePriority to High when emails.length >= 4", () => {
    const emails = [
      makeEmail("1", "a"),
      makeEmail("2", "b"),
      makeEmail("3", "c"),
      makeEmail("4", "d"),
    ];
    const ctx = threadToSuggestionContext(emails);
    expect(ctx.crmData?.casePriority).toBe("High");
  });
});

describe("formatRelativeTime", () => {
  it("returns a string for valid ISO date", () => {
    expect(formatRelativeTime("2026-03-06T09:00:00Z")).toBeDefined();
    expect(typeof formatRelativeTime("2026-03-06T09:00:00Z")).toBe("string");
  });
});

describe("formatFullDate", () => {
  it("formats ISO date to readable string", () => {
    const s = formatFullDate("2026-03-06T09:14:00Z");
    expect(s).toMatch(/\d{1,2}/);
    expect(s).toMatch(/Mar/);
    expect(s).toMatch(/2026/);
  });
});

describe("getFirstLine", () => {
  it("returns first non-empty line truncated to maxLen", () => {
    const body = "Hello world\n\nSecond line";
    expect(getFirstLine(body)).toBe("Hello world");
  });

  it("truncates with ellipsis when over maxLen", () => {
    const long = "a".repeat(100);
    expect(getFirstLine(long, 80).length).toBe(81);
    expect(getFirstLine(long, 80).endsWith("…")).toBe(true);
  });
});
