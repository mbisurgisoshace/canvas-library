import { Resizable } from "re-resizable";
import { useDraggable } from "@dnd-kit/core";

import { CanvasObject } from "./types";

interface DraggableProps {
  canvasObject: CanvasObject;
  activeElement: string | null;
  setActiveElement: (id: string) => void;
  onResize: (dx: number, dy: number, resizing: boolean) => void;
}

export default function Draggable({
  onResize,
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
        position: "absolute",
        backgroundColor: "white",
        border: `1px solid ${activeElement === id ? "#0984e3" : "black"}`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        setActiveElement(id);

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
        size={{ width, height }}
        onResize={(e, direction, ref, delta) => {
          e.preventDefault();
          e.stopPropagation();
          onResize(delta.width, delta.height, true);
        }}
        onResizeStart={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onResizeStop={(e, direction, ref, delta) => {
          e.preventDefault();
          e.stopPropagation();
          onResize(delta.width, delta.height, false);
        }}
      ></Resizable>
    </div>
  );
}
