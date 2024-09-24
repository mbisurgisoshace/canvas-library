import { Resizable } from "re-resizable";
import { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CanvasObject } from "./types";
import { useCanvas } from "./Features/CanvasContext";

interface DraggableProps {
	canvasObject: CanvasObject;
	base: string;
}

export default function Draggable({ canvasObject, base }: DraggableProps) {
	const { id, x, y, width, height } = canvasObject;
	const {
		selectElement,
		selectedElement,
		onResizing,
		onResizeStop,
		onResizeStart,
	} = useCanvas();

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});
	const [isResizing, setIsResizing] = useState(false);
	const [resizeHandle, setResizeHandle] = useState<string | null>(null);
	const [rectSize, setRectSize] = useState({ width, height });
	const gRef = useRef<SVGGElement | null>(null);
	const startX = useRef<number | null>(null);
	const startY = useRef<number | null>(null);

	const draggedX = transform ? x + transform.x : x;
	const draggedY = transform ? y + transform.y : y;

	const handleResizeStart =
		(handle: string) => (e: React.PointerEvent<SVGRectElement>) => {
			setIsResizing(true);
			setResizeHandle(handle);
			startX.current = e.clientX;
			startY.current = e.clientY;
			e.preventDefault();
			e.stopPropagation();
		};

	const handlePointerMove = (e: MouseEvent) => {
		if (isResizing) {
			const dx = e.clientX - (startX.current || 0);
			const dy = e.clientY - (startY.current || 0);

			let newWidth = rectSize.width;
			let newHeight = rectSize.height;

			switch (resizeHandle) {
				case "right":
					newWidth += dx;
					break;
				case "bottom":
					newHeight += dy;
					break;
				case "bottom-right":
					newWidth += dx;
					newHeight += dy;
					break;
				// Handle other cases as needed
			}

			setRectSize({ width: newWidth, height: newHeight });
			onResizing(id, newWidth, newHeight, true);
			startX.current = e.clientX;
			startY.current = e.clientY;
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const handlePointerUp = () => {
		if (isResizing) {
			setIsResizing(false);
			onResizeStop(id, rectSize.width, rectSize.height, false);
		}
	};

	useEffect(() => {
		if (isResizing) {
			window.addEventListener("pointermove", handlePointerMove);
			window.addEventListener("pointerup", handlePointerUp);
		} else {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
		}

		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
		};
	}, [isResizing]);

	if (base === "web-canvas") {
		return (
			<g
				className="draggable"
				ref={gRef}
				{...listeners}
				{...attributes}
				onPointerDown={(e) => {
					selectElement(id);
					if (listeners && listeners.onPointerDown) {
						listeners.onPointerDown(e);
						e.preventDefault();
						e.stopPropagation();
					}
				}}
				style={{ cursor: isResizing ? "nwse-resize" : "pointer" }}>
				<rect
					x={draggedX}
					y={draggedY}
					width={rectSize.width}
					height={rectSize.height}
					fill="lightgrey"
					stroke={selectedElement === id ? "#0984e3" : "black"}
					strokeWidth="1"
				/>
				{/* Resize handles */}
				<rect
					x={draggedX + rectSize.width - 5}
					y={draggedY + rectSize.height - 5}
					width={10}
					height={10}
					fill="transparent"
					cursor="nwse-resize"
					onPointerDown={handleResizeStart("bottom-right")}
				/>
				<rect
					x={draggedX + rectSize.width - 5}
					y={draggedY}
					width={10}
					height={rectSize.height}
					fill="transparent"
					cursor="ew-resize"
					onPointerDown={handleResizeStart("right")}
				/>
				<rect
					x={draggedX}
					y={draggedY + rectSize.height - 5}
					width={rectSize.width}
					height={10}
					fill="transparent"
					cursor="ns-resize"
					onPointerDown={handleResizeStart("bottom")}
				/>
			</g>
		);
	}

	return (
		<div
			{...listeners}
			{...attributes}
			ref={setNodeRef}
			className="draggable"
			style={{
				width,
				height,
				top: y,
				left: x,
				position: "absolute",
				backgroundColor: "white",
				border: `1px solid ${selectedElement === id ? "#0984e3" : "black"}`,
				transform: transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: undefined,
			}}
			onPointerDown={(e) => {
				selectElement(id);
				const isResizeHandle = (
					e.target as HTMLDivElement
				).offsetParent?.className.includes("resizable");

				if (isResizeHandle) {
					return;
				}

				if (listeners && listeners.onPointerDown) {
					listeners.onPointerDown(e);
					e.preventDefault();
					e.stopPropagation();
				}
			}}>
			<Resizable
				className="resizable"
				onResize={onResizing}
				size={{ width, height }}
				onResizeStop={onResizeStop}
				onResizeStart={onResizeStart}></Resizable>
		</div>
	);
}
