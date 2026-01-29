import { useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  GuxCard,
  GuxFormFieldTextLike,
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

export function EmailRectFull() {
  const [to, setTo] = useState("alex@example.com");
  const [subject, setSubject] = useState("Dispute ID #VCB-99821-X");

  const [aiUndoStack, setAiUndoStack] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectionRef = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your email here...",
      }),
    ],
    content: `<p>Hi Alex,</p>
<p>Just wanted to follow up on the proposal we discussed on Jan 10. Here's the link: https://example.com/proposal</p>
<p>Can we finalize by Friday?</p>
<p>Thanks,<br/>Ray</p>`,
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
    return "Click to polish entire draft. You'll review changes before applying.";
  }, [error, isPolishing]);

  async function runRefineFullText(mode: PolishMode) {
    if (!editor) return;
    const text = editor.state.doc.textContent ?? "";
    if (!text.trim()) return;

    setError(null);
    setIsPolishing(true);
    try {
      const docSize = editor.state.doc.content.size;
      selectionRef.current = { from: 0, to: docSize };
      const polished = await polishEmail(text, mode);
      setPendingReview({ mode, original: text, polished });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to refine text.";
      setError(message);
    } finally {
      setIsPolishing(false);
    }
  }

  function acceptPolish() {
    if (!editor) return;
    if (!pendingReview) return;
    const range = selectionRef.current;
    if (!range) return;

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
            {editor ? <EditorContent editor={editor} /> : null}
          </div>
          <div className="emailRectFullPolishAction">
            <GuxButton
              accent="primary"
              disabled={isPolishing}
              onClick={() => runRefineFullText("professional")}
            >
              Polish Entire Draft
            </GuxButton>
          </div>
          <div className="emailRectHint">{helperText}</div>
        </div>
      </div>

      {pendingReview ? (
        <DiffReviewModal
          title={`Review polish: ${MODE_LABEL[pendingReview.mode]}`}
          original={pendingReview.original}
          polished={pendingReview.polished}
          onCancel={() => setPendingReview(null)}
          onApply={acceptPolish}
          applyLabel="Accept"
        />
      ) : null}
    </GuxCard>
  );
}
