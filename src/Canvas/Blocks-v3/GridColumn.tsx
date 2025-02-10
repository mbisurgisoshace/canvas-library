import { useDroppable } from "@dnd-kit/core";

import Block from "./Block";
import { useEffect, useState } from "react";
import { CanvasBlock, CanvasObject, Column as IColumn } from "../types";

interface GridColumnProps {
  canvasObject: IColumn;
}

export default function GridColumn({ canvasObject }: GridColumnProps) {
  const [ref, setNodeRef] = useState<HTMLDivElement | null>(null);
  const { id, children, columnSpan, style } = canvasObject;

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
        gridColumn: `span ${columnSpan}`,
        ...style,
      }}
      className={`flex-1 ${isOver ? "!bg-red-500/20" : ""} column`}
    >
      {/* {children.length > 0 && <Block canvasObject={children[0]} />} */}
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj as CanvasBlock} />
      ))}
    </div>
  );
}
