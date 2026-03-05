import { useEffect, useMemo, useRef, useState } from "react";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  GuxCard,
  GuxFormFieldTextLike,
  GuxList,
  GuxListItem,
  GuxPopup,
  GuxButton,
} from "genesys-spark-components-react";
import { polishEmail, type PolishMode } from "../../lib/gemini/polishEmail";
import { DiffReviewModal } from "../EmailComposer/DiffReviewModal";
import { SparkToolbar } from "../EmailComposer/SparkToolbar";

type PendingReview = {
  mode: PolishMode;
  original: string;
  polished: string;
};

const MODE_LABEL: Record<PolishMode, string> = {
  "fix-clean": "Fix & Clean",
  professional: "Professional",
  friendly: "Friendly",
  concise: "Concise",
};

const MODE_HELP: Record<PolishMode, string> = {
  "fix-clean": "Grammar & typos only (no tone changes).",
  "professional": "More formal, clearer, still factual.",
  "friendly": "Warmer and more casual, still professional.",
  "concise": "Shorter while preserving facts.",
};

export function EmailRectSelection() {
  const [to, setTo] = useState("alex@example.com");
  const [subject, setSubject] = useState("Dispute ID #VCB-99821-X");

  const [refinementCount, setRefinementCount] = useState(0);
  const [aiUndoStack, setAiUndoStack] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refinementsRemaining = Math.max(0, 3 - refinementCount);
  const canRefine = refinementCount < 3;

  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your email here...",
      }),
    ],
    content: `<p>Dear Customer</p>

        <p>I am writing to provide an update on your Dispute Case ID: #VCB-99821-X. Our merchant relations team has received a response from the vendor regarding the disputed amount of <$85.50.</p>

        <p>We have issued a provisional credit to your account #882910443. This credit will become permanent pending the final 30-day review period.</p>
        
            <p>Regards,<br>
            John Doe</p>`,
    editorProps: {
      attributes: {
        class: "sparkEditorProse",
      },
    },
  });

  const canAiUndo = aiUndoStack.length > 0;

  const helperText = useMemo(() => {
    if (isPolishing) return "Refining with AI…";
    if (error) return error;
    return "Select text to polish. You'll review changes before applying.";
  }, [error, isPolishing]);

  useEffect(() => {
    if (!editor) return;
    // Close the AI menu as selection changes (prevents stale anchoring).
    const handler = () => setAiMenuOpen(false);
    editor.on("selectionUpdate", handler);
    return () => {
      editor.off("selectionUpdate", handler);
    };
  }, [editor]);

  async function runRefineSelection(mode: PolishMode) {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;

    setError(null);
    setIsPolishing(true);
    setAiMenuOpen(false);
    try {
      const selectedText = editor.state.doc.textBetween(from, to, "\n\n");
      selectionRef.current = { from, to };
      const polished = await polishEmail(selectedText, mode);
      setPendingReview({ mode, original: selectedText, polished });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to refine text.";
      setError(message);
    } finally {
      setIsPolishing(false);
    }
  }

  async function handleRegenerate() {
    if (!editor || !pendingReview) return;
    const range = selectionRef.current;
    if (!range) return;
    setRegenerateError(null);
    setIsRegenerating(true);
    try {
      const selectedText = editor.state.doc.textBetween(range.from, range.to, "\n\n");
      const polished = await polishEmail(selectedText, pendingReview.mode);
      setRefinementCount((c) => Math.min(c + 1, 3));
      setPendingReview({ ...pendingReview, polished });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to refine text.";
      setRegenerateError(message);
    } finally {
      setIsRegenerating(false);
    }
  }

  function acceptPolish() {
    if (!editor) return;
    if (!pendingReview) return;
    const range = selectionRef.current;
    if (!range) return;

    setRefinementCount((c) => Math.min(c + 1, 3));
    setAiUndoStack((s) => [...s, editor.getHTML()]);
    editor
      .chain()
      .focus()
      .insertContentAt({ from: range.from, to: range.to }, pendingReview.polished)
      .run();
    setPendingReview(null);
  }

  function undoAi() {
    if (!editor) return;
    setAiUndoStack((s) => {
      if (s.length === 0) return s;
      const prevHtml = s[s.length - 1]!;
      editor.commands.setContent(prevHtml, false);
      return s.slice(0, -1);
    });
  }

  return (
    <GuxCard className="emailRect" accent="raised">
      <div className="emailRectInner">
        <div className="emailRectHeader">
          <div className="emailRectTitle">New message</div>
          {editor ? <SparkToolbar editor={editor} onAiUndo={undoAi} canAiUndo={canAiUndo} /> : null}
        </div>

        <div className="emailRectFields">
          <GuxFormFieldTextLike label-position="beside" className="emailRectField">
            <label slot="label">To</label>
            <input
              slot="input"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Add recipients"
            />
          </GuxFormFieldTextLike>

          <GuxFormFieldTextLike label-position="beside" className="emailRectField">
            <label slot="label">Subject</label>
            <input
              slot="input"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </GuxFormFieldTextLike>
        </div>

        <div className="emailRectBody">
          <div className="sparkEditorShell">
            {editor ? (
              <>
                <EditorContent editor={editor} />
                <BubbleMenu
                  editor={editor}
                  tippyOptions={{ duration: 120 }}
                  shouldShow={({ state }) => {
                    if (!canRefine) return false;
                    const { from, to } = state.selection;
                    if (from === to) return false;
                    const selected = state.doc.textBetween(from, to, "\n");
                    if (selected.trim().length === 0) return false;
                    return selected.length >= 50;
                  }}
                >
                  <div className="emailRectBubble">
                    <GuxPopup expanded={aiMenuOpen} placement="bottom-end" exceed-target-width>
                      <div slot="target">
                        <GuxButton
                          accent="secondary"
                          disabled={isPolishing || !canRefine}
                          onClick={() => setAiMenuOpen((v) => !v)}
                          title={!canRefine ? "Refinement limit reached" : undefined}
                        >
                          Polish
                        </GuxButton>
                      </div>

                      <div slot="popup" className="emailRectAiMenu">
                        {isPolishing ? (
                          <div className="emailRectAiMenuLoading">Working…</div>
                        ) : (
                          <GuxList>
                            {(Object.keys(MODE_LABEL) as PolishMode[]).map((mode) => (
                              <GuxListItem
                                key={mode}
                                onClick={() => runRefineSelection(mode)}
                              >
                                <div className="emailRectAiMenuItem">
                                  <div className="emailRectAiMenuItemTitle">
                                    {MODE_LABEL[mode]}
                                  </div>
                                  <div className="emailRectAiMenuItemHelp">
                                    {MODE_HELP[mode]}
                                  </div>
                                </div>
                              </GuxListItem>
                            ))}
                          </GuxList>
                        )}
                      </div>
                    </GuxPopup>
                  </div>
                </BubbleMenu>
              </>
            ) : null}
          </div>
          <div className="emailRectHint">
            {helperText}
            {canRefine && (
              <span className="refinementsRemaining">
                {" "}({refinementsRemaining} refinement{refinementsRemaining !== 1 ? "s" : ""} remaining)
              </span>
            )}
          </div>
        </div>
      </div>

      {pendingReview && editor && selectionRef.current ? (() => {
        const range = selectionRef.current;
        const fullBefore = editor.state.doc.textContent ?? "";
        const charStart = editor.state.doc.textBetween(0, range.from, "\n").length;
        const charEnd = editor.state.doc.textBetween(0, range.to, "\n").length;
        const fullAfter =
          fullBefore.slice(0, charStart) + pendingReview.polished + fullBefore.slice(charEnd);
        return (
          <DiffReviewModal
            title={`Review polish: ${MODE_LABEL[pendingReview.mode]}`}
            fullTextBefore={fullBefore}
            fullTextAfter={fullAfter}
            highlightStartBefore={charStart}
            highlightEndBefore={charEnd}
            highlightStartAfter={charStart}
            highlightEndAfter={charStart + pendingReview.polished.length}
            onCancel={() => setPendingReview(null)}
            onApply={acceptPolish}
            applyLabel="Accept"
            refinementsRemaining={refinementsRemaining}
            refinementsTotal={3}
            refinementType={pendingReview.mode}
            isRegenerating={isRegenerating}
            onRegenerate={handleRegenerate}
            onFeedback={(payload) => {
              /* TODO: send to analytics/backend */
              console.info("Refine feedback", payload);
            }}
            regenerateError={regenerateError}
          />
        );
      })() : null}
    </GuxCard>
  );
}
