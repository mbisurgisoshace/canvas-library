import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Droppable({ id, style, children }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div style={style} ref={setNodeRef}>
      {children}
    </div>
  );
}
