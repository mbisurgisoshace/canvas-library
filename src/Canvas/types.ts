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
