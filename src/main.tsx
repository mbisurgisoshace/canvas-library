import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import App from "./App.tsx";
import "./index.css";
import { App1 } from "./Canvas/Blocks-v1/App1.tsx";
import { App2 } from "./Canvas/Blocks-v2/App2.tsx";
import { App3 } from "./Canvas/Blocks-v3/App3.tsx";
import { DbBuilder } from "./Canvas/DbBuilder/DbBuilder.tsx";

import { elements } from "./Canvas/Blocks-v3/blocks.ts";
import { LiveList } from "@liveblocks/client";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to={"/impl1"} /> },
  { path: "/impl1", element: <App1 /> },
  { path: "/impl2", element: <App2 /> },
  { path: "/impl3", element: <App3 /> },
  { path: "/db-builder", element: <DbBuilder /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_lxkCRckCv3Z9yp1Xq1HYJyPSvK3ueAlPItQ7mzaSJ2_yK5uYNFa-k4jna7O7bVHC"
      }
    >
      <RoomProvider
        id="my-room"
        initialStorage={{ elements: new LiveList([]) }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <RouterProvider router={router} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
    {/* <App /> */}
  </StrictMode>
);
