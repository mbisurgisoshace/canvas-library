import { useDroppable } from "@dnd-kit/core";

import Block, { BlockProps } from "./Block";
import { useEffect, useState } from "react";

interface GridColumnProps extends BlockProps {}

export default function GridColumn({ canvasObject }: GridColumnProps) {
  const [ref, setNodeRef] = useState<HTMLDivElement | null>(null);
  const { id, x, y, width, height, children, parentId, blockType, layout } =
    canvasObject;

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const combinedRef = (el: HTMLDivElement) => {
    setNodeRef(el);
    setDroppableRef(el);
  };

  useEffect(() => {}, [ref]);

  return (
    <div
      ref={combinedRef}
      id={id}
      data-col-number={canvasObject.colNumber}
      className={`${isOver ? "bg-red-500/20" : ""}`}
      style={{
        width,
        top: 0,
        left: x,
        height: "100%",
        position: "absolute",
      }}
    ></div>
  );
}
