import { useRef } from "react";
import { useCanvas } from "./CanvasContext";

export default function StylingSidebar() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { changeStyle, selectedNode, applyStyleWithJson } = useCanvas();

  const renderStylingBar = () => {
    if (!selectedNode) return;

    switch (selectedNode.blockType) {
      case "label":
        return (
          <div className="flex gap-1 flex-col">
            <div className="flex justify-between">
              <label>Font Size</label>
              <select
                value={selectedNode?.style?.fontSize || 14}
                defaultValue={14}
                className="w-28"
                onChange={(e) => {
                  changeStyle("fontSize", e.target.value);
                }}
              >
                <option value={"14px"}>14</option>
                <option value={"18px"}>18</option>
                <option value={"24px"}>24</option>
              </select>
            </div>

            <div className="flex justify-between">
              <label>Text Align</label>
              <select
                value={selectedNode?.style?.textAlign || "left"}
                defaultValue={"left"}
                className="w-28"
                onChange={(e) => {
                  changeStyle("textAlign", e.target.value);
                }}
              >
                <option value={"left"}>Left</option>
                <option value={"center"}>Center</option>
                <option value={"right"}>Right</option>
              </select>
            </div>

            <div className="flex flex-col mt-3">
              <label>Apply with JSON</label>
              <textarea ref={ref}></textarea>
              <button
                className="mt-1"
                onClick={() => {
                  const value = ref.current?.value;
                  const styles = JSON.parse(value || "{}");
                  applyStyleWithJson(styles);
                }}
              >
                Apply styles
              </button>
            </div>
          </div>
        );
      case "header":
        return (
          <div className="flex gap-1 flex-col">
            <div className="flex justify-between">
              <label>Font Size</label>
              <select
                value={selectedNode?.style?.fontSize || 14}
                defaultValue={14}
                className="w-28"
                onChange={(e) => {
                  changeStyle("fontSize", e.target.value);
                }}
              >
                <option value={"14px"}>14</option>
                <option value={"18px"}>18</option>
                <option value={"24px"}>24</option>
              </select>
            </div>

            <div className="flex justify-between">
              <label>Text Align</label>
              <select
                value={selectedNode?.style?.textAlign || "left"}
                defaultValue={"left"}
                className="w-28"
                onChange={(e) => {
                  changeStyle("textAlign", e.target.value);
                }}
              >
                <option value={"left"}>Left</option>
                <option value={"center"}>Center</option>
                <option value={"right"}>Right</option>
              </select>
            </div>

            <div className="flex justify-between">
              <label>Font Color</label>
              <select
                value={selectedNode?.style?.color || "black"}
                defaultValue={"black"}
                className="w-28"
                onChange={(e) => {
                  changeStyle("color", e.target.value);
                }}
              >
                <option value={"black"}>Black</option>
                <option value={"blue"}>Blue</option>
                <option value={"red"}>Red</option>
                <option value={"green"}>Green</option>
              </select>
            </div>
          </div>
        );
      default:
        return (
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
        );
    }
  };

  return (
    <div className="mt-10 ">
      <h3 className="text-xl font-bold text-slate-600">Styling</h3>

      {renderStylingBar()}
    </div>
  );
}
