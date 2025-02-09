import { memo, useState } from "react";

import CanvasStore from "../../modules/state/CanvasStore";
import { RECT_H, RECT_W } from "../../modules/core/constants";
import { CanvasPosition, Position } from "../../modules/core/foundation";
import { DndContext } from "@dnd-kit/core";

interface TextBlockProps extends CanvasPosition {
  id: string;
  text: string;
  color: string;
  width: number;
  height: number;
}

const TextBlock = ({
  id,
  text,
  color,
  left,
  top,
  width,
  height,
}: TextBlockProps) => {
  return (
    <Position id={id} left={left} top={top} width={width} height={height}>
      <div
        className="flex items-center justify-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: color,
        }}
      >
        {text}
      </div>
    </Position>
  );
};

const InfiniteCanvas = ({ frame }: { frame: string }) => {
  const rectW = RECT_W;
  const rectH = RECT_H;
  const scale = CanvasStore.scale;

  const [blocks, setBlocks] = useState([
    { id: "1", text: "Infinite", color: "#f1f7ed", left: rectW, top: rectH },
  ]);
  const texts = [
    "Infinite",
    // "Canvases",
    // "Are",
    // "Easy",
    // "When",
    // "You",
    // "Know",
    // "The",
    // "Fundamentals",
  ];

  const colors = [
    "#f1f7ed",
    "#61c9a8",
    "#7ca982",
    "#e0eec6",
    "#c2a83e",
    "#ff99c8",
    "#fcf6bd",
    "#9c92a3",
    "#c6b9cd",
  ];

  return (
    <DndContext
      onDragMove={(e) => {
        console.log("onDragMove", e);
      }}
      onDragEnd={(e) => {
        const id = e.active.id;
        const block = blocks.find((b) => b.id === id);
        if (block) {
          block.left += e.delta.x;
          block.top += e.delta.y;
          setBlocks([...blocks]);
        }
      }}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `scale(${(scale.x, scale.y)})`,
          transformOrigin: "top left",
        }}
      >
        {blocks.map((block, index) => (
          <TextBlock
            id={block.id}
            key={index}
            text={block.text}
            color={block.color}
            left={block.left}
            top={block.top}
            width={rectW}
            height={rectH}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default memo(InfiniteCanvas);
