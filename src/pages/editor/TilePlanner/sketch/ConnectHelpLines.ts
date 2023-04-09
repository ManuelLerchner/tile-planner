import { P5CanvasInstance } from "react-p5-wrapper";
import { InterfaceData } from "../TilePlanner";
import { MouseData } from "../Window/Mouse";
import { toScreenPos } from "../Window/UnitConverter";
import { Vector } from "p5";
import { rayIntersectsLine } from "../math/lineIntersection";
import { Edge } from "../data/DBConverter";

export function connectHelpLines(p5: P5CanvasInstance) {
  const { selectedPoint, markerMode, drawLength } = InterfaceData;
  if (!selectedPoint) return;

  const { mouseScreenPos, mouseGamePos } = MouseData;

  const startPoint = toScreenPos(selectedPoint);

  //draw line to mouse
  p5.stroke(255, 0, 0);
  p5.strokeWeight(1);
  p5.line(startPoint.x, startPoint.y, mouseScreenPos.x, mouseScreenPos.y);
}
