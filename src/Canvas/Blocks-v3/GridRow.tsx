import { useDraggable } from "@dnd-kit/core";
import { CanvasObject } from "../types";
import Block, { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface GridRowProps extends BlockProps {}

export default function GridRow({ canvasObject }: GridRowProps) {
  const { id, height, children, colNumber, style } = canvasObject;
  const { selectElement, selectedElement } = useCanvas();

  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        height,
        width: "100%",
        minHeight: height,
        alignContent: "stretch",
        gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "transparent"
        }`,
        ...style,
      }}
      className={`grid gap-1 relative p-2 content-start row`}
      onPointerDown={(e) => {
        console.log("e", e);

        selectElement({ elementId: id });

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
