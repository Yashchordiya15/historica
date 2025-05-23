import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AppProvider } from "./context/AppContext";
import { StrictMode } from "react";

// Reset CSS applied before rendering
const root = createRoot(document.getElementById("root")!);

// Ensure proper context nesting
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <App />
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>
);
