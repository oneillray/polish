import { BASE_SYSTEM_PROMPT } from "../../lib/ai/basePrompts";
import type { SuggestionContext } from "./suggestions.types";

const TONE_SLOTS = [
  { tone: "Empathetic", instruction: "Warm, acknowledging, and reassuring." },
  { tone: "Direct", instruction: "Clear, concise, and solution-focused." },
] as const;

export function buildPromptForTone(
  context: SuggestionContext,
  tone: (typeof TONE_SLOTS)[number]["tone"]
) {
  const slot = TONE_SLOTS.find((s) => s.tone === tone);
  if (!slot) throw new Error(`Unknown tone: ${tone}`);
  return {
    system: `${BASE_SYSTEM_PROMPT}

You are generating a suggested email reply for a customer support agent.
Tone for this suggestion: ${slot.tone}. ${slot.instruction}
Respond ONLY with a JSON object — no preamble, no markdown fences:
{
  "reply_text": "<full reply>",
  "tone_label": "${slot.tone}",
  "confidence_score": <float 0.0–1.0>,
  "word_count": <integer>
}`,

    user: buildUserMessage(context),
  };
}

export function buildSuggestionPrompts(context: SuggestionContext) {
  return TONE_SLOTS.map(({ tone, instruction }) => ({
    system: `${BASE_SYSTEM_PROMPT}

You are generating a suggested email reply for a customer support agent.
Tone for this suggestion: ${tone}. ${instruction}
Respond ONLY with a JSON object — no preamble, no markdown fences:
{
  "reply_text": "<full reply>",
  "tone_label": "${tone}",
  "confidence_score": <float 0.0–1.0>,
  "word_count": <integer>
}`,

    user: buildUserMessage(context),
  }));
}

function buildUserMessage(ctx: SuggestionContext): string {
  const parts: string[] = [];

  parts.push(`EMAIL TO REPLY TO:\n${ctx.incomingEmail}`);

  if (ctx.threadHistory.length > 0) {
    parts.push(`THREAD HISTORY (oldest first):\n${ctx.threadHistory.join("\n---\n")}`);
  }

  if (ctx.agentPastReplies && ctx.agentPastReplies.length > 0) {
    const sample = ctx.agentPastReplies.slice(0, 3).join("\n---\n");
    parts.push(`AGENT'S PAST REPLY STYLE (samples):\n${sample}`);
  }

  if (ctx.crmData) {
    parts.push(`CRM CONTEXT:\n${JSON.stringify(ctx.crmData, null, 2)}`);
  }

  parts.push("Generate a suggested reply for this email.");

  return parts.join("\n\n");
}
