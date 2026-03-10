import React from "react";
import ReactDOM from "react-dom/client";
import { registerElements } from "genesys-spark-components";
import "genesys-spark-components/dist/genesys-webcomponents/genesys-webcomponents.css";
import { EmailThreadDemo } from "./features/email-thread-demo";
import "./styles.css";

registerElements();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="page">
      <header className="pageHeader">
        <div>
          <div className="title">Email Thread Demo</div>
          <div className="subtitle">
            Mock banking thread — AI reply suggestions update as the thread grows.
          </div>
        </div>
      </header>
      <main className="pageBody">
        <EmailThreadDemo />
      </main>
    </div>
  </React.StrictMode>,
);
