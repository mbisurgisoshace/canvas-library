import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { BlocksIcon, ChevronDown } from "lucide-react";
import { Active, DndContext } from "@dnd-kit/core";
import { useEffect, useMemo, useState, useCallback } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { doc, getDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

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
import StylingSidebar from "./StylingSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { useParams } from "react-router-dom";
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

const LAYOUT_BLOCKS = [
  {
    id: "ui-screen",
    uiComponent: (
      <div className="border border-slate-700 h-28 w-20 flex items-center justify-center">
        Screen
      </div>
    ),
  },
  {
    id: "ui-row",
    uiComponent: (
      <div className="border border-slate-700 h-10 w-full flex items-center justify-center">
        Row
      </div>
    ),
  },
];

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
  {
    id: "ui-label",
    uiComponent: (
      <div className="h-8 text-base font-semibold flex items-center justify-between rounded-md  w-full border-slate-700 p-0 px-2 hover:border-slate-700">
        Label
      </div>
    ),
  },
  {
    id: "ui-header",
    uiComponent: (
      <div className="h-8 text-lg font-bold flex items-center justify-between rounded-md  w-full border-slate-700 p-0 px-2 hover:border-slate-700">
        Header
      </div>
    ),
  },
  {
    id: "ui-select",
    uiComponent: (
      <div className="h-8 flex items-center justify-between rounded-md border w-full border-slate-700 p-0 px-2 hover:border-slate-700">
        Select...
        <ChevronDown />
      </div>
    ),
  },
  {
    id: "ui-table",
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
  const { canvasId } = useParams();

  const {
    minZoom = 1,
    maxZoom = 10,
    enableZoom = true,
    zoomControls = false,
  } = props;

  const [active, setActive] = useState<Active | null>(null);
  const {
    elements,
    onDragEnd,
    rowLayout,
    newRowData,
    onCreateRow,
    setRowLayout,
    setNewRowData,
    unselectElement,
    selectedElement,
  } = useCanvas();

  const updateXarrow = useXarrow();
  const [toggleGrid, setToggleGrid] = useState(false);
  const [selectedCanvas, setSelectedCanvas] = useState<{
    id: string;
    title: string;
  } | null>(null);
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
          const target = e.target as HTMLDivElement;
          const isPannableArea = target.className.includes(
            "zoomablePannableArea"
          );

          if (!isPannableArea) return false;

          const isResizeHandle = (
            e.target as HTMLDivElement
          ).offsetParent?.className.includes("resizable");

          return !isResizeHandle || !isPannableArea;
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

  useEffect(() => {
    getCanvas();

    async function getCanvas() {
      const docRef = doc(db, "canvas", canvasId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSelectedCanvas({ id: docSnap.id, title: docSnap.data().title });
      }
    }
  }, [canvasId]);

  useEffect(() => {
    //const rows = document.querySelectorAll(".row");
    const columns = document.querySelectorAll(".column");

    if (toggleGrid) {
      columns.forEach((col) => {
        col.classList.add("bg-red-200");
      });
    } else {
      columns.forEach((col) => {
        col.classList.remove("bg-red-200");
      });
    }
  }, [toggleGrid, elements]);

  //console.log("elements", elements);

  /**
   * Rendering will changed based on the base prop.
   *    - web-div: Render the canvas using a div element
   *    - web-canvas: Render the canvas using the canvas element and the canvas API
   */
  return (
    <DndContext
      onDragMove={updateXarrow}
      onDragEnd={(e) => {
        setActive(null);

        onDragEnd(e);
        updateXarrow();
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
      <Xwrapper>
        <div className="absolute z-20 h-full w-[250px] bg-slate-100 border-r border-slate-300 py-2 px-4">
          {selectedCanvas && (
            <h2 className="text-3xl font-bold text-slate-700 mb-3">
              {selectedCanvas.title}
            </h2>
          )}
          <h3 className="text-xl font-semibold text-slate-600 flex flex-row items-center justify-between">
            Layout Elements
            <BlocksIcon />
          </h3>

          <div className="flex flex-row gap-2">
            <label className="mr-2">Toggle Grid</label>
            <input
              type="checkbox"
              checked={toggleGrid}
              onChange={() => setToggleGrid(!toggleGrid)}
            />
          </div>

          <div className="mt-3 flex flex-col gap-5">
            {LAYOUT_BLOCKS.map((block) => (
              <DraggableUiElement
                key={block.id}
                id={block.id}
                uiComponent={block.uiComponent}
              />
            ))}
          </div>

          <div className="h-[1px] w-full bg-slate-300 my-3" />

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

          <div className="h-[1px] w-full bg-slate-300 my-3" />

          {selectedElement && <StylingSidebar />}

          <div className="h-[1px] w-full bg-slate-300 my-3" />

          <Dialog>
            <DialogTrigger className="mt-5 p-2 bg-slate-700 text-white rounded-md py-2 px-4 w-full">
              Features
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Features implemented</DialogTitle>
                <DialogDescription>
                  This are the features trying to be accomplished with the
                  status of working or not.
                </DialogDescription>
              </DialogHeader>
              <FeaturesTable
                features={[
                  { name: "Dragging to individual cells", isWorking: true },
                  { name: "Column span", isWorking: true },
                  {
                    name: "Not allowing 2 elements on the same cell",
                    isWorking: true,
                  },
                  {
                    name: "Allow editing inputs",
                    isWorking: false,
                  },
                ]}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!newRowData}
            onOpenChange={() => {
              setRowLayout("");
              setNewRowData(undefined);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new row</DialogTitle>
                <DialogDescription>
                  Choose your columns layout for this row.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="2-4"
                    className="flex items-center space-x-2"
                    value="2-4"
                    checked={rowLayout === "2-4"}
                    onChange={(e) => setRowLayout(e.target.value)}
                  />
                  <Label>2-4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="3-3"
                    className="flex items-center space-x-2"
                    value="3-3"
                    checked={rowLayout === "3-3"}
                    onChange={(e) => setRowLayout(e.target.value)}
                  />
                  <Label>3-3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="4-2"
                    className="flex items-center space-x-2"
                    value="4-2"
                    checked={rowLayout === "4-2"}
                    onChange={(e) => setRowLayout(e.target.value)}
                  />
                  <Label>4-2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="2-2-2"
                    value="2-2-2"
                    checked={rowLayout === "2-2-2"}
                    onChange={(e) => setRowLayout(e.target.value)}
                  />
                  <Label>2-2-2</Label>
                </div>
              </div>
              <DialogFooter>
                <Button disabled={!rowLayout} onClick={onCreateRow}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <button
            className="mt-5 p-2 bg-slate-700 text-white rounded-md py-2 px-4 w-full"
            onClick={async () => {
              const json = JSON.stringify(elements);
              const blob = new Blob([json], { type: "application/json" });
              const href = await URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = href;
              link.download = "ui-builder-model.json";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Export to JSON
          </button>

          <button
            className="mt-5 p-2 bg-slate-700 text-white rounded-md py-2 px-4 w-full"
            onClick={async () => {
              const canvas = await html2canvas(
                document.querySelector(".canvasWrapper") as HTMLElement
              );
              if (canvas) {
                canvas.toBlob((blob) => {
                  saveAs(blob as Blob, "test.png");
                });
              }
            }}
          >
            Take Screenshot
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
              {/* {elements.map((element) => (
              <Draggable key={element.id} canvasObject={element} />
            ))} */}
              {elements.map((element) => (
                <Block key={element.id} canvasObject={element} />
              ))}
            </div>
          </div>
        </Droppable>
        {elements.length > 1 && (
          <Xarrow start={elements[0].id} end={elements[1].id} />
        )}
        {elements.length > 2 && (
          <Xarrow start={elements[1].id} end={elements[2].id} />
        )}
      </Xwrapper>
    </DndContext>
  );
}
