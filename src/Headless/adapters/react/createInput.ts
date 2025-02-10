import { useState } from "react";
import { InputFactory } from "../../core/input";

export const useReactInput: InputFactory<
  React.ChangeEvent<HTMLInputElement>,
  React.FocusEvent<HTMLInputElement>
> = (options) => {
  const {
    onBlur,
    onFocus,
    onChange,
    disabled = false,
    readonly = false,
    value: initialValue = "",
  } = options;
  const [value, setValue] = useState(initialValue);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (disabled || readonly) return;
    setValue(event.target.value);
    onChange?.(event);
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    onFocus?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    onBlur?.(event);
  }

  return {
    value,
    readonly,
    disabled,
    handleBlur,
    handleFocus,
    handleChange,
    ariaProps: {
      role: "textbox",
      "aria-disabled": disabled ? "true" : undefined,
      "aria-readonly": readonly ? "true" : undefined,
    },
  };
};
