import Input from "./Input";
import Screen from "./Screen";
import GridRow from "./GridRow";
import GridColumn from "./GridColumn";

import { CanvasObject } from "../types";

export interface BlockProps {
  canvasObject: CanvasObject;
}

export default function Block({ canvasObject }: BlockProps) {
  if (canvasObject.blockType === "screen") {
    return <Screen canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "grid-row") {
    return <GridRow canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "grid-column") {
    return <GridColumn canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "input") {
    return <Input canvasObject={canvasObject} />;
  }

  return <div></div>;
}
