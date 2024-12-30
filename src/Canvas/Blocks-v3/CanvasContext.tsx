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
import { DragEndEvent } from "@dnd-kit/core";
import { findElement } from "./utils";

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
  rowLayout: string | undefined;
  setRowLayout: (layout: string) => void;
  onCreateRow: () => void;
  onChangeRowHeight: (height: number) => void;
  duplicateScreen: (screen: CanvasObject) => void;
  applyStyleWithJson: (styles: React.CSSProperties) => void;
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

    return findElement(selectedElement.elementId, elements);

    // for (let i = 0; i < elements.length; i++) {
    //   const screen = elements[i];
    //   screen.children.forEach((row) => {
    //     row.children.forEach((col) => {
    //       col.children.forEach((block) => {
    //         if (block.id === selectedElement?.elementId) {
    //           element = block;
    //         }
    //       });
    //     });
    //   });
    // }

    return element;
  }, [elements, selectedElement]);

  const changeStyle = useCallback(
    (styleProp: string, stylePropValue: string | number) => {
      if (!selectedElement) return;
      //let element: CanvasObject | undefined;
      setIsChangingStyle(true);

      setTimeout(() => {
        setIsChangingStyle(false!);
      }, 1500);

      // for (let i = 0; i < elements.length; i++) {
      //   const screen = elements[i];
      //   screen.children.forEach((row) => {
      //     row.children.forEach((col) => {
      //       col.children.forEach((block) => {
      //         if (block.id === selectedElement?.elementId) {
      //           element = block;
      //         }
      //       });
      //     });
      //   });
      // }
      const element = findElement(selectedElement.elementId!, elements);

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

  const applyStyleWithJson = useCallback(
    (styles: React.CSSProperties) => {
      if (!selectedElement) return;
      //let element: CanvasObject | undefined;
      setIsChangingStyle(true);

      setTimeout(() => {
        setIsChangingStyle(false!);
      }, 1500);

      const element = findElement(selectedElement.elementId!, elements);

      if (element) {
        element.style = {
          ...element.style,
          ...styles,
        };

        setElements([...elements]);
      }
    },
    [elements, selectedElement]
  );

  const duplicateScreen = useCallback(
    (screen: CanvasObject) => {
      const newScreen = {
        ...screen,
        x: screen.x + 25,
        id: `screen-${uuidv4()}`,
      };

      // newScreen.children.forEach((row) => {
      //   row.id = `grid-row-${uuidv4()}`;
      //   row.children.forEach((col) => {
      //     col.id = `grid-column-${uuidv4()}`;
      //     col.children.forEach((block) => {
      //       block.id = `block-${uuidv4()}`;
      //     });
      //   });
      // });

      newScreen.children = newScreen.children.map((row) => {
        const newRow = {
          ...row,
          id: `grid-row-${uuidv4()}`,
        };

        newRow.children = newRow.children.map((col) => {
          const newCol = {
            ...col,
            id: `grid-column-${uuidv4()}`,
          };

          newCol.children = newCol.children.map((block) => {
            const newBlock = {
              ...block,
              id: `block-${uuidv4()}`,
            };

            return newBlock;
          });

          return newCol;
        });

        return newRow;
      });

      elements.push(newScreen);
      setElements([...elements]);
    },
    [elements]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const id = event.active.id;
      const overId = event.over?.id;
      console.log("id", id);
      console.log("overId", overId);

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

        //const column = document.getElementById(overId as string);

        const droppableElement = findElement(overId as string, elements);

        if (droppableElement) {
          if (id.toString().includes("block-")) {
            // It is an element already on the screen
            const existingElement = findElement(id.toString(), elements);
            const existingDomElement = document.getElementById(id.toString());

            if (existingElement) {
              const existingElementDomParent =
                existingDomElement?.parentElement as HTMLDivElement;
              const existingElementParent = findElement(
                existingElementDomParent.id,
                elements
              );

              existingElementParent!.children =
                existingElementParent!.children.filter(
                  (element) => element.id !== id.toString()
                );

              droppableElement.children.push(existingElement);
            }
          } else if (id.toString().includes("ui-")) {
            // Create a new element on the screen
            const newBlock = createBlock(id.toString());
            droppableElement.children.push(newBlock);
          }

          setElements([...elements]);
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

  const onCreateRow = () => {
    if (!newRowData) return;

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

    const droppableElement = findElement(newRowData.screenId!, elements);

    // const screen = elements.find(
    //   (element) => element.id === newRowData?.screenId
    // );

    // if (screen) {
    //   screen.children.push(newRow);
    //   setElements([...elements]);
    // }

    if (droppableElement) {
      droppableElement.children.push(newRow);
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

  const onChangeRowHeight = useCallback(
    (height: number) => {
      if (!selectedElement) return;
      //let element: CanvasObject | undefined;
      setIsChangingStyle(true);

      setTimeout(() => {
        setIsChangingStyle(false!);
      }, 1500);

      const element = findElement(selectedElement.elementId!, elements);

      if (element) {
        element.height = height;

        setElements([...elements]);
      }
    },
    [elements, selectedElement]
  );

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
    duplicateScreen,
    isChangingStyle,
    selectedElement,
    unselectElement,
    onChangeRowHeight,
    applyStyleWithJson,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}
