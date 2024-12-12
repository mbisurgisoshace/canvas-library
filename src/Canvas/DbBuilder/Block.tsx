import { CanvasObject } from "../types";
import Table from "./Table";

export interface BlockProps {
  canvasObject: CanvasObject;
}

export default function Block({ canvasObject }: BlockProps) {
  if (canvasObject.blockType === "table") {
    return <Table canvasObject={canvasObject} />;
  }
  return <div></div>;
}
