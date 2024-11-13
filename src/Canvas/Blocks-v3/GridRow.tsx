import { v4 as uuidv4 } from "uuid";

import { CanvasObject } from "../types";
import Block, { BlockProps } from "./Block";
import { useMemo } from "react";

interface GridRowProps extends BlockProps {}

export default function GridRow({ canvasObject }: GridRowProps) {
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
    colNumber,
  } = canvasObject;

  return (
    <div
      id={id}
      style={{
        height,
        width: "100%",
        alignContent: "stretch",
        gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
      }}
      className={`grid gap-1 relative p-2 content-start`}
    >
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
    </div>
  );
}
