import { CanvasObject } from "../types";
import Block, { BlockProps } from "./Block";

interface GridRowProps extends BlockProps {}

export default function GridRow({ canvasObject }: GridRowProps) {
  const { id, height, children } = canvasObject;

  return (
    <div
      id={id}
      style={{
        height,
        width: "100%",
      }}
      className={`flex`}
    >
      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}
    </div>
  );
}
