import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import GTMProvider from "./components/GTMProvider.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GTMProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GTMProvider>
  </StrictMode>
);
