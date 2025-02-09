interface InputOptions<E = Event> {
  value?: string;
  disabled?: boolean;
  readonly?: boolean;
  onBlur?: (event: E) => void;
  onFocus?: (event: E) => void;
  onChange?: (event: E) => void;
}

interface Input<E = Event> {
  value: string;
  disabled?: boolean;
  readonly?: boolean;
  handleBlur: (event: E) => void;
  handleFocus: (event: E) => void;
  handleChange: (event: E) => void;
  ariaProps: {
    role: string;
    "aria-disabled"?: string;
    "aria-readonly"?: string;
  };
}

export type InputFactory<E = Event> = (options: InputOptions<E>) => Input<E>;
