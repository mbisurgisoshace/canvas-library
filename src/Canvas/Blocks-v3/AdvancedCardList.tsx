import { LucideIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { SquarePen, Phone, MapPin, Contact, CircleAlert } from "lucide-react";

import { useCanvas } from "./CanvasContext";
import { AdvancedCardList as IAdvancedCardList } from "../types";

interface AdvancedCardListProps {
  canvasObject: IAdvancedCardList;
}

export default function AdvancedCardList({
  canvasObject,
}: AdvancedCardListProps) {
  const { id, style, data } = canvasObject;

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
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        border: `1px solid ${
          selectedElement?.elementId === id ? "#0984e3" : "transparent"
        }`,
      }}
      onPointerDown={(e) => {
        console.log("e", e);

        selectElement({ elementId: id });

        if (listeners && listeners.onPointerDown) {
          listeners.onPointerDown(e);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="p-4 flex flex-col gap-[2px]"
    >
      {data.map((item, index) => {
        const roundedClassname =
          index === 0
            ? "rounded-t-3xl"
            : index === data.length - 1
            ? "rounded-b-3xl"
            : "";

        let isValid = true;

        if (item.isPostcardList) {
          isValid = !!item.address && !!item.phoneNumber;
        }

        return (
          <div
            className={`bg-white ${roundedClassname} p-4 flex flex-col gap-2`}
            key={index}
          >
            <div className="flex flex-row items-center justify-between ">
              <div className="flex flex-row items-center gap-2">
                <CardIcon icon={Contact} isValid={isValid} />
                <span className="text-sm font-medium text-[#201F22]">
                  {item.name}
                </span>
              </div>
              <SquarePen className="size-5 text-[#A4A6B7]" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <CardIcon icon={Phone} isValid={isValid} />
              <span
                className={`text-xs font-normal ${
                  item.phoneNumber ? "text-[#201F22]" : "text-[#D0D3EC]"
                }`}
              >
                {item.phoneNumber || "No phone"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <CardIcon icon={MapPin} isValid={isValid} />
              <span
                className={`text-xs font-normal ${
                  item.address ? "text-[#201F22]" : "text-[#D0D3EC]"
                }`}
              >
                {item.address || "No address"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CardIcon = ({
  icon: Icon,
  isValid,
}: {
  isValid: boolean;
  icon: LucideIcon;
}) => {
  return (
    <div className="relative">
      <Icon
        className={`size-4 ${isValid ? "text-[#89CE98]" : "text-[#D0D3EC]"}`}
      />
      {!isValid && (
        <CircleAlert className="text-white fill-[#F54274] absolute size-2 -top-1 -right-1" />
      )}
    </div>
  );
};
