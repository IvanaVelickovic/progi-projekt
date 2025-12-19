import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppointmentsProvider } from "./context/AppointmentsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppointmentsProvider>
      <App />
    </AppointmentsProvider>
  </StrictMode>
);
