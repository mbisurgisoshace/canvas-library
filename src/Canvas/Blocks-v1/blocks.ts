import { v4 as uuidv4 } from "uuid";
import { CanvasObject } from "../types";

export const elements: CanvasObject[] = [
  {
    id: `screen-${uuidv4()}`,
    x: 250,
    y: 100,
    width: 400,
    height: 750,
    children: [
      {
        blockType: "grid-row",
        id: `grid-row-${uuidv4()}`,
        x: 0,
        y: 0,
        width: 400,
        height: 250,
        colNumber: 1,
        children: [
          {
            blockType: "input",
            id: `block-${uuidv4()}`,
            x: 0,
            y: 0,
            width: 200,
            height: 50,
            children: [],
            colSpan: 1,
          },
        ],
      },
      {
        blockType: "grid-row",
        id: `grid-row-${uuidv4()}`,
        x: 0,
        y: 0,
        width: 400,
        height: 250,
        colNumber: 2,
        children: [
          {
            blockType: "input",
            id: `block-${uuidv4()}`,
            x: 0,
            y: 0,
            width: 200,
            height: 50,
            children: [],
            colSpan: 1,
          },
        ],
      },
      {
        blockType: "grid-row",
        id: `grid-row-${uuidv4()}`,
        x: 0,
        y: 0,
        width: 400,
        height: 250,
        colNumber: 3,
        children: [
          {
            blockType: "input",
            id: `block-${uuidv4()}`,
            x: 0,
            y: 0,
            width: 200,
            height: 50,
            children: [],
            colSpan: 1,
          },
          {
            blockType: "input",
            id: `block-${uuidv4()}`,
            x: 0,
            y: 0,
            width: 200,
            height: 50,
            children: [],
            colSpan: 1,
          },
        ],
      },
    ],
    blockType: "screen",
  },
];
