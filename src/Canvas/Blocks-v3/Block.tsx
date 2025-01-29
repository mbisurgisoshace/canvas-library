import Input from "./Input";
import Label from "./Label";
import Table from "./Table";
import Screen from "./Screen";
import Button from "./Button";
import Header from "./Header";
import Select from "./Select";
import GridRow from "./GridRow";
import Checkbox from "./Checkbox";
import GridColumn from "./GridColumn";

import { CanvasBlock } from "../types";
export interface BlockProps {
  canvasObject: CanvasBlock;
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

  if (canvasObject.blockType === "header") {
    return <Header canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "checkbox") {
    return <Checkbox canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "table") {
    return <Table canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "select") {
    return <Select canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "label") {
    return <Label canvasObject={canvasObject} />;
  }

  if (canvasObject.blockType === "button") {
    return <Button canvasObject={canvasObject} />;
  }

  return <div></div>;
}
