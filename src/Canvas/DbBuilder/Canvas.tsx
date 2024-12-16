import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { BlocksIcon } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import { useEffect, useMemo, useState, useCallback } from "react";

import "../styles.css";

import {
  Base,
  Tool,
  CanvasObject,
  FullSizeCanvas,
  CustomSizeCanvas,
} from "../types";
import ZoomControl from "../Tools/ZoomControl";
import Droppable from "../Droppable";
import { useCanvas } from "./CanvasContext";
import { DraggableUiElement } from "../DraggableUiElement";
import Block from "./Block";
import CanvasDropdown from "../CanvasDropdown";

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

const UI_BLOCKS = [
  {
    id: "db-table",
    uiComponent: (
      <div className="rounded-md border w-full border-slate-700 hover:border-slate-700 grid grid-cols-3">
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
        <div className="h-5 border border-slate-700"></div>
      </div>
    ),
  },
];

export default function CanvasModule(props: CanvasProps) {
  const {
    minZoom = 1,
    maxZoom = 10,
    enableZoom = true,
    zoomControls = false,
  } = props;

  const [active, setActive] = useState<any>(null);
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
    <DndContext
      onDragEnd={(e) => {
        setActive(null);

        onDragEnd(e);
      }}
      onDragStart={(data) => {
        const { active } = data;
        setActive(active);
      }}
      modifiers={
        active && active.data.current ? active.data.current.modifiers : []
      }
    >
      <CanvasDropdown />
      <div className="absolute z-20 h-full w-[250px] bg-slate-100 border-r border-slate-300 py-2 px-4">
        <h3 className="text-xl font-semibold text-slate-600 flex flex-row items-center justify-between">
          UI Elements
          <BlocksIcon />
        </h3>

        <div className="mt-3 flex flex-col gap-5">
          {UI_BLOCKS.map((block) => (
            <DraggableUiElement
              key={block.id}
              id={block.id}
              uiComponent={block.uiComponent}
            />
          ))}
        </div>

        <button
          className="mt-5 p-2 bg-slate-700 text-white rounded-md py-2 px-4 w-full"
          onClick={async () => {
            const json = JSON.stringify(elements);
            const blob = new Blob([json], { type: "application/json" });
            const href = await URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = href;
            link.download = "db-builder-model.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Export to JSON
        </button>
      </div>

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
              <Block key={element.id} canvasObject={element} />
            ))}
          </div>
        </div>
      </Droppable>
    </DndContext>
  );
}
