import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import GTMProvider from "./components/GTMProvider.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import App from "./App.tsx";
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
