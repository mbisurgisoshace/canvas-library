import { useReactButton } from "./adapters/react/createButton";
import { useReactInput } from "./adapters/react/createInput";
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

  const input = useReactInput({});

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col gap-1 w-[400px]">
        <label className="font-bold">Button</label>
        <button onClick={handleClick}>Headless Button</button>
      </div>

      <div className="flex flex-col gap-1 w-[400px]">
        <label className="font-bold">Toggle</label>
        <button onClick={toggle.toggle}>{toggle.isOn ? "ON" : "OFF"}</button>
      </div>

      <div className="flex flex-col gap-1 w-[400px]">
        <label className="font-bold">Input</label>
        <input className="border rounded p-2" {...input} />
      </div>

      <div>
        <input {...input} />
      </div>
    </div>
  );
}
