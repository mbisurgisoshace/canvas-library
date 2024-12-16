import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App3 } from "./Canvas/Blocks-v3/App3.tsx";
import { DbBuilder } from "./Canvas/DbBuilder/DbBuilder.tsx";
import CanvasDropdown from "./Canvas/CanvasDropdown.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="h-full w-full">
        <h1>Home</h1>
        <CanvasDropdown />
      </div>
    ),
  },
  { path: "/impl3/:canvasId", element: <App3 /> },
  { path: "/db-builder", element: <DbBuilder /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
