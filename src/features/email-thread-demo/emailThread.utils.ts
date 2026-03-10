import type { SuggestionContext } from "../reply-suggestions/suggestions.types";
import type { MockEmail } from "./emailThread.types";

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return formatFullDate(iso);
}

export function formatFullDate(iso: string): string {
  const date = new Date(iso);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const h = date.getHours();
  const min = date.getMinutes();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days[date.getDay()]} ${d} ${m} ${y}, ${pad(h)}:${pad(min)}`;
}

export function getFirstLine(body: string, maxLen = 80): string {
  const lines = body.split(/\r?\n/);
  const first = lines.find((l) => l.trim().length > 0)?.trim() ?? "";
  if (first.length <= maxLen) return first;
  return first.slice(0, maxLen) + "…";
}

function formatEmailForContext(email: MockEmail): string {
  return [
    `From: ${email.from.name} (${email.from.role})`,
    `Date: ${email.timestamp}`,
    "",
    email.body,
  ].join("\n");
}

export function threadToSuggestionContext(emails: MockEmail[]): SuggestionContext {
  if (emails.length === 0) {
    return { incomingEmail: "", threadHistory: [] };
  }

  const latest = emails[emails.length - 1]!;
  const history = emails.slice(0, -1);

  return {
    incomingEmail: formatEmailForContext(latest),
    threadHistory: history.map(formatEmailForContext),
    agentPastReplies: [],
    crmData: {
      customerId: "CUST-JW-00123",
      customerName: "James Whitfield",
      accountTenure: "11 years",
      accountTier: "Standard",
      openCases: 1,
      caseReference: "IWT-88423",
      caseType: "International Wire Transfer Delay",
      casePriority: emails.length >= 4 ? "High" : "Medium",
    },
  };
}
