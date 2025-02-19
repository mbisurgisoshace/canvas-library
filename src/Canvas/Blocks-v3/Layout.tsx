import { useDroppable } from "@dnd-kit/core";

import Block from "./Block";
import { useEffect, useMemo, useState } from "react";
import { CanvasBlock, CanvasObject, Layout as ILayout } from "../types";
import { useCanvas } from "./CanvasContext";

interface LayoutProps {
  canvasObject: ILayout;
}

export default function Layout({ canvasObject }: LayoutProps) {
  const [ref, setNodeRef] = useState<HTMLDivElement | null>(null);
  const { selectElement, selectedElement } = useCanvas();
  const { id, children, style, layoutDisplay } = canvasObject;

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const combinedRef = (el: HTMLDivElement) => {
    setNodeRef(el);
    setDroppableRef(el);
  };

  useEffect(() => {}, [ref]);

  const layoutStyle = useMemo(() => {
    if (!layoutDisplay) return {};

    if (layoutDisplay.layoutType === "grid")
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${layoutDisplay.gridColumns}, 1fr)`,
      };

    if (layoutDisplay.layoutType === "flex")
      return {
        display: "flex",
        flexDirection: layoutDisplay.flexDirection,
      };
  }, [layoutDisplay]);

  return (
    <div
      ref={combinedRef}
      id={id}
      style={{
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "transparent"
        }`,
        ...style,
        ...layoutDisplay,
      }}
      className={`flex-1 ${isOver ? "!bg-red-500/20" : ""} column`}
      onPointerDown={(e) => {
        console.log("e", e);

        selectElement({ elementId: id });
      }}
    >
      {/* {children.length > 0 && <Block canvasObject={children[0]} />} */}
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj as CanvasBlock} />
      ))}
    </div>
  );
}
