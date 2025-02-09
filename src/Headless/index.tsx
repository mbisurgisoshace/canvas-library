import { useReactButton } from "./adapters/react/createButton";
import { useReactToggle } from "./adapters/react/createToggle";

export default function HeadlessFramework() {
  const toggle = useReactToggle({
    onToggle: (state) => {
      console.log("toggle state", state);
    },
  });

  const { handleClick } = useReactButton({
    onClick: (event) => {
      console.log("clicked");
    },
  });

  return (
    <div className="h-full w-full flex items-center justify-center gap-3">
      <button onClick={handleClick}>Headless Button</button>

      <button onClick={toggle.toggle}>{toggle.isOn ? "ON" : "OFF"}</button>
    </div>
  );
}
