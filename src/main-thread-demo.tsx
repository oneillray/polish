import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { registerElements } from "genesys-spark-components";
import "genesys-spark-components/dist/genesys-webcomponents/genesys-webcomponents.css";
import { EmailThreadDemo, SCENARIOS } from "./features/email-thread-demo";
import type { ScenarioId } from "./features/email-thread-demo";
import "./styles.css";

registerElements();

function ThreadDemoPage() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("wire");

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="title">Email Thread Demo</div>
          <div className="subtitle">
            Mock banking thread — AI reply suggestions update as the thread grows.
          </div>
        </div>
        <div className="pageHeader__actions">
          <label htmlFor="scenario-select" className="pageHeader__label">
            Scenario
          </label>
          <select
            id="scenario-select"
            className="pageHeader__select"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value as ScenarioId)}
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main className="pageBody">
        <EmailThreadDemo scenarioId={scenarioId} />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThreadDemoPage />
  </React.StrictMode>,
);
