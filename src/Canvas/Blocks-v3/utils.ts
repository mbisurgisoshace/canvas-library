import { CanvasBlock, CanvasObject } from "../types";

export const findElement = (
  elementId: string,
  elements: CanvasBlock[]
): CanvasBlock | undefined => {
  let foundElement: CanvasBlock | undefined;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.id === elementId) {
      return element;
    }

    foundElement = findElement(elementId, element.children);

    if (foundElement) {
      return foundElement;
    }
  }
};

export const traverseAllElements = (elements: CanvasBlock[]) => {
  const allElements: CanvasBlock[] = [];

  elements.forEach((element) => {
    allElements.push(element);

    if (element.children.length > 0) {
      allElements.push(...traverseAllElements(element.children));
    }
  });

  return allElements;
};
