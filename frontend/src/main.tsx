import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import { StudentSearchProvider } from "./context/StudentSearchContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StudentSearchProvider>
      <App />
    </StudentSearchProvider>
  </StrictMode>,
);
