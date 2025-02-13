import { useRef } from "react";
import { useCanvas } from "./CanvasContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export default function StylingSidebar() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    changeProp,
    changeStyle,
    selectedNode,
    applyStyleWithJson,
    onChangeRowHeight,
  } = useCanvas();

  const renderStylingBar = () => {
    if (!selectedNode) return;

    switch (selectedNode.blockType) {
      case "grid-row":
        return (
          <div className="flex gap-1 flex-col">
            <div className="flex flex-col">
              <label>Height</label>
              <input
                ref={inputRef}
                type="number"
                className="mt-1"
                onBlur={() => {
                  if (inputRef.current?.value) {
                    onChangeRowHeight(parseInt(inputRef.current?.value));
                  }
                }}
              />
            </div>

            <div className="flex justify-between">
              <label>Background Color</label>
              <Popover>
                <PopoverTrigger
                  className={cn("size-4")}
                  style={{
                    backgroundColor:
                      selectedNode?.style?.backgroundColor || "#FFFFFF",
                  }}
                ></PopoverTrigger>
                <PopoverContent>
                  <HexColorPicker
                    color={selectedNode?.style?.backgroundColor || "#FFFFFF"}
                    onChange={(color) => changeStyle("backgroundColor", color)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      case "grid-column":
        return (
          <div className="flex gap-1 flex-col">
            <div className="flex justify-between">
              <label>Background Color</label>
              <Popover>
                <PopoverTrigger
                  className={cn("size-4")}
                  style={{
                    backgroundColor:
                      selectedNode?.style?.backgroundColor || "#FFFFFF",
                  }}
                ></PopoverTrigger>
                <PopoverContent>
                  <HexColorPicker
                    color={selectedNode?.style?.backgroundColor || "#FFFFFF"}
                    onChange={(color) => changeStyle("backgroundColor", color)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      case "label":
        return (
          <div className="flex gap-1 flex-col">
            <div className="flex justify-between items-center">
              <label>Font Size</label>
              <div className="w-[60%] flex items-center">
                <Slider
                  value={[
                    selectedNode?.style?.fontSize
                      ? parseInt(selectedNode?.style?.fontSize as string)
                      : 14,
                  ]}
                  defaultValue={[14]}
                  min={8}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    changeStyle("fontSize", `${value[0]}`);
                  }}
                />
                <span className="ml-1 font-semibold text-sm">
                  {selectedNode?.style?.fontSize}
                </span>
              </div>
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
              <label>Text</label>
              <input
                className="w-28"
                value={selectedNode.text}
                onChange={(e) => changeProp("text", e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <label>Font Size</label>
              <div className="w-[60%] flex items-center">
                <Slider
                  value={[
                    selectedNode?.style?.fontSize
                      ? parseInt(selectedNode?.style?.fontSize as string)
                      : 14,
                  ]}
                  defaultValue={[14]}
                  min={8}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    changeStyle("fontSize", `${value[0]}`);
                  }}
                />
                <span className="ml-1 font-semibold text-sm">
                  {selectedNode?.style?.fontSize}
                </span>
              </div>
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
              <Popover>
                <PopoverTrigger
                  className={cn("size-4")}
                  style={{
                    backgroundColor: selectedNode?.style?.color || "#FFFFFF",
                  }}
                ></PopoverTrigger>
                <PopoverContent>
                  <HexColorPicker
                    color={selectedNode?.style?.color || "#FFFFFF"}
                    onChange={(color) => changeStyle("color", color)}
                  />
                </PopoverContent>
              </Popover>
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
