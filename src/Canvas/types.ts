/**
 * Canvas types
 */
export type FullSizeCanvas = { canvasSize: "full" };
export type CustomSizeCanvas = {
  canvasSize: "custom";
  width: string;
  height: string;
};

/**
 * Canvas Object types
 */
export interface CanvasObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
