import { useCallback, useState } from "react";
import type { MockEmail, ThreadState } from "./emailThread.types";
import { ADDITIONAL_EMAILS, MOCK_THREAD } from "./mockThread";

export function useThreadState() {
  const [emails, setEmails] = useState<MockEmail[]>(MOCK_THREAD);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([MOCK_THREAD[MOCK_THREAD.length - 1]?.id]),
  );
  const [additionalEmailIndex, setAdditionalEmailIndex] = useState(0);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const addNextEmail = useCallback(() => {
    const next =
      ADDITIONAL_EMAILS[additionalEmailIndex % ADDITIONAL_EMAILS.length]!;
    setEmails((prev) => [...prev, next]);
    setExpandedIds((prev) => {
      const nextIds = new Set(prev);
      nextIds.add(next.id);
      return nextIds;
    });
    setAdditionalEmailIndex((i) => i + 1);
  }, [additionalEmailIndex]);

  const threadState: ThreadState = {
    emails,
    expandedIds,
    additionalEmailIndex,
  };

  return {
    threadState,
    toggleExpand,
    addNextEmail,
  };
}

