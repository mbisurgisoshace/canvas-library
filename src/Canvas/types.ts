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
export interface CanvasObject {
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  parentId?: string;
  children: CanvasObject[];
}

/**
 * Tools types
 */
export type Tool = "ui-base-component-library" | "ui-custom-component-library";
