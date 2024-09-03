import { useContext, createContext, useState } from "react";

type CanvasContextType = {
  unselectElement: () => void;
  selectedElement: string | null;
  selectElement: (elementId: string) => void;
};

const CanvasContext = createContext<CanvasContextType>(null!);

export function useCanvas() {
  return useContext(CanvasContext);
}

export default function CanvasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedElement, selectElement] = useState<string | null>(null);

  const unselectElement = () => selectElement(null);

  const value = {
    selectElement,
    selectedElement,
    unselectElement,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}
