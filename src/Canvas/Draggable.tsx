import { Resizable } from "re-resizable";
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
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
	const [currentSize, setCurrentSize] = useState({ width, height });

	// Apply transform to current position if dragging
	const draggedX = transform ? x + transform.x : x;
	const draggedY = transform ? y + transform.y : y;

	// Handle resize events
	const handleResizeStart = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsResizing(true);
	};

	const handleResize = (e: React.MouseEvent) => {
		if (isResizing) {
			const deltaX = e.movementX;
			const deltaY = e.movementY;

			setCurrentSize((prevSize) => ({
				width: prevSize.width + deltaX,
				height: prevSize.height + deltaY,
			}));

			onResize(deltaX, deltaY, true);
		}
	};

	const handleResizeEnd = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsResizing(false);
		onResize(0, 0, false);
	};

	// Click handler for selecting an element
	const handleSelect = (e: React.MouseEvent) => {
		setActiveElement(id);
		e.stopPropagation();
	};

	if (base === "web-canvas") {
		return (
			<g
				onClick={handleSelect}
				onMouseMove={handleResize}
				onMouseUp={handleResizeEnd}
				style={{ cursor: "pointer" }}>
				{/* Main SVG Rect for dragging */}
				<rect
					ref={setNodeRef}
					{...listeners} // Attach drag listeners
					{...attributes} // Attach drag attributes
					x={draggedX}
					y={draggedY}
					width={currentSize.width}
					height={currentSize.height}
					fill="lightgrey"
					stroke={activeElement === id ? "#0984e3" : "black"}
					strokeWidth={activeElement === id ? 3 : 1}
				/>

				{/* Resizable Handle */}
				{activeElement === id && (
					<rect
						x={draggedX + currentSize.width - 10}
						y={draggedY + currentSize.height - 10}
						width={10}
						height={10}
						fill="blue"
						style={{ cursor: "nwse-resize" }}
						onMouseDown={handleResizeStart}
					/>
				)}
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
