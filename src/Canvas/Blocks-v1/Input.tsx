import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "./Block";

interface InputProps extends BlockProps {}

export default function Input({ canvasObject }: InputProps) {
  const {
    id,
    x,
    y,
    width,
    height,
    children,
    parentId,
    blockType,
    layout,
    colSpan,
  } = canvasObject;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        zIndex: isDragging ? 100 : 999,
        gridColumn: colSpan ? `span ${colSpan}` : "",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        gridColumnStart: canvasObject.colNumber,
      }}
      // onPointerDown={(e) => {
      //   if ((e.target as HTMLInputElement).classList.contains("input")) {
      //     (e.target as HTMLInputElement).focus();
      //     e.preventDefault();
      //     e.stopPropagation();
      //     return;
      //   }
      // }}
    >
      <input
        placeholder="Input"
        className="input border border-slate-700 h-8 rounded-md px-2 w-full"
      />
      {/* <div className="border border-slate-700 h-8 rounded-md px-2 w-full flex items-center">
        Input
      </div> */}
    </div>
  );
}
