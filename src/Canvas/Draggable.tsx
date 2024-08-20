import { CanvasObject } from "./types";

interface DraggableProps {
  canvasObject: CanvasObject;
}

export default function Draggable({ canvasObject }: DraggableProps) {
  const { x, y, width, height } = canvasObject;
  return (
    <div
      className="draggable"
      style={{
        width,
        height,
        top: y,
        left: x,
        position: "absolute",
        border: "1px solid black",
      }}
    ></div>
  );
}
