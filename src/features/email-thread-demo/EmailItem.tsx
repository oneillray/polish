import type { MockEmail } from "./emailThread.types";
import { formatFullDate, formatRelativeTime, getFirstLine } from "./emailThread.utils";

interface Props {
  email: MockEmail;
  isExpanded: boolean;
  isLatest: boolean;
  onToggle: () => void;
}

export function EmailItem({ email, isExpanded, isLatest, onToggle }: Props) {
  const isAgent = email.from.role === "agent";

  return (
    <div
      className={[
        "email-item",
        isAgent ? "email-item--agent" : "email-item--customer",
        isExpanded ? "email-item--expanded" : "email-item--collapsed",
        isLatest ? "email-item--latest" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="listitem"
    >
      <button
        type="button"
        className="email-item__toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Collapse" : "Expand"} email from ${email.from.name}`}
      >
        <span className="email-item__sender">
          {email.from.name}
          <span className="email-item__role-badge">
            {isAgent ? "Agent" : "Customer"}
          </span>
        </span>
        <span className="email-item__timestamp">
          {formatRelativeTime(email.timestamp)}
        </span>
        {!isExpanded && (
          <span className="email-item__preview-text">
            {getFirstLine(email.body)}
          </span>
        )}
        <span className="email-item__chevron">{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && (
        <div className="email-item__body">
          <div className="email-item__meta">
            <span>
              <strong>From:</strong> {email.from.name} &lt;{email.from.email}&gt;
            </span>
            <span>
              <strong>To:</strong> {email.to.name} &lt;{email.to.email}&gt;
            </span>
            <span>
              <strong>Date:</strong> {formatFullDate(email.timestamp)}
            </span>
          </div>
          <div className="email-item__content">
            <pre className="email-item__text">{email.body}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
