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

  const renderDroppableColums = useMemo(() => {
    if (colNumber) {
      const columns: CanvasObject[] = [];
      for (let i = 0; i < colNumber; i++) {
        const colWidth = width / colNumber;

        const col: CanvasObject = {
          blockType: "grid-column",
          id: `grid-column-${uuidv4()}`,
          x: (width / colNumber) * i,
          y: 0,
          height: 250,
          children: [],
          width: colWidth,
          colNumber: i + 1,
        };
        columns.push(col);
      }
      return columns;
    }

    return [];
  }, [width, colNumber]);

  return (
    <div
      id={id}
      style={{
        height,
        width: "100%",
        gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
      }}
      className={`grid gap-1 relative p-2 content-start`}
    >
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
      {renderDroppableColums.map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
    </div>
  );
}
