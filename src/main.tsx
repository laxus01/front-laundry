import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { SnackbarProvider } from "./contexts/SnackbarContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
