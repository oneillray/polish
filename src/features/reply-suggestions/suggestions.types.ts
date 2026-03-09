export type ToneLabel = "Empathetic" | "Direct" | "Formal" | "Concise";
export type LengthBucket = "Short" | "Medium" | "Long"; // <80w | 80-150w | >150w

export interface SuggestionContext {
  incomingEmail: string;
  threadHistory: string[];
  agentPastReplies?: string[];
  crmData?: Record<string, unknown>;
}

export interface Suggestion {
  id: string;
  fullText: string;
  preview: string;
  tone: ToneLabel;
  confidence: number;
  lengthBucket: LengthBucket;
  wordCount: number;
}

export type SuggestionStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "dismissed";

export interface SuggestionState {
  status: SuggestionStatus;
  suggestions: Suggestion[];
  error: string | null;
  acceptedId: string | null;
}
