interface InputOptions<C = Event, F = Event> {
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  onBlur?: (event: F) => void;
  onFocus?: (event: F) => void;
  onChange?: (event: C) => void;
}

interface Input<C = Event, F = Event, B = Event> {
  value: string;
  disabled?: boolean;
  readonly?: boolean;
  handleBlur: (event: F) => void;
  handleFocus: (event: F) => void;
  handleChange: (event: C) => void;
  ariaProps: {
    role: string;
    "aria-disabled"?: string;
    "aria-readonly"?: string;
  };
}

export type InputFactory<C = Event, F = Event> = (
  options: InputOptions<C, F>
) => Input<C, F>;
