import "./App.css";
import Canvas from "./Canvas";
import { CanvasObject } from "./Canvas/types";

function App() {
  const elements: CanvasObject[] = [
    { id: "1", x: 50, y: 100, width: 100, height: 100, children: [] },
    { id: "2", x: 100, y: 500, width: 150, height: 100, children: [] },
    { id: "3", x: 250, y: 100, width: 200, height: 250, children: [] },
  ];

  return (
    <div className="wrapper">
      <Canvas canvasSize="full" elements={elements} />
    </div>
  );
}

export default App;
