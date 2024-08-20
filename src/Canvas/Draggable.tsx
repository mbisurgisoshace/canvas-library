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
        position: "absolute",
        top: y,
        left: x,
        width,
        height,
        border: "1px solid black",
      }}
    ></div>
  );
}
