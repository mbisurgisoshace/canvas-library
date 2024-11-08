import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface InputProps extends BlockProps {}

export default function Input({ canvasObject }: InputProps) {
  const {
    id,
    x,
    y,
    width,
    height,
    children,
    parentId,
    blockType,
    layout,
    colSpan,
  } = canvasObject;

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
      <input
        placeholder="Input"
        className="input border border-slate-700 h-8 rounded-md px-2 w-full"
        style={{
          border: `1px solid ${
            selectedElement?.elementId === id ? "#0984e3" : "black"
          }`,
        }}
      />
      {/* <div className="border border-slate-700 h-8 rounded-md px-2 w-full flex items-center">
        Input
      </div> */}
    </div>
  );
}
