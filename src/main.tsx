import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { NoticeViewport, TooltipProvider } from "@misty/ui";

import { router } from "./router";
/* @misty/ui/styles.css (through index.css) brings Inter, the theme and the shared component styles. */
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
      <NoticeViewport />
    </TooltipProvider>
  </StrictMode>
);
