import { useDroppable } from "@dnd-kit/core";

import Block, { BlockProps } from "./Block";
import { useEffect, useState } from "react";

interface GridColumnProps extends BlockProps {}

export default function GridColumn({ canvasObject }: GridColumnProps) {
  const [ref, setNodeRef] = useState<HTMLDivElement | null>(null);
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
      style={{
        gridColumn: `span ${colSpan}`,
      }}
      className={`items-center flex-1 ${isOver ? "bg-red-500/20" : ""} column`}
    >
      {children.length > 0 && <Block canvasObject={children[0]} />}
    </div>
  );
}
