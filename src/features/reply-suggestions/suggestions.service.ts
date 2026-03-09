import { buildSuggestionPrompts, buildPromptForTone } from "./suggestions.prompts";
import type { SuggestionContext, Suggestion } from "./suggestions.types";

const SUGGESTION_TIMEOUT_MS = 5000;
const ENDPOINT = "/api/suggestions";

const REGENERATABLE_TONES = ["Empathetic", "Direct"] as const;

export async function generateSuggestionForTone(
  context: SuggestionContext,
  tone: (typeof REGENERATABLE_TONES)[number]
): Promise<Suggestion> {
  const prompt = buildPromptForTone(context, tone);
  const res = await Promise.race([
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: prompt.system, user: prompt.user }),
    }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text().catch(() => `Request failed (${r.status})`));
      const data = (await r.json()) as { content?: string };
      return data.content ?? "";
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Suggestion timeout")), SUGGESTION_TIMEOUT_MS)
    ),
  ]);
  return parseSuggestionResponse(res, 0);
}

export async function generateSuggestions(context: SuggestionContext): Promise<Suggestion[]> {
  const prompts = buildSuggestionPrompts(context);

  const requests = prompts.map((prompt) =>
    Promise.race([
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: prompt.system, user: prompt.user }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.text().catch(() => "");
          throw new Error(err || `Request failed (${res.status})`);
        }
        const data = (await res.json()) as { content?: string };
        return data.content ?? "";
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Suggestion timeout")), SUGGESTION_TIMEOUT_MS)
      ),
    ])
  );

  const results = await Promise.allSettled(requests);

  return results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
    .map((r, i) => parseSuggestionResponse(r.value, i));
}

export function parseSuggestionResponse(raw: string, index: number): Suggestion {
  let parsed: Record<string, unknown>;
  let content = raw.trim();

  // Strip markdown code fences if present
  const fenceMatch = content.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) {
    content = fenceMatch[1]!.trim();
  }

  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    parsed = { reply_text: raw, tone_label: "Direct", confidence_score: 0.5, word_count: 0 };
  }

  const replyText = String(parsed.reply_text ?? "").trim();
  const words = replyText ? replyText.split(/\s+/) : [];
  const wordCount = typeof parsed.word_count === "number" ? parsed.word_count : words.length;

  return {
    id: `suggestion-${index}-${Date.now()}`,
    fullText: replyText,
    preview: words.slice(0, 12).join(" ") + (words.length > 12 ? "..." : ""),
    tone: (parsed.tone_label as Suggestion["tone"]) ?? "Direct",
    confidence: Math.round((Number(parsed.confidence_score) ?? 0.5) * 100),
    wordCount,
    lengthBucket:
      wordCount < 80 ? "Short" : wordCount <= 150 ? "Medium" : "Long",
  };
}
