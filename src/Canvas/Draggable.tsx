import { Resizable } from "re-resizable";
import { useDraggable } from "@dnd-kit/core";

import { CanvasObject } from "./types";
import { useCanvas } from "./Features/CanvasContext";

interface DraggableProps {
  canvasObject: CanvasObject;
}

export default function Draggable({ canvasObject }: DraggableProps) {
  const { id, x, y, width, height } = canvasObject;
  const {
    selectElement,
    selectedElement,
    onResizing,
    onResizeStop,
    onResizeStart,
  } = useCanvas();

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
        position: "absolute",
        backgroundColor: "white",
        border: `1px solid ${selectedElement === id ? "#0984e3" : "black"}`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        selectElement(id);

        const isResizeHandle = (
          e.target as HTMLDivElement
        ).offsetParent?.className.includes("resizable");

        if (isResizeHandle) {
          return;
        }

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Resizable
        className="resizable"
        onResize={onResizing}
        size={{ width, height }}
        onResizeStop={onResizeStop}
        onResizeStart={onResizeStart}
      ></Resizable>
    </div>
  );
}
