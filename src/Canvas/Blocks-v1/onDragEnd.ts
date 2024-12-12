import { v4 as uuidv4 } from "uuid";
import { DragEndEvent } from "@dnd-kit/core";
import { BlockType, CanvasObject } from "../types";

export const onDragEnd = (
  event: DragEndEvent,
  elements: CanvasObject[],
  setElements: (elements: CanvasObject[]) => void
) => {
  const id = event.active.id;
  const overId = event.over?.id;

  if (!id.toString().includes("screen-") && overId !== "canvas") {
    const column = document.getElementById(overId as string);

    if (column) {
      const row = column.parentElement as HTMLDivElement;

      if (row) {
        const screen = row.parentElement as HTMLDivElement;

        if (screen) {
          const rowId = row.id;
          const screenId = screen.id;

          const screenBlock = elements.find(
            (element) => element.id === screenId
          );
          const rowBlock = screenBlock?.children.find(
            (element) => element.id === rowId
          );

          if (id.toString().includes("block-")) {
            // It is an element already on the screen
            const element = document.getElementById(id.toString())!;
            // const currentColumn = element.parentElement as HTMLDivElement;
            const currentRow = element?.parentElement as HTMLDivElement;
            const currentScreen = currentRow?.parentElement as HTMLDivElement;

            if (currentScreen && currentRow) {
              const currentRowId = currentRow.id;
              //const currentColId = currentColumn.id;
              const currentScreenId = currentScreen.id;

              const currentScreenBlock = elements.find(
                (element) => element.id === currentScreenId
              );

              const currentRowBlock = currentScreenBlock?.children.find(
                (element) => element.id === currentRowId
              );

              // const currentColumnBlock = currentRowBlock?.children.find(
              //   (element) => element.id === currentColId
              // );

              // if (currentColumnBlock) {
              //   const elementBlock = currentColumnBlock?.children.find(
              //     (element) => element.id === id.toString()
              //   );
              //   currentColumnBlock.children =
              //     currentColumnBlock?.children.filter(
              //       (element) => element.id !== id.toString()
              //     );

              //   columnBlock?.children.push(elementBlock!);
              // }

              if (currentRowBlock) {
                const elementBlock = currentRowBlock?.children.find(
                  (element) => element.id === id.toString()
                );
                console.log("elementBlock", elementBlock);

                currentRowBlock.children = currentRowBlock?.children.filter(
                  (element) => element.id !== id.toString()
                );

                currentRowBlock?.children.push(elementBlock!);
              }
            }
          } else if (id.toString().includes("ui-")) {
            // Create a new element on the screen
            const newBlock = createBlock(id.toString());
            //columnBlock?.children.push(newBlock);
            rowBlock?.children.push(newBlock);
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
};

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
