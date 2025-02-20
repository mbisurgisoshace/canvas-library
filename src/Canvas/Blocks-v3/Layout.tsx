import { useDroppable } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";

import Block from "./Block";
import { useCanvas } from "./CanvasContext";
import { CanvasBlock, CanvasObject, Layout as ILayout } from "../types";

interface LayoutProps {
  canvasObject: ILayout;
}

export default function Layout({ canvasObject }: LayoutProps) {
  const [ref, setNodeRef] = useState<HTMLDivElement | null>(null);
  const { selectElement, selectedElement } = useCanvas();
  const { id, children, style, layoutDisplay, height } = canvasObject;

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
        height,
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "transparent"
        }`,
        ...style,
        ...layoutDisplay,
      }}
      className={`${isOver ? "!bg-red-500/20" : ""}`}
      onPointerDown={(e) => {
        console.log("e", e);

        selectElement({ elementId: id });
      }}
    >
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj as CanvasBlock} />
      ))}
    </div>
  );
}
