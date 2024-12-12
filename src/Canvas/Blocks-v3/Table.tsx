import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface TableProps extends BlockProps {}

export default function Table({ canvasObject }: TableProps) {
  const { id, parentId, colSpan } = canvasObject;

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
      <div
        style={{
          border: `1px solid ${
            selectedElement?.elementId === id ? "#0984e3" : "transparent"
          }`,
        }}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th>Calf Name</th>
              <th>Breed</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Calf 1</td>
              <td>Heir</td>
              <td className="text-right">10/10/2024</td>
            </tr>
            <tr>
              <td>Calf 2</td>
              <td>Heir</td>
              <td className="text-right">10/09/2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
