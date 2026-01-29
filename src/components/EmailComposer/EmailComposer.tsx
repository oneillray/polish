import { useMemo, useRef, useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { polishEmail, type PolishMode } from "../../lib/gemini/polishEmail";
import { DiffReviewModal } from "./DiffReviewModal";
import sampleEmailsData from "../../data/sample-emails.json";

type PendingReview = {
  mode: PolishMode;
  original: string;
  polished: string;
};

type SampleEmail = {
  subject: string;
  agent_email: string;
  content: string;
};

const MODE_LABEL: Record<PolishMode, string> = {
  "fix-clean": "Fix & Clean",
  professional: "Professional",
  friendly: "Friendly",
  concise: "Concise",
};

// Helper function to get a random email
function getRandomEmail(emails: SampleEmail[]): { email: SampleEmail; index: number } {
  const randomIndex = Math.floor(Math.random() * emails.length);
  return { email: emails[randomIndex]!, index: randomIndex };
}

export function EmailComposer() {
  const sampleEmails = sampleEmailsData as SampleEmail[];
  
  // Compute initial email once using a ref to ensure it's the same across all useState calls
  const initialEmailRef = useRef<{ email: SampleEmail; index: number } | null>(null);
  if (!initialEmailRef.current) {
    initialEmailRef.current = getRandomEmail(sampleEmails);
  }
  const initialEmail = initialEmailRef.current;
  
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(initialEmail.index);
  const [subject, setSubject] = useState<string>(initialEmail.email.subject);
  const [agentEmail, setAgentEmail] = useState<string>(initialEmail.email.agent_email);
  const [text, setText] = useState<string>(initialEmail.email.content);
  const [aiUndoStack, setAiUndoStack] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [bubbleOpen, setBubbleOpen] = useState(false);
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canAiUndo = aiUndoStack.length > 0;
  const canRefineSelection = text.trim().length > 0 && !isPolishing;

  function loadSampleEmail(index: number) {
    if (index < 0 || index >= sampleEmails.length) return;
    const email = sampleEmails[index];
    setSubject(email.subject);
    setAgentEmail(email.agent_email);
    setText(email.content);
    setSelectedEmailIndex(index);
    setAiUndoStack([]); // Clear undo stack when loading new email
  }

  const helperText = useMemo(() => {
    if (isPolishing) return "Refining with Gemini…";
    if (error) return error;
    return "AI suggestions are reviewed before applying. Undo is always available.";
  }, [error, isPolishing]);

  async function runRefineSelection(mode: PolishMode) {
    const el = textareaRef.current;
    if (!el) return;
    const from = el.selectionStart ?? 0;
    const to = el.selectionEnd ?? 0;
    if (from === to) return;

    setError(null);
    setIsPolishing(true);
    setBubbleOpen(false);
    try {
      const selectedText = text.slice(from, to);
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

  function acceptPolish() {
    if (!pendingReview) return;
    const range = selectionRef.current;
    if (!range) return;

    setAiUndoStack((s) => [...s, text]);
    const next = text.slice(0, range.from) + pendingReview.polished + text.slice(range.to);
    setText(next);

    setPendingReview(null);
  }

  function undoAi() {
    setAiUndoStack((s) => {
      if (s.length === 0) return s;
      const prevText = s[s.length - 1]!;
      setText(prevText);
      return s.slice(0, -1);
    });
  }

  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <div className="label">Composer</div>
        </div>

        <div className="row">
          <select
            className="btn"
            value={selectedEmailIndex ?? ""}
            onChange={(e) => {
              const index = e.target.value === "" ? null : parseInt(e.target.value, 10);
              if (index !== null) {
                loadSampleEmail(index);
              } else {
                setSelectedEmailIndex(null);
              }
            }}
            style={{ marginRight: 8, padding: "6px 12px" }}
          >
            <option value="">Load sample email...</option>
            {sampleEmails.map((email, index) => (
              <option key={index} value={index}>
                {email.subject}
              </option>
            ))}
          </select>
          <button className="btn" onClick={undoAi} disabled={!canAiUndo || isPolishing} type="button">
            Undo AI
          </button>
        </div>
      </div>

      <div className="composerBody">
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", fontWeight: 600 }}>
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: "14px", fontWeight: 600 }}>
            Agent Email
          </label>
          <input
            type="email"
            value={agentEmail}
            onChange={(e) => setAgentEmail(e.target.value)}
            placeholder="agent@example.com"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <label style={{ display: "block", marginBottom: 4, fontSize: "14px", fontWeight: 600 }}>
          Email Content
        </label>
        <textarea
          ref={textareaRef}
          className="sparkPlainTextarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your email here..."
        />

        <div className="row" style={{ marginTop: 10, justifyContent: "flex-end" }}>
          <button
            className="sparkIconButton"
            type="button"
            onClick={() => setBubbleOpen((v) => !v)}
            disabled={!canRefineSelection}
            aria-haspopup="menu"
            aria-expanded={bubbleOpen}
            title="AI polish selection"
          >
            <Sparkles size={16} />
            <ChevronDown size={14} />
          </button>
          {bubbleOpen ? (
            <div className="sparkMenu" role="menu">
              <div className="sparkMenuTitle">Polish selection</div>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("fix-clean")}>
                Fix & Clean
              </button>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("professional")}>
                Professional
              </button>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("friendly")}>
                Friendly
              </button>
              <button className="sparkMenuItem" type="button" onClick={() => runRefineSelection("concise")}>
                Concise
              </button>
              {isPolishing ? (
                <div className="sparkSpinnerRow">
                  <span className="sparkSpinner" /> Working…
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="hint" style={{ marginTop: 10 }}>
          {helperText}
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
    </section>
  );
}

