import { v4 as uuidv4 } from "uuid";
import { NumberSize } from "re-resizable";
import { useContext, createContext, useState, useCallback } from "react";

import { BlockType, CanvasObject } from "../types";
import { Direction } from "re-resizable/lib/resizer";
import { DragEndEvent } from "@dnd-kit/core";

type SelectedElement = { elementId: string; parentId?: string };

type CanvasContextType = {
  elements: CanvasObject[];
  unselectElement: () => void;
  selectedElement: SelectedElement | null;
  onDragEnd: (event: DragEndEvent) => void;
  setLayout: (elementId: string, layout: "free" | "grid") => void;
  selectElement: (selectedElement: SelectedElement) => void;
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

  const [selectedElement, selectElement] = useState<SelectedElement | null>(
    null
  );
  const [currentResizeDelta, updateCurrentResizeDelta] = useState({
    x: 0,
    y: 0,
  });
  const [elements, setElements] = useState<CanvasObject[]>(props.elements);

  const unselectElement = () => selectElement(null);

  const resize = useCallback(
    (deltaX: number, deltaY: number, resizing: boolean) => {
      const { elementId, parentId } = selectedElement as SelectedElement;

      if (!resizing) {
        updateCurrentResizeDelta({ x: 0, y: 0 });
        return;
      }

      if (!elementId) return;

      if (parentId) {
        const parentElement = elements.find(
          (element) => element.id === parentId
        );
        if (parentElement) {
          const element = parentElement.children.find(
            (element) => element.id === elementId
          );
          if (element) {
            element.width += deltaX - currentResizeDelta.x;
            element.height += deltaY - currentResizeDelta.y;
            setElements([...elements]);
            updateCurrentResizeDelta({ x: deltaX, y: deltaY });
          }
        }
      } else {
        const element = elements.find((element) => element.id === elementId);
        if (element) {
          element.width += deltaX - currentResizeDelta.x;
          element.height += deltaY - currentResizeDelta.y;
          setElements([...elements]);
          updateCurrentResizeDelta({ x: deltaX, y: deltaY });
        }
      }
    },
    [elements, selectedElement, currentResizeDelta]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const id = event.active.id;
      const overId = event.over?.id;

      if (!id.toString().includes("screen-") && overId !== "canvas") {
        const column = document.getElementById(overId as string);

        if (column) {
          const row = column.parentElement as HTMLDivElement;

          if (row) {
            const screen = row.parentElement as HTMLDivElement;

            if (screen) {
              const colId = overId;
              const rowId = row.id;
              const screenId = screen.id;

              const screenBlock = elements.find(
                (element) => element.id === screenId
              );
              const rowBlock = screenBlock?.children.find(
                (element) => element.id === rowId
              );
              const columnBlock = rowBlock?.children.find(
                (element) => element.id === colId
              );

              if (columnBlock?.children.length) {
                return;
              }

              if (id.toString().includes("block-")) {
                // It is an element already on the screen
                const element = document.getElementById(id.toString())!;
                const currentColumn = element.parentElement as HTMLDivElement;
                const currentRow =
                  currentColumn?.parentElement as HTMLDivElement;
                const currentScreen =
                  currentRow?.parentElement as HTMLDivElement;

                if (currentScreen && currentRow && currentColumn) {
                  const currentRowId = currentRow.id;
                  const currentColId = currentColumn.id;
                  const currentScreenId = currentScreen.id;

                  const currentScreenBlock = elements.find(
                    (element) => element.id === currentScreenId
                  );

                  const currentRowBlock = currentScreenBlock?.children.find(
                    (element) => element.id === currentRowId
                  );

                  const currentColumnBlock = currentRowBlock?.children.find(
                    (element) => element.id === currentColId
                  );

                  if (currentColumnBlock) {
                    const elementBlock = currentColumnBlock?.children.find(
                      (element) => element.id === id.toString()
                    );
                    currentColumnBlock.children =
                      currentColumnBlock?.children.filter(
                        (element) => element.id !== id.toString()
                      );

                    columnBlock?.children.push(elementBlock!);
                  }
                }
              } else if (id.toString().includes("ui-")) {
                // Create a new element on the screen
                const newBlock = createBlock(id.toString());
                columnBlock?.children.push(newBlock);
              }

              setElements([...elements]);
            }
          }
        }

        return;
      }

      if (id.toString().includes("screen-")) {
        const screen = elements.find((element) => element.id === id)!;
        screen.x += event.delta.x;
        screen.y += event.delta.y;
        setElements([...elements]);

        return;
      }
    },
    [elements]
  );

  console.log("elements", elements);

  const createBlock = (uiBlockId: string): CanvasObject => {
    let blockType: BlockType = "block";

    if (uiBlockId === "ui-input") blockType = "input";
    if (uiBlockId === "ui-button") blockType = "button";

    const newBlock: CanvasObject = {
      id: `block-${uuidv4()}`,
      x: 0,
      y: 0,
      width: 150,
      height: 32,
      children: [],
      blockType,
    };

    return newBlock;
  };

  const onResizing = (
    event: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    delta: NumberSize
  ) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("direction", direction);
    console.log("ref", ref);
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
    console.log("direction", direction);
    console.log("ref", ref);
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

  const setLayout = (elementId: string, layout: "free" | "grid") => {
    const element = elements.find((element) => element.id === elementId);
    if (!element) return;

    element.layout = {
      display: layout,
    };

    setElements([...elements]);
  };

  const value = {
    elements,
    onDragEnd,
    setLayout,
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
