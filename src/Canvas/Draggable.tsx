import { Resizable } from "re-resizable";
import { useDraggable } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { CanvasObject } from "./types";

interface DraggableProps {
	canvasObject: CanvasObject;
	activeElement: string | null;
	setActiveElement: (id: string) => void;
	onResize: (dx: number, dy: number, resizing: boolean) => void;
	base: string;
}

export default function Draggable({
	onResize,
	canvasObject,
	activeElement,
	setActiveElement,
	base,
}: DraggableProps) {
	const { id, x, y, width, height } = canvasObject;

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});

	const [isResizing, setIsResizing] = useState(false);
	const [rectSize, setRectSize] = useState({ width, height });

	// Apply transform to current position if dragging
	const draggedX = transform ? x + transform.x : x;
	const draggedY = transform ? y + transform.y : y;

	// Mouse down on the resizing handle
	const handleResizeStart = (e: React.MouseEvent) => {
		console.log("here");
		e.preventDefault();
		e.stopPropagation();
		setIsResizing(true);
	};

	// Mouse move during resizing
	const handleResizeMove = (e: MouseEvent) => {
		if (isResizing) {
			const newWidth = e.clientX - draggedX;
			const newHeight = e.clientY - draggedY;
			setRectSize({ width: newWidth, height: newHeight });
			onResize(id, newWidth, newHeight);
		}
	};

	// Mouse up when resizing stops
	const handleResizeEnd = () => {
		console.log("hi");

		setIsResizing(false);
	};

	useEffect(() => {
		if (isResizing) {
			// Attach event listeners for mousemove and mouseup
			window.addEventListener("mousemove", handleResizeMove);
			window.addEventListener("mouseup", handleResizeEnd);
		} else {
			// Remove event listeners when resizing ends
			window.removeEventListener("mousemove", handleResizeMove);
			window.removeEventListener("mouseup", handleResizeEnd);
		}

		// Cleanup function to remove listeners on component unmount
		return () => {
			window.removeEventListener("mousemove", handleResizeMove);
			window.removeEventListener("mouseup", handleResizeEnd);
		};
	}, [isResizing]);

	if (base === "web-canvas") {
		return (
			<g
				className="draggable"
				ref={setNodeRef}
				{...listeners}
				{...attributes}
				onPointerDown={(e) => {
					if (listeners && listeners.onPointerDown) {
						listeners.onPointerDown(e);
						e.preventDefault();
						e.stopPropagation();
					}
				}}
				style={{ cursor: "pointer" }}>
				<rect
					x={draggedX}
					y={draggedY}
					width={rectSize.width}
					height={rectSize.height}
					fill="lightgrey"
					stroke={activeElement === id ? "#0984e3" : "black"}
					strokeWidth={activeElement === id ? 3 : 1}
				/>

				{/* Resize handle */}
				<circle
					cx={draggedX + rectSize.width}
					cy={draggedY + rectSize.height}
					r={5}
					fill="red"
					onPointerDown={handleResizeStart}
					onPointerUp={handleResizeEnd}
					style={{ cursor: "nwse-resize" }}
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
				border: `1px solid ${activeElement === id ? "#0984e3" : "black"}`,
				transform: transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: undefined,
			}}
			onPointerDown={(e) => {
				setActiveElement(id);

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
				size={{ width, height }}
				onResize={(e, direction, ref, delta) => {
					e.preventDefault();
					e.stopPropagation();
					onResize(delta.width, delta.height, true);
				}}
				onResizeStart={(e) => {
					e.stopPropagation();
					e.preventDefault();
				}}
				onResizeStop={(e, direction, ref, delta) => {
					e.preventDefault();
					e.stopPropagation();
					onResize(delta.width, delta.height, false);
				}}></Resizable>
		</div>
	);
}
