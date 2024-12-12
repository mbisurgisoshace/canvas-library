import { useDraggable } from "@dnd-kit/core";

interface DraggableUiElementProps {
  id: string;
  uiComponent: React.ReactNode;
}

export const DraggableUiElement = ({
  id,
  uiComponent,
}: DraggableUiElementProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  return (
    <div
      id={id}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {uiComponent}
    </div>
  );
};
