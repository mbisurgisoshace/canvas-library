import { Resizable } from "re-resizable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { CanvasObject } from "./types";
import { useCanvas } from "./Features/CanvasContext";

interface DraggableProps {
  canvasObject: CanvasObject;
}

export default function Draggable({ canvasObject }: DraggableProps) {
  const { id, x, y, width, height, children, parentId } = canvasObject;
  const {
    selectElement,
    selectedElement,
    onResizing,
    onResizeStop,
    onResizeStart,
  } = useCanvas();

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        parentId,
        modifiers: parentId ? [restrictToParentElement] : [],
      },
    });

  const combinedRef = (el: HTMLDivElement) => {
    setNodeRef(el);
    setDroppableRef(el);
  };

  return (
    <div
      {...listeners}
      {...attributes}
      //ref={setNodeRef}
      ref={combinedRef}
      className="draggable"
      style={{
        width,
        height,
        top: y,
        left: x,
        position: "absolute",
        backgroundColor: "white",
        zIndex: isDragging ? 100 : "",
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
      >
        {children.map((child) => (
          <Draggable key={child.id} canvasObject={child} />
        ))}
      </Resizable>
    </div>
  );
}
