import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { useEffect, useMemo, useState, useCallback } from "react";

import Draggable from "./Draggable";
import { CanvasObject, CustomSizeCanvas, FullSizeCanvas } from "./types";

interface CanvasDefaultProps {
  maxZoom?: number;
  minZoom?: number;
  zoomStep?: number;
  enableZoom?: boolean;
  elements: CanvasObject[];
}

type CanvasProps = CanvasDefaultProps & (FullSizeCanvas | CustomSizeCanvas);

export default function SvgCanvas(props: CanvasProps) {
  const { enableZoom = true, maxZoom = 10, minZoom = 1, zoomStep = 1 } = props;
  const canvasWidth = props.canvasSize === "full" ? "100%" : props.width;
  const canvasHeight = props.canvasSize === "full" ? "100%" : props.height;

  const zoomBehavior = useMemo(() => zoom(), []);

  useEffect(() => {
    if (enableZoom) {
      zoomBehavior.on("zoom", handleZoomAndPan);
      select(".canvasWrapper").call(zoomBehavior);
    }
  }, [enableZoom, zoomBehavior]);

  const handleZoomAndPan = (event: any) => {
    console.log("event", event);
    select("svg g").attr("transform", event.transform);
  };

  return (
    <div
      className="canvasWrapper"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      <svg width={canvasWidth} height={canvasHeight}>
        <g>
          <foreignObject width={canvasWidth} height={canvasHeight}>
            {props.elements.map((element) => (
              <Draggable key={element.id} canvasObject={element} />
            ))}
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}

/**
 * 
 *  
 * <div
      className="canvasWrapper"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      <svg
        width={canvasWidth}
        height={canvasHeight}
        // className="zoomablePannableArea"
        // style={{
        //   width: canvasWidth,
        //   height: canvasHeight,
        //   position: "relative",
        // }}
      >
        <g>
          <foreignObject width={canvasWidth} height={canvasHeight}>
            {props.elements.map((element) => (
              <Draggable key={element.id} canvasObject={element} />
            ))}
          </foreignObject>
        </g>
      </svg>
    </div>
 * 
 */
