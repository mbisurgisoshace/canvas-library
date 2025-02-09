import { useState } from "react";

import { ToggleFactory } from "../../core/toggle";

export const useReactToggle: ToggleFactory = (options) => {
  const { isOn: initialIsOn = false, disabled = false, onToggle } = options;
  const [isOn, setIsOn] = useState(initialIsOn);

  function toggle() {
    if (disabled) return;
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState);
  }

  return {
    isOn,
    toggle,
    disabled,
    ariaProps: {
      role: "switch",
      "aria-checked": isOn.toString(),
      "aria-disabled": disabled ? "true" : undefined,
    },
  };
};
