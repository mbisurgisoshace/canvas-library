import { useRef, useEffect } from "react";
import { ButtonFactory } from "../../core/button";

export const useReactButton: ButtonFactory<React.MouseEvent> = (options) => {
  const {
    onClick,
    onLongPress,
    disabled = false,
    longPressDelay = 500,
  } = options;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  function handleClick(event: React.MouseEvent) {
    if (disabled) return;
    onClick?.(event);
  }

  function handleLongPress(event: React.MouseEvent) {
    if (disabled || !onLongPress) return;
    longPressTimer.current = setTimeout(
      () => onLongPress(event),
      longPressDelay
    );
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, []);

  return {
    disabled,
    handleClick,
    handleLongPress,
    ariaProps: {
      role: "button",
      "aria-disabled": disabled ? "true" : undefined,
    },
  };
};
