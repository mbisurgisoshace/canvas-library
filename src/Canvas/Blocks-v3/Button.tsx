import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface ButtonProps extends BlockProps {}

export default function Button({ canvasObject }: ButtonProps) {
  const { id, parentId, colSpan, text, style } = canvasObject;

  const { selectElement, selectedElement } = useCanvas();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        zIndex: isDragging ? 100 : 999,
        gridColumn: colSpan ? `span ${colSpan}` : "",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        console.log("e", e);

        selectElement({ elementId: id, parentId });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <button
        className="p-1 w-full"
        style={{
          border: `1px solid ${
            selectedElement?.elementId === id ? "#0984e3" : "transparent"
          }`,
          ...style,
        }}
      >
        {text}
      </button>
    </div>
  );
}
