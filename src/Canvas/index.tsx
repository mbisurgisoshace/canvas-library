import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useState, useCallback } from "react";

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
import { Resizable } from "re-resizable";

interface CanvasDefaultProps {
	base: Base;
	tools?: Tool[];
	maxZoom?: number;
	minZoom?: number;
	enableZoom?: boolean;
	zoomControls?: boolean;
	elements: CanvasObject[];
}

type ZoomEvent = { transform: Transform; sourceEvent: React.MouseEvent };
type Transform = { x: number; y: number; k: number };
type CanvasProps = CanvasDefaultProps & (FullSizeCanvas | CustomSizeCanvas);

export default function Canvas(props: CanvasProps) {
	const {
		tools = [],
		minZoom = 1,
		maxZoom = 10,
		base = "web-canvas",
		enableZoom = true,
		zoomControls = false,
	} = props;

	const [activeElement, setActiveElement] = useState<string | null>(null);
	const [elements, setElements] = useState<CanvasObject[]>(props.elements);
	const [transform, setTransform] = useState<Transform>({ k: 1, x: 0, y: 0 });
	const [currentResizeDelta, setCurrentResizeDelta] = useState({ x: 0, y: 0 });

	const canvasWidth = props.canvasSize === "full" ? "100%" : props.width;
	const canvasHeight = props.canvasSize === "full" ? "100%" : props.height;

	const zoomBehavior = useMemo(
		() =>
			zoom<SVGSVGElement | HTMLDivElement, unknown>().scaleExtent([
				minZoom,
				maxZoom,
			]),
		[minZoom, maxZoom]
	);

	const updateTransform = useCallback(
		({ transform }: ZoomEvent) => {
			setTransform(transform);
		},
		[setTransform]
	);

	useEffect(() => {
		if (enableZoom) {
			zoomBehavior
				.filter((e) => {
					const isResizeHandle = (
						e.target as HTMLDivElement
					).offsetParent?.className.includes("resizable");

					return !isResizeHandle;
				})
				.on("zoom", (event) => {
					const { transform } = event;
					updateTransform({
						transform,
						sourceEvent: event.sourceEvent as React.MouseEvent,
					});
				});

			const selection =
				base === "web-div"
					? select<HTMLDivElement, unknown>(".canvasWrapper")
					: select<SVGSVGElement, unknown>(".canvasSVGWrapper");

			selection.call(zoomBehavior);
		}
	}, [enableZoom, zoomBehavior, updateTransform, base]);

	const onZoomIn = () => {
		const selection =
			base === "web-div"
				? select<HTMLDivElement, unknown>(".canvasWrapper")
				: select<SVGSVGElement, unknown>(".canvasSVGWrapper");

		selection.call(zoomBehavior.scaleBy, 2);
	};

	const onZoomOut = () => {
		const selection =
			base === "web-div"
				? select<HTMLDivElement, unknown>(".canvasWrapper")
				: select<SVGSVGElement, unknown>(".canvasSVGWrapper");

		selection.call(zoomBehavior.scaleBy, 0.5);
	};

	/**
	 * Rendering will changed based on the base prop.
	 *    - web-div: Render the canvas using a div element
	 *    - web-canvas: Render the canvas using the canvas element and the canvas API
	 */

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

	const onResize = useCallback(
		(deltaX: number, deltaY: number, resizing: boolean) => {
			const id = activeElement;

			if (!resizing) {
				setCurrentResizeDelta({ x: 0, y: 0 });
				return;
			}

			if (!id) return;
			const element = elements.find((element) => element.id === id);

			if (element) {
				element.width += deltaX - currentResizeDelta.x;
				element.height += deltaY - currentResizeDelta.y;
				setElements([...elements]);
				setCurrentResizeDelta({ x: deltaX, y: deltaY });
			}
		},
		[elements, activeElement, currentResizeDelta]
	);

	/**
	 * Rendering will changed based on the base prop.
	 *    - web-div: Render the canvas using a div element
	 *    - web-canvas: Render the canvas using the canvas element and the canvas API
	 */

	return (
		<DndContext onDragEnd={onDragEnd}>
			<Droppable
				id="canvas"
				style={{
					width: canvasWidth,
					height: canvasHeight,
				}}>
				{base === "web-div" ? (
					<div
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
									onResize={onResize}
									canvasObject={element}
									activeElement={activeElement}
									setActiveElement={setActiveElement}
									base={base}
								/>
							))}
						</div>
					</div>
				) : (
					<svg
						className="canvasSVGWrapper"
						width={canvasWidth}
						height={canvasHeight}
						onClick={() => setActiveElement(null)}
						style={{ border: "1px solid black" }} // Debugging border
					>
						{enableZoom && zoomControls && (
							<foreignObject x={10} y={10} width={50} height={50}>
								<ZoomControl onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
							</foreignObject>
						)}
						<g
							className="zoomablePannableArea"
							transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
							{/* Debugging with simple rect elements */}
							{elements.map((element) => (
								// <rect
								// 	key={element.id}
								// 	x={element.x}
								// 	y={element.y}
								// 	width={element.width}
								// 	height={element.height}
								// 	fill="lightgrey"
								// 	stroke="black"
								// 	strokeWidth="2"
								// />
								<Draggable
									key={element.id}
									onResize={onResize}
									canvasObject={element}
									activeElement={activeElement}
									setActiveElement={setActiveElement}
									base={base}
								/>
							))}
						</g>
					</svg>
				)}
			</Droppable>
		</DndContext>
	);
}
