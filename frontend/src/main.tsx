import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmProvider } from "material-ui-confirm";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

import { ResponsiveDrawer } from "./components/Drawer";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ResponsiveDrawer>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </ResponsiveDrawer>
    </QueryClientProvider>
  </React.StrictMode>
);
