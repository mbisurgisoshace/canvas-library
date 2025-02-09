interface ToggleOptions {
  isOn?: boolean;
  disabled?: boolean;
  onToggle: (state: boolean) => void;
}

interface Toggle {
  isOn: boolean;
  toggle: () => void;
  disabled?: boolean;
  ariaProps: {
    role: string;
    "aria-checked": string;
    "aria-disabled"?: string;
  };
}

export type ToggleFactory = (options: ToggleOptions) => Toggle;
