//

import "@unocss/reset/eric-meyer.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "virtual:uno.css";
import App from "./App";

//

import { inspect } from "@xstate/inspect";

inspect({
  iframe: false,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
