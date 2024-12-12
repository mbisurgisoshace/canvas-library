import { useDraggable, useDroppable } from "@dnd-kit/core";

import { CanvasObject } from "../types";
import Block, { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface ScreenProps extends BlockProps {}

export default function Screen({ canvasObject }: ScreenProps) {
  const { id, x, y, width, height, children, parentId } = canvasObject;

  const { selectElement, selectedElement } = useCanvas();

  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const combinedRef = (el: HTMLDivElement) => {
    setNodeRef(el);
    setDroppableRef(el);
  };

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={combinedRef}
      className="draggable flex flex-col"
      style={{
        width,
        height,
        top: y,
        left: x,
        //padding: 10,
        position: "absolute",
        backgroundColor: "white",
        zIndex: isDragging ? 100 : "",
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "black"
        }`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        const isResizeHandle = (
          e.target as HTMLDivElement
        ).offsetParent?.className.includes("resizable");

        if (isResizeHandle) {
          return;
        }

        selectElement({ elementId: id, parentId });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
    </div>
  );
}
