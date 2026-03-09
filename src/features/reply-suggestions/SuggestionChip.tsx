import type { Suggestion } from "./suggestions.types";

interface Props {
  suggestion: Suggestion;
  onSelect: () => void;
}

export function SuggestionChip({ suggestion, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Review ${suggestion.tone} reply suggestion`}
      className="suggestion-chip"
    >
      <div className="suggestion-chip__meta">
        <span className="suggestion-chip__tone">{suggestion.tone}</span>
        <span className="suggestion-chip__confidence">{suggestion.confidence}% match</span>
        <span className="suggestion-chip__length">{suggestion.lengthBucket}</span>
      </div>
      <p className="suggestion-chip__preview">{suggestion.preview}</p>
    </button>
  );
}
