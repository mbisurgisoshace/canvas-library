import { CanvasObject } from "../types";
import Block, { BlockProps } from "./Block";

interface GridRowProps extends BlockProps {}

export default function GridRow({ canvasObject }: GridRowProps) {
  const { id, height, children, colNumber, style } = canvasObject;

  return (
    <div
      id={id}
      style={{
        height,
        width: "100%",
        minHeight: height,
        alignContent: "stretch",
        gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
        ...style,
      }}
      className={`grid gap-1 relative p-2 content-start row`}
    >
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
    </div>
  );
}
