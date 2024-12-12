import { useCanvas } from "./CanvasContext";

export default function StylingSidebar() {
  const { changeStyle, selectedNode } = useCanvas();

  return (
    <div className="mt-10 ">
      <h3 className="text-xl font-bold text-slate-600">Styling</h3>

      <div>
        <h4 className="mt-4 font-semibold text-lg underline">Border</h4>
        <div className="flex gap-1 flex-col">
          <div className="flex justify-between">
            <label>Style</label>
            <select
              value={selectedNode?.style?.borderStyle || ""}
              defaultValue={""}
              className="w-28"
              onChange={(e) => {
                changeStyle("borderStyle", e.target.value);
              }}
            >
              <option value={"unset"}>Normal</option>
              <option value={"dashed"}>Dashed</option>
              <option value={"dotted"}>Dotted</option>
            </select>
          </div>
          <div className="flex justify-between border-">
            <label>Color</label>
            <select
              value={selectedNode?.style?.borderColor || ""}
              defaultValue={""}
              className="w-28"
              onChange={(e) => {
                changeStyle("borderColor", e.target.value);
              }}
            >
              <option value={"red"}>Red</option>
              <option value={"blue"}>Blue</option>
              <option value={"green"}>Green</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
