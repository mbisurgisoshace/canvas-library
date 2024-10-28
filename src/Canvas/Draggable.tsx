import { Resizable } from "re-resizable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { CanvasObject } from "./types";
import { useCanvas } from "./Features/CanvasContext";
interface DraggableProps {
  canvasObject: CanvasObject;
}

export default function Draggable({ canvasObject }: DraggableProps) {
  const { id, x, y, width, height, children, parentId, blockType, layout } =
    canvasObject;
  const {
    elements,
    setLayout,
    onResizing,
    onResizeStop,
    onResizeStart,
    selectElement,
    selectedElement,
  } = useCanvas();

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        parentId,
        modifiers: parentId ? [restrictToParentElement] : [],
      },
    });

  const combinedRef = (el: HTMLDivElement) => {
    setNodeRef(el);
    setDroppableRef(el);
  };

  const layoutProps = () => {
    const layoutProps: {
      gap?: number;
      display?: string;
      flexDirection?: string;
      gridTemplateRows?: string;
      gridTemplateColumns?: string;
    } = {};

    if (blockType === "screen" && layout) {
      if (layout.display !== "free") layoutProps.display = layout.display;

      if (layout.display === "grid" && layout.rows)
        layoutProps.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
      if (layout.display === "grid" && layout.columns)
        layoutProps.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;
      if (layout.display === "flex") {
        layoutProps.gap = 12;
        layoutProps.flexDirection = "column";
      }
    }

    return layoutProps;
  };

  const hasParentFreeLayout = () => {
    if (!parentId) return true;

    const parentElement = elements.find((element) => element.id === parentId);

    if (!parentElement) return true;

    return parentElement.layout?.display === "free";
  };

  if (blockType === "screen")
    return (
      <ContextMenu>
        <ContextMenuTrigger
          id={id}
          {...listeners}
          {...attributes}
          ref={combinedRef}
          className="draggable"
          style={{
            width,
            height,
            top: y,
            left: x,
            padding: 10,
            position: hasParentFreeLayout() ? "absolute" : undefined,
            backgroundColor: "white",
            zIndex: isDragging ? 100 : "",
            border: `1px solid ${
              selectedElement?.elementId === id ? "#0984e3" : "black"
            }`,
            transform: transform
              ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
              : undefined,
          }}
          onPointerDown={(e) => {
            const isResizeHandle = (
              e.target as HTMLDivElement
            ).offsetParent?.className.includes("resizable");

            if (isResizeHandle) {
              return;
            }

            selectElement({ elementId: id, parentId });

            if (listeners && listeners.onPointerDown) {
              listeners.onPointerDown(e);
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <Resizable
            className="resizable"
            onResize={onResizing}
            size={{ width, height }}
            onResizeStop={onResizeStop}
            onResizeStart={onResizeStart}
            style={{
              ...layoutProps(),
            }}
          >
            {children.map((child) => (
              <Draggable key={child.id} canvasObject={child} />
            ))}
          </Resizable>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setLayout(id, "free")}>
            Free
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setLayout(id, "grid")}>
            Grid
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

  if (blockType === "input")
    return (
      <div
        id={id}
        {...listeners}
        {...attributes}
        //ref={setNodeRef}
        ref={combinedRef}
        className="draggable"
        style={{
          width,
          height,
          top: y,
          left: x,
          position: hasParentFreeLayout() ? "absolute" : undefined,
          backgroundColor: "white",
          zIndex: isDragging ? 100 : "",
          // border: `1px solid ${
          //   selectedElement?.elementId === id ? "#0984e3" : "black"
          // }`,
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        }}
        onPointerDown={(e) => {
          const isResizeHandle = (
            e.target as HTMLDivElement
          ).offsetParent?.className.includes("resizable");

          if (isResizeHandle) {
            return;
          }

          selectElement({ elementId: id, parentId });

          if (listeners && listeners.onPointerDown) {
            listeners.onPointerDown(e);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <input
          className="border border-slate-700 h-8 rounded-md px-2 w-full"
          placeholder="Input"
        />
      </div>
    );

  if (blockType === "button")
    return (
      <div
        id={id}
        {...listeners}
        {...attributes}
        //ref={setNodeRef}
        ref={combinedRef}
        className="draggable"
        style={{
          width,
          height,
          top: y,
          left: x,
          position: hasParentFreeLayout() ? "absolute" : undefined,
          backgroundColor: "white",
          zIndex: isDragging ? 100 : "",
          // border: `1px solid ${
          //   selectedElement?.elementId === id ? "#0984e3" : "black"
          // }`,
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        }}
        onPointerDown={(e) => {
          const isResizeHandle = (
            e.target as HTMLDivElement
          ).offsetParent?.className.includes("resizable");

          if (isResizeHandle) {
            return;
          }

          selectElement({ elementId: id, parentId });

          if (listeners && listeners.onPointerDown) {
            listeners.onPointerDown(e);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <button className="border border-slate-700 h-8 rounded-md px-2 w-full flex items-center justify-center">
          Button
        </button>
      </div>
    );

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      //ref={setNodeRef}
      ref={combinedRef}
      className="draggable"
      style={{
        width,
        height,
        top: y,
        left: x,
        position: hasParentFreeLayout() ? "absolute" : undefined,
        backgroundColor: "white",
        zIndex: isDragging ? 100 : "",
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "black"
        }`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        const isResizeHandle = (
          e.target as HTMLDivElement
        ).offsetParent?.className.includes("resizable");

        if (isResizeHandle) {
          return;
        }

        selectElement({ elementId: id, parentId });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Resizable
        className="resizable"
        onResize={onResizing}
        size={{ width, height }}
        onResizeStop={onResizeStop}
        onResizeStart={onResizeStart}
        style={{
          ...layoutProps(),
        }}
      >
        {children.map((child) => (
          <Draggable key={child.id} canvasObject={child} />
        ))}
      </Resizable>
    </div>
  );
}

{
  /* <ContextMenu>
          <ContextMenuTrigger>
            <Resizable
              className="resizable"
              onResize={onResizing}
              size={{ width, height }}
              onResizeStop={onResizeStop}
              onResizeStart={onResizeStart}
              style={{
                ...layoutProps(),
              }}
            >
              {children.map((child) => (
                <Draggable key={child.id} canvasObject={child} />
              ))}
            </Resizable>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => console.log("free")}>
              Free
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setLayout(id, "grid")}>
              Grid
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu> */
}
