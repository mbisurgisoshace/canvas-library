import { v4 as uuidv4 } from "uuid";
import { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";

import { inBounds } from "./math-utils";
import CanvasStore from "../../modules/state/CanvasStore";

export interface CanvasPosition {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export const Position = ({
  id,
  left,
  top,
  width,
  height,
  children,
}: PropsWithChildren<CanvasPosition>) => {
  //const id = uuidv4();
  const scale = CanvasStore.scale;
  const screen = CanvasStore.screen;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  if (
    inBounds(
      { left, top, height, width },
      {
        left: screen.x,
        top: screen.y,
        width: screen.width,
        height: screen.height,
      }
    )
  ) {
    return (
      <div
        id={id}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        className="absolute inline-block"
        style={{
          left: `${left - screen.x}px`,
          top: `${top - screen.y}px`,
          ...(transform
            ? {
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0px)`,
              }
            : {}),
        }}
      >
        {children}
      </div>
    );
  } else return null;
};
