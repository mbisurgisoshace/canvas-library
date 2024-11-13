import Canvas from "./index";
import { elements } from "./blocks";

import "./App.css";

export function App3() {
  return (
    <div className="wrapper">
      <Canvas base="web-div" canvasSize="full" elements={elements} />
    </div>
  );
}
