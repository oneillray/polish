import { useMemo } from "react";
import { ComposeArea } from "./ComposeArea";
import { EmailThread } from "./EmailThread";
import { threadToSuggestionContext } from "./emailThread.utils";
import type { ScenarioId } from "./mockThread";
import { useThreadState } from "./useThreadState";

const DEMO_THREAD_ID = "demo-thread-IWT-88423";

export function EmailThreadDemo({ scenarioId }: { scenarioId?: ScenarioId }) {
  const { threadState, toggleExpand, addNextEmail } = useThreadState(scenarioId ?? "wire");

  const suggestionContext = useMemo(
    () => threadToSuggestionContext(threadState.emails),
    [threadState.emails]
  );

  return (
    <div className="email-thread-demo">
      <header className="email-thread-demo__header">
        <h1 className="email-thread-demo__subject">
          {threadState.emails[0]?.subject ?? "Email thread"}
        </h1>
        <span className="email-thread-demo__count">
          {threadState.emails.length} messages
        </span>
      </header>

      <EmailThread
        emails={threadState.emails}
        expandedIds={threadState.expandedIds}
        onToggle={toggleExpand}
      />

      <button
        type="button"
        className="email-thread-demo__add-btn"
        onClick={addNextEmail}
      >
        + Add email to thread
      </button>

      <ComposeArea threadId={DEMO_THREAD_ID} context={suggestionContext} />
    </div>
  );
}
