import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { App1 } from "./Canvas/Blocks-v1/App1.tsx";
import { App2 } from "./Canvas/Blocks-v2/App2.tsx";
import { App3 } from "./Canvas/Blocks-v3/App3.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to={"/impl1"} /> },
  { path: "/impl1", element: <App1 /> },
  { path: "/impl2", element: <App2 /> },
  { path: "/impl3", element: <App3 /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
