import { useEffect, useMemo, useRef, useState } from "react";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  GuxActionButton,
  GuxCard,
  GuxFormFieldTextLike,
  GuxList,
  GuxListItem,
  GuxPopup,
  GuxButton,
  GuxToggle,
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

export function EmailRect() {
  const [to, setTo] = useState("alex@example.com");
  const [subject, setSubject] = useState("Following up on proposal");

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
  const [polishScope, setPolishScope] = useState<"selection" | "full">("selection");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your email here...",
      }),
    ],
    content: `Subject: Re: Issues with Your NovaPay Banking App Account – Full Resolution & Next Steps [Ticket #NPB-847291]

Dear Mr. Harrison,

Thank you so much for reaching out to NovaPay Customer Support, and I sincerely apologize for the inconvenience and frustration you have experienced over the past several days. My name is Sarah Mitchell, and I am a Senior Customer Support Specialist here at NovaPay. I have thoroughly reviewed your account, your submitted screenshots, and the full history of your previous interactions with our team, and I want to assure you that I am personally overseeing your case until every issue is fully resolved.

I understand that you have raised a number of concerns, and I want to address each one of them clearly and in detail so that you have full transparency into what has happened, what we are doing to fix it, and what you can expect going forward.

──────────────────────────────────────
1. FAILED TRANSACTION ON MARCH 1ST – REF #TXN-20293847
──────────────────────────────────────

You reported that a payment of $1,247.00 to Greenfield Property Management was attempted on March 1st but was marked as "Failed" in your transaction history, despite the funds appearing to have left your account temporarily before being returned.

After reviewing our internal payment processing logs, I can confirm that this was caused by a timeout error between our payment gateway and the recipient's banking institution. The funds were placed in a temporary hold state for approximately 6 hours before being automatically returned to your available balance. As of this morning, the full $1,247.00 has been credited back to your NovaPay current account, and you should be able to see this reflected in your balance immediately.

To ensure this payment reaches Greenfield Property Management without further issues, I would recommend initiating a fresh transfer at your earliest convenience. If the issue recurs, please do not retry the transaction — instead, contact us immediately so we can escalate directly to our payments infrastructure team.

Additionally, as a gesture of goodwill for the disruption this caused, I have applied a $15.00 courtesy credit to your account, which will appear within 1–2 business days.

──────────────────────────────────────
2. TWO-FACTOR AUTHENTICATION (2FA) ISSUES
──────────────────────────────────────

You mentioned that you have been repeatedly prompted to re-verify your identity via two-factor authentication (2FA) every time you log in, even on devices you have previously marked as trusted. I completely understand how disruptive this is, especially when you need quick access to your account.

Our security team identified that a routine fraud-prevention update rolled out on February 28th inadvertently cleared the "trusted device" registry for a subset of users, which appears to include your account. This was not intentional and was an unintended side effect of the security patch.

To resolve this, I have manually flagged your account for re-enrollment. Here is what I recommend you do:

   a) Log in to the NovaPay app on your primary device.
   b) When prompted for 2FA, complete the verification as usual.
   c) On the next screen, you will see a new option: "Remember this device for 90 days" — please select this and confirm.
   d) Repeat this step on any secondary devices you use regularly.

If after following these steps you are still being prompted every session, please reply to this email and I will escalate to our device authentication engineering team directly.

──────────────────────────────────────
3. MISSING TRANSACTION HISTORY FROM FEBRUARY
──────────────────────────────────────

You noted that several transactions from late February (specifically between February 18th–24th) are not visible in your in-app transaction history, though you believe they were processed correctly at the time.

I want to reassure you: your transaction data has not been lost. This is a known display bug affecting users on iOS version 17.3.1 who updated the NovaPay app to version 4.6.2. The transactions exist on our servers and are fully intact — they are simply not rendering correctly in the app's transaction list view.

Our development team has released a patch (version 4.6.3) that directly addresses this. Please follow these steps:

   1) Open the App Store and navigate to the NovaPay app.
   2) Tap "Update" to install version 4.6.3.
   3) Force-close and reopen the app.
   4) Navigate to Accounts > Transaction History and set the date filter to "Last 3 Months."

Your February transactions should now be fully visible. If they are not, please reply and I will manually generate a full PDF account statement for the month of February and send it to your registered email address at no charge.

──────────────────────────────────────
4. OVERDRAFT PROTECTION — UNEXPECTED FEE
──────────────────────────────────────

You also queried a $34.00 Overdraft Protection fee that appeared on your account on February 26th, which you believe was applied in error.

Having reviewed your account terms and the specific transaction in question, I can see that your balance briefly dipped below $0.00 by $4.12 for a period of approximately 3 hours on February 26th before your scheduled payroll deposit arrived later that day. Under your current account plan (NovaPay Flex Standard), our Overdraft Protection feature automatically covers shortfalls up to $500.00, and a flat fee of $34.00 applies per instance, as outlined in your terms and conditions.

That said, given that this was a very minor and brief shortfall, and in light of the other difficulties you have experienced recently, I am happy to submit a one-time fee waiver request on your behalf. I have already submitted this to our billing department (Waiver Reference: WVR-00481), and you should see the $34.00 refunded within 3–5 business days.

I would also like to draw your attention to our NovaPay Flex Plus plan, which includes a $50 no-fee overdraft buffer with zero charges for shortfalls under that threshold. Given your account activity, this may be worth considering — I can send you a full plan comparison document if you would like.

──────────────────────────────────────
5. IN-APP CUSTOMER CHAT NOT LOADING
──────────────────────────────────────

Finally, you mentioned that the in-app live chat feature has not been loading for the past week, which is why you ultimately resorted to emailing us. I am truly sorry about this — our in-app support channel is something we take very seriously, and this failure put you in a difficult position.

This issue is related to a third-party chat SDK integration that experienced an outage beginning February 27th. Our technical team has been working with the vendor to resolve this, and I am pleased to let you know that full functionality was restored as of this morning, March 5th. You should now be able to access live chat normally within the app.

──────────────────────────────────────
SUMMARY OF ACTIONS TAKEN
──────────────────────────────────────

For your reference, here is a summary of everything I have done on your behalf today:

   ✔ Confirmed $1,247.00 failed transaction has been fully returned to your account
   ✔ Applied $15.00 goodwill credit (arriving within 1–2 business days)
   ✔ Flagged your account for trusted device re-enrollment
   ✔ Confirmed your February transaction data is intact; patch 4.6.3 resolves the display issue
   ✔ Submitted $34.00 overdraft fee waiver (Ref: WVR-00481; 3–5 business days)
   ✔ Confirmed in-app live chat is now fully restored

──────────────────────────────────────
NEXT STEPS
──────────────────────────────────────

I will personally follow up with you in 5 business days to confirm that all of the above resolutions are working as expected. In the meantime, please do not hesitate to reply directly to this email — your response will come straight to me and will not be re-routed to the general support queue.

Thank you for your patience, Mr. Harrison. I know it has been a frustrating experience, and I genuinely appreciate you giving us the opportunity to make this right. At NovaPay, we hold ourselves to a high standard when it comes to the reliability and security of our platform, and incidents like this help us identify and fix gaps that should never have reached our customers in the first place.

Warmest regards,

Sarah Mitchell
Senior Customer Support Specialist
NovaPay Banking | Customer Experience Team
Direct Line: 1-800-668-2291 ext. 4417
Email: s.mitchell@novapay-support.com
Monday–Friday, 8:00 AM – 7:00 PM EST

Ticket Reference: #NPB-847291
Case Priority: High
Next Follow-Up: March 10, 2026

─────────────────────────────────────────────────────────
This email and any attachments are confidential and intended solely for the named recipient. If you have received this email in error, please notify us immediately and delete it from your system. NovaPay is regulated by the Financial Conduct Authority (FCA). NovaPay Inc., 200 Financial Plaza, New York, NY 10005.
─────────────────────────────────────────────────────────`,
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
    return "Select text to polish. You’ll review changes before applying.";
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

  const fullTextLength = editor?.state.doc.textContent?.length ?? 0;
  const canPolishFull =
    canRefine &&
    fullTextLength >= 50 &&
    (editor?.state.doc.textContent?.trim().length ?? 0) > 0;

  async function runRefineFullText(mode: PolishMode) {
    if (!editor) return;
    const text = editor.state.doc.textContent ?? "";
    if (!text.trim() || text.length < 50) return;

    setError(null);
    setIsPolishing(true);
    setAiMenuOpen(false);
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

  function refineForScope(mode: PolishMode) {
    if (polishScope === "selection") {
      return runRefineSelection(mode);
    }
    return runRefineFullText(mode);
  }

  async function handleRegenerate() {
    if (!editor || !pendingReview) return;
    const range = selectionRef.current;
    if (!range) return;
    setRegenerateError(null);
    setIsRegenerating(true);
    try {
      const docSize = editor.state.doc.content.size;
      const isFullDraft = range.from === 0 && range.to === docSize;
      if (isFullDraft) {
        const text = editor.state.doc.textContent ?? "";
        const polished = await polishEmail(text, pendingReview.mode);
        setRefinementCount((c) => Math.min(c + 1, 3));
        setPendingReview({ ...pendingReview, polished });
      } else {
        const selectedText = editor.state.doc.textBetween(range.from, range.to, "\n\n");
        const polished = await polishEmail(selectedText, pendingReview.mode);
        setRefinementCount((c) => Math.min(c + 1, 3));
        setPendingReview({ ...pendingReview, polished });
      }
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
        <div className="modeToggleWrapper">
          <GuxToggle
            checked={polishScope === "full"}
            checkedLabel="Full draft"
            uncheckedLabel="Selection"
            label="Polish mode"
            label-position="left"
            onCheck={(event: CustomEvent<boolean>) => setPolishScope(event.detail ? "full" : "selection")}
          />
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
                    if (!canRefine || polishScope !== "selection") return false;
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
                            onClick={() => refineForScope(mode)}
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
          {editor && polishScope === "full" ? (
            <div className="emailRectFullPolishAction">
              <GuxButton
                accent="primary"
                disabled={isPolishing || !canPolishFull}
                onClick={() => runRefineFullText("professional")}
                title={
                  !canRefine
                    ? "Refinement limit reached"
                    : fullTextLength < 50
                      ? "Select at least 50 characters to use AI Refine"
                      : undefined
                }
              >
                Polish Entire Draft
              </GuxButton>
            </div>
          ) : null}
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
              console.info("Refine feedback", payload);
            }}
            regenerateError={regenerateError}
          />
        );
      })() : null}
    </GuxCard>
  );
}

