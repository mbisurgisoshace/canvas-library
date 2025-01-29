/**
 * Canvas types
 */
export type Base = "web-div" | "web-canvas";
export type CustomSizeCanvas = {
  canvasSize: "custom";
  width: string;
  height: string;
};
export type FullSizeCanvas = { canvasSize: "full" };

/**
 * Canvas Object types
 */
export type BlockType =
  | "icon"
  | "block"
  | "label"
  | "screen"
  | "input"
  | "table"
  | "header"
  | "button"
  | "select"
  | "checkbox"
  | "grid-row"
  | "grid-column";
export interface CanvasObject {
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  parentId?: string;
  blockType: BlockType;
  layout?: {
    rows?: number;
    columns?: number;
    display: "free" | "grid" | "flex";
  };
  children: CanvasObject[];
  colSpan?: number;
  colNumber?: number;
  text?: string;
  placeholder?: string;
  label?: string;
  tableConfig?: {
    data: string[][];
    columns: string[];
  };
  title?: string;
  tableName?: string;
  columns?: { columnName: string; type: string }[];
  style?: React.CSSProperties;
}

/**
 * Tools types
 */
export type Tool = "ui-base-component-library" | "ui-custom-component-library";

interface Block {
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  children: CanvasBlock[];
}

export interface Row extends Block {
  blockType: "grid-row";
  columnNumber: number;
}
export interface Input extends Block {
  blockType: "input";
  placeholder?: string;
}
export interface Label extends Block {
  blockType: "label";
  text: string;
}
export interface Table extends Block {
  blockType: "table";
  tableConfig: {
    data: string[][];
    columns: string[];
  };
}
export interface Screen extends Block {
  blockType: "screen";
  title: string;
}
export interface Header extends Block {
  blockType: "header";
  text: string;
}
export interface Button extends Block {
  blockType: "button";
  text: string;
}

export interface Select extends Block {
  blockType: "select";
  options: string[];
}
export interface Column extends Block {
  blockType: "grid-column";
  columnSpan: number;
}
export interface Checkbox extends Block {
  blockType: "checkbox";
  label: string;
}

export type CanvasBlock =
  | Row
  | Input
  | Label
  | Table
  | Select
  | Screen
  | Header
  | Button
  | Column
  | Checkbox;
