interface ButtonOptions<E = Event> {
  disabled?: boolean;
  onClick?: (event: E) => void;
  onLongPress?: (event: E) => void;
  longPressDelay?: number; // Milliseconds before long press triggers
}

interface Button<E = Event> {
  disabled?: boolean;
  handleClick: (event: E) => void;
  handleLongPress: (event: E) => void;
  ariaProps: {
    role: string;
    "aria-disabled"?: string;
  };
}

export type ButtonFactory<E = Event> = (options: ButtonOptions<E>) => Button<E>;
