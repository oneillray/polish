import type { MockEmail } from "./emailThread.types";
import { EmailItem } from "./EmailItem";

interface Props {
  emails: MockEmail[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function EmailThread({ emails, expandedIds, onToggle }: Props) {
  return (
    <div className="email-thread" role="list">
      {emails.map((email, index) => (
        <EmailItem
          key={email.id}
          email={email}
          isExpanded={expandedIds.has(email.id)}
          isLatest={index === emails.length - 1}
          onToggle={() => onToggle(email.id)}
        />
      ))}
    </div>
  );
}
