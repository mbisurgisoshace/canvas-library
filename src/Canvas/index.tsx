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
	const [initialPointerPosition, setInitialPointerPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

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
				});

				ctx.restore();
			}
		}
	}, [elements, transform, base]);

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

		const clickedElement = elements.find(
			(el) =>
				x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
		);

		if (clickedElement) {
			setDraggedElement(clickedElement);
			setInitialPointerPosition({ x: e.clientX, y: e.clientY });
			setActiveElement(clickedElement.id);
		}
	};

	const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!draggedElement || !initialPointerPosition || !canvasRef.current)
			return;

		const dx = (e.clientX - initialPointerPosition.x) / transform.k;
		const dy = (e.clientY - initialPointerPosition.y) / transform.k;

		draggedElement.x += dx;
		draggedElement.y += dy;

		setInitialPointerPosition({ x: e.clientX, y: e.clientY });
		setElements([...elements]);
	};

	const onPointerUp = () => {
		setDraggedElement(null);
		setInitialPointerPosition(null);
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
