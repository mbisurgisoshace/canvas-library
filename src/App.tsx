import { v4 as uuidv4 } from "uuid";

import "./App.css";

import Canvas from "./Canvas";
import { CanvasObject } from "./Canvas/types";

function App() {
  const elements: CanvasObject[] = [
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
          children: [
            {
              blockType: "grid-column",
              id: `grid-column-${uuidv4()}`,
              x: 0,
              y: 0,
              width: 200,
              height: 250,
              children: [],
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
          children: [
            {
              blockType: "grid-column",
              id: `grid-column-${uuidv4()}`,
              x: 0,
              y: 0,
              width: 200,
              height: 250,
              children: [],
            },
            {
              blockType: "grid-column",
              id: `grid-column-${uuidv4()}`,
              x: 0,
              y: 0,
              width: 200,
              height: 250,
              children: [],
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
          children: [
            {
              blockType: "grid-column",
              id: `grid-column-${uuidv4()}`,
              x: 0,
              y: 0,
              width: 200,
              height: 250,
              children: [],
            },
            {
              blockType: "grid-column",
              id: `grid-column-${uuidv4()}`,
              x: 0,
              y: 0,
              width: 200,
              height: 250,
              children: [],
            },
            {
              blockType: "grid-column",
              id: `grid-column-${uuidv4()}`,
              x: 0,
              y: 0,
              width: 200,
              height: 250,
              children: [],
            },
          ],
        },
      ],
      blockType: "screen",
    },
  ];

  return (
    <div className="wrapper">
      <Canvas base="web-div" canvasSize="full" elements={elements} />
    </div>
  );
}

export default App;
