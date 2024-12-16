import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsIcon } from "lucide-react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { CanvasObject } from "../types";
import Block, { BlockProps } from "./Block";
import { useCanvas } from "./CanvasContext";

interface ScreenProps extends BlockProps {}

export default function Screen({ canvasObject }: ScreenProps) {
  const { id, x, y, width, height, children, parentId, title } = canvasObject;

  const { selectElement, selectedElement, duplicateScreen } = useCanvas();

  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const combinedRef = (el: HTMLDivElement) => {
    setNodeRef(el);
    setDroppableRef(el);
  };

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={combinedRef}
      className="draggable flex flex-col"
      style={{
        width,
        top: y,
        left: x,
        //padding: 10,
        minHeight: height,
        position: "absolute",
        backgroundColor: "white",
        zIndex: isDragging ? 9999 : -10,
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "black"
        }`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onPointerDown={(e) => {
        const el = e.target as HTMLElement;
        const isResizeHandle = (
          e.target as HTMLDivElement
        ).offsetParent?.className.includes("resizable");

        if (isResizeHandle) {
          return;
        }

        if (el.classList.contains("screen-menu")) {
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
      <span className="absolute flex flex-row gap-2 items-center top-[-25px]">
        {title}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SettingsIcon size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="screen-menu"
              onClick={() => duplicateScreen(canvasObject)}
            >
              Duplicate Screen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>

      {(children as CanvasObject[]).map((canvasObj) => (
        <Block key={canvasObj.id} canvasObject={canvasObj} />
      ))}

      <div
        style={{
          top: height,
        }}
        className={`absolute w-full border-b border-dashed border-gray-300`}
      />
    </div>
  );
}
