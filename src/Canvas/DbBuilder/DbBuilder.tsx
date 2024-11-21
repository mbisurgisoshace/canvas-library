import Canvas from "./index";

import "./App.css";

export function DbBuilder() {
  return (
    <div className="wrapper">
      <Canvas base="web-div" canvasSize="full" elements={[]} />
    </div>
  );
}
