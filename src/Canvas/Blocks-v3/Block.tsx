import Input from "./Input";
import Screen from "./Screen";
import GridRow from "./GridRow";
import GridColumn from "./GridColumn";

import { CanvasObject } from "../types";
import Header from "./Header";
import Checkbox from "./Checkbox";
import Table from "./Table";
import Select from "./Select";
import Label from "./Label";
import Button from "./Button";

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
