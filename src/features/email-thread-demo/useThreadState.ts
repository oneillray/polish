import { useCallback, useEffect, useState } from "react";
import type { MockEmail, ThreadState } from "./emailThread.types";
import type { ScenarioId } from "./mockThread";
import { SCENARIOS } from "./mockThread";

function getScenario(scenarioId: ScenarioId) {
  return SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]!;
}

export function useThreadState(scenarioId: ScenarioId = "wire") {
  const scenario = getScenario(scenarioId);
  const [emails, setEmails] = useState<MockEmail[]>(() => scenario.initial);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([scenario.initial[scenario.initial.length - 1]?.id]),
  );
  const [additionalEmailIndex, setAdditionalEmailIndex] = useState(0);

  useEffect(() => {
    const next = getScenario(scenarioId);
    setEmails(next.initial);
    setExpandedIds(new Set([next.initial[next.initial.length - 1]?.id]));
    setAdditionalEmailIndex(0);
  }, [scenarioId]);

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
    const list = getScenario(scenarioId).additional;
    const next = list[additionalEmailIndex % list.length]!;
    setEmails((prev) => [...prev, next]);
    setExpandedIds((prev) => {
      const nextIds = new Set(prev);
      nextIds.add(next.id);
      return nextIds;
    });
    setAdditionalEmailIndex((i) => i + 1);
  }, [additionalEmailIndex, scenarioId]);

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

