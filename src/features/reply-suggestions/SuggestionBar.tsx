import { SuggestionChip } from "./SuggestionChip";
import type { SuggestionState } from "./suggestions.types";

interface Props {
  state: SuggestionState;
  onSelectSuggestion: (id: string) => void;
  onDismiss: () => void;
  onRefresh: () => void;
}

export function SuggestionBar({
  state,
  onSelectSuggestion,
  onDismiss,
  onRefresh,
}: Props) {
  if (state.status === "idle" || state.status === "dismissed" || state.acceptedId !== null) {
    return null;
  }

  return (
    <div className="suggestion-bar" role="region" aria-label="AI reply suggestions">
      <div className="suggestion-bar__header">
        <span className="suggestion-bar__label">AI Suggestions</span>
        <div className="suggestion-bar__actions">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh suggestions"
            className="suggestion-bar__btn"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss suggestions"
            className="suggestion-bar__btn"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="suggestion-bar__chips">
        {state.status === "loading" && (
          <>
            <div
              className="suggestion-chip suggestion-chip--skeleton"
              aria-busy="true"
            />
            <div
              className="suggestion-chip suggestion-chip--skeleton"
              aria-busy="true"
            />
          </>
        )}

        {state.status === "success" &&
          state.suggestions.map((s) => (
            <SuggestionChip
              key={s.id}
              suggestion={s}
              onSelect={() => onSelectSuggestion(s.id)}
            />
          ))}

        {state.status === "error" && (
          <div className="suggestion-bar__error">
            {state.error}
            <button type="button" onClick={onRefresh} className="suggestion-bar__retry">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
