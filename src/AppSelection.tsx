import { EmailRectSelection } from "./components/EmailRect/EmailRectSelection";

export function AppSelection() {
  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="title">Email Polish - Selection Mode</div>
          <div className="subtitle">Select text to polish with AI assistance (review + undo).</div>
        </div>
      </header>
      <main className="pageBody">
        <EmailRectSelection />
      </main>
    </div>
  );
}
