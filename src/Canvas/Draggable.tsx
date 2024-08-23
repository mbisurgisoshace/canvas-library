import { useDraggable } from "@dnd-kit/core";

import { CanvasObject } from "./types";

interface DraggableProps {
  canvasObject: CanvasObject;
  activeElement: string | null;
  setActiveElement: (id: string) => void;
}

export default function Draggable({
  canvasObject,
  activeElement,
  setActiveElement,
}: DraggableProps) {
  const { id, x, y, width, height } = canvasObject;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      className="draggable"
      style={{
        width,
        height,
        top: y,
        left: x,
        zIndex: 10,
        position: "absolute",
        backgroundColor: "white",
        border: `1px solid ${activeElement === id ? "#0984e3" : "black"}`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        setActiveElement(id);

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    ></div>
  );
}
