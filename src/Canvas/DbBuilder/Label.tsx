import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface LabelProps extends BlockProps {}

export default function Label({ canvasObject }: LabelProps) {
  const { id, parentId, colSpan, text } = canvasObject;

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
      <label
        className="w-full"
        style={{
          border: `1px solid ${
            selectedElement?.elementId === id ? "#0984e3" : "transparent"
          }`,
        }}
      >
        {text}
      </label>
    </div>
  );
}
