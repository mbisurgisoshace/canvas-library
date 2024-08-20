import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import Draggable from "./Draggable";
import { CanvasObject, CustomSizeCanvas, FullSizeCanvas } from "./types";
import ZoomControl from "./Tools/ZoomControl";

interface CanvasDefaultProps {
  maxZoom?: number;
  minZoom?: number;
  zoomStep?: number;
  enableZoom?: boolean;
  zoomControls?: boolean;
  elements: CanvasObject[];
}

type ZoomEvent = { transform: Transform };
type Transform = { x: number; y: number; k: number };
type CanvasProps = CanvasDefaultProps & (FullSizeCanvas | CustomSizeCanvas);

export default function Canvas(props: CanvasProps) {
  const {
    minZoom = 1,
    maxZoom = 10,
    enableZoom = true,
    zoomControls = false,
  } = props;

  const [transform, setTransform] = useState<Transform>({ k: 1, x: 0, y: 0 });

  const canvasWidth = props.canvasSize === "full" ? "100%" : props.width;
  const canvasHeight = props.canvasSize === "full" ? "100%" : props.height;

  const zoomBehavior = useMemo(
    () => zoom<HTMLDivElement, unknown>().scaleExtent([minZoom, maxZoom]),
    [minZoom, maxZoom]
  );

  const updateTransform = useCallback(
    ({ transform }: ZoomEvent) => {
      setTransform(transform);
    },
    [setTransform]
  );

  useEffect(() => {
    if (enableZoom) {
      zoomBehavior.on("zoom", updateTransform);
      select<HTMLDivElement, unknown>(".canvasWrapper").call(zoomBehavior);
    }
  }, [enableZoom, zoomBehavior, updateTransform]);

  const onZoomIn = () => {
    const wrapper = select(".canvasWrapper");
    console.log(wrapper);

    select<HTMLDivElement, unknown>(".canvasWrapper").call(
      zoomBehavior.scaleBy,
      2
    );
  };

  const onZoomOut = () => {
    select<HTMLDivElement, unknown>(".canvasWrapper").call(
      zoomBehavior.scaleBy,
      0.5
    );
  };

  return (
    <div
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
      className="canvasWrapper"
    >
      {enableZoom && zoomControls && (
        <ZoomControl onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      )}
      <div
        className="zoomablePannableArea"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          position: "relative",
          transformOrigin: "top left",
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
        }}
      >
        {props.elements.map((element) => (
          <Draggable key={element.id} canvasObject={element} />
        ))}
      </div>
    </div>
  );
}
