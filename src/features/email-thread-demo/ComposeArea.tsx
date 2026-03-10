import { useEffect, useRef, useState } from "react";
import { polishEmail } from "../../lib/gemini/polishEmail";
import {
  SuggestionBar,
  SuggestionReviewModal,
  useSuggestions,
} from "../reply-suggestions";
import type { SuggestionContext } from "../reply-suggestions/suggestions.types";

interface Props {
  threadId: string;
  context: SuggestionContext;
}

export function ComposeArea({ threadId, context }: Props) {
  const [draftValue, setDraftValue] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    state,
    onComposeFocus,
    selectSuggestionForReview,
    acceptSuggestion,
    rejectSuggestion,
    regenerateSuggestion,
    pendingReview,
    isRegenerating,
    regenerateError,
    dismiss,
    refresh,
  } = useSuggestions(threadId, context);

  const isFirstRender = useRef(true);
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    refresh();
  }, [context]);

  const handleAcceptSuggestion = () => {
    acceptSuggestion((text) => setDraftValue(text));
  };

  async function handleRefineDraft() {
    const trimmed = draftValue.trim();
    if (!trimmed || trimmed.length < 50) return;
    setIsRefining(true);
    try {
      const polished = await polishEmail(trimmed, "professional");
      setDraftValue(polished);
    } catch {
      // leave draft unchanged on error
    } finally {
      setIsRefining(false);
    }
  }

  return (
    <div className="compose-area">
      <SuggestionBar
        state={state}
        onSelectSuggestion={selectSuggestionForReview}
        onDismiss={dismiss}
        onRefresh={refresh}
      />

      {pendingReview && (
        <SuggestionReviewModal
          suggestion={pendingReview}
          currentDraftText={draftValue}
          onAccept={handleAcceptSuggestion}
          onReject={rejectSuggestion}
          onRegenerate={regenerateSuggestion}
          isRegenerating={isRegenerating}
          regenerateError={regenerateError}
        />
      )}

      <textarea
        ref={textareaRef}
        className="compose-area__field"
        placeholder="Write your reply..."
        value={draftValue}
        onChange={(e) => setDraftValue(e.target.value)}
        onFocus={onComposeFocus}
        readOnly={pendingReview !== null}
        rows={6}
        aria-label="Compose reply"
      />

      <div className="compose-area__toolbar">
        <button
          type="button"
          className="btn compose-area__refine"
          onClick={() => void handleRefineDraft()}
          disabled={isRefining || draftValue.trim().length < 50}
          title={
            draftValue.trim().length < 50
              ? "Enter at least 50 characters to refine"
              : "Refine draft with AI"
          }
        >
          {isRefining ? "Refining…" : "Refine with AI"}
        </button>
        <button type="button" className="btn btn--primary compose-area__send">
          Send
        </button>
      </div>
    </div>
  );
}
