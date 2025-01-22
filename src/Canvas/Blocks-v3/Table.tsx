import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface TableProps extends BlockProps {}

export default function Table({ canvasObject }: TableProps) {
  const { id, parentId, colSpan, tableConfig, style } = canvasObject;

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
          ...style,
        }}
      >
        <table className="w-full">
          <thead>
            <tr>
              {tableConfig?.columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableConfig?.data.map((row, index) => (
              <tr key={index}>
                {row.map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
