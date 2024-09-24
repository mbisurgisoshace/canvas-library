import { NumberSize } from "re-resizable";
import { useContext, createContext, useState, useCallback } from "react";

import { CanvasObject } from "../types";
import { Direction } from "re-resizable/lib/resizer";
import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";

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

  const groupElement = useCallback(
    (
      droppedElementId: UniqueIdentifier,
      droppableElementId: UniqueIdentifier,
      event: DragEndEvent
    ) => {
      const droppableElement = elements.find(
        (element) => element.id === droppableElementId
      )!;
      const droppedElementIdx = elements.findIndex(
        (element) => element.id === droppedElementId
      );
      const element = elements.find(
        (element) => element.id === droppedElementId
      )!;
      elements.splice(droppedElementIdx, 1);

      const clientX = event.activatorEvent.clientX + event.delta.x;
      const clientY = event.activatorEvent.clientY + event.delta.y;

      const htmlDoppableElement = document.getElementById(
        droppableElementId.toString()
      )!;

      const boxRectangle = htmlDoppableElement.getBoundingClientRect();

      const localX = clientX - boxRectangle.x - element.width / 2;
      const localY = clientY - boxRectangle.y - element.height / 2;

      console.log(
        "htmlDoppableElement",
        htmlDoppableElement.getBoundingClientRect()
      );

      console.log("element", element);

      console.log("clientX", clientX);
      console.log("clientY", clientY);
      console.log("localX", localX);
      console.log("localY", localY);

      droppableElement.children.push({
        ...element,
        x: localX,
        y: localY,
        parentId: droppableElement.id,
      });
      setElements([...elements]);
    },
    [elements]
  );

  const dragWithinParent = useCallback(
    (
      draggableElementId: UniqueIdentifier,
      parentId: string,
      x: number,
      y: number
    ) => {
      const parentElement = elements.find(
        (element) => element.id === parentId
      )!;

      parentElement.children = parentElement.children.map((child) =>
        child.id === draggableElementId
          ? {
              ...child,
              x: child.x + x,
              y: child.y + y,
            }
          : child
      );
      setElements([...elements]);
    },
    [elements]
  );
  /**
  * pageX 680.5518188476562
    pageY 325.4104919433594

    deltaX: 56.04
    deltaY: 34.01

    screenX 748.70703125
    screenY 470.3515625

    cursorXCoords = pageX + deltaX
    cursorYCoords = pageY + deltaY

    offsetX 56.598731994628906
    offsetY -14.205960273742676
  * 
  */
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const id = event.active.id;
      const overId = event.over?.id;
      const parentId = event.active.data?.current?.parentId;

      const element = elements.find((element) => element.id === id);
      console.log(element);
      console.log("event", event);

      const isDropping = overId && overId !== id && overId !== "canvas";

      //if (!element) return;

      // Element being dropped inside another.
      if (isDropping && element) {
        groupElement(id, overId, event);
        return;
      }
      // Element being dragged within a parent.
      if (parentId) {
        dragWithinParent(id, parentId, event.delta.x, event.delta.y);
        return;
      }

      if (element) {
        element.x += event.delta.x;
        element.y += event.delta.y;
        setElements([...elements]);
      }
    },
    [elements, groupElement, dragWithinParent]
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
