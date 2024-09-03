import CanvasModule from "./Canvas";
import CanvasProvider from "./Features/CanvasContext";

import {
  Base,
  Tool,
  CanvasObject,
  FullSizeCanvas,
  CustomSizeCanvas,
} from "./types";
interface CanvasDefaultProps {
  base: Base;
  tools?: Tool[];
  maxZoom?: number;
  minZoom?: number;
  enableZoom?: boolean;
  zoomControls?: boolean;
  elements: CanvasObject[];
}

type CanvasProps = CanvasDefaultProps & (FullSizeCanvas | CustomSizeCanvas);

export default function Canvas(props: CanvasProps) {
  return (
    <CanvasProvider>
      <CanvasModule {...props} />
    </CanvasProvider>
  );
}
