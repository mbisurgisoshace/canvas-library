import { v4 as uuidv4 } from "uuid";
import { NumberSize } from "re-resizable";
import {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import { BlockType, CanvasObject } from "../types";
import { Direction } from "re-resizable/lib/resizer";
import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";

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
  isChangingStyle: boolean;
  selectedNode: CanvasObject | undefined;
  newRowData: { screenId: string } | undefined;
  setNewRowData: (data: { screenId: string } | undefined) => void;
  rowLayout: string;
  setRowLayout: (layout: string) => void;
  onCreateRow: () => void;
  changeStyle: (styleProp: string, stylePropValue: string) => void;
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

  const [isChangingStyle, setIsChangingStyle] = useState(false);
  const [selectedElement, selectElement] = useState<SelectedElement | null>(
    null
  );
  const [currentResizeDelta, updateCurrentResizeDelta] = useState({
    x: 0,
    y: 0,
  });
  const [elements, setElements] = useState<CanvasObject[]>(props.elements);
  const [newRowData, setNewRowData] = useState<
    { screenId: string } | undefined
  >();
  const [rowLayout, setRowLayout] = useState<string | undefined>("");

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

  const selectedNode = useMemo(() => {
    if (!selectedElement) return;
    let element: CanvasObject | undefined;

    for (let i = 0; i < elements.length; i++) {
      const screen = elements[i];
      screen.children.forEach((row) => {
        row.children.forEach((col) => {
          col.children.forEach((block) => {
            if (block.id === selectedElement?.elementId) {
              element = block;
            }
          });
        });
      });
    }

    return element;
  }, [elements, selectedElement]);

  const changeStyle = useCallback(
    (styleProp: string, stylePropValue: string) => {
      let element: CanvasObject | undefined;
      setIsChangingStyle(true);

      setTimeout(() => {
        setIsChangingStyle(false!);
      }, 1500);

      for (let i = 0; i < elements.length; i++) {
        const screen = elements[i];
        screen.children.forEach((row) => {
          row.children.forEach((col) => {
            col.children.forEach((block) => {
              if (block.id === selectedElement?.elementId) {
                element = block;
              }
            });
          });
        });
      }

      if (element) {
        element.style = {
          ...element.style,
          [styleProp]: stylePropValue,
        };

        setElements([...elements]);
      }
    },
    [elements, selectedElement]
  );

  const addElement = useCallback(
    (
      droppedElementId: UniqueIdentifier,
      droppableElementId: UniqueIdentifier,
      event: DragEndEvent
    ) => {
      const { active, over } = event;

      let newBlock: CanvasObject;

      const droppableElement = elements.find(
        (element) => element.id === droppableElementId
      )!;

      const containerRect = document
        .getElementById(droppableElementId as string)
        ?.getBoundingClientRect();

      const draggableRect = active.rect.current.translated;
      const { x: clientX, y: clientY } = event.delta;

      const newX = draggableRect!.left - containerRect!.left;
      const newY = draggableRect!.top - containerRect!.top;

      if (droppedElementId === "input") {
        newBlock = {
          id: uuidv4(),
          x: newX,
          y: newY,
          width: 150,
          height: 32,
          children: [],
          blockType: "input",
        };
      }

      if (droppedElementId === "button") {
        newBlock = {
          id: uuidv4(),
          x: newX,
          y: newY,
          width: 150,
          height: 32,
          children: [],
          blockType: "button",
        };
      }

      droppableElement.children.push({
        ...newBlock!,
        parentId: droppableElement.id,
      });
      setElements([...elements]);
    },
    [elements]
  );

  const groupElement = useCallback(
    (
      droppedElementId: UniqueIdentifier,
      droppableElementId: UniqueIdentifier,
      event: DragEndEvent
    ) => {
      const { active, over } = event;
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

      const containerRect = document
        .getElementById(droppableElementId as string)
        ?.getBoundingClientRect();

      const draggableRect = active.rect.current.translated;
      const { x: clientX, y: clientY } = event.delta;

      // // const clientX = event.activatorEvent.clientX;
      // // const clientY = event.activatorEvent.clientY;

      // const localY = clientY - element.y;
      // const localX = clientX - element.x;

      const newX = draggableRect!.left - containerRect!.left;
      const newY = draggableRect!.top - containerRect!.top;

      droppableElement.children.push({
        ...element,
        // x: localX,
        // y: localY,
        y: newY,
        x: newX,
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
  // const onDragEnd = useCallback(
  //   (event: DragEndEvent) => {
  //     const id = event.active.id;
  //     const overId = event.over?.id;
  //     const parentId = event.active.data?.current?.parentId;

  //     console.log("id", id);
  //     console.log("overId", overId);

  // if (overId !== "canvas" && ["input", "button"].includes(id.toString())) {
  //   addElement(id, overId, event);
  //   return;
  // }

  //     // const element = elements.find((element) => element.id === id);

  //     // const isDropping = overId && overId !== id && overId !== "canvas";

  //     // //if (!element) return;

  //     // // Element being dropped inside another.
  //     // if (isDropping && element) {
  //     //   groupElement(id, overId, event);
  //     //   return;
  //     // }
  //     // // Element being dragged within a parent.
  //     // if (parentId) {
  //     //   dragWithinParent(id, parentId, event.delta.x, event.delta.y);
  //     //   return;
  //     // }

  //     // if (element) {
  // element.x += event.delta.x;
  // element.y += event.delta.y;
  // setElements([...elements]);
  //     // }
  //   },
  //   [elements, groupElement, dragWithinParent]
  // );

  const getBlockDomHierarchy = (
    blockId: string
  ):
    | {
        colElement: HTMLDivElement;
        rowElement: HTMLDivElement;
        blockElement: HTMLDivElement;
      }
    | undefined => {
    if (!blockId) return;
    const blockElement = document.getElementById(blockId)! as HTMLDivElement;
    if (!blockElement) return;

    const colElement = blockElement.parentElement as HTMLDivElement;
    const rowElement = colElement.parentElement as HTMLDivElement;

    return {
      rowElement,
      colElement,
      blockElement,
    };
  };

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const id = event.active.id;
      const overId = event.over?.id;

      if (id === "ui-screen" && overId === "canvas") {
        const newScreen = createScreen();
        elements.push(newScreen);
        setElements([...elements]);
      }

      if (!id.toString().includes("screen-") && overId !== "canvas") {
        if (id === "ui-row") {
          setNewRowData({ screenId: overId as string });
          return;
        }

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

  const createBlock = (uiBlockId: string): CanvasObject => {
    let blockType: BlockType = "block";

    if (uiBlockId === "ui-input") blockType = "input";
    if (uiBlockId === "ui-button") blockType = "button";
    if (uiBlockId === "ui-label") blockType = "label";
    if (uiBlockId === "ui-header") blockType = "header";
    if (uiBlockId === "ui-select") blockType = "select";
    if (uiBlockId === "ui-table") blockType = "table";

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

  const createScreen = (): CanvasObject => {
    return {
      id: `screen-${uuidv4()}`,
      x: 250,
      y: 100,
      width: 400,
      height: 750,
      title: "New Screen",
      children: [],
      blockType: "screen",
    };
  };

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

  const setLayout = (elementId: string, layout: "free" | "grid") => {
    const element = elements.find((element) => element.id === elementId);
    if (!element) return;

    element.layout = {
      display: layout,
    };

    setElements([...elements]);
  };

  const onCreateRow = () => {
    console.log("rowLayout", rowLayout);
    console.log("newRowData", newRowData);
    const newRow: CanvasObject = {
      blockType: "grid-row",
      id: `grid-row-${uuidv4()}`,
      x: 0,
      y: 0,
      width: 400,
      height: 75,
      colNumber: 6,
      children: createColumnsLayout(rowLayout!),
    };

    const screen = elements.find(
      (element) => element.id === newRowData?.screenId
    );

    if (screen) {
      screen.children.push(newRow);
      setElements([...elements]);
    }

    setRowLayout(undefined);
    setNewRowData(undefined);
  };

  const createColumnsLayout = (rowLayout: string): CanvasObject[] => {
    const cols: CanvasObject[] = [];

    if (rowLayout === "2-4") {
      cols.push({
        x: 0,
        y: 0,
        colSpan: 2,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });

      cols.push({
        x: 0,
        y: 0,
        colSpan: 4,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });
    }

    if (rowLayout === "3-3") {
      cols.push({
        x: 0,
        y: 0,
        colSpan: 3,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });

      cols.push({
        x: 0,
        y: 0,
        colSpan: 3,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });
    }

    if (rowLayout === "4-2") {
      cols.push({
        x: 0,
        y: 0,
        colSpan: 4,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });

      cols.push({
        x: 0,
        y: 0,
        colSpan: 2,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });
    }

    if (rowLayout === "2-2-2") {
      cols.push({
        x: 0,
        y: 0,
        colSpan: 2,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });

      cols.push({
        x: 0,
        y: 0,
        colSpan: 2,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });

      cols.push({
        x: 0,
        y: 0,
        colSpan: 2,
        width: 200,
        height: 75,
        children: [],
        blockType: "grid-column",
        id: `grid-col-${uuidv4()}`,
      });
    }

    return cols;
  };

  const value = {
    elements,
    onDragEnd,
    rowLayout,
    setLayout,
    newRowData,
    onResizing,
    onCreateRow,
    changeStyle,
    setRowLayout,
    selectedNode,
    onResizeStop,
    setNewRowData,
    onResizeStart,
    selectElement,
    isChangingStyle,
    selectedElement,
    unselectElement,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}
