import { useDroppable } from "@dnd-kit/core";

import Block, { BlockProps } from "./Block";

interface GridColumnProps extends BlockProps {}

export default function GridColumn({ canvasObject }: GridColumnProps) {
  const { id, x, y, width, height, children, parentId, blockType, layout } =
    canvasObject;

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setDroppableRef}
      id={id}
      className={`flex-1 ${isOver ? "bg-red-500/20" : ""}`}
    >
      {children.length > 0 && <Block canvasObject={children[0]} />}
    </div>
  );
}
