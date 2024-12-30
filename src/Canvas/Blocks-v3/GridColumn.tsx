import { useDroppable } from "@dnd-kit/core";

import Block, { BlockProps } from "./Block";
import { useEffect, useState } from "react";
import { CanvasObject } from "../types";

interface GridColumnProps extends BlockProps {}

export default function GridColumn({ canvasObject }: GridColumnProps) {
  const [ref, setNodeRef] = useState<HTMLDivElement | null>(null);
  const { id, children, colSpan, style } = canvasObject;

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
        ...style,
      }}
      className={`items-center flex-1 ${isOver ? "bg-red-500/20" : ""} column`}
    >
      {/* {children.length > 0 && <Block canvasObject={children[0]} />} */}
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
    </div>
  );
}
