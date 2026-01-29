import { EmailRectFull } from "./components/EmailRect/EmailRectFull";

export function AppFull() {
  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="title">Email Polish - Full Draft Mode</div>
          <div className="subtitle">Polish entire email with AI assistance (review + undo).</div>
        </div>
      </header>
      <main className="pageBody">
        <EmailRectFull />
      </main>
    </div>
  );
}
