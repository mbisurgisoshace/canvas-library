import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import Draggable from "./Draggable";
import { CanvasObject, CustomSizeCanvas, FullSizeCanvas } from "./types";

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
    zoomStep = 1,
    enableZoom = true,
    zoomControls = false,
  } = props;

  const [transform, setTransform] = useState<Transform>({ k: 1, x: 0, y: 0 });

  const canvasWidth = props.canvasSize === "full" ? "100%" : props.width;
  const canvasHeight = props.canvasSize === "full" ? "100%" : props.height;

  const zoomBehavior = useMemo(
    () => zoom().scaleExtent([minZoom, maxZoom]),
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
      select(".canvasWrapper").call(zoomBehavior);
    }
  }, [enableZoom, zoomBehavior, updateTransform]);

  return (
    <div
      className="canvasWrapper"
      style={{
        width: canvasWidth,
        height: canvasHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {zoomControls && (
        <div
          style={{
            gap: 5,
            top: 10,
            left: 10,
            display: "flex",
            position: "absolute",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              display: "flex",
              borderRadius: 3,
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid black",
            }}
          >
            <PlusIcon size={20} />
          </div>

          <div
            style={{
              width: 20,
              height: 20,
              display: "flex",
              borderRadius: 3,
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid black",
            }}
          >
            <MinusIcon size={20} />
          </div>
        </div>
      )}
      <div
        className="zoomablePannableArea"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          position: "relative",
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
