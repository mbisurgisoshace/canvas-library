import { NumberSize } from "re-resizable";
import { useContext, createContext, useState, useCallback } from "react";

import { CanvasObject } from "../types";
import { Direction } from "re-resizable/lib/resizer";
import { DragEndEvent } from "@dnd-kit/core";

type CanvasContextType = {
  elements: CanvasObject[];
  unselectElement: () => void;
  selectedElement: string | null;
  onDragEnd: (event: DragEndEvent) => void;
  selectElement: (elementId: string) => void;
  onResizing: (
    event: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    delta: NumberSize
  ) => void;
  onResizeStop: (
    event: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    delta: NumberSize
  ) => void;
  onResizeStart: (
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) => void;
};

const CanvasContext = createContext<CanvasContextType>(null!);

export function useCanvas() {
  return useContext(CanvasContext);
}

export default function CanvasProvider(props: {
  elements: CanvasObject[];
  children: React.ReactNode;
}) {
  const { children } = props;

  const [selectedElement, selectElement] = useState<string | null>(null);
  const [currentResizeDelta, updateCurrentResizeDelta] = useState({
    x: 0,
    y: 0,
  });
  const [elements, setElements] = useState<CanvasObject[]>(props.elements);

  const unselectElement = () => selectElement(null);

  const resize = useCallback(
    (deltaX: number, deltaY: number, resizing: boolean) => {
      const id = selectedElement;

      if (!resizing) {
        updateCurrentResizeDelta({ x: 0, y: 0 });
        return;
      }

      if (!id) return;

      const element = elements.find((element) => element.id === id);
      if (element) {
        element.width += deltaX - currentResizeDelta.x;
        element.height += deltaY - currentResizeDelta.y;
        setElements([...elements]);
        updateCurrentResizeDelta({ x: deltaX, y: deltaY });
      }
    },
    [elements, selectedElement, currentResizeDelta]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const id = event.active.id;
      const element = elements.find((element) => element.id === id);
      if (element) {
        element.x += event.delta.x;
        element.y += event.delta.y;
        setElements([...elements]);
      }
    },
    [elements]
  );

  const onResizing = (
    event: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    delta: NumberSize
  ) => {
    event.preventDefault();
    event.stopPropagation();
    resize(delta.width, delta.height, true);
  };

  const onResizeStop = (
    event: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    delta: NumberSize
  ) => {
    event.preventDefault();
    event.stopPropagation();
    resize(delta.width, delta.height, false);
  };

  const onResizeStart = (
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const value = {
    elements,
    onDragEnd,
    onResizing,
    onResizeStop,
    onResizeStart,
    selectElement,
    selectedElement,
    unselectElement,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}
