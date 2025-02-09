import { useDraggable } from "@dnd-kit/core";

import { BlockProps } from "../Block";
import { useCanvas } from "../CanvasContext";

interface CustomBlockWrapperProps extends BlockProps {
  render: () => JSX.Element;
}

/**
 * This is a wrapper component that will wrap around the custom block component that the user has created.
 * This component will handle the drag and drop functionality for the custom block, positioning, and layout.
 */
export function CustomBlockWrapper({
  canvasObject,
  render,
}: CustomBlockWrapperProps) {
  const { id, parentId, colSpan, text, style } = canvasObject;

  const { selectElement, selectedElement } = useCanvas();

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
      }}
      onPointerDown={(e) => {
        selectElement({ elementId: id, parentId });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {render()}
    </div>
  );
}

/**
 * This is a custom block that the user already has. This component does not require anything from outside, cause its a standalone component.
 * It already will have styling, and everything else required to render as it should.
 */
export function MyCustomBlock() {
  return <div>MyCustomBlock</div>;
}

/**
 * The user needs to render their custom block using the CustomBlockWrapper, which will have all the info related to the canvas object, and will
 *  render the custom block component.
 */
export function MyAppolloBlock({ canvasObject }: BlockProps) {
  return (
    <CustomBlockWrapper
      canvasObject={canvasObject}
      render={() => <MyCustomBlock />}
    />
  );
}
