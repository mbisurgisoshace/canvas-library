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

	// Apply transform to current position if dragging
	const draggedX = transform ? x + transform.x : x;
	const draggedY = transform ? y + transform.y : y;

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
					width={width}
					height={height}
					fill="lightgrey"
					stroke={activeElement === id ? "#0984e3" : "black"}
					strokeWidth={activeElement === id ? 3 : 1}
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
