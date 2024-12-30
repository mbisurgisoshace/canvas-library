import { CanvasObject } from "../types";

export const findElement = (
  elementId: string,
  elements: CanvasObject[]
): CanvasObject | undefined => {
  let foundElement: CanvasObject | undefined;

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
