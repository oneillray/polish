import { useState, useCallback, useRef } from "react";
import {
  generateSuggestions,
  generateSuggestionForTone,
} from "./suggestions.service";
import type {
  SuggestionContext,
  SuggestionState,
  Suggestion,
} from "./suggestions.types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  suggestions: Suggestion[];
  timestamp: number;
}

const suggestionCache = new Map<string, CacheEntry>();

function trackEvent(name: string, props: Record<string, unknown>) {
  console.debug("[suggestion]", name, props);
}

export function useSuggestions(threadId: string, context: SuggestionContext) {
  const [state, setState] = useState<SuggestionState>({
    status: "idle",
    suggestions: [],
    error: null,
    acceptedId: null,
  });
  const [pendingReview, setPendingReview] = useState<Suggestion | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  const hasTriggered = useRef(false);
  const inFlight = useRef(false);

  const fetchSuggestions = useCallback(async () => {
    if (hasTriggered.current || inFlight.current) return;
    hasTriggered.current = true;
    inFlight.current = true;

    const cached = suggestionCache.get(threadId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setState({
        status: "success",
        suggestions: cached.suggestions,
        error: null,
        acceptedId: null,
      });
      inFlight.current = false;
      return;
    }

    setState((s) => ({ ...s, status: "loading" }));

    try {
      const suggestions = await generateSuggestions(context);
      suggestionCache.set(threadId, { suggestions, timestamp: Date.now() });
      setState({
        status: "success",
        suggestions,
        error: null,
        acceptedId: null,
      });
    } catch {
      setState({
        status: "error",
        suggestions: [],
        error: "Failed to generate suggestions.",
        acceptedId: null,
      });
    } finally {
      inFlight.current = false;
    }
  }, [threadId, context]);

  const selectSuggestionForReview = useCallback((id: string) => {
    const match = state.suggestions.find((s) => s.id === id);
    if (!match) return;
    setPendingReview(match);
    setRegenerateError(null);
  }, [state.suggestions]);

  const acceptSuggestion = useCallback(
    (onPopulate: (text: string) => void) => {
      if (!pendingReview) return;
      onPopulate(pendingReview.fullText);
      setState((s) => ({ ...s, acceptedId: pendingReview.id }));
      trackEvent("suggestion_accepted", {
        suggestionId: pendingReview.id,
        tone: pendingReview.tone,
        threadId,
      });
      setPendingReview(null);
    },
    [pendingReview, threadId]
  );

  const rejectSuggestion = useCallback(() => {
    setPendingReview(null);
    setRegenerateError(null);
  }, []);

  const regenerateSuggestion = useCallback(async () => {
    if (!pendingReview) return;
    if (pendingReview.tone !== "Empathetic" && pendingReview.tone !== "Direct") {
      setRegenerateError("Regenerate is only available for Empathetic or Direct suggestions.");
      return;
    }
    setRegenerateError(null);
    setIsRegenerating(true);
    try {
      const newSuggestion = await generateSuggestionForTone(
        context,
        pendingReview.tone
      );
      setPendingReview(newSuggestion);
    } catch (e) {
      setRegenerateError(
        e instanceof Error ? e.message : "Failed to regenerate suggestion."
      );
    } finally {
      setIsRegenerating(false);
    }
  }, [pendingReview, context]);

  const dismiss = useCallback(() => {
    setState((s) => ({ ...s, status: "dismissed" }));
    trackEvent("suggestion_dismissed", { threadId });
  }, [threadId]);

  const refresh = useCallback(() => {
    suggestionCache.delete(threadId);
    hasTriggered.current = false;
    fetchSuggestions();
  }, [threadId, fetchSuggestions]);

  return {
    state,
    onComposeFocus: fetchSuggestions,
    selectSuggestionForReview,
    acceptSuggestion,
    rejectSuggestion,
    regenerateSuggestion,
    pendingReview,
    isRegenerating,
    regenerateError,
    dismiss,
    refresh,
  };
}
