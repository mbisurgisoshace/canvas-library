import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { BlocksIcon } from "lucide-react";
import { Active, DndContext } from "@dnd-kit/core";
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
import { FeaturesTable } from "../FeaturesTable";

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
    id: "ui-input",
    uiComponent: (
      <input
        className="border border-slate-700 h-8 rounded-md px-2 w-full"
        placeholder="Input"
        disabled
      />
    ),
  },
  {
    id: "ui-button",
    uiComponent: (
      <button
        disabled
        className="h-8 rounded-md border w-full border-slate-700 p-0 px-2 hover:border-slate-700"
      >
        Button
      </button>
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

  const [active, setActive] = useState<Active | null>(null);
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
      </div>

      <FeaturesTable
        features={[
          { name: "Dragging to individual cells", isWorking: true },
          { name: "Column span", isWorking: false },
          { name: "Not allowing 2 elements on the same cell", isWorking: true },
          {
            name: "Allow editing inputs",
            isWorking: false,
          },
        ]}
      />

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
            {/* {elements.map((element) => (
              <Draggable key={element.id} canvasObject={element} />
            ))} */}
            {elements.map((element) => (
              <Block key={element.id} canvasObject={element} />
            ))}
          </div>
        </div>
      </Droppable>
    </DndContext>
  );
}
