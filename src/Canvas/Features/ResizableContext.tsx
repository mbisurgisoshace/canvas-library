import React, { useState } from "react";

type InitialPosition = { x: number; y: number } | null;

interface ResizableContextType {
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
  initialResizingPosition: InitialPosition;
  setInitialResizingPosition: (initialPosition: InitialPosition) => void;
}

const ResizableContext = React.createContext<ResizableContextType>(null!);

export function useResizable() {
  return React.useContext(ResizableContext);
}

export function ResizableProvider({ children }: { children: React.ReactNode }) {
  const [isResizing, setIsResizing] = useState(false);
  const [initialResizingPosition, setInitialResizingPosition] =
    useState<InitialPosition>(null);

  const value = {
    isResizing,
    setIsResizing,
    initialResizingPosition,
    setInitialResizingPosition,
  };

  return (
    <ResizableContext.Provider value={value}>
      {children}
    </ResizableContext.Provider>
  );
}
