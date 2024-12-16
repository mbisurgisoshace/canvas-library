import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface InputProps extends BlockProps {}

export default function Input({ canvasObject }: InputProps) {
  const { id, parentId, colSpan, placeholder, style } = canvasObject;

  const { selectElement, selectedElement, isChangingStyle } = useCanvas();

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
      <input
        placeholder={placeholder || "Input"}
        className="input border border-slate-700 h-8 rounded-md px-2 w-full"
        style={{
          // border: `1px solid ${
          //   selectedElement?.elementId === id ? "#0984e3" : "black"
          // }`,
          borderWidth: 1,
          borderColor:
            selectedElement?.elementId === id && !isChangingStyle
              ? "#0984e3"
              : style?.borderColor || "black",
          borderStyle: style?.borderStyle || "solid",
        }}
      />
      {/* <div className="border border-slate-700 h-8 rounded-md px-2 w-full flex items-center">
        Input
      </div> */}
    </div>
  );
}
