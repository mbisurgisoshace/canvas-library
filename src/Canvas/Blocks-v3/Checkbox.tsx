import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface CheckboxProps extends BlockProps {}

export default function Checkbox({ canvasObject }: CheckboxProps) {
  const { id, parentId, colSpan, label } = canvasObject;

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
        selectElement({ elementId: id, parentId });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div
        className="flex items-center"
        style={{
          border: `1px solid ${
            selectedElement?.elementId === id ? "#0984e3" : "transparent"
          }`,
        }}
      >
        <label className="mr-2">{label}</label>
        <input
          type="checkbox"
          //placeholder={placeholder || "Input"}
          //className="input border border-slate-700 h-8 rounded-md px-2 w-full"
        />
      </div>
    </div>
  );
}
