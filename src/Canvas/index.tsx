import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import "./styles.css";

import {
	Base,
	Tool,
	CanvasObject,
	FullSizeCanvas,
	CustomSizeCanvas,
} from "./types";
import Draggable from "./Draggable";
import ZoomControl from "./Tools/ZoomControl";
import Droppable from "./Droppable";

interface CanvasDefaultProps {
	base: Base;
	tools?: Tool[];
	maxZoom?: number;
	minZoom?: number;
	enableZoom?: boolean;
	zoomControls?: boolean;
	elements: CanvasObject[];
}

type ZoomEvent = { transform: Transform };
type Transform = { x: number; y: number; k: number };
type CanvasProps = CanvasDefaultProps & (FullSizeCanvas | CustomSizeCanvas);

export default function Canvas(props: CanvasProps) {
	const {
		tools = [],
		minZoom = 1,
		maxZoom = 10,
		base = "web-div",
		enableZoom = true,
		zoomControls = false,
	} = props;

	const [activeElement, setActiveElement] = useState<string | null>(null);
	const [elements, setElements] = useState<CanvasObject[]>(props.elements);
	const [transform, setTransform] = useState<Transform>({ k: 1, x: 0, y: 0 });
	const [draggedElement, setDraggedElement] = useState<CanvasObject | null>(
		null
	);
	const [resizingElement, setResizingElement] = useState<CanvasObject | null>(
		null
	);
	const [initialPointerPosition, setInitialPointerPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [resizeDirection, setResizeDirection] = useState<
		"right" | "bottom" | "corner" | null
	>(null);

	const canvasWidth = props.canvasSize === "full" ? "100%" : props.width;
	const canvasHeight = props.canvasSize === "full" ? "100%" : props.height;

	const zoomBehavior = useMemo(
		() => zoom<HTMLDivElement, unknown>().scaleExtent([minZoom, maxZoom]),
		[minZoom, maxZoom]
	);

	const updateTransform = useCallback(
		({ transform }: ZoomEvent) => {
			setTransform(transform);
		},
		[setTransform]
	);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const divRef = useRef<HTMLDivElement | null>(null);

	// Handle drawing on the canvas when base is 'web-canvas'
	useEffect(() => {
		if (base === "web-canvas" && canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
				ctx.save();
				ctx.translate(transform.x, transform.y);
				ctx.scale(transform.k, transform.k);

				// Draw each element on the canvas
				elements.forEach((element) => {
					ctx.fillStyle = "lightgrey";
					ctx.fillRect(element.x, element.y, element.width, element.height);
					ctx.strokeRect(element.x, element.y, element.width, element.height);

					// Draw resize handles
					drawResizeHandles(ctx, element);
				});

				ctx.restore();
			}
		}
	}, [elements, transform, base]);

	// Draw resize handles on each element
	const drawResizeHandles = (
		ctx: CanvasRenderingContext2D,
		element: CanvasObject
	) => {
		ctx.fillStyle = "blue";
		const handleSize = 8;

		// Right handle
		ctx.fillRect(
			element.x + element.width - handleSize / 2,
			element.y + element.height / 2 - handleSize / 2,
			handleSize,
			handleSize
		);

		// Bottom handle
		ctx.fillRect(
			element.x + element.width / 2 - handleSize / 2,
			element.y + element.height - handleSize / 2,
			handleSize,
			handleSize
		);

		// Corner handle (bottom-right)
		ctx.fillRect(
			element.x + element.width - handleSize / 2,
			element.y + element.height - handleSize / 2,
			handleSize,
			handleSize
		);
	};

	useEffect(() => {
		if (enableZoom) {
			zoomBehavior.on("zoom", updateTransform);
			const selection =
				base === "web-div" ? select(divRef.current) : select(canvasRef.current);
			selection.call(zoomBehavior);
		}
	}, [enableZoom, zoomBehavior, updateTransform, base]);

	const onZoomIn = () => {
		const selection =
			base === "web-div" ? select(divRef.current) : select(canvasRef.current);
		selection.call(zoomBehavior.scaleBy, 2);
	};

	const onZoomOut = () => {
		const selection =
			base === "web-div" ? select(divRef.current) : select(canvasRef.current);
		selection.call(zoomBehavior.scaleBy, 0.5);
	};

	const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (base !== "web-canvas" || !canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left - transform.x) / transform.k;
		const y = (e.clientY - rect.top - transform.y) / transform.k;

		// Check if clicked on resize handles
		const element = elements.find(
			(el) =>
				x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
		);

		if (element) {
			const handleSize = 8;

			// Detect which handle was clicked
			const clickedRightHandle =
				x >= element.x + element.width - handleSize / 2 &&
				y >= element.y + element.height / 2 - handleSize / 2 &&
				y <= element.y + element.height / 2 + handleSize / 2;
			const clickedBottomHandle =
				y >= element.y + element.height - handleSize / 2 &&
				x >= element.x + element.width / 2 - handleSize / 2 &&
				x <= element.x + element.width / 2 + handleSize / 2;
			const clickedCornerHandle =
				x >= element.x + element.width - handleSize / 2 &&
				y >= element.y + element.height - handleSize / 2;

			if (clickedRightHandle || clickedBottomHandle || clickedCornerHandle) {
				setResizingElement(element);
				setResizeDirection(
					clickedCornerHandle
						? "corner"
						: clickedRightHandle
						? "right"
						: "bottom"
				);
				setInitialPointerPosition({ x: e.clientX, y: e.clientY });
			} else {
				// If not resizing, treat as dragging
				setDraggedElement(element);
				setInitialPointerPosition({ x: e.clientX, y: e.clientY });
				setActiveElement(element.id);
			}
		}
	};

	const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (resizingElement && initialPointerPosition && resizeDirection) {
			// Handle resizing logic
			const dx = (e.clientX - initialPointerPosition.x) / transform.k;
			const dy = (e.clientY - initialPointerPosition.y) / transform.k;

			if (resizeDirection === "right" || resizeDirection === "corner") {
				resizingElement.width += dx;
			}
			if (resizeDirection === "bottom" || resizeDirection === "corner") {
				resizingElement.height += dy;
			}

			setInitialPointerPosition({ x: e.clientX, y: e.clientY });
			setElements([...elements]);
		} else if (draggedElement && initialPointerPosition) {
			// Handle dragging logic
			const dx = (e.clientX - initialPointerPosition.x) / transform.k;
			const dy = (e.clientY - initialPointerPosition.y) / transform.k;

			draggedElement.x += dx;
			draggedElement.y += dy;

			setInitialPointerPosition({ x: e.clientX, y: e.clientY });
			setElements([...elements]);
		}
	};

	const onPointerUp = () => {
		setDraggedElement(null);
		setResizingElement(null);
		setInitialPointerPosition(null);
		setResizeDirection(null);
	};

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			const id = event.active.id;
			const element = elements.find((element) => element.id === id);
			if (element) {
				element.x += event.delta.x;
				element.y += event.delta.y;
				setElements([...elements]);
			}
		},
		[elements]
	);

	return (
		<DndContext onDragEnd={onDragEnd}>
			{base === "web-div" ? (
				<Droppable
					id="canvas"
					style={{
						width: canvasWidth,
						height: canvasHeight,
					}}>
					<div
						ref={divRef}
						style={{
							width: canvasWidth,
							height: canvasHeight,
						}}
						className="canvasWrapper"
						onClick={() => {
							setActiveElement(null);
						}}>
						{enableZoom && zoomControls && (
							<ZoomControl onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
						)}
						<div
							className="zoomablePannableArea"
							style={{
								width: canvasWidth,
								height: canvasHeight,
								transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
							}}>
							{elements.map((element) => (
								<Draggable
									key={element.id}
									canvasObject={element}
									activeElement={activeElement}
									setActiveElement={setActiveElement}
								/>
							))}
						</div>
					</div>
				</Droppable>
			) : (
				<svg
					width={canvasWidth === "100%" ? window.innerWidth : canvasWidth}
					height={canvasHeight === "100%" ? window.innerHeight : canvasHeight}
					className="canvasWrapper">
					<foreignObject x="0" y="0" width="100%" height="100%">
						<canvas
							ref={canvasRef}
							width={canvasWidth === "100%" ? window.innerWidth : canvasWidth}
							height={
								canvasHeight === "100%" ? window.innerHeight : canvasHeight
							}
							className="zoomablePannableArea"
							onClick={() => setActiveElement(null)}
							onPointerDown={onPointerDown}
							onPointerMove={onPointerMove}
							onPointerUp={onPointerUp}
						/>
					</foreignObject>
				</svg>
			)}
			{enableZoom && zoomControls && (
				<ZoomControl onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
			)}
		</DndContext>
	);
}
