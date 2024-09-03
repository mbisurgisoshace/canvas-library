import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useState, useCallback } from "react";

import "./styles.css";

import {
  Base,
  Tool,
  CanvasObject,
  FullSizeCanvas,
  CustomSizeCanvas,
} from "./types";
import Draggable from "./Draggable";
import ZoomControl from "./Tools/ZoomControl";
import Droppable from "./Droppable";
import { useCanvas } from "./Features/CanvasContext";

interface CanvasDefaultProps {
  base: Base;
  tools?: Tool[];
  maxZoom?: number;
  minZoom?: number;
  enableZoom?: boolean;
  zoomControls?: boolean;
  elements: CanvasObject[];
}

type ZoomEvent = { transform: Transform; sourceEvent: React.MouseEvent };
type Transform = { x: number; y: number; k: number };
type CanvasProps = CanvasDefaultProps & (FullSizeCanvas | CustomSizeCanvas);

export default function CanvasModule(props: CanvasProps) {
  const {
    tools = [],
    minZoom = 1,
    maxZoom = 10,
    base = "web-div",
    enableZoom = true,
    zoomControls = false,
  } = props;

  const { elements, onDragEnd, unselectElement } = useCanvas();

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
      zoomBehavior
        .filter((e) => {
          const isResizeHandle = (
            e.target as HTMLDivElement
          ).offsetParent?.className.includes("resizable");

          return !isResizeHandle;
        })
        .on("zoom", updateTransform);
      select<HTMLDivElement, unknown>(".canvasWrapper").call(zoomBehavior);
    }
  }, [enableZoom, zoomBehavior, updateTransform]);

  const onZoomIn = () => {
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

  /**
   * Rendering will changed based on the base prop.
   *    - web-div: Render the canvas using a div element
   *    - web-canvas: Render the canvas using the canvas element and the canvas API
   */

  return (
    <DndContext onDragEnd={onDragEnd}>
      <Droppable
        id="canvas"
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        <div
          style={{
            width: canvasWidth,
            height: canvasHeight,
          }}
          className="canvasWrapper"
          onClick={() => {
            unselectElement();
          }}
        >
          {enableZoom && zoomControls && (
            <ZoomControl onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
          )}
          <div
            className="zoomablePannableArea"
            style={{
              width: canvasWidth,
              height: canvasHeight,
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
            }}
          >
            {elements.map((element) => (
              <Draggable key={element.id} canvasObject={element} />
            ))}
          </div>
        </div>
      </Droppable>
    </DndContext>
  );
}
