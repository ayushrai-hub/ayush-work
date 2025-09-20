import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import GTMProvider from "./components/GTMProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <GTMProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </GTMProvider>
    </ThemeProvider>
  </StrictMode>
);
