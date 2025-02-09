import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App3 } from "./Canvas/Blocks-v3/App3.tsx";
import { DbBuilder } from "./Canvas/DbBuilder/DbBuilder.tsx";
import CanvasDropdown from "./Canvas/CanvasDropdown.tsx";
import Editor from "./modules/editor/Editor.tsx";
import HeadlessFramework from "./Headless/index.tsx";

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
  // { path: "/impl3/:canvasId", element: <Editor /> },
  { path: "/db-builder", element: <DbBuilder /> },
  { path: "/headless", element: <HeadlessFramework /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
