import { useDraggable } from "@dnd-kit/core";

import { useCanvas } from "./CanvasContext";
import { Pagination as IPagination } from "../types";

interface PaginationProps {
  canvasObject: IPagination;
}

export default function Pagination({ canvasObject }: PaginationProps) {
  const { id, style } = canvasObject;

  const { selectElement } = useCanvas();

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
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        selectElement({ elementId: id });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="flex justify-between items-center bg-white p-1 rounded">
        <button className="p-1 w-1/5">Previous</button>
        <div>
          <span>Page </span>
          <span>1 of 1</span>
        </div>
        <button className="p-1 w-1/5">Next</button>
      </div>
    </div>
  );
}
