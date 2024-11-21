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
  if (canvasObject.blockType === "table") {
    return <Table canvasObject={canvasObject} />;
  }
  return <div></div>;
}
