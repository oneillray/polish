import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { parseSuggestionResponse } from "./suggestions.service";
import { buildSuggestionPrompts } from "./suggestions.prompts";
import { useSuggestions } from "./useSuggestions";
import type { SuggestionContext } from "./suggestions.types";

describe("parseSuggestionResponse", () => {
  it("parses valid JSON with all fields", () => {
    const raw = JSON.stringify({
      reply_text: "Thank you for reaching out. I've reviewed your case.",
      tone_label: "Empathetic",
      confidence_score: 0.94,
      word_count: 10,
    });
    const result = parseSuggestionResponse(raw, 0);
    expect(result.fullText).toBe(
      "Thank you for reaching out. I've reviewed your case."
    );
    expect(result.preview).toBe("Thank you for reaching out. I've reviewed your case.");
    expect(result.tone).toBe("Empathetic");
    expect(result.confidence).toBe(94);
    expect(result.wordCount).toBe(10);
    expect(result.lengthBucket).toBe("Short");
    expect(result.id).toMatch(/^suggestion-0-\d+$/);
  });

  it("parses JSON with markdown code fences", () => {
    const raw = '```json\n{"reply_text":"Hello world","tone_label":"Direct","confidence_score":0.8,"word_count":2}\n```';
    const result = parseSuggestionResponse(raw, 1);
    expect(result.fullText).toBe("Hello world");
    expect(result.tone).toBe("Direct");
    expect(result.confidence).toBe(80);
    expect(result.wordCount).toBe(2);
  });

  it("handles invalid JSON gracefully", () => {
    const raw = "not valid json at all";
    const result = parseSuggestionResponse(raw, 0);
    expect(result.fullText).toBe("not valid json at all");
    expect(result.tone).toBe("Direct");
    expect(result.confidence).toBe(50);
    expect(result.wordCount).toBeGreaterThanOrEqual(0);
  });

  it("computes lengthBucket correctly", () => {
    const short = parseSuggestionResponse(
      JSON.stringify({
        reply_text: "x ".repeat(79),
        tone_label: "Direct",
        confidence_score: 0.9,
        word_count: 79,
      }),
      0
    );
    expect(short.lengthBucket).toBe("Short");

    const medium = parseSuggestionResponse(
      JSON.stringify({
        reply_text: "x ".repeat(100),
        tone_label: "Direct",
        confidence_score: 0.9,
        word_count: 100,
      }),
      0
    );
    expect(medium.lengthBucket).toBe("Medium");

    const long = parseSuggestionResponse(
      JSON.stringify({
        reply_text: "x ".repeat(200),
        tone_label: "Direct",
        confidence_score: 0.9,
        word_count: 200,
      }),
      0
    );
    expect(long.lengthBucket).toBe("Long");
  });

  it("truncates preview to 12 words", () => {
    const words = Array(20).fill("word").join(" ");
    const raw = JSON.stringify({
      reply_text: words,
      tone_label: "Direct",
      confidence_score: 0.9,
      word_count: 20,
    });
    const result = parseSuggestionResponse(raw, 0);
    expect(result.preview).toBe(
      Array(12).fill("word").join(" ") + "..."
    );
  });
});

describe("buildSuggestionPrompts", () => {
  it("returns 2 prompts for Empathetic and Direct tones", () => {
    const ctx: SuggestionContext = {
      incomingEmail: "Customer email body",
      threadHistory: [],
    };
    const prompts = buildSuggestionPrompts(ctx);
    expect(prompts).toHaveLength(2);
    expect(prompts[0]!.system).toContain("Empathetic");
    expect(prompts[0]!.system).toContain("Warm, acknowledging");
    expect(prompts[1]!.system).toContain("Direct");
    expect(prompts[1]!.system).toContain("Clear, concise");
  });

  it("includes incoming email in user message", () => {
    const ctx: SuggestionContext = {
      incomingEmail: "Hello, I need help with my account.",
      threadHistory: [],
    };
    const prompts = buildSuggestionPrompts(ctx);
    expect(prompts[0]!.user).toContain("Hello, I need help with my account.");
  });

  it("includes thread history when provided", () => {
    const ctx: SuggestionContext = {
      incomingEmail: "Latest message",
      threadHistory: ["First message", "Second message"],
    };
    const prompts = buildSuggestionPrompts(ctx);
    expect(prompts[0]!.user).toContain("THREAD HISTORY");
    expect(prompts[0]!.user).toContain("First message");
    expect(prompts[0]!.user).toContain("Second message");
  });

  it("includes BASE_SYSTEM_PROMPT in system message", () => {
    const ctx: SuggestionContext = {
      incomingEmail: "Test",
      threadHistory: [],
    };
    const prompts = buildSuggestionPrompts(ctx);
    expect(prompts[0]!.system).toContain("professional email editor");
    expect(prompts[0]!.system).toContain("Hard constraints");
  });
});

describe("useSuggestions", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn() as typeof fetch);
  });

  it("starts in idle status", () => {
    const ctx: SuggestionContext = {
      incomingEmail: "Test email",
      threadHistory: [],
    };
    const { result } = renderHook(() => useSuggestions("thread-1", ctx));
    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.suggestions).toEqual([]);
  });

  it("fetches suggestions on onComposeFocus", async () => {
    const mockSuggestions = [
      {
        id: "s1",
        fullText: "Suggestion 1",
        preview: "Suggestion 1",
        tone: "Empathetic" as const,
        confidence: 90,
        lengthBucket: "Short" as const,
        wordCount: 2,
      },
    ];

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: JSON.stringify({
          reply_text: "Suggestion 1",
          tone_label: "Empathetic",
          confidence_score: 0.9,
          word_count: 2,
        }),
      }),
    });
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: JSON.stringify({
          reply_text: "Suggestion 2",
          tone_label: "Direct",
          confidence_score: 0.85,
          word_count: 2,
        }),
      }),
    });

    const ctx: SuggestionContext = {
      incomingEmail: "Customer message",
      threadHistory: [],
    };
    const { result } = renderHook(() => useSuggestions("thread-1", ctx));

    await act(async () => {
      result.current.onComposeFocus();
    });

    expect(result.current.state.status).toBe("success");
    expect(result.current.state.suggestions).toHaveLength(2);
    expect(result.current.state.suggestions[0]!.tone).toBe("Empathetic");
    expect(result.current.state.suggestions[1]!.tone).toBe("Direct");
  });

  it("dismiss sets status to dismissed", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: JSON.stringify({
          reply_text: "Test reply",
          tone_label: "Direct",
          confidence_score: 0.9,
          word_count: 2,
        }),
      }),
    });

    const ctx: SuggestionContext = {
      incomingEmail: "Test",
      threadHistory: [],
    };
    const { result } = renderHook(() => useSuggestions("thread-1", ctx));

    await act(async () => {
      result.current.onComposeFocus();
    });

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.state.status).toBe("dismissed");
  });
});
