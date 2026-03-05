import { useEffect, useRef, useState } from "react";
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { GuxButton, GuxCard, GuxModal } from "genesys-spark-components-react";
import type { PolishMode } from "../../lib/gemini/polishEmail";

export type FullContextDiffProps = {
  fullTextBefore: string;
  fullTextAfter: string;
  highlightStartBefore: number;
  highlightEndBefore: number;
  highlightStartAfter: number;
  highlightEndAfter: number;
};

export type RefineFeedbackPayload = {
  refinementType: PolishMode;
  thumbs: "up" | "down";
  accepted: boolean;
};

type Props = {
  title: string;
  onCancel: () => void;
  onApply: () => void;
  applyLabel?: string;
  /** Refinement usage: show "X of Y remaining" and enable Regenerate when provided */
  refinementsRemaining?: number;
  refinementsTotal?: number;
  /** Required for Regenerate and feedback; used in feedback payload */
  refinementType?: PolishMode;
  isRegenerating?: boolean;
  onRegenerate?: () => Promise<void>;
  onFeedback?: (payload: RefineFeedbackPayload) => void;
  /** Shown when regeneration fails */
  regenerateError?: string | null;
} & FullContextDiffProps;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function renderWithHighlight(
  text: string,
  start: number,
  end: number,
  className: string,
  highlightRef: React.RefObject<HTMLSpanElement>
) {
  const len = text.length;
  const s = clamp(start, 0, len);
  const e = clamp(end, s, len);
  const before = text.slice(0, s);
  const highlight = text.slice(s, e);
  const after = text.slice(e);
  return (
    <>
      {before}
      <span ref={highlightRef} className={className}>
        {highlight}
      </span>
      {after}
    </>
  );
}

const REFINEMENTS_TOTAL_DEFAULT = 3;

export function DiffReviewModal({
  title,
  fullTextBefore,
  fullTextAfter,
  highlightStartBefore,
  highlightEndBefore,
  highlightStartAfter,
  highlightEndAfter,
  onCancel,
  onApply,
  applyLabel = "Apply",
  refinementsRemaining = REFINEMENTS_TOTAL_DEFAULT,
  refinementsTotal = REFINEMENTS_TOTAL_DEFAULT,
  refinementType,
  isRegenerating = false,
  onRegenerate,
  onFeedback,
  regenerateError,
}: Props) {
  const beforeHighlightRef = useRef<HTMLSpanElement>(null!);
  const afterHighlightRef = useRef<HTMLSpanElement>(null!);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const beforeEl = beforeHighlightRef.current;
    const afterEl = afterHighlightRef.current;
    if (beforeEl) beforeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (afterEl) afterEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [fullTextBefore, fullTextAfter]);

  const canRegenerate = onRegenerate && refinementsRemaining > 0 && !isRegenerating;
  const isDisabled = isRegenerating;

  function submitFeedbackIfAny(accepted: boolean) {
    if (feedback && refinementType && onFeedback) {
      onFeedback({ refinementType, thumbs: feedback, accepted });
    }
  }

  function handleCancel() {
    submitFeedbackIfAny(false);
    onCancel();
  }

  function handleApply() {
    submitFeedbackIfAny(true);
    onApply();
  }

  async function handleRegenerate() {
    if (!canRegenerate || !onRegenerate) return;
    if (feedback && refinementType && onFeedback) {
      onFeedback({ refinementType, thumbs: feedback, accepted: false });
    }
    setFeedback(null);
    await onRegenerate();
  }

  const usageCounterVisible = refinementsRemaining !== undefined && refinementsTotal !== undefined;
  const usageLabel =
    refinementsRemaining === 0
      ? `0 of ${refinementsTotal} refinements remaining`
      : refinementsRemaining === 1
        ? "Last refinement"
        : `${refinementsRemaining} of ${refinementsTotal} refinements remaining`;

  return (
    <GuxModal open size="large" onGuxdismiss={handleCancel}>
      <div slot="title" className="guxModalTitle">
        {title}
        {usageCounterVisible && (
          <span className="diffModalUsageCounter" aria-live="polite">
            {usageLabel}
          </span>
        )}
      </div>

      <div slot="content">
        <div className="compare">
          <GuxCard accent="bordered" className="compareCard">
            <div className="gux-heading-md-semibold gux-text-color-primary">Original</div>
            <div className="pane color-primary diffPane">
              {renderWithHighlight(
                fullTextBefore,
                highlightStartBefore,
                highlightEndBefore,
                "diffHighlightBefore",
                beforeHighlightRef
              )}
            </div>
          </GuxCard>
          <GuxCard accent="bordered" className="compareCard">
            <div className="gux-heading-md-semibold gux-text-color-primary">Polished</div>
            <div className="pane color-primary diffPane">
              {renderWithHighlight(
                fullTextAfter,
                highlightStartAfter,
                highlightEndAfter,
                "diffHighlightAfter",
                afterHighlightRef
              )}
            </div>
            {!isRegenerating && (
              <div className="diffFeedbackRow">
                <span className="diffFeedbackLabel">Was this helpful?</span>
                <button
                  type="button"
                  className={`diffFeedbackBtn ${feedback === "up" ? "diffFeedbackBtnActive" : ""}`}
                  onClick={() => setFeedback((f) => (f === "up" ? null : "up"))}
                  aria-pressed={feedback === "up"}
                  aria-label="Thumbs up"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  type="button"
                  className={`diffFeedbackBtn ${feedback === "down" ? "diffFeedbackBtnActive" : ""}`}
                  onClick={() => setFeedback((f) => (f === "down" ? null : "down"))}
                  aria-pressed={feedback === "down"}
                  aria-label="Thumbs down"
                >
                  <ThumbsDown size={18} />
                </button>
              </div>
            )}
          </GuxCard>
        </div>

        {regenerateError && (
          <div className="diffRegenerateError" role="alert">
            {regenerateError}
          </div>
        )}

        <div className="diffDisclaimer">
          <Sparkles size={16} className="diffDisclaimerIcon" aria-hidden />
          <span>
            This content was generated by AI. Please review carefully before applying.
          </span>
        </div>
      </div>

      <div slot="end-align-buttons">
        {onRegenerate && (
          <GuxButton
            accent="secondary"
            disabled={!canRegenerate}
            onClick={() => void handleRegenerate()}
            title={
              refinementsRemaining === 0
                ? "You've used all 3 refinements"
                : isRegenerating
                  ? "Regenerating…"
                  : "Request a new refinement"
            }
          >
            {isRegenerating ? "Regenerating…" : "Regenerate"}
          </GuxButton>
        )}
        <GuxButton accent="secondary" onClick={handleCancel} disabled={isDisabled}>
          Discard
        </GuxButton>
        <GuxButton accent="primary" onClick={handleApply} disabled={isDisabled}>
          {applyLabel}
        </GuxButton>
      </div>
    </GuxModal>
  );
}
